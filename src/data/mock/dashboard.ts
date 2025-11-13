// Données mock pour le dashboard basées sur le diagramme de classes
// Ces données seront remplacées par des appels API lors de l'intégration du backend

import {
  DossierMemoire,
  Document,
  Professeur,
  Encadrement,
  Message,
  Ticket,
  EvenementCalendrier,
  Soutenance,
  StatutDossierMemoire,
  StatutDocument,
  TypeDocument,
  StatutEncadrement,
  TypeMessage,
  Priorite,
  StatutTicket,
  TypeEvenement,
  ModeSoutenance,
  StatutSoutenance,
  EtapeDossier,
  ProcessVerbal,
  Mention,
  MembreJury,
  RoleJury
} from '../../types/dossier';

// Mock données pour l'étudiant
// Pour les candidats : un dossier en cours (EN_CREATION) à l'étape 0 (CHOIX_SUJET)
// Pour les étudiants normaux : seulement des dossiers terminés
export const mockDossiers: DossierMemoire[] = [
  // Dossier en cours pour candidat (étape 0)
  {
    idDossierMemoire: 0,
    titre: 'Nouveau dossier de mémoire',
    description: 'Dossier en cours de création - Veuillez suivre le processus étape par étape',
    dateCreation: new Date('2025-01-15'),
    dateModification: new Date('2025-01-15'),
    statut: StatutDossierMemoire.EN_CREATION,
    estComplet: false,
    autoriseSoutenance: false,
    etape: EtapeDossier.CHOIX_SUJET,
    anneeAcademique: '2024-2025'
  },
  // Dossiers terminés
  {
    idDossierMemoire: 1,
    titre: 'Système de gestion de mémoires académiques',
    description: 'Développement d\'une plateforme web pour la gestion des mémoires de fin d\'études',
    dateCreation: new Date('2023-09-01'),
    dateModification: new Date('2024-06-15'),
    statut: StatutDossierMemoire.SOUTENU,
    estComplet: true,
    autoriseSoutenance: true,
    etape: EtapeDossier.TERMINE,
    anneeAcademique: '2023-2024'
  },
  {
    idDossierMemoire: 2,
    titre: 'Application mobile de gestion de bibliothèque',
    description: 'Développement d\'une application mobile pour la gestion des emprunts de livres',
    dateCreation: new Date('2022-09-01'),
    dateModification: new Date('2023-06-20'),
    statut: StatutDossierMemoire.SOUTENU,
    estComplet: true,
    autoriseSoutenance: true,
    etape: EtapeDossier.TERMINE,
    anneeAcademique: '2022-2023'
  }
];

// Documents administratifs - Généraux à tous les dossiers (indépendants)
export const mockDocumentsAdministratifs: Document[] = [
  {
    idDocument: 101,
    titre: 'Copie CNI',
    typeDocument: TypeDocument.DOCUMENT_ADMINISTRATIF,
    cheminFichier: '/documents/admin/cni.pdf',
    dateCreation: new Date('2024-09-05'),
    statut: StatutDocument.VALIDE,
    commentaire: 'Document administratif validé'
  },
  {
    idDocument: 102,
    titre: 'Attestation du Bac',
    typeDocument: TypeDocument.DOCUMENT_ADMINISTRATIF,
    cheminFichier: '/documents/admin/bac.pdf',
    dateCreation: new Date('2024-09-05'),
    statut: StatutDocument.VALIDE
  },
  {
    idDocument: 103,
    titre: 'Bulletin de notes - Semestre 1',
    typeDocument: TypeDocument.DOCUMENT_ADMINISTRATIF,
    cheminFichier: '/documents/admin/bulletin_s1.pdf',
    dateCreation: new Date('2024-09-10'),
    statut: StatutDocument.VALIDE
  },
  {
    idDocument: 104,
    titre: 'Bulletin de notes - Semestre 2',
    typeDocument: TypeDocument.DOCUMENT_ADMINISTRATIF,
    cheminFichier: '/documents/admin/bulletin_s2.pdf',
    dateCreation: new Date('2024-09-10'),
    statut: StatutDocument.VALIDE
  },
  {
    idDocument: 105,
    titre: 'Reçu frais de soutenance',
    typeDocument: TypeDocument.DOCUMENT_ADMINISTRATIF,
    cheminFichier: '/documents/admin/frais_soutenance.pdf',
    dateCreation: new Date('2024-12-15'),
    statut: StatutDocument.VALIDE
  }
];

