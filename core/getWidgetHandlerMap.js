const fs = require("fs");  const path = require("path");
const mainConfig = require(`../config`);

const checkActiveWidget = (widgetName) => {
  const thisConfig = require(`../widgets/${widgetName}/${widgetName}-config`);
  return (
    widgetName === 'command' || // commands always active
    (mainConfig.widgets.widgetName && mainConfig.widgets.widgetName.active) ||
    (thisConfig && thisConfig.active)
  )
}

const getFilenames = (filePath) =>
  fs
    .readdirSync(path.resolve(__dirname, filePath))
    .map((filename) => filename.replace(/\.[^/.]+$/, ""));

const getHandlerFilePath = (widgetName) => `../widgets/${widgetName}/handlers`;

const getHandlers = (handlerFilePath) =>
  getFilenames(handlerFilePath).map((handlerName) => ({
    handlerName,
    handler: require(`${handlerFilePath}/${handlerName}`),
  }));

const groupByHandlerName = (handlerMap, { handlerName, handler }) => {
  (handlerMap[handlerName] = handlerMap[handlerName] || []).push(handler);

  return handlerMap;
};

module.exports = () => {
  const widgetNames = getFilenames("../widgets");
  let nWidgets = widgetNames.length;
  //console.log(`widgets found: ${widgetNames.join(", ")}\n`);

  let widgetLog = `\n${nWidgets} widgets found:\n\n`;
  widgetNames.forEach( name => {
    let logName = `${name}:`;
    for (let i=0; i < 2-(name.length+1)/8; i++) logName += '\t';
    if (checkActiveWidget(name)) return widgetLog += logName + 'enabled\n';
    nWidgets--;
    return widgetLog += logName +`disabled\n`;
  });
  console.log(widgetLog+`\n\nloading ${nWidgets} widgets...\n`);

  return widgetNames
    .filter(checkActiveWidget)
    .map(getHandlerFilePath)
    .flatMap(getHandlers)
    .reduce(groupByHandlerName, { ready: [] });
}
