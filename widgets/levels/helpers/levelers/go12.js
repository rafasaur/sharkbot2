module.exports = {
  prep: (member) => {
    // everything should exist by default
    return;
  },

  check: (member) => {
    return (
      member.data.sentChannels.size > 9 &&
      now.getTime() - member.data.lastLevelUp.getTime() > 28 * 24 * 60 * 60 * 1000
    )
  },

  approval: (member) => {return true;}, // approval necessary

  denied: (member) => {
    member.data.lastLevelUp = new Date();
    return;
  }
}