// Documents du mémoire - Spécifiques à chaque dossier
export const mockDocuments: Document[] = [
  // Document pour le dossier en cours (idDossierMemoire: 0)
  // Note: Le lien dossierMemoire sera fait après la création de mockDossiers
  {
    idDocument: 0,
    titre: 'Document initial',
    typeDocument: TypeDocument.DOCUMENT_ADMINISTRATIF,
    cheminFichier: '/documents/initial.pdf',
    dateCreation: new Date('2025-01-15'),
    statut: StatutDocument.DEPOSE,
    commentaire: 'Document initial du dossier'
  },
  // Documents pour le dossier terminé 1 (idDossierMemoire: 1) - UN SEUL DOCUMENT
  {
    idDocument: 1,
    titre: 'Mémoire complet - Version finale',
    typeDocument: TypeDocument.CHAPITRE,
    cheminFichier: '/documents/dossier1/memoire_final.pdf',
    dateCreation: new Date('2024-06-10'),
    statut: StatutDocument.VALIDE,
    commentaire: 'Mémoire complet validé et déposé'
  },
  // Documents pour le dossier terminé 2 (idDossierMemoire: 2) - UN SEUL DOCUMENT
  {
    idDocument: 2,
    titre: 'Mémoire complet - Version finale',
    typeDocument: TypeDocument.CHAPITRE,
    cheminFichier: '/documents/dossier2/memoire_final.pdf',
    dateCreation: new Date('2023-06-15'),
    statut: StatutDocument.VALIDE,
    commentaire: 'Mémoire complet validé et déposé'
  }
];

export const mockEncadrant: Professeur = {
  idProfesseur: 1,
  nom: 'Pierre',
  prenom: 'Jean',
  email: 'jean.pierre@isi.ml',
  grade: 'Docteur',
  specialite: 'Informatique',
  estDisponible: true,
  departement: 'Département Informatique'
};

// Membres du jury pour les soutenances
// Chaque soutenance a 3 membres du jury + 1 encadrant = 4 personnes au total
export const mockMembresJury: MembreJury[] = [
  // Jury pour soutenance 1 (dossier 1)
  {
    idMembre: 1,
    roleJury: RoleJury.PRESIDENT,
    dateDesignation: new Date('2024-05-15'),
    professeur: {
      idProfesseur: 2,
      nom: 'Ndiaye',
      prenom: 'Ibrahima',
      email: 'ibrahima.ndiaye@isi.edu.sn',
      grade: 'Professeur',
      specialite: 'Réseaux et Sécurité',
      estDisponible: true,
      departement: 'Département Informatique'
    }
  },
  {
    idMembre: 2,
    roleJury: RoleJury.RAPPORTEUR,
    dateDesignation: new Date('2024-05-15'),
    professeur: {
      idProfesseur: 3,
      nom: 'Ba',
      prenom: 'Aissatou',
      email: 'aissatou.ba@isi.edu.sn',
      grade: 'Maître de Conférences',
      specialite: 'Base de données',
      estDisponible: true,
      departement: 'Département Informatique'
    }
  },
  {
    idMembre: 3,
    roleJury: RoleJury.EXAMINATEUR,
    dateDesignation: new Date('2024-05-15'),
    professeur: {
      idProfesseur: 4,
      nom: 'Sarr',
      prenom: 'Mamadou',
      email: 'mamadou.sarr@isi.edu.sn',
      grade: 'Professeur',
      specialite: 'Développement Web',
      estDisponible: true,
      departement: 'Département Informatique'
    }
  },
  {
    idMembre: 4,
    roleJury: RoleJury.ENCADRANT,
    dateDesignation: new Date('2024-05-15'),
    professeur: mockEncadrant
  },
  // Jury pour soutenance 2 (dossier 2)
  {
    idMembre: 5,
    roleJury: RoleJury.PRESIDENT,
    dateDesignation: new Date('2023-05-10'),
    professeur: {
      idProfesseur: 5,
      nom: 'Diallo',
      prenom: 'Fatou',
      email: 'fatou.diallo@isi.edu.sn',
      grade: 'Professeur',
      specialite: 'Intelligence Artificielle',
      estDisponible: true,
      departement: 'Département Informatique'
    }
  },
  {
    idMembre: 6,
    roleJury: RoleJury.RAPPORTEUR,
    dateDesignation: new Date('2023-05-10'),
    professeur: {
      idProfesseur: 6,
      nom: 'Kane',
      prenom: 'Amadou',
      email: 'amadou.kane@isi.edu.sn',
      grade: 'Maître de Conférences',
      specialite: 'Intelligence Artificielle',
      estDisponible: true,
      departement: 'Département Informatique'
    }
  },
  {
    idMembre: 7,
    roleJury: RoleJury.EXAMINATEUR,
    dateDesignation: new Date('2023-05-10'),
    professeur: {
      idProfesseur: 7,
      nom: 'Sow',
      prenom: 'Moussa',
      email: 'moussa.sow@isi.edu.sn',
      grade: 'Professeur',
      specialite: 'Systèmes distribués',
      estDisponible: true,
      departement: 'Département Informatique'
    }
  },
  {
    idMembre: 8,
    roleJury: RoleJury.ENCADRANT,
    dateDesignation: new Date('2023-05-10'),
    professeur: {
      idProfesseur: 8,
      nom: 'Thiam',
      prenom: 'Ousmane',
      email: 'ousmane.thiam@isi.edu.sn',
      grade: 'Docteur',
      specialite: 'Informatique',
      estDisponible: true,
      departement: 'Département Informatique'
    }
  }
];

