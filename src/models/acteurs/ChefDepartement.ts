// ============================================================================
// TYPES & INTERFACES - CHEF DE DÉPARTEMENT
// ============================================================================

import type { Professeur } from './Professeur';

export interface ChefDepartement extends Professeur {
  idChefDepartement: number;
  mandatDebut: Date;
  mandatFin: Date;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Vérifie si le mandat du chef est actif
 */
export const isMandatActif = (chef: ChefDepartement): boolean => {
  const maintenant = new Date();
  return maintenant >= chef.mandatDebut && maintenant <= chef.mandatFin;
};

/**
 * Vérifie si le mandat du chef est expiré
 */
export const isMandatExpire = (chef: ChefDepartement): boolean => {
  const maintenant = new Date();
  return maintenant > chef.mandatFin;
};

/**
 * Calcule la durée restante du mandat en jours
 */
export const getDureeRestanteMandat = (chef: ChefDepartement): number => {
  const maintenant = new Date();
  const diff = chef.mandatFin.getTime() - maintenant.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};
