import React, { useState, useMemo, useEffect } from 'react';
import {
  Star,
  Search,
  FileText,
  Eye,
  Calendar,
  User,
  Clock,
  X,
  ExternalLink,
  Link as LinkIcon,
  Trash2,
  BookOpen,
  GraduationCap,
  FileEdit,
  PlayCircle,
  File,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { mockRessourcesMediatheque, RessourceMediatheque, TypeCategorieRessource } from '../../models';
import {
  addRessourceSauvegardee,
  removeRessourceSauvegardee,
  isRessourceSauvegardee,
  getRessourcesSauvegardees,
  getRessourcesSauvegardeesProfesseur
} from '../../models/ressource/RessourceSauvegardee';
import { trackInteraction } from '../../models/tracking/UserInteraction';
import { RecommendationEngine } from '../../models/recommendation/RecommendationEngine';
import { SemanticSearchEngine } from '../../models/search/SemanticSearch';
import SemanticSearchBar from '../../components/library/SemanticSearchBar';
import { useSearchHistory, usePageTimer } from '../../hooks/usePageTimer';

// Badge Component
const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'info' | 'error' | 'primary' | 'recommendation';
}> = ({ children, variant = 'info' }) => {
  const variants = {
    success: 'bg-primary-100 text-primary-800',
    warning: 'bg-primary-100 text-primary-800',
    info: 'bg-primary-100 text-primary-800',
    error: 'bg-primary-100 text-primary-800',
    primary: 'bg-primary-100 text-primary-800',
    recommendation: 'bg-blue-50 text-blue-700 border border-blue-100'
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
      return 'bg-primary-100 text-primary-700';
    case 'lien':
      return 'bg-primary-100 text-primary-700';
    default:
      return 'bg-primary-100 text-primary-700';
  }
};

