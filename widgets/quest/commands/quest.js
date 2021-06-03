const CommandBuilder = require("../../command/classes/CommandBuilder");

const infoDump = [
  'ahh, you wish to know of the Quest? Very well...',
  '>>> \`!points\` if you wish to check your points',
  '\`!points give <number> <@member>\` to give some points to someone else',
  "\`!shop\` to see what's available today",
  "\`!shop buy <item>\` to buy item> from the shop",
  "\`!item\` to check your inventory",
  "\`!item use <item>\` to use the item",
  "\`!item give <item> <@member>\` to give the item to a member"
]

module.exports = new CommandBuilder()
  .setName("quest")
  //.setAliases(["p"])
  .setOwnersOnly(false)
  .setModsOnly(false)
  .setGuildOnly(true)
  .setRequireArgs(false)
  .setDeletable(false)
  .setCooldown(0)
  .setDisabled(false)
  // eslint-disable-next-line
  .setExecute(async (message, user, args) => {
    if (!args || !args[0]) return message.channel.send(`Welcome to the Quest!`);

    switch (args[0]) {
      case 'info':
      case 'help':
        return message.reply(infoDump.join('\n'));
    }
  })
