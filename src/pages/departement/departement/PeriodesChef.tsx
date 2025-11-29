import React, { useState, useMemo, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { useAnneesAcademiques, useActiverAnneeAcademique, useCloturerAnneeAcademique } from '../../../hooks/useAnneesAcademiques';
import { useSessionsSoutenance, useOuvrirSessionSoutenance, useFermerSessionSoutenance } from '../../../hooks/useSessionsSoutenance';
import { 
  PeriodeValidation, 
  TypePeriodeValidation, 
  mockPeriodesValidation,
  getPeriodeValidationActive,
  changerPeriodeActive
} from '../../../models/commission/PeriodeValidation';
import {
  mockPeriodesDepotSujet,
  getPeriodeDepotSujetActive
} from '../../../models/services/PeriodeDepotSujet';
import {
  mockPeriodesPrelecture,
  getPeriodePrelectureActive
} from '../../../models/services/PeriodePrelecture';
import {
  mockPeriodesDisponibilite,
  getPeriodeDisponibiliteActive
} from '../../../models/services/PeriodeDisponibilite';
import {
  mockPeriodesDepotFinal,
  getPeriodeDepotFinalActive
} from '../../../models/services/PeriodeDepotFinal';
import {
  construirePipeline,
  TypeEtapePipeline,
  StatutEtape,
  estDateArrivee,
  estDatePassee
} from '../../../models/services/PipelinePeriodes';
import {
  PipelinePeriodes,
  CalendrierAnnuel,
  ModalNouvelleAnnee,
  ModalNouvelleSession,
  ModalNouvellePeriodeValidation
} from '../../../components/periodes';
import type { EtapePipeline } from '../../../models/services/PipelinePeriodes';

type ActiveTab = 'pipeline' | 'calendrier';

const PeriodesChef: React.FC = () => {
  const { annees, anneeActive } = useAnneesAcademiques();
  const { activerAnnee } = useActiverAnneeAcademique();
  const { cloturerAnnee } = useCloturerAnneeAcademique();
  
  const { sessions } = useSessionsSoutenance(anneeActive?.code);
  const { ouvrirSession } = useOuvrirSessionSoutenance();
  const { fermerSession } = useFermerSessionSoutenance();

  const [activeTab, setActiveTab] = useState<ActiveTab>('pipeline');
  const [showModalNouvelleAnnee, setShowModalNouvelleAnnee] = useState(false);
  const [showModalNouvelleSession, setShowModalNouvelleSession] = useState(false);
  const [showModalNouvellePeriodeValidation, setShowModalNouvellePeriodeValidation] = useState(false);
  const [etapeAModifier, setEtapeAModifier] = useState<EtapePipeline | null>(null);
  const [periodesValidation, setPeriodesValidation] = useState<PeriodeValidation[]>(mockPeriodesValidation);

  // Récupérer toutes les périodes pour l'année active
  const periodeDepotSujet = useMemo(() => {
    if (!anneeActive) return undefined;
    return mockPeriodesDepotSujet.find(p => p.anneeAcademique === anneeActive.code);
  }, [anneeActive]);


  const periodeValidationSujets = useMemo(() => {
    if (!anneeActive) return undefined;
    return periodesValidation.find(
      p => p.anneeAcademique === anneeActive.code && p.type === TypePeriodeValidation.VALIDATION_SUJETS
    );
  }, [anneeActive, periodesValidation]);

  const periodesPrelecture = useMemo(() => {
    if (!anneeActive) return [];
    return mockPeriodesPrelecture.filter(p => p.anneeAcademique === anneeActive.code);
  }, [anneeActive]);

  const periodesDisponibilite = useMemo(() => {
    if (!anneeActive) return [];
    return mockPeriodesDisponibilite.filter(p => p.anneeAcademique === anneeActive.code);
  }, [anneeActive]);

  const periodesDepotFinal = useMemo(() => {
    if (!anneeActive) return [];
    return mockPeriodesDepotFinal.filter(p => p.anneeAcademique === anneeActive.code);
  }, [anneeActive]);


  const periodesValidationCorrections = useMemo(() => {
    if (!anneeActive) return [];
    return periodesValidation.filter(
      p => p.anneeAcademique === anneeActive.code && p.type === TypePeriodeValidation.VALIDATION_CORRECTIONS
    );
  }, [anneeActive, periodesValidation]);

  // Construire le pipeline
  const pipeline = useMemo(() => {
    if (!anneeActive) return [];
    return construirePipeline(
      anneeActive,
      periodeDepotSujet, // Inclut aussi la demande d'encadrement (même période)
      periodeValidationSujets,
      periodesPrelecture,
      periodesDisponibilite,
      periodesDepotFinal,
      sessions,
      periodesValidationCorrections
    );
  }, [
    anneeActive,
    periodeDepotSujet,
    periodeValidationSujets,
    periodesPrelecture,
    periodesDisponibilite,
    periodesDepotFinal,
    sessions,
    periodesValidationCorrections
  ]);

  // Vérifier et activer/désactiver automatiquement les périodes basées sur les dates
  useEffect(() => {
    if (!anneeActive) return;

    // Vérifier chaque période et activer/désactiver automatiquement
    pipeline.forEach(etape => {
      if (etape.peutActiver && etape.statut !== StatutEtape.ACTIVE && estDateArrivee(etape.dateDebut)) {
        // Auto-activation possible (mais nécessite confirmation manuelle pour certaines)
        console.log(`Période ${etape.nom} peut être activée`);
      }
      
      if (etape.peutDesactiver && etape.statut === StatutEtape.ACTIVE && estDatePassee(etape.dateFin)) {
        // Auto-désactivation
        console.log(`Période ${etape.nom} doit être désactivée`);
        // TODO: Implémenter la désactivation automatique
      }
    });
  }, [pipeline, anneeActive]);

  // Handlers
  const handleActiverEtape = async (etape: EtapePipeline) => {
    if (!etape.peutActiver) {
      alert('Cette période ne peut pas être activée maintenant. Vérifiez les dates et les prérequis.');
      return;
    }

    if (confirm(`Voulez-vous activer la période "${etape.nom}" ?`)) {
      // TODO: Implémenter l'activation selon le type d'étape
      switch (etape.id) {
        case TypeEtapePipeline.DEBUT_ANNEE:
          if (etape.donnees?.anneeAcademique) {
            await activerAnnee(etape.donnees.anneeAcademique.idAnnee);
            window.location.reload();
          }
          break;
        case TypeEtapePipeline.FIN_ANNEE:
          if (etape.donnees?.anneeAcademique) {
            await cloturerAnnee(etape.donnees.anneeAcademique.idAnnee);
            window.location.reload();
          }
          break;
        case TypeEtapePipeline.SESSION_SOUTENANCE:
          if (etape.donnees?.sessionSoutenance) {
            await ouvrirSession(etape.donnees.sessionSoutenance.idSession);
            window.location.reload();
          }
          break;
        case TypeEtapePipeline.VALIDATION_SUJETS:
        case TypeEtapePipeline.VALIDATION_CORRECTIONS:
          if (etape.donnees?.periodeValidation) {
            changerPeriodeActive(etape.donnees.periodeValidation.type);
            setPeriodesValidation([...mockPeriodesValidation]);
          }
          break;
        default:
          // Pour les autres périodes, activer directement
          console.log('Activation de', etape.nom);
      }
    }
  };

  const handleDesactiverEtape = async (etape: EtapePipeline) => {
    if (!etape.peutDesactiver) {
      alert('Cette période ne peut pas être désactivée maintenant.');
      return;
    }

    if (confirm(`Voulez-vous désactiver la période "${etape.nom}" ?`)) {
      // TODO: Implémenter la désactivation selon le type d'étape
      switch (etape.id) {
        case TypeEtapePipeline.SESSION_SOUTENANCE:
          if (etape.donnees?.sessionSoutenance) {
            await fermerSession(etape.donnees.sessionSoutenance.idSession);
            window.location.reload();
          }
          break;
        case TypeEtapePipeline.VALIDATION_SUJETS:
        case TypeEtapePipeline.VALIDATION_CORRECTIONS:
          changerPeriodeActive(TypePeriodeValidation.AUCUNE);
          setPeriodesValidation([...mockPeriodesValidation]);
          break;
        default:
          console.log('Désactivation de', etape.nom);
      }
    }
  };

  const handleModifierEtape = (etape: EtapePipeline) => {
    setEtapeAModifier(etape);
    // Ouvrir le modal approprié selon le type
    switch (etape.id) {
      case TypeEtapePipeline.SESSION_SOUTENANCE:
        setShowModalNouvelleSession(true);
        break;
      case TypeEtapePipeline.VALIDATION_SUJETS:
      case TypeEtapePipeline.VALIDATION_CORRECTIONS:
        setShowModalNouvellePeriodeValidation(true);
        break;
      default:
        console.log('Modification de', etape.nom);
    }
  };

  const handleDateChange = (etapeId: string, type: 'debut' | 'fin', nouvelleDate: Date) => {
    // TODO: Implémenter la modification de date via API
    console.log('Modification date', etapeId, type, nouvelleDate);
  };

  const handleAjouterPeriode = (type: TypeEtapePipeline, dateDebut: Date, dateFin: Date, nom?: string) => {
    // TODO: Implémenter l'ajout de période via API
    console.log('Ajout période', type, dateDebut, dateFin, nom);
    
    // Pour l'instant, on peut ouvrir le modal approprié selon le type
    switch (type) {
      case TypeEtapePipeline.SESSION_SOUTENANCE:
        setShowModalNouvelleSession(true);
        break;
      case TypeEtapePipeline.VALIDATION_SUJETS:
      case TypeEtapePipeline.VALIDATION_CORRECTIONS:
        setShowModalNouvellePeriodeValidation(true);
        break;
      default:
        console.log('Ajout de période', type, 'à implémenter');
    }
  };

  const handleModifierPeriode = (etapeId: string, dateDebut: Date, dateFin: Date) => {
    // Trouver l'étape à modifier
    const etape = pipeline.find(e => e.id === etapeId);
    if (!etape) return;

    // Ouvrir le modal de modification approprié
    handleModifierEtape(etape);
    
    // TODO: Implémenter la modification de dates via API
    console.log('Modification période', etapeId, dateDebut, dateFin);
  };

  const handleCloturerAnnee = async () => {
    if (!anneeActive) return;
    
    // Vérifier que toutes les périodes requises sont terminées
    const etapesRequis = pipeline.filter(e => e.estRequis);
    const toutesTerminees = etapesRequis.every(e => e.statut === StatutEtape.TERMINEE);
    
    if (!toutesTerminees) {
      alert('Impossible de clôturer l\'année académique. Toutes les périodes requises doivent être terminées.');
      return;
    }

    if (confirm('Êtes-vous sûr de vouloir clôturer cette année académique ? Cette action est irréversible.')) {
      await cloturerAnnee(anneeActive.idAnnee);
      window.location.reload();
    }
  };

  const handleCreateAnnee = (data: { code: string; libelle: string; dateDebut: string; dateFin: string }) => {
    // TODO: Implémenter la création via API
    console.log('Créer année:', data);
  };

  const handleCreateSession = (data: { nom: string; dateDebut: string; dateFin: string; typeSession?: string }) => {
    // TODO: Implémenter la création via API
    console.log('Créer session:', data);
  };

  const handleCreatePeriodeValidation = (data: { type: TypePeriodeValidation; dateDebut: string; dateFin?: string }) => {
    // TODO: Implémenter la création via API
    console.log('Créer période validation:', data);
    changerPeriodeActive(data.type);
    setPeriodesValidation([...mockPeriodesValidation]);
  };

  if (!anneeActive) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Périodes</h1>
          <p className="text-gray-600 mt-1">Aucune année académique active</p>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Veuillez activer une année académique pour commencer.</p>
          <button
            onClick={() => setShowModalNouvelleAnnee(true)}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Créer une nouvelle année
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Périodes</h1>
          <p className="text-gray-600 mt-1">
            Pipeline des périodes académiques - {anneeActive.code}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCloturerAnnee}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            disabled={!pipeline.every(e => !e.estRequis || e.statut === StatutEtape.TERMINEE)}
          >
            Clôturer l'année
          </button>
        </div>
      </div>

      {/* Onglets */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ActiveTab)} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="calendrier">Calendrier Annuel</TabsTrigger>
        </TabsList>

        {/* Onglet Pipeline */}
        <TabsContent value="pipeline" className="space-y-6">
          <PipelinePeriodes
            etapes={pipeline}
            onActiver={handleActiverEtape}
            onDesactiver={handleDesactiverEtape}
            onModifier={handleModifierEtape}
          />
        </TabsContent>

        {/* Onglet Calendrier */}
        <TabsContent value="calendrier" className="space-y-6">
          {anneeActive && (
            <CalendrierAnnuel
              annee={anneeActive.dateDebut.getFullYear()}
              etapes={pipeline}
              onDateChange={handleDateChange}
              onAjouterPeriode={handleAjouterPeriode}
              onModifierPeriode={handleModifierPeriode}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <ModalNouvelleAnnee
        open={showModalNouvelleAnnee}
        onOpenChange={setShowModalNouvelleAnnee}
        onCreate={handleCreateAnnee}
      />

      <ModalNouvelleSession
        open={showModalNouvelleSession}
        onOpenChange={(open) => {
          setShowModalNouvelleSession(open);
          if (!open) setEtapeAModifier(null);
        }}
        onCreate={handleCreateSession}
        etapeAModifier={
          etapeAModifier?.id === TypeEtapePipeline.SESSION_SOUTENANCE
            ? {
                nom: etapeAModifier.nom.replace(/^Soutenance\s+/, ''),
                dateDebut: etapeAModifier.dateDebut,
                dateFin: etapeAModifier.dateFin,
                typeSession: etapeAModifier.donnees?.sessionSoutenance?.typeSession
              }
            : null
        }
      />

      <ModalNouvellePeriodeValidation
        open={showModalNouvellePeriodeValidation}
        onOpenChange={(open) => {
          setShowModalNouvellePeriodeValidation(open);
          if (!open) setEtapeAModifier(null);
        }}
        etapeAModifier={
          etapeAModifier?.id === TypeEtapePipeline.VALIDATION_SUJETS || etapeAModifier?.id === TypeEtapePipeline.VALIDATION_CORRECTIONS
            ? {
                type: etapeAModifier.donnees?.periodeValidation?.type || (etapeAModifier.id === TypeEtapePipeline.VALIDATION_SUJETS ? TypePeriodeValidation.VALIDATION_SUJETS : TypePeriodeValidation.VALIDATION_CORRECTIONS),
                dateDebut: etapeAModifier.dateDebut,
                dateFin: etapeAModifier.dateFin
              }
            : null
        }
        onCreate={handleCreatePeriodeValidation}
      />
    </div>
  );
};

export default PeriodesChef;
