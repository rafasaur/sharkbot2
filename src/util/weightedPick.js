
// pass an array of {weight:, ...} objs, return one randomly based on weights
// entries MUST have obj.weight property
module.exports = (weightArray, total=0) => {
  let totalWeight = 0;
  if (total <= 0) weightArray.forEach(obj => totalWeight += obj.weight)
  else totalWeight = total;

  const roll = Math.random() * totalWeight;

  let i = -1; let run = 0;
  while (run < roll) {
    run += weightArray[++i].weight;
  }
  return weightArray[i];
}
