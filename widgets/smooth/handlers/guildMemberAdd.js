const fs = require('fs'); const path = require('path');

const smoothFilepath = '../smoothers.json'


async function smoothWelcome (member, smoothed) {
  const returnKing = smoothed[member.user.id]
  // add back each role that isn't @everyone
  console.log(`adding roles...`)
  for (const roleID of smoothed[member.user.id].roles) {
    if (roleID !== config.commands.smooth.ignoreID) {
      console.log(`role ID = ${roleID}`);
      try {
        const role = member.guild.roles.cache.find(role => role.id === roleID);
        await member.roles.add(role)
        console.log(`\trole ${role.name} added`);
      } catch (error) {console.error(error);}
    }
  }
  // set nickname
  if (smoothed[member.user.id].nickname) {
    await member.setNickname(smoothed[member.user.id].nickname);
    console.log(`nickname set!`);
  }
  // and remove them from the smoothed log
  await delete smoothed[member.user.id];
  await fs.writeFileSync(smoothFilepath,JSON.stringify(smoothed));
  console.log(`welcome back ${member.displayName}!`);
}


module.exports = async (member) => {
  if (!fs.existsSync(smoothFilepath)) return fs.writeFileSync(smoothFilepath, '{}');

  let smoothFile = await JSON.parse(fs.readFileSync(smoothFilepath));
  if (member.user.id in smoothFile) {
    member.send("Welcome back!");
    console.log(`${member.displayName} is rough once more!`)
    await smoothWelcome(member, smoothFile);
    try { member.updateFromClient() } catch { () => null }
  }
};
