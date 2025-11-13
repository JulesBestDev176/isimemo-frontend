import React from 'react';
import { Upload, ArrowRight } from 'lucide-react';
import { DossierMemoire } from '../../../../types/dossier';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';

interface EtapeDepotFinalProps {
  dossier: DossierMemoire;
  onComplete: () => void;
}

const EtapeDepotFinal: React.FC<EtapeDepotFinalProps> = ({ dossier, onComplete }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Étape 2 : Dépôt final
          </CardTitle>
          <CardDescription>
            Déposez la version finale de votre mémoire
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
            <p className="text-sm text-gray-700">
              Cette étape est en cours de développement. Vous pourrez bientôt déposer la version finale de votre mémoire.
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

export default EtapeDepotFinal;

