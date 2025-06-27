const axios = require('axios');
const db = require('../config/knex');
const logger = require('../utils/logger');
const { logKafka } = require('../utils/kafka_producer');
const { DateTime } = require('luxon');

async function logs_report(start, end, step, source) {
  try {
    let query = db('logs')
      .whereBetween('time_stamp', [start, end]);

    if (source) {
      query = query.where('source', source);
    }

    const rows = await query.select('*');

    const stepMS = parseInt(step, 10) * 1000;
    const grouped = {};

    for (const row of rows) {
      const timestamp = DateTime.fromISO(row.time_stamp.toISOString());
      const source = row.source;
      const start_time = DateTime.fromISO(start);

      const time_diff = timestamp.diff(start_time).as('milliseconds');
      const index = Math.round(time_diff / stepMS);
      const report_time = start_time.plus({ milliseconds: index * stepMS }).toFormat('yyyy:MM:dd HH:mm:ss');

      if (!grouped[source]) {
        grouped[source] = [];
      }

      let bucket = grouped[source].find(entry => entry.time === report_time);

      if (!bucket) {
        bucket = { time: report_time, count: 0 };
        grouped[source].push(bucket);
      }

      bucket.count += 1;
    }

    return grouped;
  } catch (err) {
    logger.error('Error in logs_report:', err);
    return null;
  }
}

module.exports = { logs_report };