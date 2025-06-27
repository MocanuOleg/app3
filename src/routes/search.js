const express = require('express');
const router = express.Router();
const { fetchAndSaveLocation, fetchAndSaveReverseLocation } = require('../services/service');

router.get('/', async (req, res) => {
  const location = req.query.q?.trim();
  const lat = req.query.lat?.trim();
  const lon = req.query.lon?.trim();
  const businessid = req.query.business_id?.trim();
  const use_all_apis = req.query.use_all_apis === '1';
  const off_cache = req.query.off_cache === '1';

  console.log('Received query params:', { location, lat, lon, use_all_apis });

  if (!location && (!lat || !lon)) {
    return res.status(400).json({
      error: 'Missing required parameters',
      message: 'Please provide either ?q=location or both ?lat= and ?lon='
    });
  }

  try {
    let result;

    if (lat && lon) {
      // Reverse geocoding
      result = await fetchAndSaveReverseLocation(lat, lon, businessid, use_all_apis, off_cache);;
    } else {
      // Forward geocoding
      result = await fetchAndSaveLocation(location, businessid, use_all_apis, off_cache);
    }

    if (!result) {
      return res.status(404).json({
        error: 'Location not found',
        searched_query: location || `${lat},${lon}`
      });
    }

    res.json({
      success: true,
      source: result.source || null,
      location: result.location
    });

  } catch (error) {
    console.error(`Geocoding error:`, error.message);
    res.status(500).json({
      error: 'Geocoding service unavailable',
      code: 'SERVICE_ERROR'
    });
  }
});

module.exports = router;
