import React from 'react';
import { GraduationCap, ArrowRight } from 'lucide-react';
import { DossierMemoire } from '../../../../models/dossier';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';

interface EtapeSoutenanceProps {
  dossier: DossierMemoire;
  onComplete: () => void;
}

const EtapeSoutenance: React.FC<EtapeSoutenanceProps> = ({ dossier, onComplete }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Étape 3 : Soutenance
          </CardTitle>
          <CardDescription>
            Présentez votre mémoire devant le jury
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
            <p className="text-sm text-gray-700">
              Cette étape est en cours de développement. Vous pourrez bientôt planifier et suivre votre soutenance.
            </p>
          </div>
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={onComplete} className="gap-2">
              Passer à l'étape suivante
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EtapeSoutenance;

