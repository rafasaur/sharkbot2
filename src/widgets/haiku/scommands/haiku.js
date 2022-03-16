const SyllaRhyme = require('syllarhyme');
const SlashBuilderPlus = require("../../command/classes/SlashBuilderPlus");

function pluralizer(number) {
  switch (number.toString()) {
    case '1':
      return '';
    default:
      return 's';
  }
};

function pauseHaiku(interaction, config, minutes) {
  let time = Number(minutes) * 60 * 1000;
  if (Number.isNaN(time)) time = 15 * 60 * 1000;
  if (
    config.active &&
    !config.ignoredChannels.has(interaction.channel.id) &&
    !interaction.client.getConfig().ignoredChannels.has(interaction.channel.id)
  ) {
    interaction.reply(`Haiku are paused in this channel for ${parseInt(time/(60*1000))} minutes`)
    config.tempChannels.add(interaction.channel.id);
    interaction.client.setConfig(config);
    console.log(`haiku paused in ${interaction.channel.name}`);
    setTimeout( () => {
      config.tempChannels.delete(interaction.channel.id);
      interaction.client.setConfig(config);
      interaction.followUp(`Haiku are now unpaused in this channel`);
      console.log(`haiku timeout over in ${interaction.channel.name}`)
    }, time);
  }
}

function unPauseHaiku(interaction,config) {
  if (
    config.active &&
    config.tempChannels.has(interaction.channel.id)
  ) {
    config.tempChannels.delete(interaction.channel.id);
    interaction.client.setConfig(config);
    interaction.reply(`Haiku are unpaused in this channel`)
    console.log(`haiku unpaused in ${interaction.channel.name}`);
  }
}

function countSyllables(interaction, words) {
  /*let wordSylList = [];
  for (const word of words) {
    const sylCount = syllable(word.replace(/[^0-9a-zA-Z]/g,''));
    wordSylList.push(`${word} has ${sylCount} syllable${pluralizer(sylCount)}`);
  }*/

  let syllCount = SyllaRhyme.sr.syllables(words);
  interaction.reply({content: `"\*${words}\*" has ${syllCount} syllable${pluralizer(syllCount)}`});
}


module.exports = {
  data: new SlashBuilderPlus()
    .setName('haiku')
    .setDescription('Interact with the haiku function')
    .setPushOption('global')
    .addSubcommandGroup(subgroup =>
      subgroup.setName('pause')
        .setDescription('Pause or unpause haiku creation in this channel')
        .addSubcommand(subcommand =>
          subcommand.setName('pause')
            .setDescription('Pause haiku creation in this channel')
            .addIntegerOption(option =>
              option.setName('minutes')
                .setDescription('Number of minutes to pause (WHOLE NUMBER) (default is 15)')
                .setRequired(false)
            )
        )
        .addSubcommand(subcommand =>
          subcommand.setName('unpause')
            .setDescription('Unpause haiku creation in this channel')
        )
    )
    .addSubcommand(command =>
      command.setName('count')
        .setDescription('Count the number of syllables a word or phrase has!')
        .addStringOption(option =>
          option.setName('phrase')
            .setDescription('Word or phrase for syllable counting')
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    const config = interaction.client.getConfig('haiku');

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'pause') {
      let minutes = interaction.options.getInteger('minutes');
      if (!minutes || minutes <= 0) minutes = 15;
      pauseHaiku(interaction, config, minutes);
    }

    else if (subcommand === 'unpause') {
      unPauseHaiku(interaction, config);
    }

    else if (subcommand === 'count') {
      const syllPhrase = interaction.options.getString('phrase');
      if (!syllPhrase) {
        interaction.reply({ content: `You need to enter a word or phrase!`, ephemeral:true});
        return;
      }
      countSyllables(interaction, syllPhrase);
    }

    return;
  }
}
