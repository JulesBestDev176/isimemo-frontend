// ============================================================================
// TYPES & INTERFACES
// ============================================================================

import type { Candidat } from '../acteurs/Candidat';

export enum StatutDemandeBinome {
  EN_ATTENTE = 'EN_ATTENTE',
  ACCEPTE = 'ACCEPTE',
  REFUSE = 'REFUSE',
  DISSOUS = 'DISSOUS'
}

export interface Binome {
  idBinome: number;
  dateDemande: Date;
  dateFormation?: Date;
  dateDissolution?: Date;
  message?: string;
  reponse?: string;
  dateReponse?: Date;
  statut: StatutDemandeBinome;
  // Relations
  candidats?: Candidat[];
}

// ============================================================================
// MOCKS
// ============================================================================

export const mockBinomes: Binome[] = [];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getBinomeById = (id: number): Binome | undefined => {
  return mockBinomes.find(b => b.idBinome === id);
};
