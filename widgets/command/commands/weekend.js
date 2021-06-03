const CommandBuilder = require("../../command/classes/CommandBuilder");
const path = require("path");
const {MessageAttachment} = require("discord.js");


module.exports = new CommandBuilder()
  .setName("weekend")
  .setOwnersOnly(false)
  .setModsOnly(false)
  .setGuildOnly(false)
  .setRequireArgs(false)
  .setDeletable(false)
  .setCooldown(0)
  .setDisabled(false)
  .setExecute(async (message, user, args) => {
    const date = new Date;
    if (
      date.getDay() === 0 ||
      date.getDay() === 6 || (
        date.getDay() === 5 &&
        date.getHours() > 9
      ) || (
        date.getDay() === 1 &&
        date.getHours() < 3
      ) ||
      Math.random() < .069 ||
      user.id === '461229960464564224'
    ) {
      const attachment = new MessageAttachment('./common/theweekend.gif');
      message.channel.send(attachment);
    }

    else {
      message.channel.send("It is not the weekend :(");
    }
  });
