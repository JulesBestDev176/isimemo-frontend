import React from 'react';
import { User, FileText, Calendar, Download, CheckCircle, XCircle, Eye } from 'lucide-react';
import { StatutLivrable } from '../../models';
import { formatDate, getStatutLivrableBadge } from './utils';

export interface LivrableEtudiant {
  id: string;
  etudiant: {
    nom: string;
    prenom: string;
  };
  titre: string;
  nomFichier: string;
  dateSubmission: Date;
  statut: StatutLivrable;
  version: number;
  feedback?: string;
}

export type { LivrableEtudiant as LivrableEtudiantType };

interface LivrableItemProps {
  livrable: LivrableEtudiant;
  onValider: (livrable: LivrableEtudiant) => void;
  onRejeter: (livrable: LivrableEtudiant) => void;
  onDownload: (livrable: LivrableEtudiant) => void;
  canEdit?: boolean;
}

export const LivrableItem: React.FC<LivrableItemProps> = ({
  livrable,
  onValider,
  onRejeter,
  onDownload,
  canEdit = true
}) => {
  return (
    <div className="bg-white border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900">{livrable.titre}</h3>
            {getStatutLivrableBadge(livrable.statut)}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {livrable.etudiant.prenom} {livrable.etudiant.nom}
            </span>
            <span className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              {livrable.nomFichier}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(livrable.dateSubmission)}
            </span>
          </div>
          {livrable.feedback && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Feedback:</span> {livrable.feedback}
              </p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 ml-4">
          {canEdit && livrable.statut === StatutLivrable.EN_ATTENTE_VALIDATION && (
            <>
              <button
                onClick={() => onValider(livrable)}
                className="px-4 py-2 bg-primary text-white hover:bg-primary-dark transition-colors flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Valider
              </button>
              <button
                onClick={() => onRejeter(livrable)}
                className="px-4 py-2 bg-gray-600 text-white hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <XCircle className="h-4 w-4" />
                Rejeter
              </button>
            </>
          )}
          <button
            onClick={() => {
              // Ouvrir le livrable dans un nouvel onglet pour visualisation
              const cheminFichier = `/documents/${livrable.nomFichier}`;
              window.open(cheminFichier, '_blank');
            }}
            className="p-2 text-gray-600 hover:bg-gray-100 transition-colors"
            title="Visualiser"
          >
            <Eye className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDownload(livrable)}
            className="p-2 text-gray-600 hover:bg-gray-100 transition-colors"
            title="Télécharger"
          >
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

