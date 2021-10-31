module.exports = async (client) => {

  require('../helpers/loadLvlExp')(client);

  client.logReady(`levels`);
};
