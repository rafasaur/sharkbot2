module.exports = async (client) => {

  require("../helpers/loadPrefixRegExp")(client);
  require("../helpers/loadCommands")(client);
  require("../helpers/extendMessage")();
  require("../helpers/extendUser")(client);
  require("../helpers/extendGuildMember")();

  await require("../helpers/loadSlashCommands")(client);

  client.logReady('command');
};
