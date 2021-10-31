module.exports = {
  prep: (member) => {
    // everything should exist by default
    return;
  },

  check: (member) => {
    return (
      member.data.sentMessages > 68 &&
      member.data.sentChannels.size > 4
    )
  },

  approval: (member) => {return false;}, // approval not needed

  denied: (member) => {
    // no approval needed, nothing to do here
    return;
  }
}
