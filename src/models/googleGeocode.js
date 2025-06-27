require('dotenv').config();
const axios = require('axios');
const { normalizeGoogleResult  } = require('../services/googleToNominatim');

async function geocodeWithGoogle(query) {
  //console.log(`google`);
  try {
    const apiKey = process.env.GOOGLE_GEOCODE_API_KEY;
    const url = 'https://maps.googleapis.com/maps/api/geocode/json';

    const { data } = await axios.get(url, {
      params: {
        address: query,
        key: apiKey
      }
    });
    
    if (!data.results || data.results.length === 0) {
      console.log('1');
      throw new Error('Google Geocoding failed: ZERO_RESULTS');
      
    }

   
    const firstResult = data.results[0];
    console.log('sa',firstResult);
    if (!firstResult.address_components || !Array.isArray(firstResult.address_components)) {
      throw new Error('Invalid googleData: address_components is not an array');
    }
   

    const formatted = normalizeGoogleResult (firstResult);
    //console.log(formatted);
    return formatted;

  } catch (error) {
    //console.error(`Google geocoding for "${query}":`, error.message);
    throw error;
  }
}

module.exports = {geocodeWithGoogle};
