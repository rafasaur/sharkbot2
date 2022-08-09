const {Collection} = require('discord.js');
const cron = require('node-cron');
const Alarm = require('../classes/Alarm');

module.exports = (client) => {
  const config = client.getConfig('alarms');

  config.alarms = new Collection();
  client.getRules('alarms').each( async rule => {

    const alarm = await new Alarm(client, rule);
    const job = cron.schedule(
      alarm.cronTime,
      async () => {
        await alarm.sendMessage();
      }, {
        scheduled: true,
        timezone: alarm.timezone
    });
    config.alarms.set(rule.name, {alarm: alarm, job: job});
  });

  client.setConfig(config);
  client.logReady("alarms");
}
