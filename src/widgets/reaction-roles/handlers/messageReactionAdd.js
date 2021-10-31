
module.exports = async (messageReaction, user) => {
  const config = user.client.getConfig('reaction-roles');
  if (
    user.bot || user.system ||
    !config.reactors.has(messageReaction.message.id)
  ) return;

  const rule = config.reactors.get(messageReaction.message.id);
  rule.addRoles(messageReaction, user);
};
