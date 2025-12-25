import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Filter,
  Video,
  MapPin,
  FileText,
  Download,
  Check,
  Plus
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { dossierService, DossierMemoire } from '../../services/dossier.service';
import CreateDossierModal from '../../components/dossier/CreateDossierModal';

interface Encadrant {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  specialite: string;
  bureau: string;
  telephone: string;
  photo?: string;
}

interface Notification {
  id: number;
  titre: string;
  message: string;
  type: 'Meet' | 'Pré-soutenance' | 'Document' | 'Feedback' | 'Rappel';
  date: string;
  lu: boolean;
  urgent: boolean;
  lienMeet?: string;
  lieu?: string;
  dateRendezVous?: string;
  heureRendezVous?: string;
  reponses?: ReponseNotification[];
}

interface Message {
  id: number;
  expediteur: 'encadrant';
  type: 'texte' | 'reunion-meet' | 'presentiel' | 'document';
  contenu: string;
  date: string;
  lu: boolean;
  titre?: string;
  lienMeet?: string;
  lieu?: string;
  dateRendezVous?: string;
  heureRendezVous?: string;
  nomDocument?: string;
  cheminDocument?: string;
  tailleDocument?: string;
}

interface MessageDiscussion {
  id: number;
  type: 'notification' | 'message';
  expediteur: 'encadrant';
  contenu: string;
  titre?: string;
  date: string;
  lu: boolean;
  notificationType?: 'Meet' | 'Pré-soutenance' | 'Document' | 'Feedback' | 'Rappel';
  urgent?: boolean;
  lienMeet?: string;
  lieu?: string;
  dateRendezVous?: string;
  heureRendezVous?: string;
  messageType?: 'texte' | 'reunion-meet' | 'presentiel' | 'document';
  nomDocument?: string;
  cheminDocument?: string;
  tailleDocument?: string;
}

interface ReponseNotification {
  id: number;
  notificationId: number;
  expediteur: 'candidat' | 'encadrant';
  contenu: string;
  date: string;
}

