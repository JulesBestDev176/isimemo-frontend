// ============================================================================
// TYPES & INTERFACES - PÉRIODE DE DÉPÔT DE SUJET
// ============================================================================

export interface PeriodeDepotSujet {
  idPeriode: number;
  anneeAcademique: string;
  dateDebut: Date;
  dateFin: Date;
  estActive: boolean;
  dateCreation: Date;
  creePar: number; // idChefDepartement
}

// ============================================================================
// MOCKS
// ============================================================================

export const mockPeriodesDepotSujet: PeriodeDepotSujet[] = [
  {
    idPeriode: 1,
    anneeAcademique: '2024-2025',
    dateDebut: new Date('2024-10-01'),
    dateFin: new Date('2024-11-30'),
    estActive: false,
    dateCreation: new Date('2024-09-15'),
    creePar: 2
  },
  {
    idPeriode: 2,
    anneeAcademique: '2025-2026',
    dateDebut: new Date('2025-10-01'),
    dateFin: new Date('2025-11-30'),
    estActive: false,
    dateCreation: new Date('2025-09-15'),
    creePar: 2
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Récupère la période de dépôt de sujet active
 */
export const getPeriodeDepotSujetActive = (): PeriodeDepotSujet | null => {
  return mockPeriodesDepotSujet.find(p => p.estActive) || null;
};

/**
 * Vérifie si une période de dépôt de sujet est active
 */
export const estPeriodeDepotSujetActive = (): boolean => {
  return getPeriodeDepotSujetActive() !== null;
};

/**
 * Vérifie si on est dans la période de dépôt de sujet
 */
export const estDansPeriodeDepotSujet = (): boolean => {
  const periode = getPeriodeDepotSujetActive();
  if (!periode) return false;
  
  const maintenant = new Date();
  return maintenant >= periode.dateDebut && maintenant <= periode.dateFin;
};

