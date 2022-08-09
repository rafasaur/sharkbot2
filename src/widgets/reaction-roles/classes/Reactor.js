
module.exports = class Reactor {
  constructor (client, rule) {
    this.messageId = rule.messageId;
    this.channelId = rule.channelId;
    this.message; this.channel;
    this.uniqueRole = rule.isUnique;
    this.reactAgnostic = rule.reactAgnostic;
    this.emojiRoleMap = rule.emojiRoleMap;
    this.validEmoji = Object.keys(rule.emojiRoleMap);
    this.fullRoleList = Object.values(rule.emojiRoleMap).flat();
    this._initReacts(client);
  }

  async _initReacts(client) {
    this.channel = await client.channels.fetch(this.channelId);
    this.message = await this.channel.messages.fetch(this.messageId);
    this.validEmoji.forEach( async (emoji) => await this.message.react(emoji) );
  }

  _validReaction(reaction) {
    const isValid =
      reaction.message.id === this.messageId &&
      ( reaction.message.guild && reaction.message.channel.type !== 'DM' ) &&
      ( this.validEmoji.includes(reaction.emoji.name) ||
        this.validEmoji.includes(reaction.emoji.id) ||
        this.reactAgnostic )
    return isValid;
  }

  _getRoles(reaction) {
    if (this.reactAgnostic) return this.fullRoleList;

    const emoji = reaction.emoji.id || reaction.emoji.name;
    return this.emojiRoleMap[emoji];
  }

  async addRoles(reaction, user) {
    if ( !this._validReaction(reaction) ) return;

    const roles = this._getRoles(reaction);
    const member = await reaction.message.guild.members.fetch(user);

    if (this.uniqueRole) this._assignRoleSet(roles, member);

    else {
      roles.forEach( async role => {
        await member.roles.add(role);
        let thisRole = await member.guild.roles.fetch(role);
        console.log(`adding role ${thisRole.name} to ${member.user.tag}`);
      })
    }

    return;
  }

  async _assignRoleSet(roles, member) {
    const roleSet = new Set(roles);
    member.roles.cache.each( role => {
      if (!this.fullRoleList.includes(role.id)) roleSet.add(role.id);
    });
    await member.roles.set(Array.from(roleSet));
    console.log(`roles set for ${member.user.tag}`);
    return;
  }

  async removeRoles(reaction, user) {
    if ( !this._validReaction(reaction) ) return;

    const roles = this._getRoles(reaction);
    const member = await reaction.message.guild.members.fetch(user);

    //if (this.uniqueRole) this.assignRoleSet([], member); // technically works but so does v

    roles.forEach( async role => {
      await member.roles.remove(role);
      let thisRole = await member.guild.roles.fetch(role);
      console.log(`role ${thisRole.name} removed from ${member.user.tag}`);
    })
  }
}
