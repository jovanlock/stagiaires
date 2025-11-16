const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuration PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'admin123',
  database: process.env.DB_NAME || 'stagiaire_db',
});

// Middleware
app.use(cors());
app.use(express.json());

// Test de connexion à la base de données
pool.connect((err, client, release) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err.stack);
  } else {
    console.log('✅ Connexion réussie à PostgreSQL');
    release();
  }
});

// Routes

// GET tous les stagiaires
app.get('/api/stagiaires', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM stagiaires ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET un stagiaire par ID
app.get('/api/stagiaires/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM stagiaires WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Stagiaire non trouvé' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST créer un stagiaire
app.post('/api/stagiaires', async (req, res) => {
  try {
    const { nom, prenom, email, telephone, formation, date_debut, date_fin } = req.body;
    const result = await pool.query(
      'INSERT INTO stagiaires (nom, prenom, email, telephone, formation, date_debut, date_fin) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [nom, prenom, email, telephone, formation, date_debut, date_fin]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la création' });
  }
});

// PUT mettre à jour un stagiaire
app.put('/api/stagiaires/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, prenom, email, telephone, formation, date_debut, date_fin } = req.body;
    const result = await pool.query(
      'UPDATE stagiaires SET nom = $1, prenom = $2, email = $3, telephone = $4, formation = $5, date_debut = $6, date_fin = $7 WHERE id = $8 RETURNING *',
      [nom, prenom, email, telephone, formation, date_debut, date_fin, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Stagiaire non trouvé' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

// DELETE supprimer un stagiaire
app.delete('/api/stagiaires/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM stagiaires WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Stagiaire non trouvé' });
    }
    res.json({ message: 'Stagiaire supprimé', stagiaire: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API fonctionnelle' });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});