


module.exports = async (interaction) => {
  if (
    !interaction.isCommand() ||
    !interaction.user.isUser()
  ) return;

  const command = interaction.client.scommands.get(interaction.commandName);

  if (
    !command ||
    (command.ownersOnly && !interaction.user.isOwner()) ||
    (command.modsOnly && !interaction.member.isMod())
  ) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({content: 'Sorry! Try again later', ephemeral: true})
  }
}
