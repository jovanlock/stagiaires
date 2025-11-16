import { useState, useEffect } from 'react';

const API_URL = '/api';

function App() {
  const [stagiaires, setStagiaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    formation: '',
    date_debut: '',
    date_fin: ''
  });

  useEffect(() => {
    fetchStagiaires();
  }, []);

  const fetchStagiaires = async () => {
    try {
      const res = await fetch(`${API_URL}/stagiaires`);
      const data = await res.json();
      setStagiaires(data);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId ? `${API_URL}/stagiaires/${editingId}` : `${API_URL}/stagiaires`;
      const method = editingId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        fetchStagiaires();
        resetForm();
      }
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce stagiaire ?')) {
      try {
        await fetch(`${API_URL}/stagiaires/${id}`, { method: 'DELETE' });
        fetchStagiaires();
      } catch (err) {
        console.error('Erreur:', err);
      }
    }
  };

  const handleEdit = (stag) => {
    setEditingId(stag.id);
    setFormData({
      nom: stag.nom,
      prenom: stag.prenom,
      email: stag.email,
      telephone: stag.telephone,
      formation: stag.formation,
      date_debut: stag.date_debut,
      date_fin: stag.date_fin
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      formation: '',
      date_debut: '',
      date_fin: ''
    });
    setEditingId(null);
    setShowModal(false);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-2xl text-indigo-600 font-semibold">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-8 sm:px-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Gestion des Stagiaires
            </h1>
            <p className="text-indigo-100 text-sm sm:text-base">
              Gérez facilement vos stagiaires et leurs formations
            </p>
          </div>

          {/* Button Ajouter */}
          <div className="px-6 py-4 sm:px-8 border-b border-gray-200">
            <button
              onClick={() => setShowModal(true)}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
            >
              + Ajouter un stagiaire
            </button>
          </div>

          {/* Liste des stagiaires */}
          <div className="p-4 sm:p-6 lg:p-8">
            {stagiaires.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Aucun stagiaire enregistré</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stagiaires.map((stag) => (
                  <div
                    key={stag.id}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition duration-200"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {stag.prenom} {stag.nom}
                        </h3>
                        <span className="inline-block mt-2 px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                          {stag.formation}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <p className="flex items-center">
                        <span className="font-semibold mr-2">📧</span>
                        {stag.email}
                      </p>
                      <p className="flex items-center">
                        <span className="font-semibold mr-2">📱</span>
                        {stag.telephone}
                      </p>
                      <p className="flex items-center">
                        <span className="font-semibold mr-2">📅</span>
                        {formatDate(stag.date_debut)} → {formatDate(stag.date_fin)}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(stag)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition duration-200"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(stag.id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition duration-200"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-4 sm:px-8 sm:py-6">
              <h2 className="text-2xl font-bold text-white">
                {editingId ? 'Modifier le stagiaire' : 'Nouveau stagiaire'}
              </h2>
            </div>

            <div className="p-6 sm:p-8" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Formation *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.formation}
                    onChange={(e) => setFormData({ ...formData, formation: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date de début *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date_debut}
                    onChange={(e) => setFormData({ ...formData, date_debut: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date de fin *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date_fin}
                    onChange={(e) => setFormData({ ...formData, date_fin: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
                >
                  {editingId ? 'Mettre à jour' : 'Ajouter'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition duration-200"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;