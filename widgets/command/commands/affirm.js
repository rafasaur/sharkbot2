const CommandBuilder = require("../classes/CommandBuilder");

const { affirmations } = require("./affirmations/affirmations.json");

const randomVal = (array) => {
	return array[Math.floor(Math.random() * array.length)]
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
    if (message.mentions.users.array().length > 0) {
			message.mentions.users
				//.filter( usr => !usr.bot ) // make sure we're not DMing a bot
				.each( usr => {
					const affirmMsg = randomVal(affirmations);
					usr.send(affirmMsg)
					console.log(`\t ${usr.tag} affirmed! Message: ${affirmMsg}`);
				});
			//message.author.send("thanks for affirming your friends! <3");
    }
		// or just message the sender
    else {
			const affirmMsg = randomVal(affirmations);
      message.author.send(affirmMsg);
      console.log(`\t ${message.author.tag} self-affirmed! "${affirmMsg}"`);
    }

    message.react('❤️')
  });
