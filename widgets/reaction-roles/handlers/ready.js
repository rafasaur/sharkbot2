const rules = require("../reaction-roles-config").rules;
const Reactor = require('../classes/ReactTracker');

module.exports = async (client) => {
  console.log("reaction-roles:\tready");

  client.reactionRoleRules = {};

  for (const rule of Object.values(rules)) {
    client.reactionRoleRules[rule.messageId] = new Reactor(client, rule);
  }
  //console.log(client.reactionRoleRules)
};
