// ============================================================================
// TYPES & INTERFACES - PÉRIODE DE DÉPÔT FINAL
// ============================================================================

export interface PeriodeDepotFinal {
  idPeriode: number;
  anneeAcademique: string;
  dateDebut: Date;
  dateFin: Date;
  estActive: boolean;
  sessionSoutenanceId: number; // Liée à une session de soutenance spécifique (obligatoire)
  dateCreation: Date;
  creePar: number; // idChefDepartement
}

// ============================================================================
// MOCKS
// ============================================================================

export const mockPeriodesDepotFinal: PeriodeDepotFinal[] = [
  // Dépôt final pour session septembre
  {
    idPeriode: 1,
    anneeAcademique: '2024-2025',
    dateDebut: new Date('2025-09-06'),
    dateFin: new Date('2025-09-12'),
    estActive: false,
    sessionSoutenanceId: 4, // Session septembre
    dateCreation: new Date('2025-08-20'),
    creePar: 2
  },
  // Dépôt final pour session décembre
  {
    idPeriode: 2,
    anneeAcademique: '2024-2025',
    dateDebut: new Date('2025-12-06'),
    dateFin: new Date('2025-12-12'),
    estActive: false,
    sessionSoutenanceId: 5, // Session décembre
    dateCreation: new Date('2025-11-20'),
    creePar: 2
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Récupère la période de dépôt final active
 */
export const getPeriodeDepotFinalActive = (): PeriodeDepotFinal | null => {
  return mockPeriodesDepotFinal.find(p => p.estActive) || null;
};

/**
 * Vérifie si une période de dépôt final est active
 */
export const estPeriodeDepotFinalActive = (): boolean => {
  return getPeriodeDepotFinalActive() !== null;
};

/**
 * Vérifie si on est dans la période de dépôt final
 */
export const estDansPeriodeDepotFinal = (): boolean => {
  const periode = getPeriodeDepotFinalActive();
  if (!periode) return false;
  
  const maintenant = new Date();
  return maintenant >= periode.dateDebut && maintenant <= periode.dateFin;
};

