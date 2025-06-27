const { getISO3166Code } = require('../utils/isoUtils');
const { formatResultsArray } = require('../utils/resultFormat');
const { getClientAllowedApis } = require('../models/apiPermissionModel');
const { geocodeWithGoogle } = require('../models/googleGeocode');
const { geocodeWithNominatim } = require('../models/nominatimGeocode');
const logger = require('../utils/logger');
const { logKafka } = require('../utils/kafka_producer');
const { sendQueryMessage } = require('../utils/kafka_producer');
const { resultNormalize } = require('../utils/resultNormalize');
const {ReverseGeocodeWithNominatim} = require('../models/nominatimReverseGeocode')
const {ReverseGeocodeWithGoogle} = require('../models/googleReverseGeocode')
const { normalizeRegio } = require('./regioToNomimatim');
const { normalizeReverseRegio } = require('./reverseregioToNominatim');


const db = require('../config/knex');


async function saveLocation(response, searchTerm, api) {
  const address = response.address || {};
  const isoCode = getISO3166Code(response);
  
  const message = {
    query: searchTerm,
    place_id: response.place_id,
    osm_id: response.osm_id,
    display_name: response.display_name,
    latitude: response.latitude,
    longitude: response.longitude,
    category: response.category,
    type: response.type,
    addresstype: response.addresstype,
    name: response.name,
    building: response.building,
    house_number: response.house_number || null,
    road: response.road || null,
    quarters: response.quarters || null,
    suburb: response.suburb || null,
    city: response.city || null,
    municipality: response.municipality || null,
    county: response.county || null,
    iso3166: isoCode,
    postcode: response.postcode || null,
    country: response.country || null,
    country_code: response.country_code || null,
    used_api: api
  };




  try {
     /*
    const { rows } = await client.query(
      `INSERT INTO address (
        query, place_id, osm_id, display_name, latitude, longitude,
        category, type, addresstype, name, building, house_number,
        road, quarters, suburb, city, municipality, county, iso3166,
        postcode, country, country_code, used_api
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12,
        $13, $14, $15, $16, $17, $18, $19,
        $20, $21, $22, $23
      ) RETURNING *`,
      [
        searchTerm,
        response.place_id,
        response.osm_id,
        response.display_name,
        response.latitude,
        response.longitude,
        response.category,
        response.type,
        response.addresstype,
        response.name,
        response.building,
        response.house_number || null,
        response.road || null,
        response.quarters || null,
        response.suburb || null,
        response.city || null,
        response.municipality || null,
        response.county || null,
        response.iso3166,
        response.postcode || null,
        response.country || null,
        response.country_code || null,
        api
      ]
    );
    return rows[0];
    */

    //knew logic
    /*
    const [row] = await db('address')
      .insert({
        query: searchTerm,
        place_id: response.place_id,
        osm_id: response.osm_id,
        display_name: response.display_name,
        latitude: response.latitude,
        longitude: response.longitude,
        category: response.category,
        type: response.type,
        addresstype: response.addresstype,
        name: response.name,
        building: response.building,
        house_number: response.house_number || null,
        road: response.road || null,
        quarters: response.quarters || null,
        suburb: response.suburb || null,
        city: response.city || null,
        municipality: response.municipality || null,
        county: response.county || null,
        iso3166: isoCode,
        postcode: response.postcode || null,
        country: response.country || null,
        country_code: response.country_code || null,
        used_api: api
      })
      .returning('*');

    return row;

    */
    await sendQueryMessage(message);return message;
  } catch (error) {
    console.error('Error saving location:', error);
    throw error;
  }
}


