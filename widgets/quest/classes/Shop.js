module.exports = class Shop {
  constructor(items) {
    this.defaultItems = items;
    this.currentStock = {};
    this.stockShelves();
  }

  stockShelves(items={}) {
    this.currentStock = {};
    if (
      Object.entries(items).length + Object.entries(this.defaultItems) < 8
    ) {
      Object.entries(this.defaultItems).forEach(item => {
        this.currentStock[item[0]] = {cost: item[1], qty: Infinity};
      });
      Object.entries(items).forEach(item => {
        this.currentStock[item[0]] = {cost: item[1], qty: 1};
      });
    }

    else {
      let defItemList = Object.keys(this.defaultItems);
      let addItemList = Object.keys(items);
      let randIndex = Math.floor(Math.random()*defItemList.length)
      let thisItem = '';

      while (
        Object.entries(this.currentStock).length < 3 &&
        Object.entries(this.currentStock).length < Object.entries(this.defaultItems).length
      ) {
        thisItem = defItemList.splice(randIndex,1);
        this.currentStock[thisItem] = {cost: this.defaultItems.thisItem, qty: Infinity};
        randIndex = Math.floor(Math.random()*defItemList.length);
      }

      randIndex = Math.floor(Math.random()*addItemList.length);
      while (
        Object.entries(this.currentStock).length < 7 &&
        Object.entries(this.currentStock).length-3 < Object.entries(items).length
      ) {
        thisItem = addItemList.splice(randIndex,1);
        this.currentStock[thisItem] = {cost: items.thisItem, qty: 1};
        randIndex = Math.floor(Math.random()*addItemList.length);
      }
    }

    return this.currentStock;
  }
}
