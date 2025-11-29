// ============================================================================
// TYPES & INTERFACES - PÉRIODE DE PRÉ-LECTURE
// ============================================================================

export interface PeriodePrelecture {
  idPeriode: number;
  anneeAcademique: string;
  dateDebut: Date;
  dateFin: Date;
  estActive: boolean;
  delaiMaxPrelecture?: number; // Délai maximum en jours pour une pré-lecture individuelle
  sessionSoutenanceId?: number; // Liée à une session de soutenance spécifique
  dateCreation: Date;
  creePar: number; // idChefDepartement
}

// ============================================================================
// MOCKS
// ============================================================================

export const mockPeriodesPrelecture: PeriodePrelecture[] = [
  // Pré-lecture pour session septembre
  {
    idPeriode: 1,
    anneeAcademique: '2024-2025',
    dateDebut: new Date('2025-08-01'),
    dateFin: new Date('2025-09-05'),
    estActive: false,
    delaiMaxPrelecture: 15,
    sessionSoutenanceId: 4, // Session septembre
    dateCreation: new Date('2025-07-15'),
    creePar: 2
  },
  // Pré-lecture pour session décembre
  {
    idPeriode: 2,
    anneeAcademique: '2024-2025',
    dateDebut: new Date('2025-11-01'),
    dateFin: new Date('2025-12-05'),
    estActive: false,
    delaiMaxPrelecture: 15,
    sessionSoutenanceId: 5, // Session décembre
    dateCreation: new Date('2025-10-15'),
    creePar: 2
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Récupère la période de pré-lecture active
 */
export const getPeriodePrelectureActive = (): PeriodePrelecture | null => {
  return mockPeriodesPrelecture.find(p => p.estActive) || null;
};

/**
 * Vérifie si une période de pré-lecture est active
 */
export const estPeriodePrelectureActive = (): boolean => {
  return getPeriodePrelectureActive() !== null;
};

/**
 * Vérifie si on est dans la période de pré-lecture
 */
export const estDansPeriodePrelecture = (): boolean => {
  const periode = getPeriodePrelectureActive();
  if (!periode) return false;
  
  const maintenant = new Date();
  return maintenant >= periode.dateDebut && maintenant <= periode.dateFin;
};

