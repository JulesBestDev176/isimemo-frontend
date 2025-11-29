import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FileCheck, Calendar, Users, Search, CheckCircle, GraduationCap, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import type { CorrectionValidee } from '../../../models/services/ProfesseurEspace.service';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CorrectionsValideesTabProps {
  corrections: Map<string, CorrectionValidee[]>;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const ITEMS_PER_PAGE = 10;

const CorrectionsValideesTab: React.FC<CorrectionsValideesTabProps> = ({ 
  corrections, 
  searchQuery, 
  onSearchChange 
}) => {
  const [selectedAnneeIndex, setSelectedAnneeIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Convertir la Map en tableau trié par année (plus récentes en premier)
  const anneesTriees = useMemo(() => {
    return Array.from(corrections.entries()).sort((a, b) => {
      const anneeA = a[0].split('-')[0];
      const anneeB = b[0].split('-')[0];
      return parseInt(anneeB) - parseInt(anneeA);
    });
  }, [corrections]);

  // Année actuellement affichée
  const anneeActuelle = anneesTriees[selectedAnneeIndex];

  // Filtrer les corrections de l'année actuelle
  const correctionsFiltrees = useMemo(() => {
    if (!anneeActuelle) return [];
    const [annee, correctionsAnnee] = anneeActuelle;
    if (!searchQuery.trim()) return correctionsAnnee;
    const query = searchQuery.toLowerCase();
    return correctionsAnnee.filter(c => 
      c.titre.toLowerCase().includes(query) ||
      c.dossierMemoireTitre.toLowerCase().includes(query) ||
      c.candidats.some(cand => 
        `${cand.prenom} ${cand.nom}`.toLowerCase().includes(query)
      )
    );
  }, [anneeActuelle, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(correctionsFiltrees.length / ITEMS_PER_PAGE);
  const correctionsPagination = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return correctionsFiltrees.slice(start, end);
  }, [correctionsFiltrees, currentPage]);

  const handlePreviousAnnee = () => {
    if (selectedAnneeIndex > 0) {
      setSelectedAnneeIndex(selectedAnneeIndex - 1);
      setCurrentPage(1);
      onSearchChange('');
    }
  };

  const handleNextAnnee = () => {
    if (selectedAnneeIndex < anneesTriees.length - 1) {
      setSelectedAnneeIndex(selectedAnneeIndex + 1);
      setCurrentPage(1);
      onSearchChange('');
    }
  };

  if (anneesTriees.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <FileCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Aucune correction traitée trouvée</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation par année académique */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-6 w-6 text-green-600" />
              <div>
                <CardTitle className="text-xl">
                  Année académique {anneeActuelle?.[0]}
                </CardTitle>
                <CardDescription>
                  {correctionsFiltrees.length} correction(s) traitée(s)
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousAnnee}
                disabled={selectedAnneeIndex === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-600 px-2">
                {selectedAnneeIndex + 1} / {anneesTriees.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextAnnee}
                disabled={selectedAnneeIndex === anneesTriees.length - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Rechercher une correction traitée..."
          value={searchQuery}
          onChange={(e) => {
            onSearchChange(e.target.value);
            setCurrentPage(1);
          }}
          className="pl-10"
        />
      </div>

      {/* Tableau des corrections validées */}
      {correctionsFiltrees.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucune correction traitée trouvée</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Document
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dossier de mémoire
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Candidat(s)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date de validation
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {correctionsPagination.map((correction, index) => (
                      <motion.tr
                        key={correction.idDocument}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.02 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{correction.titre}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 max-w-md truncate">
                            {correction.dossierMemoireTitre}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">
                            {correction.candidats.map(c => `${c.prenom} ${c.nom}`).join(', ')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {format(correction.dateValidation, 'dd/MM/yyyy', { locale: fr })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Validé
                          </Badge>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Page {currentPage} sur {totalPages} ({correctionsFiltrees.length} résultat(s))
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CorrectionsValideesTab;
