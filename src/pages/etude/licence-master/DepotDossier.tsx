import React, { useState, useRef } from 'react';
import { 
  FiUpload, 
  FiFile, 
  FiUser, 
  FiCalendar, 
  FiCheckCircle, 
  FiAlertCircle,
  FiX,
  FiSearch,
  FiBook,
  FiBriefcase,
  FiInfo,
  FiMail,
  FiUsers,
  FiCpu,
  FiZap,
  FiTarget,
  FiTrendingUp,
  FiCode,
  FiDatabase,
  FiShield,
  FiSmartphone,
  FiSettings,
  FiRefreshCw,
  FiStar,
  FiHeart,
  FiClock,
  FiArrowRight,
  FiLayers,
  FiAward
} from 'react-icons/fi';

// TypeScript interfaces
interface User {
  name: string;
  email: string;
  niveau: string;
  numero: string;
  departement: string;
  formation: string;
}

interface Encadrant {
  id: number;
  name: string;
  email: string;
  departement: string;
  specialites: string[];
  nb_encadrements?: number;
  taux_reussite?: number;
}

interface Sujet {
  id: number;
  titre: string;
  encadreur: string;
  formation: string;
  type: string;
  description: string;
  competences: string[];
  niveau: string[];
  places_disponibles: number;
  date_publication: string;
  difficulte: string;
  score_matching?: number;
}

interface Memoire {
  titre: string;
  description: string;
  mots_cles: string;
  file: File | null;
}

interface Fiche {
  encadreur: string;
  sujet: string;
  sujet_propose_id: string;
  sujet_custom: string;
  description: string;
  objectifs: string;
  methodologie: string;
  type_travail: string;
  binome_nom: string;
  binome_email: string;
  duree_prevue: string;
  date_debut: string;
  date_fin_prevue: string;
}

interface IAPreferences {
  domaines: string[];
  competences: string[];
  difficulte: string;
  duree: string;
  type_projet: string;
  interets: string;
}

interface DomaineOption {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

// Simulation du contexte d'authentification
const useAuth = (): { user: User } => ({
  user: {
    name: 'Amadou Diallo',
    email: 'amadou.diallo@etudiant.sn',
    niveau: 'Master 2',
    numero: 'M2021001',
    departement: 'Informatique',
    formation: 'Génie Informatique'
  }
});

const mockEncadrants: Encadrant[] = [
  { 
    id: 1, 
    name: 'Pr. Abdoulaye Ndiaye', 
    email: 'a.ndiaye@univ.sn',
    departement: 'Informatique',
    specialites: ['Intelligence Artificielle', 'Réseaux'],
    nb_encadrements: 15,
    taux_reussite: 92
  },
  { 
    id: 2, 
    name: 'Dr. Fatou Diop', 
    email: 'f.diop@univ.sn',
    departement: 'Informatique',
    specialites: ['Bases de données', 'Systèmes distribués'],
    nb_encadrements: 12,
    taux_reussite: 88
  },
  { 
    id: 3, 
    name: 'Pr. Moussa Sarr', 
    email: 'm.sarr@univ.sn',
    departement: 'Informatique',
    specialites: ['Sécurité informatique', 'Cryptographie'],
    nb_encadrements: 20,
    taux_reussite: 95
  },
  { 
    id: 4, 
    name: 'Dr. Mariama Ba', 
    email: 'm.ba@univ.sn',
    departement: 'Informatique',
    specialites: ['Génie logiciel', 'Architecture logicielle'],
    nb_encadrements: 8,
    taux_reussite: 90
  },
  { 
    id: 5, 
    name: 'Pr. Ibrahima Kane', 
    email: 'i.kane@univ.sn',
    departement: 'Informatique',
    specialites: ['Systèmes embarqués', 'IoT'],
    nb_encadrements: 10,
    taux_reussite: 87
  },
];

const mockFormations: string[] = [
  'Génie Informatique',
  'Réseaux et Télécommunications',
  'Sécurité des Systèmes d\'Information',
  'Intelligence Artificielle',
  'Développement Web et Mobile',
  'Systèmes Embarqués'
];

const mockSujets: Sujet[] = [
  {
    id: 1,
    titre: 'Développement d\'une plateforme e-learning avec IA adaptative',
    encadreur: 'Pr. Abdoulaye Ndiaye',
    formation: 'Génie Informatique',
    type: 'professeur',
    description: 'Conception et développement d\'une plateforme d\'apprentissage en ligne intégrant des algorithmes d\'IA pour personnaliser l\'expérience utilisateur.',
    competences: ['React.js', 'Node.js', 'Machine Learning', 'MongoDB'],
    niveau: ['Licence', 'Master'],
    places_disponibles: 2,
    date_publication: '2024-01-15',
    difficulte: 'Intermédiaire'
  },
  {
    id: 2,
    titre: 'Sécurisation des communications IoT par blockchain',
    encadreur: 'Pr. Moussa Sarr',
    formation: 'Sécurité des Systèmes d\'Information',
    type: 'professeur',
    description: 'Étude et implémentation de mécanismes de sécurité basés sur la blockchain pour les communications dans l\'Internet des Objets.',
    competences: ['Blockchain', 'Cryptographie', 'IoT', 'Python'],
    niveau: ['Master'],
    places_disponibles: 1,
    date_publication: '2024-01-20',
    difficulte: 'Avancé'
  },
  {
    id: 3,
    titre: 'Système de reconnaissance faciale en temps réel',
    encadreur: 'IA Assistant',
    formation: 'Intelligence Artificielle',
    type: 'ia',
    description: 'Développement d\'un système de reconnaissance faciale utilisant des réseaux de neurones convolutifs avec traitement en temps réel.',
    competences: ['Deep Learning', 'OpenCV', 'Python', 'TensorFlow'],
    niveau: ['Licence', 'Master'],
    places_disponibles: 99,
    date_publication: '2024-02-01',
    difficulte: 'Intermédiaire'
  }
];

const DepotDossier = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState<'consultation' | 'fiche' | 'memoire'>('consultation');
  const [currentStep, setCurrentStep] = useState(1);
  
  // États pour le mémoire
  const [memoire, setMemoire] = useState<Memoire>({
    titre: '',
    description: '',
    mots_cles: '',
    file: null
  });

  // États pour la fiche de dépôt
  const [fiche, setFiche] = useState<Fiche>({
    encadreur: '',
    sujet: '',
    sujet_propose_id: '',
    sujet_custom: '',
    description: '',
    objectifs: '',
    methodologie: '',
    type_travail: 'individuel',
    binome_nom: '',
    binome_email: '',
    duree_prevue: '',
    date_debut: '',
    date_fin_prevue: ''
  });

  // États pour la consultation des sujets
  const [filtreFormation, setFiltreFormation] = useState('');
  const [filtreType, setFiltreType] = useState('');
  const [filtreNiveau, setFiltreNiveau] = useState('');
  const [rechercheTexte, setRechercheTexte] = useState('');
  const [sujetSelectionne, setSujetSelectionne] = useState<Sujet | null>(null);

  // États pour l'IA
  const [showIAModal, setShowIAModal] = useState(false);
  const [showEncadrantModal, setShowEncadrantModal] = useState(false);
  const [iaPreferences, setIaPreferences] = useState<IAPreferences>({
    domaines: [],
    competences: [],
    difficulte: '',
    duree: '',
    type_projet: '',
    interets: ''
  });
  const [sujetsIA, setSujetsIA] = useState<Sujet[]>([]);
  const [encadrantsIA, setEncadrantsIA] = useState<Encadrant[]>([]);
  const [loadingIA, setLoadingIA] = useState(false);
  const [typeChoixSujet, setTypeChoixSujet] = useState<'propose' | 'custom'>('propose');

