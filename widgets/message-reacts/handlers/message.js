const selfHarmList = ['kill yourself', 'kill myself', 'kill your self',
'kill my self', 'kys', 'kms', 'k y s', 'k m s'];

module.exports = async (message) => {
  const client = message.client;
  const config = client.config;
  const contentLowered = message.content.toLowerCase();
  if (
    contentLowered.includes("sharkbot") ||
    contentLowered.includes("shark bot") ||
    contentLowered.includes("tysb") ||
    contentLowered.includes("sb ") ||
    contentLowered.includes(" sb") ||
    contentLowered === "sb"
  ) {
    message.react(message.client.emoji.sharkbot);
  }

  if (
    message.author.isUser() && (
    contentLowered.includes("fullmetal alchemist") ||
    contentLowered.includes("full metal alchemist") ||
    contentLowered.includes("fma ") ||
    contentLowered.includes(" fma") ||
    contentLowered === "fma" )
  ) {
    message.channel.send(`***FULLMETAL ALCHEMIST***`);
  }

  if (
    message.channel.type === 'DM' &&
    !client.config.ownerIds.includes(message.author.id)
  ) {
    client.users.fetch(client.config.ownerId)
      .then( user => user.send(
      `DM from ${message.author.tag}:\n>` + message.content)
    );
  }

  for (const alert of selfHarmList) {
    if (
      contentLowered.includes(alert)
    ) {
      const atme = message.client.users.fetch(config.ownerID);
      await message.member.send("Hey, are you doing okay? We're here for you. " +
      `Post in #sharks-helping-sharks or #main or wherever, `+
      `or DM ${atme} if you'd like to talk!`);
      break;
    }
  }
};
