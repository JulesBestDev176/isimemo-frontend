import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  User,
  Users,
  Download,
  Upload,
  Filter,
  Edit,
  X,
  Eye,
  BarChart3,
  FileText,
  School,
  Mail,
  Calendar,
  CheckCircle,
  Gavel,
  UserCheck,
  Clock,
  Shuffle,
  GraduationCap
} from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';

// Models
import { Professeur, mockProfesseurs } from '../../../models/acteurs/Professeur';
import { DossierMemoire, mockDossiers } from '../../../models/dossier/DossierMemoire';
import { MembreJury, RoleJury } from '../../../models/soutenance/MembreJury';
import { useGenerationJurys, PropositionJury } from '../../../hooks/useGenerationJurys';
import { EnhancedAutoGenerateJuryModal } from '../../../components/jury/EnhancedAutoGenerateJuryModal';

// Interface locale pour l'affichage (adaptée aux modèles)
interface JuryAffichage {
  id: number;
  nom: string;
  type: 'licence' | 'master';
  specialite: string;
  department: string;
  anneeAcademique: string;
  membres: { professeur: Professeur; role: RoleJury }[];
  etudiants: DossierMemoire[];
  dateCreation: string;
  statut: 'actif' | 'inactif' | 'archive';
  session: string;
  generationAuto: boolean;
}

