import React from 'react';
import { FiUsers, FiGrid, FiBookOpen, FiBell, FiTrendingUp, FiCalendar, FiPieChart, FiActivity } from 'react-icons/fi';
import { motion } from 'framer-motion';

const DashboardCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  trend?: { value: string; up: boolean };
}> = ({ title, value, icon, color, trend }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border border-gray-200 p-6 flex items-center"
    >
      <div className={`rounded-full p-4 ${color} text-white mr-4`}>
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
        {trend && (
          <div className={`text-sm flex items-center mt-1 ${trend.up ? 'text-green-500' : 'text-red-500'}`}>
            <FiTrendingUp className={`mr-1 ${!trend.up ? 'transform rotate-180' : ''}`} />
            <span>{trend.value} depuis le mois dernier</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const Dashboard: React.FC = () => {
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <div className="mt-4 md:mt-0 flex items-center text-sm text-gray-600">
          <FiCalendar className="mr-2" />
          <span>Données mises à jour le 12 mai 2025</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard 
          title="Départements" 
          value="12" 
          icon={<FiBookOpen className="h-6 w-6" />} 
          color="bg-primary"
          trend={{ value: "2 nouveaux", up: true }}
        />
        <DashboardCard 
          title="Chefs de département" 
          value="8" 
          icon={<FiUsers className="h-6 w-6" />} 
          color="bg-green-500"
          trend={{ value: "1 nouveau", up: true }}
        />
        <DashboardCard 
          title="Secrétaires" 
          value="15" 
          icon={<FiUsers className="h-6 w-6" />} 
          color="bg-purple-500"
          trend={{ value: "inchangé", up: true }}
        />
        <DashboardCard 
          title="Salles de classe" 
          value="24" 
          icon={<FiGrid className="h-6 w-6" />} 
          color="bg-blue-400"
          trend={{ value: "2 nouvelles", up: true }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white border border-gray-200 p-6"
        >
          <h2 className="text-xl font-bold mb-4">Statistiques</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Taux d'occupation des salles</span>
                <span className="text-sm font-medium text-gray-700">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Mémoires soumis</span>
                <span className="text-sm font-medium text-gray-700">68%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Validation des notes</span>
                <span className="text-sm font-medium text-gray-700">92%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Personnel actif</span>
                <span className="text-sm font-medium text-gray-700">95%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-400 h-2.5 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">95%</div>
              <div className="text-sm text-gray-600">Taux de réussite global</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">324</div>
              <div className="text-sm text-gray-600">Étudiants inscrits</div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white border border-gray-200 p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Activités récentes</h2>
            <button className="text-sm text-primary hover:underline">Voir tout</button>
          </div>
          
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-start pb-4 border-b border-gray-100 last:border-0">
                <div className="rounded-full bg-blue-100 p-2 text-primary mr-3">
                  {index % 3 === 0 ? (
                    <FiBell className="h-5 w-5" />
                  ) : index % 3 === 1 ? (
                    <FiActivity className="h-5 w-5" />
                  ) : (
                    <FiPieChart className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {index % 3 === 0 
                      ? 'Nouveau département ajouté' 
                      : index % 3 === 1 
                        ? 'Mise à jour des données' 
                        : 'Rapport hebdomadaire généré'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {index % 3 === 0 
                      ? 'Le département de Génie Logiciel a été ajouté au système.' 
                      : index % 3 === 1 
                        ? 'Les horaires de cours ont été mis à jour pour le semestre.' 
                        : 'Le rapport d\'activité hebdomadaire est disponible.'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Il y a {(index + 1) * 2} heures</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white border border-gray-200 p-6"
        >
          <h2 className="text-xl font-bold mb-4">Messages récents</h2>
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-start pb-4 border-b border-gray-100 last:border-0">
                <div className="h-10 w-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {index % 3 === 0 ? 'CD' : index % 3 === 1 ? 'FS' : 'AM'}
                  </span>
                </div>
                <div>
                  <p className="font-medium">
                    {index % 3 === 0 
                      ? 'Chef Département Informatique' 
                      : index % 3 === 1 
                        ? 'Fatou Sow - Secrétaire' 
                        : 'Amadou Mbaye - Département Management'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {index % 3 === 0 
                      ? 'Concernant la réunion de demain...' 
                      : index % 3 === 1 
                        ? 'Veuillez valider les notes suivantes...' 
                        : 'À propos du nouveau programme...'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {index === 0 
                      ? 'Aujourd\'hui, 10:45' 
                      : index === 1 
                        ? 'Aujourd\'hui, 09:15' 
                        : index === 2 
                          ? 'Hier, 15:30' 
                          : index === 3 
                            ? 'Hier, 11:20' 
                            : '10/05/2025, 14:25'}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full py-2 text-center text-sm text-primary hover:bg-gray-50 transition-colors duration-200">
            Voir tous les messages
          </button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white border border-gray-200 p-6"
        >
          <h2 className="text-xl font-bold mb-4">Calendrier</h2>
          
          <div className="mb-4 grid grid-cols-7 gap-1 text-center">
            {['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'].map((day, i) => (
              <div key={i} className="text-xs font-semibold text-gray-500 py-1">
                {day}
              </div>
            ))}
            
            {/* Jours vides avant le début du mois */}
            {[...Array(3)].map((_, i) => (
              <div key={`empty-${i}`} className="p-1">
                <div className="h-8 w-8 rounded-full"></div>
              </div>
            ))}
            
            {/* Jours du mois */}
            {[...Array(31)].map((_, i) => {
              const day = i + 1;
              const isToday = day === 12; // 12 mai 2025
              const hasEvent = [5, 12, 15, 20, 25].includes(day);
              
              return (
                <div key={day} className="p-1">
                  <div 
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-sm ${
                      isToday 
                        ? 'bg-primary text-white' 
                        : hasEvent 
                          ? 'border-2 border-primary text-gray-700' 
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {day}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="space-y-3 mt-6">
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
              <div>
                <p className="text-sm font-medium">Réunion des chefs de département</p>
                <p className="text-xs text-gray-500">15 mai, 10:00 - 11:30</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-green-50">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <div>
                <p className="text-sm font-medium">Date limite - Soumission des mémoires</p>
                <p className="text-xs text-gray-500">20 mai</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
              <div>
                <p className="text-sm font-medium">Conseil d'administration</p>
                <p className="text-xs text-gray-500">25 mai, 14:00 - 16:00</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
