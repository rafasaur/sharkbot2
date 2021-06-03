module.exports = {
  token: "", // your token here!
  ownerIds: ["197687298198863872"], ownerTag: 'rafasaur#8320', // your infos here!
  ignoredChannels: new Set([ //globally ignored channels

  ]),
  widgets: {
    alarms: {
      active: false,
    },
    command: {
      prefixes: [".","?"],
      modRoleIds: [],
    },
    haiku: {
      active: false,
      ignoredChannels: new Set([]),
      alwaysChannels: new Set([]),
    },
    levels: {
      active: true,
      levelIds: [],
    },
    log: {
      active: true,
    },
    "member-db": {
      actvie: true,
    },
    "message-reacts": {
      active: true,
    },
    quest: {
      active: false,
    },
    "reaction-roles": {
      active: true,
    },
    scryfall: {
      active: true,
    },
    smooth: {
      active: true,
    }
  }
};
