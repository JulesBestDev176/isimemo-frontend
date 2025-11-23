// ============================================================================
// TYPES & INTERFACES
// ============================================================================

import type { Soutenance } from './Soutenance';
import type { MembreJury } from './MembreJury';

export enum Mention {
  TRES_BIEN = 'TRES_BIEN',
  BIEN = 'BIEN',
  ASSEZ_BIEN = 'ASSEZ_BIEN',
  PASSABLE = 'PASSABLE'
}

export interface ProcessVerbal {
  idPV: number;
  dateSoutenance: Date;
  noteFinale: number;
  mention: Mention;
  observations: string;
  appreciations: string;
  demandesModifications?: string;
  dateCreation: Date;
  dateSignature?: Date;
  estSigne: boolean;
  nombreSignatures: number;
  // Relations
  soutenance?: Soutenance;
  membresJury?: MembreJury[];
}

// ============================================================================
// MOCKS
// ============================================================================

export const mockProcessVerbaux: ProcessVerbal[] = [
  {
    idPV: 1,
    dateSoutenance: new Date('2024-06-15'),
    noteFinale: 16.5,
    mention: Mention.TRES_BIEN,
    observations: 'Excellent travail de recherche. Mémoire bien structuré avec une analyse approfondie du sujet.',
    appreciations: 'Le candidat a démontré une maîtrise solide du sujet et une capacité d\'analyse remarquable. Les recommandations proposées sont pertinentes et applicables.',
    dateCreation: new Date('2024-06-15'),
    dateSignature: new Date('2024-06-20'),
    estSigne: true,
    nombreSignatures: 4
  },
  {
    idPV: 2,
    dateSoutenance: new Date('2023-06-20'),
    noteFinale: 15.0,
    mention: Mention.BIEN,
    observations: 'Bon travail de recherche avec une bonne compréhension du sujet traité.',
    appreciations: 'Le mémoire présente une analyse cohérente et des propositions intéressantes. Quelques améliorations possibles sur la méthodologie.',
    demandesModifications: 'Le jury demande les modifications suivantes :\n- Améliorer la section méthodologie avec plus de détails sur les outils utilisés\n- Ajouter une analyse comparative plus approfondie\n- Corriger les erreurs de formatage dans les tableaux\n- Réviser la bibliographie pour inclure des références plus récentes',
    dateCreation: new Date('2023-06-20'),
    dateSignature: new Date('2023-06-25'),
    estSigne: true,
    nombreSignatures: 4
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getProcessVerbalById = (id: number): ProcessVerbal | undefined => {
  return mockProcessVerbaux.find(pv => pv.idPV === id);
};

export const getProcessVerbalBySoutenance = (soutenanceId: number): ProcessVerbal | undefined => {
  return mockProcessVerbaux.find(pv => pv.soutenance?.idSoutenance === soutenanceId);
};
