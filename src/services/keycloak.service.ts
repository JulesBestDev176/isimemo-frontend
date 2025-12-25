// Service d'authentification Keycloak - Mode Mock (pas de connexion backend)
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

export const keycloakService = {
  /**
   * Authentifier un utilisateur (mode mock)
   */
  login: async (email: string, _password: string): Promise<KeycloakTokenResponse> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      access_token: 'mock-access-token-' + Date.now(),
      expires_in: 3600,
      refresh_expires_in: 7200,
      refresh_token: 'mock-refresh-token-' + Date.now(),
      token_type: 'Bearer',
      session_state: 'mock-session-' + Date.now(),
      scope: 'openid profile email'
    };
  },

  /**
   * Récupérer les informations de l'utilisateur (mode mock)
   */
  getUserInfo: async (_accessToken: string): Promise<KeycloakUserInfo> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      sub: 'mock-user-id',
      email_verified: true,
      name: 'Utilisateur Mock',
      preferred_username: 'mock.user',
      given_name: 'Mock',
      family_name: 'Utilisateur',
      email: 'mock@example.com'
    };
  },

  /**
   * Rafraîchir le token d'accès (mode mock)
   */
  refreshToken: async (_refreshToken: string): Promise<KeycloakTokenResponse> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      access_token: 'mock-refreshed-access-token-' + Date.now(),
      expires_in: 3600,
      refresh_expires_in: 7200,
      refresh_token: 'mock-refreshed-refresh-token-' + Date.now(),
      token_type: 'Bearer',
      session_state: 'mock-session-' + Date.now(),
      scope: 'openid profile email'
    };
  },

  /**
   * Déconnecter l'utilisateur (mode mock)
   */
  logout: async (_refreshToken: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    keycloakService.clearTokens();
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
