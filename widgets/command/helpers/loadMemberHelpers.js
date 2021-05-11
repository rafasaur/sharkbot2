const { GuildMember } = require("discord.js");

const { modRoleIds } = require("../command-config");

module.exports = () => {

  GuildMember.prototype.isMod = function () {
    if (!modRoleIds || modRoleIds.length <= 0) return false;
    
    return this.roles.cache.map(role => role.id)
            .filter(id => modRoleIds.includes(id))
            .length > 0;
  };

};
