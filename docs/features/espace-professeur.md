# Espace Professeur

## Vue d'ensemble

L'espace professeur est une page centralisée permettant aux professeurs de consulter toutes leurs activités liées aux mémoires : sujets proposés, étudiants encadrés, jurys, corrections validées, historique et statistiques.

## Acteurs

- **Professeur** : Utilisateur avec le type `professeur`

## Prérequis

- L'utilisateur doit être connecté
- L'utilisateur doit avoir le type `professeur`

## Fonctionnalités

### 1. Sujets proposés

Le professeur peut consulter :
- La liste de tous les sujets qu'il a proposés et qui ne sont pas désactivés
- **Note** : Le statut (brouillon, soumis, validé, rejeté) n'est pas affiché
- Le nombre d'étudiants assignés à chaque sujet
- Les dates de soumission et de validation
- Statistiques : total des sujets proposés

**Recherche** : Par titre, description ou année académique

### 2. Étudiants encadrés

Le professeur peut consulter :
- **Organisation par encadrement (année académique)** : Un professeur ne peut avoir qu'un seul encadrement actif
- **Navigation par année** : Affichage d'une seule année à la fois avec navigation vers les années précédentes
- **Tableau des étudiants** : Affichage en tableau avec colonnes :
  - Étudiant (nom, prénom)
  - Email
  - Dossier de mémoire
  - Statut du dossier
  - Nombre de documents
  - Actions (consulter)
- **Consultation complète du dossier** : Modal avec onglets pour :
  - **Informations** : Titre, description, statut, candidats, dates
  - **Documents** : Liste complète des documents avec possibilité de téléchargement
  - **Suivi** : Tickets de suivi d'encadrement avec phases et progression
  - **Procès-verbal** : PV de soutenance si disponible (note, mention, observations, appréciations)

**Recherche** : Par nom d'étudiant, email ou titre de dossier (filtre sur l'année affichée)

### 3. Sujets validés

Le professeur peut consulter :
- **Organisation par année académique** : Navigation par année avec affichage d'une seule année à la fois
- **Tableau des sujets validés** : Affichage en tableau avec colonnes :
  - Titre
  - Description
  - Date de validation
  - Dossier associé
  - Statut (Validé)
- **Pagination** : 10 sujets par page avec navigation
- **Recherche** : Par titre, description ou titre de dossier (filtre sur l'année affichée)

### 4. Jurys

Le professeur peut consulter :
- La liste de tous les jurys auxquels il a appartenu (avec mock data pour visualisation)
- Son rôle dans chaque jury (Président, Rapporteur, Examinateur, Encadrant)
- Les informations sur chaque soutenance (date, heure, statut)
- Les dossiers de mémoire présentés lors de chaque soutenance
- Les candidats associés à chaque dossier
- Possibilité de consulter les détails complets d'une soutenance dans une modal
- Statistiques : Total jurys, soutenances terminées, soutenances planifiées

**Recherche** : Par titre de dossier ou nom de candidat

### 5. Corrections validées

Le professeur peut consulter (visible pour tous les professeurs) :
- **Organisation par année académique** : Navigation par année avec affichage d'une seule année à la fois
- **Tableau des corrections validées** : Affichage en tableau avec colonnes :
  - Document
  - Dossier de mémoire
  - Candidat(s)
  - Date de validation
  - Statut (Validé)
- **Pagination** : 10 corrections par page avec navigation
- **Recherche** : Par titre de document, titre de dossier ou nom de candidat (filtre sur l'année affichée)

### 6. Historique

**Note** : L'onglet "Historique" a été remplacé par "Corrections validées" pour une meilleure organisation des données.

### 7. Statistiques

Le professeur peut consulter :
- **Total encadrements** : Nombre total d'encadrements
- **Encadrements actifs** : Nombre d'encadrements en cours (maximum 1, un professeur ne peut avoir qu'un seul encadrement actif)
- **Encadrements terminés** : Nombre d'encadrements terminés
- **Total étudiants** : Nombre total d'étudiants encadrés (unique)
- **Dossiers soutenus** : Nombre de dossiers qui ont été soutenus
- **Dossiers validés** : Nombre de dossiers validés
- **Taux de réussite** : Pourcentage de dossiers soutenus par rapport aux encadrements terminés
- **Répartition des encadrements** : Visualisation des encadrements actifs vs terminés

## Scénario nominal

1. Le professeur accède à l'espace professeur via le menu latéral
2. Il voit la page principale avec les onglets disponibles
3. Il peut naviguer entre les différents onglets pour consulter ses activités
4. Il peut utiliser la barre de recherche pour filtrer les résultats
5. Il peut consulter les détails d'un élément en cliquant sur les boutons appropriés

## Données utilisées

- `SujetPropose` : Sujets proposés par le professeur
- `SujetValide` : Sujets validés
- `DossierMemoire` : Dossiers de mémoire
- `Encadrement` : Relations d'encadrement
- `Soutenance` : Soutenances
- `MembreJury` : Membres des jurys
- `Document` : Documents (pour les corrections validées)
- `StatistiquesEncadrement` : Statistiques agrégées

## Modèles et services

- `ProfesseurEspace.service.ts` : Service contenant toutes les fonctions helper pour récupérer les données du professeur
- `EspaceProfesseur.tsx` : Page principale avec navigation par onglets
- Composants modulaires dans `tabs/` :
  - `SujetsProposesTab.tsx`
  - `EtudiantsEncadresTab.tsx`
  - `SujetsValidesTab.tsx`
  - `JurysTab.tsx`
  - `CorrectionsValideesTab.tsx`
  - `StatistiquesTab.tsx`

## Notes importantes

- **Pas de gestion de cours** : L'espace professeur ne gère pas l'attribution de cours, uniquement les activités liées aux mémoires
- **Consultation uniquement** : Toutes les fonctionnalités sont en lecture seule (consultation)
- **Un seul encadrement actif** : Un professeur ne peut avoir qu'un seul encadrement actif à la fois
- **Organisation par année** : Les données sont organisées par année académique avec navigation entre les années
- **Tableaux avec pagination** : Les listes importantes (sujets validés, corrections validées) utilisent des tableaux avec pagination
- **Consultation complète** : La consultation d'un dossier étudiant permet d'accéder à tous les détails (documents, tickets, PV)

## Routes

- `/professeur/espace` : Page principale de l'espace professeur

## Intégration backend

Les fonctions dans `ProfesseurEspace.service.ts` utilisent actuellement des données mockées. Pour l'intégration backend, il faudra :

1. Remplacer les appels aux mocks par des appels API
2. Créer les endpoints correspondants :
   - `GET /api/professeurs/:id/sujets-proposes`
   - `GET /api/professeurs/:id/sujets-valides`
   - `GET /api/professeurs/:id/etudiants-encadres`
   - `GET /api/professeurs/:id/jurys`
   - `GET /api/professeurs/:id/corrections-validees`
   - `GET /api/professeurs/:id/statistiques`
   - `GET /api/professeurs/:id/historique`

## Tests recommandés

1. Vérifier que seuls les professeurs peuvent accéder à la page
2. Vérifier que les données affichées correspondent au professeur connecté
3. Vérifier que la recherche fonctionne correctement dans chaque onglet
4. Vérifier que l'onglet "Corrections validées" n'est visible que pour les membres de commission
5. Vérifier que les statistiques sont calculées correctement
6. Vérifier que les modals de consultation s'affichent correctement

