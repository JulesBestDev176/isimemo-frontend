import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Inbox,
  Calendar,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Check,
  X,
  User,
  AlertCircle,
  Settings,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { 
  DemandeEncadrement, 
  StatutDemandeEncadrement,
  getDemandesEncadrementByProfesseur,
  Encadrement, 
  StatutEncadrement,
  getEncadrementsByProfesseur,
  getEncadrementsActifs
} from '../../models';

// Badge Component - Palette simplifiée (3 couleurs)
const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'success' | 'info' | 'neutral';
}> = ({ children, variant = 'neutral' }) => {
  const variants = {
    success: 'bg-green-50 text-green-700 border border-green-200',
    info: 'bg-blue-50 text-blue-700 border border-blue-200',
    neutral: 'bg-gray-50 text-gray-700 border border-gray-200'
  };
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

// Formatage des dates
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric'
  });
};

// Obtenir l'année académique actuelle
const getCurrentAnneeAcademique = (): string => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 0-indexed
  
  // Si on est entre janvier et août, on est dans l'année académique précédente
  // Sinon, on est dans la nouvelle année académique
  if (currentMonth >= 1 && currentMonth <= 8) {
    return `${currentYear - 1}-${currentYear}`;
  } else {
    return `${currentYear}-${currentYear + 1}`;
  }
};

