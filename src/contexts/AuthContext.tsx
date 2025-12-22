import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '../models/auth';
import { authService } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    const accessToken = sessionStorage.getItem('access_token');
    
    if (storedUser && accessToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🔐 Tentative de connexion pour:', email);
      
      // Appeler le backend qui gère Keycloak
      const response = await authService.login(email, password);
      
      if (!response.success || !response.user) {
        console.error('❌ Échec de connexion:', response.message);
        return false;
      }
      
      console.log('✅ Connexion réussie:', response.user);
      
      // Stocker les tokens et l'utilisateur
      if (response.accessToken) {
        sessionStorage.setItem('access_token', response.accessToken);
      }
      if (response.refreshToken) {
        sessionStorage.setItem('refresh_token', response.refreshToken);
      }
      
      // Mapper le rôle backend vers le type frontend
      const role = response.user.role?.toUpperCase() || '';
      let userType: 'etudiant' | 'professeur' | 'assistant' = 'etudiant';
      let estCandidat = false;
      let estChef = false;
      let estEncadrant = false;
      
      if (role === 'ETUDIANT' || role === 'CANDIDAT') {
        userType = 'etudiant';
        estCandidat = role === 'CANDIDAT' || role === 'ETUDIANT'; // Les étudiants inscrits sont des candidats
      } else if (role === 'PROFESSEUR' || role === 'CHEF' || role === 'ENCADRANT') {
        userType = 'professeur';
        estChef = role === 'CHEF';
        estEncadrant = role === 'ENCADRANT' || role === 'PROFESSEUR';
      } else if (role === 'SECRETAIRE' || role === 'ASSISTANT') {
        userType = 'assistant';
      }
      
      const user: User = {
        id: response.user.id || '',
        email: response.user.email,
        nom: response.user.nom || '',
        prenom: response.user.prenom || '',
        name: `${response.user.prenom || ''} ${response.user.nom || ''}`.trim(),
        role: response.user.role,
        type: userType,
        estCandidat,
        estChef,
        estEncadrant,
      };
      
      console.log('👤 User mapped:', user);
      
      setUser(user);
      sessionStorage.setItem('user', JSON.stringify(user));
      
      return true;
    } catch (error: any) {
      console.error('❌ Erreur de connexion:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout,
      isAuthenticated: !!user,
      loading
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
