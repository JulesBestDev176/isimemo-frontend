/**
 * ============================================================================
 * MODÉLISATION NoSQL AVEC DÉNORMALISATION - MODÈLES COMPLETS
 * ============================================================================
 * 
 * Ce fichier contient TOUS les modèles TypeScript complets (sans imports)
 * et définit les collections NoSQL dénormalisées pour optimiser les lectures.
 * 
 * Principes de dénormalisation :
 * - Regrouper les données fréquemment consultées ensemble
 * - Dupliquer les données pour éviter les jointures multiples
 * - Optimiser pour les lectures (les écritures peuvent être plus complexes)
 * - Collections orientées par cas d'usage
 */

// ============================================================================
// ENUMS ET TYPES DE BASE
// ============================================================================

// UserType
export type UserType = 'etudiant' | 'professeur' | 'assistant';

// StatutDossierMemoire
export enum StatutDossierMemoire {
  EN_CREATION = 'EN_CREATION',
  EN_COURS = 'EN_COURS',
  EN_ATTENTE_VALIDATION = 'EN_ATTENTE_VALIDATION',
  VALIDE = 'VALIDE',
  DEPOSE = 'DEPOSE',
  SOUTENU = 'SOUTENU'
}

// EtapeDossier
export enum EtapeDossier {
  CHOIX_SUJET = 'CHOIX_SUJET',
  VALIDATION_SUJET = 'VALIDATION_SUJET',
  EN_COURS_REDACTION = 'EN_COURS_REDACTION',
  DEPOT_INTERMEDIAIRE = 'DEPOT_INTERMEDIAIRE',
  DEPOT_FINAL = 'DEPOT_FINAL',
  SOUTENANCE = 'SOUTENANCE',
  TERMINE = 'TERMINE'
}

// TypeDocument
export enum TypeDocument {
  CHAPITRE = 'CHAPITRE',
  ANNEXE = 'ANNEXE',
  FICHE_SUIVI = 'FICHE_SUIVI',
  DOCUMENT_ADMINISTRATIF = 'DOCUMENT_ADMINISTRATIF',
  PRESENTATION = 'PRESENTATION',
  AUTRE = 'AUTRE'
}

// StatutDocument
export enum StatutDocument {
  BROUILLON = 'BROUILLON',
  DEPOSE = 'DEPOSE',
  EN_ATTENTE_VALIDATION = 'EN_ATTENTE_VALIDATION',
  VALIDE = 'VALIDE',
  REJETE = 'REJETE',
  ARCHIVE = 'ARCHIVE'
}

// Priorite
export enum Priorite {
  BASSE = 'BASSE',
  MOYENNE = 'MOYENNE',
  HAUTE = 'HAUTE',
  URGENTE = 'URGENTE'
}

// StatutTicket
export enum StatutTicket {
  A_FAIRE = 'A_FAIRE',
  EN_COURS = 'EN_COURS',
  EN_REVISION = 'EN_REVISION',
  TERMINE = 'TERMINE'
}

// PhaseTicket
export enum PhaseTicket {
  A_FAIRE = 'A_FAIRE',
  EN_COURS = 'EN_COURS',
  EN_REVISION = 'EN_REVISION',
  TERMINE = 'TERMINE'
}

// TypeMessage
export enum TypeMessage {
  TEXTE = 'TEXTE',
  FICHIER = 'FICHIER',
  SYSTEME = 'SYSTEME'
}

// StatutEncadrement
export enum StatutEncadrement {
  ACTIF = 'ACTIF',
  TERMINE = 'TERMINE',
  ANNULE = 'ANNULE'
}

// StatutDemandeBinome
export enum StatutDemandeBinome {
  EN_ATTENTE = 'EN_ATTENTE',
  ACCEPTE = 'ACCEPTE',
  REFUSE = 'REFUSE',
  DISSOUS = 'DISSOUS'
}

// StatutLivrable
export enum StatutLivrable {
  DEPOSE = 'DEPOSE',
  EN_ATTENTE_VALIDATION = 'EN_ATTENTE_VALIDATION',
  VALIDE = 'VALIDE',
  REJETE = 'REJETE'
}

// Mention
export enum Mention {
  EXCELLENT = 'EXCELLENT',
  TRES_BIEN = 'TRES_BIEN',
  BIEN = 'BIEN',
  ASSEZ_BIEN = 'ASSEZ_BIEN',
  PASSABLE = 'PASSABLE'
}

// RoleJury
export enum RoleJury {
  PRESIDENT = 'PRESIDENT',
  RAPPORTEUR = 'RAPPORTEUR',
  EXAMINATEUR = 'EXAMINATEUR',
  ENCADRANT = 'ENCADRANT'
}

// ModeSoutenance
export enum ModeSoutenance {
  PRESENTIEL = 'PRESENTIEL',
  DISTANCIEL = 'DISTANCIEL',
  HYBRIDE = 'HYBRIDE'
}

// StatutSoutenance
export enum StatutSoutenance {
  PLANIFIEE = 'PLANIFIEE',
  EN_COURS = 'EN_COURS',
  TERMINEE = 'TERMINEE',
  ANNULEE = 'ANNULEE'
}

// StatutJury
export enum StatutJury {
  PROPOSE = 'PROPOSE',
  VALIDE = 'VALIDE',
  PLANIFIE = 'PLANIFIE',
  EN_COURS = 'EN_COURS',
  TERMINE = 'TERMINE'
}

// StatutSession
export enum StatutSession {
  PLANIFIEE = 'PLANIFIEE',
  OUVERTE = 'OUVERTE',
  FERMEE = 'FERMEE'
}

// TypeSessionSoutenance
export enum TypeSessionSoutenance {
  JUIN = 'JUIN',
  SEPTEMBRE = 'SEPTEMBRE',
  DECEMBRE = 'DECEMBRE',
  SPECIALE = 'SPECIALE'
}

// TypePeriodeValidation
export enum TypePeriodeValidation {
  VALIDATION_SUJETS = 'VALIDATION_SUJETS',
  VALIDATION_CORRECTIONS = 'VALIDATION_CORRECTIONS',
  AUCUNE = 'AUCUNE'
}

// TypeRole
export enum TypeRole {
  COMMISSION = 'COMMISSION',
  JURIE = 'JURIE',
  PRESIDENT_JURY_POSSIBLE = 'PRESIDENT_JURY_POSSIBLE'
}

// StatutDemandeEncadrement
export enum StatutDemandeEncadrement {
  EN_ATTENTE = 'EN_ATTENTE',
  ACCEPTEE = 'ACCEPTEE',
  REFUSEE = 'REFUSEE',
  ANNULEE = 'ANNULEE'
}

// StatutDemandePrelecture
export enum StatutDemandePrelecture {
  EN_ATTENTE = 'EN_ATTENTE',
  EN_COURS = 'EN_COURS',
  VALIDE = 'VALIDE',
  REJETE = 'REJETE'
}

// TypeCategorieRessource
export type TypeCategorieRessource = 'memoires' | 'canevas';

// NotificationStatus
export type NotificationStatus = 'unread' | 'read';

// NotificationPriority
export type NotificationPriority = 'normal' | 'urgent';

// NotificationCategory
export type NotificationCategory = 'général' | 'mémoire' | 'soutenance' | 'ressource' | 'agenda';

// ============================================================================
// INTERFACES DE BASE (COMPLÈTES)
// ============================================================================

// Candidat
export interface Candidat {
  idCandidat: number;
  nom: string;
  prenom: string;
  email: string;
  numeroMatricule: string;
  niveau?: string;
  filiere?: string;
}

// Professeur
export interface Professeur {
  idProfesseur: number;
  nom: string;
  prenom: string;
  email: string;
  grade?: string;
  specialite?: string;
  estDisponible: boolean;
  departement?: string;
  estEncadrant?: boolean;
  estJurie?: boolean;
  estCommission?: boolean;
  estChef?: boolean;
  capaciteEncadrement?: number;
  nombreEncadrementsActuels?: number;
}

// Document
export interface Document {
  idDocument: number;
  titre: string;
  typeDocument: TypeDocument;
  cheminFichier: string;
  dateCreation: Date;
  dateModification?: Date;
  statut: StatutDocument;
  commentaire?: string;
  estPhasePublique?: boolean;
}

// SousTache
export interface SousTache {
  id: number;
  titre: string;
  terminee: boolean;
}

// FeedbackRejet
export interface FeedbackRejet {
  dateRetour: Date;
  commentaire: string;
  corrections: string[];
}

// Ticket
export interface Ticket {
  idTicket: number;
  titre: string;
  description: string;
  priorite: Priorite;
  dateCreation: Date;
  dateEcheance?: Date;
  statut: StatutTicket;
  phase: PhaseTicket;
  progression: number;
  consigne?: string;
  sousTaches?: SousTache[];
  estRetourne?: boolean;
  feedbackRejet?: FeedbackRejet;
}

// Livrable
export interface Livrable {
  idLivrable: string;
  nomFichier: string;
  cheminFichier: string;
  typeDocument: TypeDocument;
  dateSubmission: Date;
  statut: StatutLivrable;
  version: number;
  feedback?: string;
}

// Message
export interface Message {
  idMessage: string;
  contenu: string;
  dateEnvoi: Date;
  typeMessage: TypeMessage;
  emetteur?: string;
}

// Binome
export interface Binome {
  idBinome: number;
  dateDemande: Date;
  dateFormation?: Date;
  dateDissolution?: Date;
  message?: string;
  reponse?: string;
  dateReponse?: Date;
  statut: StatutDemandeBinome;
}

// Encadrement
export interface Encadrement {
  idEncadrement: number;
  dateDebut: Date;
  dateFin?: Date;
  statut: StatutEncadrement;
  anneeAcademique: string;
}

// DossierMemoire
export interface DossierMemoire {
  idDossierMemoire: number;
  titre: string;
  description: string;
  dateCreation: Date;
  dateModification: Date;
  statut: StatutDossierMemoire;
  estComplet: boolean;
  autoriseSoutenance: boolean;
  autorisePrelecture?: boolean;
  prelectureEffectuee?: boolean;
  etape: EtapeDossier;
  anneeAcademique?: string;
  estPhasePublique?: boolean;
}

// NoteSuivi
export interface NoteSuivi {
  idNoteSuivi: number;
  contenu: string;
  dateCreation: Date;
  dateModification?: Date;
  idEncadrant: number;
}

// DemandeEncadrement
export interface DemandeEncadrement {
  idDemande: number;
  dateDemande: Date;
  dateReponse?: Date;
  statut: StatutDemandeEncadrement;
  motifRefus?: string;
  anneeAcademique: string;
}

// DemandePrelecture
export interface DemandePrelecture {
  idDemandePrelecture: number;
  dateDemande: Date;
  dateAssignation?: Date;
  dateTraitement?: Date;
  statut: StatutDemandePrelecture;
  commentaire?: string;
  feedbackRejet?: {
    commentaire: string;
    corrections: string[];
    dateRejet: Date;
  };
  documentMemoire?: {
    cheminFichier: string;
    nomFichier: string;
    taille: string;
    dateDepot: Date;
  };
}

// MembreJury
export interface MembreJury {
  idMembre: number;
  roleJury: RoleJury;
  dateDesignation: Date;
}

// ApprobationPV
export interface ApprobationPV {
  idMembre: number;
  idProfesseur: number;
  dateApprobation: Date;
  roleJury: RoleJury;
}

// ProcessVerbal
export interface ProcessVerbal {
  idPV: number;
  dateSoutenance: Date;
  noteFinale: number;
  mention: Mention;
  observations: string;
  appreciations: string;
  demandesModifications?: string;
  dateCreation: Date;
  dateSignature?: Date;
  estSigne: boolean;
  nombreSignatures: number;
  approbations?: ApprobationPV[];
}

// Salle
export interface Salle {
  idSalle: number;
  nom: string;
  batiment: string;
  etage: number;
  capacite: number;
  estDisponible: boolean;
  estArchive: boolean;
}

// Soutenance
export interface Soutenance {
  idSoutenance: number;
  dateConstitution: Date;
  dateSoutenance: Date;
  heureDebut: string;
  heureFin: string;
  duree: number;
  mode: ModeSoutenance;
  statut: StatutSoutenance;
  anneeAcademique: string;
}

// Jury
export interface Jury {
  idJury: number;
  nom: string;
  anneeAcademique: string;
  session: string;
  dateConstitution: Date;
  statut: StatutJury;
  dateSoutenance?: Date;
  heureDebut?: string;
  heureFin?: string;
}

// SessionSoutenance
export interface SessionSoutenance {
  idSession: number;
  nom: string;
  typeSession?: TypeSessionSoutenance;
  anneeAcademique: string;
  dateDebut: Date;
  dateFin: Date;
  statut: StatutSession;
  dateCreation: Date;
  dateOuverture?: Date;
  dateFermeture?: Date;
  creePar: number;
}

// PeriodeValidation
export interface PeriodeValidation {
  idPeriode: number;
  type: TypePeriodeValidation;
  dateDebut: Date;
  dateFin?: Date;
  estActive: boolean;
  anneeAcademique: string;
  sessionSoutenanceId?: number;
}

// PeriodeDepotSujet
export interface PeriodeDepotSujet {
  idPeriode: number;
  anneeAcademique: string;
  dateDebut: Date;
  dateFin: Date;
  estActive: boolean;
  dateCreation: Date;
  creePar: number;
}

// PeriodePrelecture
export interface PeriodePrelecture {
  idPeriode: number;
  anneeAcademique: string;
  dateDebut: Date;
  dateFin: Date;
  estActive: boolean;
  delaiMaxPrelecture?: number;
  sessionSoutenanceId?: number;
  dateCreation: Date;
  creePar: number;
}

// PeriodeDepotFinal
export interface PeriodeDepotFinal {
  idPeriode: number;
  anneeAcademique: string;
  dateDebut: Date;
  dateFin: Date;
  estActive: boolean;
  sessionSoutenanceId: number;
  dateCreation: Date;
  creePar: number;
}

// PeriodeDisponibilite
export interface PeriodeDisponibilite {
  idPeriode: number;
  anneeAcademique: string;
  dateDebut: Date;
  dateFin: Date;
  estActive: boolean;
  sessionSoutenanceId: number;
  dateCreation: Date;
  creePar: number;
}

// PeriodeDemandeEncadrement
export interface PeriodeDemandeEncadrement {
  idPeriode: number;
  anneeAcademique: string;
  dateDebut: Date;
  dateFin: Date;
  estActive: boolean;
  dateCreation: Date;
  creePar: number;
}

// PeriodeCorrection
export interface PeriodeCorrection {
  idPeriode: number;
  anneeAcademique: string;
  dateDebut: Date;
  dateFin: Date;
  estActive: boolean;
  delaiMaxCorrection?: number;
  dateCreation: Date;
  creePar: number;
}

// AnneeAcademique
export interface AnneeAcademique {
  idAnnee: number;
  code: string;
  libelle: string;
  dateDebut: Date;
  dateFin: Date;
  estActive: boolean;
}

// AttributionRole
export interface AttributionRole {
  idAttribution: number;
  typeRole: TypeRole;
  anneeAcademique: string;
  dateAttribution: Date;
  dateRetrait?: Date;
  attribuePar: number;
  estActif: boolean;
}

// AvisPublic
export interface AvisPublic {
  idAvis: number;
  typeElement: 'depot_sujet' | 'document_corrige';
  idElement: number;
  contenu: string;
  dateCreation: Date;
  dateModification?: Date;
}

// RessourceMediatheque
export interface RessourceMediatheque {
  idRessource: number;
  titre: string;
  description: string;
  auteur: string;
  datePublication: Date;
  dateCreation: Date;
  dateModification: Date;
  categorie: TypeCategorieRessource;
  typeRessource: 'document' | 'lien';
  cheminFichier?: string;
  url?: string;
  tags: string[];
  likes: number;
  commentaires: number;
  vues: number;
  niveau?: 'licence' | 'master' | 'autres' | 'all';
  estImportant?: boolean;
  estActif?: boolean;
}

// Notification
export interface Notification {
  id: number;
  title: string;
  message: string;
  date: string;
  status: NotificationStatus;
  priority: NotificationPriority;
  category: NotificationCategory;
  source: string;
}

// Sujet
export interface Sujet {
  id: number;
  titre: string;
  description: string;
  type: 'memoire';
  niveau: string;
  departement: string;
  filieres: string[];
  nombreMaxEtudiants: number;
  nombreEtudiantsActuels: number;
  statut: 'brouillon' | 'soumis' | 'rejete';
  dateSoumission?: string;
  dateApprobation?: string;
  anneeAcademique: string;
  motsCles: string[];
  prerequis: string;
  objectifs: string;
  dateCreation: string;
  dateModification: string;
  professeurId: number;
  professeurNom: string;
}

// DisponibiliteProfesseur
export interface DisponibiliteProfesseur {
  idDisponibilite: number;
  idProfesseur: number;
  idSession: number;
  dateDisponible: Date;
  heureDebut: string;
  heureFin: string;
  typeDisponibilite: string;
}

// ============================================================================
// COLLECTIONS NoSQL DÉNORMALISÉES
// ============================================================================

/**
 * Collection: dossiers
 * 
 * Cas d'usage:
 * - Consultation complète d'un dossier par candidat/encadrant
 * - Affichage du détail d'un dossier avec tous ses éléments
 * - Consultation des documents, tickets, messages d'un dossier
 * 
 * Dénormalisation:
 * - Candidats embarqués (pas de référence)
 * - Encadrant embarqué (duplication des données professeur)
 * - Documents embarqués
 * - Tickets embarqués avec livrables
 * - Messages embarqués
 * - Notes de suivi embarquées
 * - Binôme embarqué
 * - Process-verbal embarqué si disponible
 */
export interface DossierNoSQL {
  // Identifiant
  _id: string; // Format: "dossier_{idDossierMemoire}"
  idDossierMemoire: number;
  
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
  
  // Données principales du dossier
  titre: string;
  description: string;
  dateCreation: Date;
  dateModification: Date;
  statut: StatutDossierMemoire;
  estComplet: boolean;
  autoriseSoutenance: boolean;
  autorisePrelecture?: boolean;
  prelectureEffectuee?: boolean;
  etape: EtapeDossier;
  anneeAcademique?: string;
  estPhasePublique?: boolean;
  
  // Candidats embarqués (dénormalisés)
  candidats: Array<{
    idCandidat: number;
    nom: string;
    prenom: string;
    email: string;
    numeroMatricule: string;
    niveau?: string;
    filiere?: string;
  }>;
  
  // Encadrant embarqué (dénormalisé)
  encadrant?: {
    idProfesseur: number;
    nom: string;
    prenom: string;
    email: string;
    grade?: string;
    specialite?: string;
    departement?: string;
  };
  
  // Encadrement embarqué
  encadrement?: {
    idEncadrement: number;
    dateDebut: Date;
    dateFin?: Date;
    statut: StatutEncadrement;
    anneeAcademique: string;
  };
  
  // Documents embarqués (dénormalisés)
  documents: Array<{
    idDocument: number;
    titre: string;
    typeDocument: TypeDocument;
    cheminFichier: string;
    dateCreation: Date;
    dateModification?: Date;
    statut: StatutDocument;
    commentaire?: string;
    estPhasePublique?: boolean;
  }>;
  
