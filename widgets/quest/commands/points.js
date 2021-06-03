const CommandBuilder = require("../../command/classes/CommandBuilder");
const Player = require('../classes/Player');


function givePoints(message,args) {
  let pts;

  // mods just give out points for free
  if (message.author.isOwner() || message.member.isMod()) {
    pts = Number(args[0]);
    if (Number.isNaN(pts)) pts = 100;

    // give points to everyone
    if (args[0] === 'all' || args[1] === 'all' || message.mentions.everyone) {
      message.guild.members.cache.each( mem => {
        if (!mem.player) mem.player = new Player(mem);
        mem.player.addPoints(pts);
      })
    }
    // give points to roles
    if (message.mentions.roles) {
      message.mentions.roles.each(role => {
        role.members.each(mem => {
          if (!mem.player) mem.player = new Player(mem);
          mem.player.addPoints(pts);
        })
      })
    }
    // give points to specific members
    if (message.mentions.members) {
      message.mentions.members.each(mem => {
        if (!mem.player) mem.player = new Player(mem);
        mem.player.addPoints(pts);
      })
    }
  }

  // everyone else uses their own points, and can only give to other members (for now?)
  else {
    if (!message.mentions.members) return message.reply(`you gotta give your points to someone, I think!`);
    pts = Number(args[0]);
    if (Number.isNaN(pts)) return message.reply(`the points you're giving should come *after* \`give\`!`) ;
    if (!message.member.inv.spendPoints(pts)) return message.reply(`you don't have enough points for that!`);
    else {
      const target = message.mentions.members.random();
      if (!target.player) target.player = new Player(target);
      target.player.addPoints(pts);
    }
  }
}


function stealPoints(message,args) {
  if (!message.mentions.members) return;
  const target = message.mentions.members.random();
  if (!target.player) return;

  if (
    message.member.player.roll('DEX') >
    target.player.roll('DEX')
  ) {
    const maxPts = Math.floor(.69 * target.player.points);
    let stolen = Math.max(Math.floor(Math.random()*maxPts), 1);
    target.player.spendPoints(stolen);
    message.member.player.addPoints(stolen);
    message.channel.send(`${message.member} stole ${stolen} points!`);
  }

  else message.reply('nice try!');
}

module.exports = new CommandBuilder()
  .setName("points")
  .setAliases(["p"])
  .setOwnersOnly(false)
  .setModsOnly(false)
  .setGuildOnly(true)
  .setRequireArgs(false)
  .setDeletable(false)
  .setCooldown(0)
  .setDisabled(false)
  // eslint-disable-next-line
  .setExecute(async (message, user, args) => {
    if (args.length === 0) {
      if (!message.member.player) message.member.player = new Player(message.member);
      return message.member.player.getPoints(message);
    }

    const arg0 = args.shift();

    switch (arg0) {
      case 'give':
        givePoints(message, args);
      case 'steal':
        stealPoints(message,args);
    }


  });
