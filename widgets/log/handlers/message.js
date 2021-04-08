module.exports = async (message) => {
  if ( !message.author.isUser() || !message.isUserMessage() ) {
    return;
  }
  message.log();
}
