const axios = require('axios');
const { normalizeGoogleResult } = require('../services/googleToNominatim');

async function ReverseGeocodeWithGoogle(lat, lon) {
  try {
    const apiKey = process.env.GOOGLE_GEOCODE_API_KEY;
    if (!apiKey) {
      throw new Error('Missing GOOGLE_GEOCODE_API_KEY environment variable');
    }

    const url = 'https://maps.googleapis.com/maps/api/geocode/json';

    const { data } = await axios.get(url, {
      params: {
        latlng: `${lat},${lon}`,
        key: apiKey
      }
    });

    if (!data.results || data.results.length === 0) {
      throw new Error('Google Reverse Geocoding failed: ZERO_RESULTS');
    }

    const firstResult = data.results[0];

    if (!firstResult.address_components || !Array.isArray(firstResult.address_components)) {
      throw new Error('Invalid Google data: address_components is not an array');
    }

    const formatted = normalizeGoogleResult(firstResult);
    return formatted;

  } catch (error) {
    console.error(`Google reverse geocoding error for [${lat},${lon}]:`, error.message);
    throw error;
  }
}

module.exports = { ReverseGeocodeWithGoogle };
