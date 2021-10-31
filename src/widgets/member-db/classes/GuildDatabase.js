const { Collection } = require('discord.js')

module.exports = class GuildDatabase {
  constructor(client, guild) {
    this.client = client;
    this.guild = guild;
    this.memberData = new Collection();
  }

  addMember(member) {
    let data = {};
    
  }
}
