import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Panel from './Panel';
import EspaceTravail from './EspaceTravail';

interface Encadrant {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  specialite: string;
  bureau: string;
  telephone: string;
  photo?: string;
}

interface Notification {
  id: number;
  titre: string;
  message: string;
  type: 'Meet' | 'Pré-soutenance' | 'Document' | 'Feedback' | 'Rappel';
  date: string;
  lu: boolean;
  urgent: boolean;
  lienMeet?: string;
  lieu?: string;
  dateRendezVous?: string;
  heureRendezVous?: string;
}

const Encadrement: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'panel' | 'espace-travail'>('panel');

  // Données mockées
  const encadrant: Encadrant = {
    id: 1,
    nom: 'Ndiaye',
    prenom: 'Abdoulaye',
    email: 'abdoulaye.ndiaye@isi.edu.sn',
    specialite: 'Réseaux et Télécommunications',
    bureau: 'Bureau 308, Bâtiment A',
    telephone: '+221 33 123 45 67'
  };

  const notifications: Notification[] = [
    {
      id: 1,
      titre: 'Réunion de suivi programmée',
      message: 'RDV fixé pour le 8 juillet à 14h en visio. Préparez vos questions sur le chapitre 2.',
      type: 'Meet',
      date: '2024-07-04 10:30',
      lu: false,
      urgent: false,
      lienMeet: 'https://meet.google.com/abc-defg-hij',
      dateRendezVous: '2024-07-08',
      heureRendezVous: '14:00'
    },
    {
      id: 2,
      titre: 'Feedback sur votre chapitre 1',
      message: 'J\'ai relu votre introduction. Quelques corrections à apporter. Voir le document annoté.',
      type: 'Feedback',
      date: '2024-07-03 16:45',
      lu: false,
      urgent: false
    },
    {
      id: 3,
      titre: 'Pré-soutenance approche',
      message: 'N\'oubliez pas de préparer votre présentation pour la pré-soutenance du 20 juillet.',
      type: 'Pré-soutenance',
      date: '2024-07-02 09:15',
      lu: true,
      urgent: true,
      lieu: 'Salle de conférence A, Bâtiment principal',
      dateRendezVous: '2024-07-20',
      heureRendezVous: '10:00'
    }
  ];

  const getInitials = (nom: string, prenom?: string) => {
    if (prenom) {
      return `${prenom[0]}${nom[0]}`.toUpperCase();
    }
    return nom.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Encadrement</h1>
          <p className="text-gray-600">Interface de collaboration avec votre encadrant</p>
          <div className="mt-4 flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
              {getInitials(encadrant.nom, encadrant.prenom)}
            </div>
            <div>
              <p className="font-semibold text-gray-900">Encadrant: Prof. {encadrant.prenom} {encadrant.nom}</p>
              <p className="text-gray-600 text-sm">{encadrant.specialite}</p>
            </div>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('panel')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors relative ${
                  activeTab === 'panel'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Panel
                {notifications.filter(n => !n.lu).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.filter(n => !n.lu).length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('espace-travail')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'espace-travail'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Espace de travail
              </button>
            </nav>
          </div>

          {/* Contenu des onglets */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'panel' && <Panel />}
              {activeTab === 'espace-travail' && <EspaceTravail />}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Encadrement;
