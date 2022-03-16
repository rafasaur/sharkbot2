const GuildDatabase = require('../classes/GuildDatabase');

module.exports = (client) => {
  client.guildDbs = {}
  client.guilds.cache.each(guild => {
    let thisGuildDb = new GuildDatabase(guild);
    client.guildDbs[guild.id] = thisGuildDb;
    guild.database = thisGuildDb;
  })

  setInterval( () => {
    console.log(`guild database timer:`)
    client.guilds.cache.each(guild => guild.database.writeDbToFile());
    },
    6*60*60*1000 // write every 6 hours?
  );

  client.logReady('new-db')
}
