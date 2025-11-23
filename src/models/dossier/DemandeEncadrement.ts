// ============================================================================
// TYPES & INTERFACES
// ============================================================================

import type { Professeur } from '../acteurs/Professeur';
import type { Candidat } from '../acteurs/Candidat';
import type { DossierMemoire } from './DossierMemoire';

export enum StatutDemandeEncadrement {
  EN_ATTENTE = 'EN_ATTENTE',
  ACCEPTEE = 'ACCEPTEE',
  REFUSEE = 'REFUSEE',
  ANNULEE = 'ANNULEE'
}

export interface DemandeEncadrement {
  idDemande: number;
  dateDemande: Date;
  dateReponse?: Date;
  statut: StatutDemandeEncadrement;
  motifRefus?: string;
  anneeAcademique: string;
  // Relations
  candidat?: Candidat;
  professeur?: Professeur;
  dossierMemoire?: DossierMemoire;
}

// ============================================================================
// MOCKS
// ============================================================================

export const mockDemandesEncadrement: DemandeEncadrement[] = [
  {
    idDemande: 1,
    dateDemande: new Date('2025-09-15'),
    statut: StatutDemandeEncadrement.EN_ATTENTE,
    anneeAcademique: '2025-2026'
  },
  {
    idDemande: 2,
    dateDemande: new Date('2025-09-10'),
    dateReponse: new Date('2025-09-12'),
    statut: StatutDemandeEncadrement.ACCEPTEE,
    anneeAcademique: '2025-2026'
  },
  {
    idDemande: 3,
    dateDemande: new Date('2025-09-08'),
    dateReponse: new Date('2025-09-09'),
    statut: StatutDemandeEncadrement.REFUSEE,
    motifRefus: 'Capacité d\'encadrement atteinte pour cette année',
    anneeAcademique: '2025-2026'
  },
  {
    idDemande: 4,
    dateDemande: new Date('2025-09-20'),
    statut: StatutDemandeEncadrement.EN_ATTENTE,
    anneeAcademique: '2025-2026'
  },
  {
    idDemande: 5,
    dateDemande: new Date('2025-09-18'),
    statut: StatutDemandeEncadrement.EN_ATTENTE,
    anneeAcademique: '2025-2026'
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getDemandeEncadrementById = (id: number): DemandeEncadrement | undefined => {
  return mockDemandesEncadrement.find(d => d.idDemande === id);
};

export const getDemandesEncadrementByProfesseur = (idProfesseur: number): DemandeEncadrement[] => {
  // TODO: Filtrer par professeur quand les relations seront complètes
  return mockDemandesEncadrement;
};

export const getDemandesEncadrementEnAttente = (idProfesseur: number): DemandeEncadrement[] => {
  return getDemandesEncadrementByProfesseur(idProfesseur).filter(
    d => d.statut === StatutDemandeEncadrement.EN_ATTENTE
  );
};

export const getDemandesEncadrementByAnnee = (idProfesseur: number, anneeAcademique: string): DemandeEncadrement[] => {
  return getDemandesEncadrementByProfesseur(idProfesseur).filter(
    d => d.anneeAcademique === anneeAcademique
  );
};
