import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Users,
  CheckCircle,
  Gavel, 
  FileCheck,
  BarChart3,
  Search,
  Eye,
  Mail,
  Award,
  User
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Input } from '../../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { mockProfesseurs, type Professeur } from '../../../models/acteurs/Professeur';
import { 
  getSujetsProposesByProfesseur,
  getSujetsValidesByProfesseur,
  getEtudiantsEncadresByProfesseur,
  getJurysByProfesseur,
  getStatistiquesEncadrement,
  getCorrectionsValideesByProfesseur
} from '../../../models/services/ProfesseurEspace.service';
import SujetsProposesTab from '../../professeur/tabs/SujetsProposesTab';
import EtudiantsEncadresTab from '../../professeur/tabs/EtudiantsEncadresTab';
import SujetsValidesTab from '../../professeur/tabs/SujetsValidesTab';
import JurysTab from '../../professeur/tabs/JurysTab';
import CorrectionsValideesTab from '../../professeur/tabs/CorrectionsValideesTab';
import StatistiquesTab from '../../professeur/tabs/StatistiquesTab';

const ProfessorsChef: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfesseur, setSelectedProfesseur] = useState<Professeur | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('sujets-proposes');
  const [tabSearchQuery, setTabSearchQuery] = useState('');

  // Récupérer les professeurs du département (pour le chef de département)
  // Si l'utilisateur est chef, on filtre par son département
  const professeursDepartement = useMemo(() => {
    if (!user) return [];
    const departement = user.departement || 'Département Informatique';
    return mockProfesseurs.filter(p => p.departement === departement);
  }, [user]);

  // Filtrer les professeurs par recherche
  const professeursFiltres = useMemo(() => {
    if (!searchQuery.trim()) return professeursDepartement;
    const query = searchQuery.toLowerCase();
    return professeursDepartement.filter(p => 
      `${p.prenom} ${p.nom}`.toLowerCase().includes(query) ||
      p.email.toLowerCase().includes(query) ||
      p.specialite?.toLowerCase().includes(query) ||
      p.grade?.toLowerCase().includes(query)
    );
  }, [professeursDepartement, searchQuery]);

  const handleViewProfesseur = (professeur: Professeur) => {
    setSelectedProfesseur(professeur);
    setIsModalOpen(true);
    setActiveTab('sujets-proposes');
    setTabSearchQuery('');
  };

  // Récupérer les données pour le professeur sélectionné
  const professeurId = selectedProfesseur?.idProfesseur || 0;
  const estCommission = selectedProfesseur?.estCommission || false;

  const sujetsProposes = useMemo(() => 
    professeurId > 0 ? getSujetsProposesByProfesseur(professeurId) : [], 
    [professeurId]
  );
  
  const sujetsValides = useMemo(() => 
    professeurId > 0 ? getSujetsValidesByProfesseur(professeurId) : new Map(), 
    [professeurId]
  );
  
  const etudiantsEncadres = useMemo(() => 
    professeurId > 0 ? getEtudiantsEncadresByProfesseur(professeurId) : [], 
    [professeurId]
  );
  
  const jurys = useMemo(() => 
    professeurId > 0 ? getJurysByProfesseur(professeurId) : [], 
    [professeurId]
  );
  
  const correctionsValidees = useMemo(() => 
    professeurId > 0 ? getCorrectionsValideesByProfesseur(professeurId, estCommission) : new Map(), 
    [professeurId, estCommission]
  );
  
  const statistiques = useMemo(() => 
    professeurId > 0 ? getStatistiquesEncadrement(professeurId) : {
      totalEncadrements: 0,
      encadrementsActifs: 0,
      encadrementsTermines: 0,
      totalEtudiants: 0,
      dossiersSoutenus: 0,
      dossiersValides: 0,
      tauxReussite: 0
    }, 
    [professeurId]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
      <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Professeurs du Département
          </h1>
          <p className="text-gray-600">
            Consultez les informations et activités des professeurs de votre département
          </p>
      </motion.div>

        {/* Barre de recherche */}
        <div className="mb-6">
          <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
            type="text"
            placeholder="Rechercher un professeur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
          />
          </div>
        </div>
        
        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total professeurs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{professeursDepartement.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Encadrants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {professeursDepartement.filter(p => p.estEncadrant).length}
                </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Membres jury</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {professeursDepartement.filter(p => p.estJurie).length}
                </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Commission</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {professeursDepartement.filter(p => p.estCommission).length}
              </div>
            </CardContent>
          </Card>
      </div>

        {/* Liste des professeurs en tableau */}
        {professeursFiltres.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucun professeur trouvé</p>
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
                    Professeur
                  </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                  </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grade
                  </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Spécialité
                  </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Encadrements
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
                    {professeursFiltres.map((professeur, index) => (
                  <motion.tr 
                        key={professeur.idProfesseur}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.02 }}
                        className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-5 w-5 text-primary" />
                        </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {professeur.prenom} {professeur.nom}
                              </div>
                        </div>
                      </div>
                    </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600 flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {professeur.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600 flex items-center gap-2">
                            {professeur.grade ? (
                              <>
                                <Award className="h-4 w-4" />
                                {professeur.grade}
                          </>
                        ) : (
                              <span className="text-gray-400">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {professeur.specialite || <span className="text-gray-400">-</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {professeur.estEncadrant ? (
                              <span>
                                {professeur.nombreEncadrementsActuels || 0}/{professeur.capaciteEncadrement || 0}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                      </div>
                    </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {professeur.estDisponible ? (
                            <Badge className="bg-green-100 text-green-700 border-green-200">Disponible</Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-700 border-gray-200">Indisponible</Badge>
                          )}
                    </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewProfesseur(professeur)}
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

        {/* Modal de consultation du professeur */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                {selectedProfesseur && `${selectedProfesseur.prenom} ${selectedProfesseur.nom}`}
              </DialogTitle>
              <DialogDescription>
                {selectedProfesseur?.grade && `${selectedProfesseur.grade}`}
                {selectedProfesseur?.specialite && ` - ${selectedProfesseur.specialite}`}
              </DialogDescription>
            </DialogHeader>
            
            {selectedProfesseur && (
              <div className="mt-4">
                {/* Informations générales */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                      <strong className="text-gray-700">Email:</strong>
                      <p className="text-gray-600">{selectedProfesseur.email}</p>
              </div>
                    {selectedProfesseur.departement && (
          <div>
                        <strong className="text-gray-700">Département:</strong>
                        <p className="text-gray-600">{selectedProfesseur.departement}</p>
                </div>
                    )}
                    {selectedProfesseur.estEncadrant && (
                          <div>
                        <strong className="text-gray-700">Encadrements:</strong>
                        <p className="text-gray-600">
                          {selectedProfesseur.nombreEncadrementsActuels || 0}/{selectedProfesseur.capaciteEncadrement || 0}
                        </p>
                          </div>
                    )}
            <div>
                      <strong className="text-gray-700">Statut:</strong>
                      <p className="text-gray-600">
                        {selectedProfesseur.estDisponible ? (
                          <Badge className="bg-green-100 text-green-700">Disponible</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-700">Indisponible</Badge>
                        )}
              </p>
            </div>
          </div>
        </div>
        
        {/* Onglets */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-6 mb-6">
                    <TabsTrigger value="sujets-proposes" className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span className="hidden sm:inline">Sujets proposés</span>
                    </TabsTrigger>
                    <TabsTrigger value="statistiques" className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      <span className="hidden sm:inline">Statistiques</span>
                    </TabsTrigger>
                    <TabsTrigger value="etudiants-encadres" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span className="hidden sm:inline">Étudiants encadrés</span>
                    </TabsTrigger>
                    <TabsTrigger value="sujets-valides" className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <span className="hidden sm:inline">Sujets traités</span>
                    </TabsTrigger>
                    <TabsTrigger value="jurys" className="flex items-center gap-2">
                      <Gavel className="h-4 w-4" />
                      <span className="hidden sm:inline">Jurys</span>
                    </TabsTrigger>
                    <TabsTrigger value="corrections-validees" className="flex items-center gap-2">
                      <FileCheck className="h-4 w-4" />
                      <span className="hidden sm:inline">Corrections traitées</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Contenu des onglets */}
                  <TabsContent value="sujets-proposes" className="mt-6">
                    <SujetsProposesTab 
                      sujets={sujetsProposes}
                      searchQuery={tabSearchQuery}
                      onSearchChange={setTabSearchQuery}
                    />
                  </TabsContent>

                  <TabsContent value="statistiques" className="mt-6">
                    <StatistiquesTab 
                      statistiques={statistiques}
                    />
                  </TabsContent>

                  <TabsContent value="etudiants-encadres" className="mt-6">
                    <EtudiantsEncadresTab 
                      etudiants={etudiantsEncadres}
                      searchQuery={tabSearchQuery}
                      onSearchChange={setTabSearchQuery}
                    />
                  </TabsContent>

                  <TabsContent value="sujets-valides" className="mt-6">
                    <SujetsValidesTab 
                      sujets={sujetsValides}
                      searchQuery={tabSearchQuery}
                      onSearchChange={setTabSearchQuery}
                    />
                  </TabsContent>

                  <TabsContent value="jurys" className="mt-6">
                    <JurysTab 
                      jurys={jurys}
                      searchQuery={tabSearchQuery}
                      onSearchChange={setTabSearchQuery}
                    />
                  </TabsContent>

                  <TabsContent value="corrections-validees" className="mt-6">
                    <CorrectionsValideesTab 
                      corrections={correctionsValidees}
                      searchQuery={tabSearchQuery}
                      onSearchChange={setTabSearchQuery}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProfessorsChef;
