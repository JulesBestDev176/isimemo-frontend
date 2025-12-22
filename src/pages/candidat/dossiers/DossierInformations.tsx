import React, { useMemo } from 'react';
import { Clock, UserCheck, Calendar, CheckCircle, FileCheck, AlertCircle, XCircle } from 'lucide-react';
import { DossierMemoire, StatutDossierMemoire, EtapeDossier } from '../../../models/dossier';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { mockSoutenances } from '../../../models/soutenance/Soutenance';
import { useAuth } from '../../../contexts/AuthContext';
import { getEncadrementActifByCandidat } from '../../../models/dossier/Encadrement';
import { getTicketsByDossier, PhaseTicket } from '../../../models/dossier/Ticket';

interface DossierInformationsProps {
  dossier: DossierMemoire;
}

const getEtapeLabel = (etape: EtapeDossier) => {
  const etapes: Record<EtapeDossier, string> = {
    [EtapeDossier.CHOIX_SUJET]: 'Choix du sujet',
    [EtapeDossier.VALIDATION_SUJET]: 'Validation du sujet',
    [EtapeDossier.EN_COURS_REDACTION]: 'Rédaction en cours',
    [EtapeDossier.DEPOT_INTERMEDIAIRE]: 'Dépôt intermédiaire',
    [EtapeDossier.DEPOT_FINAL]: 'Dépôt final',
    [EtapeDossier.SOUTENANCE]: 'Soutenance',
    [EtapeDossier.TERMINE]: 'Terminé'
  };
  return etapes[etape] || etape;
};

const formatDate = (date: Date | string) => {
  if (!date) return 'N/A';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
};

