import React from 'react';
import { Calendar, Clock, Trash2, EyeOff } from 'lucide-react';
import { formatDate, getPrioriteBadge } from './utils';

export interface TacheCommune {
  id: number;
  titre: string;
  description: string;
  dateCreation: string;
  dateEcheance?: string;
  priorite: 'Basse' | 'Moyenne' | 'Haute';
  active?: boolean;
  tags?: string[];
  consigne?: string;
}

export type { TacheCommune as TacheCommuneType };

interface TacheCommuneItemProps {
  tache: TacheCommune;
  onSupprimer: (id: number) => void;
  onDesactiver?: (id: number) => void;
  canEdit?: boolean;
}

export const TacheCommuneItem: React.FC<TacheCommuneItemProps> = ({
  tache,
  onSupprimer,
  onDesactiver,
  canEdit = true
}) => {
  const isActive = tache.active !== false; // Par défaut actif si non spécifié

  return (
    <div className={`bg-white border border-gray-200 p-4 ${!isActive ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900">{tache.titre}</h3>
            {getPrioriteBadge(tache.priorite)}
            {!isActive && (
              <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-md border border-gray-200">
                Désactivée
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-2">{tache.description}</p>
          
          {tache.consigne && (
            <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded">
              <p className="text-xs text-blue-800">
                <span className="font-medium">Consigne:</span> {tache.consigne}
              </p>
            </div>
          )}

          {tache.tags && tache.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {tache.tags.map((tag, index) => (
                <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-md">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Créée le {formatDate(tache.dateCreation)}
            </span>
            {tache.dateEcheance && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Échéance: {formatDate(tache.dateEcheance)}
              </span>
            )}
          </div>
        </div>
        {canEdit && (
          <div className="flex items-center gap-2 ml-4">
            {onDesactiver && (
              <button
                onClick={() => onDesactiver(tache.id)}
                className={`p-2 transition-colors ${
                  isActive
                    ? 'text-gray-600 hover:bg-gray-50'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
                title={isActive ? 'Désactiver la tâche' : 'Réactiver la tâche'}
              >
                <EyeOff className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={() => onSupprimer(tache.id)}
              className="p-2 text-red-600 hover:bg-red-50 transition-colors"
              title="Supprimer la tâche"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

