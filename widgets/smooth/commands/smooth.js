const fs = require('fs');
const CommandBuilder = require("../../command/classes/CommandBuilder");

const smoothFilepath = `../smoothers.json`;

const vintageSmooth = async (member) => {
  let smoothed = await JSON.parse(fs.readFileSync(smoothFilepath,'utf8'));
	smoothed[member.id] = {};
  smoothed[member.id]["id"] = member.id;
  smoothed[member.id]["nickname"] = member.nickname;
	smoothed[member.id]["roles"] = [];
	member.roles.cache.each(role => smoothed[member.id]['roles'].push(role.id));
	await fs.writeFileSync(smoothFilepath,JSON.stringify(smoothed,null,'\t'));
  console.log(`smooth file written!`);
};


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
    if (
			user.isOwner() ||
      !message.member
		) { return console.log("couldn't smooth!") }

    try {
      await client.updateClientMemberData(message.member);
    } catch (err) {
      console.error(`member-db not enabled, vintage-ly smoothing\n\t${err}`);
      await vintageSmooth(message.member);
    }

		const invite = await message.channel.createInvite( {maxUses:1, reason:`${user.username} smoothed`} )
		await user.send(
			`Congratulations, you've been smoothed. Rejoin here: https://discord.gg/${invite.code}`
		);
		await message.member.kick("s m o o t h   t h e   c h a t");
		console.log(`${user.tag} has been smoothed!`);
		message.react(client.emoji.smooth);
  });
