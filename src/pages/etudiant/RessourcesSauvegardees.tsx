import React, { useState, useMemo } from 'react';
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
  Image,
  Video,
  Link as LinkIcon,
  Trash2,
  BookOpen,
  GraduationCap,
  FileEdit,
  PlayCircle,
  File
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { getRessourcesSauvegardees } from '../../data/mock/ressources';
import { RessourceSauvegardee, RessourceMediatheque, TypeCategorieRessource } from '../../types/ressource';

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
    case 'image':
      return <Image className="h-5 w-5" />;
    case 'video':
      return <Video className="h-5 w-5" />;
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
    case 'image':
      return 'bg-purple-100 text-purple-700';
    case 'video':
      return 'bg-red-100 text-red-700';
    case 'lien':
      return 'bg-green-100 text-green-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

// Convertir une URL YouTube en URL d'embed
const getYouTubeEmbedUrl = (url: string): string => {
  // Extraire l'ID de la vidéo depuis différentes formats d'URL YouTube
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  }
  
  // Si on ne trouve pas l'ID, retourner l'URL telle quelle (sera gérée par YouTube)
  return url;
};

// Tab Button Component - Style simple comme dans departement
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
        <span className={`ml-2 px-2 py-0.5 text-xs font-medium border ${
          isActive 
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
const RessourcesSauvegardees: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TypeCategorieRessource | 'tous'>('tous');
  const [typeFilter, setTypeFilter] = useState<'tous' | 'pdf' | 'video'>('tous');
  const [selectedRessource, setSelectedRessource] = useState<RessourceMediatheque | null>(null);
  const [savedResources, setSavedResources] = useState<RessourceSauvegardee[]>([]);

  // Récupérer les ressources sauvegardées de l'étudiant
  const ressourcesSauvegardees = useMemo(() => {
    if (!user?.id) return [];
    // TODO: Remplacer par un appel API
    const resources = getRessourcesSauvegardees(parseInt(user.id));
    setSavedResources(resources);
    return resources.map(rs => rs.ressource);
  }, [user]);

  // Compter les ressources par catégorie
  const countsByCategory = useMemo(() => {
    const counts = {
      tous: ressourcesSauvegardees.length,
      cours: 0,
      memoires: 0,
      canevas: 0
    };
    ressourcesSauvegardees.forEach(ressource => {
      if (ressource.categorie in counts) {
        counts[ressource.categorie as keyof typeof counts]++;
      }
    });
    return counts;
  }, [ressourcesSauvegardees]);

  // Filtrage des ressources par onglet actif, type et recherche
  const filteredRessources = useMemo(() => {
    let filtered = ressourcesSauvegardees;
    
    // Filtrer par catégorie
    if (activeTab !== 'tous') {
      filtered = filtered.filter(ressource => ressource.categorie === activeTab);
    }
    
    // Filtrer par type (PDF ou vidéo)
    if (typeFilter === 'pdf') {
      filtered = filtered.filter(ressource => 
        ressource.typeRessource === 'document' && 
        (ressource.cheminFichier?.endsWith('.pdf') || ressource.cheminFichier?.endsWith('.PDF'))
      );
    } else if (typeFilter === 'video') {
      filtered = filtered.filter(ressource => 
        ressource.typeRessource === 'video' || ressource.urlYoutube
      );
    }
    
    // Filtrer par recherche
    if (searchQuery) {
      filtered = filtered.filter(ressource => {
        return ressource.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
               ressource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
               ressource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      });
    }
    
    return filtered;
  }, [ressourcesSauvegardees, activeTab, typeFilter, searchQuery]);

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
        <div className="bg-white border border-gray-200 p-6 mb-6 rounded-lg">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Ressources Sauvegardées</h1>
            <p className="text-sm text-gray-600">
              Consultez les ressources de la médiathèque que vous avez sauvegardées
            </p>
          </div>
        </div>

        {/* Recherche et Filtres */}
        <div className="bg-white border border-gray-200 p-4 mb-6 rounded-lg">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Recherche */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une ressource..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            {/* Filtre par type - Style avec boutons */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 whitespace-nowrap">Type :</span>
              <div className="flex gap-2 border border-gray-200 rounded-lg p-1 bg-gray-50">
                <button
                  onClick={() => setTypeFilter('tous')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    typeFilter === 'tous'
                      ? 'bg-white text-navy border border-gray-300 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Tous
                </button>
                <button
                  onClick={() => setTypeFilter('pdf')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1 ${
                    typeFilter === 'pdf'
                      ? 'bg-white text-navy border border-gray-300 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <File className="h-4 w-4" />
                  PDF
                </button>
                <button
                  onClick={() => setTypeFilter('video')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1 ${
                    typeFilter === 'video'
                      ? 'bg-white text-navy border border-gray-300 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <PlayCircle className="h-4 w-4" />
                  Vidéo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div className="bg-white border border-gray-200 rounded-lg mb-6">
          <div className="flex flex-wrap border-b border-gray-200">
            <TabButton
              isActive={activeTab === 'tous'}
              onClick={() => setActiveTab('tous')}
              count={countsByCategory.tous}
            >
              Tous
            </TabButton>
            <TabButton
              isActive={activeTab === 'cours'}
              onClick={() => setActiveTab('cours')}
              icon={<BookOpen className="h-4 w-4" />}
              count={countsByCategory.cours}
            >
              Cours
            </TabButton>
            <TabButton
              isActive={activeTab === 'memoires'}
              onClick={() => setActiveTab('memoires')}
              icon={<GraduationCap className="h-4 w-4" />}
              count={countsByCategory.memoires}
            >
              Mémoires
            </TabButton>
            <TabButton
              isActive={activeTab === 'canevas'}
              onClick={() => setActiveTab('canevas')}
              icon={<FileEdit className="h-4 w-4" />}
              count={countsByCategory.canevas}
            >
              Canevas
            </TabButton>
          </div>

          {/* Contenu de l'onglet actif */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {filteredRessources.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {filteredRessources.map((ressource, index) => {
                    const savedDate = getSavedDate(ressource.idRessource);
                    return (
                      <motion.div
                        key={ressource.idRessource}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="p-4 hover:bg-gray-50 transition-colors"
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
                            <Badge variant="info">{ressource.categorie}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{ressource.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                            <div className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              <span>{ressource.auteur}</span>
                            </div>
                            {savedDate && (
                              <div className="flex items-center">
                                <Star className="h-3 w-3 mr-1 text-yellow-500" />
                                <span>Sauvegardé le {formatDate(savedDate)}</span>
                              </div>
                            )}
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>Publié le {formatDate(ressource.datePublication)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-1">
                              {ressource.tags.map((tag, idx) => (
                                <Badge key={idx} variant="primary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
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
                          onClick={() => handleUnsave(ressource.idRessource)}
                          className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                          title="Retirer des sauvegardes"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    {activeTab === 'tous' 
                      ? 'Aucune ressource sauvegardée'
                      : `Aucune ressource sauvegardée dans la catégorie "${activeTab}"`
                    }
                  </p>
                  <p className="text-sm text-gray-500">
                    {searchQuery 
                      ? 'Essayez de modifier vos critères de recherche'
                      : activeTab === 'tous'
                      ? 'Vous n\'avez pas encore sauvegardé de ressources. Les ressources que vous sauvegardez depuis la médiathèque apparaîtront ici.'
                      : `Vous n'avez pas encore sauvegardé de ressources de type "${activeTab}".`
                    }
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Statistiques */}
        <div className="mt-6">
          <div className="bg-white border border-gray-200 p-4 rounded-lg max-w-xs">
            <div className="flex items-center">
              <div className="bg-primary-100 p-3 rounded-lg mr-4">
                <Star className="h-5 w-5 text-primary-700" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Ressources sauvegardées</p>
                <p className="text-2xl font-bold text-gray-900">{ressourcesSauvegardees.length}</p>
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
                          <span className="text-sm font-medium text-gray-700">Auteur</span>
                        </div>
                        <p className="text-gray-900">{selectedRessource.auteur}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm font-medium text-gray-700">Date de publication</span>
                        </div>
                        <p className="text-gray-900">{formatDate(selectedRessource.datePublication)}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <FileText className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm font-medium text-gray-700">Type</span>
                        </div>
                        <p className="text-gray-900 capitalize">{selectedRessource.typeRessource}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Clock className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm font-medium text-gray-700">Vues</span>
                        </div>
                        <p className="text-gray-900">{selectedRessource.vues} vues</p>
                      </div>
                    </div>

                    {/* Tags */}
                    {selectedRessource.tags.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedRessource.tags.map((tag, idx) => (
                            <Badge key={idx} variant="primary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Aperçu de la ressource */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Accès à la ressource</h3>
                      {selectedRessource.urlYoutube ? (
                        // Lecteur YouTube intégré
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="aspect-video w-full mb-4">
                            <iframe
                              width="100%"
                              height="100%"
                              src={getYouTubeEmbedUrl(selectedRessource.urlYoutube)}
                              title={selectedRessource.titre}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="rounded-lg"
                            />
                          </div>
                          <div className="flex justify-center gap-3">
                            <button
                              className="btn-outline flex items-center"
                              onClick={() => {
                                window.open(selectedRessource.urlYoutube, '_blank');
                              }}
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Ouvrir sur YouTube
                            </button>
                          </div>
                        </div>
                      ) : selectedRessource.cheminFichier && (selectedRessource.cheminFichier.endsWith('.pdf') || selectedRessource.cheminFichier.endsWith('.PDF')) ? (
                        // Visualiseur PDF intégré
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="w-full" style={{ height: '600px' }}>
                            <iframe
                              src={selectedRessource.cheminFichier}
                              title={selectedRessource.titre}
                              className="w-full h-full rounded-lg"
                              style={{ border: 'none' }}
                            />
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
                            {!selectedRessource.url && (
                              <button
                                className="btn-outline flex items-center"
                                onClick={() => {
                                  // TODO: Rediriger vers la médiathèque
                                  window.location.href = '/etudiant/ressources/mediatheque';
                                }}
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Voir dans la médiathèque
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

