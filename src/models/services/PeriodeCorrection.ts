// ============================================================================
// TYPES & INTERFACES - PÉRIODE DE CORRECTION
// ============================================================================

export interface PeriodeCorrection {
  idPeriode: number;
  anneeAcademique: string;
  dateDebut: Date;
  dateFin: Date;
  estActive: boolean;
  delaiMaxCorrection?: number; // Délai maximum en jours pour corriger
  dateCreation: Date;
  creePar: number; // idChefDepartement
}

// ============================================================================
// MOCKS
// ============================================================================

export const mockPeriodesCorrection: PeriodeCorrection[] = [
  {
    idPeriode: 1,
    anneeAcademique: '2024-2025',
    dateDebut: new Date('2025-06-15'),
    dateFin: new Date('2025-07-15'),
    estActive: false,
    delaiMaxCorrection: 30, // 30 jours maximum pour corriger
    dateCreation: new Date('2025-06-01'),
    creePar: 2
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Récupère la période de correction active
 */
export const getPeriodeCorrectionActive = (): PeriodeCorrection | null => {
  return mockPeriodesCorrection.find(p => p.estActive) || null;
};

/**
 * Vérifie si une période de correction est active
 */
export const estPeriodeCorrectionActive = (): boolean => {
  return getPeriodeCorrectionActive() !== null;
};

/**
 * Vérifie si on est dans la période de correction
 */
export const estDansPeriodeCorrection = (): boolean => {
  const periode = getPeriodeCorrectionActive();
  if (!periode) return false;
  
  const maintenant = new Date();
  return maintenant >= periode.dateDebut && maintenant <= periode.dateFin;
};

