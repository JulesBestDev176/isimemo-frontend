# Fonctionnalité : Gestion des Dossiers Étudiant

## Titre
Liste et suivi des dossiers de mémoire pour les étudiants

## But
Permettre aux étudiants de :
1. Consulter la liste de leurs dossiers de mémoire (en cours et terminés)
2. Suivre l'état d'avancement et l'étape actuelle de chaque dossier
3. Accéder aux détails d'un dossier spécifique
4. Rechercher un dossier parmi l'historique

## Prérequis
- L'utilisateur doit être authentifié avec le rôle `etudiant` ou `candidat`
- Le modèle `DossierMemoire` doit être disponible

## Préconditions
- L'étudiant est connecté à l'application
- L'étudiant accède à la page via le menu "Mes Dossiers"

## Postconditions
### Succès
- L'étudiant visualise ses dossiers séparés par statut (En cours / Terminés)
- L'étudiant peut filtrer la liste par recherche textuelle
- L'étudiant peut cliquer sur un dossier pour voir les détails

### Échec
- Message d'erreur si les données ne chargent pas

## Scénario nominal

### 1. Consultation de la liste
1. L'étudiant accède à la page "Mes Dossiers"
2. Le système affiche deux sections : "Dossiers en cours" et "Dossiers terminés"
3. Chaque carte de dossier affiche :
   - Titre et description (tronquée)
   - Statut (Badge coloré)
   - Étape actuelle
   - Année académique
   - Date de création

### 2. Recherche
1. L'étudiant saisit un mot-clé dans la barre de recherche
2. La liste se filtre en temps réel sur le titre, la description ou l'année

### 3. Accès au détail
1. L'étudiant clique sur une carte de dossier
2. Le système navigue vers la vue détaillée du dossier (via callback `onDossierClick`)

## Scénarios alternatifs / Erreurs

### A1 : Aucun dossier
- **Condition** : L'étudiant n'a aucun dossier
- **Résultat** : Affichage d'un message "Aucun dossier" avec bouton "Créer un nouveau dossier" (si candidat)

### A2 : Recherche infructueuse
- **Condition** : Aucun dossier ne correspond à la recherche
- **Résultat** : Message "Aucun dossier trouvé" invitant à modifier la recherche

## Exigences fonctionnelles

### RF1 : Séparation par statut
- Les dossiers "En cours" ou "En création" doivent être mis en avant
- Les dossiers "Validé", "Déposé", "Soutenu" sont classés dans "Terminés"

### RF2 : Indication visuelle
- Utilisation de badges de couleur pour les statuts (En cours = Default, En attente = Secondary, Déposé = Outline)

### RF3 : Recherche
- Filtrage côté client sur les champs principaux

## Exigences non-fonctionnelles

### NFR1 : Ergonomie
- Cartes cliquables avec effet de survol (ombre + bordure)
- Feedback immédiat lors de la recherche

### NFR2 : Responsive
- Grille adaptative (1 col mobile -> 3 cols desktop)

## Flow (Steps)

```
1. Accès page "Mes Dossiers"
2. Chargement des dossiers
3. Affichage Liste (En cours / Terminés)
4. Actions :
   4.1. Rechercher
   4.2. Clic sur dossier -> Détail
   4.3. Créer dossier (si vide et candidat)
```

## Use Case

**Actor** : Étudiant / Candidat

**Trigger** : L'étudiant souhaite vérifier l'état de son mémoire ou accéder à son contenu

**Preconditions** : Authentifié

**Main Flow** :
1. L'étudiant consulte la liste
2. Il identifie son dossier actif
3. Il clique pour accéder au détail et effectuer des actions (dépôt, modification)

**Postconditions** :
- L'étudiant est redirigé vers le détail du dossier

## Données (Modèles utilisés)

### DossierMemoire
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
```

## Impact API (Endpoints)

### Endpoints requis
- `GET /api/etudiants/{id}/dossiers` - Liste des dossiers de l'étudiant

## Tests recommandés

### Tests unitaires
- [ ] Filtrage correct des dossiers (En cours vs Terminés)
- [ ] Recherche textuelle insensible à la casse

### Tests E2E
- [ ] Affichage de la liste avec des données mockées
- [ ] Interaction avec la barre de recherche
- [ ] Navigation au clic

## Notes / TO-DOs

### Règles métier importantes
- **Un candidat ne peut avoir qu'un seul dossier en cours** : Un candidat peut avoir un seul dossier avec un statut "En cours" ou "En création" à la fois. Les autres dossiers doivent être terminés (statuts "Validé", "Déposé", "Soutenu" ou étape "Terminé").
- **Dossiers terminés** : Les dossiers terminés ne sont pas en attente mais complètement terminés. Ils sont archivés et consultables en lecture seule pour consultation de l'historique.
- **Candidat connecté** : Le candidat connecté (email: `candidat@isimemo.edu.sn`) a un dossier en création (ID 0) et des dossiers terminés (IDs 1, 2) pour consultation de l'historique.

### Implémentation actuelle
- ✅ Composant de liste complet
- ✅ Filtrage et recherche implémentés
- ✅ UI avec composants Shadcn/UI (Card, Badge, Input)

### À faire
- [ ] Implémenter la création de dossier (bouton actif)
- [ ] Ajouter la pagination si le nombre de dossiers devient important (peu probable pour un étudiant)

---

**Fichiers concernés** :
- `frontend/src/pages/etudiant/dossiers/DossiersList.tsx`

**Date de création** : 2025-11-22
**Version** : 1.0
