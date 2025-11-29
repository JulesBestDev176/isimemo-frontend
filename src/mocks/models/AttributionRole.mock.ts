// ============================================================================
// MOCK DATA - ATTRIBUTIONS DE ROLES
// ============================================================================

import { AttributionRole, TypeRole } from '../../models/services/AttributionRole';
import { mockProfesseurs } from '../../models/acteurs/Professeur';

export const mockAttributionsRoles: AttributionRole[] = [
  // Attributions pour l'annee 2024-2025 (annee active)
  {
    idAttribution: 1,
    professeur: mockProfesseurs[2], // Aissatou Ba
    typeRole: TypeRole.COMMISSION,
    anneeAcademique: '2024-2025',
    dateAttribution: new Date('2024-09-01'),
    attribuePar: 2, // Ibrahima Ndiaye (Chef)
    estActif: true
  },
  {
    idAttribution: 2,
    professeur: mockProfesseurs[4], // Fatou Diallo
    typeRole: TypeRole.COMMISSION,
    anneeAcademique: '2024-2025',
    dateAttribution: new Date('2024-09-01'),
    attribuePar: 2,
    estActif: true
  },
  {
    idAttribution: 3,
    professeur: mockProfesseurs[0], // Jean Pierre
    typeRole: TypeRole.JURIE,
    anneeAcademique: '2024-2025',
    dateAttribution: new Date('2024-09-01'),
    attribuePar: 2,
    estActif: true
  },
  {
    idAttribution: 4,
    professeur: mockProfesseurs[2], // Aissatou Ba
    typeRole: TypeRole.JURIE,
    anneeAcademique: '2024-2025',
    dateAttribution: new Date('2024-09-01'),
    attribuePar: 2,
    estActif: true
  },
  {
    idAttribution: 5,
    professeur: mockProfesseurs[5], // Amadou Kane
    typeRole: TypeRole.JURIE,
    anneeAcademique: '2024-2025',
    dateAttribution: new Date('2024-09-01'),
    attribuePar: 2,
    estActif: true
  },
  {
    idAttribution: 6,
    professeur: mockProfesseurs[7], // Ousmane Thiam
    typeRole: TypeRole.JURIE,
    anneeAcademique: '2024-2025',
    dateAttribution: new Date('2024-09-01'),
    attribuePar: 2,
    estActif: true
  },
  {
    idAttribution: 7,
    professeur: mockProfesseurs[8], // Omar Gueye
    typeRole: TypeRole.JURIE,
    anneeAcademique: '2024-2025',
    dateAttribution: new Date('2024-09-01'),
    attribuePar: 2,
    estActif: true
  },
  {
    idAttribution: 8,
    professeur: mockProfesseurs[1], // Ibrahima Ndiaye (Chef)
    typeRole: TypeRole.PRESIDENT_JURY_POSSIBLE,
    anneeAcademique: '2024-2025',
    dateAttribution: new Date('2024-09-01'),
    attribuePar: 2,
    estActif: true
  },
  {
    idAttribution: 9,
    professeur: mockProfesseurs[3], // Mamadou Sarr
    typeRole: TypeRole.PRESIDENT_JURY_POSSIBLE,
    anneeAcademique: '2024-2025',
    dateAttribution: new Date('2024-09-01'),
    attribuePar: 2,
    estActif: true
  },
  {
    idAttribution: 10,
    professeur: mockProfesseurs[4], // Fatou Diallo
    typeRole: TypeRole.PRESIDENT_JURY_POSSIBLE,
    anneeAcademique: '2024-2025',
    dateAttribution: new Date('2024-09-01'),
    attribuePar: 2,
    estActif: true
  },

  // Attributions pour l'annee 2023-2024 (annee passee - desactivees)
  {
    idAttribution: 11,
    professeur: mockProfesseurs[2], // Aissatou Ba
    typeRole: TypeRole.COMMISSION,
    anneeAcademique: '2023-2024',
    dateAttribution: new Date('2023-09-01'),
    dateRetrait: new Date('2024-08-31'),
    attribuePar: 2,
    estActif: false
  },
  {
    idAttribution: 12,
    professeur: mockProfesseurs[4], // Fatou Diallo
    typeRole: TypeRole.COMMISSION,
    anneeAcademique: '2023-2024',
    dateAttribution: new Date('2023-09-01'),
    dateRetrait: new Date('2024-08-31'),
    attribuePar: 2,
    estActif: false
  }
];
