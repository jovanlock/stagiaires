// routes/stagiaireRoutes.js
const express = require("express");
const pool = require("../db");

const router = express.Router();

// GET tous les stagiaires
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM stagiaires ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// GET un stagiaire
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM stagiaires WHERE id = $1", [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Stagiaire non trouvé" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST créer
router.post("/", async (req, res) => {
  try {
    const { nom, prenom, email, telephone, formation, date_debut, date_fin } =
      req.body;

    const result = await pool.query(
      `INSERT INTO stagiaires (nom, prenom, email, telephone, formation, date_debut, date_fin)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [nom, prenom, email, telephone, formation, date_debut, date_fin]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la création" });
  }
});

// PUT update
router.put("/:id", async (req, res) => {
  try {
    const { nom, prenom, email, telephone, formation, date_debut, date_fin } =
      req.body;

    const result = await pool.query(
      `UPDATE stagiaires SET nom=$1, prenom=$2, email=$3, telephone=$4,
       formation=$5, date_debut=$6, date_fin=$7 WHERE id=$8 RETURNING *`,
      [nom, prenom, email, telephone, formation, date_debut, date_fin, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Stagiaire non trouvé" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM stagiaires WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Stagiaire non trouvé" });
    }

    res.json({ message: "Stagiaire supprimé", stagiaire: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
});

module.exports = router;

