import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, Clock, Play, Square, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import type { AnneeAcademique } from '../../models/services/AnneeAcademique';
import type { SessionSoutenance } from '../../models/services/SessionSoutenance';
import { StatutSession } from '../../models/services/SessionSoutenance';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SessionSoutenanceSectionProps {
  anneeActive: AnneeAcademique | undefined;
  sessions: SessionSoutenance[];
  onOuvrir: (idSession: number) => void;
  onFermer: (idSession: number) => void;
  onCreateClick: () => void;
}

const SessionSoutenanceSection: React.FC<SessionSoutenanceSectionProps> = ({
  anneeActive,
  sessions,
  onOuvrir,
  onFermer,
  onCreateClick
}) => {
  const getStatutBadge = (statut: StatutSession) => {
    switch (statut) {
      case StatutSession.OUVERTE:
        return <Badge className="bg-green-50 text-green-700 border-green-200"><Play className="h-3 w-3 inline mr-1" />Ouverte</Badge>;
      case StatutSession.FERMEE:
        return <Badge className="bg-red-50 text-red-700 border-red-200"><Square className="h-3 w-3 inline mr-1" />Fermée</Badge>;
      case StatutSession.PLANIFIEE:
        return <Badge className="bg-orange-50 text-orange-700 border-orange-200"><Clock className="h-3 w-3 inline mr-1" />Planifiée</Badge>;
    }
  };

  if (!anneeActive) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune année académique active</h3>
          <p className="text-gray-600">
            Veuillez activer une année académique pour gérer les sessions de soutenance.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Calendar className="h-6 w-6 mr-2 text-primary" />
              Sessions de Soutenance - {anneeActive.code}
            </CardTitle>
            <CardDescription>
              Créez et gérez les sessions de soutenance pour collecter les disponibilités des professeurs
            </CardDescription>
          </div>
          <Button onClick={onCreateClick}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Session
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune session</h3>
            <p className="text-gray-600 mb-4">Créez une nouvelle session de soutenance pour cette année académique</p>
            <Button onClick={onCreateClick}>
              <Plus className="h-4 w-4 mr-2" />
              Créer une session
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <motion.div
                key={session.idSession}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg text-gray-900">{session.nom}</h3>
                      {getStatutBadge(session.statut)}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Du {format(session.dateDebut, 'dd/MM/yyyy', { locale: fr })} au {format(session.dateFin, 'dd/MM/yyyy', { locale: fr })}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Créée le {format(session.dateCreation, 'dd/MM/yyyy', { locale: fr })}</span>
                      </div>
                      {session.dateOuverture && (
                        <div className="flex items-center">
                          <Play className="h-4 w-4 mr-2 text-green-600" />
                          <span>Ouverte le {format(session.dateOuverture, 'dd/MM/yyyy', { locale: fr })}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    {session.statut === StatutSession.PLANIFIEE && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onOuvrir(session.idSession)}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Ouvrir
                      </Button>
                    )}
                    {session.statut === StatutSession.OUVERTE && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onFermer(session.idSession)}
                      >
                        <Square className="h-4 w-4 mr-1" />
                        Fermer
                      </Button>
                    )}
                  </div>
                </div>

                {/* Période de la session */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Période de soutenance:</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {format(session.dateDebut, 'dd MMM yyyy', { locale: fr })} - {format(session.dateFin, 'dd MMM yyyy', { locale: fr })}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SessionSoutenanceSection;

