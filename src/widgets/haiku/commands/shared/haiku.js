const syllableCount = require('../../helpers/syllableCount');

function pluralizer(number) {
  switch (number.toString()) {
    case '1':
      return '';
    default:
      return 's';
  }
};

function pauseHaiku(message, minutes, isInteraction) {
  let config = message.client.getConfig('haiku');
  let time = Number(minutes) * 60 * 1000;
  if (Number.isNaN(time)) time = config.defaultPauseTime * 60 * 1000;

  if (
    config.active &&
    !config.ignoredChannels.has(message.channel.id) &&
    !message.client.getConfig().ignoredChannels.has(message.channel.id)
  ) {
    config.tempChannels.add(message.channel.id);
    message.client.setConfig(config);
    message.reply(`Haiku paused in this channel for ${parseInt(time/(60*1000))} minutes`);
    if (!isInteraction) message.react('🤐');
    //console.log(`haiku paused in ${chName}`);

    setTimeout( () => {
      config = message.client.getConfig('haiku');
      config.tempChannels.delete(message.channel.id);
      message.client.setConfig(config);

      const unpauseText = 'Haiku are now unpaused in this channel';
      if (isInteraction) message.followUp(unpauseText);
      else message.reply(unpauseText);
      //console.log(`haiku timeout over in ${chName}`)
    }, time);
  }
}

function unPauseHaiku(message, isInteraction) {
  let config = message.client.getConfig('haiku');
  if (
    config.active &&
    config.tempChannels.has(message.channel.id)
  ) {
    config.tempChannels.delete(message.channel.id);
    message.client.setConfig(config);
    if (!isInteraction) message.react('📣');
    message.reply('Haiku unpaused in this channel');
    //console.log(`haiku unpaused in ${chName}`);
  }
}

function countSyllables(message, words) {
  let wordSylList = [];
  for (const word of words) {
    const sylCount = syllableCount(word.replace(/[^0-9a-zA-Z]/g,''));
    wordSylList.push(`${word} has ${sylCount} syllable${pluralizer(sylCount)}`);
  }
  message.reply({content: wordSylList.join('\n')});
}

module.exports = {
  pause: (message, minutes, isInteraction) => pauseHaiku(message,minutes,isInteraction),
  unpause: (message, isInteraction) => unPauseHaiku(message, isInteraction),
  count: (message, words) => countSyllables(message, words),
}
