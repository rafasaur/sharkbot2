//const syllable = require(`syllable`);
const CommandBuilder = require("../../../command/classes/CommandBuilder");
const haikuHelpers = require('../shared/haiku');

/*
function pluralizer(number) {
  switch (number.toString()) {
    case '1':
      return '';
    default:
      return 's';
  }
};

function pauseHaiku(message, config, minutes) {
  let time = Number(minutes) * 60 * 1000;
  if (Number.isNaN(time)) time = 10 * 60 * 1000;
  if (
    config.active &&
    !config.ignoredChannels.has(message.channel.id) &&
    !message.client.getConfig().has(message.channel.id)
  ) {
    message.react('🤐');
    config.tempChannels.add(message.channel.id);
    message.client.setConfig(config);
    console.log(`haiku paused in ${chName}`);
    setTimeout( () => {
      config.tempChannels.delete(message.channel.id);
      message.client.setConfig(config);
      console.log(`haiku timeout over in ${chName}`)
    }, time);
  }
}

function unPauseHaiku(message,config) {
  if (
    config.active &&
    config.tempChannels.has(message.channel.id)
  ) {
    message.react('📣');
    config.tempChannels.delete(message.channel.id);
    message.client.setConfig(config);
    console.log(`haiku unpaused in ${chName}`);
  }
}

function countSyllables(message, words) {
  let wordSylList = [];
  for (const word of words) {
    const sylCount = syllable(word.replace(/[^0-9a-zA-Z]/g,''));
    wordSylList.push(`${word} has ${sylCount} syllable${pluralizer(sylCount)}`);
  }
  message.reply({content: wordSylList.join('\n')});
}
*/

module.exports = new CommandBuilder()
  .setName("haiku")
  .setAliases(['h'])
  .setOwnersOnly(false)
  .setGuildOnly(false)
  .setRequireArgs(true)
  .setDeletable(false)
  .setCooldown(10)
  .setDisabled(false)
  .setExecute(async (message, user, args) => {
    const config = message.client.getConfig('haiku');
    const arg0 = args.shift();
    const chName = message.isFromGuildChannel() ? `${message.channel.name}` : `${message.author.tag}'s DM`

    // pause haiku in a channel
    if (['pause','p','stop','off'].includes(arg0)) {
      haikuHelpers.pause(message, args[0], false);
    }

    // unpause a haiku in a channel (can't unpause hardcoded channels)
    else if (['unpause','u','go','on'].includes(arg0)) {
      haikuHelpers.unpause(message, false);
    }

    // count syllables of words (debugger)
    else if (['syllables','syllable','syl','s'].includes(arg0)) {
      haikuHelpers.count(message, args);
    }
  })

  .setHelp(async (message, user, args) => {
    return await message.reply({content:
      `\`haiku pause\` or \`haiku unpause\` in the channel in which they're called.`
    });
  })
