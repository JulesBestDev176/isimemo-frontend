# Fonctionnalité : Panel d'Encadrement pour Encadrant

## Titre
Panel de gestion d'encadrement pour les encadrants

## But
Permettre aux encadrants de gérer leur encadrement actif en leur donnant accès à :
- Une messagerie pour communiquer avec leurs étudiants
- La gestion de tâches communes pour tous les étudiants
- La consultation des dossiers étudiants et leur avancement
- La validation/rejet des livrables soumis par les étudiants

## Prérequis
- L'utilisateur doit être authentifié.
- L'utilisateur doit avoir le rôle `estEncadrant = true`.
- L'utilisateur doit être le propriétaire de l'encadrement (vérifié via `getEncadrementsByProfesseur`).
- L'encadrement doit exister et être accessible.

## Conditions/Préconditions
- Un encadrant ne peut avoir qu'**un seul encadrement actif** à la fois.
- L'encadrement doit être en statut `ACTIF`.
- L'encadrement doit avoir au moins un dossier de mémoire associé avec des candidats.

## Postconditions
- Les messages envoyés sont enregistrés et visibles par l'étudiant.
- Les tâches communes créées sont visibles par tous les étudiants de l'encadrement.
- Les livrables validés/rejetés sont mis à jour avec le feedback correspondant.
- Les actions sont tracées (logs pour l'instant, à remplacer par des appels API).

## Scénario nominal

### 1. Accès au Panel
1. L'encadrant se connecte et accède à la page `/professeur/encadrements/:id/panel`.
2. Le système vérifie que l'utilisateur est un encadrant (`user?.estEncadrant`).
3. Le système vérifie que l'encadrement existe et appartient à l'encadrant.
4. Le panel s'affiche avec l'en-tête contenant le titre de l'encadrement et les étudiants associés.

### 2. Navigation par onglets
1. L'encadrant peut naviguer entre 3 onglets :
   - **Messages** : Discussion avec les étudiants
   - **Tâches communes** : Gestion des tâches partagées
   - **Dossiers étudiants** : Consultation des dossiers et avancement

### 3. Onglet Messages
1. L'encadrant consulte la liste des messages (affichage chronologique).
2. **Important** : Seuls les messages envoyés par l'encadrant sont affichés (l'étudiant ne peut pas envoyer de messages).
3. L'encadrant peut envoyer un nouveau message via le formulaire avec différents types :
   - **Message texte** : Message simple avec contenu textuel
   - **Rendez-vous en ligne** : Message avec date et heure pour un meeting en ligne
   - **Rendez-vous en présentiel** : Message avec date, heure et lieu pour une rencontre physique
   - **Document** : Message avec upload de fichier (le fichier remplace le chemin manuel)
4. Pour les messages de type document, l'encadrant doit :
   - Sélectionner un fichier (drag & drop ou sélection)
   - Le nom et la taille sont automatiquement extraits du fichier
   - Un aperçu temporaire est généré pour visualisation
5. Raccourci clavier : `Ctrl+Entrée` pour envoyer rapidement.

