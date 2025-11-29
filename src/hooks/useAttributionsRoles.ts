// ============================================================================
// HOOK - GESTION DES ATTRIBUTIONS DE RÔLES
// ============================================================================

import { useState, useCallback } from 'react';
import type { AttributionRole } from '../models/services/AttributionRole';
import { TypeRole } from '../models/services/AttributionRole';
import { mockAttributionsRoles } from '../mocks/models/AttributionRole.mock';
import {
  getAttributionsActives,
  hasRole,
  getProfesseursAvecRole
} from '../models/services/AttributionRole';

/**
 * Hook pour récupérer toutes les attributions de rôles
 */
export const useAttributionsRoles = (anneeAcademique?: string) => {
  const [attributions] = useState<AttributionRole[]>(mockAttributionsRoles);
  const [isLoading] = useState(false);
  const [error] = useState<Error | null>(null);

  const attributionsFiltrees = anneeAcademique
    ? attributions.filter(a => a.anneeAcademique === anneeAcademique)
    : attributions;

  return {
    attributions: attributionsFiltrees,
    isLoading,
    error
  };
};

/**
 * Hook pour récupérer les attributions actives d'un professeur
 */
export const useAttributionsProfesseur = (idProfesseur: number, anneeAcademique: string) => {
  const [attributions] = useState<AttributionRole[]>(mockAttributionsRoles);
  const [isLoading] = useState(false);
  const [error] = useState<Error | null>(null);

  const attributionsProfesseur = getAttributionsActives(attributions, idProfesseur, anneeAcademique);

  return {
    attributions: attributionsProfesseur,
    isLoading,
    error,
    estCommission: hasRole(attributions, idProfesseur, TypeRole.COMMISSION, anneeAcademique),
    estJurie: hasRole(attributions, idProfesseur, TypeRole.JURIE, anneeAcademique),
    peutEtrePresident: hasRole(attributions, idProfesseur, TypeRole.PRESIDENT_JURY_POSSIBLE, anneeAcademique)
  };
};

/**
 * Hook pour récupérer les professeurs avec un rôle spécifique
 */
export const useProfesseursAvecRole = (typeRole: TypeRole, anneeAcademique: string) => {
  const [attributions] = useState<AttributionRole[]>(mockAttributionsRoles);
  const [isLoading] = useState(false);
  const [error] = useState<Error | null>(null);

  const professeurs = getProfesseursAvecRole(attributions, typeRole, anneeAcademique);

  return {
    professeurs,
    isLoading,
    error
  };
};

/**
 * Hook pour attribuer un rôle à un professeur
 */
export const useAttribuerRole = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const attribuerRole = useCallback(async (
    idProfesseur: number,
    typeRole: TypeRole,
    anneeAcademique: string,
    attribuePar: number
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Appel API
      // const response = await fetch('/api/departement/attributions-roles', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ idProfesseur, typeRole, anneeAcademique, attribuePar })
      // });
      // const nouvelleAttribution = await response.json();

      // Simulation: Ajouter l'attribution
      const professeur = mockAttributionsRoles[0].professeur; // TODO: Récupérer le vrai professeur
      const nouvelleAttribution: AttributionRole = {
        idAttribution: mockAttributionsRoles.length + 1,
        professeur,
        typeRole,
        anneeAcademique,
        dateAttribution: new Date(),
        attribuePar,
        estActif: true
      };
      mockAttributionsRoles.push(nouvelleAttribution);

      console.log('Rôle attribué:', nouvelleAttribution);
      return nouvelleAttribution;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    attribuerRole,
    isLoading,
    error
  };
};

/**
 * Hook pour retirer un rôle à un professeur
 */
export const useRetirerRole = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const retirerRole = useCallback(async (idAttribution: number) => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Appel API
      // await fetch(`/api/departement/attributions-roles/${idAttribution}`, { method: 'DELETE' });

      // Simulation: Désactiver l'attribution
      const attribution = mockAttributionsRoles.find(a => a.idAttribution === idAttribution);
      if (attribution) {
        attribution.estActif = false;
        attribution.dateRetrait = new Date();
      }

      console.log(`Attribution ${idAttribution} retirée`);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    retirerRole,
    isLoading,
    error
  };
};
