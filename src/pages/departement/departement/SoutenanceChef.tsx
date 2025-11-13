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
  ArrowUp,
  ArrowDown
} from 'lucide-react';

// Mock du contexte d'authentification pour tester
const useAuth = () => ({
  user: {
    id: '1',
    name: 'Dr. Amadou Diop',
    email: 'chef.informatique@isimemo.edu.sn',
    department: 'Informatique',
    estChef: true
  }
});

// Types et interfaces
interface Professeur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  grade: string;
  gradeNiveau: number;
  specialite: string;
  department: string;
  institution: string;
  disponible: boolean;
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
  encadrantId: number;
  sessionChoisie: 'septembre' | 'decembre' | 'speciale';
  memoire?: {
    titre: string;
    fichier: string;
    etat: "brouillon" | "soumis" | "valide";
  };
}

interface MembreJury {
  professeur: Professeur;
  role: 'president' | 'rapporteur' | 'examinateur';
}

interface Jury {
  id: number;
  nom: string;
  type: 'licence' | 'master';
  specialite: string;
  department: string;
  session: 'septembre' | 'decembre' | 'speciale';
  anneeAcademique: string;
  membres: MembreJury[];
  etudiants: Etudiant[];
  dateCreation: string;
  statut: 'actif' | 'inactif' | 'archive';
  generationAuto: boolean;
}

interface CreneauSoutenance {
  id: number;
  nom: string;
  heureDebut: string;
  heureFin: string;
}

interface OrdrePassage {
  etudiantId: number;
  ordre: number;
  creneauId: number;
}

interface SoutenanceJury {
  id: number;
  jury: Jury;
  date: string;
  salle: string;
  creneaux: CreneauSoutenance[];
  ordrePassage: OrdrePassage[];
  statut: 'planifiee' | 'en_cours' | 'terminee' | 'reportee' | 'annulee';
  observations?: string;
  dateCreation: string;
}

interface Salle {
  id: number;
  nom: string;
  capacite: number;
  equipements: string[];
  disponible: boolean;
}

// Données fictives des professeurs
const PROFESSEURS_DATA: Professeur[] = [
  {
    id: 1,
    nom: "Diop",
    prenom: "Dr. Ahmed",
    email: "ahmed.diop@isi.edu.sn",
    grade: "Professeur Titulaire",
    gradeNiveau: 5,
    specialite: "Informatique",
    department: "Informatique",
    institution: "ISI",
    disponible: true
  },
  {
    id: 2,
    nom: "Fall",
    prenom: "Dr. Ousmane",
    email: "ousmane.fall@isi.edu.sn",
    grade: "Professeur",
    gradeNiveau: 4,
    specialite: "Informatique",
    department: "Informatique",
    institution: "ISI",
    disponible: true
  },
  {
    id: 3,
    nom: "Ndiaye",
    prenom: "Dr. Ibrahima",
    email: "ibrahima.ndiaye@isi.edu.sn",
    grade: "Maître de Conférences",
    gradeNiveau: 3,
    specialite: "Informatique",
    department: "Informatique",
    institution: "ISI",
    disponible: true
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
    encadrantId: 3,
    sessionChoisie: "septembre",
    memoire: {
      titre: "Système de gestion des étudiants avec IA",
      fichier: "memoire_diallo.pdf",
      etat: "soumis"
    }
  },
  {
    id: 2,
    nom: "Sarr",
    prenom: "Mariama",
    email: "mariama.sarr@student.isi.edu.sn",
    niveau: "Master 2",
    specialite: "Informatique",
    department: "Informatique",
    classe: "Informatique - M2",
    encadrantId: 2,
    sessionChoisie: "septembre",
    memoire: {
      titre: "Machine Learning pour la détection de fraudes",
      fichier: "memoire_sarr.pdf",
      etat: "valide"
    }
  },
  {
    id: 3,
    nom: "Ba",
    prenom: "Moussa",
    email: "moussa.ba@student.isi.edu.sn",
    niveau: "Master 2",
    specialite: "Informatique",
    department: "Informatique",
    classe: "Informatique - M2",
    encadrantId: 1,
    sessionChoisie: "septembre",
    memoire: {
      titre: "Application mobile de e-commerce",
      fichier: "memoire_ba.pdf",
      etat: "soumis"
    }
  },
  {
    id: 4,
    nom: "Kane",
    prenom: "Abdoulaye",
    email: "abdoulaye.kane@student.isi.edu.sn",
    niveau: "Master 2",
    specialite: "Informatique",
    department: "Informatique",
    classe: "Informatique - M2",
    encadrantId: 1,
    sessionChoisie: "septembre",
    memoire: {
      titre: "Intelligence artificielle et vision",
      fichier: "memoire_kane.pdf",
      etat: "valide"
    }
  },
  {
    id: 5,
    nom: "Sow",
    prenom: "Fatou",
    email: "fatou.sow@student.isi.edu.sn",
    niveau: "Master 2",
    specialite: "Informatique",
    department: "Informatique",
    classe: "Informatique - M2",
    encadrantId: 2,
    sessionChoisie: "septembre",
    memoire: {
      titre: "Réseaux de neurones profonds",
      fichier: "memoire_sow.pdf",
      etat: "valide"
    }
  }
];

