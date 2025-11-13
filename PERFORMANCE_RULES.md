# Règles de Performance Frontend

Ce document définit les règles et bonnes pratiques à respecter pour optimiser les performances de l'application frontend.

## 📋 Table des matières

1. [Lazy Loading](#lazy-loading)
2. [Code Splitting](#code-splitting)
3. [Optimisation des Images](#optimisation-des-images)
4. [Memoization](#memoization)
5. [Bundle Size](#bundle-size)
6. [Rendering Performance](#rendering-performance)
7. [Network Optimization](#network-optimization)

---

## 🚀 Lazy Loading

### Règles

1. **Toutes les routes doivent être lazy loaded**
   - Utiliser `React.lazy()` pour charger les composants de pages
   - Utiliser `Suspense` avec un fallback approprié
   - Ne jamais importer directement les pages dans `App.tsx`

2. **Composants lourds**
   - Les composants volumineux (> 50KB) doivent être lazy loaded
   - Les composants avec beaucoup de dépendances doivent être lazy loaded

3. **Images**
   - Utiliser `loading="lazy"` pour les images en dehors du viewport
   - Utiliser des formats modernes (WebP, AVIF) avec fallback

### Exemple

```tsx
// ❌ MAUVAIS
import Dashboard from "./pages/dashboard/Dashboard";

// ✅ BON
const Dashboard = React.lazy(() => import("./pages/dashboard/Dashboard"));
```

---

## 📦 Code Splitting

### Règles

1. **Routes par fonctionnalité**
   - Créer des chunks séparés pour chaque module (departement, etude, admin)
   - Utiliser des imports dynamiques pour les dépendances lourdes

2. **Bibliothèques tierces**
   - Lazy load les bibliothèques volumineuses (charts, editors, etc.)
   - Utiliser des imports conditionnels

### Exemple

```tsx
// ✅ BON - Import conditionnel
const loadChartLibrary = () => {
  if (needsChart) {
    return import('recharts');
  }
  return Promise.resolve(null);
};
```

---

## 🖼️ Optimisation des Images

### Règles

1. **Formats**
   - Utiliser WebP avec fallback PNG/JPG
   - Utiliser des images responsive avec `srcset`
   - Compresser toutes les images avant l'upload

2. **Lazy Loading**
   - Toutes les images en dehors du viewport doivent avoir `loading="lazy"`
   - Utiliser des placeholders pour améliorer l'UX

3. **Tailles**
   - Ne jamais charger des images plus grandes que nécessaire
   - Utiliser des CDN pour les images statiques

---

## 🧠 Memoization

### Règles

1. **React.memo()**
   - Utiliser pour les composants qui re-render souvent avec les mêmes props
   - Ne pas utiliser pour les composants simples (< 10 lignes)

2. **useMemo()**
   - Utiliser pour les calculs coûteux
   - Utiliser pour les objets/arrays passés comme props

3. **useCallback()**
   - Utiliser pour les fonctions passées comme props
   - Utiliser pour les event handlers dans les listes

### Exemple

```tsx
// ✅ BON
const ExpensiveComponent = React.memo(({ data }) => {
  const processedData = useMemo(() => {
    return expensiveCalculation(data);
  }, [data]);
  
  return <div>{processedData}</div>;
});
```

---

## 📊 Bundle Size

### Règles

1. **Tree Shaking**
   - Utiliser des imports nommés au lieu d'imports par défaut
   - Éviter d'importer des bibliothèques entières

2. **Analyse du bundle**
   - Vérifier régulièrement la taille du bundle avec `npm run build`
   - Objectif : < 500KB pour le bundle initial (gzipped)

3. **Dépendances**
   - Éviter les dépendances inutiles
   - Utiliser des alternatives légères quand possible

### Exemple

```tsx
// ❌ MAUVAIS
import _ from 'lodash';
const result = _.debounce(fn, 300);

// ✅ BON
import debounce from 'lodash/debounce';
const result = debounce(fn, 300);
```

---

## ⚡ Rendering Performance

### Règles

1. **Éviter les re-renders inutiles**
   - Utiliser `React.memo()` pour les composants enfants
   - Éviter de créer des objets/arrays dans le render

2. **Virtualisation**
   - Utiliser `react-window` ou `react-virtualized` pour les longues listes (> 100 items)

3. **Debounce/Throttle**
   - Utiliser pour les event handlers fréquents (scroll, resize, input)

4. **Conditional Rendering**
   - Utiliser des early returns
   - Éviter les ternaires complexes

### Exemple

```tsx
// ❌ MAUVAIS
<div>{isLoading ? <Spinner /> : data.map(...)}</div>

// ✅ BON
if (isLoading) return <Spinner />;
return <div>{data.map(...)}</div>;
```

---

## 🌐 Network Optimization

### Règles

1. **API Calls**
   - Utiliser `React Query` pour le caching
   - Implémenter la pagination pour les grandes listes
   - Utiliser le debounce pour les recherches

2. **Prefetching**
   - Prefetch les routes probables
   - Prefetch les données nécessaires

3. **Compression**
   - S'assurer que le serveur utilise gzip/brotli
   - Minifier le code en production

---

## 🎨 Règles de Style

### Interdictions strictes

1. **PAS D'EMOJIS**
   - Ne jamais utiliser d'emojis dans le code, les commentaires, ou les messages
   - Utiliser des icônes Lucide React à la place
   - Exception : uniquement si explicitement demandé par le client

2. **PAS DE DÉGRADÉS (Gradients)**
   - Ne jamais utiliser `bg-gradient-to-*` ou `from-* to-*`
   - Utiliser des couleurs solides uniquement : `bg-primary`, `bg-navy`, `bg-white`, etc.
   - Exception : uniquement si explicitement demandé par le client

3. **Style basé sur departement/etude**
   - Suivre le même style que les projets `departement` et `etude`
   - Utiliser les mêmes couleurs (navy, primary)
   - Utiliser les mêmes classes utilitaires (btn-primary, card, etc.)

## 📐 Règles de Développement

### Consultation des Diagrammes

1. **Toujours consulter les diagrammes avant de développer**
   - **Diagramme de classes** : `autres/best-sql-classe.drawio.xml`
     - Définit la structure des données (entités, relations, attributs)
     - Utiliser pour comprendre les types de données et leurs relations
     - Référence pour créer les interfaces TypeScript
   - **Diagramme de cas d'utilisation** : `autres/uc-utilisateur.drawio.xml`
     - Définit les fonctionnalités et interactions utilisateur
     - Utiliser pour comprendre les workflows et les actions possibles
     - Référence pour structurer les pages et composants

2. **Utilisation des diagrammes**
   - Avant de créer une nouvelle page/composant, consulter les diagrammes
   - S'assurer que la structure de données correspond au diagramme de classes
   - S'assurer que les fonctionnalités correspondent au diagramme de cas d'utilisation

### Données Mock et Variables

1. **Ne jamais utiliser de valeurs en dur (hardcoded)**
   - Toutes les données affichées doivent provenir de variables ou de données mock
   - Créer des fichiers de données mock basés sur le diagramme de classes
   - Utiliser des constantes pour les valeurs réutilisables

2. **Structure des données mock**
   - Créer `src/data/mock/` pour les données mock
   - Créer `src/types/` pour les interfaces TypeScript basées sur le diagramme de classes
   - Utiliser les noms d'entités du diagramme de classes (ex: `DossierMemoire`, `Document`, `Encadrement`)

3. **Exemples**
   ```tsx
   // ❌ MAUVAIS - Valeurs en dur
   <DashboardCard title="Mes Dossiers" value="1" />
   <p>Dr. Jean Pierre</p>
   <span>65%</span>
   
   // ✅ BON - Variables depuis données mock
   const dossierCount = mockData.dossiers.length;
   <DashboardCard title="Mes Dossiers" value={dossierCount.toString()} />
   <p>{encadrant.nom}</p>
   <span>{progression}%</span>
   ```

### Exemples

```tsx
// ❌ MAUVAIS - Dégradé
<div className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950">

// ✅ BON - Couleur solide
<div className="bg-navy-900">

// ❌ MAUVAIS - Emoji
<span>✅ Succès</span>

// ✅ BON - Icône
<CheckCircle className="h-5 w-5 text-green-600" />
<span>Succès</span>
```

---

## ✅ Checklist de Performance

Avant de merger une PR, vérifier :

- [ ] Toutes les routes sont lazy loaded
- [ ] Les images ont `loading="lazy"`
- [ ] Les composants lourds utilisent `React.memo()`
- [ ] Pas d'imports inutiles
- [ ] Bundle size < 500KB (gzipped)
- [ ] Pas de console.log en production
- [ ] Les listes longues sont virtualisées
- [ ] Les API calls sont optimisées (caching, pagination)
- [ ] **PAS D'EMOJIS dans le code**
- [ ] **PAS DE DÉGRADÉS (gradients)**
- [ ] Style cohérent avec departement/etude
- [ ] **Diagrammes consultés** (best-sql-classe.drawio.xml et uc-utilisateur.drawio.xml)
- [ ] **Pas de valeurs en dur** - Utiliser des variables/données mock
- [ ] **Interfaces TypeScript** créées basées sur le diagramme de classes

---

## 🔧 Outils

- **Bundle Analyzer**: `npm run build -- --analyze`
- **Lighthouse**: Audit de performance
- **React DevTools Profiler**: Identifier les re-renders
- **Webpack Bundle Analyzer**: Analyser la taille du bundle

---

## 📚 Ressources

- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [Web.dev Performance](https://web.dev/performance/)
- [Bundle Phobia](https://bundlephobia.com/) - Vérifier la taille des packages

