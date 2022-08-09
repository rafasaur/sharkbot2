const fs = require('fs'); const path = require('path');
const { Collection } = require('discord.js')
const Reactor = require('../classes/Reactor');

module.exports = async (client) => {

  const config = client.getConfig('reaction-roles');
  config.reactors = new Collection();
  client.getRules('reaction-roles').each( rule => {
    config.reactors.set(rule.messageId, new Reactor(client, rule));
  });

  client.setConfig(config);
  client.logReady("reaction-roles");
};
