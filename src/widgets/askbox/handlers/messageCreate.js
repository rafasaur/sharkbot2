
function containsAnon (text, anons) {
  const word0 = text.split(' ')[0];
  return anons.map(str => '['+str+']')
              .includes(word0)
}

module.exports = async (message) => {
  const config = message.client.getConfig('askbox');
  if (
    message.channel.id !== config.askChId ||
    message.member.isMod()
  ) return;

  let newContent = '';
  if (
    !config.allowAnon || !containsAnon(message.content.trim(), config.anonPrefixes)
  ) newContent.concat(`ask from \`${message.author.tag}\`:\n>>> `);
  
  newContent.concat(message.content);

  if (config.sendToChId) {
    await message.client.channels.fetch(config.sendToChId)
            .then(async ch => ch.send({content: newContent}))
  }

  if (config.ccToDM) {
    await message.client.getConfig().ownerIds.forEach(usrId => {
      message.client.users.fetch(usrId)
        .then(usr => usr.send({content: newContent}))
    })
  }

  if (config.private) message.delete()

/**
  message.client.channels.fetch(config.sendToChId)
    .then(async ch => ch.send({content: newContent}))
    .then( () => {
      if (config.ccToDM) {
        message.client.getConfig().ownerIds.forEach(usrId => {
          message.client.users.fetch(usrId)
            .then(usr => usr.send({content: newContent}))
        });
      }
    })
    .then( () => { if (config.private) message.delete()} )
*/
  console.log('ask sent!');
}
