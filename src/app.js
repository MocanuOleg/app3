require('dotenv').config();
const cluster = require('cluster');
const os = require('os');


const PORT = process.env.PORT || 3000;

if (cluster.isMaster) {
  //console.log(`Master process ID: ${process.pid}`);
  const numCPUs = os.cpus().length;
  for (let i = 0; i < 16; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    //console.log(`Worker process ID ${worker.process.pid} died`);
    //console.log('Forking a new worker...');
    cluster.fork();
  });

} else {
  const express = require('express');
  const search = require('./routes/search');
  const report = require('./routes/report');

  const app = express();
  app.use(express.json());

  app.use('/search', search);
  app.use('/report', report);

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT} (PID: ${process.pid})`);
  });
}
