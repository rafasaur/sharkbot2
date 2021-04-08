module.exports = (client) => {
  console.log(`member-db:\tready`);
  require('../helpers/readDbData')(client);
  require('../helpers/loadClientDbExp.js')(client);
  client.readAllGuildFiles();
  setInterval( () => client.writeAllGuildsToFile(), 
    6*60*60*1000 // write every 6 hours?
);
};
