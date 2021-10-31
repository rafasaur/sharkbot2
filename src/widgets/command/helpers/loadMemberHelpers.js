const { GuildMember } = require("discord.js");

module.exports = () => {

  GuildMember.prototype.isMod = function () {
    const modRoleIds = this.client.getConfig().modRoleIds;
    if (!modRoleIds || modRoleIds.length <= 0) return false;

    return this.roles.cache.map(role => role.id)
            .filter(id => modRoleIds.includes(id))
            .length > 0;
  };

};
