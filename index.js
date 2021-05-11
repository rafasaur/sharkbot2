const { Client } = require("discord.js");
const { token } = require("./config");

const client = new Client();

client.config = require("./config");
client.widgets = require("./config").widgets;
client.turnedOn = new Date();

require("./core/loadWidgetListeners")(client);

client.login(client.config.token).catch((error) => {
  console.error(error);
  process.exit(1);
});

client.on("ready", async () => {
  await client.user.setPresence({
    status: "online",
    game: {
      name: 'smooth...',
      type: "LISTENING"
    }
  });
  console.log('');
});
