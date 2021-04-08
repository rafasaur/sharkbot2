const updateUserFromMessage = async (message) => {
  await message.member.preCheck();

  message.member.data.sentMessages++;
  message.member.data.sentChannels.add(message.channel.id);
  message.member.checkLevelUp();
};

module.exports = async (message) => {
  if (
    message.author.isUser() &&
    message.isUserMessage() &&
    message.isFromTextChannel()
  ){
    updateUserFromMessage(message);
  }
}
