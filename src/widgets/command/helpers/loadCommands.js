const fs = require("fs");  const path = require("path");
const { Collection } = require("discord.js");

function setCommands(filepath, commandCollection) {
  fs.readdirSync(filepath+'/commands')
    .filter( file => file.endsWith('.js'))
    .forEach( file => {
      const command = require(filepath+`/commands/${file}`).build();
      commandCollection.set(command.name, command)
    })
  return commandCollection;
}


module.exports = (client) => {
  const commands = new Collection();

  fs.readdirSync(path.resolve(__dirname, "../.."), {withFileTypes: true})
    .filter((obj) => obj.isDirectory() && client._checkActiveWidget(obj.name))
    .forEach((dir) => {
      fs.readdirSync(path.resolve(__dirname,`../../${dir.name}`), {withFileTypes:true})
        .filter((obj) => obj.isDirectory() && obj.name === 'commands')
        .forEach((commandDir) => {
          setCommands(path.resolve(__dirname,`../../${dir.name}`), commands)
        })
    });

  if (fs.existsSync(path.resolve(__dirname,`../../../../commands`))) {
    setCommands(path.resolve(__dirname,`../../../../`), commands);
  }

  client.commands = commands;
};
