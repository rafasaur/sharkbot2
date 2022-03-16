module.exports = {
  check: async (member, [idCurr, idNext]) => {
    const level = member.data.level;
    const leveler = member.client.getRules('levels').get(`go${level}${level+1}`);
    //console.log(`level${level}${level+1}`);
    if (
      member.roles.cache.some(role => idCurr === role.id) &&
      leveler.check(member)
    ){
      member.data.levelUpApproved = !leveler.approval(member);
      return true;
    }
    return false;
  },


  approved: async (member, [idCurr,idNext]) => {
    if (
      !member.data.levelUpReady ||
      !member.data.levelUpApproved
    ) {
      return;
    }
    await member.roles.add(idNext);
    member.roles.remove(idCurr);
    member.data.lastLevelUpDate = new Date();
    const level = member.data.level;

    const logMsg = `${member.user.tag} LEVEL UP (${level} -> ${level+1})`;
    console.log(logMsg);
    await member.client.channels.fetch(member.client.getConfig('levels').levelLogChId)
              .then(ch => ch.send({content: logMsg}));

    await member.client.getRules('levels').get(`go${level+1}${level+2}`).prep(member);
    member.data.levelUpAlerted = false;
    return ++member.data.level;
  },


  denied: async (member) => {
    await member.client.getRules('levels').get(`go${level}${level+1}`).denied(member);
    member.data.levelUpAlerted = false;
    return;
  },
};
