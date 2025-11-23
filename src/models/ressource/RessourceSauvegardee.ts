// ============================================================================
// TYPES & INTERFACES
// ============================================================================

import type { RessourceMediatheque } from './RessourceMediatheque';

export interface RessourceSauvegardee {
  idSauvegarde: number;
  idRessource: number;
  idEtudiant?: number; // Pour compatibilité avec l'existant
  idProfesseur?: number; // Pour les professeurs
  dateSauvegarde: Date;
  ressource: RessourceMediatheque;
}

// ============================================================================
// MOCKS
// ============================================================================

// Import des ressources pour les références
import { mockRessourcesMediatheque, getRessourceById } from './RessourceMediatheque';

// Helper pour créer une ressource sauvegardée en s'assurant que la ressource existe
const createRessourceSauvegardee = (
  idSauvegarde: number,
  idRessource: number,
  idEtudiant?: number,
  idProfesseur?: number,
  dateSauvegarde?: Date
): RessourceSauvegardee | null => {
  const ressource = getRessourceById(idRessource);
  if (!ressource) {
    console.warn(`Ressource avec ID ${idRessource} non trouvée dans la médiathèque`);
    return null;
  }
  return {
    idSauvegarde,
    idRessource,
    idEtudiant,
    idProfesseur,
    dateSauvegarde: dateSauvegarde || new Date(),
    ressource
  };
};

// Créer les ressources sauvegardées en filtrant celles qui n'existent pas
// Note: Il n'y a qu'un seul canevas (idRessource: 7) dans la bibliothèque numérique
const ressourcesSauvegardeesData = [
  { idSauvegarde: 1, idRessource: 4, idEtudiant: 1, dateSauvegarde: new Date('2025-05-12') },
  { idSauvegarde: 2, idRessource: 5, idEtudiant: 1, dateSauvegarde: new Date('2025-05-10') },
  { idSauvegarde: 3, idRessource: 7, idEtudiant: 1, dateSauvegarde: new Date('2025-05-08') },
  // Ressources sauvegardées par des professeurs
  // ID '3' = Pierre Durand (professeur seul)
  { idSauvegarde: 6, idRessource: 4, idProfesseur: 3, dateSauvegarde: new Date('2025-05-15') },
  { idSauvegarde: 7, idRessource: 7, idProfesseur: 3, dateSauvegarde: new Date('2025-05-12') },
  // ID '4' = Amadou Diop (chef de département)
  { idSauvegarde: 9, idRessource: 5, idProfesseur: 4, dateSauvegarde: new Date('2025-05-08') },
  // ID '5' = Sophie Diallo (encadrant)
  { idSauvegarde: 10, idRessource: 4, idProfesseur: 5, dateSauvegarde: new Date('2025-05-06') }
];

export const mockRessourcesSauvegardees: RessourceSauvegardee[] = ressourcesSauvegardeesData
  .map(data => createRessourceSauvegardee(
    data.idSauvegarde,
    data.idRessource,
    data.idEtudiant,
    data.idProfesseur,
    data.dateSauvegarde
  ))
  .filter((rs): rs is RessourceSauvegardee => rs !== null);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getRessourcesSauvegardees = (idEtudiant: number): RessourceSauvegardee[] => {
  return mockRessourcesSauvegardees.filter(rs => rs.idEtudiant === idEtudiant);
};

export const getRessourcesSauvegardeesProfesseur = (idProfesseur: number): RessourceSauvegardee[] => {
  return mockRessourcesSauvegardees.filter(rs => rs.idProfesseur === idProfesseur);
};

export const getRessourceSauvegardeeById = (id: number): RessourceSauvegardee | undefined => {
  return mockRessourcesSauvegardees.find(rs => rs.idSauvegarde === id);
};

// Ajouter une ressource sauvegardée pour un professeur ou un étudiant
export const addRessourceSauvegardee = (
  idRessource: number, 
  idEtudiant?: number, 
  idProfesseur?: number
): RessourceSauvegardee | null => {
  // Vérifier si la ressource existe déjà
  const existing = mockRessourcesSauvegardees.find(rs => 
    rs.idRessource === idRessource && 
    ((idEtudiant && rs.idEtudiant === idEtudiant) || (idProfesseur && rs.idProfesseur === idProfesseur))
  );
  
  if (existing) {
    return existing; // Déjà sauvegardée
  }
  
  // Trouver la ressource dans la médiathèque
  const ressource = mockRessourcesMediatheque.find(r => r.idRessource === idRessource);
  if (!ressource) {
    return null; // Ressource non trouvée
  }
  
  // Créer une nouvelle sauvegarde
  const newSauvegarde: RessourceSauvegardee = {
    idSauvegarde: Math.max(...mockRessourcesSauvegardees.map(rs => rs.idSauvegarde), 0) + 1,
    idRessource,
    idEtudiant,
    idProfesseur,
    dateSauvegarde: new Date(),
    ressource
  };
  
  mockRessourcesSauvegardees.push(newSauvegarde);
  return newSauvegarde;
};

// Retirer une ressource sauvegardée
export const removeRessourceSauvegardee = (
  idRessource: number,
  idEtudiant?: number,
  idProfesseur?: number
): boolean => {
  const index = mockRessourcesSauvegardees.findIndex(rs => 
    rs.idRessource === idRessource && 
    ((idEtudiant && rs.idEtudiant === idEtudiant) || (idProfesseur && rs.idProfesseur === idProfesseur))
  );
  
  if (index !== -1) {
    mockRessourcesSauvegardees.splice(index, 1);
    return true;
  }
  
  return false;
};

// Vérifier si une ressource est sauvegardée
export const isRessourceSauvegardee = (
  idRessource: number,
  idEtudiant?: number,
  idProfesseur?: number
): boolean => {
  return mockRessourcesSauvegardees.some(rs => 
    rs.idRessource === idRessource && 
    ((idEtudiant && rs.idEtudiant === idEtudiant) || (idProfesseur && rs.idProfesseur === idProfesseur))
  );
};
