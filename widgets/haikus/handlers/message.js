// code based on https://github.com/turt2live/matrix-haiku-bot
// note 'syllable' is a much more effective package than 'syllables'

const syllables = require('syllable');
const config = require('../haikus-config');
const allowedForms = config.allowedForms || [ [5,7,5] ];
const ignoredChannels = config.ignoredChannels || [];
const alwaysChannels = config.alwaysChannels || [];
const frequency = Math.min(config.frequency, 1) || 1;


const sendGoodHaiku = (completedHaikuLines, channel, author) => {
  let haiku = '';
  for (const line of completedHaikuLines) {
    haiku += line.trim() + "\n";
  }
  haiku = haiku.trim();

  return channel.send(`A haiku by ${author}:\n>>> ` + haiku);
}


const haikuCheck = (content, form) => {
  let haikuLines = [];
  let lineSyllables = 0;
  let totalSyllables = 0;
  let currentLine = 0;

  const words = (content || "").split(/[\s\t\n]+/g);
  for (let word of words) {
    //if (word.search(/:[0-9a-zA-Z\S]+:/g)) continue; // should ignore :emoji:
    let wordSyllables = syllables(word.replace(/[^0-9a-zA-Z]/g,''));
    if (wordSyllables === 0) return false; // just avoid unknown words

    const requiredForLine = form[currentLine];
    if (lineSyllables + wordSyllables > requiredForLine) return false; // not a haiku

    if (!haikuLines[currentLine]) haikuLines[currentLine] = '';
    haikuLines[currentLine] = haikuLines[currentLine] + " " + word;
    lineSyllables += wordSyllables;
    totalSyllables += wordSyllables;

    if (lineSyllables === requiredForLine) {currentLine++; lineSyllables = 0;}
  }

  if (totalSyllables !== form.reduce((total,value) => total + value)) {
    //console.log(`total syllable check fail with ${totalSyllables}`);
    return false;
  }

  let completedHaikuLines = [];
  for (const line of haikuLines) {
    if (line.trim().length > 0) completedHaikuLines.push(line);
  }

  if (completedHaikuLines.length !== 3) {
    //console.log('line check fail'); return;
    let fixedLines = [];
    for (i = 0; i < 3; i++) {
      if (syllables(completedHaikuLines[i]) !== form[i]) return false;
      fixedLines.push(completedHaikuLines[i]);
    }
    completedHaikuLines = fixedLines;
  }

  return completedHaikuLines;
}


module.exports = async (message) => {
  if (
    message.author.bot ||
    ignoredChannels.includes(message.channel.id) ||
    (
      Math.random() > frequency &&
      message.channel.type !== 'DM' &&
      !alwaysChannels.includes(message.channel.id)
    )
  ) return;

  for (const expectedSyllables of allowedForms) {
    const completedHaikuLines = haikuCheck(message.content,expectedSyllables);
    if (completedHaikuLines) {
      return sendGoodHaiku(completedHaikuLines, message.channel, message.author);
    }
  }
  //console.log(`no haikus could be made!`)
  return;
}
