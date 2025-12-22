const API_BASE_URL = 'http://localhost:8086/api/sujets';

export interface Sujet {
  idSujet: number;
  titre: string;
  description: string;
  filieres: string[];
  niveau: string;
  departement: string;
  motsCles: string;
  prerequis: string;
  objectifs: string;
  anneeAcademique: string;
  origine: 'BANQUE' | 'PROPOSITION';
  emailCreateur: string;
  nomCreateur: string;
  candidatId?: number;
  dossierMemoireId?: number;
  groupeId?: number;
  estPublic: boolean;
  dateCreation: string;
  dateModification: string;
}

export interface CreateSujetRequest {
  titre: string;
  description?: string;
  filieres?: string;
  niveau?: string;
  departement?: string;
  motsCles?: string;
  prerequis?: string;
  objectifs?: string;
  anneeAcademique: string;
  emailCreateur: string;
  nomCreateur?: string;
}

export interface PropositionSujetRequest {
  titre: string;
  description?: string;
  emailCreateur: string;
  nomCreateur?: string;
  candidatId: number;
  dossierMemoireId?: number;
  groupeId?: number;
  anneeAcademique: string;
}

export interface CsvImportResult {
  totalRows: number;
  successCount: number;
  errorCount: number;
  errors: string[];
  importedSujets: Sujet[];
}

class SujetService {
  
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
  
  // =============== CRUD de base ===============
  
  async getAllSujets(): Promise<Sujet[]> {
    return this.request<Sujet[]>(API_BASE_URL);
  }
  
  async getSujetById(id: number): Promise<Sujet> {
    return this.request<Sujet>(`${API_BASE_URL}/${id}`);
  }
  
  async createSujet(request: CreateSujetRequest): Promise<Sujet> {
    return this.request<Sujet>(API_BASE_URL, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }
  
  async updateSujet(id: number, request: CreateSujetRequest): Promise<Sujet> {
    return this.request<Sujet>(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });
  }
  
  async deleteSujet(id: number): Promise<void> {
    await this.request<void>(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
  }
  
  // =============== Propositions étudiants ===============
  
  async proposerSujet(request: PropositionSujetRequest): Promise<Sujet> {
    return this.request<Sujet>(`${API_BASE_URL}/proposition`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }
  
  async getPropositionsByCandidat(candidatId: number): Promise<Sujet[]> {
    return this.request<Sujet[]>(`${API_BASE_URL}/candidat/${candidatId}`);
  }
  
  // =============== Recherche et filtrage ===============
  
  async getSujetsDisponibles(): Promise<Sujet[]> {
    return this.request<Sujet[]>(`${API_BASE_URL}/disponibles`);
  }
  
  async getSujetsByFiliere(filiere: string): Promise<Sujet[]> {
    return this.request<Sujet[]>(`${API_BASE_URL}/filiere/${filiere}`);
  }
  
  async getSujetsByFiliereAndNiveau(filiere: string, niveau: string): Promise<Sujet[]> {
    return this.request<Sujet[]>(`${API_BASE_URL}/filiere/${filiere}/niveau/${niveau}`);
  }
  
  async searchSujets(keyword: string): Promise<Sujet[]> {
    return this.request<Sujet[]>(`${API_BASE_URL}/search?q=${encodeURIComponent(keyword)}`);
  }
  
  async getSujetByDossierId(dossierMemoireId: number): Promise<Sujet | null> {
    try {
      return await this.request<Sujet>(`${API_BASE_URL}/dossier/${dossierMemoireId}`);
    } catch {
      return null;
    }
  }
  
  // =============== Attribution ===============
  
  async attribuerSujet(sujetId: number, dossierMemoireId: number, groupeId?: number): Promise<Sujet> {
    const params = new URLSearchParams({ dossierMemoireId: dossierMemoireId.toString() });
    if (groupeId) params.append('groupeId', groupeId.toString());
    
    return this.request<Sujet>(`${API_BASE_URL}/${sujetId}/attribuer?${params}`, {
      method: 'PUT',
    });
  }
  
  // =============== Import CSV ===============
  
  async importFromCsv(file: File, emailCreateur: string, anneeAcademique: string): Promise<CsvImportResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('emailCreateur', emailCreateur);
    formData.append('anneeAcademique', anneeAcademique);
    
    const response = await fetch(`${API_BASE_URL}/import-csv`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }
}

export const sujetService = new SujetService();
export default sujetService;
