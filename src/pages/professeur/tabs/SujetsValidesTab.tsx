import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, FileText, Search, Link as LinkIcon, GraduationCap, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import type { SujetValide } from '../../../models/services/ProfesseurEspace.service';
import { getDossierById } from '../../../models/dossier/DossierMemoire';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SujetsValidesTabProps {
  sujets: Map<string, SujetValide[]>;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const ITEMS_PER_PAGE = 10;

const SujetsValidesTab: React.FC<SujetsValidesTabProps> = ({ 
  sujets, 
  searchQuery, 
  onSearchChange 
}) => {
  const [selectedAnneeIndex, setSelectedAnneeIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDossierId, setSelectedDossierId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Convertir la Map en tableau trié par année (plus récentes en premier)
  const anneesTriees = useMemo(() => {
    return Array.from(sujets.entries()).sort((a, b) => {
      const anneeA = a[0].split('-')[0];
      const anneeB = b[0].split('-')[0];
      return parseInt(anneeB) - parseInt(anneeA);
    });
  }, [sujets]);

  // Année actuellement affichée
  const anneeActuelle = anneesTriees[selectedAnneeIndex];

  // Filtrer les sujets de l'année actuelle
  const sujetsFiltres = useMemo(() => {
    if (!anneeActuelle) return [];
    const [annee, sujetsAnnee] = anneeActuelle;
    if (!searchQuery.trim()) return sujetsAnnee;
    const query = searchQuery.toLowerCase();
    return sujetsAnnee.filter(s => 
      s.titre.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query) ||
      (s.dossierMemoireTitre && s.dossierMemoireTitre.toLowerCase().includes(query))
    );
  }, [anneeActuelle, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(sujetsFiltres.length / ITEMS_PER_PAGE);
  const sujetsPagination = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return sujetsFiltres.slice(start, end);
  }, [sujetsFiltres, currentPage]);

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

  const handleViewDossier = (dossierId: number) => {
    setSelectedDossierId(dossierId);
    setIsModalOpen(true);
  };

  const selectedDossier = useMemo(() => {
    if (!selectedDossierId) return null;
    return getDossierById(selectedDossierId);
  }, [selectedDossierId]);

  if (anneesTriees.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Aucun sujet traité trouvé</p>
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
                  {sujetsFiltres.length} sujet(s) traité(s)
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
          placeholder="Rechercher un sujet traité..."
          value={searchQuery}
          onChange={(e) => {
            onSearchChange(e.target.value);
            setCurrentPage(1);
          }}
          className="pl-10"
        />
      </div>

      {/* Tableau des sujets traités */}
      {sujetsFiltres.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucun sujet trouvé</p>
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
                        Titre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date de validation
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dossier associé
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sujetsPagination.map((sujet, index) => (
                      <motion.tr
                        key={sujet.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.02 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{sujet.titre}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 max-w-md truncate">
                            {sujet.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {format(new Date(sujet.dateValidation), 'dd/MM/yyyy', { locale: fr })}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {sujet.dossierMemoireTitre ? (
                            <div className="flex items-center gap-2 text-sm text-primary">
                              <LinkIcon className="h-4 w-4" />
                              <span className="truncate max-w-xs">{sujet.dossierMemoireTitre}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Traité
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {sujet.dossierMemoireId && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDossier(sujet.dossierMemoireId!)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Voir dossier
                            </Button>
                          )}
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
                Page {currentPage} sur {totalPages} ({sujetsFiltres.length} résultat(s))
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

      {/* Modal de consultation du dossier associé */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Dossier associé</DialogTitle>
            <DialogDescription>
              Détails du dossier de mémoire associé au sujet
            </DialogDescription>
          </DialogHeader>
          {selectedDossier && (
            <div className="space-y-4 mt-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Titre</h3>
                <p className="text-gray-600">{selectedDossier.titre}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600">{selectedDossier.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Statut</h3>
                  <Badge className="bg-blue-100 text-blue-700">{selectedDossier.statut}</Badge>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Date de création</h3>
                  <p className="text-gray-600">
                    {format(selectedDossier.dateCreation, 'dd/MM/yyyy', { locale: fr })}
                  </p>
                </div>
              </div>
              {selectedDossier.candidats && selectedDossier.candidats.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Candidat(s)</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {selectedDossier.candidats.map(c => (
                      <li key={c.idCandidat}>
                        {c.prenom} {c.nom} ({c.email})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {selectedDossier.documents && selectedDossier.documents.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Documents</h3>
                  <p className="text-gray-600">{selectedDossier.documents.length} document(s)</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SujetsValidesTab;
