import React from 'react';
import { ArrowLeft, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Encadrement } from '../../models';

interface PanelHeaderProps {
  encadrement: Encadrement;
  encadrementId: string;
}

export const PanelHeader: React.FC<PanelHeaderProps> = ({ encadrement, encadrementId }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <button
        onClick={() => navigate(`/professeur/encadrements/${encadrementId}`)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Retour à l'encadrement
      </button>
      <div className="bg-white border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Panel d'Encadrement</h1>
        <p className="text-gray-600">
          {encadrement.dossierMemoire?.titre || `Encadrement #${encadrement.idEncadrement}`}
        </p>
        {encadrement.dossierMemoire?.candidats && encadrement.dossierMemoire.candidats.length > 0 && (
          <div className="mt-4 flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              {encadrement.dossierMemoire.candidats.map(c => `${c.prenom} ${c.nom}`).join(', ')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

