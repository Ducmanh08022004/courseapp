require('dotenv').config();
const sequelize = require('./config/db');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected as', process.env.DB_USER);
  } catch (err) {
    console.error('Database connection failed:', err.message);
  }
})();
