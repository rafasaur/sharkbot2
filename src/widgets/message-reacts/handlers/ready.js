module.exports = (client) => {
  client.getRules('message-reacts').each(rule => {
    if (!rule.priors) return;
    rule.priors(client);
  })
  client.emoji = client.getConfig('message-reacts').emoji;

  client.logReady("message-reacts");
}
