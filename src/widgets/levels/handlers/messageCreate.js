
module.exports = async (message) => {
  if (
    message.author.isUser() &&
    message.isUserMessage() &&
    message.isFromGuildChannel()
  ){
    await message.member.updateFromMessage(message);
    //console.log(message.member.data);
  }
}
