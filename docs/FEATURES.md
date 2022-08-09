# Sharkbot features

Below are verbose instructions for using the various features of Sharkbot. For documentation on commands Sharkbot can use by default, view [that readme](./COMMANDS.md) instead. Most of these features were grown from other project, but all relevant information is below for convenience. All features require a config file in `.config/<feature name>.js`, and must have `active: true` as an entry.



## alarms
This widget will send messages (including files, etc.) to the specified channel at the specified time. There are various options to allow for a random message to be sent from an Array, tagging a person or role, and sending random files from a folder or specified Array.

### config options
- `defaultTimezone`: the timezone on which to base the alarms. Find a valid one from []()
- `surpriseFreq`: default frequency to post a surprise-type message

### rules
The rules these alarms are created from go in `.rules/alarms` as `.js` files. These rules must have the following structure (required options where noted):

- `channelIds`: (\*required\* either here or in the `posts` entry/ies) Array of channel ids to send the scheduled message
- `cronTime`: (\*required\*) cron expression specifying the time(s) at which to send the message
- `mentionIds`: Array of mentionable ids to "@" in the message
- `policies`: Object with the following options:
  - `content`: `random` or `static` (default `static`). `static` sends the first (0th) text from the `content` Array in a post, `random` sends a random text
  - `files`: `random` or `static` (default `static`). Similar to `content`, determines how to choose file/s to send
  - `post`: `random`, `static`, or `weighted` (default `static`). Determines how to choose which post from `posts` to send. `random` and `static` are similar to the above, and `weighted` uses the `weight` in each post to randomly choose a post by weight (the weights need not sum to any particular number)
  - `surprise`: (default `false`) either `false` or a decimal value (0<x<1), where x is the chance  to send a message. If a number is given but x<0 or x>1, `surpriseFreq` from the `config` is used
- `posts`: (\*required\*) Array of Objects detailing what (and potentially where) to send at a message the specified `cronTime`. It must contain at least 1 Object, with the following options:
  - `channelIds`: (\*required\* either here or in the main body of the rule) Array of channel ids to send this post specifically
  - `content`: (\*required\* unless there is at least one entry in `files`) Array of text to send (chosen according to `content` policy (see above))
  - `delayTime`: amount of time to wait after `cronTime` before sending this post
  - `files`: (\*required\* unless there is at least one entry in `content`) Array of Arrays of absolute filepaths to be attached to message (chosen based on `files` policy (see above)). *Note: in the included `EXAMPLE.js` file is a function that grabs all the files from a specified folder*
  - `mentionIds`: Array of mentionable ids to "@" in the message
  - `weight`: amount to weight this post by (for `weighted` post policy (see above))
- `timezone`: for using a different timezone to schedule this rule

**To be included**: I do not use embeds, but it would be straightforward to implement this to send embeds as well. Adding a command so any user can add an alarm manually *seems* easy enough, but will not persist through restarts.



## askbox
This feature designates a channel as a suggestion box. Messages sent there by non-mod members are deleted by default and copied to a mod-only channel for private discussion. Of course, if the copy-to channel is not a mod-only channel, anyone will be able to read it.

A slash command `/ask` has been added so people can send asks privately to the `sendToChId` without having a publicly visible post (the slash command is responded to ephemerally).

### config options
- `askChId`: channel ID of "suggestion box" channel
- `sendToChId`: channel ID of mod-only channel which receives copied messages from `askCh`
- `private`: `true` (default) or `false`. If true, original message from sent to `askCh` will be deleted
- `allowAnon`: `false` (default), or `true`. If true, copied messages will be sent without sender's username for anonymous submissions
- `anonPrefixes`: Array of allowed prefixes, to be contained in square brackets. E.g., "[anon] mods suck >:(" would send the message anonymously



## commands
This feature is loaded automatically, and is the only one that cannot be deactivated (i.e., it does not require `active: true` in its config file). This is in part to have better legibility for commands which "belong" to specific features, but also because certain methods are created here which are on occasion used by other features (at this point most of these have probably been removed?). The default commands are detailed in the [commands readme](./COMMANDS.md).

To add or remove commands, add or delete files from the `/<widget>/commands/text` folder in whichever widget the command can be found in, or the `/commands/text` folder in root.

Recently, slash commands have been added and implemented in a similar way to what I'm calling text commands. These use Discord.JS's built-in `SlashCommandBuilder`, which I've extended slightly in `SlashBuilderPlus`. In much the same way to text commands, these can easily be added or removed by adding or deleting files from the respective `/commands/slash` folder. Most text commands have a (near) identical slash command, and in cases where they are identical the bulk of the work is in a "shared" file in the co-located `/shared` folder. For more information on how these are implemented in Discord.JS, [read this guide]().

