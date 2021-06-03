module.exports = class Executable {
  constructor(message, user, command, args) {
    this.message = message;
    this.user = user;
    this.command = command;
    this.args = args;
  }

  log() {
    console.log(`\tCOMMAND CALLED: ${this.command.name} by ${this.user.tag}`);
  }

  isExecutable() {
    return (
      this.command &&
      (!this.command.ownersOnly || this.user.isOwner()) &&
      (!this.command.modsOnly || this.message.member.isMod()) &&
      (!this.command.guildOnly || this.message.isFromTextChannel()) &&
      (!this.command.requireArgs || this.args.length) &&
      !this.command.disabled &&
      !this.user.isOnCooldown(this.command)
    );
  }

  async execute() {
    this.log();
    this.user.startCooldown(this.command);
    await this.command.execute(this.message, this.user, this.args);
  }

  isDeletable() {
    return this.command.deletable && this.message.deletable;
  }
};
