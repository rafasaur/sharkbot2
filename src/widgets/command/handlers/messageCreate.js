module.exports = async (message) => {
  if (
    !message.author.isUser() ||
    !message.isUserMessage() ||
    !message.isCommand()
  ) {
    return;
  }

  const executable = message.createExecutable();
  if (!executable.isExecutable()) {
    return;
  }

  await executable.execute();
  console.log("\texecuting...")
  if (!executable.isDeletable()) {
    return;
  }
  message.delete();
};
