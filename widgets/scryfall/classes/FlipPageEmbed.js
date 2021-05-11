// https://github.com/iColtz/discord-pages/blob/main/src/classes/DiscordEmbedPages.js
const { MessageEmbed } = require("discord.js");

/**
 * Options used to determine how to embed pages should be constructed.
 * @typedef {Object} PagesOptions
 * @prop {Array} pages - An array of message embed that will be in the embed pages.
 * @prop {Discord.TextChannel} channel - The channel the embed pages will be sent.
 * @prop {Number} [duration=60000] - The length the reaction collector will last.
 * @prop {Array<Snowflake>|String<Snowflake>|Function} [restricted] - The restricted users to the embed pages.
 * @prop {Boolean} [pageFooter=true] - Whether or not to have the page counter on the embed footer.
 */

class EmbedPages {
    /**
     * Created the embed pages.
     * @param {PagesOptions} options - Options for the embed pages.
     */
    constructor({
        pages,
        channel,
        duration,
    } = {}) {
        /**
         * List of pages for the embed pages.
         * @type {Array<Discord.MessageEmbed>}
         */
        this.pages = pages;

        /**
         * Channel to send the embed pages to.
         * @type {Discord.TextChannel}
         */
        this.channel = channel;

        /**
         * How long the reactions collector will last in milliseconds.
         * @type {Number}
         */
        this.duration = duration || 60000;

        /**
         * The current page number to embed pages is on.
         * @type {Number}
         */
        this.currentPageNumber = 0;
    }

    /**
     * Creates and sends the embed pages.
     */
    createPages() {
        if (!this.pages[0]) throw new Error("Tried to create embed pages with no pages in the pages array.");
        this.channel.send({ embed: this.pages[0] }).then(msg => {
            this.msg = msg;
            msg.react("🔄").catch(() => null);
            const filter = (reaction, user) => {
                if (user.bot) return false;
                if (!this.restricted) return true;
                else if (this.restricted instanceof Function) return this.restricted(user);
                else if (Array.isArray(this.restricted) && this.restricted.includes(user.id)) return true;
                else if (typeof this.restricted === "string" && this.restricted === user.id) return true;
            };
            const collector = msg.createReactionCollector(filter, { time: this.duration, dispose:true });
            collector.on("collect", (reaction) => {
                switch(reaction.emoji.name) {
                case "🔄":
                    return this.nextPage();
                }
            });
            collector.on("remove", (reaction) => {
                switch(reaction.emoji.name) {
                case "🔄":
                    return this.nextPage();
                }
            });
            collector.on("end", () => {
              this.turnToPage(1);
              this.msg.reactions.removeAll().catch(() => null);
            });
        });
    }

    /**
     * Turns the embed pages to the next page.
     */
    nextPage() {
        if (!this.msg) throw new Error("Tried to go to next page but embed pages havn't been created yet.");
        this.currentPageNumber++;
        if (this.currentPageNumber >= this.pages.length) this.currentPageNumber = 0;
        const embed = this.pages[this.currentPageNumber];
        this.msg.edit({ embed: embed }).catch(() => null);
    }

    /**
     * Turns the embed pages to a certain page.
     * @param {Number} pageNumber - The page index that is turned to.
     */
    turnToPage(pageNumber) {
        if (!this.msg) throw new Error("Tried to turn to page before embed pages have even been created.");
        if (pageNumber < 0 || pageNumber > this.pages.length - 1) throw new Error("Turning page does not exist.");
        this.currentPageNumber = pageNumber;
        const embed = this.pages[this.currentPageNumber];
        this.msg.edit({ embed: embed }).catch(() => null);
    }

    /**
     * Deletes the embed pages.
     */
    delete() {
        if (!this.msg) throw new Error("Tried to delete embed pages but they havn't even been created yet.");
        this.msg.delete().catch(() => null);
    }
}

module.exports = EmbedPages;
