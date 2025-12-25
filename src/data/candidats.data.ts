// Liste des candidats inscrits sur la plateforme ISIMemo
// Ce fichier contient les étudiants qui ont créé un compte

import { Etudiant, getEtudiantByEmail } from './etudiants.data';

export interface Candidat {
  id: string;
  etudiantId: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  motDePasse: string;
  dateInscription: string;
  mustChangePassword: boolean;
  memoireId?: number;
}

// Candidats déjà inscrits
export const candidatsData: Candidat[] = [
  {
    id: 'CAND001',
    etudiantId: 'ETU001',
    nom: 'Ndiaye',
    prenom: 'Abdou Fatah',
    email: 'abdoufatahndiayeisidk@groupeisi.com',
    telephone: '+221 77 123 45 01',
    motDePasse: 'password123',
    dateInscription: '2024-09-15',
    mustChangePassword: false,
    memoireId: 1
  },
  {
    id: 'CAND002',
    etudiantId: 'ETU002',
    nom: 'Diallo',
    prenom: 'Al Hassane',
    email: 'alhassanedialloisidk@groupeisi.com',
    telephone: '+221 77 123 45 02',
    motDePasse: 'password123',
    dateInscription: '2024-09-16',
    mustChangePassword: false,
    memoireId: 2
  },
  {
    id: 'CAND003',
    etudiantId: 'ETU004',
    nom: 'Ndour',
    prenom: 'Aliou',
    email: 'alioundourisidk@groupeisi.com',
    telephone: '+221 76 561 68 68',
    motDePasse: 'password123',
    dateInscription: '2025-12-25',
    mustChangePassword: false,
    memoireId: 3
  },
  {
    id: 'CAND004',
    etudiantId: 'ETU005',
    nom: 'Bocoum',
    prenom: 'Ibrahima Amadou',
    email: 'ibrahimaamadoubocoumisidk@groupeisi.com',
    telephone: '+221 77 123 45 05',
    motDePasse: 'password123',
    dateInscription: '2024-09-18',
    mustChangePassword: false,
    memoireId: 4
  },
  {
    id: 'CAND005',
    etudiantId: 'ETU006',
    nom: 'Diallo',
    prenom: 'Houleymatou',
    email: 'houleymatoudialloisidk@groupeisi.com',
    telephone: '+221 77 123 45 06',
    motDePasse: 'password123',
    dateInscription: '2024-10-05',
    mustChangePassword: false,
    memoireId: 5
  },
  {
    id: 'CAND006',
    etudiantId: 'ETU007',
    nom: 'Traore',
    prenom: 'Cheikh Tidiane',
    email: 'cheikhtidianetraoreisidk@groupeisi.com',
    telephone: '+221 77 123 45 07',
    motDePasse: 'password123',
    dateInscription: '2024-10-05',
    mustChangePassword: false,
    memoireId: 5
  },
  {
    id: 'CAND007',
    etudiantId: 'ETU008',
    nom: 'Thiam',
    prenom: 'Awa',
    email: 'awathiamisidk@groupeisi.com',
    telephone: '+221 77 123 45 08',
    motDePasse: 'password123',
    dateInscription: '2024-09-20',
    mustChangePassword: false,
    memoireId: 6
  },
  {
    id: 'CAND008',
    etudiantId: 'ETU009',
    nom: 'Diallo',
    prenom: 'Bassine',
    email: 'bassinedialloisidk@groupeisi.com',
    telephone: '+221 77 123 45 09',
    motDePasse: 'password123',
    dateInscription: '2024-09-21',
    mustChangePassword: false,
    memoireId: 7
  },
  {
    id: 'CAND009',
    etudiantId: 'ETU010',
    nom: 'Sakho',
    prenom: 'Mama Aichatou',
    email: 'mamaaichatousakhoisidk@groupeisi.com',
    telephone: '+221 77 123 45 10',
    motDePasse: 'password123',
    dateInscription: '2024-09-22',
    mustChangePassword: false,
    memoireId: 8
  },
  {
    id: 'CAND010',
    etudiantId: 'ETU011',
    nom: 'Tandia',
    prenom: 'Kissima',
    email: 'kissimatandiaisidk@groupeisi.com',
    telephone: '+221 77 123 45 11',
    motDePasse: 'password123',
    dateInscription: '2024-10-10',
    mustChangePassword: false,
    memoireId: 9
  },
  {
    id: 'CAND011',
    etudiantId: 'ETU012',
    nom: 'Dieye',
    prenom: 'Sokhna',
    email: 'sokhnadieyeisidk@groupeisi.com',
    telephone: '+221 77 123 45 12',
    motDePasse: 'password123',
    dateInscription: '2024-09-25',
    mustChangePassword: false,
    memoireId: 10
  },
  {
    id: 'CAND012',
    etudiantId: 'ETU013',
    nom: 'Hassane',
    prenom: 'Moussa Abakar',
    email: 'moussaabakarhassaneisidk@groupeisi.com',
    telephone: '+221 77 123 45 13',
    motDePasse: 'password123',
    dateInscription: '2024-10-12',
    mustChangePassword: false,
    memoireId: 11
  },
  {
    id: 'CAND013',
    etudiantId: 'ETU003',
    nom: 'Fall',
    prenom: 'Souleymane',
    email: 'souleymanefallisidk@groupeisi.com',
    telephone: '+221 77 715 10 61',
    motDePasse: 'P@sser123',
    dateInscription: '2024-12-25',
    mustChangePassword: false,
    memoireId: 3
  }
];

