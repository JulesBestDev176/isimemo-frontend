// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type UserType = 'etudiant' | 'professeur' | 'assistant';

export interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
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
  // Étudiant
  {
    id: '1',
    name: 'Jean Dupont',
    email: 'etudiant@isimemo.edu.sn',
    password: 'password123',
    type: 'etudiant',
    department: 'Informatique',
  },
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
  // Professeur seul
  {
    id: '3',
    name: 'Pierre Durand',
    email: 'professeur@isimemo.edu.sn',
    password: 'password123',
    type: 'professeur',
    department: 'Informatique',
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
  // Jurie
  {
    id: '6',
    name: 'Omar Gueye',
    email: 'jurie@isimemo.edu.sn',
    password: 'password123',
    type: 'professeur',
    department: 'Management',
    estJurie: true,
    estProfesseur: true,
  },
  // Commission
  {
    id: '7',
    name: 'Aissatou Sow',
    email: 'commission@isimemo.edu.sn',
    password: 'password123',
    type: 'professeur',
    department: 'Informatique',
    estCommission: true,
    estProfesseur: true,
  },
  // Assistant
  {
    id: '8',
    name: 'Fatou Ndiaye',
    email: 'assistant@isimemo.edu.sn',
    password: 'password123',
    type: 'assistant',
    department: 'Général',
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
