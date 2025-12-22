export interface RegisterRequest {
  email: string;
}

export interface RegisterResponse {
  success: boolean;
  email?: string;
  temporaryPassword?: string;  // Backend retourne "temporaryPassword" pas "tempPassword"
  message?: string;
  mustChangePassword?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: {
    id?: string;
    email: string;
    nom?: string;
    prenom?: string;
    role: string;
  };
}

const API_URL = 'http://localhost:8084/api/auth';

export const authService = {
  register: async (email: string): Promise<RegisterResponse> => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'inscription');
      }

      return data;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Une erreur est survenue',
      };
    }
  },

  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la connexion');
      }

      return data;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Une erreur est survenue',
      };
    }
  }
};
