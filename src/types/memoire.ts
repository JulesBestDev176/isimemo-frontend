export interface Document {
  nom: string;
  lien: string;
}

export interface Contact {
  email: string;
  telephone: string;
  linkedin: string;
}

export interface Memoire {
  id: number;
  titre: string;
  auteur: string;
  annee: number;
  mention: string;
  departement: string;
  description: string;
  imageCouverture?: string;
  etiquettes: string[];
  contact: Contact;
  superviseur: string;
  contenuComplet: string;
  documents: Document[];
}
