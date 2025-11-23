import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye } from 'lucide-react';
import { Badge } from '../ui/badge';
import { DossierEtudiant, DossierEtudiantType } from './DossierEtudiantCard';
export type { DossierEtudiant, DossierEtudiantType };

interface DossierEtudiantListProps {
  dossiers: DossierEtudiant[];
  encadrementId: string;
}

export const DossierEtudiantList: React.FC<DossierEtudiantListProps> = ({
  dossiers,
  encadrementId
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const filteredDossiers = useMemo(() => {
    if (!searchQuery.trim()) return dossiers;
    
    const query = searchQuery.toLowerCase();
    return dossiers.filter(dossier => 
      dossier.etudiant.nom.toLowerCase().includes(query) ||
      dossier.etudiant.prenom.toLowerCase().includes(query) ||
      dossier.etudiant.email.toLowerCase().includes(query) ||
      dossier.dossierMemoire.titre.toLowerCase().includes(query) ||
      dossier.dossierMemoire.statut.toLowerCase().includes(query) ||
      dossier.dossierMemoire.etape.toLowerCase().includes(query)
    );
  }, [dossiers, searchQuery]);

  const getStatutBadgeColor = (statut: string) => {
    switch (statut) {
      case 'EN_COURS':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'EN_ATTENTE_VALIDATION':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'VALIDE':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'DEPOSE':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'SOUTENU':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getEtapeBadgeColor = (etape: string) => {
    switch (etape) {
      case 'EN_COURS_REDACTION':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'DEPOT_INTERMEDIAIRE':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'DEPOT_FINAL':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'SOUTENANCE':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'TERMINE':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Dossiers des étudiants</h2>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Rechercher par nom, email, titre du mémoire, statut ou étape..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Tableau */}
      <div className="bg-white border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Étudiant
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Titre du mémoire
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Étape
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Progression
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDossiers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    {searchQuery ? 'Aucun dossier trouvé pour cette recherche.' : 'Aucun dossier disponible.'}
                  </td>
                </tr>
              ) : (
                filteredDossiers.map((dossier) => (
                  <tr key={dossier.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-semibold text-sm mr-3">
                          {dossier.etudiant.prenom.charAt(0)}{dossier.etudiant.nom.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {dossier.etudiant.prenom} {dossier.etudiant.nom}
                          </div>
                          <div className="text-sm text-gray-500">{dossier.etudiant.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-md">
                        {dossier.dossierMemoire.titre}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={`${getStatutBadgeColor(dossier.dossierMemoire.statut)} text-xs`}>
                        {dossier.dossierMemoire.statut.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={`${getEtapeBadgeColor(dossier.dossierMemoire.etape)} text-xs`}>
                        {dossier.dossierMemoire.etape.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${dossier.dossierMemoire.progression}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-10">
                          {dossier.dossierMemoire.progression}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => navigate(`/professeur/encadrements/${encadrementId}/dossier/${dossier.dossierMemoire.id}`)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors border border-gray-300"
                      >
                        <Eye className="h-4 w-4" />
                        Voir le détail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Compteur de résultats */}
      {searchQuery && (
        <div className="text-sm text-gray-600">
          {filteredDossiers.length} dossier{filteredDossiers.length !== 1 ? 's' : ''} trouvé{filteredDossiers.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

