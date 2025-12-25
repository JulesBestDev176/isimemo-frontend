export interface Sujet {
  id: number;
  titre: string;
  description: string;
  filieres: string[];
  niveau: string;
  departement: string;
  motsCles: string[]; // Standardized to array
  prerequis: string;
  objectifs: string;
  anneeAcademique: string;
  origine: 'BANQUE' | 'PROPOSITION';
  statut: 'brouillon' | 'soumis' | 'VALIDE' | 'rejete';
  emailCreateur: string;
  nomCreateur: string;
  candidatId?: string; // Unified with other IDs
  dossierMemoireId?: number;
  nombreMaxEtudiants: number;
  nombreEtudiantsActuels: number;
  dateCreation: string;
  dateModification: string;
  dateSoumission?: string;
  dateApprobation?: string;
}

export const sujetsData: Sujet[] = [
  {
    id: 1,
    titre: 'Développement d\'une application de gestion de mémoires',
    description: 'Conception et développement d\'une plateforme web permettant de gérer les mémoires de fin d\'études (ISIMemo)',
    filieres: ['Génie Logiciel', 'IAGE'],
    niveau: 'Licence 3',
    departement: 'Génie Informatique',
    motsCles: ['web', 'react', 'nodejs', 'gestion', 'académique'],
    prerequis: 'Connaissances en React, TypeScript et Node.js',
    objectifs: 'Réaliser une application complète pour le suivi des mémoires de la proposition à la soutenance.',
    anneeAcademique: '2025-2026',
    origine: 'BANQUE',
    statut: 'VALIDE',
    emailCreateur: 'martin.ndiaye@groupeisi.com',
    nomCreateur: 'Dr. Martin Ndiaye',
    nombreMaxEtudiants: 2,
    nombreEtudiantsActuels: 1,
    dateCreation: '2025-10-01',
    dateModification: '2025-12-25',
    dateApprobation: '2025-10-15'
  },
  {
    id: 2,
    titre: 'Intelligence artificielle pour la détection de fraude bancaire',
    description: 'Utilisation du Machine Learning pour identifier des patterns suspects dans les transactions bancaires en temps réel.',
    filieres: ['Génie Informatique', 'Data Science'],
    niveau: 'Master 1',
    departement: 'Génie Informatique',
    motsCles: ['IA', 'Machine Learning', 'Sécurité', 'Banque'],
    prerequis: 'Python, Scikit-learn, Statistiques',
    objectifs: 'Concevoir un modèle prédictif avec un taux de précision supérieur à 95%.',
    anneeAcademique: '2025-2026',
    origine: 'BANQUE',
    statut: 'VALIDE',
    emailCreateur: 'amadou.diallo@groupeisi.com',
    nomCreateur: 'Prof. Amadou Diallo',
    nombreMaxEtudiants: 1,
    nombreEtudiantsActuels: 0,
    dateCreation: '2025-11-01',
    dateModification: '2025-12-25',
    dateApprobation: '2025-11-10'
  },
  {
    id: 3,
    titre: 'Système de recommandation intelligent (PIGMA)',
    description: 'Développement d\'un moteur de recommandation pour la plateforme PIGMA basant sur les préférences utilisateurs.',
    filieres: ['Génie Logiciel'],
    niveau: 'Licence 3',
    departement: 'Génie Informatique',
    motsCles: ['Recommandation', 'Algorithmes', 'PIGMA', 'Data'],
    prerequis: 'Algorithmique, Bases de données',
    objectifs: 'Améliorer l\'engagement utilisateur sur PIGMA via des recommandations pertinentes.',
    anneeAcademique: '2025-2026',
    origine: 'PROPOSITION',
    statut: 'VALIDE',
    emailCreateur: 'souleymanefallisidk@groupeisi.com',
    nomCreateur: 'Souleymane Fall',
    candidatId: 'CAND013',
    dossierMemoireId: 13,
    nombreMaxEtudiants: 1,
    nombreEtudiantsActuels: 1,
    dateCreation: '2025-12-25',
    dateModification: '2025-12-25',
    dateSoumission: '2025-12-25',
    dateApprobation: '2025-12-25'
  },
  {
    id: 4,
    titre: 'Optimisation de la chaîne logistique par la Blockchain',
    description: 'Mise en place d\'un registre distribué pour assurer la traçabilité des colis en milieu industriel.',
    filieres: ['Génie Logiciel', 'Réseaux'],
    niveau: 'Licence 3',
    departement: 'Génie Informatique',
    motsCles: ['Blockchain', 'Logistique', 'Smart Contracts'],
    prerequis: 'Solidity, Web3.js',
    objectifs: 'Réduire les litiges de livraison de 30% grâce à la transparence de la Blockchain.',
    anneeAcademique: '2025-2026',
    origine: 'BANQUE',
    statut: 'soumis',
    emailCreateur: 'fatou.ngom@groupeisi.com',
    nomCreateur: 'Mme Fatou Ngom',
    nombreMaxEtudiants: 2,
    nombreEtudiantsActuels: 0,
    dateCreation: '2025-12-15',
    dateModification: '2025-12-15',
    dateSoumission: '2025-12-15'
  },
  {
    id: 5,
    titre: 'Application de Secours d\'Urgence (UrgenceISI)',
    description: 'Une application mobile permettant d\'alerter les secours et les proches en cas d\'incident sur le campus.',
    filieres: ['Génie Logiciel', 'Réseaux'],
    niveau: 'Licence 3',
    departement: 'Génie Informatique',
    motsCles: ['Mobile', 'Géolocalisation', 'Urgence', 'Flutter'],
    prerequis: 'Dart, Flutter, Firebase',
    objectifs: 'Créer un bouton d\'alerte communautaire pour la sécurité des étudiants.',
    anneeAcademique: '2025-2026',
    origine: 'PROPOSITION',
    statut: 'VALIDE',
    emailCreateur: 'alioundourisidk@groupeisi.com',
    nomCreateur: 'Aliou Ndour',
    candidatId: 'CAND003',
    dossierMemoireId: 3,
    nombreMaxEtudiants: 1,
    nombreEtudiantsActuels: 1,
    dateCreation: '2025-12-25',
    dateModification: '2025-12-25',
    dateSoumission: '2025-12-25',
    dateApprobation: '2025-12-25'
  },
  {
    id: 6,
    titre: 'Analyse et renforcement de la sécurité d\'un réseau d\'entreprise',
    description: 'Réalisation d\'un audit de sécurité (Pentesting) complet et mise en place de mesures de durcissement (Hardening).',
    filieres: ['Réseaux', 'Génie Informatique'],
    niveau: 'Master 1',
    departement: 'Réseaux et Télécoms',
    motsCles: ['Sécurité', 'Pentest', 'Audit', 'Réseaux'],
    prerequis: 'Administration Linux, Réseaux TCP/IP, Kali Linux',
    objectifs: 'Identifier les vulnérabilités critiques et proposer un plan de remédiation efficace.',
    anneeAcademique: '2025-2026',
    origine: 'BANQUE',
    statut: 'VALIDE',
    emailCreateur: 'ousmane.lo@groupeisi.com',
    nomCreateur: 'Dr. Ousmane Lo',
    nombreMaxEtudiants: 2,
    nombreEtudiantsActuels: 0,
    dateCreation: '2025-12-20',
    dateModification: '2025-12-20',
    dateApprobation: '2025-12-22'
  },
  {
    id: 7,
    titre: 'Système d\'irrigation intelligent basé sur l\'IoT',
    description: `Déploiement de capteurs d'humidité et de température connectés pour optimiser l'utilisation de l'eau en agriculture.`,
    filieres: ['Réseaux', 'Génie Informatique'],
    niveau: 'Licence 3',
    departement: 'Génie Informatique',
    motsCles: ['IoT', 'Arduino', 'LoRaWAN', 'Agriculture'],
    prerequis: 'C++, Electronique de base, Réseaux sans fil',
    objectifs: 'Réduire le gaspillage d\'eau de 40% par une automatisation intelligente.',
    anneeAcademique: '2025-2026',
    origine: 'BANQUE',
    statut: 'VALIDE',
    emailCreateur: 'khady.fall@groupeisi.com',
    nomCreateur: 'Mme Khady Fall',
    nombreMaxEtudiants: 2,
    nombreEtudiantsActuels: 0,
    dateCreation: '2025-11-20',
    dateModification: '2025-11-20',
    dateApprobation: '2025-11-25'
  },
  {
    id: 8,
    titre: 'Migration vers une architecture Microservices et Cloud Native',
    description: `Etude et mise en œuvre du conteneurisation et de l'orchestration pour transformer une application monolithique.`,
    filieres: ['Génie Logiciel'],
    niveau: 'Master 2',
    departement: 'Génie Informatique',
    motsCles: ['Docker', 'Kubernetes', 'Microservices', 'AWS'],
    prerequis: 'Architecture logicielle, CI/CD, DevOps',
    objectifs: 'Améliorer la scalabilité et la disponibilité du système de 90% à 99.9%.',
    anneeAcademique: '2025-2026',
    origine: 'BANQUE',
    statut: 'soumis',
    emailCreateur: 'moussa.thiam@groupeisi.com',
    nomCreateur: 'M. Moussa Thiam',
    nombreMaxEtudiants: 1,
    nombreEtudiantsActuels: 0,
    dateCreation: '2025-12-10',
    dateModification: '2025-12-10',
    dateSoumission: '2025-12-10'
  }
];

export const getSujetById = (id: number): Sujet | undefined => {
  return sujetsData.find(s => s.id === id);
};

export const getSujetsDisponibles = (): Sujet[] => {
  return sujetsData.filter(s => s.statut === 'VALIDE' && s.nombreEtudiantsActuels < s.nombreMaxEtudiants);
};
