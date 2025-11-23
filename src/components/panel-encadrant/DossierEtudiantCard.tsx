import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../ui/badge';

export interface DossierEtudiant {
  id: number;
  etudiant: {
    nom: string;
    prenom: string;
    email: string;
  };
  dossierMemoire: {
    id: number;
    titre: string;
    statut: string;
    etape: string;
    progression: number;
  };
}

export type { DossierEtudiant as DossierEtudiantType };

interface DossierEtudiantCardProps {
  dossier: DossierEtudiant;
  encadrementId: string;
}

export const DossierEtudiantCard: React.FC<DossierEtudiantCardProps> = ({
  dossier,
  encadrementId
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold">
            {dossier.etudiant.prenom.charAt(0)}{dossier.etudiant.nom.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {dossier.etudiant.prenom} {dossier.etudiant.nom}
            </h3>
            <p className="text-sm text-gray-500">{dossier.etudiant.email}</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-2">{dossier.dossierMemoire.titre}</h4>
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline">{dossier.dossierMemoire.statut}</Badge>
          <Badge variant="outline">{dossier.dossierMemoire.etape}</Badge>
        </div>
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Avancement</span>
            <span>{dossier.dossierMemoire.progression}%</span>
          </div>
          <div className="w-full bg-gray-200 h-2">
            <div
              className="bg-primary h-2 transition-all"
              style={{ width: `${dossier.dossierMemoire.progression}%` }}
            />
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate(`/professeur/encadrements/${encadrementId}/dossier/${dossier.dossierMemoire.id}`)}
        className="w-full px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
      >
        Voir le détail
      </button>
    </div>
  );
};

