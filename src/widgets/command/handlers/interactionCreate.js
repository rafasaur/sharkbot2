const { InteractionType } = require('discord.js');

module.exports = async (interaction) => {
  if (
    !interaction.type === InteractionType.ApplicationCommand ||
    !interaction.user.isUser()
  ) return;

  const command = interaction.client.commands.slash.get(interaction.commandName);

  if (
    !command ||
    (command.ownersOnly && !interaction.user.isOwner()) ||
    (command.modsOnly && !interaction.member.isMod())
  ) return;

  const cooldownRemaining = this.user.isOnCooldown(command);
  if (cooldownRemaining) {
    await interaction.reply({
      content: `You are on cooldown for this command for ${cooldownRemaining} more seconds!`,
      ephemeral: true
    });
    return;
  }

  try {
    await command.execute(interaction);
    if (command.cooldown && command.cooldown > 0)  this.user.startCooldown(this.command);
  } catch (error) {
    console.error(error);
    await interaction.reply({content: 'Sorry! Try again later', ephemeral: true})
  }
}
