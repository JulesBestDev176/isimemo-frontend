# Fonctionnalité : Landing Page (ISIMemoHub)

## Titre
Page d'accueil et vitrine de la plateforme ISIMemo Hub

## But
Présenter les fonctionnalités de la plateforme, orienter les utilisateurs vers les sections pertinentes (soumission, consultation, outils IA) et servir de point d'entrée principal.

## Prérequis
- Aucun (page publique)

## Préconditions
- L'utilisateur accède à la racine du site `/`

## Postconditions
### Succès
- L'utilisateur comprend la proposition de valeur
- L'utilisateur peut naviguer vers les différentes sections via les onglets ou le menu
- L'utilisateur peut se connecter ou s'inscrire

## Scénario nominal

### 1. Arrivée sur la page
1. L'utilisateur arrive sur la page d'accueil
2. Le système affiche le Hero avec le titre et la description
3. Le système affiche la barre de navigation avec les onglets thématiques

### 2. Navigation par onglets
1. L'utilisateur clique sur un onglet (ex: "Soumission", "Consultation")
2. Le contenu principal se met à jour dynamiquement sans rechargement de page
3. L'URL hash est mise à jour (ex: `#soumission`)

### 3. Découverte des fonctionnalités
- **Accueil** : Présentation générale, statistiques clés, grille des fonctionnalités
- **Soumission** : Explication du processus de dépôt, types de documents, validation IA
- **Consultation** : Présentation des outils de recherche sémantique et filtres
- **Analyse IA** : Détails sur les algorithmes de recommandation et d'analyse
- **Détection Plagiat** : Fonctionnement du système anti-plagiat
- **Assistance** : Informations sur le support et chatbot

## Scénarios alternatifs / Erreurs

### A1 : Accès direct par URL
- **Condition** : L'utilisateur accède via un lien avec ancre (ex: `/isi-memo-hub#analyse-ia`)
- **Résultat** : La page se charge et active directement l'onglet correspondant

## Exigences fonctionnelles

### RF1 : Navigation fluide
- Changement de section instantané (Single Page Application feel)
- Mise à jour de l'URL pour permettre le partage de liens directs

### RF2 : Contenu informatif
- Chaque section doit détailler clairement les processus et avantages

### RF3 : Responsive
- La barre d'onglets doit être défilable sur mobile
- La mise en page (Grilles) doit s'adapter (1 col mobile -> 3 cols desktop)

## Exigences non-fonctionnelles

### NFR1 : Design attractif
- Utilisation d'animations (Framer Motion) pour l'apparition des éléments
- Charte graphique cohérente (couleurs, icônes)

### NFR2 : Performance
- Chargement rapide des assets
- Animations fluides (60fps)

## Flow (Steps)

```
1. Accès page d'accueil
2. Affichage Hero
3. Sélection Onglet
   3.1. Mise à jour état actif
   3.2. Rendu conditionnel de la section
   3.3. Animation d'entrée
```

## Use Case

**Actor** : Visiteur (Public, Étudiant, Professeur)

**Trigger** : Découverte de la plateforme ou recherche d'information spécifique

**Preconditions** : Aucune

**Main Flow** :
1. Le visiteur arrive sur le site
2. Il explore les différentes sections pour comprendre le fonctionnement
3. Il décide de s'inscrire ou de consulter les mémoires

**Postconditions** :
- Le visiteur est informé et orienté

## Données (Modèles utilisés)
Aucun modèle de données complexe, contenu statique principalement.

## Impact API (Endpoints)
Aucun appel API requis pour cette page (contenu statique).

## Tests recommandés

### Tests E2E
- [ ] Navigation entre tous les onglets
- [ ] Vérification du chargement direct via URL avec hash
- [ ] Vérification de la responsivité de la barre d'onglets

## Notes / TO-DOs

### Implémentation actuelle
- ✅ Structure complète avec 6 sections
- ✅ Animations Framer Motion
- ✅ Navigation par hash

### À faire
- [ ] Ajouter des liens réels vers les pages de connexion/inscription
- [ ] Intégrer un chatbot réel dans la section Assistance
- [ ] Ajouter des témoignages dynamiques

---

**Fichiers concernés** :
- `frontend/src/pages/public/ISIMemoHub.tsx`

**Date de création** : 2025-11-22
**Version** : 1.0
