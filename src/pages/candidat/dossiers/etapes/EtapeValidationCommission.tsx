import React, { useState } from 'react';
import { Scale, CheckCircle, XCircle, AlertCircle, Clock, ArrowRight } from 'lucide-react';
import { DossierMemoire } from '../../../../models/dossier';
import { ValidationCommission } from '../../../../models/pipeline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Badge } from '../../../../components/ui/badge';
import { Button } from '../../../../components/ui/button';

interface EtapeValidationCommissionProps {
  dossier: DossierMemoire;
  validationCommission?: ValidationCommission;
  onComplete?: () => void;
}

const EtapeValidationCommission: React.FC<EtapeValidationCommissionProps> = ({ dossier, validationCommission, onComplete }) => {
  // Mock data - dans la vraie app, cela viendrait de l'API
  const [validation, setValidation] = useState<ValidationCommission | undefined>(validationCommission);

  if (!validation) {
    // Si pas de validation, on en crée une en attente
    const nouvelleValidation: ValidationCommission = {
      id: Date.now(),
      dossierMemoire: {
        id: dossier.id,
        titre: dossier.titre
      },
      dateDemande: new Date(),
      statut: 'en_attente'
    };
    setValidation(nouvelleValidation);
    return null;
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
            <Scale className="h-5 w-5 text-primary" />
            Validation par la commission
          </CardTitle>
          <CardDescription>
            Votre dossier est en cours d'examen par la commission de validation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Statut de la validation */}
          <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="bg-primary-100 rounded-full p-2">
                <Scale className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Dossier soumis à la commission
                </h3>
                <p className="text-sm text-gray-600">{validation.dossierMemoire.titre}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Soumis le {formatDate(validation.dateDemande)}
                </p>
              </div>
              {validation.statut === 'en_attente' && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                  <Clock className="h-3 w-3 mr-1" />
                  En attente
                </Badge>
              )}
              {validation.statut === 'acceptee' && (
                <Badge variant="default" className="bg-green-600 text-white">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Validé
                </Badge>
              )}
              {validation.statut === 'refusee' && (
                <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-300">
                  <XCircle className="h-3 w-3 mr-1" />
                  Refusé
                </Badge>
              )}
            </div>
          </div>

          {/* Message d'information */}
          {validation.statut === 'en_attente' && (
            <>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-blue-900">
                      Votre dossier est en cours d'examen par la commission de validation. 
                      Vous recevrez une notification dès qu'une décision sera prise.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t">
                <Button 
                  onClick={() => {
                    // Simuler l'acceptation de la validation
                    setValidation({
                      ...validation,
                      statut: 'acceptee',
                      dateReponse: new Date()
                    });
                    // Appeler onComplete après un court délai pour permettre la mise à jour de l'UI
                    setTimeout(() => {
                      if (onComplete) {
                        onComplete();
                      }
                    }, 100);
                  }}
                  className="gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Valider
                </Button>
              </div>
            </>
          )}

          {validation.statut === 'acceptee' && (
            <>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-green-900 mb-1">
                      Dossier validé par la commission !
                    </p>
                    <p className="text-sm text-green-700">
                      Félicitations ! Votre dossier a été validé. Vous pouvez maintenant commencer la rédaction de votre mémoire.
                    </p>
                    {validation.dateReponse && (
                      <p className="text-xs text-green-600 mt-2">
                        Validation reçue le {formatDate(validation.dateReponse)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {onComplete && (
                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={onComplete} className="gap-2">
                    Passer à l'étape suivante
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Motif de refus si refusé */}
          {validation.statut === 'refusee' && validation.motifRefus && (
            <>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-red-900 mb-1">Motif de refus</h4>
                    <p className="text-sm text-red-700">{validation.motifRefus}</p>
                    {validation.dateReponse && (
                      <p className="text-xs text-red-600 mt-2">
                        Refus reçu le {formatDate(validation.dateReponse)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-orange-900 mb-1">
                      Dossier refusé
                    </p>
                    <p className="text-sm text-orange-700">
                      Votre dossier a été refusé par la commission. Vous devrez refaire le processus depuis le début.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EtapeValidationCommission;

