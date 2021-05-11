const { CronJob } = require("cron");
const { timezone, rules } = require("../alarms-config.js").alarms;
const CronBot = require(`../classes/CronBot`);

module.exports = async (client) => {
  console.log("alarms:\t\tready");

  rules.forEach((rule) => {
    const bot = new CronBot(client, rule);
    new CronJob(
      rule.cronExpression,
      () => bot.sendMessage(),
      null,
      true,
      timezone
    );
  });
};
