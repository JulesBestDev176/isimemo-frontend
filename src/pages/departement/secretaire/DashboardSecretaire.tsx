import React from 'react';
import { 
  Users, 
  Grid, 
  BookOpen, 
  Bell, 
  TrendingUp, 
  Calendar, 
  PieChart, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

// Badge Component
const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'info' | 'error';
}> = ({ children, variant = 'info' }) => {
  const styles = {
    success: "bg-green-50 text-green-700 border border-green-200",
    warning: "bg-orange-50 text-orange-700 border border-orange-200",
    info: "bg-blue-50 text-blue-700 border border-blue-200",
    error: "bg-red-50 text-red-600 border border-red-200"
  };
  
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
};

// Simple Button Component
const SimpleButton: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  onClick?: () => void;
  size?: 'sm' | 'md';
}> = ({ children, variant = 'ghost', onClick, size = 'sm' }) => {
  const styles = {
    primary: 'bg-blue-600 text-white border border-blue-600 hover:bg-blue-700',
    secondary: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50',
    ghost: 'bg-transparent text-gray-600 border border-transparent hover:bg-gray-50'
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm'
  };
  
  return (
    <button
      onClick={onClick}
      className={`font-medium transition-colors duration-200 ${styles[variant]} ${sizeStyles[size]}`}
    >
      {children}
    </button>
  );
};

type DashboardCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconColor: string;
  trend?: { value: string; up: boolean };
  delay?: number;
};

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  value, 
  icon, 
  iconColor, 
  trend,
  delay = 0 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white border border-gray-200 p-6 hover:shadow-sm transition-shadow duration-200"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`${iconColor} p-3`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center text-sm ${trend.up ? 'text-green-600' : 'text-red-600'}`}>
            {trend.up ? (
              <ArrowUpRight className="h-4 w-4 mr-1" />
            ) : (
              <ArrowDownRight className="h-4 w-4 mr-1" />
            )}
            <span>{trend.value}</span>
          </div>
        )}
      </div>
      
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </motion.div>
  );
};