  // Tickets embarqués avec livrables (dénormalisés)
  tickets: Array<{
    idTicket: number;
    titre: string;
    description: string;
    priorite: Priorite;
    dateCreation: Date;
    dateEcheance?: Date;
    statut: StatutTicket;
    phase: PhaseTicket;
    progression: number;
    consigne?: string;
    sousTaches?: Array<{
      id: number;
      titre: string;
      terminee: boolean;
    }>;
    estRetourne?: boolean;
    feedbackRejet?: {
      dateRetour: Date;
      commentaire: string;
      corrections: string[];
    };
    livrables?: Array<{
      idLivrable: string;
      nomFichier: string;
      cheminFichier: string;
      typeDocument: TypeDocument;
      dateSubmission: Date;
      statut: StatutLivrable;
      version: number;
      feedback?: string;
    }>;
  }>;
  
  // Messages embarqués (dénormalisés)
  messages: Array<{
    idMessage: string;
    contenu: string;
    dateEnvoi: Date;
    typeMessage: TypeMessage;
    emetteur?: string;
  }>;
  
  // Notes de suivi embarquées (dénormalisées)
  notesSuivi: Array<{
    idNoteSuivi: number;
    contenu: string;
    dateCreation: Date;
    dateModification?: Date;
    idEncadrant: number;
  }>;
  
  // Binôme embarqué (dénormalisé)
  binome?: {
    idBinome: number;
    dateDemande: Date;
    dateFormation?: Date;
    dateDissolution?: Date;
    message?: string;
    reponse?: string;
    statut: StatutDemandeBinome;
    membres: Array<{
      idCandidat: number;
      nom: string;
      prenom: string;
      email: string;
    }>;
  };
  
  // Process-verbal embarqué si disponible (dénormalisé)
  processVerbal?: {
    idPV: number;
    dateSoutenance: Date;
    noteFinale: number;
    mention: Mention;
    observations: string;
    appreciations: string;
    demandesModifications?: string;
    dateCreation: Date;
    dateSignature?: Date;
    estSigne: boolean;
    nombreSignatures: number;
    approbations?: Array<{
      idMembre: number;
      idProfesseur: number;
      dateApprobation: Date;
      roleJury: RoleJury;
    }>;
  };
  
  // Soutenance associée (référence)
  idSoutenance?: number;
  
  // Demandes de pré-lecture (références)
  demandesPrelecture?: number[];
  
  // Index pour recherches fréquentes
  searchableText: string; // Titre + description + noms candidats pour recherche full-text
  statutIndex: string; // Index pour filtrage par statut
  anneeAcademiqueIndex: string; // Index pour filtrage par année
  encadrantIdIndex?: number; // Index pour recherche par encadrant
  candidatIdsIndex: number[]; // Index pour recherche par candidat
}

/**
 * Collection: professeurs
 * 
 * Cas d'usage:
 * - Consultation complète d'un professeur avec toutes ses activités
 * - Affichage de l'espace professeur
 * - Statistiques et historique
 * 
 * Dénormalisation:
 * - Encadrements embarqués avec dossiers
 * - Jurys embarqués
 * - Sujets proposés embarqués
 * - Disponibilités embarquées
 * - Rôles embarqués
 * - Demandes d'encadrement embarquées
 */
export interface ProfesseurNoSQL {
  // Identifiant
  _id: string; // Format: "professeur_{idProfesseur}"
  idProfesseur: number;
  
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
  
  // Données principales du professeur
  nom: string;
  prenom: string;
  email: string;
  grade?: string;
  specialite?: string;
  estDisponible: boolean;
  departement?: string;
  
  // Rôles et capacités
  estEncadrant?: boolean;
  estJurie?: boolean;
  estCommission?: boolean;
  estChef?: boolean;
  capaciteEncadrement?: number;
  nombreEncadrementsActuels?: number;
  
  // Rôles attribués embarqués (dénormalisés)
  roles: Array<{
    idAttribution: number;
    typeRole: TypeRole;
    anneeAcademique: string;
    dateAttribution: Date;
    dateRetrait?: Date;
    estActif: boolean;
  }>;
  
  // Encadrements embarqués avec dossiers (dénormalisés)
  encadrements: Array<{
    idEncadrement: number;
    dateDebut: Date;
    dateFin?: Date;
    statut: StatutEncadrement;
    anneeAcademique: string;
    dossier: {
      idDossierMemoire: number;
      titre: string;
      statut: StatutDossierMemoire;
      etape: EtapeDossier;
      candidats: Array<{
        idCandidat: number;
        nom: string;
        prenom: string;
        email: string;
      }>;
      progression?: number; // Calculée à partir des tickets
    };
    nombreMessages: number;
    nombreTickets: number;
    nombreTicketsEnCours: number;
    nombreTicketsEnRevision: number;
  }>;
  
  // Demandes d'encadrement embarquées (dénormalisées)
  demandesEncadrement: Array<{
    idDemande: number;
    dateDemande: Date;
    dateReponse?: Date;
    statut: StatutDemandeEncadrement;
    motifRefus?: string;
    anneeAcademique: string;
    candidat: {
      idCandidat: number;
      nom: string;
      prenom: string;
      email: string;
      numeroMatricule: string;
    };
    dossierMemoire: {
      idDossierMemoire: number;
      titre: string;
    };
  }>;
  
  // Demandes de pré-lecture embarquées (dénormalisées)
  demandesPrelecture: Array<{
    idDemandePrelecture: number;
    dateDemande: Date;
    dateAssignation?: Date;
    dateTraitement?: Date;
    statut: StatutDemandePrelecture;
    commentaire?: string;
    dossierMemoire: {
      idDossierMemoire: number;
      titre: string;
    };
    candidat: {
      idCandidat: number;
      nom: string;
      prenom: string;
    };
    encadrantPrincipal?: {
      idProfesseur: number;
      nom: string;
      prenom: string;
    };
  }>;
  
  // Jurys embarqués (dénormalisés)
  jurys: Array<{
    idJury: number;
    nom: string;
    anneeAcademique: string;
    session: string;
    roleJury: RoleJury;
    dateSoutenance?: Date;
    statut: StatutJury;
    dossiers: Array<{
      idDossierMemoire: number;
      titre: string;
      candidats: Array<{
        idCandidat: number;
        nom: string;
        prenom: string;
      }>;
    }>;
    idSoutenance?: number;
  }>;
  
  // Sujets proposés embarqués (dénormalisés)
  sujetsProposes: Array<{
    idSujet: number;
    titre: string;
    description: string;
    niveau: string;
    estDisponible: boolean;
    estDesactive?: boolean;
    dateCreation: Date;
    dateModification?: Date;
    nombreMaxEtudiants?: number;
    nombreEtudiantsActuels?: number;
    filieres?: string[];
  }>;
  
