// ============================================================================
// HOOK - GESTION DES SESSIONS DE SOUTENANCE
// ============================================================================

import { useState, useCallback } from 'react';
import type { SessionSoutenance } from '../models/services/SessionSoutenance';
import { StatutSession } from '../models/services/SessionSoutenance';
import { mockSessionsSoutenance } from '../mocks/models/SessionSoutenance.mock';
import { getSessionOuverte, getSessionsByAnnee } from '../models/services/SessionSoutenance';

/**
 * Hook pour récupérer toutes les sessions de soutenance
 */
export const useSessionsSoutenance = (anneeAcademique?: string) => {
  const [sessions] = useState<SessionSoutenance[]>(mockSessionsSoutenance);
  const [isLoading] = useState(false);
  const [error] = useState<Error | null>(null);

  const sessionsFiltrees = anneeAcademique
    ? getSessionsByAnnee(sessions, anneeAcademique)
    : sessions;

  return {
    sessions: sessionsFiltrees,
    isLoading,
    error,
    sessionOuverte: anneeAcademique ? getSessionOuverte(sessions, anneeAcademique) : undefined
  };
};

/**
 * Hook pour créer une nouvelle session de soutenance
 */
export const useCreerSessionSoutenance = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const creerSession = useCallback(async (session: Omit<SessionSoutenance, 'idSession' | 'dateCreation'>) => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Appel API
      // const response = await fetch('/api/departement/sessions-soutenance', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(session)
      // });
      // const nouvelleSession = await response.json();

      // Simulation: Ajouter la session
      const nouvelleSession: SessionSoutenance = {
        ...session,
        idSession: mockSessionsSoutenance.length + 1,
        dateCreation: new Date()
      };
      mockSessionsSoutenance.push(nouvelleSession);

      console.log('Nouvelle session de soutenance créée:', nouvelleSession);
      return nouvelleSession;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    creerSession,
    isLoading,
    error
  };
};

/**
 * Hook pour ouvrir une session de soutenance
 */
export const useOuvrirSessionSoutenance = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const ouvrirSession = useCallback(async (idSession: number) => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Appel API
      // await fetch(`/api/departement/sessions-soutenance/${idSession}/ouvrir`, { method: 'POST' });

      // Simulation: Ouvrir la session
      const session = mockSessionsSoutenance.find(s => s.idSession === idSession);
      if (session) {
        session.statut = StatutSession.OUVERTE;
        session.dateOuverture = new Date();
      }

      console.log(`Session ${idSession} ouverte`);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    ouvrirSession,
    isLoading,
    error
  };
};

/**
 * Hook pour fermer une session de soutenance
 */
export const useFermerSessionSoutenance = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fermerSession = useCallback(async (idSession: number) => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Appel API
      // await fetch(`/api/departement/sessions-soutenance/${idSession}/fermer`, { method: 'POST' });

      // Simulation: Fermer la session
      const session = mockSessionsSoutenance.find(s => s.idSession === idSession);
      if (session) {
        session.statut = StatutSession.FERMEE;
        session.dateFermeture = new Date();
      }

      console.log(`Session ${idSession} fermée`);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    fermerSession,
    isLoading,
    error
  };
};

/**
 * Hook pour modifier une session de soutenance
 */
export const useModifierSessionSoutenance = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const modifierSession = useCallback(async (idSession: number, updates: Partial<SessionSoutenance>) => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Appel API
      // await fetch(`/api/departement/sessions-soutenance/${idSession}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updates)
      // });

      // Simulation: Modifier la session
      const sessionIndex = mockSessionsSoutenance.findIndex(s => s.idSession === idSession);
      if (sessionIndex !== -1) {
        mockSessionsSoutenance[sessionIndex] = {
          ...mockSessionsSoutenance[sessionIndex],
          ...updates
        };
      }

      console.log(`Session ${idSession} modifiée`);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    modifierSession,
    isLoading,
    error
  };
};
