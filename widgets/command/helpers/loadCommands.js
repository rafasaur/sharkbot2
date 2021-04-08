const fs = require("fs");
const path = require("path");
const { Collection } = require("discord.js");

module.exports = (client) => {
  const commands = new Collection();
  //console.log(`${__dirname}`);
  fs.readdirSync(path.resolve(__dirname, "../.."), {withFileTypes: true})
    .filter((obj) => obj.isDirectory())
    .forEach((dir) => {
      fs.readdirSync(path.resolve(__dirname,`../../${dir.name}`), {withFileTypes:true})
      .filter((obj) => obj.isDirectory())
      .filter((obj) => obj.name === `commands`)
      .forEach((commandDir) => {
        fs.readdirSync(path.resolve(__dirname,`../../${dir.name}/commands`))
        .filter((file) => file.endsWith(".js"))
        .forEach((file) => {
          const command = require(`../../${dir.name}/commands/${file}`).build();
          commands.set(command.name, command);
        })
      })
    });

  client.commands = commands;
};
