import React, { useState } from 'react';
import { 
  FiEye, 
  FiHeart, 
  FiMessageSquare, 
  FiCalendar, 
  FiUser, 
  FiFileText, 
  FiImage, 
  FiFilm,
  FiCheck,
  FiClock,
  FiX,
  FiAlertCircle,
  FiExternalLink,
  FiAward
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

interface Publication {
  id: number;
  title: string;
  description: string;
  content: string;
  type: 'document' | 'image' | 'video';
  status: 'valide_post_soutenance' | 'publie';
  createdDate: string;
  lastModified: string;
  publicationDate?: string;
  soutenanceDate: string;
  validationDate: string;
  tags: string[];
  likes: number;
  comments: number;
  views: number;
  fileSize: string;
  note?: string;
  encadrant: string;
  jury: string[];
}

const MediathequePublications: React.FC = () => {
  const { user } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);

  // Vérifier si l'utilisateur peut publier
  const canPublish = user?.niveau === 'licence' || user?.niveau === 'master';

  // Publications validées de l'étudiant (simulation)
  const [publications, setPublications] = useState<Publication[]>([
    {
      id: 1,
      title: 'Système de gestion de bibliothèque avec React',
      description: 'Développement d\'une application web complète pour la gestion d\'une bibliothèque universitaire utilisant React et Node.js.',
      content: 'Application web moderne développée avec React.js pour le frontend et Node.js/Express pour le backend. Le système permet la gestion complète d\'une bibliothèque universitaire avec les fonctionnalités suivantes : gestion des livres, des emprunts, des utilisateurs, recherche avancée, notifications automatiques, et tableaux de bord statistiques. L\'application utilise une base de données MongoDB pour le stockage et intègre une API REST complète.',
      type: 'document',
      status: 'publie',
      createdDate: '2024-10-15',
      lastModified: '2024-12-20',
      publicationDate: '2025-01-10',
      soutenanceDate: '2024-12-18',
      validationDate: '2024-12-20',
      tags: ['react', 'nodejs', 'bibliothèque', 'web'],
      likes: 24,
      comments: 8,
      views: 156,
      fileSize: '3.2 MB',
      note: '16/20',
      encadrant: 'Dr. Aminata Diop',
      jury: ['Dr. Aminata Diop', 'Prof. Ibrahima Fall', 'Dr. Ousmane Seck']
    },
    {
      id: 2,
      title: 'Interface mobile pour suivi académique',
      description: 'Application mobile permettant aux étudiants de suivre leurs notes, emplois du temps et communications avec l\'administration.',
      content: 'Application mobile développée avec React Native permettant aux étudiants d\'accéder facilement à leurs informations académiques. Fonctionnalités : consultation des notes en temps réel, emploi du temps interactif, notifications push pour les communications importantes, messagerie avec les professeurs, et suivi des absences. L\'application se synchronise avec le système d\'information de l\'université via une API sécurisée.',
      type: 'document',
      status: 'valide_post_soutenance',
      createdDate: '2024-11-20',
      lastModified: '2025-01-15',
      soutenanceDate: '2025-01-12',
      validationDate: '2025-01-15',
      tags: ['mobile', 'react-native', 'académique'],
      likes: 0,
      comments: 0,
      views: 0,
      fileSize: '2.8 MB',
      note: '15/20',
      encadrant: 'Prof. Cheikh Seck',
      jury: ['Prof. Cheikh Seck', 'Dr. Fatou Ndiaye', 'Dr. Moussa Kane']
    },
    {
      id: 3,
      title: 'Analyse prédictive des ventes avec IA',
      description: 'Système d\'analyse de données utilisant le machine learning pour prédire les tendances de vente et optimiser les stocks.',
      content: 'Projet de fin d\'études portant sur l\'analyse prédictive des ventes en utilisant des algorithmes de machine learning. Le système développé utilise Python, Scikit-learn et TensorFlow pour analyser les données historiques de vente et prédire les tendances futures. Intégration d\'un tableau de bord interactif avec Dash permettant aux gestionnaires de visualiser les prédictions et d\'optimiser leurs décisions d\'achat et de stockage.',
      type: 'document',
      status: 'publie',
      createdDate: '2024-09-10',
      lastModified: '2024-11-25',
      publicationDate: '2024-12-05',
      soutenanceDate: '2024-11-22',
      validationDate: '2024-11-25',
      tags: ['python', 'machine learning', 'données', 'IA'],
      likes: 45,
      comments: 12,
      views: 289,
      fileSize: '4.1 MB',
      note: '17/20',
      encadrant: 'Dr. Aïssatou Diallo',
      jury: ['Dr. Aïssatou Diallo', 'Prof. Ibrahima Fall', 'Dr. Aminata Diop']
    }
  ]);

  const statusLabels = {
    all: 'Toutes',
    valide_post_soutenance: 'Validées (en attente publication)',
    publie: 'Publiées dans la médiathèque'
  };

  const statusColors = {
    valide_post_soutenance: 'bg-green-100 text-green-800',
    publie: 'bg-emerald-100 text-emerald-800'
  };

  const statusIcons = {
    valide_post_soutenance: <FiCheck className="h-4 w-4" />,
    publie: <FiAward className="h-4 w-4" />
  };

  // Filtrer les publications
  const filteredPublications = publications.filter(pub => {
    const matchesStatus = selectedStatus === 'all' || pub.status === selectedStatus;
    const matchesSearch = pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pub.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pub.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  // Statistiques
  const stats = {
    total: publications.length,
    validates: publications.filter(p => p.status === 'valide_post_soutenance').length,
    publies: publications.filter(p => p.status === 'publie').length,
    totalViews: publications.filter(p => p.status === 'publie').reduce((sum, p) => sum + p.views, 0),
    totalLikes: publications.filter(p => p.status === 'publie').reduce((sum, p) => sum + p.likes, 0)
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <FiImage className="h-5 w-5 text-primary" />;
      case 'video': return <FiFilm className="h-5 w-5 text-purple-500" />;
      default: return <FiFileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const handlePreview = (publication: Publication) => {
    setSelectedPublication(publication);
    setShowPreviewModal(true);
  };

  const handleViewInMediatheque = (publicationId: number) => {
    // Redirection vers la page de détail dans la médiathèque
    window.open(`/mediatheque/detail/${publicationId}`, '_blank');
  };

  const getActionsByStatus = (publication: Publication) => {
    switch (publication.status) {
      case 'valide_post_soutenance':
        return (
          <div className="flex flex-col space-y-2">
            <button 
              onClick={() => handlePreview(publication)}
              className="flex items-center justify-center px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90"
            >
              <FiEye className="h-3 w-3 mr-1" />
              Aperçu
            </button>
            <span className="text-xs text-green-600 text-center px-2 py-1">
              Publication automatique en cours
            </span>
          </div>
        );
      case 'publie':
        return (
          <div className="flex flex-col space-y-2">
            <button 
              onClick={() => handlePreview(publication)}
              className="flex items-center justify-center px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90"
            >
              <FiEye className="h-3 w-3 mr-1" />
              Aperçu
            </button>
            <button 
              onClick={() => handleViewInMediatheque(publication.id)}
              className="flex items-center justify-center px-3 py-1 bg-emerald-500 text-white rounded text-sm hover:bg-emerald-600"
            >
              <FiExternalLink className="h-3 w-3 mr-1" />
              Voir en ligne
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  if (!canPublish) {
    return (
      <div className="text-center py-12">
        <FiAlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Fonctionnalité non disponible</h2>
        <p className="text-gray-600 mb-4">
          La consultation des publications est réservée aux étudiants de niveau Licence et Master.
        </p>
        <p className="text-sm text-gray-500">
          Votre niveau actuel : <span className="font-medium">{user?.niveau || 'Non défini'}</span>
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Mes Publications Validées</h1>
          <p className="text-gray-600 mt-1">
            Consultez vos travaux académiques validés et publiés dans la médiathèque
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
          <div className="text-sm text-gray-600">Total validées</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-green-600">{stats.validates}</div>
          <div className="text-sm text-gray-600">En attente publication</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-emerald-600">{stats.publies}</div>
          <div className="text-sm text-gray-600">Publiées</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-primary">{stats.totalViews}</div>
          <div className="text-sm text-gray-600">Vues totales</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-red-600">{stats.totalLikes}</div>
          <div className="text-sm text-gray-600">Likes totaux</div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Rechercher dans mes publications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
          />
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          <div className="text-sm text-gray-600 flex items-center">
            {filteredPublications.length} publication{filteredPublications.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Liste des publications */}
      {filteredPublications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <FiAward className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucune publication trouvée</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || selectedStatus !== 'all' 
              ? 'Modifiez vos critères de recherche.' 
              : 'Vos travaux validés apparaîtront ici après soutenance réussie.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPublications.map((publication, index) => (
            <motion.div
              key={publication.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow h-full flex flex-col"
            >
              {/* Contenu principal de la card */}
              <div className="p-6 flex-grow flex flex-col">
                
                {/* En-tête - hauteur fixe */}
                <div className="flex items-start justify-between mb-4 min-h-[32px]">
                  <div className="flex items-center">
                    {getTypeIcon(publication.type)}
                    <span className={`ml-2 text-xs px-2 py-1 rounded-full flex items-center ${statusColors[publication.status]}`}>
                      {statusIcons[publication.status]}
                      <span className="ml-1">{statusLabels[publication.status as keyof typeof statusLabels]}</span>
                    </span>
                  </div>
                </div>

                {/* Titre - hauteur fixe avec clamp */}
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-800 line-clamp-2 min-h-[3rem] flex items-start">
                    {publication.title}
                  </h3>
                </div>

                {/* Description - hauteur fixe avec clamp */}
                <div className="mb-4 flex-grow">
                  <p className="text-sm text-gray-600 line-clamp-3 min-h-[4.5rem] leading-6">
                    {publication.description}
                  </p>
                </div>

                {/* Tags - hauteur fixe */}
                <div className="flex flex-wrap gap-1 mb-4 min-h-[24px]">
                  {publication.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                      #{tag}
                    </span>
                  ))}
                  {publication.tags.length > 3 && (
                    <span className="text-xs text-gray-500 flex items-center">+{publication.tags.length - 3}</span>
                  )}
                </div>

                {/* Note et encadrant - hauteur fixe */}
                <div className="text-xs text-gray-500 mb-4 space-y-1 min-h-[40px]">
                  <div className="flex items-center">
                    <FiAward className="h-3 w-3 mr-1" />
                    <span>Note : {publication.note}</span>
                  </div>
                  <div className="flex items-center">
                    <FiUser className="h-3 w-3 mr-1" />
                    <span>Encadrant : {publication.encadrant}</span>
                  </div>
                </div>

                {/* Statistiques - hauteur fixe */}
                {publication.status === 'publie' && (
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4 min-h-[16px]">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <FiHeart className="h-3 w-3 mr-1 text-red-500" />
                        <span>{publication.likes}</span>
                      </div>
                      <div className="flex items-center">
                        <FiMessageSquare className="h-3 w-3 mr-1" />
                        <span>{publication.comments}</span>
                      </div>
                      <div className="flex items-center">
                        <FiEye className="h-3 w-3 mr-1" />
                        <span>{publication.views}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions - toujours en bas */}
              <div className="px-6 pb-6 mt-auto">
                {getActionsByStatus(publication)}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Information sur le processus */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mt-8">
        <h3 className="font-semibold text-emerald-800 mb-2">Félicitations !</h3>
        <p className="text-emerald-700 text-sm mb-2">
          Vos travaux ont été validés avec succès par la commission d'évaluation.
        </p>
        <p className="text-emerald-700 text-sm">
          Les documents validés sont automatiquement publiés dans la médiathèque pour être consultés par la communauté académique.
        </p>
      </div>

      {/* Modal d'aperçu */}
      <AnimatePresence>
        {showPreviewModal && selectedPublication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                {/* En-tête du modal */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{selectedPublication.title}</h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className={`px-2 py-1 rounded-full ${statusColors[selectedPublication.status]}`}>
                        {statusLabels[selectedPublication.status as keyof typeof statusLabels]}
                      </span>
                      <span>Note : {selectedPublication.note}</span>
                      <span>Taille : {selectedPublication.fileSize}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>

                {/* Informations détaillées */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Informations académiques</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Encadrant :</span>
                        <span className="font-medium">{selectedPublication.encadrant}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Soutenance :</span>
                        <span className="font-medium">{new Date(selectedPublication.soutenanceDate).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Validation :</span>
                        <span className="font-medium">{new Date(selectedPublication.validationDate).toLocaleDateString('fr-FR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Note obtenue :</span>
                        <span className="font-medium text-green-600">{selectedPublication.note}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">Jury d'évaluation</h3>
                    <div className="space-y-1 text-sm">
                      {selectedPublication.jury.map((membre, index) => (
                        <div key={index} className="flex items-center">
                          <FiUser className="h-3 w-3 mr-2 text-gray-400" />
                          <span>{membre}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedPublication.description}</p>
                </div>

                {/* Contenu */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Résumé du contenu</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">{selectedPublication.content}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Mots-clés</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedPublication.tags.map(tag => (
                      <span key={tag} className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Statistiques si publié */}
                {selectedPublication.status === 'publie' && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-3">Statistiques de consultation</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xl font-bold text-gray-800">{selectedPublication.views}</div>
                        <div className="text-sm text-gray-600">Vues</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xl font-bold text-red-600">{selectedPublication.likes}</div>
                        <div className="text-sm text-gray-600">Likes</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-xl font-bold text-primary">{selectedPublication.comments}</div>
                        <div className="text-sm text-gray-600">Commentaires</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions du modal */}
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Fermer
                  </button>
                  {selectedPublication.status === 'publie' && (
                    <button
                      onClick={() => handleViewInMediatheque(selectedPublication.id)}
                      className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 flex items-center"
                    >
                      <FiExternalLink className="h-4 w-4 mr-2" />
                      Voir dans la médiathèque
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MediathequePublications;