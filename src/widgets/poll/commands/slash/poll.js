const SlashBuilderPlus = require("../../../command/classes/SlashBuilderPlus");
const config = require("../../../../../.configs/poll");

async function makePoll(interaction, title, options, timer) {
  // setup
  let content = [];
  let delay = false;
  let reactArray = [];

  // first line will always be the poll "title"
  content.push(title);

  // if a timer is set, add a note after the title & set up delay for later
  if (timer && timer > 0) {
    if (timer > 15) delay = 15;
    else delay = timer;
    content[0] += ` [this poll will be "active" for ${delay} minutes]`
    delay *= 60 * 1000;
  }

  // options of "yesno" or "maybe" is a yes-no-maybe type poll and uses ynmEmoji
  if (typeof options === 'string') {
    reactArray.push(config.ynmEmoji[0]);
    reactArray.push(config.ynmEmoji[1]);
    if (options === 'maybe') reactArray.push(config.ynmEmoji[2])
  }

  // otherwise options is an array of string options
  // zeroth option needs ">>> " prepended for nicer formatting in Discord
  // only adding relevant emoji here for ease later
  else {
    reactArray.push(config.optionEmoji[0]);
    content.push(`>>> ${reactArray[0]}: ` + options[0]);
    for (let i=1; i<options.length; i++) {
      reactArray.push(config.optionEmoji[i]);
      content.push(`${reactArray[i]}: ` + options[i]);
    }
  }

  // send formatted content
  await interaction.reply(content.join('\n'));

  // react to message with proper emoji
  let reactCounts = {};
  const message = await interaction.fetchReply();
  reactArray.forEach(async (emoji) => {
    reactCounts[emoji] = [];
    await message.react(emoji);
  });

  // if a timer was set, follow up after the specified time with the "winner"
  if (delay) {
    setTimeout( async () => {
      let maxIndex = 0; let maxCount = 0;
      // simple search for reaction with highest count (poll type agnostic)
      for (let i=0; i<reactArray.length; i++) {
        if (message.reactions.cache.get(reactArray[i]) > maxCount) {
          maxIndex = i; maxCount = message.reactions.cache.get(reactArray[i]);
        }
      }
      // gonna set up the text for the follow up post in a different(?) way
      let followUpText = ['The winner of the poll is', '', `with ${maxCount-1} votes!`];
      let joiner = '';
      // if yes-no type poll, "The winner of the poll is YES/NO/MAYBE with n votes!"
      if (typeof options === 'string') {
        followUpText[2] = ["**YES**", "**NO**", "**MAYBE**"][maxIndex];
        joiner = ' ';
      }
      // if choices type poll, "The winner of the poll is \n> whatever\n with n votes!"
      else {
        followUpText[1] = '> ' + options[maxIndex];
        joiner = '\n';
      }
      await interaction.followUp(followUpText.join(joiner));

      // and edit the original post to remove the timer
      content[0] = title + ` [this poll has ended!]`;
      await interaction.editReply(content.join('\n'));
      // finally DM the OP with results (if option selected in config)
      if (config.ccToDM) await interaction.user.send(followUpText.join(joiner));
    }, delay);
  }
}

module.exports = {
  data: new SlashBuilderPlus()
    .setName('poll')
    .setDescription('Create a poll!')
    .setPushOption('global')
    .addSubcommand(subcommand => {
      subcommand
        .setName('options')
        .setDescription(`Create a poll with 2-${config.maxNumOptions} options`)
        .addStringOption(option =>
          option
            .setName('title')
            .setDescription('Poll title/question')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('option1')
            .setDescription('1st poll option')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('option2')
            .setDescription('2nd poll option')
            .setRequired(true)
        );
      for (i=2; i<config.maxNumOptions; i++) {
        subcommand.addStringOption(option =>
          option
            .setName(`option${i+1}`)
            .setDescription(`${i+1}th poll option`)
            .setRequired(false)
        )
      }
        /*
        .addStringOption(option =>
          option
            .setName('option 3')
            .setDescription('Third poll option')
            .setRequired(false)
        )
        .addStringOption(option =>
          option
            .setName('option 4')
            .setDescription('Fourth poll option')
            .setRequired(false)
        )
        .addStringOption(option =>
          option
            .setName('option 5')
            .setDescription('Fifth poll option')
            .setRequired(false)
        )
        */
      subcommand.addIntegerOption(option =>
        option
          .setName('timer')
          .setDescription('Add a timer to your poll, in minutes (off by default, must be <15)')
          .setRequired(false)
      )
      return subcommand;
    })
    .addSubcommand(subcommand =>
      subcommand
        .setName('yes-no')
        .setDescription('Create a yes/no(/maybe) poll')
        .addStringOption(option =>
          option
            .setName('title')
            .setDescription('Poll title/question')
            .setRequired(true)
        )
        .addBooleanOption(option =>
          option
            .setName('maybe')
            .setDescription('Include a maybe option? (default FALSE)')
            .setRequired(false)
        )
        .addIntegerOption(option =>
          option
            .setName('timer')
            .setDescription('Add a timer to your poll, in minutes (off by default, must be <15)')
            .setRequired(false)
        )
    ),
  async execute(interaction) {

    const subcommand = interaction.options.getSubcommand();

    const title = interaction.options.getString('title');
    let timer = interaction.options.getInteger('timer');
    if (timer < 0) timer = false;
    else if (timer > 15) timer = 14;

    let pollOption;

    // if options type poll selected, add all options to an array
    if (subcommand === 'options') {
      pollOption = [];
      for (let i=0; i<config.maxNumOptions; i++) {
        let thisOption = interaction.options.getString(`option${i+1}`);
        if (!thisOption || thisOption.length <= 0) return;
        pollOption.push(thisOption);
      }
    }
    // if yes/no type poll selected, signify if "maybe" option requested
    else if (subcommand === 'yes/no') {
      pollOption = 'yesno';
      if (interaction.options.getBoolean('maybe')) pollOption = 'maybe';
    }
    // create the poll!
    return await makePoll(interaction, title, postType, timer);
  }
}
