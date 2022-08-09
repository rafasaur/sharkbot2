// Haiku.js
// class takes in message, checks for haiku, sends via calling sendHaiku() method
// based on https://github.com/turt2live/matrix-haiku-bot

const syllableCount = require('../helpers/syllableCount');
const { ChannelType } = require('discord.js');

const emojiReg = /[<][0-9a-zA-Z\S]+[>]/g;
const urlReg = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g;
const digReg = /[0-9]+/g;
const ignoredRegs = [urlReg,emojiReg];


module.exports = class Haiku {
  constructor(message) {
    this.content = message.content;
    this.channel = message.channel;
    this.author = message.author;

    this.allowedForms = message.client.getConfig('haiku').allowedForms || [ [5,7,5] ];
    this.archiveChannelId = message.client.getConfig('haiku').archiveChannel || '';

    //this.alwaysChannels = message.client.widgets.haiku.alwaysChannels;
    this.ignoredChannels = message.client.getConfig('haiku').ignoredChannels;
    this.tempChannels = message.client.getConfig('haiku').tempChannels;

    this.haikuLines = [];
    this.isHaiku = this._checkHaiku();
  }


  _checkHaiku () {
    for (const form of this.allowedForms) {
      if (this._checkForm(form)) return true;
    }
    return false;
  }


  _checkForm(form) {
    //console.log('checking form...')
    const content = this.content;
    let haikuLines = [];
    let lineSyllables = 0; let totalSyllables = 0; let currentLine = 0;

    const words = (content || "").split(/[\s]+/g);
    for (let word of words) {
      if (word.length === 0) continue; // skip any 0-length words from split()-ing
      if (word.search(/\d+/g) >= 0) return false; // syllable doesn't like digits
      if (ignoredRegs.some(reg => word.search(reg) >= 0) ) continue; // skip stuff we want to ignore
      const wordSyllables = syllableCount(word.replace(/[^a-zA-Z]/g,'')); // a little ham-fisted, but good enough
      if (wordSyllables === 0) return false; // just avoid unknown words

      if (lineSyllables + wordSyllables > form[currentLine]) return false; // not a haiku

      if (!haikuLines[currentLine]) haikuLines[currentLine] = '';
      haikuLines[currentLine] = haikuLines[currentLine] + " " + word;
      lineSyllables += wordSyllables;
      totalSyllables += wordSyllables;

      if (lineSyllables === form[currentLine]) {currentLine++; lineSyllables = 0;}
    }

    if (totalSyllables !== form.reduce((total,value) => total + value)) {
      //console.log(`total syllable check fail with ${totalSyllables}`);
      return false;
    }

    let completedHaikuLines = [];
    for (const line of haikuLines) {
      if (line.trim().length > 0) completedHaikuLines.push(line);
    }

    if (completedHaikuLines.length !== 3) { // fixes some weird edge cases
      let fixedLines = [];
      for (i = 0; i < 3; i++) {
        if (syllableCount(completedHaikuLines[i]) !== form[i]) return false;
        fixedLines.push(completedHaikuLines[i]);
      }
      completedHaikuLines = fixedLines;
    }
    //console.log(completedHaikuLines);
    this.haikuLines = completedHaikuLines;
    return true;
  }


  sendHaiku () {
    if ( // double-check
      this.ignoredChannels.has(this.channel.id) ||
      this.tempChannels.has(this.channel.id) ||
      !this.isHaiku
    ) return;

    let haikuText = '';
    for (const line of this.haikuLines) {
      haikuText += line.trim() + "\n";
    }
    haikuText = haikuText.trim();

    this.channel.send({ content: `A haiku by ${this.author}:\n>>> ` + haikuText}).then(async msg => {
      console.log(`\thaiku by ${this.author.tag} sent!`);
      if (this.channel.type === ChannelType.DM) return;
      const ogr = await msg.react('🚫');
      let repost = true;
      const filter = (reaction, user) => {
        if (user.bot) return false;
        if (user.id !== this.author.id) return false;
        else return true;
      }
      const collector = msg.createReactionCollector({filter, time:5*60*1000});
      collector.on("collect", async reaction => {
        if (reaction.partial) await reaction.fetch();
        if (reaction.emoji.name === '🚫') {msg.delete(); repost=false;}
      });
      collector.on("end", async () => {
        ogr.remove();
        if (
          repost &&
          this.archiveChannelId && this.archiveChannelId.length > 0 &&
          this.channel.type !== ChannelType.DM
        ) {
          const archiveChannel = await this.channel.guild.channels.fetch(this.archiveChannelId);
          archiveChannel.send(`A haiku by \`${this.author.tag}\`:\n>>> ` + haikuText);
        }
      });
    });
  }
}
