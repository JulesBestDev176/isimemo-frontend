import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  User, 
  GraduationCap, 
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
  History,
  Clock
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  getDossierEnCoursByCandidat, 
  getDossiersTerminesByCandidat,
  getDossiersByCandidat,
  type DossierMemoire,
  StatutDossierMemoire,
  mockDossiers
} from '../../../models/dossier/DossierMemoire';
import { 
  getDocumentsByDossier, 
  getDocumentsAdministratifs,
  getDocumentsDeposesByDossier,
  type Document,
  TypeDocument,
  StatutDocument
} from '../../../models/dossier/Document';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Liste des classes disponibles
const CLASSES = [
  "Informatique - L1",
  "Informatique - L2", 
  "Informatique - L3",
  "Informatique - M1",
  "Informatique - M2",
  "Réseaux - L1",
  "Réseaux - L2",
  "Réseaux - L3",
  "Management - L1",
  "Management - L2"
];

// Liste des niveaux
const LEVELS = [
  "Licence 1",
  "Licence 2", 
  "Licence 3",
  "Master 1",
  "Master 2"
];

interface StudentItem {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  class: string;
  level: string;
  registrationDate: string;
  active: boolean;
  phoneNumber?: string;
  address?: string;
  gpa?: number;
  lastUpdated: string;
  idCandidat?: number; // ID du candidat pour récupérer les dossiers mémoire
}

const STUDENTS_DATA: StudentItem[] = [
  { 
    id: 1, 
    firstName: "Amadou", 
    lastName: "Diop", 
    email: "amadou.diop@student.edu.sn", 
    class: "Informatique - L1", 
    level: "Licence 1", 
    registrationDate: "01/09/2025", 
    active: true,
    phoneNumber: "+221 77 123 45 67",
    address: "123 Rue Pompidou, Dakar",
    gpa: 15.6,
    lastUpdated: "2025-01-15"
  },
  { 
    id: 2, 
    firstName: "Fatou", 
    lastName: "Ndiaye", 
    email: "fatou.ndiaye@student.edu.sn", 
    class: "Informatique - L1", 
    level: "Licence 1", 
    registrationDate: "02/09/2025", 
    active: true,
    phoneNumber: "+221 76 987 65 43",
    address: "45 Avenue Cheikh Anta Diop, Dakar",
    gpa: 16.2,
    lastUpdated: "2025-01-10"
  },
  { 
    id: 3, 
    firstName: "Modou", 
    lastName: "Sall", 
    email: "modou.sall@student.edu.sn", 
    class: "Informatique - L2", 
    level: "Licence 2", 
    registrationDate: "01/09/2024", 
    active: true,
    phoneNumber: "+221 70 555 22 33",
    address: "78 Boulevard de la République, Dakar",
    gpa: 13.4,
    lastUpdated: "2025-01-12"
  },
  { 
    id: 4, 
    firstName: "Aïda", 
    lastName: "Diallo", 
    email: "aida.diallo@student.edu.sn", 
    class: "Informatique - L2", 
    level: "Licence 2", 
    registrationDate: "03/09/2024", 
    active: false,
    phoneNumber: "+221 77 888 99 00",
    address: "12 Rue de la Paix, Dakar",
    gpa: 11.8,
    lastUpdated: "2025-01-08"
  },
  { 
    id: 5, 
    firstName: "Abdoulaye", 
    lastName: "Mbaye", 
    email: "abdoulaye.mbaye@student.edu.sn", 
    class: "Informatique - L3", 
    level: "Licence 3", 
    registrationDate: "01/09/2023", 
    active: true,
    phoneNumber: "+221 76 111 22 33",
    address: "90 Rue des Écoles, Dakar",
    gpa: 14.7,
    lastUpdated: "2025-01-14",
    idCandidat: 1 // Correspond à Amadou Diallo dans mockCandidats
  },
  { 
    id: 6, 
    firstName: "Mariama", 
    lastName: "Sow", 
    email: "mariama.sow@student.edu.sn", 
    class: "Informatique - L3", 
    level: "Licence 3", 
    registrationDate: "02/09/2023", 
    active: true,
    phoneNumber: "+221 77 444 55 66",
    address: "67 Avenue Georges Bush, Dakar",
    gpa: 15.9,
    lastUpdated: "2025-01-11",
    idCandidat: 2 // Correspond à Fatou Ndiaye dans mockCandidats
  },
  { 
    id: 7, 
    firstName: "Ibrahima", 
    lastName: "Fall", 
    email: "ibrahima.fall@student.edu.sn", 
    class: "Réseaux - L2", 
    level: "Licence 2", 
    registrationDate: "01/09/2024", 
    active: true,
    phoneNumber: "+221 76 777 88 99",
    address: "34 Rue de la Liberté, Dakar",
    gpa: 12.3,
    lastUpdated: "2025-01-09"
  },
  { 
    id: 8, 
    firstName: "Sophie", 
    lastName: "Mendy", 
    email: "sophie.mendy@student.edu.sn", 
    class: "Réseaux - L1", 
    level: "Licence 1", 
    registrationDate: "03/09/2025", 
    active: true,
    phoneNumber: "+221 77 000 11 22",
    address: "56 Boulevard de la Corniche, Dakar",
    gpa: 16.8,
    lastUpdated: "2025-01-13"
  },
];

