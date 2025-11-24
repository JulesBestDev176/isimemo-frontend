// ============================================================================
// TYPES & INTERFACES
// ============================================================================

import type { Encadrement } from './Encadrement';
import type { Livrable } from './Livrable';
import type { DossierMemoire } from './DossierMemoire';
import { TypeDocument } from './Document';
import { StatutLivrable } from './Livrable';

export enum Priorite {
  BASSE = 'BASSE',
  MOYENNE = 'MOYENNE',
  HAUTE = 'HAUTE',
  URGENTE = 'URGENTE'
}

export enum StatutTicket {
  A_FAIRE = 'A_FAIRE', // Ticket créé, en attente de prise en charge
  EN_COURS = 'EN_COURS', // Ticket en cours de traitement
  EN_REVISION = 'EN_REVISION', // Livrable rejeté, retourné pour révision
  TERMINE = 'TERMINE' // Ticket terminé et validé
}

// Phases d'un ticket dans le workflow
export enum PhaseTicket {
  A_FAIRE = 'A_FAIRE', // Ticket créé, en attente de prise en charge
  EN_COURS = 'EN_COURS', // Ticket en cours de traitement
  EN_REVISION = 'EN_REVISION', // Livrable rejeté, retourné pour révision
  TERMINE = 'TERMINE' // Ticket terminé et validé
}

export interface SousTache {
  id: number;
  titre: string;
  terminee: boolean;
}

export interface FeedbackRejet {
  dateRetour: Date;
  commentaire: string;
  corrections: string[]; // Liste des corrections à apporter (seront ajoutées comme nouvelles sous-tâches)
}

export interface Ticket {
  idTicket: number;
  titre: string;
  description: string;
  priorite: Priorite;
  dateCreation: Date;
  dateEcheance?: Date;
  statut: StatutTicket;
  phase: PhaseTicket; // Phase actuelle du ticket dans le workflow
  progression: number;
  consigne?: string; // Consigne ou instructions pour le ticket
  sousTaches?: SousTache[]; // Sous-tâches ou étapes du ticket
  estRetourne?: boolean; // Indique si le ticket a été retourné en révision
  feedbackRejet?: FeedbackRejet; // Feedback de rejet si le ticket a été retourné
  // Relations
  encadrement?: Encadrement;
  dossierMemoire?: DossierMemoire; // Association avec un dossier spécifique
  livrables?: Livrable[];
}

// ============================================================================
// MOCKS
// ============================================================================

import { mockDossiers } from './DossierMemoire';

