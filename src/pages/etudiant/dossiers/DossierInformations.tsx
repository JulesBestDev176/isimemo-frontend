import React, { useMemo } from 'react';
import { Clock, UserCheck, Calendar, CheckCircle } from 'lucide-react';
import { DossierMemoire, StatutDossierMemoire, EtapeDossier } from '../../../types/dossier';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { mockSoutenances } from '../../../data/mock/dashboard';

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

const formatDate = (date: Date) => {
  return date.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
};

const DossierInformations: React.FC<DossierInformationsProps> = ({ dossier }) => {
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
    </div>
  );
};

export default DossierInformations;

