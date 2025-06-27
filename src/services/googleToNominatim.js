function normalizeGoogleResult(googleData) {
  if (!googleData) {
    throw new Error('Invalid googleData: data is undefined');
  }

  const addressComponents = googleData.address_components || [];
  const geometry = googleData.geometry || {};
  const location = geometry.location || { lat: null, lng: null }; // Default to null

  const address = {};
  for (const comp of addressComponents) {
    const types = comp.types;
    if (types.includes('street_number')) address.house_number = comp.long_name;
    if (types.includes('route')) address.road = comp.long_name;
    if (types.includes('sublocality') || types.includes('sublocality_level_1')) address.suburb = comp.long_name;
    if (types.includes('locality')) address.city = comp.long_name;
    if (types.includes('administrative_area_level_2')) address.county = comp.long_name;
    if (types.includes('administrative_area_level_1')) address.municipality = comp.long_name;
    if (types.includes('postal_code')) address.postcode = comp.long_name;
    if (types.includes('country')) {
      address.country = comp.long_name;
      address.country_code = comp.short_name.toLowerCase();
    }
  }

  return {
    place_id: googleData.place_id,
    osm_id: null,
    display_name: googleData.formatted_address || 'Unnamed Location',
    lat: location.lat,
    lon: location.lng,
    class: 'place',
    type: googleData.types?.[0] || 'unknown',
    addresstype: googleData.types?.[0] || 'unknown',
    name: addressComponents.find(c => c.types.includes('establishment'))?.long_name || null,
    building: null,
    address,
  };
}


module.exports = { normalizeGoogleResult };