import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  type: 'etudiant' | 'professeur' | 'assistant';
  department?: string;
  estCandidat?: boolean;
  estChef?: boolean;
  estProfesseur?: boolean;
  estEncadrant?: boolean;
  estJurie?: boolean;
  estCommission?: boolean;
  estSecretaire?: boolean;
  password?: string; // Only for mock users
}

const AuthContext = createContext<AuthContextType | null>(null);

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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // Vérifier si l'utilisateur est déjà connecté (session storage)
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simuler un délai d'authentification
    await new Promise(resolve => setTimeout(resolve, 800));

    const foundUser = mockUsers.find(
      u => u.email === email && u.password === password
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      sessionStorage.setItem('user', JSON.stringify(userWithoutPassword));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
