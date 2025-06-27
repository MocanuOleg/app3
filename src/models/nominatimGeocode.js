const axios = require('axios');

async function geocodeWithNominatim(location) {
  try {
    const { data } = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: location,
        format: 'json',
        addressdetails: 1,
        limit: 3
      },
      headers: {
        'User-Agent': 'AppName/3.0 (mocanuo1997@gmail.com)',
        'Accept-Language': 'en'
      },
       timeout: 3000,
    });

    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }

    return data;
  } catch (error) {
    console.error('Geocoding failed:', error);
    throw error;
  }
}

module.exports = { geocodeWithNominatim };