
// log interactions


module.exports = (interaction) => {
  if (interaction.isCommand()) {
    console.log(
      `\tslash command ${interaction.commandName} called `+
      `in #${interaction.channel.name} by ${interaction.user.tag}`
    );
  }
}
