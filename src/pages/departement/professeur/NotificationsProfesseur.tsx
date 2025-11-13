import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  User, 
  Users, 
  Download, 
  Filter, 
  Eye,
  BarChart3,
  FileText,
  School,
  Mail,
  Calendar,
  BookOpen,
  CheckCircle,
  Clock,
  AlertCircle,
  GraduationCap,
  MessageSquare,
  Bell,
  BellRing,
  MessageCircle,
  Reply,
  Archive,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Send,
  X,
  Star,
  Bookmark
} from 'lucide-react';

// Types et interfaces
interface Professeur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  grade: string;
  specialite: string;
  department: string;
  institution: string;
  statut: 'actif' | 'inactif';
  estSecretaire?: boolean;
  dernierConnexion?: string;
}

interface Etudiant {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  niveau: string;
  specialite: string;
  department: string;
  classe: string;
  sessionChoisie: 'septembre' | 'decembre' | 'speciale';
  statut: 'actif' | 'inactif';
}

interface Notification {
  id: number;
  expediteur: {
    id: number;
    nom: string;
    prenom: string;
    type: 'chef' | 'professeur' | 'secretaire' | 'etudiant';
  };
  destinataires: {
    type: 'professeurs' | 'etudiants' | 'individuel';
    ids?: number[];
    filtres?: {
      niveau?: string[];
      classe?: string[];
      session?: string[];
    };
  };
  objet: string;
  contenu: string;
  type: 'info' | 'urgent' | 'soutenance' | 'convocation' | 'rappel';
  dateEnvoi: string;
  statut: 'envoye' | 'lu' | 'archive';
  pieceJointe?: {
    nom: string;
    url: string;
    taille: string;
  };
  important?: boolean;
  favori?: boolean;
}

interface Message {
  id: number;
  expediteur: {
    id: number;
    nom: string;
    prenom: string;
    type: 'chef' | 'professeur' | 'secretaire' | 'etudiant';
  };
  destinataire: {
    id: number;
    nom: string;
    prenom: string;
    type: 'chef' | 'professeur' | 'secretaire' | 'etudiant';
  };
  objet: string;
  contenu: string;
  dateEnvoi: string;
  lu: boolean;
  reponseA?: number;
  conversation: number;
}

interface Conversation {
  id: number;
  participants: {
    id: number;
    nom: string;
    prenom: string;
    type: 'chef' | 'professeur' | 'secretaire' | 'etudiant';
  }[];
  dernierMessage: Message;
  nombreNonLus: number;
}

// Données fictives - notifications reçues par le professeur
const NOTIFICATIONS_RECUES: Notification[] = [
  {
    id: 1,
    expediteur: {
      id: 1,
      nom: "Diop",
      prenom: "Dr. Amadou",
      type: "chef"
    },
    destinataires: {
      type: "professeurs"
    },
    objet: "Réunion du département - Planning des soutenances",
    contenu: "Chers collègues,\n\nJe vous convie à une réunion du département qui se tiendra le vendredi 25 janvier 2025 à 14h en salle de conférence.\n\nOrdre du jour :\n- Planning des soutenances de fin d'année\n- Attribution des jurys\n- Questions diverses\n\nMerci de confirmer votre présence.\n\nCordialement,\nDr. Amadou Diop",
    type: "convocation",
    dateEnvoi: "2025-01-20T10:30:00",
    statut: "envoye",
    important: true
  },
  {
    id: 2,
    expediteur: {
      id: 3,
      nom: "Ndiaye",
      prenom: "Mme Fatou",
      type: "secretaire"
    },
    destinataires: {
      type: "professeurs"
    },
    objet: "Rappel : Remise des notes de cours",
    contenu: "Bonjour chers professeurs,\n\nJe vous rappelle que la date limite pour la remise des notes de cours est fixée au 30 janvier 2025.\n\nMerci de bien vouloir déposer vos documents sur la plateforme ou les remettre directement au secrétariat.\n\nCordialement,\nMme Fatou Ndiaye\nSecrétaire du département",
    type: "rappel",
    dateEnvoi: "2025-01-19T14:15:00",
    statut: "lu"
  },
  {
    id: 3,
    expediteur: {
      id: 1,
      nom: "Diop",
      prenom: "Dr. Amadou",
      type: "chef"
    },
    destinataires: {
      type: "professeurs"
    },
    objet: "Information : Nouvelle procédure d'évaluation",
    contenu: "Chers collègues,\n\nSuite aux dernières directives ministérielles, nous devons mettre en place une nouvelle procédure d'évaluation des étudiants.\n\nUne formation sera organisée le 28 janvier 2025 de 9h à 12h.\n\nDétails en pièce jointe.\n\nCordialement,\nDr. Amadou Diop",
    type: "info",
    dateEnvoi: "2025-01-18T16:45:00",
    statut: "envoye",
    pieceJointe: {
      nom: "nouvelle_procedure_evaluation.pdf",
      url: "#",
      taille: "245 KB"
    }
  },
  {
    id: 4,
    expediteur: {
      id: 1,
      nom: "Diop",
      prenom: "Dr. Amadou",
      type: "chef"
    },
    destinataires: {
      type: "professeurs"
    },
    objet: "URGENT : Modification planning des examens",
    contenu: "Chers collègues,\n\nEn raison d'un imprévu, nous devons modifier le planning des examens de la semaine prochaine.\n\nLes examens prévus mardi 23 janvier sont reportés au jeudi 25 janvier.\n\nMerci d'informer vos étudiants rapidement.\n\nDésolé pour ce changement de dernière minute.\n\nCordialement,\nDr. Amadou Diop",
    type: "urgent",
    dateEnvoi: "2025-01-20T08:30:00",
    statut: "envoye",
    important: true,
    favori: true
  }
];

