//haiku.js
// haiku config file

module.exports = {
  active: false,

  // allowed haiku forms. 5,7,5 is the default; 3,5,3 is also common
  allowedForms: [
    [5,7,5]
  ],

  // never make haiku on these channels. Also ignores default ignored channels from .config/.bot.js
  ignoredChannels: new Set([

  ]),

  // always make haiku on these channels (ignores frequency). Override default ignored channels from .config/.bot.js
  alwaysChannels: new Set([

  ]),

  // post all copies of all haiku here (if given)
  archiveChannel: '',

  // how frequently to re-post a haiku when a valid one is found
  frequency: .420,
}
