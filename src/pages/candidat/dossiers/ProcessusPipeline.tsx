import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle, ChevronRight, ArrowRight, FileText, Upload, GraduationCap, Edit, Lock, Loader2, Users, Eye } from 'lucide-react';
import { DossierMemoire, EtapeDossier } from '../../../models/dossier';
import { EtapePipeline } from '../../../models/pipeline';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../components/ui/tabs';
import { Badge } from '../../../components/ui/badge';
import dossierService from '../../../services/dossier.service';
import EtapeChoixSujet from './etapes/EtapeChoixSujet';
import EtapeChoixBinome from './etapes/EtapeChoixBinome';
import EtapeChoixEncadrant from './etapes/EtapeChoixEncadrant';
import EtapeValidationCommission from './etapes/EtapeValidationCommission';
import EtapePrelecture from './etapes/EtapePrelecture';
import EtapeDepotFinal from './etapes/EtapeDepotFinal';
import EtapeSoutenance from './etapes/EtapeSoutenance';
import EtapeCorrection from './etapes/EtapeCorrection';

interface ProcessusPipelineProps {
  dossier: DossierMemoire;
  /** Si true, l'utilisateur est un suiveur de binôme et ne peut pas effectuer d'actions */
  estSuiveur?: boolean;
}

// Mapping entre EtapeDossier et EtapePipeline
const getEtapePipelineFromDossier = (etape: EtapeDossier): EtapePipeline => {
  switch (etape) {
    case EtapeDossier.CHOIX_SUJET:
      return EtapePipeline.CHOIX_SUJET;
    case EtapeDossier.CHOIX_BINOME:
      return EtapePipeline.CHOIX_BINOME;
    case EtapeDossier.CHOIX_ENCADRANT:
      return EtapePipeline.CHOIX_ENCADRANT;
    case EtapeDossier.VALIDATION_SUJET:
    case EtapeDossier.VALIDATION_COMMISSION:
      return EtapePipeline.VALIDATION_COMMISSION;
    case EtapeDossier.EN_COURS_REDACTION:
    case EtapeDossier.PRELECTURE:
      return EtapePipeline.PRELECTURE;
    case EtapeDossier.DEPOT_FINAL:
      return EtapePipeline.DEPOT_FINAL;
    case EtapeDossier.SOUTENANCE:
      return EtapePipeline.SOUTENANCE;
    case EtapeDossier.CORRECTION:
      return EtapePipeline.CORRECTION;
    case EtapeDossier.TERMINE:
      return EtapePipeline.TERMINE;
    default:
      return EtapePipeline.CHOIX_SUJET;
  }
};

// Mapping inverse : EtapePipeline vers EtapeDossier
const getEtapeDossierFromPipeline = (etape: EtapePipeline): EtapeDossier => {
  switch (etape) {
    case EtapePipeline.CHOIX_SUJET:
      return EtapeDossier.CHOIX_SUJET;
    case EtapePipeline.CHOIX_BINOME:
      return EtapeDossier.CHOIX_BINOME;
    case EtapePipeline.CHOIX_ENCADRANT:
      return EtapeDossier.CHOIX_ENCADRANT;
    case EtapePipeline.VALIDATION_COMMISSION:
      return EtapeDossier.VALIDATION_COMMISSION;
    case EtapePipeline.PRELECTURE:
      return EtapeDossier.PRELECTURE;
    case EtapePipeline.DEPOT_FINAL:
      return EtapeDossier.DEPOT_FINAL;
    case EtapePipeline.SOUTENANCE:
      return EtapeDossier.SOUTENANCE;
    case EtapePipeline.CORRECTION:
      return EtapeDossier.CORRECTION;
    case EtapePipeline.TERMINE:
      return EtapeDossier.TERMINE;
    default:
      return EtapeDossier.CHOIX_SUJET;
  }
};

// Étapes pour l'onglet "Dépôt sujet"
const ETAPES_DEPOT_SUJET = [
  { id: EtapePipeline.CHOIX_SUJET, nom: 'Choix du sujet', description: 'Sélectionnez un sujet pour votre mémoire' },
  { id: EtapePipeline.CHOIX_BINOME, nom: 'Choix du binôme', description: 'Trouvez un partenaire pour votre mémoire' },
  { id: EtapePipeline.CHOIX_ENCADRANT, nom: 'Choix de l\'encadrant', description: 'Sélectionnez votre encadrant pédagogique' },
  { id: EtapePipeline.VALIDATION_COMMISSION, nom: 'Validation commission', description: 'Validation de votre dossier par la commission' }
];

