const CommandBuilder = require("../../../command/classes/CommandBuilder");


module.exports = new CommandBuilder()
  .setName("TEMPLATE")
  .setOwnersOnly(false)
	.setModsOnly(false)
  .setGuildOnly(true)
  .setRequireArgs(false)
  .setDeletable(false)
  .setCooldown(0)
  .setDisabled(false)
  .setExecute(async (message, user, args) => {
		message.reply('uh oh!')
  })
	.setHelp(async (message, user, args) => {
		message.reply({content: "I shouldn't be here!"})
	})