// Données fictives des conversations
const CONVERSATIONS_PROFESSEUR: Conversation[] = [
  {
    id: 1,
    participants: [
      { id: 2, nom: "Fall", prenom: "Dr. Ousmane", type: "professeur" }, // Moi
      { id: 1, nom: "Diop", prenom: "Dr. Amadou", type: "chef" }
    ],
    dernierMessage: {
      id: 1,
      expediteur: { id: 1, nom: "Diop", prenom: "Dr. Amadou", type: "chef" },
      destinataire: { id: 2, nom: "Fall", prenom: "Dr. Ousmane", type: "professeur" },
      objet: "Planning des jurys",
      contenu: "Bonjour Ousmane, j'ai préparé la répartition des jurys pour les soutenances. Pouvez-vous me confirmer votre disponibilité pour le 15 février ?",
      dateEnvoi: "2025-01-20T14:30:00",
      lu: false,
      conversation: 1
    },
    nombreNonLus: 1
  },
  {
    id: 2,
    participants: [
      { id: 2, nom: "Fall", prenom: "Dr. Ousmane", type: "professeur" }, // Moi
      { id: 3, nom: "Ndiaye", prenom: "Mme Fatou", type: "secretaire" }
    ],
    dernierMessage: {
      id: 2,
      expediteur: { id: 2, nom: "Fall", prenom: "Dr. Ousmane", type: "professeur" },
      destinataire: { id: 3, nom: "Ndiaye", prenom: "Mme Fatou", type: "secretaire" },
      objet: "Demande de salle",
      contenu: "Bonjour Madame Ndiaye, pourrais-je réserver la salle informatique 3 pour mes TPs du jeudi matin ?",
      dateEnvoi: "2025-01-19T11:45:00",
      lu: true,
      conversation: 2
    },
    nombreNonLus: 0
  },
  {
    id: 3,
    participants: [
      { id: 2, nom: "Fall", prenom: "Dr. Ousmane", type: "professeur" }, // Moi
      { id: 1, nom: "Diallo", prenom: "Amadou", type: "etudiant" }
    ],
    dernierMessage: {
      id: 3,
      expediteur: { id: 1, nom: "Diallo", prenom: "Amadou", type: "etudiant" },
      destinataire: { id: 2, nom: "Fall", prenom: "Dr. Ousmane", type: "professeur" },
      objet: "Question sur le projet",
      contenu: "Bonjour Professeur, j'ai une question concernant la partie algorithmes de notre projet de fin d'études. Pourriez-vous me recevoir cette semaine ?",
      dateEnvoi: "2025-01-18T16:20:00",
      lu: false,
      conversation: 3
    },
    nombreNonLus: 1
  }
];

// Utilisateur actuel (professeur)
const CURRENT_USER = {
  id: 2,
  nom: "Fall",
  prenom: "Dr. Ousmane",
  type: "professeur" as const
};

