const express = require('express');
const pool = require('./db');
const routes = require('./routes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', routes);

// Create table if it doesn't exist
const initDb = async (retries = 5) => {
  while (retries) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS todos (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          completed BOOLEAN DEFAULT false
        )
      `);
      console.log('Database initialized');
      return;
    } catch (err) {
      console.log(`Database not ready, retrying... (${retries} attempts left)`);
      retries -= 1;
      await new Promise(res => setTimeout(res, 3000));
    }
  }
  console.error('Database initialization failed after all retries');
};

app.listen(PORT, async () => {
  await initDb();
  console.log(`Server running on port ${PORT}`);
});
