
module.exports = class Inventory {
  constructor(member){
    this.member = member;
    this.points = 0;
    this.items = {};
    this.cursed = false;
  }

  getPoints(message){
    return message.reply(`you have ${this.points} points!`);
  }

  updateData(){
    if (!this.member.data) this.member.createBlankData();
    this.member.data.points = this.points;
  }

  addPoints(income){
    this.points += income;
    this.updateData();
    return this.points;
  }

  spendPoints(outcome){
    if (this.member.user.isOwner() || this.member.isMod()) return this.points;
    if (outcome > this.points) return false;
    this.points -= outcome;
    this.updateData();
    return this.points;
  }

  getItems(message){
    let itemList = [];
    Object.entries(this.items).forEach(item => {
      itemList.push(`${item[1]} ${item[0]}`)
    })
    return message.author.send(`your item pouch contains:\n>>> ${itemList.join('\n')}`)
  }

  addItems(item, qty=1){
    if (!Object.keys(this.items).includes(item)) this.items[item] = qty;
    else this.items[item] += qty;
  }

  spendItems(item, qty=1){
    if (!Object.keys(this.items).includes(item)) return false;
    else if (qty > items[item]) {
      qty = items[item];
      items[item] = 0;
    }
    else this.items[item] -= qty;
    if (this.items[item] <= 0) this.items[item].delete();
    return qty;
  }
}
