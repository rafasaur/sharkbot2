const CommandBuilder = require("../src/widgets/command/classes/CommandBuilder");

const craigSnl = ['theweekend.gif'];
const diddyDay = ['diddyfriday.gif'];
const ityslFn0 = ['itysl-friday0.jpg'];
const ityslFn1 = ['itysl-friday1.gif'];
const ityslFn2 = ['itysl-friday2.mp4'];
const ityslFn3 = ['itysl-friday-og.mp4'];
const wickieSat = ['wickiesaturday.mp4'];
const sailerFri = ['sailerfriday.mp4'];
const hplinko  = [ 'hplinko0.gif', 'hplinko1.gif' ];

function getFiles(files) {
  let fileArray = [];
  files.forEach( file => fileArray.push({attachment: './assets/weekend/'+file, name:file}) );
  return fileArray;
}


module.exports = new CommandBuilder()
  .setName("weekend")
  //.setAliases(["p", "pong"])
  .setOwnersOnly(false)
  .setModsOnly(false)
  .setGuildOnly(false)
  .setRequireArgs(false)
  .setDeletable(false)
  .setCooldown(0)
  .setDisabled(false)
  // eslint-disable-next-line
  .setExecute(async (message, user, args) => {
    const date = new Date;
    const roll = Math.random();

    if ( user.id === '' ) { // moss exempt from all shenanigans
      message.channel.send({files:getFiles(craigSnl)});
    }

    else if ( roll > .9931 ) { // always a small chance for horse plinko
      message.channel.send({files:getFiles(hplinko)});
    }

    else if ( // Sunday, and early Monday morning are straightforward
      date.getDay() === 0 || (
        date.getDay() === 1 &&
        date.getHours() < 3
      )
    ) {
      message.channel.send({files:getFiles(craigSnl)});
    }

    else if ( // Saturday has a chance for Wickie
      date.getDay() === 6
    ) {
      if (roll < .2) message.channel.send({files:getFiles(wickieSat)});
      else message.channel.send({files:getFiles(craigSnl)});
    }

    else if ( // Friday, broken up by time
      date.getDay() === 5
    ) {
      if ( // before 9: diddy or krabs
        date.getHours() < 9
      ) {
        if (roll < .5) message.channel.send({files:getFiles(diddyDay)});
        else message.channel.send({files:getFiles(sailerFri)});
      }
      else if ( // between 9 - 5pm: diddy, krabs, or craig
        date.getHours() > 9 &&
        date.getHours() < 17
      ) {
        if ( roll < .2 ) message.channel.send({files:getFiles(diddyDay)});
        else if (roll < .4) message.channel.send({files:getFiles(sailerFri)});
        else message.channel.send({files:getFiles(craigSnl)});
      }
      else { // after 5, fri    day    night is in play
        if ( roll < .1 ) message.channel.send({files:getFiles(diddyDay)});
        else if ( roll < .2 ) message.channel.send({files:getFiles(sailerFri)});
        else if ( roll < .8 ) message.channel.send({files:getFiles(craigSnl)});
        else {
          const newRoll = Math.random();
          if ( newRoll < .4 ) message.channel.send({files:getFiles(ityslFn0)});
          else if ( newRoll < .7 ) message.channel.send({files:getFiles(ityslFn1)});
          else if ( newRoll < .9 ) message.channel.send({files:getFiles(ityslFn3)});
          else message.channel.send({files:getFiles(ityslFn2)});
        }
      }
    }

    else if ( roll < .069 ) { // small chance for the weekend during the week
      message.channel.send({files:getFiles(craigSnl)});
    }

    else if ( roll > .95 ) { // chance for horse plinko during the week
      message.channel.send({files: getFiles(hplinko)});
    }

    else {
      message.channel.send({content:"It is not the weekend :("});
    }
  });
