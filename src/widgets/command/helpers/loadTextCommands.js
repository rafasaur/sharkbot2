const fs = require("fs");  const path = require("path");
const { Collection } = require("discord.js");

function setCommands(filepath, commandCollection) {
  fs.readdirSync(filepath+'/commands/text')
    .filter( file => file.endsWith('.js'))
    .forEach( file => {
      const command = require(filepath+`/commands/text/${file}`).build();
      commandCollection.set(command.name, command)
    })
  return commandCollection;
}


module.exports = (client) => {
  const commands = new Collection();

  // go through every widget & build any text commands
  fs.readdirSync(path.resolve(__dirname, "../.."), {withFileTypes: true})
    .filter((obj) => obj.isDirectory() && client._checkActiveWidget(obj.name))
    .forEach((dir) => {
      const dirPath = path.resolve(__dirname,`../../${dir.name}`);
      if (fs.existsSync(dirPath+`/commands/text`)) {
        setCommands(dirPath, commands);
      }
    });

  // build any "top-level" text commands
  if (fs.existsSync(path.resolve(__dirname,`../../../../commands/text`))) {
    setCommands(path.resolve(__dirname,`../../../../`), commands);
  }

  client.commands.text = commands;
};
