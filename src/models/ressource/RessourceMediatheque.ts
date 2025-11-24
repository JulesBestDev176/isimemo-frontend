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
  estActif?: boolean; // Par défaut false (inactif) jusqu'à validation après soutenance
}

// ============================================================================
// MOCKS
// ============================================================================

export const mockRessourcesMediatheque: RessourceMediatheque[] = [
  // Mémoires (actifs - déjà validés)
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
    niveau: 'master',
    estActif: true // Actif car déjà validé
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
    niveau: 'master',
    estActif: true // Actif car déjà validé
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
    estImportant: true,
    estActif: true // Canevas toujours actif
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getRessourceById = (id: number): RessourceMediatheque | undefined => {
  return mockRessourcesMediatheque.find(r => r.idRessource === id);
};

export const getRessourcesParCategorie = (categorie: TypeCategorieRessource): RessourceMediatheque[] => {
  return mockRessourcesMediatheque.filter(r => r.categorie === categorie && r.estActif !== false);
};

export const getRessourcesImportantes = (): RessourceMediatheque[] => {
  return mockRessourcesMediatheque.filter(r => r.estImportant && r.estActif !== false);
};

/**
 * Active une ressource dans la bibliothèque numérique (après validation par la commission)
 */
export const activerRessource = (idRessource: number): boolean => {
  const ressource = mockRessourcesMediatheque.find(r => r.idRessource === idRessource);
  if (!ressource) return false;
  ressource.estActif = true;
  return true;
};

/**
 * Récupère les ressources inactives (en attente de validation)
 */
export const getRessourcesInactives = (): RessourceMediatheque[] => {
  return mockRessourcesMediatheque.filter(r => r.estActif === false);
};

/**
 * Ajoute un document à la bibliothèque numérique
 */
export const ajouterRessourceMediatheque = (
  document: import('../dossier/Document').Document,
  dossier: import('../dossier/DossierMemoire').DossierMemoire,
  candidat: import('../acteurs/Candidat').Candidat,
  estActif: boolean = false
): RessourceMediatheque => {
  const maxId = mockRessourcesMediatheque.length > 0 
    ? Math.max(...mockRessourcesMediatheque.map(r => r.idRessource)) 
    : 0;
  
  const candidatNom = `${candidat.prenom} ${candidat.nom}`;
  
  const nouvelleRessource: RessourceMediatheque = {
    idRessource: maxId + 1,
    titre: dossier.titre,
    description: dossier.description || `Mémoire de ${candidatNom}`,
    auteur: candidatNom,
    datePublication: new Date(),
    dateCreation: new Date(),
    dateModification: new Date(),
    categorie: 'memoires',
    typeRessource: 'document',
    cheminFichier: document.cheminFichier,
    tags: [dossier.titre.split(' ')[0], 'mémoire', 'soutenance'],
    likes: 0,
    commentaires: 0,
    vues: 0,
    niveau: candidat?.niveau === 'Licence 3' ? 'licence' : 'master',
    estActif: estActif
  };
  
  mockRessourcesMediatheque.push(nouvelleRessource);
  return nouvelleRessource;
};
