# Fonctionnalité : Gestion des Sujets Professeur

## Titre
Proposition et suivi des sujets de mémoire par les professeurs

## But
Permettre aux professeurs de :
1. Proposer de nouveaux sujets de mémoire
2. Gérer le cycle de vie des sujets (Brouillon, Soumis, Approuvé, Rejeté)
3. Suivre les étudiants affectés à leurs sujets
4. Consulter les documents déposés par les étudiants (mémoires, rapports)

## Prérequis
- L'utilisateur doit être authentifié avec le rôle `professeur`
- Le modèle `Sujet` doit être disponible

## Préconditions
- Le professeur est connecté à l'application
- Le professeur accède à la page via le menu "Mes Sujets"

## Postconditions
### Succès
- Le professeur visualise la liste de ses sujets
- Le professeur peut créer, modifier ou supprimer (si brouillon) un sujet
- Le professeur peut voir les détails d'un sujet et les étudiants associés

### Échec
- Message d'erreur si les données ne chargent pas

## Scénario nominal

### 1. Consultation des sujets
1. Le professeur accède à la page "Mes Sujets"
2. Le système affiche la liste des sujets créés par le professeur
3. Chaque carte de sujet affiche :
   - Titre, Description
   - Statut (Badge)
   - Nombre d'étudiants (Actuel / Max)
   - Filières concernées

### 2. Création d'un sujet
1. Le professeur clique sur "Nouveau sujet"
2. Une modale s'ouvre avec un formulaire
3. Le professeur renseigne :
   - Titre, Description
   - Objectifs, Prérequis
   - Filières cibles
   - Nombre max d'étudiants
   - Mots-clés
4. Le professeur enregistre en "Brouillon" ou "Soumet" directement

### 3. Suivi des étudiants
1. Le professeur clique sur l'icône "Détails" d'un sujet
2. La modale de détails s'ouvre
3. Une section "Étudiants affectés" liste les étudiants travaillant sur ce sujet
4. Le professeur peut télécharger les documents déposés par les étudiants (si disponibles)

## Scénarios alternatifs / Erreurs

### A1 : Modification interdite
- **Condition** : Le sujet est déjà approuvé ou a des étudiants affectés
- **Résultat** : L'action de modification est restreinte ou désactivée pour certains champs critiques

### A2 : Suppression
- **Condition** : Le sujet est en brouillon
- **Résultat** : Le professeur peut supprimer le sujet définitivement

## Exigences fonctionnelles

### RF1 : Cycle de vie
- Un sujet passe par les états : Brouillon -> Soumis -> (Approuvé/Rejeté par Admin)

### RF2 : Contraintes métier
- Un sujet est toujours de type "Mémoire" et niveau "Licence 3" (pour l'instant)
- Le nombre d'étudiants ne peut pas dépasser le max défini

### RF3 : Recherche et Filtres
- Filtrage par statut, année académique, filière

## Exigences non-fonctionnelles

### NFR1 : Ergonomie
- Formulaire clair avec validation
- Feedback visuel des statuts

### NFR2 : Performance
- Chargement rapide de la liste

## Flow (Steps)

```
1. Accès "Mes Sujets"
2. Affichage Liste
3. Actions :
   3.1. Créer Sujet (Modal)
   3.2. Éditer Sujet (Si autorisé)
   3.3. Voir Détails & Étudiants
```

## Use Case

**Actor** : Professeur

**Trigger** : Le professeur souhaite proposer un sujet pour l'année académique

**Preconditions** : Période de soumission ouverte (optionnel)

**Main Flow** :
1. Le professeur crée un sujet
2. Il le soumet pour validation
3. Une fois validé, les étudiants peuvent le choisir
4. Le professeur suit l'avancement des étudiants sur ce sujet

**Postconditions** :
- Le sujet est visible dans le catalogue (après validation)

## Données (Modèles utilisés)

### Sujet
```typescript
interface Sujet {
  id: number;
  titre: string;
  description: string;
  statut: 'brouillon' | 'soumis' | 'rejete';
  nombreMaxEtudiants: number;
  nombreEtudiantsActuels: number;
  filieres: string[];
  etudiants?: EtudiantSujet[];
  // ... autres champs
}
```

## Impact API (Endpoints)

### Endpoints requis
- `GET /api/professeurs/{id}/sujets` - Liste des sujets du prof
- `POST /api/sujets` - Créer un sujet
- `PUT /api/sujets/{id}` - Modifier un sujet
- `DELETE /api/sujets/{id}` - Supprimer un sujet

## Tests recommandés

### Tests unitaires
- [ ] Validation du formulaire (champs obligatoires)
- [ ] Logique d'affichage des statuts

### Tests E2E
- [ ] Création d'un sujet -> Vérification dans la liste
- [ ] Modification d'un brouillon

## Notes / TO-DOs

### Implémentation actuelle
- ✅ Page complète avec liste et modales (Création/Détails)
- ✅ Gestion des étudiants affectés et téléchargement de documents
- ✅ Données mockées

### À faire
- [ ] Connecter à l'API
- [ ] Gérer la validation par le chef de département (côté admin/chef)

---

**Fichiers concernés** :
- `frontend/src/pages/professeur/Sujets.tsx`

**Date de création** : 2025-11-22
**Version** : 1.0
