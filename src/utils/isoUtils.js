// Get the most specific ISO3166 code
function getISO3166Code(address) {
  const levels = [
    "ISO3166-2-lvl7",
    "ISO3166-2-lvl6",
    "ISO3166-2-lvl5",
    "ISO3166-2-lvl4",
    "ISO3166-2-lvl3",
    "ISO3166-2-lvl2",
    "ISO3166-2-lvl1",
  ];

  for (const level of levels) {
    if (address[level]) {
      return address[level];
    }
  }
  return null;
}

module.exports = { getISO3166Code };