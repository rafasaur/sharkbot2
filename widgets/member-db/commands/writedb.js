const CommandBuilder = require("../../command/classes/CommandBuilder");

module.exports = new CommandBuilder()
  .setName("writedb")
  //.setAliases()
  .setOwnersOnly(true)
  .setModsOnly(false)
  .setGuildOnly(false)
  .setRequireArgs(false)
  .setDeletable(false)
  .setCooldown(1000)
  .setDisabled(false)
  // eslint-disable-next-line
  .setExecute(async (message, user, args) => {
    try {
      if (!message.guild) message.client.writeAllGuildsToFile();
      else message.client.writeGuildToFile(message.guild);
    }
    catch (error) {
      console.log(`Tried to write guild files, but functions weren't loaded!` );
    }
  });
