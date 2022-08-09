const CommandBuilder = require("../../src/widgets/command/classes/CommandBuilder");
const halloweener = require('../shared/halloween');

module.exports = new CommandBuilder()
  .setName("halloween")
  .setOwnersOnly(false)
  .setModsOnly(false)
  .setGuildOnly(false)
  .setRequireArgs(false)
  .setDeletable(false)
  .setCooldown(0)
  .setDisabled(false)
  .setExecute(async (message, user, args) => {
    await halloweener(message);
    return;
  });
