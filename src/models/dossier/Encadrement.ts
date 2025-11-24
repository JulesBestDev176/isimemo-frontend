// ============================================================================
// TYPES & INTERFACES
// ============================================================================

import type { Professeur } from '../acteurs/Professeur';
import type { DossierMemoire } from './DossierMemoire';
import { StatutDossierMemoire, EtapeDossier, mockDossiers } from './DossierMemoire';
import { mockCandidats } from '../acteurs/Candidat';
import { mockProfesseurs } from '../acteurs/Professeur';

// Type declarations to avoid circular dependencies
// The full Message and Ticket types are defined in their respective files
type Message = any;
type Ticket = any;

export enum StatutEncadrement {
  ACTIF = 'ACTIF',
  TERMINE = 'TERMINE',
  ANNULE = 'ANNULE'
}

export interface Encadrement {
  idEncadrement: number;
  dateDebut: Date;
  dateFin?: Date;
  statut: StatutEncadrement;
  anneeAcademique: string;
  // Relations
  professeur?: Professeur;
  dossierMemoire?: DossierMemoire;
  messages?: Message[];
  tickets?: Ticket[];
}

// ============================================================================
// MOCKS
// ============================================================================

export const mockEncadrement: Encadrement = {
  idEncadrement: 1,
  dateDebut: new Date('2024-09-01'),
  statut: StatutEncadrement.TERMINE,
  dateFin: new Date('2024-06-30'),
  anneeAcademique: '2023-2024'
};

export const mockEncadrements: Encadrement[] = [
  // Encadrements terminés pour le professeur ID 3 (Pierre Durand - professeur seul)
  {
    idEncadrement: 1,
    dateDebut: new Date('2023-09-01'),
    dateFin: new Date('2024-06-30'),
    statut: StatutEncadrement.TERMINE,
    anneeAcademique: '2023-2024'
  },
  {
    idEncadrement: 2,
    dateDebut: new Date('2022-09-01'),
    dateFin: new Date('2023-06-30'),
    statut: StatutEncadrement.TERMINE,
    anneeAcademique: '2022-2023'
  },
  {
    idEncadrement: 3,
    dateDebut: new Date('2021-09-01'),
    dateFin: new Date('2022-06-30'),
    statut: StatutEncadrement.TERMINE,
    anneeAcademique: '2021-2022'
  },
  // Encadrements actifs pour d'autres professeurs (ID 4, 5)
  {
    idEncadrement: 4,
    dateDebut: new Date('2024-09-01'),
    statut: StatutEncadrement.ACTIF,
    anneeAcademique: '2024-2025',
    professeur: mockProfesseurs.find(p => p.idProfesseur === 4), // Mamadou Sarr (encadrant principal)
    dossierMemoire: {
      idDossierMemoire: 10,
      titre: 'Mémoire de fin d\'études - Encadrement actif',
      description: 'Dossier de mémoire en cours pour plusieurs étudiants',
      dateCreation: new Date('2024-09-15'),
      dateModification: new Date('2025-01-20'),
      statut: StatutDossierMemoire.EN_COURS,
      estComplet: false,
      autoriseSoutenance: false,
      etape: EtapeDossier.EN_COURS_REDACTION,
      anneeAcademique: '2024-2025',
      candidats: [
        mockCandidats[0], // Amadou Diallo
        mockCandidats[1], // Fatou Ndiaye
        mockCandidats[2], // Ibrahima Ba
        mockCandidats[3], // Aissatou Sarr - Toutes les tâches terminées
        mockCandidats[4]  // Moussa Kane - Pré-lecture effectuée
      ]
    }
  },
  {
    idEncadrement: 5,
    dateDebut: new Date('2024-09-01'),
    statut: StatutEncadrement.ACTIF,
    anneeAcademique: '2024-2025'
  },
  // Encadrement actif pour Omar Gueye (ID 9) - encadrant et membre jury
  {
    idEncadrement: 6,
    dateDebut: new Date('2024-09-01'),
    statut: StatutEncadrement.ACTIF,
    anneeAcademique: '2024-2025',
    professeur: mockProfesseurs.find(p => p.idProfesseur === 9), // Omar Gueye
    dossierMemoire: mockDossiers.find(d => d.idDossierMemoire === 106) // Dossier 106 pour Moussa Diop
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getEncadrementById = (id: number): Encadrement | undefined => {
  return mockEncadrements.find(e => e.idEncadrement === id);
};

export const getEncadrementsByProfesseur = (idProfesseur: number): Encadrement[] => {
  // Pour le professeur ID 3 (Pierre Durand), retourner uniquement les encadrements 1, 2, 3 (tous terminés)
  if (idProfesseur === 3) {
    return mockEncadrements.filter(e => [1, 2, 3].includes(e.idEncadrement));
  }
  // Pour le professeur ID 5 (Fatou Diallo - encadrant connecté), retourner l'encadrement 4 (actif)
  if (idProfesseur === 5) {
    return mockEncadrements.filter(e => e.idEncadrement === 4);
  }
  // Pour le professeur ID 9 (Omar Gueye - encadrant et membre jury), retourner l'encadrement 6 (actif)
  if (idProfesseur === 9) {
    return mockEncadrements.filter(e => e.idEncadrement === 6);
  }
  // Pour les autres professeurs, retourner tous les encadrements
  return mockEncadrements;
};

export const getEncadrementsActifs = (idProfesseur: number): Encadrement[] => {
  // Un encadrant ne peut avoir qu'un seul encadrement actif
  const encadrementsActifs = getEncadrementsByProfesseur(idProfesseur).filter(
    e => e.statut === StatutEncadrement.ACTIF
  );
  // Retourner uniquement le premier encadrement actif (ou un tableau vide)
  return encadrementsActifs.length > 0 ? [encadrementsActifs[0]] : [];
};

// Fonction pour obtenir l'unique encadrement actif (retourne undefined si aucun)
export const getEncadrementActif = (idProfesseur: number): Encadrement | undefined => {
  const encadrementsActifs = getEncadrementsActifs(idProfesseur);
  return encadrementsActifs.length > 0 ? encadrementsActifs[0] : undefined;
};

/**
 * Récupère l'encadrement actif pour un candidat donné
 * Cherche dans tous les encadrements actifs celui qui contient le candidat
 */
export const getEncadrementActifByCandidat = (idCandidat: number): Encadrement | undefined => {
  return mockEncadrements.find(
    e => e.statut === StatutEncadrement.ACTIF &&
         e.dossierMemoire?.candidats?.some(c => c.idCandidat === idCandidat)
  );
};

export const getEncadrementsByAnnee = (idProfesseur: number, anneeAcademique: string): Encadrement[] => {
  return getEncadrementsByProfesseur(idProfesseur).filter(
    e => e.anneeAcademique === anneeAcademique
  );
};

/**
 * Récupère les encadrements associés à un dossier
 */
export const getEncadrementsByDossier = (idDossierMemoire: number): Encadrement[] => {
  return mockEncadrements.filter(
    e => e.dossierMemoire?.idDossierMemoire === idDossierMemoire
  );
};
