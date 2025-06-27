const axios = require('axios');

async function ReverseGeocodeWithNominatim(lat,lon) {
  try {
    const { data } = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat: lat,
        lon: lon,
        format: 'json',
        addressdetails: 1,
        //limit: 3
      },
      headers: {
        'User-Agent': 'AppName/3.0 (mocanuo1997@gmail.com)',
        'Accept-Language': 'en'
      },
       timeout: 3000,
    });

   if (!data || !data.address) {
  return null;
  }

    return data;
  } catch (error) {
    console.error(' Nominatim Reverse Geocoding failed:', error);
    throw error;
  }
}

module.exports = { ReverseGeocodeWithNominatim };