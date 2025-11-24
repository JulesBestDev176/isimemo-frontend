import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Gavel, 
  FileText, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  MapPin, 
  Clock,
  Users,
  Search,
  AlertCircle,
  Download,
  FileCheck
} from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { 
  getSoutenancesByProfesseur, 
  getRoleJuryByProfesseur,
  hasSoutenancesAssignees,
  type Soutenance,
  StatutSoutenance,
  ModeSoutenance
} from '../../models/soutenance';
import { RoleJury } from '../../models/soutenance/MembreJury';
import { getProfesseurIdByEmail } from '../../models/acteurs/Professeur';
import { 
  getProcessVerbalBySoutenance,
  hasProfesseurApprouve,
  isProcessVerbalCompletementApprouve,
  type ProcessVerbal,
  Mention
} from '../../models/soutenance/ProcessVerbal';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getAnneeAcademiqueCourante, isAnneeAcademiqueTerminee } from '../../utils/anneeAcademique';
import SoutenanceDetail from './SoutenanceDetail';

const EspaceJury: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatut, setFilterStatut] = useState<'toutes' | 'planifiees' | 'terminees'>('toutes');
  const [selectedSoutenance, setSelectedSoutenance] = useState<Soutenance | null>(null);

  // Récupérer l'ID professeur à partir de l'email (mapping User -> Professeur)
  const idProfesseur = useMemo(() => {
    if (!user?.email) return 0;
    return getProfesseurIdByEmail(user.email) || 0;
  }, [user?.email]);

  // Vérifier que l'utilisateur est un jury ET a des soutenances assignées ET que l'année académique en cours n'est pas terminée
  // Exception : le chef de département garde toujours son rôle
  // Un professeur n'est membre du jury actif que s'il a des soutenances assignées
  const anneeCourante = getAnneeAcademiqueCourante();
  const anneeTerminee = isAnneeAcademiqueTerminee(anneeCourante);
  const estChef = user?.estChef;
  const aSoutenancesAssignees = idProfesseur > 0 ? hasSoutenancesAssignees(idProfesseur) : false;
  const hasRoleJuryActif = user?.estJurie && aSoutenancesAssignees && (!anneeTerminee || estChef);
  
  if (!hasRoleJuryActif) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès restreint</h2>
          <p className="text-gray-600 mb-4">
            {!aSoutenancesAssignees
              ? 'Vous n\'êtes actuellement membre d\'aucun jury de soutenance pour cette année académique.'
              : anneeTerminee 
                ? 'L\'année académique est terminée. Vous n\'avez plus accès à l\'espace jury pour cette session.'
                : 'Cette page est réservée aux membres du jury.'}
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            Retour au tableau de bord
          </Button>
        </div>
      </div>
    );
  }

  // Récupérer les soutenances où le professeur est membre du jury
  const soutenances = useMemo(() => {
    if (idProfesseur === 0) return [];
    return getSoutenancesByProfesseur(idProfesseur);
  }, [idProfesseur]);

  // Filtrer les soutenances
  const soutenancesFiltrees = useMemo(() => {
    let filtered = soutenances;

    // Filtre par statut
    if (filterStatut === 'planifiees') {
      filtered = filtered.filter(s => s.statut === StatutSoutenance.PLANIFIEE);
    } else if (filterStatut === 'terminees') {
      filtered = filtered.filter(s => s.statut === StatutSoutenance.TERMINEE);
    }

    // Filtre par recherche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s => {
        // Rechercher dans tous les dossiers de la soutenance
        const dossiers = s.dossiersMemoire || (s.dossierMemoire ? [s.dossierMemoire] : []);
        return dossiers.some(dossier => {
          const candidats = dossier?.candidats || [];
          const nomsCandidats = candidats.map(c => `${c.prenom} ${c.nom}`.toLowerCase()).join(' ');
          const titreMemoire = dossier?.titre?.toLowerCase() || '';
          return nomsCandidats.includes(query) || titreMemoire.includes(query);
        });
      });
    }

    return filtered;
  }, [soutenances, filterStatut, searchQuery]);

  // Obtenir le rôle du professeur dans une soutenance
  const getRoleInSoutenance = (soutenance: Soutenance): RoleJury | undefined => {
    return getRoleJuryByProfesseur(soutenance, idProfesseur);
  };

  // Obtenir le libellé du rôle
  const getRoleLabel = (role?: RoleJury): string => {
    switch (role) {
      case RoleJury.PRESIDENT:
        return 'Président';
      case RoleJury.RAPPORTEUR:
        return 'Rapporteur';
      case RoleJury.EXAMINATEUR:
        return 'Examinateur';
      case RoleJury.ENCADRANT:
        return 'Encadrant';
      default:
        return 'Membre';
    }
  };

  // Obtenir la couleur du badge de rôle
  const getRoleBadgeColor = (role?: RoleJury): string => {
    switch (role) {
      case RoleJury.PRESIDENT:
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case RoleJury.RAPPORTEUR:
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case RoleJury.EXAMINATEUR:
        return 'bg-green-50 text-green-700 border-green-200';
      case RoleJury.ENCADRANT:
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Obtenir la couleur du badge de statut
  const getStatutBadgeColor = (statut: StatutSoutenance): string => {
    switch (statut) {
      case StatutSoutenance.PLANIFIEE:
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case StatutSoutenance.EN_COURS:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case StatutSoutenance.TERMINEE:
        return 'bg-green-50 text-green-700 border-green-200';
      case StatutSoutenance.ANNULEE:
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Obtenir le libellé du statut
  const getStatutLabel = (statut: StatutSoutenance): string => {
    switch (statut) {
      case StatutSoutenance.PLANIFIEE:
        return 'Planifiée';
      case StatutSoutenance.EN_COURS:
        return 'En cours';
      case StatutSoutenance.TERMINEE:
        return 'Terminée';
      case StatutSoutenance.ANNULEE:
        return 'Annulée';
      default:
        return statut;
    }
  };

  // Obtenir le libellé du mode
  const getModeLabel = (mode: ModeSoutenance): string => {
    switch (mode) {
      case ModeSoutenance.PRESENTIEL:
        return 'Présentiel';
      case ModeSoutenance.DISTANCIEL:
        return 'Distanciel';
      case ModeSoutenance.HYBRIDE:
        return 'Hybride';
      default:
        return mode;
    }
  };

  if (soutenances.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Gavel className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Aucune soutenance assignée</h2>
          <p className="text-gray-600">Vous n'êtes actuellement membre d'aucun jury de soutenance.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Espace Jury</h1>
          <p className="text-gray-600 mt-1">Gérez vos soutenances en tant que membre du jury</p>
        </div>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Rechercher par candidat ou titre du mémoire..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div>
              <select
                value={filterStatut}
                onChange={(e) => setFilterStatut(e.target.value as 'toutes' | 'planifiees' | 'terminees')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="toutes">Toutes les soutenances</option>
                <option value="planifiees">Planifiées</option>
                <option value="terminees">Terminées</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des soutenances */}
      <div className="space-y-4">
        {soutenancesFiltrees.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Gavel className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune soutenance trouvée</h3>
              <p className="text-gray-600">Aucune soutenance ne correspond à vos critères de recherche.</p>
            </CardContent>
          </Card>
        ) : (
          soutenancesFiltrees.map((soutenance) => {
            const role = getRoleInSoutenance(soutenance);
            const pv = getProcessVerbalBySoutenance(soutenance.idSoutenance);
            // Récupérer tous les dossiers de la soutenance (support pour plusieurs candidats)
            const dossiers = soutenance.dossiersMemoire || (soutenance.dossierMemoire ? [soutenance.dossierMemoire] : []);
            const tousLesCandidats = dossiers.flatMap(d => d?.candidats || []);
            const isPresident = role === RoleJury.PRESIDENT;
            const hasApprouve = pv ? hasProfesseurApprouve(pv, idProfesseur) : false;
            const isCompletementApprouve = pv ? isProcessVerbalCompletementApprouve(pv) : false;

            return (
              <motion.div
                key={soutenance.idSoutenance}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Gavel className="h-5 w-5 text-primary" />
                          <CardTitle className="text-xl">
                            Jury {soutenance.idSoutenance} - {format(soutenance.dateSoutenance, 'EEEE d MMMM yyyy', { locale: fr })}
                          </CardTitle>
                        </div>
                        <CardDescription>
                          {tousLesCandidats.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              <span className="font-medium">{tousLesCandidats.length} candidat(s) :</span>
                              {tousLesCandidats.map((candidat, idx) => (
                                <span key={candidat.idCandidat}>
                                  {candidat.prenom} {candidat.nom}
                                  {idx < tousLesCandidats.length - 1 && ', '}
                                </span>
                              ))}
                            </div>
                          ) : (
                            'Aucun candidat spécifié'
                          )}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <Badge className={getRoleBadgeColor(role)}>
                          {getRoleLabel(role)}
                        </Badge>
                        <Badge className={getStatutBadgeColor(soutenance.statut)}>
                          {getStatutLabel(soutenance.statut)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="font-medium">Date:</span>
                          <span className="ml-2">
                            {format(soutenance.dateSoutenance, 'EEEE d MMMM yyyy', { locale: fr })}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="font-medium">Heure:</span>
                          <span className="ml-2">
                            {soutenance.heureDebut} - {soutenance.heureFin}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="font-medium">Lieu:</span>
                          <span className="ml-2">
                            {soutenance.mode === ModeSoutenance.PRESENTIEL && soutenance.salle
                              ? `Salle ${soutenance.salle.nom} - ${soutenance.salle.batiment}`
                              : getModeLabel(soutenance.mode)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="font-medium">Candidats:</span>
                          <span className="ml-2">
                            {tousLesCandidats.length} candidat(s)
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="font-medium">Jury:</span>
                          <span className="ml-2">
                            {soutenance.jury?.length || 0} membre(s)
                          </span>
                        </div>
                        {pv && (
                          <div className="flex items-center text-sm text-gray-600">
                            <FileCheck className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="font-medium">Procès-verbal:</span>
                            <span className="ml-2">
                              {isCompletementApprouve ? (
                                <Badge className="bg-green-50 text-green-700 border-green-200">
                                  Signé ({pv.nombreSignatures}/3)
                                </Badge>
                              ) : (
                                <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                  En attente ({pv.nombreSignatures}/3)
                                </Badge>
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedSoutenance(soutenance)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Consulter
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Modal de détail de soutenance */}
      {selectedSoutenance && (
        <SoutenanceDetail
          soutenance={selectedSoutenance}
          idProfesseur={idProfesseur}
          onClose={() => setSelectedSoutenance(null)}
        />
      )}
    </div>
  );
};

export default EspaceJury;

