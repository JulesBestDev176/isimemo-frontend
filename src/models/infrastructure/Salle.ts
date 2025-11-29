// ============================================================================
// TYPES & INTERFACES - SALLE DE SOUTENANCE
// ============================================================================

export interface Salle {
  idSalle: number;
  nom: string;
  batiment: string;
  capacite: number;
  equipements?: string[]; // Ex: ['Projecteur', 'Tableau', 'Climatisation']
  estDisponible: boolean;
  estArchive?: boolean;
}

// ============================================================================
// MOCKS
// ============================================================================

export const mockSalles: Salle[] = [
  {
    idSalle: 1,
    nom: 'Amphi A',
    batiment: 'Bâtiment Principal',
    capacite: 100,
    equipements: ['Projecteur', 'Micro', 'Climatisation', 'Tableau'],
    estDisponible: true
  },
  {
    idSalle: 2,
    nom: 'Amphi B',
    batiment: 'Bâtiment Principal',
    capacite: 80,
    equipements: ['Projecteur', 'Micro', 'Climatisation'],
    estDisponible: true
  },
  {
    idSalle: 3,
    nom: 'Salle 101',
    batiment: 'Bâtiment Informatique',
    capacite: 50,
    equipements: ['Projecteur', 'Tableau', 'Climatisation'],
    estDisponible: true
  },
  {
    idSalle: 4,
    nom: 'Salle 102',
    batiment: 'Bâtiment Informatique',
    capacite: 50,
    equipements: ['Projecteur', 'Tableau'],
    estDisponible: true
  },
  {
    idSalle: 5,
    nom: 'Salle 201',
    batiment: 'Bâtiment Informatique',
    capacite: 40,
    equipements: ['Projecteur', 'Climatisation'],
    estDisponible: true
  },
  {
    idSalle: 6,
    nom: 'Salle 202',
    batiment: 'Bâtiment Informatique',
    capacite: 40,
    equipements: ['Projecteur', 'Tableau'],
    estDisponible: true
  },
  {
    idSalle: 7,
    nom: 'Salle Conférence',
    batiment: 'Bâtiment Administration',
    capacite: 60,
    equipements: ['Projecteur', 'Micro', 'Climatisation', 'Tableau', 'Visioconférence'],
    estDisponible: true
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Récupère une salle par son ID
 */
export const getSalleById = (id: number): Salle | undefined => {
  return mockSalles.find(s => s.idSalle === id);
};

/**
 * Récupère les salles disponibles
 */
export const getSallesDisponibles = (): Salle[] => {
  return mockSalles.filter(s => s.estDisponible);
};

/**
 * Récupère les salles avec une capacité minimale
 */
export const getSallesAvecCapacite = (capaciteMin: number): Salle[] => {
  return mockSalles.filter(s => s.estDisponible && s.capacite >= capaciteMin);
};
