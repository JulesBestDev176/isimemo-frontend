import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Gavel, Calendar, Users, Clock, Search, Eye, Award } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import type { JuryInfo } from '../../../models/services/ProfesseurEspace.service';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface JurysTabProps {
  jurys: JuryInfo[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const JurysTab: React.FC<JurysTabProps> = ({ 
  jurys, 
  searchQuery, 
  onSearchChange 
}) => {
  const [selectedJury, setSelectedJury] = useState<JuryInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const jurysFiltres = useMemo(() => {
    if (!searchQuery.trim()) return jurys;
    const query = searchQuery.toLowerCase();
    return jurys.filter(j => 
      j.dossiers.some(d => d.titre.toLowerCase().includes(query)) ||
      j.dossiers.some(d => d.candidats.some(c => 
        `${c.prenom} ${c.nom}`.toLowerCase().includes(query)
      ))
    );
  }, [jurys, searchQuery]);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'PRESIDENT':
        return <Badge className="bg-purple-100 text-purple-700 border-purple-200">Président</Badge>;
      case 'RAPPORTEUR':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Rapporteur</Badge>;
      case 'EXAMINATEUR':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Examinateur</Badge>;
      case 'ENCADRANT':
        return <Badge className="bg-orange-100 text-orange-700 border-orange-200">Encadrant</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'TERMINEE':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Terminée</Badge>;
      case 'EN_COURS':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">En cours</Badge>;
      case 'PLANIFIEE':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Planifiée</Badge>;
      default:
        return <Badge>{statut}</Badge>;
    }
  };

  const handleViewJury = (jury: JuryInfo) => {
    setSelectedJury(jury);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Rechercher un jury..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total jurys</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{jurys.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Soutenances terminées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {jurys.filter(j => j.statut === 'TERMINEE').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Soutenances planifiées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {jurys.filter(j => j.statut === 'PLANIFIEE').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des jurys */}
      {jurysFiltres.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Gavel className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucun jury trouvé</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {jurysFiltres.map((jury, index) => (
            <motion.div
              key={jury.idSoutenance}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 flex items-center gap-2">
                        <Gavel className="h-5 w-5 text-primary" />
                        Soutenance #{jury.idSoutenance}
                      </CardTitle>
                      <CardDescription>
                        {jury.dossiers.length} dossier(s) - {jury.anneeAcademique}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      {getRoleBadge(jury.role)}
                      {getStatutBadge(jury.statut)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {format(jury.dateSoutenance, 'dd/MM/yyyy', { locale: fr })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{jury.heureDebut} - {jury.heureFin}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>
                          {jury.dossiers.reduce((acc, d) => acc + d.candidats.length, 0)} candidat(s)
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Award className="h-4 w-4" />
                        <span className="capitalize">{jury.role.toLowerCase()}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Dossiers</h4>
                      <div className="space-y-2">
                        {jury.dossiers.map((dossier, idx) => (
                          <div key={idx} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                            <p className="font-medium">{dossier.titre}</p>
                            <p className="text-xs text-gray-500">
                              {dossier.candidats.map(c => `${c.prenom} ${c.nom}`).join(', ')}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewJury(jury)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Voir les détails
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal de détails */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de la soutenance</DialogTitle>
            <DialogDescription>
              Informations complètes sur la soutenance et le jury
            </DialogDescription>
          </DialogHeader>
          {selectedJury && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Date</h3>
                  <p className="text-gray-600">
                    {format(selectedJury.dateSoutenance, 'dd/MM/yyyy', { locale: fr })}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Heure</h3>
                  <p className="text-gray-600">{selectedJury.heureDebut} - {selectedJury.heureFin}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Votre rôle</h3>
                  {getRoleBadge(selectedJury.role)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Statut</h3>
                  {getStatutBadge(selectedJury.statut)}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Dossiers de mémoire</h3>
                <div className="space-y-3">
                  {selectedJury.dossiers.map((dossier, idx) => (
                    <Card key={idx}>
                      <CardHeader>
                        <CardTitle className="text-base">{dossier.titre}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Candidat(s)</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600">
                            {dossier.candidats.map((candidat, cIdx) => (
                              <li key={cIdx}>
                                {candidat.prenom} {candidat.nom} ({candidat.email})
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JurysTab;

