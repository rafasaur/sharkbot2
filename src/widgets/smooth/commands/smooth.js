// smooth.js
// smooth command file 

const fs = require('fs'); const path = require('path');
const CommandBuilder = require("../../command/classes/CommandBuilder");

async function smoothMember (channel,member) {
	// open the book of the smooothed & write a new name
	let smoothed = await JSON.parse(fs.readFileSync(`../smoothers.json`,'utf8'));
	smoothed[member.user.id] = {};
	smoothed[member.user.id]["roles"] = [];
	smoothed[member.user.id]["nickname"] = member.nickname;
	member.roles.cache.each(role => smoothed[member.user.id]['roles'].push(role.id));

	// create & send invite to smoothed one
	const invite = await channel.createInvite({maxUses:1})
	await member.send({content:
		"Congratulations, you've been smoothed. "+
		"Rejoin here: https://discord.gg/"+invite.code
	});

	// close the book & smooth
	await fs.writeFileSync(`../smoothers.json`,JSON.stringify(smoothed,null,'\t'));
	member.kick("s m o o t h   t h e   c h a t");
	console.log(`${member.displayName} has been smoothed!`);
}

module.exports = new CommandBuilder()
  .setName("smooth")
  .setOwnersOnly(false)
  .setModsOnly(false)
  .setGuildOnly(true)
  .setRequireArgs(false)
  .setDeletable(false)
  .setCooldown(0)
  .setDisabled(false)
  .setExecute(async (message, user, args) => {
		console.log(`\nsmoothing...`);

		// owner can't smooth themself!
    if ( user.isOwner() ) {
			console.log(`creator?! never!\n`);
      message.reply({content:'Creator! They who gave me Life! I would never!'});
    }

		// all set, smooth ahead!
		else {
			//try { message.member.updateClient() } catch { () => null }
			smoothMember(message.channel,message.member);
			message.react(message.client.emoji.smooth);
		}

  });
