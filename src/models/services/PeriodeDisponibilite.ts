// ============================================================================
// TYPES & INTERFACES - PÉRIODE DE RENSEIGNEMENT DES DISPONIBILITÉS
// ============================================================================

export interface PeriodeDisponibilite {
  idPeriode: number;
  anneeAcademique: string;
  dateDebut: Date;
  dateFin: Date;
  estActive: boolean;
  sessionSoutenanceId: number; // Liée à une session de soutenance spécifique
  dateCreation: Date;
  creePar: number; // idChefDepartement
}

// ============================================================================
// MOCKS
// ============================================================================

export const mockPeriodesDisponibilite: PeriodeDisponibilite[] = [
  // Disponibilité pour session septembre (peut continuer après dépôt final)
  {
    idPeriode: 1,
    anneeAcademique: '2024-2025',
    dateDebut: new Date('2025-08-01'), // En parallèle avec pré-lecture
    dateFin: new Date('2025-09-14'), // Continue après la fin du dépôt final (12 sept)
    estActive: false,
    sessionSoutenanceId: 4, // Session septembre
    dateCreation: new Date('2025-07-15'),
    creePar: 2
  },
  // Disponibilité pour session décembre (peut continuer après dépôt final)
  {
    idPeriode: 2,
    anneeAcademique: '2024-2025',
    dateDebut: new Date('2025-11-01'), // En parallèle avec pré-lecture
    dateFin: new Date('2025-12-14'), // Continue après la fin du dépôt final (12 déc)
    estActive: false,
    sessionSoutenanceId: 5, // Session décembre
    dateCreation: new Date('2025-10-15'),
    creePar: 2
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Récupère la période de disponibilité active
 */
export const getPeriodeDisponibiliteActive = (): PeriodeDisponibilite | null => {
  return mockPeriodesDisponibilite.find(p => p.estActive) || null;
};

/**
 * Récupère les périodes de disponibilité pour une session
 */
export const getPeriodesDisponibiliteBySession = (sessionSoutenanceId: number): PeriodeDisponibilite | null => {
  return mockPeriodesDisponibilite.find(p => p.sessionSoutenanceId === sessionSoutenanceId) || null;
};

/**
 * Vérifie si une période de disponibilité est active
 */
export const estPeriodeDisponibiliteActive = (): boolean => {
  return getPeriodeDisponibiliteActive() !== null;
};

/**
 * Vérifie si on est dans la période de disponibilité
 */
export const estDansPeriodeDisponibilite = (): boolean => {
  const periode = getPeriodeDisponibiliteActive();
  if (!periode) return false;
  
  const maintenant = new Date();
  return maintenant >= periode.dateDebut && maintenant <= periode.dateFin;
};

