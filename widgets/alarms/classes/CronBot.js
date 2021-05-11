const { MessageAttachment } = require("discord.js");

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

module.exports = class CronBot {
  constructor(client, rule) {
    this.client = client;
    this.rule = rule;
  }

  getMessageContent() {
    switch (this.rule.contentType) {
      case "random": {
        const randomIndex = getRandomInt(0, this.rule.content.length);
        return this.rule.content[randomIndex];
      }
      case "static":
      default:
        return this.rule.content;
    }
  }

  sendMessage() {
    this.rule.channelIds.forEach(async (channelId) => {
      const channel = await this.client.channels.fetch(channelId);
      let messageContent = '';

      if (this.rule.atRoleID) {
        const atRole = await channel.guild.roles.fetch(this.rule.atRoleID);
        messageContent = `${atRole} `;
      }
      messageContent += this.getMessageContent();

      if (this.rule.attachment) {
        messageContent = new MessageAttachment(this.rule.attachment);
      }
      channel.send(messageContent);
      console.log(`reminder sent! In ${channel.name}: ${messageContent}`);
    });
  }
}
