module.exports = async (client) => {

  client.commands = {};

  require("../helpers/loadPrefixRegExp")(client);
  require("../helpers/loadTextCommands")(client);
  require("../helpers/extendMessage")();
  require("../helpers/extendUser")(client);
  require("../helpers/extendGuildMember")();

  await require("../helpers/loadSlashCommands")(client);

  client.logReady('command');
};
