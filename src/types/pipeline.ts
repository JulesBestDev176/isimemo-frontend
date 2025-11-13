// Types pour le pipeline de candidat

export enum EtapePipeline {
  // Onglet 1 : Dépôt sujet
  CHOIX_SUJET = 0,
  CHOIX_BINOME = 1,
  CHOIX_ENCADRANT = 2,
  VALIDATION_COMMISSION = 3, // Fin de l'onglet 1
  
  // Onglet 2 : Dépôt dossier
  PRELECTURE = 4,
  DEPOT_FINAL = 5,
  SOUTENANCE = 6,
  CORRECTION = 7, // Optionnelle
  TERMINE = 8
}

// Processus de soutenance (séparé du processus de dépôt de sujet)
export enum EtapeSoutenance {
  DEMANDE_AUTORISATION = 0,
  DEPOT_FICHE_SUIVI = 1,
  DEPOT_RECU_PAIEMENT = 2,
  CONFIRMATION_EXEMPLAIRES = 3,
  VALIDATION_SOUTENANCE = 4
}

export interface EtapePipelineInfo {
  id: EtapePipeline;
  nom: string;
  description: string;
  estComplete: boolean;
  estActive: boolean;
  dateCompletion?: Date;
}

export interface SujetMemoire {
  id: number;
  titre: string;
  description: string;
  domaine: string;
  attentes?: string; // Attentes et prérequis pour ce sujet
  encadrantPropose?: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
  };
  estDisponible: boolean;
}

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
  message?: string;
  sujetChoisi: {
    id: number;
    titre: string;
    description?: string;
  };
  statut: 'en_attente' | 'acceptee' | 'refusee';
}

export interface DemandeBinome {
  id: number;
  etudiantDestinataire: BinomeOption;
  dateEnvoi: Date;
  message?: string;
  sujetChoisi: {
    id: number;
    titre: string;
    description?: string;
  };
  statut: 'en_attente' | 'acceptee' | 'refusee';
}

export interface EncadrantOption {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  grade?: string;
  specialite?: string;
  departement: string;
  estDisponible: boolean;
  nombreEtudiantsEncadres: number;
  nombreMaxEtudiants?: number | null; // null = infini
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

export interface ValidationCommission {
  id: number;
  dossierMemoire: {
    id: number;
    titre: string;
  };
  dateDemande: Date;
  statut: 'en_attente' | 'acceptee' | 'refusee';
  motifRefus?: string;
  dateReponse?: Date;
}

