const selfHarmRX = /(kill\s((your)|(my))\s?self)|(k\s?(y|m)\s?s)/g

const { rules } = require('../rules/reactRules');

module.exports = async (message) => {

  const contentLowered = message.content.toLowerCase();

  if (message.client.config.ignoredChannels.has(message.channel.id)) return;

  for (const rule of rules) {
    if (rule.ifs(message, contentLowered)) rule.reacts(message, message.client.emoji);
  }

  if (selfHarmRX.test(contentLowered)) {
    const atme = message.client.users.fetch(message.client.config.ownerID);
    await message.member.send("Hey, are you doing okay? We're here for you. " +
    `Post in #sharks-helping-sharks or #main or wherever, `+
    `or DM ${atme} if you'd like to talk <3`);
  }
};
