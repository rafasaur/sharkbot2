//  message.js (haiku)
// checks if haiku should be attempted on a message, then attemps haiku

const config = require('../haiku-config');
const frequency = Math.min(Math.abs(config.frequency), 1) || 1;
const Haiku = require('../classes/Haiku');

module.exports = async (message) => {
  if (
    !config.active ||
    message.author.bot ||
    message.client.config.ignoredChannels.has(message.channel.id) ||
    message.client.widgets.haiku.ignoredChannels.has(message.channel.id) ||
    message.client.widgets.haiku.tempChannels.has(message.channel.id) ||
    (
      Math.random() > frequency &&
      message.channel.type !== 'dm' &&
      !message.client.widgets.haiku.alwaysChannels.has(message.channel.id)
    )
  ) return;

  const haiku = new Haiku(message);
  if (haiku.isHaiku) haiku.sendHaiku();
}
