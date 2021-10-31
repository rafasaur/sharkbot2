module.exports = async (client) => {

  require("../helpers/loadPrefixRegExp")(client);
  require("../helpers/loadCommands")(client);
  require("../helpers/loadMessageHelpers")();
  require("../helpers/loadUserHelpers")(client);
  require("../helpers/loadMemberHelpers")();

  client.logReady('command');
};
