const { GuildMember } = require("discord.js");
const CooldownCache = require("../classes/CooldownCache");

const modRoleIds = new Set(require("../command-config").modRoleIds);

module.exports = () => {
  GuildMember.prototype.isMod = function () {
    return this.roles.cache.some( role => modRoleIds.has(role.id));
  };

};
