import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Search, Filter, Plus, 
  Edit, Trash2, Eye, Calendar, Users,
  X, BookOpen, Target, Save, Info, Download, User
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Types et interfaces
interface EtudiantSujet {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  numeroEtudiant: string;
  dateAttribution: string;
  documentMemoire?: {
    id: number;
    titre: string;
    cheminFichier: string;
    dateDepot: string;
    tailleFichier: number;
    format: string;
  };
}

interface Sujet {
  id: number;
  titre: string;
  description: string;
  type: 'memoire'; // Toujours mémoire
  niveau: string; // Toujours Licence 3
  departement: string; // Toujours Génie Informatique
  filieres: string[]; // GL, Multimedia, IAGE, GDA
  nombreMaxEtudiants: number;
  nombreEtudiantsActuels: number;
  statut: 'brouillon' | 'soumis' | 'rejete';
  dateSoumission?: string;
  dateApprobation?: string;
  anneeAcademique: string;
  motsCles: string[];
  prerequis: string;
  objectifs: string;
  dateCreation: string;
  dateModification: string;
  professeurId: number;
  professeurNom: string;
  etudiants?: EtudiantSujet[];
}

// Données mockées
const TOUS_LES_SUJETS: Sujet[] = [
  {
    id: 1,
    titre: "Intelligence Artificielle pour la Détection de Fraudes",
    description: "Développement d'un système de détection de fraudes utilisant des algorithmes d'apprentissage automatique et de deep learning.",
    type: "memoire",
    niveau: "Licence 3",
    departement: "Génie Informatique",
    filieres: ["GL", "IAGE"],
    nombreMaxEtudiants: 2,
    nombreEtudiantsActuels: 1,
    statut: "soumis",
    dateSoumission: "2024-09-15",
    anneeAcademique: "2024-2025",
    motsCles: ["IA", "Machine Learning", "Sécurité", "Détection"],
    prerequis: "Bonnes connaissances en Python, statistiques et algorithmes",
    objectifs: "Maîtriser les techniques de ML pour la sécurité informatique",
    dateCreation: "2024-09-10",
    dateModification: "2024-09-15",
    professeurId: 1,
    professeurNom: "Prof. Martin Dubois",
    etudiants: [
      {
        id: 1,
        nom: "Diallo",
        prenom: "Amadou",
        email: "amadou.diallo@isi.edu.sn",
        numeroEtudiant: "ETU2024001",
        dateAttribution: "2024-09-25",
        documentMemoire: {
          id: 1,
          titre: "Mémoire - Intelligence Artificielle pour la Détection de Fraudes",
          cheminFichier: "/assets/documents/Memoire_Final_Corrigé.pdf",
          dateDepot: "2024-11-15",
          tailleFichier: 2548793,
          format: "pdf"
        }
      }
    ]
  },
  {
    id: 2,
    titre: "Application Mobile de Gestion de Bibliothèque",
    description: "Conception et développement d'une application mobile cross-platform pour la gestion automatisée d'une bibliothèque universitaire.",
    type: "memoire",
    niveau: "Licence 3",
    departement: "Génie Informatique",
    filieres: ["GL", "Multimedia"],
    nombreMaxEtudiants: 3,
    nombreEtudiantsActuels: 3,
    statut: "soumis",
    dateSoumission: "2024-10-01",
    dateApprobation: "2024-10-05",
    anneeAcademique: "2024-2025",
    motsCles: ["Mobile", "React Native", "Base de données", "UX/UI"],
    prerequis: "Connaissances en développement mobile et bases de données",
    objectifs: "Développer une solution mobile complète",
    dateCreation: "2024-09-25",
    dateModification: "2024-10-01",
    professeurId: 2,
    professeurNom: "Prof. Sophie Martin",
    etudiants: [
      {
        id: 2,
        nom: "Ndiaye",
        prenom: "Fatou",
        email: "fatou.ndiaye@isi.edu.sn",
        numeroEtudiant: "ETU2024002",
        dateAttribution: "2024-10-10",
        documentMemoire: {
          id: 2,
          titre: "Rapport de Projet - Application Mobile Bibliothèque",
          cheminFichier: "/assets/documents/doc.pdf",
          dateDepot: "2024-11-10",
          tailleFichier: 1856234,
          format: "pdf"
        }
      },
      {
        id: 3,
        nom: "Ba",
        prenom: "Ibrahima",
        email: "ibrahima.ba@isi.edu.sn",
        numeroEtudiant: "ETU2024003",
        dateAttribution: "2024-10-10",
        documentMemoire: {
          id: 3,
          titre: "Rapport de Projet - Application Mobile Bibliothèque",
          cheminFichier: "/assets/documents/Memoire_Final_Corrigé.pdf",
          dateDepot: "2024-11-12",
          tailleFichier: 1923456,
          format: "pdf"
        }
      },
      {
        id: 4,
        nom: "Sarr",
        prenom: "Aissatou",
        email: "aissatou.sarr@isi.edu.sn",
        numeroEtudiant: "ETU2024004",
        dateAttribution: "2024-10-10",
        documentMemoire: {
          id: 4,
          titre: "Rapport de Projet - Application Mobile Bibliothèque",
          cheminFichier: "/assets/documents/doc.pdf",
          dateDepot: "2024-11-14",
          tailleFichier: 1789123,
          format: "pdf"
        }
      }
    ]
  },
  {
    id: 3,
    titre: "Optimisation des Réseaux de Neurones pour IoT",
    description: "Recherche sur l'optimisation des architectures de réseaux de neurones pour les dispositifs IoT avec contraintes de ressources.",
    type: "memoire",
    niveau: "Licence 3",
    departement: "Génie Informatique",
    filieres: ["GL", "IAGE", "GDA"],
    nombreMaxEtudiants: 1,
    nombreEtudiantsActuels: 1,
    statut: "soumis",
    dateSoumission: "2024-11-10",
    dateApprobation: "2024-11-15",
    anneeAcademique: "2024-2025",
    motsCles: ["IoT", "Réseaux de neurones", "Optimisation", "Edge Computing"],
    prerequis: "Solides bases en IA et programmation embarquée",
    objectifs: "Optimiser les performances des IA sur dispositifs contraints",
    dateCreation: "2024-11-05",
    dateModification: "2024-11-10",
    professeurId: 1,
    professeurNom: "Prof. Martin Dubois",
    etudiants: [
      {
        id: 5,
        nom: "Kane",
        prenom: "Moussa",
        email: "moussa.kane@isi.edu.sn",
        numeroEtudiant: "ETU2024005",
        dateAttribution: "2024-11-20",
        documentMemoire: {
          id: 5,
          titre: "Mémoire - Optimisation des Réseaux de Neurones pour IoT",
          cheminFichier: "/assets/documents/Memoire_Final_Corrigé.pdf",
          dateDepot: "2024-12-10",
          tailleFichier: 3124567,
          format: "pdf"
        }
      }
    ]
  },
  {
    id: 4,
    titre: "Stage en Cybersécurité - Audit de Sécurité",
    description: "Stage de 6 mois dans une entreprise spécialisée en cybersécurité pour réaliser des audits de sécurité et tests de pénétration.",
    type: "memoire",
    niveau: "Licence 3",
    departement: "Génie Informatique",
    filieres: ["GL"],
    nombreMaxEtudiants: 1,
    nombreEtudiantsActuels: 1,
    statut: "soumis",
    dateSoumission: "2024-08-20",
    dateApprobation: "2024-08-25",
    anneeAcademique: "2024-2025",
    motsCles: ["Cybersécurité", "Audit", "Pentesting", "Entreprise"],
    prerequis: "Certification en sécurité informatique souhaitée",
    objectifs: "Acquérir une expérience professionnelle en cybersécurité",
    dateCreation: "2024-08-15",
    dateModification: "2024-08-20",
    professeurId: 3,
    professeurNom: "Prof. Jean Dupont",
    etudiants: [
      {
        id: 6,
        nom: "Thiam",
        prenom: "Awa",
        email: "awa.thiam@isi.edu.sn",
        numeroEtudiant: "ETU2024006",
        dateAttribution: "2024-09-01",
        documentMemoire: {
          id: 6,
          titre: "Rapport de Stage - Cybersécurité et Audit de Sécurité",
          cheminFichier: "/assets/documents/doc.pdf",
          dateDepot: "2024-12-05",
          tailleFichier: 4289123,
          format: "pdf"
        }
      }
    ]
  },
  {
    id: 5,
    titre: "Blockchain pour la Traçabilité Alimentaire",
    description: "Conception d'une solution blockchain pour assurer la traçabilité des produits alimentaires de la production à la consommation.",
    type: "memoire",
    niveau: "Licence 3",
    departement: "Génie Informatique",
    filieres: ["IAGE", "GDA"],
    nombreMaxEtudiants: 2,
    nombreEtudiantsActuels: 0,
    statut: "brouillon",
    anneeAcademique: "2024-2025",
    motsCles: ["Blockchain", "Traçabilité", "Smart Contracts", "Supply Chain"],
    prerequis: "Connaissances en blockchain et cryptographie",
    objectifs: "Maîtriser la technologie blockchain appliquée à l'industrie",
    dateCreation: "2024-11-15",
    dateModification: "2024-11-18",
    professeurId: 1,
    professeurNom: "Prof. Martin Dubois"
  }
];

