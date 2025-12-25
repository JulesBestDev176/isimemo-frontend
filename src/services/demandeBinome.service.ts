// Service Demande Binome - Mode Mock (pas de connexion backend)

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

// Données mock
const mockDemandes: DemandeBinome[] = [
  {
    idDemande: 1,
    demandeurId: 1,
    demandeurEmail: 'jean.dupont@univ.fr',
    demandeurNom: 'Jean Dupont',
    demandeurMatricule: 'ETU001',
    demandeurFiliere: 'Informatique',
    destinataireId: 2,
    destinataireEmail: 'marie.martin@univ.fr',
    destinataireNom: 'Marie Martin',
    dossierDemandeurId: 1,
    dossierDestinataireId: 2,
    sujetTitre: 'Application de gestion',
    sujetDescription: 'Développement d\'une application web',
    message: 'Je vous propose de travailler ensemble sur ce sujet.',
    statut: 'EN_ATTENTE',
    dateDemande: new Date().toISOString()
  }
];

class DemandeBinomeService {
  
  /**
   * Crée une nouvelle demande de binôme
   */
  async creerDemande(request: CreateDemandeBinomeRequest): Promise<DemandeBinome> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newDemande: DemandeBinome = {
      idDemande: mockDemandes.length + 1,
      demandeurId: request.demandeurId,
      demandeurEmail: request.demandeurEmail,
      demandeurNom: request.demandeurNom,
      demandeurMatricule: request.demandeurMatricule || '',
      demandeurFiliere: request.demandeurFiliere || '',
      destinataireId: request.destinataireId,
      destinataireEmail: request.destinataireEmail || '',
      destinataireNom: request.destinataireNom || '',
      dossierDemandeurId: request.dossierDemandeurId,
      dossierDestinataireId: request.dossierDestinataireId,
      sujetTitre: request.sujetTitre || '',
      sujetDescription: request.sujetDescription || '',
      sujetId: request.sujetId,
      message: request.message || '',
      statut: 'EN_ATTENTE',
      dateDemande: new Date().toISOString()
    };
    
    mockDemandes.push(newDemande);
    return newDemande;
  }
  
  /**
   * Récupère une demande par ID
   */
  async getDemandeById(id: number): Promise<DemandeBinome> {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const demande = mockDemandes.find(d => d.idDemande === id);
    if (!demande) {
      throw new Error(`Demande ${id} non trouvée`);
    }
    return demande;
  }
  
  /**
   * Récupère toutes les demandes reçues par un candidat
   */
  async getDemandesRecues(candidatId: number): Promise<DemandeBinome[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockDemandes.filter(d => d.destinataireId === candidatId);
  }
  
  /**
   * Récupère les demandes reçues en attente par un candidat
   */
  async getDemandesRecuesEnAttente(candidatId: number): Promise<DemandeBinome[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockDemandes.filter(d => d.destinataireId === candidatId && d.statut === 'EN_ATTENTE');
  }
  
  /**
   * Récupère les demandes envoyées par un candidat
   */
  async getDemandesEnvoyees(candidatId: number): Promise<DemandeBinome[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockDemandes.filter(d => d.demandeurId === candidatId);
  }
  
  /**
   * Accepte une demande de binôme
   */
  async accepterDemande(demandeId: number): Promise<DemandeBinome> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockDemandes.findIndex(d => d.idDemande === demandeId);
    if (index === -1) {
      throw new Error(`Demande ${demandeId} non trouvée`);
    }
    
    mockDemandes[index].statut = 'ACCEPTEE';
    mockDemandes[index].dateReponse = new Date().toISOString();
    mockDemandes[index].groupeId = Date.now(); // Génère un ID de groupe mock
    
    return mockDemandes[index];
  }
  
  /**
   * Refuse une demande de binôme
   */
  async refuserDemande(demandeId: number): Promise<DemandeBinome> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockDemandes.findIndex(d => d.idDemande === demandeId);
    if (index === -1) {
      throw new Error(`Demande ${demandeId} non trouvée`);
    }
    
    mockDemandes[index].statut = 'REFUSEE';
    mockDemandes[index].dateReponse = new Date().toISOString();
    
    return mockDemandes[index];
  }
}

export const demandeBinomeService = new DemandeBinomeService();
export default demandeBinomeService;
