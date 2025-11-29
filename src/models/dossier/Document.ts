// ============================================================================
// TYPES & INTERFACES
// ============================================================================

import type { DossierMemoire } from './DossierMemoire';

export enum StatutDocument {
  BROUILLON = 'BROUILLON',
  DEPOSE = 'DEPOSE',
  EN_ATTENTE_VALIDATION = 'EN_ATTENTE_VALIDATION',
  VALIDE = 'VALIDE',
  REJETE = 'REJETE',
  ARCHIVE = 'ARCHIVE'
}

export enum TypeDocument {
  CHAPITRE = 'CHAPITRE',
  ANNEXE = 'ANNEXE',
  FICHE_SUIVI = 'FICHE_SUIVI',
  DOCUMENT_ADMINISTRATIF = 'DOCUMENT_ADMINISTRATIF', // CNI, Attestation Bac, Bulletins, etc.
  PRESENTATION = 'PRESENTATION', // Présentation de soutenance
  AUTRE = 'AUTRE'
}

export interface Document {
  idDocument: number;
  titre: string;
  typeDocument: TypeDocument;
  cheminFichier: string;
  dateCreation: Date;
  dateModification?: Date; // Date de dernière modification (quand un nouveau livrable écrase le précédent)
  statut: StatutDocument;
  commentaire?: string;
  estPhasePublique?: boolean; // Indique si le document est en phase publique
  // Relations
  dossierMemoire?: DossierMemoire;
}

// ============================================================================
// MOCKS
// ============================================================================

import { mockDossiers } from './DossierMemoire';

// Documents administratifs - Généraux à tous les dossiers (indépendants)
export const mockDocumentsAdministratifs: Document[] = [
  {
    idDocument: 201,
    titre: 'Copie CNI',
    typeDocument: TypeDocument.DOCUMENT_ADMINISTRATIF,
    cheminFichier: '/documents/admin/cni.pdf',
    dateCreation: new Date('2024-09-05'),
    statut: StatutDocument.VALIDE,
    commentaire: 'Document administratif validé'
  },
  {
    idDocument: 202,
    titre: 'Attestation du Bac',
    typeDocument: TypeDocument.DOCUMENT_ADMINISTRATIF,
    cheminFichier: '/documents/admin/bac.pdf',
    dateCreation: new Date('2024-09-05'),
    statut: StatutDocument.VALIDE
  },
  {
    idDocument: 203,
    titre: 'Bulletin de notes - Semestre 1',
    typeDocument: TypeDocument.DOCUMENT_ADMINISTRATIF,
    cheminFichier: '/documents/admin/bulletin_s1.pdf',
    dateCreation: new Date('2024-09-10'),
    statut: StatutDocument.VALIDE
  },
  {
    idDocument: 204,
    titre: 'Bulletin de notes - Semestre 2',
    typeDocument: TypeDocument.DOCUMENT_ADMINISTRATIF,
    cheminFichier: '/documents/admin/bulletin_s2.pdf',
    dateCreation: new Date('2024-09-10'),
    statut: StatutDocument.VALIDE
  },
  {
    idDocument: 205,
    titre: 'Reçu frais de soutenance',
    typeDocument: TypeDocument.DOCUMENT_ADMINISTRATIF,
    cheminFichier: '/documents/admin/frais_soutenance.pdf',
    dateCreation: new Date('2024-12-15'),
    statut: StatutDocument.VALIDE
  }
];

