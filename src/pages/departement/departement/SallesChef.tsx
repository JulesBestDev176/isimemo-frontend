import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  Edit,
  Building,
  Users,
  CheckCircle,
  XCircle,
  Archive,
  Filter,
  X
} from 'lucide-react';
import { mockSalles, type Salle } from '../../../models/infrastructure/Salle';

// Badge Component
const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'success' | 'error' | 'neutral';
}> = ({ children, variant = 'neutral' }) => {
  const styles = {
    success: "bg-green-50 text-green-700 border border-green-200",
    error: "bg-gray-100 text-gray-700 border border-gray-200",
    neutral: "bg-gray-50 text-gray-600 border border-gray-200"
  };
  
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${styles[variant]}`}>
      {children}
    </span>
  );
};

// Simple Button Component
const SimpleButton: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  onClick?: () => void;
  size?: 'sm' | 'md';
  disabled?: boolean;
  icon?: React.ReactNode;
  type?: 'button' | 'submit';
}> = ({ children, variant = 'ghost', onClick, size = 'sm', disabled = false, icon, type = 'button' }) => {
  const styles = {
    primary: 'bg-navy text-white border border-navy hover:bg-navy-dark disabled:bg-gray-300',
    secondary: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50',
    ghost: 'bg-transparent text-gray-600 border border-transparent hover:bg-gray-50'
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base'
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${styles[variant]} ${sizeStyles[size]} rounded font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 flex items-center`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

const SallesChef: React.FC = () => {
  const [salles, setSalles] = useState<Salle[]>(mockSalles);
  const [searchQuery, setSearchQuery] = useState('');
  const [batimentFilter, setBatimentFilter] = useState<string>('all');
  const [showArchived, setShowArchived] = useState(false);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [selectedSalle, setSelectedSalle] = useState<Salle | null>(null);
  
  // Form state for new/edit salle
  const [formData, setFormData] = useState({
    nom: '',
    batiment: '',
    capacite: 0,
    equipements: [] as string[]
  });

  // Filtrer les salles
  const sallesFiltrees = salles.filter(salle => {
    const matchSearch = searchQuery === '' ||
      salle.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      salle.batiment.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchBatiment = batimentFilter === 'all' || salle.batiment === batimentFilter;
    const matchArchived = showArchived || !salle.estArchive;

    return matchSearch && matchBatiment && matchArchived;
  });

  // Obtenir la liste des bâtiments uniques
  const batiments = Array.from(new Set(salles.map(s => s.batiment)));

  // Statistiques
  const stats = {
    total: salles.filter(s => !s.estArchive).length,
    actives: salles.filter(s => s.estDisponible && !s.estArchive).length,
    desactivees: salles.filter(s => !s.estDisponible && !s.estArchive).length,
    capaciteTotale: salles.filter(s => !s.estArchive).reduce((sum, s) => sum + s.capacite, 0)
  };

  // Handlers
  const handleToggleActivation = (idSalle: number) => {
    setSalles(salles.map(s => 
      s.idSalle === idSalle ? { ...s, estDisponible: !s.estDisponible } : s
    ));
  };

  const handleArchiver = (idSalle: number) => {
    if (confirm('Êtes-vous sûr de vouloir archiver cette salle ?')) {
      setSalles(salles.map(s => 
        s.idSalle === idSalle ? { ...s, estArchive: true, estDisponible: false } : s
      ));
    }
  };

  const handleDesarchiver = (idSalle: number) => {
    setSalles(salles.map(s => 
      s.idSalle === idSalle ? { ...s, estArchive: false } : s
    ));
  };

  const handleEdit = (salle: Salle) => {
    setSelectedSalle(salle);
    setFormData({
      nom: salle.nom,
      batiment: salle.batiment,
      capacite: salle.capacite,
      equipements: salle.equipements || []
    });
    setShowModalEdit(true);
  };

  const handleAddSalle = (e: React.FormEvent) => {
    e.preventDefault();
    const newSalle: Salle = {
      idSalle: Math.max(...salles.map(s => s.idSalle)) + 1,
      nom: formData.nom,
      batiment: formData.batiment,
      capacite: formData.capacite,
      equipements: formData.equipements,
      estDisponible: true,
      estArchive: false
    };
    setSalles([...salles, newSalle]);
    setShowModalAdd(false);
    resetForm();
  };

  const handleUpdateSalle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSalle) return;
    
    setSalles(salles.map(s => 
      s.idSalle === selectedSalle.idSalle 
        ? { ...s, ...formData }
        : s
    ));
    setShowModalEdit(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      batiment: '',
      capacite: 0,
      equipements: []
    });
    setSelectedSalle(null);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy">Gestion des Salles</h1>
          <p className="text-gray-600 mt-1">Gérez les salles de soutenance du département</p>
        </div>
        <SimpleButton variant="primary" onClick={() => setShowModalAdd(true)} icon={<Plus className="h-4 w-4" />}>
          Nouvelle Salle
        </SimpleButton>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Salles</p>
              <p className="text-3xl font-bold text-navy mt-2">{stats.total}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <Building className="h-8 w-8 text-navy" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Activées</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.actives}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Désactivées</p>
              <p className="text-3xl font-bold text-gray-600 mt-2">{stats.desactivees}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <XCircle className="h-8 w-8 text-gray-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Capacité Totale</p>
              <p className="text-3xl font-bold text-navy mt-2">{stats.capaciteTotale}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg">
              <Users className="h-8 w-8 text-navy" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filtres et Recherche */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-navy flex items-center">
            <Filter className="h-6 w-6 mr-2 text-navy" />
            Filtres et Recherche
          </h2>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showArchived"
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="showArchived" className="text-sm text-gray-600">Afficher archivées</label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher une salle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
            />
          </div>

          {/* Filtre Bâtiment */}
          <select
            value={batimentFilter}
            onChange={(e) => setBatimentFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
          >
            <option value="all">Tous les bâtiments</option>
            {batiments.map(bat => (
              <option key={bat} value={bat}>{bat}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Liste des Salles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg shadow overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bâtiment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sallesFiltrees.map((salle, index) => (
                <motion.tr
                  key={salle.idSalle}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Building className="h-5 w-5 text-navy mr-2" />
                      <span className="text-sm font-medium text-gray-900">{salle.nom}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{salle.batiment}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900">{salle.capacite} places</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      {salle.estArchive ? (
                        <Badge variant="error">
                          <Archive className="h-3 w-3 inline mr-1" />
                          Archivée
                        </Badge>
                      ) : salle.estDisponible ? (
                        <Badge variant="success">
                          <CheckCircle className="h-3 w-3 inline mr-1" />
                          Activée
                        </Badge>
                      ) : (
                        <Badge variant="error">
                          <XCircle className="h-3 w-3 inline mr-1" />
                          Désactivée
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      {!salle.estArchive && (
                        <>
                          <SimpleButton
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActivation(salle.idSalle)}
                          >
                            {salle.estDisponible ? 'Désactiver' : 'Activer'}
                          </SimpleButton>
                          <SimpleButton
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(salle)}
                            icon={<Edit className="h-4 w-4" />}
                          >
                            Modifier
                          </SimpleButton>
                          <SimpleButton
                            variant="secondary"
                            size="sm"
                            onClick={() => handleArchiver(salle.idSalle)}
                            icon={<Archive className="h-4 w-4" />}
                          >
                            Archiver
                          </SimpleButton>
                        </>
                      )}
                      {salle.estArchive && (
                        <SimpleButton
                          variant="secondary"
                          size="sm"
                          onClick={() => handleDesarchiver(salle.idSalle)}
                        >
                          Désarchiver
                        </SimpleButton>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {sallesFiltrees.length === 0 && (
          <div className="text-center py-12">
            <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune salle trouvée</h3>
            <p className="text-gray-600">Modifiez vos filtres ou ajoutez une nouvelle salle</p>
          </div>
        )}
      </motion.div>

      {/* Modal Ajouter Salle */}
      {showModalAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-navy">Nouvelle Salle</h2>
              <button onClick={() => { setShowModalAdd(false); resetForm(); }} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleAddSalle} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la salle</label>
                <input
                  type="text"
                  required
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                  placeholder="Ex: Amphi A"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bâtiment</label>
                <input
                  type="text"
                  required
                  value={formData.batiment}
                  onChange={(e) => setFormData({ ...formData, batiment: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                  placeholder="Ex: Bâtiment Principal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacité</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.capacite}
                  onChange={(e) => setFormData({ ...formData, capacite: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                  placeholder="Ex: 50"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <SimpleButton variant="secondary" onClick={() => { setShowModalAdd(false); resetForm(); }}>
                  Annuler
                </SimpleButton>
                <SimpleButton variant="primary" type="submit">
                  Créer
                </SimpleButton>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Modal Modifier Salle */}
      {showModalEdit && selectedSalle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-navy">Modifier la Salle</h2>
              <button onClick={() => { setShowModalEdit(false); resetForm(); }} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleUpdateSalle} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la salle</label>
                <input
                  type="text"
                  required
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bâtiment</label>
                <input
                  type="text"
                  required
                  value={formData.batiment}
                  onChange={(e) => setFormData({ ...formData, batiment: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacité</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.capacite}
                  onChange={(e) => setFormData({ ...formData, capacite: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <SimpleButton variant="secondary" onClick={() => { setShowModalEdit(false); resetForm(); }}>
                  Annuler
                </SimpleButton>
                <SimpleButton variant="primary" type="submit">
                  Enregistrer
                </SimpleButton>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SallesChef;
