const { Message, ChannelType } = require("discord.js");
const Executable = require("../classes/Executable");
const Helpable = require("../classes/Helpable");


module.exports = () => {
  Message.prototype.isFromGuildChannel = function () {
    return (
      this.channel.type === ChannelType.GuildText ||
      this.channel.type === ChannelType.GuildPublicThread ||
      this.channel.type === ChannelType.GuildPrivateThread ||
      this.channel.type === ChannelType.GuildVoice
    );
  };

  Message.prototype.isUserMessage = function () {
    return !this.system;
  };

  Message.prototype.isTextCommand = function () {
    const commandString = this.content.replace(this.client.prefixRegExp, "").split(/ +/)[0].toLowerCase();
    return (
      this.client.prefixRegExp.test(this.content) && (
        this.client.commands.text.has(commandString) ||
        this.client.commands.text.some(command => command.aliases.has(commandString))
    ))
  };

  Message.prototype.getTextCommand = function (commandString) {
    this.command = (
      this.client.commands.text.get(commandString) ||
      this.client.commands.text.find((command) => command.aliases.has(commandString))
    );
    return this.command;
  };

  Message.prototype.createExecutable = function () {
    const args = this.content.replace(this.client.prefixRegExp, "").split(/ +/);
    const commandString = args.shift().toLowerCase();
    const command = this.getTextCommand(commandString);

    return new Executable(this, this.author, command, args);
  };

  Message.prototype.manualExecutable = function(commandString, args='') {
    const command = this.getTextCommand(commandString.toLowerCase());
    return new Executable(this,this.author,command,args);
  };

  Message.prototype.getHelp = function(commandString, args='') {
    const command = this.getTextCommand(commandString.toLowerCase(), args);
    return new Helpable(this, this.author, command, args);
  };
};
