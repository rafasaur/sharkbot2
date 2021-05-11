// haiku.js
// commands to accompany haiku widget (pause, unpause, syllables)

const syllable = require(`syllable`);
const CommandBuilder = require("../../command/classes/CommandBuilder");
const config = require('../haiku-config.js');
//const defaultIgnoredChannels = require('../../../config').widgets.haiku.ignoredChannels;
//config.ignoredChannels.forEach( chid => defaultIgnoredChannels.add(chid) );

const pluralizer = (number) => {
  switch (number.toString()) {
    case '1':
      return '';
    default:
      return 's';
  }
};

module.exports = new CommandBuilder()
  .setName("haiku")
  .setAliases(['h'])
  .setOwnersOnly(false)
  .setGuildOnly(false)
  .setRequireArgs(true)
  .setDeletable(false)
  .setCooldown(10)
  .setDisabled(false)
  // eslint-disable-next-line
  .setExecute(async (message, user, args) => {
    const arg0 = args.shift();
    const chName = message.isFromTextChannel() ? `${message.channel.name}` : `${message.author.tag}'s DM`
    const defIgnoredChannels = message.client.widgets.haiku.ignoredChannels;

    // pause haiku in a channel
    if (['pause','p','stop','off'].includes(arg0)) {
      let time = Number(args[0]) * 60 * 1000;
      if (Number.isNaN(time)) time = 10 * 60 * 1000;
      if ( !config.active || !message.client.widgets.haiku.active ||
        defIgnoredChannels.has(message.channel.id)) return;
      message.react('🤐');
      message.client.widgets.haiku.tempChannels.add(message.channel.id);
      console.log(`haiku paused in ${chName}`)
      setTimeout( () => {
        message.client.widgets.haiku.tempChannels.delete(message.channel.id);
        console.log(`haiku timeout over in ${chName}`)
      }, time);
    }

    // unpause a haiku in a channel (can't unpause hardcoded channels)
    else if (['unpause','go','on'].includes(arg0)) {
      if (
        config.active && message.client.widgets.haiku.active
        //&& !defIgnoredChannels.has(message.channel.id)
      ) {
        message.react('📣');
        message.client.widgets.haiku.tempChannels.delete(message.channel.id);
        console.log(`haiku unpaused in ${chName}`)
      }
    }

    // count syllables of words (debugger)
    else if (['syllables','syllable','syl','s'].includes(arg0)) {
      let wordSylList = [];
      for (const word of args) {
        const sylCount = syllable(word.replace(/[^0-9a-zA-Z]/g,''));
        wordSylList.push(`${word} has ${sylCount} syllable${pluralizer(sylCount)}`);
      }
      message.reply(wordSylList.join('\n'));
    }
  });
