const SlashBuilderPlus = require('../../src/widgets/command/classes/SlashBuilderPlus');
const weekender = require('../shared/weekend');

module.exports = {
  data: new SlashBuilderPlus()
    .setName('weekend')
    .setDescription("check to see if it's the weekend")
    .setPushOption('global')
    ,

    async execute(interaction) {
      await weekender(interaction);
      return;
    }
}