const DossierInformations: React.FC<DossierInformationsProps> = ({ dossier }) => {
  const { user } = useAuth();
  
  const isDossierTermine = useMemo(() => {
    return dossier.statut === StatutDossierMemoire.SOUTENU || 
           dossier.statut === StatutDossierMemoire.DEPOSE ||
           dossier.etape === EtapeDossier.TERMINE;
  }, [dossier.statut, dossier.etape]);

  // Récupérer la date de soutenance pour les dossiers terminés
  const dateSoutenance = useMemo(() => {
    if (!isDossierTermine) return null;
    const soutenance = mockSoutenances.find(s => 
      s.dossierMemoire?.idDossierMemoire === dossier.idDossierMemoire
    );
    return soutenance?.dateSoutenance || null;
  }, [isDossierTermine, dossier.idDossierMemoire]);

  // Récupérer les tickets du dossier
  const ticketsDossier = useMemo(() => {
    return getTicketsByDossier(dossier.idDossierMemoire);
  }, [dossier.idDossierMemoire]);

  // Vérifier si toutes les tâches sont terminées (prérequis pour pré-lecture)
  const toutesTachesTerminees = useMemo(() => {
    if (ticketsDossier.length === 0) return false;
    return ticketsDossier.every(t => t.phase === PhaseTicket.TERMINE);
  }, [ticketsDossier]);

  // Statut de pré-lecture
  const statutPrelecture = useMemo(() => {
    if (!toutesTachesTerminees) {
      return { statut: 'non_eligible', message: 'Toutes les tâches doivent être terminées pour la pré-lecture' };
    }
    if (dossier.autorisePrelecture === false || dossier.autorisePrelecture === undefined) {
      return { statut: 'en_attente', message: 'En attente d\'autorisation de pré-lecture par l\'encadrant' };
    }
    if (dossier.autorisePrelecture === true && dossier.prelectureEffectuee === false) {
      return { statut: 'autorisee', message: 'Pré-lecture autorisée - En attente de validation' };
    }
    if (dossier.prelectureEffectuee === true) {
      return { statut: 'validee', message: 'Pré-lecture validée' };
    }
    return { statut: 'inconnu', message: 'Statut inconnu' };
  }, [dossier.autorisePrelecture, dossier.prelectureEffectuee, toutesTachesTerminees]);

  // Statut d'autorisation de soutenance
  const statutSoutenance = useMemo(() => {
    if (statutPrelecture.statut !== 'validee') {
      return { statut: 'non_eligible', message: 'La pré-lecture doit être validée avant l\'autorisation de soutenance' };
    }
    if (dossier.autoriseSoutenance === false || dossier.autoriseSoutenance === undefined) {
      return { statut: 'en_attente', message: 'En attente d\'autorisation de soutenance par l\'encadrant' };
    }
    if (dossier.autoriseSoutenance === true) {
      return { statut: 'autorisee', message: 'Autorisé à soutenir' };
    }
    return { statut: 'inconnu', message: 'Statut inconnu' };
  }, [dossier.autoriseSoutenance, statutPrelecture.statut]);

  return (
    <div className="space-y-6">
      {/* Sujet du mémoire */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sujet du mémoire</h3>
        <Card>
          <CardContent className="p-4">
            <p className="font-medium text-gray-900 mb-2">{dossier.titre}</p>
            <p className="text-sm text-gray-600">{dossier.description}</p>
          </CardContent>
        </Card>
      </div>

      {/* Étape actuelle */}
      {!isDossierTermine && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Étape actuelle</h3>
          <Card className="border-primary-200 bg-primary-50">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="bg-primary-100 p-2 rounded-lg mr-4">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">En cours de traitement</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Statut: {dossier.statut}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {isDossierTermine && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Étape actuelle</h3>
          <Card className="border-primary-200 bg-primary-50">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="bg-primary-100 p-2 rounded-lg mr-4">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{getEtapeLabel(dossier.etape)}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Statut: {dossier.statut}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Informations générales */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations générales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                <p className="text-sm text-gray-500">Date de création</p>
              </div>
              <p className="font-medium text-gray-900">{formatDate(dossier.dateCreation)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                {isDossierTermine && dateSoutenance ? (
                  <>
                    <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                    <p className="text-sm text-gray-500">Date de soutenance</p>
                  </>
                ) : (
                  <>
                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                    <p className="text-sm text-gray-500">Dernière modification</p>
                  </>
                )}
              </div>
              <p className="font-medium text-gray-900">
                {isDossierTermine && dateSoutenance 
                  ? formatDate(dateSoutenance)
                  : formatDate(dossier.dateModification)
                }
              </p>
            </CardContent>
          </Card>
          {dossier.anneeAcademique && (
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-500 mb-2">Année académique</p>
                <p className="font-medium text-gray-900">{dossier.anneeAcademique}</p>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500 mb-2">Complétude</p>
              <p className="font-medium text-gray-900">
                {dossier.estComplet ? 'Complet' : 'En cours'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Encadrant */}
      {dossier.encadrant && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Encadrant</h3>
          <Card className="border-primary-200 bg-primary-50">
            <CardContent className="p-4">
              <div className="flex items-start">
                <div className="bg-primary-100 p-3 rounded-lg mr-4">
                  <UserCheck className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 mb-1">
                    {dossier.encadrant.prenom} {dossier.encadrant.nom}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">{dossier.encadrant.email}</p>
                  {dossier.encadrant.departement && (
                    <p className="text-xs text-gray-500">{dossier.encadrant.departement}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Statut de pré-lecture */}
      {!isDossierTermine && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pré-lecture</h3>
          <Card className={
            statutPrelecture.statut === 'validee' 
              ? 'border-green-200 bg-green-50' 
              : statutPrelecture.statut === 'autorisee'
              ? 'border-blue-200 bg-blue-50'
              : statutPrelecture.statut === 'en_attente'
              ? 'border-amber-200 bg-amber-50'
              : 'border-gray-200 bg-gray-50'
          }>
            <CardContent className="p-4">
              <div className="flex items-start">
                <div className={`p-3 rounded-lg mr-4 ${
                  statutPrelecture.statut === 'validee' 
                    ? 'bg-green-100' 
                    : statutPrelecture.statut === 'autorisee'
                    ? 'bg-blue-100'
                    : statutPrelecture.statut === 'en_attente'
                    ? 'bg-amber-100'
                    : 'bg-gray-100'
                }`}>
                  {statutPrelecture.statut === 'validee' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : statutPrelecture.statut === 'autorisee' ? (
                    <FileCheck className="h-5 w-5 text-blue-600" />
                  ) : statutPrelecture.statut === 'en_attente' || statutPrelecture.statut === 'non_eligible' ? (
                    <Clock className="h-5 w-5 text-amber-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-gray-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-semibold text-gray-900">Statut de pré-lecture</p>
                    <Badge variant={
                      statutPrelecture.statut === 'validee' 
                        ? 'default' 
                        : statutPrelecture.statut === 'autorisee'
                        ? 'default'
                        : 'secondary'
                    }>
                      {statutPrelecture.statut === 'validee' 
                        ? 'Validée' 
                        : statutPrelecture.statut === 'autorisee'
                        ? 'Autorisée'
                        : statutPrelecture.statut === 'en_attente'
                        ? 'En attente'
                        : 'Non éligible'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{statutPrelecture.message}</p>
                  {!toutesTachesTerminees && ticketsDossier.length > 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      Tâches terminées : {ticketsDossier.filter(t => t.phase === PhaseTicket.TERMINE).length} / {ticketsDossier.length}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Statut d'autorisation de soutenance */}
      {!isDossierTermine && statutPrelecture.statut === 'validee' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Autorisation de soutenance</h3>
          <Card className={
            statutSoutenance.statut === 'autorisee' 
              ? 'border-green-200 bg-green-50' 
              : statutSoutenance.statut === 'en_attente'
              ? 'border-amber-200 bg-amber-50'
              : 'border-gray-200 bg-gray-50'
          }>
            <CardContent className="p-4">
              <div className="flex items-start">
                <div className={`p-3 rounded-lg mr-4 ${
                  statutSoutenance.statut === 'autorisee' 
                    ? 'bg-green-100' 
                    : statutSoutenance.statut === 'en_attente'
                    ? 'bg-amber-100'
                    : 'bg-gray-100'
                }`}>
                  {statutSoutenance.statut === 'autorisee' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : statutSoutenance.statut === 'en_attente' ? (
                    <Clock className="h-5 w-5 text-amber-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-gray-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-semibold text-gray-900">Autorisation de soutenance</p>
                    <Badge variant={
                      statutSoutenance.statut === 'autorisee' 
                        ? 'default' 
                        : statutSoutenance.statut === 'en_attente'
                        ? 'secondary'
                        : 'outline'
                    }>
                      {statutSoutenance.statut === 'autorisee' 
                        ? 'Autorisé' 
                        : statutSoutenance.statut === 'en_attente'
                        ? 'En attente'
                        : 'Non éligible'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{statutSoutenance.message}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DossierInformations;

