module.exports = {
  rules: [
    {
      ifs: (message, contentLowered) => { return
        /[\s]?(((ty)|(il(y|u)))?\s?(sb)\W?)|((sb)\W{1})|((shark)\W*((bot)|(boy)))/g.test(contentLowered) ||
      },
      reacts: (message, emoji) => {
        message.react(emoji.sharkbot);
      }
    },

    {
      ifs: (message, contentLowered) => { return (
        message.author.isUser() &&
        /(full\s*metal\s*alchemist)|fma\s?/g.test(contentLowered)
      )},
      reacts: (message, emoji) => {
        message.channel.send(`***FULLMETAL ALCHEMIST***`);
      }
    },

    {
      ifs: (message, contentLowered) => {return (
        message.channel.type === 'text' &&
        !message.author.bot &&
        /beetle[\s\.\,\|\*]*juice/igm.test(contentLowered)
      )},
      reacts: (message, emoji) => {
        message.client.incBJCount(message);
      }
    },

    {
      ifs: (message, contentLowered) => {return (
        contentLowered.includes("magic conch") &&
        contentLowered.startsWith("o") &&
        contentLowered.endsWith("?")
      )},
      reacts: async (message,emoji) => {
        const executable = message.manualExecutable('conch');
        if (!executable.isExecutable()) return;
        return await executable.execute();
      }
    },

  ],
}
