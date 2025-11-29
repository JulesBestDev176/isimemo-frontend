import React from 'react';
import { FileCheck, Plus, BookOpen, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import type { PeriodeValidation } from '../../models/commission/PeriodeValidation';
import { TypePeriodeValidation } from '../../models/commission/PeriodeValidation';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PeriodeValidationSectionProps {
  periodesValidation: PeriodeValidation[];
  periodeValidationActive: PeriodeValidation | null;
  onChangerPeriode: (type: TypePeriodeValidation) => void;
  onCreateClick: () => void;
}

const PeriodeValidationSection: React.FC<PeriodeValidationSectionProps> = ({
  periodesValidation,
  periodeValidationActive,
  onChangerPeriode,
  onCreateClick
}) => {
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <FileCheck className="h-6 w-6 mr-2 text-primary" />
              Périodes de Validation
            </CardTitle>
            <CardDescription>
              Gérez les périodes de validation des sujets et des documents corrigés. Une seule période peut être active à la fois.
            </CardDescription>
          </div>
          <Button onClick={onCreateClick}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Période
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Période active */}
        {periodeValidationActive && (
          <div className="mb-6 p-4 bg-primary/10 border-2 border-primary/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-primary text-white">Période Active</Badge>
                  <h3 className="font-bold text-lg text-gray-900">
                    {getTypePeriodeValidationLabel(periodeValidationActive.type)}
                  </h3>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center">
                    <FileCheck className="h-4 w-4 mr-2" />
                    <span>Début: {format(periodeValidationActive.dateDebut, 'dd/MM/yyyy', { locale: fr })}</span>
                  </div>
                  {periodeValidationActive.dateFin && (
                    <div className="flex items-center">
                      <FileCheck className="h-4 w-4 mr-2" />
                      <span>Fin: {format(periodeValidationActive.dateFin, 'dd/MM/yyyy', { locale: fr })}</span>
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onChangerPeriode(TypePeriodeValidation.AUCUNE)}
              >
                Désactiver
              </Button>
            </div>
          </div>
        )}

        {/* Liste des périodes */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Période Validation Sujets */}
            <Card className={periodeValidationActive?.type === TypePeriodeValidation.VALIDATION_SUJETS ? 'border-primary bg-primary/10' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-primary" />
                  Validation des Sujets
                </CardTitle>
              </CardHeader>
              <CardContent>
                {periodesValidation
                  .filter(p => p.type === TypePeriodeValidation.VALIDATION_SUJETS)
                  .map((periode) => (
                    <div key={periode.idPeriode} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          <div>{format(periode.dateDebut, 'dd/MM/yyyy', { locale: fr })}</div>
                          {periode.dateFin && (
                            <div>→ {format(periode.dateFin, 'dd/MM/yyyy', { locale: fr })}</div>
                          )}
                        </div>
                        {periode.estActive ? (
                          <Badge className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onChangerPeriode(TypePeriodeValidation.VALIDATION_SUJETS)}
                          >
                            Activer
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* Période Validation Corrections */}
            <Card className={periodeValidationActive?.type === TypePeriodeValidation.VALIDATION_CORRECTIONS ? 'border-primary bg-primary/10' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileCheck className="h-5 w-5 mr-2 text-orange-600" />
                  Validation des Corrections
                </CardTitle>
              </CardHeader>
              <CardContent>
                {periodesValidation
                  .filter(p => p.type === TypePeriodeValidation.VALIDATION_CORRECTIONS)
                  .map((periode) => (
                    <div key={periode.idPeriode} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          <div>{format(periode.dateDebut, 'dd/MM/yyyy', { locale: fr })}</div>
                          {periode.dateFin && (
                            <div>→ {format(periode.dateFin, 'dd/MM/yyyy', { locale: fr })}</div>
                          )}
                        </div>
                        {periode.estActive ? (
                          <Badge className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onChangerPeriode(TypePeriodeValidation.VALIDATION_CORRECTIONS)}
                          >
                            Activer
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>

          {/* Info importante */}
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Règle importante</p>
                <p>Les périodes de validation des sujets et des corrections ne peuvent pas être actives simultanément. Activer une période désactivera automatiquement l'autre.</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PeriodeValidationSection;

