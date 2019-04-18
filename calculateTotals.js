const _ = require("lodash");

/**
 * Takes an array of objects that share the same keys,
 * and returns a 'total' object containing the sum of all the values
 * for each key, for each object in the array.
 *
 * Example/ Given [{clicks: 1}, {clicks: 3}] would return {clicks: 3}.
 */
const calculateTotal = results => {
  const total = {};

  // Create a array of all the keys of the objects
  const keys = Object.keys(results[0]);

  // Map through each key, and sum all the values in each
  // object that has this key
  keys.map(key => {
    total[key] = _.sumBy(results, key);
  });

  // Count how many objects have been summed
  total.count = results.length;

  return total;
};
module.exports.calculateTotal = calculateTotal;

/**
 * Given a total object, then we format
 * that object schema so that it can be saved in our
 * database correctly.
 *
 * It also fixes the CTR and position results, as we
 * actually require the average - not the total for these
 * figures.
 */
const formatKeyphraseTotal = total => {
  const formattedTotal = { ...total };
  const { count } = formattedTotal;

  formattedTotal.ctr = calculateAverage(formattedTotal.ctr, count);
  formattedTotal.position = calculateAverage(formattedTotal.position, count);

  if (formattedTotal.ctr === undefined) {
    console.log("BLUE", total);
  }

  // As object may not have these properties, we check for them first
  // if they do exist, then we delete these properties
  formattedTotal.device ? delete formattedTotal.device : null;
  formattedTotal.country ? delete formattedTotal.country : null;
  formattedTotal.count ? delete formattedTotal.count : null;

  return formattedTotal;
};
module.exports.formatKeyphraseTotal = formatKeyphraseTotal;

/**
 * Generates the average and typecasts to integer.
 *
 * @param {*} total sum of all values
 * @param {*} length number of values summed
 */
function calculateAverage(total, length) {
  return Number(total) / Number(length);
}
