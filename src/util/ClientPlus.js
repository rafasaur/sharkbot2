const fs = require ('fs'); const path = require('path');
const {Client, Collection} = require('discord.js');


function getFilenames(filepath) {
  return fs.readdirSync(path.resolve(__dirname, filepath))
           .filter(filename => !filename.startsWith("~"))
           .filter(filename => !filename.startsWith("!"))
           .map((filename) => filename.replace(/\.[^/.]+$/, ""));
  }

function getHandlers(handlerFilePath) {
  return getFilenames(handlerFilePath)
          .map((handlerName) => ({
            handlerName,
            handler: require(`${handlerFilePath}/${handlerName}`),
          }));
}

function groupByHandlerName(handlerMap, { handlerName, handler }) {
  (handlerMap[handlerName] = handlerMap[handlerName] || []).push(handler);
  return handlerMap;
};

function runHandlers(handlers, ...eventArguments){
  return handlers.forEach((handler) => handler(...eventArguments));
}


module.exports = class ClientPlus extends Client {
  loadClientPlus() {
    this._config = require(`../../.configs/.bot`);
    this.turnedOn = new Date();
    this._widgets = new Collection();
    let activeWidgetNames = this._loadActiveWidgets();
    this._loadRules();
    this._loadListeners(activeWidgetNames);
  }

  // config getter. Gets main config by default
  getConfig(widgetName='') {
    if (['', 'bot', 'main'].includes(widgetName)) return this._config;
    else if (!this._widgets.has(widgetName)) {
      console.error(`\tno config found for ${widgetName}`);
      return false;
    }
    return this._widgets.get(widgetName);
  }

  // config setter. Main config can never be altered (may be unnecessary, but kept for readability)
  setConfig(config) {
    if (!config || !this._widgets.has(config.name)) {
      console.log(`\tno config found for ${config.name}`);
      return false;
    }
    this._widgets.set(config.name, config);
    return config;
  }

  // rules getter (from .rules folder)
  getRules(widgetName) {
    if (!widgetName || !this._widgets.has(widgetName)) {
      console.log(`\tcouldn't load rules for ${widgetName}!`);
      return false;
    }
    const wCfg = this._widgets.get(widgetName);
    if (!wCfg.rules) {
      console.log(`\tno rules found for ${widgetName}`);
      return false;
    }
    return wCfg.rules;
  }

  // aesthetic logging when widget ready.js runs on boot
  logReady(widgetName) {
    let logLine = widgetName + ':';
    return console.log(logLine + this._makeLogSpace(logLine) + 'ready');
  }

  // purely for aesthetic logging purposes, but saves space
  _makeLogSpace(text){
    let space = '';
    for (let i=0; i<this._config.logSpace-(text.length)/8; i++) space += '\t';
    return space;
  }


  _loadActiveWidgets() {
    const widgetNames = getFilenames('../widgets');
    let activeWidgetNames = [];
    console.log(`\n${widgetNames.length} widgets found:\n`);

    widgetNames.forEach(name => {

      // always load command widget
      if (name === "command") {
        activeWidgetNames.push("command");
        console.log('command:'+this._makeLogSpace('command:')+'enabled');
        return;
      }

      // check if widget has a corresponding config
      //  if not throw a warning and ignore it
      //  otherwise add it to the Collection
      if (!fs.existsSync(path.resolve(__dirname, `../../.configs/${name}.js`))) {
        console.warn(`No config found for ${name}! Skipping...`);
        return;
      }

      const widgCfg = require(`../../.configs/${name}`);
      widgCfg.name = name;
      this._widgets.set(name, widgCfg);

      // if the widget is active, add it to the active Array
      if (this._checkActiveWidget(name)) {
        activeWidgetNames.push(name);
        console.log(`${name}:`+this._makeLogSpace(`${name}:`)+'enabled');
        return;
      }

      // otherwise log it as disabled
      console.log(`${name}:`+this._makeLogSpace(`${name}:`)+'disabled');
      return;
    });
    console.log(`\n\nloading ${activeWidgetNames.length} widgets...\n`);
    return activeWidgetNames;
  }


  _checkActiveWidget(widgetName) {
    return (
      widgetName === 'command' ||
      ( this._widgets.has(widgetName) && this._widgets.get(widgetName).active )
    );
  }


  _loadRules() {
    getFilenames('../../.rules').forEach( widgetName => {
      if (!this._widgets.has(widgetName)) {
        return console.log(`extraneous rules found for ${widgetName}`);
      }
      if (!this._checkActiveWidget(widgetName)) return;
      this._widgets.get(widgetName).rules = this._readRules(widgetName);
      console.log(`rules loaded for ${widgetName}`);
    })
    console.log('');
  }


  _readRules(widgetName) {
    let rules = new Collection();
    const pathName = path.resolve(__dirname,`../../.rules/${widgetName}`);
    fs.readdirSync(pathName)
      .filter(file => !file.toLowerCase().includes('example'))
      .forEach(file => {
        let thisRule = require(pathName+`/${file}`);
        thisRule.name = file.replace(path.extname(file),'');
        rules.set(thisRule.name, thisRule);
        //rules.set(file.replace(path.extname(file),''), require(pathName+`/${file}`));

        //console.log(file.replace(path.extname(file), ''));
      });
    return rules;
  }


  _loadListeners(activeWidgetNames) {
    const { ready, ...widgetHandlerMap } = this._getHandlerMap(activeWidgetNames);

    process.on("unhandledRejection", console.warn);
    this.once("ready", () => runHandlers(ready, this));

    Object.keys(widgetHandlerMap).forEach((handlerName) => {
      this.on(handlerName, (...eventArguments) =>
        runHandlers(widgetHandlerMap[handlerName], ...eventArguments)
    )});
  }


  _getHandlerMap(widgetNames) {
    return widgetNames
      .filter(name => this._checkActiveWidget(name))
      .map(widgetName => `../widgets/${widgetName}/handlers`)
      .flatMap(getHandlers)
      .reduce(groupByHandlerName, { ready: [] });
  }
}
