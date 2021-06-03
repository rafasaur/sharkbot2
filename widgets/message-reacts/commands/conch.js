const fs = require('fs'); const path = require('path');
const {MessageAttachment} = require('discord.js');
const CommandBuilder = require("../../command/classes/CommandBuilder");

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

const sendImg = async (message) => {
  const imgList = fs.readdirSync(path.resolve(__dirname, "../content"))
    .filter((file) => /conch-\S*.png/ig.test(file));

  const imgSend = path.resolve(__dirname, `../content/${imgList[getRandomInt(0,imgList.length)]}`);

  return message.channel.send( new MessageAttachment(imgSend) );
};


module.exports = new CommandBuilder()
  .setName("conch")
  .setOwnersOnly(false)
	.setModsOnly(false)
  .setGuildOnly(false)
  .setRequireArgs(false)
  .setDeletable(false)
  .setCooldown(0)
  .setDisabled(false)
  .setExecute(async (message, user, args) => {

    sendImg(message);

    //message.react('🐚');
  });
