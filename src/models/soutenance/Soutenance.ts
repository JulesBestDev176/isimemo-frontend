// ============================================================================
// TYPES & INTERFACES
// ============================================================================

import type { DossierMemoire } from '../dossier/DossierMemoire';
import type { MembreJury } from './MembreJury';
import type { Salle } from './Salle';
import { getEncadrementsByProfesseur, StatutEncadrement } from '../dossier/Encadrement';

export enum ModeSoutenance {
  PRESENTIEL = 'PRESENTIEL',
  DISTANCIEL = 'DISTANCIEL',
  HYBRIDE = 'HYBRIDE'
}

export enum StatutSoutenance {
  PLANIFIEE = 'PLANIFIEE',
  EN_COURS = 'EN_COURS',
  TERMINEE = 'TERMINEE',
  ANNULEE = 'ANNULEE'
}

export interface Soutenance {
  idSoutenance: number;
  dateConstitution: Date;
  dateSoutenance: Date;
  heureDebut: string;
  heureFin: string;
  duree: number; // Durée totale en minutes pour tous les candidats
  mode: ModeSoutenance;
  statut: StatutSoutenance;
  anneeAcademique: string; // Année académique de la soutenance
  // Relations
  dossiersMemoire?: DossierMemoire[]; // Liste des dossiers (jusqu'à 10 candidats)
  jury?: MembreJury[];
  salle?: Salle;
  // Rétrocompatibilité : pour les anciennes soutenances avec un seul dossier
  dossierMemoire?: DossierMemoire;
}

// ============================================================================
// MOCKS
// ============================================================================

import { mockMembresJury } from './MembreJury';
import { mockSalles } from './Salle';
import { mockDossiers } from '../dossier/DossierMemoire';
import { getAnneeAcademiqueFromDate, getAnneeAcademiqueCourante, isAnneeAcademiqueTerminee } from '../../utils/anneeAcademique';

