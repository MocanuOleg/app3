const { getISO3166Code } = require('./isoUtils');


function resultNormalize(query, source, result, index = 0) {
  const id = index + 1;

  const address = result.address || {};
  return {
    query,
    place_id: result.place_id || null,
    osm_id: result.osm_id || null,
    display_name: result.display_name || "Unnamed Location",
    latitude: result.lat || null,
    longitude: result.lon || null,
    category: result.class || "place",
    type: result.type || "unknown",
    addresstype: result.addresstype || "unknown",
    name: result.name || null,
    building: result.building || null,
    house_number: address.house_number || null,
    road: address.road || null,
    quarters: address.quarters || null,
    suburb: address.suburb || address.neighbourhood || null,
    city: address.city || null,
    municipality: address.municipality || null,
    county: address.county || null,
    iso3166: getISO3166Code(address) || null,
    postcode: address.postcode || null,
    country: address.country || null,
    country_code: address.country_code || null,
    hamlet: address.hamlet || null,
    city_district: address.city_district || null,
    town: address.town || null,
    village: address.village || null,

    used_api: source,
  };
}

module.exports = { resultNormalize };


