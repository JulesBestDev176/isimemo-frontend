// Service d'authentification Keycloak
export interface KeycloakTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  session_state: string;
  scope: string;
}

export interface KeycloakUserInfo {
  sub: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
}

const KEYCLOAK_URL = 'http://localhost:8083';
const REALM = 'academic-realm';
const CLIENT_ID = 'frontend-app';

export const keycloakService = {
  /**
   * Authentifier un utilisateur avec Keycloak
   */
  login: async (email: string, password: string): Promise<KeycloakTokenResponse> => {
    const tokenUrl = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`;
    
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('client_id', CLIENT_ID);
    params.append('username', email);
    params.append('password', password);
    
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error_description || 'Authentification échouée');
    }
    
    return response.json();
  },

  /**
   * Récupérer les informations de l'utilisateur connecté
   */
  getUserInfo: async (accessToken: string): Promise<KeycloakUserInfo> => {
    const userInfoUrl = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/userinfo`;
    
    const response = await fetch(userInfoUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Impossible de récupérer les informations utilisateur');
    }
    
    return response.json();
  },

  /**
   * Rafraîchir le token d'accès
   */
  refreshToken: async (refreshToken: string): Promise<KeycloakTokenResponse> => {
    const tokenUrl = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`;
    
    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('client_id', CLIENT_ID);
    params.append('refresh_token', refreshToken);
    
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
    
    if (!response.ok) {
      throw new Error('Impossible de rafraîchir le token');
    }
    
    return response.json();
  },

  /**
   * Déconnecter l'utilisateur
   */
  logout: async (refreshToken: string): Promise<void> => {
    const logoutUrl = `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/logout`;
    
    const params = new URLSearchParams();
    params.append('client_id', CLIENT_ID);
    params.append('refresh_token', refreshToken);
    
    await fetch(logoutUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
  },

  /**
   * Stocker les tokens dans le sessionStorage
   */
  storeTokens: (tokens: KeycloakTokenResponse): void => {
    sessionStorage.setItem('access_token', tokens.access_token);
    sessionStorage.setItem('refresh_token', tokens.refresh_token);
    sessionStorage.setItem('token_expires_at', (Date.now() + tokens.expires_in * 1000).toString());
  },

  /**
   * Récupérer le token d'accès depuis le sessionStorage
   */
  getAccessToken: (): string | null => {
    return sessionStorage.getItem('access_token');
  },

  /**
   * Récupérer le refresh token depuis le sessionStorage
   */
  getRefreshToken: (): string | null => {
    return sessionStorage.getItem('refresh_token');
  },

  /**
   * Vérifier si le token est expiré
   */
  isTokenExpired: (): boolean => {
    const expiresAt = sessionStorage.getItem('token_expires_at');
    if (!expiresAt) return true;
    return Date.now() >= parseInt(expiresAt);
  },

  /**
   * Nettoyer les tokens du sessionStorage
   */
  clearTokens: (): void => {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    sessionStorage.removeItem('token_expires_at');
    sessionStorage.removeItem('user');
  },
};