// Composant utilitaire SimpleButton
const SimpleButton: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'warning';
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  icon?: React.ReactNode;
}> = ({ children, variant = 'primary', onClick, disabled = false, type = 'button', icon }) => {
  const styles = {
    primary: `bg-navy text-white border border-navy hover:bg-navy-dark ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    secondary: `bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    ghost: `bg-transparent text-gray-600 border border-transparent hover:bg-gray-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    success: `bg-green-600 text-white border border-green-600 hover:bg-green-700 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    warning: `bg-orange-600 text-white border border-orange-600 hover:bg-orange-700 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`
  };
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      type={type}
      className={`px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center ${styles[variant]}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

// Composant utilitaire TabButton
const TabButton: React.FC<{
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}> = ({ children, isActive, onClick, icon }) => {
  return (
    <button
      onClick={onClick}
      className={
        `flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200 ` +
        (isActive ? 'border-navy text-navy' : 'border-transparent text-gray-500 hover:text-gray-700')
      }
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

// Mock useAuth
const useAuth = () => ({
  user: {
    id: '1',
    name: 'Dr. Amadou Diop',
    email: 'chef.informatique@isimemo.edu.sn',
    department: 'Informatique',
    estChef: true
  }
});

// Données fictives initiales (pour l'exemple UI, à remplacer par fetch)
const JURYS_DATA_INITIAL: JuryAffichage[] = [
  // Exemple statique si besoin
];

// Onglet Liste des jurys
const JuryListTab: React.FC<{
  jurys: JuryAffichage[];
  onViewDetails: (jury: JuryAffichage) => void;
  onEditJury: (jury: JuryAffichage) => void;
  onToggleStatus: (id: number) => void;
  onGenerateJury: () => void;
  onImportCSV: () => void;
}> = ({ jurys, onViewDetails, onEditJury, onToggleStatus, onGenerateJury, onImportCSV }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'actif' | 'inactif' | 'archive'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sessionFilter, setSessionFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredJurys = jurys.filter(jury => {
    const matchesSearch =
      jury.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      jury.specialite.toLowerCase().includes(searchQuery.toLowerCase()) ||
      jury.membres.some(membre =>
        membre.professeur.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        membre.professeur.prenom.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesStatus = statusFilter === 'all' || jury.statut === statusFilter;
    const matchesType = typeFilter === 'all' || jury.type === typeFilter;
    const matchesSession = sessionFilter === 'all' || jury.session === sessionFilter;

    return matchesSearch && matchesStatus && matchesType && matchesSession;
  });

  const getSessionLabel = (session: string) => {
    switch (session) {
      case 'septembre': return 'Septembre';
      case 'decembre': return 'Décembre';
      case 'speciale': return 'Spéciale';
      default: return session;
    }
  };

  return (
    <div>
      <div className="bg-white border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Actions</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          <SimpleButton
            variant="primary"
            icon={<Shuffle className="h-4 w-4" />}
            onClick={onGenerateJury}
          >
            Générer des jurys
          </SimpleButton>
          <SimpleButton
            variant="primary"
            icon={<Upload className="h-4 w-4" />}
            onClick={onImportCSV}
          >
            Importer (CSV)
          </SimpleButton>
          <SimpleButton variant="secondary" icon={<Download className="h-4 w-4" />}>
            Exporter
          </SimpleButton>
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filtres et recherche</h3>
          <SimpleButton
            variant="ghost"
            onClick={() => setShowFilters(!showFilters)}
            icon={<Filter className="h-4 w-4" />}
          >
            {showFilters ? 'Masquer' : 'Afficher'} les filtres
          </SimpleButton>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Rechercher un jury..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-3 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
          />
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="actif">Actif</option>
                    <option value="inactif">Inactif</option>
                    <option value="archive">Archivé</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                  >
                    <option value="all">Tous les types</option>
                    <option value="licence">Licence</option>
                    <option value="master">Master</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Session</label>
                  <select
                    value={sessionFilter}
                    onChange={(e) => setSessionFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                  >
                    <option value="all">Toutes les sessions</option>
                    <option value="septembre">Septembre</option>
                    <option value="decembre">Décembre</option>
                    <option value="speciale">Spéciale</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {filteredJurys.length === 0 ? (
        <div className="bg-white border border-gray-200 p-8 text-center">
          <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Aucun jury trouvé</h2>
          <p className="text-gray-500">Essayez de modifier vos critères de recherche ou filtres.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jury</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Président</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Étudiants</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredJurys.map((jury, index) => {
                  const president = jury.membres.find(m => m.role === RoleJury.PRESIDENT);
                  return (
                    <motion.tr
                      key={jury.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                            <Users className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 flex items-center">
                              {jury.nom}
                              {jury.generationAuto && (
                                <Badge variant="outline" className="ml-2">
                                  <Shuffle className="h-3 w-3 mr-1" />
                                  Auto
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {jury.anneeAcademique}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="default">
                          <GraduationCap className="inline h-3 w-3 mr-1" />
                          {jury.type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="outline">{getSessionLabel(jury.session)}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {president && (
                          <div className="flex items-center">
                            <Gavel className="h-4 w-4 text-navy mr-2" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {president.professeur.prenom} {president.professeur.nom}
                              </div>
                              <div className="text-xs text-gray-500">{president.professeur.grade}</div>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-green-600 mr-1" />
                          <span className="text-sm text-gray-900">{jury.etudiants.length}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={
                          jury.statut === 'actif' ? 'secondary' :
                            jury.statut === 'inactif' ? 'destructive' : 'outline'
                        }>
                          {jury.statut}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => onViewDetails(jury)}
                            className="p-2 text-gray-600 hover:text-navy hover:bg-navy-light border border-gray-300 hover:border-navy transition-colors duration-200"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onEditJury(jury)}
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 border border-gray-300 hover:border-green-300 transition-colors duration-200"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Onglet Statistiques
const StatisticsTab: React.FC<{
  jurys: JuryAffichage[];
}> = ({ jurys }) => {
  const juryActifs = jurys.filter(j => j.statut === 'actif');
  const jurysAutoGeneres = jurys.filter(j => j.generationAuto);

  const statsParType = ['licence', 'master'].map(type => {
    const jurysByType = jurys.filter(j => j.type === type);
    return {
      name: type.charAt(0).toUpperCase() + type.slice(1),
      count: jurysByType.length,
      actifs: jurysByType.filter(j => j.statut === 'actif').length,
      autoGeneres: jurysByType.filter(j => j.generationAuto).length
    };
  });

  const statsParSession = ['septembre', 'decembre', 'speciale'].map(session => {
    const jurysBySession = jurys.filter(j => j.session === session);
    return {
      name: session.charAt(0).toUpperCase() + session.slice(1),
      count: jurysBySession.length,
      actifs: jurysBySession.filter(j => j.statut === 'actif').length,
      autoGeneres: jurysBySession.filter(j => j.generationAuto).length
    };
  });

  const totalEtudiants = jurys.reduce((total, jury) => total + jury.etudiants.length, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: "Total Jurys", value: jurys.length, icon: Users, color: "bg-navy-light text-navy" },
          { title: "Jurys Actifs", value: juryActifs.length, icon: CheckCircle, color: "bg-green-100 text-green-600" },
          { title: "Auto-générés", value: jurysAutoGeneres.length, icon: Shuffle, color: "bg-purple-100 text-purple-600" },
          { title: "Total Étudiants", value: totalEtudiants, icon: GraduationCap, color: "bg-orange-100 text-orange-600" }
        ].map((stat, index) => (
          <div key={stat.title} className="bg-white border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 mr-4`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par type</h3>
          <div className="space-y-3">
            {statsParType.map(type => {
              const percentage = jurys.length > 0 ? Math.round((type.count / jurys.length) * 100) : 0;
              return (
                <div key={type.name} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{type.name}</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 h-2 mr-3">
                      <div
                        className="bg-navy h-2"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{type.count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par session</h3>
          <div className="space-y-3">
            {statsParSession.map(session => {
              const percentage = jurys.length > 0 ? Math.round((session.count / jurys.length) * 100) : 0;
              return (
                <div key={session.name} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{session.name}</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 h-2 mr-3">
                      <div
                        className="bg-green-500 h-2"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{session.count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails par jury</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jury</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Étudiants</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membres</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jurys.map((jury) => (
                <tr key={jury.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{jury.nom}</div>
                    <div className="text-sm text-gray-500">{jury.dateCreation}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="default">{jury.type}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="outline">{jury.session}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {jury.etudiants.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {jury.membres.length}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={
                      jury.statut === 'actif' ? 'secondary' :
                        jury.statut === 'inactif' ? 'destructive' : 'outline'
                    }>
                      {jury.statut}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Composant principal
const JuryChef: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'stats'>('list');
  const [selectedJury, setSelectedJury] = useState<JuryAffichage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jurysState, setJurysState] = useState<JuryAffichage[]>(JURYS_DATA_INITIAL);
  const [showAutoGenerateModal, setShowAutoGenerateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [juryToEdit, setJuryToEdit] = useState<JuryAffichage | null>(null);

  const { user } = useAuth();

  const openJuryDetails = (jury: JuryAffichage) => {
    setSelectedJury(jury);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedJury(null);
    setIsModalOpen(false);
  };

  const handleEditJury = (jury: JuryAffichage) => {
    setJuryToEdit(jury);
    setEditModalOpen(true);
  };

  const toggleJuryStatus = (id: number) => {
    setJurysState(prev => prev.map(jury =>
      jury.id === id
        ? { ...jury, statut: jury.statut === 'actif' ? 'inactif' : 'actif' }
        : jury
    ));
  };

  const handleGenerateJurys = (propositions: PropositionJury[], session: string, niveau: 'licence' | 'master', annee: string) => {
    // Convertir les propositions en objets JuryAffichage
    const nouveauxJurys: JuryAffichage[] = propositions.map((prop, index) => ({
      id: Math.max(...jurysState.map(j => j.id), 0) + index + 1,
      nom: `Jury ${user.department} ${niveau.toUpperCase()} - Session ${session} ${annee} - Lot ${index + 1}`,
      type: niveau,
      specialite: user.department,
      department: user.department,
      anneeAcademique: annee,
      membres: prop.membres,
      etudiants: prop.dossiers,
      dateCreation: new Date().toLocaleDateString('fr-FR'),
      statut: 'actif',
      session: session,
      generationAuto: true
    }));

    setJurysState(prev => [...prev, ...nouveauxJurys]);
    alert(`${nouveauxJurys.length} jury(s) généré(s) avec succès !`);
  };

  const handleImportData = (type: 'professeurs' | 'etudiants', file: File) => {
    console.log(`Importing ${type} from file:`, file.name);
    // Simulation du parsing et de l'import
    alert(`Import ${type} réalisé avec succès !\nFichier: ${file.name}\nTaille: ${Math.round(file.size / 1024)} KB`);
  };

  const handleSaveJury = (jury: JuryAffichage) => {
    setJurysState(prev => prev.map(j => j.id === jury.id ? { ...j, ...jury } : j));
    setEditModalOpen(false);
  };

  return (
    <div className="JuryChef min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <div className="flex items-center">
            <div className="bg-navy-light rounded-full p-3 mr-4">
              <Users className="h-7 w-7 text-navy" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Jurys</h1>
              <p className="text-sm text-gray-500 mt-1">
                Département {user.department} - Créez, gérez et organisez les jurys de soutenance
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <TabButton
                isActive={activeTab === 'list'}
                onClick={() => setActiveTab('list')}
                icon={<FileText className="h-4 w-4" />}
              >
                Liste des jurys
              </TabButton>
              <TabButton
                isActive={activeTab === 'stats'}
                onClick={() => setActiveTab('stats')}
                icon={<BarChart3 className="h-4 w-4" />}
              >
                Statistiques
              </TabButton>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'list' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <JuryListTab
                  jurys={jurysState}
                  onViewDetails={openJuryDetails}
                  onEditJury={handleEditJury}
                  onToggleStatus={toggleJuryStatus}
                  onGenerateJury={() => setShowAutoGenerateModal(true)}
                  onImportCSV={() => setShowImportModal(true)}
                />
              </motion.div>
            )}

            {activeTab === 'stats' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <StatisticsTab jurys={jurysState} />
              </motion.div>
            )}
          </div>
        </div>

        <JuryDetailsModal
          jury={selectedJury}
          isOpen={isModalOpen}
          onClose={closeModal}
        />

        <EnhancedAutoGenerateJuryModal
          isOpen={showAutoGenerateModal}
          onClose={() => setShowAutoGenerateModal(false)}
          onGenerate={handleGenerateJurys}
          userDepartment={user.department}
        />

        <ImportCSVModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImport={handleImportData}
        />

        <EditJuryModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          jury={juryToEdit}
          onSave={handleSaveJury}
        />
      </div>
    </div>
  );
};

export default JuryChef;

// Modal pour afficher les détails d'un jury
const JuryDetailsModal: React.FC<{
  jury: JuryAffichage | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ jury, isOpen, onClose }) => {
  if (!isOpen || !jury) return null;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case RoleJury.PRESIDENT: return <Gavel className="h-4 w-4" />;
      case RoleJury.RAPPORTEUR: return <FileText className="h-4 w-4" />;
      case RoleJury.EXAMINATEUR: return <UserCheck className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case RoleJury.PRESIDENT: return 'Président';
      case RoleJury.RAPPORTEUR: return 'Rapporteur';
      case RoleJury.EXAMINATEUR: return 'Examinateur';
      default: return role;
    }
  };

  const getSessionLabel = (session: string) => {
    switch (session) {
      case 'septembre': return 'Septembre';
      case 'decembre': return 'Décembre';
      case 'speciale': return 'Spéciale';
      default: return session;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border border-gray-200 p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{jury.nom}</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={
                jury.statut === 'actif' ? 'secondary' :
                  jury.statut === 'inactif' ? 'destructive' : 'outline'
              }>
                {jury.statut}
              </Badge>
              <Badge variant="default">{jury.type}</Badge>
              <Badge variant="outline">{jury.specialite}</Badge>
              <Badge variant="outline">Session {getSessionLabel(jury.session)}</Badge>
              {jury.generationAuto && (
                <Badge variant="outline">
                  <Shuffle className="h-3 w-3 mr-1" />
                  Auto-généré
                </Badge>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Informations générales</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">Année académique</label>
                <p className="text-gray-900 flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  {jury.anneeAcademique}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Session</label>
                <p className="text-gray-900 flex items-center">
                  <Clock className="h-4 w-4 text-gray-400 mr-2" />
                  {getSessionLabel(jury.session)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Date de création</label>
                <p className="text-gray-900">{jury.dateCreation}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Membres du jury</h3>
            <div className="space-y-3">
              {jury.membres.map((membre, index) => (
                <div key={index} className="border border-gray-200 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {getRoleIcon(membre.role)}
                      <span className="ml-2 font-medium text-gray-900">
                        {getRoleLabel(membre.role)}
                      </span>
                    </div>
                    <Badge variant="secondary">{membre.professeur.grade}</Badge>
                  </div>
                  <p className="text-gray-900 font-medium">
                    {membre.professeur.prenom} {membre.professeur.nom}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <Mail className="h-3 w-3 mr-1" />
                    {membre.professeur.email}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <School className="h-3 w-3 mr-1" />
                    {membre.professeur.departement}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Étudiants assignés ({jury.etudiants.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jury.etudiants.map((dossier, index) => {
              const candidat = dossier.candidats?.[0]; // On prend le premier candidat pour l'affichage
              const encadrant = dossier.encadrant;
              return (
                <div key={index} className="border border-gray-200 p-3">
                  <p className="font-medium text-gray-900">
                    {candidat ? `${candidat.prenom} ${candidat.nom}` : 'Candidat inconnu'}
                  </p>
                  <p className="text-sm text-gray-600">{candidat?.email}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {/* <Badge variant="default">{dossier.niveau}</Badge> */}
                    {/* <Badge variant="outline">{dossier.specialite}</Badge> */}
                  </div>
                  {encadrant && (
                    <p className="text-xs text-gray-500 mt-1">
                      Encadrant: {encadrant.prenom} {encadrant.nom}
                    </p>
                  )}
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700">{dossier.titre}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
          <SimpleButton variant="secondary" onClick={onClose}>
            Fermer
          </SimpleButton>
        </div>
      </motion.div>
    </div>
  );
};

// Modal de génération automatique de jury
const AutoGenerateJuryModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (propositions: PropositionJury[], session: string, niveau: 'licence' | 'master', annee: string) => void;
  userDepartment: string;
}> = ({ isOpen, onClose, onGenerate, userDepartment }) => {
  // Imports locaux pour éviter les conflits si non importés en haut
  // Idéalement, ces imports devraient être en haut du fichier, mais pour ce replace_content localisé :
  // On suppose que les mocks sont accessibles ou on les utilise directement via les props si on refactorisait tout.
  // Pour l'instant, on va utiliser des valeurs calculées simulées basées sur les mocks existants importés en haut ou ici.

  // Note: Dans une vraie implémentation, on utiliserait des hooks pour récupérer ces infos.
  // Ici on va simuler la récupération de l'année active et session ouverte.

  const [anneeAcademique, setAnneeAcademique] = useState('2024-2025'); // Sera écrasé par l'active
  const [selectedNiveau, setSelectedNiveau] = useState<'licence' | 'master'>('licence'); // Fixé à Licence
  const [selectedSession, setSelectedSession] = useState<string>('');
  const [propositions, setPropositions] = useState<PropositionJury[]>([]);
  const [configError, setConfigError] = useState<string | null>(null);

  const { genererPropositions, isGenerating, error } = useGenerationJurys();

  useEffect(() => {
    if (isOpen) {
      // 1. Récupérer l'année active
      // Simulation : on prend la dernière année du mock ou une valeur fixe pour l'exemple
      const anneeActive = '2024-2025';
      setAnneeAcademique(anneeActive);

      // 2. Récupérer la session ouverte pour cette année
      // Simulation : on cherche une session ouverte
      // Dans le mock SessionSoutenance.mock.ts, la session 3 (Septembre 2025) est ouverte
      const sessionOuverte = 'Septembre'; // On simule qu'on a trouvé "Septembre"

      if (sessionOuverte) {
        setSelectedSession(sessionOuverte);
        setConfigError(null);
      } else {
        setConfigError("Aucune session de soutenance n'est actuellement ouverte pour l'année en cours.");
      }

      // 3. Niveau fixé à Licence 3
      setSelectedNiveau('licence');
    }
  }, [isOpen]);

  const handlePreview = async () => {
    if (!selectedSession) return;
    const result = await genererPropositions(anneeAcademique, selectedSession, selectedNiveau, userDepartment);
    setPropositions(result);
  };

  const handleConfirm = () => {
    const valides = propositions.filter(p => p.valide);
    if (valides.length === 0) {
      alert("Aucune proposition valide à générer.");
      return;
    }
    onGenerate(valides, selectedSession, selectedNiveau, anneeAcademique);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border border-gray-200 p-6 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Génération automatique de jury</h2>
            <p className="text-sm text-gray-500">
              Département {userDepartment}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {configError ? (
            <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded flex items-center">
              <X className="h-5 w-5 mr-2" />
              {configError}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Année Académique</label>
                  <p className="text-lg font-semibold text-gray-900 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-navy" />
                    {anneeAcademique}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Session Active</label>
                  <p className="text-lg font-semibold text-green-700 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {selectedSession}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Niveau Cible</label>
                  <p className="text-lg font-semibold text-gray-900 flex items-center">
                    <GraduationCap className="h-4 w-4 mr-2 text-navy" />
                    Licence 3
                  </p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800">
                  <strong>Dimensionnement automatique :</strong> Le système calcule le nombre optimal de jurys en fonction de l'effectif (max 10 étudiants/jury, sauf si reste ≤ 5).
                </p>
              </div>

              <div className="flex justify-end">
                <SimpleButton onClick={handlePreview} disabled={isGenerating || !selectedSession}>
                  {isGenerating ? 'Calcul en cours...' : 'Prévisualiser les propositions'}
                </SimpleButton>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded">
                  {error}
                </div>
              )}

              {propositions.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Propositions ({propositions.length})</h3>
                  {propositions.map((prop, idx) => (
                    <div key={idx} className={`p-4 border rounded ${prop.valide ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">Jury {idx + 1} - {prop.dossiers.length} étudiants</h4>
                        <Badge variant={prop.valide ? 'secondary' : 'destructive'}>
                          {prop.valide ? 'Valide' : 'Invalide'}
                        </Badge>
                      </div>
                      {!prop.valide && <p className="text-sm text-red-600 mt-1">{prop.messageErreur}</p>}

                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-semibold text-gray-700">Membres :</p>
                          <ul className="list-disc list-inside">
                            {prop.membres.map((m, i) => (
                              <li key={i}>
                                {m.role} : {m.professeur.prenom} {m.professeur.nom}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700">Étudiants :</p>
                          <p className="text-gray-600">{prop.dossiers.length} dossier(s)</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
          <SimpleButton variant="secondary" onClick={onClose}>
            Annuler
          </SimpleButton>
          <SimpleButton
            variant="primary"
            onClick={handleConfirm}
            disabled={propositions.filter(p => p.valide).length === 0}
            icon={<Shuffle className="h-4 w-4" />}
          >
            Valider la génération
          </SimpleButton>
        </div>
      </motion.div>
    </div>
  );
};

// Modal d'import CSV
const ImportCSVModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onImport: (type: 'professeurs' | 'etudiants', file: File) => void;
}> = ({ isOpen, onClose, onImport }) => {
  const [importType, setImportType] = useState<'professeurs' | 'etudiants'>('professeurs');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setSelectedFile(file);
      } else {
        alert('Veuillez sélectionner un fichier CSV');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setSelectedFile(file);
      } else {
        alert('Veuillez sélectionner un fichier CSV');
      }
    }
  };

  const handleImport = () => {
    if (!selectedFile) {
      alert('Veuillez sélectionner un fichier');
      return;
    }
    onImport(importType, selectedFile);
    setSelectedFile(null);
    onClose();
  };

  const resetModal = () => {
    setSelectedFile(null);
    setImportType('professeurs');
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  const getExampleData = () => {
    if (importType === 'professeurs') {
      return {
        headers: ['nom', 'prenom', 'email', 'grade', 'specialite', 'department', 'institution'],
        example: 'Diop,Dr. Ahmed,ahmed.diop@isi.edu.sn,Professeur Titulaire,Informatique,Informatique,ISI'
      };
    } else {
      return {
        headers: ['nom', 'prenom', 'email', 'niveau', 'specialite', 'department', 'classe', 'encadrant_email', 'session_choisie'],
        example: 'Diallo,Amadou,amadou.diallo@student.isi.edu.sn,Master 2,Informatique,Informatique,Informatique - M2,ibrahima.ndiaye@isi.edu.sn,septembre'
      };
    }
  };

  const exampleData = getExampleData();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border border-gray-200 p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Importer des données CSV</h2>
            <p className="text-sm text-gray-500">
              Importez des professeurs ou des étudiants depuis un fichier CSV
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Type de données à importer</label>
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`p-4 border-2 cursor-pointer transition-colors ${importType === 'professeurs'
                    ? 'border-navy bg-navy-light'
                    : 'border-gray-300 hover:border-gray-400'
                  }`}
                onClick={() => setImportType('professeurs')}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    checked={importType === 'professeurs'}
                    onChange={() => setImportType('professeurs')}
                    className="h-4 w-4 text-navy focus:ring-navy border-gray-300 mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Professeurs</p>
                    <p className="text-sm text-gray-600">Importer la liste des professeurs</p>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 border-2 cursor-pointer transition-colors ${importType === 'etudiants'
                    ? 'border-navy bg-navy-light'
                    : 'border-gray-300 hover:border-gray-400'
                  }`}
                onClick={() => setImportType('etudiants')}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    checked={importType === 'etudiants'}
                    onChange={() => setImportType('etudiants')}
                    className="h-4 w-4 text-navy focus:ring-navy border-gray-300 mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Étudiants</p>
                    <p className="text-sm text-gray-600">Importer la liste des étudiants</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4">
            <h4 className="font-medium text-blue-900 mb-2">Format CSV requis pour {importType} :</h4>
            <div className="text-sm text-blue-800 space-y-2">
              <p><strong>Colonnes requises :</strong></p>
              <p className="font-mono text-xs bg-white p-2 border border-blue-300">
                {exampleData.headers.join(', ')}
              </p>
              <p><strong>Exemple :</strong></p>
              <p className="font-mono text-xs bg-white p-2 border border-blue-300 break-all">
                {exampleData.example}
              </p>
              {importType === 'etudiants' && (
                <p className="text-xs mt-2">
                  <strong>Note :</strong> session_choisie doit être "septembre", "decembre" ou "speciale"
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Sélectionner le fichier CSV</label>

            <div
              className={`relative border-2 border-dashed p-8 text-center transition-colors ${dragActive
                  ? 'border-navy bg-navy-light'
                  : selectedFile
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              {selectedFile ? (
                <div className="flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-green-700 font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-green-600">
                      {Math.round(selectedFile.size / 1024)} KB
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Glissez votre fichier CSV ici
                  </p>
                  <p className="text-sm text-gray-600">
                    ou cliquez pour sélectionner un fichier
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
          <SimpleButton variant="secondary" onClick={handleClose}>
            Annuler
          </SimpleButton>
          <SimpleButton
            variant="primary"
            onClick={handleImport}
            disabled={!selectedFile}
            icon={<Upload className="h-4 w-4" />}
          >
            Importer
          </SimpleButton>
        </div>
      </motion.div>
    </div>
  );
};

// Modal d'édition de jury
const EditJuryModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  jury: JuryAffichage | null;
  onSave: (jury: JuryAffichage) => void;
}> = ({ isOpen, onClose, jury, onSave }) => {
  const [form, setForm] = useState<JuryAffichage | null>(jury);
  useEffect(() => { setForm(jury); }, [jury]);
  if (!isOpen || !form) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white border border-gray-200 p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Modifier le jury</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom</label>
            <input type="text" className="w-full border px-3 py-2" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select className="w-full border px-3 py-2" value={form.type} onChange={e => setForm({ ...form, type: e.target.value as 'licence' | 'master' })}>
              <option value="licence">Licence</option>
              <option value="master">Master</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Statut</label>
            <select className="w-full border px-3 py-2" value={form.statut} onChange={e => setForm({ ...form, statut: e.target.value as 'actif' | 'inactif' | 'archive' })}>
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
              <option value="archive">Archivé</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-2 mt-6">
          <SimpleButton variant="secondary" onClick={onClose}>Annuler</SimpleButton>
          <SimpleButton variant="primary" onClick={() => { if (form) onSave(form); }}>Enregistrer</SimpleButton>
        </div>
      </motion.div>
    </div>
  );
};