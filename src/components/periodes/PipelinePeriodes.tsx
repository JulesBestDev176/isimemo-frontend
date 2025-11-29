import React from 'react';
import { CheckCircle2, Circle, Clock, Lock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { EtapePipeline } from '../../models/services/PipelinePeriodes';
import { StatutEtape } from '../../models/services/PipelinePeriodes';

interface PipelinePeriodesProps {
  etapes: EtapePipeline[];
  onActiver?: (etape: EtapePipeline) => void;
  onDesactiver?: (etape: EtapePipeline) => void;
  onModifier?: (etape: EtapePipeline) => void;
}

const PipelinePeriodes: React.FC<PipelinePeriodesProps> = ({
  etapes,
  onActiver,
  onDesactiver,
  onModifier
}) => {
  const getStatutBadge = (statut: StatutEtape) => {
    switch (statut) {
      case StatutEtape.PAS_COMMENCEE:
        return <Badge variant="outline" className="bg-gray-50">Pas commencée</Badge>;
      case StatutEtape.PLANIFIEE:
        return <Badge variant="secondary" className="bg-blue-50 text-blue-700">Planifiée</Badge>;
      case StatutEtape.ACTIVE:
        return <Badge className="bg-primary text-white">Active</Badge>;
      case StatutEtape.TERMINEE:
        return <Badge variant="outline" className="bg-green-50 text-green-700">Terminée</Badge>;
      case StatutEtape.BLOQUEE:
        return <Badge variant="destructive">Bloquée</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getStatutIcon = (statut: StatutEtape) => {
    switch (statut) {
      case StatutEtape.PAS_COMMENCEE:
        return <Circle className="h-5 w-5 text-gray-400" />;
      case StatutEtape.PLANIFIEE:
        return <Clock className="h-5 w-5 text-blue-500" />;
      case StatutEtape.ACTIVE:
        return <CheckCircle2 className="h-5 w-5 text-primary" />;
      case StatutEtape.TERMINEE:
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case StatutEtape.BLOQUEE:
        return <Lock className="h-5 w-5 text-red-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'Non définie';
    return format(date, 'dd MMM yyyy', { locale: fr });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pipeline des Périodes</h2>
          <p className="text-gray-600 mt-1">Suivi séquentiel des périodes académiques</p>
        </div>
      </div>

      <div className="relative">
        {/* Ligne de connexion */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />

        {/* Étapes */}
        <div className="space-y-6">
          {etapes.map((etape, index) => {
            const estDerniere = index === etapes.length - 1;
            const estActive = etape.statut === StatutEtape.ACTIVE;
            const estTerminee = etape.statut === StatutEtape.TERMINEE;
            const estBloquee = etape.statut === StatutEtape.BLOQUEE;

            // Créer une clé unique en combinant l'id et l'ordre
            const uniqueKey = `${etape.id}-${etape.ordre}-${index}`;

            return (
              <div key={uniqueKey} className="relative flex items-start gap-4">
                {/* Icône de statut */}
                <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-2 ${
                  estActive ? 'bg-primary border-primary text-white' :
                  estTerminee ? 'bg-green-100 border-green-500 text-green-700' :
                  estBloquee ? 'bg-red-100 border-red-500 text-red-700' :
                  'bg-white border-gray-300 text-gray-500'
                }`}>
                  {getStatutIcon(etape.statut)}
                </div>

                {/* Carte de l'étape */}
                <Card className={`flex-1 ${
                  estActive ? 'border-primary shadow-md' :
                  estTerminee ? 'border-green-200' :
                  estBloquee ? 'border-red-200' :
                  'border-gray-200'
                }`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{etape.nom}</CardTitle>
                          {getStatutBadge(etape.statut)}
                          {etape.estRepetitive && (
                            <Badge variant="outline" className="text-xs">Répétitive</Badge>
                          )}
                        </div>
                        <CardDescription>{etape.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Dates */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Début :</span>
                          <span className="ml-2 font-medium">{formatDate(etape.dateDebut)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Fin :</span>
                          <span className="ml-2 font-medium">{formatDate(etape.dateFin)}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-2 border-t">
                        {etape.peutActiver && !estActive && !estTerminee && (
                          <Button
                            size="sm"
                            onClick={() => onActiver?.(etape)}
                            className="bg-primary hover:bg-primary/90"
                          >
                            Activer
                          </Button>
                        )}
                        {etape.peutDesactiver && estActive && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onDesactiver?.(etape)}
                          >
                            Désactiver
                          </Button>
                        )}
                        {onModifier && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onModifier?.(etape)}
                          >
                            Modifier
                          </Button>
                        )}
                      </div>

                      {/* Message si bloquée */}
                      {estBloquee && (
                        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                          Cette étape est bloquée car les étapes précédentes ne sont pas terminées.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Flèche de connexion (sauf dernière étape) */}
                {!estDerniere && (
                  <div className="absolute left-8 top-16 flex items-center justify-center w-16">
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Légende */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-sm">Légende</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Circle className="h-4 w-4 text-gray-400" />
              <span>Pas commencée</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>Planifiée</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Active</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>Terminée</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PipelinePeriodes;

