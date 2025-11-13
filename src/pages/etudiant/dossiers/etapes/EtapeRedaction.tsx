import React from 'react';
import { FileText, ArrowRight } from 'lucide-react';
import { DossierMemoire } from '../../../../types/dossier';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';

interface EtapeRedactionProps {
  dossier: DossierMemoire;
  onComplete: () => void;
}

const EtapeRedaction: React.FC<EtapeRedactionProps> = ({ dossier, onComplete }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Étape 1 : Rédaction
          </CardTitle>
          <CardDescription>
            Rédigez votre mémoire de fin d'études
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
            <p className="text-sm text-gray-700">
              Cette étape est en cours de développement. Vous pourrez bientôt rédiger votre mémoire directement sur la plateforme.
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

export default EtapeRedaction;

