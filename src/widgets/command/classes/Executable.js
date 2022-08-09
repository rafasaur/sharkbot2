module.exports = class Executable {
  constructor(message, user, command, args) {
    this.message = message;
    this.user = user;
    this.command = command;
    this.args = args;
  }

  log() {
    const timestamp = new Date().toISOString();
    const logMessage = [
      `\tTEXT COMMAND CALLED: ${this.command.name} by ${this.user.tag}`,
    ];

    console.log(logMessage.join(" | "));
  }

  async isExecutable() {
    const cooldownRemaining = this.user.isOnCooldown(this.command);
    if (cooldownRemaining) {
      await user.send(`You are on cooldown for this command for another ${cooldownRemaining} seconds!`);
      return false;
    }

    return (
      this.command &&
      (!this.command.ownersOnly || this.user.isOwner()) &&
      (!this.command.modsOnly || this.message.member.isMod()) &&
      (!this.command.guildOnly || this.message.isFromGuildChannel()) &&
      (!this.command.requireArgs || this.args.length) &&
      !this.command.disabled
    );
  }

  async execute() {
    //this.log();
    if (this.command.cooldown && this.command.cooldown > 0) this.user.startCooldown(this.command);
    await this.command.execute(this.message, this.user, this.args);
  }

  isDeletable() {
    return this.command.deletable && this.message.deletable;
  }
};
