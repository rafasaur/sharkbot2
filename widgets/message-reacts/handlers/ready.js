module.exports = (client) => {
  console.log("message-reacts:\tready");
  require(`../helpers/loadReactExt`)(client);
  client.emoji = require('../message-reacts-config').emoji;
}
