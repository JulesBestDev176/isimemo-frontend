// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface SimilarDocument {
    idDossier: number;
    titreMemoire: string;
    auteur: {
        nom: string;
        prenom: string;
    };
    anneeAcademique: string;
    similarityScore: number; // Score de similarité en %
    departement?: string;
    encadrant?: {
        nom: string;
        prenom: string;
    };
    dateDepot: Date;
    cheminFichier: string;
    nomFichier: string;
    taille: string;
}

// ============================================================================
// MOCKS
// ============================================================================

export const mockSimilarDocuments: SimilarDocument[] = [
    {
        idDossier: 201,
        titreMemoire: 'Système de recommandation basé sur l\'apprentissage automatique pour les plateformes e-commerce',
        auteur: {
            nom: 'Diop',
            prenom: 'Cheikh'
        },
        anneeAcademique: '2023-2024',
        similarityScore: 92,
        departement: 'Intelligence Artificielle',
        encadrant: {
            nom: 'Ndiaye',
            prenom: 'Fatou'
        },
        dateDepot: new Date('2024-05-15'),
        cheminFichier: '/memoires/archives/2023-2024/memoire_201.pdf',
        nomFichier: 'Memoire_Cheikh_Diop_2024.pdf',
        taille: '3.2 MB'
    },
    {
        idDossier: 202,
        titreMemoire: 'Application de techniques de Machine Learning pour la recommandation de produits',
        auteur: {
            nom: 'Seck',
            prenom: 'Aminata'
        },
        anneeAcademique: '2022-2023',
        similarityScore: 87,
        departement: 'Intelligence Artificielle',
        encadrant: {
            nom: 'Ba',
            prenom: 'Mouhamadou'
        },
        dateDepot: new Date('2023-06-10'),
        cheminFichier: '/memoires/archives/2022-2023/memoire_202.pdf',
        nomFichier: 'Memoire_Aminata_Seck_2023.pdf',
        taille: '2.9 MB'
    },
    {
        idDossier: 203,
        titreMemoire: 'Analyse de données massives avec Spark pour les systèmes de Big Data',
        auteur: {
            nom: 'Keita',
            prenom: 'Ibrahim'
        },
        anneeAcademique: '2023-2024',
        similarityScore: 84,
        departement: 'Big Data',
        encadrant: {
            nom: 'Sarr',
            prenom: 'Mamadou'
        },
        dateDepot: new Date('2024-04-20'),
        cheminFichier: '/memoires/archives/2023-2024/memoire_203.pdf',
        nomFichier: 'Memoire_Ibrahim_Keita_2024.pdf',
        taille: '4.1 MB'
    },
    {
        idDossier: 204,
        titreMemoire: 'Système de filtrage collaboratif pour recommandation personnalisée',
        auteur: {
            nom: 'Gueye',
            prenom: 'Marieme'
        },
        anneeAcademique: '2021-2022',
        similarityScore: 81,
        departement: 'Intelligence Artificielle',
        encadrant: {
            nom: 'Diallo',
            prenom: 'Fatou'
        },
        dateDepot: new Date('2022-05-30'),
        cheminFichier: '/memoires/archives/2021-2022/memoire_204.pdf',
        nomFichier: 'Memoire_Marieme_Gueye_2022.pdf',
        taille: '3.5 MB'
    },
    {
        idDossier: 205,
        titreMemoire: 'Apprentissage profond pour la classification de données e-commerce',
        auteur: {
            nom: 'Fall',
            prenom: 'Ousmane'
        },
        anneeAcademique: '2023-2024',
        similarityScore: 89,
        departement: 'IA & Deep Learning',
        encadrant: {
            nom: 'Ndiaye',
            prenom: 'Ibrahima'
        },
        dateDepot: new Date('2024-03-12'),
        cheminFichier: '/memoires/archives/2023-2024/memoire_205.pdf',
        nomFichier: 'Memoire_Ousmane_Fall_2024.pdf',
        taille: '3.8 MB'
    },
    {
        idDossier: 206,
        titreMemoire: 'Plateforme mobile de gestion avec algorithmes de recommandation',
        auteur: {
            nom: 'Camara',
            prenom: 'Mariama'
        },
        anneeAcademique: '2022-2023',
        similarityScore: 85,
        departement: 'Développement Mobile',
        encadrant: {
            nom: 'Sarr',
            prenom: 'Moussa'
        },
        dateDepot: new Date('2023-04-18'),
        cheminFichier: '/memoires/archives/2022-2023/memoire_206.pdf',
        nomFichier: 'Memoire_Mariama_Camara_2023.pdf',
        taille: '2.7 MB'
    }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Détecte les documents similaires à un dossier donné
 * @param idDossier ID du dossier à analyser
 * @returns Liste des documents similaires (max 3), triés par score décroissant
 */
export const detectSimilarDocuments = (idDossier: number): SimilarDocument[] => {
    // Pour la simulation, on retourne toujours les 3 premiers documents
    // triés par score de similarité décroissant
    return mockSimilarDocuments
        .sort((a, b) => b.similarityScore - a.similarityScore)
        .slice(0, 3);
};

/**
 * Obtient le niveau de risque basé sur le score de similarité
 */
export const getSimilarityRiskLevel = (score: number): 'high' | 'medium' | 'low' => {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
};

/**
 * Obtient le label du niveau de risque
 */
export const getSimilarityRiskLabel = (score: number): string => {
    const level = getSimilarityRiskLevel(score);
    switch (level) {
        case 'high':
            return 'Risque élevé';
        case 'medium':
            return 'Risque moyen';
        case 'low':
            return 'Risque faible';
    }
};

/**
 * Obtient la couleur du badge de risque
 * Utilise le style bleu uniforme pour tous les badges
 */
export const getSimilarityRiskColor = (score: number): string => {
    // Style bleu uniforme pour cohérence avec l'application
    return 'bg-blue-50 text-blue-700 border-blue-200';
};
