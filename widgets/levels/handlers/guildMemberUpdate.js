const updateUserFromUpdate = async (member) => {
  await member.preCheck();
  member.checkLevelUp();
}

module.exports = (oldMember, newMember) => {
  if (
    newMember.user.isUser()
  ){
    //updateUserFromUpdate(newMember);
  }
}
