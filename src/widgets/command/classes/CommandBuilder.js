module.exports = class CommandBuilder {
  constructor() {
    this.name = "";
    this.aliases = [];
    this.ownersOnly = true;
    this.modsOnly = true;
    this.guildOnly = true;
    this.requireArgs = true;
    this.deletable = false;
    this.cooldown = Infinity;
    this.disabled = true;
    this.execute = async () => {};
    this.help = async () => {};
    this.hasHelp = false;
  }

  setName(name) {
    this.name = name;
    return this;
  }

  setAliases(aliases) {
    this.aliases = aliases;
    return this;
  }

  setOwnersOnly(ownersOnly) {
    this.ownersOnly = ownersOnly;
    return this;
  }

  setModsOnly(modsOnly) {
    this.modsOnly = modsOnly;
    return this;
  }

  setGuildOnly(guildOnly) {
    this.guildOnly = guildOnly;
    return this;
  }

  setRequireArgs(requireArgs) {
    this.requireArgs = requireArgs;
    return this;
  }

  setDeletable(deletable) {
    this.deletable = deletable;
    return this;
  }

  setCooldown(cooldown) {
    this.cooldown = cooldown;
    return this;
  }

  setDisabled(disabled) {
    this.disabled = disabled;
    return this;
  }

  setExecute(execute) {
    this.execute = execute;
    return this;
  }

  setHelp(help) {
    this.help = help;
    this.hasHelp = true;
    return this;
  }

  build() {
    return {
      name: this.name,
      aliases: new Set(this.aliases),
      ownersOnly: this.ownersOnly,
      guildOnly: this.guildOnly,
      requireArgs: this.requireArgs,
      deletable: this.deletable,
      cooldown: this.cooldown,
      disabled: this.disabled,
      execute: this.execute,
      help: this.help,
      hasHelp: this.hasHelp,
    };
  }
};
