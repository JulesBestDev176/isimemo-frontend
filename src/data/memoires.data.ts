// Données des mémoires extraites des documents PDF

export interface Contact {
  nom: string;
  email: string;
  telephone: string;
}

export interface Memoire {
  id: number;
  titre: string;
  auteur: string;
  annee: string;
  departement: string;
  formation: string;
  description: string;
  resume: string;
  etiquettes: string[];
  contacts: Contact[];
  cheminFichier: string;
}

export const memoiresData: Memoire[] = [
  {
    id: 1,
    titre: "Etude et Réalisation d'une plateforme de gestion de rendez-vous médicale : Cas du Centre Hospitalier Abass Ndao",
    auteur: "Abdou Fatah Ndiaye",
    annee: "2023-2024",
    departement: "Génie Informatique",
    formation: "Licence Professionnelle Génie Logiciel",
    description: "Rapport de stage portant sur l'étude et la réalisation d'une plateforme de gestion de rendez-vous médicale pour le Centre Hospitalier Abass Ndao.",
    resume: "La santé reste l'un des plus grands défis pour les pays en voie de développement. Dans la Région africaine de l'OMS, on compte en moyenne seulement 2 médecins pour 10 000 habitants. Ce déséquilibre entraîne plusieurs problèmes : difficulté à prendre des rendez-vous, longues attentes, et manque de coordination. Nous avons développé une plateforme de gestion des rendez-vous médicaux visant à améliorer l'efficacité des services de santé.",
    etiquettes: ["Santé"],
    contacts: [
      { nom: "Abdou Fatah Ndiaye", email: "abdoufatahndiayeisidk@groupeisi.com", telephone: "+221 77 123 45 01" }
    ],
    cheminFichier: "/assets/documents/Abdou Fatah Ndiaye.pdf"
  },
  {
    id: 2,
    titre: "Conception et Réalisation d'un Portail Web pour la Gestion Dématérialisée des Services Municipaux",
    auteur: "Al Hassane Diallo",
    annee: "2023-2024",
    departement: "Génie Informatique",
    formation: "Licence Professionnelle",
    description: "Mémoire portant sur la conception d'un système de dématérialisation des services municipaux adapté au contexte sénégalais.",
    resume: "La dématérialisation des services publics représente un enjeu majeur pour les administrations modernes. Ce projet répond à la problématique : Comment concevoir un système inclusif, sécurisé et efficace ? Le portail E-Municipalité représente une étape importante vers la transformation numérique des services municipaux au Sénégal.",
    etiquettes: ["Administration publique"],
    contacts: [
      { nom: "Al Hassane Diallo", email: "alhassanedialloisidk@groupeisi.com", telephone: "+221 77 123 45 02" }
    ],
    cheminFichier: "/assets/documents/Conception et Réalisation d'un Portail Web pour la Gestion Dématérialisée des Services Municipaux.pptx.pdf"
  },
  {
    id: 3,
    titre: "Etude et Réalisation d'une plateforme intelligente de gestion des mémoires académiques : Cas ISI",
    auteur: "Souleymane Fall & Aliou Ndour",
    annee: "2024-2025",
    departement: "Génie Informatique",
    formation: "Licence Professionnelle Génie Logiciel",
    description: "Mémoire portant sur la conception et réalisation de PIGMA, une plateforme intelligente de gestion des mémoires académiques pour l'ISI.",
    resume: "Ce projet de fin d'études, réalisé dans le cadre de la Licence en Génie Informatique à l'Institut Supérieur d'Informatique (ISI), présente PIGMA (Plateforme Intelligente de Gestion des Mémoires Académiques), une solution web conçue pour digitaliser et centraliser l'ensemble du processus de gestion des mémoires académiques.\n\nLa plateforme vise à moderniser une gestion encore largement manuelle, en automatisant les principales étapes, depuis la proposition de sujet jusqu'à la soutenance finale. Elle permet la gestion électronique des dépôts, la planification des soutenances, la coordination des jurys, ainsi que la communication fluide entre étudiants et encadrants.\n\nPIGMA intègre également des fonctionnalités d'Intelligence Artificielle telles que la détection automatique de plagiat, la classification thématique des mémoires, la recommandation de sujets pertinents et un ChatBot d'assistance.\n\nEn offrant une solution innovante, complète et adaptée aux besoins de l'ISI, PIGMA contribue à améliorer la coordination académique, à valoriser le patrimoine universitaire à travers une médiathèque numérique intelligente et à renforcer la qualité et la transparence du suivi des mémoires.",
    etiquettes: ["Éducation"],
    contacts: [
      { nom: "Souleymane Fall", email: "souleymanefallisidk@groupeisi.com", telephone: "+221 77 715 10 61" },
      { nom: "Aliou Ndour", email: "alioundourisidk@groupeisi.com", telephone: "+221 76 561 68 68" }
    ],
    cheminFichier: "/assets/documents/FallNdour.pdf"
  },
  {
    id: 4,
    titre: "Conception et réalisation d'une Plateforme de Réservation de Voyage pour BOCOUM TRANSPORT",
    auteur: "Ibrahima Amadou Bocoum",
    annee: "2023-2024",
    departement: "Génie Informatique",
    formation: "Licence Professionnelle Génie Logiciel",
    description: "Rapport de stage portant sur la conception et réalisation d'une plateforme de réservation de voyage.",
    resume: "Le développement d'une plateforme de réservation en ligne pour BOCOUM TRANSPORT représente une réponse innovante aux attentes des voyageurs modernes. La plateforme est conçue avec PHP/Laravel pour le backend et Angular pour le frontend.",
    etiquettes: ["Transport"],
    contacts: [
      { nom: "Ibrahima Amadou Bocoum", email: "ibrahimaamadoubocoumisidk@groupeisi.com", telephone: "+221 77 123 45 05" }
    ],
    cheminFichier: "/assets/documents/Ibrahim Bocoum[4].pdf"
  },
  {
    id: 5,
    titre: "Conception et réalisation d'une Application mobile de covoiturage pour la ville de Dakar",
    auteur: "Houleymatou Diallo & Cheikh Tidiane Traore",
    annee: "2024-2025",
    departement: "Génie Informatique",
    formation: "Licence Professionnelle Génie Logiciel",
    description: "Mémoire portant sur la conception d'une application mobile de covoiturage pour Dakar.",
    resume: "Ce projet de fin d'étude présente TYVAA, une application mobile de covoiturage urbain destinée à faciliter les déplacements à Dakar. Elle met en relation des conducteurs disposant de places libres et des passagers souhaitant effectuer un trajet, dans une logique de partage et de réduction des coûts de transport.\n\nL'application permet de proposer ou rechercher un trajet, qu'il soit ponctuel ou régulier, avec la possibilité pour un utilisateur d'être à la fois conducteur et passager. Les fonctionnalités incluent la réservation de trajets à l'avance, la consultation des disponibilités, ainsi que des outils favorisant la confiance tels que la vérification des profils et les avis.\n\nEn offrant une solution simple, conviviale et adaptée aux besoins locaux, TYVAA contribue à améliorer la mobilité urbaine, à réduire la congestion routière et à encourager des pratiques de transport plus collaboratives.",
    etiquettes: ["Transport"],
    contacts: [
      { nom: "Houleymatou Diallo", email: "houleymatou.diallo@groupeisi.com", telephone: "+221 77 123 45 06" },
      { nom: "Cheikh Tidiane Traore", email: "cheikhtidiane.traore@groupeisi.com", telephone: "+221 77 123 45 07" }
    ],
    cheminFichier: "/assets/documents/MEMOIRE_CHEIKH_HOULEYMATOU.pdf"
  },
  {
    id: 6,
    titre: "Etude et réalisation d'une application de gestion de ressources humaines : cas de Gainde Talent Provider",
    auteur: "Awa Thiam",
    annee: "2023-2024",
    departement: "Génie Informatique",
    formation: "Licence Professionnelle Génie Logiciel",
    description: "Rapport de stage portant sur une application de gestion RH pour les ESN.",
    resume: "Ce projet se concentre sur une application de gestion des ressources humaines pour optimiser le recrutement au sein des ESN. L'application renforce l'efficacité et la transparence dans le recrutement des talents IT.",
    etiquettes: ["Ressources humaines"],
    contacts: [
      { nom: "Awa Thiam", email: "awa.thiam@groupeisi.com", telephone: "+221 77 123 45 08" }
    ],
    cheminFichier: "/assets/documents/Memoire Awa THIAM.pdf"
  },
  {
    id: 7,
    titre: "Conception et réalisation d'une application Desktop pour la gestion des congés de l'entreprise STAM",
    auteur: "Bassine Diallo",
    annee: "2023-2024",
    departement: "Génie Informatique",
    formation: "Licence Professionnelle Génie Logiciel",
    description: "Rapport de stage portant sur une application Desktop pour la gestion des congés et télétravail.",
    resume: "Notre projet de fin d'étude vise à concevoir et réaliser une plateforme desktop dédiée à la gestion des congés, des absences et du télétravail des employés, répondant aux besoins croissants des entreprises modernes. Avec l'évolution des méthodes de travail et l'importance accrue de la flexibilité, la gestion efficace des congés est devenue cruciale pour maintenir la productivité et le bien-être des employés.\n\nCette plateforme permettra aux employés de soumettre facilement des demandes de congé, aux gestionnaires de les approuver ou de les rejeter, et aux départements des ressources humaines de suivre et de gérer les absences de manière transparente. En intégrant des fonctionnalités desktop, elle offrira une accessibilité optimale et une expérience utilisateur intuitive.\n\nNous débuterons par une analyse approfondie des besoins spécifiques en matière de gestion des congés au sein des entreprises, en identifiant les défis actuels et les lacunes des systèmes existants.\n\nCe projet vise à transformer la manière dont les entreprises gèrent leurs congés et absences, en optimisant les processus et en améliorant la satisfaction des employés à travers une solution moderne et intégrée.",
    etiquettes: ["Ressources humaines"],
    contacts: [
      { nom: "Bassine Diallo", email: "bassine.diallo@groupeisi.com", telephone: "+221 77 123 45 09" }
    ],
    cheminFichier: "/assets/documents/Memoire Bassine DIALLO2.pdf"
  },
  {
    id: 8,
    titre: "Etude et Réalisation d'une Plateforme Web de Location et Vente Immobilière pour DSI",
    auteur: "Mama Aichatou Sakho",
    annee: "2023-2024",
    departement: "Génie Informatique",
    formation: "Licence Professionnelle Génie Logiciel",
    description: "Rapport de stage portant sur une plateforme web de location et vente immobilière.",
    resume: "Dans le cadre de l'obtention de notre diplôme de licence en Génie Logiciel à l'ISI (Institut Supérieur d'Informatique), nous avons réalisé un projet de fin d'études afin de compléter notre formation du premier cycle universitaire. Notre objectif était de concevoir et de mettre à disposition de Djibril Sakho Immobilier une plateforme web de location et de vente de biens immobiliers. Ce projet nous permettrait de digitaliser les tâches manuelles existantes et de profiter des avantages du numérique.\n\nCette réalisation nous a également offert l'opportunité d'approfondir et d'enrichir nos connaissances théoriques et notre expérience pratique en conception et développement d'applications. La mise en place de cette application web sera bénéfique pour les acheteurs, qui pourront facilement rechercher et trouver le bien immobilier qui leur convient. De plus, l'application sera capable de gérer les utilisateurs, les biens, les locations et les ventes.\n\nPour concevoir cette application, nous avons utilisé le langage de modélisation UML (Unified Modeling Language) afin de modéliser le système. Le langage de programmation choisi est PHP (HyperText Preprocessor) avec le Framework Laravel pour le backend et Angular pour le frontend, et le système de gestion de base de données (SGBD) est MySQL.",
    etiquettes: ["Immobilier"],
    contacts: [
      { nom: "Mama Aichatou Sakho", email: "mamaaichatou.sakho@groupeisi.com", telephone: "+221 77 123 45 10" }
    ],
    cheminFichier: "/assets/documents/Memoire MAMA AICHATOU SAKHO L3.pdf"
  },
  {
    id: 9,
    titre: "Conception et réalisation d'un site e-commerce & système de recommandation IA : Cas de Souq",
    auteur: "Kissima Tandia",
    annee: "2024-2025",
    departement: "Génie Informatique",
    formation: "Licence Professionnelle Génie Logiciel",
    description: "Mémoire portant sur un site e-commerce avec système de recommandation basé sur l'IA.",
    resume: "Face à un marché du commerce électronique de plus en plus saturé, ce mémoire vise à concevoir un système de recommandation intelligent qui dépasse les modèles traditionnels centrés sur la surconsommation. Le projet se distingue par son approche innovante, basée sur quatre piliers de recommandation avancée, classés par ordre de priorité : la consommation responsable, le cycle de vie des produits, la recommandation multi-étapes et l'interaction conversationnelle.\n\nL'objectif principal du projet est de proposer aux utilisateurs des recommandations pertinentes, personnalisées et durables, adaptées à leurs besoins et à leurs préférences, tout en intégrant des principes éthiques et responsables. Le système permet de créer des parcours utilisateur plus réactifs et interactifs, facilitant une expérience d'achat plus réfléchie et consciente.\n\nLa réalisation de ce mémoire a permis de valider la faisabilité de l'approche conceptuelle et de démontrer l'efficacité du système à générer des recommandations intelligentes. Le résultat obtenu est un prototype fonctionnel qui illustre la capacité de l'étudiant à concevoir et mettre en œuvre un projet complexe d'ingénierie logicielle orienté intelligence artificielle.",
    etiquettes: ["Commerce"],
    contacts: [
      { nom: "Kissima Tandia", email: "kissima.tandia@groupeisi.com", telephone: "+221 77 123 45 11" }
    ],
    cheminFichier: "/assets/documents/Memoire-Reco4i(1).pdf"
  },
  {
    id: 10,
    titre: "Développement d'une application de gestion de la facturation pour une ESN",
    auteur: "Sokhna Dieye",
    annee: "2023-2024",
    departement: "Génie Informatique",
    formation: "Licence Professionnelle Génie Logiciel",
    description: "Rapport de stage portant sur le développement d'une application de gestion de facturation.",
    resume: "Ce rapport de stage se concentre sur la conception et le développement d'une application de gestion de la facturation pour Atos Sénégal, une entreprise de services numériques (ESN) de premier plan. L'objectif principal est de créer une solution numérique qui optimise les processus de facturation, améliore l'efficacité opérationnelle, et renforce la transparence financière.\n\nLa conception et la réalisation de l'application utiliseront des technologies adaptées pour répondre aux besoins spécifiques de l'entreprise. Pour l'analyse et la conception du système, le langage de modélisation UML sera employé. En ce qui concerne le développement, le backend sera géré par Laravel, un framework PHP réputé pour sa robustesse. Pour le frontend, Angular, un framework JavaScript, sera utilisé afin de créer une interface utilisateur interactive et réactive. PostgreSQL sera choisi comme système de gestion de base de données.\n\nLe résultat attendu de ce projet est une application de gestion de la facturation qui répond aux exigences d'Atos Sénégal en permettant une rationalisation et une automatisation accrues des processus de facturation. L'application garantira une génération rapide et précise des factures, tout en améliorant la communication entre les départements technique et financier.",
    etiquettes: ["Finance"],
    contacts: [
      { nom: "Sokhna Dieye", email: "sokhna.dieye@groupeisi.com", telephone: "+221 77 123 45 12" }
    ],
    cheminFichier: "/assets/documents/MemoireSokhnaDieye.pdf"
  },
  {
    id: 11,
    titre: "Conception d'une application de diffusion des notifications pédagogiques pour l'ISI",
    auteur: "Moussa Abakar Hassane",
    annee: "2024-2025",
    departement: "Génie Informatique",
    formation: "Licence Professionnelle Génie Logiciel",
    description: "Projet portant sur une application de diffusion des notifications pédagogiques et administratives.",
    resume: "La diffusion des informations pédagogiques et administratives à l'ISI repose encore sur des moyens traditionnels tels que les affichages muraux, la communication orale ou l'utilisation d'outils non spécialisés comme WhatsApp. Cela pourrait entraîner des retards, des oublis et mauvaise réception des annonces, révélant une gestion peu structurée.\n\nPour répondre à ces limites, ce projet vise à concevoir et à réaliser une application centralisée de diffusion des notifications. Elle permet aux administrateurs, enseignants et assistants de créer et gérer des annonces ciblées, d'assurer le suivi des messages et d'informer les étudiants de manière précise. De plus, un module de chat interactif facilitera la communication et renforcera la réactivité des échanges.\n\nSur le plan technologique, le système repose sur une architecture à trois niveaux : une base de données centralisée, un backend en Laravel et un frontend décliné en deux interfaces. Angular est utilisé pour les administrateurs, enseignants et assistants, tandis que Flutter propose une application mobile intuitive pour les étudiants.",
    etiquettes: ["Éducation"],
    contacts: [
      { nom: "Moussa Abakar Hassane", email: "moussa.abakar@groupeisi.com", telephone: "+221 77 123 45 13" }
    ],
    cheminFichier: "/assets/documents/PFE-MoussaAbakar.pdf"
  },
  {
    id: 12,
    titre: "Etude et Réalisation d'une plateforme de gestion des mémoires : Cas de l'ISI",
    auteur: "Samba Gueye",
    annee: "2024-2025",
    departement: "Génie Informatique",
    formation: "Licence Professionnelle Génie Logiciel",
    description: "Projet portant sur une plateforme de gestion des mémoires pour l'ISI.",
    resume: "Ce projet vise à concevoir une plateforme de gestion des mémoires académiques, digitalisant le processus depuis le dépôt initial jusqu'à l'archivage final.",
    etiquettes: ["Éducation"],
    contacts: [
      { nom: "Samba Gueye", email: "samba.gueye@groupeisi.com", telephone: "+221 77 123 45 14" }
    ],
    cheminFichier: "/assets/documents/REPUBLIQUE DU SENEGAL.pdf"
  },
  {
    id: 13,
    titre: "Conception d'une application de gestion des notes sur tableau numérique interactif : Cas ISI",
    auteur: "Harsy Barry",
    annee: "2024-2025",
    departement: "Génie Informatique",
    formation: "Licence Professionnelle IAGE",
    description: "Rapport portant sur une application de gestion des notes sur tableau numérique interactif.",
    resume: "Ce projet de fin de cycle porte sur la création d'une application pour gérer les notes sur Tableau Numérique Interactif (TNI) à l'ISI Sénégal. L'objectif était de faciliter et sécuriser la gestion des notes pour les enseignants, les étudiants et le service administratif.\n\nPour réaliser ce projet, nous avons commencé par étudier les besoins des utilisateurs, puis modélisé le système avec UML. Les interfaces ont été conçues avec Figma pour être simples et claires, et l'application a été développée en Laravel avec une base de données MySQL locale. Elle permet de saisir, modifier et consulter les notes, ainsi que de gérer les utilisateurs et les matières.\n\nCe projet a permis de digitaliser une partie des processus pédagogiques, de réduire les risques d'erreurs et de poser les bases pour des améliorations futures.",
    etiquettes: ["Éducation"],
    contacts: [
      { nom: "Harsy Barry", email: "harsy.barry@groupeisi.com", telephone: "+221 77 123 45 15" }
    ],
    cheminFichier: "/assets/documents/Rapport de Harsy Barry.pdf"
  },
  {
    id: 14,
    titre: "Développement d'une plateforme Web SIG avec Laravel et PostGIS",
    auteur: "Cheikh Djidere Diao",
    annee: "2024-2025",
    departement: "Génie Informatique",
    formation: "Licence Professionnelle Géomatique",
    description: "Rapport portant sur une plateforme Web SIG pour la gestion des données géospatiales.",
    resume: "Ce travail s'inscrit dans le contexte de la gestion et de l'exploitation des données géospatiales, domaine en pleine expansion grâce aux avancées du web et des technologies SIG. Il porte sur la conception et le développement d'une plateforme web permettant la visualisation, l'analyse et la gestion de données géographiques en ligne.\n\nL'objectif est d'offrir aux utilisateurs une interface intuitive pour interagir avec des cartes, exploiter des outils d'analyse spatiale et administrer leurs propres couches de données. Le projet intègre une architecture trois-tiers avec un frontend en React, un backend en Laravel et une base de données PostgreSQL/PostGIS, assurant à la fois performance et extensibilité.\n\nLes fonctionnalités clés incluent la création de comptes, la gestion des couches, le dessin et l'édition de géométries, l'export de données au format GeoJSON, ainsi que des outils de mesure et d'analyse spatiale.",
    etiquettes: ["Géomatique"],
    contacts: [
      { nom: "Cheikh Djidere Diao", email: "cheikh.diao@groupeisi.com", telephone: "+221 77 123 45 16" }
    ],
    cheminFichier: "/assets/documents/Rapport final Cheikh Djidere DIAO.pdf"
  },
  {
    id: 15,
    titre: "Etude et Réalisation d'une plateforme de gestion des mémoires : Cas de l'ISI",
    auteur: "Samba Gueye",
    annee: "2024-2025",
    departement: "Génie Informatique",
    formation: "Licence Professionnelle Génie Logiciel",
    description: "Projet portant sur une plateforme de gestion des mémoires pour l'ISI.",
    resume: "Ce projet vise à concevoir une plateforme de gestion des mémoires académiques pour l'ISI.",
    etiquettes: ["Éducation"],
    contacts: [
      { nom: "Samba Gueye", email: "samba.gueye@groupeisi.com", telephone: "+221 77 123 45 14" }
    ],
    cheminFichier: "/assets/documents/Samba_Gueye (1).pdf"
  },
  {
    id: 16,
    titre: "Conception d'un site web de réservation de voyage pour une agence",
    auteur: "Soudaiss Elfayadine",
    annee: "2024-2025",
    departement: "Génie Informatique",
    formation: "Licence Professionnelle Génie Logiciel",
    description: "Mémoire portant sur un site web de réservation de voyage.",
    resume: "Ce projet vise à concevoir un site web de réservation de voyage permettant la recherche de destinations, la réservation en ligne et les paiements sécurisés.",
    etiquettes: ["Transport"],
    contacts: [
      { nom: "Soudaiss Elfayadine", email: "soudaiss.elfayadine@groupeisi.com", telephone: "+221 77 123 45 17" }
    ],
    cheminFichier: "/assets/documents/Soudaiss-ELFAYADINE-Memoire-L3GL  (Récupération automatique).pdf"
  },
  {
    id: 17,
    titre: "Etude et Réalisation d'une Application de Gestion D'Immobilisation de ISI",
    auteur: "N'diaye Amy",
    annee: "2023-2024",
    departement: "Génie Informatique",
    formation: "Licence Professionnelle Génie Logiciel",
    description: "Rapport de stage portant sur une application de gestion d'immobilisation pour l'ISI.",
    resume: "La logistique au sein du Groupe ISI connaît une évolution rapide, particulièrement en ce qui concerne la gestion des flux de biens et de services dans un environnement en constante mutation. Chaque année, ISI doit faire face à une hausse des volumes à gérer, à une demande de plus en plus complexe, ainsi qu'à des attentes toujours plus élevées en termes de rapidité et d'efficacité de ses services, en raison de ses multiples campus.\n\nLe présent projet de mémoire vise à mettre en place une solution innovante pour améliorer les opérations. L'objectif principal est de concevoir et de déployer une application de gestion de la logistique qui simplifiera les processus de gestion des stocks, le suivi des expéditions, la coordination des fournisseurs, la traçabilité des produits, la gestion des retours, la prévision de la demande, ainsi que des outils d'analyse et de reporting pour évaluer les performances et identifier les opportunités d'amélioration.",
    etiquettes: ["Logistique"],
    contacts: [
      { nom: "N'diaye Amy", email: "amy.ndiaye@groupeisi.com", telephone: "+221 77 123 45 18" }
    ],
    cheminFichier: "/assets/documents/memoire_licence.pdf"
  },
  {
    id: 18,
    titre: "Conception d'une Application de Gestion Scolaire : Cas de l'ECNM",
    auteur: "Anoir Ibniyamine",
    annee: "2023-2024",
    departement: "Génie Informatique",
    formation: "Licence Professionnelle Génie Logiciel",
    description: "Rapport de stage portant sur une application de gestion scolaire.",
    resume: "Ce projet vise à concevoir et développer une application informatique dédiée à la gestion complète des activités au sein de l'École Communautaire de Nioumamilima Mboinkou. L'objectif principal est d'automatiser les processus administratifs, de centraliser les informations et de faciliter la communication entre les différentes parties prenantes de la communauté scolaire.\n\nEn incluant des fonctionnalités telles que la gestion des inscriptions des étudiants, la gestion des notes et des résultats, la gestion des absences et des retards, ainsi que la gestion des emplois du temps, cette application bureau offrira une solution intégrée pour accéder à toutes les informations pertinentes.\n\nCe projet revêt une importance cruciale pour l'École Communautaire de Nioumamilima Mboinkou, car il permettra d'optimiser ses opérations, de moderniser ses pratiques administratives et de fournir une expérience plus fluide et efficace à tous les membres de la communauté scolaire.",
    etiquettes: ["Éducation"],
    contacts: [
      { nom: "Anoir Ibniyamine", email: "anoir.ibniyamine@groupeisi.com", telephone: "+221 77 123 45 19" }
    ],
    cheminFichier: "/assets/documents/my_memory_final.pdf"
  },
  {
    id: 19,
    titre: "Développement d'une application CRM pour les entreprises immobilières",
    auteur: "Ndeye Ngoundje Mbaye",
    annee: "2023-2024",
    departement: "Génie Informatique",
    formation: "Licence Professionnelle Génie Logiciel",
    description: "Rapport de stage portant sur une application CRM pour l'immobilier.",
    resume: "Cette mémoire porte sur le développement d'une application de gestion de la relation client pour les entreprises de services immobiliers. Le but est de concevoir une solution qui facilite la gestion des interactions avec les clients, améliore la gestion des transactions, et optimise la qualité du service dans le secteur immobilier.\n\nEn réponse à ces besoins, une conception détaillée de l'application a été élaborée. La conception et le développement de l'application utilisent des technologies adaptées : le langage UML pour la modélisation du système, PHP avec le framework Laravel pour le backend, Angular pour le frontend, et PostgreSQL comme système de gestion de base de données.\n\nL'application résultante est conçue pour répondre aux exigences spécifiques des entreprises immobilières. Elle vise à améliorer l'efficacité opérationnelle en simplifiant la gestion des relations client, en automatisant les processus de communication et de suivi, et en offrant une interface utilisateur intuitive.",
    etiquettes: ["Immobilier"],
    contacts: [
      { nom: "Ndeye Ngoundje Mbaye", email: "ndeyengoundje.mbaye@groupeisi.com", telephone: "+221 77 123 45 20" }
    ],
    cheminFichier: "/assets/documents/ndeye ngoundje og (4).pdf"
  },
  {
    id: 20,
    titre: "Etude et réalisation d'une application de déclaration et suivi de pièces perdues",
    auteur: "Baye Bara Diop",
    annee: "2023-2024",
    departement: "Génie Informatique",
    formation: "Licence Professionnelle Génie Logiciel",
    description: "Rapport de stage portant sur une application de déclaration et suivi de pièces perdues.",
    resume: "La gestion des pièces perdues est un défi majeur dans de nombreuses communautés, notamment dans les environnements urbains où le nombre croissant de citoyens et de visiteurs complique la gestion des pièces égarés. Les systèmes actuels, souvent archaïques et manuels, entraînent une perte de temps pour les usagers ainsi que pour les agents chargés de gérer ces déclarations.\n\nConscients de ces défis, nous proposons une plateforme numérique dédiée à la déclaration et au suivi des pièces perdues. Cette application permettra aux utilisateurs de déclarer la perte de leurs pièces au sein des structures de déclaration et de suivre l'évolution de leur demande via l'application. Elle facilitera également le travail des agents étatiques et des forces de l'ordre en leur fournissant une base de données centralisée ainsi que des outils de recherche performants pour la gestion des pièces retrouvées.\n\nEn résumé, notre projet vise à développer une application de gestion des pièces perdues, avec des fonctionnalités telles que la déclaration des pièces perdus ou retrouvés, la gestion des utilisateurs, le suivi des pièces, et la recherche des pièces récupérés.",
    etiquettes: ["Administration publique"],
    contacts: [
      { nom: "Baye Bara Diop", email: "bayebara.diop@groupeisi.com", telephone: "+221 77 123 45 21" }
    ],
    cheminFichier: "/assets/documents/rapport_de_stage _baye_bara_diop.pdf"
  }
];
