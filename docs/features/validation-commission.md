# Validation par la Commission

## Vue d'ensemble

Cette fonctionnalité permet aux membres de la commission de validation de gérer deux types de validations :
1. **Validation des sujets de mémoire** : Valider ou rejeter les sujets soumis par les étudiants
2. **Validation des documents corrigés** : Valider ou rejeter les mémoires corrigés après soutenance

## Acteurs

- **Membre de la Commission** : Professeur avec le rôle `estCommission: true`

## Prérequis

- L'utilisateur doit être connecté
- L'utilisateur doit avoir le rôle de membre de la commission (`user.type === 'professeur' && user.estCommission === true`)
- L'année académique en cours ne doit pas être terminée (sauf si l'utilisateur est chef de département)

## Conditions et préconditions

### Pour la validation des sujets :
- Le sujet doit avoir le statut `'soumis'`
- Le sujet ne doit pas avoir de `dateApprobation` (pas encore validé)

### Pour la validation des documents :
- Le document doit avoir le statut `StatutDocument.EN_ATTENTE_VALIDATION`
- Le document doit être de type `TypeDocument.CHAPITRE` (mémoire)
- Le document doit être associé à un dossier de mémoire

## Scénario nominal

### Validation d'un sujet

1. Le membre de la commission accède à l'Espace Commission via le menu sidebar
2. Il sélectionne l'onglet "Validation des sujets"
3. La liste des sujets en attente s'affiche
4. Il peut rechercher un sujet par titre, description, professeur ou filière
5. Il clique sur "Valider" ou "Rejeter" pour un sujet
6. Une modal s'affiche avec les détails du sujet
7. Il peut ajouter un commentaire (obligatoire pour le rejet)
8. Il confirme l'action
9. Le sujet est validé ou rejeté selon l'action choisie
10. Si validé, le sujet reçoit une `dateApprobation`
11. Si rejeté, le statut passe à `'rejete'`

### Validation d'un document corrigé

1. Le membre de la commission accède à l'Espace Commission
2. Il sélectionne l'onglet "Validation des documents corrigés"
3. La liste des documents en attente s'affiche
4. Il peut rechercher un document par titre, dossier ou candidat
5. Il peut visualiser ou télécharger le document
6. Il clique sur "Valider" ou "Rejeter"
7. Une modal s'affiche avec les détails du document
8. Il peut ajouter un commentaire (obligatoire pour le rejet)
9. Il confirme l'action
10. Le document est validé ou rejeté selon l'action choisie
11. Si validé :
    - Le statut passe à `StatutDocument.VALIDE`
    - La ressource correspondante dans la bibliothèque numérique est activée (`estActif: true`)
12. Si rejeté :
    - Le statut passe à `StatutDocument.REJETE`
    - Le commentaire est enregistré

## Scénarios alternatifs

### Aucun sujet/document en attente
- Un message s'affiche indiquant qu'aucun élément n'est en attente de validation

### Rejet sans commentaire
- Le bouton de confirmation est désactivé jusqu'à ce qu'un commentaire soit saisi

### Accès non autorisé
- Un message d'erreur s'affiche indiquant que l'accès est restreint aux membres de la commission

## Exigences fonctionnelles

1. **Affichage des listes** :
   - Liste des sujets en attente avec leurs détails (titre, description, professeur, date de soumission, etc.)
   - Liste des documents en attente avec leurs détails (titre, dossier, candidats, dates, etc.)

2. **Recherche et filtrage** :
   - Recherche par texte dans les titres, descriptions, noms de professeurs, filières (pour les sujets)
   - Recherche par texte dans les titres, dossiers, noms de candidats (pour les documents)

3. **Actions de validation** :
   - Validation d'un sujet avec commentaire optionnel
   - Rejet d'un sujet avec commentaire obligatoire
   - Validation d'un document avec commentaire optionnel
   - Rejet d'un document avec commentaire obligatoire

4. **Visualisation** :
   - Consultation des détails d'un sujet
   - Visualisation et téléchargement d'un document

5. **Notifications** :
   - TODO: Notifier l'étudiant/professeur lors de la validation/rejet

## Exigences non-fonctionnelles

- **Performance** : Les listes doivent se charger rapidement même avec de nombreux éléments
- **Sécurité** : Seuls les membres de la commission peuvent accéder à ces pages
- **Accessibilité** : Les modals et boutons doivent être accessibles au clavier
- **Responsive** : L'interface doit être utilisable sur mobile et tablette

## Données utilisées

### Modèles

- `Sujet` (depuis `models/pipeline/SujetMemoire.ts`)
  - `id`, `titre`, `description`, `statut`, `dateSoumission`, `dateApprobation`, `professeurNom`, etc.

- `Document` (depuis `models/dossier/Document.ts`)
  - `idDocument`, `titre`, `typeDocument`, `statut`, `cheminFichier`, `dossierMemoire`, etc.

- `DossierMemoire` (depuis `models/dossier/DossierMemoire.ts`)
  - `idDossierMemoire`, `titre`, `candidats`, etc.

- `RessourceMediatheque` (depuis `models/ressource/RessourceMediatheque.ts`)
  - `idRessource`, `estActif`, `cheminFichier`, etc.

## Impact API

### Endpoints nécessaires (à implémenter)

1. **GET /api/commission/sujets/en-attente**
   - Retourne la liste des sujets en attente de validation

2. **POST /api/commission/sujets/:id/valider**
   - Valide un sujet
   - Body: `{ commentaire?: string }`

3. **POST /api/commission/sujets/:id/rejeter**
   - Rejette un sujet
   - Body: `{ commentaire: string }`

4. **GET /api/commission/documents/en-attente**
   - Retourne la liste des documents en attente de validation

5. **POST /api/commission/documents/:id/valider**
   - Valide un document
   - Body: `{ commentaire?: string }`

6. **POST /api/commission/documents/:id/rejeter**
   - Rejette un document
   - Body: `{ commentaire: string }`

## Tests recommandés

1. **Tests unitaires** :
   - Filtrage des sujets/documents en attente
   - Validation d'un sujet/document
   - Rejet d'un sujet/document avec commentaire

2. **Tests d'intégration** :
   - Navigation entre les onglets
   - Recherche et filtrage
   - Actions de validation/rejet

3. **Tests E2E** :
   - Parcours complet de validation d'un sujet
   - Parcours complet de validation d'un document
   - Gestion des erreurs et cas limites

## Notes et TODOs

- [ ] Implémenter les notifications pour les étudiants/professeurs lors de la validation/rejet
- [ ] Ajouter un historique des validations/rejets
- [ ] Implémenter la pagination pour les grandes listes
- [ ] Ajouter des statistiques (nombre de sujets/documents validés/rejetés)
- [ ] Implémenter les endpoints API backend
- [ ] Ajouter des tests unitaires et d'intégration

## Fichiers créés/modifiés

- `frontend/src/pages/commission/EspaceCommission.tsx` - Page principale avec onglets
- `frontend/src/pages/commission/ValidationSujets.tsx` - Page de validation des sujets
- `frontend/src/pages/commission/ValidationDocuments.tsx` - Page de validation des documents
- `frontend/src/components/admin/Sidebar.tsx` - Ajout du menu "Espace Commission"
- `frontend/src/App.tsx` - Ajout des routes pour la commission

