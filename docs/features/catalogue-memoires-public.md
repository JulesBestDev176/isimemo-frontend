# Fonctionnalité : Catalogue des Mémoires (Public)

## Titre
Catalogue public de consultation des mémoires académiques

## But
Permettre à tout utilisateur (public, étudiants, professeurs) de :
1. Rechercher et consulter les mémoires soutenus
2. Filtrer les mémoires par critères (département, année, mention, thématique)
3. Visualiser les détails d'un mémoire spécifique

## Prérequis
- Aucun (page publique)
- Accès internet pour charger les ressources

## Préconditions
- L'utilisateur accède à l'application via l'URL publique `/memoires`

## Postconditions
### Succès
- L'utilisateur peut voir la liste des mémoires
- L'utilisateur peut filtrer les résultats
- L'utilisateur peut accéder à la vue détaillée d'un mémoire

### Échec
- Message d'erreur si les données ne chargent pas

## Scénario nominal

### 1. Consultation du catalogue
1. L'utilisateur accède à la page "Mémoires"
2. Le système affiche une section "Hero" avec barre de recherche
3. Le système affiche la liste des mémoires paginée (5 par page)
4. Le système affiche les filtres sur la gauche (desktop) ou au-dessus (mobile)

### 2. Recherche et Filtrage
1. L'utilisateur saisit des mots-clés dans la barre de recherche
2. L'utilisateur sélectionne des filtres (Département, Année, Mention, Thématique)
3. La liste des mémoires se met à jour automatiquement
4. Le nombre de résultats est affiché

### 3. Consultation détaillée
1. L'utilisateur clique sur une carte de mémoire ou sur "Voir détails"
2. Le système affiche la vue détaillée du mémoire (titre, auteur, résumé, superviseur, etc.)
3. L'utilisateur peut télécharger les documents associés (si disponibles)
4. L'utilisateur peut revenir à la liste via le bouton "Retour"

## Scénarios alternatifs / Erreurs

### A1 : Aucun résultat
- **Condition** : La recherche ou les filtres ne retournent aucun mémoire
- **Résultat** : Message "Aucun mémoire trouvé" invitant à élargir la recherche

### A2 : Pagination
- **Condition** : Plus de 5 mémoires correspondent aux critères
- **Résultat** : Affichage des contrôles de pagination en bas de liste

## Exigences fonctionnelles

### RF1 : Recherche textuelle
- Recherche insensible à la casse sur : Titre, Auteur, Description, Étiquettes

### RF2 : Filtres multiples
- Combinaison possible des filtres : Département AND Année AND Mention AND Thématique

### RF3 : Pagination
- Affichage limité à 5 éléments par page pour la performance et la lisibilité

### RF4 : Vue détaillée
- Affichage complet des métadonnées du mémoire et liens de téléchargement

## Exigences non-fonctionnelles

### NFR1 : Performance
- Filtrage instantané (côté client pour les petits volumes)
- Animations fluides lors des transitions (Framer Motion)

### NFR2 : Accessibilité
- Contraste suffisant
- Navigation clavier compatible

### NFR3 : Responsive
- Adaptation de la mise en page (Grille 1 colonne mobile -> 4 colonnes desktop pour filtres/contenu)

## Flow (Steps)

```
1. Accès page /memoires
2. Affichage Hero + Barre recherche
3. Affichage Liste + Filtres
4. Actions :
   4.1. Rechercher / Filtrer
   4.2. Changer de page
   4.3. Voir détails
```

## Use Case

**Actor** : Visiteur (Public, Étudiant, Professeur)

**Trigger** : L'utilisateur cherche des références bibliographiques ou des exemples de mémoires

**Preconditions** : Aucune

**Main Flow** :
1. Le visiteur arrive sur le catalogue
2. Il utilise les filtres pour affiner sa recherche
3. Il consulte les détails d'un mémoire pertinent

**Postconditions** :
- Le visiteur a trouvé l'information recherchée

## Données (Modèles utilisés)

### Memoire (Interface UI)
```typescript
interface Memoire {
  id: number;
  titre: string;
  auteur: string;
  annee: number;
  mention: string;
  departement: string;
  description: string;
  imageCouverture: string;
  etiquettes: string[];
  contact: {
    email: string;
    telephone: string;
    linkedin: string;
  };
  superviseur: string;
  contenuComplet: string;
  documents: { nom: string; lien: string }[];
}
```

## Impact API (Endpoints)

### Endpoints requis
- `GET /api/memoires` - Liste des mémoires publics (avec paramètres de filtre optionnels)
- `GET /api/memoires/{id}` - Détails d'un mémoire (si chargement lazy)

## Tests recommandés

### Tests unitaires
- [ ] Logique de filtrage (combinaison des critères)
- [ ] Pagination (calcul des index)

### Tests E2E
- [ ] Parcours : Recherche -> Clic résultat -> Retour liste
- [ ] Vérification de la persistance des filtres (optionnel)

## Notes / TO-DOs

### Implémentation actuelle
- ✅ Données mockées en dur dans le composant
- ✅ Filtrage côté client
- ✅ Animations Framer Motion

### À faire
- [ ] Connecter à l'API backend
- [ ] Implémenter le téléchargement réel des fichiers
- [ ] Ajouter le tri (Date, Pertinence)

---

**Fichiers concernés** :
- `frontend/src/pages/public/Memoires.tsx`
- `frontend/src/components/CarteMemoire.tsx`
- `frontend/src/components/AffichageMemoire.tsx`

**Date de création** : 2025-11-22
**Version** : 1.0