### 4. Onglet Tâches communes
1. L'encadrant consulte la liste des tâches communes (visibles par tous les étudiants).
2. Chaque tâche affiche : titre, description, priorité, dates.
3. **Note** : Les barres de progression et les boutons valider/annuler ont été supprimés pour simplifier la gestion.
4. L'encadrant peut :
   - **Ajouter une tâche** : Ouvrir le modal, remplir les champs (titre*, description*, date d'échéance, priorité).
   - **Supprimer une tâche** : Supprimer définitivement une tâche.
   - **Désactiver/Réactiver une tâche** : Désactiver ou réactiver une tâche sans la supprimer.

### 5. Onglet Dossiers étudiants
1. L'encadrant consulte la liste des dossiers de tous les étudiants de l'encadrement.
2. La liste est affichée sous forme de tableau avec barre de recherche.
3. Chaque ligne affiche :
   - Informations de l'étudiant (nom, prénom, email)
   - Titre du mémoire
   - Statut et étape du dossier
   - Barre de progression
   - Bouton "Voir le détail"
4. L'encadrant peut :
   - Rechercher un dossier par nom d'étudiant ou titre du mémoire
   - Cliquer sur "Voir le détail" pour accéder au détail complet du dossier

## Scénarios alternatifs/erreurs

### Scénario 1 : Utilisateur non encadrant
- **Condition** : `user?.estEncadrant === false`
- **Action** : Affichage d'un message d'erreur "Accès restreint" avec bouton de retour.
- **Redirection** : Vers `/professeur/encadrements`.

### Scénario 2 : Encadrement introuvable
- **Condition** : `encadrement === null`
- **Action** : Affichage d'un message d'erreur "Encadrement introuvable".
- **Redirection** : Vers `/professeur/encadrements`.

### Scénario 3 : Encadrant non propriétaire
- **Condition** : L'encadrement n'appartient pas à l'encadrant connecté.
- **Action** : Affichage d'un message d'erreur "Accès non autorisé".
- **Redirection** : Vers `/professeur/encadrements`.

### Scénario 4 : Rejet de livrable sans feedback
- **Condition** : Tentative de rejet sans fournir de feedback.
- **Action** : Affichage d'une alerte "Veuillez fournir un feedback pour le rejet".
- **Résultat** : Le modal reste ouvert, l'action est annulée.

### Scénario 5 : Ajout de tâche avec champs vides
- **Condition** : Tentative d'ajout avec titre ou description vide.
- **Action** : Le bouton "Ajouter" est désactivé (disabled).
- **Résultat** : L'action est bloquée jusqu'à ce que les champs obligatoires soient remplis.

## Exigences fonctionnelles

### EF1 : Gestion des permissions
- Seuls les encadrants peuvent accéder au panel.
- Un encadrant ne peut accéder qu'à son propre encadrement actif.
- Les actions d'édition (ajout tâche, validation livrable) sont contrôlées par la prop `canEdit`.

### EF2 : Messagerie
- Affichage chronologique des messages.
- Distinction visuelle entre messages encadrant/étudiant.
- Compteur de messages non lus.
- Envoi de messages avec validation côté client.

### EF3 : Tâches communes
- Création de tâches visibles par tous les étudiants de l'encadrement.
- Gestion des priorités (Basse, Moyenne, Haute).
- Suivi de progression avec barre visuelle.
- Actions : Terminer / Renvoyer.

### EF4 : Dossiers étudiants
- Affichage de tous les dossiers des étudiants de l'encadrement.
- Visualisation de l'avancement (pourcentage).
- Accès au détail via navigation.

### EF5 : Dossiers étudiants
- Affichage en tableau avec recherche.
- Visualisation de l'avancement (pourcentage).
- Accès au détail via navigation.

## Exigences non-fonctionnelles

### ENF1 : Performance
- Utilisation de `useMemo` pour les données calculées.
- Composants scindés pour optimiser le re-rendering.
- Lazy loading des modals.

### ENF2 : Accessibilité
- Labels appropriés pour les champs de formulaire.
- Contraste des couleurs respecté.
- Navigation au clavier (Ctrl+Entrée pour envoyer).

### ENF3 : Maintenabilité
- Code scindé en composants réutilisables (< 300 lignes par fichier).
- Types TypeScript stricts.
- Séparation des responsabilités (affichage, logique, modals).

## Flow (Steps)

```
1. Accès au panel
   ├─ Vérification authentification
   ├─ Vérification rôle encadrant
   ├─ Vérification existence encadrement
   └─ Vérification propriétaire

2. Affichage du panel
   ├─ Chargement des données (messages, tâches, dossiers, livrables)
   ├─ Affichage de l'en-tête
   └─ Affichage des onglets

3. Interaction utilisateur
   ├─ Navigation entre onglets
   ├─ Envoi de messages
   ├─ Création de tâches
   ├─ Consultation de dossiers
   └─ Validation/rejet de livrables

4. Actions
   ├─ Logs console (à remplacer par API)
   └─ Mise à jour de l'interface
```

## Use Case

### Acteur
- **Encadrant** (professeur avec `estEncadrant = true`)

### Trigger
- Accès à la route `/professeur/encadrements/:id/panel` depuis la page de détail d'encadrement.

### Préconditions
- Encadrant authentifié.
- Encadrement actif existant.
- Encadrant propriétaire de l'encadrement.

### Postconditions
- Panel affiché avec toutes les fonctionnalités disponibles.
- Actions tracées et synchronisées (via API future).

## Données (Modèles utilisés)

### Encadrement
```typescript
interface Encadrement {
  idEncadrement: number;
  dateDebut: Date;
  dateFin?: Date;
  statut: StatutEncadrement;
  anneeAcademique: string;
  professeur?: Professeur;
  dossierMemoire?: DossierMemoire;
}
```

### Message
```typescript
interface Message {
  id: number;
  expediteur: 'encadrant' | 'etudiant';
  contenu: string;
  date: string;
  lu: boolean;
}
```

### TacheCommune
```typescript
interface TacheCommune {
  id: number;
  titre: string;
  description: string;
  dateCreation: string;
  dateEcheance?: string;
  priorite: 'Basse' | 'Moyenne' | 'Haute';
  statut: 'En cours' | 'Terminé' | 'En retard';
  progression: number;
}
```

### DossierEtudiant
```typescript
interface DossierEtudiant {
  id: number;
  etudiant: {
    nom: string;
    prenom: string;
    email: string;
  };
  dossierMemoire: {
    id: number;
    titre: string;
    statut: string;
    etape: string;
    progression: number;
  };
}
```

### LivrableEtudiant
```typescript
interface LivrableEtudiant {
  id: string;
  etudiant: {
    nom: string;
    prenom: string;
  };
  titre: string;
  nomFichier: string;
  dateSubmission: Date;
  statut: StatutLivrable;
  version: number;
  feedback?: string;
}
```

## Impact API (Endpoints)

### Endpoints requis (à implémenter)

#### Messages
- `GET /api/encadrements/:id/messages` - Récupérer les messages
- `POST /api/encadrements/:id/messages` - Envoyer un message
- `PUT /api/messages/:id/lu` - Marquer un message comme lu

#### Tâches communes
- `GET /api/encadrements/:id/taches-communes` - Récupérer les tâches communes
- `POST /api/encadrements/:id/taches-communes` - Créer une tâche commune
- `PUT /api/taches-communes/:id/terminer` - Terminer une tâche
- `PUT /api/taches-communes/:id/renvoyer` - Renvoyer une tâche

#### Dossiers étudiants
- `GET /api/encadrements/:id/dossiers-etudiants` - Récupérer les dossiers des étudiants
- `GET /api/dossiers/:id` - Récupérer le détail d'un dossier

## Tests recommandés

### Tests unitaires
- [ ] Vérifier que `PanelEncadrant` redirige les non-encadrants.
- [ ] Vérifier que `PanelEncadrant` vérifie la propriété de l'encadrement.
- [ ] Vérifier que `MessageList` envoie correctement les messages avec les différents types.
- [ ] Vérifier que `MessageList` n'affiche que les messages de l'encadrant.
- [ ] Vérifier que l'upload de fichiers fonctionne pour les messages document.
- [ ] Vérifier que `AddTacheModal` valide les champs obligatoires.
- [ ] Vérifier que `TacheCommuneList` permet la suppression et désactivation des tâches.

### Tests d'intégration
- [ ] Vérifier l'affichage complet du panel pour un encadrant valide.
- [ ] Vérifier la navigation entre les onglets.
- [ ] Vérifier l'envoi de messages.
- [ ] Vérifier la création de tâches communes.
- [ ] Vérifier la validation/rejet de livrables.

### Tests E2E
- [ ] Connexion en tant qu'encadrant → Accès au panel → Envoi de message texte.
- [ ] Connexion en tant qu'encadrant → Accès au panel → Envoi de message avec document (upload).
- [ ] Connexion en tant qu'encadrant → Accès au panel → Création de tâche.
- [ ] Connexion en tant qu'encadrant → Accès au panel → Suppression de tâche.
- [ ] Connexion en tant qu'encadrant → Accès au panel → Consultation d'un dossier étudiant.
- [ ] Connexion en tant que non-encadrant → Tentative d'accès → Redirection.

## Notes/TO-DOs

### À implémenter
- [ ] Remplacer les `console.log` par des appels API réels.
- [ ] Implémenter la synchronisation en temps réel des messages (WebSocket).
- [ ] Ajouter la pagination pour les listes longues.
- [ ] Implémenter le filtrage et la recherche dans les listes.
- [ ] Ajouter des notifications pour les nouvelles actions (messages).

### Améliorations futures
- [ ] Ajouter un système de notifications push.
- [ ] Ajouter un historique des actions (audit trail).
- [ ] Ajouter un calendrier intégré pour les échéances.
- [ ] Permettre l'édition des messages envoyés.

---

**Fichiers concernés** :
- `frontend/src/pages/professeur/PanelEncadrant.tsx`
- `frontend/src/components/panel-encadrant/` (tous les composants)
- `frontend/src/models/dossier/Encadrement.ts`
- `frontend/src/models/dossier/Livrable.ts`
- `frontend/src/models/dossier/Ticket.ts`

**Modifications récentes** :
- **2025-01-XX** : Création initiale du panel d'encadrement avec refactorisation en composants réutilisables.
- **2025-01-XX** : Ajout des vérifications de permissions (encadrant, propriétaire).
- **2025-01-XX** : Implémentation des 3 onglets (Messages, Tâches, Dossiers).
- **2025-01-XX** : Suppression de l'onglet Livrables (gestion via les tickets).
- **2025-01-XX** : Ajout des types de messages (texte, rendez-vous en ligne, rendez-vous en présentiel, document).
- **2025-01-XX** : Implémentation de l'upload de fichiers pour les messages document.
- **2025-01-XX** : Simplification des tâches communes (suppression progression, ajout suppression/désactivation).
- **2025-01-XX** : Affichage des dossiers étudiants en tableau avec recherche.

**Date de mise à jour** : 2025-01-XX

