# Fonctionnalité : Gestion de la Pré-lecture pour Encadrant

## Titre
Gestion des mémoires assignés pour pré-lecture par les encadrants

## But
Permettre aux encadrants de :
1. Consulter les mémoires qui leur ont été assignés pour pré-lecture
2. Vérifier et consulter les documents de mémoire
3. Valider ou rejeter la pré-lecture avec feedback
4. Gérer le workflow de rejet avec notification à l'encadrant principal
5. Permettre à l'encadrant principal d'ajouter des tâches spécifiques après rejet

## Prérequis
- L'utilisateur doit être authentifié.
- L'utilisateur doit avoir le rôle `estEncadrant = true`.
- Des mémoires doivent avoir été assignés à l'encadrant pour pré-lecture.

## Conditions/Préconditions
- L'encadrant accède à cette fonctionnalité depuis le panel d'encadrement (`/professeur/encadrements/:id/panel`).
- L'encadrant peut être soit :
  - **Pré-lecteur** : Encadrant assigné pour effectuer la pré-lecture d'un mémoire
  - **Encadrant principal** : Encadrant qui encadre l'étudiant et qui voit les rejets de pré-lecture

## Postconditions
- Les mémoires validés passent à l'étape suivante (soutenance).
- Les mémoires rejetés sont notifiés à l'encadrant principal avec feedback et corrections.
- L'encadrant principal peut créer des tickets spécifiques pour les corrections demandées.
- Les actions sont tracées (logs pour l'instant, à remplacer par des appels API).

## Scénario nominal

### 1. Accès à l'onglet Pré-lecture
1. L'encadrant se connecte et accède au panel d'encadrement (`/professeur/encadrements/:id/panel`).
2. L'encadrant clique sur l'onglet "Pré-lecture".
3. Le système affiche la liste des mémoires assignés pour pré-lecture.
4. Un badge indique le nombre de mémoires en attente.

### 2. Consultation d'un mémoire
1. L'encadrant consulte la liste des mémoires avec :
   - Informations de l'étudiant (nom, prénom, email)
   - Titre du mémoire
   - Encadrant principal
   - Date d'assignation
   - Statut (En attente, En cours, Validé, Rejeté)
2. L'encadrant peut rechercher un mémoire par nom d'étudiant, encadrant principal ou titre.
3. L'encadrant clique sur "Consulter" pour voir les détails.

### 3. Détail d'un mémoire
1. Un modal s'ouvre avec :
   - **Informations du candidat** : Nom complet, email, matricule
   - **Informations du mémoire** : Titre, description, encadrant principal, date d'assignation
   - **Document du mémoire** : Fichier PDF avec boutons "Visualiser" et "Télécharger"
   - **Statut** : Badge coloré selon le statut
2. L'encadrant peut visualiser ou télécharger le document du mémoire.

### 4. Validation d'une pré-lecture
1. Si le mémoire est en attente ou en cours, l'encadrant peut cliquer sur "Valider".
2. Un modal s'ouvre pour ajouter un commentaire optionnel.
3. L'encadrant confirme la validation.
4. Le statut passe à "Validé" et le dossier est mis à jour (`prelectureEffectuee = true`).
5. Le mémoire peut maintenant passer à l'étape de soutenance.

### 5. Rejet d'une pré-lecture
1. Si le mémoire est en attente ou en cours, l'encadrant peut cliquer sur "Rejeter".
2. Un modal s'ouvre avec :
   - **Commentaire de rejet** (obligatoire) : Raisons du rejet
   - **Corrections à apporter** (optionnel) : Liste de corrections qui seront transmises à l'encadrant principal
3. L'encadrant peut ajouter plusieurs corrections.
4. L'encadrant confirme le rejet.
5. Le statut passe à "Rejeté" avec le feedback enregistré.
6. **Notification à l'encadrant principal** : Si l'encadrant connecté est l'encadrant principal, des tickets spécifiques sont automatiquement créés pour chaque correction.

### 6. Gestion des rejets par l'encadrant principal
1. L'encadrant principal voit les rejets de pré-lecture dans son panel.
2. Pour chaque rejet, l'encadrant principal peut :
   - Consulter le feedback de rejet
   - Voir les corrections demandées
   - **Créer des tickets spécifiques** pour l'étudiant concerné
3. Les tickets créés sont associés au dossier de l'étudiant et apparaissent dans l'onglet "Tickets" du détail du dossier.

## Scénarios alternatifs/erreurs

### Scénario 1 : Aucun mémoire assigné
- **Condition** : L'encadrant n'a aucun mémoire assigné pour pré-lecture.
- **Action** : Affichage d'un message "Aucun mémoire en pré-lecture" avec icône.

### Scénario 2 : Rejet sans commentaire
- **Condition** : Tentative de rejet sans fournir de commentaire.
- **Action** : Le bouton "Rejeter" est désactivé jusqu'à ce qu'un commentaire soit saisi.

### Scénario 3 : Consultation d'un mémoire déjà traité
- **Condition** : Consultation d'un mémoire déjà validé ou rejeté.
- **Action** : Les boutons "Valider" et "Rejeter" ne sont plus disponibles. Le feedback est affiché.

### Scénario 4 : Encadrant non pré-lecteur
- **Condition** : L'encadrant n'est pas assigné comme pré-lecteur pour un mémoire.
- **Action** : Le mémoire n'apparaît pas dans sa liste.

## Exigences fonctionnelles

### EF1 : Gestion des permissions
- Seuls les encadrants peuvent accéder à l'onglet Pré-lecture.
- Un encadrant ne voit que les mémoires qui lui ont été assignés pour pré-lecture.
- L'encadrant principal voit les rejets de pré-lecture pour ses étudiants.

### EF2 : Consultation des mémoires
- Liste des mémoires avec recherche par nom, email, titre.
- Affichage du statut avec badges colorés.
- Visualisation et téléchargement des documents.

### EF3 : Validation/Rejet
- Validation avec commentaire optionnel.
- Rejet avec commentaire obligatoire et corrections optionnelles.
- Mise à jour automatique du statut du dossier.

### EF4 : Workflow de rejet
- Notification automatique à l'encadrant principal lors d'un rejet.
- Création automatique de tickets spécifiques pour les corrections (si l'encadrant connecté est l'encadrant principal).
- Association des tickets au dossier de l'étudiant concerné.

### EF5 : Gestion des tickets spécifiques
- L'encadrant principal peut créer des tickets spécifiques pour un étudiant après un rejet.
- Les tickets sont associés au dossier et apparaissent dans l'onglet "Tickets" du détail du dossier.

## Exigences non-fonctionnelles

### ENF1 : Performance
- Utilisation de `useMemo` pour les calculs et filtrages.
- Chargement optimisé des documents (lazy loading).

### ENF2 : Accessibilité
- Labels appropriés pour tous les éléments interactifs.
- Contraste des couleurs respecté.
- Navigation au clavier fonctionnelle.

### ENF3 : Maintenabilité
- Code structuré avec séparation des responsabilités.
- Types TypeScript stricts.
- Composants réutilisables.

## Flow (Steps)

```
1. Accès à l'onglet Pré-lecture
   ├─ Vérification authentification
   ├─ Vérification rôle encadrant
   └─ Récupération des demandes de pré-lecture

2. Consultation de la liste
   ├─ Affichage des mémoires assignés
   ├─ Recherche et filtrage
   └─ Affichage du statut

3. Consultation d'un mémoire
   ├─ Ouverture du modal de détail
   ├─ Affichage des informations
   └─ Visualisation/téléchargement du document

4. Action (Validation/Rejet)
   ├─ Ouverture du modal de confirmation
   ├─ Saisie du commentaire (obligatoire pour rejet)
   ├─ Ajout de corrections (optionnel pour rejet)
   └─ Confirmation et mise à jour

5. Workflow de rejet
   ├─ Mise à jour du statut
   ├─ Notification à l'encadrant principal
   └─ Création automatique de tickets (si encadrant principal)
```

## Use Case

### Acteur
- **Encadrant** (professeur avec `estEncadrant = true`)
  - **Pré-lecteur** : Encadrant assigné pour pré-lecture
  - **Encadrant principal** : Encadrant qui encadre l'étudiant

### Trigger
- Accès à l'onglet "Pré-lecture" dans le panel d'encadrement.

### Préconditions
- Encadrant authentifié.
- Mémoires assignés pour pré-lecture (pour pré-lecteur).
- Rejets de pré-lecture disponibles (pour encadrant principal).

### Postconditions
- Mémoires validés ou rejetés avec feedback.
- Tickets spécifiques créés pour les corrections (si encadrant principal).
- Dossiers mis à jour avec les nouveaux statuts.

## Données (Modèles utilisés)

### DemandePrelecture
```typescript
interface DemandePrelecture {
  idDemandePrelecture: number;
  dossierMemoire: DossierMemoire;
  encadrantPrincipal?: Professeur;
  prelecteur?: Professeur;
  candidat?: Candidat;
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

enum StatutDemandePrelecture {
  EN_ATTENTE = 'EN_ATTENTE',
  EN_COURS = 'EN_COURS',
  VALIDE = 'VALIDE',
  REJETE = 'REJETE'
}
```

### Ticket (pour les corrections)
```typescript
interface Ticket {
  idTicket: number;
  titre: string;
  description: string;
  priorite: Priorite;
  statut: StatutTicket;
  phase: PhaseTicket;
  dossierMemoire?: DossierMemoire;
  encadrement?: Encadrement;
  // ...
}
```

## Impact API (Endpoints)

### Endpoints requis (à implémenter)

#### Pré-lecture
- `GET /api/encadrants/:id/demandes-prelecture` - Récupérer les demandes de pré-lecture pour un encadrant
- `GET /api/demandes-prelecture/:id` - Récupérer le détail d'une demande
- `POST /api/demandes-prelecture/:id/valider` - Valider une pré-lecture
- `POST /api/demandes-prelecture/:id/rejeter` - Rejeter une pré-lecture
- `GET /api/demandes-prelecture/:id/document` - Télécharger le document du mémoire

#### Tickets spécifiques
- `POST /api/encadrements/:id/dossiers/:dossierId/tickets` - Créer un ticket spécifique pour un dossier

## Tests recommandés

### Tests unitaires
- [ ] Vérifier que `PrelectureList` filtre correctement les demandes par pré-lecteur.
- [ ] Vérifier que `PrelectureDetail` valide correctement les champs obligatoires.
- [ ] Vérifier que `validerPrelecture` met à jour correctement le statut.
- [ ] Vérifier que `rejeterPrelecture` crée correctement le feedback.
- [ ] Vérifier que `createTicketForDossier` crée correctement les tickets.

### Tests d'intégration
- [ ] Vérifier l'affichage complet de la liste pour un pré-lecteur.
- [ ] Vérifier la consultation d'un mémoire.
- [ ] Vérifier la validation d'une pré-lecture.
- [ ] Vérifier le rejet d'une pré-lecture avec corrections.
- [ ] Vérifier la création automatique de tickets pour l'encadrant principal.

### Tests E2E
- [ ] Connexion en tant que pré-lecteur → Accès à l'onglet Pré-lecture → Consultation → Validation.
- [ ] Connexion en tant que pré-lecteur → Accès à l'onglet Pré-lecture → Consultation → Rejet avec corrections.
- [ ] Connexion en tant qu'encadrant principal → Voir les rejets → Création de tickets spécifiques.

## Notes/TO-DOs

### À implémenter
- [ ] Remplacer les `console.log` par des appels API réels.
- [ ] Implémenter le téléchargement réel des documents.
- [ ] Implémenter la visualisation des documents PDF dans le navigateur.
- [ ] Ajouter des notifications pour les nouvelles assignations de pré-lecture.
- [ ] Ajouter un système de rappels pour les pré-lectures en attente.

### Améliorations futures
- [ ] Ajouter un système de versioning pour les documents de mémoire.
- [ ] Permettre l'annotation directe sur les documents PDF.
- [ ] Ajouter un historique des actions de pré-lecture.
- [ ] Implémenter un système de délais pour les pré-lectures.

---

**Fichiers concernés** :
- `frontend/src/models/dossier/DemandePrelecture.ts`
- `frontend/src/components/panel-encadrant/PrelectureList.tsx`
- `frontend/src/components/panel-encadrant/PrelectureDetail.tsx`
- `frontend/src/pages/professeur/PanelEncadrant.tsx`
- `frontend/src/components/panel-encadrant/PanelTabs.tsx`
- `frontend/src/models/dossier/Ticket.ts` (fonction `createTicketForDossier`)

**Modifications récentes** :
- **2025-01-XX** : Création initiale de la fonctionnalité de gestion de pré-lecture.
- **2025-01-XX** : Ajout de l'onglet Pré-lecture dans le panel encadrant.
- **2025-01-XX** : Implémentation de la validation/rejet avec feedback.
- **2025-01-XX** : Implémentation du workflow de rejet avec création automatique de tickets.

**Date de mise à jour** : 2025-01-XX