// Données fictives des jurys
const JURYS_DATA: Jury[] = [
  {
    id: 1,
    nom: "Jury Informatique Master 2 - Session Septembre 2025",
    type: "master",
    specialite: "Informatique",
    department: "Informatique",
    session: "septembre",
    anneeAcademique: "2024-2025",
    membres: [
      { professeur: PROFESSEURS_DATA[0], role: "president" },
      { professeur: PROFESSEURS_DATA[1], role: "rapporteur" },
      { professeur: PROFESSEURS_DATA[2], role: "examinateur" }
    ],
    etudiants: ETUDIANTS_DATA,
    dateCreation: "15/01/2025",
    statut: "actif",
    generationAuto: true
  }
];

// Données fictives des salles
const SALLES_DATA: Salle[] = [
  {
    id: 1,
    nom: "Amphithéâtre A",
    capacite: 50,
    equipements: ["Projecteur", "Micro", "Tableau", "Climatisation"],
    disponible: true
  },
  {
    id: 2,
    nom: "Salle 101",
    capacite: 30,
    equipements: ["Projecteur", "Tableau", "Climatisation"],
    disponible: true
  },
  {
    id: 3,
    nom: "Salle 102",
    capacite: 25,
    equipements: ["Projecteur", "Tableau"],
    disponible: true
  },
  {
    id: 4,
    nom: "Salle de Conférence",
    capacite: 40,
    equipements: ["Projecteur", "Micro", "Tableau", "Climatisation", "Visio"],
    disponible: true
  }
];

// Créneaux prédéfinis
const CRENEAUX_PREDEFINIS: CreneauSoutenance[] = [
  { id: 1, nom: "Créneau 1", heureDebut: "08:00", heureFin: "12:00" },
  { id: 2, nom: "Pause déjeuner", heureDebut: "12:00", heureFin: "14:00" },
  { id: 3, nom: "Créneau 2", heureDebut: "14:00", heureFin: "18:00" }
];

// Données fictives des soutenances de jury
const SOUTENANCES_DATA: SoutenanceJury[] = [
  {
    id: 1,
    jury: JURYS_DATA[0],
    date: "2025-02-15",
    salle: "Amphithéâtre A",
    creneaux: [CRENEAUX_PREDEFINIS[0], CRENEAUX_PREDEFINIS[2]], // Créneau 1 et Créneau 2
    ordrePassage: [
      { etudiantId: 1, ordre: 1, creneauId: 1 },
      { etudiantId: 2, ordre: 2, creneauId: 1 },
      { etudiantId: 3, ordre: 3, creneauId: 3 },
      { etudiantId: 4, ordre: 4, creneauId: 3 },
      { etudiantId: 5, ordre: 5, creneauId: 3 }
    ],
    statut: "planifiee",
    observations: "Session de septembre - 5 étudiants à faire soutenir",
    dateCreation: "20/01/2025"
  }
];

