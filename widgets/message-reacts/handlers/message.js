const selfHarmList = ['kill yourself', 'kill myself', 'kill your self',
'kill my self', 'kys', 'kms', 'k y s', 'k m s'];

const { rules } = require('../helpers/reactRules');

module.exports = async (message) => {

  const contentLowered = message.content.toLowerCase();

  for (const rule of rules) {
    if (rule.ifs(message, contentLowered)) rule.reacts(message, message.client.emoji);
  }

  if (selfHarmList.filter( alert => contentLowered.includes(alert) ).length > 0) {
    const atme = message.client.users.fetch(message.client.config.ownerID);
    await message.member.send("Hey, are you doing okay? We're here for you. " +
    `Post in #sharks-helping-sharks or #main or wherever, `+
    `or DM ${atme} if you'd like to talk <3`);
  }
};
