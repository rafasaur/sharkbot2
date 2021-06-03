const CommandBuilder = require("../../command/classes/CommandBuilder");

module.exports = new CommandBuilder()
  .setName("item")
  .setAliases(["i"])
  .setOwnersOnly(false)
  .setModsOnly(false)
  .setGuildOnly(true)
  .setRequireArgs(false)
  .setDeletable(false)
  .setCooldown(0)
  .setDisabled(false)
  // eslint-disable-next-line
  .setExecute(async (message, user, args) => {
    if (!args || args.length === 0) {
      message.reply(`oh ho! Check out me fine wares today:`)
      message.client.quest.shop.listItems(message.channel);
    }

    const args0 = args.shift();

    switch (arg0) {
      case 'use':
      case 'give':
      return;
    }

  })
