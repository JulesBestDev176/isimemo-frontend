const API_BASE_URL = 'http://localhost:8085/api/dossiers/demandes-binome';

export type StatutDemandeBinome = 'EN_ATTENTE' | 'ACCEPTEE' | 'REFUSEE';

export interface DemandeBinome {
  idDemande: number;
  demandeurId: number;
  demandeurEmail: string;
  demandeurNom: string;
  demandeurMatricule: string;
  demandeurFiliere: string;
  destinataireId: number;
  destinataireEmail: string;
  destinataireNom: string;
  dossierDemandeurId: number;
  dossierDestinataireId: number;
  sujetTitre: string;
  sujetDescription: string;
  sujetId?: number;
  message: string;
  statut: StatutDemandeBinome;
  dateDemande: string;
  dateReponse?: string;
  groupeId?: number;
}

export interface CreateDemandeBinomeRequest {
  demandeurId: number;
  demandeurEmail: string;
  demandeurNom: string;
  demandeurMatricule?: string;
  demandeurFiliere?: string;
  destinataireId: number;
  destinataireEmail?: string;
  destinataireNom?: string;
  dossierDemandeurId: number;
  dossierDestinataireId: number;
  sujetTitre?: string;
  sujetDescription?: string;
  sujetId?: number;
  message?: string;
}

class DemandeBinomeService {
  
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
  
  /**
   * Crée une nouvelle demande de binôme
   */
  async creerDemande(request: CreateDemandeBinomeRequest): Promise<DemandeBinome> {
    return this.request<DemandeBinome>(API_BASE_URL, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }
  
  /**
   * Récupère une demande par ID
   */
  async getDemandeById(id: number): Promise<DemandeBinome> {
    return this.request<DemandeBinome>(`${API_BASE_URL}/${id}`);
  }
  
  /**
   * Récupère toutes les demandes reçues par un candidat
   */
  async getDemandesRecues(candidatId: number): Promise<DemandeBinome[]> {
    return this.request<DemandeBinome[]>(`${API_BASE_URL}/recues/${candidatId}`);
  }
  
  /**
   * Récupère les demandes reçues en attente par un candidat
   */
  async getDemandesRecuesEnAttente(candidatId: number): Promise<DemandeBinome[]> {
    return this.request<DemandeBinome[]>(`${API_BASE_URL}/recues/${candidatId}/en-attente`);
  }
  
  /**
   * Récupère les demandes envoyées par un candidat
   */
  async getDemandesEnvoyees(candidatId: number): Promise<DemandeBinome[]> {
    return this.request<DemandeBinome[]>(`${API_BASE_URL}/envoyees/${candidatId}`);
  }
  
  /**
   * Accepte une demande de binôme
   * - Crée un groupe
   * - Le destinataire devient "suiveur" (ne continue pas le processus)
   * - Le demandeur devient "meneur" (continue le processus)
   */
  async accepterDemande(demandeId: number): Promise<DemandeBinome> {
    return this.request<DemandeBinome>(`${API_BASE_URL}/${demandeId}/accepter`, {
      method: 'PUT',
    });
  }
  
  /**
   * Refuse une demande de binôme
   */
  async refuserDemande(demandeId: number): Promise<DemandeBinome> {
    return this.request<DemandeBinome>(`${API_BASE_URL}/${demandeId}/refuser`, {
      method: 'PUT',
    });
  }
}

export const demandeBinomeService = new DemandeBinomeService();
export default demandeBinomeService;
