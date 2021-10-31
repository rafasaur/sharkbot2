# sharkbot (v2.13)

Sharkbot is my attempt at a modular Discord bot, with a fair amount of functionality out of the box, and the ability to quickly and easily add/remove pieces as needed. In theory, one bot *could* be used across multiple Discord servers, but it is not currently written to do so effectively and it is very likely at least one thing will break.

## Implemented features
Currently, Sharkbot can:
- [x] alarm clock
 - [x] a variety of sayings for default reminders
 - [x] randomly choose from a set of possible reminders
- [x] assign/remove roles based on message reactions!
- [x] react to messages, sometimes!
- [x] post when people make accidental haiku!
- [x] affirm your friends!
  - [x] a variety of affirmations (please submit more!)
- [x] smooth members...?
  - [x] a smoother smoothing experience...?

### In progress/to be implemented
- [ ] the ability to add alarms...?
- [ ] birthdays!
- [ ] create polls
  - [ ] with a time limit?
  - [ ] choose your own emoji for polls?
- [ ] twitch alerts
- [ ] music streaming

## Overview
The most recent update for Sharkbot finally uses Discord.js v13, which require some minor code updates to align with the new API. The file structure received a much more substantial reworking, to improve accessibility for commonly edited files, and readability overall.

Despite the new version of Discord.js allowing for "slash commands" to be easily implemented, I have not yet done so. The main reason for this is the way interactions are handled differently than messages breaks some finer functionality of commands I've currently implemented.

### Features & Commands
Fine-grained documentation of Sharkbot's features (or "widgets") can be found in [that readme](docs/FEATURES.md), and likewise for [commands](docs/COMMANDS.md).

All features are loaded via their folder in `/src/widgets`. All features require a `<feature>.cfg.js` file with `active: true` in the `/.config` folder. Any features with "rules" are loaded from their respective folder/files in `/.rules`.

### alarms
Send messages at specific times, according to cron rules. A certain amount of randomization is allowed.

### askbox
Designates a channel in the server to be an suggestion box. Messages sent there can be sent to a mod-only channel for private discussion, as well as deleting the original message for anonymity.

### command
Allows for command usage (**not** slash commands, as reasoned above) and loaded by default, so each widget can have its own commands to increase readability.

### haiku
Reformat and post messages that are haiku. Frequency & allowed channels can be adjusted.

### levels
A mild moderation assistant. Assign roles based on how long people have been in the server, how much and widely they post, etc.

### log
Allows for printing of all observed messages, and the CC-ing of DMs sent to the bot to the owner.

### member-db
An attempt at keeping sustaining records through restarts.

### message-reacts
Perform certain actions based on contents of sent messages.

### reaction-roles
Assign roles based on members reacting to specified messages.

### scryfall
A *magical* card info *gatherer*.

### smooth
Kick and re-invite members in one breath.

### tiktok-embed
Send TikTok URLs as embeds for easier viewing, and delete messages with overly long URLs.


## Resources and references
I call Sharkbot my son, but it would not have been possible without drawing on numerous examples and documentation from other discord bots, especially now that he is officially a fork of [peterthehan's create-discord-bot](https://github.com/peterthehan/create-discord-bot), and both alarms and reaction-roles come from their implementation as well (but have been updated slightly to ensure functionality and compatibility).

Sharkbot originally grew from the [Discord.JS guide](discordjs.guide), but I wanted a cleaner method of loading its various features, and calling functions from different events. My original thought was to have individual handlers for each event, but that quickly grew unwieldy as well, and needed more manual overhead than I wanted, and I still ended up with clunky and bloated looking files. Finding peterthehan's work was a godssend, especially after the 100th time I broke my event handlers. Everything is modular, which is exactly what I was aiming to do, and was the next step I was trying to wrestle with. I was worried at one point I was removing some modularity, but I think I have instead improved upon it.

And of course the **biggest** thank you to everyone who's helped raise/test my son (Thad in particular) and answered my questions in the Discord.js discord.

### Getting him up and running
Just check out a copy, go through each `.config/<widget>.EXAMPLE.js` filling in blanks, and deleting the `.EXAMPLE` from the filename. Peruse to find other `EXAMPLE` files and make your own, or just delete them. Finally, replace `<your token here>` with your bot's token in `.env`, and it should work immediately!
