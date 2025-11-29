// ============================================================================
// MOCK DATA - SESSIONS DE SOUTENANCE
// ============================================================================

import { SessionSoutenance, StatutSession, TypeSessionSoutenance } from '../../models/services/SessionSoutenance';

export const mockSessionsSoutenance: SessionSoutenance[] = [
  {
    idSession: 1,
    nom: 'Session Septembre 2024',
    typeSession: TypeSessionSoutenance.SEPTEMBRE,
    anneeAcademique: '2023-2024',
    dateDebut: new Date('2024-09-16'),
    dateFin: new Date('2024-09-20'),
    statut: StatutSession.FERMEE,
    dateCreation: new Date('2024-07-10'),
    dateOuverture: new Date('2024-08-01'),
    dateFermeture: new Date('2024-08-30'),
    creePar: 2
  },
  {
    idSession: 2,
    nom: 'Session Décembre 2024',
    typeSession: TypeSessionSoutenance.DECEMBRE,
    anneeAcademique: '2023-2024',
    dateDebut: new Date('2024-12-16'),
    dateFin: new Date('2024-12-20'),
    statut: StatutSession.FERMEE,
    dateCreation: new Date('2024-10-10'),
    dateOuverture: new Date('2024-11-01'),
    dateFermeture: new Date('2024-11-30'),
    creePar: 2
  },
  {
    idSession: 3,
    nom: 'Session Septembre 2025',
    typeSession: TypeSessionSoutenance.SEPTEMBRE,
    anneeAcademique: '2024-2025',
    dateDebut: new Date('2025-09-15'),
    dateFin: new Date('2025-09-19'),
    statut: StatutSession.OUVERTE, // Session actuellement ouverte
    dateCreation: new Date('2025-04-01'),
    dateOuverture: new Date('2025-04-15'),
    creePar: 2
  },
  {
    idSession: 4,
    nom: 'Session Décembre 2025',
    typeSession: TypeSessionSoutenance.DECEMBRE,
    anneeAcademique: '2024-2025',
    dateDebut: new Date('2025-12-15'),
    dateFin: new Date('2025-12-19'),
    statut: StatutSession.PLANIFIEE,
    dateCreation: new Date('2025-10-01'),
    creePar: 2
  }
];
