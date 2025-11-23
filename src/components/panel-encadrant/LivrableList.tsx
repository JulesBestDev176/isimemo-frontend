import React from 'react';
import { LivrableItem, LivrableEtudiant, LivrableEtudiantType } from './LivrableItem';
export type { LivrableEtudiant, LivrableEtudiantType };

interface LivrableListProps {
  livrables: LivrableEtudiant[];
  onValider: (livrable: LivrableEtudiant) => void;
  onRejeter: (livrable: LivrableEtudiant) => void;
  onDownload: (livrable: LivrableEtudiant) => void;
  canEdit?: boolean;
}

export const LivrableList: React.FC<LivrableListProps> = ({
  livrables,
  onValider,
  onRejeter,
  onDownload,
  canEdit = true
}) => {
  // Ne garder qu'un seul livrable par étudiant (le plus récent, car chaque nouveau fichier écrase le précédent)
  const livrablesUniques = React.useMemo(() => {
    const livrablesParEtudiant = new Map<string, LivrableEtudiant>();
    
    livrables.forEach(livrable => {
      const etudiantKey = `${livrable.etudiant.nom}-${livrable.etudiant.prenom}`;
      const existing = livrablesParEtudiant.get(etudiantKey);
      
      // Si aucun livrable pour cet étudiant, ou si celui-ci est plus récent, le garder
      if (!existing || livrable.dateSubmission > existing.dateSubmission) {
        livrablesParEtudiant.set(etudiantKey, livrable);
      }
    });
    
    return Array.from(livrablesParEtudiant.values());
  }, [livrables]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Livrables</h2>
      </div>

      {livrablesUniques.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>Aucun livrable disponible.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {livrablesUniques.map((livrable) => (
            <LivrableItem
              key={livrable.id}
              livrable={livrable}
              onValider={onValider}
              onRejeter={onRejeter}
              onDownload={onDownload}
              canEdit={canEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
};

