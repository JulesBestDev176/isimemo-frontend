// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface Candidat {
  idCandidat: number;
  nom: string;
  prenom: string;
  email: string;
  numeroMatricule: string;
  niveau?: string;
  filiere?: string;
}

// ============================================================================
// MOCKS
// ============================================================================

export const mockCandidats: Candidat[] = [
  {
    idCandidat: 1,
    nom: 'Diallo',
    prenom: 'Amadou',
    email: 'amadou.diallo@isi.edu.sn',
    numeroMatricule: 'ETU2024001',
    niveau: 'Licence 3',
    filiere: 'GL'
  },
  {
    idCandidat: 2,
    nom: 'Ndiaye',
    prenom: 'Fatou',
    email: 'fatou.ndiaye@isi.edu.sn',
    numeroMatricule: 'ETU2024002',
    niveau: 'Licence 3',
    filiere: 'Multimedia'
  },
  {
    idCandidat: 3,
    nom: 'Ba',
    prenom: 'Ibrahima',
    email: 'ibrahima.ba@isi.edu.sn',
    numeroMatricule: 'ETU2024003',
    niveau: 'Licence 3',
    filiere: 'GL'
  },
  {
    idCandidat: 4,
    nom: 'Sarr',
    prenom: 'Aissatou',
    email: 'aissatou.sarr@isi.edu.sn',
    numeroMatricule: 'ETU2024004',
    niveau: 'Licence 3',
    filiere: 'GL'
  },
  {
    idCandidat: 5,
    nom: 'Kane',
    prenom: 'Moussa',
    email: 'moussa.kane@isi.edu.sn',
    numeroMatricule: 'ETU2024005',
    niveau: 'Licence 3',
    filiere: 'Multimedia'
  },
  {
    idCandidat: 6,
    nom: 'Diop',
    prenom: 'Moussa',
    email: 'moussa.diop@isi.edu.sn',
    numeroMatricule: 'ETU2024006',
    niveau: 'Licence 3',
    filiere: 'GL'
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getCandidatById = (id: number): Candidat | undefined => {
  return mockCandidats.find(c => c.idCandidat === id);
};

/**
 * Récupère l'ID du candidat basé sur l'email de l'utilisateur
 * Mapping : candidat@isimemo.edu.sn -> idCandidat: 1 (Amadou Diallo)
 */
export const getCandidatIdByEmail = (email: string): number | undefined => {
  // Mapping entre email utilisateur et idCandidat
  const emailToCandidatId: Record<string, number> = {
    'candidat@isimemo.edu.sn': 1, // Candidat connecté -> Amadou Diallo
  };
  return emailToCandidatId[email];
};
