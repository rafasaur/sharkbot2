
module.exports = async (message) => {
  if (
    message.author.isUser() &&
    message.isUserMessage() &&
    message.isFromTextChannel()
  ){
    message.member.updateFromMessage(message);
  }
}
