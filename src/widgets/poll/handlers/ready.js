module.exports = (client) => {
  const config = client.getConfig('poll');
  if (config.maxNumOptions > config.optionEmoji.length) {
    console.warn('\t max number of poll options exceeds length of option emoji!!')
  }
  if (config.maxNumOptions < 2 || config.optionEmoji.length < 2) {
    console.warn(`\t you don't have enough poll options???`)
  }

  client.logReady("poll");

}