const StatCard: React.FC<{
  label: string;
  percentage: number;
  color: string;
}> = ({ label, percentage, color }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-900">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 h-2">
        <div 
          className={`h-2 ${color}`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const ActivityItem: React.FC<{
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  description: string;
  time: string;
}> = ({ icon, iconColor, title, description, time }) => {
  return (
    <div className="flex items-start pb-4 border-b border-gray-100 last:border-0">
      <div className={`${iconColor} p-2 mr-3`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
};

const MessageItem: React.FC<{
  initials: string;
  name: string;
  message: string;
  time: string;
  unread?: boolean;
}> = ({ initials, name, message, time, unread = false }) => {
  return (
    <div className="flex items-start pb-4 border-b border-gray-100 last:border-0">
      <div className="h-10 w-10 border border-gray-300 mr-3 flex items-center justify-center">
        <span className="text-sm font-medium text-gray-600">{initials}</span>
      </div>
      <div className="flex-1">
        <div className="flex items-center">
          <p className="font-medium text-gray-900">{name}</p>
          {unread && <div className="w-2 h-2 bg-blue-500 ml-2"></div>}
        </div>
        <p className="text-sm text-gray-600 mt-1">{message}</p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
};

const CalendarEvent: React.FC<{
  title: string;
  time: string;
  color: string;
}> = ({ title, time, color }) => {
  return (
    <div className="flex items-center p-3 bg-gray-50 border border-gray-200 mb-3">
      <div className={`w-2 h-2 ${color} mr-3`}></div>
      <div>
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  );
};

const DashboardChef: React.FC = () => {
  // Mock user data
  const user = { role: 'chef' };
  const isChef = user?.role === 'chef';

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
              <p className="text-sm text-gray-500 mt-1">Vue d'ensemble de votre département</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center text-sm text-gray-600 bg-gray-50 border border-gray-200 px-3 py-2">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Mis à jour le 14 mai 2025</span>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <DashboardCard 
            title="Classes" 
            value="8" 
            icon={<Grid className="h-6 w-6" />} 
            iconColor="bg-blue-100 text-blue-600"
            trend={{ value: "+2", up: true }}
            delay={0.1}
          />
          <DashboardCard 
            title="Cours" 
            value="24" 
            icon={<BookOpen className="h-6 w-6" />} 
            iconColor="bg-green-100 text-green-600"
            trend={{ value: "+4", up: true }}
            delay={0.2}
          />
          <DashboardCard 
            title="Étudiants" 
            value="156" 
            icon={<Users className="h-6 w-6" />} 
            iconColor="bg-purple-100 text-purple-600"
            trend={{ value: "+12", up: true }}
            delay={0.3}
          />
          <DashboardCard 
            title="Professeurs" 
            value="18" 
            icon={<Users className="h-6 w-6" />} 
            iconColor="bg-orange-100 text-orange-600"
            trend={{ value: "+2", up: true }}
            delay={0.4}
          />
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white border border-gray-200 p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Statistiques</h2>
            
            <StatCard label="Taux d'occupation des salles" percentage={85} color="bg-blue-500" />
            <StatCard label="Mémoires soumis" percentage={68} color="bg-green-500" />
            <StatCard label="Validation des notes" percentage={92} color="bg-purple-500" />
            <StatCard label="Personnel actif" percentage={95} color="bg-orange-500" />
            
            <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 border border-gray-200">
                <div className="text-3xl font-bold text-blue-600">95%</div>
                <div className="text-sm text-gray-600">Taux de réussite</div>
              </div>
              <div className="text-center p-4 bg-gray-50 border border-gray-200">
                <div className="text-3xl font-bold text-green-600">324</div>
                <div className="text-sm text-gray-600">Étudiants inscrits</div>
              </div>
            </div>
          </motion.div>
          
          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white border border-gray-200 p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Activités récentes</h2>
              <SimpleButton variant="ghost">Voir tout</SimpleButton>
            </div>
            
            <div className="space-y-4">
              <ActivityItem
                icon={<CheckCircle className="h-5 w-5" />}
                iconColor="bg-green-100 text-green-600"
                title="Nouveau mémoire soumis"
                description="Le mémoire 'Intelligence Artificielle appliquée' a été soumis."
                time="Il y a 2 heures"
              />
              <ActivityItem
                icon={<Clock className="h-5 w-5" />}
                iconColor="bg-blue-100 text-blue-600"
                title="Mise à jour des horaires"
                description="Les horaires de cours ont été mis à jour pour le semestre."
                time="Il y a 4 heures"
              />
              <ActivityItem
                icon={<PieChart className="h-5 w-5" />}
                iconColor="bg-purple-100 text-purple-600"
                title="Rapport hebdomadaire généré"
                description="Le rapport d'activité hebdomadaire est disponible."
                time="Il y a 6 heures"
              />
              <ActivityItem
                icon={<AlertCircle className="h-5 w-5" />}
                iconColor="bg-orange-100 text-orange-600"
                title="Validation requise"
                description="3 notes de cours sont en attente de validation."
                time="Il y a 8 heures"
              />
              <ActivityItem
                icon={<Bell className="h-5 w-5" />}
                iconColor="bg-gray-100 text-gray-600"
                title="Notification système"
                description="Maintenance programmée ce weekend."
                time="Il y a 10 heures"
              />
            </div>
          </motion.div>
        </div>
        
        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Messages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-white border border-gray-200 p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Messages récents</h2>
              <Badge variant="info">5 non lus</Badge>
            </div>
            
            <div className="space-y-4">
              <MessageItem
                initials="CD"
                name="Chef Département Informatique"
                message="Concernant la réunion de demain..."
                time="Aujourd'hui, 10:45"
                unread={true}
              />
              <MessageItem
                initials="FS"
                name="Fatou Sow - Secrétaire"
                message="Veuillez valider les notes suivantes..."
                time="Aujourd'hui, 09:15"
                unread={true}
              />
              <MessageItem
                initials="AM"
                name="Amadou Mbaye - Management"
                message="À propos du nouveau programme..."
                time="Hier, 15:30"
              />
              <MessageItem
                initials="KD"
                name="Khadija Diop - Professeur"
                message="Question sur l'attribution des cours..."
                time="Hier, 11:20"
              />
              <MessageItem
                initials="OS"
                name="Omar Sall - Étudiant"
                message="Demande de report d'examen..."
                time="10/05/2025, 14:25"
              />
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <SimpleButton variant="secondary" size="md">
                <MessageSquare className="h-4 w-4 mr-2" />
                Voir tous les messages
              </SimpleButton>
            </div>
          </motion.div>
          
          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-white border border-gray-200 p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Calendrier - Mai 2025</h2>
            
            {/* Calendar Grid */}
            <div className="mb-6">
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'].map((day, i) => (
                  <div key={i} className="text-xs font-semibold text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center">
                {/* Empty days */}
                {[...Array(3)].map((_, i) => (
                  <div key={`empty-${i}`} className="p-1">
                    <div className="h-8 w-8"></div>
                  </div>
                ))}
                
                {/* Calendar days */}
                {[...Array(31)].map((_, i) => {
                  const day = i + 1;
                  const isToday = day === 14;
                  const hasEvent = [5, 14, 15, 20, 25].includes(day);
                  
                  return (
                    <div key={day} className="p-1">
                      <div 
                        className={`h-8 w-8 flex items-center justify-center text-sm transition-colors duration-200 ${
                          isToday 
                            ? 'bg-blue-600 text-white' 
                            : hasEvent 
                              ? 'border-2 border-blue-500 text-blue-600 hover:bg-blue-50' 
                              : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {day}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Upcoming Events */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Événements à venir</h3>
              <CalendarEvent
                title="Réunion des chefs de département"
                time="15 mai, 10:00 - 11:30"
                color="bg-blue-500"
              />
              <CalendarEvent
                title="Date limite - Soumission des mémoires"
                time="20 mai"
                color="bg-green-500"
              />
              <CalendarEvent
                title="Conseil d'administration"
                time="25 mai, 14:00 - 16:00"
                color="bg-purple-500"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardChef;