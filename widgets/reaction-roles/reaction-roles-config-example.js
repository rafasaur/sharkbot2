const fs = require('fs'); const path = require('path');

const getRules = () => {
  let rules = {};
  fs.readdirSync(path.resolve(__dirname,`./rules`))
    .filter(file => file.endsWith('.json'))
    .forEach(file => rules[file.replace('.json','')] = require(path.resolve(__dirname,`./rules/${file}`)));
    return rules;
};

module.exports = {
  active: true,
  rules: getRules(),
}
