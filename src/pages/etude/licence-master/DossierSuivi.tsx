import React, { useState } from 'react';
import { 
  FiFileText, 
  FiDownload, 
  FiEye, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle, 
  FiAlertCircle,
  FiUser,
  FiCalendar,
  FiSearch,
  FiUpload,
  FiPlus,
  FiAward,
  FiMoreVertical,
  FiEdit3,
  FiUsers,
  FiMic,
  FiTarget,
  FiBriefcase,
  FiX,
  FiTrendingUp,
  FiBook
} from 'react-icons/fi';

// Simulation du contexte d'authentification
const useAuth = () => ({
  user: {
    name: 'Amadou Diallo',
    email: 'amadou.diallo@etudiant.sn',
    niveau: 'Master 2', // ou 'Licence 3'
    numero: 'M2021001',
    departement: 'Informatique',
    binome: {
      name: 'Fatou Sow',
      email: 'fatou.sow@etudiant.sn'
    }
  }
});

interface Dossier {
  id: number;
  type: 'Rapport de Stage' | 'Mémoire' | 'Soutenance';
  sujet: string;
  encadreur: string;
  jury?: string[];
  dateDepot: string;
  dateModification?: string;
  dateSoutenance?: string;
  statut: 'Validé' | 'En attente' | 'Refusé' | 'En révision' | 'Brouillon' | 'Programmé' | 'Soutenu';
  fichier?: string;
  taille?: string;
  commentaires?: string;
  note?: number;
  noteOrale?: number;
  progression: number;
  entreprise?: string;
  maitreStagе?: string;
  binome?: string;
  dureeStage?: string;
}

const mockDossiers: Dossier[] = [
  {
    id: 1,
    type: 'Mémoire',
    sujet: 'Optimisation des réseaux sans fil par intelligence artificielle',
    encadreur: 'Pr. Abdoulaye Ndiaye',
    jury: ['Pr. Abdoulaye Ndiaye', 'Dr. Fatou Diop', 'Dr. Aminata Sow'],
    dateDepot: '2024-05-10',
    dateModification: '2024-05-12',
    dateSoutenance: '2024-06-15',
    statut: 'Soutenu',
    fichier: 'memoire-optimisation-v2.pdf',
    taille: '2.3 MB',
    commentaires: 'Excellent travail, méthodologie solide et résultats probants. Bonne présentation orale.',
    note: 18,
    noteOrale: 17,
    progression: 100,
    binome: 'Fatou Sow'
  },
  {
    id: 2,
    type: 'Rapport de Stage',
    sujet: 'Développement d\'une application de gestion des stocks',
    encadreur: 'Dr. Ousmane Kane',
    jury: ['Dr. Ousmane Kane', 'M. Ibrahima Fall', 'Mme. Awa Diop'],
    dateDepot: '2023-09-15',
    dateSoutenance: '2023-10-05',
    statut: 'Soutenu',
    fichier: 'rapport-stage-gestion-stocks.pdf',
    taille: '1.8 MB',
    entreprise: 'TechSolutions SARL',
    maitreStagе: 'M. Papa Diallo',
    dureeStage: '3 mois',
    note: 16,
    noteOrale: 15,
    progression: 100,
    commentaires: 'Bon rapport avec une bonne analyse des problématiques entreprise. Présentation claire.'
  },
  {
    id: 3,
    type: 'Mémoire',
    sujet: 'Analyse de données massives avec Apache Spark',
    encadreur: 'Pr. Moussa Sarr',
    dateDepot: '2024-04-20',
    dateSoutenance: '2024-06-20',
    statut: 'Programmé',
    fichier: 'memoire-analyse-donnees-v1.pdf',
    taille: '2.8 MB',
    progression: 95,
    binome: 'Fatou Sow',
    commentaires: 'Travail en cours de finalisation. Quelques ajustements nécessaires avant la soutenance.'
  },
  {
    id: 4,
    type: 'Rapport de Stage',
    sujet: 'Stage en développement web - Entreprise Digital Solutions',
    encadreur: 'Dr. Aminata Sow',
    dateDepot: '2024-03-10',
    statut: 'En révision',
    fichier: 'rapport-stage-web-dev.pdf',
    taille: '1.5 MB',
    entreprise: 'Digital Solutions',
    maitreStagе: 'Mme. Khady Ndiaye',
    dureeStage: '4 mois',
    progression: 85,
    commentaires: 'Revoir la partie analyse critique et ajouter plus de références techniques.'
  }
];