export const mockTickets: Ticket[] = [
  // NOTE: Règles métier :
  // - Un seul ticket EN_COURS à la fois par encadrement
  // - Un seul ticket EN_REVISION à la fois par encadrement
  // - Si un ticket est EN_REVISION, aucun ticket ne peut être EN_COURS
  // 
  // Exemples :
  // - Dossier 101 (Amadou Diallo) : 1 ticket EN_COURS
  // - Dossier 102 (Fatou Ndiaye) : 1 ticket EN_REVISION
  // - Dossier 103 (Ibrahima Ba) : tickets A_FAIRE et TERMINE

  // Dossier 101 - Ticket EN_COURS
  {
    idTicket: 1,
    titre: 'Chapitre I - Introduction Générale',
    description: 'Rédaction et finalisation du Chapitre I : Introduction Générale. Inclure la présentation, le contexte, la problématique, les objectifs et la motivation. Veuillez structurer clairement chaque section et assurer la cohérence avec le reste du mémoire.',
    priorite: Priorite.HAUTE,
    dateCreation: new Date('2025-01-15'),
    dateEcheance: new Date('2025-01-30'),
    statut: StatutTicket.EN_COURS,
    phase: PhaseTicket.EN_COURS,
    progression: 60,
    consigne: 'L\'introduction doit être claire, concise et accrocheuse. Maximum 5 pages. Privilégier les sources académiques récentes.',
    sousTaches: [
      { id: 1, titre: 'Rédiger la section présentation du contexte', terminee: true },
      { id: 2, titre: 'Formuler la problématique de recherche', terminee: true },
      { id: 3, titre: 'Définir les objectifs de recherche', terminee: false },
      { id: 4, titre: 'Présenter la motivation et l\'intérêt du sujet', terminee: false },
      { id: 5, titre: 'Annoncer le plan du mémoire', terminee: false }
    ],
    encadrement: { idEncadrement: 4 } as any,
    dossierMemoire: mockDossiers.find(d => d.idDossierMemoire === 101)
  },
  {
    idTicket: 2,
    titre: 'Chapitre II - Section Modélisation',
    description: 'Finaliser la section modélisation du Chapitre II. Compléter les diagrammes UML (diagramme de contexte, cas d\'utilisation, diagramme de classe) et s\'assurer de leur cohérence avec la méthodologie d\'analyse.',
    priorite: Priorite.HAUTE,
    dateCreation: new Date('2025-01-25'),
    dateEcheance: new Date('2025-02-10'),
    statut: StatutTicket.A_FAIRE,
    phase: PhaseTicket.A_FAIRE,
    progression: 0,
    consigne: 'Tous les diagrammes UML doivent être cohérents entre eux et avec la méthodologie d\'analyse. Utiliser un outil de modélisation standard (StarUML, Draw.io, etc.).',
    sousTaches: [
      { id: 1, titre: 'Créer le diagramme de contexte', terminee: false },
      { id: 2, titre: 'Dessiner les diagrammes de cas d\'utilisation', terminee: false },
      { id: 3, titre: 'Élaborer le diagramme de classe', terminee: false },
      { id: 4, titre: 'Vérifier la cohérence entre les diagrammes', terminee: false }
    ],
    encadrement: { idEncadrement: 4 } as any,
    dossierMemoire: mockDossiers.find(d => d.idDossierMemoire === 101)
  },
  
  // Dossier 102 - Ticket EN_REVISION (donc aucun EN_COURS possible)
  // Une tâche en révision doit avoir toutes les sous-tâches réalisées
  {
    idTicket: 3,
    titre: 'Chapitre I - Section Problématique',
    description: 'Améliorer la section problématique du Chapitre I. La problématique actuelle nécessite plus de précision et de clarté. Veuillez reformuler et approfondir l\'analyse du problème.',
    priorite: Priorite.MOYENNE,
    dateCreation: new Date('2025-01-20'),
    dateEcheance: new Date('2025-02-05'),
    statut: StatutTicket.EN_REVISION,
    phase: PhaseTicket.EN_REVISION,
    progression: 100, // Toutes les sous-tâches sont terminées
    consigne: 'La problématique doit être reformulée avec plus de précision. Veuillez prendre en compte les commentaires de l\'encadrant et améliorer la structure.',
    sousTaches: [
      { id: 1, titre: 'Analyser les commentaires de l\'encadrant', terminee: true },
      { id: 2, titre: 'Reformuler la problématique avec plus de précision', terminee: true },
      { id: 3, titre: 'Approfondir l\'analyse du problème', terminee: true },
      { id: 4, titre: 'Vérifier la cohérence avec les objectifs', terminee: true }
    ],
    livrables: [
      {
        idLivrable: 'liv-3-1',
        nomFichier: 'Chapitre1_Problematique_v2.pdf',
        cheminFichier: '/documents/dossier102/chapitre1_problematique_v2.pdf',
        typeDocument: TypeDocument.CHAPITRE,
        dateSubmission: new Date('2025-01-25'),
        statut: StatutLivrable.EN_ATTENTE_VALIDATION,
        version: 2,
        ticket: undefined as any
      }
    ],
    encadrement: { idEncadrement: 4 } as any,
    dossierMemoire: mockDossiers.find(d => d.idDossierMemoire === 102)
  },
  {
    idTicket: 4,
    titre: 'Chapitre II - Section Outils et Technologies',
    description: 'Rédiger la section outils et technologies du Chapitre II. Décrire l\'architecture choisie, les technologies utilisées (langages, frameworks, SGBD), et justifier les choix techniques effectués.',
    priorite: Priorite.MOYENNE,
    dateCreation: new Date('2025-01-18'),
    dateEcheance: new Date('2025-02-08'),
    statut: StatutTicket.A_FAIRE,
    phase: PhaseTicket.A_FAIRE,
    progression: 0,
    consigne: 'Décrire clairement l\'architecture choisie et justifier chaque choix technique. Comparer avec d\'autres alternatives possibles.',
    sousTaches: [
      { id: 1, titre: 'Décrire l\'architecture générale du système', terminee: false },
      { id: 2, titre: 'Lister les technologies utilisées (langages, frameworks, SGBD)', terminee: false },
      { id: 3, titre: 'Justifier chaque choix technique', terminee: false },
      { id: 4, titre: 'Comparer avec d\'autres alternatives', terminee: false }
    ],
    encadrement: { idEncadrement: 4 } as any,
    dossierMemoire: mockDossiers.find(d => d.idDossierMemoire === 102)
  },
  // Dossier 103 - Tickets A_FAIRE et TERMINE
  {
    idTicket: 5,
    titre: 'Chapitre II - Section Réalisation',
    description: 'Documenter les travaux réalisés dans le Chapitre II. Présenter les interfaces développées, les fonctionnalités implémentées, et inclure des captures d\'écran pertinentes pour illustrer l\'application.',
    priorite: Priorite.HAUTE,
    dateCreation: new Date('2025-01-22'),
    dateEcheance: new Date('2025-02-12'),
    statut: StatutTicket.A_FAIRE,
    phase: PhaseTicket.A_FAIRE,
    progression: 0,
    consigne: 'Documenter de manière claire et structurée les travaux réalisés. Inclure des captures d\'écran de qualité pour illustrer chaque fonctionnalité.',
    sousTaches: [
      { id: 1, titre: 'Présenter les interfaces développées', terminee: false },
      { id: 2, titre: 'Décrire les fonctionnalités implémentées', terminee: false },
      { id: 3, titre: 'Réaliser des captures d\'écran pertinentes', terminee: false },
      { id: 4, titre: 'Structurer la documentation de manière claire', terminee: false }
    ],
    encadrement: { idEncadrement: 4 } as any,
    dossierMemoire: mockDossiers.find(d => d.idDossierMemoire === 103)
  },
  {
    idTicket: 6,
    titre: 'Chapitre II - Diagrammes de cas d\'utilisation',
    description: 'Compléter et valider tous les diagrammes de cas d\'utilisation du Chapitre II. Vérifier que tous les acteurs et leurs interactions sont correctement représentés (Gestion des stocks, commandes, emplacements, produits, catégories, utilisateurs, etc.).',
    priorite: Priorite.MOYENNE,
    dateCreation: new Date('2025-01-10'),
    dateEcheance: new Date('2025-01-25'),
    statut: StatutTicket.TERMINE,
    phase: PhaseTicket.TERMINE,
    progression: 100,
    consigne: 'Tous les diagrammes doivent être cohérents et représenter fidèlement les interactions entre les acteurs et le système.',
    sousTaches: [
      { id: 1, titre: 'Identifier tous les acteurs du système', terminee: true },
      { id: 2, titre: 'Dessiner les diagrammes de cas d\'utilisation', terminee: true },
      { id: 3, titre: 'Vérifier la cohérence des interactions', terminee: true },
      { id: 4, titre: 'Valider avec l\'encadrant', terminee: true }
    ],
    encadrement: { idEncadrement: 4 } as any,
    dossierMemoire: mockDossiers.find(d => d.idDossierMemoire === 103)
  },
  {
    idTicket: 7,
    titre: 'Chapitre II - Diagramme de classe',
    description: 'Finaliser le diagramme de classe du Chapitre II. S\'assurer que toutes les entités, leurs attributs, méthodes et relations sont correctement modélisées selon les besoins fonctionnels identifiés.',
    priorite: Priorite.HAUTE,
    dateCreation: new Date('2025-01-12'),
    dateEcheance: new Date('2025-01-28'),
    statut: StatutTicket.TERMINE,
    phase: PhaseTicket.TERMINE,
    progression: 100,
    consigne: 'Le diagramme de classe doit être complet et refléter fidèlement la structure du système.',
    sousTaches: [
      { id: 1, titre: 'Identifier toutes les entités du système', terminee: true },
      { id: 2, titre: 'Définir les attributs et méthodes de chaque classe', terminee: true },
      { id: 3, titre: 'Modéliser les relations entre les classes', terminee: true },
      { id: 4, titre: 'Valider avec l\'encadrant', terminee: true }
    ],
    encadrement: { idEncadrement: 4 } as any,
    dossierMemoire: mockDossiers.find(d => d.idDossierMemoire === 103)
  },
  {
    idTicket: 8,
    titre: 'Chapitre III - Section Objectifs atteints',
    description: 'Rédiger la section des objectifs atteints du Chapitre III. Lister et détailler tous les modules et fonctionnalités qui ont été développés avec succès, en expliquant leur contribution au projet.',
    priorite: Priorite.MOYENNE,
    dateCreation: new Date('2025-01-28'),
    dateEcheance: new Date('2025-02-15'),
    statut: StatutTicket.A_FAIRE,
    phase: PhaseTicket.A_FAIRE,
    progression: 0,
    consigne: 'Lister de manière exhaustive tous les objectifs atteints et expliquer leur contribution au projet.',
    sousTaches: [
      { id: 1, titre: 'Lister tous les modules développés', terminee: false },
      { id: 2, titre: 'Détailler les fonctionnalités implémentées', terminee: false },
      { id: 3, titre: 'Expliquer la contribution de chaque module au projet', terminee: false }
    ],
    encadrement: { idEncadrement: 4 } as any,
    dossierMemoire: mockDossiers.find(d => d.idDossierMemoire === 101)
  },
  {
    idTicket: 9,
    titre: 'Chapitre III - Section Intérêts personnels',
    description: 'Compléter la section intérêts personnels du Chapitre III. Décrire les compétences acquises, les leçons apprises, et l\'apport personnel de ce projet dans votre parcours académique et professionnel.',
    priorite: Priorite.BASSE,
    dateCreation: new Date('2025-01-30'),
    dateEcheance: new Date('2025-02-18'),
    statut: StatutTicket.A_FAIRE,
    phase: PhaseTicket.A_FAIRE,
    progression: 0,
    consigne: 'Rédiger de manière personnelle et sincère sur votre expérience et les compétences acquises.',
    sousTaches: [
      { id: 1, titre: 'Identifier les compétences techniques acquises', terminee: false },
      { id: 2, titre: 'Décrire les leçons apprises', terminee: false },
      { id: 3, titre: 'Expliquer l\'apport personnel du projet', terminee: false }
    ],
    encadrement: { idEncadrement: 4 } as any,
    dossierMemoire: mockDossiers.find(d => d.idDossierMemoire === 102)
  },
  {
    idTicket: 10,
    titre: 'Chapitre I - Section Présentation et Contexte',
    description: 'Révision de la section présentation et contexte du Chapitre I. Cette section a été validée et peut être considérée comme terminée.',
    priorite: Priorite.BASSE,
    dateCreation: new Date('2025-01-05'),
    dateEcheance: new Date('2025-01-20'),
    statut: StatutTicket.TERMINE,
    phase: PhaseTicket.TERMINE,
    progression: 100,
    consigne: 'Section validée par l\'encadrant.',
    sousTaches: [
      { id: 1, titre: 'Rédiger la présentation du contexte', terminee: true },
      { id: 2, titre: 'Structurer la section de manière claire', terminee: true },
      { id: 3, titre: 'Valider avec l\'encadrant', terminee: true }
    ],
    encadrement: { idEncadrement: 4 } as any,
    dossierMemoire: mockDossiers.find(d => d.idDossierMemoire === 101)
  },
  // Dossier 104 - Toutes les tâches terminées (pour autoriser pré-lecture)
  {
    idTicket: 15,
    titre: 'Chapitre I - Introduction Générale',
    description: 'Rédaction et finalisation du Chapitre I : Introduction Générale. Inclure la présentation, le contexte, la problématique, les objectifs et la motivation.',
    priorite: Priorite.HAUTE,
    dateCreation: new Date('2025-01-05'),
    dateEcheance: new Date('2025-01-20'),
    statut: StatutTicket.TERMINE,
    phase: PhaseTicket.TERMINE,
    progression: 100,
    consigne: 'L\'introduction doit être claire, concise et accrocheuse. Maximum 5 pages.',
    sousTaches: [
      { id: 1, titre: 'Rédiger la section présentation du contexte', terminee: true },
      { id: 2, titre: 'Formuler la problématique de recherche', terminee: true },
      { id: 3, titre: 'Définir les objectifs de recherche', terminee: true },
      { id: 4, titre: 'Présenter la motivation et l\'intérêt du sujet', terminee: true },
      { id: 5, titre: 'Annoncer le plan du mémoire', terminee: true }
    ],
    encadrement: { idEncadrement: 4 } as any,
    dossierMemoire: mockDossiers.find(d => d.idDossierMemoire === 104)
  },
  {
    idTicket: 16,
    titre: 'Chapitre II - Modélisation et Conception',
    description: 'Finaliser le Chapitre II avec tous les diagrammes UML (diagramme de contexte, cas d\'utilisation, diagramme de classe) et s\'assurer de leur cohérence.',
    priorite: Priorite.HAUTE,
    dateCreation: new Date('2025-01-10'),
    dateEcheance: new Date('2025-01-25'),
    statut: StatutTicket.TERMINE,
    phase: PhaseTicket.TERMINE,
    progression: 100,
    consigne: 'Tous les diagrammes UML doivent être cohérents entre eux.',
    sousTaches: [
      { id: 1, titre: 'Créer le diagramme de contexte', terminee: true },
      { id: 2, titre: 'Dessiner les diagrammes de cas d\'utilisation', terminee: true },
      { id: 3, titre: 'Élaborer le diagramme de classe', terminee: true },
      { id: 4, titre: 'Vérifier la cohérence entre les diagrammes', terminee: true }
    ],
    encadrement: { idEncadrement: 4 } as any,
    dossierMemoire: mockDossiers.find(d => d.idDossierMemoire === 104)
  },
  {
    idTicket: 17,
    titre: 'Chapitre III - Réalisation et Implémentation',
    description: 'Documenter les travaux réalisés dans le Chapitre III. Présenter les interfaces développées, les fonctionnalités implémentées, et inclure des captures d\'écran pertinentes.',
    priorite: Priorite.HAUTE,
    dateCreation: new Date('2025-01-15'),
    dateEcheance: new Date('2025-01-30'),
    statut: StatutTicket.TERMINE,
    phase: PhaseTicket.TERMINE,
    progression: 100,
    consigne: 'Documenter de manière claire et structurée les travaux réalisés.',
    sousTaches: [
      { id: 1, titre: 'Présenter les interfaces développées', terminee: true },
      { id: 2, titre: 'Décrire les fonctionnalités implémentées', terminee: true },
      { id: 3, titre: 'Réaliser des captures d\'écran pertinentes', terminee: true },
      { id: 4, titre: 'Structurer la documentation de manière claire', terminee: true }
    ],
    encadrement: { idEncadrement: 4 } as any,
    dossierMemoire: mockDossiers.find(d => d.idDossierMemoire === 104)
  },
  // Dossier 105 - Pré-lecture effectuée (pour autoriser soutenance)
  {
    idTicket: 18,
    titre: 'Chapitre I - Introduction Générale',
    description: 'Rédaction et finalisation du Chapitre I : Introduction Générale. Inclure la présentation, le contexte, la problématique, les objectifs et la motivation.',
    priorite: Priorite.HAUTE,
    dateCreation: new Date('2025-01-01'),
    dateEcheance: new Date('2025-01-15'),
    statut: StatutTicket.TERMINE,
    phase: PhaseTicket.TERMINE,
    progression: 100,
    consigne: 'L\'introduction doit être claire, concise et accrocheuse.',
    sousTaches: [
      { id: 1, titre: 'Rédiger la section présentation du contexte', terminee: true },
      { id: 2, titre: 'Formuler la problématique de recherche', terminee: true },
      { id: 3, titre: 'Définir les objectifs de recherche', terminee: true },
      { id: 4, titre: 'Présenter la motivation et l\'intérêt du sujet', terminee: true },
      { id: 5, titre: 'Annoncer le plan du mémoire', terminee: true }
    ],
    encadrement: { idEncadrement: 4 } as any,
    dossierMemoire: mockDossiers.find(d => d.idDossierMemoire === 105)
  },
  {
    idTicket: 19,
    titre: 'Chapitre II - Modélisation et Conception',
    description: 'Finaliser le Chapitre II avec tous les diagrammes UML et s\'assurer de leur cohérence.',
    priorite: Priorite.HAUTE,
    dateCreation: new Date('2025-01-05'),
    dateEcheance: new Date('2025-01-20'),
    statut: StatutTicket.TERMINE,
    phase: PhaseTicket.TERMINE,
    progression: 100,
    consigne: 'Tous les diagrammes UML doivent être cohérents entre eux.',
    sousTaches: [
      { id: 1, titre: 'Créer le diagramme de contexte', terminee: true },
      { id: 2, titre: 'Dessiner les diagrammes de cas d\'utilisation', terminee: true },
      { id: 3, titre: 'Élaborer le diagramme de classe', terminee: true },
      { id: 4, titre: 'Vérifier la cohérence entre les diagrammes', terminee: true }
    ],
    encadrement: { idEncadrement: 4 } as any,
    dossierMemoire: mockDossiers.find(d => d.idDossierMemoire === 105)
  },
  {
    idTicket: 20,
    titre: 'Chapitre III - Réalisation et Implémentation',
    description: 'Documenter les travaux réalisés dans le Chapitre III. Présenter les interfaces développées et les fonctionnalités implémentées.',
    priorite: Priorite.HAUTE,
    dateCreation: new Date('2025-01-10'),
    dateEcheance: new Date('2025-01-25'),
    statut: StatutTicket.TERMINE,
    phase: PhaseTicket.TERMINE,
    progression: 100,
    consigne: 'Documenter de manière claire et structurée les travaux réalisés.',
    sousTaches: [
      { id: 1, titre: 'Présenter les interfaces développées', terminee: true },
      { id: 2, titre: 'Décrire les fonctionnalités implémentées', terminee: true },
      { id: 3, titre: 'Réaliser des captures d\'écran pertinentes', terminee: true },
      { id: 4, titre: 'Structurer la documentation de manière claire', terminee: true }
    ],
    encadrement: { idEncadrement: 4 } as any,
    dossierMemoire: mockDossiers.find(d => d.idDossierMemoire === 105)
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getTicketById = (id: number): Ticket | undefined => {
  return mockTickets.find(t => t.idTicket === id);
};

/**
 * Vérifie s'il existe déjà un ticket EN_COURS pour un encadrement donné
 * Règle métier : On ne peut avoir qu'un seul ticket EN_COURS à la fois
 */
export const hasTicketEnCours = (idEncadrement: number): boolean => {
  return mockTickets.some(
    t => t.encadrement?.idEncadrement === idEncadrement && 
         t.phase === PhaseTicket.EN_COURS
  );
};

/**
 * Récupère le ticket EN_COURS pour un encadrement donné
 */
export const getTicketEnCours = (idEncadrement: number): Ticket | undefined => {
  return mockTickets.find(
    t => t.encadrement?.idEncadrement === idEncadrement && 
         t.phase === PhaseTicket.EN_COURS
  );
};

/**
 * Vérifie s'il existe déjà un ticket EN_REVISION pour un encadrement donné
 * Règle métier : On ne peut avoir qu'un seul ticket EN_REVISION à la fois
 */
export const hasTicketEnRevision = (idEncadrement: number): boolean => {
  return mockTickets.some(
    t => t.encadrement?.idEncadrement === idEncadrement && 
         t.phase === PhaseTicket.EN_REVISION
  );
};

/**
 * Récupère le ticket EN_REVISION pour un encadrement donné
 */
export const getTicketEnRevision = (idEncadrement: number): Ticket | undefined => {
  return mockTickets.find(
    t => t.encadrement?.idEncadrement === idEncadrement && 
         t.phase === PhaseTicket.EN_REVISION
  );
};

/**
 * Vérifie si on peut démarrer un nouveau ticket EN_COURS
 * Règle métier : 
 * - On ne peut démarrer un nouveau ticket EN_COURS que si aucun ticket n'est EN_COURS
 * - Si un ticket est EN_REVISION, aucun ticket ne peut être EN_COURS
 */
export const canDemarrerTicketEnCours = (idEncadrement: number): boolean => {
  // Si un ticket est EN_REVISION, on ne peut pas démarrer un ticket EN_COURS
  if (hasTicketEnRevision(idEncadrement)) {
    return false;
  }
  // On ne peut démarrer un nouveau ticket EN_COURS que si aucun ticket n'est EN_COURS
  return !hasTicketEnCours(idEncadrement);
};

/**
 * Vérifie si on peut démarrer un nouveau ticket EN_REVISION
 * Règle métier : On ne peut avoir qu'un seul ticket EN_REVISION à la fois
 */
export const canDemarrerTicketEnRevision = (idEncadrement: number): boolean => {
  return !hasTicketEnRevision(idEncadrement);
};

/**
 * Récupère tous les tickets pour un encadrement, triés par phase
 */
export const getTicketsByEncadrement = (idEncadrement: number): Ticket[] => {
  return mockTickets
    .filter(t => t.encadrement?.idEncadrement === idEncadrement)
    .sort((a, b) => {
      // Ordre de priorité des phases
      const phaseOrder = {
        [PhaseTicket.EN_COURS]: 1,
        [PhaseTicket.EN_REVISION]: 2,
        [PhaseTicket.A_FAIRE]: 3,
        [PhaseTicket.TERMINE]: 4
      };
      return (phaseOrder[a.phase] || 99) - (phaseOrder[b.phase] || 99);
    });
};

/**
 * Récupère tous les tickets pour un dossier spécifique
 */
export const getTicketsByDossier = (idDossierMemoire: number): Ticket[] => {
  return mockTickets
    .filter(t => t.dossierMemoire?.idDossierMemoire === idDossierMemoire)
    .sort((a, b) => {
      // Ordre de priorité des phases
      const phaseOrder = {
        [PhaseTicket.EN_COURS]: 1,
        [PhaseTicket.EN_REVISION]: 2,
        [PhaseTicket.A_FAIRE]: 3,
        [PhaseTicket.TERMINE]: 4
      };
      return (phaseOrder[a.phase] || 99) - (phaseOrder[b.phase] || 99);
    });
};

/**
 * Crée un nouveau ticket spécifique pour un étudiant (dossier)
 */
export const createTicketForDossier = (
  encadrement: Encadrement,
  dossierMemoire: DossierMemoire,
  titre: string,
  description: string,
  priorite: Priorite = Priorite.MOYENNE,
  consigne?: string,
  sousTaches?: SousTache[]
): Ticket => {
  const maxId = mockTickets.length > 0 ? Math.max(...mockTickets.map(t => t.idTicket)) : 0;
  const newTicket: Ticket = {
    idTicket: maxId + 1,
    titre,
    description,
    priorite,
    dateCreation: new Date(),
    statut: StatutTicket.A_FAIRE,
    phase: PhaseTicket.A_FAIRE,
    progression: sousTaches && sousTaches.length > 0 
      ? Math.round((sousTaches.filter(st => st.terminee).length / sousTaches.length) * 100)
      : 0,
    consigne,
    sousTaches: sousTaches || [],
    encadrement,
    dossierMemoire
  };
  mockTickets.push(newTicket);
  return newTicket;
};
