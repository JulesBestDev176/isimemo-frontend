// Types basés sur le diagramme de classes (best-sql-classe.drawio.xml)

export enum StatutDossierMemoire {
  EN_CREATION = 'EN_CREATION',
  EN_COURS = 'EN_COURS',
  EN_ATTENTE_VALIDATION = 'EN_ATTENTE_VALIDATION',
  VALIDE = 'VALIDE',
  DEPOSE = 'DEPOSE',
  SOUTENU = 'SOUTENU'
}

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
  etape: EtapeDossier; // Étape actuelle du dossier
  anneeAcademique?: string; // Année académique
  // Relations
  candidats?: Candidat[];
  encadrant?: Professeur;
  documents?: Document[];
  binome?: Binome;
}

export interface Document {
  idDocument: number;
  titre: string;
  typeDocument: TypeDocument;
  cheminFichier: string;
  dateCreation: Date;
  statut: StatutDocument;
  commentaire?: string;
  // Relations
  dossierMemoire?: DossierMemoire;
}

export interface Professeur {
  idProfesseur: number;
  nom: string;
  prenom: string;
  email: string;
  grade?: string;
  specialite?: string;
  estDisponible: boolean;
  departement?: string;
}

export interface Candidat {
  idCandidat: number;
  nom: string;
  prenom: string;
  email: string;
  numeroMatricule: string;
  niveau?: string;
  filiere?: string;
}

export interface Binome {
  idBinome: number;
  dateDemande: Date;
  dateFormation?: Date;
  dateDissolution?: Date;
  message?: string;
  reponse?: string;
  dateReponse?: Date;
  statut: StatutDemandeBinome;
  // Relations
  candidats?: Candidat[];
}

export enum StatutDemandeBinome {
  EN_ATTENTE = 'EN_ATTENTE',
  ACCEPTE = 'ACCEPTE',
  REFUSE = 'REFUSE',
  DISSOUS = 'DISSOUS'
}

export interface Encadrement {
  idEncadrement: number;
  dateDebut: Date;
  dateFin?: Date;
  statut: StatutEncadrement;
  // Relations
  professeur?: Professeur;
  dossierMemoire?: DossierMemoire;
  messages?: Message[];
  tickets?: Ticket[];
}

export enum StatutEncadrement {
  ACTIF = 'ACTIF',
  TERMINE = 'TERMINE',
  ANNULE = 'ANNULE'
}

export interface Message {
  idMessage: string;
  contenu: string;
  dateEnvoi: Date;
  typeMessage: TypeMessage;
  // Relations
  encadrement?: Encadrement;
  emetteur?: string; // Utilisateur ID
}

export enum TypeMessage {
  TEXTE = 'TEXTE',
  FICHIER = 'FICHIER',
  SYSTEME = 'SYSTEME'
}

export interface Ticket {
  idTicket: number;
  titre: string;
  description: string;
  priorite: Priorite;
  dateCreation: Date;
  dateEcheance?: Date;
  statut: StatutTicket;
  progression: number;
  // Relations
  encadrement?: Encadrement;
  livrables?: Livrable[];
}

export enum Priorite {
  BASSE = 'BASSE',
  MOYENNE = 'MOYENNE',
  HAUTE = 'HAUTE',
  URGENTE = 'URGENTE'
}

export enum StatutTicket {
  OUVERT = 'OUVERT',
  EN_COURS = 'EN_COURS',
  RESOLU = 'RESOLU',
  FERME = 'FERME'
}

export interface Livrable {
  idLivrable: string;
  nomFichier: string;
  cheminFichier: string;
  typeDocument: TypeDocument;
  dateSubmission: Date;
  statut: StatutLivrable;
  version: number;
  feedback?: string;
  // Relations
  ticket?: Ticket;
}

export enum StatutLivrable {
  DEPOSE = 'DEPOSE',
  EN_ATTENTE_VALIDATION = 'EN_ATTENTE_VALIDATION',
  VALIDE = 'VALIDE',
  REJETE = 'REJETE'
}

export interface EvenementCalendrier {
  idEvenement: number;
  titre: string;
  description?: string;
  dateDebut: Date;
  dateFin: Date;
  type: TypeEvenement;
  lieu?: string;
}

export enum TypeEvenement {
  SOUTENANCE = 'SOUTENANCE',
  ECHANCE = 'ECHANCE',
  RENDEZ_VOUS = 'RENDEZ_VOUS',
  AUTRE = 'AUTRE'
}

export interface Soutenance {
  idSoutenance: number;
  dateConstitution: Date;
  dateSoutenance: Date;
  heureDebut: string;
  heureFin: string;
  duree: number;
  mode: ModeSoutenance;
  statut: StatutSoutenance;
  // Relations
  dossierMemoire?: DossierMemoire;
  jury?: MembreJury[];
  salle?: Salle;
}

export enum ModeSoutenance {
  PRESENTIEL = 'PRESENTIEL',
  DISTANCIEL = 'DISTANCIEL',
  HYBRIDE = 'HYBRIDE'
}

export enum StatutSoutenance {
  PLANIFIEE = 'PLANIFIEE',
  EN_COURS = 'EN_COURS',
  TERMINEE = 'TERMINEE',
  ANNULEE = 'ANNULEE'
}

export interface MembreJury {
  idMembre: number;
  roleJury: RoleJury;
  dateDesignation: Date;
  // Relations
  professeur?: Professeur;
  soutenance?: Soutenance;
}

export enum RoleJury {
  PRESIDENT = 'PRESIDENT',
  RAPPORTEUR = 'RAPPORTEUR',
  EXAMINATEUR = 'EXAMINATEUR',
  ENCADRANT = 'ENCADRANT'
}

export interface Salle {
  idSalle: number;
  nom: string;
  batiment: string;
  etage: number;
  capacite: number;
  estDisponible: boolean;
  estArchive: boolean;
}

export enum Mention {
  TRES_BIEN = 'TRES_BIEN',
  BIEN = 'BIEN',
  ASSEZ_BIEN = 'ASSEZ_BIEN',
  PASSABLE = 'PASSABLE'
}

export interface ProcessVerbal {
  idPV: number;
  dateSoutenance: Date;
  noteFinale: number;
  mention: Mention;
  observations: string;
  appreciations: string;
  demandesModifications?: string; // Demandes de modifications du jury
  dateCreation: Date;
  dateSignature?: Date;
  estSigne: boolean;
  nombreSignatures: number;
  // Relations
  soutenance?: Soutenance;
  membresJury?: MembreJury[];
}

