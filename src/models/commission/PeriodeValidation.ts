// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export enum TypePeriodeValidation {
  VALIDATION_SUJETS = 'VALIDATION_SUJETS',
  VALIDATION_CORRECTIONS = 'VALIDATION_CORRECTIONS',
  AUCUNE = 'AUCUNE'
}

export interface PeriodeValidation {
  idPeriode: number;
  type: TypePeriodeValidation;
  dateDebut: Date;
  dateFin?: Date;
  estActive: boolean;
  anneeAcademique: string;
  sessionSoutenanceId?: number; // Liée à une session de soutenance (pour validations corrections)
}

// ============================================================================
// MOCKS
// ============================================================================

export const mockPeriodesValidation: PeriodeValidation[] = [
  {
    idPeriode: 1,
    type: TypePeriodeValidation.VALIDATION_SUJETS,
    dateDebut: new Date('2025-01-15'),
    dateFin: new Date('2025-02-15'),
    estActive: true,
    anneeAcademique: '2024-2025'
  },
  // Validation corrections après session septembre
  {
    idPeriode: 2,
    type: TypePeriodeValidation.VALIDATION_CORRECTIONS,
    dateDebut: new Date('2025-09-20'),
    dateFin: new Date('2025-10-05'),
    estActive: false,
    anneeAcademique: '2024-2025',
    sessionSoutenanceId: 4 // Session septembre
  },
  // Validation corrections après session décembre
  {
    idPeriode: 3,
    type: TypePeriodeValidation.VALIDATION_CORRECTIONS,
    dateDebut: new Date('2025-12-20'),
    dateFin: new Date('2026-01-05'),
    estActive: false,
    anneeAcademique: '2024-2025',
    sessionSoutenanceId: 5 // Session décembre
  }
];

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

/**
 * Récupère la période de validation active
 */
export const getPeriodeValidationActive = (): PeriodeValidation | null => {
  return mockPeriodesValidation.find(p => p.estActive) || null;
};

/**
 * Vérifie si la période de validation des sujets est active
 */
export const estPeriodeValidationSujets = (): boolean => {
  const periodeActive = getPeriodeValidationActive();
  return periodeActive?.type === TypePeriodeValidation.VALIDATION_SUJETS;
};

/**
 * Vérifie si la période de validation des corrections est active
 */
export const estPeriodeValidationCorrections = (): boolean => {
  const periodeActive = getPeriodeValidationActive();
  return periodeActive?.type === TypePeriodeValidation.VALIDATION_CORRECTIONS;
};

/**
 * Vérifie si une période de validation est active
 */
export const aPeriodeValidationActive = (): boolean => {
  return getPeriodeValidationActive() !== null;
};

/**
 * Récupère le type de période active
 */
export const getTypePeriodeActive = (): TypePeriodeValidation => {
  const periodeActive = getPeriodeValidationActive();
  return periodeActive?.type || TypePeriodeValidation.AUCUNE;
};

/**
 * Change la période active (FONCTION DE SIMULATION - À RETIRER)
 */
export const changerPeriodeActive = (nouveauType: TypePeriodeValidation): void => {
  // Désactiver toutes les périodes
  mockPeriodesValidation.forEach(p => {
    p.estActive = false;
  });
  
  // Activer la nouvelle période
  const periode = mockPeriodesValidation.find(p => p.type === nouveauType);
  if (periode) {
    periode.estActive = true;
  } else if (nouveauType !== TypePeriodeValidation.AUCUNE) {
    // Créer une période temporaire si elle n'existe pas
    const nouvellePeriode: PeriodeValidation = {
      idPeriode: mockPeriodesValidation.length + 1,
      type: nouveauType,
      dateDebut: new Date(),
      estActive: true,
      anneeAcademique: '2024-2025'
    };
    mockPeriodesValidation.push(nouvellePeriode);
  }
};

