const {Collection} = require('discord.js');
const cron = require('node-cron');
const Alarm = require('../classes/Alarm');

module.exports = (client) => {
  const config = client.getConfig('alarms');

  config.alarms = new Collection();
  client.getRules('alarms').each( rule => {
    const timezone = rule.timezone || config.defaultTimezone;

    const alarm = new Alarm(client, rule);
    const job = cron.schedule(
      rule.cronTime,
      () => {
        alarm.sendMessage();
      }, {
        scheduled: true,
        timezone: timezone
    });
    config.alarms.set(rule.title, {alarm: alarm, job: job});
  });

  client.setConfig(config);
  client.logReady("alarms");
}
