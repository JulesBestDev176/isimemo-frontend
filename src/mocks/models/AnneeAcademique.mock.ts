// ============================================================================
// MOCK DATA - ANNÉES ACADÉMIQUES
// ============================================================================

import type { AnneeAcademique } from '../models/services/AnneeAcademique';

export const mockAnneesAcademiques: AnneeAcademique[] = [
  {
    idAnnee: 1,
    code: '2022-2023',
    libelle: 'Année Académique 2022-2023',
    dateDebut: new Date('2022-09-01'),
    dateFin: new Date('2023-08-31'),
    estActive: false
  },
  {
    idAnnee: 2,
    code: '2023-2024',
    libelle: 'Année Académique 2023-2024',
    dateDebut: new Date('2023-09-01'),
    dateFin: new Date('2024-08-31'),
    estActive: false
  },
  {
    idAnnee: 3,
    code: '2024-2025',
    libelle: 'Année Académique 2024-2025',
    dateDebut: new Date('2024-09-01'),
    dateFin: new Date('2025-08-31'),
    estActive: true // Année académique active
  },
  {
    idAnnee: 4,
    code: '2025-2026',
    libelle: 'Année Académique 2025-2026',
    dateDebut: new Date('2025-09-01'),
    dateFin: new Date('2026-08-31'),
    estActive: false
  }
];
