import { Candidat, candidatsData } from './candidats.data';
import { Memoire, memoiresData } from './memoires.data';

export interface DossierMemoire {
  id: number;
  titre: string;
  description: string;
  statut: 'EN_COURS' | 'VALIDE' | 'SOUTENU' | 'ARCHIVE';
  etape: 'CHOIX_SUJET' | 'CHOIX_BINOME' | 'REDACTION' | 'PRE_LECTURE' | 'SOUTENANCE' | 'TERMINE';
  dateCreation: string;
  dateModification: string;
  anneeAcademique: string;
  candidatIds: string[]; // Liste des IDs des candidats (binôme possible)
  encadrantId?: number;
  progression: number;
  memoireId?: number; // Lien vers l'archive si terminé
}

export const dossiersData: DossierMemoire[] = [
  {
    id: 1,
    titre: memoiresData[0].titre,
    description: memoiresData[0].description,
    statut: 'SOUTENU',
    etape: 'TERMINE',
    dateCreation: '2023-09-01',
    dateModification: '2024-06-15',
    anneeAcademique: '2023-2024',
    candidatIds: ['CAND001'],
    progression: 100,
    memoireId: 1
  },
  {
    id: 2,
    titre: memoiresData[1].titre,
    description: memoiresData[1].description,
    statut: 'SOUTENU',
    etape: 'TERMINE',
    dateCreation: '2023-09-01',
    dateModification: '2024-06-15',
    anneeAcademique: '2023-2024',
    candidatIds: ['CAND002'],
    progression: 100,
    memoireId: 2
  },
  {
    id: 3,
    titre: 'Plateforme intelligente de gestion des memoires academiques cas de l isi',
    description: 'Etude et mise en place d\'une plateforme pour ISIDK',
    statut: 'EN_COURS',
    etape: 'CHOIX_BINOME',
    dateCreation: '2024-12-20',
    dateModification: '2024-12-25',
    anneeAcademique: '2024-2025',
    candidatIds: ['CAND013'],
    progression: 15
  },
  {
    id: 4,
    titre: memoiresData[3].titre,
    description: memoiresData[3].description,
    statut: 'EN_COURS',
    etape: 'REDACTION',
    dateCreation: '2024-10-15',
    dateModification: '2024-12-20',
    anneeAcademique: '2024-2025',
    candidatIds: ['CAND004'],
    progression: 45
  },
  {
    id: 5,
    titre: memoiresData[4].titre,
    description: memoiresData[4].description,
    statut: 'EN_COURS',
    etape: 'CHOIX_BINOME',
    dateCreation: '2024-11-01',
    dateModification: '2024-12-22',
    anneeAcademique: '2024-2025',
    candidatIds: ['CAND005', 'CAND006'],
    progression: 20
  },
  {
    id: 6,
    titre: memoiresData[5].titre,
    description: memoiresData[5].description,
    statut: 'EN_COURS',
    etape: 'CHOIX_BINOME',
    dateCreation: '2024-11-10',
    dateModification: '2024-12-23',
    anneeAcademique: '2024-2025',
    candidatIds: ['CAND007'],
    progression: 15
  },
  {
    id: 7,
    titre: memoiresData[6].titre,
    description: memoiresData[6].description,
    statut: 'EN_COURS',
    etape: 'CHOIX_SUJET',
    dateCreation: '2024-12-01',
    dateModification: '2024-12-25',
    anneeAcademique: '2024-2025',
    candidatIds: ['CAND008'],
    progression: 5
  },
  {
    id: 8,
    titre: memoiresData[7].titre,
    description: memoiresData[7].description,
    statut: 'EN_COURS',
    etape: 'CHOIX_SUJET',
    dateCreation: '2024-12-05',
    dateModification: '2024-12-25',
    anneeAcademique: '2024-2025',
    candidatIds: ['CAND009'],
    progression: 5
  },
  {
    id: 9,
    titre: memoiresData[8].titre,
    description: memoiresData[8].description,
    statut: 'EN_COURS',
    etape: 'CHOIX_BINOME',
    dateCreation: '2024-12-10',
    dateModification: '2024-12-25',
    anneeAcademique: '2024-2025',
    candidatIds: ['CAND010'],
    progression: 10
  },
  {
    id: 10,
    titre: memoiresData[9].titre,
    description: memoiresData[9].description,
    statut: 'EN_COURS',
    etape: 'CHOIX_BINOME',
    dateCreation: '2024-12-15',
    dateModification: '2024-12-25',
    anneeAcademique: '2024-2025',
    candidatIds: ['CAND011'],
    progression: 10
  },
  {
    id: 11,
    titre: memoiresData[10].titre,
    description: memoiresData[10].description,
    statut: 'EN_COURS',
    etape: 'CHOIX_SUJET',
    dateCreation: '2024-12-18',
    dateModification: '2024-12-25',
    anneeAcademique: '2024-2025',
    candidatIds: ['CAND012'],
    progression: 5
  },
];

// Fonction pour récupérer le dossier d'un candidat
export const getDossierByCandidatId = (candidatId: string): DossierMemoire | undefined => {
  return dossiersData.find(d => d.candidatIds.includes(candidatId));
};

// Fonction pour ajouter un candidat à un dossier (binôme)
export const addCandidatToDossier = (dossierId: number, candidatId: string) => {
  const dossier = dossiersData.find(d => d.id === dossierId);
  if (dossier && !dossier.candidatIds.includes(candidatId)) {
    dossier.candidatIds.push(candidatId);
  }
};
