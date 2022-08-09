const SlashBuilderPlus = require("../../../command/classes/SlashBuilderPlus");

module.exports = {
  data: new SlashBuilderPlus()
    .setName('OOPS')
    .setDescription('if this command got loaded something went wrong!')
    .setPushOption('global')
    ,

  async execute(interaction) {

    interaction.reply( {
      content:'uh oh!',
      ephemeral:true
    });

    return;
  }
}
