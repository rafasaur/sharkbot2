const fs = require("fs");
const path = require("path");

const clientPreferred = ["nickname","roleList"]

const getPreferredValue = (key,clientVal,readVal) => {
  if (clientPreferred.includes(key)) return clientVal;
  return readVal;
};

module.exports = (client) => {
  client.readAllGuildFiles = () => {
    client.guilds.cache.each(guild => {
      client.readGuildFile(guild);
    })
  };

  client.readGuildFile = async (guild) => {
    const filePath = path.resolve(__dirname, `../guild-files/${guild.id}.json`);
    const readGuildData = await JSON.parse(fs.readFileSync(filePath,'utf8'));

    if (!client.guildDbs[guild.id]) {
      client.guildDbs[guild.id] = readGuildData;
      return;
    }

    readGuildData.forEach(mem => {
      if (!client.guildDbs[guild.id][mem.id]) {
        return client.guildDbs[guild.id][mem.id] = mem;
      }
      Object.keys(mem).forEach( key => {
        if (!client.guildDbs[guild.id][mem.id][key]) {
          return client.guildDbs[guild.id][mem.id][key] = mem[key];
        }
        client.guildDbs[guild.id][mem.id][key] = getPreferredValue(key,client.guildDbs[guild.id][mem.id][key],mem[key]);
      });
    })
  };
}
