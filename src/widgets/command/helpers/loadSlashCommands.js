
const fs = require("fs");  const path = require("path");
const { Collection } = require("discord.js");

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();


function getSCommands(filepath, scommandArray, scommandCollection) {
  fs.readdirSync(filepath+'/scommands')
    .filter( file => file.endsWith('.js') && !file.startsWith('!'))
    .forEach( (file) => {
      const scommand = require(filepath+`/scommands/${file}`);
      scommandArray.push(scommand.data.toJSON());
      scommandCollection.set(scommand.data.name, scommand);
    })
  return scommandArray;
}


module.exports = async (client) => {
  const config = client.getConfig();
  const scommands = [];
  const scollection = new Collection();

  fs.readdirSync(path.resolve(__dirname, "../.."), {withFileTypes: true})
    .filter((obj) => obj.isDirectory() && client._checkActiveWidget(obj.name))
    .forEach((dir) => {
      fs.readdirSync(path.resolve(__dirname,`../../${dir.name}`), {withFileTypes:true})
        .filter((obj) => obj.isDirectory() && obj.name === 'scommands')
        .forEach((scommandDir) => {
          getSCommands(path.resolve(__dirname,`../../${dir.name}`), scommands, scollection)
        })
    });

  if (fs.existsSync(path.resolve(__dirname,`../../../../scommands`))) {
    getSCommands(path.resolve(__dirname,`../../../../`), scommands, scollection);
  }

  client.scommands = scollection;


  const rest = new REST({version: '9'}).setToken(process.env.TOKEN);

  client.guilds.cache.each(async guild => {
    if (config.slashlessGuilds.includes(guild.id)) return;
    try {
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, guild.id),
        {body: scommands.filter(scommand => !scommand.pushOption || scommand.pushOption !== 'global')}
      );
    } catch (error) {
      console.log(error)
    }
    console.log(`\tloaded slash commands in ${guild.name}`);
  });


  try {
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      {body: scommands.filter(scommand => scommand.pushOption === 'global')}
    );
  } catch (error) {
    console.log(error);
  }
  console.log(`\tpushed global slash commands`);
};
