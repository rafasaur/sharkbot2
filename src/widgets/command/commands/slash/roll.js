const SlashBuilderPlus = require("../../../command/classes/SlashBuilderPlus");
const { ChannelType, Collection } = require('discord.js');
const roller = require('../shared/roll');


module.exports = {
  data: new SlashBuilderPlus()
    .setName('roll')
    .setDescription('roll some dice!')
    .setPushOption('global')
    .addStringOption(option =>
      option.setName('dice')
        .setDescription('list of dice to roll, e.g. 2d12, 2dgreen 3dpurple, etc.')
        .setRequired(false)
      ),
  async execute(interaction) {
    const rollString = interaction.options.getString('dice');
    let emojiCache = new Collection;

    if (interaction.channel.type === ChannelType.GuildText) emojiCache = interaction.guild.emoji.cache;

    const replyArray = roller(rollString, emojiCache);

    interaction.reply({
      content: replyArray.filter(reply => reply.length > 0).join('\n\n')
    })
  }
}
