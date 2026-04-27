const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

const connectDB = async () => {
  let retries = 5;

  while (retries) {
    try {
      await pool.connect();
      console.log('✅ PostgreSQL connected');
      break;
    } catch (err) {
      console.log('⏳ DB belum siap, retrying...');
      retries--;
      await new Promise(res => setTimeout(res, 3000));
    }
  }

  if (!retries) {
    console.error('❌ Gagal connect ke PostgreSQL');
  }
};

module.exports = {
  pool,
  connectDB
};