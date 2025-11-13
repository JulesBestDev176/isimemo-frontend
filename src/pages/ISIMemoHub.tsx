import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import  Footer  from '../components/Footer';

const ISIMemoHub: React.FC = () => {
  const [activeSection, setActiveSection] = useState('accueil');

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "ISIMemo Hub - Plateforme Intelligente de Gestion des Mémoires";
    
    // Gérer la navigation via ancres URL
    const hash = window.location.hash.substring(1);
    if (hash && sections.find(s => s.id === hash)) {
      setActiveSection(hash);
    }
  }, []);

  const sections = [
    { id: 'accueil', label: 'Accueil', icon: 'home' },
    { id: 'soumission', label: 'Processus de Soumission', icon: 'upload_file' },
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <Navbar />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-grow"
      >
        {/* Hero Section */}
        <motion.section
          className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-primary-600 overflow-hidden h-screen flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Cercles décoratifs */}
          <motion.div
            className="absolute top-10 right-10 w-48 h-48 rounded-full bg-white opacity-10"
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
            className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-primary-300 opacity-10"
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

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-medium mb-4">
                  <span className="material-icons text-yellow-200 text-xs mr-1" style={{ verticalAlign: 'middle' }}>
                    auto_awesome
                  </span>
                  Plateforme Intelligente
                </span>
              </motion.div>

              <motion.h1
                className="text-4xl md:text-5xl xl:text-6xl font-bold mb-6 text-white"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                ISIMemo <motion.span
                  className="relative inline-block"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Hub
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-1 bg-yellow-300"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: 0.8 }}
                  />
                </motion.span>
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl text-primary-50 mb-8 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                Découvrez notre plateforme intelligente de gestion des mémoires académiques avec IA intégrée, détection de plagiat et assistance 24/7. Explorez les fonctionnalités et processus qui révolutionnent l'expérience académique à l'ISI.
              </motion.p>
            </div>
          </div>
        </motion.section>

        {/* Navigation Tabs */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-2 py-4">
              {sections.map((section) => (
                <motion.button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    window.history.pushState(null, '', `#${section.id}`);
                  }}
                  className={`flex items-center px-6 py-3 rounded-full font-medium transition-all ${
                    activeSection === section.id
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="material-icons mr-2 text-sm">{section.icon}</span>
                  {section.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-8">
          {renderSection()}
        </div>
      </motion.div>
      
      {/* Footer */}
      <Footer/>
    </div>
  );
};

// Section Accueil
const AccueilSection: React.FC = () => {
  const features = [
    {
      icon: "upload_file",
      title: "Soumission Intelligente",
      description: "Processus numérique de dépôt avec validation automatique et recommandations IA",
      color: "from-primary-500 to-primary-600"
    },
    {
      icon: "search",
      title: "Recherche Vectorielle",
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
                description: "Document initial contenant le sujet proposé et les informations de base",
                icon: "assignment"
              },
              {
                type: "Canevas",
                description: "Structure détaillée du mémoire avec plan et méthodologie",
                icon: "outline"
              },
              {
                type: "Mémoire complet",
                description: "Version finale du travail de recherche",
                icon: "book"
              },
              {
                type: "Correction post-soutenance",
                description: "Mémoire révisé après recommandations du jury",
                icon: "edit"
              }
            ].map((doc, index) => (
              <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                <span className="material-icons text-primary-600 mr-3 mt-1">{doc.icon}</span>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">{doc.type}</h4>
                  <p className="text-sm text-gray-600">{doc.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Processus de validation */}
        <div className="bg-white rounded-xl p-8 shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="material-icons text-primary-600 mr-2">verified_user</span>
            Processus de Validation
          </h3>
          
          <div className="space-y-4">
            {[
              {
                step: "1",
                title: "Soumission numérique",
                description: "Upload sécurisé du document avec métadonnées",
                status: "automated"
              },
              {
                step: "2", 
                title: "Analyse IA automatique",
                description: "Vérification de structure, pertinence et plagiat",
                status: "ai"
              },
              {
                step: "3",
                title: "Validation commission",
                description: "Examen par la commission académique",
                status: "human"
              },
              {
                step: "4",
                title: "Attribution encadreur",
                description: "Assignation basée sur l'expertise",
                status: "smart"
              }
            ].map((process, index) => (
              <div key={index} className="flex items-start">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 text-white text-sm font-bold ${
                  process.status === 'automated' ? 'bg-primary-500' :
                  process.status === 'ai' ? 'bg-purple-500' :
                  process.status === 'human' ? 'bg-green-500' : 'bg-orange-500'
                }`}>
                  {process.step}
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">{process.title}</h4>
                  <p className="text-sm text-gray-600">{process.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Critères d'évaluation */}
      <div className="mt-12 bg-gradient-to-r from-primary-50 to-indigo-50 rounded-xl p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="material-icons text-primary-600 mr-2">assessment</span>
          Critères d'Évaluation Automatique
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800">Analyse de Pertinence :</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="material-icons text-green-500 text-sm mr-2 mt-0.5">check_circle</span>
                Cohérence du sujet avec le domaine d'études
              </li>
              <li className="flex items-start">
                <span className="material-icons text-green-500 text-sm mr-2 mt-0.5">check_circle</span>
                Originalité et innovation du thème proposé
              </li>
              <li className="flex items-start">
                <span className="material-icons text-green-500 text-sm mr-2 mt-0.5">check_circle</span>
                Faisabilité technique et temporelle
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800">Validation de Structure :</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="material-icons text-green-500 text-sm mr-2 mt-0.5">check_circle</span>
                Conformité au canevas officiel ISI
              </li>
              <li className="flex items-start">
                <span className="material-icons text-green-500 text-sm mr-2 mt-0.5">check_circle</span>
                Présence des sections obligatoires
              </li>
              <li className="flex items-start">
                <span className="material-icons text-green-500 text-sm mr-2 mt-0.5">check_circle</span>
                Respect des normes de rédaction
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Avantages du système */}
      <div className="mt-8 bg-white rounded-xl p-8 shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="material-icons text-green-600 mr-2">emoji_objects</span>
          Avantages du Système Numérique
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "speed",
              title: "Traitement Rapide",
              desc: "Validation automatique en quelques minutes"
            },
            {
              icon: "security",
              title: "Sécurité Garantie", 
              desc: "Archivage sécurisé et traçabilité complète"
            },
            {
              icon: "visibility",
              title: "Transparence",
              desc: "Suivi en temps réel du statut de validation"
            }
          ].map((advantage, index) => (
            <div key={index} className="text-center p-4">
              <span className="material-icons text-4xl text-primary-600 mb-3 block">{advantage.icon}</span>
              <h4 className="font-medium text-gray-800 mb-2">{advantage.title}</h4>
              <p className="text-sm text-gray-600">{advantage.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Section Consultation
const ConsultationSection: React.FC = () => {
  const memoires = [
    {
      id: 1,
      title: "Développement d'une application mobile de géolocalisation avec React Native",
      author: "Jean Dupont",
      year: "2024",
      domain: "Développement Mobile",
      type: "Master",
      status: "Publié",
      downloads: 145,
      rating: 4.8
    },
    {
      id: 2,
      title: "Système de recommandation basé sur l'apprentissage automatique",
      author: "Marie Martin",
      year: "2024",
      domain: "Intelligence Artificielle",
      type: "Licence",
      status: "Publié",
      downloads: 89,
      rating: 4.6
    },
    {
      id: 3,
      title: "Sécurisation des réseaux IoT par blockchain",
      author: "Ahmed Sow",
      year: "2023",
      domain: "Cybersécurité",
      type: "Master",
      status: "Publié",
      downloads: 203,
      rating: 4.9
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Système de Consultation Intelligente</h2>
        <p className="text-gray-600">Découvrez comment notre bibliothèque numérique révolutionne l'accès aux mémoires académiques</p>
      </div>

      {/* Fonctionnalités de recherche */}
      <div className="bg-white rounded-xl p-6 shadow-md mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="material-icons text-primary-600 mr-2">search</span>
          Recherche Vectorielle Avancée
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4">
            <span className="material-icons text-4xl text-purple-500 mb-3 block">psychology</span>
            <h4 className="font-medium text-gray-800 mb-2">Recherche Sémantique</h4>
            <p className="text-sm text-gray-600">Trouvez des documents par concepts et idées, pas seulement par mots-clés</p>
          </div>
          
          <div className="text-center p-4">
            <span className="material-icons text-4xl text-green-500 mb-3 block">category</span>
            <h4 className="font-medium text-gray-800 mb-2">Classification Automatique</h4>
            <p className="text-sm text-gray-600">Documents organisés automatiquement par domaines et thématiques</p>
          </div>
          
          <div className="text-center p-4">
            <span className="material-icons text-4xl text-primary-500 mb-3 block">recommend</span>
            <h4 className="font-medium text-gray-800 mb-2">Recommandations IA</h4>
            <p className="text-sm text-gray-600">Suggestions personnalisées basées sur vos intérêts de recherche</p>
          </div>
        </div>
      </div>

      {/* Interface de recherche */}
      <div className="bg-gradient-to-r from-gray-50 to-primary-50 rounded-xl p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Interface de Recherche</h3>
        <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
          <div className="relative">
            <span className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">search</span>
            <div className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600">
              Rechercher par titre, auteur, mots-clés ou concepts...
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-sm text-gray-600">Filtres disponibles :</span>
          {["Tous les domaines", "Intelligence Artificielle", "Développement Web", "Cybersécurité", "Data Science"].map((filter, index) => (
            <span key={index} className="px-3 py-1 bg-white rounded-full text-xs text-gray-700 border">
              {filter}
            </span>
          ))}
        </div>
      </div>

      {/* Exemples de mémoires */}
      <div className="space-y-6 mb-8">
        <h3 className="text-xl font-bold text-gray-800">Mémoires Disponibles (Exemples)</h3>
        {memoires.map((memoire, index) => (
          <motion.div
            key={memoire.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-md"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    memoire.type === 'Master' ? 'bg-purple-100 text-purple-700' : 'bg-primary-100 text-primary-700'
                  }`}>
                    {memoire.type}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    {memoire.status}
                  </span>
                </div>
                
                <h4 className="text-xl font-bold text-gray-800 mb-2">
                  {memoire.title}
                </h4>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span className="flex items-center">
                    <span className="material-icons text-sm mr-1">person</span>
                    {memoire.author}
                  </span>
                  <span className="flex items-center">
                    <span className="material-icons text-sm mr-1">calendar_today</span>
                    {memoire.year}
                  </span>
                  <span className="flex items-center">
                    <span className="material-icons text-sm mr-1">category</span>
                    {memoire.domain}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <span className="material-icons text-sm mr-1">download</span>
                    {memoire.downloads} téléchargements
                  </span>
                  <span className="flex items-center">
                    <span className="material-icons text-sm mr-1">star</span>
                    {memoire.rating}/5
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-4 md:mt-0">
                <div className="px-4 py-2 border border-primary-600 text-primary-600 rounded-lg text-sm">
                  <span className="material-icons mr-1 text-sm">visibility</span>
                  Aperçu
                </div>
                <div className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm">
                  <span className="material-icons mr-1 text-sm">download</span>
                  Télécharger
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Fonctionnalités avancées */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="material-icons text-orange-500 mr-2">analytics</span>
            Statistiques et Métriques
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Mémoires archivés</span>
              <span className="font-bold text-gray-800">2,500+</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Domaines couverts</span>
              <span className="font-bold text-gray-800">15</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Recherches quotidiennes</span>
              <span className="font-bold text-gray-800">350+</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Taux de satisfaction</span>
              <span className="font-bold text-green-600">95%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="material-icons text-purple-500 mr-2">auto_awesome</span>
            Fonctionnalités Avancées
          </h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <span className="material-icons text-primary-500 mr-3 mt-1">translate</span>
              <div>
                <h4 className="font-medium text-gray-800">Recherche multilingue</h4>
                <p className="text-sm text-gray-600">Support français, anglais, arabe</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="material-icons text-green-500 mr-3 mt-1">bookmark</span>
              <div>
                <h4 className="font-medium text-gray-800">Sauvegarde intelligente</h4>
                <p className="text-sm text-gray-600">Collections personnalisées</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="material-icons text-orange-500 mr-3 mt-1">share</span>
              <div>
                <h4 className="font-medium text-gray-800">Partage collaboratif</h4>
                <p className="text-sm text-gray-600">Annotations et commentaires</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommandations IA */}
      <div className="mt-12 bg-gradient-to-r from-purple-50 to-primary-50 rounded-xl p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="material-icons text-purple-600 mr-2">psychology</span>
          Recommandations IA Personnalisées
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["Machine Learning en finance", "Applications blockchain", "Sécurité des APIs REST"].map((suggestion, index) => (
            <motion.div
              key={index}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <span className="material-icons text-purple-600 mb-2 block">lightbulb</span>
              <h4 className="font-medium text-gray-800">{suggestion}</h4>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Section Analyse IA
const AnalyseIASection: React.FC = () => {
  const analysisResults = {
    pertinence: { score: 85, status: "Excellent" },
    originalite: { score: 78, status: "Bon" },
    structure: { score: 92, status: "Excellent" },
    conformite: { score: 88, status: "Excellent" }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Système d'Analyse IA</h2>
        <p className="text-gray-600">Découvrez comment l'intelligence artificielle analyse la pertinence, l'originalité et la conformité des mémoires</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Processus d'analyse */}
        <div className="bg-white rounded-xl p-8 shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="material-icons text-purple-600 mr-2">psychology</span>
            Processus d'Analyse IA
          </h3>
          
          <div className="space-y-4">
            {[
              {
                phase: "Extraction",
                description: "Analyse du contenu et extraction des informations clés",
                icon: "text_fields",
                color: "primary"
              },
              {
                phase: "Structure",
                description: "Vérification de la conformité au canevas officiel",
                icon: "account_tree",
                color: "green"
              },
              {
                phase: "Pertinence",
                description: "Évaluation de la cohérence avec le domaine d'études",
                icon: "target",
                color: "orange"
              },
              {
                phase: "Originalité",
                description: "Détection de similitudes et évaluation de l'innovation",
                icon: "auto_awesome",
                color: "purple"
              }
            ].map((phase, index) => (
              <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                <span className={`material-icons text-${phase.color}-500 mr-3 mt-1`}>{phase.icon}</span>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">{phase.phase}</h4>
                  <p className="text-sm text-gray-600">{phase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Résultats d'analyse exemple */}
        <div className="bg-white rounded-xl p-8 shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Exemple de Résultats</h3>
          
          <div className="space-y-6">
            {Object.entries(analysisResults).map(([key, result], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50"
              >
                <div>
                  <h4 className="font-medium text-gray-800 capitalize">{key}</h4>
                  <p className="text-sm text-gray-600">{result.status}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600">{result.score}%</div>
                  <div className={`w-20 h-2 rounded-full ${
                    result.score >= 80 ? 'bg-green-200' : 
                    result.score >= 60 ? 'bg-yellow-200' : 'bg-red-200'
                  }`}>
                    <div 
                      className={`h-2 rounded-full ${
                        result.score >= 80 ? 'bg-green-500' : 
                        result.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${result.score}%` }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommandations IA */}
      <div className="mt-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="material-icons text-purple-600 mr-2">lightbulb</span>
          Recommandations Automatiques
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800">Points forts détectés :</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="material-icons text-green-500 text-sm mr-2 mt-0.5">check_circle</span>
                <span className="text-sm text-gray-700">Structure bien organisée selon le canevas</span>
              </li>
              <li className="flex items-start">
                <span className="material-icons text-green-500 text-sm mr-2 mt-0.5">check_circle</span>
                <span className="text-sm text-gray-700">Pertinence du sujet par rapport au domaine</span>
              </li>
              <li className="flex items-start">
                <span className="material-icons text-green-500 text-sm mr-2 mt-0.5">check_circle</span>
                <span className="text-sm text-gray-700">Méthodologie appropriée</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800">Suggestions d'amélioration :</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="material-icons text-orange-500 text-sm mr-2 mt-0.5">info</span>
                <span className="text-sm text-gray-700">Renforcer la revue de littérature</span>
              </li>
              <li className="flex items-start">
                <span className="material-icons text-orange-500 text-sm mr-2 mt-0.5">info</span>
                <span className="text-sm text-gray-700">Ajouter plus d'analyses statistiques</span>
              </li>
              <li className="flex items-start">
                <span className="material-icons text-orange-500 text-sm mr-2 mt-0.5">info</span>
                <span className="text-sm text-gray-700">Préciser les perspectives futures</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">Encadreurs recommandés :</h4>
          <div className="flex gap-3">
            {["Dr. Amadou Ba", "Prof. Fatou Diop", "Dr. Omar Fall"].map((name, index) => (
              <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Section Détection de Plagiat
const DetectionPlagiatSection: React.FC = () => {
  const plagiarismResults = {
    globalScore: 12,
    sources: [
      { source: "Wikipedia - Intelligence Artificielle", similarity: 5.2, type: "Internet" },
      { source: "Mémoire ISI 2023 - J. Diallo", similarity: 3.8, type: "Base académique" },
      { source: "Article IEEE - Machine Learning", similarity: 2.1, type: "Publication" }
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Système de Détection de Plagiat</h2>
        <p className="text-gray-600">Découvrez comment notre système avancé vérifie l'originalité des travaux académiques</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Processus de détection */}
        <div className="bg-white rounded-xl p-8 shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="material-icons text-red-600 mr-2">security</span>
            Processus de Détection
          </h3>
          
          <div className="space-y-4">
            {[
              {
                step: "Extraction du texte",
                description: "Analyse et segmentation du contenu textuel",
                icon: "text_snippet"
              },
              {
                step: "Scan bases académiques",
                description: "Comparaison avec +10M de documents académiques",
                icon: "school"
              },
              {
                step: "Scan sources Internet",
                description: "Vérification contre le contenu web public",
                icon: "language"
              },
              {
                step: "Analyse des similitudes",
                description: "Calcul des scores de ressemblance",
                icon: "analytics"
              }
            ].map((step, index) => (
              <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                <span className="material-icons text-red-500 mr-3 mt-1">{step.icon}</span>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">{step.step}</h4>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Résultats de détection exemple */}
        <div className="bg-white rounded-xl p-8 shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Exemple de Rapport</h3>
          
          <div className="space-y-6">
            {/* Score global */}
            <div className="text-center p-6 rounded-lg bg-green-50 border border-green-200">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {plagiarismResults.globalScore}%
              </div>
              <div className="text-green-700 font-medium">Taux de similitude</div>
              <div className="text-sm text-green-600 mt-1">Document original</div>
            </div>

            {/* Sources détectées */}
            <div>
              <h4 className="font-medium text-gray-800 mb-4">Sources similaires détectées :</h4>
              <div className="space-y-3">
                {plagiarismResults.sources.map((source, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50"
                  >
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-800 text-sm">{source.source}</h5>
                      <p className="text-xs text-gray-600">{source.type}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-red-600">{source.similarity}%</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conseils et recommandations */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-primary-50 rounded-xl p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="material-icons text-green-600 mr-2">verified</span>
          Évaluation et Conseils
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-medium text-green-700 mb-2">✓ Document conforme</h4>
              <p className="text-sm text-gray-700">
                Le taux de similitude de {plagiarismResults.globalScore}% est acceptable selon les standards académiques (seuil : 15%).
              </p>
            </div>
            
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-medium text-primary-700 mb-2">ℹ Bonnes pratiques</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Citer toutes les sources utilisées</li>
                <li>• Utiliser des guillemets pour les citations</li>
                <li>• Paraphraser correctement</li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">📊 Détails du scan</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Pages analysées :</span>
                  <span>45</span>
                </div>
                <div className="flex justify-between">
                  <span>Mots vérifiés :</span>
                  <span>12,847</span>
                </div>
                <div className="flex justify-between">
                  <span>Sources consultées :</span>
                  <span>10,2M</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">⚙️ Fonctionnalités</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Détection multilingue</li>
                <li>• Analyse en temps réel</li>
                <li>• Rapport détaillé PDF</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Section Assistance
const AssistanceSection: React.FC = () => {
  const faqItems = [
    {
      question: "Comment soumettre mon mémoire ?",
      answer: "Rendez-vous dans la section 'Soumission', remplissez les informations requises et téléchargez votre document. L'IA analysera automatiquement votre soumission."
    },
    {
      question: "Combien de temps prend l'analyse IA ?",
      answer: "L'analyse IA prend généralement 2-5 minutes selon la taille du document. Vous recevrez une notification une fois l'analyse terminée."
    },
    {
      question: "Comment interpréter les résultats de plagiat ?",
      answer: "Un taux inférieur à 15% est acceptable. Entre 15-25% nécessite une vérification. Au-dessus de 25%, une révision est recommandée."
    },
    {
      question: "Puis-je modifier mon mémoire après soumission ?",
      answer: "Oui, vous pouvez soumettre des versions corrigées. Chaque version sera analysée et historisée dans votre espace personnel."
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Système d'Assistance 24/7</h2>
        <p className="text-gray-600">Découvrez notre support intelligent et les ressources d'aide disponibles</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chatbot intelligent */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
            <h3 className="text-xl font-bold flex items-center">
              <span className="material-icons mr-2">support_agent</span>
              Assistant Virtuel ISIMemo
            </h3>
            <p className="text-orange-100 text-sm">En ligne • Répond instantanément</p>
          </div>

          {/* Interface de chat simulée */}
          <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
            <div className="flex justify-start">
              <div className="max-w-xs bg-white rounded-lg p-3 shadow-sm">
                <p className="text-sm">Bonjour ! Je suis votre assistant virtuel ISIMemo. Comment puis-je vous aider aujourd'hui ?</p>
                <p className="text-xs text-gray-500 mt-1">9:30</p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <div className="max-w-xs bg-primary-500 text-white rounded-lg p-3">
                <p className="text-sm">Comment soumettre un mémoire ?</p>
                <p className="text-xs text-primary-100 mt-1">9:31</p>
              </div>
            </div>
            
            <div className="flex justify-start">
              <div className="max-w-xs bg-white rounded-lg p-3 shadow-sm">
                <p className="text-sm">Pour soumettre votre mémoire, suivez ces étapes :</p>
                <ul className="text-sm mt-2 space-y-1">
                  <li>1. Allez dans "Soumission"</li>
                  <li>2. Remplissez le formulaire</li>
                  <li>3. Téléchargez votre document</li>
                  <li>4. Attendez l'analyse IA</li>
                </ul>
                <p className="text-xs text-gray-500 mt-1">9:31</p>
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="p-4 border-t bg-gray-50">
            <p className="text-sm text-gray-600 mb-3">Actions rapides :</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { text: "Comment soumettre un mémoire ?", icon: "upload_file" },
                { text: "Rechercher un encadreur", icon: "person_search" },
                { text: "Calendrier des soutenances", icon: "calendar_today" },
                { text: "Guide de rédaction", icon: "menu_book" }
              ].map((action, index) => (
                <motion.div
                  key={index}
                  className="flex items-center p-2 text-sm bg-white rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="material-icons text-orange-500 mr-2 text-sm">{action.icon}</span>
                  {action.text}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ et Support */}
        <div className="space-y-6">
          {/* FAQ */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="material-icons text-primary-600 mr-2">help</span>
              FAQ
            </h3>
            
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <motion.details
                  key={index}
                  className="group"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <summary className="cursor-pointer text-sm font-medium text-gray-800 hover:text-primary-600 transition-colors">
                    {item.question}
                  </summary>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {item.answer}
                  </p>
                </motion.details>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-gradient-to-r from-primary-50 to-indigo-50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <span className="material-icons text-primary-600 mr-2">headset_mic</span>
              Support Humain
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
      </div>
    </motion.div>
  );
};

export default ISIMemoHub;