# Validation par la Commission

## Vue d'ensemble

Cette fonctionnalité permet aux membres de la commission de validation de gérer deux types de validations :
1. **Validation des sujets de mémoire** : Valider ou rejeter les sujets soumis par les étudiants
2. **Validation des documents corrigés** : Valider ou rejeter les mémoires corrigés après soutenance
3. **Phase publique** : Mettre des éléments en phase publique pour permettre la consultation et la collecte d'avis de la communauté

## Acteurs

- **Membre de la Commission** : Professeur avec le rôle `estCommission: true`
- **Chef de Département** : Peut lancer le partage aléatoire des sujets/corrections aux membres de commission
- **Assistant** : Peut également lancer le partage aléatoire des sujets/corrections aux membres de commission

## Prérequis

- L'utilisateur doit être connecté
- Pour valider : L'utilisateur doit avoir le rôle de membre de la commission (`user.type === 'professeur' && user.estCommission === true`)
- Pour lancer le partage : L'utilisateur doit être chef de département ou assistant
- L'année académique en cours ne doit pas être terminée (sauf si l'utilisateur est chef de département)
- Une période de validation doit être active (soit validation des sujets, soit validation des corrections, mais pas les deux simultanément)

## Conditions et préconditions

### Pour la validation des sujets :
- Le sujet doit avoir le statut `'soumis'`
- Le sujet ne doit pas avoir de `dateApprobation` (pas encore validé)

### Pour la validation des documents :
- Le document doit avoir le statut `StatutDocument.EN_ATTENTE_VALIDATION`
- Le document doit être de type `TypeDocument.CHAPITRE` (mémoire)
- Le document doit être associé à un dossier de mémoire

## Répartition aléatoire des éléments à valider

### Principe de la loterie

Les sujets et documents corrigés à valider sont répartis de manière aléatoire entre les membres de la commission de validation. Cette répartition est effectuée par le chef de département ou l'assistant.

**Exemple** :
- 50 sujets à valider
- 5 membres de commission
- Résultat : Chaque membre reçoit environ 10 sujets à valider

### Lancement du partage

1. Le chef de département ou l'assistant accède à la page de gestion des validations
2. Il sélectionne le type de validation (sujets ou corrections)
3. Il clique sur "Lancer le partage aléatoire"
4. Le système :
   - Récupère tous les éléments en attente de validation
   - Récupère tous les membres de commission actifs
   - Répartit aléatoirement les éléments entre les membres
   - Assigne chaque élément à un membre spécifique
5. Chaque membre de commission voit uniquement les éléments qui lui ont été assignés

**Note importante** : Les périodes de validation des sujets et des corrections sont distinctes et ne peuvent pas être actives simultanément. Le partage doit être lancé pour l'une ou l'autre période selon le moment.

## Scénario nominal

### Validation d'un sujet

1. Le membre de la commission accède à l'Espace Commission via le menu sidebar
2. Il sélectionne l'onglet "Validation des sujets" (visible uniquement si la période de validation des sujets est active)
3. Il peut naviguer entre les sous-onglets :
   - **En attente** : Dépôts de sujets en attente de validation
   - **Validés** : Dépôts de sujets qui ont été validés
   - **Rejetés** : Dépôts de sujets qui ont été rejetés
