// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type TypeCategorieRessource = 'memoires' | 'canevas';
export type TypeFiliere = 'genie-logiciel' | 'iage' | 'multimedia' | 'gda' | 'mcd';

export interface RessourceMediatheque {
  idRessource: number;
  titre: string;
  description: string;
  auteur: string;
  auteurEmail?: string;
  filiere?: TypeFiliere;
  anneeAcademique?: string;
  datePublication: Date;
  dateCreation: Date;
  dateModification: Date;
  categorie: TypeCategorieRessource;
  typeRessource: 'document' | 'lien';
  cheminFichier?: string;
  url?: string;
  tags: string[];
  likes: number;
  commentaires: number;
  vues: number;
  niveau?: 'licence' | 'master' | 'autres' | 'all';
  estImportant?: boolean;
  estActif?: boolean;
}



// ============================================================================
// MOCKS
// ============================================================================

export const mockRessourcesMediatheque: RessourceMediatheque[] = [
  // Mémoires (actifs - déjà validés)
  {
    idRessource: 4,
    titre: 'Système de gestion de bibliothèque numérique',
    description: 'Mémoire de fin d\'études sur la conception et le développement d\'un système de gestion de bibliothèque numérique.',
    auteur: 'Amadou Diallo',
    auteurEmail: 'amadou.diallo@isimemo.edu.sn',
    filiere: 'genie-logiciel',
    anneeAcademique: '2024-2025',
    datePublication: new Date('2024-12-15'),
    dateCreation: new Date('2024-12-15'),
    dateModification: new Date('2024-12-15'),
    categorie: 'memoires',
    typeRessource: 'document',
    cheminFichier: '/mediatheque/memoires/bibliotheque-numerique.pdf',
    tags: ['bibliothèque', 'gestion', 'numérique'],
    likes: 98,
    commentaires: 15,
    vues: 1234,
    niveau: 'master',
    estActif: true
  },

  {
    idRessource: 5,
    titre: 'Application mobile de suivi médical',
    description: 'Mémoire présentant le développement d\'une application mobile pour le suivi médical des patients.',
    auteur: 'Fatou Sow',
    auteurEmail: 'fatou.sow@isimemo.edu.sn',
    filiere: 'iage',
    anneeAcademique: '2024-2025',
    datePublication: new Date('2024-11-20'),
    dateCreation: new Date('2024-11-20'),
    dateModification: new Date('2024-11-20'),
    categorie: 'memoires',
    typeRessource: 'document',
    cheminFichier: '/mediatheque/memoires/app-mobile-medical.pdf',
    tags: ['mobile', 'médical', 'application'],
    likes: 145,
    commentaires: 22,
    vues: 1678,
    niveau: 'master',
    estActif: true
  },
  {
    idRessource: 10,
    titre: 'Intelligence Artificielle et Éthique',
    description: 'Analyse des enjeux éthiques liés au déploiement des systèmes d\'IA dans la société moderne.',
    auteur: 'Jean Dupont',
    auteurEmail: 'jean.dupont@isimemo.edu.sn',
    filiere: 'multimedia',
    anneeAcademique: '2024-2025',
    datePublication: new Date('2024-10-05'),
    dateCreation: new Date('2024-10-05'),
    dateModification: new Date('2024-10-05'),
    categorie: 'memoires',
    typeRessource: 'document',
    cheminFichier: '/mediatheque/memoires/ia-ethique.pdf',
    tags: ['IA', 'éthique', 'société'],
    likes: 210,
    commentaires: 45,
    vues: 3400,
    niveau: 'master',
    estActif: true
  },
  {
    idRessource: 11,
    titre: 'Blockchain et Sécurité des Données',
    description: 'Étude sur l\'utilisation de la blockchain pour sécuriser les transactions bancaires.',
    auteur: 'Marie Curie',
    auteurEmail: 'marie.curie@isimemo.edu.sn',
    filiere: 'genie-logiciel',
    anneeAcademique: '2024-2025',
    datePublication: new Date('2024-09-12'),
    dateCreation: new Date('2024-09-12'),
    dateModification: new Date('2024-09-12'),
    categorie: 'memoires',
    typeRessource: 'document',
    cheminFichier: '/mediatheque/memoires/blockchain-security.pdf',
    tags: ['blockchain', 'sécurité', 'finance'],
    likes: 180,
    commentaires: 30,
    vues: 2500,
    niveau: 'master',
    estActif: true
  },
  {
    idRessource: 12,
    titre: 'Internet des Objets (IoT) en Agriculture',
    description: 'Déploiement de capteurs IoT pour l\'optimisation de l\'irrigation dans les zones arides.',
    auteur: 'Paul Martin',
    auteurEmail: 'paul.martin@isimemo.edu.sn',
    filiere: 'iage',
    anneeAcademique: '2024-2025',
    datePublication: new Date('2024-08-25'),
    dateCreation: new Date('2024-08-25'),
    dateModification: new Date('2024-08-25'),
    categorie: 'memoires',
    typeRessource: 'document',
    cheminFichier: '/mediatheque/memoires/iot-agriculture.pdf',
    tags: ['IoT', 'agriculture', 'capteurs'],
    likes: 120,
    commentaires: 10,
    vues: 1800,
    niveau: 'licence',
    estActif: true
  },
  {
    idRessource: 13,
    titre: 'Cybersécurité et Cloud Computing',
    description: 'Les défis de la sécurité dans les environnements cloud hybrides.',
    auteur: 'Sophie Germain',
    auteurEmail: 'sophie.germain@isimemo.edu.sn',
    filiere: 'genie-logiciel',
    anneeAcademique: '2023-2024',
    datePublication: new Date('2024-07-15'),
    dateCreation: new Date('2024-07-15'),
    dateModification: new Date('2024-07-15'),
    categorie: 'memoires',
    typeRessource: 'document',
    cheminFichier: '/mediatheque/memoires/cyber-cloud.pdf',
    tags: ['cybersécurité', 'cloud', 'réseaux'],
    likes: 250,
    commentaires: 50,
    vues: 4100,
    niveau: 'master',
    estActif: true
  },
  {
    idRessource: 14,
    titre: 'Machine Learning pour la Prédiction Boursière',
    description: 'Utilisation des réseaux de neurones récurrents pour prédire les tendances boursières.',
    auteur: 'Alan Turing',
    auteurEmail: 'alan.turing@isimemo.edu.sn',
    filiere: 'mcd',
    anneeAcademique: '2023-2024',
    datePublication: new Date('2024-06-30'),
    dateCreation: new Date('2024-06-30'),
    dateModification: new Date('2024-06-30'),
    categorie: 'memoires',
    typeRessource: 'document',
    cheminFichier: '/mediatheque/memoires/ml-finance.pdf',
    tags: ['machine learning', 'finance', 'prédiction'],
    likes: 300,
    commentaires: 60,
    vues: 5000,
    niveau: 'master',
    estActif: true
  },
  {
    idRessource: 15,
    titre: 'Réalité Augmentée dans l\'Éducation',
    description: 'Impact de la réalité augmentée sur l\'apprentissage des sciences chez les lycéens.',
    auteur: 'Ada Lovelace',
    auteurEmail: 'ada.lovelace@isimemo.edu.sn',
    filiere: 'multimedia',
    anneeAcademique: '2023-2024',
    datePublication: new Date('2024-05-20'),
    dateCreation: new Date('2024-05-20'),
    dateModification: new Date('2024-05-20'),
    categorie: 'memoires',
    typeRessource: 'document',
    cheminFichier: '/mediatheque/memoires/ar-education.pdf',
    tags: ['réalité augmentée', 'éducation', 'pédagogie'],
    likes: 160,
    commentaires: 25,
    vues: 2200,
    niveau: 'master',
    estActif: true
  },
  {
    idRessource: 16,
    titre: 'Big Data et Marketing Digital',
    description: 'Comment le Big Data transforme les stratégies de marketing digital.',
    auteur: 'Grace Hopper',
    auteurEmail: 'grace.hopper@isimemo.edu.sn',
    filiere: 'gda',
    anneeAcademique: '2023-2024',
    datePublication: new Date('2024-04-10'),
    dateCreation: new Date('2024-04-10'),
    dateModification: new Date('2024-04-10'),
    categorie: 'memoires',
    typeRessource: 'document',
    cheminFichier: '/mediatheque/memoires/bigdata-marketing.pdf',
    tags: ['big data', 'marketing', 'digital'],
    likes: 190,
    commentaires: 35,
    vues: 2800,
    niveau: 'master',
    estActif: true
  },
  {
    idRessource: 17,
    titre: 'Développement Web Progressif (PWA)',
    description: 'Avantages et inconvénients des PWA par rapport aux applications natives.',
    auteur: 'Tim Berners-Lee',
    auteurEmail: 'tim.bernerslee@isimemo.edu.sn',
    filiere: 'genie-logiciel',
    anneeAcademique: '2023-2024',
    datePublication: new Date('2024-03-05'),
    dateCreation: new Date('2024-03-05'),
    dateModification: new Date('2024-03-05'),
    categorie: 'memoires',
    typeRessource: 'document',
    cheminFichier: '/mediatheque/memoires/pwa-native.pdf',
    tags: ['web', 'mobile', 'PWA'],
    likes: 140,
    commentaires: 18,
    vues: 2000,
    niveau: 'licence',
    estActif: true
  },
  {
    idRessource: 18,
    titre: 'Réseaux 5G et Ville Intelligente',
    description: 'Le rôle de la 5G dans le développement des infrastructures de la ville intelligente.',
    auteur: 'Nikola Tesla',
    auteurEmail: 'nikola.tesla@isimemo.edu.sn',
    filiere: 'iage',
    anneeAcademique: '2022-2023',
    datePublication: new Date('2024-02-15'),
    dateCreation: new Date('2024-02-15'),
    dateModification: new Date('2024-02-15'),
    categorie: 'memoires',
    typeRessource: 'document',
    cheminFichier: '/mediatheque/memoires/5g-smartcity.pdf',
    tags: ['5G', 'smart city', 'réseaux'],
    likes: 220,
    commentaires: 40,
    vues: 3600,
    niveau: 'master',
    estActif: true
  },
  {
    idRessource: 19,
    titre: 'Cryptographie Quantique',
    description: 'Les fondements de la cryptographie quantique et ses applications futures.',
    auteur: 'Claude Shannon',
    auteurEmail: 'claude.shannon@isimemo.edu.sn',
    filiere: 'genie-logiciel',
    anneeAcademique: '2022-2023',
    datePublication: new Date('2024-01-20'),
    dateCreation: new Date('2024-01-20'),
    dateModification: new Date('2024-01-20'),
    categorie: 'memoires',
    typeRessource: 'document',
    cheminFichier: '/mediatheque/memoires/crypto-quantum.pdf',
    tags: ['cryptographie', 'quantique', 'sécurité'],
    likes: 280,
    commentaires: 55,
    vues: 4800,
    niveau: 'master',
    estActif: true
  },

  // Canevas (un seul canevas dans la bibliothèque numérique)
  {
    idRessource: 7,
    titre: 'Canevas de mémoire de fin d\'études',
    description: 'Modèle de structure et de formatage pour la rédaction d\'un mémoire de fin d\'études.',
    auteur: 'Admin ISI',
    datePublication: new Date('2025-04-20'),
    dateCreation: new Date('2025-04-20'),
    dateModification: new Date('2025-04-20'),
    categorie: 'canevas',
    typeRessource: 'document',
    cheminFichier: '/mediatheque/canevas/memoire-fin-etudes.docx',
    tags: ['canevas', 'mémoire', 'template'],
    likes: 312,
    commentaires: 56,
    vues: 4567,
    niveau: 'all',
    estImportant: true,
    estActif: true // Canevas toujours actif
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getRessourceById = (id: number): RessourceMediatheque | undefined => {
  return mockRessourcesMediatheque.find(r => r.idRessource === id);
};

export const getRessourcesParCategorie = (categorie: TypeCategorieRessource): RessourceMediatheque[] => {
  return mockRessourcesMediatheque.filter(r => r.categorie === categorie && r.estActif !== false);
};

export const getRessourcesImportantes = (): RessourceMediatheque[] => {
  return mockRessourcesMediatheque.filter(r => r.estImportant && r.estActif !== false);
};

/**
 * Active une ressource dans la bibliothèque numérique (après validation par la commission)
 */
export const activerRessource = (idRessource: number): boolean => {
  const ressource = mockRessourcesMediatheque.find(r => r.idRessource === idRessource);
  if (!ressource) return false;
  ressource.estActif = true;
  return true;
};

/**
 * Récupère les ressources inactives (en attente de validation)
 */
export const getRessourcesInactives = (): RessourceMediatheque[] => {
  return mockRessourcesMediatheque.filter(r => r.estActif === false);
};

/**
 * Ajoute un document à la bibliothèque numérique
 */
export const ajouterRessourceMediatheque = (
  document: import('../dossier/Document').Document,
  dossier: import('../dossier/DossierMemoire').DossierMemoire,
  candidat: import('../acteurs/Candidat').Candidat,
  estActif: boolean = false
): RessourceMediatheque => {
  const maxId = mockRessourcesMediatheque.length > 0
    ? Math.max(...mockRessourcesMediatheque.map(r => r.idRessource))
    : 0;

  const candidatNom = `${candidat.prenom} ${candidat.nom}`;

  const nouvelleRessource: RessourceMediatheque = {
    idRessource: maxId + 1,
    titre: dossier.titre,
    description: dossier.description || `Mémoire de ${candidatNom}`,
    auteur: candidatNom,
    datePublication: new Date(),
    dateCreation: new Date(),
    dateModification: new Date(),
    categorie: 'memoires',
    typeRessource: 'document',
    cheminFichier: document.cheminFichier,
    tags: [dossier.titre.split(' ')[0], 'mémoire', 'soutenance'],
    likes: 0,
    commentaires: 0,
    vues: 0,
    niveau: candidat?.niveau === 'Licence 3' ? 'licence' : 'master',
    estActif: estActif
  };

  mockRessourcesMediatheque.push(nouvelleRessource);
  return nouvelleRessource;
};
