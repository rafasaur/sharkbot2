const SlashBuilderPlus = require("../../command/classes/SlashBuilderPlus");

module.exports = {
  data: new SlashBuilderPlus()
    .setName('shout')
    .setDescription('send an anonymous shout to the shout channel')
    .setPushOption('global')
    .addStringOption(option =>
      option
        .setName('shout')
        .setDescription('type your shout!')
        .setRequired(true))
    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('channel to shout in (default is current channel)')
        .setRequired(false)),
  async execute(interaction) {

    const content = interaction.options.getString('shout');
    const channel = interaction.options.getChannel('channel') || interaction.channel;
    const config = interaction.client.getConfig('shoutbox');
    //const shoutCh = await client.guilds.fetch(config.shoutChIds[0]);

    if (
      !interaction.guild ||
      !channel
    ) return;

    if (!interaction.memberPermissions.has('SEND_MESSAGES')) {
      interaction.reply({
        content: `You don't have permission to shout in that channel!`,
        ephemeral: true });
      await interaction.client.getConfig().ownerIds.forEach(usrId => {
        interaction.client.users.fetch(usrId)
          .then(usr => usr.send({
            content: `${interaction.user.tag} tried to shout in ${channel.name} but couldn't:\n\>\>\> ` + content
          }))
        });
      return;
    }

    channel.send({content: '\>\>\> \*\*' + content + '\*\*'});
    interaction.reply({content: `shouted successfully!`, ephemeral: true})

    if (config.ccToDM) {
      await interaction.client.getConfig().ownerIds.forEach(usrId => {
        interaction.client.users.fetch(usrId)
          .then(usr => usr.send({
            content: `shout from ${interaction.user.tag}:\n\>\>\> ` + content
          }))
      })
    };

    console.log(`shout sent!`)

  }
}
