import { dossiersData, DossierMemoire as DataDossier, getDossierByCandidatId } from '../data/dossiers.data';
import { getAnneeAcademiqueCourante } from '../utils/anneeAcademique';

export type DossierMemoire = DataDossier;

export interface CreateDossierRequest {
  titre: string;
  description?: string;
  anneeAcademique: string;
  candidatId: string; // Changed to string for consistency with CANDIDAT IDs
}

export interface UpdateDossierRequest {
  titre: string;
  description?: string;
  anneeAcademique: string;
  encadrantId?: number;
  groupeId?: number; // Keep for compatibility but use candidatIds in data
  estComplet?: boolean;
}

class DossierService {
  
  // Récupérer tous les dossiers (avec filtres optionnels)
  async getAllDossiers(params?: {
    candidatId?: string;
    encadrantId?: number;
    statut?: string;
    etape?: string;
    anneeAcademique?: string;
  }): Promise<DossierMemoire[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    let result = [...dossiersData];
    
    if (params?.candidatId) {
      result = result.filter(d => d.candidatIds.includes(params.candidatId!));
    }
    if (params?.statut) {
      result = result.filter(d => d.statut === params.statut);
    }
    if (params?.etape) {
      result = result.filter(d => d.etape === params.etape);
    }
    
    return result;
  }
  
  // Récupérer un dossier par ID
  async getDossierById(id: number): Promise<DossierMemoire> {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const dossier = dossiersData.find(d => d.id === id);
    if (!dossier) {
      throw new Error(`Dossier ${id} non trouvé`);
    }
    return dossier;
  }
  
  // Récupérer les dossiers d'un candidat (normalement un seul)
  async getDossiersByCandidat(candidatId: string): Promise<DossierMemoire[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const dossier = getDossierByCandidatId(candidatId);
    return dossier ? [dossier] : [];
  }
  
  // Récupérer le dossier unique d'un candidat
  async getDossierCandidat(candidatId: string): Promise<DossierMemoire | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return getDossierByCandidatId(candidatId) || null;
  }
  
  // Compter les dossiers d'un candidat
  async countDossiersByCandidat(candidatId: string): Promise<number> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const dossier = getDossierByCandidatId(candidatId);
    return dossier ? 1 : 0;
  }
  
  // Créer un dossier
  async createDossier(request: CreateDossierRequest): Promise<DossierMemoire> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Vérifier si l'utilisateur a déjà un dossier pour l'année académique courante
    const anneeCourante = getAnneeAcademiqueCourante();
    const dossierExistant = dossiersData.find(d => 
      d.candidatIds.includes(request.candidatId) && d.anneeAcademique === anneeCourante
    );

    if (dossierExistant) {
      throw new Error(`Vous avez déjà un dossier en cours pour l'année académique ${anneeCourante}.`);
    }

    const newDossier: DossierMemoire = {
      id: dossiersData.length > 0 ? Math.max(...dossiersData.map(d => d.id)) + 1 : 1,
      titre: request.titre,
      description: request.description || '',
      statut: 'EN_COURS',
      etape: 'CHOIX_SUJET',
      dateCreation: new Date().toISOString().split('T')[0],
      dateModification: new Date().toISOString().split('T')[0],
      anneeAcademique: anneeCourante,
      candidatIds: [request.candidatId],
      progression: 5
    };
    
    dossiersData.push(newDossier);
    return newDossier;
  }
  
  // Mettre à jour un dossier
  async updateDossier(id: number, request: UpdateDossierRequest): Promise<DossierMemoire> {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = dossiersData.findIndex(d => d.id === id);
    if (index === -1) {
      throw new Error(`Dossier ${id} non trouvé`);
    }
    
    // Mapper les champs pour la mise à jour
    const updatedDossier = {
      ...dossiersData[index],
      titre: request.titre,
      description: request.description || dossiersData[index].description,
      anneeAcademique: request.anneeAcademique,
      encadrantId: request.encadrantId,
      dateModification: new Date().toISOString().split('T')[0]
    };
    
    dossiersData[index] = updatedDossier;
    return updatedDossier;
  }
  
  // Supprimer un dossier
  async deleteDossier(id: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = dossiersData.findIndex(d => d.id === id);
    if (index !== -1) {
      dossiersData.splice(index, 1);
    }
  }
  
  // Changer l'étape d'un dossier
  async changerEtape(id: number, etape: any): Promise<DossierMemoire> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = dossiersData.findIndex(d => d.id === id);
    if (index === -1) {
      throw new Error(`Dossier ${id} non trouvé`);
    }
    
    dossiersData[index].etape = etape;
    dossiersData[index].dateModification = new Date().toISOString().split('T')[0];
    
    return dossiersData[index];
  }

  // Sélectionner un sujet (lie le sujet au dossier et passe à l'étape suivante)
  async selectionnerSujet(dossierId: number, sujet: { titre: string, description: string }): Promise<DossierMemoire> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = dossiersData.findIndex(d => d.id === dossierId);
    if (index === -1) {
      throw new Error(`Dossier ${dossierId} non trouvé`);
    }
    
    dossiersData[index] = {
      ...dossiersData[index],
      titre: sujet.titre,
      description: sujet.description,
      etape: 'CHOIX_BINOME',
      progression: 15,
      dateModification: new Date().toISOString().split('T')[0]
    };
    
    return dossiersData[index];
  }

  // Récupérer les candidats disponibles pour binôme (ceux sans dossier)
  async getCandidatsDisponibles(excludeCandidatId?: string): Promise<any[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const allCandidats = require('../data/candidats.data').candidatsData;
    const candidatesWithDossier = dossiersData.flatMap(d => d.candidatIds);
    
    let disponibles = allCandidats.filter((c: any) => !candidatesWithDossier.includes(c.id));
    
    if (excludeCandidatId) {
      disponibles = disponibles.filter((c: any) => c.id !== excludeCandidatId);
    }
    
    return disponibles;
  }
}

export const dossierService = new DossierService();
export default dossierService;
