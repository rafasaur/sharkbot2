const { ChannelType } = require('discord.js')


module.exports = async (message) => {
  if (
    !message.author.isUser() ||
    !message.isUserMessage()
  ) {
    return;
  }

  const ownerIds = message.client.getConfig().ownerIds;

  if (
    message.client.getConfig('log').ccDM &&
    (message.channel.type === ChannelType.DM || message.channel.type === ChannelType.GroupDM) &&
    !ownerIds.includes(message.author.id)
  ) {
    console.log(`prepping dm...`);
    ownerIds.forEach( id => {
      message.client.users.fetch(id).then( usr => usr.send({
        content: `DM from ${message.author.tag}:\n>>> ` + message.content,
        //attachments: message.attachments.map(att => att.attachment),
      }));
    })
  }

  message.log();
}
