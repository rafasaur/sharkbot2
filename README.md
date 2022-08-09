# sharkbot (v2.14)

Sharkbot is my attempt at a modular Discord bot, with a fair amount of functionality out of the box, and the ability to quickly and easily add/remove pieces as needed. In theory, one bot *could* be used across multiple Discord servers, but it is not currently written to do so effectively and it is very likely at least one thing will break.

## Overview
The most recent updates for Sharkbot finally use Discord.js v13, which required some minor code updates to align with the new API. The file structure received a much more substantial reworking, to improve accessibility for commonly edited files, and readability overall.

Some commands are now available as slash commands! The main reason for some, not all, is that interactions are handled differently than messages, which breaks some finer functionality of commands I've currently implemented. Certain commands will be converted into slash commands, but others (namely [affirm](docs/COMMANDS.md#affirm)) will remain "old school" by necessity.

### Getting him up and running
Just check out a copy, go through each `.config/<widget>.EXAMPLE.js` filling in blanks, and deleting the `.EXAMPLE` from the filename. Peruse to find other `EXAMPLE` files and make your own, or just delete them. Finally, replace `<your token here>` with your bot's token in `.env`. It should work immediately!

### Features & Commands
Fine-grained documentation of Sharkbot's features (or "widgets") can be found in [that readme](docs/FEATURES.md), and likewise for the default [commands](docs/COMMANDS.md).

All features are loaded via their folder in `/src/widgets`. All features require, at minimum, a `<feature>.js` file with `active: true` in the `/.config` folder. Any features with "rules" are loaded from their respective folder/files in `/.rules`. Any features beginning with `~` in their name will not be loaded (by default, `~template` is the only one).

### alarms
Send messages at specific times, according to [cron rules](https://crontab.cronhub.io/). A certain amount of randomization is allowed.

### askbox
Designates a channel in the server to be an suggestion box. Messages sent there can be sent to a mod-only channel for private discussion, as well as deleting the original message for anonymity.

### command
Allows for command usage (both old-school "text" commands as well as slash commands) and loaded by default, so each widget can have its own commands to increase readability. It may be worth mentioning in cases where a text command and a slash command have an identical function, the bulk of that code is pushed into a "shared" file.

### haiku
Reformat and post messages that are haiku. Frequency & allowed channels can be adjusted.

### levels
A mild moderation assistant. Assign roles based on how long people have been in the server, how much and widely they post, etc.

### log
Allows for printing of all observed messages, and the CC-ing of DMs sent to the bot to the owner.

### member-db
Persistent member data through restarts.

### message-reacts
Perform certain actions based on contents of sent messages.

### poll
Members can create polls, and Sharkbot will automatically react with relevant emoji to assist in "voting." Members can be notified of the results after a certain amount of time has passed.

### reaction-roles
Assign roles based on members reacting to specified messages.

### scrycall
A *magical* card info *gatherer*.

### shoutbox
Designate a channel to allow members to ask/shout things at the server anonymously.

### smooth
Kick and re-invite members in one breath.

### welcome
Send a welcome DM to new members.


## Resources and references
I call Sharkbot my son, but it would not have been possible without drawing on numerous examples and documentation from other discord bots, especially now that he is officially a fork of [peterthehan's create-discord-bot](https://github.com/peterthehan/create-discord-bot), and both alarms and reaction-roles come from their implementation as well (but have been updated slightly to ensure functionality and compatibility).

Sharkbot originally grew from the [Discord.JS guide](discordjs.guide), but I wanted a cleaner method of loading its various features, and calling functions from different events. My original thought was to have individual handlers for each event, but that quickly grew unwieldy as well, and needed more manual overhead than I wanted, and I still ended up with clunky and bloated looking files. Finding peterthehan's work was a godssend, especially after the 100th time I broke my event handlers. Everything is modular, which is exactly what I was aiming to do, and was the next step I was trying to wrestle with. I was worried at one point I was removing some modularity, but I think I have instead improved upon it.

And of course the **biggest** thank you to everyone who's helped raise/test my son (Thad in particular) and answered my questions in the Discord.js discord.

### In progress/to be implemented
- [ ] the ability to add alarms...?
- [ ] birthdays!
- [ ] twitch alerts
- [ ] music streaming
