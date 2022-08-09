
const fs = require("fs");  const path = require("path");
const { Collection } = require("discord.js");

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();


function getSlashCommands(filepath, slashArray, slashCollection) {
  fs.readdirSync(filepath+'/commands/slash')
    .filter( file => file.endsWith('.js') && !file.startsWith('!'))
    .forEach( (file) => {
      const slashCommand = require(filepath+`/commands/slash/${file}`);
      slashArray.push(slashCommand.data.toJSON());
      slashCollection.set(slashCommand.data.name, slashCommand);
    })
  return slashArray;
}


module.exports = async (client) => {
  const config = client.getConfig();
  const slashCommands = [];
  const slashCollection = new Collection();

  // check each widget for slash commands folder and load any found
  fs.readdirSync(path.resolve(__dirname, "../.."), {withFileTypes: true})
    .filter((obj) => obj.isDirectory() && client._checkActiveWidget(obj.name))
    .forEach((dir) => {
      const dirPath = path.resolve(__dirname, `../../${dir.name}`);
      if (fs.existsSync(dirPath+`/commands/slash`)) {
        getSlashCommands(dirPath, slashCommands, slashCollection);
      }
    });

  // load any "top-level" slash commands
  if (fs.existsSync(path.resolve(__dirname,`../../../../commands/slash`))) {
    getSlashCommands(path.resolve(__dirname,`../../../../`), slashCommands, slashCollection);
  }

  client.commands.slash = slashCollection;


  const rest = new REST({version: '9'}).setToken(process.env.TOKEN);

  client.guilds.cache.each(async guild => {
    if (config.slashlessGuilds.includes(guild.id)) return;
    try {
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, guild.id),
        {body: slashCommands.filter(slash => !slash.pushOption || slash.pushOption !== 'global')}
      );
    } catch (error) {
      console.log(error)
    }
    console.log(`\tloaded slash commands in ${guild.name}`);
  });


  try {
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      {body: slashCommands.filter(slash => slash.pushOption === 'global')}
    );
  } catch (error) {
    console.log(error);
  }
  console.log(`\tpushed global slash commands`);
};