4. La liste des sujets selon le sous-onglet sélectionné s'affiche
5. Il peut rechercher un sujet par titre, description, candidat ou encadrant
6. Pour les sujets en attente, il peut :
   - Consulter les détails (voir les avis publics s'il y en a)
   - Valider le sujet
   - Rejeter le sujet
7. Pour les sujets validés ou rejetés, il peut uniquement consulter les détails
8. Une modal s'affiche avec les détails du sujet et les avis publics existants
9. Il peut ajouter un commentaire (obligatoire pour le rejet)
10. Il confirme l'action
11. Le sujet est validé ou rejeté selon l'action choisie
12. Si validé, le dossier passe à l'étape `EN_COURS_REDACTION` avec le statut `EN_COURS`
13. Si rejeté, le dossier retourne à l'étape `CHOIX_SUJET` avec le statut `EN_CREATION`

### Validation d'un document corrigé

1. Le membre de la commission accède à l'Espace Commission
2. Il sélectionne l'onglet "Validation des documents corrigés" (visible uniquement si la période de validation des corrections est active)
3. Il peut naviguer entre les sous-onglets :
   - **En attente** : Documents corrigés en attente de validation
   - **Validés** : Documents corrigés qui ont été validés
   - **Rejetés** : Documents corrigés qui ont été rejetés
4. La liste des documents selon le sous-onglet sélectionné s'affiche
5. Il peut rechercher un document par titre, dossier ou candidat
6. Pour les documents en attente, il peut :
   - Consulter les détails (voir les avis publics s'il y en a)
   - Visualiser ou télécharger le document
   - Valider le document
   - Rejeter le document
7. Pour les documents validés ou rejetés, il peut uniquement consulter les détails et visualiser/télécharger
8. Une modal s'affiche avec les détails du document et les avis publics existants
9. Il peut ajouter un commentaire (obligatoire pour le rejet)
10. Il confirme l'action
11. Le document est validé ou rejeté selon l'action choisie
12. Si validé :
    - Le statut passe à `StatutDocument.VALIDE`
    - La ressource correspondante dans la bibliothèque numérique est activée (`estActif: true`)
13. Si rejeté :
    - Le statut passe à `StatutDocument.REJETE`
    - Le commentaire est enregistré

### Mise en phase publique

1. Le membre de la commission consulte un dépôt de sujet ou un document corrigé
2. Dans la modal de consultation, il clique sur "Mettre en phase publique"
3. L'élément est mis en phase publique et devient visible dans l'onglet "Phase publique"
4. Tous les utilisateurs (professeurs, candidats) peuvent maintenant :
   - Consulter les détails de l'élément
   - Visualiser/télécharger le document (pour les documents corrigés)
   - Ajouter des avis publics avec leur point de vue
   - Voir tous les avis publics existants

**Note importante** : 
- Les validations de sujets et les validations de corrections se déroulent à des périodes différentes et ne peuvent pas être actives simultanément.
- Un élément ne peut pas être à la fois un sujet en phase publique et un document corrigé en phase publique simultanément.
- La phase publique est active pour l'un ou l'autre type selon la période en cours.
- Le système vérifie automatiquement la période active et n'affiche que les éléments correspondants.
- **L'onglet "Phase publique" n'est visible que si une période de validation est active. Si aucune période n'est active (période = AUCUNE), cet onglet est masqué.**

## Scénarios alternatifs

### Aucun sujet/document en attente
- Un message s'affiche indiquant qu'aucun élément n'est en attente de validation

### Rejet sans commentaire
- Le bouton de confirmation est désactivé jusqu'à ce qu'un commentaire soit saisi

### Accès non autorisé
- Un message d'erreur s'affiche indiquant que l'accès est restreint aux membres de la commission

### Aucun élément en phase publique
- Un message s'affiche indiquant qu'aucun élément n'est actuellement en phase publique

## Exigences fonctionnelles

1. **Affichage des listes** :
   - Liste des sujets organisée en sous-onglets : En attente, Validés, Rejetés
   - Liste des documents organisée en sous-onglets : En attente, Validés, Rejetés
   - Chaque liste affiche les détails pertinents (titre, description, candidats, encadrant, dates, etc.)
   - Badges colorés pour indiquer le statut (jaune pour en attente, vert pour validé, rouge pour rejeté)

2. **Recherche et filtrage** :
   - Recherche par texte dans les titres, descriptions, noms de professeurs, filières (pour les sujets)
   - Recherche par texte dans les titres, dossiers, noms de candidats (pour les documents)

3. **Actions de validation** :
   - Validation d'un sujet avec commentaire optionnel
   - Rejet d'un sujet avec commentaire obligatoire
   - Validation d'un document avec commentaire optionnel
   - Rejet d'un document avec commentaire obligatoire

4. **Visualisation** :
   - Consultation des détails d'un sujet avec navigation entre les sous-onglets (En attente, Validés, Rejetés)
   - Consultation des détails d'un document avec navigation entre les sous-onglets (En attente, Validés, Rejetés)
   - Visualisation et téléchargement d'un document
   - Affichage des avis publics dans les modals de consultation (pour voir les points de vue des autres membres)
   - Badges colorés pour identifier rapidement le statut (jaune = en attente, vert = validé, rouge = rejeté)

5. **Phase publique** :
   - Mettre un dépôt de sujet en phase publique depuis la modal de consultation
   - Mettre un document corrigé en phase publique depuis la modal de consultation
   - Consulter les éléments en phase publique dans l'onglet dédié (visible uniquement si une période est active)
   - Ajouter des avis publics sur les éléments en phase publique
   - Visualiser tous les avis publics pour un élément donné
   - **L'onglet "Phase publique" est masqué si aucune période n'est active (période = AUCUNE)**

6. **Notifications** :
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

- `DossierMemoire` (champ `estPhasePublique`)
  - `estPhasePublique?: boolean` - Indique si le dépôt de sujet est en phase publique

- `Document` (champ `estPhasePublique`)
  - `estPhasePublique?: boolean` - Indique si le document corrigé est en phase publique

- `AvisPublic` (depuis `models/commission/AvisPublic.ts`)
  - `idAvis`, `typeElement`, `idElement`, `auteur`, `contenu`, `dateCreation`, etc.

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

7. **POST /api/commission/depots/:id/mettre-phase-publique**
   - Met un dépôt de sujet en phase publique
   - Body: `{}`

8. **POST /api/commission/documents/:id/mettre-phase-publique**
   - Met un document corrigé en phase publique
   - Body: `{}`

9. **GET /api/commission/phase-publique/elements**
   - Retourne tous les éléments en phase publique (dépôts de sujets et documents corrigés)

10. **GET /api/commission/phase-publique/avis/:type/:idElement**
    - Retourne tous les avis publics pour un élément donné
    - Paramètres: `type` ('depot_sujet' ou 'document_corrige'), `idElement` (ID de l'élément)

11. **POST /api/commission/phase-publique/avis**
    - Ajoute un nouvel avis public
    - Body: `{ typeElement: 'depot_sujet' | 'document_corrige', idElement: number, contenu: string }`

12. **POST /api/departement/commission/lancer-partage**
    - Lance le partage aléatoire des éléments à valider
    - Body: `{ typeValidation: 'sujets' | 'corrections', anneeAcademique: string }`
    - Response: `{ repartition: Array<{ idMembreCommission: number, idElements: number[] }> }`

13. **GET /api/commission/elements-assignes**
    - Retourne les éléments assignés au membre de commission connecté
    - Response: `{ depots?: DossierMemoire[], documents?: Document[] }`

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

- `frontend/src/pages/commission/EspaceCommission.tsx` - Page principale avec onglets (incluant l'onglet "Phase publique")
- `frontend/src/pages/commission/ValidationSujets.tsx` - Page de validation des sujets
- `frontend/src/pages/commission/ValidationDocuments.tsx` - Page de validation des documents
- `frontend/src/components/admin/Sidebar.tsx` - Ajout du menu "Espace Commission"
- `frontend/src/App.tsx` - Ajout des routes pour la commission
- `frontend/src/models/commission/AvisPublic.ts` - Modèle pour les avis publics
- `frontend/src/models/dossier/DossierMemoire.ts` - Ajout du champ `estPhasePublique`
- `frontend/src/models/dossier/Document.ts` - Ajout du champ `estPhasePublique`
- `frontend/src/models/commission/PeriodeValidation.ts` - Gestion des périodes de validation (empêche les deux phases simultanées)

## Exemples de données mock

### Dépôts de sujets en phase publique
- **Dossier 200** : "Intelligence Artificielle pour la Détection de Fraudes" (estPhasePublique: true)
- **Dossier 201** : "Application Mobile de Gestion de Bibliothèque" (estPhasePublique: true)

### Documents corrigés en phase publique
- **Document 101** : "Mémoire - Version finale" associé au dossier 101 (estPhasePublique: true)

**Note** : Les exemples montrent des dépôts de sujets et des documents corrigés en phase publique, mais en pratique, ces deux types ne sont pas actifs simultanément car ils correspondent à des périodes de validation différentes.

