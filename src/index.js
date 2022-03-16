require('dotenv').config();
const ClientPlus = require('./util/ClientPlus');
const mainConfig = require('../.configs/.bot');

const client = new ClientPlus({
  intents: mainConfig.intents,
  partials: mainConfig.partials,
});

//client.config = require("../.config/.bot");
//client.widgets = require("./config").widgets;
//client.turnedOn = new Date();

//require("./core/loadWidgetListeners")(client);
client.config = mainConfig;
client.loadClientPlus();

client.login(process.env.TOKEN).catch((error) => {
  console.error(error);
  process.exit(1);
});

client.on("ready", async () => {
  //await client.user.setStatus("you're telling me a queer coded me?");
  await client.user.setPresence({
    status: "online",
    activities: [{
      name: 'smooth...',
      type: "LISTENING"
    }]
  });
  console.log('');
});
