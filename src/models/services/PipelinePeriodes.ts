// ============================================================================
// TYPES & INTERFACES - PIPELINE DES PÉRIODES
// ============================================================================

import type { AnneeAcademique } from './AnneeAcademique';
import type { SessionSoutenance } from './SessionSoutenance';
import { TypeSessionSoutenance } from './SessionSoutenance';
import type { PeriodeValidation, TypePeriodeValidation } from '../commission/PeriodeValidation';
import type { PeriodeDepotSujet } from './PeriodeDepotSujet';
import type { PeriodePrelecture } from './PeriodePrelecture';
import type { PeriodeDisponibilite } from './PeriodeDisponibilite';
import type { PeriodeDepotFinal } from './PeriodeDepotFinal';

export enum TypeEtapePipeline {
  DEBUT_ANNEE = 'DEBUT_ANNEE', // Début de l'année académique
  DEPOT_SUJET_ET_ENCADREMENT = 'DEPOT_SUJET_ET_ENCADREMENT', // Dépôt sujet avec choix encadrant (même période)
  VALIDATION_SUJETS = 'VALIDATION_SUJETS',
  PRELECTURE = 'PRELECTURE',
  RENSEIGNEMENT_DISPONIBILITE = 'RENSEIGNEMENT_DISPONIBILITE',
  DEPOT_FINAL = 'DEPOT_FINAL',
  SESSION_SOUTENANCE = 'SESSION_SOUTENANCE',
  VALIDATION_CORRECTIONS = 'VALIDATION_CORRECTIONS',
  FIN_ANNEE = 'FIN_ANNEE' // Fin de l'année académique
}

export enum StatutEtape {
  PAS_COMMENCEE = 'PAS_COMMENCEE',
  PLANIFIEE = 'PLANIFIEE',
  ACTIVE = 'ACTIVE',
  TERMINEE = 'TERMINEE',
  BLOQUEE = 'BLOQUEE'
}

