const getEmoji = (messageReaction) => {
  return messageReaction.emoji.id || messageReaction.emoji.name;
};

const getMember = async (rule, user) => {
  const channel = await user.client.channels.fetch(rule.channelId);

  return channel && channel.guild.members.fetch(user);
};

const assignRoles = async (rule, roleIds, member) => {

  if (!rule.isUnique) {
    roleIds.forEach( async (roleId) => {
      await member.roles.add(roleId);
      let thisRole = await member.guild.roles.fetch(roleId);
      console.log(`adding role ${thisRole.name} to ${member.user.tag}`);
    });
  }

  else {
    await member.roles.cache.each( role => {
      if (!Object.values(rule.emojiRoleMap).flat().includes(role.id)) {
        roleIds.add(role.id);
      }
    })
    member.roles.set(Array.from(roleIds));
  }
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

  const rule = user.client.reactionRoleRules[messageReaction.message.id];
  let roleIds = new Set(rule.emojiRoleMap[getEmoji(messageReaction)]);

  if (rule.reactAgnostic) {
    rule.emojiRoleMap["any-emoji"].forEach( (roleId) => roleIds.add(roleId) );
  }

  if (!roleIds || roleIds.size < 1) return;

  const member = await getMember(rule, user);
  if (!member) return;

  await assignRoles(rule, roleIds, member);

};