// Étapes pour l'onglet "Dépôt dossier"
const ETAPES_DEPOT_DOSSIER = [
  { id: EtapePipeline.PRELECTURE, nom: 'Prélecture', description: 'Prélecture de votre mémoire' },
  { id: EtapePipeline.DEPOT_FINAL, nom: 'Dépôt final', description: 'Dépôt de la version finale' },
  { id: EtapePipeline.SOUTENANCE, nom: 'Soutenance', description: 'Présentation de votre mémoire' },
  { id: EtapePipeline.CORRECTION, nom: 'Correction', description: 'Correction du mémoire (optionnelle)' }
];

// Clé localStorage pour persister l'étape
const getLocalStorageKey = (dossierId: number) => `dossier_etape_${dossierId}`;

const ProcessusPipeline: React.FC<ProcessusPipelineProps> = ({ dossier, estSuiveur = false }) => {
  const etapeActuelleDossier = useMemo(() => getEtapePipelineFromDossier(dossier.etape), [dossier.etape]);
  
  // Initialiser l'étape en prenant la plus avancée entre le backend et localStorage
  const getInitialEtape = (): EtapePipeline => {
    const savedEtape = localStorage.getItem(getLocalStorageKey(dossier.id));
    if (savedEtape) {
      const parsedEtape = parseInt(savedEtape) as EtapePipeline;
      // Prendre l'étape la plus avancée entre le backend et localStorage
      return Math.max(etapeActuelleDossier, parsedEtape) as EtapePipeline;
    }
    return etapeActuelleDossier;
  };

  const [etapeCourante, setEtapeCourante] = useState<EtapePipeline>(getInitialEtape);
  const [activeTab, setActiveTab] = useState<'depot-sujet' | 'depot-dossier'>('depot-sujet');

  // Sauvegarder l'étape dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem(getLocalStorageKey(dossier.id), etapeCourante.toString());
  }, [etapeCourante, dossier.id]);

  // Synchroniser avec le dossier si l'étape change en externe (ex: backend update)
  useEffect(() => {
    // Si l'étape du dossier est plus avancée que l'étape courante, mettre à jour
    if (etapeActuelleDossier > etapeCourante) {
      setEtapeCourante(etapeActuelleDossier);
    }
    // Déterminer l'onglet actif selon l'étape courante
    if (etapeCourante <= EtapePipeline.VALIDATION_COMMISSION) {
      setActiveTab('depot-sujet');
    } else {
      setActiveTab('depot-dossier');
    }
  }, [etapeActuelleDossier, etapeCourante]);

  // Déterminer l'onglet actif selon l'étape courante
  useEffect(() => {
    if (etapeCourante <= EtapePipeline.VALIDATION_COMMISSION) {
      setActiveTab('depot-sujet');
    } else {
      setActiveTab('depot-dossier');
    }
  }, [etapeCourante]);

  // Étapes complétées pour l'onglet actif
  const etapesCompletees = useMemo(() => {
    if (activeTab === 'depot-sujet') {
      return ETAPES_DEPOT_SUJET.filter(etape => etape.id < etapeCourante);
    } else {
      return ETAPES_DEPOT_DOSSIER.filter(etape => etape.id < etapeCourante);
    }
  }, [etapeCourante, activeTab]);

  // Étape active
  const etapeActive = useMemo(() => {
    if (activeTab === 'depot-sujet') {
      return ETAPES_DEPOT_SUJET.find(etape => etape.id === etapeCourante);
    } else {
      return ETAPES_DEPOT_DOSSIER.find(etape => etape.id === etapeCourante);
    }
  }, [etapeCourante, activeTab]);

  // Vérifier si l'onglet "Dépôt dossier" est débloqué (validation commission terminée)
  const depotDossierDebloque = useMemo(() => {
    return etapeCourante > EtapePipeline.VALIDATION_COMMISSION;
  }, [etapeCourante]);

  const [isSavingStep, setIsSavingStep] = useState(false);

  const handleEtapeComplete = async () => {
    const nextEtape = etapeCourante + 1;
    if (nextEtape <= EtapePipeline.TERMINE) {
      try {
        setIsSavingStep(true);
        // Appel API pour persister l'étape dans le backend
        const etapeDossier = getEtapeDossierFromPipeline(nextEtape);
        await dossierService.changerEtape(dossier.id, etapeDossier);
        
        // Mettre à jour l'état local après succès de l'API
        setEtapeCourante(nextEtape);
        
        // Si on termine la validation commission, débloquer l'onglet "Dépôt dossier"
        if (nextEtape === EtapePipeline.PRELECTURE) {
          setActiveTab('depot-dossier');
        }
        console.log(`✅ Étape ${etapeDossier} sauvegardée avec succès`);
      } catch (error) {
        console.error('❌ Erreur lors de la sauvegarde de etape:', error);
        // On met quand même à jour l'état local pour ne pas bloquer l'utilisateur
        setEtapeCourante(nextEtape);
        if (nextEtape === EtapePipeline.PRELECTURE) {
          setActiveTab('depot-dossier');
        }
      } finally {
        setIsSavingStep(false);
      }
    }
  };

  const renderEtapeContent = () => {
    switch (etapeCourante) {
      // Onglet 1 : Dépôt sujet
      case EtapePipeline.CHOIX_SUJET:
        return <EtapeChoixSujet dossier={dossier} onComplete={handleEtapeComplete} />;
      case EtapePipeline.CHOIX_BINOME:
        return <EtapeChoixBinome dossier={dossier} onComplete={handleEtapeComplete} />;
      case EtapePipeline.CHOIX_ENCADRANT:
        return <EtapeChoixEncadrant dossier={dossier} onComplete={handleEtapeComplete} />;
      case EtapePipeline.VALIDATION_COMMISSION:
        return <EtapeValidationCommission dossier={dossier} onComplete={handleEtapeComplete} />;
      
      // Onglet 2 : Dépôt dossier
      case EtapePipeline.PRELECTURE:
        return <EtapePrelecture dossier={dossier} onComplete={handleEtapeComplete} />;
      case EtapePipeline.DEPOT_FINAL:
        return <EtapeDepotFinal dossier={dossier} onComplete={handleEtapeComplete} />;
      case EtapePipeline.SOUTENANCE:
        return <EtapeSoutenance dossier={dossier} onComplete={handleEtapeComplete} />;
      case EtapePipeline.CORRECTION:
        return <EtapeCorrection dossier={dossier} onComplete={handleEtapeComplete} />;
      default:
        return (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">Étape en cours de développement</p>
            </CardContent>
          </Card>
        );
    }
  };

  // Rendu en mode suiveur : affiche uniquement le résumé de l'étape (lecture seule)
  const renderEtapeSuiveur = () => {
    const etapeActive = activeTab === 'depot-sujet' 
      ? ETAPES_DEPOT_SUJET.find(e => e.id === etapeCourante)
      : ETAPES_DEPOT_DOSSIER.find(e => e.id === etapeCourante);
    
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="py-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 rounded-full p-4 mb-4">
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Mode observation
            </h3>
            <p className="text-blue-700 mb-4 max-w-md">
              Vous avez accepté une demande de binôme. Votre partenaire est responsable de la progression du dossier.
            </p>
            {etapeActive && (
              <div className="bg-white rounded-lg border border-blue-200 p-4 w-full max-w-md">
                <p className="text-sm text-gray-500 mb-1">Étape en cours :</p>
                <p className="font-semibold text-gray-900">{etapeActive.nom}</p>
                <p className="text-sm text-gray-600 mt-1">{etapeActive.description}</p>
              </div>
            )}
            <p className="text-xs text-blue-600 mt-4">
              Vous serez notifié(e) lorsque votre binôme avancera dans le processus.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Obtenir les étapes de l'onglet actif
  const etapesActives = activeTab === 'depot-sujet' ? ETAPES_DEPOT_SUJET : ETAPES_DEPOT_DOSSIER;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Processus de création du mémoire</CardTitle>
          <CardDescription>
            Suivez les étapes pour compléter votre dossier de mémoire
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Onglets principaux */}
          <Tabs value={activeTab} onValueChange={(value) => {
            // Empêcher de passer à "Dépôt dossier" si pas encore débloqué
            if (value === 'depot-dossier' && !depotDossierDebloque) {
              return;
            }
            setActiveTab(value as 'depot-sujet' | 'depot-dossier');
          }}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="depot-sujet" className="gap-2">
                <FileText className="h-4 w-4" />
                Dépôt sujet
              </TabsTrigger>
              <TabsTrigger value="depot-dossier" className="gap-2" disabled={!depotDossierDebloque}>
                <Upload className="h-4 w-4" />
                Dépôt dossier
                {!depotDossierDebloque && (
                  <Badge variant="secondary" className="ml-2 bg-gray-200 text-gray-600">
                    Verrouillé
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Onglet 1 : Dépôt sujet */}
            <TabsContent value="depot-sujet" className="space-y-6">
              {/* Indicateur de progression pour Dépôt sujet */}
              <div className="relative">
                {/* Ligne de progression */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
                  <div 
                    className="h-full bg-primary transition-all duration-500"
                    style={{ 
                      width: etapeCourante <= EtapePipeline.VALIDATION_COMMISSION
                        ? `${((etapeCourante - EtapePipeline.CHOIX_SUJET) / (ETAPES_DEPOT_SUJET.length - 1)) * 100}%`
                        : '100%'
                    }}
                  />
                </div>

                {/* Étapes */}
                <div className="relative flex justify-between">
                  {ETAPES_DEPOT_SUJET.map((etape) => {
                    const isComplete = etape.id < etapeCourante;
                    const isActive = etape.id === etapeCourante;

                    return (
                      <div key={etape.id} className="flex flex-col items-center" style={{ flex: 1 }}>
                        <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                          isComplete 
                            ? 'bg-primary border-primary text-white' 
                            : isActive
                            ? 'bg-primary border-primary text-white'
                            : 'bg-white border-gray-300 text-gray-400'
                        }`}>
                          {isComplete ? (
                            <CheckCircle className="h-6 w-6" />
                          ) : (
                            <Circle className="h-6 w-6" />
                          )}
                        </div>
                        <div className="mt-2 text-center max-w-[120px]">
                          <p className={`text-xs font-medium ${
                            isActive ? 'text-primary' : isComplete ? 'text-gray-900' : 'text-gray-500'
                          }`}>
                            {etape.nom}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Contenu de l'étape actuelle */}
              {etapeCourante <= EtapePipeline.VALIDATION_COMMISSION && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={etapeCourante}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {estSuiveur ? renderEtapeSuiveur() : renderEtapeContent()}
                  </motion.div>
                </AnimatePresence>
              )}
            </TabsContent>

            {/* Onglet 2 : Dépôt dossier */}
            <TabsContent value="depot-dossier" className="space-y-6">
              {depotDossierDebloque ? (
                <>
                  {/* Indicateur de progression pour Dépôt dossier */}
                  <div className="relative">
                    {/* Ligne de progression */}
                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
                      <div 
                        className="h-full bg-primary transition-all duration-500"
                    style={{ 
                      width: etapeCourante >= EtapePipeline.PRELECTURE
                        ? `${((etapeCourante - EtapePipeline.PRELECTURE) / (ETAPES_DEPOT_DOSSIER.length - 1)) * 100}%`
                        : '0%'
                    }}
                      />
                    </div>

                    {/* Étapes */}
                    <div className="relative flex justify-between">
                      {ETAPES_DEPOT_DOSSIER.map((etape) => {
                        const isComplete = etape.id < etapeCourante;
                        const isActive = etape.id === etapeCourante;

                        return (
                          <div key={etape.id} className="flex flex-col items-center" style={{ flex: 1 }}>
                            <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                              isComplete 
                                ? 'bg-primary border-primary text-white' 
                                : isActive
                                ? 'bg-primary border-primary text-white'
                                : 'bg-white border-gray-300 text-gray-400'
                            }`}>
                              {isComplete ? (
                                <CheckCircle className="h-6 w-6" />
                              ) : (
                                <Circle className="h-6 w-6" />
                              )}
                            </div>
                            <div className="mt-2 text-center max-w-[120px]">
                              <p className={`text-xs font-medium ${
                                isActive ? 'text-primary' : isComplete ? 'text-gray-900' : 'text-gray-500'
                              }`}>
                                {etape.nom}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Contenu de l'étape actuelle */}
                  {etapeCourante >= EtapePipeline.PRELECTURE && (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={etapeCourante}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        {estSuiveur ? renderEtapeSuiveur() : renderEtapeContent()}
                      </motion.div>
                    </AnimatePresence>
                  )}
                </>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Lock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 mb-2">Onglet verrouillé</p>
                    <p className="text-sm text-gray-500">
                      Vous devez terminer toutes les étapes du "Dépôt sujet" pour accéder à cette section.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcessusPipeline;