// Composants UI réutilisables
const SimpleButton: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'warning' | 'danger';
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}> = ({ children, variant = 'primary', onClick, disabled = false, type = 'button', icon, size = 'md' }) => {
  const styles = {
    primary: `bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    secondary: `bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    ghost: `bg-transparent text-gray-600 border border-transparent hover:bg-gray-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    success: `bg-green-600 text-white border border-green-600 hover:bg-green-700 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    warning: `bg-orange-600 text-white border border-orange-600 hover:bg-orange-700 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    danger: `bg-red-600 text-white border border-red-600 hover:bg-red-700 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      type={type}
      className={`${sizes[size]} font-medium transition-colors duration-200 flex items-center rounded-sm ${styles[variant]}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

const TabButton: React.FC<{
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  badge?: number;
}> = ({ children, isActive, onClick, icon, badge }) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200
        ${isActive 
          ? 'border-blue-600 text-blue-600' 
          : 'border-transparent text-gray-500 hover:text-gray-700'
        }
      `}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
      {badge && badge > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  );
};

const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'info' | 'urgent' | 'soutenance' | 'convocation' | 'rappel' | 'success' | 'warning' | 'primary';
  className?: string;
}> = ({ children, variant = 'info', className = '' }) => {
  const styles = {
    info: "bg-blue-50 text-blue-700 border border-blue-200",
    urgent: "bg-red-50 text-red-700 border border-red-200",
    soutenance: "bg-purple-50 text-purple-700 border border-purple-200",
    convocation: "bg-orange-50 text-orange-700 border border-orange-200",
    rappel: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    success: "bg-green-50 text-green-700 border border-green-200",
    warning: "bg-orange-50 text-orange-700 border border-orange-200",
    primary: "bg-blue-50 text-blue-700 border border-blue-200"
  };
  
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-sm ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Modal pour voir les détails d'une notification
const NotificationDetailsModal: React.FC<{
  notification: Notification | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  onArchive: (id: number) => void;
}> = ({ notification, isOpen, onClose, onMarkAsRead, onToggleFavorite, onArchive }) => {
  if (!isOpen || !notification) return null;

  const handleMarkAsRead = () => {
    if (notification.statut !== 'lu') {
      onMarkAsRead(notification.id);
    }
  };

  const handleToggleFavorite = () => {
    onToggleFavorite(notification.id);
  };

  const handleArchive = () => {
    onArchive(notification.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border border-gray-200 p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onAnimationComplete={handleMarkAsRead}
      >
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={notification.type}>{notification.type}</Badge>
              {notification.important && (
                <Badge variant="urgent">Important</Badge>
              )}
              {notification.favori && (
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
              )}
              {notification.statut === 'lu' && (
                <CheckCircle className="h-4 w-4 text-green-500" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{notification.objet}</h2>
            <div className="text-sm text-gray-500">
              <p>De : {notification.expediteur.prenom} {notification.expediteur.nom}</p>
              <p>Date : {new Date(notification.dateEnvoi).toLocaleDateString('fr-FR')} à {new Date(notification.dateEnvoi).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleFavorite}
              className={`p-2 transition-colors ${notification.favori ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
              title={notification.favori ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
              <Star className={`h-5 w-5 ${notification.favori ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleArchive}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Archiver"
            >
              <Archive className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-sm">
            <div className="whitespace-pre-wrap text-gray-900 leading-relaxed">
              {notification.contenu}
            </div>
          </div>

          {notification.pieceJointe && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-sm">
              <h4 className="font-medium text-blue-900 mb-2">Pièce jointe</h4>
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-blue-900">{notification.pieceJointe.nom}</p>
                  <p className="text-xs text-blue-700">{notification.pieceJointe.taille}</p>
                </div>
                <SimpleButton
                  variant="primary"
                  size="sm"
                  icon={<Download className="h-4 w-4" />}
                  onClick={() => window.open(notification.pieceJointe?.url, '_blank')}
                >
                  Télécharger
                </SimpleButton>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
          <SimpleButton variant="secondary" onClick={onClose}>
            Fermer
          </SimpleButton>
        </div>
      </motion.div>
    </div>
  );
};

// Onglet Notifications
const NotificationsTab: React.FC<{
  notifications: Notification[];
  onViewNotification: (notification: Notification) => void;
  onMarkAsRead: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  onArchive: (id: number) => void;
}> = ({ notifications, onViewNotification, onMarkAsRead, onToggleFavorite, onArchive }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'non_lu' | 'lu' | 'archive' | 'favoris'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'info' | 'urgent' | 'soutenance' | 'convocation' | 'rappel'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = 
      notification.objet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.contenu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${notification.expediteur.prenom} ${notification.expediteur.nom}`.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'non_lu' && notification.statut === 'envoye') ||
      (statusFilter === 'lu' && notification.statut === 'lu') ||
      (statusFilter === 'archive' && notification.statut === 'archive') ||
      (statusFilter === 'favoris' && notification.favori);
    
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const notificationsNonLues = notifications.filter(n => n.statut === 'envoye').length;
  const notificationsUrgentes = notifications.filter(n => n.type === 'urgent' && n.statut === 'envoye').length;
  const notificationsFavorites = notifications.filter(n => n.favori).length;

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: "Non lues", value: notificationsNonLues, icon: Bell, color: "bg-blue-100 text-blue-600" },
          { title: "Urgentes", value: notificationsUrgentes, icon: AlertCircle, color: "bg-red-100 text-red-600" },
          { title: "Favorites", value: notificationsFavorites, icon: Star, color: "bg-yellow-100 text-yellow-600" },
          { title: "Total", value: notifications.length, icon: FileText, color: "bg-gray-100 text-gray-600" }
        ].map((stat, index) => (
          <div key={stat.title} className="bg-white border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 mr-4 rounded-sm`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions et filtres */}
      <div className="bg-white border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
          <div className="relative w-full md:w-1/2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher une notification..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <SimpleButton
              variant="ghost"
              onClick={() => setShowFilters(!showFilters)}
              icon={<Filter className="h-5 w-5" />}
            >
              {showFilters ? 'Masquer' : 'Filtres'}
            </SimpleButton>
            <SimpleButton variant="ghost" icon={<RefreshCw className="h-4 w-4" />}>
              Actualiser
            </SimpleButton>
          </div>
        </div>
        
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                >
                  <option value="all">Toutes</option>
                  <option value="non_lu">Non lues</option>
                  <option value="lu">Lues</option>
                  <option value="favoris">Favorites</option>
                  <option value="archive">Archivées</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                >
                  <option value="all">Tous les types</option>
                  <option value="info">Information</option>
                  <option value="urgent">Urgent</option>
                  <option value="soutenance">Soutenance</option>
                  <option value="convocation">Convocation</option>
                  <option value="rappel">Rappel</option>
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Résultats */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''} trouvée{filteredNotifications.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      {/* Liste des notifications */}
      {filteredNotifications.length === 0 ? (
        <div className="bg-white border border-gray-200 p-12 text-center">
          <Bell className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Aucune notification trouvée</h2>
          <p className="text-gray-500">Modifiez vos critères de recherche</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white border-l-4 border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-all duration-200 ${
                notification.statut === 'envoye' ? 'border-l-blue-500 bg-blue-50 bg-opacity-30' : 
                notification.important ? 'border-l-red-500' :
                notification.favori ? 'border-l-yellow-500' : 'border-l-gray-300'
              }`}
              onClick={() => onViewNotification(notification)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={notification.type}>{notification.type}</Badge>
                    {notification.important && (
                      <Badge variant="urgent">Important</Badge>
                    )}
                    {notification.favori && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    )}
                    {notification.statut === 'envoye' && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        Nouveau
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{notification.objet}</h3>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {notification.contenu}
                  </p>
                  
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>{notification.expediteur.prenom} {notification.expediteur.nom}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {new Date(notification.dateEnvoi).toLocaleDateString('fr-FR')} à {new Date(notification.dateEnvoi).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {notification.pieceJointe && (
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        <span>Pièce jointe</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(notification.id);
                    }}
                    className={`p-2 transition-colors ${notification.favori ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                    title={notification.favori ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  >
                    <Star className={`h-4 w-4 ${notification.favori ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onArchive(notification.id);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Archiver"
                  >
                    <Archive className="h-4 w-4" />
                  </button>
                  <div className="text-gray-400">
                    <Eye className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// Onglet Messagerie
const MessagerieTab: React.FC<{
  conversations: Conversation[];
}> = ({ conversations }) => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [newMessageData, setNewMessageData] = useState({
    destinataire: '',
    objet: '',
    contenu: ''
  });
  const [messageText, setMessageText] = useState('');

  const handleSendMessage = () => {
    if (!newMessageData.destinataire || !newMessageData.objet.trim() || !newMessageData.contenu.trim()) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    alert('Message envoyé avec succès !');
    setNewMessageData({ destinataire: '', objet: '', contenu: '' });
    setShowNewMessage(false);
  };

  const handleSendReply = () => {
    if (!messageText.trim()) {
      alert('Veuillez saisir un message');
      return;
    }

    alert('Réponse envoyée avec succès !');
    setMessageText('');
  };

  // Contacts disponibles (chef, secrétaire, autres professeurs)
  const contactsDisponibles = [
    { id: 1, nom: "Diop", prenom: "Dr. Amadou", type: "chef" as const },
    { id: 3, nom: "Ndiaye", prenom: "Mme Fatou", type: "secretaire" as const },
    { id: 4, nom: "Sarr", prenom: "Dr. Mamadou", type: "professeur" as const }
  ];

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="bg-white border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Actions</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          <SimpleButton 
            variant="primary" 
            icon={<MessageSquare className="h-4 w-4" />}
            onClick={() => setShowNewMessage(true)}
          >
            Nouveau message
          </SimpleButton>
          <SimpleButton variant="ghost" icon={<RefreshCw className="h-4 w-4" />}>
            Actualiser
          </SimpleButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversations</h3>
            
            {conversations.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">Aucune conversation</h3>
                <p className="text-gray-500 mb-4">Commencez une nouvelle conversation</p>
                <SimpleButton
                  variant="primary"
                  onClick={() => setShowNewMessage(true)}
                  icon={<MessageSquare className="h-4 w-4" />}
                >
                  Nouveau message
                </SimpleButton>
              </div>
            ) : (
              <div className="space-y-3">
                {conversations.map((conversation, index) => {
                  const autreParticipant = conversation.participants.find(p => p.id !== CURRENT_USER.id);
                  return (
                    <motion.div
                      key={conversation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`border border-gray-200 p-4 cursor-pointer transition-colors hover:bg-gray-50 rounded-sm ${
                        selectedConversation?.id === conversation.id ? 'bg-blue-50 border-blue-300' : ''
                      }`}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className={`${
                            autreParticipant?.type === 'chef' ? 'bg-purple-600' :
                            autreParticipant?.type === 'secretaire' ? 'bg-green-600' :
                            autreParticipant?.type === 'etudiant' ? 'bg-blue-600' : 'bg-gray-600'
                          } text-white rounded-full w-8 h-8 flex items-center justify-center mr-3`}>
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {autreParticipant?.prenom} {autreParticipant?.nom}
                            </p>
                            <p className="text-sm text-gray-600 capitalize">{autreParticipant?.type}</p>
                          </div>
                        </div>
                        {conversation.nombreNonLus > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {conversation.nombreNonLus}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {conversation.dernierMessage.contenu}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(conversation.dernierMessage.dateEnvoi).toLocaleDateString('fr-FR')} à {new Date(conversation.dernierMessage.dateEnvoi).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedConversation ? (
            <div className="bg-white border border-gray-200 h-96 flex flex-col">
              <div className="border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`${
                      selectedConversation.participants.find(p => p.id !== CURRENT_USER.id)?.type === 'chef' ? 'bg-purple-600' :
                      selectedConversation.participants.find(p => p.id !== CURRENT_USER.id)?.type === 'secretaire' ? 'bg-green-600' :
                      selectedConversation.participants.find(p => p.id !== CURRENT_USER.id)?.type === 'etudiant' ? 'bg-blue-600' : 'bg-gray-600'
                    } text-white rounded-full w-10 h-10 flex items-center justify-center mr-3`}>
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {selectedConversation.participants.find(p => p.id !== CURRENT_USER.id)?.prenom} {selectedConversation.participants.find(p => p.id !== CURRENT_USER.id)?.nom}
                      </p>
                      <p className="text-sm text-gray-600 capitalize">
                        {selectedConversation.participants.find(p => p.id !== CURRENT_USER.id)?.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  <div className={`flex ${selectedConversation.dernierMessage.expediteur.id === CURRENT_USER.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      selectedConversation.dernierMessage.expediteur.id === CURRENT_USER.id 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm font-medium mb-1">{selectedConversation.dernierMessage.objet}</p>
                      <p className="text-sm">{selectedConversation.dernierMessage.contenu}</p>
                      <p className={`text-xs mt-1 ${selectedConversation.dernierMessage.expediteur.id === CURRENT_USER.id ? 'text-blue-200' : 'text-gray-500'}`}>
                        {new Date(selectedConversation.dernierMessage.dateEnvoi).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Tapez votre réponse..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                  <SimpleButton 
                    variant="primary" 
                    icon={<Send className="h-4 w-4" />}
                    onClick={handleSendReply}
                  >
                    Envoyer
                  </SimpleButton>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 h-96 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">Sélectionnez une conversation</h3>
                <p className="text-gray-500">Choisissez une conversation pour voir les messages</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal nouveau message */}
      <AnimatePresence>
        {showNewMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-gray-200 p-6 max-w-2xl w-full mx-4"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Nouveau message</h2>
                  <p className="text-sm text-gray-500">Envoyez un message privé</p>
                </div>
                <button
                  onClick={() => setShowNewMessage(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Destinataire *</label>
                  <select
                    value={newMessageData.destinataire}
                    onChange={(e) => setNewMessageData(prev => ({ ...prev, destinataire: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="">Sélectionner un destinataire</option>
                    {contactsDisponibles.map(contact => (
                      <option key={contact.id} value={`${contact.type}-${contact.id}`}>
                        {contact.prenom} {contact.nom} - {contact.type === 'chef' ? 'Chef de département' : contact.type === 'secretaire' ? 'Secrétaire' : 'Professeur'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Objet *</label>
                  <input
                    type="text"
                    value={newMessageData.objet}
                    onChange={(e) => setNewMessageData(prev => ({ ...prev, objet: e.target.value }))}
                    placeholder="Objet du message..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                  <textarea
                    value={newMessageData.contenu}
                    onChange={(e) => setNewMessageData(prev => ({ ...prev, contenu: e.target.value }))}
                    placeholder="Rédigez votre message..."
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-gray-200">
                <SimpleButton variant="secondary" onClick={() => setShowNewMessage(false)}>
                  Annuler
                </SimpleButton>
                <SimpleButton 
                  variant="primary" 
                  onClick={handleSendMessage}
                  icon={<Send className="h-4 w-4" />}
                >
                  Envoyer
                </SimpleButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Composant principal
const NotificationsProfesseur: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'notifications' | 'messagerie'>('notifications');
  const [notificationsState, setNotificationsState] = useState(NOTIFICATIONS_RECUES);
  const [conversationsState, setConversationsState] = useState(CONVERSATIONS_PROFESSEUR);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewNotification = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);
  };

  const handleMarkAsRead = (id: number) => {
    setNotificationsState(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, statut: 'lu' as const }
          : notification
      )
    );
  };

  const handleToggleFavorite = (id: number) => {
    setNotificationsState(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, favori: !notification.favori }
          : notification
      )
    );
  };

  const handleArchive = (id: number) => {
    setNotificationsState(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, statut: 'archive' as const }
          : notification
      )
    );
  };

  const closeModal = () => {
    setSelectedNotification(null);
    setIsModalOpen(false);
  };

  // Calcul des badges pour les onglets
  const notificationsNonLues = notificationsState.filter(n => n.statut === 'envoye').length;
  const nombreNonLusMessagerie = conversationsState.reduce((total, conv) => total + conv.nombreNonLus, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-3 mr-4">
                <Bell className="h-7 w-7 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notifications & Messages</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Consultez vos notifications et échangez des messages
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{CURRENT_USER.prenom} {CURRENT_USER.nom}</p>
              <p className="text-xs text-gray-500">Professeur - Département Informatique</p>
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div className="bg-white border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <TabButton
                isActive={activeTab === 'notifications'}
                onClick={() => setActiveTab('notifications')}
                icon={<Bell className="h-4 w-4" />}
                badge={notificationsNonLues}
              >
                Notifications
              </TabButton>
              <TabButton
                isActive={activeTab === 'messagerie'}
                onClick={() => setActiveTab('messagerie')}
                icon={<MessageCircle className="h-4 w-4" />}
                badge={nombreNonLusMessagerie}
              >
                Messagerie
              </TabButton>
            </nav>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'notifications' && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <NotificationsTab 
                    notifications={notificationsState}
                    onViewNotification={handleViewNotification}
                    onMarkAsRead={handleMarkAsRead}
                    onToggleFavorite={handleToggleFavorite}
                    onArchive={handleArchive}
                  />
                </motion.div>
              )}

              {activeTab === 'messagerie' && (
                <motion.div
                  key="messagerie"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <MessagerieTab conversations={conversationsState} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Modal des détails de notification */}
        <NotificationDetailsModal 
          notification={selectedNotification}
          isOpen={isModalOpen}
          onClose={closeModal}
          onMarkAsRead={handleMarkAsRead}
          onToggleFavorite={handleToggleFavorite}
          onArchive={handleArchive}
        />
      </div>
    </div>
  );
};

// Styles CSS additionnels
const additionalStyles = `
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

// Injection des styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = additionalStyles;
  document.head.appendChild(styleElement);
}

export default NotificationsProfesseur;