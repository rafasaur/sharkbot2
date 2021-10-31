##Default commands
#### affirm
`!affirm` will send the author a random affirmation from `/affirmations/affirmations.json`. Adding mentions (`@user`) after the command will send an affirmation to every member mentioned. I've considered also letting roles be @'d, but that seems dangerous.

#### help
`!help` sends a help message! Yep, that's it.

#### roll
A simple dice roller. Right now it'll roll whatever dice are listed (e.g., `!roll 2d4 3d6` would roll 2 d4's and 3 d6's) and give the sum. It might make more sense to do each group of dice individually, but also the user could just do that themself. It can also roll F\*rce and D\*stiny dice!

#### weekend
It'll tell you if it's the weekend or not. Best paired with an enthusiastic gif.



##Haiku
#### off/stop/pause
Sometimes serious discussions happen, and Sharkbot posting a surprise haiku is not exactly welcome. This command pauses haiku being sent to the channel it's called in for the given number of minutes. For example, `!haiku pause 30` post in the `#general` channel will stop the posting of any haiku in the `#general` for 30 minutes.

#### on/go/unpause
This will remove the pausing in the channel in which it is called. It will not affect any of the `ignoredChannels`.

#### syllable(s)/syl/s
It's not always clear how many syllables `syllable` thinks something is, so this is a little "debugger" that will say how many syllables each word in a phrase is.


##Levels
#### approve
Used by a mod to approve leveling up a member if/when that time comes.

#### levelup
Flips a flag on that can allow further level progression.

#### points
TBA...
