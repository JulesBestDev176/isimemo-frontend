import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Users, 
  CheckCircle, 
  Gavel, 
  FileCheck, 
  History, 
  BarChart3,
  Search,
  Filter
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import { 
  getSujetsProposesByProfesseur,
  getSujetsValidesByProfesseur,
  getEtudiantsEncadresByProfesseur,
  getJurysByProfesseur,
  getCorrectionsValideesByProfesseur,
  getStatistiquesEncadrement,
  getHistoriqueDossiersByProfesseur
} from '../../models/services/ProfesseurEspace.service';
import SujetsProposesTab from './tabs/SujetsProposesTab';
import EtudiantsEncadresTab from './tabs/EtudiantsEncadresTab';
import SujetsValidesTab from './tabs/SujetsValidesTab';
import JurysTab from './tabs/JurysTab';
import CorrectionsValideesTab from './tabs/CorrectionsValideesTab';
import HistoriqueTab from './tabs/HistoriqueTab';
import StatistiquesTab from './tabs/StatistiquesTab';

const EspaceProfesseur: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('sujets-proposes');
  const [searchQuery, setSearchQuery] = useState('');

  // Vérifier que l'utilisateur est un professeur
  if (!user || user.type !== 'professeur') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès restreint</h2>
          <p className="text-gray-600">Cette page est réservée aux professeurs.</p>
        </div>
      </div>
    );
  }

  const professeurId = user.id || 1; // Utiliser l'ID du professeur connecté
  const estCommission = user.estCommission || false;

  // Récupérer les données
  const sujetsProposes = useMemo(() => 
    getSujetsProposesByProfesseur(professeurId), 
    [professeurId]
  );
  
  const sujetsValides = useMemo(() => 
    getSujetsValidesByProfesseur(professeurId), 
    [professeurId]
  );
  
  const etudiantsEncadres = useMemo(() => 
    getEtudiantsEncadresByProfesseur(professeurId), 
    [professeurId]
  );
  
  const jurys = useMemo(() => 
    getJurysByProfesseur(professeurId), 
    [professeurId]
  );
  
  const correctionsValidees = useMemo(() => 
    getCorrectionsValideesByProfesseur(professeurId, estCommission), 
    [professeurId, estCommission]
  );
  
  const statistiques = useMemo(() => 
    getStatistiquesEncadrement(professeurId), 
    [professeurId]
  );
  
  const historiqueDossiers = useMemo(() => 
    getHistoriqueDossiersByProfesseur(professeurId), 
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
            Espace Professeur
          </h1>
          <p className="text-gray-600">
            Consultez vos sujets proposés, étudiants encadrés, jurys et statistiques
          </p>
        </motion.div>

        {/* Onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-6">
            <TabsTrigger value="sujets-proposes" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Sujets proposés</span>
            </TabsTrigger>
            <TabsTrigger value="etudiants-encadres" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Étudiants encadrés</span>
            </TabsTrigger>
            <TabsTrigger value="sujets-valides" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Sujets validés</span>
            </TabsTrigger>
            <TabsTrigger value="jurys" className="flex items-center gap-2">
              <Gavel className="h-4 w-4" />
              <span className="hidden sm:inline">Jurys</span>
            </TabsTrigger>
            {estCommission && (
              <TabsTrigger value="corrections-validees" className="flex items-center gap-2">
                <FileCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Corrections validées</span>
              </TabsTrigger>
            )}
            <TabsTrigger value="historique" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">Historique</span>
            </TabsTrigger>
            <TabsTrigger value="statistiques" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Statistiques</span>
            </TabsTrigger>
          </TabsList>

          {/* Contenu des onglets */}
          <TabsContent value="sujets-proposes" className="mt-6">
            <SujetsProposesTab 
              sujets={sujetsProposes}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </TabsContent>

          <TabsContent value="etudiants-encadres" className="mt-6">
            <EtudiantsEncadresTab 
              etudiants={etudiantsEncadres}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </TabsContent>

          <TabsContent value="sujets-valides" className="mt-6">
            <SujetsValidesTab 
              sujets={sujetsValides}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </TabsContent>

          <TabsContent value="jurys" className="mt-6">
            <JurysTab 
              jurys={jurys}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </TabsContent>

          {estCommission && (
            <TabsContent value="corrections-validees" className="mt-6">
              <CorrectionsValideesTab 
                corrections={correctionsValidees}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            </TabsContent>
          )}

          <TabsContent value="historique" className="mt-6">
            <HistoriqueTab 
              dossiers={historiqueDossiers}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </TabsContent>

          <TabsContent value="statistiques" className="mt-6">
            <StatistiquesTab 
              statistiques={statistiques}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EspaceProfesseur;

