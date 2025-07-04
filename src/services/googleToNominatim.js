const { getISO3166Code } = require('../utils/isoUtils');

function normalizeGoogleResult(googleData, query = null) {
  if (!googleData) throw new Error('Invalid googleData');

  const components = googleData.address_components || [];
  const geometry = googleData.geometry || {};
  const location = geometry.location || {};

  const address = {
    house_number: null,
    road: null,
    suburb: null,
    city: null,
    county: null,
    municipality: null,
    country: null,
    country_code: null,
    postcode: null,
    town: null,
    village: null,
    hamlet: null,
    city_district: null,
    quarters: null
  };

  components.forEach(comp => {
    const types = comp.types || [];
    const value = comp.long_name;

    if (types.includes('street_number')) address.house_number = value;
    if (types.includes('route')) address.road = value;
    if (types.includes('sublocality')) address.suburb = value;
    if (types.includes('neighborhood')) address.quarters = value;
    if (types.includes('postal_code')) address.postcode = value;
    if (types.includes('country')) {
      address.country = comp.long_name;
      address.country_code = comp.short_name.toLowerCase();
    }
    if (types.includes('postal_town')) address.town = value;

    if (types.includes('village')) {
      address.village = value;
    } else if (types.includes('administrative_area_level_3') || types.includes('administrative_area_level_4')) {
      address.hamlet = value;
    } else if (types.includes('locality')) {
      if (!address.village && !address.hamlet) {
        address.city = value;
      }
    }

    if (types.includes('administrative_area_level_2')) address.county = value;
    if (types.includes('administrative_area_level_1')) address.municipality = value;
  });

  let mainType = googleData.types?.[0] || 'unknown';
  if (address.village) mainType = 'village';
  else if (address.hamlet) mainType = 'hamlet';
  else if (address.town) mainType = 'town';
  else if (address.city) mainType = 'city';

  return {
    query,
    place_id: googleData.place_id || null,
    display_name: googleData.formatted_address || 'Unnamed Location',
    latitude: location.lat || null,
    longitude: location.lng || null,
    category: 'place',
    type: mainType,
    addresstype: mainType,
    name: components.find(c => c.types.includes('establishment'))?.long_name || null,
    ...address,
    iso3166: getISO3166Code(address),
    used_api: 'google',
    
  };
}

module.exports = { normalizeGoogleResult };
