// ============================================================================
// TYPES & INTERFACES
// ============================================================================

import type { DossierMemoire } from './DossierMemoire';
import type { Professeur } from '../acteurs/Professeur';
import type { Candidat } from '../acteurs/Candidat';

export enum StatutDemandePrelecture {
  EN_ATTENTE = 'EN_ATTENTE', // Mémoire assigné pour pré-lecture, en attente de traitement
  EN_COURS = 'EN_COURS', // Pré-lecture en cours
  VALIDE = 'VALIDE', // Pré-lecture validée
  REJETE = 'REJETE' // Pré-lecture rejetée
}

export interface DemandePrelecture {
  idDemandePrelecture: number;
  dossierMemoire: DossierMemoire;
  encadrantPrincipal?: Professeur; // L'encadrant qui encadre l'étudiant
  prelecteur?: Professeur; // L'encadrant assigné pour la pré-lecture
  candidat?: Candidat; // Le candidat concerné
  dateDemande: Date;
  dateAssignation?: Date; // Date d'assignation au pré-lecteur
  dateTraitement?: Date; // Date de validation/rejet
  statut: StatutDemandePrelecture;
  commentaire?: string; // Commentaire du pré-lecteur
  feedbackRejet?: {
    commentaire: string;
    corrections: string[]; // Liste des corrections à apporter
    dateRejet: Date;
  };
  documentMemoire?: {
    cheminFichier: string;
    nomFichier: string;
    taille: string;
    dateDepot: Date;
  };
}

// ============================================================================
// MOCKS
// ============================================================================

import { mockDossiers } from './DossierMemoire';
import { mockProfesseurs } from '../acteurs/Professeur';
import { mockCandidats } from '../acteurs/Candidat';