// Documents du mémoire - Spécifiques à chaque dossier
export const mockDocuments: Document[] = [
  // Document pour le dossier en cours (idDossierMemoire: 0)
  {
    idDocument: 0,
    titre: 'Mémoire - Chapitre 1 : Introduction',
    typeDocument: TypeDocument.CHAPITRE,
    cheminFichier: '/documents/dossier0/chapitre1.pdf',
    dateCreation: new Date('2024-11-15'),
    dateModification: new Date('2025-01-10'),
    statut: StatutDocument.VALIDE,
    commentaire: 'Chapitre 1 validé par l\'encadrant',
    dossierMemoire: mockDossiers.find(d => d.idDossierMemoire === 0)
  },
  {
    idDocument: 10,
    titre: 'Mémoire - Chapitre 2 : État de l\'art',
    typeDocument: TypeDocument.CHAPITRE,
    cheminFichier: '/documents/dossier0/chapitre2.pdf',
    dateCreation: new Date('2024-12-01'),
    dateModification: new Date('2025-01-15'),
    statut: StatutDocument.EN_ATTENTE_VALIDATION,
    commentaire: 'En attente de validation',
    dossierMemoire: mockDossiers.find(d => d.idDossierMemoire === 0)
  },
  {
    idDocument: 11,
    titre: 'Mémoire - Chapitre 3 : Conception',
    typeDocument: TypeDocument.CHAPITRE,
    cheminFichier: '/documents/dossier0/chapitre3.pdf',
    dateCreation: new Date('2025-01-05'),
    dateModification: new Date('2025-01-20'),
    statut: StatutDocument.DEPOSE,
    commentaire: 'Dernière version déposée',
    dossierMemoire: mockDossiers.find(d => d.idDossierMemoire === 0)
  },
  // Documents pour le dossier terminé 1 (idDossierMemoire: 1)
  {
    idDocument: 1,
    titre: 'Mémoire complet - Version finale',
    typeDocument: TypeDocument.CHAPITRE,
    cheminFichier: '/documents/dossier1/memoire_final.pdf',
    dateCreation: new Date('2024-06-10'),
    statut: StatutDocument.VALIDE,
    commentaire: 'Mémoire complet validé et déposé',
    dossierMemoire: mockDossiers.find(d => d.idDossierMemoire === 1)
  },
  {
    idDocument: 12,
    titre: 'Présentation de soutenance',
    typeDocument: TypeDocument.PRESENTATION,
    cheminFichier: '/documents/dossier1/presentation.pdf',
    dateCreation: new Date('2024-06-12'),
    statut: StatutDocument.VALIDE,
    commentaire: 'Présentation validée',
    dossierMemoire: mockDossiers.find(d => d.idDossierMemoire === 1)
  },
  // Documents pour le dossier terminé 2 (idDossierMemoire: 2)
  {
    idDocument: 2,
    titre: 'Mémoire complet - Version finale',
    typeDocument: TypeDocument.CHAPITRE,
    cheminFichier: '/documents/dossier2/memoire_final.pdf',
    dateCreation: new Date('2023-06-15'),
    statut: StatutDocument.VALIDE,
    commentaire: 'Mémoire complet validé et déposé',
    dossierMemoire: mockDossiers.find(d => d.idDossierMemoire === 2)
  },
  {
    idDocument: 13,
    titre: 'Présentation de soutenance',
    typeDocument: TypeDocument.PRESENTATION,
    cheminFichier: '/documents/dossier2/presentation.pdf',
    dateCreation: new Date('2023-06-18'),
    statut: StatutDocument.VALIDE,
    commentaire: 'Présentation validée',
    dossierMemoire: mockDossiers.find(d => d.idDossierMemoire === 2)
  },
  // Documents pour les dossiers étudiants de l'encadrement actif (idDossierMemoire: 101, 102, 103)
  // Chaque dossier ne peut avoir qu'un seul document (le mémoire), chaque nouveau livrable écrase le précédent
  {
    idDocument: 101,
    titre: 'Mémoire - Version finale',
    typeDocument: TypeDocument.CHAPITRE, // Le mémoire est le document principal
    cheminFichier: '/documents/dossier101/memoire_final.pdf',
    dateCreation: new Date('2025-01-20'),
    dateModification: new Date('2025-01-20'),
    statut: StatutDocument.EN_ATTENTE_VALIDATION,
    commentaire: 'Mémoire déposé - En attente de validation',
    estPhasePublique: true, // Exemple : document corrigé en phase publique (période de validation des corrections)
    dossierMemoire: mockDossiers.find(d => d.idDossierMemoire === 101) // Association avec le dossier 101
  },
  {
    idDocument: 102,
    titre: 'Mémoire - Version finale',
    typeDocument: TypeDocument.CHAPITRE,
    cheminFichier: '/documents/dossier102/memoire_final.pdf',
    dateCreation: new Date('2025-01-18'),
    dateModification: new Date('2025-01-18'),
    statut: StatutDocument.VALIDE,
    commentaire: 'Mémoire validé'
  },
  {
    idDocument: 103,
    titre: 'Mémoire - Version finale',
    typeDocument: TypeDocument.CHAPITRE,
    cheminFichier: '/documents/dossier103/memoire_final.pdf',
    dateCreation: new Date('2025-01-19'),
    dateModification: new Date('2025-01-19'),
    statut: StatutDocument.DEPOSE,
    commentaire: 'Mémoire déposé'
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getDocumentById = (id: number): Document | undefined => {
  return [...mockDocuments, ...mockDocumentsAdministratifs].find(d => d.idDocument === id);
};

export const getDocumentsByDossier = (dossierId: number): Document[] => {
  // Pour les dossiers étudiants (101, 102, 103), retourner un seul document (le mémoire)
  // Chaque nouveau livrable écrase le précédent, donc il n'y a qu'un seul document par dossier
  if (dossierId === 101) {
    // Dossier 101 (Amadou Diallo) - Un seul document (le mémoire)
    const doc = mockDocuments.find(d => d.idDocument === 101);
    return doc ? [doc] : [];
  }
  if (dossierId === 102) {
    // Dossier 102 (Fatou Ndiaye) - Un seul document (le mémoire)
    const doc = mockDocuments.find(d => d.idDocument === 102);
    return doc ? [doc] : [];
  }
  if (dossierId === 103) {
    // Dossier 103 (Ibrahima Ba) - Un seul document (le mémoire)
    const doc = mockDocuments.find(d => d.idDocument === 103);
    return doc ? [doc] : [];
  }
  // Pour les autres dossiers, utiliser la relation dossierMemoire
  return mockDocuments.filter(d => d.dossierMemoire?.idDossierMemoire === dossierId);
};

export const getDocumentsValides = (): Document[] => {
  return mockDocuments.filter(d => d.statut === StatutDocument.VALIDE);
};

/**
 * Récupère tous les documents administratifs (généraux à tous les dossiers)
 */
export const getDocumentsAdministratifs = (): Document[] => {
  return mockDocumentsAdministratifs;
};

/**
 * Récupère les documents déposés d'un dossier
 */
export const getDocumentsDeposesByDossier = (dossierId: number): Document[] => {
  return getDocumentsByDossier(dossierId).filter(d => d.statut === StatutDocument.DEPOSE);
};

/**
 * Met un document en phase publique
 */
export const mettreDocumentEnPhasePublique = (idDocument: number): void => {
  const document = mockDocuments.find(d => d.idDocument === idDocument);
  if (document) {
    document.estPhasePublique = true;
  }
};

/**
 * Retire un document de la phase publique
 */
export const retirerDocumentDePhasePublique = (idDocument: number): void => {
  const document = mockDocuments.find(d => d.idDocument === idDocument);
  if (document) {
    document.estPhasePublique = false;
  }
};

/**
 * Récupère tous les documents en phase publique
 */
export const getDocumentsEnPhasePublique = (): Document[] => {
  return mockDocuments.filter(d => d.estPhasePublique === true);
};
