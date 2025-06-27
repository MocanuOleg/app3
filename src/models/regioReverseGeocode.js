
require('dotenv').config();
const axios = require('axios');





async function ReversegeocodeWithRegio(lat, lan) {
  try {
    const detailsURL = [
      'id', 'parent_id', 'address', 'postcode', 'type', 'status', 'is_valid',
      'is_complete', 'is_building', 'ads_adr_id', 'address_code', 'components', 'geometry'
    ];
    const regioAPI_KEY = process.env.REGIO_GEOCODE_API_KEY;
   
    const url = 'https://api.regio.ee/revgeocode';


    const response = await axios.get(url,{
      params:{
        lng: lan,
        lat: lat,
        query_type: 'address',
        country: 'ee,lt,lv',
        address_format: 'long_address',
        limit: 3,
        details: detailsURL.join(','),
        apikey: regioAPI_KEY
        
      }
    });
    
    return response.data.data;
    
    //console.log(regioResponse);


}catch(err){
  console.error('Error in geocodeWithRegio:', err.message);

  }
  
}
//geocodeWithRegio('tamme 20');


module.exports =  {ReversegeocodeWithRegio} ; 

