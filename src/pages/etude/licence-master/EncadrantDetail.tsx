import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowLeft,
  FiMail, 
  FiStar,
  FiBookOpen,
  FiUsers,
  FiAward,
  FiMapPin,
  FiCalendar,
  FiClock,
  FiMessageSquare,
  FiPhone,
  FiExternalLink,
  FiCheck,
  FiX
} from 'react-icons/fi';

interface Encadrant {
  id: number;
  name: string;
  email: string;
  specialite: string;
  photo: string;
  bio: string;
  grade: string;
  disponible: boolean;
  nombreEtudiants: number;
  maxEtudiants: number;
  rating: number;
  publications: number;
  projetsActuels: string[];
  experience: number;
  domaines: string[];
  bureau: string;
  telephone: string;
  heuresConsultation: string;
  diplomes: string[];
  publicationsRecentes: { titre: string; annee: number; revue: string }[];
  etudiantsEncadres: { nom: string; sujet: string; annee: number; statut: string }[];
  collaborations: string[];
  langues: string[];
}

const mockEncadrants: Encadrant[] = [
  { 
    id: 1, 
    name: 'Pr. Abdoulaye Ndiaye', 
    email: 'abdoulaye.ndiaye@isi.edu.sn', 
    specialite: 'Réseaux et Télécommunications', 
    photo: '/avatars/abdoulaye.jpg', 
    bio: 'Professeur titulaire en réseaux et télécommunications avec plus de 20 ans d\'expérience dans la recherche et l\'enseignement. Expert en sécurité des réseaux et protocoles de communication. Directeur du laboratoire de recherche en réseaux avancés.',
    grade: 'Professeur Titulaire',
    disponible: true,
    nombreEtudiants: 8,
    maxEtudiants: 12,
    rating: 4.8,
    publications: 45,
    projetsActuels: ['5G Security Framework', 'IoT Network Optimization', 'SDN Security Protocols'],
    experience: 20,
    domaines: ['Réseaux', 'Sécurité', '5G', 'IoT', 'SDN', 'Protocoles'],
    bureau: 'Bureau 308, Bâtiment A',
    telephone: '+221 33 123 45 67',
    heuresConsultation: 'Mardi et Jeudi : 14h-16h',
    diplomes: [
      'PhD en Informatique - Université Paris-Saclay (2003)',
      'Master en Réseaux - UCAD Dakar (1999)',
      'Ingénieur en Télécommunications - ESP Dakar (1997)'
    ],
    publicationsRecentes: [
      { titre: 'Security Challenges in 5G Networks', annee: 2024, revue: 'IEEE Network Security' },
      { titre: 'IoT Device Authentication in Edge Computing', annee: 2023, revue: 'Computer Networks' },
      { titre: 'SDN-based Network Slicing for 5G', annee: 2023, revue: 'IEEE Communications' }
    ],
    etudiantsEncadres: [
      { nom: 'Moussa Diallo', sujet: 'Sécurité des réseaux IoT', annee: 2024, statut: 'En cours' },
      { nom: 'Fatou Sow', sujet: 'Optimisation 5G', annee: 2023, statut: 'Soutenu' },
      { nom: 'Omar Ba', sujet: 'SDN Security', annee: 2023, statut: 'Soutenu' }
    ],
    collaborations: ['Orange Labs Sénégal', 'INRIA France', 'Université Cheikh Anta Diop'],
    langues: ['Français', 'Anglais', 'Wolof']
  },
  { 
    id: 2, 
    name: 'Dr. Fatou Diop', 
    email: 'fatou.diop@isi.edu.sn', 
    specialite: 'Intelligence Artificielle', 
    photo: '/avatars/fatou.jpg', 
    bio: 'Docteure en Intelligence Artificielle, spécialisée dans l\'apprentissage automatique et le traitement du langage naturel. Consultante pour plusieurs entreprises tech et chercheuse active dans le domaine de l\'IA pour les langues africaines.',
    grade: 'Maître de Conférences',
    disponible: true,
    nombreEtudiants: 6,
    maxEtudiants: 10,
    rating: 4.9,
    publications: 32,
    projetsActuels: ['NLP for African Languages', 'Computer Vision for Agriculture', 'Deep Learning Optimization'],
    experience: 12,
    domaines: ['IA', 'Machine Learning', 'NLP', 'Computer Vision', 'Deep Learning'],
    bureau: 'Bureau 205, Bâtiment B',
    telephone: '+221 33 234 56 78',
    heuresConsultation: 'Lundi et Mercredi : 10h-12h',
    diplomes: [
      'PhD en Intelligence Artificielle - Stanford University (2012)',
      'Master en Computer Science - MIT (2008)',
      'Ingénieur en Informatique - ESP Dakar (2006)'
    ],
    publicationsRecentes: [
      { titre: 'Transformer Models for Wolof Language Processing', annee: 2024, revue: 'ACL Proceedings' },
      { titre: 'Computer Vision for Crop Disease Detection', annee: 2023, revue: 'Agricultural AI Journal' },
      { titre: 'Few-Shot Learning for African Languages', annee: 2023, revue: 'EMNLP' }
    ],
    etudiantsEncadres: [
      { nom: 'Aminata Kane', sujet: 'Chatbot en langues locales', annee: 2024, statut: 'En cours' },
      { nom: 'Ibrahima Sarr', sujet: 'Vision par ordinateur', annee: 2023, statut: 'Soutenu' }
    ],
    collaborations: ['Google AI', 'Facebook Research', 'IRCAM'],
    langues: ['Français', 'Anglais', 'Wolof', 'Pulaar']
  }
];

const EncadrantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showContactModal, setShowContactModal] = useState(false);

  const encadrant = mockEncadrants.find(e => e.id === Number(id));

  if (!encadrant) {
    return (
      <div className="max-w-4xl mx-auto mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 p-12 text-center"
        >
          <FiUsers className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Encadrant introuvable</h2>
          <p className="text-gray-500 mb-6">L'encadrant que vous recherchez n'existe pas ou a été supprimé.</p>
          <button 
            onClick={() => navigate('/encadrants')} 
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retour à la liste
          </button>
        </motion.div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getAvailabilityColor = () => {
    if (!encadrant.disponible) return 'bg-red-100 text-red-800 border-red-200';
    const ratio = encadrant.nombreEtudiants / encadrant.maxEtudiants;
    if (ratio >= 0.8) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getAvailabilityText = () => {
    if (!encadrant.disponible) return 'Complet';
    const ratio = encadrant.nombreEtudiants / encadrant.maxEtudiants;
    if (ratio >= 0.8) return 'Bientôt complet';
    return 'Disponible';
  };

  const getAvailabilityIcon = () => {
    if (!encadrant.disponible) return <FiX className="h-4 w-4" />;
    return <FiCheck className="h-4 w-4" />;
  };

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: <FiUsers className="h-4 w-4" /> },
    { id: 'research', label: 'Recherche', icon: <FiBookOpen className="h-4 w-4" /> },
    { id: 'students', label: 'Étudiants', icon: <FiAward className="h-4 w-4" /> },
    { id: 'contact', label: 'Contact', icon: <FiMail className="h-4 w-4" /> }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* En-tête avec bouton retour */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/encadrants')}
          className="flex items-center text-gray-600 hover:text-gray-800 mr-4 p-2 rounded-lg hover:bg-gray-100"
        >
          <FiArrowLeft className="h-5 w-5 mr-2" />
          Retour à la liste
        </button>
      </div>

      {/* Profil principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border overflow-hidden mb-6"
      >
        <div className="bg-blue-600 h-32"></div>
        <div className="p-6 -mt-16">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-2xl border-4 border-white shadow-lg">
                {getInitials(encadrant.name)}
              </div>
              <div className={`absolute -bottom-2 -right-2 px-2 py-1 rounded-full text-xs font-medium border ${getAvailabilityColor()} flex items-center`}>
                {getAvailabilityIcon()}
                <span className="ml-1">{getAvailabilityText()}</span>
              </div>
            </div>

            {/* Informations principales */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{encadrant.name}</h1>
              <p className="text-xl text-gray-600 mb-2">{encadrant.grade}</p>
              <p className="text-lg text-blue-600 font-medium mb-4">{encadrant.specialite}</p>
              
              {/* Tags domaines */}
              <div className="flex flex-wrap gap-2 mb-4">
                {encadrant.domaines.map(domaine => (
                  <span key={domaine} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    {domaine}
                  </span>
                ))}
              </div>

              {/* Statistiques rapides */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <FiStar className="h-5 w-5 text-yellow-500 mr-1" />
                    <span className="text-2xl font-bold text-gray-900">{encadrant.rating}</span>
                  </div>
                  <div className="text-sm text-gray-600">Évaluation</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <FiUsers className="h-5 w-5 text-blue-500 mr-1" />
                    <span className="text-2xl font-bold text-gray-900">{encadrant.nombreEtudiants}/{encadrant.maxEtudiants}</span>
                  </div>
                  <div className="text-sm text-gray-600">Étudiants</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <FiBookOpen className="h-5 w-5 text-green-500 mr-1" />
                    <span className="text-2xl font-bold text-gray-900">{encadrant.publications}</span>
                  </div>
                  <div className="text-sm text-gray-600">Publications</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <FiAward className="h-5 w-5 text-purple-500 mr-1" />
                    <span className="text-2xl font-bold text-gray-900">{encadrant.experience}</span>
                  </div>
                  <div className="text-sm text-gray-600">Ans d'exp.</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              {encadrant.disponible && (
                <button
                  onClick={() => setShowContactModal(true)}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                >
                  <FiMessageSquare className="h-4 w-4 mr-2" />
                  Demander encadrement
                </button>
              )}
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                <FiMail className="h-4 w-4 mr-2" />
                Contacter
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation par onglets */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon}
                <span className="ml-2">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Contenu des onglets */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* Vue d'ensemble */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Biographie</h3>
                  <p className="text-gray-700 leading-relaxed">{encadrant.bio}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Formation</h3>
                  <div className="space-y-2">
                    {encadrant.diplomes.map((diplome, index) => (
                      <div key={index} className="flex items-center">
                        <FiAward className="h-4 w-4 text-blue-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{diplome}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Projets actuels</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {encadrant.projetsActuels.map((projet, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-start">
                          <FiAward className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-gray-900">{projet}</h4>
                            <p className="text-sm text-gray-600 mt-1">Recherche en cours</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Recherche */}
            {activeTab === 'research' && (
              <motion.div
                key="research"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Publications récentes</h3>
                  <div className="space-y-4">
                    {encadrant.publicationsRecentes.map((pub, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h4 className="font-medium text-gray-900 mb-2">{pub.titre}</h4>
                        <div className="flex items-center text-sm text-gray-600">
                          <FiCalendar className="h-4 w-4 mr-1" />
                          <span className="mr-4">{pub.annee}</span>
                          <FiBookOpen className="h-4 w-4 mr-1" />
                          <span>{pub.revue}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Collaborations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {encadrant.collaborations.map((collab, index) => (
                      <div key={index} className="flex items-center bg-blue-50 p-3 rounded-lg">
                        <FiExternalLink className="h-4 w-4 text-blue-500 mr-3" />
                        <span className="text-gray-700">{collab}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Étudiants */}
            {activeTab === 'students' && (
              <motion.div
                key="students"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Étudiants encadrés</h3>
                  <div className="space-y-4">
                    {encadrant.etudiantsEncadres.map((etudiant, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{etudiant.nom}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            etudiant.statut === 'En cours' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {etudiant.statut}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">{etudiant.sujet}</p>
                        <div className="flex items-center text-sm text-gray-600">
                          <FiCalendar className="h-4 w-4 mr-1" />
                          <span>{etudiant.annee}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Capacité d'encadrement</h4>
                  <div className="flex items-center">
                    <div className="flex-1 bg-blue-200 rounded-full h-3 mr-3">
                      <div 
                        className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${(encadrant.nombreEtudiants / encadrant.maxEtudiants) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-blue-700 font-medium">
                      {encadrant.nombreEtudiants}/{encadrant.maxEtudiants}
                    </span>
                  </div>
                  <p className="text-blue-700 text-sm mt-2">
                    {encadrant.maxEtudiants - encadrant.nombreEtudiants} places disponibles
                  </p>
                </div>
              </motion.div>
            )}

            {/* Contact */}
            {activeTab === 'contact' && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Informations de contact</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <FiMail className="h-5 w-5 text-blue-500 mr-3" />
                        <a href={`mailto:${encadrant.email}`} className="text-blue-600 hover:underline">
                          {encadrant.email}
                        </a>
                      </div>
                      
                      <div className="flex items-center">
                        <FiPhone className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-gray-700">{encadrant.telephone}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <FiMapPin className="h-5 w-5 text-red-500 mr-3" />
                        <span className="text-gray-700">{encadrant.bureau}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <FiClock className="h-5 w-5 text-purple-500 mr-3" />
                        <span className="text-gray-700">{encadrant.heuresConsultation}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Langues parlées</h3>
                    <div className="flex flex-wrap gap-2">
                      {encadrant.langues.map((langue, index) => (
                        <span key={index} className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                          {langue}
                        </span>
                      ))}
                    </div>

                    {encadrant.disponible && (
                      <div className="mt-6">
                        <button
                          onClick={() => setShowContactModal(true)}
                          className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                        >
                          <FiMessageSquare className="h-4 w-4 mr-2" />
                          Demander un rendez-vous
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal de contact */}
      <AnimatePresence>
        {showContactModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Demande d'encadrement</h3>
                  <button
                    onClick={() => setShowContactModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
                
                <p className="text-gray-600 mb-4">
                  Contactez {encadrant.name.split(' ')[encadrant.name.split(' ').length - 1]} pour discuter de votre projet d'encadrement.
                </p>
                
                <div className="space-y-3">
                  <a
                    href={`mailto:${encadrant.email}?subject=Demande d'encadrement&body=Bonjour ${encadrant.name},%0D%0A%0D%0AJe souhaiterais discuter d'une éventuelle collaboration pour l'encadrement de mon projet de fin d'études.%0D%0A%0D%0ACordialement`}
                    className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <FiMail className="h-4 w-4 mr-2" />
                    Envoyer un email
                  </a>
                  
                  <a
                    href={`tel:${encadrant.telephone}`}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FiPhone className="h-4 w-4 mr-2" />
                    Appeler
                  </a>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-blue-700 text-sm">
                    <strong>Heures de consultation :</strong> {encadrant.heuresConsultation}
                  </p>
                  <p className="text-blue-700 text-sm mt-1">
                    <strong>Bureau :</strong> {encadrant.bureau}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EncadrantDetail;