const FILIERES = ["GL", "Multimedia", "IAGE", "GDA"];

// Composants utilitaires
const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'approuve' | 'soumis' | 'brouillon' | 'rejete' | 'info' | 'primary';
  className?: string;
}> = ({ children, variant = 'info', className = '' }) => {
  const styles = {
    approuve: "bg-blue-50 text-blue-700 border border-blue-200",
    soumis: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    brouillon: "bg-gray-50 text-gray-700 border border-gray-200",
    rejete: "bg-red-50 text-red-600 border border-red-200",
    info: "bg-gray-50 text-gray-700 border border-gray-200",
    primary: "bg-blue-50 text-blue-700 border border-blue-200"
  };
  
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: React.ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit';
}> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  icon,
  disabled = false,
  type = 'button'
}) => {
  const styles = {
    primary: `bg-navy text-white border border-navy hover:bg-navy-dark ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    secondary: `bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    ghost: `bg-transparent text-gray-600 border border-transparent hover:bg-gray-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
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

// Modal pour voir les détails d'un sujet
const ModalDetailsSujet: React.FC<{
  sujet: Sujet | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ sujet, isOpen, onClose }) => {
  if (!isOpen || !sujet) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{sujet.titre}</h2>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={sujet.statut}>
                  {sujet.statut === 'soumis' ? 'Soumis' : 
                   sujet.statut === 'brouillon' ? 'Brouillon' : 'Rejeté'}
                </Badge>
                <Badge variant="primary">{sujet.niveau}</Badge>
                {sujet.filieres && sujet.filieres.length > 0 && (
                  <>
                    {sujet.filieres.map((filiere, index) => (
                      <Badge key={index} variant="info">{filiere}</Badge>
                    ))}
                  </>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{sujet.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Objectifs</h3>
                <p className="text-gray-700 leading-relaxed">{sujet.objectifs}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Prérequis</h3>
                <p className="text-gray-700 leading-relaxed">{sujet.prerequis}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Mots-clés</h3>
                <div className="flex flex-wrap gap-2">
                  {sujet.motsCles.map((mot, index) => (
                    <span
                      key={index}
                      className="inline-flex px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700"
                    >
                      {mot}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 border border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Département</label>
                    <p className="text-gray-900">{sujet.departement}</p>
                  </div>
                  {sujet.filieres && sujet.filieres.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Filières</label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {sujet.filieres.map((filiere, index) => (
                          <Badge key={index} variant="info" className="text-xs">{filiere}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Professeur</label>
                    <p className="text-gray-900">{sujet.professeurNom}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Année académique</label>
                    <p className="text-gray-900">{sujet.anneeAcademique}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Date de création</label>
                    <p className="text-gray-900">{sujet.dateCreation}</p>
                  </div>
                  {sujet.dateSoumission && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Date de soumission</label>
                      <p className="text-gray-900">{sujet.dateSoumission}</p>
                    </div>
                  )}
                  {sujet.dateApprobation && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Date d'approbation</label>
                      <p className="text-gray-900">{sujet.dateApprobation}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Utilisations</h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {sujet.nombreEtudiantsActuels}
                  </div>
                  <p className="text-sm text-blue-700">Nombre d'utilisations</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section Étudiants ayant utilisé le sujet */}
          {sujet.etudiants && sujet.etudiants.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Étudiants ayant utilisé ce sujet</h3>
              <div className="space-y-4">
                {sujet.etudiants.map((etudiant) => (
                  <div
                    key={etudiant.id}
                    className="bg-gray-50 border border-gray-200 p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="w-10 h-10 bg-navy text-white rounded-full flex items-center justify-center font-semibold">
                          {etudiant.prenom[0]}{etudiant.nom[0]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">
                              {etudiant.prenom} {etudiant.nom}
                            </h4>
                            <Badge variant="info" className="text-xs">
                              {etudiant.numeroEtudiant}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{etudiant.email}</p>
                          <p className="text-xs text-gray-500">
                            Attribué le {etudiant.dateAttribution}
                          </p>
                          {etudiant.documentMemoire && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <FileText className="h-4 w-4 text-blue-600" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {etudiant.documentMemoire.titre}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      Déposé le {etudiant.documentMemoire.dateDepot} • 
                                      {(etudiant.documentMemoire.tailleFichier / 1024 / 1024).toFixed(2)} Mo • 
                                      {etudiant.documentMemoire.format.toUpperCase()}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  variant="primary"
                                  onClick={() => {
                                    // Simuler le téléchargement/consultation
                                    window.open(etudiant.documentMemoire!.cheminFichier, '_blank');
                                  }}
                                  icon={<Eye className="h-4 w-4" />}
                                >
                                  Consulter
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(!sujet.etudiants || sujet.etudiants.length === 0) && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Étudiants ayant utilisé ce sujet</h3>
              <div className="bg-gray-50 border border-gray-200 p-8 text-center">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600">Aucun étudiant n'a encore utilisé ce sujet</p>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="secondary"
              onClick={onClose}
            >
              Fermer
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Modal pour soumettre un nouveau sujet
const ModalNouveauSujet: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sujet: Omit<Sujet, 'id' | 'dateCreation' | 'dateModification' | 'professeurId' | 'professeurNom'>) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    filieres: [] as string[],
    motsCles: '',
    prerequis: '',
    objectifs: '',
    anneeAcademique: '2024-2025',
    statut: 'brouillon' as 'brouillon' | 'soumis'
  });

  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFiliereChange = (filiere: string) => {
    setFormData(prev => ({
      ...prev,
      filieres: prev.filieres.includes(filiere)
        ? prev.filieres.filter(f => f !== filiere)
        : [...prev.filieres, filiere]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titre || !formData.description || !formData.objectifs || !formData.prerequis || formData.filieres.length === 0) {
      setAlertMessage('Veuillez remplir tous les champs obligatoires et sélectionner au moins une filière.');
      setShowAlertModal(true);
      return;
    }

    const nouveauSujet = {
      type: 'memoire' as const,
      niveau: 'Licence 3',
      departement: 'Génie Informatique',
      ...formData,
      statut: 'soumis' as 'brouillon' | 'soumis',
      nombreMaxEtudiants: 0, // Non utilisé mais gardé pour compatibilité
      nombreEtudiantsActuels: 0,
      motsCles: formData.motsCles.split(',').map(m => m.trim()).filter(m => m.length > 0),
      dateSoumission: new Date().toISOString().split('T')[0],
      dateApprobation: undefined
    };

    onSubmit(nouveauSujet);
    setFormData({
      titre: '',
      description: '',
      filieres: [],
      motsCles: '',
      prerequis: '',
      objectifs: '',
      anneeAcademique: '2024-2025',
      statut: 'brouillon'
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Nouveau sujet</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre du sujet *
                    </label>
                    <input
                      name="titre"
                      value={formData.titre}
                      onChange={handleChange}
                      placeholder="Ex: Intelligence Artificielle pour la Détection de Fraudes"
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Filières * (sélectionnez au moins une)
                    </label>
                    <div className="space-y-2 border border-gray-300 p-3">
                      {FILIERES.map(filiere => (
                        <label key={filiere} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.filieres.includes(filiere)}
                            onChange={() => handleFiliereChange(filiere)}
                            className="w-4 h-4 text-navy border-gray-300 focus:ring-navy"
                          />
                          <span className="text-sm text-gray-700">{filiere}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mots-clés (séparés par des virgules)
                    </label>
                    <input
                      name="motsCles"
                      value={formData.motsCles}
                      onChange={handleChange}
                      placeholder="Ex: IA, Machine Learning, Sécurité"
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Description détaillée du sujet..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Objectifs *
                    </label>
                    <textarea
                      name="objectifs"
                      value={formData.objectifs}
                      onChange={handleChange}
                      placeholder="Objectifs pédagogiques et compétences à acquérir..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prérequis *
                    </label>
                    <textarea
                      name="prerequis"
                      value={formData.prerequis}
                      onChange={handleChange}
                      placeholder="Connaissances et compétences requises..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                >
                  Annuler
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    if (!formData.titre || !formData.description || !formData.objectifs || !formData.prerequis || formData.filieres.length === 0) {
                      setAlertMessage('Veuillez remplir tous les champs obligatoires et sélectionner au moins une filière.');
                      setShowAlertModal(true);
                      return;
                    }
                    const nouveauSujet = {
                      type: 'memoire' as const,
                      niveau: 'Licence 3',
                      departement: 'Génie Informatique',
                      ...formData,
                      statut: 'brouillon' as 'brouillon' | 'soumis',
                      nombreMaxEtudiants: 0, // Non utilisé mais gardé pour compatibilité
                      nombreEtudiantsActuels: 0,
                      motsCles: formData.motsCles.split(',').map(m => m.trim()).filter(m => m.length > 0),
                      dateSoumission: undefined,
                      dateApprobation: undefined
                    };
                    onSubmit(nouveauSujet);
                    setFormData({
                      titre: '',
                      description: '',
                      filieres: [],
                      motsCles: '',
                      prerequis: '',
                      objectifs: '',
                      anneeAcademique: '2024-2025',
                      statut: 'brouillon'
                    });
                    onClose();
                  }}
                  icon={<Save className="h-4 w-4" />}
                >
                  Sauvegarder brouillon
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  icon={<Target className="h-4 w-4" />}
                >
                  Soumettre le sujet
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Modal d'alerte */}
      <AnimatePresence>
        {showAlertModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white shadow-2xl max-w-md w-full"
            >
              <div className="p-6">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Info className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Information</h3>
                    <p className="text-gray-700 text-sm">{alertMessage}</p>
                  </div>
                  <button
                    onClick={() => setShowAlertModal(false)}
                    className="p-1 hover:bg-gray-100 transition-colors flex-shrink-0"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
                <div className="flex justify-end mt-6">
                  <Button
                    onClick={() => setShowAlertModal(false)}
                    variant="primary"
                  >
                    Compris
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

// Composant principal
const Sujets: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'mes-sujets' | 'sujets-disponibles'>('mes-sujets');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filiereFilter, setFiliereFilter] = useState<string>('all');
  const [selectedSujet, setSelectedSujet] = useState<Sujet | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalNouveauSujetOpen, setIsModalNouveauSujetOpen] = useState(false);
  
  // Simuler l'ID du professeur connecté (dans un vrai app, cela viendrait de l'auth)
  const professeurId = 1; // user?.id ou similaire
  
  const [sujets, setSujets] = useState(TOUS_LES_SUJETS);

  // Filtrer les sujets selon l'onglet actif
  const mesSujets = sujets.filter(s => s.professeurId === professeurId);
  const sujetsDisponibles = sujets.filter(s => s.statut === 'soumis');

  const sujetsAffiches = activeTab === 'mes-sujets' ? mesSujets : sujetsDisponibles;

  const filteredSujets = sujetsAffiches.filter(sujet => {
    const matchesSearch = sujet.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sujet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sujet.motsCles.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFiliere = filiereFilter === 'all' || (sujet.filieres && sujet.filieres.includes(filiereFilter));
    
    return matchesSearch && matchesFiliere;
  });

  const openSujetDetails = (sujet: Sujet) => {
    // Récupérer le sujet complet avec tous ses étudiants depuis la liste originale
    const sujetComplet = sujets.find(s => s.id === sujet.id) || sujet;
    setSelectedSujet(sujetComplet);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedSujet(null);
    setIsModalOpen(false);
  };

  const handleNouveauSujet = (nouveauSujet: Omit<Sujet, 'id' | 'dateCreation' | 'dateModification' | 'professeurId' | 'professeurNom'>) => {
    const sujetComplet: Sujet = {
      ...nouveauSujet,
      id: Math.max(...sujets.map(s => s.id), 0) + 1,
      dateCreation: new Date().toISOString().split('T')[0],
      dateModification: new Date().toISOString().split('T')[0],
      professeurId: professeurId,
      professeurNom: user?.name || 'Prof. Inconnu'
    };
    
    setSujets([...sujets, sujetComplet]);
    setIsModalNouveauSujetOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Sujets</h1>
              <p className="text-gray-600">Gérez vos sujets de mémoires, projets et stages</p>
            </div>
            <Button
              variant="primary"
              onClick={() => setIsModalNouveauSujetOpen(true)}
              icon={<Plus className="h-4 w-4" />}
            >
              Nouveau sujet
            </Button>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="bg-white border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('mes-sujets')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'mes-sujets'
                    ? 'border-navy text-navy'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Mes sujets ({mesSujets.length})
              </button>
              <button
                onClick={() => setActiveTab('sujets-disponibles')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'sujets-disponibles'
                    ? 'border-navy text-navy'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Liste des sujets disponibles ({sujetsDisponibles.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Filtres */}
            <div className="bg-white border border-gray-200 p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
                <div className="relative w-full md:w-1/2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Rechercher un sujet..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                  />
                </div>
                
                <Button
                  variant="ghost"
                  onClick={() => setShowFilters(!showFilters)}
                  icon={<Filter className="h-5 w-5" />}
                >
                  {showFilters ? 'Masquer' : 'Filtres'}
                </Button>
              </div>
              
              <AnimatePresence>
                {showFilters && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Filière</label>
                      <select
                        value={filiereFilter}
                        onChange={(e) => setFiliereFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                      >
                        <option value="all">Toutes les filières</option>
                        {FILIERES.map(filiere => (
                          <option key={filiere} value={filiere}>{filiere}</option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Résultats */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                {filteredSujets.length} sujet{filteredSujets.length !== 1 ? 's' : ''} trouvé{filteredSujets.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Liste des sujets */}
            {filteredSujets.length === 0 ? (
              <div className="bg-white border border-gray-200 p-12 text-center">
                <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Aucun sujet trouvé</h2>
                <p className="text-gray-500">Modifiez vos critères de recherche</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredSujets.map((sujet, index) => {
                  return (
                    <motion.div
                      key={sujet.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{sujet.titre}</h3>
                            <Badge variant={sujet.statut}>
                              {sujet.statut === 'soumis' ? 'Soumis' : 
                               sujet.statut === 'brouillon' ? 'Brouillon' : 'Rejeté'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <Badge variant="primary">{sujet.niveau}</Badge>
                            <Badge variant="info">{sujet.departement}</Badge>
                            {sujet.filieres && sujet.filieres.length > 0 && (
                              <>
                                {sujet.filieres.map((filiere, idx) => (
                                  <Badge key={idx} variant="info">{filiere}</Badge>
                                ))}
                              </>
                            )}
                            {activeTab === 'sujets-disponibles' && (
                              <Badge variant="info">{sujet.professeurNom}</Badge>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{sujet.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              <span>{sujet.nombreEtudiantsActuels} utilisation{sujet.nombreEtudiantsActuels > 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>Créé le {sujet.dateCreation}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="ml-6 text-center">
                          <div className="bg-blue-50 border border-blue-200 p-4">
                            <div className="text-2xl font-bold text-blue-600 mb-1">
                              {sujet.nombreEtudiantsActuels}
                            </div>
                            <div className="text-xs text-blue-700">Utilisations</div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {sujet.motsCles.slice(0, 4).map((mot, idx) => (
                            <span
                              key={idx}
                              className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600"
                            >
                              {mot}
                            </span>
                          ))}
                          {sujet.motsCles.length > 4 && (
                            <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600">
                              +{sujet.motsCles.length - 4}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
                        <Button
                          variant="ghost"
                          onClick={() => openSujetDetails(sujet)}
                          icon={<Eye className="h-4 w-4" />}
                        >
                          Détails
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal des détails */}
        <ModalDetailsSujet 
          sujet={selectedSujet}
          isOpen={isModalOpen}
          onClose={closeModal}
        />

        {/* Modal nouveau sujet */}
        <ModalNouveauSujet
          isOpen={isModalNouveauSujetOpen}
          onClose={() => setIsModalNouveauSujetOpen(false)}
          onSubmit={handleNouveauSujet}
        />
      </div>
    </div>
  );
};

export default Sujets;