// Tab Button Component
const TabButton: React.FC<{
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  count?: number;
}> = ({ children, isActive, onClick, icon, count }) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200
        ${isActive 
          ? 'border-primary text-primary bg-white' 
          : 'border-transparent text-slate-500 hover:text-primary-700 bg-slate-50'
        }
      `}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
      {count !== undefined && (
        <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
          isActive 
            ? 'bg-primary-50 text-primary-700' 
            : 'bg-slate-200 text-slate-600'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
};

// Composant principal
const Encadrements: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'demandes' | 'encadrements'>('demandes');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatutDemande, setFilterStatutDemande] = useState<StatutDemandeEncadrement | 'tous'>('tous');
  const [selectedDemande, setSelectedDemande] = useState<DemandeEncadrement | null>(null);
  const [showRefuseModal, setShowRefuseModal] = useState(false);

  const [motifRefus, setMotifRefus] = useState('');
  
  // Configuration de la capacité d'encadrement
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configEncadrement, setConfigEncadrement] = useState({
    maxCandidats: 5,
    illimite: false
  });

  const handleSaveConfig = () => {
    console.log('Sauvegarde configuration:', configEncadrement);
    setShowConfigModal(false);
    // TODO: Appel API pour sauvegarder
  };

  // Année académique actuelle
  const anneeAcademiqueActuelle = useMemo(() => getCurrentAnneeAcademique(), []);

  // Récupérer les demandes d'encadrement (filtrées par année académique actuelle)
  // Uniquement pour les encadrants
  const demandes = useMemo(() => {
    if (!user?.id || !user?.estEncadrant) return [];
    const toutesLesDemandes = getDemandesEncadrementByProfesseur(parseInt(user.id));
    // Filtrer uniquement les demandes de l'année académique actuelle
    return toutesLesDemandes.filter(d => d.anneeAcademique === anneeAcademiqueActuelle);
  }, [user, anneeAcademiqueActuelle]);

  // Récupérer l'encadrement actif (un encadrant ne peut avoir qu'un seul encadrement actif)
  const encadrementActif = useMemo(() => {
    if (!user?.id || !user?.estEncadrant) return undefined;
    const encadrementsActifs = getEncadrementsActifs(parseInt(user.id));
    return encadrementsActifs.length > 0 ? encadrementsActifs[0] : undefined;
  }, [user]);

  // Filtrer les demandes
  const demandesFiltrees = useMemo(() => {
    let filtered = demandes;
    if (filterStatutDemande !== 'tous') {
      filtered = filtered.filter(d => d.statut === filterStatutDemande);
    }
    if (searchQuery) {
      filtered = filtered.filter(d => 
        d.candidat?.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.candidat?.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.dossierMemoire?.titre.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [demandes, filterStatutDemande, searchQuery]);

  // Compter les demandes par statut
  const countsDemandes = useMemo(() => ({
    tous: demandes.length,
    enAttente: demandes.filter(d => d.statut === StatutDemandeEncadrement.EN_ATTENTE).length,
    acceptees: demandes.filter(d => d.statut === StatutDemandeEncadrement.ACCEPTEE).length,
    refusees: demandes.filter(d => d.statut === StatutDemandeEncadrement.REFUSEE).length
  }), [demandes]);

  // Accepter une demande
  const handleAccepter = (demande: DemandeEncadrement) => {
    console.log('Accepter demande:', demande);
    setSelectedDemande(null);
  };

  // Refuser une demande
  const handleRefuser = () => {
    if (!selectedDemande || !motifRefus.trim()) return;
    console.log('Refuser demande:', selectedDemande, 'Motif:', motifRefus);
    setShowRefuseModal(false);
    setSelectedDemande(null);
    setMotifRefus('');
  };

  // Obtenir le badge de statut demande - Palette simplifiée (Bleu/Gris)
  const getStatutDemandeBadge = (statut: StatutDemandeEncadrement) => {
    switch (statut) {
      case StatutDemandeEncadrement.EN_ATTENTE:
        return <Badge variant="neutral">En attente</Badge>;
      case StatutDemandeEncadrement.ACCEPTEE:
        return <Badge variant="info">Acceptée</Badge>;
      case StatutDemandeEncadrement.REFUSEE:
        return <Badge variant="neutral">Refusée</Badge>;
      case StatutDemandeEncadrement.ANNULEE:
        return <Badge variant="neutral">Annulée</Badge>;
      default:
        return <Badge variant="neutral">{statut}</Badge>;
    }
  };

  // Obtenir l'icône de statut demande - Couleurs simplifiées (Bleu/Gris)
  const getStatutDemandeIcon = (statut: StatutDemandeEncadrement) => {
    switch (statut) {
      case StatutDemandeEncadrement.EN_ATTENTE:
        return <Clock className="h-5 w-5 text-gray-500" />;
      case StatutDemandeEncadrement.ACCEPTEE:
        return <CheckCircle className="h-5 w-5 text-primary" />;
      case StatutDemandeEncadrement.REFUSEE:
        return <XCircle className="h-5 w-5 text-gray-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  // Obtenir le badge de statut encadrement
  const getStatutEncadrementBadge = (statut: StatutEncadrement) => {
    switch (statut) {
      case StatutEncadrement.ACTIF:
        return <Badge variant="success">Actif</Badge>;
      case StatutEncadrement.TERMINE:
        return <Badge variant="info">Terminé</Badge>;
      case StatutEncadrement.ANNULE:
        return <Badge variant="neutral">Annulé</Badge>;
      default:
        return <Badge variant="neutral">{statut}</Badge>;
    }
  };

  // Vérifier que l'utilisateur est un encadrant
  if (!user?.estEncadrant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès restreint</h2>
          <p className="text-gray-600 mb-4">
            Cette page est réservée aux encadrants. Vous devez être encadrant pour accéder à cette fonctionnalité.
          </p>
          <button
            onClick={() => navigate('/professeur/dashboard')}
            className="px-4 py-2 bg-primary text-white hover:bg-primary-700 transition-colors"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Encadrements</h1>
              <p className="text-sm text-gray-600">
                {user?.estEncadrant 
                  ? (activeTab === 'demandes' 
                      ? 'Gérez les demandes d\'encadrement des étudiants'
                      : 'Consultez vos encadrements en cours')
                  : 'Gérez les demandes d\'encadrement des étudiants'}
              </p>
              <div className="mt-2">
                <Badge variant="info">Année académique : {anneeAcademiqueActuelle}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <button
                onClick={() => setShowConfigModal(true)}
                className="p-2 text-gray-500 hover:text-primary hover:bg-primary-50 rounded-lg transition-colors"
                title="Configurer la capacité d'encadrement"
              >
                <Settings className="h-6 w-6" />
              </button>
              {user?.estEncadrant && activeTab === 'demandes' && (
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{countsDemandes.enAttente}</div>
                  <div className="text-xs text-gray-600">En attente</div>
                </div>
              )}
              {user?.estEncadrant && activeTab === 'encadrements' && (
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{encadrementActif ? '1' : '0'}</div>
                  <div className="text-xs text-gray-600">Encadrement actif</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Onglets - Uniquement pour les encadrants */}
        {user?.estEncadrant && (
          <div className="bg-white border border-gray-200 mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex">
                <TabButton
                  isActive={activeTab === 'demandes'}
                  onClick={() => setActiveTab('demandes')}
                  icon={<Inbox className="h-4 w-4" />}
                  count={countsDemandes.tous}
                >
                  Demandes d'encadrement
                </TabButton>
                <TabButton
                  isActive={activeTab === 'encadrements'}
                  onClick={() => setActiveTab('encadrements')}
                  icon={<Users className="h-4 w-4" />}
                  count={encadrementActif ? 1 : 0}
                >
                  Mon encadrement
                </TabButton>
              </nav>
            </div>
          </div>
        )}

        {/* Contenu */}
        <div className="bg-white border border-gray-200 mb-6 p-6">
          {/* Recherche et Filtres */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={user?.estEncadrant && activeTab === 'encadrements' ? "Rechercher un encadrement..." : "Rechercher une demande..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              {activeTab === 'demandes' && (
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    value={filterStatutDemande}
                    onChange={(e) => setFilterStatutDemande(e.target.value as StatutDemandeEncadrement | 'tous')}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="tous">Tous les statuts</option>
                    <option value={StatutDemandeEncadrement.EN_ATTENTE}>En attente</option>
                    <option value={StatutDemandeEncadrement.ACCEPTEE}>Acceptées</option>
                    <option value={StatutDemandeEncadrement.REFUSEE}>Refusées</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Liste des demandes - Uniquement pour les encadrants */}
          {user?.estEncadrant && activeTab === 'demandes' && demandesFiltrees.length > 0 ? (
            <div className="space-y-4">
              {demandesFiltrees.map((demande, index) => (
                <motion.div
                  key={demande.idDemande}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="p-6 border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start flex-1">
                      <div className="p-3 rounded-lg bg-gray-50 mr-4">
                        {getStatutDemandeIcon(demande.statut)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            Demande #{demande.idDemande}
                          </h3>
                          {getStatutDemandeBadge(demande.statut)}
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>Demandé le {formatDate(demande.dateDemande)}</span>
                          </div>
                          {demande.dateReponse && (
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              <span>Répondu le {formatDate(demande.dateReponse)}</span>
                            </div>
                          )}
                          {demande.candidat && (
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2" />
                              <span>{demande.candidat.prenom} {demande.candidat.nom}</span>
                            </div>
                          )}
                          {demande.dossierMemoire && (
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2" />
                              <span className="font-medium">{demande.dossierMemoire.titre}</span>
                            </div>
                          )}
                          {demande.motifRefus && (
                            <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                              <div className="flex items-start">
                                <AlertCircle className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                                <div>
                                  <div className="text-xs font-medium text-gray-700 mb-1">Motif de refus :</div>
                                  <div className="text-sm text-gray-600">{demande.motifRefus}</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {demande.statut === StatutDemandeEncadrement.EN_ATTENTE && (
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleAccepter(demande)}
                          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
                        >
                          <Check className="h-4 w-4" />
                          Accepter
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDemande(demande);
                            setShowRefuseModal(true);
                          }}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                        >
                          <X className="h-4 w-4" />
                          Refuser
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : user?.estEncadrant && activeTab === 'demandes' ? (
            <div className="text-center py-12">
              <Inbox className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Aucune demande d'encadrement</p>
              <p className="text-sm text-gray-500">
                Les demandes des étudiants apparaîtront ici
              </p>
            </div>
          ) : null}

          {/* Encadrement actif - Un encadrant ne peut avoir qu'un seul encadrement actif */}
          {user?.estEncadrant && activeTab === 'encadrements' && encadrementActif ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="p-6 border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => navigate(`/professeur/encadrements/${encadrementActif.idEncadrement}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start flex-1">
                  <div className="p-3 rounded-lg bg-gray-50 mr-4">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        Mon encadrement actif
                      </h3>
                      {getStatutEncadrementBadge(encadrementActif.statut)}
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      {encadrementActif.dossierMemoire && (
                        <>
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-2" />
                            <span className="font-medium">{encadrementActif.dossierMemoire.titre}</span>
                          </div>
                          {encadrementActif.dossierMemoire.candidats && encadrementActif.dossierMemoire.candidats.length > 0 && (
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2" />
                              <span>
                                {encadrementActif.dossierMemoire.candidats.map(c => `${c.prenom} ${c.nom}`).join(', ')}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Débuté le {formatDate(encadrementActif.dateDebut)}</span>
                      </div>
                      {encadrementActif.dateFin && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>Terminé le {formatDate(encadrementActif.dateFin)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </motion.div>
          ) : user?.estEncadrant && activeTab === 'encadrements' ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Aucun encadrement actif</p>
              <p className="text-sm text-gray-500">
                Vous n'avez actuellement aucun encadrement en cours
              </p>
            </div>
          ) : null}
        </div>

        {/* Modal de refus */}
        <AnimatePresence>
          {showRefuseModal && selectedDemande && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowRefuseModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-lg max-w-md w-full p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Refuser la demande d'encadrement
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Veuillez indiquer le motif du refus de cette demande :
                </p>
                <textarea
                  value={motifRefus}
                  onChange={(e) => setMotifRefus(e.target.value)}
                  placeholder="Motif du refus..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  rows={4}
                />
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowRefuseModal(false);
                      setMotifRefus('');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleRefuser}
                    disabled={!motifRefus.trim()}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Confirmer le refus
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal de configuration */}
        <AnimatePresence>
          {showConfigModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowConfigModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-lg max-w-md w-full p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Configuration de l'encadrement
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="illimite" className="font-medium text-gray-900">
                        Capacité illimitée
                      </label>
                      <p className="text-sm text-gray-500">
                        Accepter un nombre illimité de candidats
                      </p>
                    </div>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                      <input
                        type="checkbox"
                        name="illimite"
                        id="illimite"
                        checked={configEncadrement.illimite}
                        onChange={(e) => setConfigEncadrement({ ...configEncadrement, illimite: e.target.checked })}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 right-6 checked:border-primary"
                        style={{ right: configEncadrement.illimite ? '0' : 'auto', left: configEncadrement.illimite ? 'auto' : '0' }}
                      />
                      <label 
                        htmlFor="illimite" 
                        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${configEncadrement.illimite ? 'bg-primary' : 'bg-gray-300'}`}
                      ></label>
                    </div>
                  </div>

                  {!configEncadrement.illimite && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre maximum de candidats
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={configEncadrement.maxCandidats}
                        onChange={(e) => setConfigEncadrement({ ...configEncadrement, maxCandidats: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Une fois ce nombre atteint, vous ne recevrez plus de nouvelles demandes.
                      </p>
                    </motion.div>
                  )}
                </div>

                <div className="flex justify-end gap-3 mt-8">
                  <button
                    onClick={() => setShowConfigModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSaveConfig}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700"
                  >
                    Enregistrer
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Encadrements;
