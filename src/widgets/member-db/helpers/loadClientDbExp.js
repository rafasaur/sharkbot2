const fs = require("fs");
const path = require("path");

const { GuildMember } = require("discord.js");

const getWriteableData = (data) => {
  if (data instanceof Set) return Array.from(data);
  else if (data instanceof Date) return data.toISOString();

  return data;
};

const prepMemberForDb = async (member) => {
  let thisMember = {};
  thisMember.id = member.id;
  thisMember.nickname = member.nickname;
  Object.keys(member.data).forEach( key => {
    thisMember[key] = getWriteableData(member.data[key]);
  });
  thisMember.roleList = [];
  await member.roles.cache.each( role => thisMember.roleList.push(role.id));

  return thisMember;
};

module.exports = (client) => {
  client.guildDbs = {};

  client.writeAllGuildsToFile = async () => {
    client.guilds.cache.each( guild => {
      client.writeGuildToFile(guild);
    });
    console.log("guilds written to file!");
  };

  client.writeGuildToFile = async (guild) => {
    const filePath = path.resolve(__dirname, `../guild-files/${guild.id}.json`);
    //let guildFile = await JSON.parse(fs.readFileSync(filePath,'utf8'));
    const guildToWrite = await client.updateGuildDb(guild);
    fs.writeFileSync(filePath,JSON.stringify(guildToWrite, null, '\t'));
  };

  client.updateGuildDb = async (guild) => {
    if (!client.guildDbs[guild.id]) client.guildDbs[guild.id] = {};
    await guild.members.cache.each( async (mem) => {
      await client.updateClientMemberData(mem);
    });
    //console.log(client.guildDbs[guild.id]);
    return client.guildDbs[guild.id];
  };

  client.updateClientMemberData = async (member) => {
    if (member.user.bot) return;
    const memGuildId = member.guild.id;
    if (!member.data) member.data = {};
    if (!client.guildDbs[member.guild.id][member.id]) client.guildDbs[member.guild.id][member.id] = {};
    client.guildDbs[member.guild.id][member.id] = await prepMemberForDb(member);
  };

  GuildMember.prototype.updateClient = async () => {
    await this.client.updateClientMemberData(this);
  }

  GuildMember.prototype.updateFromClient = async () => {
    const guild = this.guild;
    const memberData = this.client.guildDbs[guild.id][this.id]
    if (!memberData) return false;

    if (!this.data) this.createBlankData();
    Object.keys(memberData).forEach( (key) => {
      if (key === `lastLevelUp`) this.data.key = new Date(memberData.key);
      else if (key === `sentChannels`) this.data.key = new Set(memberData.key);
      else this.data.key = memberData.key;
    });
    if (this.data.nickname) this.setNickname(this.data.nickname);
    if (this.data.roleList) {
      this.data.roleList.forEach( async (roleId) => {
        await member.roles.add(roleId);
      });
    }
    return true;
  };
};
