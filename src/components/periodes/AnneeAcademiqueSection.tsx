import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import type { AnneeAcademique } from '../../models/services/AnneeAcademique';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AnneeAcademiqueSectionProps {
  annees: AnneeAcademique[];
  onActiver: (idAnnee: number) => void;
  onCloturer: (idAnnee: number) => void;
  onCreateClick: () => void;
}

const AnneeAcademiqueSection: React.FC<AnneeAcademiqueSectionProps> = ({
  annees,
  onActiver,
  onCloturer,
  onCreateClick
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Calendar className="h-6 w-6 mr-2 text-primary" />
              Années Académiques
            </CardTitle>
            <CardDescription>
              Gérez le cycle de vie des années académiques
            </CardDescription>
          </div>
          <Button onClick={onCreateClick}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Année
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {annees.map((annee) => (
            <motion.div
              key={annee.idAnnee}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`border-2 rounded-lg p-4 transition-all ${
                annee.estActive ? 'border-primary bg-primary/10 shadow-md' : 'border-gray-200 bg-white hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{annee.code}</h3>
                  <p className="text-sm text-gray-600">{annee.libelle}</p>
                </div>
                {annee.estActive && (
                  <Badge className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="h-3 w-3 inline mr-1" />
                    Active
                  </Badge>
                )}
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Début: {format(annee.dateDebut, 'dd/MM/yyyy', { locale: fr })}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Fin: {format(annee.dateFin, 'dd/MM/yyyy', { locale: fr })}</span>
                </div>
              </div>

              <div className="flex gap-2">
                {!annee.estActive && new Date() < annee.dateFin && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onActiver(annee.idAnnee)}
                  >
                    Activer
                  </Button>
                )}
                {annee.estActive && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onCloturer(annee.idAnnee)}
                  >
                    Clôturer
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnneeAcademiqueSection;

