import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Users, CheckCircle, XCircle, Clock, Search } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import type { SujetPropose } from '../../../models/services/ProfesseurEspace.service';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SujetsProposesTabProps {
  sujets: SujetPropose[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const SujetsProposesTab: React.FC<SujetsProposesTabProps> = ({ 
  sujets, 
  searchQuery, 
  onSearchChange 
}) => {
  const sujetsFiltres = useMemo(() => {
    if (!searchQuery.trim()) return sujets;
    const query = searchQuery.toLowerCase();
    return sujets.filter(s => 
      s.titre.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query) ||
      s.anneeAcademique.toLowerCase().includes(query)
    );
  }, [sujets, searchQuery]);


  return (
    <div className="space-y-6">
      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Rechercher un sujet..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Statistiques rapides */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total sujets proposés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{sujets.length}</div>
        </CardContent>
      </Card>

      {/* Liste des sujets */}
      {sujetsFiltres.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucun sujet proposé trouvé</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {sujetsFiltres.map((sujet, index) => (
            <motion.div
              key={sujet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{sujet.titre}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {sujet.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>
                        {sujet.nombreEtudiantsActuels}/{sujet.nombreMaxEtudiants} étudiants
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{sujet.anneeAcademique}</span>
                    </div>
                    {sujet.dateSoumission && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>
                          Soumis le {format(new Date(sujet.dateSoumission), 'dd/MM/yyyy', { locale: fr })}
                        </span>
                      </div>
                    )}
                    {sujet.dateApprobation && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>
                          Validé le {format(new Date(sujet.dateApprobation), 'dd/MM/yyyy', { locale: fr })}
                        </span>
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

export default SujetsProposesTab;

