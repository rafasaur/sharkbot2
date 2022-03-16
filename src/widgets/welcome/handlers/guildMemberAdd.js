
const fs = require('fs'); const path = require('path')

module.exports = async (member) => {
  if (fs.existsSync(path.resolve(__dirname,'../../../../.config/smooth.js'))) {
    let smoothFile = await JSON.parse(fs.readFileSync(member.client.getConfig('smooth').filepath));
    if (member.user.id in smoothFile) return;
  }

  const config = member.client.getConfig('welcome');

  if (!config.active) return;

  member.send(config.welcomeText);
  console.log(`${member.user.username} welcomed!`);
}