// Tab Button Component
const TabButton: React.FC<{
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  count?: number;
}> = ({ children, isActive, onClick, icon, count }) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200
        ${isActive
          ? 'border-navy text-navy bg-white'
          : 'border-transparent text-slate-500 hover:text-navy-700 bg-slate-50'
        }
      `}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
      {count !== undefined && (
        <span className={`ml-2 px-2 py-0.5 text-xs font-medium border ${isActive
          ? 'bg-navy-50 text-navy-700 border-navy-200'
          : 'bg-navy-200 text-navy-600 border-navy-300'
          }`}>
          {count}
        </span>
      )}
    </button>
  );
};

// Composant principal
const Mediatheque: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [niveauFilter, setNiveauFilter] = useState<'tous' | 'licence' | 'master'>('tous');
  const [filiereFilter, setFiliereFilter] = useState<'tous' | 'genie-logiciel' | 'iage' | 'multimedia' | 'gda' | 'mcd'>('tous');
  const [typeFilter, setTypeFilter] = useState<'tous' | 'pdf' | 'video'>('tous');
  const [selectedRessource, setSelectedRessource] = useState<RessourceMediatheque | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Hooks personnalisés
  const { getHistory, addToHistory } = useSearchHistory();
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Charger l'historique de recherche
  useEffect(() => {
    setRecentSearches(getHistory());
  }, []);

  // Tracking du temps passé sur la ressource sélectionnée
  usePageTimer(
    user?.id ? parseInt(user.id) : undefined,
    selectedRessource?.idRessource,
    !!selectedRessource
  );

  // Initialiser les ressources sauvegardées de l'utilisateur
  const savedResourcesIds = useMemo(() => {
    if (!user?.id) return [];
    const id = parseInt(user.id);
    let savedResources;
    if (user.type === 'professeur') {
      savedResources = getRessourcesSauvegardeesProfesseur(id);
    } else {
      savedResources = getRessourcesSauvegardees(id);
    }
    return savedResources.map(rs => rs.idRessource);
  }, [user, refreshKey]);

  // Récupérer toutes les ressources de la médiathèque (uniquement les actives)
  const ressourcesMediatheque = useMemo(() => {
    return mockRessourcesMediatheque.filter(r => r.estActif !== false && r.categorie !== 'canevas');
  }, []);

  // Compter les ressources par catégorie
  const countsByCategory = useMemo(() => {
    const counts = {
      tous: ressourcesMediatheque.length,
      memoires: 0,
      canevas: 0
    };
    ressourcesMediatheque.forEach(ressource => {
      if (ressource.categorie in counts) {
        counts[ressource.categorie as keyof typeof counts]++;
      }
    });
    return counts;
  }, [ressourcesMediatheque]);

  // Générer des recommandations (pour le tri)
  const recommendations = useMemo(() => {
    if (!user?.id) return [];
    try {
      const userId = parseInt(user.id);
      return RecommendationEngine.getHybridRecommendations(
        userId,
        ressourcesMediatheque,
        ressourcesMediatheque.length // Récupérer des scores pour tout
      );
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return [];
    }
  }, [user, ressourcesMediatheque, refreshKey]);

  // Créer une map des scores de recommandation pour un accès rapide
  const recommendationMap = useMemo(() => {
    const map = new Map<number, { score: number; reason?: string; source: string }>();
    recommendations.forEach(rec => {
      map.set(rec.ressource.idRessource, {
        score: rec.score,
        reason: rec.reasons[0],
        source: rec.source
      });
    });
    return map;
  }, [recommendations]);

  // Filtrage et Tri des ressources
  const filteredRessources = useMemo(() => {
    let filtered = [...ressourcesMediatheque];

    // Filtrer par niveau
    if (niveauFilter !== 'tous') {
      filtered = filtered.filter(ressource => {
        const tags = ressource.tags.map(t => t.toLowerCase());
        if (niveauFilter === 'licence') {
          return tags.some(t => t.includes('licence') || t.includes('l3') || t.includes('l2') || t.includes('l1'));
        } else if (niveauFilter === 'master') {
          return tags.some(t => t.includes('master') || t.includes('m1') || t.includes('m2'));
        }
        return true;
      });
    }

    // Filtrer par filière
    if (filiereFilter !== 'tous') {
      filtered = filtered.filter(ressource => {
        const tags = ressource.tags.map(t => t.toLowerCase());
        const titre = ressource.titre.toLowerCase();
        const description = ressource.description.toLowerCase();
        const searchIn = [...tags, titre, description].join(' ');

        switch (filiereFilter) {
          case 'genie-logiciel':
            return searchIn.includes('génie logiciel') || searchIn.includes('genie logiciel') || searchIn.includes('gl');
          case 'iage':
            return searchIn.includes('iage') || searchIn.includes('informatique appliquée');
          case 'multimedia':
            return searchIn.includes('multimédia') || searchIn.includes('multimedia');
          case 'gda':
            return searchIn.includes('gda') || searchIn.includes('gestion des affaires');
          case 'mcd':
            return searchIn.includes('mcd') || searchIn.includes('management') || searchIn.includes('commerce digital');
          default:
            return true;
        }
      });
    }

    // Filtrer par type (PDF uniquement maintenant)
    if (typeFilter === 'pdf') {
      filtered = filtered.filter(ressource =>
        ressource.typeRessource === 'document' &&
        (ressource.cheminFichier?.endsWith('.pdf') || ressource.cheminFichier?.endsWith('.PDF'))
      );
    }

    // Filtrer par recherche (classique si pas de recherche sémantique)
    if (searchQuery) {
      filtered = filtered.filter(ressource => {
        return ressource.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ressource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ressource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      });
    }

    // TRI PAR DEFAUT : PERTINENCE (Score de recommandation)
    filtered.sort((a, b) => {
      const scoreA = recommendationMap.get(a.idRessource)?.score || 0;
      const scoreB = recommendationMap.get(b.idRessource)?.score || 0;
      return scoreB - scoreA;
    });

    return filtered;
  }, [ressourcesMediatheque, niveauFilter, filiereFilter, typeFilter, searchQuery, recommendationMap]);

  // Recherche sémantique
  const semanticSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    try {
      return SemanticSearchEngine.search(
        { query: searchQuery, limit: 50 },
        ressourcesMediatheque
      );
    } catch (error) {
      console.error('Error in semantic search:', error);
      return null;
    }
  }, [searchQuery, ressourcesMediatheque]);

  // Si recherche sémantique active, utiliser les résultats sémantiques
  const displayedResources = useMemo(() => {
    if (semanticSearchResults) {
      return semanticSearchResults.map(result => result.ressource);
    }
    return filteredRessources;
  }, [semanticSearchResults, filteredRessources]);

  // Pagination Logic
  const paginatedResources = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return displayedResources.slice(startIndex, startIndex + itemsPerPage);
  }, [displayedResources, currentPage]);

  const totalPages = Math.ceil(displayedResources.length / itemsPerPage);

  // Fonction pour sauvegarder/retirer une ressource
  const handleToggleSave = (idRessource: number) => {
    if (!user?.id) return;

    const id = parseInt(user.id);
    const isCurrentlySaved = isRessourceSauvegardee(
      idRessource,
      user.type === 'professeur' ? undefined : id,
      user.type === 'professeur' ? id : undefined
    );

    if (isCurrentlySaved) {
      removeRessourceSauvegardee(
        idRessource,
        user.type === 'professeur' ? undefined : id,
        user.type === 'professeur' ? id : undefined
      );
      trackInteraction(id, idRessource, 'unsave');
    } else {
      addRessourceSauvegardee(
        idRessource,
        user.type === 'professeur' ? undefined : id,
        user.type === 'professeur' ? id : undefined
      );
      trackInteraction(id, idRessource, 'save');
    }
    setRefreshKey(prev => prev + 1);
  };

  // Vérifier si une ressource est sauvegardée
  const isSaved = (idRessource: number): boolean => {
    if (!user?.id) return false;
    const id = parseInt(user.id);
    return isRessourceSauvegardee(
      idRessource,
      user.type === 'professeur' ? undefined : id,
      user.type === 'professeur' ? id : undefined
    );
  };

  // Handler pour la recherche sémantique
  const handleSemanticSearch = (query: string) => {
    setSearchQuery(query);
    addToHistory(query);
    setRecentSearches(getHistory());
    setCurrentPage(1);
    if (user?.id) {
      trackInteraction(parseInt(user.id), 0, 'search', { searchQuery: query });
    }
  };

  // Handler pour ouvrir une ressource
  const handleOpenResource = (resource: RessourceMediatheque) => {
    setSelectedRessource(resource);
    if (user?.id) {
      trackInteraction(parseInt(user.id), resource.idRessource, 'view', {
        clickSource: searchQuery ? 'search' : 'direct'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Bibliothèque numérique</h1>
            <p className="text-sm text-gray-600">
              Explorez toutes les ressources disponibles : mémoires et documents académiques
            </p>
          </div>
        </div>

        {/* Recherche et Filtres */}
        <div className="bg-white border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <SemanticSearchBar
                onSearch={handleSemanticSearch}
                placeholder="Recherche sémantique intelligente..."
                recentSearches={recentSearches}
                onRecentSearchClick={handleSemanticSearch}
              />
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            {/* Filtre par niveau */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
              <select
                value={niveauFilter}
                onChange={(e) => { setNiveauFilter(e.target.value as any); setCurrentPage(1); }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="tous">Tous les niveaux</option>
                <option value="licence">Licence</option>
                <option value="master">Master</option>
              </select>
            </div>

            {/* Filtre par filière */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Filière</label>
              <select
                value={filiereFilter}
                onChange={(e) => { setFiliereFilter(e.target.value as any); setCurrentPage(1); }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="tous">Toutes les filières</option>
                <option value="genie-logiciel">Génie Logiciel</option>
                <option value="iage">IAGE</option>
                <option value="multimedia">Multimédia</option>
                <option value="gda">GDA</option>
                <option value="mcd">MCD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des ressources */}
        <div className="bg-white border border-gray-200 mb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key="resources"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {paginatedResources.length > 0 ? (
                <>
                  <div className="divide-y divide-gray-200">
                    {paginatedResources.map((ressource, index) => {
                      const saved = isSaved(ressource.idRessource);

                      return (
                        <motion.div
                          key={ressource.idRessource}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className={`p-4 hover:bg-gray-50 transition-colors`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start flex-1">
                              <div className={`p-3 rounded-lg mr-4 ${getRessourceColor(ressource.typeRessource)}`}>
                                {getRessourceIcon(ressource.typeRessource)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-gray-900">{ressource.titre}</h3>
                                  {ressource.estImportant && (
                                    <Badge variant="warning">Important</Badge>
                                  )}
                                </div>

                                <p className="text-sm text-gray-600 mb-2">{ressource.description}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                                  <div className="flex items-center">
                                    <User className="h-3 w-3 mr-1" />
                                    <span>{ressource.auteur}</span>
                                  </div>
                                  {ressource.filiere && (
                                    <div className="flex items-center">
                                      <GraduationCap className="h-3 w-3 mr-1" />
                                      <span>{ressource.filiere === 'genie-logiciel' ? 'Génie Logiciel' : ressource.filiere === 'iage' ? 'IAGE' : ressource.filiere === 'multimedia' ? 'Multimédia' : ressource.filiere === 'gda' ? 'GDA' : ressource.filiere === 'mcd' ? 'MCD' : ressource.filiere}</span>
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
                                onClick={() => handleOpenResource(ressource)}
                                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                                title="Voir"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleToggleSave(ressource.idRessource)}
                                className={`p-2 rounded-lg transition-colors ${saved
                                  ? 'text-primary-500 hover:text-primary-600 hover:bg-primary-50'
                                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                  }`}
                                title={saved ? 'Retirer des sauvegardes' : 'Sauvegarder'}
                              >
                                <Star className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
                      <div className="flex flex-1 justify-between sm:hidden">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Précédent
                        </button>
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Suivant
                        </button>
                      </div>
                      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm text-gray-700">
                            Affichage de <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> à <span className="font-medium">{Math.min(currentPage * itemsPerPage, displayedResources.length)}</span> sur <span className="font-medium">{displayedResources.length}</span> résultats
                          </p>
                        </div>
                        <div>
                          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                            <button
                              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                              disabled={currentPage === 1}
                              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                            >
                              <span className="sr-only">Précédent</span>
                              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === page
                                  ? 'z-10 bg-primary-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                                  : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                  }`}
                              >
                                {page}
                              </button>
                            ))}
                            <button
                              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                              disabled={currentPage === totalPages}
                              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                            >
                              <span className="sr-only">Suivant</span>
                              <ChevronRight className="h-5 w-5" aria-hidden="true" />
                            </button>
                          </nav>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Aucune ressource trouvée
                  </p>
                  <p className="text-sm text-gray-500">
                    {searchQuery
                      ? 'Essayez de modifier vos critères de recherche'
                      : 'Aucune ressource disponible dans la médiathèque.'
                    }
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
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
                      </div>
                      {selectedRessource.auteurEmail && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <FileText className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm font-medium text-gray-700">Email</span>
                          </div>
                          <p className="text-gray-900">{selectedRessource.auteurEmail}</p>
                        </div>
                      )}
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
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="w-full h-[600px] bg-white rounded-lg shadow-inner flex items-center justify-center">
                            <object
                              data={selectedRessource.cheminFichier}
                              type="application/pdf"
                              className="w-full h-full rounded-lg"
                            >
                              <div className="text-center p-6">
                                <p className="text-gray-600 mb-4">Impossible d'afficher le PDF directement.</p>
                                <a
                                  href={selectedRessource.cheminFichier}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn-primary inline-flex items-center"
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Télécharger le PDF
                                </a>
                              </div>
                            </object>
                          </div>
                          <div className="flex justify-center gap-3 mt-4">
                            <button
                              className="btn-outline flex items-center"
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
                              ? 'La ressource est disponible dans la médiathèque.'
                              : selectedRessource.url
                                ? 'La ressource est accessible via un lien externe.'
                                : 'La ressource est disponible dans la médiathèque.'
                            }
                          </p>
                          <div className="flex justify-center gap-3">
                            {selectedRessource.url && (
                              <button
                                className="btn-outline flex items-center"
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
                <div className="p-6 border-t border-gray-200 flex justify-between items-center">
                  <button
                    onClick={() => handleToggleSave(selectedRessource.idRessource)}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${isSaved(selectedRessource.idRessource)
                      ? 'bg-primary-50 text-primary-700 border border-primary-200 hover:bg-primary-100'
                      : 'bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100'
                      }`}
                  >
                    <Star className={`h-4 w-4 ${isSaved(selectedRessource.idRessource) ? 'fill-current' : ''}`} />
                    {isSaved(selectedRessource.idRessource) ? 'Retirer des sauvegardes' : 'Sauvegarder'}
                  </button>
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
      </div >
    </div >
  );
};

export default Mediatheque;
