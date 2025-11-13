import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiFile, FiImage, FiFilm, FiSearch, FiFolder, FiX, FiExternalLink, FiEye, FiHeart, FiMessageSquare, FiSend, FiBookmark, FiFileText, FiDownload, FiUpload, FiPlus
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

// Types pour les données
interface Comment {
  id: number;
  author: string;
  text: string;
  date: string;
}

interface MediaItem {
  id: number;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  date: string;
  url: string;
  likes: number;
  liked: boolean;
  comments: Comment[];
  important?: boolean;
  description?: string;
  category?: string;
}

// Tab Button Component (même style que ClassesChef)
const TabButton: React.FC<{
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}> = ({ children, isActive, onClick, icon }) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200
        ${isActive 
          ? 'border-navy text-navy' 
          : 'border-transparent text-gray-500 hover:text-gray-700'
        }
      `}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

// Simple Button Component
interface SimpleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  type?: 'button' | 'submit';
  disabled?: boolean;
}

const SimpleButton = ({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled = false
}: SimpleButtonProps) => {
  const styles = {
    primary: `bg-navy text-white border border-navy hover:bg-navy-dark ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    secondary: `bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    ghost: `bg-transparent text-gray-600 border border-transparent hover:bg-gray-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`
  };
  
  return (
    <button 
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      type={type}
      className={`px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center rounded-sm ${styles[variant]}`}
    >
      {children}
    </button>
  );
};

// Composant Médiathèque
const Mediatheque: React.FC<{
  mediaItems: MediaItem[];
  setMediaItems: React.Dispatch<React.SetStateAction<MediaItem[]>>;
}> = ({ mediaItems, setMediaItems }) => {
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<MediaItem | null>(null);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [showImportantDocsOnly, setShowImportantDocsOnly] = useState(false);

  // Données fictives pour les dossiers
  const folders = [
    { id: 'all', name: 'Tous les fichiers', count: 20 },
    { id: 'images', name: 'Images', count: 6 },
    { id: 'documents', name: 'Documents', count: 12 },
    { id: 'videos', name: 'Vidéos', count: 2 },
    { id: 'important', name: 'Documents importants', count: 4 },
  ];

  // Données fictives pour les documents importants
  const importantDocuments: MediaItem[] = [
    {
      id: 101,
      name: 'Canevas de mémoire.pdf',
      type: 'document',
      size: '1.2 MB',
      uploadedBy: 'Admin',
      date: '01/01/2025',
      url: 'https://example.com/canevas.pdf',
      likes: 25,
      liked: false,
      comments: [
        { id: 1, author: 'Dr. Ahmed Diop', text: 'Ce canevas est à utiliser obligatoirement pour tous les mémoires.', date: '02/01/2025' }
      ],
      important: true,
      description: 'Format officiel à utiliser pour tous les mémoires de fin d\'études.',
      category: 'Modèle'
    },
    {
      id: 102,
      name: 'Guide de rédaction.pdf',
      type: 'document',
      size: '3.5 MB',
      uploadedBy: 'Admin',
      date: '01/01/2025',
      url: 'https://example.com/guide.pdf',
      likes: 18,
      liked: false,
      comments: [],
      important: true,
      description: 'Guide complet détaillant les règles de rédaction académique pour les mémoires.',
      category: 'Guide'
    },
    {
      id: 103,
      name: 'Calendrier académique 2025.pdf',
      type: 'document',
      size: '850 KB',
      uploadedBy: 'Admin',
      date: '15/12/2024',
      url: 'https://example.com/calendrier.pdf',
      likes: 32,
      liked: true,
      comments: [
        { id: 1, author: 'Marie Faye', text: 'Merci pour le calendrier mis à jour.', date: '16/12/2024' }
      ],
      important: true,
      description: 'Calendrier officiel de l\'année académique 2025 avec toutes les dates importantes.',
      category: 'Planning'
    },
    {
      id: 104,
      name: 'Charte graphique ISI.pdf',
      type: 'document',
      size: '4.2 MB',
      uploadedBy: 'Admin',
      date: '10/01/2025',
      url: 'https://example.com/charte.pdf',
      likes: 15,
      liked: false,
      comments: [],
      important: true,
      description: 'Charte graphique officielle de l\'Institut à respecter pour tous les documents.',
      category: 'Modèle'
    }
  ];

  // Données fictives pour les médias réguliers
  const [localMediaItems, setLocalMediaItems] = useState<MediaItem[]>([
    { 
      id: 1, 
      name: 'presentation.pdf', 
      type: 'document', 
      size: '2.5 MB', 
      uploadedBy: 'Admin', 
      date: '12/05/2025',
      url: 'https://example.com/presentation.pdf',
      likes: 8,
      liked: false,
      comments: [
        { id: 1, author: 'Dr. Ahmed Diop', text: 'Très bonne présentation, merci pour le partage.', date: '13/05/2025' },
        { id: 2, author: 'Marie Faye', text: 'Je vais l\'utiliser pour mon cours.', date: '14/05/2025' }
      ]
    },
    { 
      id: 2, 
      name: 'logo.png', 
      type: 'image', 
      size: '540 KB', 
      uploadedBy: 'Admin', 
      date: '10/05/2025',
      url: 'https://example.com/logo.png',
      likes: 5,
      liked: true,
      comments: [
        { id: 1, author: 'Fatou Sow', text: 'Super design !', date: '11/05/2025' }
      ]
    },
    { 
      id: 3, 
      name: 'rapport.docx', 
      type: 'document', 
      size: '1.2 MB', 
      uploadedBy: 'Admin', 
      date: '08/05/2025',
      url: 'https://example.com/rapport.docx',
      likes: 3,
      liked: false,
      comments: []
    },
    { 
      id: 4, 
      name: 'cours_intro.mp4', 
      type: 'video', 
      size: '45 MB', 
      uploadedBy: 'Admin', 
      date: '05/05/2025',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      likes: 12,
      liked: false,
      comments: [
        { id: 1, author: 'Dr. Ousmane Fall', text: 'Vidéo très instructive.', date: '06/05/2025' },
        { id: 2, author: 'Dr. Ibrahima Ndiaye', text: 'Excellente introduction, merci !', date: '07/05/2025' }
      ]
    },
    { 
      id: 5, 
      name: 'banner.jpg', 
      type: 'image', 
      size: '1.8 MB', 
      uploadedBy: 'Admin', 
      date: '01/05/2025',
      url: 'https://example.com/banner.jpg',
      likes: 7,
      liked: false,
      comments: [
        { id: 1, author: 'Marie Faye', text: 'Belle image !', date: '02/05/2025' }
      ]
    },
  ]);

  // Tous les médias (importants + réguliers)
  const allMediaItems = [...importantDocuments, ...localMediaItems];
  const filteredItems = allMediaItems.filter(item => {
    // Filtre par dossier spécial "important"
    if (selectedFolder === 'important') {
      return item.important === true && item.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    // Filtre par dossier
    const matchesFolder = selectedFolder === 'all' || item.type === selectedFolder.replace('s', '');
    // Filtre par recherche
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    // Filtre si on veut voir uniquement les documents importants
    const matchesImportance = showImportantDocsOnly ? item.important : true;
    return matchesFolder && matchesSearch && matchesImportance;
  });

  const handleViewItem = (item: MediaItem) => {
    setCurrentItem(item);
    setShowViewModal(true);
    setShowComments(false);
  };

  const toggleLike = (itemId: number) => {
    setLocalMediaItems((prev: MediaItem[]) => prev.map((item: MediaItem) => {
      if (item.id === itemId) {
        return {
          ...item,
          likes: item.liked ? item.likes - 1 : item.likes + 1,
          liked: !item.liked
        };
      }
      return item;
    }));
    if (currentItem && currentItem.id === itemId) {
      setCurrentItem((prev: MediaItem | null) => {
        if (!prev) return null;
        return {
          ...prev,
          likes: prev.liked ? prev.likes - 1 : prev.likes + 1,
          liked: !prev.liked
        };
      });
    }
  };

  const handleAddComment = () => {
    if (!currentItem || !newComment.trim()) return;
    const newCommentObj: Comment = {
      id: Date.now(),
      author: 'Admin',
      text: newComment.trim(),
      date: new Date().toLocaleDateString('fr-FR')
    };
    const isImportant = importantDocuments.some(doc => doc.id === currentItem.id);
    if (!isImportant) {
      setLocalMediaItems((prev: MediaItem[]) => prev.map((item: MediaItem) => {
        if (item.id === currentItem.id) {
          return {
            ...item,
            comments: [...item.comments, newCommentObj]
          };
        }
        return item;
      }));
    }
    setCurrentItem((prev: MediaItem | null) => {
      if (!prev) return null;
      return {
        ...prev,
        comments: [...prev.comments, newCommentObj]
      };
    });
    setNewComment('');
  };

  const getIcon = (type: string, important: boolean = false) => {
    if (important) {
      return <FiBookmark className="h-6 w-6 text-red-500" />;
    }
    switch (type) {
      case 'image':
        return <FiImage className="h-6 w-6 text-navy-500" />;
      case 'video':
        return <FiFilm className="h-6 w-6 text-navy-500" />;
      default:
        return <FiFile className="h-6 w-6 text-gray-500" />;
    }
  };

  const renderModalContent = () => {
    if (!currentItem) return null;
    if (showComments) {
      return (
        <div className="p-4 h-96 flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Commentaires</h3>
          <div className="space-y-4 mb-6 flex-1 overflow-y-auto">
            {currentItem.comments.length === 0 ? (
              <p className="text-center text-gray-500">Aucun commentaire pour le moment</p>
            ) : (
              currentItem.comments.map((comment: Comment) => (
                <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{comment.author}</span>
                    <span className="text-xs text-gray-500">{comment.date}</span>
                  </div>
                  <p className="text-gray-700">{comment.text}</p>
                </div>
              ))
            )}
          </div>
          <div className="border-t pt-4 mt-auto">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Ajouter un commentaire..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className={`py-2 px-4 rounded-r-md flex items-center justify-center ${
                  newComment.trim() 
                    ? 'bg-navy text-white hover:bg-navy-dark' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <span className="mr-1">Envoyer</span>
                <FiSend className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    switch (currentItem.type) {
      case 'image':
        return (
          <div className="p-4 flex justify-center">
            <img 
              src={currentItem.url} 
              alt={currentItem.name} 
              className="max-w-full max-h-[70vh] object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/400x300?text=Image+non+disponible';
              }}
            />
          </div>
        );
      case 'video':
        const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = currentItem.url.match(youtubeRegex);
        const videoId = match ? match[1] : null;
        if (videoId) {
          return (
            <div className="p-4 flex justify-center">
              <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${videoId}`}
                title={currentItem.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          );
        } else {
          return (
            <div className="p-4 flex flex-col items-center">
              <FiFilm className="h-20 w-20 text-gray-400 mb-4" />
              <p className="text-center text-gray-600">
                La vidéo n'est pas disponible pour la prévisualisation directe. 
                <a 
                  href={currentItem.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-navy-600 hover:underline ml-1"
                >
                  Ouvrir dans un nouvel onglet
                </a>
              </p>
            </div>
          );
        }
      case 'document':
        return (
          <div className="p-4 flex flex-col items-center">
            {currentItem.important && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 max-w-md text-center">
                <h4 className="font-medium mb-1">Document important</h4>
                {currentItem.description && <p className="text-sm">{currentItem.description}</p>}
                {currentItem.category && (
                  <div className="mt-2">
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      {currentItem.category}
                    </span>
                  </div>
                )}
              </div>
            )}
            <FiFileText className="h-20 w-20 text-gray-400 mb-4" />
            <p className="text-center text-gray-600 mb-4">
              Document: {currentItem.name}
            </p>
            <a 
              href={currentItem.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-navy text-white px-4 py-2 rounded-sm flex items-center hover:bg-navy-dark transition-colors"
            >
              <FiExternalLink className="mr-2" /> Ouvrir le document
            </a>
          </div>
        );
      default:
        return (
          <div className="p-4 flex flex-col items-center">
            <FiFile className="h-20 w-20 text-gray-400 mb-4" />
            <p className="text-center text-gray-600">
              Ce type de fichier ne peut pas être prévisualisé
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Médiathèque</h2>
          <p className="text-sm text-gray-500 mt-1">Consultez et gérez les ressources partagées</p>
        </div>
        <SimpleButton 
          onClick={() => setShowImportantDocsOnly(!showImportantDocsOnly)}
          variant={showImportantDocsOnly ? 'primary' : 'secondary'}
        >
          <FiBookmark className="mr-2 h-4 w-4" />
          Documents importants
        </SimpleButton>
      </div>

      {/* Section des documents importants */}
      {!showImportantDocsOnly && selectedFolder === 'all' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <FiBookmark className="mr-2 text-red-500" /> Documents importants
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {importantDocuments.map(doc => (
              <div key={doc.id} className="bg-white border border-gray-200 p-4 rounded-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start">
                  <FiFileText className="h-8 w-8 text-red-500 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">{doc.name}</h4>
                    {doc.description && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{doc.description}</p>
                    )}
                    {doc.category && (
                      <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                        {doc.category}
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    Ajouté le {doc.date}
                  </div>
                  <button 
                    onClick={() => handleViewItem(doc)}
                    className="text-navy hover:text-navy-dark text-sm flex items-center"
                  >
                    <FiEye className="mr-1 h-4 w-4" />
                    Consulter
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 p-4 rounded-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dossiers</h3>
            <ul className="space-y-2">
              {folders.map(folder => (
                <li key={folder.id}>
                  <button
                    onClick={() => setSelectedFolder(folder.id)}
                    className={`flex items-center justify-between w-full p-2 rounded-sm transition-colors duration-200 ${
                      selectedFolder === folder.id 
                        ? 'bg-navy text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center">
                      {folder.id === 'important' ? (
                        <FiBookmark className="mr-2 h-5 w-5" />
                      ) : (
                        <FiFolder className="mr-2 h-5 w-5" />
                      )}
                      <span className="whitespace-nowrap">{folder.name}</span>
                    </div>
                    <span className={`${
                      selectedFolder === folder.id 
                        ? 'bg-white bg-opacity-20 text-white' 
                        : 'bg-gray-100 text-gray-600'
                    } text-xs px-2 py-1 rounded-full`}>
                      {folder.count}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white border border-gray-200 rounded-sm">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher des fichiers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-sm border border-gray-300 focus:outline-none focus:ring-1 focus:ring-navy focus:border-navy"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Nom
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Téléversé par
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Date
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Interactions
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                        Aucun fichier trouvé
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map(item => (
                      <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${item.important ? 'bg-red-50' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 mr-3">
                              {getIcon(item.type, item.important)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{item.name}</div>
                              <div className="text-sm text-gray-500 flex items-center">
                                {item.size}
                                {item.category && (
                                  <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                                    {item.category}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700">{item.uploadedBy}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700">{item.date}</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center space-x-4">
                            <button 
                              onClick={() => toggleLike(item.id)}
                              className={`flex items-center ${item.liked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`}
                            >
                              <FiHeart className={`h-5 w-5 mr-1 ${item.liked ? 'fill-current' : ''}`} />
                              <span>{item.likes}</span>
                            </button>
                            <button 
                              onClick={() => {
                                handleViewItem(item);
                                setShowComments(true);
                              }}
                              className="flex items-center text-gray-500 hover:text-gray-700"
                            >
                              <FiMessageSquare className="h-5 w-5 mr-1" />
                              <span>{item.comments.length}</span>
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleViewItem(item)}
                            className="text-navy hover:text-navy-dark flex items-center justify-end"
                          >
                            <FiEye className="h-5 w-5 mr-1" />
                            <span>Consulter</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de consultation */}
      <AnimatePresence>
        {showViewModal && currentItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-sm shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col"
            >
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold text-gray-900">{currentItem.name}</h3>
                  {currentItem.important && (
                    <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full flex items-center">
                      <FiBookmark className="mr-1 h-3 w-3" />
                      Important
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => toggleLike(currentItem.id)}
                    className={`flex items-center ${currentItem.liked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`}
                  >
                    <FiHeart className={`h-5 w-5 mr-1 ${currentItem.liked ? 'fill-current' : ''}`} />
                    <span>{currentItem.likes}</span>
                  </button>
                  <button onClick={() => setShowComments(!showComments)}
                    className={`flex items-center ${showComments ? 'text-navy' : 'text-gray-500'} hover:text-navy`}
                  >
                    <FiMessageSquare className="h-5 w-5 mr-1" />
                    <span>{currentItem.comments.length}</span>
                  </button>
                  <button 
                    onClick={() => setShowViewModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto">
                {renderModalContent()}
              </div>
              <div className="p-4 border-t border-gray-200 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Ajouté par {currentItem.uploadedBy} le {currentItem.date}
                </div>
                <SimpleButton
                  onClick={() => setShowViewModal(false)}
                  variant="secondary"
                >
                  Fermer
                </SimpleButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Composant Ajout Canevas
const AjoutCanevas: React.FC = () => {
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    category: string;
    file: File | null;
  }>({
    title: '',
    description: '',
    category: '',
    file: null as File | null
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: typeof formData) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev: typeof formData) => ({
      ...prev,
      file
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Canevas submitted:', formData);
    alert('Canevas ajouté avec succès !');
    setFormData({
      title: '',
      description: '',
      category: '',
      file: null
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white border border-gray-200 p-6 rounded-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Ajouter un canevas</h2>
          <p className="text-sm text-gray-500 mt-1">Téléversez un nouveau canevas pour les mémoires</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre du canevas *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: Canevas de mémoire Master 2"
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy rounded-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm"
              required
            >
              <option value="">Sélectionner une catégorie</option>
              <option value="Modèle">Modèle</option>
              <option value="Guide">Guide</option>
              <option value="Template">Template</option>
              <option value="Exemple">Exemple</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description du canevas..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fichier *
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-sm hover:border-gray-400 transition-colors">
              <div className="space-y-1 text-center">
                <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-sm font-medium text-navy hover:text-navy-light focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-navy">
                    <span>Téléverser un fichier</span>
                    <input
                      id="file-upload"
                      name="file"
                      type="file"
                      className="sr-only"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      required
                    />
                  </label>
                  <p className="pl-1">ou glisser-déposer</p>
                </div>
                <p className="text-xs text-gray-500">PDF, DOC, DOCX jusqu'à 10MB</p>
                {formData.file && (
                  <p className="text-sm text-gray-900 mt-2">
                    Fichier sélectionné: {formData.file.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <SimpleButton
              type="button"
              variant="secondary"
              onClick={() => setFormData({
                title: '',
                description: '',
                category: '',
                file: null
              })}
            >
              Réinitialiser
            </SimpleButton>
            <SimpleButton
              type="submit"
              variant="primary"
            >
              <FiPlus className="h-4 w-4 mr-2" />
              Ajouter le canevas
            </SimpleButton>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

// Composant Ajout Cours
const AjoutCours: React.FC = () => {
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    department: string;
    level: string;
    files: File[];
  }>({
    name: '',
    description: '',
    department: '',
    level: '',
    files: [] as File[]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: typeof formData) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      files
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Cours submitted:', formData);
    alert('Cours ajouté avec succès !');
    setFormData({
      name: '',
      description: '',
      department: '',
      level: '',
      files: []
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto"
    >
      <div className="bg-white border border-gray-200 p-6 rounded-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Ajouter un cours</h2>
          <p className="text-sm text-gray-500 mt-1">Ajoutez des ressources de cours liées aux mémoires</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du cours *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Méthodologie de recherche"
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Département *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm"
                required
              >
                <option value="">Sélectionner un département</option>
                <option value="Informatique">Informatique</option>
                <option value="Réseaux">Réseaux</option>
                <option value="Management">Management</option>
                <option value="Génie Civil">Génie Civil</option>
                <option value="Électronique">Électronique</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Niveau *
            </label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm"
              required
            >
              <option value="">Sélectionner un niveau</option>
              <option value="Licence 1">Licence 1</option>
              <option value="Licence 2">Licence 2</option>
              <option value="Licence 3">Licence 3</option>
              <option value="Master 1">Master 1</option>
              <option value="Master 2">Master 2</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description du cours et objectifs pédagogiques..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ressources du cours
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-sm hover:border-gray-400 transition-colors">
              <div className="space-y-1 text-center">
                <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="files-upload" className="relative cursor-pointer bg-white rounded-sm font-medium text-navy hover:text-navy-light focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-navy">
                    <span>Téléverser des fichiers</span>
                    <input
                      id="files-upload"
                      name="files"
                      type="file"
                      multiple
                      className="sr-only"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">ou glisser-déposer</p>
                </div>
                <p className="text-xs text-gray-500">PDF, DOC, PPT, Images (max 10MB chacun)</p>
                {formData.files.length > 0 && (
                  <div className="text-sm text-gray-900 mt-2">
                    <p>{formData.files.length} fichier(s) sélectionné(s):</p>
                    <ul className="text-xs text-gray-600 mt-1">
                      {formData.files.map((file, index) => (
                        <li key={index}>• {file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <SimpleButton
              type="button"
              variant="secondary"
              onClick={() => setFormData({
                name: '',
                description: '',
                department: '',
                level: '',
                files: []
              })}
            >
              Réinitialiser
            </SimpleButton>
            <SimpleButton
              type="submit"
              variant="primary"
            >
              <FiPlus className="h-4 w-4 mr-2" />
              Ajouter le cours
            </SimpleButton>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

// Ajouter le composant ArchiveDocuments
const ArchiveDocuments: React.FC<{ documents: MediaItem[] }> = ({ documents }) => (
  <div>
    <h2 className="text-lg font-semibold mb-4">Documents enregistrés</h2>
    {documents.length === 0 ? (
      <div className="text-gray-500">Aucun document archivé.</div>
    ) : (
      <ul className="divide-y divide-gray-200">
        {documents.map(doc => (
          <li key={doc.id} className="py-3 flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-900">{doc.name}</span>
              <span className="ml-2 text-xs text-gray-500">({doc.size})</span>
              <span className="ml-2 text-xs text-gray-400">{doc.date}</span>
            </div>
            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-navy hover:underline flex items-center">
              <FiDownload className="mr-1" /> Télécharger
            </a>
          </li>
        ))}
      </ul>
    )}
  </div>
);

// Composant principal PageMemoires
const PageMemoires: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'mediatheque' | 'ajout-canevas' | 'ajout-cours' | 'archivage'>('mediatheque');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    { 
      id: 1, 
      name: 'presentation.pdf', 
      type: 'document', 
      size: '2.5 MB', 
      uploadedBy: 'Admin', 
      date: '12/05/2025',
      url: 'https://example.com/presentation.pdf',
      likes: 8,
      liked: false,
      comments: [
        { id: 1, author: 'Dr. Ahmed Diop', text: 'Très bonne présentation, merci pour le partage.', date: '13/05/2025' },
        { id: 2, author: 'Marie Faye', text: 'Je vais l\'utiliser pour mon cours.', date: '14/05/2025' }
      ]
    },
    { 
      id: 2, 
      name: 'logo.png', 
      type: 'image', 
      size: '540 KB', 
      uploadedBy: 'Admin', 
      date: '10/05/2025',
      url: 'https://example.com/logo.png',
      likes: 5,
      liked: true,
      comments: [
        { id: 1, author: 'Fatou Sow', text: 'Super design !', date: '11/05/2025' }
      ]
    },
    { 
      id: 3, 
      name: 'rapport.docx', 
      type: 'document', 
      size: '1.2 MB', 
      uploadedBy: 'Admin', 
      date: '08/05/2025',
      url: 'https://example.com/rapport.docx',
      likes: 3,
      liked: false,
      comments: []
    },
    { 
      id: 4, 
      name: 'cours_intro.mp4', 
      type: 'video', 
      size: '45 MB', 
      uploadedBy: 'Admin', 
      date: '05/05/2025',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      likes: 12,
      liked: false,
      comments: [
        { id: 1, author: 'Dr. Ousmane Fall', text: 'Vidéo très instructive.', date: '06/05/2025' },
        { id: 2, author: 'Dr. Ibrahima Ndiaye', text: 'Excellente introduction, merci !', date: '07/05/2025' }
      ]
    },
    { 
      id: 5, 
      name: 'banner.jpg', 
      type: 'image', 
      size: '1.8 MB', 
      uploadedBy: 'Admin', 
      date: '01/05/2025',
      url: 'https://example.com/banner.jpg',
      likes: 7,
      liked: false,
      comments: [
        { id: 1, author: 'Marie Faye', text: 'Belle image !', date: '02/05/2025' }
      ]
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white border border-gray-200 p-6 mb-6 rounded-sm">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full p-3 mr-4">
              <FiBookmark className="h-7 w-7 text-navy" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Mémoires</h1>
              <p className="text-sm text-gray-500 mt-1">
                Gérez les ressources, canevas et cours liés aux mémoires
              </p>
            </div>
          </div>
        </div>
        
        {/* Onglets */}
        <div className="bg-white border border-gray-200 mb-6 rounded-sm">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              <TabButton
                isActive={activeTab === 'mediatheque'}
                onClick={() => setActiveTab('mediatheque')}
                icon={<FiFolder className="h-4 w-4" />}
              >
                Médiathèque
              </TabButton>
              {(user?.estChef || user?.estSecretaire) && (
                <TabButton
                  isActive={activeTab === 'ajout-canevas'}
                  onClick={() => setActiveTab('ajout-canevas')}
                  icon={<FiFileText className="h-4 w-4" />}
                >
                  Ajout Canevas
                </TabButton>
              )}
              {(user?.estChef || user?.estProfesseur) && (
                <TabButton
                  isActive={activeTab === 'ajout-cours'}
                  onClick={() => setActiveTab('ajout-cours')}
                  icon={<FiPlus className="h-4 w-4" />}
                >
                  Ajout Cours
                </TabButton>
              )}
              <TabButton
                isActive={activeTab === 'archivage'}
                onClick={() => setActiveTab('archivage')}
                icon={<FiFile className="h-4 w-4" />}
              >
                Archivage
              </TabButton>
            </div>
          </div>
          
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'mediatheque' && (
                <motion.div
                  key="mediatheque"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Mediatheque mediaItems={mediaItems} setMediaItems={setMediaItems} />
                </motion.div>
              )}
              
              {activeTab === 'ajout-canevas' && (
                <motion.div
                  key="ajout-canevas"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <AjoutCanevas />
                </motion.div>
              )}
              
              {activeTab === 'ajout-cours' && (
                <motion.div
                  key="ajout-cours"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <AjoutCours />
                </motion.div>
              )}

              {activeTab === 'archivage' && (
                <motion.div
                  key="archivage"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ArchiveDocuments documents={mediaItems.filter((m: MediaItem) => m.type === 'document')} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageMemoires;