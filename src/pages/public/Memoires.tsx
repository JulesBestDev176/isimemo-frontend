import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

// Hook personnalisé pour l'animation de compteur
const useCounter = (end: number, duration: number = 2, delay: number = 0) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const inView = useInView(nodeRef, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!inView) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      // Attendre le délai avant de commencer
      if (elapsed < delay * 1000) {
        animationFrame = requestAnimationFrame(updateCount);
        return;
      }

      const progress = Math.min((elapsed - delay * 1000) / (duration * 1000), 1);
      // Fonction d'easing pour ralentir vers la fin
      const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setCount(Math.floor(easedProgress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, delay, inView]);

  return { count, ref: nodeRef };
};
import CarteMemoire from "../../components/CarteMemoire";
import Footer from "../../components/Footer";
import AffichageMemoire from "../../components/AffichageMemoire";

// Interface pour les mémoires publics
export interface Memoire {
  id: number;
  titre: string;
  auteur: string;
  annee: number;
  mention: string;
  departement: string;
  description: string;
  imageCouverture: string;
  etiquettes: string[];
  contact: {
    email: string;
    telephone: string;
    linkedin: string;
  };
  superviseur: string;
  contenuComplet: string;
  documents: { nom: string; lien: string }[];
}

// Données de démonstration pour les memoires (réduit à 2 comme demandé)
const memoiresDémo: Memoire[] = [
  {
    id: 1,
    titre: "Conception et mise en œuvre d'un système de détection d'intrusions basé sur l'apprentissage automatique",
    auteur: "Mohamed Diallo",
    annee: 2022,
    mention: "Très Bien",
    departement: "Réseaux et Systèmes",
    description: "Ce memoire présente une nouvelle approche de détection d'intrusions dans les réseaux informatiques en utilisant des algorithmes d'apprentissage automatique. L'étude propose un modèle hybride combinant les réseaux de neurones et les forêts aléatoires pour améliorer la précision de détection.",
    imageCouverture: "./assets/images/student.png",
    etiquettes: ["Cybersécurité", "Machine Learning", "Détection d'intrusions", "Réseaux"],
    contact: {
      email: "mohamed.diallo@example.com",
      telephone: "+221 77 123 45 67",
      linkedin: "linkedin.com/in/mohamed-diallo"
    },
    superviseur: "Dr. Fatou Ndiaye",
    contenuComplet: "Le contenu complet du memoire serait disponible ici, avec introduction, chapitres, etc.",
    documents: [
      { nom: "Présentation", lien: "./assets/documents/doc.pdf" },
      { nom: "Source code", lien: "./assets/documents/doc.pdf" }
    ]
  },
  {
    id: 2,
    titre: "Développement d'une application mobile de télémédecine pour zones rurales",
    auteur: "Aminata Ndiaye",
    annee: 2023,
    mention: "Excellent",
    departement: "Génie Informatique",
    description: "Cette étude propose une solution de télémédecine adaptée aux contraintes des zones rurales africaines. L'application développée permet aux patients d'accéder à des consultations médicales à distance, même avec une connectivité limitée.",
    imageCouverture: "./assets/images/student.png",
    etiquettes: ["Santé", "Application mobile", "Flutter", "Télémédecine"],
    contact: {
      email: "aminata.ndiaye@example.com",
      telephone: "+221 76 987 65 43",
      linkedin: "linkedin.com/in/aminata-ndiaye"
    },
    superviseur: "Prof. Amadou Sow",
    contenuComplet: "Le contenu complet du memoire serait disponible ici, incluant méthodologie, résultats, et discussion.",
    documents: [
      { nom: "Présentation", lien: "./assets/documents/doc.pdf" },
      { nom: "Démonstration", lien: "./assets/documents/doc.pdf" }
    ]
  },
  {
    id: 3,
    titre: "Conception et mise en œuvre d'un système de détection d'intrusions basé sur l'apprentissage automatique",
    auteur: "Mohamed Diallo",
    annee: 2022,
    mention: "Très Bien",
    departement: "Réseaux et Systèmes",
    description: "Ce memoire présente une nouvelle approche de détection d'intrusions dans les réseaux informatiques en utilisant des algorithmes d'apprentissage automatique. L'étude propose un modèle hybride combinant les réseaux de neurones et les forêts aléatoires pour améliorer la précision de détection.",
    imageCouverture: "./assets/images/student.png",
    etiquettes: ["Cybersécurité", "Machine Learning", "Détection d'intrusions", "Réseaux"],
    contact: {
      email: "mohamed.diallo@example.com",
      telephone: "+221 77 123 45 67",
      linkedin: "linkedin.com/in/mohamed-diallo"
    },
    superviseur: "Dr. Fatou Ndiaye",
    contenuComplet: "Le contenu complet du memoire serait disponible ici, avec introduction, chapitres, etc.",
    documents: [
      { nom: "Présentation", lien: "./assets/documents/doc.pdf" },
      { nom: "Source code", lien: "./assets/documents/doc.pdf" }
    ]
  },
  {
    id: 4,
    titre: "Développement d'une application mobile de télémédecine pour zones rurales",
    auteur: "Aminata Ndiaye",
    annee: 2023,
    mention: "Excellent",
    departement: "Génie Informatique",
    description: "Cette étude propose une solution de télémédecine adaptée aux contraintes des zones rurales africaines. L'application développée permet aux patients d'accéder à des consultations médicales à distance, même avec une connectivité limitée.",
    imageCouverture: "./assets/images/student.png",
    etiquettes: ["Santé", "Application mobile", "Flutter", "Télémédecine"],
    contact: {
      email: "aminata.ndiaye@example.com",
      telephone: "+221 76 987 65 43",
      linkedin: "linkedin.com/in/aminata-ndiaye"
    },
    superviseur: "Prof. Amadou Sow",
    contenuComplet: "Le contenu complet du memoire serait disponible ici, incluant méthodologie, résultats, et discussion.",
    documents: [
      { nom: "Présentation", lien: "./assets/documents/doc.pdf" },
      { nom: "Démonstration", lien: "./assets/documents/doc.pdf" }
    ]
  },
  {
    id: 5,
    titre: "Conception et mise en œuvre d'un système de détection d'intrusions basé sur l'apprentissage automatique",
    auteur: "Mohamed Diallo",
    annee: 2022,
    mention: "Très Bien",
    departement: "Réseaux et Systèmes",
    description: "Ce memoire présente une nouvelle approche de détection d'intrusions dans les réseaux informatiques en utilisant des algorithmes d'apprentissage automatique. L'étude propose un modèle hybride combinant les réseaux de neurones et les forêts aléatoires pour améliorer la précision de détection.",
    imageCouverture: "./assets/images/student.png",
    etiquettes: ["Cybersécurité", "Machine Learning", "Détection d'intrusions", "Réseaux"],
    contact: {
      email: "mohamed.diallo@example.com",
      telephone: "+221 77 123 45 67",
      linkedin: "linkedin.com/in/mohamed-diallo"
    },
    superviseur: "Dr. Fatou Ndiaye",
    contenuComplet: "Le contenu complet du memoire serait disponible ici, avec introduction, chapitres, etc.",
    documents: [
      { nom: "Présentation", lien: "./assets/documents/doc.pdf" },
      { nom: "Source code", lien: "./assets/documents/doc.pdf" }
    ]
  },
  {
    id: 6,
    titre: "Développement d'une application mobile de télémédecine pour zones rurales",
    auteur: "Aminata Ndiaye",
    annee: 2023,
    mention: "Excellent",
    departement: "Génie Informatique",
    description: "Cette étude propose une solution de télémédecine adaptée aux contraintes des zones rurales africaines. L'application développée permet aux patients d'accéder à des consultations médicales à distance, même avec une connectivité limitée.",
    imageCouverture: "./assets/images/student.png",
    etiquettes: ["Santé", "Application mobile", "Flutter", "Télémédecine"],
    contact: {
      email: "aminata.ndiaye@example.com",
      telephone: "+221 76 987 65 43",
      linkedin: "linkedin.com/in/aminata-ndiaye"
    },
    superviseur: "Prof. Amadou Sow",
    contenuComplet: "Le contenu complet du memoire serait disponible ici, incluant méthodologie, résultats, et discussion.",
    documents: [
      { nom: "Présentation", lien: "./assets/documents/doc.pdf" },
      { nom: "Démonstration", lien: "./assets/documents/doc.pdf" }
    ]
  },
  {
    id: 7,
    titre: "Conception et mise en œuvre d'un système de détection d'intrusions basé sur l'apprentissage automatique",
    auteur: "Mohamed Diallo",
    annee: 2022,
    mention: "Très Bien",
    departement: "Réseaux et Systèmes",
    description: "Ce memoire présente une nouvelle approche de détection d'intrusions dans les réseaux informatiques en utilisant des algorithmes d'apprentissage automatique. L'étude propose un modèle hybride combinant les réseaux de neurones et les forêts aléatoires pour améliorer la précision de détection.",
    imageCouverture: "./assets/images/student.png",
    etiquettes: ["Cybersécurité", "Machine Learning", "Détection d'intrusions", "Réseaux"],
    contact: {
      email: "mohamed.diallo@example.com",
      telephone: "+221 77 123 45 67",
      linkedin: "linkedin.com/in/mohamed-diallo"
    },
    superviseur: "Dr. Fatou Ndiaye",
    contenuComplet: "Le contenu complet du memoire serait disponible ici, avec introduction, chapitres, etc.",
    documents: [
      { nom: "Présentation", lien: "./assets/documents/doc.pdf" },
      { nom: "Source code", lien: "./assets/documents/doc.pdf" }
    ]
  },
  {
    id: 8,
    titre: "Développement d'une application mobile de télémédecine pour zones rurales",
    auteur: "Aminata Ndiaye",
    annee: 2023,
    mention: "Excellent",
    departement: "Génie Informatique",
    description: "Cette étude propose une solution de télémédecine adaptée aux contraintes des zones rurales africaines. L'application développée permet aux patients d'accéder à des consultations médicales à distance, même avec une connectivité limitée.",
    imageCouverture: "./assets/images/student.png",
    etiquettes: ["Santé", "Application mobile", "Flutter", "Télémédecine"],
    contact: {
      email: "aminata.ndiaye@example.com",
      telephone: "+221 76 987 65 43",
      linkedin: "linkedin.com/in/aminata-ndiaye"
    },
    superviseur: "Prof. Amadou Sow",
    contenuComplet: "Le contenu complet du memoire serait disponible ici, incluant méthodologie, résultats, et discussion.",
    documents: [
      { nom: "Présentation", lien: "./assets/documents/doc.pdf" },
      { nom: "Démonstration", lien: "./assets/documents/doc.pdf" }
    ]
  }
];

const Memoires = () => {
  const [memoires, setmemoires] = useState(memoiresDémo);
  const [memoiresFiltres, setmemoiresFiltres] = useState(memoiresDémo);
  const [memoireSélectionné, setmemoireSélectionné] = useState<Memoire | null>(null);
  const [vueDétaillée, setVueDétaillée] = useState(false);

  // Pagination
  const memoiresParPage = 5;
  const [pageCourante, setPageCourante] = useState(1);
  const indexDerniermemoire = pageCourante * memoiresParPage;
  const indexPremiermemoire = indexDerniermemoire - memoiresParPage;
  const memoiresCourants = memoiresFiltres.slice(indexPremiermemoire, indexDerniermemoire);
  const nombreTotalPages = Math.ceil(memoiresFiltres.length / memoiresParPage);

  // Filtres améliorés
  const [requêteRecherche, setRequêteRecherche] = useState("");
  const [départementSélectionné, setDépartementSélectionné] = useState("");
  const [annéeSélectionnée, setAnnéeSélectionnée] = useState("");
  const [mentionSélectionnée, setMentionSélectionnée] = useState("");
  const [étiquetteSélectionnée, setÉtiquetteSélectionnée] = useState("");

  // Données pour les filtres
  const départements = [...new Set(memoires.map(m => m.departement))];
  const années = [...new Set(memoires.map(m => m.annee))].sort((a, b) => b - a);
  const mentions = [...new Set(memoires.map(m => m.mention))];

  // Récupérer toutes les etiquettes uniques
  const toutesÉtiquettes = [...new Set(memoires.flatMap(m => m.etiquettes))];

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "memoires - ISIMemo";
  }, []);

  // Effet pour la filtration
  useEffect(() => {
    let résultat = [...memoires];

    // Filtrer par recherche (titre, auteur, description, etiquettes)
    if (requêteRecherche) {
      const requête = requêteRecherche.toLowerCase();
      résultat = résultat.filter(memoire =>
        memoire.titre.toLowerCase().includes(requête) ||
        memoire.auteur.toLowerCase().includes(requête) ||
        memoire.description.toLowerCase().includes(requête) ||
        memoire.etiquettes.some(étiquette => étiquette.toLowerCase().includes(requête))
      );
    }

    // Filtrer par département
    if (départementSélectionné) {
      résultat = résultat.filter(memoire =>
        memoire.departement === départementSélectionné
      );
    }

    // Filtrer par année
    if (annéeSélectionnée) {
      résultat = résultat.filter(memoire =>
        memoire.annee.toString() === annéeSélectionnée
      );
    }

    // Filtrer par mention
    if (mentionSélectionnée) {
      résultat = résultat.filter(memoire => memoire.mention === mentionSélectionnée);
    }

    // Filtrer par étiquette
    if (étiquetteSélectionnée) {
      résultat = résultat.filter(memoire =>
        memoire.etiquettes.includes(étiquetteSélectionnée)
      );
    }

    setmemoiresFiltres(résultat);
    // Réinitialiser à la première page lors d'un changement de filtre
    setPageCourante(1);
  }, [requêteRecherche, départementSélectionné, annéeSélectionnée, mentionSélectionnée, étiquetteSélectionnée, memoires]);

  const gérerClicmemoire = (memoire: Memoire) => {
    setmemoireSélectionné(memoire);
    setVueDétaillée(true);
    window.scrollTo(0, 0);
  };

  const fermerVueDétaillée = () => {
    setVueDétaillée(false);
    setmemoireSélectionné(null);
  };

  const réinitialiserFiltres = () => {
    setRequêteRecherche("");
    setDépartementSélectionné("");
    setAnnéeSélectionnée("");
    setMentionSélectionnée("");
    setÉtiquetteSélectionnée("");
  };

  const changerPage = (numéroPage: number) => {
    setPageCourante(numéroPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pagePrécédente = () => {
    if (pageCourante > 1) {
      setPageCourante(pageCourante - 1);
      window.scrollTo(0, 0);
    }
  };

  const pageSuivante = () => {
    if (pageCourante < nombreTotalPages) {
      setPageCourante(pageCourante + 1);
      window.scrollTo(0, 0);
    }
  };

  // Composant de pagination
  const Pagination = () => {
    return (
      <div className="flex justify-center items-center space-x-2 mt-8">
        <button
          onClick={pagePrécédente}
          disabled={pageCourante === 1}
          className={`flex items-center justify-center w-10 h-10 rounded-full ${pageCourante === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-primary-50 text-primary hover:bg-primary hover:text-white transition-colors'
            }`}
        >
          <span className="material-icons text-sm">chevron_left</span>
        </button>

        {[...Array(nombreTotalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => changerPage(index + 1)}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${pageCourante === index + 1
              ? 'bg-primary text-white font-medium'
              : 'bg-gray-100 text-navy-700 hover:bg-primary-50'
              }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={pageSuivante}
          disabled={pageCourante === nombreTotalPages}
          className={`flex items-center justify-center w-10 h-10 rounded-full ${pageCourante === nombreTotalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-primary-50 text-primary hover:bg-primary hover:text-white transition-colors'
            }`}
        >
          <span className="material-icons text-sm">chevron_right</span>
        </button>
      </div>
    );
  };

  return (
    <div>
      <div className="min-h-screen pb-16">
        {vueDétaillée && memoireSélectionné ? (
          <AffichageMemoire
            memoire={memoireSélectionné}
            onRetour={fermerVueDétaillée}
          />
        ) : (
          <>
            {/* Hero section pleine hauteur (100vh) */}
            <motion.div
              className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-blue-600 overflow-hidden h-screen flex flex-col justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {/* Cercles décoratifs animés - repositionnés pour mieux s'adapter à la pleine hauteur */}
              <motion.div
                className="absolute top-1/3 right-10 w-80 h-80 rounded-full bg-white opacity-10"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              <motion.div
                className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-blue-300 opacity-10"
                animate={{
                  scale: [1.2, 1, 1.2],
                  x: [0, 30, 0]
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-yellow-200 opacity-20"
                animate={{
                  y: [0, -50, 0],
                  x: [0, 30, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute bottom-1/4 right-1/4 w-24 h-24 rounded-full bg-primary-300 opacity-20"
                animate={{
                  y: [0, 40, 0],
                  x: [0, -20, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Contenu principal - centré verticalement */}
              <div className="container-fluid relative z-10 flex-grow flex flex-col justify-center items-center">
                <div className="max-w-4xl mx-auto text-center">
                  <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-medium mb-4">
                      <span className="material-icons text-yellow-200 text-xs mr-1" style={{ verticalAlign: 'middle' }}>
                        auto_awesome
                      </span>
                      Enrichissez votre savoir académique
                    </span>
                  </motion.div>

                  <motion.h1
                    className="text-4xl md:text-5xl xl:text-6xl font-bold mb-6 text-white"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                  >
                    Bibliothèque de <motion.span
                      className="relative inline-block"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      mémoires
                      <motion.div
                        className="absolute bottom-0 left-0 w-full h-1 bg-yellow-300"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1, delay: 0.8 }}
                      />
                    </motion.span>
                  </motion.h1>

                  <motion.p
                    className="text-lg md:text-xl text-blue-50 mb-10 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                  >
                    Découvrez l'excellence académique à travers notre collection de travaux de recherche innovants réalisés par nos étudiants.
                  </motion.p>

                  <motion.div
                    className="bg-white/10 backdrop-blur-lg p-1.5 rounded-2xl shadow-2xl max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="bg-white rounded-xl flex items-center overflow-hidden">
                      <div className="bg-primary-50 p-4">
                        <span className="material-icons text-primary">search</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Rechercher par titre, auteur, mot-clé..."
                        className="w-full py-4 px-5 outline-none bg-transparent text-navy-700"
                        value={requêteRecherche}
                        onChange={(e) => setRequêteRecherche(e.target.value)}
                      />
                      <button
                        className="bg-primary hover:bg-primary-700 transition-colors text-white font-medium py-4 px-6 mr-1 rounded-lg"
                        onClick={() => {
                          // Ajouter ici une logique pour lancer la recherche si nécessaire
                          // Sinon le onChange de l'input va déjà filtrer les résultats
                        }}
                      >
                        Rechercher
                      </button>
                    </div>
                  </motion.div>

                  {/* Statistiques rapides */}
                  <motion.div
                    className="flex justify-center gap-8 mt-10 text-white"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.7 }}
                  >
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-3xl">{memoiresFiltres.length}</span>
                      <span className="text-blue-100 text-sm">Mémoires disponibles</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-3xl">{départements.length}</span>
                      <span className="text-blue-100 text-sm">Départements</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-3xl">{toutesÉtiquettes.length}</span>
                      <span className="text-blue-100 text-sm">Thématiques</span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Bouton de défilement vers le bas */}
              <motion.div
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{
                  opacity: { delay: 1.5, duration: 1 },
                  y: { delay: 1.5, duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                onClick={() => {
                  // Faire défiler vers la section suivante (conteneur de filtrage)
                  window.scrollTo({
                    top: window.innerHeight,
                    behavior: 'smooth'
                  });
                }}
              >
                <div className="flex flex-col items-center">
                  <span className="text-white text-sm mb-2">Explorer les mémoires</span>
                  <span className="material-icons text-white">expand_more</span>
                </div>
              </motion.div>

              {/* Vagues décoratives au bas du hero */}
              <div className="absolute bottom-0 left-0 w-full overflow-hidden">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 110" className="fill-gray-50">
                  <path d="M0,96L80,85.3C160,75,320,53,480,58.7C640,64,800,96,960,101.3C1120,107,1280,85,1360,74.7L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
                </svg>
              </div>
            </motion.div>

            <div className="container-fluid py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Filtres */}
                <motion.div
                  className="md:col-span-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="bg-white rounded-xl shadow-md p-5 sticky top-24 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-navy flex items-center">
                        <span className="material-icons text-primary mr-2 text-xl">filter_list</span>
                        Filtres
                      </h2>
                      <button
                        onClick={réinitialiserFiltres}
                        className="text-primary hover:text-primary-700 text-sm flex items-center gap-1 transition-colors rounded-full bg-primary-50 px-2 py-1"
                      >
                        <span className="material-icons text-sm">refresh</span>
                        Réinitialiser
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Nombre de résultats et pagination en haut pour une meilleure visibilité */}
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-navy-700 font-medium">
                          <span className="text-primary font-bold">{memoiresFiltres.length}</span> mémoire{memoiresFiltres.length !== 1 ? 's' : ''} trouvé{memoiresFiltres.length !== 1 ? 's' : ''}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Page {pageCourante} sur {nombreTotalPages || 1}
                        </p>
                      </div>

                      {/* Filtre par département avec icône */}
                      <div>
                        <label htmlFor="département" className="block text-navy-700 font-medium text-sm mb-1 flex items-center">
                          <span className="material-icons text-gray-400 mr-1 text-sm">business</span>
                          Département
                        </label>
                        <div className="relative">
                          <select
                            id="département"
                            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm appearance-none bg-white"
                            value={départementSélectionné}
                            onChange={(e) => setDépartementSélectionné(e.target.value)}
                          >
                            <option value="">Tous les départements</option>
                            {départements.map((dept, index) => (
                              <option key={index} value={dept}>{dept}</option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                            <span className="material-icons text-sm">expand_more</span>
                          </div>
                        </div>
                      </div>

                      {/* Filtre par année avec icône */}
                      <div>
                        <label htmlFor="année" className="block text-navy-700 font-medium text-sm mb-1 flex items-center">
                          <span className="material-icons text-gray-400 mr-1 text-sm">calendar_today</span>
                          Année
                        </label>
                        <div className="relative">
                          <select
                            id="année"
                            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm appearance-none bg-white"
                            value={annéeSélectionnée}
                            onChange={(e) => setAnnéeSélectionnée(e.target.value)}
                          >
                            <option value="">Toutes les années</option>
                            {années.map((année, index) => (
                              <option key={index} value={année}>{année}</option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                            <span className="material-icons text-sm">expand_more</span>
                          </div>
                        </div>
                      </div>

                      {/* Filtre par mention avec icône */}
                      <div>
                        <label htmlFor="mention" className="block text-navy-700 font-medium text-sm mb-1 flex items-center">
                          <span className="material-icons text-gray-400 mr-1 text-sm">grade</span>
                          Mention
                        </label>
                        <div className="relative">
                          <select
                            id="mention"
                            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm appearance-none bg-white"
                            value={mentionSélectionnée}
                            onChange={(e) => setMentionSélectionnée(e.target.value)}
                          >
                            <option value="">Toutes les mentions</option>
                            {mentions.map((mention, index) => (
                              <option key={index} value={mention}>{mention}</option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                            <span className="material-icons text-sm">expand_more</span>
                          </div>
                        </div>
                      </div>

                      {/* Filtre par étiquette avec radio buttons pour les plus populaires */}
                      <div>
                        <label className="block text-navy-700 font-medium text-sm mb-2 flex items-center">
                          <span className="material-icons text-gray-400 mr-1 text-sm">sell</span>
                          Thématiques
                        </label>

                        {/* Option de sélecteur pour toutes les étiquettes */}
                        <div className="relative mb-2">
                          <select
                            id="étiquette"
                            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm appearance-none bg-white"
                            value={étiquetteSélectionnée}
                            onChange={(e) => setÉtiquetteSélectionnée(e.target.value)}
                          >
                            <option value="">Toutes les thématiques</option>
                            {toutesÉtiquettes.map((étiquette, index) => (
                              <option key={index} value={étiquette}>{étiquette}</option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                            <span className="material-icons text-sm">expand_more</span>
                          </div>
                        </div>

                        {/* Affichage des étiquettes populaires sous forme de puces cliquables */}
                        <div className="mt-2 flex flex-wrap gap-1">
                          {toutesÉtiquettes.slice(0, 4).map((tag, index) => (
                            <button
                              key={index}
                              className={`text-xs py-1 px-2 rounded-full transition-colors ${étiquetteSélectionnée === tag
                                  ? 'bg-primary text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-700'
                                }`}
                              onClick={() => setÉtiquetteSélectionnée(étiquetteSélectionnée === tag ? '' : tag)}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Section filtres actifs */}
                      {(départementSélectionné || annéeSélectionnée || mentionSélectionnée || étiquetteSélectionnée) && (
                        <div className="bg-gray-50 rounded-lg p-3 mt-4">
                          <p className="text-xs text-navy-700 font-medium mb-2">Filtres actifs:</p>
                          <div className="flex flex-wrap gap-1">
                            {départementSélectionné && (
                              <div className="bg-primary-50 text-primary-700 text-xs py-1 px-2 rounded-full flex items-center">
                                {départementSélectionné}
                                <button
                                  className="ml-1 text-primary-700 hover:text-primary"
                                  onClick={() => setDépartementSélectionné('')}
                                >
                                  <span className="material-icons text-xs">close</span>
                                </button>
                              </div>
                            )}
                            {annéeSélectionnée && (
                              <div className="bg-primary-50 text-primary-700 text-xs py-1 px-2 rounded-full flex items-center">
                                {annéeSélectionnée}
                                <button
                                  className="ml-1 text-primary-700 hover:text-primary"
                                  onClick={() => setAnnéeSélectionnée('')}
                                >
                                  <span className="material-icons text-xs">close</span>
                                </button>
                              </div>
                            )}
                            {mentionSélectionnée && (
                              <div className="bg-primary-50 text-primary-700 text-xs py-1 px-2 rounded-full flex items-center">
                                {mentionSélectionnée}
                                <button
                                  className="ml-1 text-primary-700 hover:text-primary"
                                  onClick={() => setMentionSélectionnée('')}
                                >
                                  <span className="material-icons text-xs">close</span>
                                </button>
                              </div>
                            )}
                            {étiquetteSélectionnée && (
                              <div className="bg-primary-50 text-primary-700 text-xs py-1 px-2 rounded-full flex items-center">
                                {étiquetteSélectionnée}
                                <button
                                  className="ml-1 text-primary-700 hover:text-primary"
                                  onClick={() => setÉtiquetteSélectionnée('')}
                                >
                                  <span className="material-icons text-xs">close</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Bouton de validation */}
                      <button
                        className="w-full mt-3 bg-primary hover:bg-primary-700 text-white rounded-lg py-2 px-4 text-sm font-medium transition-colors flex items-center justify-center"
                        onClick={() => {
                          // Éventuellement mettre à jour les filtres si besoin
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        <span className="material-icons mr-1 text-sm">search</span>
                        Afficher les résultats
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Liste des memoires avec pagination */}
                <div className="md:col-span-3 space-y-6">
                  <AnimatePresence>
                    {memoiresCourants.length > 0 ? (
                      memoiresCourants.map(memoire => (
                        <CarteMemoire
                          key={memoire.id}
                          memoire={memoire}
                          onClick={gérerClicmemoire}
                        />
                      ))
                    ) : (
                      <motion.div
                        className="bg-white rounded-xl shadow-lg p-8 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                          <span className="material-icons text-gray-400 text-2xl">search_off</span>
                        </div>
                        <h3 className="text-xl font-bold text-navy mb-2">Aucun résultat</h3>
                        <p className="text-navy-700">
                          Aucun memoire ne correspond à vos critères de recherche.
                        </p>
                        <button
                          onClick={réinitialiserFiltres}
                          className="mt-4 text-primary hover:text-primary-700 font-medium flex items-center gap-2 mx-auto transition-colors"
                        >
                          <span className="material-icons">refresh</span>
                          Réinitialiser les filtres
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Composant de pagination */}
                  {memoiresFiltres.length > memoiresParPage && <Pagination />}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Memoires;