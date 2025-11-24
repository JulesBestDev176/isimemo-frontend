// ============================================================================
// TYPES & INTERFACES
// ============================================================================

import type { Soutenance } from './Soutenance';
import type { MembreJury } from './MembreJury';

export enum Mention {
  EXCELLENT = 'EXCELLENT',
  TRES_BIEN = 'TRES_BIEN',
  BIEN = 'BIEN',
  ASSEZ_BIEN = 'ASSEZ_BIEN',
  PASSABLE = 'PASSABLE'
}

/**
 * Calcule automatiquement la mention selon la note
 * - Excellent : >= 18
 * - Très Bien : >= 15
 * - Bien : >= 13
 * - Assez Bien : >= 10
 * - Passable : < 10
 */
export const calculerMention = (note: number): Mention => {
  if (note >= 18) return Mention.EXCELLENT;
  if (note >= 15) return Mention.TRES_BIEN;
  if (note >= 13) return Mention.BIEN;
  if (note >= 10) return Mention.ASSEZ_BIEN;
  return Mention.PASSABLE;
};

export interface ApprobationPV {
  idMembre: number;
  idProfesseur: number;
  dateApprobation: Date;
  roleJury: import('./MembreJury').RoleJury;
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
  approbations?: ApprobationPV[]; // Liste des approbations par les membres du jury
  // Relations
  soutenance?: Soutenance;
  membresJury?: MembreJury[];
}

// ============================================================================
// MOCKS
// ============================================================================

import { mockSoutenances, getSoutenanceById } from './Soutenance';
import { RoleJury } from './MembreJury';

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
    nombreSignatures: 3,
    approbations: [
      { idMembre: 1, idProfesseur: 2, dateApprobation: new Date('2024-06-18'), roleJury: RoleJury.PRESIDENT },
      { idMembre: 2, idProfesseur: 3, dateApprobation: new Date('2024-06-19'), roleJury: RoleJury.RAPPORTEUR },
      { idMembre: 3, idProfesseur: 4, dateApprobation: new Date('2024-06-20'), roleJury: RoleJury.EXAMINATEUR }
    ],
    soutenance: mockSoutenances.find(s => s.idSoutenance === 1),
    membresJury: mockSoutenances.find(s => s.idSoutenance === 1)?.jury
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
    nombreSignatures: 3,
    approbations: [
      { idMembre: 5, idProfesseur: 5, dateApprobation: new Date('2023-06-23'), roleJury: RoleJury.PRESIDENT },
      { idMembre: 6, idProfesseur: 6, dateApprobation: new Date('2023-06-24'), roleJury: RoleJury.RAPPORTEUR },
      { idMembre: 7, idProfesseur: 7, dateApprobation: new Date('2023-06-25'), roleJury: RoleJury.EXAMINATEUR }
    ],
    soutenance: mockSoutenances.find(s => s.idSoutenance === 2),
    membresJury: mockSoutenances.find(s => s.idSoutenance === 2)?.jury
  },
  {
    idPV: 3,
    dateSoutenance: new Date('2026-03-20'),
    noteFinale: 16.0,
    mention: Mention.TRES_BIEN, // Calculé automatiquement (≥15)
    observations: 'Travail de recherche solide avec une bonne structuration du mémoire. Les analyses sont pertinentes et bien argumentées.',
    appreciations: 'Le candidat a démontré une bonne maîtrise du sujet et une capacité d\'analyse satisfaisante. Les propositions sont cohérentes et applicables.',
    dateCreation: new Date('2026-03-20'),
    estSigne: false,
    nombreSignatures: 1, // Seulement le président a approuvé
    approbations: [
      { idMembre: 12, idProfesseur: 4, dateApprobation: new Date('2026-03-20'), roleJury: RoleJury.PRESIDENT }
      // Le rapporteur (idMembre: 13, idProfesseur: 6) et l'examinateur (idMembre: 14, idProfesseur: 9 - Omar Gueye) doivent encore approuver
    ],
    soutenance: mockSoutenances.find(s => s.idSoutenance === 4),
    membresJury: mockSoutenances.find(s => s.idSoutenance === 4)?.jury
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

/**
 * Vérifie si un professeur a déjà approuvé un procès-verbal
 */
export const hasProfesseurApprouve = (pv: ProcessVerbal, idProfesseur: number): boolean => {
  return pv.approbations?.some(a => a.idProfesseur === idProfesseur) ?? false;
};

/**
 * Vérifie si un procès-verbal est complètement approuvé (3 signatures : président + 2 membres)
 */
export const isProcessVerbalCompletementApprouve = (pv: ProcessVerbal): boolean => {
  return (pv.approbations?.length ?? 0) >= 3;
};

/**
 * Ajoute une approbation au procès-verbal
 */
export const approuverProcessVerbal = (
  idPV: number,
  idProfesseur: number,
  idMembre: number,
  roleJury: import('./MembreJury').RoleJury
): ProcessVerbal | undefined => {
  const pv = mockProcessVerbaux.find(p => p.idPV === idPV);
  if (!pv) return undefined;
  
  // Vérifier si déjà approuvé
  if (hasProfesseurApprouve(pv, idProfesseur)) {
    return pv;
  }
  
  // Ajouter l'approbation
  if (!pv.approbations) {
    pv.approbations = [];
  }
  pv.approbations.push({
    idMembre,
    idProfesseur,
    dateApprobation: new Date(),
    roleJury
  });
  
  // Mettre à jour le nombre de signatures
  pv.nombreSignatures = pv.approbations.length;
  
  // Si 3 approbations, marquer comme signé
  if (isProcessVerbalCompletementApprouve(pv)) {
    pv.estSigne = true;
    pv.dateSignature = new Date();
  }
  
  return pv;
};

/**
 * Crée un nouveau procès-verbal (uniquement par le président)
 * La mention est calculée automatiquement selon la note
 */
export const createProcessVerbal = (
  soutenanceId: number,
  noteFinale: number,
  observations: string,
  appreciations: string,
  demandesModifications?: string
): ProcessVerbal => {
  const maxId = mockProcessVerbaux.length > 0 ? Math.max(...mockProcessVerbaux.map(pv => pv.idPV)) : 0;
  const soutenance = getSoutenanceById(soutenanceId);
  
  // Calculer automatiquement la mention selon la note
  const mentionCalculee = calculerMention(noteFinale);
  
  const newPV: ProcessVerbal = {
    idPV: maxId + 1,
    dateSoutenance: soutenance?.dateSoutenance ?? new Date(),
    noteFinale,
    mention: mentionCalculee,
    observations,
    appreciations,
    demandesModifications,
    dateCreation: new Date(),
    estSigne: false,
    nombreSignatures: 0,
    approbations: [],
    soutenance,
    membresJury: soutenance?.jury
  };
  
  mockProcessVerbaux.push(newPV);
  return newPV;
};
