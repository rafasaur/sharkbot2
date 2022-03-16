
const fs = require('fs'); const path = require('path');

function randInt(max, min=0) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

function randWeight(objectArray) { // files like [ [files, weight], [files, weight], ...]
  let total = 0;
  objectArray.forEach(ind => total += objectArray.weight);
  const roll = Math.random() * total;

  if (roll === 0) return objectArray[0];

  let i = 0; let run = 0;
  while (run < roll) {
    run += objectArray[i].weight;
    i++;
  }
  return objectArray[i-1];
}

function randFromFolder(folderpath) {
  const files = fs.readdirSync(path.resolve(__dirname,folderpath))
                  .filter(name => path.extname(name).length > 0)
  return [ files[randInt(files.length)] ];
}


module.exports = class Alarm {
  constructor(client, rule) {
    this.client = client;
    this.rule = rule;
  }

  async _getContent(channel, rule) {
    let content = ' ';

    if (rule?.atRoleId) {
      const atRole = await channel.guild.roles.fetch(this.rule.atRoleId);
      content = `${atRole} `;
    }

    switch (rule.policies.content) {
      case "random":
        return content + rule.content[randInt(rule.content.length)];

      case "static":
      default:
        return content + rule.content;
    }
  }

  async _getFiles(rule) {
    switch (rule.policies.files) {
      case "random":
        return rule.files[randInt(rule.files.length)];

      case "weighted":
        return randWeight(rule.files).files;

      case "folder":
        return randFromFolder(rule.files);

      case "static":
      default:
        return rule.files;
    }
  }

  async sendMessage() {
    switch (this.rule.policies.post) {
      case "random":
      case "weighted":
        const post = this._choosePost();
        return setTimeout( () => {
          post.channelIds.forEach(async chId => this._sendToChannel(chId, post));
        }, post.delayTime);

      case "static":
      default:
        return this.rule.channelIds.forEach(async chId => this._sendToChannel(chId, this.rule));
    }
  }

  async _sendToChannel(chId, rule) {
    const ch = await this.client.channels.fetch(chId);
    let content = " ";
    let files = [];

    if (!rule?.files || rule.files.length === 0) {
      return await ch.send({content: await this._getContent(ch, rule)});
    }
    else if (!rule?.content || rule.content.length === 0) {
      return await ch.send({files: await this._getFiles(rule)});
    }
    else {
      return await ch.send({
        content: await this._getContent(ch, rule),
        files: await this._getFiles(rule)
      });
    }
  }

  _choosePost() {
    switch (this.rule.policies.post) {
      case "weighted":
        return randWeight(this.rule.posts);

      case "random":
      default:
        return this.rule.posts[randInt(this.rule.posts.length)]
    }
  }

}
