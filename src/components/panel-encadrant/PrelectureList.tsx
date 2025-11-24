import React, { useState, useMemo } from 'react';
import { Search, Eye, BookOpen } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import type { DemandePrelecture } from '../../models/dossier/DemandePrelecture';
import { StatutDemandePrelecture } from '../../models/dossier/DemandePrelecture';

export interface PrelectureItem {
  id: number;
  demande: DemandePrelecture;
}

interface PrelectureListProps {
  demandes: DemandePrelecture[];
  onConsult: (demande: DemandePrelecture) => void;
}

export const PrelectureList: React.FC<PrelectureListProps> = ({
  demandes,
  onConsult
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDemandes = useMemo(() => {
    if (!searchQuery.trim()) return demandes;
    
    const query = searchQuery.toLowerCase();
    return demandes.filter(demande => 
      demande.candidat?.nom.toLowerCase().includes(query) ||
      demande.candidat?.prenom.toLowerCase().includes(query) ||
      demande.candidat?.email.toLowerCase().includes(query) ||
      demande.dossierMemoire.titre.toLowerCase().includes(query) ||
      demande.encadrantPrincipal?.nom.toLowerCase().includes(query) ||
      demande.encadrantPrincipal?.prenom.toLowerCase().includes(query)
    );
  }, [demandes, searchQuery]);

  const getStatutBadge = (statut: StatutDemandePrelecture) => {
    switch (statut) {
      case StatutDemandePrelecture.EN_ATTENTE:
        return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">En attente</Badge>;
      case StatutDemandePrelecture.EN_COURS:
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">En cours</Badge>;
      case StatutDemandePrelecture.VALIDE:
        return <Badge className="bg-green-50 text-green-700 border-green-200">Validé</Badge>;
      case StatutDemandePrelecture.REJETE:
        return <Badge className="bg-red-50 text-red-700 border-red-200">Rejeté</Badge>;
      default:
        return <Badge className="bg-gray-50 text-gray-700 border-gray-200">{statut}</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  if (demandes.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun mémoire en pré-lecture</h3>
        <p className="text-gray-600">Aucun mémoire ne vous a été assigné pour pré-lecture pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Mémoires en pré-lecture</h2>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Rechercher par étudiant, encadrant principal ou titre du mémoire..."
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
                  Encadrant principal
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date assignation
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDemandes.map((demande) => (
                <tr key={demande.idDemandePrelecture} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {demande.candidat?.prenom} {demande.candidat?.nom}
                        </div>
                        <div className="text-sm text-gray-500">{demande.candidat?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate" title={demande.dossierMemoire.titre}>
                      {demande.dossierMemoire.titre}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {demande.encadrantPrincipal?.prenom} {demande.encadrantPrincipal?.nom}
                    </div>
                    <div className="text-sm text-gray-500">{demande.encadrantPrincipal?.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {demande.dateAssignation ? formatDate(demande.dateAssignation) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatutBadge(demande.statut)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button
                      onClick={() => onConsult(demande)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Consulter
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredDemandes.length === 0 && searchQuery && (
        <div className="text-center py-8">
          <p className="text-gray-600">Aucun résultat trouvé pour "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
};

