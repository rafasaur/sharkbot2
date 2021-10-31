const fs = require('fs'); const path = require('path');


async function smoothWelcome (member, smoothers, smoothersPath) {

  // add back roles
  console.log(`adding roles...`)
  smoothers[member.id].roles.forEach( async roleId => {
    await member.roles.add(roleId);
    console.log(`\trole ${roleId} added`);
  });

  // set nickname
  if (smoothers[member.user.id].nickname) {
    await member.setNickname(smoothers[member.user.id].nickname);
    console.log(`nickname set!`);
  }

  // and remove them from the smoothed log
  await delete smoothers[member.user.id];
  await fs.writeFileSync(smoothersPath,JSON.stringify(smoothers));
  console.log(`${member.displayName} is rough once more!`);
}


module.exports = async (member) => {
  const smoothersPath = member.client.getConfig('smooth').filepath;
  let smoothFile = await JSON.parse(fs.readFileSync(smoothersPath));

  if (member.user.id in smoothFile) {
    member.send( {content:"Welcome back!"} );
    await smoothWelcome(member, smoothFile, smoothersPath);
    try { member.updateFromClient() } catch { () => null }
  }
};