async function checkExistingSearchOrCoordinates(searchTerm = null, lat = null, lon = null) {
  try {
    let rows;

    if (searchTerm) {
      const normalizedQuery = searchTerm.trim().normalize('NFC').toLocaleLowerCase('tr');

      rows = await db('address')
        .select(
          'query', 'place_id', 'osm_id', 'display_name', 'latitude', 'longitude',
          'category', 'type', 'addresstype', 'name', 'building', 'house_number',
          'road', 'quarters', 'suburb', 'city', 'municipality', 'county', 'iso3166',
          'postcode', 'country', 'country_code', 'used_api'
        )
        .whereRaw('LOWER(query) = ?', [normalizedQuery]);
    } else if (lat && lon) {
      rows = await db('address')
        .select(
          'query', 'place_id', 'osm_id', 'display_name', 'latitude', 'longitude',
          'category', 'type', 'addresstype', 'name', 'building', 'house_number',
          'road', 'quarters', 'suburb', 'city', 'municipality', 'county', 'iso3166',
          'postcode', 'country', 'country_code', 'used_api'
        )
        .where({ latitude: lat, longitude: lon });
    }

    return rows?.length > 0 ? rows : null;

  } catch (error) {
    console.error('Error in checkExistingSearchOrCoordinates:', error);
    return null;
  }
}

/*
async function checkExistingSearch(searchTerm) {
  const normalizedQuery = searchTerm.trim().normalize('NFC').toLocaleLowerCase('tr');

  try {

    /*
    const { rows } = await client.query(
      `SELECT query, place_id, osm_id, display_name, latitude, longitude,
              category, type, addresstype, name, building, house_number,
              road, quarters, suburb, city, municipality, county, iso3166,
              postcode, country, country_code, used_api
       FROM address
       WHERE LOWER(query) = $1`,
      [normalizedQuery]
    );

    return rows.length > 0 ? rows : null;
    ==================


    const rows = await db('address')
      .select(
        'query', 'place_id', 'osm_id', 'display_name', 'latitude', 'longitude',
        'category', 'type', 'addresstype', 'name', 'building', 'house_number',
        'road', 'quarters', 'suburb', 'city', 'municipality', 'county', 'iso3166',
        'postcode', 'country', 'country_code', 'used_api'
      )
      .whereRaw('LOWER(query) = ?', [normalizedQuery]);

    return rows.length > 0 ? rows : null;
  } catch (error) {
    console.error('Error in checkExistingSearch:', error);
    return null;
  }
}
*/


