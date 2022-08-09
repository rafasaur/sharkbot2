module.exports = {
  prep: (member) => {
    // everything should exist by default
    return;
  },

  check: (member) => {
    return (
      member.data.sentMessages > 68 &&
      member.data.sentChannelSet.size > 4 &&
      Date.now() - member.data.lastLevelUpDate.getTime() > 5 * 24 * 3600 * 1000
    )
  },

  approval: (member) => {return false;}, // approval not needed

  denied: (member) => {
    // no approval needed, nothing to do here
    return;
  }
}
