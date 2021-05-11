module.exports = {
  active: true,
  pattern: /\[\[([^\]]+)\]\]/g, // this regex is what it'll look to find a card search
  apiUrl: 'https://api.scryfall.com/cards/', 
  timeoutTime: 10* 60* 1000,
  responseTypes: {
    '!': 'image',
    '?': 'legal',
    '~': 'verbose'
  }
}
