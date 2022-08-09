
const { SlashCommandBuilder } = require('discord.js');

module.exports = class SlashBuilderPlus extends SlashCommandBuilder {
  setOwnersOnly(ownersOnly) {
    this.ownersOnly = ownersOnly;
    return this;
  }

  setModsOnly(modsOnly) {
    this.modsOnly = modsOnly;
    return this;
  }

  setPushOption(pushOption) {
    this.pushOption = pushOption;
    return this;
  }

  setCooldown(cooldown) {
    this.cooldown = cooldown;
    return this;
  }
}
