import React, { useState } from 'react';
import { 
  FiFile, 
  FiImage, 
  FiFilm, 
  FiSearch, 
  FiFolder, 
  FiX, 
  FiExternalLink, 
  FiEye, 
  FiHeart, 
  FiMessageSquare, 
  FiSend,
  FiBookmark,
  FiFileText,
  FiDownload
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
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
  saved: boolean;
  comments: Comment[];
  important?: boolean;
  description?: string;
  category?: string;
  niveau?: 'licence' | 'master' | 'autres' | 'all';
}

const Mediatheque: React.FC = () => {
  const { user } = useAuth();
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
  
  // Documents disponibles selon le niveau
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    {
      id: 1,
      name: 'Méthodologie de recherche.pdf',
      type: 'document',
      size: '2.1 MB',
      uploadedBy: 'Dr. Aminata Diop',
      date: '15/05/2025',
      url: '#',
      likes: 24,
      liked: false,
      saved: true,
      comments: [
        { id: 1, author: 'Moussa Kane', text: 'Très utile pour mon mémoire !', date: '16/05/2025' }
      ],
      important: true,
      description: 'Guide méthodologique pour la rédaction de mémoires académiques',
      category: 'Méthodologie',
      niveau: user?.niveau === 'autres' ? 'all' : 'licence'
    },
    {
      id: 2,
      name: 'Template PowerPoint ISI.pptx',
      type: 'document',
      size: '1.8 MB',
      uploadedBy: 'Admin',
      date: '10/05/2025',
      url: '#',
      likes: 18,
      liked: true,
      saved: false,
      comments: [],
      important: true,
      description: 'Modèle officiel pour les présentations',
      category: 'Template',
      niveau: 'all'
    },
    {
      id: 3,
      name: 'Cours Intelligence Artificielle.mp4',
      type: 'video',
      size: '125 MB',
      uploadedBy: 'Prof. Ibrahima Fall',
      date: '08/05/2025',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      likes: 45,
      liked: false,
      saved: true,
      comments: [
        { id: 1, author: 'Fatou Ndiaye', text: 'Excellent cours, merci professeur !', date: '09/05/2025' }
      ],
      niveau: user?.niveau === 'autres' ? 'all' : 'master'
    },
    {
      id: 4,
      name: 'Logo ISI officiel.png',
      type: 'image',
      size: '340 KB',
      uploadedBy: 'Admin',
      date: '05/05/2025',
      url: 'https://via.placeholder.com/400x300/2563eb/ffffff?text=Logo+ISI',
      likes: 12,
      liked: false,
      saved: false,
      comments: [],
      niveau: 'all'
    },
    {
      id: 5,
      name: 'Exemples de mémoires.pdf',
      type: 'document',
      size: '8.2 MB',
      uploadedBy: 'Dr. Ousmane Dieng',
      date: '01/05/2025',
      url: '#',
      likes: 67,
      liked: true,
      saved: true,
      comments: [
        { id: 1, author: 'Awa Seck', text: 'Ces exemples m\'ont beaucoup aidée', date: '02/05/2025' },
        { id: 2, author: 'Modou Thiam', text: 'Parfait pour avoir une idée de la structure', date: '03/05/2025' }
      ],
      important: true,
      description: 'Collection de mémoires exemplaires des années précédentes',
      category: 'Exemples',
      niveau: user?.niveau === 'autres' ? 'all' : 'licence'
    }
  ]);

  // Documents importants filtrés
  const importantDocuments = mediaItems.filter(item => item.important);

  // Tous les médias (importants + réguliers)
  const allMediaItems = mediaItems;
  
  const filteredItems = allMediaItems.filter(item => {
    // Vérifier le niveau d'accès
    if (item.niveau && item.niveau !== 'all' && item.niveau !== user?.niveau) {
      return false;
    }

    // Filtre par dossier spécial "important"
    if (selectedFolder === 'important') {
      return item.important === true && item.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    // Filtre par dossier
    const matchesFolder = selectedFolder === 'all' || item.type === selectedFolder.replace('s', '');
    // Filtre par recherche
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category?.toLowerCase().includes(searchQuery.toLowerCase());
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
    setMediaItems(prev => prev.map(item => {
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
      setCurrentItem(prev => {
        if (!prev) return null;
        return {
          ...prev,
          likes: prev.liked ? prev.likes - 1 : prev.likes + 1,
          liked: !prev.liked
        };
      });
    }
  };

  const toggleSave = (itemId: number) => {
    setMediaItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, saved: !item.saved };
      }
      return item;
    }));

    if (currentItem && currentItem.id === itemId) {
      setCurrentItem(prev => {
        if (!prev) return null;
        return { ...prev, saved: !prev.saved };
      });
    }
  };
  
  const handleAddComment = () => {
    if (!currentItem || !newComment.trim()) return;
    
    const newCommentObj: Comment = {
      id: Date.now(),
      author: user?.name || 'Étudiant',
      text: newComment.trim(),
      date: new Date().toLocaleDateString('fr-FR')
    };
    
    setMediaItems(prev => prev.map(item => {
      if (item.id === currentItem.id) {
        return {
          ...item,
          comments: [...item.comments, newCommentObj]
        };
      }
      return item;
    }));
    
    setCurrentItem(prev => {
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
        return <FiImage className="h-6 w-6 text-blue-500" />;
      case 'video':
        return <FiFilm className="h-6 w-6 text-purple-500" />;
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
              currentItem.comments.map(comment => (
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
                className="flex-1 border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
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
                    ? 'bg-primary text-white hover:bg-primary-700' 
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
        } else if (currentItem.url.includes('drive.google.com')) {
          return (
            <div className="p-4 flex justify-center">
              <iframe
                width="560"
                height="315"
                src={currentItem.url.replace('/view', '/preview')}
                title={currentItem.name}
                frameBorder="0"
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
                  className="text-primary hover:underline ml-1"
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
              className="btn-primary flex items-center"
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Médiathèque</h1>
        <div>
          <button 
            onClick={() => setShowImportantDocsOnly(!showImportantDocsOnly)}
            className={`flex items-center ${
              showImportantDocsOnly 
                ? 'bg-red-100 text-red-700' 
                : 'bg-gray-100 text-gray-700'
            } px-3 py-1.5 rounded-md hover:bg-opacity-90 transition-colors`}
          >
            <FiBookmark className={`mr-2 ${showImportantDocsOnly ? 'text-red-500' : ''}`} />
            Documents importants
          </button>
        </div>
      </div>
      
      {/* Section des documents importants */}
      {!showImportantDocsOnly && selectedFolder === 'all' && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-navy mb-3 flex items-center">
            <FiBookmark className="mr-2 text-red-500" /> Documents importants
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {importantDocuments.map(doc => (
              <div key={doc.id} className="card p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start">
                  <FiFileText className="h-8 w-8 text-red-500 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-navy-800 mb-1">{doc.name}</h3>
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
                    className="text-primary hover:text-primary-700 text-sm flex items-center"
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
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="card p-4"
          >
            <h2 className="text-lg font-semibold text-navy mb-4">Dossiers</h2>
            
            <ul className="space-y-2">
              {folders.map(folder => (
                <li key={folder.id}>
                  <button
                    onClick={() => setSelectedFolder(folder.id)}
                    className={`flex items-center justify-between w-full p-2 rounded-md transition-colors duration-200 ${
                      selectedFolder === folder.id 
                        ? 'bg-primary text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center">
                      {folder.id === 'important' ? (
                        <FiBookmark className="mr-2 h-5 w-5" />
                      ) : (
                        <FiFolder className="mr-2 h-5 w-5" />
                      )}
                      <span>{folder.name}</span>
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
          </motion.div>
        </div>
        
        <div className="lg:col-span-3">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card"
          >
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher des fichiers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Téléversé par
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Interactions
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                        Aucun fichier trouvé
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map(item => (
                      <tr key={item.id} className={`hover:bg-gray-50 ${item.important ? 'bg-red-50' : ''}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 mr-3">
                              {getIcon(item.type, item.important)}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 flex items-center">
                                {item.name}
                                {item.saved && (
                                  <FiHeart className="ml-2 h-4 w-4 text-red-500 fill-current" />
                                )}
                              </div>
                              <div className="text-sm text-gray-500">
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-700">{item.uploadedBy}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-700">{item.date}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
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
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => toggleSave(item.id)}
                              className={`p-1 rounded ${item.saved ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                              title={item.saved ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                            >
                              <FiHeart className={`h-4 w-4 ${item.saved ? 'fill-current' : ''}`} />
                            </button>
                            <button 
                              onClick={() => handleViewItem(item)}
                              className="text-primary hover:text-primary-700 flex items-center justify-end"
                            >
                              <FiEye className="h-5 w-5 mr-1" />
                              <span>Consulter</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
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
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col"
            >
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold text-navy">{currentItem.name}</h3>
                  {currentItem.important && (
                    <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full flex items-center">
                      <FiBookmark className="mr-1 h-3 w-3" />
                      Important
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleSave(currentItem.id)}
                    className={`flex items-center ${currentItem.saved ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`}
                    title={currentItem.saved ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  >
                    <FiHeart className={`h-5 w-5 mr-1 ${currentItem.saved ? 'fill-current' : ''}`} />
                  </button>
                  <button 
                    onClick={() => toggleLike(currentItem.id)}
                    className={`flex items-center ${currentItem.liked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`}
                  >
                    <FiHeart className={`h-5 w-5 mr-1 ${currentItem.liked ? 'fill-current' : ''}`} />
                    <span>{currentItem.likes}</span>
                  </button>
                  <button onClick={() => setShowComments(!showComments)}
                    className={`flex items-center ${showComments ? 'text-primary' : 'text-gray-500'} hover:text-primary`}
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
              
              <div className="p-4 border-t border-gray-100 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Ajouté par {currentItem.uploadedBy} le {currentItem.date}
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Mediatheque;