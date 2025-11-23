// ============================================================================
// TYPES & INTERFACES
// ============================================================================

import type { DossierMemoire } from '../dossier/DossierMemoire';
import type { MembreJury } from './MembreJury';
import type { Salle } from './Salle';

export enum ModeSoutenance {
  PRESENTIEL = 'PRESENTIEL',
  DISTANCIEL = 'DISTANCIEL',
  HYBRIDE = 'HYBRIDE'
}

export enum StatutSoutenance {
  PLANIFIEE = 'PLANIFIEE',
  EN_COURS = 'EN_COURS',
  TERMINEE = 'TERMINEE',
  ANNULEE = 'ANNULEE'
}

export interface Soutenance {
  idSoutenance: number;
  dateConstitution: Date;
  dateSoutenance: Date;
  heureDebut: string;
  heureFin: string;
  duree: number;
  mode: ModeSoutenance;
  statut: StatutSoutenance;
  // Relations
  dossierMemoire?: DossierMemoire;
  jury?: MembreJury[];
  salle?: Salle;
}

// ============================================================================
// MOCKS
// ============================================================================

export const mockSoutenances: Soutenance[] = [
  {
    idSoutenance: 1,
    dateConstitution: new Date('2024-05-20'),
    dateSoutenance: new Date('2024-06-15'),
    heureDebut: '09:00',
    heureFin: '11:00',
    duree: 120,
    mode: ModeSoutenance.PRESENTIEL,
    statut: StatutSoutenance.TERMINEE
  },
  {
    idSoutenance: 2,
    dateConstitution: new Date('2023-05-15'),
    dateSoutenance: new Date('2023-06-20'),
    heureDebut: '14:00',
    heureFin: '16:00',
    duree: 120,
    mode: ModeSoutenance.PRESENTIEL,
    statut: StatutSoutenance.TERMINEE
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getSoutenanceById = (id: number): Soutenance | undefined => {
  return mockSoutenances.find(s => s.idSoutenance === id);
};

export const getSoutenancesTerminees = (): Soutenance[] => {
  return mockSoutenances.filter(s => s.statut === StatutSoutenance.TERMINEE);
};

export const getSoutenancesPlanifiees = (): Soutenance[] => {
  return mockSoutenances.filter(s => s.statut === StatutSoutenance.PLANIFIEE);
};
