const fs = require('fs-extra'); const path = require('path');
const { Collection } = require('discord.js');

// convert data read from json to corresponding type
function formatReadData(name, data) {
  if (name.endsWith('Obj')) return JSON.parse(data);
  if (name.endsWith('Set')) return new Set(data);
  if (name.endsWith('Date')) return new Date(data);
  return data;
}

// convert data to writeable format for json
function formatWriteData(name, data) {
  if (name.endsWith('Obj') || data instanceof Object) return JSON.stringify(data);
  if (name.endsWith('Set') || data instanceof Set) return Array.from(data);
  if (name.endsWith('Date') || data instanceof Date) return data.toISOString();
  return data;
}

module.exports = class GuildDatabase {
  constructor(guild) {
    this.guild = guild;
    this.filepath = path.resolve(__dirname,`../guild-files/${this.guild.id}.json`);
    if (!fs.existsSync(this.filepath)) fs.writeJsonSync(this.filepath, {}, {spaces: '\t'});
    this.memberDatabase = new Collection;
    this._importMemberData();
    this.messageCount = 0;
    this.lastWriteDate = new Date();
  }

  // read data from json
  async _importMemberData() {
    let guildFile = fs.readJsonSync(this.filepath);
    await this.guild.members.fetch();

    // get each member data from file
    Object.keys(guildFile).forEach(async memberId => {
      let memberData = {};
      memberData.id; memberData.nickname; memberData.roleSet;

      // import data to correct type
      Object.keys(guildFile[memberId]).forEach(item => {
        memberData[item] = formatReadData(item, guildFile[memberId][item]);
      })

      // reset the levelUpAlerted flag, if it's been tripped
      if (memberData.levelUpAlerted) memberData.levelUpAlerted = false;

      // update data managed by discord
      if (this.guild.members.cache.has(memberId)) {
        let thisMember = await this.guild.members.fetch(memberId);
        memberData.id = memberId;
        memberData.nickname = thisMember.nickname || '';
        memberData.roleSet = new Set(thisMember.roles.cache.map(role => role.id));

        // store data both in member and in guild auxiliary collection
        thisMember.data = memberData;
        this.memberDatabase.set(memberId, memberData);
      }
    });
    return;
  }

  // write member data to json
  async writeDbToFile() {
    await this.updateDb();
    let jsonToWrite = {}
    this.memberDatabase.each(member => {
      let memberWriteData = {}
      Object.keys(member).forEach(item => {
        memberWriteData[item] = formatWriteData(item, member[item])
      })
      jsonToWrite[member.id] = memberWriteData;
    });

    fs.writeJsonSync(this.filepath, jsonToWrite, {spaces: '\t'});
    console.log(`\t${this.guild.name} database written!`);
    this.lastWriteDate = new Date();
    return;
  }

  // add a member to the collection
  addMember(member) {
    let memberData = {}
    memberData.id = member.id;
    memberData.username = member.user.username;
    memberData.nickname = member.nickname || '';
    memberData.roleSet = new Set(member.roles.cache.map(role => role.id));
    if (member.data) Object.keys(member.data).forEach(item => memberData[item] = member.data[item]);

    this.memberDatabase.set(member.id, memberData);
    return;
  }

  // update an existing member in the collection
  // I know, I know it's the exact same. I'll fix it later
  updateMember(member) {
    if (!this.memberDatabase.has(member.id)) return this.addMember(member);
    let memberData = this.memberDatabase.get(member.id);
    memberData.username = member.user.username;
    memberData.nickname = member.nickname || '';
    memberData.roleSet = new Set(member.roles.cache.map(role => role.id));
    if (member.data) Object.keys(member.data).forEach(item => memberData[item] = member.data[item]);

    this.memberDatabase.set(member.id, memberData);
    return;
  }

  // delete a member from the collection
  removeMember(member) {
    this.memberDatabase.remove(member.id);
    return;
  }

  // update every member in the guild cache
  updateDb() {
    this.guild.members.cache.each(async member => await this.updateMember(member));
    console.log(`\t${this.guild.name} database updated!`);
    return;
  }
}