  // Disponibilités embarquées (dénormalisées)
  disponibilites: Array<{
    idDisponibilite: number;
    idSession: number;
    sessionNom: string;
    dateDisponible: Date;
    heureDebut: string;
    heureFin: string;
    typeDisponibilite: string;
  }>;
  
  // Statistiques calculées (dénormalisées)
  statistiques: {
    totalEncadrements: number;
    encadrementsActifs: number;
    encadrementsTermines: number;
    totalEtudiants: number;
    dossiersSoutenus: number;
    dossiersValides: number;
    tauxReussite: number;
    totalJurys: number;
    totalSujetsProposes: number;
  };
  
  // Index pour recherches fréquentes
  searchableText: string; // Nom + prénom + email + spécialité
  departementIndex?: string; // Index pour filtrage par département
  rolesIndex: TypeRole[]; // Index pour filtrage par rôle
  anneeAcademiqueIndex: string[]; // Index pour filtrage par année
}

/**
 * Collection: soutenances
 * 
 * Cas d'usage:
 * - Consultation d'une soutenance avec tous ses détails
 * - Affichage pour les membres du jury
 * - Gestion des procès-verbaux
 * 
 * Dénormalisation:
 * - Jury embarqué avec membres
 * - Dossiers embarqués avec candidats
 * - Process-verbal embarqué
 * - Salle embarquée
 */
export interface SoutenanceNoSQL {
  // Identifiant
  _id: string; // Format: "soutenance_{idSoutenance}"
  idSoutenance: number;
  
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
  
  // Données principales de la soutenance
  dateConstitution: Date;
  dateSoutenance: Date;
  heureDebut: string;
  heureFin: string;
  duree: number; // Durée totale en minutes
  mode: ModeSoutenance;
  statut: StatutSoutenance;
  anneeAcademique: string;
  
  // Salle embarquée (dénormalisée)
  salle?: {
    idSalle: number;
    nom: string;
    batiment: string;
    etage?: number;
    capacite: number;
    estDisponible: boolean;
  };
  
  // Jury embarqué avec membres (dénormalisé)
  jury?: {
    idJury: number;
    nom: string;
    anneeAcademique: string;
    session: string;
    dateConstitution: Date;
    statut: StatutJury;
    membres: Array<{
      idMembre: number;
      idProfesseur: number;
      nom: string;
      prenom: string;
      email: string;
      roleJury: RoleJury;
      dateDesignation: Date;
    }>;
  };
  
  // Dossiers embarqués avec candidats (dénormalisés)
  dossiers: Array<{
    idDossierMemoire: number;
    titre: string;
    description: string;
    statut: StatutDossierMemoire;
    etape: EtapeDossier;
    candidats: Array<{
      idCandidat: number;
      nom: string;
      prenom: string;
      email: string;
      numeroMatricule: string;
    }>;
    encadrant?: {
      idProfesseur: number;
      nom: string;
      prenom: string;
      email: string;
    };
  }>;
  
  // Process-verbal embarqué (dénormalisé)
  processVerbal?: {
    idPV: number;
    dateSoutenance: Date;
    noteFinale: number;
    mention: Mention;
    observations: string;
    appreciations: string;
    demandesModifications?: string;
    dateCreation: Date;
    dateSignature?: Date;
    estSigne: boolean;
    nombreSignatures: number;
    approbations: Array<{
      idMembre: number;
      idProfesseur: number;
      dateApprobation: Date;
      roleJury: RoleJury;
    }>;
  };
  
  // Index pour recherches fréquentes
  searchableText: string; // Titres dossiers + noms candidats + noms membres jury
  statutIndex: string; // Index pour filtrage par statut
  anneeAcademiqueIndex: string; // Index pour filtrage par année
  dateSoutenanceIndex: Date; // Index pour tri par date
  membresJuryIdsIndex: number[]; // Index pour recherche par membre du jury
}

/**
 * Collection: candidats
 * 
 * Cas d'usage:
 * - Consultation d'un candidat avec ses dossiers
 * - Affichage de l'historique
 * - Gestion des binômes
 * 
 * Dénormalisation:
 * - Dossiers actifs et terminés embarqués (résumés)
 * - Encadrements embarqués
 * - Binômes embarqués
 */
export interface CandidatNoSQL {
  // Identifiant
  _id: string; // Format: "candidat_{idCandidat}"
  idCandidat: number;
  
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
  
  // Données principales du candidat
  nom: string;
  prenom: string;
  email: string;
  numeroMatricule: string;
  niveau?: string;
  filiere?: string;
  
  // Dossier actif embarqué (résumé, dénormalisé)
  dossierActif?: {
    idDossierMemoire: number;
    titre: string;
    statut: StatutDossierMemoire;
    etape: EtapeDossier;
    dateCreation: Date;
    anneeAcademique?: string;
    encadrant?: {
      idProfesseur: number;
      nom: string;
      prenom: string;
      email: string;
    };
    progression?: number; // Calculée à partir des tickets
    nombreDocuments: number;
    nombreTickets: number;
    nombreTicketsEnCours: number;
    nombreTicketsTermines: number;
  };
  
  // Dossiers terminés embarqués (résumés, dénormalisés)
  dossiersTermines: Array<{
    idDossierMemoire: number;
    titre: string;
    statut: StatutDossierMemoire;
    dateCreation: Date;
    dateModification: Date;
    anneeAcademique?: string;
    encadrant?: {
      idProfesseur: number;
      nom: string;
      prenom: string;
    };
    noteFinale?: number;
    mention?: Mention;
  }>;
  
  // Encadrements embarqués (résumés, dénormalisés)
  encadrements: Array<{
    idEncadrement: number;
    dateDebut: Date;
    dateFin?: Date;
    statut: StatutEncadrement;
    anneeAcademique: string;
    professeur: {
      idProfesseur: number;
      nom: string;
      prenom: string;
      email: string;
    };
  }>;
  
  // Binômes embarqués (dénormalisés)
  binomes: Array<{
    idBinome: number;
    dateDemande: Date;
    dateFormation?: Date;
    dateDissolution?: Date;
    statut: StatutDemandeBinome;
    membres: Array<{
      idCandidat: number;
      nom: string;
      prenom: string;
      email: string;
    }>;
  }>;
  
  // Demandes d'encadrement embarquées (dénormalisées)
  demandesEncadrement: Array<{
    idDemande: number;
    dateDemande: Date;
    statut: StatutDemandeEncadrement;
    anneeAcademique: string;
    professeur: {
      idProfesseur: number;
      nom: string;
      prenom: string;
      email: string;
    };
  }>;
  
  // Index pour recherches fréquentes
  searchableText: string; // Nom + prénom + email + numéro matricule
  niveauIndex?: string; // Index pour filtrage par niveau
  filiereIndex?: string; // Index pour filtrage par filière
  anneeAcademiqueIndex: string[]; // Index pour filtrage par année
}

/**
 * Collection: periodes
 * 
 * Cas d'usage:
 * - Consultation de toutes les périodes d'une année académique
 * - Gestion du pipeline des périodes
 * - Calendrier annuel
 * 
 * Dénormalisation:
 * - Toutes les périodes regroupées par année académique
 * - Année académique embarquée
 */
export interface PeriodesNoSQL {
  // Identifiant
  _id: string; // Format: "periodes_{anneeAcademique}"
  anneeAcademique: string;
  
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
  
  // Année académique embarquée (dénormalisée)
  annee: {
    idAnnee: number;
    code: string;
    libelle: string;
    dateDebut: Date;
    dateFin: Date;
    estActive: boolean;
  };
  
  // Période de dépôt sujet et demande d'encadrement (fusionnées)
  periodeDepotSujet?: {
    idPeriode: number;
    dateDebut: Date;
    dateFin: Date;
    estActive: boolean;
    dateCreation: Date;
    creePar: number;
  };
  
  // Période de validation sujet
  periodeValidationSujet?: {
    idPeriode: number;
    dateDebut: Date;
    dateFin?: Date;
    estActive: boolean;
  };
  
  // Sessions de soutenance embarquées (dénormalisées)
  sessions: Array<{
    idSession: number;
    nom: string;
    typeSession: TypeSessionSoutenance;
    dateDebut: Date;
    dateFin: Date;
    statut: StatutSession;
    dateCreation: Date;
    dateOuverture?: Date;
    dateFermeture?: Date;
    creePar: number;
    
    // Périodes liées à cette session
    periodePrelecture?: {
      idPeriode: number;
      dateDebut: Date;
      dateFin: Date;
      estActive: boolean;
      delaiMaxPrelecture?: number;
    };
    
    periodeDisponibilite?: {
      idPeriode: number;
      dateDebut: Date;
      dateFin: Date;
      estActive: boolean;
    };
    
    periodeDepotFinal?: {
      idPeriode: number;
      dateDebut: Date;
      dateFin: Date;
      estActive: boolean;
    };
    
    periodeValidationCorrection?: {
      idPeriode: number;
      dateDebut: Date;
      dateFin?: Date;
      estActive: boolean;
    };
  }>;
  
  // Index pour recherches fréquentes
  estActiveIndex: boolean; // Index pour filtrage des années actives
  dateDebutIndex: Date; // Index pour tri chronologique
}

/**
 * Collection: validations
 * 
 * Cas d'usage:
 * - Consultation des éléments à valider par la commission
 * - Gestion de la phase publique
 * - Répartition aléatoire des éléments
 * 
 * Dénormalisation:
 * - Éléments à valider embarqués (sujets ou documents)
 * - Avis publics embarqués
 * - Membre assigné embarqué
 */
export interface ValidationNoSQL {
  // Identifiant
  _id: string; // Format: "validation_{type}_{idElement}"
  idValidation: number;
  
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
  
  // Type de validation
  type: TypePeriodeValidation;
  anneeAcademique: string;
  sessionSoutenanceId?: number;
  
  // Membre de commission assigné (dénormalisé)
  membreAssigné: {
    idProfesseur: number;
    nom: string;
    prenom: string;
    email: string;
  };
  
  // Élément à valider (sujet ou document)
  element: {
    type: 'sujet' | 'document';
    idElement: number;
    
    // Si sujet
    sujet?: {
      idDossierMemoire: number;
      titre: string;
      description: string;
      dateCreation: Date;
      candidats: Array<{
        idCandidat: number;
        nom: string;
        prenom: string;
        email: string;
      }>;
      encadrant: {
        idProfesseur: number;
        nom: string;
        prenom: string;
        email: string;
        grade?: string;
        specialite?: string;
      };
      binome?: {
        idBinome: number;
        membres: Array<{
          idCandidat: number;
          nom: string;
          prenom: string;
        }>;
      };
    };
    
    // Si document corrigé
    document?: {
      idDocument: number;
      titre: string;
      typeDocument: TypeDocument;
      dateCreation: Date;
      dossierMemoire: {
        idDossierMemoire: number;
        titre: string;
        candidats: Array<{
          idCandidat: number;
          nom: string;
          prenom: string;
        }>;
      };
    };
  };
  
  // Statut de validation
  statut: 'EN_ATTENTE' | 'VALIDE' | 'REJETE';
  dateValidation?: Date;
  commentaire?: string;
  
  // Phase publique
  estPhasePublique: boolean;
  
  // Avis publics embarqués (dénormalisés)
  avisPublics: Array<{
    idAvis: number;
    typeElement: 'depot_sujet' | 'document_corrige';
    contenu: string;
    dateCreation: Date;
    dateModification?: Date;
    auteur: {
      type: 'professeur' | 'candidat';
      id: number;
      nom: string;
      prenom: string;
      email: string;
    };
  }>;
  
  // Index pour recherches fréquentes
  typeIndex: string; // Index pour filtrage par type
  statutIndex: string; // Index pour filtrage par statut
  membreAssignéIdIndex: number; // Index pour recherche par membre
  anneeAcademiqueIndex: string; // Index pour filtrage par année
  estPhasePubliqueIndex: boolean; // Index pour filtrage phase publique
}

/**
 * Collection: ressources
 * 
 * Cas d'usage:
 * - Consultation de la bibliothèque numérique
 * - Recherche de ressources
 * - Gestion des canevas (unicité par département)
 * 
 * Dénormalisation:
 * - Auteur embarqué
 * - Statistiques embarquées
 */
export interface RessourceNoSQL {
  // Identifiant
  _id: string; // Format: "ressource_{idRessource}"
  idRessource: number;
  
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
  
  // Données principales
  titre: string;
  description: string;
  categorie: TypeCategorieRessource;
  typeRessource: 'document' | 'lien';
  cheminFichier?: string;
  url?: string;
  tags: string[];
  niveau?: 'licence' | 'master' | 'autres' | 'all';
  estImportant?: boolean;
  estActif?: boolean;
  
  // Auteur embarqué (dénormalisé)
  auteur: {
    nom: string;
    type?: 'professeur' | 'etudiant' | 'admin';
  };
  
  // Dates
  datePublication: Date;
  
  // Statistiques embarquées (dénormalisées)
  statistiques: {
    likes: number;
    commentaires: number;
    vues: number;
  };
  
  // Pour canevas uniquement
  departement?: string; // Un seul canevas actif par département
  
