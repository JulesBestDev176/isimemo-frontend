// Types pour les ressources de la médiathèque

export type TypeCategorieRessource = 'cours' | 'memoires' | 'canevas';

export interface RessourceMediatheque {
  idRessource: number;
  titre: string;
  description: string;
  auteur: string;
  datePublication: Date;
  dateCreation: Date;
  dateModification: Date;
  categorie: TypeCategorieRessource;
  typeRessource: 'document' | 'image' | 'video' | 'lien';
  cheminFichier?: string;
  url?: string;
  urlYoutube?: string; // URL YouTube pour les vidéos
  tags: string[];
  likes: number;
  commentaires: number;
  vues: number;
  niveau?: 'licence' | 'master' | 'autres' | 'all';
  estImportant?: boolean;
}

export interface RessourceSauvegardee {
  idSauvegarde: number;
  idRessource: number;
  idEtudiant: number;
  dateSauvegarde: Date;
  ressource: RessourceMediatheque;
}

