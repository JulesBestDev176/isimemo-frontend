// ============================================================================
// TYPES & INTERFACES
// ============================================================================

import type { Candidat } from '../acteurs/Candidat';
import type { Professeur } from '../acteurs/Professeur';
import type { Document } from './Document';
import type { Binome } from './Binome';

export enum StatutDossierMemoire {
  EN_CREATION = 'EN_CREATION',
  EN_COURS = 'EN_COURS',
  EN_ATTENTE_VALIDATION = 'EN_ATTENTE_VALIDATION',
  VALIDE = 'VALIDE',
  DEPOSE = 'DEPOSE',
  SOUTENU = 'SOUTENU'
}

export enum EtapeDossier {
  CHOIX_SUJET = 'CHOIX_SUJET',
  VALIDATION_SUJET = 'VALIDATION_SUJET',
  EN_COURS_REDACTION = 'EN_COURS_REDACTION',
  DEPOT_INTERMEDIAIRE = 'DEPOT_INTERMEDIAIRE',
  DEPOT_FINAL = 'DEPOT_FINAL',
  SOUTENANCE = 'SOUTENANCE',
  TERMINE = 'TERMINE'
}

export interface DossierMemoire {
  idDossierMemoire: number;
  titre: string;
  description: string;
  dateCreation: Date;
  dateModification: Date;
  statut: StatutDossierMemoire;
  estComplet: boolean;
  autoriseSoutenance: boolean;
  autorisePrelecture?: boolean; // Autorisation de pré-lecture par l'encadrant
  prelectureEffectuee?: boolean; // Indique si la pré-lecture a été effectuée
  etape: EtapeDossier;
  anneeAcademique?: string;
  // Relations
  candidats?: Candidat[];
  encadrant?: Professeur;
  documents?: Document[];
  binome?: Binome;
}

// ============================================================================
// MOCKS
// ============================================================================

import { mockCandidats } from '../acteurs/Candidat';

