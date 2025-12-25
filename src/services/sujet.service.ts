// Service Sujet - Mode Mock (pas de connexion backend)

import { Sujet, sujetsData } from '../data/sujets.data';

export type { Sujet };

const mockSujets = sujetsData;


export interface CreateSujetRequest {
  titre: string;
  description?: string;
  filieres?: string;
  niveau?: string;
  departement?: string;
  motsCles?: string[];
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
  candidatId: string;
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
  
  // =============== CRUD de base ===============
  
  async getAllSujets(): Promise<Sujet[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockSujets];
  }
  
  async getSujetById(id: number): Promise<Sujet> {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const sujet = mockSujets.find(s => s.id === id);
    if (!sujet) {
      throw new Error(`Sujet ${id} non trouvé`);
    }
    return sujet;
  }
  
  async createSujet(request: CreateSujetRequest): Promise<Sujet> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newSujet: Sujet = {
      id: mockSujets.length + 1,
      titre: request.titre,
      description: request.description || '',
      filieres: request.filieres ? request.filieres.split(',').map(f => f.trim()) : [],
      niveau: request.niveau || '',
      departement: request.departement || '',
      motsCles: request.motsCles || [],
      prerequis: request.prerequis || '',
      objectifs: request.objectifs || '',
      anneeAcademique: request.anneeAcademique,
      origine: 'BANQUE',
      statut: 'soumis',
      emailCreateur: request.emailCreateur,
      nomCreateur: request.nomCreateur || '',
      nombreMaxEtudiants: 1, // Default
      nombreEtudiantsActuels: 0,
      dateCreation: new Date().toISOString(),
      dateModification: new Date().toISOString()
    };
    
    mockSujets.push(newSujet);
    return newSujet;
  }
  
  async updateSujet(id: number, request: CreateSujetRequest): Promise<Sujet> {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = mockSujets.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error(`Sujet ${id} non trouvé`);
    }
    
    mockSujets[index] = {
      ...mockSujets[index],
      titre: request.titre,
      description: request.description || mockSujets[index].description,
      filieres: request.filieres ? request.filieres.split(',').map(f => f.trim()) : mockSujets[index].filieres,
      niveau: request.niveau || mockSujets[index].niveau,
      departement: request.departement || mockSujets[index].departement,
      motsCles: request.motsCles || mockSujets[index].motsCles,
      prerequis: request.prerequis || mockSujets[index].prerequis,
      objectifs: request.objectifs || mockSujets[index].objectifs,
      dateModification: new Date().toISOString()
    };
    
    return mockSujets[index];
  }
  
  async deleteSujet(id: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = mockSujets.findIndex(s => s.id === id);
    if (index !== -1) {
      mockSujets.splice(index, 1);
    }
  }
  
  // =============== Propositions étudiants ===============
  
  async proposerSujet(request: PropositionSujetRequest): Promise<Sujet> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newSujet: Sujet = {
      id: mockSujets.length + 1,
      titre: request.titre,
      description: request.description || '',
      filieres: [],
      niveau: '',
      departement: '',
      motsCles: [],
      prerequis: '',
      objectifs: '',
      anneeAcademique: request.anneeAcademique,
      origine: 'PROPOSITION',
      statut: 'soumis',
      emailCreateur: request.emailCreateur,
      nomCreateur: request.nomCreateur || '',
      candidatId: request.candidatId,
      dossierMemoireId: request.dossierMemoireId,
      nombreMaxEtudiants: 1,
      nombreEtudiantsActuels: 1,
      dateCreation: new Date().toISOString(),
      dateModification: new Date().toISOString()
    };
    
    mockSujets.push(newSujet);
    return newSujet;
  }
  
  async getPropositionsByCandidat(candidatId: string): Promise<Sujet[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockSujets.filter(s => s.candidatId === candidatId);
  }
  
  // =============== Recherche et filtrage ===============
  
  async getSujetsDisponibles(): Promise<Sujet[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockSujets.filter(s => s.statut === 'VALIDE' && s.nombreEtudiantsActuels < s.nombreMaxEtudiants);
  }
  
  async getSujetsByFiliere(filiere: string): Promise<Sujet[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockSujets.filter(s => s.filieres.includes(filiere));
  }
  
  async getSujetsByFiliereAndNiveau(filiere: string, niveau: string): Promise<Sujet[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockSujets.filter(s => s.filieres.includes(filiere) && s.niveau === niveau);
  }
  
  async searchSujets(keyword: string): Promise<Sujet[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const lowerKeyword = keyword.toLowerCase();
    return mockSujets.filter(s => 
      s.titre.toLowerCase().includes(lowerKeyword) ||
      s.description.toLowerCase().includes(lowerKeyword) ||
      s.motsCles.some(m => m.toLowerCase().includes(lowerKeyword))
    );
  }
  
  async getSujetByDossierId(dossierMemoireId: number): Promise<Sujet | null> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return mockSujets.find(s => s.dossierMemoireId === dossierMemoireId) || null;
  }
  
  // =============== Attribution ===============
  
  async attribuerSujet(sujetId: number, dossierMemoireId: number, _groupeId?: number): Promise<Sujet> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockSujets.findIndex(s => s.id === sujetId);
    if (index === -1) {
      throw new Error(`Sujet ${sujetId} non trouvé`);
    }
    
    mockSujets[index].dossierMemoireId = dossierMemoireId;
    mockSujets[index].dateModification = new Date().toISOString();
    
    return mockSujets[index];
  }
  
  // =============== Import CSV ===============
  
  async importFromCsv(_file: File, _emailCreateur: string, _anneeAcademique: string): Promise<CsvImportResult> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mode mock - simuler un import réussi
    return {
      totalRows: 3,
      successCount: 3,
      errorCount: 0,
      errors: [],
      importedSujets: mockSujets.slice(0, 3)
    };
  }
}

export const sujetService = new SujetService();
export default sujetService;
