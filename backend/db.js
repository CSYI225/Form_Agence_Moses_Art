const mysql = require('mysql2/promise');
require('dotenv').config();

let pool;

async function initDB() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
    const dbName = process.env.DB_NAME || 'moses_art';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await connection.end();

    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    // 3. Create the contacts table if it does not exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fullName VARCHAR(255) NOT NULL,
        company VARCHAR(255),
        role VARCHAR(255),
        phone VARCHAR(50),
        email VARCHAR(255) NOT NULL,
        services JSON NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await pool.query(createTableQuery);
    console.log('Database initialized successfully: Table "contacts" is ready.');
  } catch (error) {
    console.error('Failed to initialize database:', error.message);
    console.log('Ensure MySQL is running and DB_USER/DB_PASSWORD in backend/.env match your credentials.');
  }
}

// Initialize the database on load
initDB();

module.exports = {
  query: (sql, params) => {
    if (!pool) {
      throw new Error('Database pool not initialized. Check server console for errors.');
    }
    return pool.query(sql, params);
  }
};
