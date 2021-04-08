const CommandBuilder = require("../../command/classes/CommandBuilder");

module.exports = new CommandBuilder()
  .setName("points")
  .setAliases(["spend"])
  .setOwnersOnly(false)
  .setModsOnly(false)
  .setGuildOnly(true)
  .setRequireArgs(false)
  .setDeletable(false)
  .setCooldown(0)
  .setDisabled(false)
  // eslint-disable-next-line
  .setExecute(async (message, user, args) => {
    if (!user.isOwner() || args.length === 0) {
      if (!user.data.points || user.data.points < 0) user.data.points = 0;
      message.reply(`you have ${user.data.points} points!`);
    }

    else if (user.isOwner() && (message.mentions && message.mentions.members.array().length > 0)) {
      const addPoints = args[0];
      message.mentions.members.each(mem => {
        if (!mem.user.data.points) mem.user.data.points = 0;
        mem.user.data.points += addPoints;
        message.channel.send(`Congrats ${mem.nickname}, you gained ${addPoints} points!`);
      });

    }
  });
