
```
app_v3
├─ .env
├─ package-lock.json
├─ package.json
└─ src
   ├─ app.js
   ├─ config
   │  ├─ cacheConfig.js
   │  └─ knex.js
   ├─ models
   │  ├─ apiPermissionModel.js
   │  ├─ googleGeocode.js
   │  ├─ googleReverseGeocode.js
   │  ├─ nominatimGeocode.js
   │  ├─ nominatimReverseGeocode.js
   │  ├─ regioGeocode.js
   │  └─ regioReverseGeocode.js
   ├─ routes
   │  ├─ report.js
   │  └─ search.js
   ├─ services
   │  ├─ cache
   │  │  ├─ cacheClient.js
   │  │  ├─ index.js
   │  │  └─ permissionCache.js
   │  ├─ googleToNominatim.js
   │  ├─ regioToNomimatim.js
   │  ├─ report_service.js
   │  ├─ reverseRegioToNominatim.js
   │  └─ service.js
   └─ utils
      ├─ isoUtils.js
      ├─ kafka_producer.js
      ├─ logger.js
      ├─ resultFormat.js
      ├─ resultNormalize.js
      └─ typeOfAddress.js

```