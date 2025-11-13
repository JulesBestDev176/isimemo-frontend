# Checklist de Style - À Vérifier Avant Commit

## 🚫 Interdictions Absolues

### Emojis
- [ ] Aucun emoji dans le code source
- [ ] Aucun emoji dans les commentaires
- [ ] Aucun emoji dans les messages utilisateur
- [ ] Utiliser des icônes Lucide React à la place

### Gradients
- [ ] Aucun `bg-gradient-to-*` dans les className
- [ ] Aucun `from-*` ou `to-*` pour les gradients
- [ ] Aucun `via-*` pour les gradients
- [ ] Utiliser uniquement des couleurs solides

## ✅ Style Cohérent

### Couleurs
- [ ] Utiliser `bg-navy`, `bg-primary`, `bg-white`, `bg-gray-*`
- [ ] Utiliser `text-navy`, `text-primary`, `text-gray-*`
- [ ] Pas de couleurs personnalisées non définies dans tailwind.config.ts

### Composants
- [ ] Utiliser les classes utilitaires : `btn-primary`, `btn-outline`, `card`
- [ ] Utiliser les classes de sidebar : `sidebar-item`, `sidebar-item-active`
- [ ] Utiliser les classes de dropdown : `dropdown-menu`, `dropdown-item`

### Transitions
- [ ] Utiliser `transition-colors duration-200` ou `transition-all duration-300`
- [ ] Pas d'animations complexes avec gradients

## 🔍 Commandes de Vérification

```bash
# Chercher les gradients
grep -r "bg-gradient" src/
grep -r "from-" src/ | grep -v "hover:from-" | grep -v "focus:from-"

# Chercher les emojis (approximatif)
grep -r "[\u{1F300}-\u{1F9FF}]" src/ || echo "Aucun emoji trouvé"
```

## 📝 Exemples de Corrections

### Avant (❌)
```tsx
<div className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950">
<button className="bg-gradient-to-r from-primary-600 to-primary-800">
<span>✅ Succès</span>
```

### Après (✅)
```tsx
<div className="bg-navy-900">
<button className="bg-primary hover:bg-primary-700">
<CheckCircle className="h-5 w-5 text-green-600" />
<span>Succès</span>
```


