import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface ReponseNotification {
  id: number;
  notificationId: number;
  expediteur: 'etudiant' | 'encadrant';
  contenu: string;
  date: string;
}

interface Tache {
  id: number;
  titre: string;
  description: string;
  statut: 'À faire' | 'En cours' | 'Terminé' | 'En retard';
  dateEcheance: string;
  dateCreation: string;
  priorite: 'Basse' | 'Moyenne' | 'Haute';
  progression: number;
}

interface Message {
  id: number;
  expediteur: 'etudiant' | 'encadrant';
  contenu: string;
  date: string;
  lu: boolean;
}

interface Dossier {
  id: number;
  titre: string;
  statut: 'Brouillon' | 'Soumis' | 'En révision' | 'Validé' | 'Rejeté';
  dateDepot?: string;
  commentaires?: string;
  version: number;
}

const PanelEncadrement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showTacheModal, setShowTacheModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<number | null>(null);
  const [reponseNotification, setReponseNotification] = useState<{ [key: number]: string }>({});

  // Données mockées - côté étudiant
  const encadrant: Encadrant = {
    id: 1,
    nom: 'Ndiaye',
    prenom: 'Abdoulaye',
    email: 'abdoulaye.ndiaye@isi.edu.sn',
    specialite: 'Réseaux et Télécommunications',
    bureau: 'Bureau 308, Bâtiment A',
    telephone: '+221 33 123 45 67'
  };

  const etudiant = {
    nom: 'Diallo',
    prenom: 'Moussa',
    niveau: 'Master',
    sujet: 'Système de recommandation IA pour e-commerce',
    progressionGlobale: 65
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
          expediteur: 'etudiant',
          contenu: 'Parfait, je serai présent. J\'ai quelques questions sur l\'algorithme de clustering.',
          date: '2024-07-04 11:15'
        }
      ]
    },
    {
      id: 2,
      titre: 'Feedback sur votre chapitre 1',
      message: 'J\'ai relu votre introduction. Quelques corrections à apporter. Voir le document annoté.',
      type: 'Feedback',
      date: '2024-07-03 16:45',
      lu: false,
      urgent: false,
      reponses: []
    },
    {
      id: 3,
      titre: 'Pré-soutenance approche',
      message: 'N\'oubliez pas de préparer votre présentation pour la pré-soutenance du 20 juillet.',
      type: 'Pré-soutenance',
      date: '2024-07-02 09:15',
      lu: true,
      urgent: true,
      lieu: 'Salle de conférence A, Bâtiment principal',
      dateRendezVous: '2024-07-20',
      heureRendezVous: '10:00',
      reponses: [
        {
          id: 2,
          notificationId: 3,
          expediteur: 'etudiant',
          contenu: 'Merci pour le rappel. Combien de temps dois-je prévoir pour la présentation ?',
          date: '2024-07-02 14:30'
        },
        {
          id: 3,
          notificationId: 3,
          expediteur: 'encadrant',
          contenu: 'Prévoyez 20 minutes de présentation + 10 minutes de questions.',
          date: '2024-07-02 15:45'
        }
      ]
    }
  ];

  const taches: Tache[] = [
    {
      id: 1,
      titre: 'Finaliser l\'état de l\'art',
      description: 'Compléter la revue de littérature avec au moins 15 références récentes (2020-2024)',
      statut: 'En cours',
      dateEcheance: '2024-07-10',
      dateCreation: '2024-06-15',
      priorite: 'Haute',
      progression: 70
    },
    {
      id: 2,
      titre: 'Implémenter le prototype',
      description: 'Développer la première version du système de recommandation',
      statut: 'À faire',
      dateEcheance: '2024-07-20',
      dateCreation: '2024-07-01',
      priorite: 'Moyenne',
      progression: 0
    },
    {
      id: 3,
      titre: 'Corriger l\'introduction',
      description: 'Appliquer les corrections suggérées par l\'encadrant',
      statut: 'En retard',
      dateEcheance: '2024-07-01',
      dateCreation: '2024-06-20',
      priorite: 'Haute',
      progression: 30
    }
  ];

  const messages: Message[] = [
    {
      id: 1,
      expediteur: 'encadrant',
      contenu: 'Bonjour Moussa, j\'ai relu votre chapitre. Globalement c\'est bien mais il faut revoir la partie sur les algorithmes de clustering.',
      date: '2024-07-04 09:30',
      lu: true
    },
    {
      id: 2,
      expediteur: 'etudiant',
      contenu: 'Merci professeur. Pourriez-vous me donner plus de détails sur les améliorations à apporter ?',
      date: '2024-07-04 10:15',
      lu: true
    },
    {
      id: 3,
      expediteur: 'encadrant',
      contenu: 'Bien sûr, voyons cela lors de notre réunion de demain. Préparez vos questions.',
      date: '2024-07-04 10:45',
      lu: false
    }
  ];

  const dossier: Dossier = {
    id: 1,
    titre: 'Mémoire de Master - Système de recommandation IA',
    statut: 'En révision',
    dateDepot: '2024-07-01',
    commentaires: 'Chapitre 1 validé. Chapitre 2 à revoir selon les annotations.',
    version: 3
  };

  const getInitials = (nom: string, prenom: string) => {
    return `${prenom[0]}${nom[0]}`.toUpperCase();
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'Terminé': return 'bg-green-100 text-green-800';
      case 'En retard': return 'bg-red-100 text-red-800';
      case 'À faire': return 'bg-gray-100 text-gray-800';
      case 'Validé': return 'bg-green-100 text-green-800';
      case 'En révision': return 'bg-yellow-100 text-yellow-800';
      case 'Rejeté': return 'bg-red-100 text-red-800';
      case 'Soumis': return 'bg-blue-100 text-blue-800';
      case 'Brouillon': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrioriteColor = (priorite: string) => {
    switch (priorite) {
      case 'Haute': return 'bg-red-100 text-red-800';
      case 'Moyenne': return 'bg-yellow-100 text-yellow-800';
      case 'Basse': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeNotificationColor = (type: string) => {
    switch (type) {
      case 'Meet': return 'bg-blue-100 text-blue-800';
      case 'Pré-soutenance': return 'bg-purple-100 text-purple-800';
      case 'Document': return 'bg-green-100 text-green-800';
      case 'Feedback': return 'bg-yellow-100 text-yellow-800';
      case 'Rappel': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleReponseNotification = (notificationId: number) => {
    const contenu = reponseNotification[notificationId];
    if (!contenu?.trim()) return;

    // Ici on enverrait la réponse à l'API
    console.log('Envoi de la réponse:', { notificationId, contenu });
    
    // Réinitialiser le champ de saisie
    setReponseNotification(prev => ({ ...prev, [notificationId]: '' }));
  };

  const tabs = [
    { id: 'dashboard', label: 'Tableau de bord' },
    { id: 'notifications', label: 'Notifications encadrant' },
    { id: 'taches', label: 'Espace de travail' },
    { id: 'dossier', label: 'Suivi de dossier' },
    { id: 'messagerie', label: 'Discussion' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel d'Encadrement</h1>
        <p className="text-gray-600">Interface de collaboration avec votre encadrant</p>
        <div className="mt-4 flex items-center space-x-4">
          <div className="w-12 h-12 bg-navy text-white rounded-full flex items-center justify-center font-semibold">
            {getInitials(encadrant.nom, encadrant.prenom)}
          </div>
          <div>
            <p className="font-semibold text-gray-900">Encadrant: Prof. {encadrant.prenom} {encadrant.nom}</p>
            <p className="text-gray-600 text-sm">{encadrant.specialite}</p>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors relative ${
                  activeTab === tab.id
                    ? 'border-navy text-navy'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {tab.id === 'notifications' && notifications.filter(n => !n.lu).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.filter(n => !n.lu).length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenu des onglets */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* Tableau de bord */}
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Résumé du projet */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Mon projet de mémoire</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Informations générales</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Niveau:</span> {etudiant.niveau}</p>
                        <p><span className="font-medium">Sujet:</span> {etudiant.sujet}</p>
                        <p><span className="font-medium">Encadrant:</span> Prof. {encadrant.prenom} {encadrant.nom}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Progression globale</h4>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Avancement</span>
                        <span>{etudiant.progressionGlobale}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-navy h-3 rounded-full transition-all duration-300"
                          style={{ width: `${etudiant.progressionGlobale}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistiques rapides */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-600">Tâches actives</h4>
                    <p className="text-2xl font-bold text-blue-600 mt-1">
                      {taches.filter(t => t.statut === 'En cours' || t.statut === 'À faire').length}
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-600">Tâches terminées</h4>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                      {taches.filter(t => t.statut === 'Terminé').length}
                    </p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-600">En retard</h4>
                    <p className="text-2xl font-bold text-red-600 mt-1">
                      {taches.filter(t => t.statut === 'En retard').length}
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-600">Messages non lus</h4>
                    <p className="text-2xl font-bold text-yellow-600 mt-1">
                      {messages.filter(m => !m.lu && m.expediteur === 'encadrant').length}
                    </p>
                  </div>
                </div>

                {/* Dernières notifications */}
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Dernières notifications</h3>
                  <div className="space-y-3">
                    {notifications.slice(0, 3).map(notification => (
                      <div key={notification.id} className={`p-4 rounded-lg border ${notification.lu ? 'bg-gray-50' : 'bg-white'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{notification.titre}</h4>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${getTypeNotificationColor(notification.type)}`}>
                              {notification.type}
                            </span>
                            {notification.urgent && (
                              <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                                Urgent
                              </span>
                            )}
                            {!notification.lu && (
                              <div className="w-2 h-2 bg-navy rounded-full"></div>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">{notification.message}</p>
                        <p className="text-gray-400 text-xs mt-2">{notification.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Notifications de votre encadrant</h3>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    Marquer tout comme lu
                  </button>
                </div>

                <div className="space-y-6">
                  {notifications.map(notification => (
                    <div key={notification.id} className={`border rounded-lg p-6 ${notification.lu ? 'bg-gray-50' : 'bg-white shadow-sm'}`}>
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-semibold text-gray-900 text-lg">{notification.titre}</h4>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${getTypeNotificationColor(notification.type)}`}>
                            {notification.type}
                          </span>
                          {notification.urgent && (
                            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                              Urgent
                            </span>
                          )}
                          {!notification.lu && (
                            <div className="w-2 h-2 bg-navy rounded-full"></div>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4">{notification.message}</p>
                      
                      {/* Informations de rendez-vous */}
                      {(notification.dateRendezVous || notification.lieu || notification.lienMeet) && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                          <h5 className="font-medium text-blue-900 mb-2">Détails du rendez-vous</h5>
                          <div className="space-y-2 text-sm">
                            {notification.dateRendezVous && (
                              <p className="text-blue-800">
                                <span className="font-medium">Date:</span> {notification.dateRendezVous}
                                {notification.heureRendezVous && ` à ${notification.heureRendezVous}`}
                              </p>
                            )}
                            {notification.lieu && (
                              <p className="text-blue-800">
                                <span className="font-medium">Lieu:</span> {notification.lieu}
                              </p>
                            )}
                            {notification.lienMeet && (
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-blue-800">Lien Meet:</span>
                                <a 
                                  href={notification.lienMeet} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 underline"
                                >
                                  Rejoindre la réunion
                                </a>
                                <button 
                                  onClick={() => navigator.clipboard.writeText(notification.lienMeet || '')}
                                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200"
                                >
                                  Copier
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Historique des réponses */}
                      {notification.reponses && notification.reponses.length > 0 && (
                        <div className="mb-4">
                          <h5 className="font-medium text-gray-900 mb-3">Échanges</h5>
                          <div className="space-y-3 max-h-40 overflow-y-auto bg-gray-50 rounded-lg p-3">
                            {notification.reponses.map(reponse => (
                              <div key={reponse.id} className={`flex ${reponse.expediteur === 'etudiant' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                                  reponse.expediteur === 'etudiant' 
                                    ? 'bg-navy text-white' 
                                    : 'bg-white text-gray-900 border'
                                }`}>
                                  <p>{reponse.contenu}</p>
                                  <p className={`text-xs mt-1 ${
                                    reponse.expediteur === 'etudiant' 
                                      ? 'text-navy-light' 
                                      : 'text-gray-500'
                                  }`}>
                                    {reponse.expediteur === 'etudiant' ? 'Vous' : 'Encadrant'} • {reponse.date}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Zone de réponse */}
                      <div className="border-t pt-4">
                        <div className="flex space-x-3">
                          <input 
                            type="text"
                            placeholder="Tapez votre réponse..."
                            value={reponseNotification[notification.id] || ''}
                            onChange={(e) => setReponseNotification(prev => ({
                              ...prev,
                              [notification.id]: e.target.value
                            }))}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleReponseNotification(notification.id);
                              }
                            }}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy"
                          />
                          <button 
                            onClick={() => handleReponseNotification(notification.id)}
                            disabled={!reponseNotification[notification.id]?.trim()}
                            className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy-dark disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                          >
                            Répondre
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-4 pt-3 border-t text-sm text-gray-500">
                        <span>{notification.date}</span>
                        <div className="space-x-3">
                          {!notification.lu && (
                            <button className="text-navy hover:text-navy-dark">
                              Marquer comme lu
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Espace de travail (Tâches) */}
            {activeTab === 'taches' && (
              <motion.div
                key="taches"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Mon espace de travail</h3>
                  <button 
                    onClick={() => setShowTacheModal(true)}
                    className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy-dark transition-colors"
                  >
                    Mettre à jour progression
                  </button>
                </div>

                <div className="space-y-4">
                  {taches.map(tache => (
                    <div key={tache.id} className="bg-white border rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">{tache.titre}</h4>
                          <p className="text-gray-600 text-sm mb-3">{tache.description}</p>
                          
                          <div className="mb-3">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>Progression</span>
                              <span>{tache.progression}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-navy h-2 rounded-full transition-all duration-300"
                                style={{ width: `${tache.progression}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2 ml-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatutColor(tache.statut)}`}>
                            {tache.statut}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getPrioriteColor(tache.priorite)}`}>
                            {tache.priorite}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>Échéance: {tache.dateEcheance}</span>
                        <button className="text-navy hover:text-navy-dark">
                          Modifier progression
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Suivi de dossier */}
            {activeTab === 'dossier' && (
              <motion.div
                key="dossier"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-lg font-semibold text-gray-900">Suivi de mon dossier</h3>

                <div className="bg-white border rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">{dossier.titre}</h4>
                      <p className="text-gray-600 text-sm">Version {dossier.version}</p>
                    </div>
                    <span className={`px-3 py-1 text-sm rounded-full ${getStatutColor(dossier.statut)}`}>
                      {dossier.statut}
                    </span>
                  </div>

                  {dossier.dateDepot && (
                    <p className="text-gray-600 text-sm mb-3">
                      <span className="font-medium">Date de dépôt:</span> {dossier.dateDepot}
                    </p>
                  )}

                  {dossier.commentaires && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                      <h5 className="font-medium text-yellow-800 mb-2">Commentaires de l'encadrant</h5>
                      <p className="text-yellow-700 text-sm">{dossier.commentaires}</p>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <button className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy-dark">
                      Télécharger version actuelle
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                      Déposer nouvelle version
                    </button>
                  </div>
                </div>

                {/* Historique des versions */}
                <div className="bg-white border rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Historique des versions</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Version 3 (Actuelle)</p>
                        <p className="text-gray-600 text-sm">Déposée le 2024-07-01</p>
                      </div>
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                        En révision
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Version 2</p>
                        <p className="text-gray-600 text-sm">Déposée le 2024-06-15</p>
                      </div>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        Validé partiellement
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Version 1</p>
                        <p className="text-gray-600 text-sm">Déposée le 2024-06-01</p>
                      </div>
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                        Rejeté
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Messagerie */}
            {activeTab === 'messagerie' && (
              <motion.div
                key="messagerie"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Discussion avec votre encadrant</h3>
                  <button 
                    onClick={() => setShowMessageModal(true)}
                    className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy-dark"
                  >
                    Nouveau message
                  </button>
                </div>

                <div className="bg-white border rounded-lg p-6 h-96 flex flex-col">
                  <div className="flex-1 space-y-4 overflow-y-auto mb-4">
                    {messages.map(message => (
                      <div key={message.id} className={`flex ${message.expediteur === 'etudiant' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.expediteur === 'etudiant' 
                            ? 'bg-navy text-white' 
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.contenu}</p>
                          <p className={`text-xs mt-1 ${
                            message.expediteur === 'etudiant' 
                              ? 'text-navy-light' 
                              : 'text-gray-500'
                          }`}>
                            {message.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex space-x-3">
                      <input 
                        type="text"
                        placeholder="Tapez votre message..."
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-navy"
                      />
                      <button className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy-dark">
                        Envoyer
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal nouveau message */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg p-6 max-w-lg w-full"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Nouveau message</h3>
              <button 
                onClick={() => setShowMessageModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destinataire</label>
                <input 
                  type="text" 
                  value={`Prof. ${encadrant.prenom} ${encadrant.nom}`}
                  disabled
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Objet</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-navy"
                  placeholder="Objet du message"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-navy h-32"
                  placeholder="Votre message..."
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowMessageModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy-dark"
                >
                  Envoyer
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Modal mise à jour tâche */}
      {showTacheModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg p-6 max-w-lg w-full"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Mettre à jour la progression</h3>
              <button 
                onClick={() => setShowTacheModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tâche</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-navy">
                  <option value="">Sélectionner une tâche</option>
                  {taches.map(tache => (
                    <option key={tache.id} value={tache.id}>
                      {tache.titre}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nouvelle progression (%)</label>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="0"
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-navy">
                  <option>À faire</option>
                  <option>En cours</option>
                  <option>Terminé</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Commentaire (optionnel)</label>
                <textarea 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-navy h-20"
                  placeholder="Commentaire sur l'avancement..."
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowTacheModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy-dark"
                >
                  Mettre à jour
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PanelEncadrement;