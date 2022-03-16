const _ = require("lodash");

const { GuildMember } = require("discord.js");
const levelUp = require(`./levelUp`);

const defaultData = {
  level: 0,
  levelUpReady: false,
  levelUpAlerted: false,
  levelUpApproved: false,
  sentMessages: 0,
  recentMessageObj: {},
  recentMessages: 0,
  sentChannelSet: new Set(),
  lastLevelUpDate: new Date(),

  affirmCount: 0, // for use with affirm command
  antiConchCount: 0, // for counting use of a certain reaction
  points: 0, // for use with points command(s)
  levelUpFlag: false // for use with levelup command
}


async function approvalProcess(member, level, logChId){
  const logCh = await member.guild.channels.resolve(logChId);
  logCh.send({content:
    `${member.user.tag} (${member.nickname}) is leveling up `+
    `from ${level} to ${level+1}! \nUse either \`!approve\` `+
    `or \`!deny\` + \`${member.id}\` to complete it.`
  });
};


function getStringDate(date) {
  return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
}

module.exports = (client) => {
  const { levelIds, levelLogChId, logLevel } = client.getConfig('levels');
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
      else if (!this.data.levelUpAlerted) {
        approvalProcess(this, level, levelLogChId);
        this.data.levelUpAlerted = true;
      }
    }
    return false;
  };


  GuildMember.prototype.denyLevelUp = async function () {
    console.log(`${this.user.tag} level up denied`);
    this.data.levelUpAlerted = false;
    return await levelUp.denied(this);
  };


  GuildMember.prototype.preCheck = async function () {
    if (!this.data || typeof(this.data) === 'undefined') await this.createBlankData();
    await Object.keys(defaultData).forEach( key => {
      if (!this.data[key] || typeof(this.data[key]) === 'undefined') {
        this.data[key] = _.cloneDeep(defaultData[key]);
      }
    });
    this.data.level = await this.getLevelFromRole();
    return;
  };


  GuildMember.prototype.updateFromMessage = async function (message) {
    if (message.partial) await message.fetch();
    await this.preCheck();
    this.data.sentMessages++;
    this.updateRecentMessages(message);
    this.data.sentChannelSet.add(message.channel.id);
    if (message.isCommand() && message.command.name === 'affirm') this.data.affirmCount++;
    this.checkLevelUp();
    if (logLevel && logLevel > 0 && this.data.sentMessageSet%logLevel === 0) console.log(this.data);
  };


  GuildMember.prototype.updateRecentMessages = function (message) {
    const recentTime = message.client.getConfig('levels').recentDays * 24 * 3600 * 1000;
    const messageDate = getStringDate(message.createdAt);
    const messageTime = message.createdAt.getTime();
    if (Object.keys(this.data.recentMessageObj).includes(messageDate)) {
      this.data.recentMessageObj[messageDate] += 1;
    }
    else {
      //let removeDates = [];
      Object.entries(this.data.recentMessageObj).forEach(([date, count]) => {
        if (messageTime - new Date(date).getTime() > recentTime) removeDates.push(date); {
          delete this.data.recentMessageObj[date];
        }
      });
      /*
      removeDates.forEach(date => {
        delete this.data.recentMessageObj[date];
      }); */
      this.data.recentMessageObj[messageDate] = 1;
    }

    let totalRecentMessages = 0;
    Object.entries(this.data.recentMessageObj).forEach(([date, count]) => {
      totalRecentMessages += count;
    })
    this.data.recentMessages = totalRecentMessages;
  }


  GuildMember.prototype.createBlankData = function () {
    this.data = _.cloneDeep(defaultData);

    //Object.keys(defaultData).forEach( key => this.data[key] = defaultData[key]);

    /*this.data.level = 0;
    this.data.levelUpReady = false;
    this.data.levelUpApproved = false;
    this.data.sentMessages = 0;
    this.data.sentChannels = new Set();
    this.data.lastLevelUp = new Date();

    this.data.affirmCount = 0; // for use with affirm command
    this.data.points = 0; // for use with points command(s)
    this.data.levelUpFlag = false; // for use with levelup command
    */
  }
};
