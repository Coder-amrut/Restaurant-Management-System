require('dotenv').config();
const app = require('./app');
const connectDatabase = require('./config/db');

const port = Number(process.env.PORT || 4000);

async function start() {
  await connectDatabase();
  app.listen(port, () => console.log(`API listening on port ${port}`));
}

start().catch(error => {
  console.error('Unable to start server:', error.message);
  process.exit(1);
});
