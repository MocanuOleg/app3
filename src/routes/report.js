const express = require('express');
const router = express.Router();
const { logs_report } = require('../services/report_service');


router.get('/', async (req, res) => {
  const time = req.query.time;
  const step = req.query.step;
  const source = req.query.source?.trim();

  let start, end;

  if (!time) {
    return res.status(400).json({ 
      error: 'Missing required time parameter',
      message: 'Please provide a time using ?time=start_time,end_time'
    });
  }

  [start, end] = time.split(',');

  if (!step || isNaN(parseInt(step))) {
    return res.status(400).json({ error: 'Invalid or missing step parameter' });
  }

  try {
    const data = await logs_report(start, end, step, source);
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Unexpected server error' });
  }
});

module.exports = router;