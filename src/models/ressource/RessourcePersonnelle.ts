// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface RessourcePersonnelle {
  id: number;
  titre: string;
  description: string;
  dateCreation: Date;
  dateModification: Date;
  anneeAcademique?: string;
  cheminFichier: string;
  dossierId: number;
}

// ============================================================================
// MOCKS
// ============================================================================

// Les ressources personnelles sont générées depuis les dossiers terminés pour les étudiants
// Pour les professeurs, ce sont des documents qu'ils ont créés/téléchargés

export const mockRessourcesPersonnelles: RessourcePersonnelle[] = [
  // Ressources personnelles pour professeur ID 3 (Pierre Durand - professeur seul)
  // Ce professeur n'a pas de documents personnels (liste vide)
  
  // Ressources personnelles pour professeur ID 4 (Amadou Diop - chef de département)
  {
    id: 101,
    titre: 'Guide méthodologique - Rédaction de mémoire',
    description: 'Document de référence pour l\'encadrement des étudiants',
    dateCreation: new Date('2024-09-15'),
    dateModification: new Date('2024-10-20'),
    anneeAcademique: '2024-2025',
    cheminFichier: '/professeurs/4/guide-methodologique.pdf',
    dossierId: 0 // Pas de dossier associé pour les professeurs
  },
  {
    id: 102,
    titre: 'Grille d\'évaluation - Soutenances',
    description: 'Grille d\'évaluation standardisée pour les soutenances de mémoire',
    dateCreation: new Date('2024-08-10'),
    dateModification: new Date('2024-09-05'),
    anneeAcademique: '2024-2025',
    cheminFichier: '/professeurs/4/grille-evaluation.pdf',
    dossierId: 0
  },
  
  // Ressources personnelles pour professeur ID 5 (Sophie Diallo - encadrant)
  {
    id: 103,
    titre: 'Modèle de fiche de suivi',
    description: 'Template pour les fiches de suivi d\'encadrement',
    dateCreation: new Date('2024-09-01'),
    dateModification: new Date('2024-11-15'),
    anneeAcademique: '2024-2025',
    cheminFichier: '/professeurs/5/modele-fiche-suivi.pdf',
    dossierId: 0
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getRessourcePersonnelleById = (id: number): RessourcePersonnelle | undefined => {
  return mockRessourcesPersonnelles.find(r => r.id === id);
};

// Récupérer les ressources personnelles d'un professeur
// Pour les professeurs, les ressources personnelles sont des documents qu'ils ont créés
// Le dossierId est 0 pour indiquer qu'il n'y a pas de dossier associé
export const getRessourcesPersonnellesProfesseur = (idProfesseur: number): RessourcePersonnelle[] => {
  // Les ressources personnelles de professeur ont un id >= 100 pour les distinguer
  // et sont associées via le cheminFichier qui contient l'ID du professeur
  return mockRessourcesPersonnelles.filter(r => 
    r.cheminFichier.includes(`/professeurs/${idProfesseur}/`)
  );
};
