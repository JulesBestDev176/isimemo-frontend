// ============================================================================
// TYPES & INTERFACES
// ============================================================================

// Interface pour les étudiants ayant utilisé un sujet
export interface EtudiantSujet {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  numeroEtudiant: string;
  dateAttribution: string;
  documentMemoire?: {
    id: number;
    titre: string;
    cheminFichier: string;
    dateDepot: string;
    tailleFichier: number;
    format: string;
  };
}

import { Sujet as SujetData, sujetsData } from '../../data/sujets.data';

export type Sujet = SujetData;

// Re-exporter les mocks centralisés
export const mockSujets = sujetsData;

// Interface pour le pipeline (utilisée par certains composants)
export interface SujetMemoire {
  id: number;
  titre: string;
  description: string;
  domaine: string;
  attentes?: string;
  encadrantPropose?: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
  };
  estDisponible: boolean;
}


// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getSujetById = (id: number): Sujet | undefined => {
  return mockSujets.find(s => s.id === id);
};

export const getSujetsDisponibles = (): Sujet[] => {
  return mockSujets.filter(s => s.nombreEtudiantsActuels < s.nombreMaxEtudiants);
};

export const getSujetsParFiliere = (filiere: string): Sujet[] => {
  return mockSujets.filter(s => s.filieres.includes(filiere));
};
