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
  // Relations
  dossierMemoire?: DossierMemoire;
}

// ============================================================================
// MOCKS
// ============================================================================

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
    titre: 'Document initial',
    typeDocument: TypeDocument.DOCUMENT_ADMINISTRATIF,
    cheminFichier: '/documents/initial.pdf',
    dateCreation: new Date('2025-01-15'),
    statut: StatutDocument.DEPOSE,
    commentaire: 'Document initial du dossier'
  },
  // Documents pour le dossier terminé 1 (idDossierMemoire: 1)
  {
    idDocument: 1,
    titre: 'Mémoire complet - Version finale',
    typeDocument: TypeDocument.CHAPITRE,
    cheminFichier: '/documents/dossier1/memoire_final.pdf',
    dateCreation: new Date('2024-06-10'),
    statut: StatutDocument.VALIDE,
    commentaire: 'Mémoire complet validé et déposé'
  },
  // Documents pour le dossier terminé 2 (idDossierMemoire: 2)
  {
    idDocument: 2,
    titre: 'Mémoire complet - Version finale',
    typeDocument: TypeDocument.CHAPITRE,
    cheminFichier: '/documents/dossier2/memoire_final.pdf',
    dateCreation: new Date('2023-06-15'),
    statut: StatutDocument.VALIDE,
    commentaire: 'Mémoire complet validé et déposé'
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
    commentaire: 'Mémoire déposé - En attente de validation'
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
