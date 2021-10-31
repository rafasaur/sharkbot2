const { GuildMember } = require("discord.js");

const levelUp = require(`./levelUp`);


const approvalProcess = async (member, level, logChId) => {
  const logCh = await member.guild.channels.resolve(logChId);
  logCh.send({content:
    `${member.user.tag} (${member.nickname}) is leveling up `+
    `from ${level} to ${level+1}! If input is needed for this process, ` +
    `use either \`approve\` or \`deny\` + ${member.id} to complete it. `+
    `Otherwise, congrats ${member.user.tag}!`
  });
};

module.exports = (client) => {
  const { levelIds, levelLogChId } = client.getConfig('levels');
  //const levelIds = this.client.getConfig('levels').levelIds;
  //const levelLogChId = this.client.getConfig('levels').levelLogChId;

  const pronounRole = client.getRules('reaction-roles').get('pronouns');
  const pronounRoleIds = new Set(Object.values(pronounRole.emojiRoleMap).flat());


  GuildMember.prototype.getLevelFromRole = async function () {
    let setRoles = [];
    let level = 0;
    await this.roles.cache.each( role => {
      if (levelIds.includes(role.id)) level = Math.max(levelIds.indexOf(role.id), level);
      else setRoles.push(role.id);
    });
    if (
      level > 0 || (
        level === 0 &&
        this.roles.cache.some(role => pronounRoleIds.has(role.id))
      )
    ) {
      setRoles.push(levelIds[level]);
    }
    await this.roles.set(setRoles);
    return level;
  }


  GuildMember.prototype.checkLevel0 = function () {
    if (this.roles.cache.some( role => pronounRoleIds.has(role.id))) {
      this.roles.add(levelIds[0]);
      this.data.lastLevelUp = new Date();
    }
  };


  GuildMember.prototype.checkLevelUp = async function () {
    if (this.data.level === 0) await this.checkLevel0(this);
    const level = this.data.level;
    const levelRoleIds = [levelIds[level], levelIds[level+1]];
    this.data.levelUpReady = await levelUp.check(this,levelRoleIds);
    if ( this.data.levelUpReady ) {
      if ( this.data.levelUpApproved ) {
        this.data.level = await levelUp.approved(this,levelRoleIds);
        return true;
      }
      else approvalProcess(this, level, levelLogChId)
    }
    return false;
  };


  GuildMember.prototype.denyLevelUp = async function () {
    console.log(`${this.user.tag} level up denied`)
    return await levelUp.denied(this);
  };


  GuildMember.prototype.preCheck = async function () {
    if (!this.data || typeof(this.data) === 'undefined') this.createBlankData();
    this.data.level = await this.getLevelFromRole();
    return;
  };


  GuildMember.prototype.updateFromMessage = async function (message) {
    await this.preCheck();
    this.data.sentMessages++;
    //if (!this.data?.sentChannels) this.data.sentChannels = new Set([message.channel.id]);
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
