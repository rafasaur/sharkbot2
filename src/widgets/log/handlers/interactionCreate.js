// log interactions

const { InteractionType } = require("discord.js");


module.exports = (interaction) => {
  if (interaction.type === InteractionType.ApplicationCommand) {
    console.log(
      `\tslash command ${interaction.commandName} called `+
      `in #${interaction.channel.name} by ${interaction.user.tag}`
    );
  }
}