export const mockEncadrement: Encadrement = {
  idEncadrement: 1,
  dateDebut: new Date('2024-09-01'),
  statut: StatutEncadrement.ACTIF,
  professeur: mockEncadrant
};

export const mockMessages: Message[] = [
  {
    idMessage: 'msg-1',
    contenu: 'Bonjour, j\'ai relu votre chapitre 2. Il est très bien structuré. Vous pouvez passer au chapitre 3.',
    dateEnvoi: new Date('2025-01-28T10:30:00'),
    typeMessage: TypeMessage.TEXTE
  },
  {
    idMessage: 'msg-2',
    contenu: 'N\'oubliez pas de déposer le chapitre 3 avant le 5 février.',
    dateEnvoi: new Date('2025-01-29T14:15:00'),
    typeMessage: TypeMessage.TEXTE
  }
];

export const mockTickets: Ticket[] = [
  {
    idTicket: 1,
    titre: 'Révision chapitre 3',
    description: 'Révision et validation du chapitre 3',
    priorite: Priorite.MOYENNE,
    dateCreation: new Date('2025-01-25'),
    dateEcheance: new Date('2025-02-05'),
    statut: StatutTicket.EN_COURS,
    progression: 75
  }
];

export const mockEvenements: EvenementCalendrier[] = [
  {
    idEvenement: 1,
    titre: 'Soutenance programmée',
    description: 'Soutenance de mémoire - Système de gestion de mémoires académiques',
    dateDebut: new Date('2025-03-15T09:00:00'),
    dateFin: new Date('2025-03-15T11:00:00'),
    type: TypeEvenement.SOUTENANCE,
    lieu: 'Salle A101'
  },
  {
    idEvenement: 2,
    titre: 'Échéance - Dépôt chapitre 3',
    description: 'Date limite pour le dépôt du chapitre 3',
    dateDebut: new Date('2025-02-05T23:59:59'),
    dateFin: new Date('2025-02-05T23:59:59'),
    type: TypeEvenement.ECHANCE
  },
  {
    idEvenement: 3,
    titre: 'Rendez-vous avec encadrant',
    description: 'Discussion sur l\'avancement du mémoire',
    dateDebut: new Date('2025-02-10T14:00:00'),
    dateFin: new Date('2025-02-10T15:00:00'),
    type: TypeEvenement.RENDEZ_VOUS,
    lieu: 'Bureau 205'
  }
];

export const mockSoutenances: Soutenance[] = [
  {
    idSoutenance: 1,
    dateConstitution: new Date('2024-05-20'),
    dateSoutenance: new Date('2024-06-15'),
    heureDebut: '09:00',
    heureFin: '11:00',
    duree: 120,
    mode: ModeSoutenance.PRESENTIEL,
    statut: StatutSoutenance.TERMINEE,
    dossierMemoire: mockDossiers[1], // Dossier 1
    jury: [mockMembresJury[0], mockMembresJury[1], mockMembresJury[2], mockMembresJury[3]] // 3 membres du jury + 1 encadrant
  },
  {
    idSoutenance: 2,
    dateConstitution: new Date('2023-05-15'),
    dateSoutenance: new Date('2023-06-20'),
    heureDebut: '14:00',
    heureFin: '16:00',
    duree: 120,
    mode: ModeSoutenance.PRESENTIEL,
    statut: StatutSoutenance.TERMINEE,
    dossierMemoire: mockDossiers[2], // Dossier 2
    jury: [mockMembresJury[4], mockMembresJury[5], mockMembresJury[6], mockMembresJury[7]] // 3 membres du jury + 1 encadrant
  }
];

