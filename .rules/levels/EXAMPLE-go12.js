module.exports = {
  prep: (member) => {
    // everything should exist by default
    return;
  },

  check: (member) => {
    return (
      member.data.sentChannelSet.size > 9 &&
      member.data.sentMessages > 99 &&
      member.data.recentMessages > 20 &&
      Date.now() - member.data.lastLevelUpDate.getTime() > 28 * 24 * 60 * 60 * 1000
    )
  },

  approval: (member) => {return true;}, // approval necessary

  denied: (member) => {
    member.data.lastLevelUpDate = new Date();
    return;
  }
}
