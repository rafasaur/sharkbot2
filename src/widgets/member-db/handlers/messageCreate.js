
module.exports = (message) => {
  if (
    message.channel.type !== 'GUILD_TEXT' ||
    message.author.bot || message.author.system
  ) return;


  message.guild.database.messageCount++;
  if (
    message.guild.database.messageCount % 9 &&
    Date.now() - message.guild.database.lastWriteDate >= .5 * 3600 * 1000
  ) message.guild.database.writeDbToFile();
}
