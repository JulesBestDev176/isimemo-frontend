import React from 'react';
import { Plus } from 'lucide-react';
import { TacheCommuneItem, TacheCommune, TacheCommuneType } from './TacheCommuneItem';
export type { TacheCommune, TacheCommuneType };

interface TacheCommuneListProps {
  taches: TacheCommune[];
  onAddTache: () => void;
  onSupprimer: (id: number) => void;
  onDesactiver?: (id: number) => void;
  canEdit?: boolean;
}

export const TacheCommuneList: React.FC<TacheCommuneListProps> = ({
  taches,
  onAddTache,
  onSupprimer,
  onDesactiver,
  canEdit = true
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Tâches communes</h2>
        {canEdit && (
          <button
            onClick={onAddTache}
            className="px-4 py-2 bg-primary text-white hover:bg-primary-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter une tâche
          </button>
        )}
      </div>

      <div className="space-y-4">
        {taches.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>Aucune tâche commune pour le moment.</p>
            {canEdit && (
              <p className="text-sm mt-2">Cliquez sur "Ajouter une tâche" pour en créer une.</p>
            )}
          </div>
        ) : (
          taches.map((tache) => (
            <TacheCommuneItem
              key={tache.id}
              tache={tache}
              onSupprimer={onSupprimer}
              onDesactiver={onDesactiver}
              canEdit={canEdit}
            />
          ))
        )}
      </div>
    </div>
  );
};

