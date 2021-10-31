const CommandBuilder = require("../../command/classes/CommandBuilder");

const { affirmations } = require("../../../../assets/affirmations.json");

const randomVal = (array) => {
	return array[Math.floor(Math.random() * array.length)]
};

const sendToUsers = (users) => {
	let sentTF = false;
	users
		.filter( usr => !usr.bot )
		.each( usr => {
			usr.send({content: randomVal(affirmations)})
				.then(msg => console.log(`\t ${usr.tag} affirmed! Message: ${msg.content}`))
				.then(sentTF = true);
	});
	return sentTF;
};

const sendToRoles = (roles) => {
	let sentTF = false;
	roles
		.filter( role => role.mentionable )
		.each( role => {
			if (sendToUsers(role.members.mapValues(member => member.user))) sentTF = true;
		});
	return sentTF;
};

module.exports = new CommandBuilder()
  .setName("affirm")
  .setOwnersOnly(false)
	.setModsOnly(false)
  .setGuildOnly(true)
  .setRequireArgs(false)
  .setDeletable(false)
  .setCooldown(0)
  .setDisabled(false)
  .setExecute(async (message, user, args) => {

		if (!sendToUsers(message.mentions.users) && !sendToRoles(message.mentions.roles)) {
			user.send({content: randomVal(affirmations)})
				.then(msg => console.log(`\t ${user.tag} self-affirmed! "${msg.content}"`));
		}

    message.react('❤️')
  })
	.setHelp(async (message, user, args) => {
		message.reply({content: "Affirm yourself & friends!"})
	})
