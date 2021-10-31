
module.exports = async (client) => {

  const config = client.getConfig('haiku');

  if (config.archiveChannel.length > 0) config.ignoredChannels.add(config.archiveChannel);
  config.tempChannels = new Set();
  client.setConfig(config);

  client.logReady(`haiku`);
};
