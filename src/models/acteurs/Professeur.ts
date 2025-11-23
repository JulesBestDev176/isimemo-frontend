// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface Professeur {
  idProfesseur: number;
  nom: string;
  prenom: string;
  email: string;
  grade?: string;
  specialite?: string;
  estDisponible: boolean;
  departement?: string;
  
  // Rôles et capacités
  estEncadrant?: boolean;
  estJurie?: boolean;
  estCommission?: boolean;
  estChef?: boolean;
  
  capaciteEncadrement?: number;
  nombreEncadrementsActuels?: number;
}

// ============================================================================
// MOCKS
// ============================================================================

export const mockProfesseurs: Professeur[] = [
  {
    idProfesseur: 1,
    nom: 'Pierre',
    prenom: 'Jean',
    email: 'jean.pierre@isi.ml',
    grade: 'Docteur',
    specialite: 'Informatique',
    estDisponible: true,
    departement: 'Département Informatique',
    estEncadrant: true,
    estJurie: true,
    capaciteEncadrement: 10,
    nombreEncadrementsActuels: 5
  },
  {
    idProfesseur: 2,
    nom: 'Ndiaye',
    prenom: 'Ibrahima',
    email: 'ibrahima.ndiaye@isi.edu.sn',
    grade: 'Professeur',
    specialite: 'Réseaux et Sécurité',
    estDisponible: true,
    departement: 'Département Informatique',
    estEncadrant: true,
    estChef: true,
    capaciteEncadrement: 15,
    nombreEncadrementsActuels: 8
  },
  {
    idProfesseur: 3,
    nom: 'Ba',
    prenom: 'Aissatou',
    email: 'aissatou.ba@isi.edu.sn',
    grade: 'Maître de Conférences',
    specialite: 'Base de données',
    estDisponible: true,
    departement: 'Département Informatique',
    estCommission: true,
    estJurie: true,
    capaciteEncadrement: 8,
    nombreEncadrementsActuels: 2
  },
  {
    idProfesseur: 4,
    nom: 'Sarr',
    prenom: 'Mamadou',
    email: 'mamadou.sarr@isi.edu.sn',
    grade: 'Professeur',
    specialite: 'Développement Web',
    estDisponible: true,
    departement: 'Département Informatique',
    estEncadrant: true,
    capaciteEncadrement: 10,
    nombreEncadrementsActuels: 4
  },
  {
    idProfesseur: 5,
    nom: 'Diallo',
    prenom: 'Fatou',
    email: 'fatou.diallo@isi.edu.sn',
    grade: 'Professeur',
    specialite: 'Intelligence Artificielle',
    estDisponible: true,
    departement: 'Département Informatique',
    estCommission: true,
    estEncadrant: true,
    capaciteEncadrement: 12,
    nombreEncadrementsActuels: 6
  },
  {
    idProfesseur: 6,
    nom: 'Kane',
    prenom: 'Amadou',
    email: 'amadou.kane@isi.edu.sn',
    grade: 'Maître de Conférences',
    specialite: 'Intelligence Artificielle',
    estDisponible: true,
    departement: 'Département Informatique',
    estJurie: true
  },
  {
    idProfesseur: 7,
    nom: 'Sow',
    prenom: 'Moussa',
    email: 'moussa.sow@isi.edu.sn',
    grade: 'Professeur',
    specialite: 'Systèmes distribués',
    estDisponible: true,
    departement: 'Département Informatique',
    estEncadrant: true,
    capaciteEncadrement: 10,
    nombreEncadrementsActuels: 3
  },
  {
    idProfesseur: 8,
    nom: 'Thiam',
    prenom: 'Ousmane',
    email: 'ousmane.thiam@isi.edu.sn',
    grade: 'Docteur',
    specialite: 'Informatique',
    estDisponible: true,
    departement: 'Département Informatique',
    estJurie: true
  }
];

// Encadrant principal (utilisé dans dashboard)
export const mockEncadrant: Professeur = mockProfesseurs[0];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getProfesseurById = (id: number): Professeur | undefined => {
  return mockProfesseurs.find(p => p.idProfesseur === id);
};

export const getProfesseursDisponibles = (): Professeur[] => {
  return mockProfesseurs.filter(p => p.estDisponible);
};
