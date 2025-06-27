const winston = require('winston');
const path = require('path');
const fs = require('fs');


const { combine, timestamp, json } = winston.format;

const logger = winston.createLogger({
  level: 'info',
  format: combine (timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), json()),
  transports: [
    new winston.transports.File({
      filename: 'requests.log',
    }),
  ]
});


module.exports = logger;