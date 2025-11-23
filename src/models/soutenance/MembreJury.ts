// ============================================================================
// TYPES & INTERFACES
// ============================================================================

import type { Professeur } from '../acteurs/Professeur';
import type { Soutenance } from './Soutenance';

export enum RoleJury {
  PRESIDENT = 'PRESIDENT',
  RAPPORTEUR = 'RAPPORTEUR',
  EXAMINATEUR = 'EXAMINATEUR',
  ENCADRANT = 'ENCADRANT'
}

export interface MembreJury {
  idMembre: number;
  roleJury: RoleJury;
  dateDesignation: Date;
  // Relations
  professeur?: Professeur;
  soutenance?: Soutenance;
}

// ============================================================================
// MOCKS
// ============================================================================

export const mockMembresJury: MembreJury[] = [
  // Jury pour soutenance 1 (dossier 1)
  {
    idMembre: 1,
    roleJury: RoleJury.PRESIDENT,
    dateDesignation: new Date('2024-05-15'),
    professeur: {
      idProfesseur: 2,
      nom: 'Ndiaye',
      prenom: 'Ibrahima',
      email: 'ibrahima.ndiaye@isi.edu.sn',
      grade: 'Professeur',
      specialite: 'Réseaux et Sécurité',
      estDisponible: true,
      departement: 'Département Informatique'
    }
  },
  {
    idMembre: 2,
    roleJury: RoleJury.RAPPORTEUR,
    dateDesignation: new Date('2024-05-15'),
    professeur: {
      idProfesseur: 3,
      nom: 'Ba',
      prenom: 'Aissatou',
      email: 'aissatou.ba@isi.edu.sn',
      grade: 'Maître de Conférences',
      specialite: 'Base de données',
      estDisponible: true,
      departement: 'Département Informatique'
    }
  },
  {
    idMembre: 3,
    roleJury: RoleJury.EXAMINATEUR,
    dateDesignation: new Date('2024-05-15'),
    professeur: {
      idProfesseur: 4,
      nom: 'Sarr',
      prenom: 'Mamadou',
      email: 'mamadou.sarr@isi.edu.sn',
      grade: 'Professeur',
      specialite: 'Développement Web',
      estDisponible: true,
      departement: 'Département Informatique'
    }
  },
  {
    idMembre: 4,
    roleJury: RoleJury.ENCADRANT,
    dateDesignation: new Date('2024-05-15'),
    professeur: {
      idProfesseur: 1,
      nom: 'Pierre',
      prenom: 'Jean',
      email: 'jean.pierre@isi.ml',
      grade: 'Docteur',
      specialite: 'Informatique',
      estDisponible: true,
      departement: 'Département Informatique'
    }
  },
  // Jury pour soutenance 2 (dossier 2)
  {
    idMembre: 5,
    roleJury: RoleJury.PRESIDENT,
    dateDesignation: new Date('2023-05-10'),
    professeur: {
      idProfesseur: 5,
      nom: 'Diallo',
      prenom: 'Fatou',
      email: 'fatou.diallo@isi.edu.sn',
      grade: 'Professeur',
      specialite: 'Intelligence Artificielle',
      estDisponible: true,
      departement: 'Département Informatique'
    }
  },
  {
    idMembre: 6,
    roleJury: RoleJury.RAPPORTEUR,
    dateDesignation: new Date('2023-05-10'),
    professeur: {
      idProfesseur: 6,
      nom: 'Kane',
      prenom: 'Amadou',
      email: 'amadou.kane@isi.edu.sn',
      grade: 'Maître de Conférences',
      specialite: 'Intelligence Artificielle',
      estDisponible: true,
      departement: 'Département Informatique'
    }
  },
  {
    idMembre: 7,
    roleJury: RoleJury.EXAMINATEUR,
    dateDesignation: new Date('2023-05-10'),
    professeur: {
      idProfesseur: 7,
      nom: 'Sow',
      prenom: 'Moussa',
      email: 'moussa.sow@isi.edu.sn',
      grade: 'Professeur',
      specialite: 'Systèmes distribués',
      estDisponible: true,
      departement: 'Département Informatique'
    }
  },
  {
    idMembre: 8,
    roleJury: RoleJury.ENCADRANT,
    dateDesignation: new Date('2023-05-10'),
    professeur: {
      idProfesseur: 8,
      nom: 'Thiam',
      prenom: 'Ousmane',
      email: 'ousmane.thiam@isi.edu.sn',
      grade: 'Docteur',
      specialite: 'Informatique',
      estDisponible: true,
      departement: 'Département Informatique'
    }
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getMembreJuryById = (id: number): MembreJury | undefined => {
  return mockMembresJury.find(m => m.idMembre === id);
};

export const getMembresBySoutenance = (soutenanceId: number): MembreJury[] => {
  // Les 4 premiers membres sont pour la soutenance 1, les 4 suivants pour la soutenance 2
  if (soutenanceId === 1) return mockMembresJury.slice(0, 4);
  if (soutenanceId === 2) return mockMembresJury.slice(4, 8);
  return [];
};
