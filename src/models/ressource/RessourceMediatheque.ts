// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type TypeCategorieRessource = 'memoires' | 'canevas';

export interface RessourceMediatheque {
  idRessource: number;
  titre: string;
  description: string;
  auteur: string;
  datePublication: Date;
  dateCreation: Date;
  dateModification: Date;
  categorie: TypeCategorieRessource;
  typeRessource: 'document' | 'lien';
  cheminFichier?: string;
  url?: string;
  tags: string[];
  likes: number;
  commentaires: number;
  vues: number;
  niveau?: 'licence' | 'master' | 'autres' | 'all';
  estImportant?: boolean;
}

// ============================================================================
// MOCKS
// ============================================================================

export const mockRessourcesMediatheque: RessourceMediatheque[] = [
  // Mémoires
  {
    idRessource: 4,
    titre: 'Système de gestion de bibliothèque numérique',
    description: 'Mémoire de fin d\'études sur la conception et le développement d\'un système de gestion de bibliothèque numérique.',
    auteur: 'Étudiant Master',
    datePublication: new Date('2024-12-15'),
    dateCreation: new Date('2024-12-15'),
    dateModification: new Date('2024-12-15'),
    categorie: 'memoires',
    typeRessource: 'document',
    cheminFichier: '/mediatheque/memoires/bibliotheque-numerique.pdf',
    tags: ['bibliothèque', 'gestion', 'numérique'],
    likes: 98,
    commentaires: 15,
    vues: 1234,
    niveau: 'master'
  },
  {
    idRessource: 5,
    titre: 'Application mobile de suivi médical',
    description: 'Mémoire présentant le développement d\'une application mobile pour le suivi médical des patients.',
    auteur: 'Étudiant Master',
    datePublication: new Date('2024-11-20'),
    dateCreation: new Date('2024-11-20'),
    dateModification: new Date('2024-11-20'),
    categorie: 'memoires',
    typeRessource: 'document',
    cheminFichier: '/mediatheque/memoires/app-mobile-medical.pdf',
    tags: ['mobile', 'médical', 'application'],
    likes: 145,
    commentaires: 22,
    vues: 1678,
    niveau: 'master'
  },
  // Canevas (un seul canevas dans la bibliothèque numérique)
  {
    idRessource: 7,
    titre: 'Canevas de mémoire de fin d\'études',
    description: 'Modèle de structure et de formatage pour la rédaction d\'un mémoire de fin d\'études.',
    auteur: 'Admin ISI',
    datePublication: new Date('2025-04-20'),
    dateCreation: new Date('2025-04-20'),
    dateModification: new Date('2025-04-20'),
    categorie: 'canevas',
    typeRessource: 'document',
    cheminFichier: '/mediatheque/canevas/memoire-fin-etudes.docx',
    tags: ['canevas', 'mémoire', 'template'],
    likes: 312,
    commentaires: 56,
    vues: 4567,
    niveau: 'all',
    estImportant: true
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getRessourceById = (id: number): RessourceMediatheque | undefined => {
  return mockRessourcesMediatheque.find(r => r.idRessource === id);
};

export const getRessourcesParCategorie = (categorie: TypeCategorieRessource): RessourceMediatheque[] => {
  return mockRessourcesMediatheque.filter(r => r.categorie === categorie);
};

export const getRessourcesImportantes = (): RessourceMediatheque[] => {
  return mockRessourcesMediatheque.filter(r => r.estImportant);
};
