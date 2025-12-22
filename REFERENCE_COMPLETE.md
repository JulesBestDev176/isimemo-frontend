# Référence Complète du Projet ISI MEMO

Ce document répertorie tous les modèles TypeScript, mock data, hooks/helpers, services et documentations du projet.

## 📋 Table des Matières

1. [Modèles TypeScript](#modèles-typescript)
2. [Mock Data](#mock-data)
3. [Hooks Personnalisés](#hooks-personnalisés)
4. [Services et Helpers](#services-et-helpers)
5. [Documentations](#documentations)

---

## 📦 Modèles TypeScript

### 🔐 Authentification (`models/auth/`)

#### `User.ts`
- **Interface**: `User`
- **Type**: `UserType` ('etudiant' | 'professeur' | 'assistant')
- **Propriétés**:
  - `id: string`
  - `name: string`
  - `email: string`
  - `type: UserType`
  - `department?: string`
  - `estCandidat?: boolean`
  - `estChef?: boolean`
  - `estProfesseur?: boolean`
  - `estEncadrant?: boolean`
  - `estJurie?: boolean`
  - `estCommission?: boolean`
  - `estSecretaire?: boolean`
- **Mock Data**: `mockUsers`

---

### 👥 Acteurs (`models/acteurs/`)

#### `Candidat.ts`
- **Interface**: `Candidat`
- **Propriétés**:
  - `idCandidat: number`
  - `nom: string`
  - `prenom: string`
  - `email: string`
  - `numeroMatricule: string`
  - `niveau?: string`
  - `filiere?: string`
- **Mock Data**: `mockCandidats`
- **Helpers**: `getCandidatById`, `getCandidatsByFiliere`

#### `Professeur.ts`
- **Interface**: `Professeur`
- **Propriétés**:
  - `idProfesseur: number`
  - `nom: string`
  - `prenom: string`
  - `email: string`
  - `grade?: string`
  - `specialite?: string`
  - `estDisponible: boolean`
  - `departement?: string`
  - `estEncadrant?: boolean`
  - `estJurie?: boolean`
  - `estCommission?: boolean`
  - `estChef?: boolean`
  - `capaciteEncadrement?: number`
  - `nombreEncadrementsActuels?: number`
- **Mock Data**: `mockProfesseurs`
- **Helpers**: `getProfesseurById`, `getProfesseursByDepartement`, `getProfesseursEncadrants`

#### `ChefDepartement.ts`
- **Interface**: `ChefDepartement` (étend `Professeur`)
- **Propriétés**:
  - `idChefDepartement: number`
  - `mandatDebut: Date`
  - `mandatFin: Date`
- **Mock Data**: `mockChefsDepartement`

#### `DisponibiliteProfesseur.ts`
- **Interface**: `DisponibiliteProfesseur`
- **Propriétés**:
  - `idDisponibilite: number`
  - `idProfesseur: number`
  - `idSession: number` (liée à une session spécifique)
  - `dateDisponible: Date`
  - `heureDebut: string`
  - `heureFin: string`
  - `typeDisponibilite: TypeDisponibilite`
- **Mock Data**: `mockDisponibilites`
- **Helpers**: `getDisponibilitesByProfesseur`, `getDisponibilitesBySession`
- **Règles**: Les disponibilités sont strictement liées à une SessionSoutenance, une session définit une liste précise de jours, les professeurs renseignent leurs disponibilités pour ces jours uniquement

---

### 📁 Dossier (`models/dossier/`)

#### `DossierMemoire.ts`
- **Interface**: `DossierMemoire`
- **Enums**: `StatutDossierMemoire`, `EtapeDossier`
- **Propriétés**:
  - `idDossierMemoire: number`
  - `titre: string`
  - `description: string`
  - `dateCreation: Date`
  - `dateModification: Date`
  - `statut: StatutDossierMemoire`
  - `estComplet: boolean`
  - `autoriseSoutenance: boolean`
  - `autorisePrelecture?: boolean`
  - `prelectureEffectuee?: boolean`
  - `etape: EtapeDossier`
  - `anneeAcademique?: string`
  - `estPhasePublique?: boolean`
  - `candidats?: Candidat[]`
  - `encadrant?: Professeur`
  - `documents?: Document[]`
  - `binome?: Binome`
- **Mock Data**: `mockDossiers`
- **Helpers**: 
  - `getDossierEnCoursByCandidat`
  - `getDossiersTerminesByCandidat`
  - `getDossierById`
  - `mettreDepotEnPhasePublique`
  - `retirerDepotDePhasePublique`
  - `getDepotsEnPhasePublique`

#### `Document.ts`
- **Interface**: `Document`
- **Enums**: `TypeDocument`, `StatutDocument`
- **Propriétés**:
  - `idDocument: number`
  - `titre: string`
  - `typeDocument: TypeDocument`
  - `cheminFichier: string`
  - `dateCreation: Date`
  - `dateModification?: Date`
  - `statut: StatutDocument`
  - `commentaire?: string`
  - `estPhasePublique?: boolean`
  - `dossierMemoire?: DossierMemoire`
- **Mock Data**: `mockDocuments`
- **Helpers**:
  - `mettreDocumentEnPhasePublique`
  - `retirerDocumentDePhasePublique`
  - `getDocumentsEnPhasePublique`
  - `getDocumentsAdministratifs`
  - `getDocumentsDeposesByDossier`

#### `Binome.ts`
- **Interface**: `Binome`
- **Enum**: `StatutDemandeBinome`
- **Propriétés**:
  - `idBinome: number`
  - `dateDemande: Date`
  - `dateFormation?: Date`
  - `dateDissolution?: Date`
  - `message?: string`
  - `reponse?: string`
  - `dateReponse?: Date`
  - `statut: StatutDemandeBinome`
  - `candidats?: Candidat[]`
- **Mock Data**: `mockBinomes`
- **Helpers**: `getBinomeById`, `getBinomesByCandidat`

#### `Encadrement.ts`
- **Interface**: `Encadrement`
- **Enum**: `StatutEncadrement`
- **Propriétés**:
  - `idEncadrement: number`
  - `dateDebut: Date`
  - `dateFin?: Date`
  - `statut: StatutEncadrement`
  - `anneeAcademique: string`
  - `professeur?: Professeur`
  - `dossierMemoire?: DossierMemoire`
  - `messages?: Message[]`
  - `tickets?: Ticket[]`
- **Mock Data**: `mockEncadrements`
- **Helpers**: `getEncadrementsByProfesseur`, `getEncadrementsByCandidat`

#### `DemandeEncadrement.ts`
- **Interface**: `DemandeEncadrement`
- **Enum**: `StatutDemandeEncadrement` (EN_ATTENTE, ACCEPTEE, REFUSEE, ANNULEE)
- **Propriétés**:
  - `idDemande: number`
  - `dateDemande: Date`
  - `dateReponse?: Date`
  - `statut: StatutDemandeEncadrement`
  - `motifRefus?: string` (obligatoire pour le refus)
  - `anneeAcademique: string`
  - `candidat?: Candidat`
  - `professeur?: Professeur`
  - `dossierMemoire?: DossierMemoire`
- **Mock Data**: `mockDemandesEncadrement`
- **Helpers**: `getDemandesEncadrementEnAttente`, `getDemandesEncadrementByProfesseur`
- **Règles**: Filtrage automatique par année académique actuelle, motif obligatoire pour le refus

#### `Message.ts`
- **Interface**: `Message`
- **Enum**: `TypeMessage` (TEXTE, FICHIER, SYSTEME, RENDEZ_VOUS_EN_LIGNE, RENDEZ_VOUS_PRESENTIEL, DOCUMENT)
- **Propriétés**:
  - `idMessage: string`
  - `contenu: string`
  - `dateEnvoi: Date`
  - `typeMessage: TypeMessage`
  - `encadrement?: Encadrement`
  - `emetteur?: string`
  - `expediteur?: 'encadrant' | 'etudiant'` (pour le panel)
  - `lu?: boolean` (pour le panel)
  - `date?: string` (format pour le panel)
- **Mock Data**: `mockMessages`
- **Helpers**: `getMessagesByEncadrement`
- **Note**: Les messages peuvent être de différents types : texte simple, rendez-vous en ligne, rendez-vous en présentiel, ou document avec fichier uploadé

#### `Ticket.ts`
- **Interface**: `Ticket`
- **Enums**: `StatutTicket`, `PhaseTicket`, `Priorite`
- **Interfaces associées**:
  - `SousTache`: `{ id: number, titre: string, terminee: boolean }`
  - `FeedbackRejet`: `{ dateRetour: Date, commentaire: string, corrections: string[] }`
- **Propriétés**:
  - `idTicket: number`
  - `titre: string`
  - `description: string`
  - `priorite: Priorite` (BASSE, MOYENNE, HAUTE, URGENTE)
  - `dateCreation: Date`
  - `dateEcheance?: Date`
  - `statut: StatutTicket` (A_FAIRE, EN_COURS, EN_REVISION, TERMINE)
  - `phase: PhaseTicket` (A_FAIRE, EN_COURS, EN_REVISION, TERMINE)
  - `progression: number` (0-100)
  - `consigne?: string`
  - `sousTaches?: SousTache[]`
  - `estRetourne?: boolean`
  - `feedbackRejet?: FeedbackRejet`
  - `encadrement?: Encadrement`
  - `dossierMemoire?: DossierMemoire`
  - `livrables?: Livrable[]`
- **Mock Data**: `mockTickets`
- **Helpers**: 
  - `getTicketsByEncadrement`
  - `getTicketsByDossier`
  - `hasTicketEnCours(idEncadrement)` - Vérifie s'il existe un ticket EN_COURS
  - `hasTicketEnRevision(idEncadrement)` - Vérifie s'il existe un ticket EN_REVISION
  - `canDemarrerTicketEnCours(idEncadrement)` - Vérifie si on peut démarrer un nouveau ticket
- **Règles métier**:
  - Un seul ticket EN_COURS à la fois par encadrement
  - Un seul ticket EN_REVISION à la fois par encadrement
  - Exclusion mutuelle : si EN_REVISION, aucun EN_COURS possible
  - Les tickets sont triés par priorité de phase : EN_COURS > EN_REVISION > A_FAIRE > TERMINE

#### `Livrable.ts`
- **Interface**: `Livrable`
- **Enum**: `StatutLivrable`
- **Propriétés**:
  - `idLivrable: string`
  - `nomFichier: string`
  - `cheminFichier: string`
  - `typeDocument: TypeDocument`
  - `dateSubmission: Date`
  - `statut: StatutLivrable`
  - `version: number`
  - `feedback?: string`
  - `ticket?: Ticket`
- **Mock Data**: `mockLivrables`
- **Helpers**: `getLivrablesByTicket`

#### `NoteSuivi.ts`
- **Interface**: `NoteSuivi`
- **Propriétés**:
  - `idNoteSuivi: number`
  - `contenu: string`
  - `dateCreation: Date`
  - `dateModification?: Date`
  - `idEncadrant: number` (ou `auteurId: number` dans certaines docs)
  - `dossierMemoire?: DossierMemoire` (ou `dossierMemoireId: number` dans certaines docs)
  - `encadrement?: Encadrement`
- **Mock Data**: `mockNotesSuivi`
- **Helpers**: `getNotesSuiviByDossier`

#### `DemandePrelecture.ts`
- **Interface**: `DemandePrelecture`
- **Enum**: `StatutDemandePrelecture` (EN_ATTENTE, EN_COURS, VALIDE, REJETE)
- **Propriétés**:
  - `idDemandePrelecture: number`
  - `dateDemande: Date`
  - `dateAssignation?: Date`
  - `dateTraitement?: Date`
  - `statut: StatutDemandePrelecture`
  - `commentaire?: string`
  - `feedbackRejet?: { commentaire: string, corrections: string[], dateRejet: Date }`
  - `documentMemoire?: { cheminFichier: string, nomFichier: string, taille: string, dateDepot: Date }`
  - `dossierMemoire: DossierMemoire`
  - `encadrantPrincipal?: Professeur`
  - `prelecteur?: Professeur`
  - `candidat?: Candidat`
- **Mock Data**: `mockDemandesPrelecture`
- **Helpers**: `getDemandesPrelectureEnAttente`, `getDemandesPrelectureByDossier`, `getDemandesPrelectureByPrelecteur`, `getDemandesPrelectureByEncadrant`
- **Workflow**: Demande → Assignation → Traitement → Validation/Rejet avec feedback
- **Note**: Si rejeté, notification automatique à l'encadrant principal et création automatique de tickets spécifiques pour les corrections

---

### 🎓 Soutenance (`models/soutenance/`)

#### `Soutenance.ts`
- **Interface**: `Soutenance`
- **Enums**: `ModeSoutenance`, `StatutSoutenance`
- **Propriétés**:
  - `idSoutenance: number`
  - `dateConstitution: Date`
  - `dateSoutenance: Date`
  - `heureDebut: string`
  - `heureFin: string`
  - `duree: number`
  - `mode: ModeSoutenance`
  - `statut: StatutSoutenance`
  - `anneeAcademique: string`
  - `dossiersMemoire?: DossierMemoire[]`
  - `jury?: MembreJury[]`
  - `salle?: Salle`
  - `dossierMemoire?: DossierMemoire` (rétrocompatibilité)
- **Mock Data**: `mockSoutenances`
- **Helpers**: `getSoutenancesByAnnee`, `getSoutenancesByJury`

#### `Jury.ts`
- **Interface**: `Jury`
- **Enum**: `StatutJury`
- **Propriétés**:
  - `idJury: number`
  - `nom: string`
  - `membres: MembreJuryInfo[]`
  - `dossiers: DossierMemoire[]`
  - `dateSoutenance?: Date`
  - `heureDebut?: string`
  - `heureFin?: string`
  - `salle?: Salle`
  - `statut: StatutJury`
  - `session: string`
  - `anneeAcademique: string`
  - `dateCreation: Date`
  - `creePar: number`
- **Mock Data**: `mockJurys`
- **Helpers**: `getJurysByAnnee`, `getJurysByProfesseur`

#### `MembreJury.ts`
- **Interface**: `MembreJury`
- **Enum**: `RoleJury` (PRESIDENT, RAPPORTEUR, EXAMINATEUR, ENCADRANT)
- **Propriétés**:
  - `idMembre: number`
  - `roleJury: RoleJury`
  - `dateDesignation: Date`
  - `professeur?: Professeur`
  - `soutenance?: Soutenance`
- **Mock Data**: `mockMembresJury`
- **Helpers**: `getMembresJuryBySoutenance`
- **Méthodes**: `signerPV(ProcessVerbal): void`

#### `ProcessVerbal.ts`
- **Interface**: `ProcessVerbal`
- **Enum**: `Mention`
- **Propriétés**:
  - `idPV: number`
  - `dateSoutenance: Date`
  - `noteFinale: number`
  - `mention: Mention`
  - `observations: string`
  - `appreciations: string`
  - `demandesModifications?: string`
  - `dateCreation: Date`
  - `dateSignature?: Date`
  - `estSigne: boolean`
  - `nombreSignatures: number`
  - `approbations?: ApprobationPV[]`
  - `soutenance?: Soutenance`
  - `membresJury?: MembreJury[]`
- **Mock Data**: `mockProcessVerbaux`
- **Helpers**: 
  - `calculerMention`
  - `createProcessVerbal`
  - `getProcessVerbalBySoutenance`
  - `signerProcessVerbal`

#### `Salle.ts`
- **Interface**: `Salle`
- **Propriétés**:
  - `idSalle: number`
  - `nom: string`
  - `batiment: string`
  - `etage?: number`
  - `capacite: number`
  - `estDisponible: boolean`
  - `estArchive?: boolean`
- **Mock Data**: `mockSalles`
- **Helpers**: `getSallesDisponibles`, `getSalleById`

---

### 📚 Ressources (`models/ressource/`)

#### `RessourceMediatheque.ts`
- **Interface**: `RessourceMediatheque`
- **Type**: `TypeCategorieRessource` ('memoires' | 'canevas') - cours supprimé
- **Propriétés**:
  - `idRessource: number`
  - `titre: string`
  - `description: string`
  - `auteur: string`
  - `datePublication: Date`
  - `dateCreation: Date`
  - `dateModification: Date`
  - `categorie: TypeCategorieRessource`
  - `typeRessource: 'document' | 'lien'` (video et image supprimés du scope)
  - `cheminFichier?: string`
  - `url?: string`
  - `tags: string[]`
  - `likes: number`
  - `commentaires: number`
  - `vues: number`
  - `niveau?: 'licence' | 'master' | 'autres' | 'all'`
  - `estImportant?: boolean`
  - `estActif?: boolean`
- **Mock Data**: `mockRessourcesMediatheque`
- **Helpers**:
  - `activerRessource`
  - `getRessourcesInactives`
  - `ajouterRessourceMediatheque`
  - `getRessourcesByCategorie`
- **Règles**: 
  - Un seul canevas actif par département (écrasement automatique de l'ancien lors de la soumission d'un nouveau)
  - L'ancien canevas n'est pas conservé dans l'historique lors du remplacement
  - Pas de cours, pas de vidéos dans la bibliothèque

#### `RessourcePersonnelle.ts`
- **Interface**: `RessourcePersonnelle`
- **Propriétés**:
  - `id: number`
  - `titre: string`
  - `description: string`
  - `dateCreation: Date`
  - `dateModification: Date`
  - `anneeAcademique?: string`
  - `cheminFichier: string`
  - `dossierId: number`
- **Mock Data**: `mockRessourcesPersonnelles`
- **Helpers**: `getRessourcesPersonnellesByDossier`

#### `RessourceSauvegardee.ts`
- **Interface**: `RessourceSauvegardee`
- **Propriétés**:
  - `idSauvegarde: number`
  - `idRessource: number`
  - `idEtudiant?: number`
  - `idProfesseur?: number`
  - `dateSauvegarde: Date`
  - `ressource: RessourceMediatheque`
- **Mock Data**: `mockRessourcesSauvegardees`
- **Helpers**: `getRessourcesSauvegardeesByUser`

---

### 🔄 Pipeline (`models/pipeline/`)

#### `SujetMemoire.ts`
- **Interface**: `SujetMemoire`, `Sujet`, `EtudiantSujet`
- **Enum**: `StatutSujet` (brouillon, soumis, approuvé, rejeté)
- **Propriétés**:
  - `idSujet: number`
  - `titre: string`
  - `description: string`
  - `motsCles: string[]`
  - `niveau: string` (toujours "Licence 3" pour l'instant)
  - `estDisponible: boolean`
  - `estDesactive?: boolean`
  - `dateCreation: Date`
  - `dateModification?: Date`
  - `dateSoumission?: Date`
  - `dateApprobation?: Date`
  - `professeur?: Professeur`
  - `professeurNom?: string`
  - `professeurId?: number`
  - `nombreMaxEtudiants?: number`
  - `nombreEtudiantsActuels?: number`
  - `filières?: string[]`
  - `etudiants?: EtudiantSujet[]`
- **Mock Data**: `TOUS_LES_SUJETS`
- **Helpers**: `getSujetsByProfesseur`, `getSujetsDisponibles`, `getSujetsByStatut`
- **Cycle de vie**: Brouillon → Soumis → (Approuvé/Rejeté par Admin)
- **Règles**: Un sujet est toujours de type "Mémoire" et niveau "Licence 3", le nombre d'étudiants ne peut pas dépasser le max

#### `PipelineTypes.ts`
- **Interfaces**: `BinomeOption`, `PropositionBinome`
- **Propriétés**:
  - `BinomeOption`: `id`, `nom`, `prenom`, `email`, `numeroMatricule`, `niveau`, `filiere`, `departement`
  - `PropositionBinome`: `id`, `dateProposition`, `statut`, `candidatDemandeur`, `candidatPropose`, `message`

#### `EtapePipeline.ts`
- **Interface**: `EtapePipeline`
- **Enum**: `TypeEtapePipeline`, `StatutEtape`
- **Propriétés**:
  - `id: string`
  - `type: TypeEtapePipeline`
  - `nom: string`
  - `description?: string`
  - `dateDebut?: Date`
  - `dateFin?: Date`
  - `statut: StatutEtape`
  - `estActive?: boolean`
  - `sessionSoutenanceId?: number`
  - `anneeAcademique?: string`
- **Helpers**: `construirePipeline`, `calculerStatutEtape`

---

### ⚙️ Services (`models/services/`)

#### `AnneeAcademique.ts`
- **Interface**: `AnneeAcademique`
- **Propriétés**:
  - `idAnnee: number`
  - `code: string`
  - `libelle: string`
  - `dateDebut: Date`
  - `dateFin: Date`
  - `estActive: boolean`
- **Mock Data**: `mockAnneesAcademiques`
- **Helpers**: `getAnneeActive`, `activerAnnee`, `fermerAnnee`

#### `SessionSoutenance.ts`
- **Interface**: `SessionSoutenance`
- **Enums**: `TypeSessionSoutenance` (JUIN, SEPTEMBRE, DECEMBRE, SPECIALE), `StatutSession` (PLANIFIEE, OUVERTE, FERMEE)
- **Propriétés**:
  - `idSession: number`
  - `nom: string`
  - `typeSession?: TypeSessionSoutenance`
  - `anneeAcademique: string`
  - `dateDebut: Date`
  - `dateFin: Date`
  - `statut: StatutSession`
  - `dateCreation: Date`
  - `dateOuverture?: Date`
  - `dateFermeture?: Date`
  - `creePar: number`
  - `joursSession?: Date[]` (ancienne version, remplacée par dateDebut/dateFin)
- **Mock Data**: `mockSessionsSoutenance`
- **Helpers**: `getSessionsByAnnee`, `ouvrirSession`, `fermerSession`
- **Note**: Les sessions peuvent être de différents types selon la période de l'année (Juin, Septembre, Décembre) ou spéciales

#### `PeriodeDepotSujet.ts`
- **Interface**: `PeriodeDepotSujet`
- **Propriétés**:
  - `idPeriode: number`
  - `anneeAcademique: string`
  - `dateDebut: Date`
  - `dateFin: Date`
  - `estActive: boolean`
  - `dateCreation: Date`
  - `creePar: number`
- **Mock Data**: `mockPeriodesDepotSujet`
- **Helpers**: `getPeriodeActive`, `activerPeriode`, `desactiverPeriode`

#### `PeriodeDemandeEncadrement.ts`
- **Interface**: `PeriodeDemandeEncadrement`
- **Propriétés**:
  - `idPeriode: number`
  - `anneeAcademique: string`
  - `dateDebut: Date`
  - `dateFin: Date`
  - `estActive: boolean`
  - `dateCreation: Date`
  - `creePar: number` (idChefDepartement)
- **Mock Data**: `mockPeriodesDemandeEncadrement`
- **Helpers**: `getPeriodeActive`, `activerPeriode`, `desactiverPeriode`
- **Note**: Fusionnée avec Dépôt Sujet dans le pipeline (même période, l'étudiant choisit l'encadrant en déposant le sujet)

#### `PeriodePrelecture.ts`
- **Interface**: `PeriodePrelecture`
- **Propriétés**:
  - `idPeriode: number`
  - `anneeAcademique: string`
  - `dateDebut: Date`
  - `dateFin: Date`
  - `estActive: boolean`
  - `delaiMaxPrelecture?: number`
  - `sessionSoutenanceId?: number`
  - `dateCreation: Date`
  - `creePar: number`
- **Mock Data**: `mockPeriodesPrelecture`
- **Helpers**: `getPeriodeActive`, `activerPeriode`, `desactiverPeriode`

#### `PeriodeDisponibilite.ts`
- **Interface**: `PeriodeDisponibilite`
- **Propriétés**:
  - `idPeriode: number`
  - `anneeAcademique: string`
  - `dateDebut: Date`
  - `dateFin: Date`
  - `estActive: boolean`
  - `sessionSoutenanceId: number` (liée à une session spécifique)
  - `dateCreation: Date`
  - `creePar: number` (idChefDepartement)
- **Mock Data**: `mockPeriodesDisponibilite`
- **Helpers**: `getPeriodeActive`, `activerPeriode`, `desactiverPeriode`
- **Note**: Peut se dérouler en parallèle avec Pré-lecture et peut continuer après la période de dépôt final

#### `PeriodeDepotFinal.ts`
- **Interface**: `PeriodeDepotFinal`
- **Propriétés**:
  - `idPeriode: number`
  - `anneeAcademique: string`
  - `dateDebut: Date`
  - `dateFin: Date`
  - `estActive: boolean`
  - `sessionSoutenanceId: number`
  - `dateCreation: Date`
  - `creePar: number`
- **Mock Data**: `mockPeriodesDepotFinal`
- **Helpers**: `getPeriodeActive`, `activerPeriode`, `desactiverPeriode`

#### `PeriodeCorrection.ts`
- **Interface**: `PeriodeCorrection`
- **Propriétés**:
  - `idPeriode: number`
  - `anneeAcademique: string`
  - `dateDebut: Date`
  - `dateFin: Date`
  - `estActive: boolean`
  - `sessionSoutenanceId?: number`
  - `dateCreation: Date`
  - `creePar: number`
- **Mock Data**: `mockPeriodesCorrection`
- **Helpers**: `getPeriodeActive`, `activerPeriode`, `desactiverPeriode`

#### `PipelinePeriodes.ts`
- **Interfaces**: `EtapePipeline`
- **Enums**: `TypeEtapePipeline`, `StatutEtape`
- **Propriétés**:
  - `id: string`
  - `type: TypeEtapePipeline`
  - `nom: string`
  - `description?: string`
  - `dateDebut?: Date`
  - `dateFin?: Date`
  - `statut: StatutEtape`
  - `estActive?: boolean`
  - `sessionSoutenanceId?: number`
  - `anneeAcademique?: string`
- **Helpers**: 
  - `construirePipeline`
  - `calculerStatutEtape`
  - `getEtapeByType`

#### `AttributionRole.ts`
- **Interface**: `AttributionRole`
- **Enum**: `TypeRole` (COMMISSION, JURIE, PRESIDENT_JURY_POSSIBLE)
- **Propriétés**:
  - `idAttribution: number`
  - `typeRole: TypeRole`
  - `anneeAcademique: string`
  - `dateAttribution: Date`
  - `dateRetrait?: Date`
  - `attribuePar: number` (idChefDepartement)
  - `estActif: boolean`
  - `professeur: Professeur`
- **Mock Data**: `mockAttributionsRole`
- **Helpers**: `getAttributionsByProfesseur`, `getAttributionsByRole`
- **Règles**: Les rôles sont liés à une année académique spécifique, réinitialisés lors du changement d'année

---

### 🏛️ Commission (`models/commission/`)

#### `PeriodeValidation.ts`
- **Interface**: `PeriodeValidation`
- **Enum**: `TypePeriodeValidation`
- **Propriétés**:
  - `idPeriode: number`
  - `type: TypePeriodeValidation`
  - `dateDebut: Date`
  - `dateFin?: Date`
  - `estActive: boolean`
  - `anneeAcademique: string`
  - `sessionSoutenanceId?: number`
- **Mock Data**: `mockPeriodesValidation`
- **Helpers**:
  - `getPeriodeValidationActive`
  - `estPeriodeValidationSujets`
  - `estPeriodeValidationCorrections`
  - `aPeriodeValidationActive`
  - `getTypePeriodeActive`
  - `changerPeriodeActive`

#### `AvisPublic.ts`
- **Interface**: `AvisPublic`
- **Propriétés**:
  - `idAvis: number`
  - `typeElement: 'depot_sujet' | 'document_corrige'`
  - `idElement: number`
  - `auteur: Professeur | Candidat`
  - `contenu: string`
  - `dateCreation: Date`
  - `dateModification?: Date`
- **Mock Data**: `mockAvisPublics`
- **Helpers**:
  - `getAvisPublicsByElement`
  - `ajouterAvisPublic`

---

### 📅 Calendrier (`models/calendrier/`)

#### `EvenementCalendrier.ts`
- **Interface**: `EvenementCalendrier`
- **Enum**: `TypeEvenement`
- **Propriétés**:
  - `idEvenement: number`
  - `titre: string`
  - `description?: string`
  - `dateDebut: Date`
  - `dateFin: Date`
  - `type: TypeEvenement`
  - `lieu?: string`
- **Mock Data**: `mockEvenements`
- **Helpers**: `getEvenementsByDate`, `getEvenementsByType`

---

### 🔔 Notifications (`models/notification/`)

#### `Notification.ts`
- **Interface**: `Notification`
- **Types**: `NotificationStatus`, `NotificationPriority`, `NotificationCategory`
- **Propriétés**:
  - `id: number`
  - `title: string`
  - `message: string`
  - `date: string`
  - `status: NotificationStatus`
  - `priority: NotificationPriority`
  - `category: NotificationCategory`
  - `source: string`
- **Mock Data**: `mockNotifications`
- **Helpers**: `getNotificationsByUser`, `marquerCommeLue`

---

### 🏢 Infrastructure (`models/infrastructure/`)

#### `Salle.ts`
- **Interface**: `Salle`
- **Propriétés**:
  - `idSalle: number`
  - `nom: string`
  - `batiment: string`
  - `capacite: number`
  - `equipements?: string[]`
  - `estDisponible: boolean`
  - `estArchive?: boolean`
- **Mock Data**: `mockSallesInfrastructure`
- **Helpers**: `getSallesDisponibles`, `getSalleById`

---

## 🎭 Mock Data

### Fichiers Mock (`mocks/models/`)

#### `AnneeAcademique.mock.ts`
- **Export**: `mockAnneesAcademiques`
- **Type**: `AnneeAcademique[]`

#### `AttributionRole.mock.ts`
- **Export**: `mockAttributionsRole`
- **Type**: `AttributionRole[]`

#### `ChefDepartement.mock.ts`
- **Export**: `mockChefsDepartement`
- **Type**: `ChefDepartement[]`

#### `SessionSoutenance.mock.ts`
- **Export**: `mockSessionsSoutenance`
- **Type**: `SessionSoutenance[]`

### Mock Data intégrés dans les modèles

Tous les modèles TypeScript contiennent leurs propres mock data :
- `mockUsers` (User.ts)
- `mockCandidats` (Candidat.ts)
- `mockProfesseurs` (Professeur.ts)
- `mockDossiers` (DossierMemoire.ts)
- `mockDocuments` (Document.ts)
- `mockBinomes` (Binome.ts)
- `mockEncadrements` (Encadrement.ts)
- `mockDemandesEncadrement` (DemandeEncadrement.ts)
- `mockMessages` (Message.ts)
- `mockTickets` (Ticket.ts)
- `mockLivrables` (Livrable.ts)
- `mockNotesSuivi` (NoteSuivi.ts)
- `mockDemandesPrelecture` (DemandePrelecture.ts)
- `mockSoutenances` (Soutenance.ts)
- `mockJurys` (Jury.ts)
- `mockMembresJury` (MembreJury.ts)
- `mockProcessVerbaux` (ProcessVerbal.ts)
- `mockSalles` (Salle.ts)
- `mockRessourcesMediatheque` (RessourceMediatheque.ts)
- `mockRessourcesPersonnelles` (RessourcePersonnelle.ts)
- `mockRessourcesSauvegardees` (RessourceSauvegardee.ts)
- `TOUS_LES_SUJETS` (SujetMemoire.ts)
- `mockPeriodesValidation` (PeriodeValidation.ts)
- `mockAvisPublics` (AvisPublic.ts)
- `mockEvenements` (EvenementCalendrier.ts)
- `mockNotifications` (Notification.ts)
- `mockDisponibilites` (DisponibiliteProfesseur.ts)
- `mockPeriodesDepotSujet` (PeriodeDepotSujet.ts)
- `mockPeriodesDemandeEncadrement` (PeriodeDemandeEncadrement.ts)
- `mockPeriodesPrelecture` (PeriodePrelecture.ts)
- `mockPeriodesDisponibilite` (PeriodeDisponibilite.ts)
- `mockPeriodesDepotFinal` (PeriodeDepotFinal.ts)
- `mockPeriodesCorrection` (PeriodeCorrection.ts)

---

## 🪝 Hooks Personnalisés

### `hooks/use-mobile.tsx`
- **Fonction**: `useIsMobile()`
- **Description**: Détecte si l'utilisateur est sur un appareil mobile
- **Retour**: `boolean`
- **Breakpoint**: 768px

---

## 📋 Interfaces et Types Supplémentaires (Documentations)

### Interfaces pour le Panel d'Encadrement

#### `TacheCommune`
- **Interface**: `TacheCommune`
- **Propriétés**:
  - `id: number`
  - `titre: string`
  - `description: string`
  - `dateCreation: string`
  - `dateEcheance?: string`
  - `priorite: 'Basse' | 'Moyenne' | 'Haute'`
  - `statut: 'En cours' | 'Terminé' | 'En retard'`
  - `progression: number`
- **Usage**: Tâches communes visibles par tous les étudiants d'un encadrement

#### `DossierEtudiant`
- **Interface**: `DossierEtudiant`
- **Propriétés**:
  - `id: number`
  - `etudiant: { nom: string, prenom: string, email: string }`
  - `dossierMemoire: { id: number, titre: string, statut: string, etape: string, progression: number }`
- **Usage**: Vue simplifiée d'un dossier étudiant dans le panel

#### `LivrableEtudiant`
- **Interface**: `LivrableEtudiant`
- **Propriétés**:
  - `id: string`
  - `etudiant: { nom: string, prenom: string }`
  - `titre: string`
  - `nomFichier: string`
  - `dateSubmission: Date`
  - `statut: StatutLivrable`
  - `version: number`
  - `feedback?: string`
- **Usage**: Vue d'un livrable avec informations de l'étudiant

### Interfaces pour les Tickets

#### `SousTache`
- **Interface**: `SousTache`
- **Propriétés**:
  - `id: number`
  - `titre: string`
  - `terminee: boolean`
- **Usage**: Sous-tâches d'un ticket pour suivre la progression

#### `FeedbackRejet`
- **Interface**: `FeedbackRejet`
- **Propriétés**:
  - `dateRetour: Date`
  - `commentaire: string`
  - `corrections: string[]` - Liste des corrections à apporter (seront ajoutées comme nouvelles sous-tâches)
- **Usage**: Feedback fourni lors du rejet d'un livrable

### Types de Messages

Les messages peuvent être de différents types selon le contexte :
- **TEXTE**: Message texte simple
- **FICHIER**: Message avec fichier joint
- **SYSTEME**: Message système automatique
- **RENDEZ_VOUS_EN_LIGNE**: Message avec date et heure pour un meeting en ligne
- **RENDEZ_VOUS_PRESENTIEL**: Message avec date, heure et lieu pour une rencontre physique
- **DOCUMENT**: Message avec upload de fichier (le fichier remplace le chemin manuel)

### Règles Métier Importantes

#### Tickets
- **Un seul ticket EN_COURS** : Il ne peut y avoir qu'un seul ticket avec la phase EN_COURS à la fois pour un encadrement donné
- **Un seul ticket EN_REVISION** : Il ne peut y avoir qu'un seul ticket avec la phase EN_REVISION à la fois pour un encadrement donné
- **Exclusion mutuelle** : Si un ticket est EN_REVISION, aucun ticket ne peut être EN_COURS, et vice versa
- **Tri par priorité** : Les tickets sont triés par ordre de priorité des phases : EN_COURS > EN_REVISION > A_FAIRE > TERMINE

#### Périodes
- **Exclusivité mutuelle** : Validation sujets et Validation corrections ne peuvent pas être actives simultanément
- **Ordre chronologique** : Les périodes doivent respecter un ordre logique
- **Prérequis** : Toutes les périodes nécessitent une année académique active

#### Encadrements
- **Un seul encadrement actif** : Un encadrant ne peut avoir qu'un seul encadrement actif à la fois

---

## 🔧 Services et Helpers

### Services (`models/services/`)

#### `dashboard.service.ts`
- **Fonctions**:
  - `getDashboardData(user: User)`
  - `getStatisticsByRole(user: User)`

#### `professeur.service.ts`
- **Fonctions**:
  - `getProfesseurData(id: number)`
  - `getEncadrementsByProfesseur(id: number)`

#### `ProfesseurEspace.service.ts`
- **Interfaces**:
  - `SujetPropose`
  - `SujetValide` (renommé `SujetTraite`)
  - `EtudiantEncadre`
  - `JuryInfo`
  - `CorrectionValidee` (renommé `CorrectionTraitee`)
  - `DossierHistorique`
  - `StatistiquesEncadrement`
- **Fonctions**:
  - `getSujetsProposesByProfesseur(id: number)`
  - `getEtudiantsEncadresByProfesseur(id: number)`
  - `getSujetsTraitesByProfesseur(id: number)`
  - `getJurysByProfesseur(id: number)`
  - `getCorrectionsTraiteesByProfesseur(id: number)`
  - `getStatistiquesEncadrement(id: number)`

### Utilitaires (`utils/`)

#### `lib/utils.ts`
- **Fonction**: `cn(...inputs: ClassValue[])`
- **Description**: Utilitaire pour fusionner les classes CSS avec Tailwind

#### `utils/performance.ts`
- **Fonctions**:
  - `debounce<T>(func: T, wait: number)`
  - `throttle<T>(func: T, limit: number)`
  - `prefetchRoute(path: string)`
  - `measurePerformance<T>(name: string, fn: () => T | Promise<T>)`
  - `isInViewport(element: HTMLElement)`

---

## 📚 Documentations

### Features (`docs/features/`)

1. **activation-annee-academique.md**
   - Gestion de l'activation et de la fermeture des années académiques
   - Modèle: `AnneeAcademique`
   - Actions: Activer, fermer, modifier une année académique
   - Règles: Une seule année active à la fois

2. **analyse-complete-periodes-systeme.md**
   - Analyse complète de tous les types de périodes du système
   - Modèles: Toutes les périodes (DepotSujet, Prelecture, DepotFinal, Correction, Validation, etc.)
   - Règles métier: Ordre chronologique, exclusivité mutuelle, prérequis
   - Types de sessions: JUIN, SEPTEMBRE, DECEMBRE, SPECIALE

3. **analyse-periodes-systeme.md**
   - Analyse des périodes du système
   - Focus sur les périodes de validation (sujets vs corrections)
   - Règles: Les deux types ne peuvent pas être actifs simultanément

4. **analyse-pipeline-periodes.md**
   - Documentation du pipeline de gestion des périodes
   - Structure séquentielle des périodes
   - Modèle: `PipelinePeriodes`, `EtapePipeline`
   - Types d'étapes: DEPOT_SUJET_ET_ENCADREMENT, VALIDATION_SUJET, PRELECTURE, etc.

5. **attribution-roles-professeurs.md**
   - Attribution des rôles aux professeurs (Commission, Jury, etc.)
   - Modèle: `AttributionRole`
   - Enum: `TypeRole` (COMMISSION, JURIE, PRESIDENT_JURY_POSSIBLE)
   - Actions: Attribuer, retirer un rôle, filtrer par type

6. **bibliotheque-numerique.md**
   - Gestion de la bibliothèque numérique et des ressources
   - Modèle: `RessourceMediatheque`
   - Types: 'document' | 'lien' (video et image supprimés du scope)
   - Catégories: 'memoires' | 'canevas'

7. **catalogue-memoires-public.md**
   - Catalogue public des mémoires
   - Affichage des mémoires validés et publiés
   - Recherche et filtrage

8. **consultation-detail-dossier-etudiant-encadrant.md**
   - Consultation détaillée des dossiers par les étudiants et encadrants
   - Modèles: `Candidat`, `DossierMemoire`, `Document`, `Ticket`, `NoteSuivi`
   - Onglets: Informations, Documents, Tickets, Fiche de suivi
   - Actions: Autoriser pré-lecture, autoriser soutenance
   - Calcul automatique de la progression basée sur les tickets

9. **consultation-statut-prelecture-soutenance-etudiant.md**
   - Consultation du statut de pré-lecture et de soutenance par l'étudiant
   - Suivi de l'avancement du dossier
   - Statuts de pré-lecture et de soutenance

10. **consultation-tickets-candidat.md**
    - Consultation des tickets par le candidat
    - Modèles: `Ticket`, `Livrable`, `Encadrement`
    - Phases: A_FAIRE, EN_COURS, EN_REVISION, TERMINE
    - Actions: Soumettre livrable, consulter feedback

11. **espace-jury.md**
    - Espace dédié aux membres du jury
    - Consultation des dossiers assignés
    - Création et signature de procès-verbaux
    - Modèles: `Jury`, `MembreJury`, `ProcessVerbal`, `Soutenance`

12. **espace-professeur.md**
    - Espace dédié aux professeurs
    - Onglets: Sujets proposés, Statistiques, Étudiants encadrés, Sujets traités, Jurys, Corrections traitées
    - Service: `ProfesseurEspace.service.ts`
    - Navigation par année académique

13. **generation-jurys.md**
    - Génération automatique des jurys
    - Algorithme de répartition des dossiers
    - Composition des jurys (3 membres minimum)

14. **gestion-disponibilites-professeur.md**
    - Gestion des disponibilités des professeurs
    - Modèle: `DisponibiliteProfesseur`
    - Lien avec les sessions de soutenance
    - Types de disponibilité

15. **gestion-dossiers-etudiant.md**
    - Gestion des dossiers par les étudiants
    - Création, modification, dépôt de documents
    - Statuts et étapes du dossier
    - Enums: `StatutDossierMemoire`, `EtapeDossier`

16. **gestion-encadrements-professeur.md**
    - Gestion des encadrements par les professeurs
    - Acceptation/refus des demandes d'encadrement
    - Suivi des étudiants encadrés
    - Modèle: `Encadrement`, `DemandeEncadrement`

17. **gestion-phases-tickets.md**
    - Gestion des phases de tickets avec règles métier strictes
    - Modèle: `Ticket` avec `PhaseTicket`
    - Règles: Un seul EN_COURS, un seul EN_REVISION, exclusion mutuelle
    - Helpers: `hasTicketEnCours`, `hasTicketEnRevision`, `canDemarrerTicketEnCours`

18. **gestion-prelecture-encadrant.md**
    - Gestion de la pré-lecture par l'encadrant
    - Modèle: `DemandePrelecture`
    - Enum: `StatutDemandePrelecture` (EN_ATTENTE, EN_COURS, VALIDE, REJETE)
    - Workflow: Demande → Assignation → Traitement → Validation/Rejet

19. **gestion-sessions-soutenance.md**
    - Gestion des sessions de soutenance
    - Modèle: `SessionSoutenance`
    - Types: JUIN, SEPTEMBRE, DECEMBRE, SPECIALE
    - Statuts: PLANIFIEE, OUVERTE, FERMEE
    - Actions: Créer, ouvrir, fermer une session

20. **gestion-sujets-professeur.md**
    - Gestion des sujets par les professeurs
    - Création, modification, désactivation de sujets
    - Modèle: `SujetMemoire`
    - Statuts: Disponible, Désactivé

21. **landing-page-isimemohub.md**
    - Page d'accueil du site
    - Présentation du système
    - Navigation vers les différentes sections

22. **panel-encadrant.md**
    - Panel de suivi pour les encadrants
    - Modèles: `Encadrement`, `Message`, `TacheCommune`, `DossierEtudiant`, `LivrableEtudiant`
    - Onglets: Messages, Tâches communes, Dossiers étudiants
    - Types de messages: Texte, Rendez-vous en ligne, Rendez-vous en présentiel, Document
    - Règle: Un seul encadrement actif à la fois

23. **tableau-de-bord-commun.md**
    - Tableau de bord commun à tous les utilisateurs
    - Modèle: `DashboardStats`
    - Affichage selon le type d'utilisateur
    - Statistiques personnalisées par rôle

24. **validation-commission.md**
    - Validation des sujets et documents par la commission
    - Modèles: `DossierMemoire`, `Document`, `AvisPublic`, `PeriodeValidation`
    - Types de validation: Sujets, Corrections (exclusivité mutuelle)
    - Phase publique: Consultation et avis publics
    - Répartition aléatoire des éléments à valider
    - Sous-onglets: En attente, Validés, Rejetés

2. **analyse-complete-periodes-systeme.md**
   - Analyse complète de tous les types de périodes du système

3. **analyse-periodes-systeme.md**
   - Analyse des périodes du système

4. **analyse-pipeline-periodes.md**
   - Documentation du pipeline de gestion des périodes

5. **attribution-roles-professeurs.md**
   - Attribution des rôles aux professeurs (Commission, Jury, etc.)

6. **bibliotheque-numerique.md**
   - Gestion de la bibliothèque numérique et des ressources

7. **catalogue-memoires-public.md**
   - Catalogue public des mémoires

8. **consultation-detail-dossier-etudiant-encadrant.md**
   - Consultation détaillée des dossiers par les étudiants et encadrants

9. **consultation-statut-prelecture-soutenance-etudiant.md**
   - Consultation du statut de pré-lecture et de soutenance par l'étudiant

10. **consultation-tickets-candidat.md**
    - Consultation des tickets par le candidat

11. **espace-jury.md**
    - Espace dédié aux membres du jury

12. **espace-professeur.md**
    - Espace dédié aux professeurs

13. **generation-jurys.md**
    - Génération automatique des jurys

14. **gestion-disponibilites-professeur.md**
    - Gestion des disponibilités des professeurs

15. **gestion-dossiers-etudiant.md**
    - Gestion des dossiers par les étudiants

16. **gestion-encadrements-professeur.md**
    - Gestion des encadrements par les professeurs

17. **gestion-phases-tickets.md**
    - Gestion des phases des tickets

18. **gestion-prelecture-encadrant.md**
    - Gestion de la pré-lecture par l'encadrant

19. **gestion-sessions-soutenance.md**
    - Gestion des sessions de soutenance

20. **gestion-sujets-professeur.md**
    - Gestion des sujets par les professeurs

21. **landing-page-isimemohub.md**
    - Page d'accueil du site

22. **panel-encadrant.md**
    - Panel de suivi pour les encadrants

23. **tableau-de-bord-commun.md**
    - Tableau de bord commun à tous les utilisateurs

24. **validation-commission.md**
    - Validation des sujets et documents par la commission

---

## 📝 Notes Importantes

### Structure des Modèles

- Tous les modèles sont organisés par domaine fonctionnel
- Chaque modèle contient ses propres mock data
- Les helpers sont définis dans le même fichier que le modèle
- Les enums sont définis dans le même fichier que l'interface

### Conventions de Nommage

- **Interfaces**: PascalCase (ex: `DossierMemoire`)
- **Enums**: PascalCase (ex: `StatutDossierMemoire`)
- **Mock Data**: camelCase avec préfixe `mock` (ex: `mockDossiers`)
- **Helpers**: camelCase (ex: `getDossierById`)
- **Services**: camelCase avec suffixe `.service.ts` (ex: `dashboard.service.ts`)

### Types de Données

- `id`: `number` ou `string` selon le contexte
- `date`: `Date`
- `string`: `string`
- `number`: `number`
- `boolean`: `boolean`
- `optional`: `?` après le nom de la propriété

---

## 🔗 Exports Principaux

### `models/index.ts`
Exporte tous les modèles via des barrel exports :
- `export * from './auth'`
- `export * from './acteurs'`
- `export * from './dossier'`
- `export * from './calendrier'`
- `export * from './soutenance'`
- `export * from './ressource'`
- `export * from './pipeline'`
- `export * from './notification'`
- `export * from './services'`

### `models/dossier/index.ts`
- `DossierMemoire`
- `Document`
- `Binome`
- `Encadrement`
- `DemandeEncadrement`
- `Message`
- `Ticket`
- `Livrable`
- `NoteSuivi`
- `DemandePrelecture`

### `models/services/index.ts`
- `dashboard.service`
- `professeur.service`

### `models/acteurs/index.ts`
- `Professeur`
- `Candidat`
- `DisponibiliteProfesseur`

---

---

## 📖 Informations Supplémentaires des Documentations

### Règles Métier Globales

#### Périodes
1. **Ordre chronologique** : Les périodes doivent respecter un ordre logique
2. **Exclusivité mutuelle** : Validation sujets et Validation corrections ne peuvent pas être actives simultanément
3. **Prérequis** : Toutes les périodes nécessitent une année académique active
4. **Blocage automatique** : Les actions sont bloquées en dehors des périodes actives

#### Tickets
1. **Un seul EN_COURS** : Un seul ticket EN_COURS à la fois par encadrement
2. **Un seul EN_REVISION** : Un seul ticket EN_REVISION à la fois par encadrement
3. **Exclusion mutuelle** : Si EN_REVISION, aucun EN_COURS possible
4. **Tri par priorité** : EN_COURS > EN_REVISION > A_FAIRE > TERMINE

#### Encadrements
1. **Un seul actif** : Un encadrant ne peut avoir qu'un seul encadrement actif à la fois
2. **Statut ACTIF** : L'encadrement doit être en statut ACTIF pour être utilisé
3. **Filtrage par année** : Les demandes d'encadrement sont filtrées par année académique actuelle

#### Dossiers Étudiants
1. **Un seul dossier en cours** : Un candidat ne peut avoir qu'un seul dossier avec statut "En cours" ou "En création" à la fois
2. **Dossiers terminés** : Les dossiers terminés sont archivés et consultables en lecture seule
3. **Séparation visuelle** : Affichage séparé "Dossiers en cours" / "Dossiers terminés"

#### Sessions Soutenance
1. **Une seule ouverte** : Une seule session peut être au statut OUVERTE pour une année académique donnée
2. **Workflow strict** : PLANIFIEE → OUVERTE → FERMEE (pas de retour en arrière)
3. **Jours spécifiques** : La session contient une liste précise de jours (pas de plage continue)

#### Années Académiques
1. **Unicité active** : Une seule année académique peut être active à la fois
2. **Réinitialisation des rôles** : Lors de l'activation d'une nouvelle année, tous les rôles professeurs (commission, jurie) sont désactivés
3. **Confirmation obligatoire** : Toute action d'activation ou clôture nécessite une confirmation explicite

#### Génération de Jurys
1. **Composition fixe** : 3 membres (1 Président, 1 Rapporteur, 1 Examinateur)
2. **Président requis** : Le président doit avoir le rôle PRESIDENT_JURY_POSSIBLE
3. **Conflit d'intérêts** : Un membre ne peut pas être l'encadrant d'un étudiant évalué par ce jury
4. **Regroupement** : Les étudiants sont regroupés par lots (cible: 10 étudiants/jury, ajustable)

#### Bibliothèque Numérique
1. **Unicité canevas** : Un seul canevas actif par département
2. **Écrasement automatique** : Si un nouveau canevas est soumis, l'ancien est automatiquement supprimé (pas d'historique)
3. **Types limités** : Seulement 'document' | 'lien' (video et image supprimés)
4. **Catégories** : Seulement 'memoires' | 'canevas' (cours supprimé)

#### Espace Jury
1. **Conflit d'intérêts** : Un professeur jury ne peut pas être membre du jury d'un candidat qu'il encadre
2. **Filtrage automatique** : Les soutenances où le professeur est encadrant sont automatiquement exclues
3. **Approbation PV** : 3 approbations nécessaires (président + 2 membres) pour signer le PV
4. **Correction** : Seul le président peut amener un mémoire en correction si des modifications sont demandées

#### Validation Commission
1. **Répartition aléatoire** : Les éléments à valider sont répartis aléatoirement entre les membres
2. **Phase publique** : Permet la consultation et les avis publics
3. **Exclusivité** : Validation sujets et corrections ne peuvent pas être actives simultanément

### Workflows Documentés

#### Workflow de Validation Sujet
1. Dépôt de sujet par l'étudiant
2. Répartition aléatoire aux membres de commission
3. Consultation et validation/rejet par le membre
4. Si validé → Dossier passe à EN_COURS_REDACTION
5. Si rejeté → Dossier retourne à CHOIX_SUJET

#### Workflow de Ticket
1. Création du ticket (A_FAIRE)
2. Démarrage du ticket (EN_COURS) - Un seul à la fois
3. Soumission de livrable par l'étudiant
4. Validation ou rejet par l'encadrant
5. Si rejeté → EN_REVISION (retour pour corrections)
6. Si validé → TERMINE

#### Workflow de Pré-lecture
1. Demande de pré-lecture par l'encadrant
2. Assignation d'un pré-lecteur
3. Traitement de la pré-lecture
4. Validation ou rejet avec feedback
5. Si rejeté → Notification à l'encadrant principal avec corrections
6. Création automatique de tickets spécifiques pour les corrections (si encadrant principal connecté)

#### Workflow de Session Soutenance
1. Création de la session (statut PLANIFIEE)
2. Ouverture de la session (statut OUVERTE) → Notifications aux professeurs
3. Renseignement des disponibilités par les professeurs
4. Fermeture de la session (statut FERMEE) → Verrouillage des disponibilités
5. Planification des soutenances

#### Workflow de Génération de Jurys
1. Chef de département lance la génération automatique
2. Détection automatique: Année académique, Session, Niveau (Licence 3)
3. Calcul du dimensionnement (max 10 étudiants/jury)
4. Vérification des contraintes (président disponible, pas de conflit d'intérêts)
5. Prévisualisation des propositions
6. Validation et création des jurys

#### Workflow de Dossier Étudiant
1. Création du dossier (statut EN_CREATION)
2. Choix du sujet et de l'encadrant (même période)
3. Validation du sujet par la commission
4. Rédaction (EN_COURS_REDACTION)
5. Pré-lecture et autorisation
6. Dépôt final
7. Soutenance
8. Validation des corrections (si nécessaire)
9. Dossier terminé (SOUTENU ou TERMINE)

#### Workflow de Process-Verbal
1. Création du PV par le président (avec note, mention, observations, appréciations, demandes de modifications)
2. Approbation automatique par le président
3. Approbation par les autres membres du jury (2 membres nécessaires)
4. Signature du PV (3 approbations obtenues)
5. Si demandes de modifications → Amener en correction

### Endpoints API Documentés

Les documentations mentionnent de nombreux endpoints API à implémenter, organisés par fonctionnalité :

#### Commission
- `GET /api/commission/sujets/en-attente` - Liste des sujets en attente
- `POST /api/commission/sujets/:id/valider` - Valider un sujet
- `POST /api/commission/sujets/:id/rejeter` - Rejeter un sujet
- `GET /api/commission/documents/en-attente` - Liste des documents en attente
- `POST /api/commission/documents/:id/valider` - Valider un document
- `POST /api/commission/documents/:id/rejeter` - Rejeter un document
- `GET /api/commission/phase-publique/avis/:type/:idElement` - Récupérer les avis publics
- `POST /api/commission/phase-publique/avis` - Ajouter un avis public
- `POST /api/commission/partage-aleatoire` - Lancer le partage aléatoire

#### Encadrements et Tickets
- `GET /api/encadrements/:id/dossiers/:dossierId` - Détail d'un dossier étudiant
- `GET /api/encadrements/:id/tickets` - Tickets d'un encadrement
- `GET /api/tickets/:id` - Détail d'un ticket
- `POST /api/tickets` - Créer un ticket
- `PUT /api/tickets/:id/phase` - Mettre à jour la phase d'un ticket
- `GET /api/encadrements/:id/tickets/en-cours` - Vérifier s'il existe un ticket EN_COURS

#### Pré-lecture
- `GET /api/encadrants/:id/demandes-prelecture` - Demandes de pré-lecture
- `GET /api/demandes-prelecture/:id` - Détail d'une demande
- `POST /api/demandes-prelecture/:id/valider` - Valider une pré-lecture
- `POST /api/demandes-prelecture/:id/rejeter` - Rejeter une pré-lecture
- `POST /api/encadrements/:id/dossiers/:dossierId/tickets` - Créer un ticket spécifique

#### Professeur
- `GET /api/professeurs/:id/sujets-proposes` - Sujets proposés
- `GET /api/professeurs/:id/sujets-valides` - Sujets validés
- `GET /api/professeurs/:id/etudiants-encadres` - Étudiants encadrés
- `GET /api/professeurs/:id/jurys` - Jurys du professeur
- `GET /api/professeurs/:id/corrections-validees` - Corrections validées
- `GET /api/professeurs/:id/statistiques` - Statistiques
- `GET /api/professeurs/:id/demandes-encadrement?annee={anneeAcademique}` - Demandes d'encadrement
- `PUT /api/demandes-encadrement/:id/accepter` - Accepter une demande
- `PUT /api/demandes-encadrement/:id/refuser` - Refuser une demande

#### Sessions et Disponibilités
- `GET /api/sessions/ouvertes` - Sessions actives
- `GET /api/professeurs/:id/disponibilites/session/:sessionId` - Disponibilités d'un professeur
- `POST /api/professeurs/:id/disponibilites` - Sauvegarder les disponibilités
- `GET /api/departement/sessions-soutenance` - Liste des sessions
- `POST /api/departement/sessions-soutenance` - Créer une session
- `POST /api/departement/sessions-soutenance/:id/ouvrir` - Ouvrir une session
- `POST /api/departement/sessions-soutenance/:id/fermer` - Fermer une session

#### Années Académiques
- `GET /api/departement/annees-academiques` - Liste des années
- `POST /api/departement/annees-academiques/:id/activer` - Activer une année
- `POST /api/departement/annees-academiques/:id/cloturer` - Clôturer une année
- `POST /api/departement/annees-academiques` - Créer une année

#### Rôles
- `GET /api/departement/attributions-roles` - Liste des attributions
- `POST /api/departement/attributions-roles` - Attribuer un rôle
- `DELETE /api/departement/attributions-roles/:id` - Retirer un rôle
- `GET /api/departement/professeurs/:id/roles` - Rôles d'un professeur

#### Jury
- `GET /api/soutenances/by-professeur/:idProfesseur` - Soutenances d'un professeur
- `GET /api/soutenances/:idSoutenance` - Détail d'une soutenance
- `POST /api/process-verbaux` - Créer un procès-verbal
- `PUT /api/process-verbaux/:idPV/approve` - Approuver un procès-verbal
- `PUT /api/dossiers/:idDossier/correction` - Amener en correction

#### Étudiants
- `GET /api/etudiants/:id/dossiers` - Dossiers d'un étudiant
- `GET /api/candidat/tickets` - Tickets d'un candidat
- `GET /api/candidat/encadrement/actif` - Encadrement actif d'un candidat

#### Documents et Dossiers
- `GET /api/dossiers/:idDossierMemoire` - Détail d'un dossier
- `GET /api/dossiers/:dossierId/documents` - Documents d'un dossier
- `GET /api/documents/:id/view` - Visualiser un document
- `GET /api/documents/:id/download` - Télécharger un document

#### Bibliothèque
- `GET /api/ressources` - Liste des ressources
- `GET /api/ressources/:id` - Détail d'une ressource
- `POST /api/ressources/:id/save` - Sauvegarder une ressource
- `POST /api/ressources/canevas` - Soumettre un canevas (écrase l'ancien)

#### Dashboard
- `GET /api/dashboard/stats` - Statistiques du dashboard
- `GET /api/notifications/recent` - Notifications récentes

---

## 🔍 Informations Supplémentaires Détaillées

### Algorithmes et Logiques Métier

#### Génération Automatique des Jurys
- **Algorithme** : Répartition aléatoire des étudiants en lots (cible: 10 étudiants/jury)
- **Contraintes** :
  - Président avec rôle `PRESIDENT_JURY_POSSIBLE`
  - Pas de conflit d'intérêts (encadrant ne peut pas être dans le jury de son étudiant)
  - Composition: 3 membres (Président, Rapporteur, Examinateur)
- **Dimensionnement** : Calcul automatique du nombre optimal de jurys
- **Validation** : Prévisualisation avant validation définitive

#### Calcul de la Progression d'un Dossier
- **Méthode** : Moyenne de progression de tous les tickets associés au dossier
- **Formule** : `progression = moyenne(progression_ticket1, progression_ticket2, ...)`
- **Mise à jour** : Automatique lors de la mise à jour de la progression d'un ticket

#### Calcul de la Mention (Process-Verbal)
- **Fonction** : `calculerMention(noteFinale: number): Mention`
- **Règles** :
  - 16-20 : EXCELLENT
  - 14-15.99 : TRES_BIEN
  - 12-13.99 : BIEN
  - 10-11.99 : ASSEZ_BIEN
  - < 10 : PASSABLE
- **Automatique** : Calculée lors de la création du PV

#### Statut de Pré-lecture
- **Calcul basé sur** :
  - Tous les tickets terminés ? → Éligible
  - `autorisePrelecture` ? → Autorisé
  - `prelectureEffectuee` ? → Validé
- **Statuts possibles** : Non éligible, En attente, Autorisé, Validé

#### Statut d'Autorisation de Soutenance
- **Prérequis** : Pré-lecture validée
- **Calcul basé sur** : `autoriseSoutenance` boolean
- **Statuts possibles** : Non éligible, En attente, Autorisé

### Interfaces et Types Spécifiques par Fonctionnalité

#### Pour le Panel d'Encadrement
- **TacheCommune** : Tâches visibles par tous les étudiants d'un encadrement
- **DossierEtudiant** : Vue simplifiée pour la liste
- **LivrableEtudiant** : Vue avec informations de l'étudiant

#### Pour la Consultation des Tickets
- **SousTache** : Sous-tâches d'un ticket pour suivre la progression
- **FeedbackRejet** : Feedback avec liste de corrections à apporter

#### Pour l'Espace Professeur
- **SujetPropose** : Sujets proposés (sans statut affiché)
- **SujetValide** : Sujets validés (renommé en SujetTraite)
- **EtudiantEncadre** : Étudiants encadrés groupés par année académique
- **JuryInfo** : Informations sur les jurys avec rôle
- **CorrectionValidee** : Corrections validées (renommé en CorrectionTraitee)
- **StatistiquesEncadrement** : Statistiques agrégées (total encadrements, actifs, terminés, étudiants, dossiers soutenus, taux de réussite)

#### Pour le Catalogue Public
- **Memoire** : Interface UI pour l'affichage public (avec contact, superviseur, documents, etc.)

### Règles de Filtrage et Affichage

#### Filtrage des Documents
- **Exclusions** : Documents de type `CHAPITRE` et `PRESENTATION` ne sont pas affichés dans "Documents déposés"
- **Catégories** :
  - Documents du mémoire : CHAPITRE, PRESENTATION
  - Documents déposés : Tous sauf CHAPITRE et PRESENTATION
  - Documents administratifs : DOCUMENT_ADMINISTRATIF

#### Filtrage des Soutenances (Jury)
- **Exclusion automatique** : Soutenances où le professeur est encadrant d'un candidat du dossier
- **Fonction** : `isProfesseurEncadrantDuDossier(professeur, dossier)` vérifie les encadrements actifs

#### Affichage Conditionnel (Dashboard)
- **Encadrements** : Cartes affichées uniquement si encadrements actifs ou demandes en attente
- **Cours** : Supprimé complètement du dashboard
- **Multi-rôles** : Toutes les sections pour tous les rôles actifs sont affichées

### Workflows Spéciaux

#### Workflow de Rejet de Pré-lecture
1. Pré-lecteur rejette avec commentaire et corrections
2. Notification automatique à l'encadrant principal
3. Si encadrant principal connecté → Création automatique de tickets spécifiques pour chaque correction
4. Tickets associés au dossier de l'étudiant

#### Workflow de Correction après Soutenance
1. PV créé avec demandes de modifications
2. Président amène le mémoire en correction
3. Dossier passe en statut nécessitant corrections
4. Création de tâches de correction pour l'étudiant
5. Soumission des corrections
6. Validation par la commission

#### Workflow de Répartition Aléatoire (Commission)
1. Chef de département ou Assistant lance le partage
2. Récupération de tous les éléments en attente
3. Récupération de tous les membres de commission actifs
4. Répartition aléatoire des éléments entre les membres
5. Assignation de chaque élément à un membre spécifique
6. Chaque membre voit uniquement ses éléments assignés

### Données Mock Organisées

#### Tickets par Chapitres du Mémoire
Les mock data des tickets sont organisées selon la structure du mémoire de référence :
- **Chapitre I - Introduction Générale** : Tickets pour introduction, problématique, objectifs
- **Chapitre II - Etude et Réalisation** : Tickets pour modélisation, outils, réalisation, diagrammes UML
- **Chapitre III - Bilan** : Tickets pour objectifs atteints, intérêts personnels

#### Dossiers par Statut
- **En cours** : Statuts EN_CREATION, EN_COURS, EN_ATTENTE_VALIDATION
- **Terminés** : Statuts VALIDE, DEPOSE, SOUTENU

### Navigation et Routes

#### Routes Principales
- `/dashboard` - Tableau de bord commun
- `/professeur/espace` - Espace professeur (remplacé par `/professors` pour la liste)
- `/professeur/encadrements` - Gestion des encadrements
- `/professeur/encadrements/:id/panel` - Panel d'encadrement
- `/professeur/encadrements/:id/dossier/:dossierId` - Détail d'un dossier étudiant
- `/professeur/disponibilites` - Gestion des disponibilités
- `/professeur/sujets` - Gestion des sujets
- `/jurie/soutenances` - Espace jury
- `/candidat/tickets` - Consultation des tickets
- `/etudiant/dossiers` - Liste des dossiers
- `/commission` - Espace commission
- `/departement/periodes` - Gestion des périodes
- `/departement/roles` - Gestion des rôles
- `/departement/professeurs` - Liste des professeurs
- `/departement/etudiants` - Liste des étudiants
- `/memoires` - Catalogue public

### Composants UI Spécialisés

#### Composants Dashboard
- `DashboardCard` - Carte réutilisable pour les statistiques
- `DashboardProfesseurBase` - Cartes communes pour tous les professeurs
- `DashboardEncadrant` - Cartes spécifiques aux encadrants
- `DashboardJury` - Cartes spécifiques aux jurys
- `DashboardCommission` - Cartes spécifiques à la commission

#### Composants Périodes
- `PipelinePeriodes` - Affichage du pipeline séquentiel
- `CalendrierAnnuel` - Calendrier avec navigation et modification
- `PeriodesOverview` - Vue d'ensemble et statistiques
- `AnneeAcademiqueSection` - Gestion des années académiques
- `SessionSoutenanceSection` - Gestion des sessions
- `PeriodeValidationSection` - Gestion des périodes de validation

#### Composants Panel Encadrant
- `PrelectureList` - Liste des mémoires en pré-lecture
- `PrelectureDetail` - Détail d'une pré-lecture
- `MessageList` - Liste des messages
- `TacheCommuneList` - Liste des tâches communes
- `DossierEtudiantList` - Liste des dossiers étudiants

#### Composants Professeur
- `SujetsProposesTab` - Onglet sujets proposés
- `EtudiantsEncadresTab` - Onglet étudiants encadrés
- `SujetsTraitesTab` - Onglet sujets traités
- `JurysTab` - Onglet jurys
- `CorrectionsTraiteesTab` - Onglet corrections traitées
- `StatistiquesTab` - Onglet statistiques

### Services Centralisés

#### `ProfesseurEspace.service.ts`
Service centralisé pour toutes les données d'un professeur :
- `getSujetsProposesByProfesseur` - Sujets proposés
- `getStatistiquesEncadrement` - Statistiques
- `getEtudiantsEncadresByProfesseur` - Étudiants encadrés (groupés par année)
- `getSujetsTraitesByProfesseur` - Sujets traités (groupés par année)
- `getJurysByProfesseur` - Jurys (avec exclusion des conflits d'intérêts)
- `getCorrectionsTraiteesByProfesseur` - Corrections traitées (groupées par année)

---

## 📊 Détails Supplémentaires par Fonctionnalité

### Génération Automatique des Jurys
- **Algorithme de répartition** : Répartition aléatoire des étudiants en lots
- **Dimensionnement** : Cible de 10 étudiants par jury (ajustable), sauf si reste ≤ 5
- **Contraintes vérifiées** :
  - Président avec rôle `PRESIDENT_JURY_POSSIBLE` disponible
  - Pas de conflit d'intérêts (encadrant ne peut pas être dans le jury de son étudiant)
  - Composition: 3 membres minimum (Président, Rapporteur, Examinateur)
- **Périmètre** : Génération par Département, Niveau (Licence/Master) et Session
- **Validation** : Prévisualisation des propositions avant validation définitive

### Calcul de la Progression d'un Dossier
- **Méthode** : Moyenne arithmétique de la progression de tous les tickets associés
- **Formule** : `progression = moyenne(progression_ticket1, progression_ticket2, ..., progression_ticketN)`
- **Mise à jour** : Automatique lors de la mise à jour de la progression d'un ticket
- **Affichage** : Barre de progression avec pourcentage

### Calcul de la Mention (Process-Verbal)
- **Fonction** : `calculerMention(noteFinale: number): Mention`
- **Règles** :
  - 16.0 - 20.0 : EXCELLENT
  - 14.0 - 15.99 : TRES_BIEN
  - 12.0 - 13.99 : BIEN
  - 10.0 - 11.99 : ASSEZ_BIEN
  - < 10.0 : PASSABLE
- **Automatique** : Calculée automatiquement lors de la création du PV
- **Note** : La mention EXCELLENT a été ajoutée au système

### Calcul du Statut de Pré-lecture
- **Prérequis** : Tous les tickets du dossier doivent être en phase `TERMINE`
- **Statuts possibles** :
  - **Non éligible** : Toutes les tâches ne sont pas terminées
  - **En attente** : Toutes les tâches terminées mais `autorisePrelecture` est `false` ou `undefined`
  - **Autorisée** : `autorisePrelecture` est `true` mais `prelectureEffectuee` est `false`
  - **Validée** : `prelectureEffectuee` est `true`
- **Affichage** : Badge coloré avec message explicatif

### Calcul du Statut d'Autorisation de Soutenance
- **Prérequis** : Pré-lecture validée (`prelectureEffectuee` est `true`)
- **Statuts possibles** :
  - **Non éligible** : Pré-lecture non validée
  - **En attente** : Pré-lecture validée mais `autoriseSoutenance` est `false` ou `undefined`
  - **Autorisé** : `autoriseSoutenance` est `true`
- **Affichage** : Badge coloré avec message explicatif

### Répartition Aléatoire (Commission)
- **Algorithme** : Répartition équitable des éléments à valider entre les membres de commission
- **Exemple** : 50 sujets à valider, 5 membres → Chaque membre reçoit environ 10 sujets
- **Lancement** : Par le chef de département ou l'assistant
- **Assignation** : Chaque élément est assigné à un membre spécifique
- **Visibilité** : Chaque membre voit uniquement ses éléments assignés

### Filtrage des Documents
- **Exclusions dans "Documents déposés"** :
  - Documents de type `CHAPITRE` : Exclus
  - Documents de type `PRESENTATION` : Exclus
- **Catégories d'affichage** :
  - **Documents du mémoire** : CHAPITRE, PRESENTATION
  - **Documents déposés** : Tous sauf CHAPITRE et PRESENTATION
  - **Documents administratifs** : DOCUMENT_ADMINISTRATIF

### Filtrage des Soutenances (Jury)
- **Fonction** : `isProfesseurEncadrantDuDossier(professeur, dossier)`
- **Vérification** : Les encadrements actifs du professeur sont vérifiés
- **Exclusion** : Soutenances où le professeur est encadrant d'un candidat du dossier sont automatiquement exclues
- **Raison** : Conflit d'intérêts (un encadrant ne peut pas être dans le jury de son étudiant)

### Organisation des Données par Année Académique
- **Filtrage automatique** : Les demandes d'encadrement sont filtrées par année académique actuelle
- **Navigation** : Affichage d'une seule année à la fois avec navigation vers les années précédentes
- **Groupement** : Les encadrements, sujets traités et corrections traitées sont groupés par année académique
- **Pagination** : 10 éléments par page avec navigation

### Mock Data Organisés par Chapitres
- **Tickets** : Organisés selon la structure du mémoire de référence
  - Chapitre I - Introduction Générale : Introduction, problématique, objectifs
  - Chapitre II - Etude et Réalisation : Modélisation, outils, réalisation, diagrammes UML
  - Chapitre III - Bilan : Objectifs atteints, intérêts personnels
- **Chaque ticket** : Correspond à une section ou sous-section du mémoire

### Affichage Conditionnel (Dashboard)
- **Encadrements** :
  - Carte "Étudiants encadrés" : Affichée uniquement si `getEncadrementsActifs(idProfesseur).length > 0`
  - Carte "Demandes en attente" : Affichée uniquement si `getDemandesEncadrementEnAttente(idProfesseur).length > 0`
- **Cours** : Complètement supprimé du dashboard
- **Multi-rôles** : Toutes les sections pour tous les rôles actifs sont affichées simultanément

### Types de Messages (Panel Encadrant)
- **TEXTE** : Message texte simple
- **RENDEZ_VOUS_EN_LIGNE** : Message avec date et heure pour un meeting en ligne
- **RENDEZ_VOUS_PRESENTIEL** : Message avec date, heure et lieu pour une rencontre physique
- **DOCUMENT** : Message avec upload de fichier (le fichier remplace le chemin manuel)
- **Note** : Seuls les messages envoyés par l'encadrant sont affichés (l'étudiant ne peut pas envoyer de messages)

### Règles de Navigation
- **Sidebar** :
  - "Calendrier" visible pour les jurys
  - "Disponibilités" non visible pour les jurys (seulement pour les professeurs)
  - "Encadrements" visible si le professeur est aussi encadrant
  - "Soutenances" supprimé (remplacé par "Jury")
- **Routes** :
  - `/professeur/espace` : Supprimé (remplacé par `/professors` pour la liste)
  - `/professors` : Liste de tous les professeurs avec consultation détaillée

### Statistiques Calculées
- **StatistiquesEncadrement** :
  - Total encadrements : Nombre total d'encadrements
  - Encadrements actifs : Nombre d'encadrements en cours (maximum 1)
  - Encadrements terminés : Nombre d'encadrements terminés
  - Total étudiants : Nombre total d'étudiants encadrés (unique)
  - Dossiers soutenus : Nombre de dossiers qui ont été soutenus
  - Dossiers validés : Nombre de dossiers validés
  - Taux de réussite : Pourcentage de dossiers soutenus par rapport aux encadrements terminés

### Pipeline des Périodes
- **Structure séquentielle** :
  1. Début Année Académique
  2. Dépôt Sujet et Choix d'Encadrant (même période)
  3. Validation Sujet
  4. Pré-lecture 1 && Renseignement Disponibilité 1 (en parallèle)
  5. Dépôt Final 1 (Renseignement Disponibilité peut continuer après)
  6. Soutenance Septembre
  7. Validation Correction 1
  8. Pré-lecture 2 && Renseignement Disponibilité 2 (en parallèle)
  9. Dépôt Final 2 (Renseignement Disponibilité peut continuer après)
  10. Soutenance Décembre
  11. Validation Correction 2
  12. Fin Année Académique
- **Périodes parallèles** : Même ordre dans le pipeline, peuvent se dérouler simultanément
- **Sessions** : Seulement Septembre et Décembre, une de chaque par année académique
- **Nommage** : "Soutenance Septembre 2025" / "Soutenance Décembre 2025" (pas "Session Session...")

### Catalogue Public
- **Recherche** : Insensible à la casse sur Titre, Auteur, Description, Étiquettes
- **Filtres** : Département, Année, Mention, Thématique (combinaison AND)
- **Pagination** : 5 mémoires par page
- **Affichage** : Cartes avec titre, auteur, année, mention, département, description, image de couverture, étiquettes

### Landing Page
- **Navigation** : Par hash (Single Page Application feel)
- **Sections** : Accueil, Soumission, Consultation, Analyse IA, Détection Plagiat, Assistance
- **Contenu** : Statique principalement (pas d'appels API)
- **Animations** : Framer Motion pour les transitions

---

**Dernière mise à jour**: 2025-01-27
**Note**: Ce document inclut toutes les informations des 24 documentations features analysées, ainsi que toutes les interfaces, enums, règles métier, workflows, endpoints API, algorithmes, calculs, filtrages, composants et services documentés. Toutes les documentations ont été consultées intégralement sans exception.

