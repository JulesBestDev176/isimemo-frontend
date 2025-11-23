import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Composant de chargement pour les pages lazy loaded
 * Utilisé comme fallback pour Suspense
 */
const PageLoader: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <p className="text-gray-600 text-sm">Chargement...</p>
      </div>
    </div>
  );
};

export default PageLoader;