const getStatutConfig = (statut: string) => {
  switch (statut) {
    case 'Soutenu':
      return {
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: FiCheckCircle,
        iconColor: 'text-emerald-600'
      };
    case 'Programmé':
      return {
        color: 'bg-purple-50 text-purple-700 border-purple-200',
        icon: FiCalendar,
        iconColor: 'text-purple-600'
      };
    case 'Validé':
      return {
        color: 'bg-green-50 text-green-700 border-green-200',
        icon: FiCheckCircle,
        iconColor: 'text-green-600'
      };
    case 'En attente':
      return {
        color: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: FiClock,
        iconColor: 'text-amber-600'
      };
    case 'En révision':
      return {
        color: 'bg-primary/10 text-primary border-primary/20',
        icon: FiAlertCircle,
        iconColor: 'text-primary'
      };
    case 'Refusé':
      return {
        color: 'bg-red-50 text-red-700 border-red-200',
        icon: FiXCircle,
        iconColor: 'text-red-600'
      };
    case 'Brouillon':
      return {
        color: 'bg-slate-50 text-slate-700 border-slate-200',
        icon: FiEdit3,
        iconColor: 'text-slate-600'
      };
    default:
      return {
        color: 'bg-slate-50 text-slate-700 border-slate-200',
        icon: FiClock,
        iconColor: 'text-slate-600'
      };
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'Mémoire': return FiAward;
    case 'Rapport de Stage': return FiBriefcase;
    case 'Soutenance': return FiMic;
    default: return FiFileText;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'Mémoire': return 'bg-purple-100 text-purple-700';
    case 'Rapport de Stage': return 'bg-primary/10 text-primary';
    case 'Soutenance': return 'bg-green-100 text-green-700';
    default: return 'bg-slate-100 text-slate-700';
  }
};

