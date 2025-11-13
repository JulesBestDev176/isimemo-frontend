import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Mail } from 'lucide-react';
import { DossierMemoire } from '../../../../types/dossier';
import { DemandeEncadrant } from '../../../../types/pipeline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Badge } from '../../../../components/ui/badge';

interface EtapeAttenteReponseEncadrantProps {
  dossier: DossierMemoire;
  demandeEncadrant?: DemandeEncadrant;
}

const EtapeAttenteReponseEncadrant: React.FC<EtapeAttenteReponseEncadrantProps> = ({ dossier, demandeEncadrant }) => {
  // Mock data - dans la vraie app, cela viendrait de l'API
  const [demande, setDemande] = useState<DemandeEncadrant | undefined>(demandeEncadrant);

  // Simuler une réponse après un délai (pour la démo)
  useEffect(() => {
    if (demande && demande.statut === 'en_attente') {
      // Dans la vraie app, on écouterait les mises à jour en temps réel
      // Ici, on simule juste l'affichage
    }
  }, [demande]);

  if (!demande) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-gray-600">Aucune demande d'encadrant trouvée</p>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Attente de réponse de l'encadrant
          </CardTitle>
          <CardDescription>
            Votre demande a été envoyée à l'encadrant. Vous serez notifié(e) dès qu'une réponse sera disponible.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Statut de la demande */}
          <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="bg-primary-100 rounded-full p-2">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Demande envoyée à {demande.encadrant.prenom} {demande.encadrant.nom}
                </h3>
                <p className="text-sm text-gray-600">{demande.encadrant.email}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Envoyée le {formatDate(demande.dateDemande)}
                </p>
              </div>
              {demande.statut === 'en_attente' && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                  <Clock className="h-3 w-3 mr-1" />
                  En attente
                </Badge>
              )}
              {demande.statut === 'acceptee' && (
                <Badge variant="default" className="bg-green-600 text-white">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Acceptée
                </Badge>
              )}
              {demande.statut === 'refusee' && (
                <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-300">
                  <XCircle className="h-3 w-3 mr-1" />
                  Refusée
                </Badge>
              )}
            </div>
          </div>

          {/* Informations du dossier */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Dossier concerné</h4>
            <p className="text-sm text-gray-700">{demande.dossierMemoire.titre}</p>
            {demande.dossierMemoire.description && (
              <p className="text-xs text-gray-600 mt-1">{demande.dossierMemoire.description}</p>
            )}
          </div>

          {/* Motif de refus si refusé */}
          {demande.statut === 'refusee' && demande.motifRefus && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-red-900 mb-1">Motif de refus</h4>
                  <p className="text-sm text-red-700">{demande.motifRefus}</p>
                  {demande.dateReponse && (
                    <p className="text-xs text-red-600 mt-2">
                      Réponse reçue le {formatDate(demande.dateReponse)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Message d'information */}
          {demande.statut === 'en_attente' && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-blue-900">
                    Votre demande est en cours d'examen par l'encadrant. 
                    Vous recevrez une notification dès qu'une réponse sera disponible.
                  </p>
                </div>
              </div>
            </div>
          )}

          {demande.statut === 'acceptee' && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-green-900 mb-1">
                    Demande acceptée !
                  </p>
                  <p className="text-sm text-green-700">
                    Votre encadrant a accepté votre demande. Votre dossier va maintenant être soumis à la commission de validation.
                  </p>
                  {demande.dateReponse && (
                    <p className="text-xs text-green-600 mt-2">
                      Réponse reçue le {formatDate(demande.dateReponse)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {demande.statut === 'refusee' && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-orange-900 mb-1">
                    Demande refusée
                  </p>
                  <p className="text-sm text-orange-700">
                    Vous pouvez choisir un autre encadrant en retournant à l'étape précédente.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EtapeAttenteReponseEncadrant;

