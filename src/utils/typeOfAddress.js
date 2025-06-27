const addressTypes = new Map([
  ['A0', 'World'],
  ['A1', 'Country'],
  ['A2', 'County/province'],
  ['A3', 'Municipality'],
  ['A4', 'City'],
  ['A5', 'Street'],
  ['A6', 'Building'],
  ['A7', 'Building'],
  ['A8', 'Apartment']
]);

function typeOfAddress(type) {
  return addressTypes.get(type) || 'Unknown';
}


module.exports = { typeOfAddress };