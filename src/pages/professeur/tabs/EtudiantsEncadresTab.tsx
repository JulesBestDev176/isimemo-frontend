import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Calendar, FileText, Eye, Search, GraduationCap, 
  ChevronLeft, ChevronRight, Download
} from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import type { DossierMemoire } from '../../../models/dossier/DossierMemoire';
import { StatutDossierMemoire } from '../../../models/dossier/DossierMemoire';
import { StatutEncadrement } from '../../../models/dossier/Encadrement';
import { getDocumentsByDossier } from '../../../models/dossier/Document';
import { getTicketsByDossier } from '../../../models/dossier/Ticket';
import { getProcessVerbalByDossier } from '../../../models/soutenance/ProcessVerbal';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface EtudiantsEncadresTabProps {
  etudiants: Array<{
    anneeAcademique: string;
    encadrement: { dateDebut: Date; dateFin?: Date; statut: string; idEncadrement: number };
    etudiants: Array<{
      candidat: { idCandidat: number; nom: string; prenom: string; email: string };
      dossier: DossierMemoire;
    }>;
  }>;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const EtudiantsEncadresTab: React.FC<EtudiantsEncadresTabProps> = ({ 
  etudiants, 
  searchQuery, 
  onSearchChange 
}) => {
  const [selectedDossier, setSelectedDossier] = useState<DossierMemoire | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnneeIndex, setSelectedAnneeIndex] = useState(0);

  // Trier les encadrements par année (plus récent en premier)
  const encadrementsTries = useMemo(() => {
    return [...etudiants].sort((a, b) => {
      const anneeA = a.anneeAcademique.split('-')[0];
      const anneeB = b.anneeAcademique.split('-')[0];
      return parseInt(anneeB) - parseInt(anneeA);
    });
  }, [etudiants]);

  // Encadrement actuellement affiché
  const encadrementActuel = encadrementsTries[selectedAnneeIndex];

  // Filtrer les étudiants de l'encadrement actuel
  const etudiantsFiltres = useMemo(() => {
    if (!encadrementActuel) return [];
    if (!searchQuery.trim()) return encadrementActuel.etudiants;
    const query = searchQuery.toLowerCase();
    return encadrementActuel.etudiants.filter(et => 
      `${et.candidat.prenom} ${et.candidat.nom}`.toLowerCase().includes(query) ||
      et.candidat.email.toLowerCase().includes(query) ||
      et.dossier.titre.toLowerCase().includes(query)
    );
  }, [encadrementActuel, searchQuery]);

  const getStatutBadge = (statut: StatutDossierMemoire) => {
    switch (statut) {
      case StatutDossierMemoire.EN_COURS:
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">En cours</Badge>;
      case StatutDossierMemoire.VALIDE:
        return <Badge className="bg-green-100 text-green-700 border-green-200">Validé</Badge>;
      case StatutDossierMemoire.SOUTENU:
        return <Badge className="bg-purple-100 text-purple-700 border-purple-200">Soutenu</Badge>;
      case StatutDossierMemoire.EN_ATTENTE_VALIDATION:
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">En attente</Badge>;
      default:
        return <Badge>{statut}</Badge>;
    }
  };

  const handleViewDossier = (dossier: DossierMemoire) => {
    setSelectedDossier(dossier);
    setIsModalOpen(true);
  };

  const handlePreviousAnnee = () => {
    if (selectedAnneeIndex > 0) {
      setSelectedAnneeIndex(selectedAnneeIndex - 1);
      onSearchChange(''); // Réinitialiser la recherche
    }
  };

  const handleNextAnnee = () => {
    if (selectedAnneeIndex < encadrementsTries.length - 1) {
      setSelectedAnneeIndex(selectedAnneeIndex + 1);
      onSearchChange(''); // Réinitialiser la recherche
    }
  };

  if (encadrementsTries.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Aucun encadrement trouvé</p>
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
              <GraduationCap className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-xl">
                  Encadrement {encadrementActuel?.anneeAcademique}
                </CardTitle>
                <CardDescription>
                  {encadrementActuel?.etudiants.length || 0} étudiant(s)
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
                Année précédente
              </Button>
              <span className="text-sm text-gray-600 px-2">
                {selectedAnneeIndex + 1} / {encadrementsTries.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextAnnee}
                disabled={selectedAnneeIndex === encadrementsTries.length - 1}
              >
                Année suivante
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        {encadrementActuel && (
          <CardContent>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {format(encadrementActuel.encadrement.dateDebut, 'dd/MM/yyyy', { locale: fr })}
                  {encadrementActuel.encadrement.dateFin && 
                    ` - ${format(encadrementActuel.encadrement.dateFin, 'dd/MM/yyyy', { locale: fr })}`
                  }
                </span>
              </div>
              {encadrementActuel.encadrement.statut === StatutEncadrement.ACTIF ? (
                <Badge className="bg-green-100 text-green-700 border-green-200">Actif</Badge>
              ) : (
                <Badge className="bg-gray-100 text-gray-700 border-gray-200">Terminé</Badge>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Rechercher un étudiant ou un dossier..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tableau des étudiants */}
      {etudiantsFiltres.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucun étudiant trouvé</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Étudiant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dossier de mémoire
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Documents
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {etudiantsFiltres.map((item, index) => (
                    <motion.tr
                      key={`${item.candidat.idCandidat}-${item.dossier.idDossierMemoire}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item.candidat.prenom} {item.candidat.nom}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{item.candidat.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-md truncate">
                          {item.dossier.titre}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatutBadge(item.dossier.statut)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {item.dossier.documents?.length || 0} document(s)
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDossier(item.dossier)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Consulter
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal de consultation complète du dossier */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Détails du dossier</DialogTitle>
            <DialogDescription>
              Consultation complète du dossier de mémoire
            </DialogDescription>
          </DialogHeader>
          {selectedDossier && (
            <DossierDetailModal dossier={selectedDossier} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Composant pour la consultation complète du dossier
const DossierDetailModal: React.FC<{ dossier: DossierMemoire }> = ({ dossier }) => {
  const [activeTab, setActiveTab] = useState('informations');
  
  const documents = useMemo(() => getDocumentsByDossier(dossier.idDossierMemoire), [dossier.idDossierMemoire]);
  const tickets = useMemo(() => getTicketsByDossier(dossier.idDossierMemoire), [dossier.idDossierMemoire]);
  const processVerbal = useMemo(() => getProcessVerbalByDossier(dossier.idDossierMemoire), [dossier.idDossierMemoire]);
  
  // Vérifier si le dossier a été soutenu
  const estSoutenu = dossier.statut === StatutDossierMemoire.SOUTENU;

  return (
    <div className="mt-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="informations">Informations</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="suivi">Suivi</TabsTrigger>
          {estSoutenu && <TabsTrigger value="process-verbal">Procès-verbal</TabsTrigger>}
        </TabsList>

        <TabsContent value="informations" className="mt-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Titre</h3>
              <p className="text-gray-600">{dossier.titre}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{dossier.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Statut</h3>
                <Badge className="bg-blue-100 text-blue-700">{dossier.statut}</Badge>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Date de création</h3>
                <p className="text-gray-600">
                  {format(dossier.dateCreation, 'dd/MM/yyyy', { locale: fr })}
                </p>
              </div>
            </div>
            {dossier.candidats && dossier.candidats.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Candidat(s)</h3>
                <ul className="list-disc list-inside text-gray-600">
                  {dossier.candidats.map(c => (
                    <li key={c.idCandidat}>
                      {c.prenom} {c.nom} ({c.email})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <div className="space-y-3">
            {documents.length === 0 ? (
              <p className="text-gray-600 text-center py-8">Aucun document</p>
            ) : (
              documents.map(doc => (
                <Card key={doc.idDocument}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{doc.titre}</CardTitle>
                      <Badge>{doc.typeDocument}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <p>Créé le {format(doc.dateCreation, 'dd/MM/yyyy', { locale: fr })}</p>
                        <p>Statut: {doc.statut}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="suivi" className="mt-4">
          <div className="space-y-3">
            {tickets.length === 0 ? (
              <p className="text-gray-600 text-center py-8">Aucun ticket de suivi</p>
            ) : (
              tickets.map(ticket => (
                <Card key={ticket.idTicket}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{ticket.titre}</CardTitle>
                      <Badge>{ticket.phase}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Priorité: {ticket.priorite}</span>
                      <span>Progression: {ticket.progression}%</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {estSoutenu && (
          <TabsContent value="process-verbal" className="mt-4">
            {processVerbal ? (
              <Card>
                <CardHeader>
                  <CardTitle>Procès-verbal de soutenance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Note finale</h3>
                    <p className="text-2xl font-bold text-primary">{processVerbal.noteFinale}/20</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Mention</h3>
                    <Badge>{processVerbal.mention}</Badge>
                  </div>
                  {processVerbal.observations && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Observations</h3>
                      <p className="text-gray-600">{processVerbal.observations}</p>
                    </div>
                  )}
                  {processVerbal.appreciations && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Appréciations</h3>
                      <p className="text-gray-600">{processVerbal.appreciations}</p>
                    </div>
                  )}
                  {processVerbal.demandesModifications && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Demandes de modifications</h3>
                      <p className="text-gray-600 whitespace-pre-line">{processVerbal.demandesModifications}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <p className="text-gray-600 text-center py-8">Aucun procès-verbal disponible</p>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default EtudiantsEncadresTab;
