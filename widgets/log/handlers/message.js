
const config = require(`../log-config`);

module.exports = async (message) => {
  if ( !message.author.isUser() || !message.isUserMessage() ) {
    return;
  }
  console.log(message.channel.type)
  if (
    config.ccDM &&
    message.channel.type === 'dm' &&
    !message.client.config.ownerIds.includes(message.author.id)
  ) {
    console.log(`prepping dm...`)
    message.client.config.ownerIds.forEach( id => {
      message.client.users.fetch(id).then( usr => usr.send(
        `DM from ${message.author.tag}:\n>>> ` + message.content
      ));
    })
  }

  message.log();
}
