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
  // Onglet 1 : Dépôt sujet
  CHOIX_SUJET = 'CHOIX_SUJET',
  CHOIX_BINOME = 'CHOIX_BINOME',
  CHOIX_ENCADRANT = 'CHOIX_ENCADRANT',
  VALIDATION_SUJET = 'VALIDATION_SUJET',
  VALIDATION_COMMISSION = 'VALIDATION_COMMISSION',
  
  // Onglet 2 : Dépôt dossier
  EN_COURS_REDACTION = 'EN_COURS_REDACTION',
  DEPOT_INTERMEDIAIRE = 'DEPOT_INTERMEDIAIRE',
  PRELECTURE = 'PRELECTURE',
  DEPOT_FINAL = 'DEPOT_FINAL',
  SOUTENANCE = 'SOUTENANCE',
  CORRECTION = 'CORRECTION',
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
  estPhasePublique?: boolean; // Indique si le dépôt de sujet est en phase publique
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
import { mockProfesseurs } from '../acteurs/Professeur';
import { mockBinomes } from './Binome';

export const mockDossiers: DossierMemoire[] = [
  // Dossier en création pour le candidat connecté (idCandidat: 1 correspond à l'utilisateur candidat@isimemo.edu.sn)
  // Règle métier : Un candidat ne peut avoir qu'un seul dossier en cours
  {
    idDossierMemoire: 0,
    titre: 'Système intelligent de gestion de bibliothèque numérique',
    description: 'Développement d\'un système de gestion de bibliothèque numérique avec recommandations intelligentes basées sur l\'IA',
    dateCreation: new Date('2024-10-01'),
    dateModification: new Date('2025-01-20'),
    statut: StatutDossierMemoire.EN_COURS,
    estComplet: true,
    autoriseSoutenance: false,
    autorisePrelecture: true,
    prelectureEffectuee: false,
    etape: EtapeDossier.EN_COURS_REDACTION,
    anneeAcademique: '2024-2025',
    candidats: [mockCandidats.find(c => c.idCandidat === 1)!], // Candidat connecté (idCandidat: 1) - Amadou Diallo
    encadrant: mockProfesseurs.find(p => p.idProfesseur === 4) // Mamadou Sarr
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
    candidats: [mockCandidats.find(c => c.idCandidat === 1)!], // Candidat connecté (idCandidat: 1) - Amadou Diallo
    encadrant: mockProfesseurs.find(p => p.idProfesseur === 1) // Jean Pierre
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
    candidats: [mockCandidats.find(c => c.idCandidat === 1)!], // Candidat connecté (idCandidat: 1) - Amadou Diallo
    encadrant: mockProfesseurs.find(p => p.idProfesseur === 2) // Ibrahima Ndiaye
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
  },
  // Dossier pour Omar Gueye (encadrant et membre jury)
  {
    idDossierMemoire: 106,
    titre: 'Système de gestion de projets collaboratifs',
    description: 'Développement d\'une plateforme web pour la gestion collaborative de projets avec suivi en temps réel',
    dateCreation: new Date('2024-09-10'),
    dateModification: new Date('2025-01-15'),
    statut: StatutDossierMemoire.EN_COURS,
    estComplet: false,
    autoriseSoutenance: false,
    etape: EtapeDossier.EN_COURS_REDACTION,
    anneeAcademique: '2024-2025',
    candidats: [mockCandidats[5]] // Moussa Diop (idCandidat: 6)
  },
  // Dossiers en attente de validation de sujet par la commission
  {
    idDossierMemoire: 200,
    titre: 'Intelligence Artificielle pour la Détection de Fraudes',
    description: 'Développement d\'un système de détection de fraudes utilisant des algorithmes d\'apprentissage automatique et de deep learning.',
    dateCreation: new Date('2025-01-20'),
    dateModification: new Date('2025-01-20'),
    statut: StatutDossierMemoire.EN_ATTENTE_VALIDATION,
    estComplet: false,
    autoriseSoutenance: false,
    etape: EtapeDossier.VALIDATION_SUJET,
    anneeAcademique: '2024-2025',
    candidats: [mockCandidats[3]], // Aissatou Sarr
    encadrant: mockProfesseurs.find(p => p.idProfesseur === 4), // Mamadou Sarr
    estPhasePublique: true // Exemple : dépôt de sujet en phase publique (période de validation des sujets)
  },
  {
    idDossierMemoire: 201,
    titre: 'Application Mobile de Gestion de Bibliothèque',
    description: 'Conception et développement d\'une application mobile cross-platform pour la gestion automatisée d\'une bibliothèque universitaire.',
    dateCreation: new Date('2025-01-18'),
    dateModification: new Date('2025-01-18'),
    statut: StatutDossierMemoire.EN_ATTENTE_VALIDATION,
    estComplet: false,
    autoriseSoutenance: false,
    etape: EtapeDossier.VALIDATION_SUJET,
    anneeAcademique: '2024-2025',
    candidats: [mockCandidats[4]], // Moussa Kane
    encadrant: mockProfesseurs.find(p => p.idProfesseur === 5), // Fatou Diallo
    estPhasePublique: true // Exemple : en phase publique pour consultation
  },
  {
    idDossierMemoire: 202,
    titre: 'Blockchain pour la Traçabilité Alimentaire',
    description: 'Conception d\'une solution blockchain pour assurer la traçabilité des produits alimentaires de la production à la consommation.',
    dateCreation: new Date('2025-01-22'),
    dateModification: new Date('2025-01-22'),
    statut: StatutDossierMemoire.EN_ATTENTE_VALIDATION,
    estComplet: false,
    autoriseSoutenance: false,
    etape: EtapeDossier.VALIDATION_SUJET,
    anneeAcademique: '2024-2025',
    candidats: [mockCandidats[1]], // Fatou Ndiaye
    encadrant: mockProfesseurs.find(p => p.idProfesseur === 4) // Mamadou Sarr
  },
  {
    idDossierMemoire: 203,
    titre: 'Système de Recommandation Intelligent pour E-commerce',
    description: 'Développement d\'un système de recommandation basé sur l\'intelligence artificielle pour améliorer l\'expérience d\'achat en ligne.',
    dateCreation: new Date('2025-01-19'),
    dateModification: new Date('2025-01-19'),
    statut: StatutDossierMemoire.EN_ATTENTE_VALIDATION,
    estComplet: false,
    autoriseSoutenance: false,
    etape: EtapeDossier.VALIDATION_SUJET,
    anneeAcademique: '2024-2025',
    candidats: [mockCandidats[2]], // Ibrahima Ba
    encadrant: mockProfesseurs.find(p => p.idProfesseur === 5) // Fatou Diallo
  },
  {
    idDossierMemoire: 204,
    titre: 'Plateforme de E-learning avec Réalité Virtuelle',
    description: 'Développement d\'une plateforme d\'apprentissage en ligne intégrant la réalité virtuelle pour une expérience immersive.',
    dateCreation: new Date('2025-01-21'),
    dateModification: new Date('2025-01-21'),
    statut: StatutDossierMemoire.EN_ATTENTE_VALIDATION,
    estComplet: false,
    autoriseSoutenance: false,
    etape: EtapeDossier.VALIDATION_SUJET,
    anneeAcademique: '2024-2025',
    candidats: [mockCandidats[5]], // Moussa Diop
    encadrant: mockProfesseurs.find(p => p.idProfesseur === 1) // Jean Pierre
  },
  {
    idDossierMemoire: 205,
    titre: 'Analyse de Données Massives avec Apache Spark',
    description: 'Étude et implémentation d\'une solution d\'analyse de big data utilisant Apache Spark pour le traitement distribué.',
    dateCreation: new Date('2025-01-17'),
    dateModification: new Date('2025-01-17'),
    statut: StatutDossierMemoire.EN_ATTENTE_VALIDATION,
    estComplet: false,
    autoriseSoutenance: false,
    etape: EtapeDossier.VALIDATION_SUJET,
    anneeAcademique: '2024-2025',
    candidats: [mockCandidats[0]], // Amadou Diallo
    encadrant: mockProfesseurs.find(p => p.idProfesseur === 2) // Ibrahima Ndiaye
  },
  // Dépôt en binôme
  {
    idDossierMemoire: 206,
    titre: 'Système de Gestion de Projets Collaboratifs avec IA',
    description: 'Développement d\'une plateforme collaborative de gestion de projets intégrant l\'intelligence artificielle pour l\'optimisation des ressources et la prédiction des risques.',
    dateCreation: new Date('2025-01-23'),
    dateModification: new Date('2025-01-23'),
    statut: StatutDossierMemoire.EN_ATTENTE_VALIDATION,
    estComplet: false,
    autoriseSoutenance: false,
    etape: EtapeDossier.VALIDATION_SUJET,
    anneeAcademique: '2024-2025',
    candidats: [mockCandidats[1]], // Fatou Ndiaye (candidat principal)
    binome: {
      idBinome: 1,
      dateDemande: new Date('2025-01-15'),
      dateFormation: new Date('2025-01-16'),
      statut: 'ACCEPTE' as any,
      candidats: [mockCandidats[1], mockCandidats[2]] // Fatou Ndiaye + Ibrahima Ba
    },
    encadrant: mockProfesseurs.find(p => p.idProfesseur === 4) // Mamadou Sarr
  },
  {
    idDossierMemoire: 207,
    titre: 'Plateforme de E-commerce avec Paiement Mobile',
    description: 'Conception et développement d\'une plateforme e-commerce sécurisée avec intégration de solutions de paiement mobile adaptées au contexte africain.',
    dateCreation: new Date('2025-01-24'),
    dateModification: new Date('2025-01-24'),
    statut: StatutDossierMemoire.EN_ATTENTE_VALIDATION,
    estComplet: false,
    autoriseSoutenance: false,
    etape: EtapeDossier.VALIDATION_SUJET,
    anneeAcademique: '2024-2025',
    candidats: [mockCandidats[3]], // Aissatou Sarr (candidat principal)
    binome: {
      idBinome: 2,
      dateDemande: new Date('2025-01-18'),
      dateFormation: new Date('2025-01-19'),
      statut: 'ACCEPTE' as any,
      candidats: [mockCandidats[3], mockCandidats[4]] // Aissatou Sarr + Moussa Kane
    },
    encadrant: mockProfesseurs.find(p => p.idProfesseur === 5) // Fatou Diallo
  },
  // ==========================================================================
  // DOSSIERS VALIDES POUR GÉNÉRATION JURYS (SESSION SEPTEMBRE 2025)
  // ==========================================================================
  {
    idDossierMemoire: 301,
    titre: 'Optimisation des réseaux de capteurs sans fil',
    description: 'Étude des protocoles de routage pour minimiser la consommation d\'énergie.',
    dateCreation: new Date('2024-10-01'),
    dateModification: new Date('2025-05-15'),
    statut: StatutDossierMemoire.VALIDE,
    estComplet: true,
    autoriseSoutenance: true,
    etape: EtapeDossier.SOUTENANCE,
    anneeAcademique: '2024-2025',
    candidats: [{ idCandidat: 101, nom: 'Diop', prenom: 'Sidi', email: 'sidi.diop@isi.edu.sn', numeroMatricule: 'ETU20240101' }],
    encadrant: mockProfesseurs[0] // Jean Pierre
  },
  {
    idDossierMemoire: 302,
    titre: 'Sécurité des applications web bancaires',
    description: 'Analyse des vulnérabilités OWASP et mesures de protection.',
    dateCreation: new Date('2024-10-02'),
    dateModification: new Date('2025-05-16'),
    statut: StatutDossierMemoire.VALIDE,
    estComplet: true,
    autoriseSoutenance: true,
    etape: EtapeDossier.SOUTENANCE,
    anneeAcademique: '2024-2025',
    candidats: [{ idCandidat: 102, nom: 'Fall', prenom: 'Aminata', email: 'aminata.fall@isi.edu.sn', numeroMatricule: 'ETU20240102' }],
    encadrant: mockProfesseurs[1] // Ibrahima Ndiaye
  },
  {
    idDossierMemoire: 303,
    titre: 'Application de gestion de stock temps réel',
    description: 'Utilisation de WebSockets pour la mise à jour instantanée des stocks.',
    dateCreation: new Date('2024-10-03'),
    dateModification: new Date('2025-05-17'),
    statut: StatutDossierMemoire.VALIDE,
    estComplet: true,
    autoriseSoutenance: true,
    etape: EtapeDossier.SOUTENANCE,
    anneeAcademique: '2024-2025',
    candidats: [{ idCandidat: 103, nom: 'Sow', prenom: 'Oumar', email: 'oumar.sow@isi.edu.sn', numeroMatricule: 'ETU20240103' }],
    encadrant: mockProfesseurs[2] // Aissatou Ba
  },
  {
    idDossierMemoire: 304,
    titre: 'IA pour la prédiction météorologique locale',
    description: 'Modèles de Deep Learning appliqués aux données climatiques sénégalaises.',
    dateCreation: new Date('2024-10-04'),
    dateModification: new Date('2025-05-18'),
    statut: StatutDossierMemoire.VALIDE,
    estComplet: true,
    autoriseSoutenance: true,
    etape: EtapeDossier.SOUTENANCE,
    anneeAcademique: '2024-2025',
    candidats: [{ idCandidat: 104, nom: 'Gaye', prenom: 'Mariama', email: 'mariama.gaye@isi.edu.sn', numeroMatricule: 'ETU20240104' }],
    encadrant: mockProfesseurs[3] // Mamadou Sarr
  },
  {
    idDossierMemoire: 305,
    titre: 'Blockchain pour le cadastre',
    description: 'Sécurisation des titres fonciers via une blockchain privée.',
    dateCreation: new Date('2024-10-05'),
    dateModification: new Date('2025-05-19'),
    statut: StatutDossierMemoire.VALIDE,
    estComplet: true,
    autoriseSoutenance: true,
    etape: EtapeDossier.SOUTENANCE,
    anneeAcademique: '2024-2025',
    candidats: [{ idCandidat: 105, nom: 'Ndiaye', prenom: 'Cheikh', email: 'cheikh.ndiaye@isi.edu.sn', numeroMatricule: 'ETU20240105' }],
    encadrant: mockProfesseurs[4] // Fatou Diallo
  },
  {
    idDossierMemoire: 306,
    titre: 'Système de vote électronique sécurisé',
    description: 'Architecture distribuée pour garantir l\'intégrité des votes.',
    dateCreation: new Date('2024-10-06'),
    dateModification: new Date('2025-05-20'),
    statut: StatutDossierMemoire.VALIDE,
    estComplet: true,
    autoriseSoutenance: true,
    etape: EtapeDossier.SOUTENANCE,
    anneeAcademique: '2024-2025',
    candidats: [{ idCandidat: 106, nom: 'Diallo', prenom: 'Khadija', email: 'khadija.diallo@isi.edu.sn', numeroMatricule: 'ETU20240106' }],
    encadrant: mockProfesseurs[0] // Jean Pierre
  },
  {
    idDossierMemoire: 307,
    titre: 'Analyse de sentiments sur les réseaux sociaux',
    description: 'NLP pour analyser l\'opinion publique sur des sujets d\'actualité.',
    dateCreation: new Date('2024-10-07'),
    dateModification: new Date('2025-05-21'),
    statut: StatutDossierMemoire.VALIDE,
    estComplet: true,
    autoriseSoutenance: true,
    etape: EtapeDossier.SOUTENANCE,
    anneeAcademique: '2024-2025',
    candidats: [{ idCandidat: 107, nom: 'Ba', prenom: 'Moustapha', email: 'moustapha.ba@isi.edu.sn', numeroMatricule: 'ETU20240107' }],
    encadrant: mockProfesseurs[1] // Ibrahima Ndiaye
  },
  {
    idDossierMemoire: 308,
    titre: 'Plateforme de télémédecine',
    description: 'Mise en relation patients-médecins avec consultation vidéo.',
    dateCreation: new Date('2024-10-08'),
    dateModification: new Date('2025-05-22'),
    statut: StatutDossierMemoire.VALIDE,
    estComplet: true,
    autoriseSoutenance: true,
    etape: EtapeDossier.SOUTENANCE,
    anneeAcademique: '2024-2025',
    candidats: [{ idCandidat: 108, nom: 'Sy', prenom: 'Awa', email: 'awa.sy@isi.edu.sn', numeroMatricule: 'ETU20240108' }],
    encadrant: mockProfesseurs[2] // Aissatou Ba
  },
  {
    idDossierMemoire: 309,
    titre: 'IoT pour l\'agriculture intelligente',
    description: 'Système d\'irrigation automatisé basé sur l\'humidité du sol.',
    dateCreation: new Date('2024-10-09'),
    dateModification: new Date('2025-05-23'),
    statut: StatutDossierMemoire.VALIDE,
    estComplet: true,
    autoriseSoutenance: true,
    etape: EtapeDossier.SOUTENANCE,
    anneeAcademique: '2024-2025',
    candidats: [{ idCandidat: 109, nom: 'Camara', prenom: 'Boubacar', email: 'boubacar.camara@isi.edu.sn', numeroMatricule: 'ETU20240109' }],
    encadrant: mockProfesseurs[3] // Mamadou Sarr
  },
  {
    idDossierMemoire: 310,
    titre: 'Reconnaissance faciale pour le contrôle d\'accès',
    description: 'Implémentation sécurisée avec détection de vivacité.',
    dateCreation: new Date('2024-10-10'),
    dateModification: new Date('2025-05-24'),
    statut: StatutDossierMemoire.VALIDE,
    estComplet: true,
    autoriseSoutenance: true,
    etape: EtapeDossier.SOUTENANCE,
    anneeAcademique: '2024-2025',
    candidats: [{ idCandidat: 110, nom: 'Faye', prenom: 'Astou', email: 'astou.faye@isi.edu.sn', numeroMatricule: 'ETU20240110' }],
    encadrant: mockProfesseurs[4] // Fatou Diallo
  },
  {
    idDossierMemoire: 311,
    titre: 'Chatbot éducatif pour le soutien scolaire',
    description: 'Assistant virtuel pour aider les élèves en mathématiques.',
    dateCreation: new Date('2024-10-11'),
    dateModification: new Date('2025-05-25'),
    statut: StatutDossierMemoire.VALIDE,
    estComplet: true,
    autoriseSoutenance: true,
    etape: EtapeDossier.SOUTENANCE,
    anneeAcademique: '2024-2025',
    candidats: [{ idCandidat: 111, nom: 'Traore', prenom: 'Issa', email: 'issa.traore@isi.edu.sn', numeroMatricule: 'ETU20240111' }],
    encadrant: mockProfesseurs[0] // Jean Pierre
  },
  {
    idDossierMemoire: 312,
    titre: 'Système de gestion de flotte de véhicules',
    description: 'Suivi GPS et maintenance prédictive.',
    dateCreation: new Date('2024-10-12'),
    dateModification: new Date('2025-05-26'),
    statut: StatutDossierMemoire.VALIDE,
    estComplet: true,
    autoriseSoutenance: true,
    etape: EtapeDossier.SOUTENANCE,
    anneeAcademique: '2024-2025',
    candidats: [{ idCandidat: 112, nom: 'Mendy', prenom: 'Marie', email: 'marie.mendy@isi.edu.sn', numeroMatricule: 'ETU20240112' }],
    encadrant: mockProfesseurs[1] // Ibrahima Ndiaye
  },
  {
    idDossierMemoire: 313,
    titre: 'Réalité augmentée pour le tourisme',
    description: 'Guide interactif des sites historiques de Dakar.',
    dateCreation: new Date('2024-10-13'),
    dateModification: new Date('2025-05-27'),
    statut: StatutDossierMemoire.VALIDE,
    estComplet: true,
    autoriseSoutenance: true,
    etape: EtapeDossier.SOUTENANCE,
    anneeAcademique: '2024-2025',
    candidats: [{ idCandidat: 113, nom: 'Gomis', prenom: 'Paul', email: 'paul.gomis@isi.edu.sn', numeroMatricule: 'ETU20240113' }],
    encadrant: mockProfesseurs[2] // Aissatou Ba
  },
  {
    idDossierMemoire: 314,
    titre: 'Big Data pour l\'analyse du trafic routier',
    description: 'Optimisation des feux de signalisation à Dakar.',
    dateCreation: new Date('2024-10-14'),
    dateModification: new Date('2025-05-28'),
    statut: StatutDossierMemoire.VALIDE,
    estComplet: true,
    autoriseSoutenance: true,
    etape: EtapeDossier.SOUTENANCE,
    anneeAcademique: '2024-2025',
    candidats: [{ idCandidat: 114, nom: 'Diagne', prenom: 'Fatima', email: 'fatima.diagne@isi.edu.sn', numeroMatricule: 'ETU20240114' }],
    encadrant: mockProfesseurs[3] // Mamadou Sarr
  },
  {
    idDossierMemoire: 315,
    titre: 'Cybersécurité dans les réseaux industriels',
    description: 'Protection des systèmes SCADA contre les intrusions.',
    dateCreation: new Date('2024-10-15'),
    dateModification: new Date('2025-05-29'),
    statut: StatutDossierMemoire.VALIDE,
    estComplet: true,
    autoriseSoutenance: true,
    etape: EtapeDossier.SOUTENANCE,
    anneeAcademique: '2024-2025',
    candidats: [{ idCandidat: 115, nom: 'Seck', prenom: 'Abdoulaye', email: 'abdoulaye.seck@isi.edu.sn', numeroMatricule: 'ETU20240115' }],
    encadrant: mockProfesseurs[4] // Fatou Diallo
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
  return mockDossiers.find(d => {
    const hasCandidat = d.candidats?.some(c => c.idCandidat === idCandidat);
    const isEnCours = d.statut === StatutDossierMemoire.EN_CREATION || 
                      d.statut === StatutDossierMemoire.EN_COURS ||
                      d.statut === StatutDossierMemoire.EN_ATTENTE_VALIDATION;
    return hasCandidat && isEnCours;
  });
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

/**
 * Met un dépôt de sujet en phase publique
 */
export const mettreDepotEnPhasePublique = (idDossierMemoire: number): void => {
  const dossier = mockDossiers.find(d => d.idDossierMemoire === idDossierMemoire);
  if (dossier) {
    dossier.estPhasePublique = true;
  }
};

/**
 * Retire un dépôt de sujet de la phase publique
 */
export const retirerDepotDePhasePublique = (idDossierMemoire: number): void => {
  const dossier = mockDossiers.find(d => d.idDossierMemoire === idDossierMemoire);
  if (dossier) {
    dossier.estPhasePublique = false;
  }
};

/**
 * Récupère tous les dépôts en phase publique
 */
export const getDepotsEnPhasePublique = (): DossierMemoire[] => {
  return mockDossiers.filter(d => d.estPhasePublique === true);
};
