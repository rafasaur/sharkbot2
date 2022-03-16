module.exports = async (client) => {

  require('../helpers/extendGuildMember')(client);

  client.logReady(`levels`);
};