export const mockDossiers: DossierMemoire[] = [
  // Dossier en création pour le candidat connecté (idCandidat: 1 correspond à l'utilisateur candidat@isimemo.edu.sn)
  // Règle métier : Un candidat ne peut avoir qu'un seul dossier en cours
  {
    idDossierMemoire: 0,
    titre: 'Nouveau dossier de mémoire',
    description: 'Dossier en cours de création - Veuillez suivre le processus étape par étape',
    dateCreation: new Date('2025-01-15'),
    dateModification: new Date('2025-01-15'),
    statut: StatutDossierMemoire.EN_CREATION,
    estComplet: false,
    autoriseSoutenance: false,
    etape: EtapeDossier.CHOIX_SUJET,
    anneeAcademique: '2024-2025',
    candidats: [mockCandidats[0]] // Candidat connecté (idCandidat: 1)
  },
  // Dossiers terminés pour le candidat connecté (idCandidat: 1)
  // Règle métier : Les dossiers terminés ne sont pas en attente mais complètement terminés
  {
    idDossierMemoire: 1,
    titre: 'Système de gestion de mémoires académiques',
    description: 'Développement d\'une plateforme web pour la gestion des mémoires de fin d\'études',
    dateCreation: new Date('2023-09-01'),
    dateModification: new Date('2024-06-15'),
    statut: StatutDossierMemoire.SOUTENU,
    estComplet: true,
    autoriseSoutenance: true,
    etape: EtapeDossier.TERMINE,
    anneeAcademique: '2023-2024',
    candidats: [mockCandidats[0]] // Candidat connecté (idCandidat: 1)
  },
  {
    idDossierMemoire: 2,
    titre: 'Application mobile de gestion de bibliothèque',
    description: 'Développement d\'une application mobile pour la gestion des emprunts de livres',
    dateCreation: new Date('2022-09-01'),
    dateModification: new Date('2023-06-20'),
    statut: StatutDossierMemoire.SOUTENU,
    estComplet: true,
    autoriseSoutenance: true,
    etape: EtapeDossier.TERMINE,
    anneeAcademique: '2022-2023',
    candidats: [mockCandidats[0]] // Candidat connecté (idCandidat: 1)
  },
  // Dossiers étudiants pour l'encadrement actif (ID 4)
  // IDs calculés comme : (idDossierMemoire * 10) + idCandidat
  // idDossierMemoire = 10, donc les IDs sont: 101, 102, 103
  // NOTE: Le dossier 101 n'est PAS associé au candidat connecté (idCandidat: 1)
  // car le candidat connecté a déjà un dossier en création (ID 0)
  // Règle métier : Un candidat ne peut avoir qu'un seul dossier en cours
  {
    idDossierMemoire: 101, // 10 * 10 + 1
    titre: 'Système de recommandation basé sur l\'intelligence artificielle',
    description: 'Développement d\'un système de recommandation intelligent utilisant des algorithmes d\'apprentissage automatique',
    dateCreation: new Date('2024-09-15'),
    dateModification: new Date('2025-01-20'),
    statut: StatutDossierMemoire.EN_COURS,
    estComplet: false,
    autoriseSoutenance: false,
    etape: EtapeDossier.EN_COURS_REDACTION,
    anneeAcademique: '2024-2025',
    candidats: [mockCandidats[1]] // Fatou Ndiaye (idCandidat: 2) - Pas le candidat connecté
  },
  {
    idDossierMemoire: 102, // 10 * 10 + 2
    titre: 'Application mobile de gestion de bibliothèque universitaire',
    description: 'Création d\'une application mobile pour faciliter la gestion et l\'emprunt de livres dans les bibliothèques universitaires',
    dateCreation: new Date('2024-09-15'),
    dateModification: new Date('2025-01-18'),
    statut: StatutDossierMemoire.EN_COURS,
    estComplet: false,
    autoriseSoutenance: false,
    etape: EtapeDossier.DEPOT_INTERMEDIAIRE,
    anneeAcademique: '2024-2025',
    candidats: [mockCandidats[1]] // Fatou Ndiaye
  },
  {
    idDossierMemoire: 103, // 10 * 10 + 3
    titre: 'Analyse de données massives avec Apache Spark',
    description: 'Étude et implémentation d\'une solution d\'analyse de big data utilisant Apache Spark pour le traitement distribué',
    dateCreation: new Date('2024-09-15'),
    dateModification: new Date('2025-01-19'),
    statut: StatutDossierMemoire.EN_ATTENTE_VALIDATION,
    estComplet: false,
    autoriseSoutenance: false,
    etape: EtapeDossier.DEPOT_FINAL,
    anneeAcademique: '2024-2025',
    candidats: [mockCandidats[2]] // Ibrahima Ba
  },
  {
    idDossierMemoire: 104, // 10 * 10 + 4
    titre: 'Plateforme de e-learning avec réalité virtuelle',
    description: 'Développement d\'une plateforme d\'apprentissage en ligne intégrant la réalité virtuelle pour une expérience immersive',
    dateCreation: new Date('2024-09-10'),
    dateModification: new Date('2025-01-22'),
    statut: StatutDossierMemoire.EN_COURS,
    estComplet: true,
    autoriseSoutenance: false,
    autorisePrelecture: false, // Pas encore autorisé par l'encadrant
    prelectureEffectuee: false,
    etape: EtapeDossier.DEPOT_FINAL,
    anneeAcademique: '2024-2025',
    candidats: [mockCandidats[3]] // Aissatou Sarr - Toutes les tâches terminées
  },
  {
    idDossierMemoire: 105, // 10 * 10 + 5
    titre: 'Système de détection de fraudes bancaires par machine learning',
    description: 'Implémentation d\'un système intelligent de détection de fraudes dans les transactions bancaires utilisant des algorithmes de machine learning',
    dateCreation: new Date('2024-09-05'),
    dateModification: new Date('2025-01-25'),
    statut: StatutDossierMemoire.EN_ATTENTE_VALIDATION,
    estComplet: true,
    autoriseSoutenance: false,
    autorisePrelecture: true, // Autorisé par l'encadrant
    prelectureEffectuee: true, // Pré-lecture déjà effectuée
    etape: EtapeDossier.DEPOT_FINAL,
    anneeAcademique: '2024-2025',
    candidats: [mockCandidats[4]] // Moussa Kane - Pré-lecture effectuée
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getDossierById = (id: number): DossierMemoire | undefined => {
  return mockDossiers.find(d => d.idDossierMemoire === id);
};

export const getDossiersTermines = (): DossierMemoire[] => {
  return mockDossiers.filter(d => d.statut === StatutDossierMemoire.SOUTENU);
};

export const getDossiersEnCours = (): DossierMemoire[] => {
  return mockDossiers.filter(d => 
    d.statut !== StatutDossierMemoire.SOUTENU && 
    d.statut !== StatutDossierMemoire.EN_CREATION
  );
};

/**
 * Récupère les dossiers d'un candidat spécifique
 */
export const getDossiersByCandidat = (idCandidat: number): DossierMemoire[] => {
  return mockDossiers.filter(d => 
    d.candidats?.some(c => c.idCandidat === idCandidat)
  );
};

/**
 * Récupère le dossier en cours d'un candidat (un seul dossier EN_CREATION ou EN_COURS)
 * Règle métier : Un candidat ne peut avoir qu'un seul dossier en cours
 */
export const getDossierEnCoursByCandidat = (idCandidat: number): DossierMemoire | undefined => {
  return mockDossiers.find(d => 
    d.candidats?.some(c => c.idCandidat === idCandidat) &&
    (d.statut === StatutDossierMemoire.EN_CREATION || d.statut === StatutDossierMemoire.EN_COURS)
  );
};

/**
 * Récupère les dossiers terminés d'un candidat
 * Règle métier : Les dossiers terminés sont ceux avec statut SOUTENU, DEPOSE, VALIDE ou étape TERMINE
 */
export const getDossiersTerminesByCandidat = (idCandidat: number): DossierMemoire[] => {
  return mockDossiers.filter(d => 
    d.candidats?.some(c => c.idCandidat === idCandidat) &&
    (d.statut === StatutDossierMemoire.SOUTENU || 
     d.statut === StatutDossierMemoire.DEPOSE || 
     d.statut === StatutDossierMemoire.VALIDE ||
     d.etape === EtapeDossier.TERMINE)
  );
};

/**
 * Vérifie si un candidat peut créer un nouveau dossier
 * Règle métier : Un candidat ne peut créer un nouveau dossier que s'il n'a pas déjà un dossier en cours
 */
export const canCandidatCreerDossier = (idCandidat: number): boolean => {
  const dossierEnCours = getDossierEnCoursByCandidat(idCandidat);
  return dossierEnCours === undefined;
};
