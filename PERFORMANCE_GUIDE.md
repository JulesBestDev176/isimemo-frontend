# Guide d'Utilisation - Optimisations de Performance

Ce guide explique comment utiliser les outils et composants d'optimisation de performance dans le projet.

## 🚀 Lazy Loading des Routes

Toutes les routes sont maintenant lazy loaded. Pour ajouter une nouvelle route :

```tsx
// ✅ BON - Lazy loading
const NewPage = lazy(() => import("./pages/NewPage"));

// Dans App.tsx
<Route path="/new-page" element={<NewPage />} />
```

## 🖼️ Composant LazyImage

Utilisez `LazyImage` au lieu de `<img>` pour les images en dehors du viewport :

```tsx
import LazyImage from "./components/common/LazyImage";

// ✅ BON
<LazyImage
  src="/images/hero.jpg"
  alt="Hero image"
  placeholder="/images/placeholder.jpg"
  fallback="/images/fallback.jpg"
  className="w-full h-auto"
/>
```

## 🧠 Memoization

### Utiliser React.memo pour les composants

```tsx
import { memo } from 'react';

// ✅ BON - Pour les composants qui re-render souvent
const ExpensiveComponent = memo(({ data }) => {
  return <div>{/* ... */}</div>;
});
```

### Utiliser useMemo pour les calculs coûteux

```tsx
import { useMemo } from 'react';

// ✅ BON
const processedData = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);
```

### Utiliser useCallback pour les fonctions

```tsx
import { useCallback } from 'react';

// ✅ BON
const handleClick = useCallback(() => {
  doSomething();
}, [dependencies]);
```

## ⚡ Utilitaires de Performance

### Debounce

```tsx
import { debounce } from './utils/performance';

const handleSearch = debounce((query: string) => {
  // Recherche
}, 300);
```

### Throttle

```tsx
import { throttle } from './utils/performance';

const handleScroll = throttle(() => {
  // Gestion du scroll
}, 100);
```

### Mesurer les performances

```tsx
import { measurePerformance } from './utils/performance';

const result = await measurePerformance('myFunction', async () => {
  return await expensiveOperation();
});
```

## 📊 Analyser le Bundle

```bash
# Analyser la taille du bundle
npm run build:analyze
```

## ✅ Checklist avant commit

- [ ] Toutes les nouvelles routes sont lazy loaded
- [ ] Les images utilisent `LazyImage` ou `loading="lazy"`
- [ ] Les composants lourds utilisent `React.memo()`
- [ ] Pas de `console.log` en production
- [ ] Les calculs coûteux utilisent `useMemo()`
- [ ] Les fonctions passées comme props utilisent `useCallback()`