  // Index pour recherches fréquentes
  searchableText: string; // Titre + description + tags
  categorieIndex: string; // Index pour filtrage par catégorie
  estActifIndex: boolean; // Index pour filtrage actif/inactif
  departementIndex?: string; // Index pour canevas par département
}

/**
 * Collection: jurys
 * 
 * Cas d'usage:
 * - Consultation d'un jury avec tous ses membres
 * - Génération automatique des jurys
 * - Gestion des disponibilités
 * 
 * Dénormalisation:
 * - Membres embarqués avec données professeur
 * - Dossiers embarqués
 * - Soutenances embarquées
 */
export interface JuryNoSQL {
  // Identifiant
  _id: string; // Format: "jury_{idJury}"
  idJury: number;
  
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
  
  // Données principales
  nom: string;
  anneeAcademique: string;
  session: string;
  dateConstitution: Date;
  statut: StatutJury;
  
  // Membres embarqués avec données professeur (dénormalisés)
  membres: Array<{
    idMembre: number;
    idProfesseur: number;
    nom: string;
    prenom: string;
    email: string;
    grade?: string;
    specialite?: string;
    roleJury: RoleJury;
    dateDesignation: Date;
    estPresidentPossible?: boolean; // Rôle PRESIDENT_JURY_POSSIBLE
  }>;
  
  // Dossiers embarqués (dénormalisés)
  dossiers: Array<{
    idDossierMemoire: number;
    titre: string;
    candidats: Array<{
      idCandidat: number;
      nom: string;
      prenom: string;
      email: string;
    }>;
    encadrant?: {
      idProfesseur: number;
      nom: string;
      prenom: string;
    };
  }>;
  
  // Soutenances embarquées (dénormalisées)
  soutenances: Array<{
    idSoutenance: number;
    dateSoutenance: Date;
    heureDebut: string;
    heureFin: string;
    mode: ModeSoutenance;
    statut: StatutSoutenance;
    salle?: {
      idSalle: number;
      nom: string;
      batiment: string;
    };
  }>;
  
  // Index pour recherches fréquentes
  searchableText: string; // Nom + noms membres + titres dossiers
  anneeAcademiqueIndex: string; // Index pour filtrage par année
  sessionIndex: string; // Index pour filtrage par session
  statutIndex: string; // Index pour filtrage par statut
  membresIdsIndex: number[]; // Index pour recherche par membre
}

/**
 * Collection: encadrements
 * 
 * Cas d'usage:
 * - Consultation d'un encadrement avec tous ses détails
 * - Panel d'encadrement
 * - Gestion des messages et tickets
 * 
 * Dénormalisation:
 * - Professeur embarqué
 * - Dossier embarqué (résumé)
 * - Messages embarqués
 * - Tickets embarqués
 */
export interface EncadrementNoSQL {
  // Identifiant
  _id: string; // Format: "encadrement_{idEncadrement}"
  idEncadrement: number;
  
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
  
  // Données principales
  dateDebut: Date;
  dateFin?: Date;
  statut: StatutEncadrement;
  anneeAcademique: string;
  
  // Professeur embarqué (dénormalisé)
  professeur: {
    idProfesseur: number;
    nom: string;
    prenom: string;
    email: string;
    grade?: string;
    specialite?: string;
    departement?: string;
  };
  
  // Dossier embarqué (résumé, dénormalisé)
  dossier: {
    idDossierMemoire: number;
    titre: string;
    description: string;
    statut: StatutDossierMemoire;
    etape: EtapeDossier;
    dateCreation: Date;
    candidats: Array<{
      idCandidat: number;
      nom: string;
      prenom: string;
      email: string;
    }>;
    progression?: number; // Calculée à partir des tickets
  };
  
  // Messages embarqués (dénormalisés)
  messages: Array<{
    idMessage: string;
    contenu: string;
    dateEnvoi: Date;
    typeMessage: TypeMessage;
    emetteur?: string;
  }>;
  
  // Tickets embarqués (dénormalisés)
  tickets: Array<{
    idTicket: number;
    titre: string;
    description: string;
    priorite: Priorite;
    dateCreation: Date;
    dateEcheance?: Date;
    statut: StatutTicket;
    phase: PhaseTicket;
    progression: number;
    consigne?: string;
    sousTaches?: Array<{
      id: number;
      titre: string;
      terminee: boolean;
    }>;
    livrables?: Array<{
      idLivrable: string;
      nomFichier: string;
      dateSubmission: Date;
      statut: StatutLivrable;
      version: number;
    }>;
  }>;
  
  // Notes de suivi embarquées (dénormalisées)
  notesSuivi: Array<{
    idNoteSuivi: number;
    contenu: string;
    dateCreation: Date;
    dateModification?: Date;
    idEncadrant: number;
  }>;
  
  // Statistiques calculées (dénormalisées)
  statistiques: {
    nombreMessages: number;
    nombreTickets: number;
    nombreTicketsEnCours: number;
    nombreTicketsEnRevision: number;
    nombreTicketsTermines: number;
    progressionGlobale: number; // Moyenne des progressions des tickets
  };
  
  // Index pour recherches fréquentes
  searchableText: string; // Titre dossier + nom professeur + noms candidats
  statutIndex: string; // Index pour filtrage par statut
  anneeAcademiqueIndex: string; // Index pour filtrage par année
  professeurIdIndex: number; // Index pour recherche par professeur
  dossierIdIndex: number; // Index pour recherche par dossier
}

/**
 * Collection: sessions
 * 
 * Cas d'usage:
 * - Consultation d'une session avec toutes les disponibilités
 * - Gestion des disponibilités professeurs
 * - Planification des soutenances
 * 
 * Dénormalisation:
 * - Disponibilités professeurs embarquées
 * - Périodes liées embarquées
 */
export interface SessionNoSQL {
  // Identifiant
  _id: string; // Format: "session_{idSession}"
  idSession: number;
  
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
  
  // Données principales
  nom: string;
  typeSession: TypeSessionSoutenance;
  anneeAcademique: string;
  dateDebut: Date;
  dateFin: Date;
  statut: StatutSession;
  dateCreation: Date;
  dateOuverture?: Date;
  dateFermeture?: Date;
  creePar: number;
  
  // Disponibilités professeurs embarquées (dénormalisées)
  disponibilites: Array<{
    idDisponibilite: number;
    idProfesseur: number;
    nom: string;
    prenom: string;
    email: string;
    joursDisponibles: Array<{
      date: Date;
      creneaux: Array<{
        heureDebut: string;
        heureFin: string;
      }>;
    }>;
  }>;
  
