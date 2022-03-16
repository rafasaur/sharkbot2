const SlashBuilderPlus = require("../../command/classes/SlashBuilderPlus");

module.exports = {
  data: new SlashBuilderPlus()
    .setName('ask')
    .setDescription('send a private message to the mods')
    .setPushOption('global')
    .addStringOption(option =>
      option.setName('content')
        .setDescription('write your message')
        .setRequired(true))
    .addBooleanOption(option =>
      option.setName('anonymous')
        .setDescription('send your message anonymously? (default: false)')
        .setRequired(false)),
  async execute(interaction) {

    const content = interaction.options.getString('content');
    const sendAnonly = interaction.options.getBoolean('anonymous');
    const config = interaction.client.getConfig('askbox');
    const sendToCh = await interaction.client.guilds.fetch(config.sendToChId);

    if (
      !interaction.guild ||
      !sendToCh
    ) return;

    let preamble;
    if (sendAnonly) preamble = `private ask:\n\>\>\> `;
    else preamble = `ask from ${interaction.user.tag}:\n\>\>\> `;

    await interaction.client.sendToCh.send({content: preamble + content});
    interaction.reply({content: `your ask was sent!`, ephemeral:true});

    if (config.ccToDM) {
      await interaction.client.getConfig().ownerIds.forEach(usrId => {
        interaction.client.users.fetch(usrId)
          .then(usr => usr.send({
            content: `ask from ${interaction.user.tag}:\n\>\>\> ` + content
          }))
      })
    };

    console.log(`ask sent!`);
  }
}
