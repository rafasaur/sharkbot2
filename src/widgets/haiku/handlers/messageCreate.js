//  message.js (haiku)
// checks if haiku should be attempted on a message, then attemps haiku

const Haiku = require('../classes/Haiku');

module.exports = async (message) => {
  const config = message.client.getConfig('haiku');
  const frequency = Math.min(Math.abs(config.frequency), 1) || 1;
  if (
    !config.active ||
    message.author.bot ||
    message.client.getConfig().ignoredChannels.has(message.channel.id) ||
    config.ignoredChannels.has(message.channel.id) ||
    config.tempChannels.has(message.channel.id) ||
    (
      Math.random() > frequency &&
      message.channel.type !== 'dm' &&
      !config.alwaysChannels.has(message.channel.id)
    )
  ) return;

  const haiku = new Haiku(message);
  if (haiku.isHaiku) haiku.sendHaiku();
}
