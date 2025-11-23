// ============================================================================
// TYPES & INTERFACES POUR LE PIPELINE DE DOSSIER
// ============================================================================

import type { DossierMemoire } from '../dossier/DossierMemoire';
import type { SujetMemoire } from './SujetMemoire';

// ============================================================================
// TYPES POUR LE BINÔME
// ============================================================================

export interface BinomeOption {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  numeroMatricule: string;
  niveau: string;
  filiere: string;
  departement: string;
}

export interface PropositionBinome {
  id: number;
  etudiant: BinomeOption;
  dateProposition: Date;
  message: string;
  sujetChoisi?: {
    id: number;
    titre: string;
    description: string;
  };
  statut: 'en_attente' | 'acceptee' | 'refusee';
}

export interface DemandeBinome {
  id: number;
  etudiantDestinataire: BinomeOption;
  dateDemande: Date;
  message?: string;
  statut: 'en_attente' | 'acceptee' | 'refusee' | 'annulee';
  dateReponse?: Date;
  dossierMemoire?: {
    id: number;
    titre: string;
  };
}

// ============================================================================
// TYPES POUR L'ENCADRANT
// ============================================================================

export interface EncadrantOption {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  grade: string;
  specialite: string;
  departement: string;
  estDisponible: boolean;
  nombreEtudiantsEncadres: number;
  nombreMaxEtudiants: number | null; // null = infini
}

export interface DemandeEncadrant {
  id: number;
  encadrant: EncadrantOption;
  dossierMemoire: {
    id: number;
    titre: string;
    description?: string;
  };
  dateDemande: Date;
  statut: 'en_attente' | 'acceptee' | 'refusee';
  motifRefus?: string;
  dateReponse?: Date;
}

// ============================================================================
// TYPES POUR LA VALIDATION COMMISSION
// ============================================================================

export interface ValidationCommission {
  id: number;
  dossierMemoire: {
    id: number;
    titre: string;
  };
  dateDemande: Date;
  statut: 'en_attente' | 'validee' | 'rejetee';
  dateValidation?: Date;
  commentaires?: string;
}

