const CommandBuilder = require("../../../command/classes/CommandBuilder");

module.exports = new CommandBuilder()
  .setName("levelup")
  .setAliases([""])
  .setOwnersOnly(false)
  .setModsOnly(false)
  .setGuildOnly(true)
  .setRequireArgs(false)
  .setDeletable(false)
  .setCooldown(10)
  .setDisabled(false)
  // eslint-disable-next-line
  .setExecute(async (message, user, args) => {
    message.member.data.levelUpFlag = true;
  });
