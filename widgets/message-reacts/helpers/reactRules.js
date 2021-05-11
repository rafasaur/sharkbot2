module.exports = {
  rules: [
    {
      ifs: (message, contentLowered) => { return (
        message.author.isUser() && (
        contentLowered.includes("fullmetal alchemist") ||
        contentLowered.includes("full metal alchemist") ||
        contentLowered.includes("fma ") ||
        contentLowered.includes(" fma") ||
        contentLowered === "fma" )
      )},
      reacts: (message, emoji) => {
        message.channel.send(`***FULLMETAL ALCHEMIST***`);
      }
    },
  ],
}
