const CommandBuilder = require("../../command/classes/CommandBuilder");

module.exports = new CommandBuilder()
  .setName("welcome")
  .setOwnersOnly(false)
	.setModsOnly(true)
  .setGuildOnly(false)
  .setRequireArgs(false)
  .setDeletable(false)
  .setCooldown(0)
  .setDisabled(false)
  .setExecute(async (message, user, args) => {
    let config = message.client.getConfig('welcome');

    if (!args || args.length < 1) config.active = !config.active;

    else if (args[0] === 'on') config.active = true;
    else if (args[0] === 'off') config.active = false;

    message.client.setConfig(config);
    console.log(`\twelcome messages set to ${config.active}`);
    message.react('👍');
  })
