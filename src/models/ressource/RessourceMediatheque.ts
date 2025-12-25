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
  formation?: string;
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
// MOCKS - Documents réels du département Génie Informatique
// ============================================================================

export const mockRessourcesMediatheque: RessourceMediatheque[] = [
  // Mémoires réels - Département Génie Informatique (extraits des PDFs)
  {
    idRessource: 1,
    titre: 'Etude et Réalisation d\'une plateforme de gestion de rendez-vous médicale : Cas du Centre Hospitalier Abass Ndao',
    description: 'Rapport de stage portant sur l\'étude et la réalisation d\'une plateforme de gestion de rendez-vous médicale pour le Centre Hospitalier Abass Ndao. Encadré par M. Matar THIOYE, Senior Développeur.',
    auteur: 'Abdou Fatah Ndiaye',
    auteurEmail: 'abdou.ndiaye@isi.edu.sn',
    filiere: 'genie-logiciel',
    formation: 'Licence Professionnelle Génie Logiciel',
    anneeAcademique: '2023-2024',
    datePublication: new Date('2024-06-15'),
    dateCreation: new Date('2024-06-15'),
    dateModification: new Date('2024-06-15'),
    categorie: 'memoires',
    typeRessource: 'document',
    cheminFichier: '/assets/documents/Abdou Fatah Ndiaye.pdf',
    tags: ['santé', 'gestion rendez-vous', 'plateforme web', 'centre hospitalier'],
    likes: 45,
    commentaires: 8,
    vues: 320,
    niveau: 'licence',
    estActif: true
  },
  {
    idRessource: 2,
    titre: 'Conception et Réalisation d\'un Portail Web pour la Gestion Dématérialisée des Services Municipaux',
    description: 'Mémoire de fin de cycle portant sur la conception d\'un système de dématérialisation des services municipaux inclusif, sécurisé et adapté au contexte sénégalais. Présenté par Al Hassane Diallo à l\'Institut Supérieur d\'Informatique - Dakar.',
    auteur: 'Al Hassane Diallo',
    auteurEmail: 'alhassane.diallo@isi.edu.sn',
    filiere: 'genie-logiciel',
    formation: 'Licence Professionnelle',
    anneeAcademique: '2023-2024',
    datePublication: new Date('2024-05-20'),
    dateCreation: new Date('2024-05-20'),
    dateModification: new Date('2024-05-20'),
    categorie: 'memoires',
    typeRessource: 'document',
    cheminFichier: '/assets/documents/Conception et Réalisation d\'un Portail Web pour la Gestion Dématérialisée des Services Municipaux.pptx.pdf',
    tags: ['e-gouvernance', 'services municipaux', 'portail web', 'dématérialisation', 'GovStack'],
    likes: 78,
    commentaires: 15,
    vues: 520,
    niveau: 'licence',
    estActif: true
  },
  {
    idRessource: 3,
    titre: 'Etude et Réalisation d\'une plateforme intelligente de gestion des mémoires académiques : Cas ISI',
    description: 'Mémoire de fin de cycle portant sur la conception et réalisation d\'une plateforme intelligente de gestion des mémoires académiques pour l\'Institut Supérieur d\'Informatique. Encadré par M. Moussa WADE, Ingénieur DevOps et Cloud.',
    auteur: 'Souleymane Fall & Aliou Ndour',
    auteurEmail: 'souleymane.fall@isi.edu.sn',
    filiere: 'genie-logiciel',
    formation: 'Licence Professionnelle Génie Logiciel',
    anneeAcademique: '2024-2025',
    datePublication: new Date('2024-12-10'),
    dateCreation: new Date('2024-12-10'),
    dateModification: new Date('2024-12-10'),
    categorie: 'memoires',
    typeRessource: 'document',
    cheminFichier: '/assets/documents/FallNdour.pdf',
    tags: ['gestion académique', 'plateforme intelligente', 'ISI', 'DevOps'],
    likes: 52,
    commentaires: 10,
    vues: 380,
    niveau: 'licence',
    estActif: true
  },
  {
    idRessource: 4,
    titre: 'Conception et réalisation d\'une Plateforme de Réservation de Voyage pour une Agence de BOCOUM TRANSPORT',
    description: 'Rapport de stage de fin de cycle portant sur la conception et réalisation d\'une plateforme de réservation de voyage pour l\'agence Bocoum Transport. Encadré par M. Matar THIOYE, Senior Développeur.',
    auteur: 'Ibrahima Amadou Bocoum',
    auteurEmail: 'ibrahim.bocoum@isi.edu.sn',
    filiere: 'genie-logiciel',
    formation: 'Licence Professionnelle Génie Logiciel',
    anneeAcademique: '2023-2024',
    datePublication: new Date('2024-06-12'),
    dateCreation: new Date('2024-06-12'),
    dateModification: new Date('2024-06-12'),
    categorie: 'memoires',
    typeRessource: 'document',
    cheminFichier: '/assets/documents/Ibrahim Bocoum[4].pdf',
    tags: ['transport', 'réservation', 'voyage', 'plateforme web'],
    likes: 38,
    commentaires: 6,
    vues: 290,
    niveau: 'licence',
    estActif: true
  },
  {
    idRessource: 5,
    titre: 'Conception et réalisation d\'une Application mobile de covoiturage pour la ville de Dakar',
    description: 'Mémoire de fin de cycle portant sur la conception et réalisation d\'une application mobile de covoiturage pour la ville de Dakar. Encadré par M. Abdoulaye LY, Architecte Logiciel.',
    auteur: 'Houleymatou Diallo & Cheikh Tidiane Traore',
    auteurEmail: 'houleymatou.diallo@isi.edu.sn',
    filiere: 'genie-logiciel',
    formation: 'Licence Professionnelle Génie Logiciel',
    anneeAcademique: '2024-2025',
    datePublication: new Date('2024-12-18'),
    dateCreation: new Date('2024-12-18'),
    dateModification: new Date('2024-12-18'),
    categorie: 'memoires',
    typeRessource: 'document',
    cheminFichier: '/assets/documents/MEMOIRE_CHEIKH_HOULEYMATOU.pdf',
    tags: ['mobile', 'covoiturage', 'transport', 'Dakar'],
    likes: 65,
    commentaires: 12,
    vues: 450,
    niveau: 'licence',
    estActif: true
  },
  {
    idRessource: 6,
    titre: 'Etude et réalisation d\'une application de gestion de ressources humaines processus de recrutement pour les ESN : cas de Gainde Talent Provider (GTP)',
    description: 'Rapport de stage portant sur l\'étude et la réalisation d\'une application de gestion des ressources humaines avec focus sur le processus de recrutement pour les ESN. Encadré par M. Matar THIOYE.',
    auteur: 'Awa Thiam',
    auteurEmail: 'awa.thiam@isi.edu.sn',
    filiere: 'genie-logiciel',
    formation: 'Licence Professionnelle Génie Logiciel',
    anneeAcademique: '2023-2024',
    datePublication: new Date('2024-06-14'),
    dateCreation: new Date('2024-06-14'),
    dateModification: new Date('2024-06-14'),
    categorie: 'memoires',
    typeRessource: 'document',
    cheminFichier: '/assets/documents/Memoire Awa THIAM.pdf',
    tags: ['RH', 'recrutement', 'ESN', 'gestion'],
    likes: 72,
    commentaires: 14,
    vues: 510,
    niveau: 'licence',
    estActif: true
  },
  {
    idRessource: 7,
    titre: 'Conception et réalisation d\'une application Desktop pour la gestion des congés, des absences et du télétravail des employés de l\'entreprise STAM',
    description: 'Rapport de stage de fin de cycle portant sur la conception et réalisation d\'une application Desktop pour la gestion des congés, absences et télétravail des employés de STAM. Encadré par M. THIOYE Matar.',
    auteur: 'Bassine Diallo',
    auteurEmail: 'bassine.diallo@isi.edu.sn',
    filiere: 'genie-logiciel',
    formation: 'Licence Professionnelle Génie Logiciel',
    anneeAcademique: '2023-2024',
    datePublication: new Date('2024-06-08'),
    dateCreation: new Date('2024-06-08'),
    dateModification: new Date('2024-06-08'),
    categorie: 'memoires',
    typeRessource: 'document',
    cheminFichier: '/assets/documents/Memoire Bassine DIALLO2.pdf',
    tags: ['desktop', 'RH', 'gestion congés', 'télétravail'],
    likes: 41,
    commentaires: 7,
    vues: 310,
    niveau: 'licence',
    estActif: true
  },
  {
    idRessource: 8,
    titre: 'Etude et Réalisation d\'une Plateforme Web de Location et de Vente de Bien Immobilier pour l\'entreprise DJIBRIL SAKHO IMMOBILIER (DSI)',
    description: 'Rapport de stage portant sur l\'étude et la réalisation d\'une plateforme web de location et vente immobilière. Encadré par M. Matar THIOYE, Développeur Sénior.',
    auteur: 'Mama Aichatou Sakho',
    auteurEmail: 'mama.sakho@isi.edu.sn',
    filiere: 'genie-logiciel',
    formation: 'Licence Professionnelle Génie Logiciel',
    anneeAcademique: '2023-2024',
    datePublication: new Date('2024-06-16'),
    dateCreation: new Date('2024-06-16'),
    dateModification: new Date('2024-06-16'),
    categorie: 'memoires',
    typeRessource: 'document',
    cheminFichier: '/assets/documents/Memoire MAMA AICHATOU SAKHO L3.pdf',
    tags: ['immobilier', 'plateforme web', 'location', 'vente'],
    likes: 58,
    commentaires: 11,
    vues: 420,
    niveau: 'licence',
    estActif: true
  },
  {
    idRessource: 9,
    titre: 'Conception et réalisation d\'un site e-commerce & un système de recommandation Basé sur IA : Cas de Souq',
    description: 'Mémoire de fin de cycle portant sur la conception et réalisation d\'un site e-commerce avec un système de recommandation basé sur l\'Intelligence Artificielle. Encadré par M. Moussa WADE, Ingénieur DevOps & Cloud.',
    auteur: 'Kissima Tandia',
    auteurEmail: 'kissima.tandia@isi.edu.sn',
    filiere: 'genie-logiciel',
    formation: 'Licence Professionnelle Génie Logiciel',
    anneeAcademique: '2024-2025',
    datePublication: new Date('2024-12-25'),
    dateCreation: new Date('2024-12-25'),
    dateModification: new Date('2024-12-25'),
    categorie: 'memoires',
    typeRessource: 'document',
    cheminFichier: '/assets/documents/Memoire-Reco4i(1).pdf',
    tags: ['e-commerce', 'IA', 'recommandation', 'machine learning'],
    likes: 85,
    commentaires: 18,
    vues: 680,
    niveau: 'licence',
    estImportant: true,
    estActif: true
  },
  {
    idRessource: 10,
    titre: 'Développement d\'une application de gestion de la facturation pour une entreprise de services Numériques',
    description: 'Rapport de stage portant sur le développement d\'une application de gestion de la facturation pour une entreprise de services numériques. Encadré par M. Matar THIOYE.',
    auteur: 'Sokhna Dieye',
    auteurEmail: 'sokhna.dieye@isi.edu.sn',
    filiere: 'genie-logiciel',
    formation: 'Licence Professionnelle Génie Logiciel',
    anneeAcademique: '2023-2024',
    datePublication: new Date('2024-06-11'),
    dateCreation: new Date('2024-06-11'),
    dateModification: new Date('2024-06-11'),
    categorie: 'memoires',
    typeRessource: 'document',
    cheminFichier: '/assets/documents/MemoireSokhnaDieye.pdf',
    tags: ['facturation', 'gestion', 'services numériques'],
    likes: 49,
    commentaires: 9,
    vues: 360,
    niveau: 'licence',
    estActif: true
  },
  {
    idRessource: 11,
    titre: 'Conception et réalisation d\'une application permettant la diffusion des notifications pédagogiques et administratives pour l\'ISI',
    description: 'Projet de fin d\'études portant sur la conception et réalisation d\'une application de diffusion des notifications pédagogiques et administratives. Encadré par M. Matar THIOYE, Orbus Digital Service.',
    auteur: 'Moussa Abakar Hassane',
    auteurEmail: 'moussa.abakar@isi.edu.sn',
    filiere: 'genie-logiciel',
    formation: 'Licence Professionnelle Génie Logiciel',
    anneeAcademique: '2024-2025',
    datePublication: new Date('2024-12-20'),
    dateCreation: new Date('2024-12-20'),
    dateModification: new Date('2024-12-20'),
    categorie: 'memoires',
    typeRessource: 'document',
    cheminFichier: '/assets/documents/PFE-MoussaAbakar.pdf',
    tags: ['notifications', 'ISI', 'application', 'pédagogique'],
    likes: 67,
    commentaires: 13,
    vues: 480,
    niveau: 'licence',
    estActif: true
  },
  {
    idRessource: 12,
    titre: 'Etude et Réalisation d\'une plateforme de gestion des mémoires : Cas de l\'Institut Supérieur d\'Informatique',
    description: 'Projet de fin de cycle portant sur l\'étude et la réalisation d\'une plateforme de gestion des mémoires pour l\'ISI. Encadré par M. Abdoulaye GAYE, Ingénieur Logiciel.',
    auteur: 'Samba Gueye',
    auteurEmail: 'samba.gueye@isi.edu.sn',
    filiere: 'genie-logiciel',
    formation: 'Licence Professionnelle Génie Logiciel',
    anneeAcademique: '2024-2025',
    datePublication: new Date('2024-12-25'),
    dateCreation: new Date('2024-12-25'),
    dateModification: new Date('2024-12-25'),
    categorie: 'memoires',
    typeRessource: 'document',
    cheminFichier: '/assets/documents/REPUBLIQUE DU SENEGAL.pdf',
    tags: ['gestion mémoires', 'ISI', 'plateforme', 'académique'],
    likes: 92,
    commentaires: 20,
    vues: 720,
    niveau: 'licence',
    estImportant: true,
    estActif: true
  },
  {
    idRessource: 13,
    titre: 'Conception et réalisation d\'une application de gestion des notes d\'informations sur un tableau numérique interactif : Cas de l\'ISI',
    description: 'Rapport de fin de cycle portant sur la conception et réalisation d\'une application de gestion des notes d\'informations sur un tableau numérique interactif. Encadré par M. Gaye Abdoulaye, Ingénieur Développement Web/Mobile et DevOps.',
    auteur: 'Harsy Barry',
    auteurEmail: 'harsy.barry@isi.edu.sn',
    filiere: 'iage',
    formation: 'Licence Professionnelle IAGE',
    anneeAcademique: '2024-2025',
    datePublication: new Date('2024-12-05'),
    dateCreation: new Date('2024-12-05'),
    dateModification: new Date('2024-12-05'),
    categorie: 'memoires',
    typeRessource: 'document',
    cheminFichier: '/assets/documents/Rapport de Harsy Barry.pdf',
    tags: ['tableau interactif', 'notes', 'ISI', 'DevOps'],
    likes: 35,
    commentaires: 5,
    vues: 250,
    niveau: 'licence',
    estActif: true
  },
  {
    idRessource: 14,
    titre: 'Développement d\'une plateforme Web SIG pour la gestion et l\'analyse des données géospatiales avec Laravel et PostGIS',
    description: 'Rapport de fin de cycle portant sur le développement d\'une plateforme Web SIG pour la gestion et l\'analyse des données géospatiales. Encadré par M. Makhmadane LO, Développeur Sénior.',
    auteur: 'Cheikh Djidere Diao',
    auteurEmail: 'cheikh.diao@isi.edu.sn',
    filiere: 'genie-logiciel',
    formation: 'Licence Professionnelle Géomatique et Développement d\'Application',
    anneeAcademique: '2024-2025',
    datePublication: new Date('2024-12-22'),
    dateCreation: new Date('2024-12-22'),
    dateModification: new Date('2024-12-22'),
    categorie: 'memoires',
    typeRessource: 'document',
    cheminFichier: '/assets/documents/Rapport final Cheikh Djidere DIAO.pdf',
    tags: ['SIG', 'géospatial', 'Laravel', 'PostGIS'],
    likes: 61,
    commentaires: 11,
    vues: 430,
    niveau: 'licence',
    estActif: true
  },
  {
    idRessource: 15,
    titre: 'Etude et Réalisation d\'une plateforme de gestion des mémoires : Cas de l\'Institut Supérieur d\'Informatique',
    description: 'Projet de fin de cycle portant sur l\'étude et la réalisation d\'une plateforme de gestion des mémoires pour l\'ISI. Encadré par M. Abdoulaye GAYE, Ingénieur Logiciel.',
    auteur: 'Samba Gueye',
    auteurEmail: 'samba.gueye@isi.edu.sn',
    filiere: 'genie-logiciel',
    formation: 'Licence Professionnelle Génie Logiciel',
    anneeAcademique: '2024-2025',
    datePublication: new Date('2024-12-25'),
    dateCreation: new Date('2024-12-25'),
    dateModification: new Date('2024-12-25'),
    categorie: 'memoires',
    typeRessource: 'document',
    cheminFichier: '/assets/documents/Samba_Gueye (1).pdf',
    tags: ['gestion mémoires', 'ISI', 'plateforme'],
    likes: 88,
    commentaires: 17,
    vues: 650,
    niveau: 'licence',
    estActif: true
  },
  {
    idRessource: 16,
    titre: 'Conception et réalisation d\'un site web de réservation de voyage pour une agence de voyage',
    description: 'Mémoire de fin de cycle portant sur la conception et réalisation d\'un site web de réservation de voyage. Encadré par M. Ibrahima LO, Ingénieur Logiciel.',
    auteur: 'Soudaiss Elfayadine',
    auteurEmail: 'soudaiss.elfayadine@isi.edu.sn',
    filiere: 'genie-logiciel',
    formation: 'Licence Professionnelle Génie Logiciel',
    anneeAcademique: '2024-2025',
    datePublication: new Date('2024-12-17'),
    dateCreation: new Date('2024-12-17'),
    dateModification: new Date('2024-12-17'),
    categorie: 'memoires',
    typeRessource: 'document',
    cheminFichier: '/assets/documents/Soudaiss-ELFAYADINE-Memoire-L3GL  (Récupération automatique).pdf',
    tags: ['voyage', 'réservation', 'site web', 'agence'],
    likes: 54,
    commentaires: 10,
    vues: 390,
    niveau: 'licence',
    estActif: true
  },
  {
    idRessource: 17,
    titre: 'Etude et Réalisation d\'une Application de Gestion D\'Immobilisation de ISI',
    description: 'Rapport de stage portant sur l\'étude et la réalisation d\'une application de gestion d\'immobilisation pour l\'ISI. Encadré par M. Matar THIOYE.',
    auteur: 'N\'diaye Amy',
    auteurEmail: 'amy.ndiaye@isi.edu.sn',
    filiere: 'genie-logiciel',
    formation: 'Licence Professionnelle Génie Logiciel',
    anneeAcademique: '2023-2024',
    datePublication: new Date('2024-05-15'),
    dateCreation: new Date('2024-05-15'),
    dateModification: new Date('2024-05-15'),
    categorie: 'memoires',
    typeRessource: 'document',
    cheminFichier: '/assets/documents/memoire_licence.pdf',
    tags: ['gestion', 'immobilisation', 'ISI', 'application'],
    likes: 76,
    commentaires: 14,
    vues: 540,
    niveau: 'licence',
    estActif: true
  },
  {
    idRessource: 18,
    titre: 'Conception et Implémentation d\'une Application de Gestion Scolaire : Cas de l\'Ecole Communautaire de Nioumamilima Mboinkou (ECNM)',
    description: 'Rapport de stage portant sur la conception et l\'implémentation d\'une application de gestion scolaire. Encadré par M. Matar THIOYE, Senior Développeur.',
    auteur: 'Anoir Ibniyamine',
    auteurEmail: 'anoir.ibniyamine@isi.edu.sn',
    filiere: 'genie-logiciel',
    formation: 'Licence Professionnelle Génie Logiciel',
    anneeAcademique: '2023-2024',
    datePublication: new Date('2024-06-28'),
    dateCreation: new Date('2024-06-28'),
    dateModification: new Date('2024-06-28'),
    categorie: 'memoires',
    typeRessource: 'document',
    cheminFichier: '/assets/documents/my_memory_final.pdf',
    tags: ['gestion scolaire', 'éducation', 'application', 'école'],
    likes: 43,
    commentaires: 8,
    vues: 320,
    niveau: 'licence',
    estActif: true
  },
  {
    idRessource: 19,
    titre: 'Développement d\'une application de gestion de la relation client pour les entreprises de service de l\'immobilier',
    description: 'Rapport de stage de fin de cycle portant sur le développement d\'une application de gestion de la relation client (CRM) pour les entreprises de service de l\'immobilier. Encadré par M. Matar THIOYE.',
    auteur: 'Ndeye Ngoundje Mbaye',
    auteurEmail: 'ndeye.mbaye@isi.edu.sn',
    filiere: 'genie-logiciel',
    formation: 'Licence Professionnelle Génie Logiciel',
    anneeAcademique: '2023-2024',
    datePublication: new Date('2024-06-13'),
    dateCreation: new Date('2024-06-13'),
    dateModification: new Date('2024-06-13'),
    categorie: 'memoires',
    typeRessource: 'document',
    cheminFichier: '/assets/documents/ndeye ngoundje og (4).pdf',
    tags: ['CRM', 'immobilier', 'relation client', 'application'],
    likes: 56,
    commentaires: 10,
    vues: 400,
    niveau: 'licence',
    estActif: true
  },
  {
    idRessource: 20,
    titre: 'Etude et réalisation d\'une application de déclaration et de suivi de pièce perdue',
    description: 'Rapport de stage portant sur l\'étude et la réalisation d\'une application de déclaration et de suivi de pièces perdues. Encadré par M. Matar THIOYE.',
    auteur: 'Baye Bara Diop',
    auteurEmail: 'baye.diop@isi.edu.sn',
    filiere: 'genie-logiciel',
    formation: 'Licence Professionnelle Génie Logiciel',
    anneeAcademique: '2023-2024',
    datePublication: new Date('2024-06-07'),
    dateCreation: new Date('2024-06-07'),
    dateModification: new Date('2024-06-07'),
    categorie: 'memoires',
    typeRessource: 'document',
    cheminFichier: '/assets/documents/rapport_de_stage _baye_bara_diop.pdf',
    tags: ['déclaration', 'suivi', 'pièces perdues', 'application'],
    likes: 39,
    commentaires: 6,
    vues: 280,
    niveau: 'licence',
    estActif: true
  },

  // Canevas (un seul canevas dans la bibliothèque numérique)
  {
    idRessource: 100,
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
    estActif: true
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
