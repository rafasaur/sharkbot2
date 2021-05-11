# sharkbot (v2.?)
"look at this dumb thing I made" - @rafasaur, June 2020

"oh look, it's the same but different" - @rafasaur, October 2020

"hey, look at this cool guy over here" - @rafasaur, April 2021

This bot is very dumb and there are definitely bots that do things better, but he is my son and I love him very much. His [first iteration](https://github.com/rafasaur/sharkbot) was a little more straightforward, but when I was attempting to update to this version, I found [peterthehan](https://github.com/peterthehan/create-discord-bot) did what I wanted to do, only it worked out of the box.

A few months later, after playing around with the widget base and pushing its/my limits, I decided to go a step further. In developing the `levels` and `member-db` widgets, I decided it would make more sense for them to come as a complete package, including their associated commands, so I wouldn't have to go looking in what felt like a disjointed way. So, widgets can now have their own `/commands` folders, the contents of which will be loaded the same way they would in the main `/command/commands` folder. To ensure compatibility, the `command` widget is always loaded, making its extensions universally available (and making sure if another widget has commands they will work!).

## Implemented features
Currently, Sharkbot can:
- [x] alarm clock
 - [x] a variety of sayings for default reminders
- [x] assign/remove roles!
- [x] react to messages, sometimes!
- [x] affirm your friends!
  - [x] a variety of affirmations (please submit more!)
- [x] smooth members...?
  - [x] a smoother smoothing experience

### In progress/to be implemented
- [ ] the ability to add alarms...?
- [ ] birthdays!
- [ ] create polls
  - [ ] with a time limit?
  - [ ] choose your own emoji for polls?
- [ ] twitch alerts
- [ ] music streaming

## Feature documentation
All features are loaded via their widget folder. All features require a `<widget-name>-config.js` file with `active: true`, or the same in the root `config.js` file.

### alarms
The original code here was based on [peterthehan's cron-bot](https://github.com/peterthehan/discord-cron-bot), so check documentation there for a more in-depth look at the basics.
This widget will send messages to the specified channel at the specified times (via cron rules). The various options I've implemented allow for a random message to be sent from a list, tagging a person or group, and sending images.

### commands
As mentioned above, all widgets can have their own set of commands. However, none will be loaded without this enabled, so this is the only module that cannot be disabled. The commands I've left in here are mostly for fun, so please play around and add your own! peterthehan's implementation makes it super easy to do. The packaged commands are:

#### affirm
`!affirm` will send the author a random affirmation from `/affirmations/affirmations.json`. Adding mentions (`@user`) after the command will send an affirmation to every member mentioned. I've considered also letting roles be @'d, but that seems dangerous.

#### help
`!help` sends a help message! Yep, that's it.

#### roll
A simple dice roller. Right now it'll roll whatever dice are listed (e.g., `!roll 2d4 3d6` would roll 2 d4's and 3 d6's) and give the sum. It might make more sense to do each group of dice individually, but also the user could just do that themself. It can also roll F\*rce and D\*stiny dice!

#### weekend
It'll tell you if it's the weekend or not. Best paired with an enthusiastic gif.

### haiku
If a user sends a message that is a haiku, Sharkbot will reformat and repost it! To keep things sane, Sharkbot will not repost every valid haiku (controlled with `frequency`), and he can ignore some channels entirely (listed in `ignoredChannels`). If he made a bad haiku (or something that shouldn't have been a haiku for whatever reason), the original author of the haiku is able to react with `🚫` in the first five minutes and the haiku will be deleted. After the time limit, and if a valid channel ID is given, Sharkbot will repost the haiku in the specified archive channel. I've implemented a few commands now as well -- using `!haiku <command>` will execute the following `<command>`:

#### off/stop/pause
Sometimes serious discussions happen, and Sharkbot posting a surprise haiku is not exactly welcome. This command pauses haiku being sent to the channel it's called in for the given number of minutes. For example, `!haiku pause 30` post in the `#general` channel will stop the posting of any haiku in the `#general` for 30 minutes.

#### on/go/unpause
This will remove the pausing in the channel in which it is called. It will not affect any of the `ignoredChannels`.

#### syllable(s)/syl/s
It's not always clear how many syllables `syllable` thinks something is, so this is a little "debugger" that will say how many syllables each word in a phrase is.

### levels
In some ways an extension of `member-db`, this widget controls the level progression of users as they spend time in the server. This has taken me a while to figure out how to implement in a way I like, but I think I finally have it organized in a way that makes sense and is readable. The widget keeps track of users' various doings, and levels up based on a set of rules in the corresponding `/levelers/go##.js`. Each `go##.js` has a `prep` (what to do/what values to re/set when the user gets to level n), a `check` (checking to see if the user can level from n to n+1), an `approve` (for if the checked leveling needs mod approval), and a `denied` (what happens if the leveling is denied by a mod). When a member is or is eligible for leveling, Sharkbot will post in the specified channel `levelLogChId`. Level IDs go in `/levels-config.js`, and should be ordered from lowest/least privileged to highest/most privileged. Some commands implemented here:

#### approve
Used by a mod to approve a user if/when that time comes.

#### levelup
Flips a flag on that can allow further level progression.

#### points
TBA...

### log
Enables message logging in the shell window. Currently investigating an unobtrusive way to write the console to a file.

### member-db
Another widget that spent a while in development hell, mostly because I didn't understand how to use async functions properly (still don't). This widget gives the ability to write user info to a file, so that in the event of a crash/reboot, not everything is lost. In normal use this is probably not crucial (unless you really care about tracking nicknames?), but is vital for `levels` to function, as some functionality it adds is used by `levels`. I think it's best to write the files automatically with, say, `setInterval()` in `/handlers/ready`, but you can also do it manually with the `!writedb` command.

### message-reacts
Allows reacting and/or replying to messages given specific criteria. Rules are now kept in a separate file for better read- and editability. Examples given in `/helpers/reactRules.js`.

### reaction-roles
Again, the bones here are taken from a peterthehan widget, [reaction-role-bot](https://github.com/peterthehan/discord-reaction-role-bot). The implementation has been modified to keep the handlers clean, and almost all the functionality is now contained within the `ReactTracker` class. All the rules are `.json` files kept in `/rules`, where an example is given (filenames do not matter, just the extension).

### scryfall
Based heavily on (the now outdated) [scryfall servo bot](https://github.com/scryfall/servo), but with better functionality and the ability to flip dual-faced cards (thanks to [iColtz](https://github.com/icoltz/discord-pages))! Search for any card with `[[card name]]`, or use Scryfall's search directly with `[[~search terms]]`. With the power of [string-similarity](https://www.npmjs.com/package/string-similarity#comparetwostringsstring1-string2) I've finally been able to display the searched-for card face by default. Coming soon: `[[!card]]` to display only the image and `[[?card]]` to send the formats in which the card is legal. Refer to [Scryfall](https://scryfall.com/docs/syntax) for search syntax documentation.

### smooth
Go ahead, try it. Smooth thyself. *Now in that delicious vintage flavour you know and love (and works...?)*

## Resources and references
I call Sharkbot my son, but it would not have been possible without drawing on numerous examples and documentation from other discord bots, especially now that he is officially a fork of [peterthehan's create-discord-bot](https://github.com/peterthehan/create-discord-bot), and both alarms and reaction-roles come from their implementation as well (but have been updated slightly to ensure functionality and compatibility).

Sharkbot originally grew from the [Discord.JS guide](discordjs.guide), but I wanted a cleaner method of loading its various features, and calling functions from different events. My original thought was to have individual handlers for each event, but that quickly grew unwieldy as well, and needed more manual overhead than I wanted, and I still ended up with clunky and bloated looking files. Finding peterthehan's work was a godssend, especially after the 100th time I broke my event handlers. Everything is modular, which is exactly what I was aiming to do, and was the next step I was trying to wrestle with. In was worried at one point I was removing some modularity, but I think I have instead improved upon it.

And of course the **biggest** thank you to everyone who's helped raise/test my son (Thad in particular) and answered my questions in the Discord.js discord.

### Dependencies
Idk where else to put this. `alarms` requires `cron`. `haiku` requires `syllable`. `scryfall` requires `node-fetch` and `string-similarity`. Obviously the whole thing needs `discord.js`. I think that's it?

### Getting him up and running
Just check out a copy, go through each `*-config-example` filling in blanks, and deleting the `-example` from the end. Should work immediately!
