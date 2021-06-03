const CommandBuilder = require("../../command/classes/CommandBuilder");

const rollDie = (sides) => {
  return Math.ceil(Math.random() * sides);
};

const countMatch = (string, regex) => {
  return (string.match(regex) || []).length;
};

const numberedRoll = (rolls) => {
  let replies = [];
  rolls.forEach( roll => {
    let sum = 0;
    let rollList = [];
    let [dice, sides] = roll.split('d');
    if (!dice || dice < 0) dice = 1;

    for (let d = 0; d < Number(dice); d++) {
      const thisRoll = rollDie(Number(sides));
      sum += thisRoll;
      let rollStr = thisRoll.toString();
      if (thisRoll === sides) rollStr = "*" + rollStr + "*";
      rollList.push(rollStr);
    }

    if (sum === 100) sum = '💯';
    else if (sum === 110) sum = message.guild.emojis.cache.find(emoji => emoji.name === '110') || 110;
    else if (sum === 69) sum = 'NICE';
    else if (sum === 420) sum = message.guild.emojis.cache.find(emoji => emoji.name === 'weednumber') || 'blaze it';

    let msgReply = `rolling ${roll}...\n` + `>>> ${rollList.join(' + ')} = **${sum}**`;
    if (msgReply.length > 2000) {
      msgReply = `rolling... ${roll}\n` + `>>> list too long to print, but total = **${sum}**`;
    }
    replies.push(msgReply);
  });
  return replies;
};

const starwarsRoll = (rolls) => {
  let rollList = [];
  let diceList = [];
  rolls.forEach( roll => {
    let [dice,color] = roll.split('d');
    if (!dice || dice < 0) dice = 1;
    else if (dice === "re") {dice = 1; color = "red";}
    else if (color === "re") color = "red";

    let sides = [];
    // Despair/Triumph, Failure/Success, thReat/Advantage, White/Black
    switch (color) {
      case "r":
      case "red":
        sides = ["D","FF","FR","RR","F","R","FF","FR","RR","F","R",""];
        diceList.push(`${dice} red`);
        break;
      case "p":
      case "purple":
        sides = ["F","R","R","R","RR","FR","FF",""];
        diceList.push(`${dice} purple`);
        break;
      case "k":
      case "black":
        sides = ["F","R",""];
        diceList.push(`${dice} black`);
        break;
      case "u":
      case "blue":
        sides = ["S","SA","A","AA","",""];
        diceList.push(`${dice} blue`);
        break;
      case "g":
      case "green":
        sides = ["S","SA","AA","A","S","SS","A",""];
        diceList.push(`${dice} green`);
        break;
      case "y":
      case "yellow":
        sides = ["T","AA","S","SS","A","SA","SS","S","AA","AS","AS",""];
        diceList.push(`${dice} yellow`);
        break;
      case "w":
      case "white":
      default:
        sides = ["WW","WW","B","B","W","B","BB","WW","B","B","B","W"];
        diceList.push(`${dice} white`);
    }

    for (let d = 0; d < Number(dice); d++) {
      rollList.push(sides[rollDie(sides.length)-1]);
    }
  });
  const rollStr = rollList.join("");
  const sCount = countMatch(rollStr, /[ST]/g) - countMatch(rollStr, /[FD]/g);
  const aCount = countMatch(rollStr, /[A]/g ) - countMatch(rollStr, /[R]/g );
  const tCount = countMatch(rollStr, /[T]/g ) - countMatch(rollStr, /[D]/g );
  const wCount = countMatch(rollStr, /[W]/g);
  const bCount = countMatch(rollStr, /[B]/g);

  let reply = [];
  if (sCount > 1) reply.push(`**${sCount}** successes`);
  else if (sCount === 1) reply.push(`**${sCount}** success`);
  else if (sCount === 0) reply.push(`no successes`);
  else if (sCount === -1) reply.push(`**${Math.abs(sCount)}** failure`);
  else if (sCount < -1) reply.push(`**${Math.abs(sCount)}** failures`);

  if (aCount > 1) reply.push(`**${aCount}** advantages`);
  else if (aCount === 1) reply.push(`**${aCount}** advantage`);
  else if (aCount === -1) reply.push(`**${Math.abs(aCount)}** threat`);
  else if (aCount < -1) reply.push(`**${Math.abs(aCount)}** threats`);

  if (tCount > 1) reply.push(`**${tCount}** triumphs!!`);
  else if (tCount === 1) reply.push(`**${tCount}** triumph!`);
  else if (tCount === -1) reply.push(`**${Math.abs(tCount)}** despair!`);
  else if (tCount < -1) reply.push(`**${Math.abs(tCount)}** despairs!!`);

  if (wCount > 0) reply.push(`**${wCount}** light side`);
  if (bCount > 0) reply.push(`**${bCount}** dark side`);

  return `rolling ${diceList.join(", ")}...\n> ` + reply.join(", ");
};

module.exports = new CommandBuilder()
  .setName("roll")
  .setAliases(['r'])
  .setOwnersOnly(false)
  .setModsOnly(false)
  .setGuildOnly(false)
  .setRequireArgs(true)
  .setDeletable(false)
  .setCooldown(0)
  .setDisabled(false)
  .setExecute(async (message, user, args) => {
    let rollList = [];
    let sum = 0;

    const numberedRolls = args.join(" ").match(/(\d*d\d+)/g);
    const starwarsRolls = args.join(" ").match(/(\d*d((red|purple|black|blue|green|yellow|white)|[rpkugyw]))/g);

    let numReplies = [];
    let swReply = "";
    if (numberedRolls) numReplies = numberedRoll(numberedRolls);
    if (starwarsRolls) swReply = starwarsRoll(starwarsRolls);

    numReplies.concat([swReply])
      .filter(reply => reply.length > 0)
      .forEach( msg => {
        message.reply(msg);
      })
  })
  .setHelp(async (message, user, args) => {
    return await message.reply(
      `Roll some dice! ` +
      `Try with normal sided dice (e.g., \`roll 3d6\`) ` +
      `or with Force & Destiny dice (e.g., \`roll 2dpurple 2dgreen 1dblue\`)`
    );
  });
