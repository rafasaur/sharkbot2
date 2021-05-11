const config = require('../scryfall-config');
const { MessageEmbed } = require('discord.js');

const MtgCard = require('../classes/MtgCard');

const negotiateMatch = (match) => {
  let cardName = match.substring(0, match.length-2).substring(2);
  const token = cardName.slice(0,1);
  let responseFlag = 'default';
  if (Object.keys(config.responseTypes).includes(token)) {
    cardName = cardName.slice(1);
    responseFlag = config.responseTypes[token];
  }
  return { cardName, responseFlag }
};

const makePromise = (client, cardName, responseClass) => {
  return new Promise((resolve, reject) => {
    try {
      new responseClasses.TextResponse(client, cardName)
        .embed().then(embed => resolve(embed));
    } catch(err) {
      reject(err);
    }
  });
};

module.exports = (message) => {
   let cardsToPost = [];
   const client = message.client;
   const pattern = config.pattern;

   const matches = message.content.match(pattern);
   if (!matches) return;

   matches.forEach(match => {
     const { cardName, responseFlag } = negotiateMatch(match);
     const card = new MtgCard(cardName, responseFlag);
     cardsToPost.push(card);
   });

   cardsToPost.forEach(card => {
     card.send(message.channel);
   })

   //Promise.all(promises).then( embeds => {
  //   embeds.forEach( embed => {
  //     if (embed.length === 1) message.channel.send(new MessageEmbed(embed[0]));
  //     else new EmbedFlipCard({pages:embed, channel:message.channel, setFooter:false}).createPages();
  //   });
  // }).catch(err => console.error(err));
}
