const fs = require("fs");  const path = require("path");
const { Collection } = require("discord.js");

const checkActiveWidget = (clientWidgetsConfig, widgetName) => {
  const thisConfig = require(`../../${widgetName}/${widgetName}-config`);
  return (
    widgetName === 'command' || // commands always active
    (clientWidgetsConfig.widgetName && clientWidgetsConfig.widgetName.active) ||
    (thisConfig && thisConfig.active)
  )
}

module.exports = (client) => {
  const commands = new Collection();
  
  fs.readdirSync(path.resolve(__dirname, "../.."), {withFileTypes: true})
    .filter((obj) => obj.isDirectory() && checkActiveWidget(client.config.widgets,obj.name))
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
