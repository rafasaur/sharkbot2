
module.exports = async (message) => {
  if ( !message.author.isUser() || !message.isUserMessage() ) {
    return;
  }

  if (
    message.client.getConfig('log').ccDM &&
    (message.channel.type === 'DM' || message.channel.type === 'GROUP_DM') &&
    !message.client.config.ownerIds.includes(message.author.id)
  ) {
    console.log(`prepping dm...`)
    message.client.config.ownerIds.forEach( id => {
      message.client.users.fetch(id).then( usr => usr.send( {content:
        `DM from ${message.author.tag}:\n>>> ` + message.content
      }));
    })
  }

  message.log();
}
