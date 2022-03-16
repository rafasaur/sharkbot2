const CommandBuilder = require("../../command/classes/CommandBuilder");

module.exports = new CommandBuilder()
  .setName("shout")
  .setOwnersOnly(false)
	.setModsOnly(false)
  .setGuildOnly(true)
  .setRequireArgs(false)
  .setDeletable(true)
  .setCooldown(100)
  .setDisabled(false)
  .setExecute(async (message, user, args) => {
    const config = message.client.getConfig('shoutbox');
    if (
      !config.shoutChIds.includes(message.channel.id) &&
      !message.member.isMod() ||
      args.some(arg => arg.includes(':CONCHNO:'))
    ) return;

    message.channel.send({content: '\>\>\> \*\*' + args.join(' ') + '\*\*'});

    if (config.ccToDM) {
      await message.client.getConfig().ownerIds.forEach(usrId => {
        message.client.users.fetch(usrId)
          .then(usr => usr.send({
            content: `shout from ${user.tag}:\n\>\>\> ` + message.content,
            attachments: message.attachments
          }))
      })
    }

    //message.delete();

    console.log(`shout sent!`)

  })
	.setHelp(async (message, user, args) => {
		message.reply({content: "Affirm yourself & friends!"})
	})
