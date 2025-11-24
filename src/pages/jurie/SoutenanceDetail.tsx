import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Calendar, 
  MapPin, 
  Clock, 
  Users,
  User,
  ExternalLink
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { 
  type Soutenance,
  ModeSoutenance
} from '../../models/soutenance';
import { RoleJury } from '../../models/soutenance/MembreJury';
import { getMembresBySoutenance } from '../../models/soutenance/MembreJury';
import { getRoleJuryByProfesseur } from '../../models/soutenance';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SoutenanceDetailProps {
  soutenance: Soutenance;
  idProfesseur: number;
  onClose: () => void;
}

const SoutenanceDetail: React.FC<SoutenanceDetailProps> = ({
  soutenance,
  idProfesseur,
  onClose
}) => {
  const navigate = useNavigate();

  const role = getRoleJuryByProfesseur(soutenance, idProfesseur);
  // Récupérer tous les dossiers de la soutenance (support pour plusieurs candidats)
  const dossiers = soutenance.dossiersMemoire || (soutenance.dossierMemoire ? [soutenance.dossierMemoire] : []);
  const tousLesCandidats = dossiers.flatMap(d => d?.candidats || []);

  // Récupérer les membres du jury
  const membresJury = useMemo(() => {
    return getMembresBySoutenance(soutenance.idSoutenance);
  }, [soutenance.idSoutenance]);

  // Fonction pour naviguer vers le détail d'un dossier de candidat
  const handleVoirDossier = (dossierId: number, candidatId: number) => {
    navigate(`/jurie/soutenances/${soutenance.idSoutenance}/dossier/${dossierId}/candidat/${candidatId}`);
  };

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

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white max-w-5xl w-full max-h-[90vh] flex flex-col"
        >
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">Détail de la soutenance</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations de la soutenance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium mr-2">Date:</span>
                      <span>{format(soutenance.dateSoutenance, 'EEEE d MMMM yyyy', { locale: fr })}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium mr-2">Heure:</span>
                      <span>{soutenance.heureDebut} - {soutenance.heureFin}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium mr-2">Lieu:</span>
                      <span>
                        {soutenance.mode === ModeSoutenance.PRESENTIEL && soutenance.salle
                          ? `Salle ${soutenance.salle.nom} - ${soutenance.salle.batiment}`
                          : getModeLabel(soutenance.mode)}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium mr-2">Votre rôle:</span>
                      <Badge className="ml-2">{getRoleLabel(role)}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Liste des candidats ({tousLesCandidats.length})</CardTitle>
                  <CardDescription>
                    Jury {soutenance.idSoutenance} - {format(soutenance.dateSoutenance, 'EEEE d MMMM yyyy', { locale: fr })} de {soutenance.heureDebut} à {soutenance.heureFin}
                    {soutenance.salle && ` - Salle ${soutenance.salle.nom}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {tousLesCandidats.length > 0 ? (
                    <div className="space-y-4">
                      {dossiers.map((dossier, idx) => {
                        const candidatsDossier = dossier?.candidats || [];
                        return (
                          <div key={dossier?.idDossierMemoire || idx} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-gray-900">
                                {dossier?.titre || `Dossier ${idx + 1}`}
                              </h4>
                              <Badge variant="outline">{candidatsDossier.length} candidat(s)</Badge>
                            </div>
                            <div className="space-y-2">
                              {candidatsDossier.map((candidat) => (
                                <div key={candidat.idCandidat} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                                  <div className="flex items-center text-sm">
                                    <User className="h-4 w-4 mr-2 text-gray-400" />
                                    <span className="font-medium mr-2">{candidat.prenom} {candidat.nom}</span>
                                    <span className="text-gray-500">({candidat.email})</span>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleVoirDossier(dossier!.idDossierMemoire, candidat.idCandidat)}
                                    className="flex items-center gap-2"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                    Voir le dossier
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500">Aucun candidat spécifié</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Membres du jury</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {membresJury.map((membre) => (
                      <div key={membre.idMembre} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <span className="font-medium">
                            {membre.professeur?.prenom} {membre.professeur?.nom}
                          </span>
                          <span className="text-sm text-gray-600 ml-2">
                            ({membre.professeur?.email})
                          </span>
                        </div>
                        <Badge>{getRoleLabel(membre.roleJury)}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="p-6 border-t flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SoutenanceDetail;
