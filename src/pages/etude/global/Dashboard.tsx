import React from 'react';
import { 
  BookOpen, 
  MessageSquare, 
  Calendar, 
  User,
  FileText,
  CheckCircle,
  Clock,
  Star,
  TrendingUp,
  Bell,
  Activity,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

type DashboardCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  description?: string;
  delay?: number;
};

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  value, 
  icon, 
  color, 
  description,
  delay = 0 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="card p-6 flex items-center"
    >
      <div className={`rounded-full p-4 ${color} text-white mr-4`}>
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
    </motion.div>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Données spécifiques selon le niveau
  const getStatsForLevel = () => {
    switch(user?.niveau) {
      case 'master':
        return {
          documents: '12',
          discussions: '8',
          progression: '78%',
          notifications: '3'
        };
      case 'autres':
        return {
          documents: '5',
          discussions: '3',
          progression: '45%',
          notifications: '1'
        };
      default: // licence
        return {
          documents: '8',
          discussions: '5',
          progression: '65%',
          notifications: '2'
        };
    }
  };

  const stats = getStatsForLevel();
  
  // Activités selon le niveau
  const getActivitiesForLevel = () => {
    const baseActivities = [
      { type: 'document', text: 'Nouveau document ajouté à la médiathèque', time: '2h' },
      { type: 'chat', text: 'Discussion avec le chatbot archivée', time: '5h' },
      { type: 'calendar', text: 'Événement ajouté au calendrier', time: '1j' }
    ];

    if (user?.niveau === 'licence' || user?.niveau === 'master') {
      return [
        ...baseActivities,
        { type: 'supervisor', text: 'Message de votre encadrant', time: '3h' },
        { type: 'task', text: 'Tâche marquée comme terminée', time: '6h' }
      ];
    }

    return baseActivities;
  };

  const activities = getActivitiesForLevel();

  const levelDisplayName = {
    licence: 'Licence',
    master: 'Master',
    autres: 'Autres'
  };

 

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            Bonjour {user?.name} 
          </h1>
          <p className="text-gray-600 mt-1">
            Étudiant {levelDisplayName[user?.niveau || 'licence']} - Tableau de bord personnel
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center text-sm text-gray-600">
          <Calendar className="mr-2" />
          <span>Dernière mise à jour : Aujourd'hui</span>
        </div>
      </div>
      
      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard 
          title="Documents sauvegardés" 
          value={stats.documents} 
          icon={<BookOpen className="h-6 w-6 text-white" />} 
          color="bg-primary"
          description="Médiathèque"
          delay={0.1}
        />
        <DashboardCard 
          title="Discussions" 
          value={stats.discussions} 
          icon={<MessageSquare className="h-6 w-6" />} 
          color="bg-green-500"
          description="Chatbot"
          delay={0.2}
        />
        <DashboardCard 
          title="Progression" 
          value={stats.progression} 
          icon={<TrendingUp className="h-6 w-6" />} 
          color="bg-purple-500"
          description={user?.niveau === 'autres' ? 'Calendrier' : 'Projet'}
          delay={0.3}
        />
        <DashboardCard 
          title="Notifications" 
          value={stats.notifications} 
          icon={<Bell className="h-6 w-6" />} 
          color="bg-orange-500"
          description="Non lues"
          delay={0.4}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Statistiques personnelles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="card p-6"
        >
          <h2 className="text-xl font-bold mb-4">Mes statistiques</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Documents consultés</span>
                <span className="text-sm font-medium text-gray-700">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Utilisation du chatbot</span>
                <span className="text-sm font-medium text-gray-700">72%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '72%' }}></div>
              </div>
            </div>

            {(user?.niveau === 'licence' || user?.niveau === 'master') && (
              <>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Avancement projet</span>
                    <span className="text-sm font-medium text-gray-700">{stats.progression}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: stats.progression }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Communication encadrant</span>
                    <span className="text-sm font-medium text-gray-700">90%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{stats.documents}</div>
              <div className="text-sm text-gray-600">Documents</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">{stats.discussions}</div>
              <div className="text-sm text-gray-600">Discussions</div>
            </div>
          </div>
        </motion.div>
        
        {/* Activités récentes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="card p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Activités récentes</h2>
            <button className="text-sm text-primary hover:underline">Voir tout</button>
          </div>
          
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start pb-4 border-b border-gray-100 last:border-0">
                <div className="rounded-full bg-primary/10 p-2 text-primary mr-3">
                  {activity.type === 'document' ? (
                    <FileText className="h-5 w-5" />
                  ) : activity.type === 'chat' ? (
                    <MessageSquare className="h-5 w-5" />
                  ) : activity.type === 'calendar' ? (
                    <Calendar className="h-5 w-5" />
                  ) : activity.type === 'supervisor' ? (
                    <Users className="h-5 w-5" />
                  ) : (
                    <CheckCircle className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{activity.text}</p>
                  <p className="text-xs text-gray-500 mt-1">Il y a {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Raccourcis rapides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="card p-6"
        >
          <h2 className="text-xl font-bold mb-4">Accès rapide</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors">
              <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium">Médiathèque</p>
            </button>
            
            <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <MessageSquare className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Chatbot</p>
            </button>
            
            <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <Calendar className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Événements</p>
            </button>
            
            <button className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
              <User className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <p className="text-sm font-medium">Profil</p>
            </button>
            
            {(user?.niveau === 'licence' || user?.niveau === 'master') && (
              <>
                <button className="p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                  <Users className="h-8 w-8 text-indigo-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">Encadrants</p>
                </button>
                
                <button className="p-4 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors">
                  <FileText className="h-8 w-8 text-pink-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">Mon Dossier</p>
                </button>
              </>
            )}
          </div>
        </motion.div>
        
        {/* Calendrier simplifié */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="card p-6"
        >
          <h2 className="text-xl font-bold mb-4">Prochains événements</h2>
          
          <div className="space-y-3">
            {user?.niveau === 'autres' ? (
              <>
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium">Soutenance Master - Salle A12</p>
                    <p className="text-xs text-gray-500">Demain, 14:00 - 16:00</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium">Soutenance Licence - Salle B08</p>
                    <p className="text-xs text-gray-500">20 mai, 10:00 - 12:00</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium">Réunion avec encadrant</p>
                    <p className="text-xs text-gray-500">Demain, 10:00 - 11:00</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium">Date limite - Rapport d'avancement</p>
                    <p className="text-xs text-gray-500">18 mai</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-primary/5 rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium">Séminaire thématique</p>
                    <p className="text-xs text-gray-500">25 mai, 14:00 - 17:00</p>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <button className="mt-4 w-full py-2 text-center text-sm text-primary hover:bg-primary/10 rounded-md transition-colors duration-200">
            Voir le calendrier complet
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;