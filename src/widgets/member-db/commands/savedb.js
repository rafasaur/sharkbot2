const CommandBuilder = require("../../command/classes/CommandBuilder");

module.exports = new CommandBuilder()
  .setName("savedb")
  .setAliases(['writedb','save','write'])
  .setOwnersOnly(true)
  .setModsOnly(false)
  .setGuildOnly(false)
  .setRequireArgs(false)
  .setDeletable(false)
  .setCooldown(1000)
  .setDisabled(false)
  // eslint-disable-next-line
  .setExecute(async (message, user, args) => {
    if (message.channel.type === 'GUILD_TEXT') {
      message.guild.database.writeDbToFile();
      //user.send(`${message.guild.name} database written to file!`);
      message.react('✍️');
      return;
    }
    if (message.channel.type === 'DM') {
      message.client.guilds.cache.each(guild => {
        guild.database.writeDbToFile();
      });
      //user.send(`guild files written!`);
      message.react('✍️');
      return;
    }
    return;
  });
