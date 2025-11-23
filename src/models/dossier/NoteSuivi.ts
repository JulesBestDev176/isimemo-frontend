// ============================================================================
// TYPES & INTERFACES
// ============================================================================

import type { DossierMemoire } from './DossierMemoire';
import type { Encadrement } from './Encadrement';

export interface NoteSuivi {
  idNoteSuivi: number;
  contenu: string;
  dateCreation: Date;
  dateModification?: Date;
  // Relations
  dossierMemoire?: DossierMemoire;
  encadrement?: Encadrement;
  idEncadrant: number; // ID de l'encadrant qui a créé la note
}

// ============================================================================
// MOCKS
// ============================================================================

export const mockNotesSuivi: NoteSuivi[] = [
  {
    idNoteSuivi: 1,
    contenu: 'Première réunion de suivi avec l\'étudiant. Discussion sur le choix du sujet et la méthodologie. L\'étudiant a bien compris les attentes et semble motivé.',
    dateCreation: new Date('2025-01-10T10:00:00'),
    dossierMemoire: { idDossierMemoire: 101 } as DossierMemoire,
    idEncadrant: 4
  },
  {
    idNoteSuivi: 2,
    contenu: 'Révision du chapitre 1. Bon travail sur l\'introduction, mais il faut approfondir l\'état de l\'art. L\'étudiant doit ajouter au moins 5 références supplémentaires.',
    dateCreation: new Date('2025-01-15T14:30:00'),
    dossierMemoire: { idDossierMemoire: 101 } as DossierMemoire,
    idEncadrant: 4
  },
  {
    idNoteSuivi: 3,
    contenu: 'Suivi de progression : L\'étudiant avance bien. Le chapitre 2 est en cours de rédaction. Prochaine réunion prévue le 25 janvier.',
    dateCreation: new Date('2025-01-20T16:00:00'),
    dossierMemoire: { idDossierMemoire: 101 } as DossierMemoire,
    idEncadrant: 4
  },
  {
    idNoteSuivi: 4,
    contenu: 'Première rencontre avec l\'étudiant. Présentation du sujet et des objectifs. Bonne compréhension des enjeux.',
    dateCreation: new Date('2025-01-08T09:00:00'),
    dossierMemoire: { idDossierMemoire: 102 } as DossierMemoire,
    idEncadrant: 4
  },
  {
    idNoteSuivi: 5,
    contenu: 'Validation du plan détaillé. L\'étudiant a bien structuré son mémoire. Passage à la rédaction du chapitre 1.',
    dateCreation: new Date('2025-01-12T11:00:00'),
    dossierMemoire: { idDossierMemoire: 102 } as DossierMemoire,
    idEncadrant: 4
  },
  {
    idNoteSuivi: 6,
    contenu: 'Première réunion de suivi. Discussion sur la méthodologie et les outils à utiliser. L\'étudiant est autonome et pose de bonnes questions.',
    dateCreation: new Date('2025-01-05T15:00:00'),
    dossierMemoire: { idDossierMemoire: 103 } as DossierMemoire,
    idEncadrant: 4
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Récupère toutes les notes de suivi pour un dossier donné
 */
export const getNotesSuiviByDossier = (idDossierMemoire: number): NoteSuivi[] => {
  return mockNotesSuivi
    .filter(note => note.dossierMemoire?.idDossierMemoire === idDossierMemoire)
    .sort((a, b) => b.dateCreation.getTime() - a.dateCreation.getTime()); // Plus récentes en premier
};

/**
 * Récupère une note de suivi par son ID
 */
export const getNoteSuiviById = (id: number): NoteSuivi | undefined => {
  return mockNotesSuivi.find(note => note.idNoteSuivi === id);
};

/**
 * Ajoute une nouvelle note de suivi
 */
export const addNoteSuivi = (note: Omit<NoteSuivi, 'idNoteSuivi' | 'dateCreation'>): NoteSuivi => {
  const newNote: NoteSuivi = {
    ...note,
    idNoteSuivi: Math.max(...mockNotesSuivi.map(n => n.idNoteSuivi), 0) + 1,
    dateCreation: new Date()
  };
  mockNotesSuivi.push(newNote);
  return newNote;
};

/**
 * Met à jour une note de suivi existante
 */
export const updateNoteSuivi = (id: number, updates: Partial<Omit<NoteSuivi, 'idNoteSuivi' | 'dateCreation'>>): NoteSuivi | undefined => {
  const note = mockNotesSuivi.find(n => n.idNoteSuivi === id);
  if (note) {
    Object.assign(note, updates, { dateModification: new Date() });
    return note;
  }
  return undefined;
};

/**
 * Supprime une note de suivi
 */
export const deleteNoteSuivi = (id: number): boolean => {
  const index = mockNotesSuivi.findIndex(n => n.idNoteSuivi === id);
  if (index !== -1) {
    mockNotesSuivi.splice(index, 1);
    return true;
  }
  return false;
};

