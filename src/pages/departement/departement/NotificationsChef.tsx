import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  User, 
  Users, 
  UserPlus, 
  Download, 
  Upload, 
  Filter, 
  Edit, 
  Check, 
  X,
  Eye,
  BarChart3,
  FileText,
  School,
  Mail,
  Calendar,
  Phone,
  MapPin,
  BookOpen,
  Award,
  CheckCircle,
  Gavel,
  UserCheck,
  Clock,
  Star,
  AlertCircle,
  Shuffle,
  Plus,
  GraduationCap,
  CalendarDays,
  MapPinIcon,
  Timer,
  Building,
  Send,
  MessageSquare,
  Bell,
  BellRing,
  MessageCircle,
  Reply,
  Trash2,
  Archive,
  MoreHorizontal,
  Paperclip,
  Image,
  Smile,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from 'lucide-react';

// Mock du contexte d'authentification
const useAuth = () => ({
  user: {
    id: '1',
    name: 'Dr. Amadou Diop',
    email: 'chef.informatique@isimemo.edu.sn',
    department: 'Informatique',
    estChef: true,
    estSecretaire: false,
    type: 'chef',
  }
});

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
  niveau: string; // "Licence 3", "Master 1", "Master 2"
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
  reponseA?: number; // ID du message auquel on répond
  conversation: number; // ID de la conversation
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

// Données fictives des professeurs
const PROFESSEURS_DATA: Professeur[] = [
  {
    id: 1,
    nom: "Diop",
    prenom: "Dr. Ahmed",
    email: "ahmed.diop@isi.edu.sn",
    grade: "Professeur Titulaire",
    specialite: "Informatique",
    department: "Informatique",
    institution: "ISI",
    statut: "actif",
    dernierConnexion: "2025-01-20"
  },
  {
    id: 2,
    nom: "Fall",
    prenom: "Dr. Ousmane",
    email: "ousmane.fall@isi.edu.sn",
    grade: "Professeur",
    specialite: "Informatique",
    department: "Informatique",
    institution: "ISI",
    statut: "actif",
    dernierConnexion: "2025-01-19"
  },
  {
    id: 3,
    nom: "Ndiaye",
    prenom: "Mme Fatou",
    email: "fatou.ndiaye@isi.edu.sn",
    grade: "Secrétaire",
    specialite: "Administration",
    department: "Informatique",
    institution: "ISI",
    statut: "actif",
    estSecretaire: true,
    dernierConnexion: "2025-01-20"
  },
  {
    id: 4,
    nom: "Sarr",
    prenom: "Dr. Mamadou",
    email: "mamadou.sarr@isi.edu.sn",
    grade: "Maître de Conférences",
    specialite: "Informatique",
    department: "Informatique",
    institution: "ISI",
    statut: "actif",
    dernierConnexion: "2025-01-18"
  }
];

// Données fictives des étudiants
const ETUDIANTS_DATA: Etudiant[] = [
  {
    id: 1,
    nom: "Diallo",
    prenom: "Amadou",
    email: "amadou.diallo@student.isi.edu.sn",
    niveau: "Master 2",
    specialite: "Informatique",
    department: "Informatique",
    classe: "Informatique - M2",
    sessionChoisie: "septembre",
    statut: "actif"
  },
  {
    id: 2,
    nom: "Ba",
    prenom: "Mariama",
    email: "mariama.ba@student.isi.edu.sn",
    niveau: "Master 2",
    specialite: "Informatique",
    department: "Informatique",
    classe: "Informatique - M2",
    sessionChoisie: "septembre",
    statut: "actif"
  },
  {
    id: 3,
    nom: "Kane",
    prenom: "Moussa",
    email: "moussa.kane@student.isi.edu.sn",
    niveau: "Master 1",
    specialite: "Informatique",
    department: "Informatique",
    classe: "Informatique - M1",
    sessionChoisie: "septembre",
    statut: "actif"
  },
  {
    id: 4,
    nom: "Sow",
    prenom: "Aissatou",
    email: "aissatou.sow@student.isi.edu.sn",
    niveau: "Licence 3",
    specialite: "Informatique",
    department: "Informatique",
    classe: "Informatique - L3",
    sessionChoisie: "septembre",
    statut: "actif"
  },
  {
    id: 5,
    nom: "Ndoye",
    prenom: "Ibrahima",
    email: "ibrahima.ndoye@student.isi.edu.sn",
    niveau: "Licence 3",
    specialite: "Informatique",
    department: "Informatique",
    classe: "Informatique - L3",
    sessionChoisie: "decembre",
    statut: "actif"
  }
];