// Trouver un candidat par email
export const getCandidatByEmail = (email: string): Candidat | undefined => {
  if (!email) return undefined;
  return candidatsData.find(c => c.email && c.email.toLowerCase() === email.toLowerCase());
};

// Vérifier si un étudiant est déjà candidat
export const isAlreadyCandidat = (email: string): boolean => {
  if (!email) return false;
  return candidatsData.some(c => c.email && c.email.toLowerCase() === email.toLowerCase());
};

// Ajouter un nouveau candidat après inscription
export const addCandidat = (etudiant: Etudiant, motDePasse: string): Candidat => {
  const nouveauCandidat: Candidat = {
    id: 'CAND' + String(candidatsData.length + 1).padStart(3, '0'),
    etudiantId: etudiant.id,
    nom: etudiant.nom,
    prenom: etudiant.prenom,
    email: etudiant.email,
    telephone: etudiant.telephone,
    motDePasse,
    dateInscription: new Date().toISOString().split('T')[0],
    mustChangePassword: true
  };
  candidatsData.push(nouveauCandidat);
  console.log('📝 Nouveau candidat ajouté:', nouveauCandidat.prenom, nouveauCandidat.nom);
  return nouveauCandidat;
};

// Vérifier l'éligibilité et créer un candidat
export interface EligibilityResult {
  eligible: boolean;
  etudiant?: Etudiant;
  raison?: string;
  dejaInscrit?: boolean;
}

export const checkEligibility = (email: string): EligibilityResult => {
  const etudiant = getEtudiantByEmail(email);
  
  if (!etudiant) {
    return {
      eligible: false,
      raison: "Aucun étudiant trouvé avec cet email. Veuillez vérifier votre adresse email institutionnelle."
    };
  }
  
  if (isAlreadyCandidat(email)) {
    return {
      eligible: false,
      etudiant,
      dejaInscrit: true,
      raison: "Vous êtes déjà inscrit sur la plateforme. Veuillez vous connecter."
    };
  }
  
  if (etudiant.niveau !== 'L3') {
    return {
      eligible: false,
      etudiant,
      raison: `Vous êtes actuellement en ${etudiant.niveau}. L'inscription est réservée aux étudiants en Licence 3.`
    };
  }
  
  if (etudiant.departement !== 'Génie Informatique') {
    return {
      eligible: false,
      etudiant,
      raison: `Vous êtes dans le département "${etudiant.departement}". L'inscription est réservée au département Génie Informatique.`
    };
  }
  
  return {
    eligible: true,
    etudiant
  };
};
