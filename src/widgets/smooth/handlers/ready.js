// ready.js
// smooth ready event handler

const fs = require('fs');

module.exports = (client) => {
  const filepath = client.getConfig('smooth').filepath;
  if (!fs.existsSync(filepath)) fs.writeFileSync(filepath, '{}');
  client.logReady(`smooth`);
}