// Données fictives des notifications
const NOTIFICATIONS_DATA: Notification[] = [
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
    statut: "envoye"
  },
  {
    id: 2,
    expediteur: {
      id: 1,
      nom: "Diop",
      prenom: "Dr. Amadou",
      type: "chef"
    },
    destinataires: {
      type: "etudiants",
      filtres: {
        niveau: ["Master 2"],
        session: ["septembre"]
      }
    },
    objet: "Calendrier des soutenances - Session Septembre 2025",
    contenu: "Chers étudiants de Master 2,\n\nLe planning des soutenances pour la session de septembre est maintenant disponible.\n\nDates importantes :\n- Dépôt définitif des mémoires : 31 janvier 2025\n- Soutenances : Du 15 au 20 février 2025\n- Délibérations : 21 février 2025\n\nConsultez le planning détaillé sur la plateforme.\n\nBonne préparation !",
    type: "soutenance",
    dateEnvoi: "2025-01-19T16:00:00",
    statut: "envoye"
  }
];

// Données fictives des conversations
const CONVERSATIONS_DATA: Conversation[] = [
  {
    id: 1,
    participants: [
      { id: 1, nom: "Diop", prenom: "Dr. Amadou", type: "chef" },
      { id: 2, nom: "Fall", prenom: "Dr. Ousmane", type: "professeur" }
    ],
    dernierMessage: {
      id: 1,
      expediteur: { id: 2, nom: "Fall", prenom: "Dr. Ousmane", type: "professeur" },
      destinataire: { id: 1, nom: "Diop", prenom: "Dr. Amadou", type: "chef" },
      objet: "Planning des jurys",
      contenu: "Bonjour Chef, j'ai reçu la liste des étudiants pour les jurys. Pouvons-nous discuter de la répartition ?",
      dateEnvoi: "2025-01-20T14:30:00",
      lu: false,
      conversation: 1
    },
    nombreNonLus: 1
  },
  {
    id: 2,
    participants: [
      { id: 1, nom: "Diop", prenom: "Dr. Amadou", type: "chef" },
      { id: 3, nom: "Ndiaye", prenom: "Mme Fatou", type: "secretaire" }
    ],
    dernierMessage: {
      id: 2,
      expediteur: { id: 1, nom: "Diop", prenom: "Dr. Amadou", type: "chef" },
      destinataire: { id: 3, nom: "Ndiaye", prenom: "Mme Fatou", type: "secretaire" },
      objet: "Préparation des convocations",
      contenu: "Madame Ndiaye, pouvez-vous préparer les convocations pour les soutenances ? Je vous envoie la liste.",
      dateEnvoi: "2025-01-20T11:15:00",
      lu: true,
      conversation: 2
    },
    nombreNonLus: 0
  }
];

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
    primary: `bg-navy text-white border border-navy hover:bg-navy-dark ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
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
      className={`${sizes[size]} font-medium transition-colors duration-200 flex items-center ${styles[variant]}`}
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
          ? 'border-navy text-navy' 
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
    primary: "bg-navy bg-opacity-10 text-navy border border-navy border-opacity-20"
  };
  
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Modal pour composer une notification
const ComposeNotificationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: any) => void;
  type: 'professeurs' | 'etudiants';
  professeurs: Professeur[];
  etudiants: Etudiant[];
}> = ({ isOpen, onClose, onSend, type, professeurs, etudiants }) => {
  const [formData, setFormData] = useState({
    objet: '',
    contenu: '',
    type: 'info' as const,
    destinataires: 'tous' as 'tous' | 'selection',
    selection: [] as number[],
    filtres: {
      niveau: [] as string[],
      classe: [] as string[],
      session: [] as string[]
    }
  });

  const handleSubmit = () => {
    if (!formData.objet.trim() || !formData.contenu.trim()) {
      alert('Veuillez remplir l\'objet et le contenu');
      return;
    }

    const notificationData = {
      objet: formData.objet,
      contenu: formData.contenu,
      type: formData.type,
      destinataires: {
        type: type,
        ...(formData.destinataires === 'selection' && { ids: formData.selection }),
        ...(type === 'etudiants' && { filtres: formData.filtres })
      }
    };

    onSend(notificationData);
    setFormData({
      objet: '',
      contenu: '',
      type: 'info',
      destinataires: 'tous',
      selection: [],
      filtres: { niveau: [], classe: [], session: [] }
    });
    onClose();
  };

  if (!isOpen) return null;

  const niveauxDisponibles = [...new Set(etudiants.map(e => e.niveau))];
  const classesDisponibles = [...new Set(etudiants.map(e => e.classe))];
  const sessionsDisponibles = [...new Set(etudiants.map(e => e.sessionChoisie))];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border border-gray-200 p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Nouvelle notification - {type === 'professeurs' ? 'Professeurs' : 'Étudiants'}
            </h2>
            <p className="text-sm text-gray-500">
              Envoyez une notification aux {type} du département
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type de notification</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
              >
                <option value="info">Information</option>
                <option value="urgent">Urgent</option>
                <option value="soutenance">Soutenance</option>
                <option value="convocation">Convocation</option>
                <option value="rappel">Rappel</option>
              </select>
            </div>

            {/* {type === 'professeurs' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destinataires</label>
                <select
                  value={formData.destinataires}
                  onChange={(e) => setFormData(prev => ({ ...prev, destinataires: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                >
                  <option value="tous">Tous les professeurs</option>
                </select>
              </div>
            )} */}

            {/* {type === 'etudiants' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destinataires</label>
                <select
                  value={formData.destinataires}
                  onChange={(e) => setFormData(prev => ({ ...prev, destinataires: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                >
                  <option value="tous">Tous les étudiants</option>
                </select>
              </div>
            )} */}
          </div>

          {type === 'etudiants' && (
            <div className="bg-blue-50 border border-blue-200 p-4">
              <h4 className="font-medium text-blue-900 mb-3">Filtres pour les étudiants</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-2">Niveaux</label>
                  <div className="space-y-1">
                    {niveauxDisponibles.map(niveau => (
                      <label key={niveau} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.filtres.niveau.includes(niveau)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({
                                ...prev,
                                filtres: { ...prev.filtres, niveau: [...prev.filtres.niveau, niveau] }
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                filtres: { ...prev.filtres, niveau: prev.filtres.niveau.filter(n => n !== niveau) }
                              }));
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm text-blue-800">{niveau}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-2">Classes</label>
                  <div className="space-y-1">
                    {classesDisponibles.map(classe => (
                      <label key={classe} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.filtres.classe.includes(classe)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({
                                ...prev,
                                filtres: { ...prev.filtres, classe: [...prev.filtres.classe, classe] }
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                filtres: { ...prev.filtres, classe: prev.filtres.classe.filter(c => c !== classe) }
                              }));
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm text-blue-800">{classe}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-2">Sessions</label>
                  <div className="space-y-1">
                    {sessionsDisponibles.map(session => (
                      <label key={session} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.filtres.session.includes(session)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({
                                ...prev,
                                filtres: { ...prev.filtres, session: [...prev.filtres.session, session] }
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                filtres: { ...prev.filtres, session: prev.filtres.session.filter(s => s !== session) }
                              }));
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm text-blue-800 capitalize">{session}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Objet *</label>
            <input
              type="text"
              value={formData.objet}
              onChange={(e) => setFormData(prev => ({ ...prev, objet: e.target.value }))}
              placeholder="Objet de la notification..."
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contenu *</label>
            <textarea
              value={formData.contenu}
              onChange={(e) => setFormData(prev => ({ ...prev, contenu: e.target.value }))}
              placeholder="Rédigez votre message..."
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
            />
          </div>

          <div className="bg-gray-50 border border-gray-200 p-4">
            <h4 className="font-medium text-gray-900 mb-2">Aperçu des destinataires</h4>
            <p className="text-sm text-gray-600">
              {type === 'professeurs' 
                ? `${professeurs.length} professeurs du département Informatique`
                : `${etudiants.filter(e => {
                    const niveauMatch = formData.filtres.niveau.length === 0 || formData.filtres.niveau.includes(e.niveau);
                    const classeMatch = formData.filtres.classe.length === 0 || formData.filtres.classe.includes(e.classe);
                    const sessionMatch = formData.filtres.session.length === 0 || formData.filtres.session.includes(e.sessionChoisie);
                    return niveauMatch && classeMatch && sessionMatch;
                  }).length} étudiants concernés`
              }
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
          <SimpleButton variant="secondary" onClick={onClose}>
            Annuler
          </SimpleButton>
          <SimpleButton 
            variant="primary" 
            onClick={handleSubmit}
            icon={<Send className="h-4 w-4" />}
          >
            Envoyer
          </SimpleButton>
        </div>
      </motion.div>
    </div>
  );
};

// Onglet Professeurs
const ProfesseursTab: React.FC<{
  professeurs: Professeur[];
  notifications: Notification[];
  onComposeNotification: () => void;
}> = ({ professeurs, notifications, onComposeNotification }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'actif' | 'inactif'>('all');

  const filteredProfesseurs = professeurs.filter(prof => {
    const matchesSearch = 
      prof.nom.toLowerCase().includes(searchQuery.toLowerCase()) || 
      prof.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prof.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || prof.statut === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const notificationsProfesseurs = notifications.filter(n => n.destinataires.type === 'professeurs');

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Actions</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          <SimpleButton 
            variant="primary" 
            icon={<Send className="h-4 w-4" />}
            onClick={onComposeNotification}
          >
            Nouvelle notification aux professeurs
          </SimpleButton>
          <SimpleButton variant="secondary" icon={<Download className="h-4 w-4" />}>
            Exporter la liste
          </SimpleButton>
          <SimpleButton variant="ghost" icon={<RefreshCw className="h-4 w-4" />}>
            Actualiser
          </SimpleButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Professeurs du département</h3>
            
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher un professeur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
              />
            </div>

            <div className="mb-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
              >
                <option value="all">Tous les statuts</option>
                <option value="actif">Actifs</option>
                <option value="inactif">Inactifs</option>
              </select>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredProfesseurs.map((professeur, index) => (
                <motion.div
                  key={professeur.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="bg-navy text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {professeur.prenom} {professeur.nom}
                        </p>
                        <p className="text-sm text-gray-600">{professeur.grade}</p>
                      </div>
                    </div>
                    {professeur.estSecretaire && (
                      <Badge variant="primary">Secrétaire</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 flex items-center mb-1">
                    <Mail className="h-3 w-3 mr-1" />
                    {professeur.email}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <School className="h-3 w-3 mr-1" />
                    {professeur.institution}
                  </p>
                  {professeur.dernierConnexion && (
                    <p className="text-xs text-gray-500 mt-2">
                      Dernière connexion : {new Date(professeur.dernierConnexion).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="mt-4 text-sm text-gray-500 text-center">
              {filteredProfesseurs.length} professeur(s) affiché(s)
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications envoyées aux professeurs</h3>
            
            {notificationsProfesseurs.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">Aucune notification envoyée</h3>
                <p className="text-gray-500 mb-4">Commencez par envoyer votre première notification aux professeurs</p>
                <SimpleButton
                  variant="primary"
                  onClick={onComposeNotification}
                  icon={<Send className="h-4 w-4" />}
                >
                  Envoyer une notification
                </SimpleButton>
              </div>
            ) : (
              <div className="space-y-4">
                {notificationsProfesseurs.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Badge variant={notification.type}>{notification.type}</Badge>
                        <span className="ml-2 text-sm text-gray-500">
                          {new Date(notification.dateEnvoi).toLocaleDateString('fr-FR')} à {new Date(notification.dateEnvoi).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <h4 className="font-medium text-gray-900 mb-2">{notification.objet}</h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                      {notification.contenu}
                    </p>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      Envoyé à tous les professeurs du département
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Onglet Étudiants
const EtudiantsTab: React.FC<{
  etudiants: Etudiant[];
  notifications: Notification[];
  onComposeNotification: () => void;
}> = ({ etudiants, notifications, onComposeNotification }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [niveauFilter, setNiveauFilter] = useState<string>('all');
  const [sessionFilter, setSessionFilter] = useState<string>('all');

  const filteredEtudiants = etudiants.filter(etudiant => {
    const matchesSearch = 
      etudiant.nom.toLowerCase().includes(searchQuery.toLowerCase()) || 
      etudiant.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      etudiant.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesNiveau = niveauFilter === 'all' || etudiant.niveau === niveauFilter;
    const matchesSession = sessionFilter === 'all' || etudiant.sessionChoisie === sessionFilter;
    
    return matchesSearch && matchesNiveau && matchesSession;
  });

  const notificationsEtudiants = notifications.filter(n => n.destinataires.type === 'etudiants');
  const niveauxDisponibles = [...new Set(etudiants.map(e => e.niveau))];

  // Statistiques des étudiants
  const statsEtudiants = {
    total: etudiants.length,
    parNiveau: niveauxDisponibles.map(niveau => ({
      niveau,
      count: etudiants.filter(e => e.niveau === niveau).length
    })),
    parSession: [
      { session: 'septembre', count: etudiants.filter(e => e.sessionChoisie === 'septembre').length },
      { session: 'decembre', count: etudiants.filter(e => e.sessionChoisie === 'decembre').length },
      { session: 'speciale', count: etudiants.filter(e => e.sessionChoisie === 'speciale').length }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Actions</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          <SimpleButton 
            variant="primary" 
            icon={<Send className="h-4 w-4" />}
            onClick={onComposeNotification}
          >
            Nouvelle notification aux étudiants
          </SimpleButton>
          <SimpleButton variant="secondary" icon={<Download className="h-4 w-4" />}>
            Exporter la liste
          </SimpleButton>
          <SimpleButton variant="ghost" icon={<RefreshCw className="h-4 w-4" />}>
            Actualiser
          </SimpleButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Étudiants", value: statsEtudiants.total, icon: Users, color: "bg-blue-100 text-blue-600" },
          { title: "Licence 3", value: statsEtudiants.parNiveau.find(n => n.niveau === 'Licence 3')?.count || 0, icon: GraduationCap, color: "bg-green-100 text-green-600" },
          { title: "Master 1", value: statsEtudiants.parNiveau.find(n => n.niveau === 'Master 1')?.count || 0, icon: GraduationCap, color: "bg-orange-100 text-orange-600" },
          { title: "Master 2", value: statsEtudiants.parNiveau.find(n => n.niveau === 'Master 2')?.count || 0, icon: GraduationCap, color: "bg-purple-100 text-purple-600" }
        ].map((stat, index) => (
          <div key={stat.title} className="bg-white border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 mr-4`}>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Étudiants du département</h3>
            
            <div className="space-y-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Rechercher un étudiant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                />
              </div>

              <select
                value={niveauFilter}
                onChange={(e) => setNiveauFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
              >
                <option value="all">Tous les niveaux</option>
                {niveauxDisponibles.map(niveau => (
                  <option key={niveau} value={niveau}>{niveau}</option>
                ))}
              </select>

              <select
                value={sessionFilter}
                onChange={(e) => setSessionFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
              >
                <option value="all">Toutes les sessions</option>
                <option value="septembre">Septembre</option>
                <option value="decembre">Décembre</option>
                <option value="speciale">Spéciale</option>
              </select>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredEtudiants.map((etudiant, index) => (
                <motion.div
                  key={etudiant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {etudiant.prenom} {etudiant.nom}
                        </p>
                        <p className="text-sm text-gray-600">{etudiant.niveau}</p>
                      </div>
                    </div>
                    <Badge variant="primary">{etudiant.sessionChoisie}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 flex items-center mb-1">
                    <Mail className="h-3 w-3 mr-1" />
                    {etudiant.email}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <BookOpen className="h-3 w-3 mr-1" />
                    {etudiant.classe}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 text-sm text-gray-500 text-center">
              {filteredEtudiants.length} étudiant(s) affiché(s)
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications envoyées aux étudiants</h3>
            
            {notificationsEtudiants.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">Aucune notification envoyée</h3>
                <p className="text-gray-500 mb-4">Commencez par envoyer votre première notification aux étudiants</p>
                <SimpleButton
                  variant="primary"
                  onClick={onComposeNotification}
                  icon={<Send className="h-4 w-4" />}
                >
                  Envoyer une notification
                </SimpleButton>
              </div>
            ) : (
              <div className="space-y-4">
                {notificationsEtudiants.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Badge variant={notification.type}>{notification.type}</Badge>
                        <span className="ml-2 text-sm text-gray-500">
                          {new Date(notification.dateEnvoi).toLocaleDateString('fr-FR')} à {new Date(notification.dateEnvoi).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <h4 className="font-medium text-gray-900 mb-2">{notification.objet}</h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                      {notification.contenu}
                    </p>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      {notification.destinataires.filtres 
                        ? `Envoyé aux étudiants ${notification.destinataires.filtres.niveau?.join(', ') || 'tous niveaux'}`
                        : 'Envoyé à tous les étudiants du département'
                      }
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Onglet Messagerie
const MessagerieTab: React.FC<{
  conversations: Conversation[];
  professeurs: Professeur[];
  etudiants: Etudiant[];
}> = ({ conversations, professeurs, etudiants }) => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [newMessageData, setNewMessageData] = useState({
    destinataire: '',
    objet: '',
    contenu: ''
  });

  const handleSendMessage = () => {
    if (!newMessageData.destinataire || !newMessageData.objet.trim() || !newMessageData.contenu.trim()) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    alert('Message envoyé avec succès !');
    setNewMessageData({ destinataire: '', objet: '', contenu: '' });
    setShowNewMessage(false);
  };

  const tousLesContacts = [
    ...professeurs.map(p => ({ ...p, type: 'professeur' as const })),
    ...etudiants.map(e => ({ ...e, type: 'etudiant' as const }))
  ];

  return (
    <div className="space-y-6">
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
          {/* <SimpleButton variant="secondary" icon={<Archive className="h-4 w-4" />}>
            Messages archivés
          </SimpleButton> */}
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
                  const autreParticipant = conversation.participants.find(p => p.id !== 1); // Exclure le chef (id: 1)
                  return (
                    <motion.div
                      key={conversation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`border border-gray-200 p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedConversation?.id === conversation.id ? 'bg-navy bg-opacity-10 border-navy' : ''
                      }`}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
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
                    <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-3">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {selectedConversation.participants.find(p => p.id !== 1)?.prenom} {selectedConversation.participants.find(p => p.id !== 1)?.nom}
                      </p>
                      <p className="text-sm text-gray-600 capitalize">
                        {selectedConversation.participants.find(p => p.id !== 1)?.type}
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
                  <div className={`flex ${selectedConversation.dernierMessage.expediteur.id === 1 ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      selectedConversation.dernierMessage.expediteur.id === 1 
                        ? 'bg-navy text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{selectedConversation.dernierMessage.contenu}</p>
                      <p className={`text-xs mt-1 ${selectedConversation.dernierMessage.expediteur.id === 1 ? 'text-navy-light' : 'text-gray-500'}`}>
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
                    placeholder="Tapez votre message..."
                    className="flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                  />
                  <SimpleButton variant="primary" icon={<Send className="h-4 w-4" />}>
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
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                  >
                    <option value="">Sélectionner un destinataire</option>
                    <optgroup label="Professeurs">
                      {professeurs.map(prof => (
                        <option key={`prof-${prof.id}`} value={`professeur-${prof.id}`}>
                          {prof.prenom} {prof.nom} - {prof.grade}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Étudiants">
                      {etudiants.map(etudiant => (
                        <option key={`etudiant-${etudiant.id}`} value={`etudiant-${etudiant.id}`}>
                          {etudiant.prenom} {etudiant.nom} - {etudiant.niveau}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Objet *</label>
                  <input
                    type="text"
                    value={newMessageData.objet}
                    onChange={(e) => setNewMessageData(prev => ({ ...prev, objet: e.target.value }))}
                    placeholder="Objet du message..."
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                  <textarea
                    value={newMessageData.contenu}
                    onChange={(e) => setNewMessageData(prev => ({ ...prev, contenu: e.target.value }))}
                    placeholder="Rédigez votre message..."
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
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
const NotificationsChef: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'professeurs' | 'etudiants' | 'messagerie'>('professeurs');
  const [notificationsState, setNotificationsState] = useState(NOTIFICATIONS_DATA);
  const [conversationsState, setConversationsState] = useState(CONVERSATIONS_DATA);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [composeType, setComposeType] = useState<'professeurs' | 'etudiants'>('professeurs');

  const { user } = useAuth();
  const isSecretaire = user.estSecretaire;
  const isChef = user.estChef;

  const handleComposeNotification = (type: 'professeurs' | 'etudiants') => {
    setComposeType(type);
    setShowComposeModal(true);
  };

  const handleSendNotification = (notificationData: any) => {
    const newNotification: Notification = {
      id: Math.max(...notificationsState.map(n => n.id), 0) + 1,
      expediteur: {
        id: 1,
        nom: user.name.split(' ')[2] || 'Diop',
        prenom: user.name.split(' ')[0] + ' ' + user.name.split(' ')[1],
        type: 'chef'
      },
      ...notificationData,
      dateEnvoi: new Date().toISOString(),
      statut: 'envoye' as const
    };

    setNotificationsState(prev => [newNotification, ...prev]);
    alert('Notification envoyée avec succès !');
  };

  const notificationsAafficher = notificationsState.filter(n =>
    (n.destinataires.type === 'professeurs' && (isChef || isSecretaire))
    || (n.destinataires.type === 'etudiants' && user.type === 'etudiant')
    || (n.destinataires.type === 'individuel' && n.destinataires.ids?.includes(Number(user.id)))
  );

  // Calcul des badges pour les onglets
  const nombreNonLusMessagerie = conversationsState.reduce((total, conv) => total + conv.nombreNonLus, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <div className="flex items-center">
            <div className="bg-navy-light rounded-full p-3 mr-4">
              <Bell className="h-7 w-7 text-navy" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications & Messages</h1>
              <p className="text-sm text-gray-500 mt-1">
                Département {user.department} - Communiquez avec les professeurs et étudiants
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <TabButton
                isActive={activeTab === 'professeurs'}
                onClick={() => setActiveTab('professeurs')}
                icon={<Users className="h-4 w-4" />}
              >
                Professeurs
              </TabButton>
              <TabButton
                isActive={activeTab === 'etudiants'}
                onClick={() => setActiveTab('etudiants')}
                icon={<GraduationCap className="h-4 w-4" />}
              >
                Étudiants
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
            {activeTab === 'professeurs' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ProfesseursTab 
                  professeurs={PROFESSEURS_DATA}
                  notifications={notificationsState}
                  onComposeNotification={() => handleComposeNotification('professeurs')}
                />
              </motion.div>
            )}

            {activeTab === 'etudiants' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <EtudiantsTab 
                  etudiants={ETUDIANTS_DATA}
                  notifications={notificationsState}
                  onComposeNotification={() => handleComposeNotification('etudiants')}
                />
              </motion.div>
            )}

            {activeTab === 'messagerie' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <MessagerieTab 
                  conversations={conversationsState}
                  professeurs={PROFESSEURS_DATA.filter(p => !p.estSecretaire)} // Exclure le secrétaire
                  etudiants={ETUDIANTS_DATA}
                />
              </motion.div>
            )}
          </div>
        </div>

        <ComposeNotificationModal
          isOpen={showComposeModal}
          onClose={() => setShowComposeModal(false)}
          onSend={handleSendNotification}
          type={composeType}
          professeurs={PROFESSEURS_DATA}
          etudiants={ETUDIANTS_DATA}
        />
      </div>
    </div>
  );
};

// Définition des couleurs navy manquantes pour Tailwind
const additionalStyles = `
  .bg-navy { background-color: #1e293b; }
  .text-navy { color: #1e293b; }
  .border-navy { border-color: #1e293b; }
  .bg-navy-light { background-color: #e2e8f0; }
  .bg-navy-dark { background-color: #0f172a; }
  .text-navy-light { color: #e2e8f0; }
  .hover\\:bg-navy:hover { background-color: #1e293b; }
  .hover\\:bg-navy-dark:hover { background-color: #0f172a; }
  .hover\\:border-navy:hover { border-color: #1e293b; }
  .focus\\:border-navy:focus { border-color: #1e293b; }
  .focus\\:ring-navy:focus { --tw-ring-color: #1e293b; }
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

export default NotificationsChef;