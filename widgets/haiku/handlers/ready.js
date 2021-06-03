const config = require('../haiku-config.js');

module.exports = async (client) => {
  console.log(`haiku:\t\tready`);

  config.ignoredChannels.forEach(chId => client.widgets.haiku.ignoredChannels.add(chId));
  if (config.archiveChannel.length > 0) client.widgets.haiku.ignoredChannels.add(config.archiveChannel);
  config.alwaysChannels.forEach(chId => client.widgets.haiku.alwaysChannels.add(chId));
  client.widgets.haiku.tempChannels = new Set();
};
