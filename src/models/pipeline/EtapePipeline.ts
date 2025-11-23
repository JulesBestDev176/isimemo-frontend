// ============================================================================
// TYPES & INTERFACES
// ============================================================================

// Processus de pipeline pour le candidat
export enum EtapePipeline {
  // Onglet 1 : Dépôt sujet
  CHOIX_SUJET = 0,
  CHOIX_BINOME = 1,
  CHOIX_ENCADRANT = 2,
  VALIDATION_COMMISSION = 3,
  
  // Onglet 2 : Dépôt dossier
  PRELECTURE = 4,
  DEPOT_FINAL = 5,
  SOUTENANCE = 6,
  CORRECTION = 7,
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

// ============================================================================
// MOCKS
// ============================================================================

export const mockEtapesPipeline: EtapePipelineInfo[] = [
  {
    id: EtapePipeline.CHOIX_SUJET,
    nom: 'Choix du sujet',
    description: 'Sélectionnez un sujet de mémoire',
    estComplete: false,
    estActive: true
  },
  {
    id: EtapePipeline.CHOIX_BINOME,
    nom: 'Choix du binôme',
    description: 'Choisissez votre binôme (optionnel)',
    estComplete: false,
    estActive: false
  },
  {
    id: EtapePipeline.CHOIX_ENCADRANT,
    nom: 'Choix de l\'encadrant',
    description: 'Sélectionnez votre encadrant',
    estComplete: false,
    estActive: false
  },
  {
    id: EtapePipeline.VALIDATION_COMMISSION,
    nom: 'Validation commission',
    description: 'Validation par la commission',
    estComplete: false,
    estActive: false
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getEtapeById = (id: EtapePipeline): EtapePipelineInfo | undefined => {
  return mockEtapesPipeline.find(e => e.id === id);
};

export const getEtapeActive = (): EtapePipelineInfo | undefined => {
  return mockEtapesPipeline.find(e => e.estActive);
};