export interface EtapePipeline {
  id: TypeEtapePipeline;
  nom: string;
  description: string;
  ordre: number; // Ordre dans le pipeline (1, 2, 3, ...)
  statut: StatutEtape;
  dateDebut?: Date;
  dateFin?: Date;
  peutActiver: boolean; // Peut être activée maintenant (date arrivée)
  peutDesactiver: boolean; // Peut être désactivée (date fin arrivée)
  estRequis: boolean; // Étape requise pour continuer
  estRepetitive: boolean; // Peut se répéter (ex: sessions, validations corrections)
  donnees?: {
    // Données spécifiques selon le type
    anneeAcademique?: AnneeAcademique;
    periodeDepotSujet?: PeriodeDepotSujet; // Inclut aussi la demande d'encadrement (même période)
    periodeValidation?: PeriodeValidation;
    periodePrelecture?: PeriodePrelecture;
    periodeDisponibilite?: PeriodeDisponibilite;
    periodeDepotFinal?: PeriodeDepotFinal;
    sessionSoutenance?: SessionSoutenance;
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Vérifie si une date est arrivée
 */
export const estDateArrivee = (date?: Date): boolean => {
  if (!date) return false;
  const maintenant = new Date();
  maintenant.setHours(0, 0, 0, 0);
  const dateCompare = new Date(date);
  dateCompare.setHours(0, 0, 0, 0);
  return maintenant >= dateCompare;
};

/**
 * Vérifie si une date est passée
 */
export const estDatePassee = (date?: Date): boolean => {
  if (!date) return false;
  const maintenant = new Date();
  maintenant.setHours(23, 59, 59, 999);
  const dateCompare = new Date(date);
  dateCompare.setHours(23, 59, 59, 999);
  return maintenant > dateCompare;
};

/**
 * Vérifie si on est dans une période (entre dateDebut et dateFin)
 */
export const estDansPeriode = (dateDebut?: Date, dateFin?: Date): boolean => {
  if (!dateDebut) return false;
  const maintenant = new Date();
  const debut = new Date(dateDebut);
  debut.setHours(0, 0, 0, 0);
  const fin = dateFin ? new Date(dateFin) : null;
  if (fin) {
    fin.setHours(23, 59, 59, 999);
  }
  
  return maintenant >= debut && (!fin || maintenant <= fin);
};

/**
 * Calcule le statut d'une étape basé sur les dates
 */
export const calculerStatutEtape = (
  dateDebut?: Date,
  dateFin?: Date,
  estActive?: boolean
): StatutEtape => {
  if (!dateDebut) {
    return StatutEtape.PAS_COMMENCEE;
  }
  
  if (estDatePassee(dateFin)) {
    return StatutEtape.TERMINEE;
  }
  
  if (estDansPeriode(dateDebut, dateFin)) {
    return estActive ? StatutEtape.ACTIVE : StatutEtape.PAS_COMMENCEE;
  }
  
  // Par défaut, tout est PAS_COMMENCEE jusqu'à activation
  return StatutEtape.PAS_COMMENCEE;
};

/**
 * Vérifie si une étape peut être activée
 */
export const peutActiverEtape = (
  etape: EtapePipeline,
  etapesPrecedentes: EtapePipeline[]
): boolean => {
  // Vérifier les prérequis
  const etapesRequis = etapesPrecedentes.filter(e => e.estRequis && e.ordre < etape.ordre);
  const toutesEtapesRequisTerminees = etapesRequis.every(e => e.statut === StatutEtape.TERMINEE);
  
  if (!toutesEtapesRequisTerminees) {
    return false;
  }
  
  // Vérifier si la date est arrivée
  if (!estDateArrivee(etape.dateDebut)) {
    return false;
  }
  
  // Vérifier si l'étape n'est pas déjà terminée
  if (etape.statut === StatutEtape.TERMINEE) {
    return false;
  }
  
  return true;
};

/**
 * Vérifie si une étape peut être désactivée
 */
export const peutDesactiverEtape = (etape: EtapePipeline): boolean => {
  // Peut être désactivée si la date de fin est passée
  if (estDatePassee(etape.dateFin)) {
    return true;
  }
  
  // Peut être désactivée manuellement si active
  if (etape.statut === StatutEtape.ACTIVE) {
    return true;
  }
  
  return false;
};

/**
 * Construit le pipeline complet pour une année académique
 */
export const construirePipeline = (
  anneeAcademique: AnneeAcademique,
  periodeDepotSujet?: PeriodeDepotSujet, // Inclut aussi la demande d'encadrement (même période)
  periodeValidationSujets?: PeriodeValidation,
  periodesPrelecture?: PeriodePrelecture[], // Répétitif, lié à chaque session
  periodesDisponibilite?: PeriodeDisponibilite[], // Répétitif, lié à chaque session (peut continuer après dépôt final)
  periodesDepotFinal?: PeriodeDepotFinal[], // Répétitif, lié à chaque session
  sessionsSoutenance?: SessionSoutenance[], // Seulement sessions principales (Septembre, Décembre)
  periodesValidationCorrections?: PeriodeValidation[] // Répétitif, une par session
): EtapePipeline[] => {
  const pipeline: EtapePipeline[] = [];
  
  // 1. Début Année Académique
  pipeline.push({
    id: TypeEtapePipeline.DEBUT_ANNEE,
    nom: 'Début Année Académique',
    description: `Début de l'année académique ${anneeAcademique.code}`,
    ordre: 1,
    statut: anneeAcademique.estActive ? StatutEtape.ACTIVE : StatutEtape.PAS_COMMENCEE,
    dateDebut: anneeAcademique.dateDebut,
    dateFin: anneeAcademique.dateDebut, // Même date que le début
    peutActiver: peutActiverEtape(
      { id: TypeEtapePipeline.DEBUT_ANNEE, nom: '', description: '', ordre: 1, statut: StatutEtape.PAS_COMMENCEE, peutActiver: false, peutDesactiver: false, estRequis: true, estRepetitive: false },
      []
    ),
    peutDesactiver: false,
    estRequis: true,
    estRepetitive: false,
    donnees: { anneeAcademique }
  });
  
  // 2. Dépôt Sujet avec Choix d'Encadrant (même période, une seule étape)
  if (periodeDepotSujet) {
    const statut = calculerStatutEtape(periodeDepotSujet.dateDebut, periodeDepotSujet.dateFin, periodeDepotSujet.estActive);
    pipeline.push({
      id: TypeEtapePipeline.DEPOT_SUJET_ET_ENCADREMENT,
      nom: 'Dépôt de Sujet et Choix d\'Encadrant',
      description: 'Période de dépôt des sujets avec choix de l\'encadrant par les étudiants',
      ordre: 2,
      statut,
      dateDebut: periodeDepotSujet.dateDebut,
      dateFin: periodeDepotSujet.dateFin,
      peutActiver: peutActiverEtape(
        { id: TypeEtapePipeline.DEPOT_SUJET_ET_ENCADREMENT, nom: '', description: '', ordre: 2, statut, peutActiver: false, peutDesactiver: false, estRequis: true, estRepetitive: false, dateDebut: periodeDepotSujet.dateDebut, dateFin: periodeDepotSujet.dateFin },
        pipeline
      ),
      peutDesactiver: peutDesactiverEtape({ id: TypeEtapePipeline.DEPOT_SUJET_ET_ENCADREMENT, nom: '', description: '', ordre: 2, statut, peutActiver: false, peutDesactiver: false, estRequis: true, estRepetitive: false, dateDebut: periodeDepotSujet.dateDebut, dateFin: periodeDepotSujet.dateFin }),
      estRequis: true,
      estRepetitive: false,
      donnees: { periodeDepotSujet }
    });
  }
  
  // 3. Validation Sujets
  if (periodeValidationSujets) {
    const statut = calculerStatutEtape(periodeValidationSujets.dateDebut, periodeValidationSujets.dateFin, periodeValidationSujets.estActive);
    pipeline.push({
      id: TypeEtapePipeline.VALIDATION_SUJETS,
      nom: 'Validation des Sujets',
      description: 'Validation des sujets par la commission',
      ordre: 3,
      statut,
      dateDebut: periodeValidationSujets.dateDebut,
      dateFin: periodeValidationSujets.dateFin,
      peutActiver: peutActiverEtape(
        { id: TypeEtapePipeline.VALIDATION_SUJETS, nom: '', description: '', ordre: 3, statut, peutActiver: false, peutDesactiver: false, estRequis: true, estRepetitive: false, dateDebut: periodeValidationSujets.dateDebut, dateFin: periodeValidationSujets.dateFin },
        pipeline
      ),
      peutDesactiver: peutDesactiverEtape({ id: TypeEtapePipeline.VALIDATION_SUJETS, nom: '', description: '', ordre: 3, statut, peutActiver: false, peutDesactiver: false, estRequis: true, estRepetitive: false, dateDebut: periodeValidationSujets.dateDebut, dateFin: periodeValidationSujets.dateFin }),
      estRequis: true,
      estRepetitive: false,
      donnees: { periodeValidation: periodeValidationSujets }
    });
  }
  
  // 4-5. Pré-lecture et Dépôt Final (répétitifs, liés à chaque session)
  // Ces périodes seront ajoutées dynamiquement avant chaque session
  
  // 4-8. Cycle répétitif pour chaque session principale (Septembre, Décembre)
  // Structure : Pré-lecture (en parallèle avec Renseignement Disponibilité) → Dépôt Final → Session → Validation Corrections
  // Renseignement Disponibilité peut continuer après la fin du dépôt final
  
  // Filtrer et trier les sessions : seulement Septembre et Décembre, triées par date
  const sessionsPrincipales = sessionsSoutenance ? [...sessionsSoutenance]
    .filter(s => s.typeSession === TypeSessionSoutenance.SEPTEMBRE || s.typeSession === TypeSessionSoutenance.DECEMBRE)
    .sort((a, b) => {
      // Septembre avant Décembre
      if (a.typeSession === TypeSessionSoutenance.SEPTEMBRE && b.typeSession === TypeSessionSoutenance.DECEMBRE) return -1;
      if (a.typeSession === TypeSessionSoutenance.DECEMBRE && b.typeSession === TypeSessionSoutenance.SEPTEMBRE) return 1;
      // Puis par date
      return a.dateDebut.getTime() - b.dateDebut.getTime();
    }) : [];
  
  let ordreActuel = 4;
  
  if (sessionsPrincipales.length > 0) {
    sessionsPrincipales.forEach((session) => {
      // Trouver les périodes associées à cette session
      const prelectureAssociee = periodesPrelecture?.find(p => p.sessionSoutenanceId === session.idSession);
      const depotFinalAssocie = periodesDepotFinal?.find(p => p.sessionSoutenanceId === session.idSession);
      const validationCorrectionsAssociee = periodesValidationCorrections?.find(
        p => p.sessionSoutenanceId === session.idSession
      );
      
      // Pré-lecture (si associée, en parallèle avec Renseignement Disponibilité)
      if (prelectureAssociee) {
        const statut = calculerStatutEtape(prelectureAssociee.dateDebut, prelectureAssociee.dateFin, prelectureAssociee.estActive);
        pipeline.push({
          id: TypeEtapePipeline.PRELECTURE,
          nom: `Pré-lecture - ${session.nom}`,
          description: `Pré-lecture pour la session ${session.nom}`,
          ordre: ordreActuel, // Même ordre que Renseignement Disponibilité (parallèle)
          statut,
          dateDebut: prelectureAssociee.dateDebut,
          dateFin: prelectureAssociee.dateFin,
          peutActiver: peutActiverEtape(
            { id: TypeEtapePipeline.PRELECTURE, nom: '', description: '', ordre: ordreActuel, statut, peutActiver: false, peutDesactiver: false, estRequis: true, estRepetitive: true, dateDebut: prelectureAssociee.dateDebut, dateFin: prelectureAssociee.dateFin },
            pipeline
          ),
          peutDesactiver: peutDesactiverEtape({ id: TypeEtapePipeline.PRELECTURE, nom: '', description: '', ordre: ordreActuel, statut, peutActiver: false, peutDesactiver: false, estRequis: true, estRepetitive: true, dateDebut: prelectureAssociee.dateDebut, dateFin: prelectureAssociee.dateFin }),
          estRequis: true,
          estRepetitive: true,
          donnees: { periodePrelecture: prelectureAssociee }
        });
      }
      
      // Renseignement Disponibilité (si associé, en parallèle avec Pré-lecture, peut continuer après dépôt final)
      const disponibiliteAssociee = periodesDisponibilite?.find(p => p.sessionSoutenanceId === session.idSession);
      if (disponibiliteAssociee) {
        const statut = calculerStatutEtape(disponibiliteAssociee.dateDebut, disponibiliteAssociee.dateFin, disponibiliteAssociee.estActive);
        pipeline.push({
          id: TypeEtapePipeline.RENSEIGNEMENT_DISPONIBILITE,
          nom: `Renseignement Disponibilité - ${session.nom}`,
          description: `Renseignement des disponibilités pour la session ${session.nom} (peut continuer après dépôt final)`,
          ordre: ordreActuel, // Même ordre que Pré-lecture (parallèle)
          statut,
          dateDebut: disponibiliteAssociee.dateDebut,
          dateFin: disponibiliteAssociee.dateFin, // Peut être après la fin du dépôt final
          peutActiver: peutActiverEtape(
            { id: TypeEtapePipeline.RENSEIGNEMENT_DISPONIBILITE, nom: '', description: '', ordre: ordreActuel, statut, peutActiver: false, peutDesactiver: false, estRequis: true, estRepetitive: true, dateDebut: disponibiliteAssociee.dateDebut, dateFin: disponibiliteAssociee.dateFin },
            pipeline
          ),
          peutDesactiver: peutDesactiverEtape({ id: TypeEtapePipeline.RENSEIGNEMENT_DISPONIBILITE, nom: '', description: '', ordre: ordreActuel, statut, peutActiver: false, peutDesactiver: false, estRequis: true, estRepetitive: true, dateDebut: disponibiliteAssociee.dateDebut, dateFin: disponibiliteAssociee.dateFin }),
          estRequis: true,
          estRepetitive: true,
          donnees: { periodeDisponibilite: disponibiliteAssociee }
        });
      }
      
      ordreActuel++; // Incrémenter après les périodes parallèles
      
      // Dépôt Final (si associé, après Pré-lecture et Renseignement Disponibilité)
      if (depotFinalAssocie) {
        const statut = calculerStatutEtape(depotFinalAssocie.dateDebut, depotFinalAssocie.dateFin, depotFinalAssocie.estActive);
        pipeline.push({
          id: TypeEtapePipeline.DEPOT_FINAL,
          nom: `Dépôt Final - ${session.nom}`,
          description: `Dépôt final pour la session ${session.nom}`,
          ordre: ordreActuel++,
          statut,
          dateDebut: depotFinalAssocie.dateDebut,
          dateFin: depotFinalAssocie.dateFin,
          peutActiver: peutActiverEtape(
            { id: TypeEtapePipeline.DEPOT_FINAL, nom: '', description: '', ordre: ordreActuel - 1, statut, peutActiver: false, peutDesactiver: false, estRequis: true, estRepetitive: true, dateDebut: depotFinalAssocie.dateDebut, dateFin: depotFinalAssocie.dateFin },
            pipeline
          ),
          peutDesactiver: peutDesactiverEtape({ id: TypeEtapePipeline.DEPOT_FINAL, nom: '', description: '', ordre: ordreActuel - 1, statut, peutActiver: false, peutDesactiver: false, estRequis: true, estRepetitive: true, dateDebut: depotFinalAssocie.dateDebut, dateFin: depotFinalAssocie.dateFin }),
          estRequis: true,
          estRepetitive: true,
          donnees: { periodeDepotFinal: depotFinalAssocie }
        });
      }
      
      // Session de Soutenance - Par défaut PAS_COMMENCEE
      const statut = session.statut === 'OUVERTE' ? StatutEtape.ACTIVE : 
                     session.statut === 'FERMEE' ? StatutEtape.TERMINEE : 
                     StatutEtape.PAS_COMMENCEE;
      
      // Extraire le nom de la session sans le préfixe "Session"
      const nomSession = session.nom.replace(/^Session\s+/i, '');
      
      pipeline.push({
        id: TypeEtapePipeline.SESSION_SOUTENANCE,
        nom: `Soutenance ${nomSession}`,
        description: `Soutenance ${session.typeSession || ''}`,
        ordre: ordreActuel++,
        statut,
        dateDebut: session.dateDebut,
        dateFin: session.dateFin,
        peutActiver: peutActiverEtape(
          { id: TypeEtapePipeline.SESSION_SOUTENANCE, nom: '', description: '', ordre: ordreActuel - 1, statut, peutActiver: false, peutDesactiver: false, estRequis: true, estRepetitive: true, dateDebut: session.dateDebut, dateFin: session.dateFin },
          pipeline
        ),
        peutDesactiver: peutDesactiverEtape({ id: TypeEtapePipeline.SESSION_SOUTENANCE, nom: '', description: '', ordre: ordreActuel - 1, statut, peutActiver: false, peutDesactiver: false, estRequis: true, estRepetitive: true, dateDebut: session.dateDebut, dateFin: session.dateFin }),
        estRequis: true,
        estRepetitive: true,
        donnees: { sessionSoutenance: session }
      });
      
      // Validation Corrections (directement après chaque session, pas de période de correction)
      if (validationCorrectionsAssociee) {
        const statut = calculerStatutEtape(validationCorrectionsAssociee.dateDebut, validationCorrectionsAssociee.dateFin, validationCorrectionsAssociee.estActive);
        pipeline.push({
          id: TypeEtapePipeline.VALIDATION_CORRECTIONS,
          nom: `Validation Corrections - ${session.nom}`,
          description: `Validation des corrections après ${session.nom}`,
          ordre: ordreActuel++,
          statut,
          dateDebut: validationCorrectionsAssociee.dateDebut,
          dateFin: validationCorrectionsAssociee.dateFin,
          peutActiver: peutActiverEtape(
            { id: TypeEtapePipeline.VALIDATION_CORRECTIONS, nom: '', description: '', ordre: ordreActuel - 1, statut, peutActiver: false, peutDesactiver: false, estRequis: true, estRepetitive: true, dateDebut: validationCorrectionsAssociee.dateDebut, dateFin: validationCorrectionsAssociee.dateFin },
            pipeline
          ),
          peutDesactiver: peutDesactiverEtape({ id: TypeEtapePipeline.VALIDATION_CORRECTIONS, nom: '', description: '', ordre: ordreActuel - 1, statut, peutActiver: false, peutDesactiver: false, estRequis: true, estRepetitive: true, dateDebut: validationCorrectionsAssociee.dateDebut, dateFin: validationCorrectionsAssociee.dateFin }),
          estRequis: true,
          estRepetitive: true,
          donnees: { periodeValidation: validationCorrectionsAssociee }
        });
      }
    });
  }
  
  // Dernière étape : Fin Année Académique
  pipeline.push({
    id: TypeEtapePipeline.FIN_ANNEE,
    nom: 'Fin Année Académique',
    description: `Fin de l'année académique ${anneeAcademique.code}`,
    ordre: 999, // Toujours à la fin
    statut: anneeAcademique.estActive ? StatutEtape.ACTIVE : StatutEtape.PAS_COMMENCEE,
    dateDebut: anneeAcademique.dateFin,
    dateFin: anneeAcademique.dateFin,
    peutActiver: false,
    peutDesactiver: peutDesactiverEtape(
      { id: TypeEtapePipeline.FIN_ANNEE, nom: '', description: '', ordre: 999, statut: anneeAcademique.estActive ? StatutEtape.ACTIVE : StatutEtape.PAS_COMMENCEE, peutActiver: false, peutDesactiver: false, estRequis: true, estRepetitive: false, dateDebut: anneeAcademique.dateFin, dateFin: anneeAcademique.dateFin },
      pipeline
    ),
    estRequis: true,
    estRepetitive: false,
    donnees: { anneeAcademique }
  });
  
  return pipeline.sort((a, b) => a.ordre - b.ordre);
};

