import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Info, 
  Folder, 
  ArrowLeft,
  X,
  CheckCircle,
  Clock,
  Scale
} from 'lucide-react';
import { DossierMemoire, Document, StatutDossierMemoire, EtapeDossier } from '../../../models/dossier';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import DossierInformations from './DossierInformations';
import DossierDocuments from './DossierDocuments';
import ProcessusPipeline from './ProcessusPipeline';
import DossierProcessVerbal from './DossierProcessVerbal';
import { mockProcessVerbaux } from '../../../models/soutenance/ProcessVerbal';

interface DossierDetailProps {
  dossier: DossierMemoire;
  documents: Document[];
  onBack: () => void;
}

const TabButton: React.FC<{
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  count?: number;
}> = ({ children, isActive, onClick, icon, count }) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200
        ${isActive 
          ? 'border-primary text-primary bg-white' 
          : 'border-transparent text-gray-500 hover:text-primary bg-gray-50'
        }
      `}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
      {count !== undefined && (
        <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
          isActive 
            ? 'bg-primary-50 text-primary-700' 
            : 'bg-gray-200 text-gray-600'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
};

const getStatutLabel = (statut: StatutDossierMemoire) => {
  const statuts: Record<StatutDossierMemoire, string> = {
    [StatutDossierMemoire.EN_CREATION]: 'En création',
    [StatutDossierMemoire.EN_COURS]: 'En cours',
    [StatutDossierMemoire.EN_ATTENTE_VALIDATION]: 'En attente',
    [StatutDossierMemoire.VALIDE]: 'Validé',
    [StatutDossierMemoire.DEPOSE]: 'Déposé',
    [StatutDossierMemoire.SOUTENU]: 'Soutenu'
  };
  return statuts[statut] || statut;
};

const getStatutBadgeVariant = (statut: StatutDossierMemoire): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (statut) {
    case StatutDossierMemoire.EN_COURS:
      return 'default';
    case StatutDossierMemoire.VALIDE:
    case StatutDossierMemoire.SOUTENU:
      return 'default';
    case StatutDossierMemoire.EN_ATTENTE_VALIDATION:
      return 'secondary';
    case StatutDossierMemoire.DEPOSE:
      return 'outline';
    default:
      return 'outline';
  }
};

const getEtapeLabel = (etape: EtapeDossier) => {
  const etapes: Record<EtapeDossier, string> = {
    [EtapeDossier.CHOIX_SUJET]: 'Choix du sujet',
    [EtapeDossier.CHOIX_BINOME]: 'Choix du binôme',
    [EtapeDossier.CHOIX_ENCADRANT]: 'Choix de l\'encadrant',
    [EtapeDossier.VALIDATION_SUJET]: 'Validation du sujet',
    [EtapeDossier.VALIDATION_COMMISSION]: 'Validation commission',
    [EtapeDossier.EN_COURS_REDACTION]: 'Rédaction en cours',
    [EtapeDossier.PRELECTURE]: 'Prélecture',
    [EtapeDossier.DEPOT_INTERMEDIAIRE]: 'Dépôt intermédiaire',
    [EtapeDossier.DEPOT_FINAL]: 'Dépôt final',
    [EtapeDossier.SOUTENANCE]: 'Soutenance',
    [EtapeDossier.CORRECTION]: 'Correction',
    [EtapeDossier.TERMINE]: 'Terminé'
  };
  return etapes[etape] || etape;
};

const DossierDetail: React.FC<DossierDetailProps> = ({ dossier, documents, onBack }) => {
  const [activeTab, setActiveTab] = useState<'informations' | 'documents' | 'processus' | 'processverbal'>('informations');
  
  // Vérifier si le dossier est en cours (pour afficher l'onglet processus)
  const isDossierEnCours = useMemo(() => {
    return dossier.statut === StatutDossierMemoire.EN_COURS || 
           dossier.statut === StatutDossierMemoire.EN_CREATION;
  }, [dossier.statut]);

  // Vérifier si le dossier est terminé (pour afficher l'onglet procès-verbal)
  const isDossierTermine = useMemo(() => {
    return dossier.statut === StatutDossierMemoire.SOUTENU || 
           dossier.statut === StatutDossierMemoire.DEPOSE ||
           dossier.etape === EtapeDossier.TERMINE;
  }, [dossier.statut, dossier.etape]);

  // Récupérer le procès-verbal du dossier
  const processVerbal = useMemo(() => {
    return mockProcessVerbaux.find(pv => 
      pv.soutenance?.dossierMemoire?.idDossierMemoire === dossier.id
    );
  }, [dossier.id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bouton retour */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>

        {/* En-tête */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start flex-1">
                <div className="bg-primary-100 rounded-lg p-3 mr-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">{dossier.titre}</CardTitle>
                  <CardDescription className="mb-3">{dossier.description}</CardDescription>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={getStatutBadgeVariant(dossier.statut)}>
                      {getStatutLabel(dossier.statut)}
                    </Badge>
                    <Badge variant="outline">
                      {getEtapeLabel(dossier.etape)}
                    </Badge>
                    {dossier.anneeAcademique && (
                      <span className="text-xs text-gray-500">
                        Année: {dossier.anneeAcademique}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Onglets */}
        <Card>
          <div className="border-b border-gray-200">
            <div className="flex">
              <TabButton
                isActive={activeTab === 'informations'}
                onClick={() => setActiveTab('informations')}
                icon={<Info className="h-4 w-4" />}
              >
                Informations
              </TabButton>
              <TabButton
                isActive={activeTab === 'documents'}
                onClick={() => setActiveTab('documents')}
                icon={<Folder className="h-4 w-4" />}
                count={documents.length}
              >
                Documents
              </TabButton>
              {isDossierEnCours && (
                <TabButton
                  isActive={activeTab === 'processus'}
                  onClick={() => setActiveTab('processus')}
                  icon={<CheckCircle className="h-4 w-4" />}
                >
                  Processus
                </TabButton>
              )}
              {isDossierTermine && processVerbal && (
                <TabButton
                  isActive={activeTab === 'processverbal'}
                  onClick={() => setActiveTab('processverbal')}
                  icon={<Scale className="h-4 w-4" />}
                >
                  Procès-verbal
                </TabButton>
              )}
            </div>
          </div>

          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'informations' && (
                <motion.div
                  key="informations"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <DossierInformations dossier={dossier} />
                </motion.div>
              )}

              {activeTab === 'documents' && (
                <motion.div
                  key="documents"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <DossierDocuments documents={documents} />
                </motion.div>
              )}

              {activeTab === 'processus' && isDossierEnCours && (
                <motion.div
                  key="processus"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProcessusPipeline dossier={dossier} />
                </motion.div>
              )}

              {activeTab === 'processverbal' && isDossierTermine && processVerbal && (
                <motion.div
                  key="processverbal"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <DossierProcessVerbal processVerbal={processVerbal} />
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DossierDetail;

