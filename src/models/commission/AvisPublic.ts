// ============================================================================
// TYPES & INTERFACES
// ============================================================================

import type { Professeur } from '../acteurs/Professeur';
import type { Candidat } from '../acteurs/Candidat';

export interface AvisPublic {
  idAvis: number;
  typeElement: 'depot_sujet' | 'document_corrige'; // Type d'élément sur lequel porte l'avis
  idElement: number; // ID du dépôt de sujet ou du document
  auteur: Professeur | Candidat; // Auteur de l'avis (professeur ou candidat)
  contenu: string; // Contenu de l'avis
  dateCreation: Date;
  dateModification?: Date;
}

// ============================================================================
// MOCKS
// ============================================================================

import { mockProfesseurs } from '../acteurs/Professeur';
import { mockCandidats } from '../acteurs/Candidat';

export const mockAvisPublics: AvisPublic[] = [
  // Avis pour le dépôt de sujet 200 (en phase publique - période de validation des sujets)
  {
    idAvis: 1,
    typeElement: 'depot_sujet',
    idElement: 200,
    auteur: mockProfesseurs[0],
    contenu: 'Ce sujet est très intéressant et bien structuré. Je recommande sa validation.',
    dateCreation: new Date('2025-01-20')
  },
  {
    idAvis: 2,
    typeElement: 'depot_sujet',
    idElement: 200,
    auteur: mockProfesseurs[1],
    contenu: 'Le sujet nécessite quelques clarifications sur la méthodologie proposée.',
    dateCreation: new Date('2025-01-21')
  },
  // Avis pour le dépôt de sujet 201 (en phase publique - période de validation des sujets)
  {
    idAvis: 3,
    typeElement: 'depot_sujet',
    idElement: 201,
    auteur: mockProfesseurs[2],
    contenu: 'Excellent sujet, très pertinent pour le domaine. La méthodologie est claire et bien définie.',
    dateCreation: new Date('2025-01-19')
  },
  // Avis pour le document corrigé 101 (en phase publique - période de validation des corrections)
  // NOTE: Les corrections se déroulent à une période différente des validations de sujets
  {
    idAvis: 4,
    typeElement: 'document_corrige',
    idElement: 101,
    auteur: mockProfesseurs[0],
    contenu: 'Les corrections apportées sont pertinentes et le document est maintenant de bonne qualité.',
    dateCreation: new Date('2025-02-15') // Date ultérieure car période différente
  },
  {
    idAvis: 5,
    typeElement: 'document_corrige',
    idElement: 101,
    auteur: mockProfesseurs[1],
    contenu: 'Le document a été bien amélioré. Quelques ajustements mineurs pourraient encore être apportés, mais globalement c\'est satisfaisant.',
    dateCreation: new Date('2025-02-16')
  }
];

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

/**
 * Récupère tous les avis publics pour un élément donné
 */
export const getAvisPublicsByElement = (
  typeElement: 'depot_sujet' | 'document_corrige',
  idElement: number
): AvisPublic[] => {
  return mockAvisPublics.filter(
    avis => avis.typeElement === typeElement && avis.idElement === idElement
  );
};

/**
 * Ajoute un nouvel avis public
 */
export const ajouterAvisPublic = (
  typeElement: 'depot_sujet' | 'document_corrige',
  idElement: number,
  auteur: Professeur | Candidat,
  contenu: string
): AvisPublic => {
  const nouvelAvis: AvisPublic = {
    idAvis: mockAvisPublics.length > 0 
      ? Math.max(...mockAvisPublics.map(a => a.idAvis)) + 1 
      : 1,
    typeElement,
    idElement,
    auteur,
    contenu,
    dateCreation: new Date()
  };
  
  mockAvisPublics.push(nouvelAvis);
  return nouvelAvis;
};