// Composants UI réutilisables avec style navy
const SimpleButton: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'warning' | 'danger';
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  icon?: React.ReactNode;
}> = ({ children, variant = 'primary', onClick, disabled = false, type = 'button', icon }) => {
  const styles = {
    primary: `bg-navy text-white border border-navy hover:bg-navy-dark ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    secondary: `bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    ghost: `bg-transparent text-gray-600 border border-transparent hover:bg-gray-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    success: `bg-green-600 text-white border border-green-600 hover:bg-green-700 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    warning: `bg-orange-600 text-white border border-orange-600 hover:bg-orange-700 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    danger: `bg-red-600 text-white border border-red-600 hover:bg-red-700 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`
  };
  
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      type={type}
      className={`px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center ${styles[variant]}`}
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

const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'planifiee' | 'en_cours' | 'terminee' | 'reportee' | 'annulee' | 'info' | 'warning' | 'primary' | 'success' | 'auto' | 'session' | 'mention';
  className?: string;
}> = ({ children, variant = 'info', className = '' }) => {
  const styles = {
    planifiee: "bg-blue-50 text-blue-700 border border-blue-200",
    en_cours: "bg-orange-50 text-orange-700 border border-orange-200",
    terminee: "bg-green-50 text-green-700 border border-green-200",
    reportee: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    annulee: "bg-red-50 text-red-600 border border-red-200", 
    info: "bg-gray-50 text-gray-700 border border-gray-200",
    warning: "bg-orange-50 text-orange-700 border border-orange-200",
    primary: "bg-navy bg-opacity-10 text-navy border border-navy border-opacity-20",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    auto: "bg-purple-50 text-purple-700 border border-purple-200",
    session: "bg-blue-50 text-blue-700 border border-blue-200",
    mention: "bg-indigo-50 text-indigo-700 border border-indigo-200"
  };
  
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Modal pour afficher les détails d'une soutenance de jury
const SoutenanceDetailsModal: React.FC<{
  soutenance: SoutenanceJury | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ soutenance, isOpen, onClose }) => {
  if (!isOpen || !soutenance) return null;

  const getStatusLabel = (statut: string) => {
    switch (statut) {
      case 'planifiee': return 'Planifiée';
      case 'en_cours': return 'En cours';
      case 'terminee': return 'Terminée';
      case 'reportee': return 'Reportée';
      case 'annulee': return 'Annulée';
      default: return statut;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'president': return 'Président';
      case 'rapporteur': return 'Rapporteur';
      case 'examinateur': return 'Examinateur';
      default: return role;
    }
  };

  const getEtudiantById = (etudiantId: number) => {
    return soutenance.jury.etudiants.find(e => e.id === etudiantId);
  };

  const getCreneauById = (creneauId: number) => {
    return soutenance.creneaux.find(c => c.id === creneauId);
  };

  // Grouper les étudiants par créneau
  const etudiantsParCreneau = soutenance.creneaux.map(creneau => {
    const etudiantsDuCreneau = soutenance.ordrePassage
      .filter(ordre => ordre.creneauId === creneau.id)
      .sort((a, b) => a.ordre - b.ordre)
      .map(ordre => ({
        ...ordre,
        etudiant: getEtudiantById(ordre.etudiantId)
      }));
    
    return {
      creneau,
      etudiants: etudiantsDuCreneau
    };
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border border-gray-200 p-6 max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Soutenance - {soutenance.jury.nom}
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={soutenance.statut as any}>
                {getStatusLabel(soutenance.statut)}
              </Badge>
              <Badge variant="primary">{soutenance.jury.type}</Badge>
              <Badge variant="session">Session {soutenance.jury.session}</Badge>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Informations générales</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">Date</label>
                <p className="text-gray-900 flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  {new Date(soutenance.date).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Salle</label>
                <p className="text-gray-900 flex items-center">
                  <Building className="h-4 w-4 text-gray-400 mr-2" />
                  {soutenance.salle}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Nombre d'étudiants</label>
                <p className="text-gray-900 flex items-center">
                  <Users className="h-4 w-4 text-gray-400 mr-2" />
                  {soutenance.jury.etudiants.length} étudiants
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Créneaux utilisés</label>
                <p className="text-gray-900 flex items-center">
                  <Clock className="h-4 w-4 text-gray-400 mr-2" />
                  {soutenance.creneaux.length} créneaux
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Membres du jury</h3>
            <div className="space-y-3">
              {soutenance.jury.membres.map((membre, index) => (
                <div key={index} className="border border-gray-200 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="primary">{getRoleLabel(membre.role)}</Badge>
                    <Badge variant="success">{membre.professeur.grade}</Badge>
                  </div>
                  <p className="text-gray-900 font-medium">
                    {membre.professeur.prenom} {membre.professeur.nom}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <Mail className="h-3 w-3 mr-1" />
                    {membre.professeur.email}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <School className="h-3 w-3 mr-1" />
                    {membre.professeur.institution}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Planning et ordre de passage</h3>
          <div className="space-y-4">
            {etudiantsParCreneau.map((creneauData, index) => (
              <div key={creneauData.creneau.id} className="border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 flex items-center">
                    <Clock className="h-4 w-4 text-navy mr-2" />
                    {creneauData.creneau.nom}
                  </h4>
                  <Badge variant="info">
                    {creneauData.creneau.heureDebut} - {creneauData.creneau.heureFin}
                  </Badge>
                </div>
                
                {creneauData.etudiants.length > 0 ? (
                  <div className="space-y-2">
                    {creneauData.etudiants.map((ordreData) => (
                      <div key={ordreData.etudiantId} className="flex items-center justify-between bg-gray-50 p-3 border border-gray-200">
                        <div className="flex items-center">
                          <div className="bg-navy text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3">
                            {ordreData.ordre}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {ordreData.etudiant?.prenom} {ordreData.etudiant?.nom}
                            </p>
                            <p className="text-sm text-gray-600">
                              {ordreData.etudiant?.memoire?.titre}
                            </p>
                          </div>
                        </div>
                        <Badge variant="success">
                          {ordreData.etudiant?.memoire?.etat}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">Aucun étudiant assigné à ce créneau</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {soutenance.observations && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Observations</h3>
            <div className="bg-gray-50 border border-gray-200 p-4">
              <p className="text-gray-900">{soutenance.observations}</p>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
          <SimpleButton variant="secondary" onClick={onClose}>
            Fermer
          </SimpleButton>
        </div>
      </motion.div>
    </div>
  );
};

// Modal pour planifier/modifier une soutenance de jury
const PlanifierSoutenanceModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  jurys: Jury[];
  salles: Salle[];
  soutenanceToEdit?: SoutenanceJury | null;
}> = ({ isOpen, onClose, onSave, jurys, salles, soutenanceToEdit }) => {
  const [formData, setFormData] = useState({
    juryId: '',
    date: '',
    salle: '',
    observations: ''
  });

  const [selectedJury, setSelectedJury] = useState<Jury | null>(null);
  const [creneauxSelectionnes, setCreneauxSelectionnes] = useState<CreneauSoutenance[]>([]);
  const [ordrePassage, setOrdrePassage] = useState<OrdrePassage[]>([]);

  const isEditing = Boolean(soutenanceToEdit);

  React.useEffect(() => {
    if (soutenanceToEdit) {
      setFormData({
        juryId: soutenanceToEdit.jury.id.toString(),
        date: soutenanceToEdit.date,
        salle: soutenanceToEdit.salle,
        observations: soutenanceToEdit.observations || ''
      });
      setSelectedJury(soutenanceToEdit.jury);
      setCreneauxSelectionnes(soutenanceToEdit.creneaux);
      setOrdrePassage(soutenanceToEdit.ordrePassage);
    } else {
      setFormData({
        juryId: '',
        date: '',
        salle: '',
        observations: ''
      });
      setSelectedJury(null);
      setCreneauxSelectionnes([]);
      setOrdrePassage([]);
    }
  }, [soutenanceToEdit]);

  const handleJuryChange = (juryId: string) => {
    const jury = jurys.find(j => j.id.toString() === juryId);
    setSelectedJury(jury || null);
    setFormData(prev => ({
      ...prev,
      juryId
    }));
    
    // Réinitialiser les créneaux et l'ordre quand on change de jury
    if (jury && !isEditing) {
      setCreneauxSelectionnes([]);
      setOrdrePassage([]);
    }
  };

  const handleCreneauToggle = (creneau: CreneauSoutenance) => {
    setCreneauxSelectionnes(prev => {
      const exists = prev.find(c => c.id === creneau.id);
      if (exists) {
        // Retirer le créneau et nettoyer l'ordre de passage associé
        setOrdrePassage(prevOrdre => prevOrdre.filter(o => o.creneauId !== creneau.id));
        return prev.filter(c => c.id !== creneau.id);
      } else {
        return [...prev, creneau];
      }
    });
  };

  // Remplacer la fonction genererCreneauxAuto par la version Tailwind-friendly et sans pause déjeuner :
  const genererCreneauxAuto = () => {
    if (!selectedJury) return;
    const nombreEtudiants = selectedJury.etudiants.length;
    const nouveauxCreneaux: CreneauSoutenance[] = [];
    let heure = 8;
    let minute = 0;
    for (let i = 0; i < nombreEtudiants; i++) {
      const heureDebut = `${heure.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      minute += 30;
      if (minute >= 60) {
        heure += 1;
        minute = 0;
      }
      heure += 1;
      const heureFin = `${heure.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      nouveauxCreneaux.push({
        id: Date.now() + i,
        nom: `Créneau ${i + 1}`,
        heureDebut,
        heureFin
      });
    }
    setCreneauxSelectionnes(nouveauxCreneaux);
  };

  const deplacerEtudiant = (etudiantId: number, direction: 'up' | 'down') => {
    setOrdrePassage(prev => {
      const currentIndex = prev.findIndex(o => o.etudiantId === etudiantId);
      if (currentIndex === -1) return prev;

      const newOrder = [...prev];
      const current = newOrder[currentIndex];
      
      if (direction === 'up' && currentIndex > 0) {
        const previous = newOrder[currentIndex - 1];
        // Échanger les ordres
        const tempOrdre = current.ordre;
        current.ordre = previous.ordre;
        previous.ordre = tempOrdre;
        
        // Réorganiser le tableau
        newOrder[currentIndex] = previous;
        newOrder[currentIndex - 1] = current;
      } else if (direction === 'down' && currentIndex < newOrder.length - 1) {
        const next = newOrder[currentIndex + 1];
        // Échanger les ordres
        const tempOrdre = current.ordre;
        current.ordre = next.ordre;
        next.ordre = tempOrdre;
        
        // Réorganiser le tableau
        newOrder[currentIndex] = next;
        newOrder[currentIndex + 1] = current;
      }
      
      return newOrder;
    });
  };

  const changerCreneauEtudiant = (etudiantId: number, nouveauCreneauId: number) => {
    setOrdrePassage(prev => prev.map(ordre => 
      ordre.etudiantId === etudiantId 
        ? { ...ordre, creneauId: nouveauCreneauId }
        : ordre
    ));
  };

  const handleSubmit = () => {
    if (!formData.juryId || !formData.date || !formData.salle) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (creneauxSelectionnes.length === 0) {
      alert('Veuillez sélectionner au moins un créneau');
      return;
    }

    if (ordrePassage.length === 0) {
      alert('Veuillez définir l\'ordre de passage des étudiants');
      return;
    }

    const jury = jurys.find(j => j.id.toString() === formData.juryId);
    if (!jury) {
      alert('Jury invalide');
      return;
    }

    const soutenanceData = {
      ...formData,
      jury,
      creneaux: creneauxSelectionnes,
      ordrePassage,
      statut: 'planifiee'
    };

    onSave(soutenanceData);
    onClose();
  };

  if (!isOpen) return null;

  // Grouper les étudiants par créneau pour l'affichage
  const etudiantsParCreneau = creneauxSelectionnes.map(creneau => {
    const etudiantsDuCreneau = ordrePassage
      .filter(ordre => ordre.creneauId === creneau.id)
      .sort((a, b) => a.ordre - b.ordre)
      .map(ordre => ({
        ...ordre,
        etudiant: selectedJury?.etudiants.find(e => e.id === ordre.etudiantId)
      }));
    
    return {
      creneau,
      etudiants: etudiantsDuCreneau
    };
  });

  const creneauxActifs = creneauxSelectionnes.filter(c => c.nom !== "Pause déjeuner");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border border-gray-200 p-6 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isEditing ? 'Modifier la soutenance de jury' : 'Planifier une soutenance de jury'}
            </h2>
            <p className="text-sm text-gray-500">
              {isEditing ? 'Modifiez les détails de la soutenance' : 'Organisez une nouvelle soutenance pour un jury complet'}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jury *</label>
              <select
                value={formData.juryId}
                onChange={(e) => handleJuryChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                disabled={isEditing}
              >
                <option value="">Sélectionner un jury</option>
                {jurys.filter(j => j.statut === 'actif').map(jury => (
                  <option key={jury.id} value={jury.id}>
                    {jury.nom} ({jury.etudiants.length} étudiants)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Salle *</label>
              <select
                value={formData.salle}
                onChange={(e) => setFormData(prev => ({ ...prev, salle: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
              >
                <option value="">Sélectionner une salle</option>
                {salles.filter(s => s.disponible).map(salle => (
                  <option key={salle.id} value={salle.nom}>
                    {salle.nom} (Capacité: {salle.capacite})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedJury && (
            <div className="bg-blue-50 border border-blue-200 p-4">
              <h4 className="font-medium text-blue-900 mb-2">Jury sélectionné :</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Nom :</strong> {selectedJury.nom}</p>
                <p><strong>Type :</strong> {selectedJury.type}</p>
                <p><strong>Session :</strong> {selectedJury.session}</p>
                <p><strong>Étudiants :</strong> {selectedJury.etudiants.length}</p>
                <p><strong>Membres :</strong> {selectedJury.membres.map(m => m.professeur.prenom + ' ' + m.professeur.nom).join(', ')}</p>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Créneaux disponibles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {CRENEAUX_PREDEFINIS.map(creneau => {
                const isSelected = creneauxSelectionnes.some(c => c.id === creneau.id);
                const isPause = creneau.nom === "Pause déjeuner";
                
                return (
                  <div
                    key={creneau.id}
                    className={`
                      border p-4 cursor-pointer transition-colors
                      ${isPause 
                        ? 'bg-orange-50 border-orange-200 cursor-not-allowed' 
                        : isSelected 
                          ? 'bg-navy bg-opacity-10 border-navy' 
                          : 'border-gray-300 hover:border-navy'
                      }
                    `}
                    onClick={() => !isPause && handleCreneauToggle(creneau)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{creneau.nom}</h4>
                      {!isPause && (
                        <div className={`
                          w-4 h-4 border-2 rounded
                          ${isSelected ? 'bg-navy border-navy' : 'border-gray-300'}
                        `}>
                          {isSelected && <Check className="h-3 w-3 text-white" />}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {creneau.heureDebut} - {creneau.heureFin}
                    </p>
                    {isPause && (
                      <Badge variant="warning" className="mt-2">Pause</Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {selectedJury && creneauxSelectionnes.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Ordre de passage des étudiants</h3>
                <SimpleButton
                  variant="success"
                  onClick={genererCreneauxAuto}
                  icon={<Shuffle className="h-4 w-4" />}
                >
                  Générer automatiquement
                </SimpleButton>
              </div>

              {ordrePassage.length === 0 ? (
                <div className="border border-gray-200 p-8 text-center">
                  <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Aucun ordre défini</h3>
                  <p className="text-gray-500 mb-4">Organisez l'ordre de passage des étudiants</p>
                  <SimpleButton
                    variant="primary"
                    onClick={genererCreneauxAuto}
                    icon={<Shuffle className="h-4 w-4" />}
                  >
                    Générer automatiquement l'ordre pour {selectedJury.etudiants.length} étudiants
                  </SimpleButton>
                </div>
              ) : (
                <div className="space-y-4">
                  {etudiantsParCreneau.map((creneauData) => (
                    <div key={creneauData.creneau.id} className="border border-gray-200 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900 flex items-center">
                          <Clock className="h-4 w-4 text-navy mr-2" />
                          {creneauData.creneau.nom}
                        </h4>
                        <Badge variant="info">
                          {creneauData.creneau.heureDebut} - {creneauData.creneau.heureFin}
                        </Badge>
                      </div>
                      
                      {creneauData.etudiants.length > 0 ? (
                        <div className="space-y-2">
                          {creneauData.etudiants.map((ordreData, index) => (
                            <div key={ordreData.etudiantId} className="flex items-center justify-between bg-gray-50 p-3 border border-gray-200">
                              <div className="flex items-center">
                                <div className="bg-navy text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3">
                                  {ordreData.ordre}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {ordreData.etudiant?.prenom} {ordreData.etudiant?.nom}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {ordreData.etudiant?.memoire?.titre}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <select
                                  value={ordreData.creneauId}
                                  onChange={(e) => changerCreneauEtudiant(ordreData.etudiantId, parseInt(e.target.value))}
                                  className="text-sm px-2 py-1 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                                >
                                  {creneauxActifs.map(creneau => (
                                    <option key={creneau.id} value={creneau.id}>
                                      {creneau.nom}
                                    </option>
                                  ))}
                                </select>
                                
                                <div className="flex flex-col">
                                  <button
                                    onClick={() => deplacerEtudiant(ordreData.etudiantId, 'up')}
                                    disabled={index === 0}
                                    className="p-1 text-gray-600 hover:text-navy disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <ArrowUp className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => deplacerEtudiant(ordreData.etudiantId, 'down')}
                                    disabled={index === creneauData.etudiants.length - 1}
                                    className="p-1 text-gray-600 hover:text-navy disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <ArrowDown className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">Aucun étudiant assigné à ce créneau</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Observations</label>
            <textarea
              value={formData.observations}
              onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
              placeholder="Observations particulières sur cette session de soutenances..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
          <SimpleButton variant="secondary" onClick={onClose}>
            Annuler
          </SimpleButton>
          <SimpleButton 
            variant="primary" 
            onClick={handleSubmit}
            icon={<Calendar className="h-4 w-4" />}
          >
            {isEditing ? 'Modifier' : 'Planifier'}
          </SimpleButton>
        </div>
      </motion.div>
    </div>
  );
};

// Onglet Liste des soutenances de jury
const SoutenanceListTab: React.FC<{
  soutenances: SoutenanceJury[];
  onViewDetails: (soutenance: SoutenanceJury) => void;
  onEditSoutenance: (soutenance: SoutenanceJury) => void;
  onPlanifierSoutenance: () => void;
  onGenerateAll: () => void;
}> = ({ soutenances, onViewDetails, onEditSoutenance, onPlanifierSoutenance, onGenerateAll }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'planifiee' | 'en_cours' | 'terminee' | 'reportee' | 'annulee'>('all');
  const [dateFilter, setDateFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredSoutenances = soutenances.filter(soutenance => {
    const matchesSearch = 
      soutenance.jury.nom.toLowerCase().includes(searchQuery.toLowerCase()) || 
      soutenance.salle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      soutenance.jury.etudiants.some(e => 
        e.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.prenom.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesStatus = statusFilter === 'all' || soutenance.statut === statusFilter;
    const matchesDate = !dateFilter || soutenance.date === dateFilter;
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusLabel = (statut: string) => {
    switch (statut) {
      case 'planifiee': return 'Planifiée';
      case 'en_cours': return 'En cours';
      case 'terminee': return 'Terminée';
      case 'reportee': return 'Reportée';
      case 'annulee': return 'Annulée';
      default: return statut;
    }
  };

  return (
    <div>
      <div className="bg-white border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Actions</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          <SimpleButton 
            variant="success" 
            icon={<Shuffle className="h-4 w-4" />}
            onClick={onGenerateAll}
          >
            Générer toutes les soutenances
          </SimpleButton>
          <SimpleButton 
            variant="primary" 
            icon={<Plus className="h-4 w-4" />}
            onClick={onPlanifierSoutenance}
          >
            Planifier une soutenance de jury
          </SimpleButton>
          <SimpleButton variant="secondary" icon={<Download className="h-4 w-4" />}>
            Exporter le planning
          </SimpleButton>
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filtres et recherche</h3>
          <SimpleButton
            variant="ghost"
            onClick={() => setShowFilters(!showFilters)}
            icon={<Filter className="h-4 w-4" />}
          >
            {showFilters ? 'Masquer' : 'Afficher'} les filtres
          </SimpleButton>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Rechercher une soutenance de jury..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-3 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
          />
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="planifiee">Planifiée</option>
                    <option value="en_cours">En cours</option>
                    <option value="terminee">Terminée</option>
                    <option value="reportee">Reportée</option>
                    <option value="annulee">Annulée</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {filteredSoutenances.length === 0 ? (
        <div className="bg-white border border-gray-200 p-8 text-center">
          <CalendarDays className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Aucune soutenance trouvée</h2>
          <p className="text-gray-500">Essayez de modifier vos critères de recherche ou filtres.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jury</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salle</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Étudiants</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Créneaux</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSoutenances.map((soutenance, index) => (
                  <motion.tr 
                    key={soutenance.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          <Users className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {soutenance.jury.nom.split(' - ')[0]}
                          </div>
                          <div className="text-sm text-gray-500">
                            {soutenance.jury.type} - {soutenance.jury.session}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-navy mr-2" />
                        <span className="text-sm text-gray-900">
                          {new Date(soutenance.date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{soutenance.salle}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-green-600 mr-1" />
                        <span className="text-sm font-medium text-gray-900">{soutenance.jury.etudiants.length}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-blue-600 mr-1" />
                        <span className="text-sm text-gray-900">{soutenance.creneaux.length}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={soutenance.statut as any}>
                        {getStatusLabel(soutenance.statut)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => onViewDetails(soutenance)}
                          className="p-2 text-gray-600 hover:text-navy hover:bg-navy-light border border-gray-300 hover:border-navy transition-colors duration-200"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => onEditSoutenance(soutenance)}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 border border-gray-300 hover:border-green-300 transition-colors duration-200"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Onglet Statistiques
const StatisticsTab: React.FC<{
  soutenances: SoutenanceJury[];
}> = ({ soutenances }) => {
  const soutenancesTerminees = soutenances.filter(s => s.statut === 'terminee');
  const soutenancesPlanifiees = soutenances.filter(s => s.statut === 'planifiee');
  const totalEtudiants = soutenances.reduce((total, s) => total + s.jury.etudiants.length, 0);
  const totalCreneaux = soutenances.reduce((total, s) => total + s.creneaux.length, 0);

  const statsParStatut = ['planifiee', 'en_cours', 'terminee', 'reportee', 'annulee'].map(statut => {
    const soutenancesByStatut = soutenances.filter(s => s.statut === statut);
    return {
      name: statut.charAt(0).toUpperCase() + statut.slice(1),
      count: soutenancesByStatut.length
    };
  }).filter(stat => stat.count > 0);

  const statsParSalle = SALLES_DATA.map(salle => {
    const soutenancesBySalle = soutenances.filter(s => s.salle === salle.nom);
    return {
      name: salle.nom,
      count: soutenancesBySalle.length,
      capacite: salle.capacite
    };
  }).filter(stat => stat.count > 0);

  const prochaineSoutenance = soutenances
    .filter(s => s.statut === 'planifiee' && new Date(s.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: "Soutenances Jurys", value: soutenances.length, icon: CalendarDays, color: "bg-navy-light text-navy" },
          { title: "Planifiées", value: soutenancesPlanifiees.length, icon: Clock, color: "bg-blue-100 text-blue-600" },
          { title: "Total Étudiants", value: totalEtudiants, icon: Users, color: "bg-green-100 text-green-600" },
          { title: "Total Créneaux", value: totalCreneaux, icon: Timer, color: "bg-orange-100 text-orange-600" }
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

      {prochaineSoutenance && (
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Prochaine soutenance de jury</h3>
          <div className="bg-blue-50 border border-blue-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-blue-900">
                  {prochaineSoutenance.jury.nom.split(' - ')[0]}
                </p>
                <p className="text-sm text-blue-800">
                  {new Date(prochaineSoutenance.date).toLocaleDateString('fr-FR')} - Salle: {prochaineSoutenance.salle}
                </p>
                <p className="text-sm text-blue-700">
                  {prochaineSoutenance.jury.etudiants.length} étudiants - {prochaineSoutenance.creneaux.length} créneaux
                </p>
              </div>
              <Badge variant="planifiee">Planifiée</Badge>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par statut</h3>
          <div className="space-y-3">
            {statsParStatut.map(stat => {
              const percentage = soutenances.length > 0 ? Math.round((stat.count / soutenances.length) * 100) : 0;
              return (
                <div key={stat.name} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{stat.name}</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 h-2 mr-3">
                      <div 
                        className="bg-navy h-2" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{stat.count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Utilisation des salles</h3>
          <div className="space-y-3">
            {statsParSalle.map(salle => {
              const maxCount = Math.max(...statsParSalle.map(s => s.count));
              const percentage = maxCount > 0 ? Math.round((salle.count / maxCount) * 100) : 0;
              return (
                <div key={salle.name} className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-gray-600">{salle.name}</span>
                    <span className="text-xs text-gray-500 ml-2">(Cap. {salle.capacite})</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 h-2 mr-3">
                      <div 
                        className="bg-green-500 h-2" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{salle.count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant principal
const SoutenanceChef: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'stats'>('list');
  const [selectedSoutenance, setSelectedSoutenance] = useState<SoutenanceJury | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [soutenancesState, setSoutenancesState] = useState(SOUTENANCES_DATA);
  const [showPlanifierModal, setShowPlanifierModal] = useState(false);
  const [soutenanceToEdit, setSoutenanceToEdit] = useState<SoutenanceJury | null>(null);

  const { user } = useAuth();

  const openSoutenanceDetails = (soutenance: SoutenanceJury) => {
    setSelectedSoutenance(soutenance);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedSoutenance(null);
    setIsModalOpen(false);
  };

  const handleEditSoutenance = (soutenance: SoutenanceJury) => {
    setSoutenanceToEdit(soutenance);
    setShowPlanifierModal(true);
  };

  const handlePlanifierSoutenance = () => {
    setSoutenanceToEdit(null);
    setShowPlanifierModal(true);
  };

  const handleSaveSoutenance = (soutenanceData: any) => {
    if (soutenanceToEdit) {
      // Modification
      setSoutenancesState(prev => prev.map(s => 
        s.id === soutenanceToEdit.id 
          ? { ...s, ...soutenanceData, id: soutenanceToEdit.id }
          : s
      ));
      alert('Soutenance de jury modifiée avec succès !');
    } else {
      // Nouvelle soutenance de jury
      const nouvelleSoutenance = {
        ...soutenanceData,
        id: Math.max(...soutenancesState.map(s => s.id), 0) + 1,
        dateCreation: new Date().toLocaleDateString('fr-FR')
      };
      setSoutenancesState(prev => [...prev, nouvelleSoutenance]);
      alert('Soutenance de jury planifiée avec succès !');
    }
    setSoutenanceToEdit(null);
  };

  const handleGenerateAll = () => {
    // Simulation de génération automatique pour tous les jurys
    alert(`Génération automatique des soutenances en cours...\n\nCette fonctionnalité va :\n\n1. Analyser tous les jurys actifs\n2. Vérifier les créneaux de disponibilité des professeurs\n3. Trouver les salles disponibles\n4. Créer automatiquement les plannings pour chaque jury\n5. Assigner des créneaux optimaux pour chaque étudiant\n\nLe système respectera :\n- Les contraintes de disponibilité des membres du jury\n- La capacité des salles\n- Les sessions choisies par les étudiants\n- Une répartition équilibrée sur les créneaux disponibles`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <div className="flex items-center">
            <div className="bg-navy-light rounded-full p-3 mr-4">
              <CalendarDays className="h-7 w-7 text-navy" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Soutenances</h1>
              <p className="text-sm text-gray-500 mt-1">
                Département {user.department} - Organisez les soutenances par jury complet
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <TabButton
                isActive={activeTab === 'list'}
                onClick={() => setActiveTab('list')}
                icon={<FileText className="h-4 w-4" />}
              >
                Soutenances de jury
              </TabButton>
              <TabButton
                isActive={activeTab === 'stats'}
                onClick={() => setActiveTab('stats')}
                icon={<BarChart3 className="h-4 w-4" />}
              >
                Statistiques
              </TabButton>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'list' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SoutenanceListTab 
                  soutenances={soutenancesState}
                  onViewDetails={openSoutenanceDetails}
                  onEditSoutenance={handleEditSoutenance}
                  onPlanifierSoutenance={handlePlanifierSoutenance}
                  onGenerateAll={handleGenerateAll}
                />
              </motion.div>
            )}

            {activeTab === 'stats' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <StatisticsTab soutenances={soutenancesState} />
              </motion.div>
            )}
          </div>
        </div>

        <SoutenanceDetailsModal 
          soutenance={selectedSoutenance}
          isOpen={isModalOpen}
          onClose={closeModal}
        />

        <PlanifierSoutenanceModal
          isOpen={showPlanifierModal}
          onClose={() => {
            setShowPlanifierModal(false);
            setSoutenanceToEdit(null);
          }}
          onSave={handleSaveSoutenance}
          jurys={JURYS_DATA}
          salles={SALLES_DATA}
          soutenanceToEdit={soutenanceToEdit}
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
  .hover\\:bg-navy:hover { background-color: #1e293b; }
  .hover\\:bg-navy-dark:hover { background-color: #0f172a; }
  .hover\\:border-navy:hover { border-color: #1e293b; }
  .focus\\:border-navy:focus { border-color: #1e293b; }
  .focus\\:ring-navy:focus { --tw-ring-color: #1e293b; }
`;

// Injection des styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = additionalStyles;
  document.head.appendChild(styleElement);
}

export default SoutenanceChef;