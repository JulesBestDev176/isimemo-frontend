// ============================================================================
// TYPES & INTERFACES - ATTRIBUTION DE RÔLES
// ============================================================================

import type { Professeur } from '../acteurs/Professeur';

export enum TypeRole {
  COMMISSION = 'COMMISSION',
  JURIE = 'JURIE',
  PRESIDENT_JURY_POSSIBLE = 'PRESIDENT_JURY_POSSIBLE'
}

export interface AttributionRole {
  idAttribution: number;
  professeur: Professeur;
  typeRole: TypeRole;
  anneeAcademique: string;
  dateAttribution: Date;
  dateRetrait?: Date;
  attribuePar: number; // idChefDepartement
  estActif: boolean;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Vérifie si une attribution est valide pour une année académique donnée
 */
export const isAttributionValide = (
  attribution: AttributionRole,
  anneeAcademique: string
): boolean => {
  return (
    attribution.estActif &&
    attribution.anneeAcademique === anneeAcademique &&
    !attribution.dateRetrait
  );
};

/**
 * Récupère les attributions actives pour un professeur
 */
export const getAttributionsActives = (
  attributions: AttributionRole[],
  idProfesseur: number,
  anneeAcademique: string
): AttributionRole[] => {
  return attributions.filter(
    a =>
      a.professeur.idProfesseur === idProfesseur &&
      isAttributionValide(a, anneeAcademique)
  );
};

/**
 * Vérifie si un professeur a un rôle spécifique pour une année académique
 */
export const hasRole = (
  attributions: AttributionRole[],
  idProfesseur: number,
  typeRole: TypeRole,
  anneeAcademique: string
): boolean => {
  return attributions.some(
    a =>
      a.professeur.idProfesseur === idProfesseur &&
      a.typeRole === typeRole &&
      isAttributionValide(a, anneeAcademique)
  );
};

/**
 * Récupère tous les professeurs avec un rôle spécifique pour une année académique
 */
export const getProfesseursAvecRole = (
  attributions: AttributionRole[],
  typeRole: TypeRole,
  anneeAcademique: string
): Professeur[] => {
  return attributions
    .filter(a => a.typeRole === typeRole && isAttributionValide(a, anneeAcademique))
    .map(a => a.professeur);
};

/**
 * Récupère le libellé d'un type de rôle
 */
export const getLibelleRole = (typeRole: TypeRole): string => {
  const libelles: Record<TypeRole, string> = {
    [TypeRole.COMMISSION]: 'Membre de Commission',
    [TypeRole.JURIE]: 'Membre de Jury',
    [TypeRole.PRESIDENT_JURY_POSSIBLE]: 'Possible Président de Jury'
  };
  return libelles[typeRole];
};
// ============================================================================
// MOCKS
// ============================================================================

export const mockAttributions: AttributionRole[] = [
  {
    idAttribution: 1,
    professeur: {
      idProfesseur: 1,
      nom: 'Pierre',
      prenom: 'Jean',
      email: 'jean.pierre@isi.ml',
      estDisponible: true,
      departement: 'Département Informatique',
      grade: 'Docteur'
    },
    typeRole: TypeRole.PRESIDENT_JURY_POSSIBLE,
    anneeAcademique: '2024-2025',
    dateAttribution: new Date('2024-09-01'),
    attribuePar: 2,
    estActif: true
  },
  {
    idAttribution: 2,
    professeur: {
      idProfesseur: 4,
      nom: 'Sarr',
      prenom: 'Mamadou',
      email: 'mamadou.sarr@isi.edu.sn',
      estDisponible: true,
      departement: 'Département Informatique',
      grade: 'Professeur'
    },
    typeRole: TypeRole.PRESIDENT_JURY_POSSIBLE,
    anneeAcademique: '2024-2025',
    dateAttribution: new Date('2024-09-01'),
    attribuePar: 2,
    estActif: true
  },
  {
    idAttribution: 3,
    professeur: {
      idProfesseur: 2,
      nom: 'Ndiaye',
      prenom: 'Ibrahima',
      email: 'ibrahima.ndiaye@isi.edu.sn',
      estDisponible: true,
      departement: 'Département Informatique',
      grade: 'Professeur'
    },
    typeRole: TypeRole.PRESIDENT_JURY_POSSIBLE,
    anneeAcademique: '2024-2025',
    dateAttribution: new Date('2024-09-01'),
    attribuePar: 2,
    estActif: true
  },
  {
    idAttribution: 4,
    professeur: {
      idProfesseur: 10,
      nom: 'Cissé',
      prenom: 'Abdoulaye',
      email: 'abdoulaye.cisse@isi.edu.sn',
      estDisponible: true,
      departement: 'Département Informatique',
      grade: 'Professeur'
    },
    typeRole: TypeRole.PRESIDENT_JURY_POSSIBLE,
    anneeAcademique: '2024-2025',
    dateAttribution: new Date('2024-09-01'),
    attribuePar: 2,
    estActif: true
  },
  {
    idAttribution: 5,
    professeur: {
      idProfesseur: 12,
      nom: 'Diouf',
      prenom: 'Cheikh',
      email: 'cheikh.diouf@isi.edu.sn',
      estDisponible: true,
      departement: 'Département Informatique',
      grade: 'Professeur'
    },
    typeRole: TypeRole.PRESIDENT_JURY_POSSIBLE,
    anneeAcademique: '2024-2025',
    dateAttribution: new Date('2024-09-01'),
    attribuePar: 2,
    estActif: true
  },
  {
    idAttribution: 6,
    professeur: {
      idProfesseur: 14,
      nom: 'Tall',
      prenom: 'Alioune',
      email: 'alioune.tall@isi.edu.sn',
      estDisponible: true,
      departement: 'Département Informatique',
      grade: 'Professeur'
    },
    typeRole: TypeRole.PRESIDENT_JURY_POSSIBLE,
    anneeAcademique: '2024-2025',
    dateAttribution: new Date('2024-09-01'),
    attribuePar: 2,
    estActif: true
  }
];
