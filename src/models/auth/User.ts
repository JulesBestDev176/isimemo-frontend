// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type UserType = 'etudiant' | 'professeur' | 'assistant';

export interface User {
  id: string;
  name: string;
  nom?: string;
  prenom?: string;
  email: string;
  type: UserType;
  role?: string;
  department?: string;
  estCandidat?: boolean;
  estChef?: boolean;
  estProfesseur?: boolean;
  estEncadrant?: boolean;
  estJurie?: boolean;
  estCommission?: boolean;
  estSecretaire?: boolean;
}

// ============================================================================
// MOCKS
// ============================================================================

export const mockUsers: (User & { password: string })[] = [
  // Étudiant Candidat
  {
    id: '2',
    name: 'Marie Martin',
    email: 'candidat@isimemo.edu.sn',
    password: 'password123',
    type: 'etudiant',
    department: 'Réseaux',
    estCandidat: true,
  },
  // Encadrant
  {
    id: '5',
    name: 'Sophie Diallo',
    email: 'encadrant@isimemo.edu.sn',
    password: 'password123',
    type: 'professeur',
    department: 'Réseaux',
    estEncadrant: true,
    estProfesseur: true,
  },
  // Chef de département
  {
    id: '4',
    name: 'Amadou Diop',
    email: 'chef@isimemo.edu.sn',
    password: 'password123',
    type: 'professeur',
    department: 'Informatique',
    estChef: true,
    estProfesseur: true,
  },
];


// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(u => u.id === id);
};

export const getUserByEmail = (email: string): (User & { password: string }) | undefined => {
  return mockUsers.find(u => u.email === email);
};
