const CommandBuilder = require("../../../command/classes/CommandBuilder");
const { ChannelType, Collection } = require('discord.js');

const roller = require('../shared/roll')

module.exports = new CommandBuilder()
  .setName("roll")
  .setAliases(['r'])
  .setOwnersOnly(false)
  .setModsOnly(false)
  .setGuildOnly(false)
  .setRequireArgs(true)
  .setDeletable(false)
  .setCooldown(0)
  .setDisabled(false)
  .setExecute(async (message, user, args) => {

    let emojiCache = new Collection;
    if (message.channel.type === ChannelType.GuildText) emojiCache = interaction.guild.emoji.cache;

    roller(args.join(" "), emojiCache)
      .filter(reply => reply.length > 0)
      .forEach( msg => {
        message.reply(msg);
      })

  })
  .setHelp(async (message, user, args) => {
    return await message.reply( {content:
      `Roll some dice! ` +
      `Try with normal sided dice (e.g., \`roll 3d6\`) ` +
      `or with Force & Destiny dice (e.g., \`roll 2dpurple 2dgreen 1dblue\`)`
    });
  });
