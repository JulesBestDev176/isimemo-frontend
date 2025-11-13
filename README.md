# Frontend - ISIMemo

Application frontend unifiée pour la gestion des mémoires académiques.

## 🚀 Démarrage Rapide

1. Installer les dépendances:
```bash
npm install
```

2. Démarrer le serveur de développement:
```bash
npm run dev
```

3. Build pour la production:
```bash
npm run build
```

## 📋 Scripts Disponibles

- `npm run dev` - Démarrer le serveur de développement
- `npm run build` - Build de production
- `npm run build:analyze` - Build avec analyse du bundle
- `npm run preview` - Prévisualiser le build de production
- `npm run lint` - Linter le code
- `npm run lint:performance` - Vérifier les règles de performance
- `npm run check:style` - Vérifier le respect des règles de style
- `npm run check:all` - Linter + vérification de style

## 🎨 Règles de Style

**IMPORTANT**: Ce projet suit des règles de style strictes basées sur les projets `departement` et `etude`.

### Interdictions Absolues

1. **PAS D'EMOJIS** - Utiliser des icônes Lucide React à la place
2. **PAS DE DÉGRADÉS** - Utiliser uniquement des couleurs solides (bg-primary, bg-navy, etc.)

### Documentation

- [STYLE_GUIDE.md](./STYLE_GUIDE.md) - Guide complet de style
- [PERFORMANCE_RULES.md](./PERFORMANCE_RULES.md) - Règles de performance
- [STYLE_CHECKLIST.md](./STYLE_CHECKLIST.md) - Checklist avant commit

## 🏗️ Structure du Projet

```
src/
├── components/        # Composants réutilisables
│   ├── admin/        # Composants admin (Sidebar, Header, Logo)
│   ├── common/       # Composants communs (PageLoader, LazyImage)
│   └── ui/           # Composants UI shadcn
├── contexts/         # Contextes React (AuthContext)
├── layouts/          # Layouts (MainLayout)
├── pages/            # Pages de l'application
│   ├── dashboard/   # Dashboard
│   └── ...
├── utils/            # Utilitaires (performance.ts)
└── hooks/            # Hooks personnalisés
```

## 🎯 Acteurs Principaux

L'application gère 3 types d'acteurs principaux :

1. **Étudiant** - Peut avoir la permission de candidat
2. **Professeur** - Peut avoir les rôles : encadrant, chef, commission, jurie
3. **Assistant** - Rôle administratif

## 🔧 Technologies

- **Vite** - Build tool et dev server
- **React 18** - Bibliothèque UI
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Composants UI
- **React Router** - Routing
- **React Query** - Gestion des données
- **Framer Motion** - Animations
- **Lucide React** - Icônes

## 📚 Documentation

Consultez les fichiers de documentation dans la racine du projet :
- `STYLE_GUIDE.md` - Guide de style
- `PERFORMANCE_RULES.md` - Règles de performance
- `PERFORMANCE_GUIDE.md` - Guide d'utilisation des optimisations
