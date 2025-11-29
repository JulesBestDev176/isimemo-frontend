// ============================================================================
// MOCK DATA - CHEF DE DÉPARTEMENT
// ============================================================================

import type { ChefDepartement } from '../models/acteurs/ChefDepartement';

export const mockChefDepartement: ChefDepartement = {
  idChefDepartement: 1,
  idProfesseur: 2,
  nom: 'Ndiaye',
  prenom: 'Ibrahima',
  email: 'ibrahima.ndiaye@isi.edu.sn',
  grade: 'Professeur',
  specialite: 'Réseaux et Sécurité',
  estDisponible: true,
  departement: 'Département Informatique',
  estEncadrant: true,
  estChef: true,
  capaciteEncadrement: 15,
  nombreEncadrementsActuels: 8,
  mandatDebut: new Date('2023-09-01'),
  mandatFin: new Date('2026-08-31') // Mandat de 3 ans
};
