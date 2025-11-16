-- Création de la table stagiaires
CREATE TABLE IF NOT EXISTS stagiaires (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telephone VARCHAR(20),
    formation VARCHAR(255) NOT NULL,
    date_debut DATE NOT NULL,
    date_fin DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Données d'exemple
INSERT INTO stagiaires (nom, prenom, email, telephone, formation, date_debut, date_fin) VALUES
('Dupont', 'Marie', 'marie.dupont@example.com', '0612345678', 'Développement Web', '2025-01-15', '2025-06-15'),
('Martin', 'Pierre', 'pierre.martin@example.com', '0623456789', 'Data Science', '2025-02-01', '2025-07-31'),
('Bernard', 'Sophie', 'sophie.bernard@example.com', '0634567890', 'DevOps', '2025-01-10', '2025-04-10'),
('Dubois', 'Thomas', 'thomas.dubois@example.com', '0645678901', 'Cybersécurité', '2025-03-01', '2025-08-31');