import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiSearch, 
  FiFilter, 
  FiMail, 
  FiUser, 
  FiEye, 
  FiStar,
  FiBookOpen,
  FiUsers,
  FiAward,
  FiZap,
  FiTarget,
  FiX,
  FiMessageSquare
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

interface Encadrant {
  id: number;
  name: string;
  email: string;
  specialite: string;
  photo: string;
  bio: string;
  grade: 'Professeur' | 'Maître de Conférences' | 'Docteur';
  disponible: boolean;
  nombreEtudiants: number;
  maxEtudiants: number;
  rating: number;
  publications: number;
  projetsActuels: string[];
  experience: number;
  domaines: string[];
}

const mockEncadrants: Encadrant[] = [
  { 
    id: 1, 
    name: 'Pr. Abdoulaye Ndiaye', 
    email: 'abdoulaye.ndiaye@isi.edu.sn', 
    specialite: 'Réseaux et Télécommunications', 
    photo: '/avatars/abdoulaye.jpg', 
    bio: 'Professeur titulaire en réseaux et télécommunications avec plus de 20 ans d\'expérience dans la recherche et l\'enseignement. Expert en sécurité des réseaux et protocoles de communication.',
    grade: 'Professeur',
    disponible: true,
    nombreEtudiants: 8,
    maxEtudiants: 12,
    rating: 4.8,
    publications: 45,
    projetsActuels: ['5G Security', 'IoT Networks', 'Network Optimization'],
    experience: 20,
    domaines: ['Réseaux', 'Sécurité', '5G', 'IoT']
  },
  { 
    id: 2, 
    name: 'Dr. Fatou Diop', 
    email: 'fatou.diop@isi.edu.sn', 
    specialite: 'Intelligence Artificielle', 
    photo: '/avatars/fatou.jpg', 
    bio: 'Docteure en Intelligence Artificielle, spécialisée dans l\'apprentissage automatique et le traitement du langage naturel. Consultante pour plusieurs entreprises tech.',
    grade: 'Docteur',
    disponible: true,
    nombreEtudiants: 6,
    maxEtudiants: 10,
    rating: 4.9,
    publications: 32,
    projetsActuels: ['NLP for African Languages', 'Computer Vision', 'Deep Learning'],
    experience: 12,
    domaines: ['IA', 'Machine Learning', 'NLP', 'Computer Vision']
  },
  { 
    id: 3, 
    name: 'Pr. Moussa Sarr', 
    email: 'moussa.sarr@isi.edu.sn', 
    specialite: 'Big Data et Analyse', 
    photo: '/avatars/moussa.jpg', 
    bio: 'Professeur en analyse de données massives et systèmes distribués. Directeur du laboratoire de recherche en Big Data de l\'université.',
    grade: 'Professeur',
    disponible: false,
    nombreEtudiants: 12,
    maxEtudiants: 12,
    rating: 4.7,
    publications: 58,
    projetsActuels: ['Distributed Systems', 'Data Mining', 'Cloud Analytics'],
    experience: 18,
    domaines: ['Big Data', 'Hadoop', 'Spark', 'Data Mining']
  },
  { 
    id: 4, 
    name: 'Dr. Mariama Ba', 
    email: 'mariama.ba@isi.edu.sn', 
    specialite: 'Cybersécurité', 
    photo: '/avatars/mariama.jpg', 
    bio: 'Chercheuse en cybersécurité et cryptographie. Experte en sécurité des applications web et audit de sécurité.',
    grade: 'Docteur',
    disponible: true,
    nombreEtudiants: 4,
    maxEtudiants: 8,
    rating: 4.6,
    publications: 28,
    projetsActuels: ['Blockchain Security', 'Web Security', 'Cryptography'],
    experience: 10,
    domaines: ['Cybersécurité', 'Cryptographie', 'Audit', 'Blockchain']
  },
  { 
    id: 5, 
    name: 'Pr. Ibrahima Kane', 
    email: 'ibrahima.kane@isi.edu.sn', 
    specialite: 'Cloud Computing', 
    photo: '/avatars/ibrahima.jpg', 
    bio: 'Professeur spécialisé en cloud computing et architectures distribuées. Consultant pour des projets de migration cloud dans plusieurs entreprises.',
    grade: 'Professeur',
    disponible: true,
    nombreEtudiants: 7,
    maxEtudiants: 10,
    rating: 4.8,
    publications: 41,
    projetsActuels: ['Serverless Computing', 'Container Orchestration', 'Edge Computing'],
    experience: 15,
    domaines: ['Cloud', 'AWS', 'Azure', 'DevOps']
  },
  {
    id: 6,
    name: 'Dr. Aïssatou Seck',
    email: 'aissatou.seck@isi.edu.sn',
    specialite: 'Développement Web',
    photo: '/avatars/aissatou.jpg',
    bio: 'Maître de conférences en développement web et technologies frontend. Spécialisée en frameworks JavaScript modernes et UX/UI.',
    grade: 'Maître de Conférences',
    disponible: true,
    nombreEtudiants: 5,
    maxEtudiants: 9,
    rating: 4.7,
    publications: 22,
    projetsActuels: ['React Native Apps', 'Progressive Web Apps', 'UI/UX Research'],
    experience: 8,
    domaines: ['JavaScript', 'React', 'Node.js', 'UX/UI']
  }
];

