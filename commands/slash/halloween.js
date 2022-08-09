const SlashBuilderPlus = require('../../src/widgets/command/classes/SlashBuilderPlus');
const halloweener = require('../shared/halloween');

module.exports = {
  data: new SlashBuilderPlus()
    .setName('halloween')
    .setDescription("check to see if it's halloween")
    .setPushOption('global')
    ,

    async execute(interaction) {
      await halloweener(interaction);
      return;
    }
}
