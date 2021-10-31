// scryfall.js
// scryfall config file

module.exports = {
  active: true,

  // pattern that calls scryfall search. Default looks for "[[search terms]]"
  pattern: /\[\[([^\]]+)\]\]/g,

  // scryfall API address. Change only if scryfall changes the address
  apiUrl: 'https://api.scryfall.com/cards/',

  // depreciated. if true, uses oldest art for displaying cards (new art bad :/ )
  useOldArt: false,

  // time multi-faced cards are "flippable," in ms
  timeoutTime: 10* 60* 1000,

  // prefixes for search times to specify information.
  // E.g., [[!search terms]] would display only image of found card (by default)
  responseTypes: {
    '!': 'image',
    '?': 'legal',
    '~': 'verbose'
  }
}
