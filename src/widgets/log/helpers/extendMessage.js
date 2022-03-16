const fs = require("fs");
const { Message } = require("discord.js");

module.exports = () => {

  Message.prototype.log = function () {
    const timestamp = new Date().toISOString();
    let authorLvl = '';
    if (
      this.isFromGuildChannel() &&
      this.member.data
    ) authorLvl = ` (lvl ${this.member.data.level})`;

    const logMessage = [
      `${timestamp.substring(0, 10)} ${timestamp.substring(11, 19)}`,
      this.isFromGuildChannel()
        ? `#${this.channel.name}`
        : "DM",
      `${this.author.tag}` + authorLvl + `: ${this.content}`
    ];

    console.log(logMessage.join(" | "));
  }
}
