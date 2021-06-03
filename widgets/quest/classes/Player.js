class Inventory = require(`./Inventory`);

module.exports = class Player extends Inventory {
  constructor(member){
    this.super(member);
    this.stats = {
      'STR': 10
      'DEX': 10
      'CON': 10
      'WIS': 10
      'INT': 10
      'CHA': 10
    };
  }

  roll(stat=''){
    let modif = 0
    if (stat in this.stats) modif = Math.floor(this.stats.stat/2)-5;
    return Math.floor(Math.random() * 20) + modif;
  }

}
