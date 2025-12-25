// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface Candidat {
  idCandidat: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  motDePasse: string;
  numeroMatricule: string;
  niveau?: string;
  filiere?: string;
  memoireId?: number; // Lien vers le mémoire associé
}

// ============================================================================
// MOCKS - Candidats liés aux mémoires
// ============================================================================

export const mockCandidats: Candidat[] = [
  {
    idCandidat: 1,
    nom: 'Ndiaye',
    prenom: 'Abdou Fatah',
    email: 'abdoufatahndiayeisidk@groupeisi.com',
    telephone: '+221 77 123 45 01',
    motDePasse: 'Isi@2024!AF',
    numeroMatricule: 'ETU2024001',
    niveau: 'Licence 3',
    filiere: 'GL',
    memoireId: 1
  },
  {
    idCandidat: 2,
    nom: 'Diallo',
    prenom: 'Al Hassane',
    email: 'alhassanedialloisidk@groupeisi.com',
    telephone: '+221 77 123 45 02',
    motDePasse: 'Isi@2024!AH',
    numeroMatricule: 'ETU2024002',
    niveau: 'Licence 3',
    filiere: 'GL',
    memoireId: 2
  },
  {
    idCandidat: 3,
    nom: 'Fall',
    prenom: 'Souleymane',
    email: 'souleymanefallisidk@groupeisi.com',
    telephone: '+221 77 715 10 61',
    motDePasse: 'Isi@2024!SF',
    numeroMatricule: 'ETU2024003',
    niveau: 'Licence 3',
    filiere: 'GL',
    memoireId: 3
  },
  {
    idCandidat: 4,
    nom: 'Ndour',
    prenom: 'Aliou',
    email: 'alioundourisidk@groupeisi.com',
    telephone: '+221 76 561 68 68',
    motDePasse: 'Isi@2024!AN',
    numeroMatricule: 'ETU2024004',
    niveau: 'Licence 3',
    filiere: 'GL',
    memoireId: 3
  },
  {
    idCandidat: 5,
    nom: 'Bocoum',
    prenom: 'Ibrahima Amadou',
    email: 'ibrahimaamadoubocoumisidk@groupeisi.com',
    telephone: '+221 77 123 45 05',
    motDePasse: 'Isi@2024!IB',
    numeroMatricule: 'ETU2024005',
    niveau: 'Licence 3',
    filiere: 'GL',
    memoireId: 4
  },
  {
    idCandidat: 6,
    nom: 'Diallo',
    prenom: 'Houleymatou',
    email: 'houleymatou.diallo@groupeisi.com',
    telephone: '+221 77 123 45 06',
    motDePasse: 'Isi@2024!HD',
    numeroMatricule: 'ETU2024006',
    niveau: 'Licence 3',
    filiere: 'GL',
    memoireId: 5
  },
  {
    idCandidat: 7,
    nom: 'Traore',
    prenom: 'Cheikh Tidiane',
    email: 'cheikhtidiane.traore@groupeisi.com',
    telephone: '+221 77 123 45 07',
    motDePasse: 'Isi@2024!CT',
    numeroMatricule: 'ETU2024007',
    niveau: 'Licence 3',
    filiere: 'GL',
    memoireId: 5
  },
  {
    idCandidat: 8,
    nom: 'Thiam',
    prenom: 'Awa',
    email: 'awa.thiam@groupeisi.com',
    telephone: '+221 77 123 45 08',
    motDePasse: 'Isi@2024!AT',
    numeroMatricule: 'ETU2024008',
    niveau: 'Licence 3',
    filiere: 'GL',
    memoireId: 6
  },
  {
    idCandidat: 9,
    nom: 'Diallo',
    prenom: 'Bassine',
    email: 'bassine.diallo@groupeisi.com',
    telephone: '+221 77 123 45 09',
    motDePasse: 'Isi@2024!BD',
    numeroMatricule: 'ETU2024009',
    niveau: 'Licence 3',
    filiere: 'GL',
    memoireId: 7
  },
  {
    idCandidat: 10,
    nom: 'Sakho',
    prenom: 'Mama Aichatou',
    email: 'mamaaichatou.sakho@groupeisi.com',
    telephone: '+221 77 123 45 10',
    motDePasse: 'Isi@2024!MS',
    numeroMatricule: 'ETU2024010',
    niveau: 'Licence 3',
    filiere: 'GL',
    memoireId: 8
  },
  {
    idCandidat: 11,
    nom: 'Tandia',
    prenom: 'Kissima',
    email: 'kissima.tandia@groupeisi.com',
    telephone: '+221 77 123 45 11',
    motDePasse: 'Isi@2024!KT',
    numeroMatricule: 'ETU2024011',
    niveau: 'Licence 3',
    filiere: 'GL',
    memoireId: 9
  },
  {
    idCandidat: 12,
    nom: 'Dieye',
    prenom: 'Sokhna',
    email: 'sokhna.dieye@groupeisi.com',
    telephone: '+221 77 123 45 12',
    motDePasse: 'Isi@2024!SD',
    numeroMatricule: 'ETU2024012',
    niveau: 'Licence 3',
    filiere: 'GL',
    memoireId: 10
  },
  {
    idCandidat: 13,
    nom: 'Abakar Hassane',
    prenom: 'Moussa',
    email: 'moussa.abakar@groupeisi.com',
    telephone: '+221 77 123 45 13',
    motDePasse: 'Isi@2024!MA',
    numeroMatricule: 'ETU2024013',
    niveau: 'Licence 3',
    filiere: 'GL',
    memoireId: 11
  },
  {
    idCandidat: 14,
    nom: 'Gueye',
    prenom: 'Samba',
    email: 'samba.gueye@groupeisi.com',
    telephone: '+221 77 123 45 14',
    motDePasse: 'Isi@2024!SG',
    numeroMatricule: 'ETU2024014',
    niveau: 'Licence 3',
    filiere: 'GL',
    memoireId: 12
  },
  {
    idCandidat: 15,
    nom: 'Barry',
    prenom: 'Harsy',
    email: 'harsy.barry@groupeisi.com',
    telephone: '+221 77 123 45 15',
    motDePasse: 'Isi@2024!HB',
    numeroMatricule: 'ETU2024015',
    niveau: 'Licence 3',
    filiere: 'IAGE',
    memoireId: 13
  },
  {
    idCandidat: 16,
    nom: 'Diao',
    prenom: 'Cheikh Djidere',
    email: 'cheikh.diao@groupeisi.com',
    telephone: '+221 77 123 45 16',
    motDePasse: 'Isi@2024!CD',
    numeroMatricule: 'ETU2024016',
    niveau: 'Licence 3',
    filiere: 'Géomatique',
    memoireId: 14
  },
  {
    idCandidat: 17,
    nom: 'Elfayadine',
    prenom: 'Soudaiss',
    email: 'soudaiss.elfayadine@groupeisi.com',
    telephone: '+221 77 123 45 17',
    motDePasse: 'Isi@2024!SE',
    numeroMatricule: 'ETU2024017',
    niveau: 'Licence 3',
    filiere: 'GL',
    memoireId: 16
  },
  {
    idCandidat: 18,
    nom: 'Ndiaye',
    prenom: 'Amy',
    email: 'amy.ndiaye@groupeisi.com',
    telephone: '+221 77 123 45 18',
    motDePasse: 'Isi@2024!AmN',
    numeroMatricule: 'ETU2024018',
    niveau: 'Licence 3',
    filiere: 'GL',
    memoireId: 17
  },
  {
    idCandidat: 19,
    nom: 'Ibniyamine',
    prenom: 'Anoir',
    email: 'anoir.ibniyamine@groupeisi.com',
    telephone: '+221 77 123 45 19',
    motDePasse: 'Isi@2024!AI',
    numeroMatricule: 'ETU2024019',
    niveau: 'Licence 3',
    filiere: 'GL',
    memoireId: 18
  },
  {
    idCandidat: 20,
    nom: 'Mbaye',
    prenom: 'Ndeye Ngoundje',
    email: 'ndeyengoundje.mbaye@groupeisi.com',
    telephone: '+221 77 123 45 20',
    motDePasse: 'Isi@2024!NM',
    numeroMatricule: 'ETU2024020',
    niveau: 'Licence 3',
    filiere: 'GL',
    memoireId: 19
  },
  {
    idCandidat: 21,
    nom: 'Diop',
    prenom: 'Baye Bara',
    email: 'bayebara.diop@groupeisi.com',
    telephone: '+221 77 123 45 21',
    motDePasse: 'Isi@2024!BBD',
    numeroMatricule: 'ETU2024021',
    niveau: 'Licence 3',
    filiere: 'GL',
    memoireId: 20
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getCandidatById = (id: number): Candidat | undefined => {
  return mockCandidats.find(c => c.idCandidat === id);
};

export const getCandidatByEmail = (email: string): Candidat | undefined => {
  return mockCandidats.find(c => c.email.toLowerCase() === email.toLowerCase());
};

export const getCandidatsByMemoireId = (memoireId: number): Candidat[] => {
  return mockCandidats.filter(c => c.memoireId === memoireId);
};

/**
 * Récupère l'ID du candidat basé sur l'email de l'utilisateur
 */
export const getCandidatIdByEmail = (email: string): number | undefined => {
  const candidat = getCandidatByEmail(email);
  return candidat?.idCandidat;
};

/**
 * Vérifie les identifiants d'un candidat (pour la connexion)
 */
export const authenticateCandidat = (email: string, password: string): Candidat | null => {
  const candidat = mockCandidats.find(
    c => c.email.toLowerCase() === email.toLowerCase() && c.motDePasse === password
  );
  return candidat || null;
};
