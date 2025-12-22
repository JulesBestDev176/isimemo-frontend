const API_BASE_URL = 'http://localhost:8085/api/dossiers';

export interface DossierMemoire {
  idDossierMemoire: number;
  titre: string;
  description: string;
  statut: string;
  etape: string;
  dateCreation: Date;
  dateModification: Date;
  anneeAcademique: string;
  estComplet: boolean;
  candidatId: number;
  encadrementId?: number;
  groupeId?: number;
  autoriseSoutenance: boolean;
  autorisePrelecture: boolean;
  prelectureEffectuee: boolean;
  estPhasePublique: boolean;
  nombreNumber?: string;
}

export interface CreateDossierRequest {
  titre: string;
  description?: string;
  anneeAcademique: string;
  candidatId: number;
}

export interface UpdateDossierRequest {
  titre: string;
  description?: string;
  anneeAcademique: string;
  encadrementId?: number;
  groupeId?: number;
  estComplet?: boolean;
}

class DossierService {
  
  private async request<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }
  
  // Récupérer tous les dossiers (avec filtres optionnels)
  async getAllDossiers(params?: {
    candidatId?: number;
    encadrementId?: number;
    statut?: string;
    etape?: string;
    anneeAcademique?: string;
  }): Promise<DossierMemoire[]> {
    const queryParams = params ? new URLSearchParams(
      Object.entries(params).filter(([_, v]) => v !== undefined).map(([k, v]) => [k, String(v)])
    ).toString() : '';
    const url = queryParams ? `${API_BASE_URL}?${queryParams}` : API_BASE_URL;
    return this.request<DossierMemoire[]>(url);
  }
  
  // Récupérer un dossier par ID
  async getDossierById(id: number): Promise<DossierMemoire> {
    return this.request<DossierMemoire>(`${API_BASE_URL}/${id}`);
  }
  
  // Récupérer les dossiers d'un candidat
  async getDossiersByCandidat(candidatId: number): Promise<DossierMemoire[]> {
    return this.request<DossierMemoire[]>(`${API_BASE_URL}/candidat/${candidatId}`);
  }
  
  // Compter les dossiers d'un candidat
  async countDossiersByCandidat(candidatId: number): Promise<number> {
    const result = await this.request<{ count: number }>(`${API_BASE_URL}/candidat/${candidatId}/count`);
    return result.count;
  }
  
  // Créer un dossier
  async createDossier(request: CreateDossierRequest): Promise<DossierMemoire> {
    return this.request<DossierMemoire>(API_BASE_URL, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }
  
  // Mettre à jour un dossier
  async updateDossier(id: number, request: UpdateDossierRequest): Promise<DossierMemoire> {
    return this.request<DossierMemoire>(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });
  }
  
  // Supprimer un dossier
  async deleteDossier(id: number): Promise<void> {
    await this.request<void>(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
  }
  
  // Changer l'étape d'un dossier
  async changerEtape(id: number, etape: string): Promise<DossierMemoire> {
    return this.request<DossierMemoire>(`${API_BASE_URL}/${id}/etape`, {
      method: 'PUT',
      body: JSON.stringify({ etape }),
    });
  }
  
  // Autoriser la pré-lecture
  async autoriserPrelecture(id: number, autoriser: boolean): Promise<DossierMemoire> {
    return this.request<DossierMemoire>(`${API_BASE_URL}/${id}/prelecture`, {
      method: 'PUT',
      body: JSON.stringify({ autoriser }),
    });
  }
  
  // Valider la pré-lecture
  async validerPrelecture(id: number): Promise<DossierMemoire> {
    return this.request<DossierMemoire>(`${API_BASE_URL}/${id}/prelecture`, {
      method: 'PUT',
      body: JSON.stringify({ valider: true }),
    });
  }
  
  // Autoriser la soutenance
  async autoriserSoutenance(id: number, autoriser: boolean): Promise<DossierMemoire> {
    return this.request<DossierMemoire>(`${API_BASE_URL}/${id}/soutenance`, {
      method: 'PUT',
      body: JSON.stringify({ autoriser }),
    });
  }
  
  // Récupérer les candidats disponibles pour binôme
  async getCandidatsDisponibles(): Promise<any[]> {
    // Appel à auth-service pour récupérer les étudiants inscrits (avec compte Keycloak)
    const response = await fetch('http://localhost:8084/api/users/etudiants/inscrits', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error('Erreur lors de la récupération des étudiants');
      return [];
    }
    
    return response.json();
  }
}

export const dossierService = new DossierService();
export default dossierService;