async function fetchAndSaveLocation(searchTerm, businessid, use_all_apis = false, off_cache = false) {
  // Step 1: Get allowed APIs for the client
  const allowedApis = await getClientAllowedApis(businessid, use_all_apis);
  const apisToQuery = use_all_apis ? allowedApis : [allowedApis[0]];

  try {
    // Step 2: Check for cached result
    if (!off_cache && off_cache !== '1') {
      const existing = await checkExistingSearchOrCoordinates(searchTerm);
      if (existing) {
        logger.info('Location fetched', { source: 'cache' });
        logKafka('cache', businessid || 0);
        return {
          success: true,
          source: 'cached',
          location: formatResultsArray(existing, searchTerm)
        };
      }
    }

    let results = [];
    let sourcesUsed = [];

    // Step 3: Call external geocoding APIs
    for (const api of apisToQuery) {
      try {
        if (api === 'nominatim') {
          const nominatimResults = await geocodeWithNominatim(searchTerm);

          if (Array.isArray(nominatimResults) && nominatimResults.length > 0) {
            const normalizedNominatim = [];

            for (let idx = 0; idx < nominatimResults.length; idx++) {
              try {
                const normalizedItem = resultNormalize(searchTerm, api, nominatimResults[idx], idx);
                normalizedNominatim.push(normalizedItem);
              } catch (err) {
                console.error(`Error normalizing item at index ${idx}:`, err);
              }
            }

            for (const item of normalizedNominatim) {
              try {
                await saveLocation(item, searchTerm, api);
              } catch (err) {
                console.error('Error saving location:', err);
              }
            }

            logKafka('nominatim', businessid || 0 );
            results.push(...normalizedNominatim);
            sourcesUsed.push(api);
          }
        } else if (api === 'google') {
          const googleResult = await geocodeWithGoogle(searchTerm);

          if (googleResult) {
            const normalizedGoogle = resultNormalize(searchTerm, api, googleResult);
            await saveLocation(normalizedGoogle, searchTerm, api);
            logKafka('google', businessid || 0);
            results.push(normalizedGoogle);
            sourcesUsed.push(api);
          }
        }else if (api === 'regio') {
      const regioResults = await normalizeRegio(searchTerm);

      if (Array.isArray(regioResults) && regioResults.length > 0) {
        for (const item of regioResults) {
          try {
            await saveLocation(item, searchTerm, api);
          } catch (err) {
            console.error('Error saving regio location:', err);
          }
        }

        logKafka('regio', businessid || 0);
        results.push(...regioResults);
        sourcesUsed.push(api);
      }
    }
  }
      catch (apiErr) {
        logger.warn(`API error with ${api}: ${apiErr.message}`);
      }

      // Step 4: Stop if one API already provided result (unless using all)
      if (!use_all_apis && results.length > 0) break;
    }

    // Step 5: Return results if found
    if (results.length > 0) {
      return {
        success: true,
        source: sourcesUsed.join(','),
        location: formatResultsArray(results, searchTerm)
      };
    }

    return null;
  } catch (error) {
    console.error('fetchAndSaveLocation error:', error);
    throw error;
  }
}
async function fetchAndSaveReverseLocation(lat, lon, businessId, use_all_apis = false, off_cache = false) {
  const allowedApis = await getClientAllowedApis(businessId, use_all_apis);
  const apisToQuery = use_all_apis ? allowedApis : [allowedApis[0]];

    try {
    // Step 1: Check if result exists in cache (DB) by lat/lon
    if (!off_cache && off_cache !== '1') {
      const existing = await checkExistingSearchOrCoordinates(`${lat},${lon}`);
      if (existing) {
        logger.info('Reverse location fetched from cache');
        logKafka('cache', businessId || 0);
        return {
          success: true,
          source: 'cached',
          location: formatResultsArray(existing, `${lat},${lon}`)
        };
      }
    
  }

  let results = [];
  let sourcesUsed = [];



  for (const api of apisToQuery) {

    try {
      if (api === 'nominatim') {
        const data = await ReverseGeocodeWithNominatim(lat, lon);
         console.log('Nominatim reverse data:', data);
        if (data) {
          const normalized = resultNormalize(`${lat},${lon}`, api, data);
          await saveLocation(normalized, `${lat},${lon}`, api);
          results.push(normalized);
          sourcesUsed.push(api);
          logKafka(api, businessId || 0);
        }
      } else if (api === 'google') {
        const data = await ReverseGeocodeWithGoogle(lat, lon);
        if (data) {
          const normalized = resultNormalize(`${lat},${lon}`, api, data);
          await saveLocation(normalized, `${lat},${lon}`, api);
          results.push(normalized);
          sourcesUsed.push(api);
          logKafka(api, businessId || 0);
        }
      } else if (api === 'regio') {
        const normalized = await normalizeReverseRegio(lat, lon);
        if (normalized) {
          await saveLocation(normalized, `${lat},${lon}`, api);
          results.push(normalized);
          sourcesUsed.push(api);
          logKafka(api, businessId || 0);
        }
      }
    } catch (err) {
      logger.warn(`Reverse API error with ${api}: ${err.message}`);
    }

    if (!use_all_apis && results.length > 0) break;
  }

  if (results.length > 0) {
    return {
      success: true,
      source: sourcesUsed.join(','),
      location: formatResultsArray(results, `${lat},${lon}`)
    };
  }

  return null;
}
catch (err) {
    console.error('fetchAndSaveReverseLocation error:', err);
    throw err;}}






module.exports = { fetchAndSaveLocation ,fetchAndSaveReverseLocation};
