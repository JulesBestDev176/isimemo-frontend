import React, { useState } from 'react';
import { Eye, ArrowRight, Clock, CheckCircle, FileText } from 'lucide-react';
import { DossierMemoire } from '../../../../models/dossier';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';

interface Prelecture {
  id: number;
  dossierMemoire: {
    id: number;
    titre: string;
  };
  dateDemande: Date;
  statut: 'en_attente' | 'termine';
  feedbacks?: string;
  dateTerminaison?: Date;
}

interface EtapePrelectureProps {
  dossier: DossierMemoire;
  onComplete: () => void;
}

// Mock data pour la prélecture
const PRELECTURE_MOCK: Prelecture = {
  id: 1,
  dossierMemoire: {
    id: 0,
    titre: 'Nouveau dossier de mémoire'
  },
  dateDemande: new Date(),
  statut: 'en_attente'
};

const EtapePrelecture: React.FC<EtapePrelectureProps> = ({ dossier, onComplete }) => {
  const [prelecture, setPrelecture] = useState<Prelecture>(() => {
    // Chercher une prélecture existante pour ce dossier, sinon créer une nouvelle
    const existing = PRELECTURE_MOCK.dossierMemoire.id === dossier.id 
      ? PRELECTURE_MOCK 
      : {
          ...PRELECTURE_MOCK,
          id: Date.now(),
          dossierMemoire: {
            id: dossier.id,
            titre: dossier.titre
          },
          dateDemande: new Date(),
          statut: 'en_attente' as const
        };
    return existing;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleValider = () => {
    // Simuler la terminaison de la prélecture
    setPrelecture({
      ...prelecture,
      statut: 'termine',
      dateTerminaison: new Date(),
      feedbacks: 'Votre mémoire a été prélecturé avec succès. Vous pouvez maintenant procéder au dépôt final.'
    });
    // Appeler onComplete après un court délai
    setTimeout(() => {
      onComplete();
    }, 100);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Étape 1 : Prélecture
          </CardTitle>
          <CardDescription>
            La commission de validation effectue la prélecture de votre mémoire et vous enverra des feedbacks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Statut de la prélecture */}
          <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="bg-primary-100 rounded-full p-2">
                <Eye className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Prélecture en cours
                </h3>
                <p className="text-sm text-gray-600">{prelecture.dossierMemoire.titre}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Demandée le {formatDate(prelecture.dateDemande)}
                </p>
              </div>
              {prelecture.statut === 'en_attente' && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                  <Clock className="h-3 w-3 mr-1" />
                  En attente
                </Badge>
              )}
              {prelecture.statut === 'termine' && (
                <Badge variant="default" className="bg-green-600 text-white">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Terminé
                </Badge>
              )}
            </div>
          </div>

          {/* Message selon le statut */}
          {prelecture.statut === 'en_attente' && (
            <>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-blue-900">
                      La commission de validation est en train d'examiner votre mémoire. 
                      Vous recevrez des feedbacks une fois la prélecture terminée.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t">
                <Button 
                  onClick={handleValider}
                  className="gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Valider (simulation)
                </Button>
              </div>
            </>
          )}

          {prelecture.statut === 'termine' && (
            <>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-green-900 mb-1">
                      Prélecture terminée !
                    </p>
                    {prelecture.dateTerminaison && (
                      <p className="text-xs text-green-600 mb-2">
                        Terminée le {formatDate(prelecture.dateTerminaison)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Feedbacks de la commission */}
              {prelecture.feedbacks && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="bg-primary-100 rounded-full p-2">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">Feedbacks de la commission</h4>
                      <div className="p-3 bg-white rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{prelecture.feedbacks}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4 border-t">
                <Button onClick={onComplete} className="gap-2">
                  Passer à l'étape suivante
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EtapePrelecture;

