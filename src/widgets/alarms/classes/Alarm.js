const fs = require('fs'); const path = require('path');
const {AttachmentBuilder} = require('discord.js');

const makeAttachment = require('../../../util/makeAttachmentArray');
const weightedPick = require('../../../util/weightedPick');

function randInt(max, min=0) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};


module.exports = class Alarm {
  constructor(client, rule) {
    this.client = client;
    this.rule = rule;
    this.policies = rule.policies;
    this.cronTime = rule.cronTime;
    this.timezone = client.getConfig('alarms').defaultTimezone;
    if (rule.timezone?.length > 0) this.timezone = rule.timezone;
    this.surprise = false;
    // if surprise policy, get surprise frequency
    if (rule.policies?.surprise) {
      if (rule.policies.post.surprise > 0 &&
          rule.policies.post.surprise < 1) this.surprise = rule.policies.post.surprise;
      else this.surprise = client.getConfig('alarms').surpriseFreq;
    }
    // get default list of channel ids (sent to these regardless of post)
    this.channelIds = [];
    if (rule.channelIds) {
      for (let id of rule.channelIds) {
        if (id.length > 0) this.channelIds.push(id);
      }
    }
    // get default list of mention ids (these are @'d regardless of post)
    this.mentionIds = [];
    if (rule.mentionIds) {
      for (let id of rule.mentionIds) {
        if (id.length > 0) this.mentionIds.push(id);
      }
    }
  }

  // method called by node-cron created in ready.js
  sendMessage() {
    let post;
    let surpriseDelay = 0;

    // if this is a surpise, decide whether to post or not
    if (this.surprise) {
      if ( Math.random() > this.surprise ) return;
      if (this.rule.surpriseDelay && this.rule.surpriseDelay > 0) {
        surpriseDelay = randInt(this.rule.surpriseDelay);
      }
    }

    // determine the policy type & pick a post
    switch (this.rule.policies.post) {
      case "random":
        post = this.rule.posts[randInt(this.rule.posts.length)];
        break;
      case "weighted":
        post = weightedPick(this.rule.posts);
        break;
      case "static":
      default:
        post = this.rule.posts[0];
    }

    // complete list of channel ids to send post to
    let allChannelIds = [].concat(this.channelIds);
    if (post.channelIds) {
      for (let id of post.channelIds) {
        if (id?.length > 0) allChannelIds.push(id);
      }
    }

    /* currently set up to be fairly chaotic if a random option is chosen
      since each post can have random content, each channel could have a
      differnt post. For a more homogeneous random experience, pick content
      first, then send to channels. It'd be a little work, but straightforward */
    return setTimeout( () => {
      allChannelIds.forEach(async chId => await this._sendToChannel(chId, post));
      console.log(`${this.rule.name} alarm(s) sent!`)
    }, (post.delayTime || 0) + surpriseDelay );
  }

  // for every channel, pull content (text) & files based on rule policy
  async _sendToChannel(chId, post) {
    const ch = await this.client.channels.fetch(chId);
    let content = false;
    let files = false;

    if (post.content?.length > 0) content = await this._getContent(ch, post);
    if (post.files?.length > 0) files = await this._getFiles(post);

    if (content && !files) return await ch.send({content: content});
    else if (!content && files) return await ch.send({files: files});
    else if (content && files) return await ch.send({content: content, files: files});
  }

  // get mentions & text for post(s)
  async _getContent(channel, post) {
    let content = [];
    let allMentionIds = [].concat(this.mentionIds);
    if (post.mentionIds) {
      for (let id of post.mentionIds) {
        if (id.length > 0) allMentionIds.push(id);
      }
    }
    await allMentionIds.forEach(async id => {
      const atRole = await channel.guild.roles.fetch(id);
      content.push(`${atRole}`)
    });
    //console.log(content);

    switch (this.policies.content) {
      case "random":
        content.push(post.content[randInt(post.content.length)]);
        break;
      case "static":
      default:
        content.push(post.content[0]);
    }
    if (content.length < 1) return false;
    return content.join(' ');
  }

  // get files for this post & make attachments
  async _getFiles(post) {
    let filepaths; let attachment;
    switch (this.policies.files) {
      case "random":
        filepaths = post.files[randInt(post.files.length)];
        break;
      case "static":
      default:
        filepaths = post.files[0];
    }

    if (filepaths.length < 1) return false;
    if (typeof filepaths === 'string') {
      attachment = await makeAttachment([filepaths]);
    }
    else attachment = await makeAttachment(filepaths);

    return attachment;
  }
}
