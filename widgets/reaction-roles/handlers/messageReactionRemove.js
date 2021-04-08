const getEmoji = (messageReaction) => {
  return messageReaction.emoji.id || messageReaction.emoji.name;
};

const getMember = async (rule, user) => {
  const channel = await user.client.channels.fetch(rule.channelId);

  return channel && channel.guild.members.fetch(user);
};

const removeRoles = async (rule, roleIds, member) => {
  roleIds.forEach((roleId) => {
    member.roles.remove(roleId);
    console.log(`removing role ${roleId} from ${member.user.tag}`);
  });
};

module.exports = async (messageReaction, user) => {
  if (
    user.bot ||
    user.system ||
    messageReaction.message.channel.type !== "text" ||
    !(messageReaction.message.id in user.client.reactionRoleRules)
  ) {
    return;
  }

  //messageReaction.users.remove(user);

  const rule = user.client.reactionRoleRules[messageReaction.message.id];
  const roleIds = rule.emojiRoleMap[getEmoji(messageReaction)];
  if (!roleIds) {
    return;
  }

  const member = await getMember(rule, user);
  if (!member) {
    return;
  }

  removeRoles(rule, roleIds, member);
};
