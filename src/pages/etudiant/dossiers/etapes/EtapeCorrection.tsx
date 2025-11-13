import React from 'react';
import { Edit, ArrowRight } from 'lucide-react';
import { DossierMemoire } from '../../../../types/dossier';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';

interface EtapeCorrectionProps {
  dossier: DossierMemoire;
  onComplete: () => void;
}

const EtapeCorrection: React.FC<EtapeCorrectionProps> = ({ dossier, onComplete }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-primary" />
            Étape 4 : Correction (optionnelle)
          </CardTitle>
          <CardDescription>
            Effectuez les corrections demandées par le jury
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
            <p className="text-sm text-gray-700">
              Cette étape est optionnelle. Si le jury demande des corrections, vous pourrez les effectuer ici.
            </p>
          </div>
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={onComplete} className="gap-2">
              Terminer le processus
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EtapeCorrection;

