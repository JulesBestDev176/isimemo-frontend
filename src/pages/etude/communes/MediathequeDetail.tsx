import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft,
  FiHeart,
  FiMessageSquare,
  FiSend,
  FiDownload,
  FiShare2,
  FiEye,
  FiCalendar,
  FiUser,
  FiTag,
  FiExternalLink,
  FiBookmark
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

interface Reply {
  id: number;
  author: string;
  text: string;
  date: string;
}

interface Comment {
  id: number;
  author: string;
  text: string;
  date: string;
  replies: Reply[];
}

interface MediaDocument {
  id: number;
  title: string;
  description: string;
  content: string;
  author: string;
  uploadDate: string;
  category: string;
  tags: string[];
  likes: number;
  views: number;
  fileSize: string;
  format: string;
  isLiked: boolean;
  isSaved: boolean;
  downloadUrl: string;
  comments: Comment[];
  isImportant?: boolean;
  niveau?: 'licence' | 'master' | 'autres' | 'all';
}

const MediathequeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [document, setDocument] = useState<MediaDocument | null>(null);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  // Simuler le chargement du document
  useEffect(() => {
    const loadDocument = () => {
      // Simulation des données - en réalité, cela viendrait d'une API
      const mockDocument: MediaDocument = {
        id: parseInt(id || '1'),
        title: 'Guide méthodologique pour la rédaction de mémoires académiques',
        description: 'Un guide complet qui accompagne les étudiants dans toutes les étapes de la rédaction de leur mémoire de fin d\'études, de la problématisation à la soutenance.',
        content: `Guide Méthodologique - Rédaction de Mémoires

Introduction

Ce guide a été conçu pour accompagner les étudiants de l'Institut Supérieur d'Informatique dans la rédaction de leur mémoire de fin d'études. Il couvre toutes les étapes essentielles du processus de recherche et de rédaction.

1. Choix du sujet

1.1 Critères de sélection
- Pertinence par rapport à la spécialisation
- Faisabilité dans les délais impartis
- Disponibilité des ressources nécessaires
- Intérêt personnel et professionnel

1.2 Validation du sujet
Le sujet doit être validé par votre directeur de mémoire avant de commencer les recherches approfondies.

2. Recherche documentaire

2.1 Sources recommandées
- Bases de données académiques (IEEE, ACM, Google Scholar)
- Bibliothèque universitaire
- Revues spécialisées
- Thèses et mémoires précédents

2.2 Gestion des références
Utilisez un logiciel de gestion bibliographique comme Zotero ou Mendeley pour organiser vos sources.

3. Structure du mémoire

3.1 Plan type
1. Introduction générale (10-15 pages)
   - Contexte et problématique
   - Objectifs de recherche
   - Méthodologie
   - Plan du mémoire

2. État de l'art (20-30 pages)
   - Revue de littérature
   - Analyse critique des travaux existants
   - Positionnement de votre recherche

3. Méthodologie (15-20 pages)
   - Approche adoptée
   - Outils et techniques utilisés
   - Protocole expérimental

4. Résultats et analyses (25-35 pages)
   - Présentation des résultats
   - Analyse et interprétation
   - Discussion

5. Conclusion générale (8-12 pages)
   - Synthèse des contributions
   - Limites et perspectives
   - Recommandations

4. Normes de rédaction

4.1 Format
- Police : Times New Roman 12pt
- Interligne : 1,5
- Marges : 2,5 cm de chaque côté
- Numérotation des pages

4.2 Citations et références
Respectez les normes APA ou IEEE selon votre domaine d'études.

5. Préparation de la soutenance

5.1 Présentation orale
- Durée : 20-25 minutes
- Support : PowerPoint recommandé
- Structure claire et concise

5.2 Questions du jury
Préparez-vous aux questions sur :
- La méthodologie utilisée
- Les résultats obtenus
- Les perspectives d'amélioration
- L'applicabilité pratique

Conclusion

La rédaction d'un mémoire est un exercice exigeant mais formateur. Suivez ce guide, respectez les échéances et n'hésitez pas à solliciter l'aide de votre encadrant.

Bonne rédaction !`,
        author: 'Dr. Aminata Diop',
        uploadDate: '2025-01-15',
        category: 'Méthodologie',
        tags: ['mémoire', 'rédaction', 'méthodologie', 'recherche', 'académique'],
        likes: 156,
        views: 2341,
        fileSize: '2.8 MB',
        format: 'PDF',
        isLiked: false,
        isSaved: true,
        downloadUrl: '#',
        isImportant: true,
        niveau: 'all',
        comments: [
          {
            id: 1,
            author: 'Fatou Ndiaye',
            text: 'Excellent guide ! Très complet et bien structuré. Cela m\'a beaucoup aidée pour organiser mon travail.',
            date: '2025-01-20',
            replies: [
              {
                id: 11,
                author: 'Dr. Aminata Diop',
                text: 'Merci Fatou ! N\'hésitez pas si vous avez des questions spécifiques.',
                date: '2025-01-21'
              }
            ]
          },
          {
            id: 2,
            author: 'Moussa Kane',
            text: 'Merci Dr. Diop pour ce document. La partie sur la recherche documentaire est particulièrement utile.',
            date: '2025-01-22',
            replies: []
          },
          {
            id: 3,
            author: 'Aïssatou Seck',
            text: 'Quelqu\'un pourrait-il partager des exemples de mémoires qui suivent cette structure ?',
            date: '2025-01-25',
            replies: [
              {
                id: 31,
                author: 'Moussa Kane',
                text: 'Je peux te partager quelques exemples par email. Contacte-moi !',
                date: '2025-01-26'
              }
            ]
          }
        ]
      };

      setDocument(mockDocument);
      setLoading(false);
    };

    // Simuler un délai de chargement
    setTimeout(loadDocument, 800);
  }, [id]);

  const handleLike = () => {
    if (!document) return;
    
    setDocument(prev => {
      if (!prev) return null;
      return {
        ...prev,
        isLiked: !prev.isLiked,
        likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1
      };
    });
  };

  const handleSave = () => {
    if (!document) return;
    
    setDocument(prev => {
      if (!prev) return null;
      return {
        ...prev,
        isSaved: !prev.isSaved
      };
    });
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !document) return;

    const comment: Comment = {
      id: Date.now(),
      author: user?.name || 'Étudiant',
      text: newComment.trim(),
      date: new Date().toLocaleDateString('fr-FR'),
      replies: []
    };

    setDocument(prev => {
      if (!prev) return null;
      return {
        ...prev,
        comments: [...prev.comments, comment]
      };
    });

    setNewComment('');
  };

  const handleAddReply = (commentId: number) => {
    if (!replyText.trim() || !document) return;

    const reply: Reply = {
      id: Date.now(),
      author: user?.name || 'Étudiant',
      text: replyText.trim(),
      date: new Date().toLocaleDateString('fr-FR')
    };

    setDocument(prev => {
      if (!prev) return null;
      return {
        ...prev,
        comments: prev.comments.map(comment => 
          comment.id === commentId 
            ? { ...comment, replies: [...comment.replies, reply] }
            : comment
        )
      };
    });

    setReplyText('');
    setReplyingTo(null);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: document?.title,
        text: document?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papiers!');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Document non trouvé</h2>
        <p className="text-gray-600 mb-4">Le document que vous recherchez n'existe pas ou a été supprimé.</p>
        <button
          onClick={() => navigate('/mediatheque')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Retour à la médiathèque
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* En-tête */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/mediatheque')}
          className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
        >
          <FiArrowLeft className="h-5 w-5 mr-1" />
          Retour
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">{document.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contenu principal */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-sm border p-6 mb-6"
          >
            {/* Informations du document */}
            <div className="border-b border-gray-100 pb-4 mb-6">
              {document.isImportant && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4">
                  <div className="flex items-center">
                    <FiBookmark className="h-5 w-5 mr-2" />
                    <span className="font-medium">Document important</span>
                  </div>
                </div>
              )}

              <p className="text-gray-700 text-lg mb-4">{document.description}</p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <FiUser className="h-4 w-4 mr-1" />
                  <span>{document.author}</span>
                </div>
                <div className="flex items-center">
                  <FiCalendar className="h-4 w-4 mr-1" />
                  <span>{new Date(document.uploadDate).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex items-center">
                  <FiTag className="h-4 w-4 mr-1" />
                  <span>{document.category}</span>
                </div>
                <div className="flex items-center">
                  <FiEye className="h-4 w-4 mr-1" />
                  <span>{document.views.toLocaleString()} vues</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {document.tags.map(tag => (
                  <span key={tag} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Contenu du document */}
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {document.content}
              </div>
            </div>
          </motion.div>

          {/* Section des commentaires */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FiMessageSquare className="h-5 w-5 mr-2" />
              Commentaires ({document.comments.length})
            </h3>

            {/* Nouveau commentaire */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Ajouter un commentaire..."
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={3}
              />
              <div className="flex justify-end mt-3">
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                    newComment.trim()
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <FiSend className="h-4 w-4 mr-2" />
                  Publier
                </button>
              </div>
            </div>

            {/* Liste des commentaires */}
            <div className="space-y-6">
              {document.comments.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Aucun commentaire pour le moment. Soyez le premier à commenter !
                </p>
              ) : (
                document.comments.map(comment => (
                  <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-0">
                    {/* Commentaire principal */}
                    <div className="flex items-start mb-4">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <FiUser className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <span className="font-medium text-blue-600">{comment.author}</span>
                          <span className="text-xs text-gray-500 ml-2">{comment.date}</span>
                        </div>
                        <p className="text-gray-700 mb-2">{comment.text}</p>
                        <button
                          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                          className="text-sm text-blue-500 hover:text-blue-600 flex items-center"
                        >
                          <FiMessageSquare className="h-3 w-3 mr-1" />
                          Répondre
                        </button>
                      </div>
                    </div>

                    {/* Réponses */}
                    {comment.replies.length > 0 && (
                      <div className="ml-11 space-y-3 mb-4">
                        {comment.replies.map(reply => (
                          <div key={reply.id} className="flex items-start">
                            <div className="w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                              <FiUser className="h-3 w-3" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center mb-1">
                                <span className="font-medium text-gray-600 text-sm">{reply.author}</span>
                                <span className="text-xs text-gray-500 ml-2">{reply.date}</span>
                              </div>
                              <p className="text-gray-700 text-sm">{reply.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Formulaire de réponse */}
                    {replyingTo === comment.id && (
                      <div className="ml-11 mt-3">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={`Répondre à ${comment.author}...`}
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                            rows={2}
                          />
                          <div className="flex justify-end space-x-2 mt-2">
                            <button
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyText('');
                              }}
                              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                            >
                              Annuler
                            </button>
                            <button
                              onClick={() => handleAddReply(comment.id)}
                              disabled={!replyText.trim()}
                              className={`flex items-center px-3 py-1 text-sm rounded-md transition-colors ${
                                replyText.trim()
                                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              <FiSend className="h-3 w-3 mr-1" />
                              Répondre
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-sm border p-4 mb-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions</h3>
            
            <div className="space-y-3">
              <button
                onClick={handleLike}
                className={`w-full flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                  document.isLiked
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FiHeart className={`h-4 w-4 mr-2 ${document.isLiked ? 'fill-current' : ''}`} />
                {document.isLiked ? 'Aimé' : 'Aimer'} ({document.likes})
              </button>

              <button
                onClick={handleSave}
                className={`w-full flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                  document.isSaved
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FiBookmark className={`h-4 w-4 mr-2 ${document.isSaved ? 'fill-current' : ''}`} />
                {document.isSaved ? 'Sauvegardé' : 'Sauvegarder'}
              </button>

              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <FiShare2 className="h-4 w-4 mr-2" />
                Partager
              </button>

              <a
                href={document.downloadUrl}
                className="w-full flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <FiDownload className="h-4 w-4 mr-2" />
                Télécharger
              </a>
            </div>
          </motion.div>

          {/* Informations du fichier */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border p-4"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Format :</span>
                <span className="font-medium">{document.format}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taille :</span>
                <span className="font-medium">{document.fileSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Vues :</span>
                <span className="font-medium">{document.views.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Likes :</span>
                <span className="font-medium">{document.likes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Commentaires :</span>
                <span className="font-medium">{document.comments.length}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MediathequeDetail;