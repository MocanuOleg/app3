  const { geocodeWithRegio } = require('../models/regioGeocode');
  const { typeOfAddress } = require('../utils/typeOfAddress');

  async function normalizeRegio(query) {
    
    try{
    const data = await geocodeWithRegio(query);

    const result = data.map(item => {
      const contryFromComponent = item.components.find(c => c.type === 'A0')?.name || null;
      const countyFromComponent = item.components.find(c => c.type === 'A1')?.name || null;
      const municipalityFromComponent = item.components.find(c => c.type === 'A2')?.name || null; //CITY FIELD
      const settlement = item.components.find(c => c.type === 'A3')?.name || null;
      const suburbFromComponent = item.components.find(c => c.type === 'A4')?.name || null; 
      const roadFromComponent = item.components.find(c => c.type === 'A5')?.name || null;
      const house_numberFromComponent = item.components.find(c => c.type === 'A7')?.name || null;

      let town = null;
      let village = null;

      //const settlement = item.components.find(c => c.type === 'A3')?.name || null;

            if (settlement) {
        if (settlement.toLowerCase().includes('küla')) {
          village = settlement;
        } else {
            town = settlement;
        }
      }





      return {
        query,
        place_id: item.id,
        osm_id: null,
        display_name: item.address || "Unnamed Location",
        latitude: item.geometry[1],
        longitude: item.geometry[0],
        category: null,
        addresstype: typeOfAddress(item.type),
        name: null,
        building: house_numberFromComponent || null,
        house_number: house_numberFromComponent,
        road: roadFromComponent,
        quarters: null,
        suburb: suburbFromComponent,
        city: settlement,
        municipality: municipalityFromComponent,
        county: countyFromComponent,
        iso3166: null,
        postcode: item.postcode,
        country: contryFromComponent,
        country_code: null,
        hamlet:  null,
        city_district:  null,
        town: town || null,
        village:village,
        used_api: 'regio'
      };
    });

    return result;
    }catch(err){
      console.error('Error in normalizeRegio:', err.message || err);
    }
  }


  module.exports = { normalizeRegio };
