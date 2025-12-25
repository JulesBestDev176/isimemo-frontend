// Liste de tous les étudiants de l'école ISI
// Format email: prenomnomisidk@groupeisi.com (tout en minuscules, sans espaces ni points)

export type Niveau = 'L1' | 'L2' | 'L3' | 'M1' | 'M2';

export interface Etudiant {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  niveau: Niveau;
  departement: string;
  filiere: string;
}

export const etudiantsData: Etudiant[] = [
  // ===== L3 GÉNIE INFORMATIQUE (ÉLIGIBLES) =====
  {
    id: 'ETU001',
    nom: 'Ndiaye',
    prenom: 'Abdou Fatah',
    email: 'abdoufatahndiayeisidk@groupeisi.com',
    telephone: '+221 77 123 45 01',
    niveau: 'L3',
    departement: 'Génie Informatique',
    filiere: 'Génie Logiciel'
  },
  {
    id: 'ETU002',
    nom: 'Diallo',
    prenom: 'Al Hassane',
    email: 'alhassanedialloisidk@groupeisi.com',
    telephone: '+221 77 123 45 02',
    niveau: 'L3',
    departement: 'Génie Informatique',
    filiere: 'Génie Logiciel'
  },
  {
    id: 'ETU003',
    nom: 'Fall',
    prenom: 'Souleymane',
    email: 'souleymanefallisidk@groupeisi.com',
    telephone: '+221 77 715 10 61',
    niveau: 'L3',
    departement: 'Génie Informatique',
    filiere: 'Génie Logiciel'
  },
  {
    id: 'ETU004',
    nom: 'Ndour',
    prenom: 'Aliou',
    email: 'alioundourisidk@groupeisi.com',
    telephone: '+221 76 561 68 68',
    niveau: 'L3',
    departement: 'Génie Informatique',
    filiere: 'Génie Logiciel'
  },
  {
    id: 'ETU005',
    nom: 'Bocoum',
    prenom: 'Ibrahima Amadou',
    email: 'ibrahimaamadoubocoumisidk@groupeisi.com',
    telephone: '+221 77 123 45 05',
    niveau: 'L3',
    departement: 'Génie Informatique',
    filiere: 'Génie Logiciel'
  },
  {
    id: 'ETU006',
    nom: 'Diallo',
    prenom: 'Houleymatou',
    email: 'houleymatoudialloisidk@groupeisi.com',
    telephone: '+221 77 123 45 06',
    niveau: 'L3',
    departement: 'Génie Informatique',
    filiere: 'Génie Logiciel'
  },
  {
    id: 'ETU007',
    nom: 'Traore',
    prenom: 'Cheikh Tidiane',
    email: 'cheikhtidianetraoreisidk@groupeisi.com',
    telephone: '+221 77 123 45 07',
    niveau: 'L3',
    departement: 'Génie Informatique',
    filiere: 'Génie Logiciel'
  },
  {
    id: 'ETU008',
    nom: 'Thiam',
    prenom: 'Awa',
    email: 'awathiamisidk@groupeisi.com',
    telephone: '+221 77 123 45 08',
    niveau: 'L3',
    departement: 'Génie Informatique',
    filiere: 'Génie Logiciel'
  },
  {
    id: 'ETU009',
    nom: 'Diallo',
    prenom: 'Bassine',
    email: 'bassinedialloisidk@groupeisi.com',
    telephone: '+221 77 123 45 09',
    niveau: 'L3',
    departement: 'Génie Informatique',
    filiere: 'Génie Logiciel'
  },
  {
    id: 'ETU010',
    nom: 'Sakho',
    prenom: 'Mama Aichatou',
    email: 'mamaaichatousakhoisidk@groupeisi.com',
    telephone: '+221 77 123 45 10',
    niveau: 'L3',
    departement: 'Génie Informatique',
    filiere: 'Génie Logiciel'
  },
  {
    id: 'ETU011',
    nom: 'Tandia',
    prenom: 'Kissima',
    email: 'kissimatandiaisidk@groupeisi.com',
    telephone: '+221 77 123 45 11',
    niveau: 'L3',
    departement: 'Génie Informatique',
    filiere: 'Génie Logiciel'
  },
  {
    id: 'ETU012',
    nom: 'Dieye',
    prenom: 'Sokhna',
    email: 'sokhnadieyeisidk@groupeisi.com',
    telephone: '+221 77 123 45 12',
    niveau: 'L3',
    departement: 'Génie Informatique',
    filiere: 'Génie Logiciel'
  },
  {
    id: 'ETU013',
    nom: 'Hassane',
    prenom: 'Moussa Abakar',
    email: 'moussaabakarhassaneisidk@groupeisi.com',
    telephone: '+221 77 123 45 13',
    niveau: 'L3',
    departement: 'Génie Informatique',
    filiere: 'Génie Logiciel'
  },
  {
    id: 'ETU014',
    nom: 'Gueye',
    prenom: 'Samba',
    email: 'sambagueyeisidk@groupeisi.com',
    telephone: '+221 77 123 45 14',
    niveau: 'L3',
    departement: 'Génie Informatique',
    filiere: 'Génie Logiciel'
  },
  {
    id: 'ETU015',
    nom: 'Barry',
    prenom: 'Harsy',
    email: 'harsybarryisidk@groupeisi.com',
    telephone: '+221 77 123 45 15',
    niveau: 'L3',
    departement: 'Génie Informatique',
    filiere: 'IAGE'
  },
  {
    id: 'ETU016',
    nom: 'Diao',
    prenom: 'Cheikh Djidere',
    email: 'cheikhdjiderediaoisidk@groupeisi.com',
    telephone: '+221 77 123 45 16',
    niveau: 'L3',
    departement: 'Génie Informatique',
    filiere: 'Géomatique'
  },
  {
    id: 'ETU017',
    nom: 'Elfayadine',
    prenom: 'Soudaiss',
    email: 'soudaisselfayadineisidk@groupeisi.com',
    telephone: '+221 77 123 45 17',
    niveau: 'L3',
    departement: 'Génie Informatique',
    filiere: 'Génie Logiciel'
  },
  {
    id: 'ETU018',
    nom: 'Ndiaye',
    prenom: 'Amy',
    email: 'amyndiayeisidk@groupeisi.com',
    telephone: '+221 77 123 45 18',
    niveau: 'L3',
    departement: 'Génie Informatique',
    filiere: 'Génie Logiciel'
  },
  {
    id: 'ETU019',
    nom: 'Ibniyamine',
    prenom: 'Anoir',
    email: 'anoiribniyamineisidk@groupeisi.com',
    telephone: '+221 77 123 45 19',
    niveau: 'L3',
    departement: 'Génie Informatique',
    filiere: 'Génie Logiciel'
  },
  {
    id: 'ETU020',
    nom: 'Mbaye',
    prenom: 'Ndeye Ngoundje',
    email: 'ndeyengounjembayeisidk@groupeisi.com',
    telephone: '+221 77 123 45 20',
    niveau: 'L3',
    departement: 'Génie Informatique',
    filiere: 'Génie Logiciel'
  },
  {
    id: 'ETU021',
    nom: 'Diop',
    prenom: 'Baye Bara',
    email: 'bayebaradiopisidk@groupeisi.com',
    telephone: '+221 77 123 45 21',
    niveau: 'L3',
    departement: 'Génie Informatique',
    filiere: 'Génie Logiciel'
  },
  // Nouveaux étudiants non encore inscrits
  {
    id: 'ETU030',
    nom: 'Seck',
    prenom: 'Fatou',
    email: 'fatouseckisidk@groupeisi.com',
    telephone: '+221 77 456 78 01',
    niveau: 'L3',
    departement: 'Génie Informatique',
    filiere: 'Génie Logiciel'
  },
  {
    id: 'ETU031',
    nom: 'Faye',
    prenom: 'Ousmane',
    email: 'ousmanefayeisidk@groupeisi.com',
    telephone: '+221 77 456 78 02',
    niveau: 'L3',
    departement: 'Génie Informatique',
    filiere: 'Génie Logiciel'
  },
  
  // ===== ÉTUDIANTS NON ÉLIGIBLES (Niveau incorrect) =====
  {
    id: 'ETU040',
    nom: 'Kane',
    prenom: 'Moussa',
    email: 'moussakaneisidk@groupeisi.com',
    telephone: '+221 77 789 12 01',
    niveau: 'L2',
    departement: 'Génie Informatique',
    filiere: 'Génie Logiciel'
  },
  {
    id: 'ETU041',
    nom: 'Sy',
    prenom: 'Ibrahima',
    email: 'ibrahimasyisidk@groupeisi.com',
    telephone: '+221 77 789 12 02',
    niveau: 'L1',
    departement: 'Génie Informatique',
    filiere: 'Génie Logiciel'
  },
  
  // ===== ÉTUDIANTS NON ÉLIGIBLES (Département incorrect) =====
  {
    id: 'ETU050',
    nom: 'Sow',
    prenom: 'Amadou',
    email: 'amadousowisidk@groupeisi.com',
    telephone: '+221 77 321 54 01',
    niveau: 'L3',
    departement: 'Réseaux et Télécommunications',
    filiere: 'Administration Réseaux'
  },
  {
    id: 'ETU051',
    nom: 'Ba',
    prenom: 'Khadija',
    email: 'khadijabaisidk@groupeisi.com',
    telephone: '+221 77 321 54 02',
    niveau: 'L3',
    departement: 'Sécurité Informatique',
    filiere: 'Cybersécurité'
  }
];

// Trouver un étudiant par email
export const getEtudiantByEmail = (email: string): Etudiant | undefined => {
  if (!email) return undefined;
  return etudiantsData.find(e => e.email && e.email.toLowerCase() === email.toLowerCase());
};
