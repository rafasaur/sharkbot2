const { Intents } = require('discord.js')

module.exports = {

  // bot intents (typically use as few as necessary)
  intents: new Intents([
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Intents.FLAGS.GUILD_INVITES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGES
  ]),

  // partials to enable. 'CHANNEL' (default) allows for DMs
  partials: [
    'CHANNEL'
  ],

  // prefixes to use with commands. Messages must begin with commands to be used
  prefixes: [
    "!"
  ],

  // owner ids & tag. Special permissions granted (mostly for commands)
  ownerIds: [ ], ownerTag: '',

  // mod role ids. Special permissions granted (mostly for commands)
  modRoleIds: [

  ],

  // ignored channels for auto-responses (commands do NOT ignore these)
  ignoredChannels: new Set([

  ]),

  // slash commands will not be loaded in these guilds
  slashlessGuild: [

  ],

  // semi-depreciated for help command
  botAnnounceChId: "",
  mainChannelId: "",
  welcomeChannelId: "",

  // aesthetic choice for console log when readying
  logSpace: 3
}
