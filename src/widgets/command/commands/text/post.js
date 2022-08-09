const CommandBuilder = require("../../../command/classes/CommandBuilder");


module.exports = new CommandBuilder()
  .setName("post")
  .setOwnersOnly(true)
  .setGuildOnly(false)
  .setRequireArgs(false)
  .setDeletable(false)
  .setCooldown(10)
  .setDisabled(false)
  // eslint-disable-next-line
  .setExecute(async (message, user, args) => {
    const botAnnounceChId = message.client.getConfig().botAnnounceChId; //require('../../../../.config/command');
    const content = message.content;
    const sendChannel = await message.client.channels.fetch(botAnnounceChId);
    return await sendChannel.send({content: content.slice(content.indexOf(' ')+1)});
  });
