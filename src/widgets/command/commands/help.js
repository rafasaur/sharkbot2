const CommandBuilder = require("../../command/classes/CommandBuilder");


module.exports = new CommandBuilder()
  .setName("help")
  .setAliases(['info'])
  .setOwnersOnly(false)
  .setModsOnly(false)
  .setGuildOnly(false)
  .setRequireArgs(false)
  .setDeletable(false)
  .setCooldown(10)
  .setDisabled(false)
  .setExecute(async (message, user, args) => {
    const config = message.client.getConfig();//require('../../../../.config/command');
    const myId = config.ownerIds[0];
    const mainChannelId = config.mainChannelId;
    const welcomeChannelId = config.welcomeChannelId;

    if (args?.length > 0) {
      const helper = message.getHelp(args[0]);
      if (helper.isHelpable) return await helper.help();
    }

    const atme = await message.client.users.fetch(myId);
    const mainCh = await message.client.channels.fetch(mainChannelId);
    const welcomeCh = await message.client.channels.fetch(welcomeChannelId);

    const quoteBlock =
      `> • you can affirm yourself \`!affirm\`. If you \`@\` someone/s I'll send affirmations to them instead!\n`+
      `> • you can roll some dice with \`!roll\`. I understand most things, so try it out!\n`+
      `> • in the before times, you could \`!smooth\` yourself. Maybe someday it will work again....\n`+
      `> • you can assign yourself roles by reacting to certain messages in ${welcomeCh}, `+
      `and a not-so-secret one in ${mainCh}\n`+
      `> • I manage all the "levels," which really just track how long you've been here and how actively you post!\n`;

    return message.reply( {content:
      `hi! My name's Sharkbot, and I help out with a few things around here:\n\n`+
      `${quoteBlock}`+'\n'+
      `If you have any specific question you can message ${atme}, `+
      `and my code can be found at https://github.com/rafasaur/sharkbot2. `+
      `If you're feeling generous, you can also donate to them at https://ko-fi.com/rafasaur :)`
    })
  });
