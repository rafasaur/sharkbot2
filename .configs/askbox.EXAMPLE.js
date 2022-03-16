// askbox.js
// askbox config file

module.exports = {
  active: true,

  // channel id where members post
  askChId: "",

  // channel id where copies are sent (e.g., mods-only channel)
  sendToChId: "",

  // if true, deletes original message sent to askCh
  private: true,

  // if true, send a copy to bot Owners
  ccToDM: true,

  // if true, senders can remain anonymous by including a prefix in their message
  allowAnon: false,

  // allowed prefixes, in brackets (example message: "[anon] mods sucks :(" )
  anonPrefixes: [
    'a', 'anon', 'anonymous'
  ]
}