// Composants UI réutilisables
// Remplacement des couleurs blue/primary par navy
const SimpleButton: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  icon?: React.ReactNode;
}> = ({ children, variant = 'primary', onClick, disabled = false, type = 'button', icon }) => {
  const styles = {
    primary: `bg-navy text-white border border-navy hover:bg-navy-dark ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    secondary: `bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    ghost: `bg-transparent text-gray-600 border border-transparent hover:bg-gray-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`
  };
  
  return (
    <button
      onClick={onClick}
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

// Badge avec couleurs subtiles
const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'active' | 'inactive' | 'info' | 'warning' | 'primary';
  className?: string;
}> = ({ children, variant = 'info', className = '' }) => {
  const styles = {
    active: "bg-green-50 text-green-700 border border-green-200",
    inactive: "bg-red-50 text-red-600 border border-red-200", 
    info: "bg-gray-50 text-gray-700 border border-gray-200",
    warning: "bg-orange-50 text-orange-700 border border-orange-200",
    primary: "bg-navy bg-opacity-10 text-navy border border-navy border-opacity-20"
  };
  
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Composant SimpleToggle pour activer/désactiver un élément
const SimpleToggle: React.FC<{
  isActive: boolean;
  onToggle: () => void;
  activeLabel?: string;
  inactiveLabel?: string;
  disabled?: boolean;
}> = ({ isActive, onToggle, activeLabel = 'Actif', inactiveLabel = 'Inactif', disabled = false }) => {
  return (
    <button
      onClick={disabled ? undefined : onToggle}
      disabled={disabled}
      className={`
        w-12 h-6 rounded-full border-2 transition-colors duration-200 flex items-center
        ${isActive ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'}
      `}
    >
      <div className={`
        w-4 h-4 bg-white rounded-full transition-transform duration-200 flex items-center justify-center
        ${isActive ? 'translate-x-6' : 'translate-x-0'}
      `}>
        {isActive ? 
          <Check className="h-2 w-2 text-green-500" /> : 
          <X className="h-2 w-2 text-red-400" />
        }
      </div>
    </button>
  );
};

// Modal pour afficher les détails d'un étudiant
const StudentDetailsModal: React.FC<{
  studentItem: StudentItem | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ studentItem, isOpen, onClose }) => {
  const [showHistory, setShowHistory] = useState(false);
  
  // Récupérer les dossiers mémoire si l'étudiant a un idCandidat
  // Les hooks doivent être appelés avant tout return conditionnel
  const dossierActif = useMemo(() => {
    if (!studentItem?.idCandidat) return undefined;
    return getDossierEnCoursByCandidat(studentItem.idCandidat);
  }, [studentItem?.idCandidat]);
  
  const dossiersHistorique = useMemo(() => {
    if (!studentItem?.idCandidat) return [];
    return getDossiersTerminesByCandidat(studentItem.idCandidat);
  }, [studentItem?.idCandidat]);

  if (!isOpen || !studentItem) return null;

  // Récupérer les documents pour le dossier actif
  const documentsDossierActif = dossierActif 
    ? getDocumentsByDossier(dossierActif.idDossierMemoire)
    : [];
  
  // Document du mémoire (un seul document principal)
  const documentMemoire = documentsDossierActif.find(d => 
    d.typeDocument === TypeDocument.CHAPITRE || 
    d.typeDocument === TypeDocument.PRESENTATION
  );
  
  // Documents déposés (exclure les documents de type CHAPITRE et PRESENTATION qui sont déjà dans "Document du mémoire")
  const documentsDeposes = dossierActif 
    ? getDocumentsDeposesByDossier(dossierActif.idDossierMemoire).filter(d => 
        d.typeDocument !== TypeDocument.CHAPITRE && 
        d.typeDocument !== TypeDocument.PRESENTATION
      )
    : [];
  
  // Documents administratifs (généraux)
  const documentsAdministratifs = getDocumentsAdministratifs();
  
  // Récupérer les documents pour chaque dossier historique
  const documentsParDossier = dossiersHistorique.reduce((acc, dossier) => {
    acc[dossier.idDossierMemoire] = getDocumentsByDossier(dossier.idDossierMemoire);
    return acc;
  }, {} as Record<number, Document[]>);
  
  // État pour le document à consulter
  const [documentAConsulter, setDocumentAConsulter] = useState<Document | null>(null);

  const getStatutBadgeColor = (statut: StatutDossierMemoire) => {
    switch (statut) {
      case StatutDossierMemoire.EN_CREATION:
      case StatutDossierMemoire.EN_COURS:
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case StatutDossierMemoire.EN_ATTENTE_VALIDATION:
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case StatutDossierMemoire.VALIDE:
        return 'bg-green-100 text-green-700 border-green-200';
      case StatutDossierMemoire.SOUTENU:
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{studentItem.firstName} {studentItem.lastName}</h2>
            <div className="flex items-center gap-2">
              <Badge variant={studentItem.active ? 'active' : 'inactive'}>
                {studentItem.active ? 'Actif' : 'Inactif'}
              </Badge>
              <Badge variant="primary">{studentItem.level}</Badge>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Dossier Mémoire Actif - Mise en avant */}
        {dossierActif ? (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Dossier Mémoire Actif
            </h3>
            <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-5">
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-lg text-gray-900 mb-2">{dossierActif.titre}</h4>
                  <p className="text-sm text-gray-700 mb-3">{dossierActif.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Statut</label>
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded border ${getStatutBadgeColor(dossierActif.statut)}`}>
                      {dossierActif.statut}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Étape</label>
                    <span className="text-sm text-gray-900">{dossierActif.etape}</span>
                  </div>
                  
                  {dossierActif.anneeAcademique && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Année académique</label>
                      <span className="text-sm text-gray-900">{dossierActif.anneeAcademique}</span>
                    </div>
                  )}
                  
                  {dossierActif.encadrant && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Encadrant</label>
                      <span className="text-sm text-gray-900">{dossierActif.encadrant.prenom} {dossierActif.encadrant.nom}</span>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Date de création</label>
                    <span className="text-sm text-gray-900 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(dossierActif.dateCreation, 'dd/MM/yyyy', { locale: fr })}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Dernière modification</label>
                    <span className="text-sm text-gray-900 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(dossierActif.dateModification, 'dd/MM/yyyy', { locale: fr })}
                    </span>
                  </div>
                </div>
                
                {dossierActif.binome && (
                  <div className="pt-3 border-t border-primary-200">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Binôme</label>
                    <span className="text-sm text-gray-900">
                      {dossierActif.binome.candidat1.prenom} {dossierActif.binome.candidat1.nom} & {dossierActif.binome.candidat2.prenom} {dossierActif.binome.candidat2.nom}
                    </span>
                  </div>
                )}
                
                {/* Document du mémoire (un seul) */}
                {documentMemoire && (
                  <div className="pt-3 border-t border-primary-200">
                    <label className="block text-xs font-medium text-gray-500 mb-2">Document du mémoire</label>
                    <div className="bg-white border border-primary-200 rounded-lg p-3 flex items-center justify-between hover:bg-primary-50 transition-colors">
                      <div className="flex items-center gap-3 flex-1">
                        <FileText className="h-5 w-5 text-primary" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{documentMemoire.titre}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              documentMemoire.statut === StatutDocument.VALIDE ? 'bg-green-100 text-green-700' :
                              documentMemoire.statut === StatutDocument.DEPOSE ? 'bg-blue-100 text-blue-700' :
                              documentMemoire.statut === StatutDocument.EN_ATTENTE_VALIDATION ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {documentMemoire.statut}
                            </span>
                            <span className="text-xs text-gray-500">
                              {format(documentMemoire.dateModification || documentMemoire.dateCreation, 'dd/MM/yyyy', { locale: fr })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setDocumentAConsulter(documentMemoire)}
                        className="ml-4 px-3 py-1.5 text-sm text-primary border border-primary rounded hover:bg-primary hover:text-white transition-colors flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Consulter
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Documents déposés */}
                {documentsDeposes.length > 0 && (
                  <div className="pt-3 border-t border-primary-200">
                    <label className="block text-xs font-medium text-gray-500 mb-2">Documents déposés ({documentsDeposes.length})</label>
                    <div className="space-y-2">
                      {documentsDeposes.map((doc) => (
                        <div key={doc.idDocument} className="bg-white border border-gray-200 rounded-lg p-2 flex items-center justify-between hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-2 flex-1">
                            <Download className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-700">{doc.titre}</span>
                            <span className="text-xs text-gray-500">({doc.typeDocument})</span>
                          </div>
                          <button
                            onClick={() => setDocumentAConsulter(doc)}
                            className="ml-2 px-2 py-1 text-xs text-primary border border-primary rounded hover:bg-primary hover:text-white transition-colors flex items-center gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            Voir
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Documents administratifs */}
                {documentsAdministratifs.length > 0 && (
                  <div className="pt-3 border-t border-primary-200">
                    <label className="block text-xs font-medium text-gray-500 mb-2">Dossiers administratifs ({documentsAdministratifs.length})</label>
                    <div className="space-y-2">
                      {documentsAdministratifs.map((doc) => (
                        <div key={doc.idDocument} className="bg-white border border-gray-200 rounded-lg p-2 flex items-center justify-between hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-2 flex-1">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-700">{doc.titre}</span>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              doc.statut === StatutDocument.VALIDE ? 'bg-green-100 text-green-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {doc.statut}
                            </span>
                          </div>
                          <button
                            onClick={() => setDocumentAConsulter(doc)}
                            className="ml-2 px-2 py-1 text-xs text-primary border border-primary rounded hover:bg-primary hover:text-white transition-colors flex items-center gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            Voir
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    {dossierActif.estComplet ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-xs text-gray-600">
                      {dossierActif.estComplet ? 'Dossier complet' : 'Dossier incomplet'}
                    </span>
                  </div>
                  {dossierActif.autoriseSoutenance && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-xs text-gray-600">Soutenance autorisée</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
              <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Aucun dossier mémoire actif</p>
            </div>
          </div>
        )}

        {/* Informations étudiant (moins importantes) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Informations générales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Informations générales</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900 flex items-center">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  {studentItem.email}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Classe</label>
                <p className="text-gray-900 flex items-center">
                  <School className="h-4 w-4 text-gray-400 mr-2" />
                  {studentItem.class}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Dernière mise à jour</label>
                <p className="text-gray-900">{studentItem.lastUpdated}</p>
              </div>
            </div>
          </div>

          {/* Informations personnelles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Informations personnelles</h3>
            <div className="space-y-3">
              {studentItem.phoneNumber && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Téléphone</label>
                  <p className="text-gray-900 flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    {studentItem.phoneNumber}
                  </p>
                </div>
              )}
              {studentItem.address && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Adresse</label>
                  <p className="text-gray-900 flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    {studentItem.address}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Historique des dossiers */}
        {dossiersHistorique.length > 0 && (
          <div className="mb-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Historique des Dossiers ({dossiersHistorique.length})
              </h3>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                {showHistory ? 'Masquer' : 'Afficher'} l'historique
              </button>
            </div>
            {showHistory && (
              <div className="space-y-3">
                {dossiersHistorique.map((dossier) => (
                  <div key={dossier.idDossierMemoire} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                    <div className="space-y-3">
                <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{dossier.titre}</h4>
                        <p className="text-sm text-gray-600 mb-2">{dossier.description}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Statut</label>
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded border ${getStatutBadgeColor(dossier.statut)}`}>
                            {dossier.statut}
                          </span>
                        </div>
                        
                        {dossier.anneeAcademique && (
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Année</label>
                            <span className="text-xs text-gray-900">{dossier.anneeAcademique}</span>
                </div>
              )}
                        
                        {dossier.encadrant && (
                          <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Encadrant</label>
                            <span className="text-xs text-gray-900">{dossier.encadrant.prenom} {dossier.encadrant.nom}</span>
            </div>
                        )}
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Étape</label>
                          <span className="text-xs text-gray-900">{dossier.etape}</span>
          </div>
        </div>
                      
                      <div className="text-xs text-gray-500 flex items-center gap-4 pt-2 border-t border-gray-200">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Créé: {format(dossier.dateCreation, 'dd/MM/yyyy', { locale: fr })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Modifié: {format(dossier.dateModification, 'dd/MM/yyyy', { locale: fr })}
                        </span>
                      </div>
                      
                      {documentsParDossier[dossier.idDossierMemoire] && documentsParDossier[dossier.idDossierMemoire].length > 0 && (
                        <div className="pt-2 border-t border-gray-200">
                          <label className="block text-xs font-medium text-gray-500 mb-1">Documents ({documentsParDossier[dossier.idDossierMemoire].length})</label>
                          <div className="space-y-1">
                            {documentsParDossier[dossier.idDossierMemoire].slice(0, 3).map((doc) => (
                              <div key={doc.idDocument} className="text-xs text-gray-600 flex items-center justify-between bg-gray-50 rounded p-1.5">
                                <div className="flex items-center gap-1 flex-1">
                                  <BookOpen className="h-3 w-3 text-gray-400" />
                                  <span className="truncate">{doc.titre}</span>
                                </div>
                                <button
                                  onClick={() => setDocumentAConsulter(doc)}
                                  className="ml-2 px-1.5 py-0.5 text-xs text-primary border border-primary rounded hover:bg-primary hover:text-white transition-colors flex items-center gap-1"
                                >
                                  <Eye className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                            {documentsParDossier[dossier.idDossierMemoire].length > 3 && (
                              <span className="text-xs text-gray-500">+ {documentsParDossier[dossier.idDossierMemoire].length - 3} autre(s)</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
          <SimpleButton
            variant="secondary"
            onClick={onClose}
          >
            Fermer
          </SimpleButton>
        </div>
      </motion.div>
      
      {/* Modal de consultation de document */}
      {documentAConsulter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white border border-gray-200 p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{documentAConsulter.titre}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs px-2 py-1 rounded ${
                    documentAConsulter.statut === StatutDocument.VALIDE ? 'bg-green-100 text-green-700' :
                    documentAConsulter.statut === StatutDocument.DEPOSE ? 'bg-blue-100 text-blue-700' :
                    documentAConsulter.statut === StatutDocument.EN_ATTENTE_VALIDATION ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {documentAConsulter.statut}
                  </span>
                  <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                    {documentAConsulter.typeDocument}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setDocumentAConsulter(null)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Date de création</label>
                  <p className="text-sm text-gray-900 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(documentAConsulter.dateCreation, 'dd/MM/yyyy à HH:mm', { locale: fr })}
                  </p>
                </div>
                {documentAConsulter.dateModification && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Dernière modification</label>
                    <p className="text-sm text-gray-900 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {format(documentAConsulter.dateModification, 'dd/MM/yyyy à HH:mm', { locale: fr })}
                    </p>
                  </div>
                )}
              </div>
              
              {documentAConsulter.commentaire && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Commentaire</label>
                  <p className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded p-3">
                    {documentAConsulter.commentaire}
                  </p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Fichier</label>
                <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{documentAConsulter.cheminFichier.split('/').pop()}</p>
                      <p className="text-xs text-gray-500">{documentAConsulter.cheminFichier}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      // Simuler l'ouverture du document
                      window.open(documentAConsulter.cheminFichier, '_blank');
                    }}
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-700 transition-colors flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Ouvrir
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-gray-200">
              <SimpleButton
                variant="secondary"
                onClick={() => setDocumentAConsulter(null)}
              >
                Fermer
              </SimpleButton>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Onglet Liste des étudiants
const StudentListTab: React.FC<{
  students: StudentItem[];
  onToggleActive: (id: number) => void;
  onViewDetails: (student: StudentItem) => void;
}> = ({ students, onToggleActive, onViewDetails }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [levelFilter, setLevelFilter] = useState<string>('Licence 3'); // Par défaut, afficher seulement Licence 3
  const [classFilter, setClassFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filtrer les données
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = 
      activeFilter === 'all' || 
      (activeFilter === 'active' && student.active) || 
      (activeFilter === 'inactive' && !student.active);
    const matchesLevel = 
      levelFilter === 'all' || 
      student.level === levelFilter;
    const matchesClass = 
      classFilter === 'all' || 
      student.class === classFilter;
    
    return matchesSearch && matchesStatus && matchesLevel && matchesClass;
  });

  return (
    <div>
      {/* Actions principales */}
      <div className="bg-white border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Actions</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          <SimpleButton
            variant="primary"
            icon={<Upload className="h-4 w-4" />}
          >
            Importer (CSV)
          </SimpleButton>
          <SimpleButton
            variant="secondary"
            icon={<Download className="h-4 w-4" />}
          >
            Exporter
          </SimpleButton>
        </div>
      </div>

      {/* Filtres et recherche */}
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

        {/* Barre de recherche */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Rechercher un étudiant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-3 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
          />
        </div>

        {/* Filtres avancés */}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">État</label>
                  <select
                    value={activeFilter}
                    onChange={(e) => setActiveFilter(e.target.value as 'all' | 'active' | 'inactive')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                  >
                    <option value="all">Tous les états</option>
                    <option value="active">Actifs</option>
                    <option value="inactive">Inactifs</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
                  <select
                    value={levelFilter}
                    onChange={(e) => setLevelFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                  >
                    <option value="all">Tous les niveaux</option>
                    {LEVELS.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Classe</label>
                  <select
                    value={classFilter}
                    onChange={(e) => setClassFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                  >
                    <option value="all">Toutes les classes</option>
                    {CLASSES.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Liste des étudiants */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white border border-gray-200 p-8 text-center">
          <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Aucun étudiant trouvé</h2>
          <p className="text-gray-500">Essayez de modifier vos critères de recherche ou filtres.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Étudiant</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classe</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">État</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student, index) => (
                  <motion.tr 
                    key={student.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          <span className="text-gray-600 font-medium">
                            {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{student.lastName} {student.firstName}</div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="primary">{student.level}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="warning">
                        <GraduationCap className="inline h-3 w-3 mr-1" />
                        {student.class}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <SimpleToggle 
                        isActive={student.active} 
                        onToggle={() => onToggleActive(student.id)}
                        activeLabel="Actif"
                        inactiveLabel="Inactif"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => onViewDetails(student)}
                          className="p-2 text-gray-600 hover:text-navy hover:bg-navy-light border border-gray-300 hover:border-navy transition-colors duration-200"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
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
  students: StudentItem[];
}> = ({ students }) => {
  // Statistiques liées aux mémoires
  const totalDossiers = mockDossiers.length;
  const dossiersEnCours = mockDossiers.filter(d => 
    d.statut === StatutDossierMemoire.EN_CREATION || 
    d.statut === StatutDossierMemoire.EN_COURS
  ).length;
  const dossiersValides = mockDossiers.filter(d => 
    d.statut === StatutDossierMemoire.VALIDE
  ).length;
  const dossiersSoutenus = mockDossiers.filter(d => 
    d.statut === StatutDossierMemoire.SOUTENU
  ).length;
  const dossiersEnAttenteValidation = mockDossiers.filter(d => 
    d.statut === StatutDossierMemoire.EN_ATTENTE_VALIDATION
  ).length;

  // Étudiants avec dossier actif
  const etudiantsAvecDossierActif = students.filter(s => 
    s.idCandidat && getDossierEnCoursByCandidat(s.idCandidat)
  ).length;

  // Répartition par statut
  const statutStats = [
    { name: 'En création', count: mockDossiers.filter(d => d.statut === StatutDossierMemoire.EN_CREATION).length, color: 'bg-gray-500' },
    { name: 'En cours', count: mockDossiers.filter(d => d.statut === StatutDossierMemoire.EN_COURS).length, color: 'bg-blue-500' },
    { name: 'En attente validation', count: dossiersEnAttenteValidation, color: 'bg-yellow-500' },
    { name: 'Validés', count: dossiersValides, color: 'bg-green-500' },
    { name: 'Déposés', count: mockDossiers.filter(d => d.statut === StatutDossierMemoire.DEPOSE).length, color: 'bg-purple-500' },
    { name: 'Soutenus', count: dossiersSoutenus, color: 'bg-indigo-500' }
  ].filter(stat => stat.count > 0);

  return (
    <div className="space-y-6">
      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: "Total Dossiers", value: totalDossiers, icon: FileText, color: "bg-navy-light text-navy" },
          { title: "Dossiers en cours", value: dossiersEnCours, icon: Clock, color: "bg-blue-100 text-blue-600" },
          { title: "Dossiers validés", value: dossiersValides, icon: CheckCircle, color: "bg-green-100 text-green-600" },
          { title: "Dossiers soutenus", value: dossiersSoutenus, icon: Award, color: "bg-purple-100 text-purple-600" }
        ].map((stat, index) => (
          <div key={stat.title} className="bg-white border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 mr-4 rounded-lg`}>
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

      {/* Statistiques supplémentaires */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par statut</h3>
          <div className="space-y-3">
            {statutStats.map(stat => {
              const percentage = totalDossiers > 0 ? Math.round((stat.count / totalDossiers) * 100) : 0;
              return (
                <div key={stat.name} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{stat.name}</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 h-2 mr-3 rounded">
                      <div 
                        className={`${stat.color} h-2 rounded`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-12 text-right">{stat.count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Étudiants avec dossier actif</h3>
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{etudiantsAvecDossierActif}</div>
              <div className="text-sm text-gray-500">sur {students.length} étudiants</div>
              <div className="text-xs text-gray-400 mt-2">
                {students.length > 0 ? Math.round((etudiantsAvecDossierActif / students.length) * 100) : 0}% ont un dossier actif
                    </div>
                  </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Formulaire d'ajout/modification
const AddStudentTab: React.FC<{
  studentToEdit?: StudentItem | null;
  onEditComplete?: () => void;
}> = ({ studentToEdit, onEditComplete }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    class: '',
    level: '',
    registrationDate: new Date().toISOString().split('T')[0],
    phoneNumber: '',
    address: '',
    active: true
  });

  const isEditing = Boolean(studentToEdit);
  
  // Pré-remplir le formulaire quand on édite
  React.useEffect(() => {
    if (studentToEdit) {
      setFormData({
        firstName: studentToEdit.firstName,
        lastName: studentToEdit.lastName,
        email: studentToEdit.email,
        class: studentToEdit.class,
        level: studentToEdit.level,
        registrationDate: studentToEdit.registrationDate,
        phoneNumber: studentToEdit.phoneNumber || '',
        address: studentToEdit.address || '',
        active: studentToEdit.active
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        class: '',
        level: '',
        registrationDate: new Date().toISOString().split('T')[0],
        phoneNumber: '',
        address: '',
        active: true
      });
    }
  }, [studentToEdit]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Définir le niveau automatiquement selon la classe
  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const className = e.target.value;
    let level = '';
    
    if (className.includes('L1')) {
      level = 'Licence 1';
    } else if (className.includes('L2')) {
      level = 'Licence 2';
    } else if (className.includes('L3')) {
      level = 'Licence 3';
    } else if (className.includes('M1')) {
      level = 'Master 1';
    } else if (className.includes('M2')) {
      level = 'Master 2';
    }
    
    setFormData(prevData => ({
      ...prevData,
      class: className,
      level: level
    }));
  };
  
  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    alert(`Étudiant ${isEditing ? 'modifié' : 'créé'} avec succès !`);
    
    if (isEditing && onEditComplete) {
      onEditComplete();
    }
    
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      class: '',
      level: '',
      registrationDate: new Date().toISOString().split('T')[0],
      phoneNumber: '',
      address: '',
      active: true
    });
  };

  return (
    <div className="bg-white border border-gray-200 p-6">
      {isEditing && (
        <div className="mb-6 p-4 bg-navy-light border border-navy-light">
          <div className="flex items-center">
            <Edit className="h-5 w-5 text-navy mr-2" />
            <p className="text-navy-dark font-medium">Mode édition : {studentToEdit?.firstName} {studentToEdit?.lastName}</p>
          </div>
        </div>
      )}
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom *
            </label>
            <input
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Ex: Diop"
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prénom *
            </label>
            <input
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Ex: Amadou"
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ex: amadou.diop@student.edu.sn"
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Téléphone
            </label>
            <input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Ex: +221 77 123 45 67"
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Classe *
            </label>
            <select
              name="class"
              value={formData.class}
              onChange={handleClassChange}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
              required
            >
              <option value="">Sélectionner une classe</option>
              {CLASSES.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Niveau
            </label>
            <input
              name="level"
              value={formData.level}
              onChange={handleChange}
              placeholder="Ex: Licence 1"
              className="w-full px-3 py-2 border border-gray-300 bg-gray-50 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">
              Le niveau est automatiquement défini selon la classe choisie
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date d'inscription *
            </label>
            <input
              name="registrationDate"
              type="date"
              value={formData.registrationDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
              required
            />
          </div>
          
          <div className="flex items-center">
            <input
              name="active"
              type="checkbox"
              checked={formData.active}
              onChange={handleChange}
              className="h-4 w-4 text-navy focus:ring-navy border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Étudiant actif
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adresse
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Adresse complète..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
          />
        </div>
        
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          {isEditing && (
            <SimpleButton
              type="button"
              variant="secondary"
              onClick={onEditComplete}
            >
              Annuler
            </SimpleButton>
          )}
          <SimpleButton
            type="button"
            variant="primary"
            onClick={handleSubmit}
          >
            {isEditing ? 'Modifier l\'étudiant' : 'Créer l\'étudiant'}
          </SimpleButton>
        </div>
      </div>
    </div>
  );
};

const StudentsChef: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'stats'>('list');
  
  // États pour la modal
  const [selectedStudent, setSelectedStudent] = useState<StudentItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [studentsState, setStudentsState] = useState(STUDENTS_DATA);

  // Fonctions pour gérer les étudiants
  const toggleStudentActive = (id: number) => {
    setStudentsState(prev => prev.map(student => 
      student.id === id ? { ...student, active: !student.active } : student
    ));
  };

  // Fonctions pour gérer la modal des détails
  const openStudentDetails = (studentItem: StudentItem) => {
    setSelectedStudent(studentItem);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedStudent(null);
    setIsModalOpen(false);
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <div className="flex items-center">
            <div className="bg-navy-light rounded-full p-3 mr-4">
              <User className="h-7 w-7 text-navy" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Étudiants</h1>
              <p className="text-sm text-gray-500 mt-1">
                Gérez les étudiants, inscriptions et informations personnelles
              </p>
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div className="bg-white border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <TabButton
                isActive={activeTab === 'list'}
                onClick={() => setActiveTab('list')}
                icon={<FileText className="h-4 w-4" />}
              >
                Liste des étudiants
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

          {/* Contenu des onglets */}
          <div className="p-6">
            {activeTab === 'list' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <StudentListTab 
                  students={studentsState}
                  onToggleActive={toggleStudentActive}
                  onViewDetails={openStudentDetails}
                />
              </motion.div>
            )}

            {activeTab === 'stats' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <StatisticsTab students={studentsState} />
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Modal des détails */}
        <StudentDetailsModal 
          studentItem={selectedStudent}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      </div>
    </div>
  );
};

export default StudentsChef;