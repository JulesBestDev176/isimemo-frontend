import React, { useState, useMemo } from 'react';
import {
  Star,
  Search,
  FileText,
  Eye,
  Calendar,
  User,
  X,
  ExternalLink,
  Link as LinkIcon,
  Trash2,
  BookOpen,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { getRessourcesSauvegardees, getRessourcesSauvegardeesProfesseur, RessourceSauvegardee, RessourceMediatheque, TypeFiliere } from '../../models';

// Badge Component
const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'info' | 'error' | 'primary';
}> = ({ children, variant = 'info' }) => {
  const variants = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-orange-100 text-orange-800',
    info: 'bg-blue-100 text-blue-800',
    error: 'bg-red-100 text-red-800',
    primary: 'bg-primary-100 text-primary-800'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

// Formatage des dates
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Obtenir l'icône selon le type de ressource
const getRessourceIcon = (type: RessourceMediatheque['typeRessource']) => {
  switch (type) {
    case 'document':
      return <FileText className="h-5 w-5" />;
    case 'lien':
      return <LinkIcon className="h-5 w-5" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
};

// Obtenir la couleur selon le type de ressource
const getRessourceColor = (type: RessourceMediatheque['typeRessource']) => {
  switch (type) {
    case 'document':
      return 'bg-blue-100 text-blue-700';
    case 'lien':
      return 'bg-green-100 text-green-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

// Composant principal
const RessourcesSauvegardees: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [niveauFilter, setNiveauFilter] = useState<'all' | 'licence' | 'master'>('all');
  const [filiereFilter, setFiliereFilter] = useState<TypeFiliere | 'all'>('all');
  const [selectedRessource, setSelectedRessource] = useState<RessourceMediatheque | null>(null);
  const [savedResources, setSavedResources] = useState<RessourceSauvegardee[]>([]);

  // Récupérer les ressources sauvegardées de l'utilisateur (étudiant ou professeur)
  const ressourcesSauvegardees = useMemo(() => {
    if (!user?.id) return [];
    let resources: RessourceSauvegardee[] = [];
    if (user.type === 'professeur') {
      resources = getRessourcesSauvegardeesProfesseur(parseInt(user.id));
    } else {
      resources = getRessourcesSauvegardees(parseInt(user.id));
    }
    setSavedResources(resources);
    // Filtrer les ressources undefined et retourner uniquement les ressources valides
    return resources
      .map(rs => rs.ressource)
      .filter((ressource): ressource is RessourceMediatheque => ressource !== undefined);
  }, [user]);

  // Filtrage des ressources par filtres et recherche
  const filteredRessources = useMemo(() => {
    let filtered = ressourcesSauvegardees;

    // Filtrer par niveau
    if (niveauFilter !== 'all') {
      filtered = filtered.filter(ressource => ressource.niveau === niveauFilter);
    }

    // Filtrer par filière
    if (filiereFilter !== 'all') {
      filtered = filtered.filter(ressource => ressource.filiere === filiereFilter);
    }

    // Filtrer par recherche
    if (searchQuery) {
      filtered = filtered.filter(ressource => {
        return ressource.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ressource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ressource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (ressource.filiere && ressource.filiere.toLowerCase().includes(searchQuery.toLowerCase()));
      });
    }

    return filtered;
  }, [ressourcesSauvegardees, niveauFilter, filiereFilter, searchQuery]);

  // Fonction pour retirer une ressource des sauvegardes
  const handleUnsave = (idRessource: number) => {
    // TODO: Remplacer par un appel API
    setSavedResources(prev => prev.filter(rs => rs.idRessource !== idRessource));
  };

  // Obtenir la date de sauvegarde d'une ressource
  const getSavedDate = (idRessource: number): Date | null => {
    const saved = savedResources.find(rs => rs.idRessource === idRessource);
    return saved ? saved.dateSauvegarde : null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Ressources Sauvegardées</h1>
            <p className="text-sm text-gray-600">
              Consultez les ressources de la médiathèque que vous avez sauvegardées
            </p>
          </div>
        </div>

        {/* Filtres et Recherche */}
        <div className="bg-white border border-gray-200 p-4 mb-6 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

            {/* Barre de recherche */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par titre, description, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Filtres Dropdown */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-48">
                <select
                  value={niveauFilter}
                  onChange={(e) => setNiveauFilter(e.target.value as 'all' | 'licence' | 'master')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-700"
                >
                  <option value="all">Tous les niveaux</option>
                  <option value="licence">Licence</option>
                  <option value="master">Master</option>
                </select>
              </div>

              <div className="w-full sm:w-48">
                <select
                  value={filiereFilter}
                  onChange={(e) => setFiliereFilter(e.target.value as TypeFiliere | 'all')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-gray-700"
                >
                  <option value="all">Toutes les filières</option>
                  <option value="genie-logiciel">Génie Logiciel</option>
                  <option value="iage">IAGE</option>
                  <option value="multimedia">Multimédia</option>
                  <option value="gda">GDA</option>
                  <option value="mcd">MCD</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des ressources */}
        <AnimatePresence mode="wait">
          <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {filteredRessources.length > 0 ? (
              <div className="space-y-4">
                {filteredRessources.map((ressource, index) => {
                  const savedDate = getSavedDate(ressource.idRessource);
                  return (
                    <motion.div
                      key={ressource.idRessource}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start flex-1 gap-4">
                          <div className={`p-3 rounded-lg ${getRessourceColor(ressource.typeRessource)}`}>
                            {getRessourceIcon(ressource.typeRessource)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{ressource.titre}</h3>
                            </div>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{ressource.description}</p>

                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center">
                                <User className="h-3 w-3 mr-1" />
                                <span>{ressource.auteur}</span>
                              </div>

                              {ressource.filiere && (
                                <div className="flex items-center">
                                  <GraduationCap className="h-3 w-3 mr-1" />
                                  <span>{ressource.filiere === 'genie-logiciel' ? 'Génie Logiciel' :
                                    ressource.filiere === 'iage' ? 'IAGE' :
                                      ressource.filiere === 'multimedia' ? 'Multimédia' :
                                        ressource.filiere === 'gda' ? 'GDA' :
                                          ressource.filiere === 'mcd' ? 'MCD' : ressource.filiere}</span>
                                </div>
                              )}

                              {ressource.niveau && ressource.niveau !== 'all' && (
                                <div className="flex items-center">
                                  <BookOpen className="h-3 w-3 mr-1" />
                                  <span>{ressource.niveau === 'licence' ? 'Licence' : ressource.niveau === 'master' ? 'Master' : ressource.niveau}</span>
                                </div>
                              )}

                              {ressource.anneeAcademique && (
                                <div className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  <span>{ressource.anneeAcademique}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => setSelectedRessource(ressource)}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                            title="Voir"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleUnsave(ressource.idRessource)}
                            className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                            title="Retirer des sauvegardes"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-2 font-medium">
                  Aucune ressource trouvée
                </p>
                <p className="text-sm text-gray-500">
                  {searchQuery
                    ? 'Essayez de modifier vos critères de recherche ou filtres.'
                    : 'Vous n\'avez pas encore sauvegardé de ressources correspondant à ces critères.'
                  }
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>



        {/* Modal de visualisation */}
        <AnimatePresence>
          {selectedRessource && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedRessource(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              >
                {/* En-tête du modal */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg mr-4 ${getRessourceColor(selectedRessource.typeRessource)}`}>
                      {getRessourceIcon(selectedRessource.typeRessource)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedRessource.titre}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="info">{selectedRessource.categorie}</Badge>
                        {selectedRessource.estImportant && (
                          <Badge variant="warning">Important</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedRessource(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Contenu du modal */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-6">
                    {/* Description */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                      <p className="text-gray-600">{selectedRessource.description}</p>
                    </div>

                    {/* Informations de la ressource */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <User className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm font-medium text-gray-700">Étudiant</span>
                        </div>
                        <p className="text-gray-900">{selectedRessource.auteur}</p>
                        {selectedRessource.auteurEmail && (
                          <p className="text-xs text-gray-500 mt-1">{selectedRessource.auteurEmail}</p>
                        )}
                      </div>

                      {selectedRessource.filiere && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <GraduationCap className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm font-medium text-gray-700">Filière</span>
                          </div>
                          <p className="text-gray-900">
                            {selectedRessource.filiere === 'genie-logiciel' ? 'Génie Logiciel' :
                              selectedRessource.filiere === 'iage' ? 'IAGE' :
                                selectedRessource.filiere === 'multimedia' ? 'Multimédia' :
                                  selectedRessource.filiere === 'gda' ? 'GDA' :
                                    selectedRessource.filiere === 'mcd' ? 'MCD' : selectedRessource.filiere}
                          </p>
                        </div>
                      )}

                      {selectedRessource.niveau && selectedRessource.niveau !== 'all' && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <BookOpen className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm font-medium text-gray-700">Niveau d'études</span>
                          </div>
                          <p className="text-gray-900">{selectedRessource.niveau === 'licence' ? 'Licence' : selectedRessource.niveau === 'master' ? 'Master' : selectedRessource.niveau}</p>
                        </div>
                      )}

                      {selectedRessource.anneeAcademique && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm font-medium text-gray-700">Année académique</span>
                          </div>
                          <p className="text-gray-900">{selectedRessource.anneeAcademique}</p>
                        </div>
                      )}
                    </div>

                    {/* Aperçu de la ressource */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Accès à la ressource</h3>
                      {selectedRessource.cheminFichier && (selectedRessource.cheminFichier.endsWith('.pdf') || selectedRessource.cheminFichier.endsWith('.PDF')) ? (
                        // Visualiseur PDF intégré
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="w-full" style={{ height: '600px' }}>
                            <object
                              data={selectedRessource.cheminFichier}
                              type="application/pdf"
                              width="100%"
                              height="100%"
                              className="rounded-lg"
                            >
                              <p>Votre navigateur ne supporte pas l'affichage de PDF. <a href={selectedRessource.cheminFichier} target="_blank" rel="noreferrer">Télécharger le PDF</a>.</p>
                            </object>
                          </div>
                          <div className="flex justify-center gap-3 mt-4">
                            <button
                              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center"
                              onClick={() => {
                                window.open(selectedRessource.cheminFichier, '_blank');
                              }}
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Ouvrir dans un nouvel onglet
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="border border-gray-200 rounded-lg p-8 bg-gray-50 text-center">
                          {getRessourceIcon(selectedRessource.typeRessource)}
                          <p className="text-gray-600 mb-4 mt-4">
                            {selectedRessource.cheminFichier
                              ? 'La ressource est disponible.'
                              : selectedRessource.url
                                ? 'La ressource est accessible via un lien externe.'
                                : 'La ressource est indisponible.'
                            }
                          </p>
                          <div className="flex justify-center gap-3">
                            {selectedRessource.url && (
                              <button
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 flex items-center"
                                onClick={() => {
                                  window.open(selectedRessource.url, '_blank');
                                }}
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Ouvrir le lien
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pied du modal */}
                <div className="p-6 border-t border-gray-200 flex justify-end">
                  <button
                    onClick={() => setSelectedRessource(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Fermer
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RessourcesSauvegardees;
