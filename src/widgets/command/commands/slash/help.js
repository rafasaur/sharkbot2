const SlashBuilderPlus = require("../../../command/classes/SlashBuilderPlus");

module.exports = {
  data: new SlashBuilderPlus()
    .setName('help')
    .setDescription('Get a brief rundown on what I do here!')
    .setPushOption('global')
    ,

  async execute(interaction) {

    const helpMessage = interaction.client.getConfig().helpMessage;

    interaction.reply( {
      content:helpMessage,
      ephemeral:true
    });

    return;
  }
}
