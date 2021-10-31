# Sharkbot features

Below are verbose instructions for using the various features of Sharkbot. For documentation on commands Sharkbot can use by default, view [that readme](./COMMANDS.md) instead. Most of these features were grown from other project, but all relevant information is below for convenience. All features require a config file in `.config/<feature name>.js`, and must have `active: true` as an entry.



## alarms
This widget will send messages (including files, etc.) to the specified channel at the specified time. There are various options to allow for a random message to be sent from an Array, tagging a person or role, and sending random files from a folder or specified Array.

### config options
- `defaultTimezone`: the timezone on which to base the alarms. Find a valid one from []().

### rules
The rules these alarms are created from go in `.rules/alarms` as `.js` files. These rules require the following:
- `channelIds`: Array of channel IDs to send the scheduled messages to
- `cronTime`: cron expression specifying the time(s) at which to send the messages
- `content`: either a String or an Array of Strings to be sent as the message text
- `files`: Array or Array of Arrays of absolute filepaths to be attached to message sent

By default, Sharkbot will post the same thing every time (i.e., `static`); arrays of strings or arrays (for `content` and `files` respectively) can only be used if `policies` are specified. `policies` is a Map, with the following options:
- `content`: `static` (default) or `random`. If `random` is selected, a random String for the `content` Array will be sent
- `files`: `static` (default), `random`, `weighted`, or `folder`. `random` will send a random Array of files from the specified Array. `weighted` is similar, but requires weights in the Array of Arrays (e.g., `[ [[a.gif, b.gif], .5], [[c.gif], .5], ... ]`). `folder` sends a random file from the specified absolute folderpath
- `post`: `static` (default), `weighted`, or `random`. The weighted and random options require an Array of posts, essentially alarm files contained within an Array

There are optional fields in addition to these:
- `title`: a legacy field, Sharkbot will use the filename by default to assign a key
- `timezone`: if a timezone other than the default specified in the config file will be used for this rule
- `atRoleId`: to mention a role in the post

**To be included**: I do not use embeds, but it would be straightforward to implement this to send embeds as well. Adding a command so any user can add an alarm manually *seems* easy enough, but will not persist through restarts.



## askbox
This feature designates a channel as a suggestion box. Messages sent there by non-mod members are deleted by default and copied to a mod-only channel for private discussion. Of course, if the copy-to channel is not a mod-only channel, anyone will be able to read it.

### config options
- `askChId`: channel ID of "suggestion box" channel
- `sendToChId`: channel ID of mod-only channel which receives copied messages from `askCh`
- `private`: `true` (default) or `false`. If true, original message from sent to `askCh` will be deleted
- `allowAnon`: `false` (default), or `true`. If true, copied messages will be sent without sender's username for anonymous submissions
- `anonPrefixes`: Array of allowed prefixes, to be contained in square brackets. E.g., "[anon] mods suck >:(" would send the message anonymously



## commands
This feature is loaded automatically, and is the only one that cannot be deactivated (i.e., it does not require `active: true` in its config file). This is in part to have better legibility for commands which "belong" to specific features, but also because certain methods are created here which are on occasion used by other features (at this point most of these have probably been removed?). The default commands are detailed in the [commands readme](./COMMANDS.md).

To add or remove commands, add or delete files from the `<path>/commands` folder in whichever widget the command can be found in, or the `commands` folder in root. **To be included**: slash commands, at some point. Most of the commands I've written require functionality that the new interactions no longer have, so I have not pursued implementing these myself.



## haiku
If a user sends a message that is a haiku, Sharkbot will reformat and repost it! To keep things sane, Sharkbot will not repost every valid haiku (controlled with `frequency`), and he can ignore some channels entirely (listed in `ignoredChannels`). If he made a bad haiku (or something that shouldn't have been a haiku for whatever reason), the original author of the haiku is able to react with `🚫` in the first five minutes and the haiku will be deleted. After the time limit, and if a valid channel ID is given, Sharkbot will repost the haiku in the specified archive channel.

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
Each `go##.js` has a `prep` (what to do/what values to re/set when the user gets to level *n*), a `check` (checking to see if the user can level from n to n+1), an `approve` (for if the checked leveling needs mod approval), and a `denied` (what happens if the leveling is denied by a mod). When a member is or is eligible for leveling, Sharkbot will post in the specified channel `levelLogChId`. Level IDs go in `/levels-config.js`, and should be ordered from lowest/least privileged to highest/most privileged.



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
Again, the bones here are taken from a peterthehan widget, [reaction-role-bot](https://github.com/peterthehan/discord-reaction-role-bot). The implementation has been modified to keep the handlers clean, and almost all the functionality is now contained within the `ReactTracker` class.

### rules
All rules are `.json` files in `.rules/reaction-roles`, where an example is given (filenames do not matter, just the extension).
- `messageId`: ID of the message to track
- `channelId`: ID of the channel the message is in
- `isUnique`: if this is set to `true`, users will only be allowed to react with one emoji (other reactions will be removed)
- `reactAgnostic`: if this is set to `true`, *any* reaction (not just ones in the role map) sent by a user will cause the user to be assigned *all* roles in the role map
- `emojiRoleMap`: a Map, of one emoji (or valid emoji ID) to an Array of role IDs. The roles will be added or removed when a user reacts or un-reacts with the corresponding emoji



## scryfall
Based heavily on (the now outdated) [scryfall servo bot](https://github.com/scryfall/servo), but with better functionality and the ability to flip dual-faced cards (thanks to [iColtz](https://github.com/icoltz/discord-pages)). Search for any card with `[[card name]]`, or use Scryfall's search directly with `[[~search terms]]`.

**To be included**: `[[!card]]` to display only the image and `[[?card]]` to send the formats in which the card is legal. Refer to [Scryfall](https://scryfall.com/docs/syntax) for search syntax documentation.



## smooth
Go ahead, try it. Smooth thyself. *Now in that delicious vintage flavour you know and love (and works...?)*
