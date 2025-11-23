import React, { memo, ReactNode } from 'react';

/**
 * HOC pour créer des composants mémorisés
 * Utilise React.memo avec comparaison personnalisée
 */
export function createMemoizedComponent<P extends object>(
  Component: React.ComponentType<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean
) {
  return memo(Component, areEqual) as React.ComponentType<P>;
}

/**
 * Props pour MemoizedWrapper
 */
interface MemoizedWrapperProps {
  children: ReactNode;
  dependencies?: any[];
}

/**
 * Wrapper pour mémoriser un composant avec useMemo
 * Utile pour les composants qui changent rarement
 */
export const MemoizedWrapper: React.FC<MemoizedWrapperProps> = memo(
  ({ children }) => {
    return <>{children}</>;
  },
  (prevProps, nextProps) => {
    // Comparaison personnalisée basée sur les dépendances
    if (prevProps.dependencies && nextProps.dependencies) {
      return prevProps.dependencies.every(
        (dep, index) => dep === nextProps.dependencies[index]
      );
    }
    return false;
  }
);

MemoizedWrapper.displayName = 'MemoizedWrapper';







