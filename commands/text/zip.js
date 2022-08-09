const CommandBuilder = require("../../src/widgets/command/classes/CommandBuilder");
const zipper = require('../../src/util/zipFolder');

module.exports = new CommandBuilder()
  .setName("zip")
  .setOwnersOnly(true)
  .setModsOnly(false)
  .setGuildOnly(false)
  .setRequireArgs(false)
  .setDeletable(false)
  .setCooldown(0)
  .setDisabled(false)
  .setExecute(async (message, user, args) => {
    await zipper();
    return;
  });
