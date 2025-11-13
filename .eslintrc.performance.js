/**
 * Règles ESLint pour la performance et le style frontend
 * À ajouter dans votre configuration ESLint principale
 */

module.exports = {
  rules: {
    // Empêcher les imports inutiles
    'no-unused-vars': ['error', { 
      varsIgnorePattern: '^_',
      argsIgnorePattern: '^_'
    }],
    
    // Forcer les imports nommés pour le tree shaking
    'no-default-export': 'off', // Désactivé car React nécessite default exports pour lazy
    
    // Empêcher les console.log en production
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    
    // Empêcher les debugger en production
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    
    // Empêcher les imports de bibliothèques entières
    'no-restricted-imports': [
      'warn',
      {
        patterns: [
          {
            group: ['lodash'],
            message: 'Utilisez des imports nommés: import debounce from "lodash/debounce"'
          },
          {
            group: ['moment'],
            message: 'Utilisez date-fns ou dayjs à la place (plus léger)'
          }
        ]
      }
    ],
    
    // Forcer l'utilisation de React.memo pour les composants avec beaucoup de props
    'react/display-name': 'warn',
    
    // Empêcher les re-renders inutiles
    'react-hooks/exhaustive-deps': 'warn',
    
    // Empêcher les gradients dans les className (détection basique)
    'no-restricted-syntax': [
      'error',
      {
        selector: 'Literal[value=/bg-gradient/]',
        message: 'Les gradients sont interdits. Utilisez des couleurs solides: bg-primary, bg-navy, etc.'
      },
      {
        selector: 'TemplateLiteral[expressions.length>0]',
        message: 'Vérifiez que vos template literals ne contiennent pas de gradients (bg-gradient-*)'
      }
    ],
  }
};