export const mockSoutenances: Soutenance[] = [
  {
    idSoutenance: 1,
    dateConstitution: new Date('2024-05-20'),
    dateSoutenance: new Date('2024-06-15'),
    heureDebut: '09:00',
    heureFin: '11:00',
    duree: 120,
    mode: ModeSoutenance.PRESENTIEL,
    statut: StatutSoutenance.TERMINEE,
    anneeAcademique: getAnneeAcademiqueFromDate(new Date('2024-06-15')), // 2023-2024
    dossierMemoire: mockDossiers.find(d => d.idDossierMemoire === 1),
    jury: mockMembresJury.slice(0, 4), // Membres 1-4 pour soutenance 1
    salle: mockSalles[0] // Salle A101
  },
  {
    idSoutenance: 2,
    dateConstitution: new Date('2023-05-15'),
    dateSoutenance: new Date('2023-06-20'),
    heureDebut: '14:00',
    heureFin: '16:00',
    duree: 120,
    mode: ModeSoutenance.PRESENTIEL,
    statut: StatutSoutenance.TERMINEE,
    anneeAcademique: getAnneeAcademiqueFromDate(new Date('2023-06-20')), // 2022-2023
    dossierMemoire: mockDossiers.find(d => d.idDossierMemoire === 2),
    jury: mockMembresJury.slice(4, 8), // Membres 5-8 pour soutenance 2
    salle: mockSalles[1] // Salle B205
  },
  {
    idSoutenance: 3,
    dateConstitution: new Date('2025-01-20'),
    // Date de soutenance dans le futur (mars 2026 pour être sûr qu'elle soit dans le futur)
    dateSoutenance: new Date('2026-03-15'), // Lundi 15 mars 2026
    heureDebut: '10:00',
    heureFin: '19:00', // Toute la journée pour plusieurs candidats
    duree: 540, // 9 heures (10h-19h) pour plusieurs candidats
    mode: ModeSoutenance.PRESENTIEL,
    statut: StatutSoutenance.PLANIFIEE,
    anneeAcademique: '2024-2025', // Année académique 2024-2025
    // Jury 3 : plusieurs candidats (jusqu'à 10)
    dossiersMemoire: [
      mockDossiers.find(d => d.idDossierMemoire === 103), // Ibrahima Ba
      mockDossiers.find(d => d.idDossierMemoire === 102) // Fatou Ndiaye
    ].filter(Boolean) as DossierMemoire[],
    jury: mockMembresJury.slice(8, 11), // Membres 9-11 pour soutenance 3 (Omar Gueye président)
    salle: mockSalles.find(s => s.nom === 'A32') || mockSalles[0] // Salle A32
  },
  {
    idSoutenance: 4,
    dateConstitution: new Date('2025-02-01'),
    // Date de soutenance dans le futur (mars 2026 pour être sûr qu'elle soit dans le futur)
    dateSoutenance: new Date('2026-03-20'), // Vendredi 20 mars 2026
    heureDebut: '10:00',
    heureFin: '19:00', // Toute la journée pour plusieurs candidats
    duree: 540, // 9 heures (10h-19h) pour plusieurs candidats
    mode: ModeSoutenance.PRESENTIEL,
    statut: StatutSoutenance.PLANIFIEE,
    anneeAcademique: '2024-2025', // Année académique 2024-2025
    // Jury 4 : plusieurs candidats (jusqu'à 10)
    dossiersMemoire: [
      mockDossiers.find(d => d.idDossierMemoire === 102) // Fatou Ndiaye
    ].filter(Boolean) as DossierMemoire[],
    jury: mockMembresJury.slice(11, 14), // Membres 12-14 pour soutenance 4 (Omar Gueye examinateur)
    salle: mockSalles.find(s => s.nom === 'A32') || mockSalles[1] // Salle A32
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getSoutenanceById = (id: number): Soutenance | undefined => {
  return mockSoutenances.find(s => s.idSoutenance === id);
};

export const getSoutenancesTerminees = (): Soutenance[] => {
  return mockSoutenances.filter(s => s.statut === StatutSoutenance.TERMINEE);
};

export const getSoutenancesPlanifiees = (): Soutenance[] => {
  return mockSoutenances.filter(s => s.statut === StatutSoutenance.PLANIFIEE);
};

/**
 * Vérifie si un professeur encadre un candidat dans un dossier
 * (utilisé pour exclure les soutenances où le professeur est encadrant de son propre candidat)
 */
const isProfesseurEncadrantDuDossier = (idProfesseur: number, dossierMemoire?: DossierMemoire): boolean => {
  if (!dossierMemoire || !dossierMemoire.candidats || dossierMemoire.candidats.length === 0) {
    return false;
  }
  
  const encadrements = getEncadrementsByProfesseur(idProfesseur);
  const encadrementsActifs = encadrements.filter(e => 
    e.statut === StatutEncadrement.ACTIF && 
    e.professeur?.idProfesseur === idProfesseur // Vérifier que l'encadrement appartient bien à ce professeur
  );
  
  // Vérifier si l'un des encadrements actifs contient un des candidats du dossier
  return encadrementsActifs.some(encadrement => {
    if (!encadrement.dossierMemoire?.candidats) return false;
    
    // Vérifier si au moins un candidat du dossier est encadré par ce professeur
    return dossierMemoire.candidats.some(candidatDossier => 
      encadrement.dossierMemoire?.candidats?.some(
        candidatEncadrement => candidatEncadrement.idCandidat === candidatDossier.idCandidat
      )
    );
  });
};

/**
 * Récupère les soutenances où un professeur est membre du jury
 * EXCLUT les soutenances où le professeur est encadrant d'un des candidats du dossier
 * (règle métier : un encadrant ne peut pas être membre du jury de son propre candidat)
 * FILTRE uniquement les soutenances de l'année académique en cours
 */
export const getSoutenancesByProfesseur = (idProfesseur: number): Soutenance[] => {
  const anneeCourante = getAnneeAcademiqueCourante();
  
  // Debug pour Omar Gueye
  if (idProfesseur === 9) {
    console.log('=== getSoutenancesByProfesseur DEBUG (Omar Gueye) ===');
    console.log('idProfesseur:', idProfesseur);
    console.log('anneeCourante:', anneeCourante);
    console.log('Nombre total de soutenances:', mockSoutenances.length);
  }
  
  const result = mockSoutenances.filter(soutenance => {
    // Vérifier que le professeur est membre du jury
    const estMembreJury = soutenance.jury?.some(membre => membre.professeur?.idProfesseur === idProfesseur);
    
    if (idProfesseur === 9) {
      console.log(`Soutenance ${soutenance.idSoutenance}: estMembreJury = ${estMembreJury}`);
    }
    
    if (!estMembreJury) return false;
    
    // Filtrer les soutenances de l'année académique en cours ou de l'année précédente
    // Une soutenance est valide si :
    // 1. Elle est de l'année académique courante, OU
    // 2. Son année académique n'est pas encore terminée, OU
    // 3. La date de la soutenance n'est pas encore passée (même si l'année académique est terminée)
    //    Cela permet d'afficher les soutenances prévues même après la fin de l'année académique
    const anneeTerminee = isAnneeAcademiqueTerminee(soutenance.anneeAcademique);
    const maintenant = new Date();
    const dateSoutenance = soutenance.dateSoutenance ? new Date(soutenance.dateSoutenance) : null;
    const soutenancePassee = dateSoutenance ? maintenant > dateSoutenance : false;
    
    // Une soutenance est valide si :
    // - Elle est de l'année académique courante, OU
    // - Son année académique n'est pas encore terminée, OU
    // - La soutenance n'est pas encore passée (pour les soutenances prévues après la fin de l'année académique)
    const anneeValide = soutenance.anneeAcademique === anneeCourante || !anneeTerminee || !soutenancePassee;
    
    if (idProfesseur === 9) {
      console.log(`Soutenance ${soutenance.idSoutenance}: anneeAcademique = ${soutenance.anneeAcademique}, anneeTerminee = ${anneeTerminee}, soutenancePassee = ${soutenancePassee}, anneeValide = ${anneeValide}`);
    }
    
    if (!anneeValide) return false;
    
    // Exclure si le professeur encadre un des candidats d'un des dossiers
    // Vérifier tous les dossiers de la soutenance (support pour plusieurs candidats)
    const dossiers = soutenance.dossiersMemoire || (soutenance.dossierMemoire ? [soutenance.dossierMemoire] : []);
    const encadreUnCandidat = dossiers.some(dossier => isProfesseurEncadrantDuDossier(idProfesseur, dossier));
    
    if (idProfesseur === 9) {
      console.log(`Soutenance ${soutenance.idSoutenance}: encadreUnCandidat = ${encadreUnCandidat}, nombre de dossiers = ${dossiers.length}`);
    }
    
    return !encadreUnCandidat;
  });
  
  if (idProfesseur === 9) {
    console.log('Résultat final - nombre de soutenances:', result.length);
    console.log('IDs des soutenances:', result.map(s => s.idSoutenance));
    console.log('==========================================');
  }
  
  return result;
};

/**
 * Récupère le rôle d'un professeur dans une soutenance
 */
export const getRoleJuryByProfesseur = (soutenance: Soutenance, idProfesseur: number): import('./MembreJury').RoleJury | undefined => {
  const membre = soutenance.jury?.find(m => m.professeur?.idProfesseur === idProfesseur);
  return membre?.roleJury;
};

/**
 * Vérifie si un professeur a des soutenances assignées pour l'année académique en cours
 * Un professeur n'est considéré comme membre du jury actif que s'il a des soutenances assignées
 */
export const hasSoutenancesAssignees = (idProfesseur: number): boolean => {
  const soutenances = getSoutenancesByProfesseur(idProfesseur);
  return soutenances.length > 0;
};