const DossierSuivi: React.FC = () => {
  const { user } = useAuth();
  const [filtreStatut, setFiltreStatut] = useState('');
  const [filtreType, setFiltreType] = useState('');
  const [recherche, setRecherche] = useState('');
  const [dossierSelectionne, setDossierSelectionne] = useState<Dossier | null>(null);
  const [showNouveauDossier, setShowNouveauDossier] = useState(false);

  const isLicence = user?.niveau?.includes('Licence');
  const isMaster = user?.niveau?.includes('Master');

  const dossiersFiltres = mockDossiers.filter(dossier => {
    const matchStatut = !filtreStatut || dossier.statut === filtreStatut;
    const matchType = !filtreType || dossier.type === filtreType;
    const matchRecherche = !recherche || 
      dossier.sujet.toLowerCase().includes(recherche.toLowerCase()) ||
      dossier.encadreur.toLowerCase().includes(recherche.toLowerCase()) ||
      (dossier.entreprise && dossier.entreprise.toLowerCase().includes(recherche.toLowerCase()));
    
    return matchStatut && matchType && matchRecherche;
  });

  const dernier = dossiersFiltres[0];
  const statistiques = {
    total: mockDossiers.length,
    soutenus: mockDossiers.filter(d => d.statut === 'Soutenu').length,
    programmes: mockDossiers.filter(d => d.statut === 'Programmé').length,
    enCours: mockDossiers.filter(d => ['En révision', 'Brouillon', 'En attente'].includes(d.statut)).length,
    moyenneEcrite: mockDossiers.filter(d => d.note).reduce((acc, d) => acc + (d.note || 0), 0) / mockDossiers.filter(d => d.note).length || 0,
    moyenneOrale: mockDossiers.filter(d => d.noteOrale).reduce((acc, d) => acc + (d.noteOrale || 0), 0) / mockDossiers.filter(d => d.noteOrale).length || 0
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {isLicence ? 'Suivi du Rapport de Stage' : 'Suivi du Mémoire'}
          </h1>
          <p className="text-slate-600">
            {isLicence 
              ? 'Gérez votre rapport de stage et préparez votre soutenance'
              : 'Gérez votre mémoire de fin d\'études et préparez votre soutenance'
            }
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Dossiers</p>
                <p className="text-2xl font-bold text-slate-900">{statistiques.total}</p>
              </div>
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <FiFileText className="h-6 w-6 text-primary" />
        </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Soutenus</p>
                <p className="text-2xl font-bold text-emerald-600">{statistiques.soutenus}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <FiMic className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Programmés</p>
                <p className="text-2xl font-bold text-purple-600">{statistiques.programmes}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FiCalendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Moyenne Écrite</p>
                <p className="text-2xl font-bold text-primary">{statistiques.moyenneEcrite.toFixed(1)}/20</p>
              </div>
                              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FiEdit3 className="h-6 w-6 text-primary" />
                </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Moyenne Orale</p>
                <p className="text-2xl font-bold text-green-600">{statistiques.moyenneOrale.toFixed(1)}/20</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FiMic className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Infos étudiant */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <FiUser className="h-5 w-5 mr-2" />
                Informations Étudiant
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-slate-600">Nom et prénom</span>
                    <p className="text-slate-900 font-semibold">{user?.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-600">Email</span>
                    <p className="text-slate-900">{user?.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-600">Niveau</span>
                    <p className="text-slate-900 font-semibold">{user?.niveau}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-slate-600">Numéro étudiant</span>
                    <p className="text-slate-900">{user?.numero}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-600">Département</span>
                    <p className="text-slate-900">{user?.departement}</p>
                  </div>
                  {isMaster && user?.binome && (
                    <div>
                      <span className="text-sm font-medium text-slate-600">Binôme</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <FiUsers className="h-4 w-4 text-slate-600" />
                        <p className="text-slate-900">{user.binome.name}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Dernier dossier */}
            {dernier && (
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-900">
                    {isLicence ? 'Rapport de Stage Actuel' : 'Mémoire Actuel'}
                  </h2>
                  <div className="flex items-center space-x-2">
                    {(() => {
                      const config = getStatutConfig(dernier.statut);
                      const IconComponent = config.icon;
                      return (
                        <>
                          <IconComponent className={`h-4 w-4 ${config.iconColor}`} />
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
                            {dernier.statut}
                          </span>
                        </>
                      );
                    })()}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      {(() => {
                        const TypeIcon = getTypeIcon(dernier.type);
                        return (
                          <>
                            <TypeIcon className="h-4 w-4 text-slate-600" />
                            <span className="text-sm font-medium text-slate-600">Type:</span>
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${getTypeColor(dernier.type)}`}>
                              {dernier.type}
                            </span>
                          </>
                        );
                      })()}
                    </div>
                    <div className="flex items-center space-x-2">
                      <FiUser className="h-4 w-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-600">Encadreur:</span>
                      <span className="text-slate-900">{dernier.encadreur}</span>
                    </div>
                    {dernier.entreprise && (
                      <div className="flex items-center space-x-2">
                        <FiBriefcase className="h-4 w-4 text-slate-600" />
                        <span className="text-sm font-medium text-slate-600">Entreprise:</span>
                        <span className="text-slate-900">{dernier.entreprise}</span>
                      </div>
                    )}
                    {dernier.binome && (
                      <div className="flex items-center space-x-2">
                        <FiUsers className="h-4 w-4 text-slate-600" />
                        <span className="text-sm font-medium text-slate-600">Binôme:</span>
                        <span className="text-slate-900">{dernier.binome}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <FiCalendar className="h-4 w-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-600">Date de dépôt:</span>
                      <span className="text-slate-900">{new Date(dernier.dateDepot).toLocaleDateString()}</span>
                    </div>
                    {dernier.dateSoutenance && (
                      <div className="flex items-center space-x-2">
                        <FiMic className="h-4 w-4 text-slate-600" />
                        <span className="text-sm font-medium text-slate-600">Soutenance:</span>
                        <span className="text-slate-900">{new Date(dernier.dateSoutenance).toLocaleDateString()}</span>
                      </div>
                    )}
                    {dernier.dureeStage && (
                      <div className="flex items-center space-x-2">
                        <FiClock className="h-4 w-4 text-slate-600" />
                        <span className="text-sm font-medium text-slate-600">Durée stage:</span>
                        <span className="text-slate-900">{dernier.dureeStage}</span>
                      </div>
                    )}
                    <div className="space-y-1">
                      {dernier.note && (
                        <div className="flex items-center space-x-2">
                          <FiEdit3 className="h-4 w-4 text-slate-600" />
                          <span className="text-sm font-medium text-slate-600">Note écrite:</span>
                          <span className="text-slate-900 font-semibold">{dernier.note}/20</span>
                        </div>
                      )}
                      {dernier.noteOrale && (
                        <div className="flex items-center space-x-2">
                          <FiMic className="h-4 w-4 text-slate-600" />
                          <span className="text-sm font-medium text-slate-600">Note orale:</span>
                          <span className="text-slate-900 font-semibold">{dernier.noteOrale}/20</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-slate-900 mb-2">{dernier.sujet}</h3>
                  {dernier.commentaires && (
                    <p className="text-slate-600 text-sm bg-slate-50 p-3 rounded-lg">
                      {dernier.commentaires}
                    </p>
                  )}
                </div>

                {/* Jury */}
                {dernier.jury && dernier.jury.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-slate-600 mb-2">Composition du jury:</h4>
                    <div className="flex flex-wrap gap-2">
                      {dernier.jury.map((membre, index) => (
                        <span key={index} className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full">
                          {membre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Progression */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-slate-600 mb-2">
                    <span>Progression</span>
                    <span className="font-semibold">{dernier.progression}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${dernier.progression}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {dernier.fichier && (
                    <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                      <FiDownload className="h-4 w-4" />
                      <span>Télécharger ({dernier.taille})</span>
                    </button>
                  )}
                  <button 
                    onClick={() => setDossierSelectionne(dernier)}
                    className="flex items-center space-x-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <FiEye className="h-4 w-4" />
                    <span>Voir détails</span>
                  </button>
                  {dernier.statut === 'Programmé' && (
                    <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                      <FiMic className="h-4 w-4" />
                      <span>Préparer soutenance</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Historique des dossiers */}
            <div className="bg-white rounded-xl border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-xl font-bold text-slate-900">Historique</h2>
                  
                  {/* Filtres et recherche */}
                  <div className="flex flex-wrap gap-3">
                    <div className="relative">
                      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Rechercher..."
                        value={recherche}
                        onChange={(e) => setRecherche(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    
                    <select
                      value={filtreStatut}
                      onChange={(e) => setFiltreStatut(e.target.value)}
                      className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Tous statuts</option>
                      <option value="Soutenu">Soutenu</option>
                      <option value="Programmé">Programmé</option>
                      <option value="Validé">Validé</option>
                      <option value="En révision">En révision</option>
                      <option value="Brouillon">Brouillon</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        {isLicence ? 'Rapport & Entreprise' : 'Mémoire & Sujet'}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Encadreur</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Dates</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Notes</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {dossiersFiltres.map(dossier => {
                      const TypeIcon = getTypeIcon(dossier.type);
                      const config = getStatutConfig(dossier.statut);
                      const StatusIcon = config.icon;
                      
                      return (
                        <tr key={dossier.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-start space-x-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getTypeColor(dossier.type)}`}>
                                <TypeIcon className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="font-medium text-slate-900">{dossier.sujet}</div>
                                <div className="text-sm text-slate-600">{dossier.type}</div>
                                {dossier.entreprise && (
                                  <div className="text-xs text-slate-500 flex items-center mt-1">
                                    <FiBriefcase className="h-3 w-3 mr-1" />
                                    {dossier.entreprise}
                                  </div>
                                )}
                                {dossier.binome && (
                                  <div className="text-xs text-slate-500 flex items-center mt-1">
                                    <FiUsers className="h-3 w-3 mr-1" />
                                    Binôme: {dossier.binome}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-slate-900">{dossier.encadreur}</div>
                            {dossier.maitreStagе && (
                              <div className="text-xs text-slate-500">
                                Maître de stage: {dossier.maitreStagе}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-slate-900">
                              Dépôt: {new Date(dossier.dateDepot).toLocaleDateString()}
                            </div>
                            {dossier.dateSoutenance && (
                              <div className="text-xs text-slate-600 flex items-center mt-1">
                                <FiMic className="h-3 w-3 mr-1" />
                                Soutenance: {new Date(dossier.dateSoutenance).toLocaleDateString()}
                              </div>
                            )}
                            {dossier.dureeStage && (
                              <div className="text-xs text-slate-500">
                                Durée: {dossier.dureeStage}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-1">
                              <StatusIcon className={`h-4 w-4 ${config.iconColor}`} />
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
                                {dossier.statut}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              {dossier.note && (
                                <div className="text-xs text-slate-600 flex items-center">
                                  <FiEdit3 className="h-3 w-3 mr-1" />
                                  Écrit: <span className="font-semibold ml-1">{dossier.note}/20</span>
                                </div>
                              )}
                              {dossier.noteOrale && (
                                <div className="text-xs text-slate-600 flex items-center">
                                  <FiMic className="h-3 w-3 mr-1" />
                                  Oral: <span className="font-semibold ml-1">{dossier.noteOrale}/20</span>
                                </div>
                              )}
                              {dossier.note && dossier.noteOrale && (
                                <div className="text-xs text-slate-900 font-semibold">
                                  Moyenne: {((dossier.note + dossier.noteOrale) / 2).toFixed(1)}/20
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              {dossier.fichier && (
                                <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors" title="Télécharger">
                                  <FiDownload className="h-4 w-4" />
                                </button>
                              )}
                              <button 
                                onClick={() => setDossierSelectionne(dossier)}
                                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" 
                                title="Voir détails"
                              >
                                <FiEye className="h-4 w-4" />
                              </button>
                              <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Plus d'options">
                                <FiMoreVertical className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {dossiersFiltres.length === 0 && (
                <div className="p-8 text-center">
                  <FiFileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">Aucun dossier trouvé</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions rapides */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Actions Rapides</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setShowNouveauDossier(true)}
                  className="w-full flex items-center space-x-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <FiPlus className="h-4 w-4" />
                  <span>
                    {isLicence ? 'Nouveau Rapport de Stage' : 'Nouveau Mémoire'}
                  </span>
                </button>
                <button className="w-full flex items-center space-x-2 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                  <FiUpload className="h-4 w-4" />
                  <span>Importer Fichier</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-4 py-3 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors">
                  <FiMic className="h-4 w-4" />
                  <span>Planifier Soutenance</span>
                </button>
              </div>
            </div>

            {/* Conseils selon le niveau */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
              <h3 className="text-lg font-bold text-primary mb-3">💡 Conseils</h3>
              <ul className="space-y-2 text-sm text-primary/80">
                {isLicence ? (
                  <>
                    <li>• Choisissez une entreprise en rapport avec votre formation</li>
                    <li>• Respectez la durée minimale de stage (3-4 mois)</li>
                    <li>• Préparez bien votre présentation orale (15-20 min)</li>
                    <li>• Analysez les problématiques rencontrées en entreprise</li>
                    <li>• Documentez vos réalisations avec des captures d'écran</li>
                  </>
                ) : (
                  <>
                    <li>• Travail individuel ou en binôme selon votre choix</li>
                    <li>• Choisissez un sujet innovant et réalisable</li>
                    <li>• Préparez une soutenance de 30-40 minutes</li>
                    <li>• Respectez les normes de rédaction académique</li>
                    <li>• Planifiez votre travail sur toute l'année</li>
                  </>
                )}
              </ul>
            </div>

            {/* Informations sur la soutenance */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                <FiTarget className="inline h-5 w-5 mr-2" />
                {isLicence ? 'Soutenance de Stage' : 'Soutenance de Mémoire'}
              </h3>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center space-x-2">
                  <FiClock className="h-4 w-4" />
                  <span>Durée: {isLicence ? '15-20 minutes' : '30-40 minutes'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiUsers className="h-4 w-4" />
                  <span>Jury: {isLicence ? '2-3 membres' : '3-4 membres'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiBook className="h-4 w-4" />
                  <span>Support: Présentation obligatoire</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiCalendar className="h-4 w-4" />
                  <span>Période: {isLicence ? 'Septembre-Octobre' : 'Juin-Juillet'}</span>
                </div>
              </div>
            </div>

            {/* Échéances importantes */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Échéances 2024</h3>
              <div className="space-y-3">
                {isLicence ? (
                  <>
                    <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div>
                        <p className="font-medium text-red-900 text-sm">Dépôt rapport final</p>
                        <p className="text-red-700 text-xs">15 septembre 2024</p>
                      </div>
                      <span className="text-red-600 text-xs font-bold">Passé</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div>
                        <p className="font-medium text-amber-900 text-sm">Soutenance orale</p>
                        <p className="text-amber-700 text-xs">25 septembre 2024</p>
                      </div>
                      <span className="text-amber-600 text-xs font-bold">Passé</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div>
                        <p className="font-medium text-red-900 text-sm">Dépôt final mémoire</p>
                        <p className="text-red-700 text-xs">15 juin 2024</p>
                      </div>
                      <span className="text-red-600 text-xs font-bold">Passé</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div>
                        <p className="font-medium text-green-900 text-sm">Soutenances</p>
                        <p className="text-green-700 text-xs">20-30 juin 2024</p>
                      </div>
                      <span className="text-green-600 text-xs font-bold">Terminé</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Ressources */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Ressources Utiles</h3>
              <div className="space-y-3">
                <a href="#" className="flex items-center space-x-2 text-slate-600 hover:text-primary transition-colors">
                  <FiBook className="h-4 w-4" />
                  <span>
                    {isLicence ? 'Guide de rédaction rapport' : 'Guide de rédaction mémoire'}
                  </span>
                </a>
                <a href="#" className="flex items-center space-x-2 text-slate-600 hover:text-primary transition-colors">
                  <FiFileText className="h-4 w-4" />
                  <span>Modèle de document</span>
                </a>
                <a href="#" className="flex items-center space-x-2 text-slate-600 hover:text-primary transition-colors">
                  <FiMic className="h-4 w-4" />
                  <span>Conseils pour la soutenance</span>
                </a>
                <a href="#" className="flex items-center space-x-2 text-slate-600 hover:text-primary transition-colors">
                  <FiCalendar className="h-4 w-4" />
                  <span>Calendrier académique</span>
                </a>
                {isLicence && (
                  <a href="#" className="flex items-center space-x-2 text-slate-600 hover:text-primary transition-colors">
                    <FiBriefcase className="h-4 w-4" />
                    <span>Annuaire des entreprises</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal détail dossier */}
        {dossierSelectionne && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {(() => {
                        const TypeIcon = getTypeIcon(dossierSelectionne.type);
                        return (
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(dossierSelectionne.type)}`}>
                            <TypeIcon className="h-5 w-5" />
                          </div>
                        );
                      })()}
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900">{dossierSelectionne.sujet}</h2>
                        <p className="text-slate-600">{dossierSelectionne.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {(() => {
                        const config = getStatutConfig(dossierSelectionne.statut);
                        const IconComponent = config.icon;
                        return (
                          <>
                            <IconComponent className={`h-4 w-4 ${config.iconColor}`} />
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
                              {dossierSelectionne.statut}
                            </span>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  <button 
                    onClick={() => setDossierSelectionne(null)}
                    className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-lg transition-colors"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Informations principales */}
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-4">Informations Générales</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <FiUser className="h-4 w-4 text-slate-600" />
                            <span className="text-sm font-medium text-slate-600">Encadreur:</span>
                            <span className="text-slate-900">{dossierSelectionne.encadreur}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FiCalendar className="h-4 w-4 text-slate-600" />
                            <span className="text-sm font-medium text-slate-600">Date de dépôt:</span>
                            <span className="text-slate-900">{new Date(dossierSelectionne.dateDepot).toLocaleDateString()}</span>
                          </div>
                          {dossierSelectionne.entreprise && (
                            <div className="flex items-center space-x-2">
                              <FiBriefcase className="h-4 w-4 text-slate-600" />
                              <span className="text-sm font-medium text-slate-600">Entreprise:</span>
                              <span className="text-slate-900">{dossierSelectionne.entreprise}</span>
                            </div>
                          )}
                          {dossierSelectionne.maitreStagе && (
                            <div className="flex items-center space-x-2">
                              <FiUser className="h-4 w-4 text-slate-600" />
                              <span className="text-sm font-medium text-slate-600">Maître de stage:</span>
                              <span className="text-slate-900">{dossierSelectionne.maitreStagе}</span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-3">
                          {dossierSelectionne.dateSoutenance && (
                            <div className="flex items-center space-x-2">
                              <FiMic className="h-4 w-4 text-slate-600" />
                              <span className="text-sm font-medium text-slate-600">Soutenance:</span>
                              <span className="text-slate-900">{new Date(dossierSelectionne.dateSoutenance).toLocaleDateString()}</span>
                            </div>
                          )}
                          {dossierSelectionne.dureeStage && (
                            <div className="flex items-center space-x-2">
                              <FiClock className="h-4 w-4 text-slate-600" />
                              <span className="text-sm font-medium text-slate-600">Durée stage:</span>
                              <span className="text-slate-900">{dossierSelectionne.dureeStage}</span>
                            </div>
                          )}
                          {dossierSelectionne.binome && (
                            <div className="flex items-center space-x-2">
                              <FiUsers className="h-4 w-4 text-slate-600" />
                              <span className="text-sm font-medium text-slate-600">Binôme:</span>
                              <span className="text-slate-900">{dossierSelectionne.binome}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Jury */}
                    {dossierSelectionne.jury && dossierSelectionne.jury.length > 0 && (
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Composition du Jury</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {dossierSelectionne.jury.map((membre, index) => (
                            <div key={index} className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg">
                              <FiUser className="h-4 w-4 text-slate-600" />
                              <span className="text-slate-900">{membre}</span>
                              {index === 0 && (
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Président</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {(dossierSelectionne.note || dossierSelectionne.noteOrale) && (
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Évaluation</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {dossierSelectionne.note && (
                            <div className="text-center p-4 bg-primary/5 rounded-lg">
                              <FiEdit3 className="h-6 w-6 text-primary mx-auto mb-2" />
                              <p className="text-sm text-primary font-medium">Note Écrite</p>
                              <p className="text-2xl font-bold text-primary">{dossierSelectionne.note}/20</p>
                            </div>
                          )}
                          {dossierSelectionne.noteOrale && (
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                              <FiMic className="h-6 w-6 text-green-600 mx-auto mb-2" />
                              <p className="text-sm text-green-600 font-medium">Note Orale</p>
                              <p className="text-2xl font-bold text-green-900">{dossierSelectionne.noteOrale}/20</p>
                            </div>
                          )}
                          {dossierSelectionne.note && dossierSelectionne.noteOrale && (
                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                              <FiTrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                              <p className="text-sm text-purple-600 font-medium">Moyenne</p>
                              <p className="text-2xl font-bold text-purple-900">
                                {((dossierSelectionne.note + dossierSelectionne.noteOrale) / 2).toFixed(1)}/20
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Commentaires */}
                    {dossierSelectionne.commentaires && (
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Commentaires du Jury</h3>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                          <p className="text-slate-700 leading-relaxed">{dossierSelectionne.commentaires}</p>
                        </div>
                      </div>
                    )}

                    {/* Fichier */}
                    {dossierSelectionne.fichier && (
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Document</h3>
                        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <FiFileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{dossierSelectionne.fichier}</p>
                              <p className="text-sm text-slate-600">{dossierSelectionne.taille}</p>
                            </div>
                          </div>
                          <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                            <FiDownload className="h-4 w-4" />
                            <span>Télécharger</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-4">Actions</h3>
                      <div className="space-y-3">
                        <button className="w-full flex items-center space-x-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                          <FiEdit3 className="h-4 w-4" />
                          <span>Modifier</span>
                        </button>
                        {dossierSelectionne.fichier && (
                          <button className="w-full flex items-center space-x-2 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                            <FiDownload className="h-4 w-4" />
                            <span>Télécharger</span>
                          </button>
                        )}
                        {dossierSelectionne.statut === 'Programmé' && (
                          <button className="w-full flex items-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                            <FiMic className="h-4 w-4" />
                            <span>Préparer Soutenance</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-4">Progression</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm text-slate-600">
                          <span>Avancement</span>
                          <span className="font-semibold">{dossierSelectionne.progression}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3">
                          <div 
                            className="bg-primary h-3 rounded-full transition-all duration-300"
                            style={{ width: `${dossierSelectionne.progression}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-slate-600">
                          {dossierSelectionne.progression === 100 ? 'Travail terminé' : 
                           dossierSelectionne.progression >= 75 ? 'Presque terminé' :
                           dossierSelectionne.progression >= 50 ? 'En bonne voie' :
                           dossierSelectionne.progression >= 25 ? 'En cours' : 'Début du travail'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal nouveau dossier */}
        {showNouveauDossier && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-900">
                    {isLicence ? 'Nouveau Rapport de Stage' : 'Nouveau Mémoire'}
                  </h2>
                  <button 
                    onClick={() => setShowNouveauDossier(false)}
                    className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-lg transition-colors"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Encadreur</label>
                      <select className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                        <option>Pr. Abdoulaye Ndiaye</option>
                        <option>Dr. Fatou Diop</option>
                        <option>M. Ousmane Kane</option>
                        <option>Dr. Aminata Sow</option>
                        <option>Pr. Moussa Sarr</option>
                        <option>Dr. Ibrahima Fall</option>
                      </select>
                    </div>
                    {isMaster && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Mode de travail</label>
                        <select className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                          <option value="individuel">Individuel</option>
                          <option value="binome">En binôme</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {isLicence && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Entreprise d'accueil</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Nom de l'entreprise"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Maître de stage</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Nom du maître de stage"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Date de début</label>
                          <input 
                            type="date" 
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Date de fin</label>
                          <input 
                            type="date" 
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {isMaster && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                              <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Date de début souhaitée</label>
                          <input 
                            type="date" 
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                                              <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Date de soutenance prévue</label>
                          <input 
                            type="date" 
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          />
                        </div>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Sujet / Titre</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder={isLicence 
                        ? "Titre du rapport de stage..." 
                        : "Titre du mémoire..."
                      }
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Description du projet</label>
                    <textarea 
                      rows={4}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      placeholder={isLicence 
                        ? "Décrivez les missions et objectifs du stage..." 
                        : "Décrivez la problématique et les objectifs du mémoire..."
                      }
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {isLicence ? 'Convention de stage' : 'Proposition de sujet'} (optionnel)
                    </label>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors cursor-pointer">
                      <FiUpload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-600">Glissez votre fichier ici ou cliquez pour parcourir</p>
                      <p className="text-xs text-slate-500 mt-1">PDF, DOC, DOCX jusqu'à 10MB</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                    <button 
                      type="button"
                      onClick={() => setShowNouveauDossier(false)}
                      className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      Annuler
                    </button>
                    <button 
                      type="submit"
                      className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      {isLicence ? 'Créer le rapport' : 'Créer le mémoire'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DossierSuivi;