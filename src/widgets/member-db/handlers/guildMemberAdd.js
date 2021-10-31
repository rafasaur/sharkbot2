const checkMemberDbExists = (client,guildID,memberID) => {
  return
    client.guildDbs &&
    client.guildDbs[guildID] &&
    client.guildDbs[guildID][memberID];
};

const smoothReturns = async (member) => {
  const recoveryData = member.client.guildDbs[member.guild.id][member.id]

  Object.keys(recoveryData).forEach( key => {
    member.data[key] = recoveryData[key];
  });
  member.data.sentChannels = new Set(recoveryData.sentChannels);
  member.data.lastLevelUp = new Date(recoveryData.lastLevelUp);

  member.nickname = recoveryData.nickname;

  await recoveryData.roleList.forEach( roleId => {
    member.roles.add(roleId);
  });

  delete member.data.nickname;
  delete member.data.roleList;
  member.client.guildDbs[member.guild.id][member.id].smoothed = false;

  return member;
};

module.exports = (member) => {
  member.createBlankData();
};
