// db.js
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || "admin",
  password: process.env.DB_PASSWORD || "admin123",
  database: process.env.DB_NAME || "stagiaire_db",
});

// Test de connexion
pool.connect((err, client, release) => {
  if (err) {
    console.error("Erreur de connexion à la base de données:", err.stack);
  } else {
    console.log("✅ Connexion réussie à PostgreSQL");
    release();
  }
});

module.exports = pool;

