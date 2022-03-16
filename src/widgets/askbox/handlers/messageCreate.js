
function containsAnon (text, anons) {
  const word0 = text.split(' ')[0];
  return anons.map(str => '['+str+']').includes(word0);
}

module.exports = async (message) => {
  const config = message.client.getConfig('askbox');
  if (
    message.channel.id !== config.askChId ||
    message.member.isMod()
  ) return;

  if (!config.sendToChId && !config.ccToDM) {
    message.author.send(`askbox is not functioning at the moment! Please DM a mod`)
      .then( () => message.delete() )
      .then( console.error("askbox: asks will not be copied!") )
    return;
  }

  let newContent = ``;
  if (
    !config.allowAnon || !containsAnon(message.content.trim(), config.anonPrefixes)
  ) newContent = `ask from \`${message.author.tag}\`:\n>>> `;
  console.log(newContent);

  newContent += message.content;

  if (config.sendToChId) {
    await message.client.channels.fetch(config.sendToChId)
            .then(async ch => ch.send({
              content: newContent,
              //attachments: message.attachments
            }))
  }

  if (config.ccToDM) {
    await message.client.getConfig().ownerIds.forEach(usrId => {
      message.client.users.fetch(usrId)
        .then(usr => usr.send({
          content: newContent,
          //attachments: message.attachments
        }))
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
