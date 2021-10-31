const selfHarmRX = /(kill\s((your)|(my))\s?self)|(k\s?(y|m)\s?s)/g

module.exports = async (message) => {
  const contentLowered = message.content.toLowerCase();

  if (message.client.getConfig().ignoredChannels.has(message.channel.id)) return;

  message.client.getRules('message-reacts').each( rule => {
    if (rule.ifs(message, contentLowered)) rule.reacts(message, message.client.emoji);
  });

  if (selfHarmRX.test(contentLowered)) {
    const atme = await message.client.users.fetch(message.client.getConifg().ownerID);
    await message.member.send({content:
      "Hey, are you doing okay? We're here for you. " +
      `Post in #sharks-helping-sharks or #main or wherever, `+
      `or DM ${atme} if you'd like to talk <3`
    });
  }
};
