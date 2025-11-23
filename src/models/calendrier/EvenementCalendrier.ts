// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export enum TypeEvenement {
  SOUTENANCE = 'SOUTENANCE',
  ECHANCE = 'ECHANCE',
  RENDEZ_VOUS = 'RENDEZ_VOUS',
  AUTRE = 'AUTRE'
}

export interface EvenementCalendrier {
  idEvenement: number;
  titre: string;
  description?: string;
  dateDebut: Date;
  dateFin: Date;
  type: TypeEvenement;
  lieu?: string;
}

// ============================================================================
// MOCKS
// ============================================================================

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

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getEvenementById = (id: number): EvenementCalendrier | undefined => {
  return mockEvenements.find(e => e.idEvenement === id);
};

export const getEvenementsParType = (type: TypeEvenement): EvenementCalendrier[] => {
  return mockEvenements.filter(e => e.type === type);
};

export const getEvenementsFuturs = (): EvenementCalendrier[] => {
  const maintenant = new Date();
  return mockEvenements.filter(e => e.dateDebut >= maintenant);
};