  const [search, setSearch] = useState('');
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isLicence = user?.niveau?.includes('Licence');
  const isMaster = user?.niveau?.includes('Master');

  const filteredEncadrants = mockEncadrants.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.specialites.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  const selectedEncadreur = mockEncadrants.find(e => e.name === fiche.encadreur);

  // Filtrage des sujets pour la consultation
  const sujetsFiltres = mockSujets.filter(sujet => {
    const matchFormation = !filtreFormation || sujet.formation === filtreFormation;
    const matchType = !filtreType || sujet.type === filtreType;
    const matchNiveau = !filtreNiveau || sujet.niveau.includes(filtreNiveau);
    const matchTexte = !rechercheTexte || 
      sujet.titre.toLowerCase().includes(rechercheTexte.toLowerCase()) ||
      sujet.description.toLowerCase().includes(rechercheTexte.toLowerCase()) ||
      sujet.competences.some(c => c.toLowerCase().includes(rechercheTexte.toLowerCase()));
    
    return matchFormation && matchType && matchNiveau && matchTexte;
  });

  // Sujets proposés par l'encadreur sélectionné
  const sujetsEncadreur = mockSujets.filter(s => s.encadreur === fiche.encadreur);

  const domainesOptions: DomaineOption[] = [
    { id: 'ia', label: 'Intelligence Artificielle', icon: FiCpu },
    { id: 'web', label: 'Développement Web', icon: FiCode },
    { id: 'mobile', label: 'Développement Mobile', icon: FiSmartphone },
    { id: 'securite', label: 'Cybersécurité', icon: FiShield },
    { id: 'reseaux', label: 'Réseaux', icon: FiSettings },
    { id: 'donnees', label: 'Science des Données', icon: FiDatabase },
    { id: 'embarque', label: 'Systèmes Embarqués', icon: FiCpu },
  ];

