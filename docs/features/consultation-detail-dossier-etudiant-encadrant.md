# Fonctionnalité : Consultation du Détail d'un Dossier Étudiant par l'Encadrant

## Titre
Consultation détaillée d'un dossier de mémoire étudiant par l'encadrant

## But
Permettre à l'encadrant de consulter en détail un dossier de mémoire d'un de ses étudiants, incluant :
- Les informations complètes de l'étudiant (candidat)
- Les informations détaillées du dossier de mémoire
- La liste des documents déposés avec leur statut
- Les tickets associés à l'encadrement
- Le suivi de la progression du dossier

## Prérequis
- L'utilisateur doit être authentifié.
- L'utilisateur doit avoir le rôle `estEncadrant = true`.
- L'encadrement doit exister et appartenir à l'encadrant connecté.
- Le dossier de mémoire doit exister et être associé à l'encadrement.

## Conditions/Préconditions
- L'encadrant accède à cette page depuis le panel d'encadrement (`/professeur/encadrements/:id/panel`).
- Le dossier doit être accessible via l'encadrement (relation `Encadrement.dossierMemoire.candidats`).
- L'encadrant doit être le propriétaire de l'encadrement.

## Postconditions
- L'encadrant visualise toutes les informations du dossier étudiant.
- L'encadrant peut consulter les documents et leur statut.
- L'encadrant peut voir les tickets associés à l'encadrement.
- Les actions de consultation sont tracées (logs pour l'instant, à remplacer par des appels API).

## Scénario nominal

### 1. Accès à la page de détail
1. L'encadrant se trouve dans le panel d'encadrement (`/professeur/encadrements/:id/panel`).
2. L'encadrant clique sur le bouton "Voir le détail" d'un dossier étudiant dans l'onglet "Dossiers étudiants".
3. Le système navigue vers `/professeur/encadrements/:id/dossier/:dossierId`.
4. Le système vérifie que l'utilisateur est un encadrant (`user?.estEncadrant`).
5. Le système vérifie que l'encadrement existe et appartient à l'encadrant.
6. Le système vérifie que le dossier existe.
7. La page de détail s'affiche avec les informations du candidat et du dossier.

### 2. Consultation des informations
1. L'encadrant consulte l'en-tête avec :
   - Avatar de l'étudiant (initiales)
   - Nom complet de l'étudiant
   - Email, matricule, niveau, filière
   - Statut et étape du dossier
   - Année académique
2. L'encadrant consulte la section "Informations du mémoire" avec :
   - Titre et description
   - Dates de création et modification
   - Barre de progression calculée automatiquement
   - État de complétude

### 3. Navigation par onglets
1. L'encadrant peut naviguer entre 4 onglets :
   - **Informations** : Détails complets du candidat et du dossier, actions d'autorisation
   - **Documents** : Liste des documents avec statut et actions
   - **Tickets** : Liste des tickets associés au dossier avec filtrage par statut
   - **Fiche de suivi** : Notes de suivi pour le dossier

### 4. Onglet Informations
1. L'encadrant consulte les informations de l'étudiant :
   - Nom complet, email, matricule
   - Niveau et filière
2. L'encadrant consulte les informations du dossier :
   - Titre, description
   - Statut et étape (avec badges colorés)
   - Dates de création et modification
   - Année académique
   - **Progression** : Calculée automatiquement basée sur la moyenne de progression de tous les tickets associés au dossier
   - Autorisation de pré-lecture et soutenance
3. **Actions d'autorisation** (si conditions remplies) :
   - **Autoriser pré-lecture** : Bouton disponible si toutes les tâches sont terminées et pré-lecture non encore autorisée
   - **Autoriser soutenance** : Bouton disponible si pré-lecture effectuée et soutenance non encore autorisée
   - Les actions sont confirmées via des modals de confirmation

### 5. Onglet Documents
1. L'encadrant consulte la liste des documents du dossier.
2. Chaque document affiche :
   - Titre et type (Chapitre, Annexe, Document administratif, etc.)
   - Statut (Brouillon, Déposé, En attente de validation, Validé, Rejeté, Archivé)
   - Date de création
   - Commentaire (si présent)
3. L'encadrant peut :
   - **Voir** le document (bouton avec icône Eye)
   - **Télécharger** le document (bouton avec icône Download)
4. Si aucun document n'est disponible, un message "Aucun document disponible" s'affiche.

### 6. Onglet Tickets
1. L'encadrant consulte la liste des tickets associés au dossier, filtrés par sous-onglets :
   - **À faire** : Tickets en phase `A_FAIRE`
   - **En cours** : Tickets en phase `EN_COURS`
   - **En révision** : Tickets en phase `EN_REVISION`
   - **Terminés** : Tickets en phase `TERMINE`
2. Chaque ticket affiche :
   - Titre et description
   - **Phase** (À faire, En cours, En révision, Terminé) avec badge coloré
   - Priorité (Basse, Moyenne, Haute, Urgente) avec badge coloré
   - Barre de progression avec couleur selon la phase
   - Date de création et échéance (si présente)
3. L'encadrant peut **consulter un ticket** en cliquant dessus :
   - Modal affichant la consigne du ticket
   - Liste des sous-tâches avec statut (terminée/non terminée)
   - Si le ticket est en révision, affichage du livrable associé avec possibilité de :
     - **Visualiser** le livrable (ouvre dans un nouvel onglet)
     - **Télécharger** le livrable
     - **Valider** : Passe le ticket à "Terminé" (toutes les sous-tâches doivent être terminées)
     - **Rejeter** : Retourne le ticket à "En cours" avec feedback et nouvelles corrections
4. **Règles métier** :
   - Un seul ticket peut être `EN_COURS` à la fois par dossier
   - Un seul ticket peut être `EN_REVISION` à la fois par dossier
   - Si un ticket est `EN_REVISION`, aucun ticket ne peut être `EN_COURS`
   - Un ticket en révision doit avoir toutes ses sous-tâches terminées
   - Lors du rejet, l'encadrant doit fournir un commentaire obligatoire et peut ajouter de nouvelles corrections (sous-tâches)
5. Si aucun ticket n'est disponible, un message "Aucun ticket disponible" s'affiche.

### 7. Onglet Fiche de suivi
1. L'encadrant consulte l'historique des notes de suivi pour ce dossier.
2. Chaque note affiche :
   - Contenu de la note
   - Date de création et dernière modification
   - Auteur (encadrant)
3. L'encadrant peut **ajouter une nouvelle note** :
   - Cliquer sur le bouton "Ajouter une note"
   - Remplir le champ texte (obligatoire)
   - Confirmer l'ajout
4. Les notes sont triées par date (plus récentes en premier).
5. Si aucune note n'est disponible, un message "Aucune note de suivi pour le moment" s'affiche.

### 8. Retour au panel
1. L'encadrant clique sur le bouton "Retour au panel".
2. Le système navigue vers `/professeur/encadrements/:id/panel`.

## Scénarios alternatifs/erreurs

### Scénario 1 : Utilisateur non encadrant
- **Condition** : `user?.estEncadrant === false`
- **Action** : Affichage d'un message d'erreur "Accès non autorisé" avec explication.
- **Redirection** : Aucune (page bloquée).

### Scénario 2 : Encadrement introuvable
- **Condition** : `encadrement === null`
- **Action** : Affichage d'un message d'erreur "Encadrement introuvable" avec bouton de retour.
- **Redirection** : Bouton vers `/professeur/encadrements`.

### Scénario 3 : Dossier introuvable
- **Condition** : `dossier === null`
- **Action** : Affichage d'un message d'erreur "Dossier introuvable" avec bouton de retour.
- **Redirection** : Bouton vers `/professeur/encadrements/:id/panel`.

### Scénario 4 : Encadrant non propriétaire
- **Condition** : L'encadrement n'appartient pas à l'encadrant connecté.
- **Action** : Affichage d'un message d'erreur "Accès non autorisé".
- **Redirection** : Aucune (page bloquée).

### Scénario 5 : Candidat non trouvé
- **Condition** : Le dossier n'a pas de candidat associé (`dossier.candidats === null || dossier.candidats.length === 0`).
- **Action** : Affichage des informations du dossier avec "Étudiant" comme nom par défaut.
- **Résultat** : La page s'affiche mais certaines informations de l'étudiant sont manquantes.

### Scénario 6 : Aucun document
- **Condition** : `documents.length === 0`
- **Action** : Affichage d'un message "Aucun document disponible pour ce dossier" avec icône Folder.
- **Résultat** : L'onglet Documents est accessible mais vide.

### Scénario 7 : Aucun ticket
- **Condition** : `tickets.length === 0`
- **Action** : Affichage d'un message "Aucun ticket disponible pour ce dossier" avec icône TicketIcon.
- **Résultat** : L'onglet Tickets est accessible mais vide.

## Exigences fonctionnelles

### EF1 : Gestion des permissions
- Seuls les encadrants peuvent accéder à cette page.
- Un encadrant ne peut consulter que les dossiers de son propre encadrement.
- Vérification systématique de la propriété de l'encadrement.

### EF2 : Affichage des informations
- Affichage complet des informations du candidat (nom, prénom, email, matricule, niveau, filière).
- Affichage complet des informations du dossier (titre, description, statut, étape, dates, progression).
- **Calcul automatique de la progression** : Basé sur la moyenne de progression de tous les tickets associés au dossier (pas sur les documents).
- Affichage des statuts de pré-lecture et autorisation de soutenance.
- Actions d'autorisation conditionnelles (boutons "Autoriser pré-lecture" et "Autoriser soutenance").

### EF3 : Gestion des documents
- Liste complète des documents associés au dossier.
- Affichage du type et du statut de chaque document avec badges colorés.
- Actions de visualisation et téléchargement (à implémenter avec les appels API).

### EF4 : Gestion des tickets
- Liste des tickets associés au dossier (filtrés par `dossierMemoire.idDossierMemoire`).
- Filtrage par sous-onglets (À faire, En cours, En révision, Terminés).
- Affichage de la priorité et de la phase avec badges colorés.
- Affichage des dates et de la progression.
- Consultation détaillée d'un ticket (modal avec consigne, sous-tâches, livrable).
- Workflow de validation/rejet pour les tickets en révision.
- Gestion des sous-tâches et feedback de rejet.

### EF6 : Fiche de suivi
- Affichage de l'historique des notes de suivi.
- Ajout de nouvelles notes de suivi.
- Tri chronologique (plus récentes en premier).

### EF5 : Navigation
- Navigation fluide entre les onglets avec animations.
- Bouton de retour vers le panel d'encadrement.
- Gestion des états de chargement et d'erreur.

## Exigences non-fonctionnelles

### ENF1 : Performance
- Utilisation de `useMemo` pour les calculs de progression et le filtrage des tickets.
- Chargement optimisé des données (pas de re-fetch inutile).
- Animations fluides avec `framer-motion`.

### ENF2 : Accessibilité
- Labels appropriés pour tous les éléments interactifs.
- Contraste des couleurs respecté pour les badges et textes.
- Navigation au clavier fonctionnelle.
- Messages d'erreur clairs et compréhensibles.

### ENF3 : Maintenabilité
- Code structuré avec séparation des responsabilités.
- Types TypeScript stricts pour tous les modèles.
- Fonctions utilitaires pour le formatage des labels (statut, étape, type document).

### ENF4 : Responsive
- Design adaptatif pour mobile, tablette et desktop.
- Tableaux et listes scrollables sur petits écrans.
- Espacement et tailles de police adaptatifs.

## Flow (Steps)

```
1. Accès à la page
   ├─ Vérification authentification
   ├─ Vérification rôle encadrant
   ├─ Vérification existence encadrement
   ├─ Vérification propriétaire encadrement
   └─ Vérification existence dossier

2. Chargement des données
   ├─ Récupération du candidat (premier candidat du dossier)
   ├─ Récupération des documents du dossier
   ├─ Récupération des tickets de l'encadrement
   └─ Calcul de la progression

3. Affichage de la page
   ├─ En-tête avec informations candidat
   ├─ Section informations du mémoire
   └─ Onglets (Informations, Documents, Tickets)

4. Navigation utilisateur
   ├─ Changement d'onglet
   ├─ Consultation des informations
   ├─ Actions sur documents (voir, télécharger)
   └─ Retour au panel
```

## Use Case

### Acteur
- **Encadrant** (professeur avec `estEncadrant = true`)

### Trigger
- Clic sur le bouton "Voir le détail" d'un dossier étudiant dans le panel d'encadrement.

### Préconditions
- Encadrant authentifié.
- Encadrement actif existant et appartenant à l'encadrant.
- Dossier de mémoire existant et associé à l'encadrement.

### Postconditions
- Page de détail affichée avec toutes les informations.
- Actions de consultation tracées (via API future).

## Données (Modèles utilisés)

### Candidat
```typescript
interface Candidat {
  idCandidat: number;
  nom: string;
  prenom: string;
  email: string;
  numeroMatricule: string;
  niveau?: string;
  filiere?: string;
}
```

### DossierMemoire
```typescript
interface DossierMemoire {
  idDossierMemoire: number;
  titre: string;
  description: string;
  dateCreation: Date;
  dateModification: Date;
  statut: StatutDossierMemoire;
  estComplet: boolean;
  autoriseSoutenance: boolean;
  etape: EtapeDossier;
  anneeAcademique?: string;
  candidats?: Candidat[];
  encadrant?: Professeur;
  documents?: Document[];
}
```

### Document
```typescript
interface Document {
  idDocument: number;
  titre: string;
  typeDocument: TypeDocument;
  cheminFichier: string;
  dateCreation: Date;
  statut: StatutDocument;
  commentaire?: string;
  dossierMemoire?: DossierMemoire;
}
```

### Ticket
```typescript
interface Ticket {
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
  encadrement?: Encadrement;
  dossierMemoire?: DossierMemoire; // Association avec un dossier spécifique
  livrables?: Livrable[];
}

interface SousTache {
  id: number;
  titre: string;
  terminee: boolean;
}

interface FeedbackRejet {
  dateRetour: Date;
  commentaire: string;
  corrections: string[]; // Liste des corrections à apporter (seront ajoutées comme nouvelles sous-tâches)
}
```

### StatutTicket (enum)
```typescript
enum StatutTicket {
  A_FAIRE = 'A_FAIRE', // Ticket créé, en attente de prise en charge
  EN_COURS = 'EN_COURS', // Ticket en cours de traitement
  EN_REVISION = 'EN_REVISION', // Livrable rejeté, retourné pour révision
  TERMINE = 'TERMINE' // Ticket terminé et validé
}
```

### PhaseTicket (enum)
```typescript
enum PhaseTicket {
  A_FAIRE = 'A_FAIRE', // Ticket créé, en attente de prise en charge
  EN_COURS = 'EN_COURS', // Ticket en cours de traitement
  EN_REVISION = 'EN_REVISION', // Livrable rejeté, retourné pour révision
  TERMINE = 'TERMINE' // Ticket terminé et validé
}
```

### NoteSuivi
```typescript
interface NoteSuivi {
  idNoteSuivi: number;
  contenu: string;
  dateCreation: Date;
  dateModification: Date;
  auteurId: number; // ID de l'encadrant
  dossierMemoireId: number; // ID du dossier associé
}
```

### Enums utilisés
```typescript
enum StatutDossierMemoire {
  EN_CREATION = 'EN_CREATION',
  EN_COURS = 'EN_COURS',
  EN_ATTENTE_VALIDATION = 'EN_ATTENTE_VALIDATION',
  VALIDE = 'VALIDE',
  DEPOSE = 'DEPOSE',
  SOUTENU = 'SOUTENU'
}

enum EtapeDossier {
  CHOIX_SUJET = 'CHOIX_SUJET',
  VALIDATION_SUJET = 'VALIDATION_SUJET',
  EN_COURS_REDACTION = 'EN_COURS_REDACTION',
  DEPOT_INTERMEDIAIRE = 'DEPOT_INTERMEDIAIRE',
  DEPOT_FINAL = 'DEPOT_FINAL',
  SOUTENANCE = 'SOUTENANCE',
  TERMINE = 'TERMINE'
}

enum StatutDocument {
  BROUILLON = 'BROUILLON',
  DEPOSE = 'DEPOSE',
  EN_ATTENTE_VALIDATION = 'EN_ATTENTE_VALIDATION',
  VALIDE = 'VALIDE',
  REJETE = 'REJETE',
  ARCHIVE = 'ARCHIVE'
}

enum TypeDocument {
  CHAPITRE = 'CHAPITRE',
  ANNEXE = 'ANNEXE',
  FICHE_SUIVI = 'FICHE_SUIVI',
  DOCUMENT_ADMINISTRATIF = 'DOCUMENT_ADMINISTRATIF',
  AUTRE = 'AUTRE'
}

enum Priorite {
  BASSE = 'BASSE',
  MOYENNE = 'MOYENNE',
  HAUTE = 'HAUTE',
  URGENTE = 'URGENTE'
}

enum StatutTicket {
  A_FAIRE = 'A_FAIRE',
  EN_COURS = 'EN_COURS',
  EN_REVISION = 'EN_REVISION',
  TERMINE = 'TERMINE'
}
```

## Impact API (Endpoints)

### Endpoints requis (à implémenter)

#### Consultation du dossier
- `GET /api/encadrements/:id/dossiers/:dossierId` - Récupérer le détail d'un dossier étudiant
- `GET /api/encadrements/:id/dossiers/:dossierId/candidat` - Récupérer les informations du candidat

#### Documents
- `GET /api/dossiers/:dossierId/documents` - Récupérer les documents d'un dossier
- `GET /api/documents/:id/view` - Visualiser un document (retourne l'URL ou le contenu)
- `GET /api/documents/:id/download` - Télécharger un document

#### Tickets
- `GET /api/dossiers/:dossierId/tickets` - Récupérer les tickets d'un dossier
- `GET /api/tickets/:id` - Récupérer le détail d'un ticket
- `POST /api/tickets/:id/valider` - Valider un ticket en révision (passe à TERMINE)
- `POST /api/tickets/:id/rejeter` - Rejeter un ticket en révision (retourne à EN_COURS avec feedback)

#### Notes de suivi
- `GET /api/dossiers/:dossierId/notes-suivi` - Récupérer les notes de suivi d'un dossier
- `POST /api/dossiers/:dossierId/notes-suivi` - Ajouter une note de suivi
- `PUT /api/notes-suivi/:id` - Modifier une note de suivi
- `DELETE /api/notes-suivi/:id` - Supprimer une note de suivi

#### Autorisations
- `POST /api/dossiers/:dossierId/autoriser-prelecture` - Autoriser la pré-lecture
- `POST /api/dossiers/:dossierId/autoriser-soutenance` - Autoriser la soutenance

## Tests recommandés

### Tests unitaires
- [ ] Vérifier que `DossierEtudiantDetail` redirige les non-encadrants.
- [ ] Vérifier que `DossierEtudiantDetail` vérifie l'existence de l'encadrement.
- [ ] Vérifier que `DossierEtudiantDetail` vérifie l'existence du dossier.
- [ ] Vérifier le calcul de la progression (moyenne des progressions des tickets).
- [ ] Vérifier le formatage des labels (statut, étape, type document).
- [ ] Vérifier le filtrage des tickets par phase.
- [ ] Vérifier la consultation d'un ticket (modal avec sous-tâches).
- [ ] Vérifier le workflow de validation/rejet des tickets en révision.
- [ ] Vérifier l'ajout de notes de suivi.
- [ ] Vérifier les conditions d'affichage des boutons d'autorisation.

### Tests d'intégration
- [ ] Vérifier l'affichage complet de la page pour un encadrant valide.
- [ ] Vérifier la navigation entre les 4 onglets (Informations, Documents, Tickets, Fiche de suivi).
- [ ] Vérifier l'affichage des documents avec différents statuts.
- [ ] Vérifier l'affichage des tickets avec différentes phases et le filtrage par sous-onglets.
- [ ] Vérifier la consultation d'un ticket (modal avec consigne, sous-tâches, livrable).
- [ ] Vérifier le workflow de validation d'un ticket en révision.
- [ ] Vérifier le workflow de rejet d'un ticket en révision (feedback obligatoire).
- [ ] Vérifier l'ajout d'une note de suivi.
- [ ] Vérifier les actions d'autorisation (pré-lecture, soutenance) avec modals de confirmation.
- [ ] Vérifier le bouton de retour vers le panel.

### Tests E2E
- [ ] Connexion en tant qu'encadrant → Accès au panel → Clic sur "Voir le détail" → Affichage de la page.
- [ ] Navigation entre les onglets (Informations, Documents, Tickets).
- [ ] Clic sur "Voir" un document → Vérification de l'action (à implémenter).
- [ ] Clic sur "Télécharger" un document → Vérification du téléchargement (à implémenter).
- [ ] Clic sur "Retour au panel" → Retour au panel d'encadrement.
- [ ] Connexion en tant que non-encadrant → Tentative d'accès → Redirection/Blocage.

## Notes/TO-DOs

### À implémenter
- [ ] Remplacer les `console.log` par des appels API réels pour les actions "Voir" et "Télécharger" des documents.
- [ ] Implémenter la visualisation des documents (ouvrir dans un viewer PDF, etc.).
- [ ] Implémenter le téléchargement des documents.
- [ ] Implémenter la visualisation et téléchargement des livrables dans les tickets.
- [ ] Implémenter les appels API pour la validation/rejet des tickets.
- [ ] Implémenter les appels API pour les notes de suivi.
- [ ] Implémenter les appels API pour les autorisations (pré-lecture, soutenance).
- [ ] Ajouter la pagination pour les listes longues (documents, tickets, notes).
- [ ] Ajouter le filtrage et la recherche dans les listes (documents, tickets).

### Améliorations futures
- [ ] Ajouter un historique des modifications du dossier.
- [ ] Ajouter un graphique de progression dans le temps.
- [ ] Permettre à l'encadrant de commenter directement sur les documents.
- [ ] Ajouter un système de notifications pour les nouveaux documents déposés.
- [ ] Implémenter un système de versioning pour les documents.
- [ ] Ajouter la possibilité de comparer différentes versions d'un document.

---

**Fichiers concernés** :
- `frontend/src/pages/professeur/DossierEtudiantDetail.tsx`
- `frontend/src/components/panel-encadrant/DossierEtudiantList.tsx`
- `frontend/src/components/panel-encadrant/DossierEtudiantCard.tsx`
- `frontend/src/models/dossier/DossierMemoire.ts`
- `frontend/src/models/dossier/Document.ts`
- `frontend/src/models/dossier/Ticket.ts`
- `frontend/src/models/acteurs/Candidat.ts`
- `frontend/src/App.tsx` (route)

**Modifications récentes** :
- **2025-01-XX** : Création initiale de la page de détail du dossier étudiant pour l'encadrant.
- **2025-01-XX** : Ajout des vérifications de permissions (encadrant, propriétaire).
- **2025-01-XX** : Implémentation des 4 onglets (Informations, Documents, Tickets, Fiche de suivi).
- **2025-01-XX** : Ajout des données mock pour les documents et tickets.
- **2025-01-XX** : Implémentation du calcul automatique de la progression basé sur les tickets.
- **2025-01-XX** : Mise à jour des statuts de tickets (A_FAIRE, EN_COURS, EN_REVISION, TERMINE).
- **2025-01-XX** : Ajout du filtrage des tickets par phase avec sous-onglets.
- **2025-01-XX** : Implémentation de la consultation détaillée des tickets (modal avec consigne, sous-tâches, livrable).
- **2025-01-XX** : Implémentation du workflow de validation/rejet des tickets en révision.
- **2025-01-XX** : Ajout de l'onglet Fiche de suivi avec gestion des notes de suivi.
- **2025-01-XX** : Ajout des actions d'autorisation (pré-lecture, soutenance) avec modals de confirmation.

**Date de mise à jour** : 2025-01-XX