There are still some text commands (e.g., `affirm`) that require functionality that slash commands do not provide (or is much easier to do without the inherent limitations of hard-coding options), or have been kept for posterity (or fun, e.g., I like being able to type `?weekend` to see if it's the weekend or not).



## haiku
If a user sends a message that is a haiku, Sharkbot will reformat and repost it. To keep things sane, Sharkbot will not repost every valid haiku (controlled with `frequency`), and he can ignore some channels entirely (listed in `ignoredChannels`). If he made a bad haiku (or something that shouldn't have been a haiku for whatever reason), the original author of the haiku is able to react with `🚫` in the first five minutes and the haiku will be deleted. After the time limit, and if a valid channel ID is given, Sharkbot will repost the haiku in the specified archive channel.

### config options
- `allowedForms`: an Array of pattern Arrays. By default, only 5-7-5 haiku will be considered valid
- `ignoredChannels`: Array of channel IDs to ignore completely when making haiku (also uses the default ignored channels from the `.bot.js` config file)
- `alwaysChannels`: only relevant when a `frequency` is given. Valid haiku in these channels will *always* be reposted, regardless of frequency
- `archiveChannel`: (optional) channel ID to send copies of haiku to
- `frequency`: (optional) defines how frequently a valid haiku will be reposted, to reduce clutter/spam

There are some commands for this feature, see the [command documentation](./COMMANDS.md#alarms) for more.

**To be implemented**: this feature functions as intended. I have considered sending the haiku as images, but have not devoted the time to that.



## levels
In some ways an extension of `member-db`, this widget controls the level progression of users as they spend time in the server. This has taken me a while to figure out how to implement in a way that makes sense and is readable. The widget keeps track of members' various doings, and levels up based on a set of rules in the corresponding `/.rules/levels/go##.js`.

### config options
- `levelLogChId`: channel ID to send leveling information to
- `levelIds`: IDs of level roles, in order from lowest to highest

### rules
Each `go##.js` has a `prep` (what to do/what values to re/set when the user gets to level *n*), a `check` (checking to see if the user can level from *n* to *n*+1), an `approve` (for if the checked leveling needs mod approval), and a `denied` (what happens if the leveling is denied by a mod). When a member is or is eligible for leveling, Sharkbot will post in the specified channel `levelLogChId`. Level ids go in `/levels-config.js`, and should be ordered from lowest/least privileged to highest/most privileged.



## log
Enables message logging in the shell window. Currently investigating an unobtrusive way to write the console to a file.

### config options
- `ccDM`: whether or not to send copies of messages the bot receives to the owner (specified in the `.bot.js` config file)



## member-db
Another widget that spent a while in development hell, mostly because I didn't understand how to use async functions properly (still don't). This widget gives the ability to write user info to a file, so that in the event of a crash/reboot, not everything is lost. In normal use this is probably not crucial (unless you really care about tracking nicknames?), but is vital for `levels` to function, as some functionality it adds is used by `levels`. I think it's best to write the files automatically with, say, `setInterval()` in `/handlers/ready`, but you can also do it manually with the `!writedb` command.



## message-reacts
Allows reacting and/or replying to messages given specific criteria.

### rules
Rules are kept in a separate files for better read- and editability. Examples given in `/.rules/message-reacts`.
- `ifs`: logical expression returning true or false based on the conditions for the `reacts` to trigger
- `priors`: (optional) if anything needs to be created/added in order to achieve the desired `reacts`. Loaded at client startup
- `reacts`: the actions to take if `ifs` returns true



## reaction-roles
The bones here are taken from a peterthehan widget, [reaction-role-bot](https://github.com/peterthehan/discord-reaction-role-bot). The implementation has been modified to keep the handlers clean, and almost all the functionality is now contained within the `ReactTracker` class.

### rules
All rules are `.json` files in `/.rules/reaction-roles`, where an example is given (filenames do not matter, just the extension).
- `messageId`: ID of the message to track
- `channelId`: ID of the channel the message is in
- `isUnique`: if this is set to `true`, users will only be allowed to react with one emoji (other reactions will be removed). Roles will be set in accordance with the most recent reaction
- `reactAgnostic`: if this is set to `true`, *any* reaction (not just ones in the role map) sent by a user will cause the user to be assigned *all* roles in the role map
- `emojiRoleMap`: a Map, of one emoji (or valid emoji ID) to an Array of role IDs. The roles will be added or removed when a user reacts or un-reacts with the corresponding emoji



## scrycall
Based heavily on (the now outdated) [scryfall servo bot](https://github.com/scryfall/servo), but with better functionality and the ability to flip dual-faced cards (thanks to [iColtz](https://github.com/icoltz/discord-pages)). Search for any card with `[[card name]]`, or use Scryfall's search directly with `[[~search terms]]`.

**To be included**: `[[!card]]` to display only the image and `[[?card]]` to send the formats in which the card is legal. Refer to [Scryfall](https://scryfall.com/docs/syntax) for search syntax documentation.




## shoutbox
Similar to [askbox](#askbox), only the message is copied and sent to the same channel it was sent to originally before being deleted. Any message beginning with `!shout` will be copied, resent, and deleted from the channel. The `/shout` slash command allows "shouting" to any channel from any channel.

### config options
- `shoutChIds`: Array of channel IDs in which to allow shouts
- `ccToDM`: if `true`, sends a copy of all shouts to owner(s), with the original author's tag




## smooth
Go ahead, try it. Smooth thyself. *Now in that delicious vintage flavour you know and love (and works...?)*




## welcome
Sends a (hopefully) helpful message whenever someone joins the server.

### config options
- `welcomeText`: text to send to new members