  const competencesOptions = [
    'Python', 'JavaScript', 'React', 'Node.js', 'Java', 'C++', 'PHP',
    'Machine Learning', 'Deep Learning', 'Blockchain', 'Cloud Computing',
    'DevOps', 'UI/UX', 'Base de données', 'API REST', 'Microservices'
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (mode === 'fiche') {
      switch(step) {
        case 1:
          if (!fiche.encadreur) newErrors.encadreur = 'Veuillez sélectionner un encadreur';
          if (!fiche.sujet.trim()) newErrors.sujet = 'Le sujet est requis';
          if (!fiche.description.trim()) newErrors.description = 'La description est requise';
          break;
        case 2:
          if (!fiche.objectifs.trim()) newErrors.objectifs = 'Les objectifs sont requis';
          if (!fiche.methodologie.trim()) newErrors.methodologie = 'La méthodologie est requise';
          if (!fiche.duree_prevue) newErrors.duree_prevue = 'La durée prévue est requise';
          break;
        case 3:
          if (!fiche.date_debut) newErrors.date_debut = 'La date de début est requise';
          if (!fiche.date_fin_prevue) newErrors.date_fin_prevue = 'La date de fin prévue est requise';
          if (fiche.type_travail === 'binome') {
            if (!fiche.binome_nom.trim()) newErrors.binome_nom = 'Le nom du binôme est requis';
            if (!fiche.binome_email.trim()) newErrors.binome_email = 'L\'email du binôme est requis';
          }
          break;
      }
    } else if (mode === 'memoire') {
      if (!memoire.titre.trim()) newErrors.titre = 'Le titre est requis';
      if (!memoire.description.trim()) newErrors.description = 'La description est requise';
      if (!memoire.file) newErrors.file = 'Le fichier PDF est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSujetPropose = (sujet: Sujet) => {
    setFiche(prev => ({
      ...prev,
      sujet: sujet.titre,
      sujet_propose_id: sujet.id.toString(),
      encadreur: sujet.encadreur,
      description: sujet.description,
      sujet_custom: ''
    }));
    setSujetSelectionne(null);
    setMode('fiche');
    setCurrentStep(1);
  };

  const generateIASujets = async () => {
    setLoadingIA(true);
    // Simulation génération IA basée sur le profil utilisateur
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const sujetsGeneres: Sujet[] = [
      {
        id: Date.now() + 1,
        titre: `Système de recommandation intelligent pour ${iaPreferences.type_projet}`,
        encadreur: 'IA Assistant',
        formation: user?.formation || '',
        type: 'ia',
        description: `Développement d'un système de recommandation utilisant l'IA pour améliorer l'expérience utilisateur dans le domaine ${iaPreferences.domaines.join(', ')}.`,
        competences: iaPreferences.competences.slice(0, 4),
        niveau: [user?.niveau?.includes('Master') ? 'Master' : 'Licence'],
        places_disponibles: 99,
        date_publication: new Date().toISOString(),
        difficulte: iaPreferences.difficulte,
        score_matching: 95
      },
      {
        id: Date.now() + 2,
        titre: `Plateforme collaborative pour ${iaPreferences.type_projet}`,
        encadreur: 'IA Assistant',
        formation: user?.formation || '',
        type: 'ia',
        description: `Création d'une plateforme collaborative intégrant les technologies ${iaPreferences.competences.slice(0, 2).join(' et ')} pour optimiser les processus.`,
        competences: [...iaPreferences.competences.slice(0, 3), 'API REST'],
        niveau: [user?.niveau?.includes('Master') ? 'Master' : 'Licence'],
        places_disponibles: 99,
        date_publication: new Date().toISOString(),
        difficulte: iaPreferences.difficulte,
        score_matching: 88
      }
    ];
    
    setSujetsIA(sujetsGeneres);
    setLoadingIA(false);
  };

  const generateEncadrantsIA = async () => {
    setLoadingIA(true);
    // Simulation de recommandation d'encadrants basée sur le profil et le sujet
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Analyse des encadrants selon les critères
    const encadrantsRecommandes = mockEncadrants
      .map(encadrant => {
        let score = 0;
        
        // Score basé sur le nombre d'encadrements
        score += Math.min(encadrant.nb_encadrements || 0, 20) * 2;
        
        // Score basé sur le taux de réussite
        score += (encadrant.taux_reussite || 0) * 0.5;
        
        // Score basé sur la correspondance avec le sujet
        if (fiche.sujet.toLowerCase().includes('ia') && encadrant.specialites.includes('Intelligence Artificielle')) {
          score += 30;
        }
        if (fiche.sujet.toLowerCase().includes('sécur') && encadrant.specialites.includes('Sécurité informatique')) {
          score += 30;
        }
        
        return { ...encadrant, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    
    setEncadrantsIA(encadrantsRecommandes);
    setLoadingIA(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setMemoire(prev => ({ ...prev, file }));
        setErrors(prev => ({ ...prev, file: '' }));
      } else {
        setErrors(prev => ({ ...prev, file: 'Seuls les fichiers PDF sont acceptés' }));
      }
    }
  };

  const handleFicheChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiche(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleMemoireChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMemoire(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'memoire' && !validateStep(1)) return;
    if (mode === 'fiche' && !validateStep(3)) return;

    setIsSubmitting(true);
    
    // Simulation d'envoi
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSuccess(true);
    setIsSubmitting(false);
    
    // Reset du formulaire
    setMemoire({ titre: '', description: '', mots_cles: '', file: null });
    setFiche({
      encadreur: '',
      sujet: '',
      sujet_propose_id: '',
      sujet_custom: '',
      description: '',
      objectifs: '',
      methodologie: '',
      type_travail: 'individuel',
      binome_nom: '',
      binome_email: '',
      duree_prevue: '',
      date_debut: '',
      date_fin_prevue: ''
    });
    setSearch('');
    setCurrentStep(1);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resetForm = () => {
    setSuccess(false);
    setErrors({});
    setCurrentStep(1);
    setMode('consultation');
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Dossier déposé avec succès !</h2>
          <p className="text-gray-600 mb-8 text-lg">
            {mode === 'memoire' 
              ? 'Votre mémoire a été soumis et sera évalué par le jury.'
              : 'Votre fiche de dépôt a été envoyée à l\'encadreur pour validation.'
            }
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center justify-center">
              <FiTarget className="h-5 w-5 mr-2" />
              Prochaines étapes
            </h3>
            <ul className="text-sm text-gray-700 space-y-3">
              {mode === 'memoire' ? (
                <>
                  <li className="flex items-center">
                    <FiMail className="h-4 w-4 mr-2 text-gray-500" />
                    Vous recevrez un email de confirmation
                  </li>
                  <li className="flex items-center">
                    <FiCalendar className="h-4 w-4 mr-2 text-gray-500" />
                    La date de soutenance vous sera communiquée
                  </li>
                  <li className="flex items-center">
                    <FiTarget className="h-4 w-4 mr-2 text-gray-500" />
                    Préparez votre présentation orale
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-center">
                    <FiUser className="h-4 w-4 mr-2 text-gray-500" />
                    L'encadreur recevra une notification
                  </li>
                  <li className="flex items-center">
                    <FiMail className="h-4 w-4 mr-2 text-gray-500" />
                    Vous serez informé de sa décision par email
                  </li>
                  <li className="flex items-center">
                    <FiZap className="h-4 w-4 mr-2 text-gray-500" />
                    En cas d'acceptation, vous pourrez commencer votre travail
                  </li>
                </>
              )}
            </ul>
          </div>
          <button
            onClick={resetForm}
            className="px-8 py-4 bg-[#324b8b] text-white rounded-lg hover:bg-[#243663] transition-colors font-semibold"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#324b8b] mb-4">
            Plateforme Académique
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {isLicence 
              ? 'Gérez vos rapports de stage et soutenances en toute simplicité'
              : 'Déposez et suivez vos mémoires de fin d\'études'
            }
          </p>
        </div>

        {/* Sélection du mode */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Que souhaitez-vous faire ?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div
              onClick={() => setMode('consultation')}
              className={`cursor-pointer rounded-lg p-8 transition-all ${
                mode === 'consultation' 
                  ? 'bg-[#324b8b] text-white shadow-lg' 
                  : 'bg-white hover:shadow-md border border-gray-200'
              }`}
            >
              <div className="text-center">
                <div className={`w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 ${
                  mode === 'consultation' ? 'bg-white/20' : 'bg-gray-100'
                }`}>
                  <FiSearch className={`h-8 w-8 ${mode === 'consultation' ? 'text-white' : 'text-[#324b8b]'}`} />
                </div>
                <h4 className={`font-bold text-xl mb-2 ${mode === 'consultation' ? 'text-white' : 'text-gray-900'}`}>
                  Consulter les sujets
                </h4>
                <p className={`text-sm ${mode === 'consultation' ? 'text-white/80' : 'text-gray-600'}`}>
                  Découvrez les sujets proposés par les professeurs et l'IA
                </p>
              </div>
            </div>

            <div
              onClick={() => setMode('fiche')}
              className={`cursor-pointer rounded-lg p-8 transition-all ${
                mode === 'fiche' 
                  ? 'bg-[#324b8b] text-white shadow-lg' 
                  : 'bg-white hover:shadow-md border border-gray-200'
              }`}
            >
              <div className="text-center">
                <div className={`w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 ${
                  mode === 'fiche' ? 'bg-white/20' : 'bg-gray-100'
                }`}>
                  <FiFile className={`h-8 w-8 ${mode === 'fiche' ? 'text-white' : 'text-[#324b8b]'}`} />
                </div>
                <h4 className={`font-bold text-xl mb-2 ${mode === 'fiche' ? 'text-white' : 'text-gray-900'}`}>
                  {isLicence ? 'Proposition de Stage' : 'Proposition de Mémoire'}
                </h4>
                <p className={`text-sm ${mode === 'fiche' ? 'text-white/80' : 'text-gray-600'}`}>
                  {isLicence 
                    ? 'Soumettez votre demande de validation de stage'
                    : 'Proposez votre sujet de mémoire'
                  }
                </p>
              </div>
            </div>

            <div
              onClick={() => setMode('memoire')}
              className={`cursor-pointer rounded-lg p-8 transition-all ${
                mode === 'memoire' 
                  ? 'bg-[#324b8b] text-white shadow-lg' 
                  : 'bg-white hover:shadow-md border border-gray-200'
              }`}
            >
              <div className="text-center">
                <div className={`w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 ${
                  mode === 'memoire' ? 'bg-white/20' : 'bg-gray-100'
                }`}>
                  <FiBook className={`h-8 w-8 ${mode === 'memoire' ? 'text-white' : 'text-[#324b8b]'}`} />
                </div>
                <h4 className={`font-bold text-xl mb-2 ${mode === 'memoire' ? 'text-white' : 'text-gray-900'}`}>
                  {isLicence ? 'Rapport Final' : 'Mémoire Final'}
                </h4>
                <p className={`text-sm ${mode === 'memoire' ? 'text-white/80' : 'text-gray-600'}`}>
                  {isLicence 
                    ? 'Déposez votre rapport de stage finalisé'
                    : 'Soumettez votre mémoire final'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Informations utilisateur */}
        {mode !== 'consultation' && (
          <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-[#324b8b] p-6">
              <h3 className="text-white font-bold text-lg flex items-center">
                <FiUser className="h-5 w-5 mr-3" />
                Profil Étudiant
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Nom et prénom</p>
                  <p className="font-semibold text-gray-900">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Formation</p>
                  <p className="font-semibold text-gray-900">{user?.niveau}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mode consultation */}
        {mode === 'consultation' && (
          <div className="space-y-8">
            {/* Bouton recommandation encadrant IA */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Besoin d'aide pour choisir un encadrant ?</h3>
                  <p className="text-gray-600">Obtenez des recommandations personnalisées basées sur votre profil et vos intérêts</p>
                </div>
                <button
                  onClick={() => setShowEncadrantModal(true)}
                  className="px-6 py-3 bg-[#324b8b] text-white rounded-lg hover:bg-[#243663] transition-colors flex items-center font-medium"
                >
                  <FiAward className="h-5 w-5 mr-2" />
                  Trouver mon encadrant idéal
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-[#324b8b] p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-bold text-xl">Catalogue des Sujets</h3>
                  <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium">
                    {sujetsFiltres.length} sujet(s) disponible(s)
                  </span>
                </div>
              </div>

              {/* Bouton IA Générateur */}
              <div className="p-6 border-b border-gray-200">
                <div className="bg-gray-100 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-[#324b8b] rounded-lg flex items-center justify-center">
                        <FiCpu className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">Générateur IA de Sujets</h4>
                        <p className="text-gray-600 text-sm">Obtenez des suggestions personnalisées basées sur votre profil</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowIAModal(true)}
                      className="px-6 py-3 bg-[#324b8b] text-white rounded-lg hover:bg-[#243663] transition-colors flex items-center font-medium"
                    >
                      <FiZap className="h-4 w-4 mr-2" />
                      Générer des sujets
                    </button>
                  </div>
                </div>
              </div>

              {/* Filtres */}
              <div className="p-6 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Formation</label>
                    <select
                      value={filtreFormation}
                      onChange={(e) => setFiltreFormation(e.target.value)}
                      className="w-full h-11 rounded-lg border-gray-300 focus:border-[#324b8b] focus:ring-[#324b8b] transition-colors"
                    >
                      <option value="">Toutes les formations</option>
                      {mockFormations.map(formation => (
                        <option key={formation} value={formation}>{formation}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Source</label>
                    <select
                      value={filtreType}
                      onChange={(e) => setFiltreType(e.target.value)}
                      className="w-full h-11 rounded-lg border-gray-300 focus:border-[#324b8b] focus:ring-[#324b8b] transition-colors"
                    >
                      <option value="">Toutes les sources</option>
                      <option value="professeur">Professeurs</option>
                      <option value="ia">IA Assistant</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Niveau</label>
                    <select
                      value={filtreNiveau}
                      onChange={(e) => setFiltreNiveau(e.target.value)}
                      className="w-full h-11 rounded-lg border-gray-300 focus:border-[#324b8b] focus:ring-[#324b8b] transition-colors"
                    >
                      <option value="">Tous niveaux</option>
                      <option value="Licence">Licence</option>
                      <option value="Master">Master</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Recherche</label>
                    <div className="relative">
                      <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Mots-clés..."
                        value={rechercheTexte}
                        onChange={(e) => setRechercheTexte(e.target.value)}
                        className="w-full h-11 pl-12 pr-4 border-gray-300 rounded-lg focus:border-[#324b8b] focus:ring-[#324b8b] transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Liste des sujets */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sujetsFiltres.map(sujet => (
                    <div key={sujet.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              sujet.type === 'ia' 
                                ? 'bg-gray-100 text-gray-700'
                                : 'bg-[#324b8b]/10 text-[#324b8b]'
                            }`}>
                              {sujet.type === 'ia' ? 'IA Assistant' : 'Professeur'}
                            </span>
                          </div>
                          <h4 className="font-bold text-gray-900 mb-2">{sujet.titre}</h4>
                          <p className="text-sm text-gray-600 mb-3">{sujet.encadreur}</p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            sujet.places_disponibles > 0 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {sujet.type === 'ia' ? '∞' : sujet.places_disponibles} place(s)
                          </span>
                          {sujet.score_matching && (
                            <span className="bg-yellow-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                              <FiStar className="h-3 w-3 mr-1" />
                              {sujet.score_matching}% match
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{sujet.description}</p>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <FiTarget className="h-4 w-4 text-gray-500" />
                          <span className="text-xs font-medium text-gray-700">Formation :</span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg font-medium">
                            {sujet.formation}
                          </span>
                        </div>
                        
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <FiCode className="h-4 w-4 text-gray-500" />
                            <span className="text-xs font-medium text-gray-700">Technologies :</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {sujet.competences.slice(0, 3).map(comp => (
                              <span key={comp} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg">
                                {comp}
                              </span>
                            ))}
                            {sujet.competences.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg">
                                +{sujet.competences.length - 3}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Niveaux : {sujet.niveau.join(', ')}</span>
                            {sujet.difficulte && (
                              <span className={`px-2 py-1 rounded-lg font-medium ${
                                sujet.difficulte === 'Débutant' ? 'bg-green-100 text-green-700' :
                                sujet.difficulte === 'Intermédiaire' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {sujet.difficulte}
                              </span>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSujetSelectionne(sujet)}
                              className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              Détails
                            </button>
                            {(sujet.places_disponibles > 0 || sujet.type === 'ia') && (
                              <button
                                onClick={() => handleSujetPropose(sujet)}
                                className="px-4 py-2 text-sm bg-[#324b8b] text-white rounded-lg hover:bg-[#243663] transition-colors"
                              >
                                Choisir
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {sujetsFiltres.length === 0 && (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FiSearch className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun sujet trouvé</h3>
                    <p className="text-gray-600 mb-6">Essayez de modifier vos critères de recherche ou utilisez notre générateur IA</p>
                    <button
                      onClick={() => setShowIAModal(true)}
                      className="px-6 py-3 bg-[#324b8b] text-white rounded-lg hover:bg-[#243663] transition-colors"
                    >
                      <FiCpu className="h-4 w-4 mr-2 inline" />
                      Générer avec l'IA
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal détail sujet */}
        {sujetSelectionne && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 bg-[#324b8b] text-white">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2 text-white">{sujetSelectionne.titre}</h2>
                    <p className="text-white/80 text-lg">{sujetSelectionne.encadreur}</p>
                  </div>
                  <button 
                    onClick={() => setSujetSelectionne(null)}
                    className="text-white/80 hover:text-white p-2 transition-colors"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-8 space-y-8">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Description détaillée</h3>
                  <p className="text-gray-700 leading-relaxed">{sujetSelectionne.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Formation</h3>
                    <span className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">
                      {sujetSelectionne.formation}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Niveaux acceptés</h3>
                    <div className="flex flex-wrap gap-2">
                      {sujetSelectionne.niveau.map(n => (
                        <span key={n} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg font-medium">
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Technologies et compétences requises</h3>
                  <div className="flex flex-wrap gap-3">
                    {sujetSelectionne.competences.map(comp => (
                      <span key={comp} className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium">
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>

                {sujetSelectionne.difficulte && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Niveau de difficulté</h3>
                    <span className={`inline-block px-4 py-2 rounded-lg font-medium ${
                      sujetSelectionne.difficulte === 'Débutant' ? 'bg-green-100 text-green-700' :
                      sujetSelectionne.difficulte === 'Intermédiaire' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {sujetSelectionne.difficulte}
                    </span>
                  </div>
                )}

                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <FiUsers className="h-6 w-6 text-[#324b8b]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Places disponibles</p>
                        <p className={`text-2xl font-bold ${
                          sujetSelectionne.places_disponibles > 0 || sujetSelectionne.type === 'ia'
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {sujetSelectionne.type === 'ia' ? '∞' : sujetSelectionne.places_disponibles}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Publié le</p>
                      <p className="font-medium text-gray-900">
                        {new Date(sujetSelectionne.date_publication).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setSujetSelectionne(null)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Fermer
                  </button>
                  {(sujetSelectionne.places_disponibles > 0 || sujetSelectionne.type === 'ia') && (
                    <button
                      onClick={() => handleSujetPropose(sujetSelectionne)}
                      className="px-8 py-3 bg-[#324b8b] text-white rounded-lg hover:bg-[#243663] transition-colors"
                    >
                      Choisir ce sujet
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal recommandation encadrant */}
        {showEncadrantModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-[#324b8b] p-6 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">Recommandation d'Encadrant par IA</h2>
                    <p className="text-white/80">Décrivez votre sujet pour obtenir les meilleurs encadrants</p>
                  </div>
                  <button 
                    onClick={() => setShowEncadrantModal(false)}
                    className="text-white/80 hover:text-white p-2 transition-colors"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-lg font-bold text-gray-900 mb-3">
                    Décrivez votre sujet de {isLicence ? 'stage' : 'mémoire'}
                  </label>
                  <textarea
                    value={fiche.sujet}
                    onChange={(e) => setFiche(prev => ({ ...prev, sujet: e.target.value }))}
                    rows={4}
                    className="w-full rounded-lg border-gray-300 focus:border-[#324b8b] focus:ring-[#324b8b]"
                    placeholder="Ex: Développement d'une application mobile pour la gestion des déchets utilisant l'IA..."
                  />
                </div>

                <div>
                  <label className="block text-lg font-bold text-gray-900 mb-3">
                    Domaines concernés
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {domainesOptions.map(domaine => {
                      const isSelected = iaPreferences.domaines.includes(domaine.id);
                      return (
                        <button
                          key={domaine.id}
                          onClick={() => {
                            setIaPreferences(prev => ({
                              ...prev,
                              domaines: isSelected 
                                ? prev.domaines.filter(d => d !== domaine.id)
                                : [...prev.domaines, domaine.id]
                            }));
                          }}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            isSelected 
                              ? 'bg-[#324b8b] text-white' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {domaine.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={generateEncadrantsIA}
                  disabled={loadingIA || !fiche.sujet.trim()}
                  className="w-full px-6 py-3 bg-[#324b8b] text-white rounded-lg hover:bg-[#243663] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loadingIA ? (
                    <>
                      <FiRefreshCw className="h-4 w-4 animate-spin mr-2" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <FiZap className="h-4 w-4 mr-2" />
                      Obtenir des recommandations
                    </>
                  )}
                </button>

                {/* Résultats des recommandations */}
                {encadrantsIA.length > 0 && (
                  <div className="mt-8 space-y-4">
                    <h3 className="text-lg font-bold text-gray-900">Encadrants recommandés pour vous</h3>
                    {encadrantsIA.map((encadrant, index) => (
                      <div key={encadrant.id} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-bold text-gray-900">{encadrant.name}</h4>
                              <span className="bg-yellow-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                                Recommandation n°{index + 1}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-3">{encadrant.email}</p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {encadrant.specialites.map(spec => (
                                <span key={spec} className="px-3 py-1 bg-white text-gray-700 rounded-lg text-sm font-medium border border-gray-200">
                                  {spec}
                                </span>
                              ))}
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Encadrements réalisés:</span>
                                <span className="font-medium text-gray-900 ml-2">{encadrant.nb_encadrements}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Taux de réussite:</span>
                                <span className="font-medium text-green-600 ml-2">{encadrant.taux_reussite}%</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setFiche(prev => ({ ...prev, encadreur: encadrant.name }));
                              setShowEncadrantModal(false);
                              setMode('fiche');
                            }}
                            className="px-4 py-2 bg-[#324b8b] text-white rounded-lg hover:bg-[#243663] transition-colors text-sm"
                          >
                            Sélectionner
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal IA */}
        {showIAModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-[#324b8b] p-6 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Générateur IA de Sujets</h2>
                    <p className="text-white/80">Personnalisez vos préférences pour obtenir des suggestions adaptées</p>
                  </div>
                  <button 
                    onClick={() => setShowIAModal(false)}
                    className="text-white/80 hover:text-white p-2 transition-colors"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="p-8 space-y-8">
                {/* Domaines d'intérêt */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Domaines d'intérêt</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {domainesOptions.map(domaine => {
                      const IconComponent = domaine.icon;
                      const isSelected = iaPreferences.domaines.includes(domaine.id);
                      return (
                        <div
                          key={domaine.id}
                          onClick={() => {
                            setIaPreferences(prev => ({
                              ...prev,
                              domaines: isSelected 
                                ? prev.domaines.filter(d => d !== domaine.id)
                                : [...prev.domaines, domaine.id]
                            }));
                          }}
                          className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                            isSelected 
                              ? 'border-[#324b8b] bg-[#324b8b]/5 text-[#324b8b]' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-center">
                            <IconComponent className={`h-6 w-6 mx-auto mb-2 ${isSelected ? 'text-[#324b8b]' : 'text-gray-500'}`} />
                            <p className="text-sm font-medium">{domaine.label}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Compétences techniques */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Compétences techniques</h3>
                  <div className="flex flex-wrap gap-2">
                    {competencesOptions.map(competence => {
                      const isSelected = iaPreferences.competences.includes(competence);
                      return (
                        <button
                          key={competence}
                          onClick={() => {
                            setIaPreferences(prev => ({
                              ...prev,
                              competences: isSelected 
                                ? prev.competences.filter(c => c !== competence)
                                : [...prev.competences, competence]
                            }));
                          }}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            isSelected 
                              ? 'bg-[#324b8b] text-white' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {competence}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Paramètres du projet */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Niveau de difficulté</label>
                    <div className="space-y-2">
                      {['Débutant', 'Intermédiaire', 'Avancé'].map(niveau => (
                        <label key={niveau} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="difficulte"
                            value={niveau}
                            checked={iaPreferences.difficulte === niveau}
                            onChange={(e) => setIaPreferences(prev => ({ ...prev, difficulte: e.target.value }))}
                            className="text-[#324b8b] focus:ring-[#324b8b]"
                          />
                          <span className={`text-sm ${iaPreferences.difficulte === niveau ? 'font-semibold text-[#324b8b]' : 'text-gray-700'}`}>
                            {niveau}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Type de projet</label>
                    <select
                      value={iaPreferences.type_projet}
                      onChange={(e) => setIaPreferences(prev => ({ ...prev, type_projet: e.target.value }))}
                      className="w-full rounded-lg border-gray-300 focus:border-[#324b8b] focus:ring-[#324b8b]"
                    >
                      <option value="">Sélectionner un type</option>
                      <option value="Application Web">Application Web</option>
                      <option value="Application Mobile">Application Mobile</option>
                      <option value="Système de gestion">Système de gestion</option>
                      <option value="Analyse de données">Analyse de données</option>
                      <option value="Intelligence Artificielle">Intelligence Artificielle</option>
                      <option value="Sécurité informatique">Sécurité informatique</option>
                    </select>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowIAModal(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={generateIASujets}
                    disabled={loadingIA || iaPreferences.domaines.length === 0}
                    className="px-8 py-3 bg-[#324b8b] text-white rounded-lg hover:bg-[#243663] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {loadingIA ? (
                      <>
                        <FiRefreshCw className="h-4 w-4 animate-spin mr-2" />
                        Génération en cours...
                      </>
                    ) : (
                      <>
                        <FiZap className="h-4 w-4 mr-2" />
                        Générer mes sujets
                      </>
                    )}
                  </button>
                </div>

                {/* Résultats IA */}
                {sujetsIA.length > 0 && (
                  <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Sujets générés pour vous</h4>
                    <div className="space-y-4">
                      {sujetsIA.map(sujet => (
                        <div key={sujet.id} className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-900 mb-1">{sujet.titre}</h5>
                              <p className="text-sm text-gray-600">{sujet.description}</p>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <span className="bg-yellow-100 text-orange-700 px-2 py-1 rounded-lg text-xs font-medium flex items-center">
                                <FiStar className="h-3 w-3 mr-1" />
                                {sujet.score_matching}%
                              </span>
                              <button
                                onClick={() => {
                                  handleSujetPropose(sujet);
                                  setShowIAModal(false);
                                }}
                                className="px-3 py-1 bg-[#324b8b] text-white rounded-lg text-sm hover:bg-[#243663] transition-colors"
                              >
                                Choisir
                              </button>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {sujet.competences.map(comp => (
                              <span key={comp} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg">
                                {comp}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Formulaires */}
        {mode !== 'consultation' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-[#324b8b] p-6">
              <h3 className="text-white font-bold text-xl">
                {mode === 'memoire' 
                  ? `Dépôt de ${isLicence ? 'Rapport' : 'Mémoire'} Final`
                  : `${isLicence ? 'Proposition de Stage' : 'Proposition de Mémoire'}`
                }
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              {mode === 'memoire' ? (
                /* Mode Mémoire */
                <div className="space-y-8">
                  <div>
                    <label htmlFor="titre" className="block text-lg font-bold text-gray-900 mb-3">
                      Titre du {isLicence ? 'rapport' : 'mémoire'} *
                    </label>
                    <input
                      type="text"
                      id="titre"
                      name="titre"
                      value={memoire.titre}
                      onChange={handleMemoireChange}
                      className={`w-full rounded-lg border-2 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#324b8b] focus:border-[#324b8b] transition-all ${
                        errors.titre ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder={`Titre de votre ${isLicence ? 'rapport de stage' : 'mémoire'}...`}
                    />
                    {errors.titre && <p className="mt-2 text-sm text-red-600 flex items-center">
                      <FiAlertCircle className="h-4 w-4 mr-1" />
                      {errors.titre}
                    </p>}
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-lg font-bold text-gray-900 mb-3">
                      Résumé exécutif *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={memoire.description}
                      onChange={handleMemoireChange}
                      rows={6}
                      className={`w-full rounded-lg border-2 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#324b8b] focus:border-[#324b8b] transition-all ${
                        errors.description ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder={`Résumé détaillé de votre ${isLicence ? 'stage et de vos réalisations' : 'travail de recherche'}...`}
                    />
                    {errors.description && <p className="mt-2 text-sm text-red-600 flex items-center">
                      <FiAlertCircle className="h-4 w-4 mr-1" />
                      {errors.description}
                    </p>}
                  </div>

                  <div>
                    <label htmlFor="mots_cles" className="block text-lg font-bold text-gray-900 mb-3">
                      Mots-clés
                    </label>
                    <input
                      type="text"
                      id="mots_cles"
                      name="mots_cles"
                      value={memoire.mots_cles}
                      onChange={handleMemoireChange}
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#324b8b] focus:border-[#324b8b] transition-all"
                      placeholder="Mots-clés séparés par des virgules..."
                    />
                  </div>

                  <div>
                    <label className="block text-lg font-bold text-gray-900 mb-3">
                      Document PDF du {isLicence ? 'rapport' : 'mémoire'} *
                    </label>
                    <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                      errors.file ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-[#324b8b] hover:bg-gray-50'
                    }`}>
                      <FiUpload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".pdf"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-6 py-3 bg-[#324b8b] text-white rounded-lg hover:bg-[#243663] transition-colors font-semibold"
                      >
                        Choisir un fichier PDF
                      </button>
                      <p className="text-gray-500 mt-3">ou glissez-déposez votre fichier ici</p>
                      <p className="text-sm text-gray-400 mt-2">Taille maximale : 10 MB</p>
                    </div>
                    {memoire.file && (
                      <div className="mt-4 flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <FiCheckCircle className="h-6 w-6 text-green-600" />
                        <span className="text-green-700 font-medium flex-1">
                          Fichier sélectionné : {memoire.file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => setMemoire(prev => ({ ...prev, file: null }))}
                          className="text-green-600 hover:text-green-700 p-1"
                        >
                          <FiX className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                    {errors.file && <p className="mt-2 text-sm text-red-600 flex items-center">
                      <FiAlertCircle className="h-4 w-4 mr-1" />
                      {errors.file}
                    </p>}
                  </div>

                  {/* Bouton de soumission pour le mode mémoire */}
                  <div className="flex justify-end pt-8 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-4 bg-[#324b8b] text-white rounded-lg hover:bg-[#243663] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-semibold"
                    >
                      {isSubmitting ? (
                        <>
                          <FiRefreshCw className="h-5 w-5 animate-spin mr-2" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <FiUpload className="h-5 w-5 mr-2" />
                          Déposer le {isLicence ? 'rapport' : 'mémoire'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* Mode Fiche de dépôt */
                <div className="space-y-10">
                  {/* Indicateur d'étapes */}
                  <div className="flex items-center justify-center mb-12">
                    <div className="flex items-center space-x-4">
                      {[1, 2, 3].map((step) => (
                        <React.Fragment key={step}>
                          <div className="flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all ${
                              step === currentStep
                                ? 'bg-[#324b8b] text-white shadow-lg'
                                : step < currentStep
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 text-gray-600'
                            }`}>
                              {step < currentStep ? <FiCheckCircle className="h-6 w-6" /> : step}
                            </div>
                            <span className={`text-sm mt-2 font-medium ${
                              step <= currentStep ? 'text-gray-900' : 'text-gray-500'
                            }`}>
                              {step === 1 ? 'Informations' : step === 2 ? 'Détails' : 'Planning'}
                            </span>
                          </div>
                          {step < 3 && (
                            <div className={`h-1 w-16 transition-all ${
                              step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                            }`} />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Étape 1: Informations de base */}
                  {currentStep === 1 && (
                    <div className="space-y-8">
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          Étape 1: Informations de base
                        </h3>
                        <p className="text-gray-600">Sélectionnez votre encadreur et définissez votre sujet</p>
                      </div>

                      {/* Sélection encadreur */}
                      <div>
                        <label className="block text-lg font-bold text-gray-900 mb-4">
                          Rechercher un encadreur *
                        </label>
                        <div className="relative mb-4">
                          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <input
                            type="text"
                            placeholder="Rechercher par nom ou spécialité..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#324b8b] focus:border-[#324b8b] transition-all"
                          />
                        </div>
                        <select
                          name="encadreur"
                          value={fiche.encadreur}
                          onChange={handleFicheChange}
                          className={`w-full rounded-lg border-2 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#324b8b] focus:border-[#324b8b] transition-all ${
                            errors.encadreur ? 'border-red-300' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Sélectionner un encadreur</option>
                          {filteredEncadrants.map(e => (
                            <option key={e.id} value={e.name}>
                              {e.name} - {e.specialites.join(', ')}
                            </option>
                          ))}
                        </select>
                        {errors.encadreur && <p className="mt-2 text-sm text-red-600 flex items-center">
                          <FiAlertCircle className="h-4 w-4 mr-1" />
                          {errors.encadreur}
                        </p>}
                        
                        {selectedEncadreur && (
                          <div className="mt-4 p-6 bg-gray-50 border border-gray-200 rounded-lg">
                            <div className="flex items-start space-x-4">
                              <div className="w-12 h-12 bg-[#324b8b] rounded-lg flex items-center justify-center">
                                <FiUser className="h-6 w-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-lg">{selectedEncadreur.name}</h4>
                                <p className="text-gray-600 flex items-center mt-2">
                                  <FiMail className="h-4 w-4 mr-2" />
                                  {selectedEncadreur.email}
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {selectedEncadreur.specialites.map(spec => (
                                    <span key={spec} className="px-3 py-1 bg-white text-gray-700 rounded-lg text-sm font-medium border border-gray-200">
                                      {spec}
                                    </span>
                                  ))}
                                </div>
                                {(selectedEncadreur.nb_encadrements || selectedEncadreur.taux_reussite) && (
                                  <div className="mt-3 flex gap-4 text-sm">
                                    {selectedEncadreur.nb_encadrements && (
                                      <span className="text-gray-600">
                                        Encadrements: <span className="font-medium text-gray-900">{selectedEncadreur.nb_encadrements}</span>
                                      </span>
                                    )}
                                    {selectedEncadreur.taux_reussite && (
                                      <span className="text-gray-600">
                                        Taux de réussite: <span className="font-medium text-green-600">{selectedEncadreur.taux_reussite}%</span>
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                        <div className="flex items-start space-x-3">
                          <FiInfo className="h-5 w-5 text-amber-600 mt-0.5" />
                          <div className="text-amber-800">
                            <p className="font-semibold mb-1">Important</p>
                            <p className="text-sm">L'encadreur choisi devra valider votre proposition avant que vous puissiez commencer votre travail.</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-lg font-bold text-gray-900 mb-4">
                          Sujet du {isLicence ? 'stage' : 'mémoire'} *
                        </label>
                        
                        {/* Option sujets proposés vs sujet personnalisé */}
                        <div className="mb-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50">
                              <input
                                type="radio"
                                name="type_sujet"
                                checked={typeChoixSujet === 'propose'}
                                onChange={() => {
                                  setTypeChoixSujet('propose');
                                  setFiche(prev => ({ ...prev, sujet_custom: '', sujet: prev.sujet_propose_id ? prev.sujet : '' }));
                                }}
                                className="mr-3 text-[#324b8b] focus:ring-[#324b8b]"
                              />
                              <div>
                                <span className="font-semibold text-gray-900">Sujet proposé</span>
                                <p className="text-sm text-gray-600">Choisir parmi les sujets existants</p>
                              </div>
                            </label>
                            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50">
                              <input
                                type="radio"
                                name="type_sujet"
                                checked={typeChoixSujet === 'custom'}
                                onChange={() => {
                                  setTypeChoixSujet('custom');
                                  setFiche(prev => ({ ...prev, sujet_custom: 'custom', sujet_propose_id: '' }));
                                }}
                                className="mr-3 text-[#324b8b] focus:ring-[#324b8b]"
                              />
                              <div>
                                <span className="font-semibold text-gray-900">Sujet personnalisé</span>
                                <p className="text-sm text-gray-600">Créer votre propre sujet</p>
                              </div>
                            </label>
                          </div>

                          {/* Sujets proposés par l'encadreur */}
                          {typeChoixSujet === 'propose' && fiche.encadreur && sujetsEncadreur.length > 0 && (
                            <div className="mb-6 p-6 bg-gray-50 border border-gray-200 rounded-lg">
                              <h5 className="font-bold text-gray-900 mb-4 text-lg">
                                Sujets proposés par {fiche.encadreur} :
                              </h5>
                              <div className="space-y-3">
                                {sujetsEncadreur.map(sujet => (
                                  <div
                                    key={sujet.id}
                                    onClick={() => setFiche(prev => ({ 
                                      ...prev, 
                                      sujet_propose_id: sujet.id.toString(),
                                      sujet: sujet.titre,
                                      description: sujet.description 
                                    }))}
                                    className={`cursor-pointer p-4 border-2 rounded-lg transition-all ${
                                      fiche.sujet_propose_id === sujet.id.toString()
                                        ? 'border-[#324b8b] bg-[#324b8b]/5'
                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                    }`}
                                  >
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <h6 className="font-semibold text-gray-900 mb-2">{sujet.titre}</h6>
                                        <p className="text-sm text-gray-600 mb-3">{sujet.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                          {sujet.competences.slice(0, 3).map(comp => (
                                            <span key={comp} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg font-medium">
                                              {comp}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                                        sujet.places_disponibles > 0 
                                          ? 'bg-green-100 text-green-700' 
                                          : 'bg-red-100 text-red-700'
                                      }`}>
                                        {sujet.places_disponibles} place(s)
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-800 flex items-center">
                                  <FiInfo className="h-4 w-4 mr-2" />
                                  Vous pouvez aussi{' '}
                                  <button
                                    type="button"
                                    onClick={() => setMode('consultation')}
                                    className="underline hover:no-underline ml-1 font-medium"
                                  >
                                    consulter tous les sujets disponibles
                                  </button>
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Génération IA */}
                          {typeChoixSujet === 'propose' && fiche.encadreur && (
                            <div className="mb-6 p-6 bg-gray-100 border border-gray-200 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="w-12 h-12 bg-[#324b8b] rounded-lg flex items-center justify-center">
                                    <FiCpu className="h-6 w-6 text-white" />
                                  </div>
                                  <div>
                                    <h5 className="font-bold text-gray-900 text-lg">Générateur IA de sujets</h5>
                                    <p className="text-gray-600 text-sm">Obtenez des suggestions personnalisées</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setShowIAModal(true)}
                                  className="px-6 py-3 bg-[#324b8b] text-white rounded-lg hover:bg-[#243663] transition-colors font-semibold"
                                >
                                  <FiZap className="h-4 w-4 mr-2 inline" />
                                  Générer avec l'IA
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Champ de saisie du sujet */}
                        {fiche.sujet_propose_id && typeChoixSujet === 'propose' ? (
                          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <FiCheckCircle className="h-5 w-5 text-green-600" />
                                <div>
                                  <span className="text-sm font-medium text-green-700">Sujet sélectionné :</span>
                                  <p className="font-semibold text-green-900">{fiche.sujet}</p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => setFiche(prev => ({ ...prev, sujet_propose_id: '', sujet: '' }))}
                                className="text-green-600 hover:text-green-700 p-2"
                              >
                                <FiX className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <input
                            type="text"
                            name="sujet"
                            value={fiche.sujet}
                            onChange={handleFicheChange}
                            className={`w-full rounded-lg border-2 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#324b8b] focus:border-[#324b8b] transition-all ${
                              errors.sujet ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder={`Titre de votre ${isLicence ? 'projet de stage' : 'sujet de mémoire'}...`}
                            disabled={typeChoixSujet === 'propose' && !!fiche.sujet_propose_id}
                          />
                        )}
                        {errors.sujet && <p className="mt-2 text-sm text-red-600 flex items-center">
                          <FiAlertCircle className="h-4 w-4 mr-1" />
                          {errors.sujet}
                        </p>}
                      </div>

                      <div>
                        <label className="block text-lg font-bold text-gray-900 mb-3">
                          Description du projet *
                        </label>
                        <textarea
                          name="description"
                          value={fiche.description}
                          onChange={handleFicheChange}
                          rows={5}
                          className={`w-full rounded-lg border-2 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#324b8b] focus:border-[#324b8b] transition-all ${
                            errors.description ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder={`Décrivez en détail votre ${isLicence ? 'projet de stage' : 'sujet de mémoire'}...`}
                        />
                        {errors.description && <p className="mt-2 text-sm text-red-600 flex items-center">
                          <FiAlertCircle className="h-4 w-4 mr-1" />
                          {errors.description}
                        </p>}
                      </div>
                    </div>
                  )}

                  {/* Étape 2: Détails du projet */}
                  {currentStep === 2 && (
                    <div className="space-y-8">
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          Étape 2: Détails du projet
                        </h3>
                        <p className="text-gray-600">Définissez les objectifs et la méthodologie de votre projet</p>
                      </div>

                      <div>
                        <label className="block text-lg font-bold text-gray-900 mb-3">
                          Objectifs du projet *
                        </label>
                        <textarea
                          name="objectifs"
                          value={fiche.objectifs}
                          onChange={handleFicheChange}
                          rows={4}
                          className={`w-full rounded-lg border-2 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#324b8b] focus:border-[#324b8b] transition-all ${
                            errors.objectifs ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Quels sont les objectifs principaux de votre projet ?"
                        />
                        {errors.objectifs && <p className="mt-2 text-sm text-red-600 flex items-center">
                          <FiAlertCircle className="h-4 w-4 mr-1" />
                          {errors.objectifs}
                        </p>}
                      </div>

                      <div>
                        <label className="block text-lg font-bold text-gray-900 mb-3">
                          Méthodologie et approche *
                        </label>
                        <textarea
                          name="methodologie"
                          value={fiche.methodologie}
                          onChange={handleFicheChange}
                          rows={4}
                          className={`w-full rounded-lg border-2 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#324b8b] focus:border-[#324b8b] transition-all ${
                            errors.methodologie ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Comment comptez-vous procéder ?"
                        />
                        {errors.methodologie && <p className="mt-2 text-sm text-red-600 flex items-center">
                          <FiAlertCircle className="h-4 w-4 mr-1" />
                          {errors.methodologie}
                        </p>}
                      </div>

                      <div>
                        <label className="block text-lg font-bold text-gray-900 mb-3">
                          Durée prévue du projet *
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {(isLicence ? ['3 mois', '4 mois', '5 mois', '6 mois'] : ['6 mois', '8 mois', '10 mois', '12 mois']).map(duree => (
                            <label
                              key={duree}
                              className={`cursor-pointer p-4 rounded-lg border-2 transition-all text-center ${
                                fiche.duree_prevue === duree
                                  ? 'border-[#324b8b] bg-[#324b8b]/5 text-[#324b8b]'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <input
                                type="radio"
                                name="duree_prevue"
                                value={duree}
                                checked={fiche.duree_prevue === duree}
                                onChange={handleFicheChange}
                                className="sr-only"
                              />
                              <FiClock className={`h-6 w-6 mx-auto mb-2 ${fiche.duree_prevue === duree ? 'text-[#324b8b]' : 'text-gray-500'}`} />
                              <span className="font-semibold">{duree}</span>
                            </label>
                          ))}
                        </div>
                        {errors.duree_prevue && <p className="mt-2 text-sm text-red-600 flex items-center">
                          <FiAlertCircle className="h-4 w-4 mr-1" />
                          {errors.duree_prevue}
                        </p>}
                      </div>
                    </div>
                  )}

                  {/* Étape 3: Planning et collaboration */}
                  {currentStep === 3 && (
                    <div className="space-y-8">
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          Étape 3: Planning et collaboration
                        </h3>
                        <p className="text-gray-600">Définissez le calendrier et le mode de travail</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-lg font-bold text-gray-900 mb-3">
                            Date de début prévue *
                          </label>
                          <div className="relative">
                            <FiCalendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                              type="date"
                              name="date_debut"
                              value={fiche.date_debut}
                              onChange={handleFicheChange}
                              className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-[#324b8b] focus:border-[#324b8b] transition-all ${
                                errors.date_debut ? 'border-red-300' : 'border-gray-300'
                              }`}
                            />
                          </div>
                          {errors.date_debut && <p className="mt-2 text-sm text-red-600 flex items-center">
                            <FiAlertCircle className="h-4 w-4 mr-1" />
                            {errors.date_debut}
                          </p>}
                        </div>

                        <div>
                          <label className="block text-lg font-bold text-gray-900 mb-3">
                            Date de fin prévue *
                          </label>
                          <div className="relative">
                            <FiCalendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                              type="date"
                              name="date_fin_prevue"
                              value={fiche.date_fin_prevue}
                              onChange={handleFicheChange}
                              className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-[#324b8b] focus:border-[#324b8b] transition-all ${
                                errors.date_fin_prevue ? 'border-red-300' : 'border-gray-300'
                              }`}
                            />
                          </div>
                          {errors.date_fin_prevue && <p className="mt-2 text-sm text-red-600 flex items-center">
                            <FiAlertCircle className="h-4 w-4 mr-1" />
                            {errors.date_fin_prevue}
                          </p>}
                        </div>
                      </div>

                      {isMaster && (
                        <div>
                          <label className="block text-lg font-bold text-gray-900 mb-6">
                            Mode de travail
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div
                              onClick={() => setFiche(prev => ({ ...prev, type_travail: 'individuel' }))}
                              className={`cursor-pointer rounded-lg p-6 border-2 transition-all ${
                                fiche.type_travail === 'individuel' 
                                  ? 'border-[#324b8b] bg-[#324b8b]/5' 
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="text-center">
                                <FiUser className={`h-8 w-8 mx-auto mb-4 ${
                                  fiche.type_travail === 'individuel' ? 'text-[#324b8b]' : 'text-gray-600'
                                }`} />
                                <h4 className={`font-bold text-lg mb-2 ${
                                  fiche.type_travail === 'individuel' ? 'text-[#324b8b]' : 'text-gray-700'
                                }`}>
                                  Travail individuel
                                </h4>
                                <p className="text-gray-600">Réaliser le projet en autonomie</p>
                              </div>
                            </div>

                            <div
                              onClick={() => setFiche(prev => ({ ...prev, type_travail: 'binome' }))}
                              className={`cursor-pointer rounded-lg p-6 border-2 transition-all ${
                                fiche.type_travail === 'binome' 
                                  ? 'border-[#324b8b] bg-[#324b8b]/5' 
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="text-center">
                                <FiUsers className={`h-8 w-8 mx-auto mb-4 ${
                                  fiche.type_travail === 'binome' ? 'text-[#324b8b]' : 'text-gray-600'
                                }`} />
                                <h4 className={`font-bold text-lg mb-2 ${
                                  fiche.type_travail === 'binome' ? 'text-[#324b8b]' : 'text-gray-700'
                                }`}>
                                  Travail en binôme
                                </h4>
                                <p className="text-gray-600">Collaborer avec un autre étudiant</p>
                              </div>
                            </div>
                          </div>

                          {fiche.type_travail === 'binome' && (
                            <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
                              <h4 className="font-bold text-gray-900 mb-6 text-lg">
                                Informations du binôme
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <label className="block text-sm font-bold text-gray-700 mb-3">
                                    Nom et prénom du binôme *
                                  </label>
                                  <div className="relative">
                                    <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                      type="text"
                                      name="binome_nom"
                                      value={fiche.binome_nom}
                                      onChange={handleFicheChange}
                                      className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-[#324b8b] focus:border-[#324b8b] transition-all ${
                                        errors.binome_nom ? 'border-red-300' : 'border-gray-300'
                                      }`}
                                      placeholder="Prénom Nom"
                                    />
                                  </div>
                                  {errors.binome_nom && <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <FiAlertCircle className="h-4 w-4 mr-1" />
                                    {errors.binome_nom}
                                  </p>}
                                </div>

                                <div>
                                  <label className="block text-sm font-bold text-gray-700 mb-3">
                                    Email du binôme *
                                  </label>
                                  <div className="relative">
                                    <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                      type="email"
                                      name="binome_email"
                                      value={fiche.binome_email}
                                      onChange={handleFicheChange}
                                      className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-[#324b8b] focus:border-[#324b8b] transition-all ${
                                        errors.binome_email ? 'border-red-300' : 'border-gray-300'
                                      }`}
                                      placeholder="email@etudiant.sn"
                                    />
                                  </div>
                                  {errors.binome_email && <p className="mt-2 text-sm text-red-600 flex items-center">
                                    <FiAlertCircle className="h-4 w-4 mr-1" />
                                    {errors.binome_email}
                                  </p>}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Navigation des étapes */}
                  <div className="flex justify-between pt-8 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={prevStep}
                      className={`px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold ${
                        currentStep === 1 ? 'invisible' : ''
                      }`}
                    >
                      ← Précédent
                    </button>

                    {currentStep < 3 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="px-8 py-4 bg-[#324b8b] text-white rounded-lg hover:bg-[#243663] transition-colors font-semibold"
                      >
                        Suivant →
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-semibold"
                      >
                        {isSubmitting ? (
                          <>
                            <FiRefreshCw className="h-5 w-5 animate-spin mr-2" />
                            Envoi en cours...
                          </>
                        ) : (
                          <>
                            <FiCheckCircle className="h-5 w-5 mr-2" />
                            Soumettre la demande
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </form>
          </div>
        )}

        {/* Informations complémentaires */}
        {mode !== 'consultation' && (
          <div className="mt-8 bg-gray-50 rounded-lg p-8 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              Informations importantes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mode === 'memoire' ? (
                <>
                  <div className="flex items-start space-x-3">
                    <FiFile className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Format de fichier</p>
                      <p className="text-gray-600 text-sm">PDF uniquement (max. 10 MB)</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FiCheckCircle className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Normes de présentation</p>
                      <p className="text-gray-600 text-sm">Respectez les normes académiques</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FiClock className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Modification</p>
                      <p className="text-gray-600 text-sm">Non modifiable après dépôt</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FiCalendar className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Soutenance</p>
                      <p className="text-gray-600 text-sm">Date communiquée par email</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start space-x-3">
                    <FiUser className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Validation encadreur</p>
                      <p className="text-gray-600 text-sm">Délai de 7 jours pour validation</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FiMail className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Notification</p>
                      <p className="text-gray-600 text-sm">Email de confirmation</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FiRefreshCw className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Nouvelle proposition</p>
                      <p className="text-gray-600 text-sm">Possible en cas de refus</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FiUsers className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Travail en binôme</p>
                      <p className="text-gray-600 text-sm">Confirmation des deux étudiants requise</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepotDossier;