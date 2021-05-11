
module.exports = async (messageReaction, user) => {
  if (
    user.bot || user.system ||
    messageReaction.message.channel.type !== "text" ||
    !(messageReaction.message.id in user.client.reactionRoleRules)
  ) return;

  const rule = user.client.reactionRoleRules[messageReaction.message.id];
  rule.removeRoles(messageReaction, user);
};
