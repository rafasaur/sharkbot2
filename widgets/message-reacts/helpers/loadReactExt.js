const fs = require(`fs`); const path = require(`path`);
const { MessageAttachment } = require("discord.js");

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

const sendKeaton = async (message) => {
  const keatGifs = fs.readdirSync(path.resolve(__dirname, "../content"))
    .filter((file) => /(bj[0-9].gif)/ig.test(file));

  const keatSend = path.resolve(__dirname, `../content/${keatGifs[getRandomInt(0,keatGifs.length)]}`);

  return message.channel.send( new MessageAttachment(keatSend) );
};

module.exports = (client) => {
  client.bjCount = 0;
  client.incBJCount = (message) => {
    client.bjCount += message.content.match(/(beetle[\s\.\,\*\|]*juice)/igm).length;
    console.log(client.bjCount);
    if (client.bjCount % 3 === 0) sendKeaton(message);
    return;
  }
}
