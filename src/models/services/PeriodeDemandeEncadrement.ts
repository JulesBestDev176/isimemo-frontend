// ============================================================================
// TYPES & INTERFACES - PÉRIODE DE DEMANDE D'ENCADREMENT
// ============================================================================

export interface PeriodeDemandeEncadrement {
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

export const mockPeriodesDemandeEncadrement: PeriodeDemandeEncadrement[] = [
  {
    idPeriode: 1,
    anneeAcademique: '2024-2025',
    dateDebut: new Date('2025-01-01'), // Même période que Dépôt Sujet (en parallèle)
    dateFin: new Date('2025-01-31'), // Même période que Dépôt Sujet (en parallèle)
    estActive: false,
    dateCreation: new Date('2024-12-15'),
    creePar: 2
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Récupère la période de demande d'encadrement active
 */
export const getPeriodeDemandeEncadrementActive = (): PeriodeDemandeEncadrement | null => {
  return mockPeriodesDemandeEncadrement.find(p => p.estActive) || null;
};

/**
 * Vérifie si une période de demande d'encadrement est active
 */
export const estPeriodeDemandeEncadrementActive = (): boolean => {
  return getPeriodeDemandeEncadrementActive() !== null;
};

/**
 * Vérifie si on est dans la période de demande d'encadrement
 */
export const estDansPeriodeDemandeEncadrement = (): boolean => {
  const periode = getPeriodeDemandeEncadrementActive();
  if (!periode) return false;
  
  const maintenant = new Date();
  return maintenant >= periode.dateDebut && maintenant <= periode.dateFin;
};

