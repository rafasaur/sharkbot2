const fs = require("fs");
const path = require("path");
const mainConfig = require(`../config`);

const checkActiveWidget = (widgetName) => {
  const thisConfig = require(`../widgets/${widgetName}/${widgetName}-config`);
  return (
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
  console.log(`widgets found: ${widgetNames.join(", ")}\n`);
    
  return widgetNames
    .filter(checkActiveWidget)
    .map(getHandlerFilePath)
    .flatMap(getHandlers)
    .reduce(groupByHandlerName, { ready: [] });
}