  // Périodes liées embarquées (dénormalisées)
  periodePrelecture?: {
    idPeriode: number;
    dateDebut: Date;
    dateFin: Date;
    estActive: boolean;
  };
  
  periodeDisponibilite?: {
    idPeriode: number;
    dateDebut: Date;
    dateFin: Date;
    estActive: boolean;
  };
  
  periodeDepotFinal?: {
    idPeriode: number;
    dateDebut: Date;
    dateFin: Date;
    estActive: boolean;
  };
  
  // Index pour recherches fréquentes
  searchableText: string; // Nom session
  statutIndex: string; // Index pour filtrage par statut
  anneeAcademiqueIndex: string; // Index pour filtrage par année
  typeSessionIndex: string; // Index pour filtrage par type
  dateDebutIndex: Date; // Index pour tri chronologique
}

/**
 * Collection: sujets
 * 
 * Cas d'usage:
 * - Consultation d'un sujet avec professeur et étudiants
 * - Catalogue des sujets
 * - Gestion des sujets par professeur
 * 
 * Dénormalisation:
 * - Professeur embarqué
 * - Étudiants embarqués
 */
export interface SujetNoSQL {
  // Identifiant
  _id: string; // Format: "sujet_{idSujet}"
  idSujet: number;
  
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
  
  // Données principales
  titre: string;
  description: string;
  niveau: string;
  departement: string;
  filieres: string[];
  nombreMaxEtudiants: number;
  nombreEtudiantsActuels: number;
  statut: 'brouillon' | 'soumis' | 'approuvé' | 'rejeté';
  dateSoumission?: Date;
  dateApprobation?: Date;
  anneeAcademique: string;
  motsCles: string[];
  prerequis: string;
  objectifs: string;
  estDisponible: boolean;
  estDesactive?: boolean;
  
  // Professeur embarqué (dénormalisé)
  professeur: {
    idProfesseur: number;
    nom: string;
    prenom: string;
    email: string;
    grade?: string;
    specialite?: string;
  };
  
  // Étudiants embarqués (dénormalisés)
  etudiants: Array<{
    id: number;
    nom: string;
    prenom: string;
    email: string;
    numeroEtudiant: string;
    dateAttribution: string;
    documentMemoire?: {
      id: number;
      titre: string;
      cheminFichier: string;
      dateDepot: string;
    };
  }>;
  
  // Index pour recherches fréquentes
  searchableText: string; // Titre + description + mots-clés + nom professeur
  statutIndex: string; // Index pour filtrage par statut
  anneeAcademiqueIndex: string; // Index pour filtrage par année
  professeurIdIndex: number; // Index pour recherche par professeur
  departementIndex: string; // Index pour filtrage par département
  filieresIndex: string[]; // Index pour filtrage par filière
}

/**
 * Collection: notifications
 * 
 * Cas d'usage:
 * - Consultation des notifications d'un utilisateur
 * - Notifications en temps réel
 * 
 * Dénormalisation:
 * - Données de la source embarquées
 */
export interface NotificationNoSQL {
  // Identifiant
  _id: string; // Format: "notification_{id}"
  id: number;
  
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
  
  // Données principales
  userId: string; // ID de l'utilisateur destinataire
  title: string;
  message: string;
  date: string;
  status: NotificationStatus;
  priority: NotificationPriority;
  category: NotificationCategory;
  source: string;
  
  // Données de la source embarquées (dénormalisées selon le type)
  sourceData?: {
    type: 'dossier' | 'soutenance' | 'ticket' | 'message' | 'validation' | 'autre';
    id: number;
    titre?: string;
    lien?: string;
  };
  
  // Index pour recherches fréquentes
  userIdIndex: string; // Index pour recherche par utilisateur
  statusIndex: string; // Index pour filtrage par statut
  categoryIndex: string; // Index pour filtrage par catégorie
  dateIndex: Date; // Index pour tri chronologique
}

/**
 * Collection: annees_academiques
 * 
 * Cas d'usage:
 * - Consultation de toutes les années académiques
 * - Gestion de l'année active
 * - Historique
 * 
 * Dénormalisation:
 * - Statistiques embarquées
 */
export interface AnneeAcademiqueNoSQL {
  // Identifiant
  _id: string; // Format: "annee_{code}"
  idAnnee: number;
  
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
  
  // Données principales
  code: string; // Format: "2024-2025"
  libelle: string;
  dateDebut: Date;
  dateFin: Date;
  estActive: boolean;
  
  // Statistiques embarquées (dénormalisées, calculées)
  statistiques: {
    nombreDossiers: number;
    nombreDossiersEnCours: number;
    nombreDossiersSoutenus: number;
    nombreEncadrements: number;
    nombreEncadrementsActifs: number;
    nombreSoutenances: number;
    nombreSoutenancesPlanifiees: number;
    nombreSoutenancesTerminees: number;
    nombreJurys: number;
    nombreProfesseurs: number;
    nombreCandidats: number;
  };
  
  // Index pour recherches fréquentes
  estActiveIndex: boolean; // Index pour filtrage année active
  dateDebutIndex: Date; // Index pour tri chronologique
  codeIndex: string; // Index pour recherche par code
}

/**
 * ============================================================================
 * NOTES SUR LA DÉNORMALISATION
 * ============================================================================
 * 
 * Avantages:
 * - Lectures rapides (pas de jointures)
 * - Données regroupées par cas d'usage
 * - Optimisé pour les requêtes fréquentes
 * 
 * Inconvénients:
 * - Écritures plus complexes (mise à jour multiple)
 * - Duplication de données
 * - Risque d'incohérence (nécessite synchronisation)
 * 
 * Stratégies de synchronisation:
 * - Événements de mise à jour pour synchroniser les collections
 * - Jobs de synchronisation périodiques
 * - Transactions pour maintenir la cohérence
 * 
 * Exemples de requêtes optimisées:
 * 
 * 1. Récupérer un dossier complet:
 *    db.dossiers.findOne({ idDossierMemoire: 101 })
 *    → Retourne tout: candidats, encadrant, documents, tickets, messages, PV
 * 
 * 2. Récupérer un professeur avec toutes ses activités:
 *    db.professeurs.findOne({ idProfesseur: 4 })
 *    → Retourne: encadrements, jurys, sujets, disponibilités, rôles
 * 
 * 3. Récupérer les validations d'un membre de commission:
 *    db.validations.find({ "membreAssigné.idProfesseur": 3, statut: "EN_ATTENTE" })
 *    → Retourne tous les éléments à valider avec détails complets
 * 
 * 4. Recherche full-text:
 *    db.dossiers.find({ $text: { $search: "intelligence artificielle" } })
 *    → Recherche dans titre, description, noms candidats
 */