const Panel: React.FC = () => {
  const { user } = useAuth();
  const [filtreMessage, setFiltreMessage] = useState<'tous' | 'texte' | 'reunion-meet' | 'presentiel' | 'document'>('tous');
  const [lienCopie, setLienCopie] = useState<number | null>(null);
  const [dossier, setDossier] = useState<DossierMemoire | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Charger les données du dossier
  React.useEffect(() => {
    const fetchDossierData = async () => {
      if (user?.id) {
        try {
          const userDossier = await dossierService.getDossierCandidat(user.id);
          setDossier(userDossier);
        } catch (error) {
          console.error("Erreur chargement dossier:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchDossierData();
  }, [user]);

  // Données de l'encadrant (fallback sur mock)
  const encadrant: Encadrant = {
    id: 1,
    nom: 'Ndiaye',
    prenom: 'Abdoulaye',
    email: 'abdoulaye.ndiaye@isi.edu.sn',
    specialite: 'Génie Logiciel',
    bureau: 'Bureau 308, Bâtiment A',
    telephone: '+221 33 123 45 67'
  };

  const candidat = {
    nom: user?.nom || 'Candidat',
    prenom: user?.prenom || '',
    sujet: dossier?.titre || 'Aucun dossier actif',
    progressionGlobale: dossier?.progression || 0
  };

  const notifications: Notification[] = [
    {
      id: 1,
      titre: 'Réunion de suivi programmée',
      message: 'RDV fixé pour le 8 juillet à 14h en visio. Préparez vos questions sur le chapitre 2.',
      type: 'Meet',
      date: '2024-07-04 10:30',
      lu: false,
      urgent: false,
      lienMeet: 'https://meet.google.com/abc-defg-hij',
      dateRendezVous: '2024-07-08',
      heureRendezVous: '14:00',
      reponses: [
        {
          id: 1,
          notificationId: 1,
          expediteur: 'candidat',
          contenu: 'Parfait, je serai présent. J\'ai quelques questions sur l\'algorithme de clustering.',
          date: '2024-07-04 11:15'
        }
      ]
    }
  ];

  const messages: Message[] = [
    {
      id: 1,
      expediteur: 'encadrant',
      type: 'texte',
      contenu: 'Bonjour, j\'ai relu votre chapitre. Globalement c\'est bien mais il faut revoir la partie sur les algorithmes.',
      date: '2024-07-04 09:30',
      lu: true,
      titre: 'Feedback sur le chapitre 2'
    }
  ];

  const getInitials = (nom: string, prenom?: string) => {
    if (prenom) {
      return `${prenom[0]}${nom[0]}`.toUpperCase();
    }
    return nom.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getTypeNotificationColor = (type: string) => {
    switch (type) {
      case 'Meet': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Pré-soutenance': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Document': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Feedback': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Rappel': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const getTypeMessageColor = (type: string) => {
    switch (type) {
      case 'texte': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'reunion-meet': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'presentiel': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'document': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const getTypeMessageIcon = (type: string) => {
    switch (type) {
      case 'texte': return <MessageSquare className="h-4 w-4" />;
      case 'reunion-meet': return <Video className="h-4 w-4" />;
      case 'presentiel': return <MapPin className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  // Fonction pour copier le lien
  const copierLien = async (lien: string, itemId: number) => {
    try {
      await navigator.clipboard.writeText(lien);
      setLienCopie(itemId);
      setTimeout(() => {
        setLienCopie(null);
      }, 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
      const textArea = document.createElement('textarea');
      textArea.value = lien;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setLienCopie(itemId);
        setTimeout(() => {
          setLienCopie(null);
        }, 2000);
      } catch (fallbackErr) {
        console.error('Erreur lors de la copie (fallback):', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };


  // Combiner notifications et messages en une seule file de discussion
  const fileDiscussion: MessageDiscussion[] = [
    ...notifications.map(notif => ({
      id: notif.id,
      type: 'notification' as const,
      expediteur: 'encadrant' as const,
      contenu: notif.message,
      titre: notif.titre,
      date: notif.date,
      lu: notif.lu,
      notificationType: notif.type,
      urgent: notif.urgent,
      lienMeet: notif.lienMeet,
      lieu: notif.lieu,
      dateRendezVous: notif.dateRendezVous,
      heureRendezVous: notif.heureRendezVous,
    })),
    ...messages.map(msg => ({
      id: msg.id + 1000,
      type: 'message' as const,
      expediteur: 'encadrant' as const,
      contenu: msg.contenu,
      titre: msg.titre,
      date: msg.date,
      lu: msg.lu,
      messageType: msg.type,
      lienMeet: msg.lienMeet,
      lieu: msg.lieu,
      dateRendezVous: msg.dateRendezVous,
      heureRendezVous: msg.heureRendezVous,
      nomDocument: msg.nomDocument,
      cheminDocument: msg.cheminDocument,
      tailleDocument: msg.tailleDocument,
    }))
  ].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <motion.div
      key="panel"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Résumé du projet / État vide */}
      {!dossier ? (
        <div className="bg-white border border-gray-200 p-12 text-center">
          <div className="bg-gray-50 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <FileText className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Pas de dossier actif</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            Vous n'avez pas encore de dossier de mémoire pour l'année académique en cours.
            Commencez par créer votre dossier en saisissant un titre provisoire.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Créer mon dossier de mémoire</span>
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mon projet de mémoire</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Informations générales</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Sujet:</span> {candidat.sujet}</p>
                {dossier.encadrantId && (
                  <p><span className="font-medium">Encadrant:</span> Prof. {encadrant.prenom} {encadrant.nom}</p>
                )}
                {!dossier.encadrantId && (
                  <p className="text-amber-600 italic">Encadrant non encore désigné</p>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Progression globale</h4>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Avancement</span>
                <span>{candidat.progressionGlobale}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-primary h-3 rounded-full transition-all duration-300"
                  style={{ width: `${candidat.progressionGlobale}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <CreateDossierModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        userId={user?.id || ''}
        onSuccess={(newDossier) => setDossier(newDossier)}
      />

      {/* File de discussion unifiée */}
      <div className="bg-white border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Discussion avec votre encadrant</h3>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                value={filtreMessage}
                onChange={(e) => setFiltreMessage(e.target.value as any)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="tous">Tous les messages</option>
                <option value="texte">Texte</option>
                <option value="reunion-meet">Réunion Meet</option>
                <option value="presentiel">Présentiel</option>
                <option value="document">Document</option>
              </select>
            </div>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm">
              Marquer tout comme lu
            </button>
          </div>
        </div>

        <div className="space-y-4 max-h-[700px] overflow-y-auto">
          {fileDiscussion.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>Aucun message</p>
            </div>
          ) : (
            fileDiscussion.map(item => {
              if (item.type === 'message' && filtreMessage !== 'tous') {
                if (item.messageType !== filtreMessage) return null;
              }
              if (item.type === 'notification' && filtreMessage !== 'tous') {
                return null;
              }

              return (
                <div key={item.id} className="flex items-start justify-start">
                  <div className="max-w-[70%] p-4 border border-gray-200 bg-gray-100 text-gray-900">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        Prof. {encadrant.prenom} {encadrant.nom}
                      </span>
                      <span className="text-xs text-gray-500">{item.date}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      {item.type === 'notification' && item.notificationType && (
                        <span className={`px-2 py-1 text-xs rounded-full border flex items-center gap-1 ${getTypeNotificationColor(item.notificationType)}`}>
                          {item.notificationType === 'Meet' && <Video className="h-3 w-3" />}
                          {item.notificationType === 'Pré-soutenance' && <MapPin className="h-3 w-3" />}
                          {item.notificationType === 'Document' && <FileText className="h-3 w-3" />}
                          {item.notificationType}
                        </span>
                      )}
                      {item.type === 'message' && item.messageType && (
                        <span className={`px-2 py-1 text-xs rounded-full border flex items-center gap-1 ${getTypeMessageColor(item.messageType)}`}>
                          {item.messageType === 'reunion-meet' && <Video className="h-3 w-3" />}
                          {item.messageType === 'presentiel' && <MapPin className="h-3 w-3" />}
                          {item.messageType === 'document' && <FileText className="h-3 w-3" />}
                          {item.messageType === 'texte' && <MessageSquare className="h-3 w-3" />}
                          {item.messageType === 'reunion-meet' ? 'Réunion Meet' :
                            item.messageType === 'presentiel' ? 'Présentiel' :
                              item.messageType === 'document' ? 'Document PDF' : 'Texte'}
                        </span>
                      )}
                      {item.urgent && (
                        <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
                          Urgent
                        </span>
                      )}
                      {!item.lu && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>

                    {item.titre && (
                      <h4 className="font-semibold text-gray-900 mb-2">{item.titre}</h4>
                    )}
                    <p className="text-sm mb-3">{item.contenu}</p>

                    {item.lienMeet && (
                      <div className={`${item.lu ? 'bg-white' : 'bg-white/90'} border border-gray-200 p-3 mt-3 rounded`}>
                        <div className="flex items-center space-x-2 mb-2">
                          <Video className="h-4 w-4 text-primary" />
                          <h5 className="font-medium text-gray-900 text-sm">Détails de la réunion</h5>
                        </div>
                        <div className="space-y-2 text-xs">
                          {item.dateRendezVous && (
                            <p className="text-gray-700">
                              <span className="font-medium">Date:</span> {item.dateRendezVous}
                              {item.heureRendezVous && ` à ${item.heureRendezVous}`}
                            </p>
                          )}
                          <div className="pt-2 border-t border-gray-200">
                            <p className="font-medium mb-2 text-gray-900">Lien de la réunion:</p>
                            <div className="flex items-center space-x-2 flex-wrap">
                              <a
                                href={item.lienMeet}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary-700 underline break-all flex-1 min-w-0"
                              >
                                {item.lienMeet}
                              </a>
                              <button
                                onClick={() => copierLien(item.lienMeet || '', item.id)}
                                className={`px-2 py-1 text-xs rounded flex-shrink-0 transition-colors flex items-center space-x-1 ${lienCopie === item.id
                                    ? 'bg-green-600 text-white'
                                    : 'bg-primary text-white hover:bg-primary-700'
                                  }`}
                                title="Copier le lien"
                              >
                                {lienCopie === item.id ? (
                                  <>
                                    <Check className="h-3 w-3" />
                                    <span>Copié!</span>
                                  </>
                                ) : (
                                  <span>Copier</span>
                                )}
                              </button>
                            </div>
                            <a
                              href={item.lienMeet}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-2 mt-2 px-3 py-2 bg-primary text-white rounded hover:bg-primary-700 transition-colors text-sm font-medium"
                            >
                              <Video className="h-4 w-4" />
                              <span>Rejoindre la réunion</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    {item.lieu && !item.lienMeet && (
                      <div className={`${item.lu ? 'bg-white' : 'bg-white/90'} border border-gray-200 p-3 mt-3 rounded`}>
                        <div className="flex items-center space-x-2 mb-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <h5 className="font-medium text-gray-900 text-sm">Détails du rendez-vous</h5>
                        </div>
                        <div className="space-y-1 text-xs text-gray-700">
                          {item.dateRendezVous && (
                            <p>
                              <span className="font-medium">Date:</span> {item.dateRendezVous}
                              {item.heureRendezVous && ` à ${item.heureRendezVous}`}
                            </p>
                          )}
                          <p>
                            <span className="font-medium">Lieu:</span> {item.lieu}
                          </p>
                        </div>
                      </div>
                    )}

                    {item.nomDocument && (
                      <div className={`${item.lu ? 'bg-white' : 'bg-white/90'} border border-gray-200 p-3 mt-3 rounded`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                              <FileText className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900 text-sm">{item.nomDocument}</h5>
                              {item.tailleDocument && (
                                <p className="text-xs text-gray-600">{item.tailleDocument}</p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => window.open(item.cheminDocument, '_blank')}
                            className="px-2 py-1.5 bg-primary text-white rounded hover:bg-primary-700 transition-colors flex items-center space-x-2 text-xs"
                          >
                            <Download className="h-3 w-3" />
                            <span>Télécharger</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Panel;

