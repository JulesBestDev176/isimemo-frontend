// ============================================================================
// HOOK - GESTION DES ANNÉES ACADÉMIQUES
// ============================================================================

import { useState, useCallback } from 'react';
import type { AnneeAcademique } from '../models/services/AnneeAcademique';
import { mockAnneesAcademiques } from '../mocks/models/AnneeAcademique.mock';
import { getAnneeActive } from '../models/services/AnneeAcademique';

/**
 * Hook pour récupérer toutes les années académiques
 */
export const useAnneesAcademiques = () => {
  const [annees] = useState<AnneeAcademique[]>(mockAnneesAcademiques);
  const [isLoading] = useState(false);
  const [error] = useState<Error | null>(null);

  return {
    annees,
    isLoading,
    error,
    anneeActive: getAnneeActive(annees)
  };
};

/**
 * Hook pour activer une année académique
 */
export const useActiverAnneeAcademique = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const activerAnnee = useCallback(async (idAnnee: number) => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Appel API
      // await fetch(`/api/departement/annees-academiques/${idAnnee}/activer`, { method: 'POST' });
      
      // Simulation: Désactiver toutes les années et activer celle-ci
      mockAnneesAcademiques.forEach(a => {
        a.estActive = a.idAnnee === idAnnee;
      });

      console.log(`Année académique ${idAnnee} activée`);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    activerAnnee,
    isLoading,
    error
  };
};

/**
 * Hook pour clôturer une année académique
 */
export const useCloturerAnneeAcademique = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const cloturerAnnee = useCallback(async (idAnnee: number) => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Appel API
      // await fetch(`/api/departement/annees-academiques/${idAnnee}/cloturer`, { method: 'POST' });
      
      // Simulation: Désactiver l'année
      const annee = mockAnneesAcademiques.find(a => a.idAnnee === idAnnee);
      if (annee) {
        annee.estActive = false;
      }

      console.log(`Année académique ${idAnnee} clôturée`);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    cloturerAnnee,
    isLoading,
    error
  };
};

/**
 * Hook pour créer une nouvelle année académique
 */
export const useCreerAnneeAcademique = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const creerAnnee = useCallback(async (annee: Omit<AnneeAcademique, 'idAnnee'>) => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Appel API
      // const response = await fetch('/api/departement/annees-academiques', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(annee)
      // });
      // const nouvelleAnnee = await response.json();

      // Simulation: Ajouter l'année
      const nouvelleAnnee: AnneeAcademique = {
        ...annee,
        idAnnee: mockAnneesAcademiques.length + 1
      };
      mockAnneesAcademiques.push(nouvelleAnnee);

      console.log('Nouvelle année académique créée:', nouvelleAnnee);
      return nouvelleAnnee;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    creerAnnee,
    isLoading,
    error
  };
};
