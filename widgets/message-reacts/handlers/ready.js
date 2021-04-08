module.exports = (client) => {
  console.log("message-reacts:\tready");
  client.emoji = require('../message-reacts-config').emoji;
}
