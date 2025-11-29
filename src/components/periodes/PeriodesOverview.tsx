import React from 'react';
import { Calendar, Play, FileCheck, CalendarDays } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import type { AnneeAcademique } from '../../models/services/AnneeAcademique';
import type { SessionSoutenance } from '../../models/services/SessionSoutenance';
import { StatutSession } from '../../models/services/SessionSoutenance';
import type { PeriodeValidation } from '../../models/commission/PeriodeValidation';
import { TypePeriodeValidation } from '../../models/commission/PeriodeValidation';

interface PeriodesOverviewProps {
  anneeActive: AnneeAcademique | undefined;
  totalAnnees: number;
  sessions: SessionSoutenance[];
  periodeValidationActive: PeriodeValidation | null;
}

const PeriodesOverview: React.FC<PeriodesOverviewProps> = ({
  anneeActive,
  totalAnnees,
  sessions,
  periodeValidationActive
}) => {
  const sessionsOuvertes = sessions.filter(s => s.statut === StatutSession.OUVERTE).length;
  const totalSessions = sessions.length;

  const getTypePeriodeValidationLabel = (type: TypePeriodeValidation) => {
    switch (type) {
      case TypePeriodeValidation.VALIDATION_SUJETS:
        return 'Validation des Sujets';
      case TypePeriodeValidation.VALIDATION_CORRECTIONS:
        return 'Validation des Corrections';
      case TypePeriodeValidation.AUCUNE:
        return 'Aucune période active';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Année Active</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{anneeActive ? 1 : 0}</div>
          <p className="text-xs text-muted-foreground">
            {anneeActive ? anneeActive.code : 'Aucune année active'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sessions Ouvertes</CardTitle>
          <Play className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{sessionsOuvertes}</div>
          <p className="text-xs text-muted-foreground">
            {totalSessions} session(s) au total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Période de Validation</CardTitle>
          <FileCheck className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{periodeValidationActive ? 1 : 0}</div>
          <p className="text-xs text-muted-foreground">
            {periodeValidationActive 
              ? getTypePeriodeValidationLabel(periodeValidationActive.type)
              : 'Aucune période active'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Années</CardTitle>
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAnnees}</div>
          <p className="text-xs text-muted-foreground">
            Années académiques enregistrées
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PeriodesOverview;

