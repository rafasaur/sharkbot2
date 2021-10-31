const { Message } = require("discord.js");
const Executable = require("../classes/Executable");
const Helpable = require("../classes/Helpable");

module.exports = () => {
  Message.prototype.isFromTextChannel = function () {
    return this.channel.type === "GUILD_TEXT";
  };

  Message.prototype.isUserMessage = function () {
    return !this.system;
  };

  Message.prototype.isCommand = function () {
    return this.client.prefixRegExp.test(this.content);
  };

  Message.prototype.getCommand = function (commandString) {
    return (
      this.client.commands.get(commandString) ||
      this.client.commands.find((command) => command.aliases.has(commandString))
    );
  };

  Message.prototype.createExecutable = function () {
    const args = this.content.replace(this.client.prefixRegExp, "").split(/ +/);
    const commandString = args.shift().toLowerCase();
    const command = this.getCommand(commandString);

    return new Executable(this, this.author, command, args);
  };

  Message.prototype.manualExecutable = function(commandString, args='') {
    const command = this.getCommand(commandString.toLowerCase());
    return new Executable(this,this.author,command,args);
  };

  Message.prototype.getHelp = function(commandString, args='') {
    const command = this.getCommand(commandString.toLowerCase(), args);
    return new Helpable(this, this.author, command, args);
  };

/**
  Message.prototype.authorIsMod = function() {
    const modRoleIds = this.client.getConfig().modRoleIds;
    if (!modRoleIds || modRoleIds.length <= 0) return false;
    return this.member.roles.cache.map(role => role.id)
            .filter(id => modRoleIds.includes(id))
            .length > 0;
  };
*/
};
