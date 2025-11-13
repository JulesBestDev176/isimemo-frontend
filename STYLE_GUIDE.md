# Guide de Style Frontend

Ce guide définit les règles de style à respecter pour maintenir la cohérence avec les projets `departement` et `etude`.

## 🚫 Interdictions Strictes

### 1. Pas d'Emojis

**Règle** : Ne jamais utiliser d'emojis dans le code, les commentaires, les messages utilisateur, ou les interfaces.

```tsx
// ❌ MAUVAIS
<span>✅ Succès</span>
<p>Erreur ❌</p>
// Commentaire avec emoji 🎉

// ✅ BON
<CheckCircle className="h-5 w-5 text-green-600" />
<span>Succès</span>
<AlertCircle className="h-5 w-5 text-red-600" />
<p>Erreur</p>
// Commentaire sans emoji
```

**Exception** : Uniquement si explicitement demandé par le client.

### 2. Pas de Dégradés (Gradients)

**Règle** : Ne jamais utiliser de gradients CSS. Utiliser uniquement des couleurs solides.

```tsx
// ❌ MAUVAIS - Tous ces exemples sont interdits
<div className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950">
<div className="bg-gradient-to-r from-primary-600 to-primary-800">
<div className="bg-gradient-to-t from-blue-500 to-purple-600">
<div style={{ background: 'linear-gradient(...)' }}>

// ✅ BON - Couleurs solides uniquement
<div className="bg-navy-900">
<div className="bg-primary">
<div className="bg-white">
<div className="bg-gray-50">
```

**Exception** : Uniquement si explicitement demandé par le client.

## 🎨 Palette de Couleurs

### Couleurs Principales

Basées sur les projets `departement` et `etude` :

```css
/* Navy - Couleur principale */
navy: #324b8b (DEFAULT)
navy-light: #4a6bbd
navy-dark: #243663
navy-800: #1a294e
navy-900: #101a38

/* Primary - Couleur d'accent */
primary: hsl(224, 53%, 40%)
primary-700: #2c3e81

/* Gris - Arrière-plans et bordures */
gray-50: #f9fafb
gray-100: #f3f4f6
gray-200: #e5e7eb
gray-300: #d1d5db
gray-500: #6b7280
gray-700: #374151
gray-900: #111827
```

### Utilisation

```tsx
// ✅ BON - Utilisation des couleurs
<div className="bg-white text-navy-900">
<button className="bg-primary hover:bg-primary-700 text-white">
<div className="bg-gray-50 border border-gray-200">
```

## 📐 Composants de Style

### Boutons

```tsx
// ✅ BON - Utiliser les classes utilitaires
<button className="btn-primary">Action</button>
<button className="btn-outline">Action secondaire</button>

// ❌ MAUVAIS - Dégradé
<button className="bg-gradient-to-r from-primary-600 to-primary-800">
```

### Cartes

```tsx
// ✅ BON
<div className="card">
  <div className="bg-white rounded-xl shadow-md hover:shadow-lg">
    {/* Contenu */}
  </div>
</div>
```

### Arrière-plans

```tsx
// ✅ BON
<div className="bg-gray-50">  {/* Page background */}
<div className="bg-white">    {/* Card background */}
<div className="bg-navy-900"> {/* Header background */}

// ❌ MAUVAIS
<div className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950">
```

## 🔤 Typographie

```tsx
// ✅ BON
<h1 className="text-2xl font-bold text-navy">Titre</h1>
<p className="text-gray-600">Texte normal</p>
<span className="text-primary">Texte accent</span>

// Utiliser les classes de base
body: bg-gray-50 text-navy-900
h1-h6: font-bold text-navy
```

## 🎯 Transitions et Animations

```tsx
// ✅ BON - Transitions simples
<div className="transition-colors duration-200">
<div className="hover:bg-gray-100 transition-all duration-300">
<div className="hover:shadow-lg transition-shadow duration-300">

// ❌ MAUVAIS - Animations complexes avec gradients
<div className="bg-gradient-to-r animate-gradient">
```

## 📐 Règles de Développement

### Consultation des Diagrammes

**IMPORTANT** : Toujours consulter les diagrammes avant de développer une nouvelle fonctionnalité.

1. **Diagramme de classes** : `autres/best-sql-classe.drawio.xml`
   - Définit la structure des données (entités, relations, attributs)
   - Utiliser pour créer les interfaces TypeScript dans `src/types/`
   - Référence pour comprendre les relations entre entités

2. **Diagramme de cas d'utilisation** : `autres/uc-utilisateur.drawio.xml`
   - Définit les fonctionnalités et interactions utilisateur
   - Utiliser pour structurer les pages et composants
   - Référence pour comprendre les workflows

### Données Mock et Variables

**Règle stricte** : Ne jamais utiliser de valeurs en dur (hardcoded) dans le code.

1. **Structure des données**
   - Créer les interfaces TypeScript dans `src/types/` basées sur le diagramme de classes
   - Créer les données mock dans `src/data/mock/` basées sur les interfaces
   - Utiliser les noms d'entités du diagramme (ex: `DossierMemoire`, `Document`, `Encadrement`)

2. **Exemples**
   ```tsx
   // ❌ MAUVAIS - Valeurs en dur
   <DashboardCard title="Mes Dossiers" value="1" />
   <p>Dr. Jean Pierre</p>
   <span>65%</span>
   
   // ✅ BON - Variables depuis données mock
   const stats = getDashboardStats();
   <DashboardCard title="Mes Dossiers" value={stats.dossiersCount.toString()} />
   <p>Dr. {encadrant.prenom} {encadrant.nom}</p>
   <span>{progression}%</span>
   ```

3. **Avantages**
   - Facilite l'intégration du backend (remplacer les imports mock par des appels API)
   - Données cohérentes avec le diagramme de classes
   - Maintenance plus facile

## 📋 Checklist de Style

Avant de commit :

- [ ] Aucun emoji dans le code
- [ ] Aucun gradient (`bg-gradient-*`, `from-*`, `to-*`)
- [ ] Utilisation des couleurs navy/primary/gray
- [ ] Style cohérent avec departement/etude
- [ ] Utilisation des classes utilitaires (btn-primary, card, etc.)
- [ ] **Diagrammes consultés** (best-sql-classe.drawio.xml et uc-utilisateur.drawio.xml)
- [ ] **Pas de valeurs en dur** - Utiliser des variables/données mock
- [ ] **Interfaces TypeScript** créées basées sur le diagramme de classes

## 🔍 Vérification

Pour vérifier le respect des règles :

```bash
# Chercher les gradients
grep -r "bg-gradient" src/
grep -r "from-" src/
grep -r "to-" src/ | grep -v "to-" | grep -v "hover:to-"

# Chercher les emojis (approximatif)
grep -r "[\u{1F300}-\u{1F9FF}]" src/
```

## 📚 Références

- Voir `departement/src/index.css` pour les classes utilitaires
- Voir `departement/tailwind.config.ts` pour la palette de couleurs
- Voir `etude/src/index.css` pour des exemples supplémentaires