const Encadrants: React.FC = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedSpecialite, setSelectedSpecialite] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'experience' | 'disponibilite'>('name');
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [projectTopic, setProjectTopic] = useState('');
  const navigate = useNavigate();

  const getAISuggestions = (topic: string) => {
    if (!topic.trim()) return [];
    
    const topicLower = topic.toLowerCase();
    const suggestions = mockEncadrants
      .filter(e => e.disponible)
      .map(encadrant => {
        let score = 0;
        let reasons = [];
        
        // Analyse de correspondance avec les domaines
        encadrant.domaines.forEach(domaine => {
          if (topicLower.includes(domaine.toLowerCase())) {
            score += 30;
            reasons.push(`Expert en ${domaine}`);
          }
        });
        
        // Analyse de correspondance avec la spécialité
        if (topicLower.includes(encadrant.specialite.toLowerCase())) {
          score += 25;
          reasons.push(`Spécialiste en ${encadrant.specialite}`);
        }
        
        // Analyse des projets actuels
        encadrant.projetsActuels.forEach(projet => {
          if (topicLower.includes(projet.toLowerCase()) || 
              projet.toLowerCase().includes(topicLower)) {
            score += 20;
            reasons.push(`Travaille actuellement sur: ${projet}`);
          }
        });
        
        // Bonus pour l'expérience et les publications
        if (encadrant.experience > 15) {
          score += 10;
          reasons.push('Expérience approfondie');
        }
        
        if (encadrant.publications > 40) {
          score += 10;
          reasons.push('Très actif en recherche');
        }
        
        // Bonus pour la note élevée
        if (encadrant.rating >= 4.8) {
          score += 15;
          reasons.push('Excellente évaluation étudiante');
        }
        
        // Malus si proche de la capacité max
        const ratio = encadrant.nombreEtudiants / encadrant.maxEtudiants;
        if (ratio > 0.8) {
          score -= 10;
        }
        
        return {
          encadrant,
          score,
          reasons: reasons.slice(0, 3), // Limiter à 3 raisons principales
          matchPercentage: Math.min(100, Math.max(0, score))
        };
      })
      .filter(suggestion => suggestion.score > 20)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    
    return suggestions;
  };
  
  const aiSuggestions = getAISuggestions(projectTopic);
  // Extraire les spécialités uniques
  const specialites = Array.from(new Set(mockEncadrants.map(e => e.specialite)));
  const grades = Array.from(new Set(mockEncadrants.map(e => e.grade)));

  // Filtrer les encadrants
  const filteredEncadrants = mockEncadrants
    .filter(e => {
      const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
                           e.specialite.toLowerCase().includes(search.toLowerCase()) ||
                           e.domaines.some(d => d.toLowerCase().includes(search.toLowerCase()));
      
      const matchesSpecialite = selectedSpecialite === 'all' || e.specialite === selectedSpecialite;
      const matchesGrade = selectedGrade === 'all' || e.grade === selectedGrade;
      const matchesAvailability = !showAvailableOnly || e.disponible;
      
      return matchesSearch && matchesSpecialite && matchesGrade && matchesAvailability;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'experience':
          return b.experience - a.experience;
        case 'disponibilite':
          return Number(b.disponible) - Number(a.disponible);
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getAvailabilityColor = (encadrant: Encadrant) => {
    if (!encadrant.disponible) return 'bg-red-100 text-red-800';
    const ratio = encadrant.nombreEtudiants / encadrant.maxEtudiants;
    if (ratio >= 0.8) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getAvailabilityText = (encadrant: Encadrant) => {
    if (!encadrant.disponible) return 'Complet';
    const ratio = encadrant.nombreEtudiants / encadrant.maxEtudiants;
    if (ratio >= 0.8) return 'Bientôt complet';
    return 'Disponible';
  };

  return (
    <div>
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Liste des Encadrants</h1>
          <p className="text-gray-600 mt-1">
            Trouvez l'encadrant idéal pour votre projet de fin d'études
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAISuggestions(!showAISuggestions)}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              showAISuggestions 
                ? 'bg-purple-500 text-white' 
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            }`}
          >
            <FiZap className="h-4 w-4 mr-2" />
            Suggestions IA
          </button>
                          <div className="text-sm text-gray-600 bg-primary/10 px-3 py-2 rounded-lg">
            {filteredEncadrants.length} encadrant{filteredEncadrants.length > 1 ? 's' : ''} trouvé{filteredEncadrants.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Suggestions IA */}
      <AnimatePresence>
        {showAISuggestions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6 mb-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-semibold text-purple-800 flex items-center">
                  <FiZap className="h-5 w-5 mr-2" />
                  Assistant IA - Suggestions Personnalisées
                </h2>
                <p className="text-purple-600 text-sm mt-1">
                  Décrivez votre sujet de mémoire pour obtenir des recommandations d'encadrants
                </p>
              </div>
              <button
                onClick={() => setShowAISuggestions(false)}
                className="text-purple-400 hover:text-purple-600"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-purple-700 mb-2">
                Sujet ou domaine de votre mémoire
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ex: Application mobile d'e-commerce avec IA, Sécurité blockchain, Analyse de données IoT..."
                  value={projectTopic}
                  onChange={(e) => setProjectTopic(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <FiTarget className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-4 w-4" />
              </div>
            </div>

            {aiSuggestions.length > 0 ? (
              <div>
                <h3 className="font-medium text-purple-800 mb-3">
                  Encadrants recommandés pour votre projet :
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {aiSuggestions.map((suggestion, index) => (
                    <motion.div
                      key={suggestion.encadrant.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-lg p-4 border border-purple-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          {getInitials(suggestion.encadrant.name)}
                        </div>
                        <div className="ml-3 flex-1">
                          <h4 className="font-semibold text-gray-800 text-sm">{suggestion.encadrant.name}</h4>
                          <div className="flex items-center">
                            <span className="text-xs text-purple-600 font-medium">
                              {suggestion.matchPercentage}% compatible
                            </span>
                            <div className="ml-2 flex">
                              {[...Array(5)].map((_, i) => (
                                <FiStar
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < Math.round(suggestion.encadrant.rating)
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1 mb-3">
                        {suggestion.reasons.map((reason, i) => (
                          <div key={i} className="flex items-center text-xs text-gray-600">
                            <span className="w-1 h-1 bg-purple-400 rounded-full mr-2"></span>
                            {reason}
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/encadrants/${suggestion.encadrant.id}`)}
                          className="flex-1 px-3 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600 transition-colors"
                        >
                          Voir profil
                        </button>
                        <button
                          onClick={() => navigate(`/encadrants/${suggestion.encadrant.id}/demande`)}
                          className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors"
                        >
                          Contacter
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : projectTopic.trim() ? (
              <div className="bg-white rounded-lg p-4 border border-purple-200 text-center">
                <FiMessageSquare className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <p className="text-purple-600 text-sm">
                  Aucune correspondance trouvée. Essayez avec des mots-clés plus généraux ou consultez la liste complète.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-4 border border-purple-200 text-center">
                <FiTarget className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <p className="text-purple-600 text-sm">
                  Saisissez votre sujet de mémoire pour obtenir des suggestions personnalisées
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
                          <div className="text-2xl font-bold text-primary">{mockEncadrants.length}</div>
          <div className="text-sm text-gray-600">Total encadrants</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-green-600">
            {mockEncadrants.filter(e => e.disponible).length}
          </div>
          <div className="text-sm text-gray-600">Disponibles</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-purple-600">{specialites.length}</div>
          <div className="text-sm text-gray-600">Spécialités</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-orange-600">
            {(mockEncadrants.reduce((sum, e) => sum + e.rating, 0) / mockEncadrants.length).toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">Note moyenne</div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Recherche */}
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher par nom, spécialité..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>

          {/* Spécialité */}
          <select
            value={selectedSpecialite}
            onChange={(e) => setSelectedSpecialite(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">Toutes les spécialités</option>
            {specialites.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>

          {/* Grade */}
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">Tous les grades</option>
            {grades.map(grade => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>

          {/* Tri */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="name">Trier par nom</option>
            <option value="rating">Trier par note</option>
            <option value="experience">Trier par expérience</option>
            <option value="disponibilite">Trier par disponibilité</option>
          </select>

          {/* Disponibilité */}
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showAvailableOnly}
              onChange={(e) => setShowAvailableOnly(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Disponibles uniquement</span>
          </label>
        </div>
      </div>

      {/* Liste des encadrants */}
      {filteredEncadrants.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
          <FiUsers className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucun encadrant trouvé</h3>
          <p className="text-gray-500">
            Modifiez vos critères de recherche pour voir plus de résultats.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEncadrants.map((encadrant, index) => (
            <motion.div
              key={encadrant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                {/* En-tête avec photo et statut */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {getInitials(encadrant.name)}
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-800 text-lg">{encadrant.name}</h3>
                      <p className="text-sm text-gray-600">{encadrant.grade}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(encadrant)}`}>
                    {getAvailabilityText(encadrant)}
                  </span>
                </div>

                {/* Spécialité */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-800 mb-2">{encadrant.specialite}</h4>
                  <div className="flex flex-wrap gap-1">
                    {encadrant.domaines.slice(0, 3).map(domaine => (
                      <span key={domaine} className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
                        {domaine}
                      </span>
                    ))}
                    {encadrant.domaines.length > 3 && (
                      <span className="text-xs text-gray-500">+{encadrant.domaines.length - 3}</span>
                    )}
                  </div>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <FiStar className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-bold text-gray-800">{encadrant.rating}</span>
                    </div>
                    <div className="text-xs text-gray-600">Évaluation</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <FiAward className="h-4 w-4 text-primary mr-1" />
                      <span className="font-bold text-gray-800">{encadrant.nombreEtudiants}/{encadrant.maxEtudiants}</span>
                    </div>
                    <div className="text-xs text-gray-600">Étudiants</div>
                  </div>
                </div>

                {/* Informations supplémentaires */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <FiBookOpen className="h-4 w-4 mr-2" />
                    <span>{encadrant.publications} publications</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FiAward className="h-4 w-4 mr-2" />
                    <span>{encadrant.experience} ans d'expérience</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FiMail className="h-4 w-4 mr-2" />
                    <span className="truncate">{encadrant.email}</span>
                  </div>
                </div>

                {/* Projets actuels */}
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Projets actuels :</h5>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {encadrant.projetsActuels.slice(0, 2).map(projet => (
                      <li key={projet} className="flex items-center">
                        <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                        {projet}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/encadrants/${encadrant.id}`)}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors text-sm"
                  >
                    <FiEye className="h-4 w-4 mr-2" />
                    Voir profil
                  </button>
                  {encadrant.disponible && (
                    <button
                      onClick={() => navigate(`/encadrants/${encadrant.id}/demande`)}
                      className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                    >
                      Demander
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Information en bas */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-8">
        <h3 className="font-semibold text-primary mb-2">Comment choisir votre encadrant ?</h3>
        <ul className="text-primary/80 text-sm space-y-1">
          <li>• Vérifiez que sa spécialité correspond à votre projet</li>
          <li>• Consultez ses publications et projets en cours</li>
          <li>• Prenez en compte sa disponibilité et son nombre d'étudiants actuel</li>
          <li>• N'hésitez pas à le contacter pour discuter de votre projet</li>
        </ul>
      </div>
    </div>
  );
};

export default Encadrants;