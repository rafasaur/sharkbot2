module.exports = {
  check: async (member, [idCurr, idNext]) => {
    const level = member.data.level;
    //console.log(`level${level}${level+1}`);
    if (
      member.roles.cache.some(role => idCurr === role.id) &&
      require(`./go${level}${level+1}`).check(member)
    ){
      member.data.levelUpApproved = !require(`./go${level}${level+1}`).approval(member);
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
    member.data.lastLevelUp = new Date();
    const level = member.data.level;

    console.log(`${member.user.tag} LEVEL UP (${level} -> ${level+1})`);

    await require(`./go${level+1}${level+2}`).prep(member);
    return ++member.data.level;
  },

  denied: (member) => {
    require(`./go${level}${level+1}`).denied(member);
    return;
  },
};
