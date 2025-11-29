import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { History, Calendar, Users, FileText, Search, CheckCircle, Award } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import type { DossierMemoire } from '../../../models/dossier/DossierMemoire';
import { StatutDossierMemoire } from '../../../models/dossier/DossierMemoire';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface HistoriqueTabProps {
  dossiers: DossierMemoire[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const HistoriqueTab: React.FC<HistoriqueTabProps> = ({ 
  dossiers, 
  searchQuery, 
  onSearchChange 
}) => {
  const dossiersFiltres = useMemo(() => {
    if (!searchQuery.trim()) return dossiers;
    const query = searchQuery.toLowerCase();
    return dossiers.filter(d => 
      d.titre.toLowerCase().includes(query) ||
      d.description.toLowerCase().includes(query) ||
      d.candidats?.some(c => 
        `${c.prenom} ${c.nom}`.toLowerCase().includes(query)
      )
    );
  }, [dossiers, searchQuery]);

  // Trier par date de modification (plus récent en premier)
  const dossiersTries = useMemo(() => {
    return [...dossiersFiltres].sort((a, b) => 
      new Date(b.dateModification).getTime() - new Date(a.dateModification).getTime()
    );
  }, [dossiersFiltres]);

  const getStatutBadge = (statut: StatutDossierMemoire) => {
    switch (statut) {
      case StatutDossierMemoire.SOUTENU:
        return <Badge className="bg-purple-100 text-purple-700 border-purple-200">Soutenu</Badge>;
      case StatutDossierMemoire.VALIDE:
        return <Badge className="bg-green-100 text-green-700 border-green-200">Validé</Badge>;
      case StatutDossierMemoire.DEPOSE:
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Déposé</Badge>;
      default:
        return <Badge>{statut}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Rechercher dans l'historique..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total dossiers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{dossiers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Dossiers soutenus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {dossiers.filter(d => d.statut === StatutDossierMemoire.SOUTENU).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Dossiers validés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {dossiers.filter(d => d.statut === StatutDossierMemoire.VALIDE).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des dossiers */}
      {dossiersTries.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucun dossier dans l'historique</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {dossiersTries.map((dossier, index) => (
            <motion.div
              key={dossier.idDossierMemoire}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{dossier.titre}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {dossier.description}
                      </CardDescription>
                    </div>
                    {getStatutBadge(dossier.statut)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dossier.candidats && dossier.candidats.length > 0 && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>
                          {dossier.candidats.map(c => `${c.prenom} ${c.nom}`).join(', ')}
                        </span>
                      </div>
                    )}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Créé le {format(dossier.dateCreation, 'dd/MM/yyyy', { locale: fr })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Modifié le {format(dossier.dateModification, 'dd/MM/yyyy', { locale: fr })}
                        </span>
                      </div>
                      {dossier.anneeAcademique && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Award className="h-4 w-4" />
                          <span>{dossier.anneeAcademique}</span>
                        </div>
                      )}
                    </div>
                    {dossier.documents && dossier.documents.length > 0 && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <FileText className="h-4 w-4" />
                        <span>{dossier.documents.length} document(s)</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoriqueTab;

