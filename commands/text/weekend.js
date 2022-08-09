const CommandBuilder = require("../../src/widgets/command/classes/CommandBuilder");
const weekender = require('../shared/weekend');

module.exports = new CommandBuilder()
  .setName("weekend")
  .setOwnersOnly(false)
  .setModsOnly(false)
  .setGuildOnly(false)
  .setRequireArgs(false)
  .setDeletable(false)
  .setCooldown(0)
  .setDisabled(false)
  .setExecute(async (message, user, args) => {
    await weekender(message);
    return;
  });
