module.exports = class Helpable {
  constructor(message, user, command, args) {
    this.message = message;
    this.user = user;
    this.command = command;
    this.args = args;
  }

  log() {
    console.log(`\tHELP ASKED: ${this.command.name} by ${this.user.tag}`);
  }

  isHelpable() {
    return (
      this.command && this.command.canHelp &&
      (!this.command.ownersOnly || this.user.isOwner()) &&
      (!this.command.modsOnly || this.message.member.isMod()) &&
      !this.command.disabled
    );
  }

  async help() {
    this.log();
    await this.command.help(this.message, this.user, this.args);
  }

};
