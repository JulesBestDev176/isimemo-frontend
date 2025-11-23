// ============================================================================
// TYPES & INTERFACES
// ============================================================================

// Interface pour les étudiants ayant utilisé un sujet
export interface EtudiantSujet {
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

// Interface pour un sujet de mémoire
export interface Sujet {
  id: number;
  titre: string;
  description: string;
  type: 'memoire';
  niveau: string;
  departement: string;
  filieres: string[];
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

// Interface depuis types/pipeline.ts
export interface SujetMemoire {
  id: number;
  titre: string;
  description: string;
  domaine: string;
  attentes?: string;
  encadrantPropose?: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
  };
  estDisponible: boolean;
}

// ============================================================================
// MOCKS
// ============================================================================

export const mockSujets: Sujet[] = [
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
    professeurNom: "Prof. Sophie Martin"
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

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getSujetById = (id: number): Sujet | undefined => {
  return mockSujets.find(s => s.id === id);
};

export const getSujetsDisponibles = (): Sujet[] => {
  return mockSujets.filter(s => s.nombreEtudiantsActuels < s.nombreMaxEtudiants);
};

export const getSujetsParFiliere = (filiere: string): Sujet[] => {
  return mockSujets.filter(s => s.filieres.includes(filiere));
};
