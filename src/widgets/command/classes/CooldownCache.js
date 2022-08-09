const cooldownCache = {};

const MAX_DELAY = Math.pow(2, 31) - 1;

function getCooldownKey(user, command) {
  return `${user.id}-${command.name}`;
};

function getCooldownInMs(cooldown) {
  return Math.min(cooldown * 1000, MAX_DELAY);
};

function getCooldownRemaining(expirationDate) {
  return ((expirationDate - Date.now()) / 1000).toFixed(1);
};

module.exports = class CooldownCache {
  static startCooldown(user, command) {
    if (user.isOwner()) {
      return;
    }

    const key = getCooldownKey(user, command);
    if (key in cooldownCache) {
      return;
    }

    const cooldownInMs = getCooldownInMs(command.cooldown);
    const expirationDate = Date.now() + cooldownInMs;

    cooldownCache[key] = expirationDate;
    setTimeout(() => delete cooldownCache[key], cooldownInSeconds);
  }

  static isOnCooldown(user, command) {
    if (user.isOwner()) {
      return false;
    }

    const key = getCooldownKey(user, command);
    if (!(key in cooldownCache)) {
      return false;
    }

    return getCooldownRemaining(cooldownCache[key]);
  }
};
