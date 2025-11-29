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
  },
  {
    idProfesseur: 9,
    nom: 'Gueye',
    prenom: 'Omar',
    email: 'jurie@isimemo.edu.sn',
    grade: 'Professeur',
    specialite: 'Management',
    estDisponible: true,
    departement: 'Département Management',
    estEncadrant: true,
    estJurie: true,
    capaciteEncadrement: 8,
    nombreEncadrementsActuels: 1
  },
  // Professeurs supplémentaires pour jurys
  {
    idProfesseur: 10,
    nom: 'Cissé',
    prenom: 'Abdoulaye',
    email: 'abdoulaye.cisse@isi.edu.sn',
    grade: 'Professeur',
    specialite: 'Génie Logiciel',
    estDisponible: true,
    departement: 'Département Informatique',
    estJurie: true
  },
  {
    idProfesseur: 11,
    nom: 'Mbaye',
    prenom: 'Sokhna',
    email: 'sokhna.mbaye@isi.edu.sn',
    grade: 'Maître de Conférences',
    specialite: 'Sécurité Informatique',
    estDisponible: true,
    departement: 'Département Informatique',
    estJurie: true
  },
  {
    idProfesseur: 12,
    nom: 'Diouf',
    prenom: 'Cheikh',
    email: 'cheikh.diouf@isi.edu.sn',
    grade: 'Professeur',
    specialite: 'Réseaux',
    estDisponible: true,
    departement: 'Département Informatique',
    estJurie: true
  },
  {
    idProfesseur: 13,
    nom: 'Faye',
    prenom: 'Mariama',
    email: 'mariama.faye@isi.edu.sn',
    grade: 'Docteur',
    specialite: 'Data Science',
    estDisponible: true,
    departement: 'Département Informatique',
    estJurie: true
  },
  {
    idProfesseur: 14,
    nom: 'Tall',
    prenom: 'Alioune',
    email: 'alioune.tall@isi.edu.sn',
    grade: 'Professeur',
    specialite: 'Systèmes Embarqués',
    estDisponible: true,
    departement: 'Département Informatique',
    estJurie: true
  },
  {
    idProfesseur: 15,
    nom: 'Ndao',
    prenom: 'Bineta',
    email: 'bineta.ndao@isi.edu.sn',
    grade: 'Maître de Conférences',
    specialite: 'Cloud Computing',
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

/**
 * Récupère l'ID du professeur basé sur l'email de l'utilisateur
 * Mapping : email utilisateur -> idProfesseur
 */
export const getProfesseurIdByEmail = (email: string): number | undefined => {
  const professeur = mockProfesseurs.find(p => p.email === email);
  return professeur ? professeur.idProfesseur : undefined;
};
