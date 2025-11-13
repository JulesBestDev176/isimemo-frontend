import React, { useState } from 'react';
import { Heart, Eye, MessageSquare, Calendar, User, Search, Filter, Trash2, FileText, Image, Video } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SavedDocument {
  id: number;
  title: string;
  description: string;
  author: string;
  savedDate: string;
  originalDate: string;
  category: string;
  type: 'document' | 'image' | 'video';
  likes: number;
  comments: number;
  views: number;
  tags: string[];
  isImportant?: boolean;
}

const MediathequeSaved: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('savedDate');

  // Documents sauvegardés (simulation)
  const [savedDocuments, setSavedDocuments] = useState<SavedDocument[]>([
    {
      id: 2,
      title: 'Template PowerPoint officiel ISI',
      description: 'Modèle de présentation PowerPoint aux couleurs et normes graphiques de l\'institut.',
      author: 'Admin ISI',
      savedDate: '2025-05-12',
      originalDate: '2025-04-20',
      category: 'Templates',
      type: 'document',
      likes: 89,
      comments: 12,
      views: 1567,
      tags: ['template', 'powerpoint', 'présentation']
    },
    {
      id: 3,
      title: 'Algorithmes de Machine Learning - Cours Vidéo',
      description: 'Série de cours vidéo sur les algorithmes fondamentaux du machine learning avec exemples pratiques.',
      author: 'Prof. Ibrahima Fall',
      savedDate: '2025-05-10',
      originalDate: '2025-03-15',
      category: 'Cours',
      type: 'video',
      likes: 234,
      comments: 45,
      views: 3421,
      tags: ['machine learning', 'algorithmes', 'IA']
    },
    {
      id: 4,
      title: 'Exemples de projets innovants',
      description: 'Collection d\'images présentant des projets d\'étudiants primés lors des concours d\'innovation.',
      author: 'Dr. Fatou Sow',
      savedDate: '2025-05-08',
      originalDate: '2025-02-10',
      category: 'Inspiration',
      type: 'image',
      likes: 67,
      comments: 18,
      views: 987,
      tags: ['innovation', 'projets', 'inspiration']
    },
    {
      id: 5,
      title: 'Normes de citation IEEE',
      description: 'Document détaillant les normes de citation IEEE pour les travaux académiques en informatique.',
      author: 'Dr. Ousmane Dieng',
      savedDate: '2025-05-05',
      originalDate: '2025-01-30',
      category: 'Normes',
      type: 'document',
      likes: 123,
      comments: 31,
      views: 1876,
      tags: ['citation', 'IEEE', 'normes'],
      isImportant: true
    },
    {
      id: 6,
      title: 'Tutoriel Git et GitHub',
      description: 'Vidéo tutoriel complète sur l\'utilisation de Git et GitHub pour la gestion de projets.',
      author: 'Dr. Awa Ndiaye',
      savedDate: '2025-05-03',
      originalDate: '2025-03-01',
      category: 'Tutoriels',
      type: 'video',
      likes: 178,
      comments: 56,
      views: 2654,
      tags: ['git', 'github', 'versioning']
    },
    {
      id: 7,
      title: 'Base de données - Modèle conceptuel',
      description: 'Exemples de modèles conceptuels de bases de données pour différents types d\'applications.',
      author: 'Prof. Cheikh Ba',
      savedDate: '2025-04-30',
      originalDate: '2025-02-20',
      category: 'Base de données',
      type: 'document',
      likes: 145,
      comments: 28,
      views: 2187,
      tags: ['base de données', 'modélisation', 'MCD']
    }
  ]);

  const categories = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'Méthodologie', label: 'Méthodologie' },
    { value: 'Templates', label: 'Templates' },
    { value: 'Cours', label: 'Cours' },
    { value: 'Tutoriels', label: 'Tutoriels' },
    { value: 'Normes', label: 'Normes' },
    { value: 'Base de données', label: 'Base de données' },
    { value: 'Inspiration', label: 'Inspiration' }
  ];

  const sortOptions = [
    { value: 'savedDate', label: 'Date de sauvegarde' },
    { value: 'originalDate', label: 'Date de publication' },
    { value: 'title', label: 'Titre (A-Z)' },
    { value: 'likes', label: 'Plus aimés' },
    { value: 'views', label: 'Plus consultés' }
  ];

  // Filtrer et trier les documents
  const filteredAndSortedDocuments = savedDocuments
    .filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           doc.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'savedDate':
          return new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime();
        case 'originalDate':
          return new Date(b.originalDate).getTime() - new Date(a.originalDate).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'likes':
          return b.likes - a.likes;
        case 'views':
          return b.views - a.views;
        default:
          return 0;
      }
    });

  const handleRemoveFromSaved = (docId: number) => {
    setSavedDocuments(prev => prev.filter(doc => doc.id !== docId));
  };

  const handleViewDocument = (docId: number) => {
    navigate(`/mediatheque/detail/${docId}`);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-5 w-5 text-primary" />;
      case 'video':
        return <Video className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'image':
        return 'bg-primary/10 text-primary';
      case 'video':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            Mes Documents Sauvegardés
          </h1>
          <p className="text-gray-600 mt-1">
            {filteredAndSortedDocuments.length} document{filteredAndSortedDocuments.length > 1 ? 's' : ''} dans votre collection personnelle
          </p>
        </div>
      </div>

      {/* Filtres et recherche */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-sm border p-4 mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Recherche */}
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher dans mes documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>

          {/* Catégorie */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>

          {/* Tri */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          {/* Statistiques */}
          <div className="flex items-center justify-center bg-primary/5 rounded-lg px-3 py-2">
            <Heart className="h-4 w-4 text-red-500 mr-2" />
            <span className="text-sm text-gray-700">{savedDocuments.length} sauvegardés</span>
          </div>
        </div>
      </motion.div>

      {/* Liste des documents */}
      {filteredAndSortedDocuments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-sm border p-12 text-center"
        >
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            {searchQuery || selectedCategory !== 'all' ? 'Aucun document trouvé' : 'Aucun document sauvegardé'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || selectedCategory !== 'all' 
              ? 'Modifiez vos critères de recherche pour voir plus de résultats.'
              : 'Commencez à sauvegarder des documents depuis la médiathèque pour les retrouver ici.'}
          </p>
          <button
            onClick={() => navigate('/mediatheque')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Parcourir la médiathèque
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedDocuments.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow h-full flex flex-col ${
                doc.isImportant ? 'border-red-300 bg-red-50' : ''
              }`}
            >
              {/* Contenu principal de la card */}
              <div className="p-6 flex-grow flex flex-col">
                
                {/* En-tête - hauteur fixe */}
                <div className="flex items-start justify-between mb-4 min-h-[32px]">
                  <div className="flex items-center">
                    {getTypeIcon(doc.type)}
                    <span className={`ml-2 text-xs px-2 py-1 rounded-full ${getTypeColor(doc.type)}`}>
                      {doc.type === 'document' ? 'Document' : doc.type === 'image' ? 'Image' : 'Vidéo'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {doc.isImportant && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        Important
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromSaved(doc.id);
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Retirer des favoris"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Titre - hauteur fixe avec clamp */}
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-800 line-clamp-2 min-h-[3rem] flex items-start">
                    {doc.title}
                  </h3>
                </div>

                {/* Description - hauteur fixe avec clamp */}
                <div className="mb-4 flex-grow">
                  <p className="text-sm text-gray-600 line-clamp-3 min-h-[4.5rem] leading-6">
                    {doc.description}
                  </p>
                </div>

                {/* Auteur et catégorie - hauteur fixe */}
                <div className="flex items-center text-xs text-gray-500 mb-3 min-h-[20px]">
                  <User className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className="mr-3 truncate">{doc.author}</span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                    {doc.category}
                  </span>
                </div>

                {/* Tags - hauteur fixe */}
                <div className="flex flex-wrap gap-1 mb-4 min-h-[24px]">
                  {doc.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                      #{tag}
                    </span>
                  ))}
                  {doc.tags.length > 3 && (
                    <span className="text-xs text-gray-500 flex items-center">+{doc.tags.length - 3}</span>
                  )}
                </div>

                {/* Statistiques - hauteur fixe */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4 min-h-[16px]">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Heart className="h-3 w-3 mr-1 text-red-500" />
                      <span>{doc.likes}</span>
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      <span>{doc.comments}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      <span>{doc.views}</span>
                    </div>
                  </div>
                </div>

                {/* Date de sauvegarde - hauteur fixe */}
                <div className="flex items-center text-xs text-gray-400 pt-3 border-t border-gray-100 min-h-[20px]">
                  <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span>Sauvegardé le {new Date(doc.savedDate).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              {/* Actions - toujours en bas */}
              <div className="px-6 pb-6 mt-auto">
                <button
                  onClick={() => handleViewDocument(doc.id)}
                  className="w-full flex items-center justify-center px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Consulter
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Statistiques en bas */}
      {filteredAndSortedDocuments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm border p-6 mt-8"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Résumé de votre collection</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{savedDocuments.length}</div>
              <div className="text-sm text-gray-600">Documents sauvegardés</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {savedDocuments.filter(doc => doc.isImportant).length}
              </div>
              <div className="text-sm text-gray-600">Documents importants</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(savedDocuments.map(doc => doc.category)).size}
              </div>
              <div className="text-sm text-gray-600">Catégories différentes</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {savedDocuments.reduce((sum, doc) => sum + doc.likes, 0)}
              </div>
              <div className="text-sm text-gray-600">Total des likes</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MediathequeSaved;