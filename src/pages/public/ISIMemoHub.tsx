import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const ISIMemoHub: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('accueil');

  useEffect(() => {
    // Gérer l'URL hash pour la navigation
    const hash = window.location.hash.substring(1);
    if (hash && ['accueil', 'soumission', 'consultation', 'analyse-ia', 'detection-plagiat', 'assistance'].includes(hash)) {
      setActiveSection(hash);
    }

    // Écouter les changements de hash
    const handleHashChange = () => {
      const newHash = window.location.hash.substring(1);
      if (newHash && ['accueil', 'soumission', 'consultation', 'analyse-ia', 'detection-plagiat', 'assistance'].includes(newHash)) {
        setActiveSection(newHash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const sections = [
    { id: 'accueil', label: 'Accueil', icon: 'home' },
    { id: 'soumission', label: 'Soumission', icon: 'upload_file' },
    { id: 'consultation', label: 'Consultation Intelligente', icon: 'search' },
    { id: 'analyse-ia', label: 'Analyse IA', icon: 'psychology' },
    { id: 'detection-plagiat', label: 'Détection Plagiat', icon: 'security' },
    { id: 'assistance', label: 'Assistance 24/7', icon: 'support_agent' }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'accueil':
        return <AccueilSection />;
      case 'soumission':
        return <SoumissionSection />;
      case 'consultation':
        return <ConsultationSection />;
      case 'analyse-ia':
        return <AnalyseIASection />;
      case 'detection-plagiat':
        return <DetectionPlagiatSection />;
      case 'assistance':
        return <AssistanceSection />;
      default:
        return <AccueilSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary-700 text-white py-16">
        <div className="container-fluid">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-4">ISIMemo Hub</h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Plateforme intelligente de gestion des mémoires académiques avec IA intégrée
            </p>
          </motion.div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm sticky top-16 z-40">
        <div className="container-fluid">
          <div className="flex overflow-x-auto">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  window.location.hash = section.id;
                }}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap ${
                  activeSection === section.id
                    ? 'border-primary text-primary font-medium'
                    : 'border-transparent text-gray-600 hover:text-primary hover:border-gray-300'
                }`}
              >
                <span className="material-icons text-xl">{section.icon}</span>
                <span>{section.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container-fluid py-12">
        {renderSection()}
      </div>

      <Footer />
    </div>
  );
};

// Section Accueil
const AccueilSection: React.FC = () => {
  const features = [
    {
      icon: "upload_file",
      title: "Soumission Simplifiée",
      description: "Déposez vos mémoires en quelques clics avec validation automatique des formats",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: "search",
      title: "Consultation Intelligente",
      description: "Explorez la bibliothèque avec une recherche sémantique avancée alimentée par l'IA",
      color: "from-green-500 to-green-600"
    },
    {
      icon: "psychology",
      title: "Analyse IA Avancée",
      description: "Analyses de pertinence, recommandations d'encadreurs et validation automatique",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: "security",
      title: "Détection de Plagiat",
      description: "Vérification d'originalité avec système de détection alimenté par l'intelligence artificielle",
      color: "from-red-500 to-red-600"
    },
    {
      icon: "support_agent",
      title: "Assistant Virtuel",
      description: "Assistance 24/7 avec chatbot intelligent et support personnalisé",
      color: "from-orange-500 to-orange-600"
    }
  ];

  const stats = [
    { number: "2,500+", label: "Mémoires archivés", icon: "library_books" },
    { number: "150+", label: "Professeurs actifs", icon: "school" },
    { number: "95%", label: "Taux de satisfaction", icon: "thumb_up" },
    { number: "24/7", label: "Assistance disponible", icon: "support" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow"
          >
            <span className="material-icons text-3xl text-primary-600 mb-2 block">{stat.icon}</span>
            <div className="text-2xl font-bold text-gray-800 mb-1">{stat.number}</div>
            <div className="text-gray-600 text-sm">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 group"
          >
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <span className="material-icons text-white text-2xl">{feature.icon}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
            <p className="text-gray-600 leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Section Soumission
const SoumissionSection: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Processus de Soumission des Mémoires</h2>
        <p className="text-gray-600">Découvrez comment les étudiants soumettent leurs documents avec validation automatique et analyse IA</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Types de documents */}
        <div className="bg-white rounded-xl p-8 shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="material-icons text-primary-600 mr-2">description</span>
            Types de Documents
          </h3>
          
          <div className="space-y-4">
            {[
              {
                type: "Fiche de dépôt",
                description: "Formulaire initial de soumission",
                icon: "assignment"
              },
              {
                type: "Mémoire complet",
                description: "Document final au format PDF",
                icon: "picture_as_pdf"
              },
              {
                type: "Annexes",
                description: "Documents complémentaires",
                icon: "attach_file"
              },
              {
                type: "Reçu de paiement",
                description: "Justificatif de frais de soutenance",
                icon: "receipt"
              }
            ].map((doc, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="material-icons text-primary-600 mr-3 mt-1">{doc.icon}</span>
                <div>
                  <div className="font-semibold text-gray-800">{doc.type}</div>
                  <div className="text-sm text-gray-600">{doc.description}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Étapes de soumission */}
        <div className="bg-white rounded-xl p-8 shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="material-icons text-primary-600 mr-2">timeline</span>
            Étapes de Soumission
          </h3>
          
          <div className="space-y-6">
            {[
              {
                step: "1",
                title: "Création du dossier",
                description: "Remplissage du formulaire initial"
              },
              {
                step: "2",
                title: "Upload des documents",
                description: "Téléchargement des fichiers requis"
              },
              {
                step: "3",
                title: "Validation automatique",
                description: "Vérification par l'IA des formats et contenus"
              },
              {
                step: "4",
                title: "Soumission finale",
                description: "Confirmation et notification"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-start"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold mr-4">
                  {item.step}
                </div>
                <div>
                  <div className="font-semibold text-gray-800 mb-1">{item.title}</div>
                  <div className="text-sm text-gray-600">{item.description}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Validation automatique */}
      <div className="mt-8 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-8">
        <div className="flex items-start">
          <span className="material-icons text-primary-600 text-4xl mr-4">verified</span>
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Validation Automatique par IA</h3>
            <p className="text-gray-700 mb-4">
              Notre système d'intelligence artificielle vérifie automatiquement :
            </p>
            <ul className="space-y-2">
              {[
                "Conformité des formats de fichiers",
                "Présence de toutes les sections requises",
                "Respect des normes de rédaction",
                "Détection préliminaire de plagiat"
              ].map((item, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <span className="material-icons text-green-600 text-sm mr-2">check_circle</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Section Consultation
const ConsultationSection: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Consultation Intelligente des Mémoires</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explorez notre bibliothèque numérique avec des outils de recherche avancés alimentés par l'IA
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Recherche sémantique */}
        <div className="bg-white rounded-xl p-8 shadow-md">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mb-6">
            <span className="material-icons text-white text-2xl">search</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Recherche Sémantique</h3>
          <p className="text-gray-600 mb-4">
            Trouvez des mémoires par concepts et idées, pas seulement par mots-clés
          </p>
          <ul className="space-y-2">
            {[
              "Compréhension du contexte",
              "Suggestions intelligentes",
              "Recherche multilingue"
            ].map((item, index) => (
              <li key={index} className="flex items-center text-sm text-gray-700">
                <span className="material-icons text-blue-600 text-sm mr-2">check</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Filtres avancés */}
        <div className="bg-white rounded-xl p-8 shadow-md">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center mb-6">
            <span className="material-icons text-white text-2xl">filter_list</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Filtres Avancés</h3>
          <p className="text-gray-600 mb-4">
            Affinez vos recherches avec de multiples critères
          </p>
          <ul className="space-y-2">
            {[
              "Par département",
              "Par année académique",
              "Par encadrant",
              "Par mention"
            ].map((item, index) => (
              <li key={index} className="flex items-center text-sm text-gray-700">
                <span className="material-icons text-green-600 text-sm mr-2">check</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Recommandations */}
        <div className="bg-white rounded-xl p-8 shadow-md">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mb-6">
            <span className="material-icons text-white text-2xl">recommend</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Recommandations IA</h3>
          <p className="text-gray-600 mb-4">
            Découvrez des mémoires pertinents basés sur vos intérêts
          </p>
          <ul className="space-y-2">
            {[
              "Suggestions personnalisées",
              "Mémoires similaires",
              "Tendances de recherche"
            ].map((item, index) => (
              <li key={index} className="flex items-center text-sm text-gray-700">
                <span className="material-icons text-purple-600 text-sm mr-2">check</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Fonctionnalités pour tous les utilisateurs */}
      <div className="bg-white rounded-xl p-8 shadow-md">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Fonctionnalités Disponibles pour Tous
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: "bookmark",
              title: "Ressources Sauvegardées",
              description: "Sauvegardez vos mémoires favoris pour y accéder rapidement",
              color: "text-yellow-600"
            },
            {
              icon: "folder",
              title: "Mes Ressources",
              description: "Gérez vos propres documents et mémoires",
              color: "text-blue-600"
            },
            {
              icon: "library_books",
              title: "Médiathèque",
              description: "Accédez à la bibliothèque complète de ressources",
              color: "text-green-600"
            },
            {
              icon: "visibility",
              title: "Consulter Ressources",
              description: "Visualisez et téléchargez les mémoires disponibles",
              color: "text-purple-600"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className={`material-icons text-4xl ${feature.color} mb-3 block`}>
                {feature.icon}
              </span>
              <h4 className="font-bold text-gray-800 mb-2">{feature.title}</h4>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Exemple de recherche */}
      <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
          Exemple de Recherche Intelligente
        </h3>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
            <div className="flex items-center">
              <span className="material-icons text-gray-400 mr-3">search</span>
              <input
                type="text"
                placeholder="Ex: Intelligence artificielle dans la santé..."
                className="flex-1 outline-none text-gray-700"
                disabled
              />
              <button className="bg-primary-600 text-white px-6 py-2 rounded-lg ml-4">
                Rechercher
              </button>
            </div>
          </div>
          
          <div className="text-sm text-gray-600 text-center">
            <span className="material-icons text-sm align-middle mr-1">lightbulb</span>
            L'IA comprend votre intention et trouve les mémoires les plus pertinents
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Section Analyse IA
const AnalyseIASection: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Analyse IA Avancée</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Notre système d'intelligence artificielle offre des analyses approfondies pour améliorer la qualité des mémoires
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Analyse de pertinence */}
        <div className="bg-white rounded-xl p-8 shadow-md">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mr-4">
              <span className="material-icons text-white">analytics</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Analyse de Pertinence</h3>
          </div>
          
          <p className="text-gray-600 mb-4">
            Évaluation automatique de la qualité et de la pertinence du contenu
          </p>
          
          <div className="space-y-3">
            {[
              "Cohérence du sujet",
              "Qualité de la méthodologie",
              "Pertinence des sources",
              "Originalité de la recherche"
            ].map((item, index) => (
              <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                <span className="material-icons text-blue-600 text-sm mr-3">check_circle</span>
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommandation d'encadreurs */}
        <div className="bg-white rounded-xl p-8 shadow-md">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center mr-4">
              <span className="material-icons text-white">person_search</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Recommandation d'Encadreurs</h3>
          </div>
          
          <p className="text-gray-600 mb-4">
            Suggestions intelligentes de professeurs selon le domaine de recherche
          </p>
          
          <div className="space-y-3">
            {[
              "Analyse des spécialités",
              "Disponibilité des professeurs",
              "Historique d'encadrement",
              "Taux de réussite"
            ].map((item, index) => (
              <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg">
                <span className="material-icons text-green-600 text-sm mr-3">check_circle</span>
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Validation automatique */}
        <div className="bg-white rounded-xl p-8 shadow-md">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mr-4">
              <span className="material-icons text-white">verified</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Validation Automatique</h3>
          </div>
          
          <p className="text-gray-600 mb-4">
            Vérification automatique de la conformité aux normes académiques
          </p>
          
          <div className="space-y-3">
            {[
              "Structure du document",
              "Citations et références",
              "Format bibliographique",
              "Respect des normes ISI"
            ].map((item, index) => (
              <div key={index} className="flex items-center p-3 bg-purple-50 rounded-lg">
                <span className="material-icons text-purple-600 text-sm mr-3">check_circle</span>
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Analyse statistique */}
        <div className="bg-white rounded-xl p-8 shadow-md">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center mr-4">
              <span className="material-icons text-white">bar_chart</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Analyse Statistique</h3>
          </div>
          
          <p className="text-gray-600 mb-4">
            Statistiques détaillées sur le contenu et la structure
          </p>
          
          <div className="space-y-3">
            {[
              "Nombre de pages",
              "Densité du contenu",
              "Répartition des chapitres",
              "Qualité de la rédaction"
            ].map((item, index) => (
              <div key={index} className="flex items-center p-3 bg-orange-50 rounded-lg">
                <span className="material-icons text-orange-600 text-sm mr-3">check_circle</span>
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Processus d'analyse */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Processus d'Analyse IA
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: "1",
              title: "Upload",
              description: "Téléchargement du document",
              icon: "upload_file"
            },
            {
              step: "2",
              title: "Extraction",
              description: "Analyse du contenu",
              icon: "description"
            },
            {
              step: "3",
              title: "Traitement",
              description: "Analyse par l'IA",
              icon: "psychology"
            },
            {
              step: "4",
              title: "Rapport",
              description: "Génération du rapport",
              icon: "assessment"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {item.step}
              </div>
              <span className="material-icons text-primary-600 text-3xl mb-2 block">{item.icon}</span>
              <h4 className="font-bold text-gray-800 mb-2">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Section Détection de Plagiat
const DetectionPlagiatSection: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Détection de Plagiat par IA</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Système avancé de détection de plagiat utilisant l'intelligence artificielle pour garantir l'originalité
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Comment ça marche */}
        <div className="bg-white rounded-xl p-8 shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="material-icons text-red-600 mr-2">info</span>
            Comment ça marche ?
          </h3>
          
          <div className="space-y-6">
            {[
              {
                title: "Analyse du texte",
                description: "Extraction et analyse du contenu textuel",
                icon: "text_fields"
              },
              {
                title: "Comparaison intelligente",
                description: "Comparaison avec notre base de données et sources en ligne",
                icon: "compare"
              },
              {
                title: "Détection sémantique",
                description: "Identification de similarités au-delà des mots exacts",
                icon: "psychology"
              },
              {
                title: "Rapport détaillé",
                description: "Génération d'un rapport avec pourcentage de similarité",
                icon: "assessment"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-start"
              >
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="material-icons text-red-600 text-sm">{item.icon}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Types de plagiat détectés */}
        <div className="bg-white rounded-xl p-8 shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="material-icons text-red-600 mr-2">security</span>
            Types de Plagiat Détectés
          </h3>
          
          <div className="space-y-4">
            {[
              {
                type: "Plagiat direct",
                description: "Copie mot à mot sans citation",
                severity: "high"
              },
              {
                type: "Paraphrase",
                description: "Reformulation sans attribution",
                severity: "medium"
              },
              {
                type: "Auto-plagiat",
                description: "Réutilisation de ses propres travaux",
                severity: "medium"
              },
              {
                type: "Plagiat mosaïque",
                description: "Assemblage de sources multiples",
                severity: "high"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">{item.type}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.severity === 'high' 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {item.severity === 'high' ? 'Élevé' : 'Moyen'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Avantages */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Avantages de Notre Système
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "speed",
              title: "Rapide",
              description: "Résultats en quelques minutes"
            },
            {
              icon: "precision_manufacturing",
              title: "Précis",
              description: "Taux de détection élevé"
            },
            {
              icon: "language",
              title: "Multilingue",
              description: "Support de plusieurs langues"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="text-center bg-white rounded-lg p-6"
            >
              <span className="material-icons text-red-600 text-4xl mb-3 block">{item.icon}</span>
              <h4 className="font-bold text-gray-800 mb-2">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Exemple de rapport */}
      <div className="mt-8 bg-white rounded-xl p-8 shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
          Exemple de Rapport de Plagiat
        </h3>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-sm text-gray-600 mb-1">Taux de similarité</div>
                <div className="text-3xl font-bold text-gray-800">12%</div>
              </div>
              <div className="w-24 h-24 rounded-full border-8 border-green-500 flex items-center justify-center">
                <span className="material-icons text-green-500 text-4xl">check_circle</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white rounded">
                <span className="text-sm text-gray-700">Sources identifiées</span>
                <span className="font-semibold text-gray-800">3</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded">
                <span className="text-sm text-gray-700">Passages similaires</span>
                <span className="font-semibold text-gray-800">5</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded">
                <span className="text-sm text-gray-700">Statut</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  Acceptable
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Section Assistance
const AssistanceSection: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Assistance 24/7</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Notre assistant virtuel intelligent est disponible à tout moment pour vous aider
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Chatbot IA */}
        <div className="bg-white rounded-xl p-8 shadow-md">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mr-4">
              <span className="material-icons text-white">smart_toy</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Chatbot Intelligent</h3>
          </div>
          
          <p className="text-gray-600 mb-6">
            Notre assistant virtuel peut vous aider avec :
          </p>
          
          <div className="space-y-3">
            {[
              "Questions sur le processus de soumission",
              "Aide à la navigation sur la plateforme",
              "Informations sur les normes de rédaction",
              "Support technique",
              "Conseils méthodologiques"
            ].map((item, index) => (
              <div key={index} className="flex items-start p-3 bg-blue-50 rounded-lg">
                <span className="material-icons text-blue-600 text-sm mr-3 mt-0.5">chat</span>
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fonctionnalités du chatbot */}
        <div className="bg-white rounded-xl p-8 shadow-md">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mr-4">
              <span className="material-icons text-white">psychology</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Fonctionnalités Avancées</h3>
          </div>
          
          <div className="space-y-4">
            {[
              {
                title: "Compréhension contextuelle",
                description: "L'IA comprend le contexte de vos questions",
                icon: "lightbulb"
              },
              {
                title: "Historique des conversations",
                description: "Accédez à vos discussions précédentes",
                icon: "history"
              },
              {
                title: "Archivage des discussions",
                description: "Sauvegardez les conversations importantes",
                icon: "archive"
              },
              {
                title: "Rappels personnalisés",
                description: "Activez des rappels pour vos échéances",
                icon: "notifications"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-start"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="material-icons text-purple-600 text-sm">{item.icon}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Exemple de conversation */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8 mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
          Exemple de Conversation
        </h3>
        
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Message utilisateur */}
          <div className="flex justify-end">
            <div className="bg-primary-600 text-white rounded-lg p-4 max-w-md">
              <p className="text-sm">Comment puis-je soumettre mon mémoire ?</p>
            </div>
          </div>
          
          {/* Réponse chatbot */}
          <div className="flex justify-start">
            <div className="bg-white rounded-lg p-4 max-w-md shadow-sm">
              <div className="flex items-center mb-2">
                <span className="material-icons text-primary-600 text-sm mr-2">smart_toy</span>
                <span className="text-xs font-semibold text-gray-600">Assistant ISIMemo</span>
              </div>
              <p className="text-sm text-gray-700">
                Pour soumettre votre mémoire, suivez ces étapes :
                <br />1. Connectez-vous à votre compte
                <br />2. Accédez à "Mes Dossiers"
                <br />3. Cliquez sur "Nouveau Dossier"
                <br />4. Remplissez le formulaire et téléchargez vos documents
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact et ressources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact support */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <span className="material-icons text-blue-600 mr-2">support_agent</span>
            Contact Support
          </h3>
          
          <p className="text-sm text-gray-600 mb-4">
            Besoin d'aide personnalisée ? Contactez notre équipe de support.
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-700">
              <span className="material-icons text-primary-600 mr-2 text-sm">email</span>
              support@isimemo.edu
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <span className="material-icons text-primary-600 mr-2 text-sm">phone</span>
              +221 33 822 19 81
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <span className="material-icons text-primary-600 mr-2 text-sm">schedule</span>
              Lun-Ven: 8h00-18h00
            </div>
          </div>
          
          <div className="w-full mt-4 py-2 bg-primary-600 text-white rounded-lg text-center text-sm">
            <span className="material-icons mr-1">chat</span>
            Contacter le support
          </div>
        </div>

        {/* Guides et ressources */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <span className="material-icons text-green-600 mr-2">menu_book</span>
            Guides & Ressources
          </h3>
          
          <div className="space-y-3">
            {[
              { title: "Guide de soumission", icon: "upload_file" },
              { title: "Normes de rédaction", icon: "edit" },
              { title: "Tutoriel vidéo", icon: "play_circle" },
              { title: "Modèles de canevas", icon: "description" }
            ].map((guide, index) => (
              <motion.div
                key={index}
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <span className="material-icons text-green-600 mr-3 text-sm">{guide.icon}</span>
                <span className="text-sm text-gray-800">{guide.title}</span>
                <span className="material-icons text-gray-400 ml-auto text-sm">arrow_forward_ios</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ISIMemoHub;