export const mockProcessVerbaux: ProcessVerbal[] = [
  {
    idPV: 1,
    dateSoutenance: new Date('2024-06-15'),
    noteFinale: 16.5,
    mention: Mention.TRES_BIEN,
    observations: 'Excellent travail de recherche. Mémoire bien structuré avec une analyse approfondie du sujet.',
    appreciations: 'Le candidat a démontré une maîtrise solide du sujet et une capacité d\'analyse remarquable. Les recommandations proposées sont pertinentes et applicables.',
    dateCreation: new Date('2024-06-15'),
    dateSignature: new Date('2024-06-20'),
    estSigne: true,
    nombreSignatures: 4, // 3 membres du jury + 1 encadrant
    soutenance: mockSoutenances[0],
    membresJury: [mockMembresJury[0], mockMembresJury[1], mockMembresJury[2], mockMembresJury[3]] // 3 membres + 1 encadrant
  },
  {
    idPV: 2,
    dateSoutenance: new Date('2023-06-20'),
    noteFinale: 15.0,
    mention: Mention.BIEN,
    observations: 'Bon travail de recherche avec une bonne compréhension du sujet traité.',
    appreciations: 'Le mémoire présente une analyse cohérente et des propositions intéressantes. Quelques améliorations possibles sur la méthodologie.',
    demandesModifications: 'Le jury demande les modifications suivantes :\n- Améliorer la section méthodologie avec plus de détails sur les outils utilisés\n- Ajouter une analyse comparative plus approfondie\n- Corriger les erreurs de formatage dans les tableaux\n- Réviser la bibliographie pour inclure des références plus récentes',
    dateCreation: new Date('2023-06-20'),
    dateSignature: new Date('2023-06-25'),
    estSigne: true,
    nombreSignatures: 4, // 3 membres du jury + 1 encadrant
    soutenance: mockSoutenances[1],
    membresJury: [mockMembresJury[4], mockMembresJury[5], mockMembresJury[6], mockMembresJury[7]] // 3 membres + 1 encadrant
  }
];

// Lier les documents aux dossiers après leur création
mockDocuments[0].dossierMemoire = mockDossiers[0]; // Document initial -> Dossier en cours
mockDocuments[1].dossierMemoire = mockDossiers[1]; // Mémoire final -> Dossier terminé 1 (UN SEUL DOCUMENT)
mockDocuments[2].dossierMemoire = mockDossiers[2]; // Mémoire final -> Dossier terminé 2 (UN SEUL DOCUMENT)

// Lier les soutenances et procès-verbaux aux dossiers
// Chaque dossier terminé n'a qu'un seul document : le mémoire final
mockDossiers[1].documents = [mockDocuments[1]]; // Un seul document
mockDossiers[2].documents = [mockDocuments[2]]; // Un seul document

// Calculs dérivés pour le dashboard
export const getDashboardStats = () => {
  const dossiersCount = mockDossiers.length;
  const documentsCount = mockDocuments.length;
  const documentsValides = mockDocuments.filter(doc => doc.statut === StatutDocument.VALIDE).length;
  
  // Calcul de la progression (basé sur les chapitres complétés)
  const chapitresTotal = 5; // Nombre total de chapitres attendus
  const chapitresCompletes = mockDocuments.filter(
    doc => doc.typeDocument === TypeDocument.CHAPITRE && doc.statut === StatutDocument.VALIDE
  ).length;
  const progression = Math.round((chapitresCompletes / chapitresTotal) * 100);
  
  // Calcul des échéances à venir (dans les 30 prochains jours)
  const aujourdhui = new Date();
  const dans30Jours = new Date();
  dans30Jours.setDate(aujourdhui.getDate() + 30);
  
  const echeancesCount = mockEvenements.filter(
    event => event.type === TypeEvenement.ECHANCE && 
    event.dateDebut >= aujourdhui && 
    event.dateDebut <= dans30Jours
  ).length;
  
  return {
    dossiersCount,
    documentsCount,
    documentsValides,
    progression,
    echeancesCount,
    chapitresCompletes,
    chapitresTotal
  };
};

// Données pour un dossier (le plus récent par défaut)
// Note: Un étudiant n'a pas de dossier en cours, seulement des dossiers terminés
export const getDossierStatus = (dossierId?: number) => {
  // Si un ID est fourni, chercher ce dossier, sinon prendre le plus récent
  const dossier = dossierId 
    ? mockDossiers.find(d => d.idDossierMemoire === dossierId)
    : mockDossiers.sort((a, b) => b.dateModification.getTime() - a.dateModification.getTime())[0];
  
  if (!dossier) {
    return null;
  }
  
  const stats = getDashboardStats();
  
  // Prochaine échéance (si applicable pour ce dossier)
  const prochaineEcheance = mockEvenements
    .filter(event => event.type === TypeEvenement.ECHANCE && event.dateDebut >= new Date())
    .sort((a, b) => a.dateDebut.getTime() - b.dateDebut.getTime())[0];
  
  // Calcul du nombre de jours restants
  const joursRestants = prochaineEcheance 
    ? Math.ceil((prochaineEcheance.dateDebut.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;
  
  return {
    dossier,
    encadrant: mockEncadrant,
    progression: stats.progression,
    chapitresCompletes: stats.chapitresCompletes,
    chapitresTotal: stats.chapitresTotal,
    documentsCount: stats.documentsCount,
    prochaineEcheance,
    joursRestants
  };
};

