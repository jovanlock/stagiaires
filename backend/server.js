// server.js
const express = require("express");
const cors = require("cors");
const stagiaireRoutes = require("./routes/stagiaireRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/stagiaires", stagiaireRoutes);

// Route santé
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "API fonctionnelle" });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});

