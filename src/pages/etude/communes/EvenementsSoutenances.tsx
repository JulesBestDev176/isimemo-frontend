import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Eye, Filter, Search, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

interface Soutenance {
  id: number;
  title: string;
  student: string;
  supervisor: string;
  level: 'licence' | 'master';
  date: string;
  time: string;
  location: string;
  duration: string;
  jury: string[];
  abstract?: string;
  domain: string;
}

const EvenementsSoutenances: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedSoutenance, setSelectedSoutenance] = useState<Soutenance | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Données des soutenances
  const soutenances: Soutenance[] = [
    {
      id: 1,
      title: 'Implémentation d\'une blockchain pour les systèmes bancaires',
      student: 'Aminata Diallo',
      supervisor: 'Dr. Mamadou Ndiaye',
      level: 'master',
      date: '2025-05-20',
      time: '14:00',
      location: 'Amphithéâtre A',
      duration: '2h00',
      jury: ['Dr. Mamadou Ndiaye', 'Prof. Fatou Sow', 'Dr. Ousmane Fall'],
      abstract: 'Cette recherche explore l\'implémentation d\'une solution blockchain adaptée aux spécificités du secteur bancaire sénégalais, en mettant l\'accent sur la sécurité des transactions et l\'interopérabilité avec les systèmes existants.',
      domain: 'Informatique - Blockchain'
    },
    {
      id: 2,
      title: 'Système de gestion intelligente des ressources en eau',
      student: 'Ibrahima Kane',
      supervisor: 'Dr. Aïssatou Seck',
      level: 'master',
      date: '2025-05-22',
      time: '09:00',
      location: 'Salle B12',
      duration: '2h00',
      jury: ['Dr. Aïssatou Seck', 'Prof. Cheikh Diop', 'Dr. Marie Faye'],
      abstract: 'Développement d\'un système IoT pour la surveillance et la gestion optimisée des ressources hydriques dans les zones rurales du Sénégal.',
      domain: 'Génie Civil - IoT'
    },
    {
      id: 3,
      title: 'Application mobile de e-commerce pour les artisans locaux',
      student: 'Fatou Mbaye',
      supervisor: 'Prof. Moussa Thiam',
      level: 'licence',
      date: '2025-05-25',
      time: '10:30',
      location: 'Salle C08',
      duration: '1h30',
      jury: ['Prof. Moussa Thiam', 'Dr. Khadija Ba', 'Dr. Alioune Sarr'],
      abstract: 'Conception et développement d\'une plateforme mobile facilitant la vente en ligne des produits artisanaux sénégalais avec intégration des moyens de paiement locaux.',
      domain: 'Informatique - Mobile'
    },
    {
      id: 4,
      title: 'Analyse de la qualité de l\'air urbain par capteurs connectés',
      student: 'Ousmane Dieng',
      supervisor: 'Dr. Bineta Fall',
      level: 'master',
      date: '2025-05-28',
      time: '15:00',
      location: 'Amphithéâtre B',
      duration: '2h00',
      jury: ['Dr. Bineta Fall', 'Prof. Amadou Diop', 'Dr. Ndeye Cissé'],
      abstract: 'Déploiement d\'un réseau de capteurs IoT pour la surveillance de la qualité de l\'air à Dakar et développement d\'un système d\'alerte précoce.',
      domain: 'Environnement - IoT'
    },
    {
      id: 5,
      title: 'Plateforme de formation en ligne adaptative',
      student: 'Awa Ndiaye',
      supervisor: 'Dr. Modou Sall',
      level: 'licence',
      date: '2025-06-02',
      time: '14:00',
      location: 'Salle A15',
      duration: '1h30',
      jury: ['Dr. Modou Sall', 'Prof. Coumba Diop', 'Dr. Lamine Thioune'],
      abstract: 'Développement d\'une plateforme e-learning avec algorithmes d\'apprentissage adaptatif pour personnaliser les parcours de formation.',
      domain: 'Informatique - IA'
    },
    {
      id: 6,
      title: 'Optimisation énergétique des bâtiments par IA',
      student: 'Cheikh Mboup',
      supervisor: 'Prof. Astou Diallo',
      level: 'master',
      date: '2025-06-05',
      time: '09:30',
      location: 'Salle B20',
      duration: '2h00',
      jury: ['Prof. Astou Diallo', 'Dr. Papa Ndiaye', 'Dr. Rama Sow'],
      abstract: 'Application de l\'intelligence artificielle pour l\'optimisation de la consommation énergétique dans les bâtiments publics au Sénégal.',
      domain: 'Génie Civil - IA'
    }
  ];

  // Filtrer les soutenances
  const filteredSoutenances = soutenances.filter(soutenance => {
    const matchesSearch = soutenance.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         soutenance.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         soutenance.domain.toLowerCase().includes(searchQuery.toLowerCase());
                         
    const matchesLevel = selectedLevel === 'all' || soutenance.level === selectedLevel;
    
    return matchesSearch && matchesLevel;
  });

  const handleSoutenanceClick = (soutenance: Soutenance) => {
    setSelectedSoutenance(soutenance);
    setShowDetailModal(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const levelInfo = {
    licence: { emoji: '🎓', color: 'bg-blue-500', label: 'Licence' },
    master: { emoji: '🎖️', color: 'bg-purple-500', label: 'Master' }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            🎓 Calendrier des Soutenances
          </h1>
          <p className="text-gray-600 mt-1">
            Consultez les soutenances de mémoires à venir - {filteredSoutenances.length} soutenances programmées
          </p>
        </div>
        
        <div className="flex gap-3">
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">Tous les niveaux</option>
            <option value="licence">Licence</option>
            <option value="master">Master</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar avec statistiques */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-sm border p-4 mb-6"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4">📊 Statistiques</h2>
            
            <div className="space-y-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {soutenances.filter(s => s.level === 'licence').length}
                </div>
                <div className="text-sm text-gray-600">Soutenances Licence</div>
              </div>
              
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {soutenances.filter(s => s.level === 'master').length}
                </div>
                <div className="text-sm text-gray-600">Soutenances Master</div>
              </div>
              
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {soutenances.length}
                </div>
                <div className="text-sm text-gray-600">Total Soutenances</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border p-4"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4">🏷️ Domaines</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Informatique</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex justify-between">
                <span>Génie Civil</span>
                <span className="font-medium">2</span>
              </div>
              <div className="flex justify-between">
                <span>Environnement</span>
                <span className="font-medium">1</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Zone principale */}
        <div className="lg:col-span-3">
          {/* Barre de recherche */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-sm border p-4 mb-6"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher par titre, étudiant ou domaine..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </motion.div>

          {/* Liste des soutenances */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm border"
          >
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">
                📅 Soutenances programmées ({filteredSoutenances.length})
              </h2>
            </div>

            {filteredSoutenances.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                🔍 Aucune soutenance trouvée
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredSoutenances.map(soutenance => (
                  <div
                    key={soutenance.id}
                    className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleSoutenanceClick(soutenance)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className={`${levelInfo[soutenance.level].color} text-white px-2 py-1 rounded-full text-xs font-medium mr-3`}>
                            {levelInfo[soutenance.level].emoji} {levelInfo[soutenance.level].label}
                          </span>
                          <h3 className="font-semibold text-gray-800 text-lg">{soutenance.title}</h3>
                        </div>

                        <div className="text-gray-600 mb-3">
                          <div className="flex items-center mb-1">
                            <GraduationCap className="h-4 w-4 mr-2 text-blue-500" />
                            <span className="font-medium">{soutenance.student}</span>
                            <span className="mx-2">•</span>
                            <span>Encadré par {soutenance.supervisor}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-green-500" />
                            <span>{formatDate(soutenance.date)}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-blue-500" />
                            <span>{soutenance.time} ({soutenance.duration})</span>
                          </div>
                          
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-red-500" />
                            <span>{soutenance.location}</span>
                          </div>
                        </div>

                        <div className="mt-3">
                          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                            {soutenance.domain}
                          </span>
                        </div>

                        {soutenance.abstract && (
                          <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                            {soutenance.abstract}
                          </p>
                        )}
                      </div>

                      <button className="text-blue-500 hover:text-blue-700 ml-4">
                        <Eye className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Modal de détail de soutenance */}
      {showDetailModal && selectedSoutenance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <span className={`${levelInfo[selectedSoutenance.level].color} text-white px-3 py-1 rounded-full text-sm font-medium mr-3`}>
                      {levelInfo[selectedSoutenance.level].emoji} {levelInfo[selectedSoutenance.level].label}
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {selectedSoutenance.domain}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedSoutenance.title}</h2>
                  <p className="text-lg text-gray-600">Par {selectedSoutenance.student}</p>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-center text-gray-700">
                    <Calendar className="h-5 w-5 mr-3 text-green-500" />
                    <div>
                      <div className="font-medium">Date</div>
                      <div className="text-sm">{formatDate(selectedSoutenance.date)}</div>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <Clock className="h-5 w-5 mr-3 text-blue-500" />
                    <div>
                      <div className="font-medium">Horaires</div>
                      <div className="text-sm">{selectedSoutenance.time} - Durée: {selectedSoutenance.duration}</div>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <MapPin className="h-5 w-5 mr-3 text-red-500" />
                    <div>
                      <div className="font-medium">Lieu</div>
                      <div className="text-sm">{selectedSoutenance.location}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center text-gray-700">
                    <GraduationCap className="h-5 w-5 mr-3 text-purple-500" />
                    <div>
                      <div className="font-medium">Étudiant(e)</div>
                      <div className="text-sm">{selectedSoutenance.student}</div>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <Users className="h-5 w-5 mr-3 text-orange-500" />
                    <div>
                      <div className="font-medium">Directeur de mémoire</div>
                      <div className="text-sm">{selectedSoutenance.supervisor}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Jury */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  👥 Composition du jury
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {selectedSoutenance.jury.map((member, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg text-center">
                      <div className="font-medium text-gray-800">{member}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {index === 0 ? 'Président' : index === 1 ? 'Rapporteur' : 'Examinateur'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Résumé */}
              {selectedSoutenance.abstract && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    📝 Résumé du mémoire
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">{selectedSoutenance.abstract}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  <Calendar className="mr-2 h-4 w-4" />
                  Ajouter au calendrier
                </button>
                
                <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                  <Users className="mr-2 h-4 w-4" />
                  Assister à la soutenance
                </button>

                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Fermer
                </button>
              </div>

              {/* Note informative */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  💡 <strong>Note:</strong> Les soutenances sont publiques et ouvertes à tous. 
                  Vous êtes invité(e) à y assister pour enrichir vos connaissances et découvrir les travaux de recherche menés par vos pairs.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default EvenementsSoutenances;