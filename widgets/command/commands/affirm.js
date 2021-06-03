const CommandBuilder = require("../../command/classes/CommandBuilder");

const { affirmations } = require("../affirmations.json");

const randomVal = (array) => {
	return array[Math.floor(Math.random() * array.length)]
};

const sendToUsers = (users) => {
	users
		.each( usr => {
			usr.send(randomVal(affirmations))
				.then(msg => console.log(`\t ${usr.tag} affirmed! Message: ${msg.content}`));
	});
};

const sendToRoles = (roles) => {
	roles
		.filter( role => role.mentionable )
		.each( role => sendToUsers(role.members.mapValues(member => member.user)) );
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
    // message each member mentioned
    if (
			message.mentions.users.array().length > 0 ||
			message.mentions.roles.array().length > 0
		) {
			if (message.mentions.users.array().length > 0) sendToUsers(message.mentions.users);
			if (message.mentions.roles.array().length > 0) sendToRoles(message.mentions.roles);
			//message.author.send("thanks for affirming your friends! ❤️");
    }
		// or just message the sender
    else {
      user.send(randomVal(affirmations))
				.then(msg => console.log(`\t ${user.tag} self-affirmed! "${msg.content}"`));
    }

    message.react('❤️')
  })
	.setHelp(async (message, user, args) => {
		message.channel.send('affirm yourself or your friends!');
	});
