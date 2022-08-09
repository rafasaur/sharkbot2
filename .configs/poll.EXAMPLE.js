module.exports = {
  active: true,

  // maximum number of options for option-type poll (smaller number means more readable command prompt in Discord itself)
  // 2 >= maxNumOptions < optionEmoji.length (below) (this is checked in ready.js)
  maxNumOptions: 5,

  // emoji for options-type poll
  optionEmoji: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'],

  // emoji for yes-no-maybe-type poll
  // yes/no/maybe in order
  ynmEmoji: ['👍','👎','🤷'],

  // DM the creator of the poll when following up after the timer ends (if used)
  ccToDM: true,
}
