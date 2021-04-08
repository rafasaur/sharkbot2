const vintageUnsmooth = async (member, smoothed) => {
  member.send("Welcome back!");
  console.log(`${member.user.tag} is rough once more!`);

  const returnKing = smoothed[member.user.id];

  // add back each role that isn't @everyone
  console.log(`adding roles...`)
  member.roles.add(returnKing.roles);

  // set nickname
  if (returnKing.nickname) {
    await member.setNickname(returnKing.nickname);
    console.log(`nickname set!`);
  }

  // and remove them from the smoothed log
  await delete smoothed[member.user.id];
  await fs.writeFileSync(`./smoothed/smoothers.json`,JSON.stringify(smoothed));
  console.log(`welcome back ${member.user.tag}!`);
};


module.exports = (member) => {
  try {
    member.updateDataClient();
    member.data.smoothed = false;
  } catch (err) {
    console.error(`member-db not enabled, vintage-ly unsmoothing\n\t${err}`);

  }

  let smoothed = JSON.parse(fs.readFileSync(`../commands/smoothed/smoothers.json`,'utf8'));
  if (smoothed && Object.keys(smoothed).includes(member.user.id)) {
    console.log(`vintage unsmoothing!`);
    return vintageUnsmooth(member, smoothed);
  }

  else if (member.client.smoothers[member.user.id]) {
    console.log(`new unsmoothing!`);
    return;
  }
};
