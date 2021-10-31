const fs = require('fs'); const path = require('path');

const randomInd = (len) => {
  return Math.floor(Math.random() * len);
};

const sendKeaton = async (message) => {
  const keatPath = path.resolve(__dirname, "../../assets/bj");
  const keatGifs = fs.readdirSync(keatPath)
    .filter((file) => /(bj[0-9].gif)/ig.test(file));

  const keatSend = keatPath + `/${keatGifs[randomInd(keatGifs.length)]}`;

  return message.channel.send( {files: [keatSend]} );
};

module.exports = {
  priors: (client) => {
    client.bjCount = 0;
    client.incBJCount = (message) => {
      client.bjCount += message.content.match(/(beetle[\s\.\,\*\|]*juice)/igm).length;
      client.bjCount += message.content.match(/betelgeuse/igm).length;
      console.log(client.bjCount);
      if (client.bjCount % 3 === 0) sendKeaton(message);
      return;
    }
  },

  ifs: (message, contentLowered) => {return (
    message.channel.type === 'GUILD_TEXT' &&
    !message.author.bot && (
      /beetle[\s\.\,\|\*]*juice/igm.test(contentLowered) ||
      /betelgeuse/igm.test(contentLowered)
    )
  )},
  reacts: (message, emoji) => {
    message.client.incBJCount(message);
  }
}
