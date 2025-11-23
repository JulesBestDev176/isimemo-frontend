// ============================================================================
// TYPES & INTERFACES
// ============================================================================

import type { Ticket } from './Ticket';
import { TypeDocument } from './Document';

export enum StatutLivrable {
  DEPOSE = 'DEPOSE',
  EN_ATTENTE_VALIDATION = 'EN_ATTENTE_VALIDATION',
  VALIDE = 'VALIDE',
  REJETE = 'REJETE'
}

export interface Livrable {
  idLivrable: string;
  nomFichier: string;
  cheminFichier: string;
  typeDocument: TypeDocument;
  dateSubmission: Date;
  statut: StatutLivrable;
  version: number;
  feedback?: string;
  // Relations
  ticket?: Ticket;
}

// ============================================================================
// MOCKS
// ============================================================================

export const mockLivrables: Livrable[] = [];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getLivrableById = (id: string): Livrable | undefined => {
  return mockLivrables.find(l => l.idLivrable === id);
};
