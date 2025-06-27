  const { ReversegeocodeWithRegio } = require('../models/regioReverseGeocode');
  const { typeOfAddress } = require('../utils/typeOfAddress');

  async function normalizeReverseRegio(lat,lon) {
    
    try{
    const data = await ReversegeocodeWithRegio(lat, lon);

    const result = data.map(item => {
      const contryFromComponent = item.components.find(c => c.type === 'A0')?.name || null;
      const countyFromComponent = item.components.find(c => c.type === 'A1')?.name || null;
      const municipalityFromComponent = item.components.find(c => c.type === 'A2')?.name || null;
      const cityFromComponent = item.components.find(c => c.type === 'A3')?.name || null;
      const suburbFromComponent = item.components.find(c => c.type === 'A4')?.name || null;
      const roadFromComponent = item.components.find(c => c.type === 'A5')?.name || null;
      const house_numberFromComponent = item.components.find(c => c.type === 'A7')?.name || null;

      return {
        query:`${lat},${lon}`,
        place_id: item.id,
        osm_id: null,
        display_name: item.address || "Unnamed Location",
        latitude: item.geometry[1],
        longitude: item.geometry[0],
        category: null,
        addresstype: typeOfAddress(item.type),
        name: null,
        building: null,
        house_number: house_numberFromComponent,
        road: roadFromComponent,
        quarters: null,
        suburb: suburbFromComponent,
        city: cityFromComponent,
        municipality: municipalityFromComponent,
        county: countyFromComponent,
        iso3166: null,
        postcode: item.postcode,
        country: contryFromComponent,
        country_code: null,
        used_api: 'regio'
      };
    });

    return result[0];
    }catch(err){
      console.error('Error in normalizeReverseRegio:', err.message || err);
    }
  }


  module.exports = { normalizeReverseRegio };
