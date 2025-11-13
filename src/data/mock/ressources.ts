import { RessourceMediatheque, RessourceSauvegardee } from '../../types/ressource';

// Mock des ressources de la médiathèque
export const mockRessourcesMediatheque: RessourceMediatheque[] = [
  // Cours
  {
    idRessource: 1,
    titre: 'Algorithmes de Machine Learning - Cours Vidéo',
    description: 'Série de cours vidéo sur les algorithmes fondamentaux du machine learning avec exemples pratiques.',
    auteur: 'Prof. Ibrahima Fall',
    datePublication: new Date('2025-03-15'),
    dateCreation: new Date('2025-03-15'),
    dateModification: new Date('2025-03-15'),
    categorie: 'cours',
    typeRessource: 'video',
    urlYoutube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Exemple d'URL YouTube
    tags: ['machine learning', 'algorithmes', 'IA'],
    likes: 234,
    commentaires: 45,
    vues: 3421,
    niveau: 'master'
  },
  {
    idRessource: 2,
    titre: 'Introduction à la programmation orientée objet',
    description: 'Cours complet sur les concepts de la programmation orientée objet avec exemples en Java.',
    auteur: 'Prof. Mamadou Ba',
    datePublication: new Date('2025-02-20'),
    dateCreation: new Date('2025-02-20'),
    dateModification: new Date('2025-02-20'),
    categorie: 'cours',
    typeRessource: 'document',
    cheminFichier: '/assets/documents/Memoire_Final_Corrigé.pdf',
    tags: ['programmation', 'POO', 'Java'],
    likes: 189,
    commentaires: 32,
    vues: 2156,
    niveau: 'licence'
  },
  {
    idRessource: 3,
    titre: 'Base de données relationnelles - Cours',
    description: 'Cours approfondi sur la conception et l\'utilisation des bases de données relationnelles.',
    auteur: 'Dr. Aissatou Ndiaye',
    datePublication: new Date('2025-01-10'),
    dateCreation: new Date('2025-01-10'),
    dateModification: new Date('2025-01-10'),
    categorie: 'cours',
    typeRessource: 'document',
    cheminFichier: '/mediatheque/cours/bdd-relationnelles.pdf',
    tags: ['base de données', 'SQL', 'relationnel'],
    likes: 156,
    commentaires: 28,
    vues: 1890,
    niveau: 'master'
  },
  // Mémoires
  {
    idRessource: 4,
    titre: 'Système de gestion de bibliothèque numérique',
    description: 'Mémoire de fin d\'études sur la conception et le développement d\'un système de gestion de bibliothèque numérique.',
    auteur: 'Étudiant Master',
    datePublication: new Date('2024-12-15'),
    dateCreation: new Date('2024-12-15'),
    dateModification: new Date('2024-12-15'),
    categorie: 'memoires',
    typeRessource: 'document',
    cheminFichier: '/mediatheque/memoires/bibliotheque-numerique.pdf',
    tags: ['bibliothèque', 'gestion', 'numérique'],
    likes: 98,
    commentaires: 15,
    vues: 1234,
    niveau: 'master'
  },
  {
    idRessource: 5,
    titre: 'Application mobile de suivi médical',
    description: 'Mémoire présentant le développement d\'une application mobile pour le suivi médical des patients.',
    auteur: 'Étudiant Master',
    datePublication: new Date('2024-11-20'),
    dateCreation: new Date('2024-11-20'),
    dateModification: new Date('2024-11-20'),
    categorie: 'memoires',
    typeRessource: 'document',
    cheminFichier: '/mediatheque/memoires/app-mobile-medical.pdf',
    tags: ['mobile', 'médical', 'application'],
    likes: 145,
    commentaires: 22,
    vues: 1678,
    niveau: 'master'
  },
  {
    idRessource: 6,
    titre: 'Analyse de données avec Python',
    description: 'Mémoire sur l\'analyse de données massives en utilisant Python et ses bibliothèques.',
    auteur: 'Étudiant Licence',
    datePublication: new Date('2024-10-05'),
    dateCreation: new Date('2024-10-05'),
    dateModification: new Date('2024-10-05'),
    categorie: 'memoires',
    typeRessource: 'document',
    cheminFichier: '/mediatheque/memoires/analyse-donnees-python.pdf',
    tags: ['Python', 'analyse', 'données'],
    likes: 201,
    commentaires: 38,
    vues: 2456,
    niveau: 'licence'
  },
  // Canevas
  {
    idRessource: 7,
    titre: 'Canevas de mémoire de fin d\'études',
    description: 'Modèle de structure et de formatage pour la rédaction d\'un mémoire de fin d\'études.',
    auteur: 'Admin ISI',
    datePublication: new Date('2025-04-20'),
    dateCreation: new Date('2025-04-20'),
    dateModification: new Date('2025-04-20'),
    categorie: 'canevas',
    typeRessource: 'document',
    cheminFichier: '/mediatheque/canevas/memoire-fin-etudes.docx',
    tags: ['canevas', 'mémoire', 'template'],
    likes: 312,
    commentaires: 56,
    vues: 4567,
    niveau: 'all',
    estImportant: true
  },
  {
    idRessource: 8,
    titre: 'Canevas de présentation PowerPoint',
    description: 'Modèle de présentation PowerPoint aux couleurs et normes graphiques de l\'institut.',
    auteur: 'Admin ISI',
    datePublication: new Date('2025-04-15'),
    dateCreation: new Date('2025-04-15'),
    dateModification: new Date('2025-04-15'),
    categorie: 'canevas',
    typeRessource: 'document',
    cheminFichier: '/mediatheque/canevas/powerpoint-isi.pptx',
    tags: ['template', 'powerpoint', 'présentation'],
    likes: 89,
    commentaires: 12,
    vues: 1567,
    niveau: 'all'
  },
  {
    idRessource: 9,
    titre: 'Canevas de rapport de stage',
    description: 'Structure et formatage standard pour la rédaction d\'un rapport de stage.',
    auteur: 'Dr. Amadou Diallo',
    datePublication: new Date('2025-03-01'),
    dateCreation: new Date('2025-03-01'),
    dateModification: new Date('2025-03-01'),
    categorie: 'canevas',
    typeRessource: 'document',
    cheminFichier: '/mediatheque/canevas/rapport-stage.docx',
    tags: ['canevas', 'rapport', 'stage'],
    likes: 178,
    commentaires: 29,
    vues: 2134,
    niveau: 'all'
  },
  // Vidéos (toutes des cours)
  {
    idRessource: 10,
    titre: 'Tutoriel : Développement web avec React',
    description: 'Série de vidéos tutoriels sur le développement d\'applications web avec React.js.',
    auteur: 'Prof. Ibrahima Fall',
    datePublication: new Date('2025-02-10'),
    dateCreation: new Date('2025-02-10'),
    dateModification: new Date('2025-02-10'),
    categorie: 'cours',
    typeRessource: 'video',
    urlYoutube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Exemple d'URL YouTube
    tags: ['React', 'web', 'tutoriel'],
    likes: 267,
    commentaires: 41,
    vues: 3890,
    niveau: 'master'
  },
  {
    idRessource: 11,
    titre: 'Conférence : Intelligence Artificielle et Éthique',
    description: 'Enregistrement vidéo d\'une conférence sur les enjeux éthiques de l\'intelligence artificielle.',
    auteur: 'Dr. Fatou Sow',
    datePublication: new Date('2025-01-25'),
    dateCreation: new Date('2025-01-25'),
    dateModification: new Date('2025-01-25'),
    categorie: 'cours',
    typeRessource: 'video',
    urlYoutube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Exemple d'URL YouTube
    tags: ['IA', 'éthique', 'conférence'],
    likes: 189,
    commentaires: 34,
    vues: 2678,
    niveau: 'all'
  },
  {
    idRessource: 12,
    titre: 'Démonstration : Déploiement d\'application sur le cloud',
    description: 'Vidéo démonstrative expliquant le processus de déploiement d\'une application sur les plateformes cloud.',
    auteur: 'Prof. Mamadou Ba',
    datePublication: new Date('2024-12-20'),
    dateCreation: new Date('2024-12-20'),
    dateModification: new Date('2024-12-20'),
    categorie: 'cours',
    typeRessource: 'video',
    urlYoutube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Exemple d'URL YouTube
    tags: ['cloud', 'déploiement', 'devops'],
    likes: 156,
    commentaires: 27,
    vues: 1987,
    niveau: 'master'
  }
];

