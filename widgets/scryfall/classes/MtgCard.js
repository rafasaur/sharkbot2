// aspects of this module from https://github.com/scryfall/servo/

const fetch = require('node-fetch')
const { apiUrl, responseTypes, useOldArt } = require('../scryfall-config');
const {compareTwoStrings} = require('string-similarity');

const { MessageEmbed } = require('discord.js');
const FlipPageEmbed = require('./FlipPageEmbed');

class MtgCard {
  constructor(cardName, responseFlag) {
    this.searchName = cardName;
    this.flag = responseFlag;
    //this.makeQuery();
  }

  async makeQuery() {
    if (this.flag === 'verbose') {
      let response = await this.searchQuery('');
      if (response.object === 'error') {
        this.sendType = 'error';
        this.sendData = response.details;
      }
      else if (response.data.length === 1){
        this.sendType = 'card';
        this.sendData = response.data[0];
      }
      else {
        this.sendType = 'list';
        this.sendData = response.data;
      }
      return this.sendType, this.sendData;
    }

    let response = await this.fuzzyQuery();
    if (response.object === 'error') {
      if (response.details.includes("No cards found matching")) {
        this.sendType = 'error';
        this.sendData = `No results found for ${this.searchName}`;
      }
      else if (response.type === 'ambiguous') {
        response = await this.searchQuery('');
        this.sendType = 'list';
        this.sendData = response.data;
      }
    }
    else if (response.object === 'card') {
      //console.log('made query')
      if (response.set_type === 'memorabilia') {
        this.sendType = 'error';
        this.sendData = `No results found for ${this.searchName}`;
      }
      else {
        this.sendType = 'card';
        this.sendData = response;
      }
    }
    return this.sendType, this.sendData;
  }

  fuzzyQuery() {
    return fetch(apiUrl + 'named?fuzzy=' + this.searchName)
      .then(response => response.json())
      .catch(err => console.log(err));
  }

  searchQuery(addTerms) {
    return fetch(apiUrl + 'search?q=' + this.searchName + addTerms)
      .then(response => response.json())
      .catch(err => console.log(err));
  }


  async send(channel) {
    await this.makeQuery();
    switch (this.sendType) {
      case 'error':
        channel.send(this.sendData);
        break;
      case 'list':
        channel.send(this.listCards(this.sendData));
        break;
      case 'card':
        this.makeCard(this.sendData)
          .then( async cardSides => {
            this.faces = cardSides;
            if (cardSides.length === 1) {
              channel.send(new MessageEmbed(cardSides[0]))//.then( msg => {
              //  setTimeout( () => {
              //    cardSides[0].thumbnail = cardSides[0].image;
              //    delete cardSides[0].image;
              //    msg.edit(new MessageEmbed(cardSides[0]))
              //  }, timeoutTime);
              //});
            }
            else new FlipPageEmbed( {
                pages:cardSides, channel:channel, setFooter:false
              }).createPages();
          });
    }
  }


  compareName(apiName) {
    return compareTwoStrings(this.searchName, apiName);
  }


  listCards(data) {
    let cards = [];
    data.forEach(card => {
      if (cards.length <= 20) cards.push(card.name);
    });
    const urlName = this.searchName.split(' ').join('+');
    return `Multiple matches found for \`${this.searchName}\`:\n`+
      `https://scryfall.com/search?q=${urlName}&unique=cards&as=grid&order=name\n` +
      `>>> ` + cards.join('\n');
  }


  async makeCard(data) {
    //this.data = data;
    this.layout = data.layout;
    this.apiName = data.name;
    this.url = data.scryfall_uri;
    this.imageUrls = [];

    let faces = [];
    switch (data.layout) {
      case 'normal':
      case 'split':
      case 'flip':
      case 'meld':
      case 'leveler':
      case 'saga':
      case 'adventure':
      case 'planar':
      case 'scheme':
      case 'vanguard':
      case 'token':
      case 'emblem':
      case 'augment':
      case 'host':
        this.imageUrls.push(data.image_uris.png);
        faces.push(this.makeFace(data, data.layout));
        break;

      case 'transform':
      case 'modal_dfc':
      case 'double_faced_token':
      case 'art_series':
      case 'double_sided':
        Object.values(data.card_faces).forEach(face => {
          faces.push(this.makeFace(face, 'normal'));
        });
        for (let i=0; i<faces.length; i++) {
          let refI = i+1;
          if (i === faces.length-1) refI = 0;
          faces[i].fields.push({
            name: 'Reverse:',
            value: faces[refI].title+'\n'+faces[refI].description
          });
        }
        if (this.compareName(faces[0].title) < this.compareName(faces[1].title)) return [faces[1], faces[0]];
        break;
    }
    return faces;
  }


  makeFace(data, layout) {
    let face = {};
    face.title = data.name;
    face.url = this.url;
    face.fields = [];
    let imageUrl = data.image_uris.png;
    this.imageUrls.push(data.image_uris.png);

    if (layout === 'split' || layout === 'flip') {
      Object.values(data.card_faces).forEach( side => {
        face.fields.push({
          name: side.name + '\t' + side.mana_cost,
          value: '*'+side.type_line + '*\n' + side.oracle_text
        });
      });
      face.image = { url: data.image_uris.png };
    }

    else {
      face.title += '\t' + data.mana_cost;
      face.description = '*' + data.type_line
      if (data.power && data.toughness) {
        face.description += "  ·  " + data.power +'/'+data.toughness;
      }
      if (data.loyalty) {
        face.description += '  ·  ' + data.loyalty;
      }
      face.description += "*\n" + data.oracle_text;
      face.image = { url: data.image_uris.png };
    }
    return face;
  }


}

module.exports = MtgCard;
