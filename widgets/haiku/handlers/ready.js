const config = require(`../haiku-config`);

module.exports = async (client) => {
  console.log(`haikus:\t\tready`);

  config.ignoredChannels.forEach(chId => client.widgets.haiku.ignoredChannels.add(chId));
  if (config.archiveChannelId.length > 0) client.widgets.haiku.ignoredChannels.add(config.archiveChannelId);
  config.alwaysChannels.forEach(chId => client.widgets.haiku.alwaysChannels.add(chId));
  client.widgets.haiku.tempChannels = new Set();
};
