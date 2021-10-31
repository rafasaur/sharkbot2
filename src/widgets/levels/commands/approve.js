const CommandBuilder = require("../../command/classes/CommandBuilder");

module.exports = new CommandBuilder()
  .setName("approve")
  .setAliases(["deny"])
  .setOwnersOnly(true)
  .setModsOnly(false)
  .setGuildOnly(false)
  .setRequireArgs(true)
  .setDeletable(false)
  .setCooldown(10)
  .setDisabled(false)
  // eslint-disable-next-line
  .setExecute(async (message, user, args) => {
    const thatMemId = args[0]; const theGuildId = args[1];
    if ( !thatMemId || !theGuildId ) {
      return message.reply({content:`Oops! You forgot either the member or guild ID.`});
    }
    const theGuild = await user.client.guilds.fetch(theGuildId);
    if ( !theGuild || !theGuild.available ) {
      return message.reply({content:`Hmm, that's not a real guild?`});
    }
    const thatMem = theGuild.members.fetch(thatMemId);
    if ( !thatMem ) {
      return message.reply({content:`I can't find that member!`});
    }
    const wordOfPower = message.split(" ")[0].slice(1).lower();
    let result;
    switch (wordOfPower) {
      case "approve":
        thatMem.data.levelUpApproved = true;
        result = await thatMem.checkLevelUp;
        if (result) return message.reply({content:`Level up success!`});
        else return message.reply({content:`Level up failed!`});
      case "deny":
        result = await thatMem.denyLevelUp;
        return message.reply({content:`Denial success!`});
      default:
        return message.reply({content: "Not a valid arguement!"})
    }
  });
