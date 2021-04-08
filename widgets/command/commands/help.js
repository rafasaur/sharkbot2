const CommandBuilder = require("../../command/classes/CommandBuilder");

let atme = `\`rafasaur#8320\``;
let mainChannel = `\`#main\``;
let welcomeChannel = `\`#welcome\``;

const myID = '';
const mainChannelID = '';
const welcomeChannelID = '';

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
  // eslint-disable-next-line
  .setExecute(async (message, user, args) => {
    if (message.channel.type === 'text') {
      atme = message.channel.guild.members.cache.find(me => me.id === myID);
      mainChannel = message.channel.guild.channels.cache.find(ch => ch.id === mainChannelID);
      welcomeChannel = message.channel.guild.channels.cache.find(ch => ch.id === welcomeChannelID);
    }
    const quoteBlock =
      `> • you can affirm yourself \`!affirm\`. If you \`@\` someone/s I'll send affirmations to them instead!\n`+
      `> • you can roll some dice with \`!roll\`. I understand most things, so try it out!\n`+
      `> • in the before times, you could \`!smooth\` yourself. Maybe someday it will work again....\n`+
      `> • you can assign yourself roles by reacting to certain messages in ${welcomeChannel}, `+
      `and a not-so-secret one in ${mainChannel}\n`+
      `> • I manage all the "levels," which really just track how long you've been here and how much you participate! `+
      `There *should* be a post about it in ${welcomeChannel}, eventually... \n`;

    message.reply(`hi! My name's Sharkbot, and I help out with a few things around here:\n\n`+
    `${quoteBlock}`+'\n'+
    `If you have any specific question you can message ${atme}, `+
    `my code can be found at https://github.com/rafasaur/sharkbot. `+
    `If you're feeling generous, you can donate to my dad at https://ko-fi.com/rafasaur :)`)
  });
