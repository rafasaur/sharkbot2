const CommandBuilder = require("../../command/classes/CommandBuilder");
const {botAnnounceChId} = require("../command-config");

module.exports = new CommandBuilder()
  .setName("post")
  .setOwnersOnly(true)
  .setGuildOnly(false)
  .setRequireArgs(false)
  .setDeletable(false)
  .setCooldown(10)
  .setDisabled(false)
  .setExecute(async (message, user, args) => {
    const content = message.content;
    const sendChannel = await message.client.channels.fetch(botAnnounceChId);
    return await sendChannel.send(content.slice(content.indexOf(' ')+1));
  });
