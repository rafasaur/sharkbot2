const { GuildMember } = require("discord.js");

const { levelIds, levelLogChId } = require('../levels-config');

const pronounRole = require("../../reaction-roles/reaction-roles-config").rules.pronouns;
const pronounRoleIds = new Set(Object.values(pronounRole.emojiRoleMap).flat());
  // our server requires pronoun role/s to be set before leveling

const getLevelFromRole = async (member) => {
  let setRoles = [];
  let level = 0;
  await member.roles.cache.each( role => {
    if (levelIds.includes(role.id)) level = Math.max(levelIds.indexOf(role.id), level);
    else setRoles.push(role.id);
  });
  if (
    level > 0 || (
      level === 0 &&
      member.roles.cache.some(role => pronounRoleIds.has(role.id))
    )
  ) {
    setRoles.push(levelIds[level]);
  }
  await member.roles.set(setRoles);
  return level;
}

const checkLevel0 = (member) => {
  if (member.roles.cache.some( role => pronounRoleIds.has(role.id))) {
    member.roles.add(levelIds[0]);
    member.data.lastLevelUp = new Date();
  }
};

const approvalProcess = (member, level) => {
  const logCh = member.guild.channels.resolve(levelLogChId);
  logCh.send(
    `${member.user.tag} (${member.nickname}) is leveling up `+
    `from ${level} to ${level+1}! If input is needed for this process, ` +
    `use either \`approve\` or \`deny\` + ${member.id} to complete it. `+
    `Otherwise, congrats ${member.user.tag}!`
  );
};

module.exports = (client) => {

  GuildMember.prototype.checkLevelUp = async function () {
    if (this.data.level === 0) await checkLevel0(this);
    const level = this.data.level;
    const levelRoleIds = [levelIds[level], levelIds[level+1]];
    this.data.levelUpReady = await require(`./levelers/levelUp`).check(this,levelRoleIds);
    if ( this.data.levelUpReady ) {
      if ( this.data.levelUpApproved ) {
        this.data.level = await require(`./levelers/levelUp`).approved(this,levelRoleIds);
        return true;
      }
      else approvalProcess(this, level)
    }
    return false;
  };


  GuildMember.prototype.denyLevelUp = async function () {
    console.log(`${this.user.tag} level up denied`)
    return await require(`./levelers/levelUp`).denied(this);
  };


  GuildMember.prototype.preCheck = async function () {
    if (!this.data || typeof(this.data) === 'undefined') this.createBlankData();
    this.data.level = await getLevelFromRole(this);
  };


  GuildMember.prototype.updateFromMessage = async function (message) {
    await this.preCheck();
    this.data.sentMessages++;
    this.data.sentChannels.add(message.channel.id);
    this.checkLevelUp();
  };


  GuildMember.prototype.createBlankData = function () {
    this.data = {};

    this.data.level = 0;
    this.data.levelUpReady = false;
    this.data.levelUpApproved = false;
    this.data.sentMessages = 0;
    this.data.sentChannels = new Set();
    this.data.lastLevelUp = new Date();

    this.data.affirmCount = 0; // for use with affirm command
    this.data.points = 0; // for use with points command(s)
    this.data.levelUpFlag = false; // for use with levelup command

  }
};
