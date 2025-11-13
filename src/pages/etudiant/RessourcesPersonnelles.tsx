import React, { useState, useMemo } from 'react';
import { 
  Folder,
  Search,
  FileText,
  Download,
  Eye,
  Calendar,
  FileCheck,
  X,
  ExternalLink,
  User,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { mockDossiers, mockEncadrant } from '../../data/mock/dashboard';
import { DossierMemoire } from '../../types/dossier';

// Interface pour les ressources (mémoires finaux)
interface RessourcePersonnelle {
  id: number;
  titre: string;
  description: string;
  dateCreation: Date;
  dateModification: Date;
  anneeAcademique?: string;
  cheminFichier: string;
  dossierId: number;
}

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

// Convertir les dossiers terminés en ressources personnelles (mémoires finaux)
const getRessourcesFromDossiers = (dossiers: DossierMemoire[]): RessourcePersonnelle[] => {
  return dossiers.map(dossier => ({
    id: dossier.idDossierMemoire,
    titre: dossier.titre,
    description: dossier.description,
    dateCreation: dossier.dateCreation,
    dateModification: dossier.dateModification,
    anneeAcademique: dossier.anneeAcademique,
    cheminFichier: `/memoires/${dossier.idDossierMemoire}/final.pdf`, // Document final du mémoire
    dossierId: dossier.idDossierMemoire
  }));
};

// Composant principal
const RessourcesPersonnelles: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRessource, setSelectedRessource] = useState<RessourcePersonnelle | null>(null);

  // Récupérer les ressources depuis les dossiers terminés
  const ressources = useMemo(() => {
    // TODO: Remplacer par un appel API pour récupérer les mémoires finaux de l'étudiant
    return getRessourcesFromDossiers(mockDossiers);
  }, []);

  // Filtrage des ressources par recherche
  const filteredRessources = useMemo(() => {
    return ressources.filter(ressource => {
      const matchesSearch = ressource.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           ressource.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [ressources, searchQuery]);

  // Récupérer les détails du dossier pour la ressource sélectionnée
  const dossierDetails = useMemo(() => {
    if (!selectedRessource) return null;
    return mockDossiers.find(d => d.idDossierMemoire === selectedRessource.dossierId);
  }, [selectedRessource]);


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="bg-white border border-gray-200 p-6 mb-6 rounded-lg">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Mes Ressources Personnelles</h1>
            <p className="text-sm text-gray-600">
              Consultez vos mémoires finaux (documents finaux de vos dossiers terminés)
            </p>
          </div>
        </div>

        {/* Recherche */}
        <div className="bg-white border border-gray-200 p-4 mb-6 rounded-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un mémoire..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Liste des ressources */}
        <div className="bg-white border border-gray-200 rounded-lg">
          {filteredRessources.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredRessources.map((ressource, index) => (
                <motion.div
                  key={ressource.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start flex-1">
                      <div className="p-3 rounded-lg mr-4 bg-primary-100 text-primary-700">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{ressource.titre}</h3>
                        <p className="text-sm text-gray-600 mb-2">{ressource.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>Créé le {formatDate(ressource.dateCreation)}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>Modifié le {formatDate(ressource.dateModification)}</span>
                          </div>
                          {ressource.anneeAcademique && (
                            <Badge variant="info">{ressource.anneeAcademique}</Badge>
                          )}
                          <Badge variant="success">
                            <FileCheck className="h-3 w-3 mr-1" />
                            Mémoire final
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => setSelectedRessource(ressource)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                        title="Voir"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                        title="Télécharger"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Folder className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Aucun mémoire trouvé</p>
              <p className="text-sm text-gray-500">
                {searchQuery 
                  ? 'Essayez de modifier vos critères de recherche'
                  : 'Vous n\'avez pas encore de mémoires finaux. Les mémoires finaux de vos dossiers terminés apparaîtront ici.'
                }
              </p>
            </div>
          )}
        </div>

        {/* Statistiques */}
        <div className="mt-6">
          <div className="bg-white border border-gray-200 p-4 rounded-lg max-w-xs">
            <div className="flex items-center">
              <div className="bg-primary-100 p-3 rounded-lg mr-4">
                <Folder className="h-5 w-5 text-primary-700" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Mémoires finaux</p>
                <p className="text-2xl font-bold text-gray-900">{ressources.length}</p>
              </div>
            </div>
          </div>
        </div>

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
                    <div className="bg-primary-100 p-3 rounded-lg mr-4">
                      <FileText className="h-6 w-6 text-primary-700" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedRessource.titre}</h2>
                      <p className="text-sm text-gray-600 mt-1">Mémoire final</p>
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

                    {/* Informations du mémoire */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm font-medium text-gray-700">Date de création</span>
                        </div>
                        <p className="text-gray-900">{formatDate(selectedRessource.dateCreation)}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Clock className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm font-medium text-gray-700">Dernière modification</span>
                        </div>
                        <p className="text-gray-900">{formatDate(selectedRessource.dateModification)}</p>
                      </div>
                      {selectedRessource.anneeAcademique && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm font-medium text-gray-700">Année académique</span>
                          </div>
                          <p className="text-gray-900">{selectedRessource.anneeAcademique}</p>
                        </div>
                      )}
                      {dossierDetails && mockEncadrant && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <User className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm font-medium text-gray-700">Encadrant</span>
                          </div>
                          <p className="text-gray-900">Dr. {mockEncadrant.prenom} {mockEncadrant.nom}</p>
                        </div>
                      )}
                    </div>

                    {/* Aperçu du document */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Aperçu du document</h3>
                      <div className="border border-gray-200 rounded-lg p-8 bg-gray-50 text-center">
                        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">
                          Le document final du mémoire est disponible en téléchargement.
                        </p>
                        <div className="flex justify-center gap-3">
                          <button
                            className="btn-primary flex items-center"
                            onClick={() => {
                              // TODO: Implémenter le téléchargement
                              window.open(selectedRessource.cheminFichier, '_blank');
                            }}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Télécharger le mémoire
                          </button>
                          <button
                            className="btn-outline flex items-center"
                            onClick={() => {
                              // TODO: Ouvrir dans un nouvel onglet pour visualisation
                              window.open(selectedRessource.cheminFichier, '_blank');
                            }}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Ouvrir dans un nouvel onglet
                          </button>
                        </div>
                      </div>
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

export default RessourcesPersonnelles;