// Mock des ressources sauvegardées par l'étudiant
// TODO: Remplacer par un appel API pour récupérer les ressources sauvegardées de l'étudiant connecté
export const mockRessourcesSauvegardees: RessourceSauvegardee[] = [
  // Cours sauvegardés
  {
    idSauvegarde: 1,
    idRessource: 1,
    idEtudiant: 1, // ID de l'étudiant connecté
    dateSauvegarde: new Date('2025-05-12'),
    ressource: mockRessourcesMediatheque[0] // Cours Machine Learning
  },
  {
    idSauvegarde: 2,
    idRessource: 2,
    idEtudiant: 1,
    dateSauvegarde: new Date('2025-05-10'),
    ressource: mockRessourcesMediatheque[1] // Cours POO
  },
  // Mémoires sauvegardés
  {
    idSauvegarde: 3,
    idRessource: 4,
    idEtudiant: 1,
    dateSauvegarde: new Date('2025-05-08'),
    ressource: mockRessourcesMediatheque[3] // Mémoire bibliothèque
  },
  {
    idSauvegarde: 4,
    idRessource: 5,
    idEtudiant: 1,
    dateSauvegarde: new Date('2025-05-05'),
    ressource: mockRessourcesMediatheque[4] // Mémoire app mobile
  },
  // Canevas sauvegardés
  {
    idSauvegarde: 5,
    idRessource: 7,
    idEtudiant: 1,
    dateSauvegarde: new Date('2025-05-01'),
    ressource: mockRessourcesMediatheque[6] // Canevas mémoire
  },
  {
    idSauvegarde: 6,
    idRessource: 8,
    idEtudiant: 1,
    dateSauvegarde: new Date('2025-04-28'),
    ressource: mockRessourcesMediatheque[7] // Canevas PowerPoint
  },
  // Vidéos sauvegardées
  {
    idSauvegarde: 7,
    idRessource: 10,
    idEtudiant: 1,
    dateSauvegarde: new Date('2025-04-25'),
    ressource: mockRessourcesMediatheque[9] // Tutoriel React
  },
  {
    idSauvegarde: 8,
    idRessource: 11,
    idEtudiant: 1,
    dateSauvegarde: new Date('2025-04-20'),
    ressource: mockRessourcesMediatheque[10] // Conférence IA
  }
];

// Fonction utilitaire pour obtenir les ressources sauvegardées d'un étudiant
export const getRessourcesSauvegardees = (idEtudiant: number): RessourceSauvegardee[] => {
  // TODO: Remplacer par un appel API
  return mockRessourcesSauvegardees.filter(rs => rs.idEtudiant === idEtudiant);
};

