
module.exports = async (client) => {
  require("../helpers/loadMessageExpansion")();

  client.logReady(`log`);
}