export const mockDemandesPrelecture: DemandePrelecture[] = [
  // Demande en attente pour l'encadrant ID 5 (Fatou Diallo - pré-lecteur, User.id = '5')
  {
    idDemandePrelecture: 1,
    dossierMemoire: mockDossiers.find(d => d.idDossierMemoire === 104)!, // Aissatou Sarr - Toutes les tâches terminées
    encadrantPrincipal: mockProfesseurs.find(p => p.idProfesseur === 4)!, // Mamadou Sarr (encadrant principal)
    prelecteur: mockProfesseurs.find(p => p.idProfesseur === 5)!, // Fatou Diallo (pré-lecteur) - correspond à User.id = '5'
    candidat: mockCandidats.find(c => c.idCandidat === 4)!, // Aissatou Sarr
    dateDemande: new Date('2025-02-01'),
    dateAssignation: new Date('2025-02-01'),
    statut: StatutDemandePrelecture.EN_ATTENTE,
    documentMemoire: {
      cheminFichier: '/memoires/104/memoire_complet.pdf',
      nomFichier: 'Memoire_Aissatou_Sarr.pdf',
      taille: '3.2 MB',
      dateDepot: new Date('2025-02-01')
    }
  },
  // Demande en attente pour l'encadrant ID 4 (Mamadou Sarr - pré-lecteur, a l'encadrement actif ID 4)
  {
    idDemandePrelecture: 4,
    dossierMemoire: mockDossiers.find(d => d.idDossierMemoire === 102)!, // Fatou Ndiaye
    encadrantPrincipal: mockProfesseurs.find(p => p.idProfesseur === 5)!, // Fatou Diallo (encadrant principal)
    prelecteur: mockProfesseurs.find(p => p.idProfesseur === 4)!, // Mamadou Sarr (pré-lecteur) - a l'encadrement actif
    candidat: mockCandidats.find(c => c.idCandidat === 2)!, // Fatou Ndiaye
    dateDemande: new Date('2025-02-02'),
    dateAssignation: new Date('2025-02-02'),
    statut: StatutDemandePrelecture.EN_ATTENTE,
    documentMemoire: {
      cheminFichier: '/memoires/102/memoire_complet.pdf',
      nomFichier: 'Memoire_Fatou_Ndiaye.pdf',
      taille: '3.5 MB',
      dateDepot: new Date('2025-02-02')
    }
  },
  // Demande en cours pour l'encadrant ID 5
  {
    idDemandePrelecture: 2,
    dossierMemoire: mockDossiers.find(d => d.idDossierMemoire === 105)!, // Moussa Kane - Pré-lecture effectuée
    encadrantPrincipal: mockProfesseurs.find(p => p.idProfesseur === 4)!, // Mamadou Sarr (encadrant principal)
    prelecteur: mockProfesseurs.find(p => p.idProfesseur === 5)!, // Fatou Diallo (pré-lecteur)
    candidat: mockCandidats.find(c => c.idCandidat === 5)!, // Moussa Kane
    dateDemande: new Date('2025-01-28'),
    dateAssignation: new Date('2025-01-28'),
    dateTraitement: new Date('2025-02-05'),
    statut: StatutDemandePrelecture.VALIDE,
    commentaire: 'Mémoire de bonne qualité. Quelques ajustements mineurs suggérés mais globalement prêt pour la soutenance.',
    documentMemoire: {
      cheminFichier: '/memoires/105/memoire_complet.pdf',
      nomFichier: 'Memoire_Moussa_Kane.pdf',
      taille: '4.1 MB',
      dateDepot: new Date('2025-01-28')
    }
  },
  // Demande rejetée pour l'encadrant ID 4 (pour voir le workflow de rejet)
  {
    idDemandePrelecture: 3,
    dossierMemoire: mockDossiers.find(d => d.idDossierMemoire === 101)!, // Amadou Diallo
    encadrantPrincipal: mockProfesseurs.find(p => p.idProfesseur === 4)!, // Mamadou Sarr (encadrant principal)
    prelecteur: mockProfesseurs.find(p => p.idProfesseur === 5)!, // Fatou Diallo (pré-lecteur)
    candidat: mockCandidats.find(c => c.idCandidat === 1)!, // Amadou Diallo
    dateDemande: new Date('2025-01-20'),
    dateAssignation: new Date('2025-01-20'),
    dateTraitement: new Date('2025-01-25'),
    statut: StatutDemandePrelecture.REJETE,
    feedbackRejet: {
      commentaire: 'Le mémoire nécessite des corrections importantes avant la pré-lecture. La problématique doit être reformulée et la méthodologie doit être plus détaillée.',
      corrections: [
        'Reformuler la problématique avec plus de précision',
        'Détailler davantage la méthodologie de recherche',
        'Ajouter des références récentes dans l\'état de l\'art'
      ],
      dateRejet: new Date('2025-01-25')
    },
    documentMemoire: {
      cheminFichier: '/memoires/101/memoire_complet.pdf',
      nomFichier: 'Memoire_Amadou_Diallo.pdf',
      taille: '2.8 MB',
      dateDepot: new Date('2025-01-20')
    }
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Récupère les demandes de pré-lecture assignées à un encadrant (pré-lecteur)
 */
export const getDemandesPrelectureByPrelecteur = (idPrelecteur: number): DemandePrelecture[] => {
  return mockDemandesPrelecture.filter(d => d.prelecteur?.idProfesseur === idPrelecteur);
};

/**
 * Récupère les demandes de pré-lecture pour un encadrant principal (qui encadre l'étudiant)
 */
export const getDemandesPrelectureByEncadrantPrincipal = (idEncadrant: number): DemandePrelecture[] => {
  return mockDemandesPrelecture.filter(d => d.encadrantPrincipal?.idProfesseur === idEncadrant);
};

/**
 * Récupère une demande de pré-lecture par son ID
 */
export const getDemandePrelectureById = (id: number): DemandePrelecture | undefined => {
  return mockDemandesPrelecture.find(d => d.idDemandePrelecture === id);
};

/**
 * Récupère les demandes de pré-lecture en attente pour un pré-lecteur
 */
export const getDemandesPrelectureEnAttente = (idPrelecteur: number): DemandePrelecture[] => {
  return mockDemandesPrelecture.filter(
    d => d.prelecteur?.idProfesseur === idPrelecteur && d.statut === StatutDemandePrelecture.EN_ATTENTE
  );
};

/**
 * Récupère les demandes de pré-lecture rejetées pour un encadrant principal
 */
export const getDemandesPrelectureRejetees = (idEncadrant: number): DemandePrelecture[] => {
  return mockDemandesPrelecture.filter(
    d => d.encadrantPrincipal?.idProfesseur === idEncadrant && d.statut === StatutDemandePrelecture.REJETE
  );
};

/**
 * Valide une demande de pré-lecture
 */
export const validerPrelecture = (
  idDemande: number,
  commentaire?: string
): DemandePrelecture | undefined => {
  const demande = mockDemandesPrelecture.find(d => d.idDemandePrelecture === idDemande);
  if (demande) {
    demande.statut = StatutDemandePrelecture.VALIDE;
    demande.dateTraitement = new Date();
    if (commentaire) {
      demande.commentaire = commentaire;
    }
    // Mettre à jour le dossier
    if (demande.dossierMemoire) {
      demande.dossierMemoire.prelectureEffectuee = true;
    }
    return demande;
  }
  return undefined;
};

/**
 * Rejette une demande de pré-lecture
 */
export const rejeterPrelecture = (
  idDemande: number,
  commentaire: string,
  corrections: string[]
): DemandePrelecture | undefined => {
  const demande = mockDemandesPrelecture.find(d => d.idDemandePrelecture === idDemande);
  if (demande) {
    demande.statut = StatutDemandePrelecture.REJETE;
    demande.dateTraitement = new Date();
    demande.feedbackRejet = {
      commentaire,
      corrections,
      dateRejet: new Date()
    };
    // Mettre à jour le dossier
    if (demande.dossierMemoire) {
      demande.dossierMemoire.prelectureEffectuee = false;
      demande.dossierMemoire.autorisePrelecture = false;
    }
    return demande;
  }
  return undefined;
};

