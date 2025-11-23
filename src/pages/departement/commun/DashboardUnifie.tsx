import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  FileText,
  Gavel,
  UserCheck,
  Star,
  Shield,
  GraduationCap,
  Award,
  Eye,
  Edit,
  Send,
  Download,
  Upload,
  ChevronRight,
  BarChart3,
  CalendarDays,
  Settings,
  Archive,
  CheckSquare,
  Zap,
  Target,
  Inbox,
  Video,
  MessageCircle,
  UserPlus,
  BookMarked,
  Timer,
  Building
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { getEncadrementsActifs } from '../../models/dossier/Encadrement';
import { getDemandesEncadrementEnAttente } from '../../models/dossier/DemandeEncadrement';

// Badge Component
const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'info' | 'error' | 'primary';
}> = ({ children, variant = 'info' }) => {
  const styles = {
    success: "bg-green-50 text-green-700 border border-green-200",
    warning: "bg-orange-50 text-orange-700 border border-orange-200",
    info: "bg-blue-50 text-blue-700 border border-blue-200",
    error: "bg-red-50 text-red-600 border border-red-200",
    primary: "bg-navy bg-opacity-10 text-navy border border-navy border-opacity-20"
  };
  
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${styles[variant]}`}>
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
  icon?: React.ReactNode;
}> = ({ children, variant = 'ghost', onClick, size = 'sm', icon }) => {
  const styles = {
    primary: 'bg-navy text-white border border-navy hover:bg-navy-dark',
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
      className={`font-medium transition-colors duration-200 flex items-center ${styles[variant]} ${sizeStyles[size]}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
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
  onClick?: () => void;
};

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  value, 
  icon, 
  iconColor, 
  trend,
  delay = 0,
  onClick 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`bg-white border border-gray-200 p-6 hover:shadow-md transition-all duration-200 ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`${iconColor} p-3 rounded-lg`}>
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

const QuickActionCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  iconColor: string;
  onClick?: () => void;
  badge?: string;
}> = ({ title, description, icon, iconColor, onClick, badge }) => {
  return (
    <div 
      className="bg-white border border-gray-200 p-4 hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <div className={`${iconColor} p-2 rounded-lg mr-3`}>
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 group-hover:text-navy transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
        </div>
        <div className="flex items-center">
          {badge && <Badge variant="primary">{badge}</Badge>}
          <ChevronRight className="h-4 w-4 text-gray-400 ml-2 group-hover:text-navy transition-colors" />
        </div>
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
  badge?: string;
}> = ({ icon, iconColor, title, description, time, badge }) => {
  return (
    <div className="flex items-start pb-4 border-b border-gray-100 last:border-0">
      <div className={`${iconColor} p-2 rounded-lg mr-3`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="font-medium text-gray-900">{title}</p>
          {badge && <Badge variant="warning">{badge}</Badge>}
        </div>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
};

const DashboardUnifie: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès non autorisé</h2>
          <p className="text-gray-600">Veuillez vous connecter pour accéder au tableau de bord.</p>
        </div>
      </div>
    );
  }

  // Génération du titre basé sur les rôles
  const getPageTitle = () => {
    const roles = [];
    if (user?.estChef) roles.push('Chef de département');
    if (user?.estProfesseur) roles.push('Professeur');
    if (user?.estEncadrant) roles.push('Encadrant');
    if (user?.estJurie) roles.push('Membre de jury');
    if (user?.estCommission) roles.push('Commission de validation');
    if (user?.estSecretaire) roles.push('Secrétaire');
    
    return roles.length > 0 ? `Tableau de bord` : 'Tableau de bord';
  };

  // Génération des cartes statistiques
  const renderStatsCards = () => {
    const cards = [];
    let delay = 0.1;

    // Cartes pour Chef de département
    if (user?.estChef) {
      cards.push(
        <DashboardCard 
          key="classes"
          title="Classes gérées" 
          value="8" 
          icon={<Grid className="h-6 w-6" />} 
          iconColor="bg-blue-100 text-blue-600"
          trend={{ value: "+2", up: true }}
          delay={delay}
        />
      );
      delay += 0.1;

      cards.push(
        <DashboardCard 
          key="professeurs"
          title="Professeurs" 
          value="18" 
          icon={<Users className="h-6 w-6" />} 
          iconColor="bg-orange-100 text-orange-600"
          trend={{ value: "+2", up: true }}
          delay={delay}
        />
      );
      delay += 0.1;

      cards.push(
        <DashboardCard 
          key="etudiants-dept"
          title="Étudiants département" 
          value="156" 
          icon={<GraduationCap className="h-6 w-6" />} 
          iconColor="bg-purple-100 text-purple-600"
          trend={{ value: "+12", up: true }}
          delay={delay}
        />
      );
      delay += 0.1;
    }

    // Cartes pour Professeur (pas de cours, seulement publications si nécessaire)
    // Les cours ne sont plus affichés car on n'a plus de cours

    // Cartes pour Encadrant - Afficher uniquement si le professeur a des encadrements actifs
    if (user?.estEncadrant) {
      const idProfesseur = user?.id ? parseInt(user.id) : 0;
      const encadrementsActifs = idProfesseur > 0 ? getEncadrementsActifs(idProfesseur) : [];
      
      if (encadrementsActifs.length > 0) {
        cards.push(
          <DashboardCard 
            key="etudiants-encadres"
            title="Étudiants encadrés" 
            value={encadrementsActifs.length.toString()} 
            icon={<UserCheck className="h-6 w-6" />} 
            iconColor="bg-emerald-100 text-emerald-600"
            trend={{ value: "+3", up: true }}
            delay={delay}
          />
        );
        delay += 0.1;

        cards.push(
          <DashboardCard 
            key="memoires-cours"
            title="Mémoires en cours" 
            value={encadrementsActifs.length.toString()} 
            icon={<FileText className="h-6 w-6" />} 
            iconColor="bg-cyan-100 text-cyan-600"
            delay={delay}
          />
        );
        delay += 0.1;
      }
    }

    // Cartes pour Jury
    if (user?.estJurie) {
      cards.push(
        <DashboardCard 
          key="soutenances"
          title="Soutenances assignées" 
          value="6" 
          icon={<Gavel className="h-6 w-6" />} 
          iconColor="bg-red-100 text-red-600"
          delay={delay}
        />
      );
      delay += 0.1;

      cards.push(
        <DashboardCard 
          key="evaluations"
          title="Évaluations en attente" 
          value="4" 
          icon={<Star className="h-6 w-6" />} 
          iconColor="bg-yellow-100 text-yellow-600"
          trend={{ value: "+2", up: true }}
          delay={delay}
        />
      );
      delay += 0.1;
    }

    // Cartes pour Commission
    if (user?.estCommission) {
      cards.push(
        <DashboardCard 
          key="sujets-valider"
          title="Sujets à valider" 
          value="15" 
          icon={<CheckSquare className="h-6 w-6" />} 
          iconColor="bg-amber-100 text-amber-600"
          trend={{ value: "+5", up: true }}
          delay={delay}
        />
      );
      delay += 0.1;

      cards.push(
        <DashboardCard 
          key="validations-mois"
          title="Validations ce mois" 
          value="42" 
          icon={<CheckCircle className="h-6 w-6" />} 
          iconColor="bg-lime-100 text-lime-600"
          delay={delay}
        />
      );
      delay += 0.1;
    }

    // Cartes pour Secrétaire
    if (user?.estSecretaire) {
      cards.push(
        <DashboardCard 
          key="documents"
          title="Documents traités" 
          value="42" 
          icon={<FileText className="h-6 w-6" />} 
          iconColor="bg-slate-100 text-slate-600"
          trend={{ value: "+8", up: true }}
          delay={delay}
        />
      );
      delay += 0.1;

      cards.push(
        <DashboardCard 
          key="convocations"
          title="Convocations envoyées" 
          value="28" 
          icon={<Send className="h-6 w-6" />} 
          iconColor="bg-pink-100 text-pink-600"
          delay={delay}
        />
      );
      delay += 0.1;

      cards.push(
        <DashboardCard 
          key="salles-reservees"
          title="Salles réservées" 
          value="15" 
          icon={<Building className="h-6 w-6" />} 
          iconColor="bg-violet-100 text-violet-600"
          delay={delay}
        />
      );
      delay += 0.1;
    }

    return cards;
  };

  // Génération des actions rapides
  const renderQuickActions = () => {
    const actions = [];

    // Actions pour Chef
    if (user?.estChef) {
      actions.push(
        <QuickActionCard
          key="gestion-classes"
          title="Gestion des classes"
          description="Créer, modifier et gérer les classes"
          icon={<Grid className="h-5 w-5" />}
          iconColor="bg-blue-100 text-blue-600"
        />,
        <QuickActionCard
          key="gestion-professeurs"
          title="Gestion des professeurs"
          description="Ajouter et affecter les professeurs"
          icon={<Users className="h-5 w-5" />}
          iconColor="bg-orange-100 text-orange-600"
        />,
        <QuickActionCard
          key="notifications-dept"
          title="Notifications département"
          description="Envoyer des notifications aux professeurs/étudiants"
          icon={<Bell className="h-5 w-5" />}
          iconColor="bg-purple-100 text-purple-600"
        />
      );
    }

    // Actions pour Professeur
    if (user?.estProfesseur) {
      actions.push(
        <QuickActionCard
          key="mediatheque"
          title="Médiathèque"
          description="Publier des documents et ressources"
          icon={<BookMarked className="h-5 w-5" />}
          iconColor="bg-green-100 text-green-600"
        />,
        <QuickActionCard
          key="messagerie-etudiants"
          title="Messagerie étudiants"
          description="Communiquer avec les étudiants"
          icon={<MessageCircle className="h-5 w-5" />}
          iconColor="bg-indigo-100 text-indigo-600"
        />
      );
    }

    // Actions pour Encadrant
    if (user?.estEncadrant) {
      actions.push(
        <QuickActionCard
          key="demandes-encadrement"
          title="Demandes d'encadrement"
          description="Gérer les demandes des étudiants"
          icon={<UserPlus className="h-5 w-5" />}
          iconColor="bg-emerald-100 text-emerald-600"
          badge="3"
        />,
        <QuickActionCard
          key="suivi-memoires"
          title="Suivi des mémoires"
          description="Suivre l'avancement des travaux"
          icon={<BarChart3 className="h-5 w-5" />}
          iconColor="bg-cyan-100 text-cyan-600"
        />,
        <QuickActionCard
          key="organiser-evenement"
          title="Organiser un événement"
          description="Planifier pré-lectures et meetings"
          icon={<CalendarDays className="h-5 w-5" />}
          iconColor="bg-teal-100 text-teal-600"
        />
      );
    }

    // Actions pour Jury
    if (user?.estJurie) {
      actions.push(
        <QuickActionCard
          key="calendrier-soutenances"
          title="Calendrier des soutenances"
          description="Consulter vos soutenances assignées"
          icon={<Calendar className="h-5 w-5" />}
          iconColor="bg-red-100 text-red-600"
        />,
        <QuickActionCard
          key="evaluation-memoires"
          title="Évaluation des mémoires"
          description="Évaluer et noter les mémoires"
          icon={<Star className="h-5 w-5" />}
          iconColor="bg-yellow-100 text-yellow-600"
          badge="4"
        />
      );
    }

    // Actions pour Commission
    if (user?.estCommission) {
      actions.push(
        <QuickActionCard
          key="validation-sujets"
          title="Validation des sujets"
          description="Valider les nouveaux sujets de mémoire"
          icon={<CheckCircle className="h-5 w-5" />}
          iconColor="bg-amber-100 text-amber-600"
          badge="8"
        />,
        <QuickActionCard
          key="suivi-corrections"
          title="Suivi des corrections"
          description="Vérifier les corrections demandées"
          icon={<Edit className="h-5 w-5" />}
          iconColor="bg-lime-100 text-lime-600"
        />
      );
    }

    // Actions pour Secrétaire
    if (user?.estSecretaire) {
      actions.push(
        <QuickActionCard
          key="gestion-documents"
          title="Gestion des documents"
          description="Traiter les documents administratifs"
          icon={<Archive className="h-5 w-5" />}
          iconColor="bg-slate-100 text-slate-600"
        />,
        <QuickActionCard
          key="envoyer-convocations"
          title="Envoyer convocations"
          description="Préparer et envoyer les convocations"
          icon={<Send className="h-5 w-5" />}
          iconColor="bg-pink-100 text-pink-600"
        />,
        <QuickActionCard
          key="planning-salles"
          title="Planning des salles"
          description="Gérer les réservations de salles"
          icon={<Building className="h-5 w-5" />}
          iconColor="bg-violet-100 text-violet-600"
        />
      );
    }

    return actions;
  };

  // Génération des activités récentes
  const renderRecentActivities = () => {
    const activities = [];

    if (user?.estChef) {
      activities.push(
        <ActivityItem
          key="nouveau-professeur"
          icon={<UserPlus className="h-5 w-5" />}
          iconColor="bg-green-100 text-green-600"
          title="Nouveau professeur ajouté"
          description="Dr. Khadija Traore a été ajoutée au département"
          time="Il y a 2 heures"
        />,
        <ActivityItem
          key="validation-planning"
          icon={<CheckCircle className="h-5 w-5" />}
          iconColor="bg-blue-100 text-blue-600"
          title="Planning validé"
          description="Le planning des soutenances de Master 2 a été approuvé"
          time="Il y a 4 heures"
        />
      );
    }

    if (user?.estProfesseur) {
      activities.push(
        <ActivityItem
          key="message-etudiant"
          icon={<MessageSquare className="h-5 w-5" />}
          iconColor="bg-blue-100 text-blue-600"
          title="Message d'étudiant"
          description="3 nouveaux messages d'étudiants"
          time="Il y a 3 heures"
          badge="3"
        />
      );
    }

    if (user?.estEncadrant) {
      activities.push(
        <ActivityItem
          key="demande-encadrement"
          icon={<Bell className="h-5 w-5" />}
          iconColor="bg-orange-100 text-orange-600"
          title="Nouvelle demande d'encadrement"
          description="Amadou Diallo souhaite être encadré par vous"
          time="Il y a 1 heure"
          badge="Nouveau"
        />,
        <ActivityItem
          key="memoire-soumis"
          icon={<FileText className="h-5 w-5" />}
          iconColor="bg-purple-100 text-purple-600"
          title="Mémoire soumis"
          description="Mariama Ba a soumis son premier chapitre"
          time="Il y a 3 heures"
        />
      );
    }

    if (user?.estJurie) {
      activities.push(
        <ActivityItem
          key="nouvelle-soutenance"
          icon={<Gavel className="h-5 w-5" />}
          iconColor="bg-red-100 text-red-600"
          title="Nouvelle soutenance assignée"
          description="Soutenance de Moussa Kane le 25 février 2025"
          time="Il y a 30 minutes"
          badge="Urgent"
        />,
        <ActivityItem
          key="document-evaluation"
          icon={<Download className="h-5 w-5" />}
          iconColor="bg-blue-100 text-blue-600"
          title="Document prêt pour évaluation"
          description="Le mémoire de Fatou Sow est disponible"
          time="Il y a 2 heures"
        />
      );
    }

    if (user?.estCommission) {
      activities.push(
        <ActivityItem
          key="sujet-a-valider"
          icon={<AlertCircle className="h-5 w-5" />}
          iconColor="bg-yellow-100 text-yellow-600"
          title="Nouveau sujet à valider"
          description="'IA appliquée à la cybersécurité' en attente"
          time="Il y a 15 minutes"
          badge="Action requise"
        />,
        <ActivityItem
          key="correction-verifiee"
          icon={<CheckSquare className="h-5 w-5" />}
          iconColor="bg-green-100 text-green-600"
          title="Corrections vérifiées"
          description="Les corrections du mémoire d'Ibrahima sont conformes"
          time="Il y a 1 heure"
        />
      );
    }

    if (user?.estSecretaire) {
      activities.push(
        <ActivityItem
          key="convocation-envoyee"
          icon={<Send className="h-5 w-5" />}
          iconColor="bg-pink-100 text-pink-600"
          title="Convocations envoyées"
          description="28 convocations pour les soutenances de février"
          time="Il y a 1 heure"
        />,
        <ActivityItem
          key="salle-reservee"
          icon={<Building className="h-5 w-5" />}
          iconColor="bg-indigo-100 text-indigo-600"
          title="Salle réservée"
          description="Amphithéâtre A réservé pour le 15 février"
          time="Il y a 2 heures"
        />
      );
    }

    return activities;
  };

  const statsCards = renderStatsCards();
  const quickActions = renderQuickActions();
  const recentActivities = renderRecentActivities();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
              <p className="text-sm text-gray-500 mt-1">
                Bonjour {user?.name} • Département {user?.department}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {user?.estChef && <Badge variant="primary">Chef de département</Badge>}
                {user?.estProfesseur && <Badge variant="success">Professeur</Badge>}
                {user?.estEncadrant && <Badge variant="info">Encadrant</Badge>}
                {user?.estJurie && <Badge variant="error">Membre de jury</Badge>}
                {user?.estCommission && <Badge variant="warning">Commission de validation</Badge>}
                {user?.estSecretaire && <Badge variant="info">Secrétaire</Badge>}
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center text-sm text-gray-600 bg-gray-50 border border-gray-200 px-3 py-2 rounded">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Mis à jour le {new Date().toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        {statsCards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {statsCards}
          </div>
        )}
        
        {/* Quick Actions */}
        {quickActions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white border border-gray-200 p-6 mb-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Actions rapides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickActions}
            </div>
          </motion.div>
        )}
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Recent Activities */}
          {recentActivities.length > 0 && (
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
                {recentActivities}
              </div>
            </motion.div>
          )}
          
          {/* Messages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="bg-white border border-gray-200 p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Messages récents</h2>
              <Badge variant="info">3 non lus</Badge>
            </div>
            
            <div className="space-y-4">
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <SimpleButton variant="secondary" size="md" icon={<MessageSquare className="h-4 w-4" />}>
                Voir tous les messages
              </SimpleButton>
            </div>
          </motion.div>
        </div>

        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-white border border-gray-200 p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Calendrier - Janvier 2025</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendar Grid */}
            <div>
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'].map((day, i) => (
                  <div key={i} className="text-xs font-semibold text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center">
                {/* Empty days */}
                {[...Array(2)].map((_, i) => (
                  <div key={`empty-${i}`} className="p-1">
                    <div className="h-8 w-8"></div>
                  </div>
                ))}
                
                {/* Calendar days */}
                {[...Array(31)].map((_, i) => {
                  const day = i + 1;
                  const isToday = day === 21;
                  const hasEvent = [15, 21, 25, 27, 30].includes(day);
                  
                  return (
                    <div key={day} className="p-1">
                      <div 
                        className={`h-8 w-8 flex items-center justify-center text-sm transition-colors duration-200 rounded ${
                          isToday 
                            ? 'bg-navy text-white' 
                            : hasEvent 
                              ? 'border-2 border-navy text-navy hover:bg-navy hover:text-white' 
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
              <div className="space-y-3">
                {/* Événements conditionnels selon les rôles */}
                {user?.estChef && (
                  <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-blue-900">Réunion des chefs de département</p>
                      <p className="text-xs text-blue-700">25 janvier, 10:00 - 11:30</p>
                    </div>
                  </div>
                )}
                
                
                {user?.estEncadrant && (
                  <div className="flex items-center p-3 bg-emerald-50 border border-emerald-200 rounded">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-emerald-900">Pré-lecture - Amadou Diallo</p>
                      <p className="text-xs text-emerald-700">27 janvier, 14:00 - Salle 102</p>
                    </div>
                  </div>
                )}
                
                {user?.estJurie && (
                  <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-red-900">Soutenance - Moussa Kane</p>
                      <p className="text-xs text-red-700">30 janvier, 14:00 - Amphithéâtre A</p>
                    </div>
                  </div>
                )}
                
                {user?.estCommission && (
                  <div className="flex items-center p-3 bg-amber-50 border border-amber-200 rounded">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-amber-900">Réunion commission validation</p>
                      <p className="text-xs text-amber-700">28 janvier, 15:00 - Salle de conférence</p>
                    </div>
                  </div>
                )}
                
                {user?.estSecretaire && (
                  <div className="flex items-center p-3 bg-violet-50 border border-violet-200 rounded">
                    <div className="w-2 h-2 bg-violet-500 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-violet-900">Préparation convocations</p>
                      <p className="text-xs text-violet-700">26 janvier, 9:00 - Bureau secrétariat</p>
                    </div>
                  </div>
                )}
                
                {/* Événement commun */}
                <div className="flex items-center p-3 bg-gray-50 border border-gray-200 rounded">
                  <div className="w-2 h-2 bg-gray-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Date limite - Soumission des mémoires</p>
                    <p className="text-xs text-gray-700">31 janvier</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Définition des couleurs navy manquantes pour Tailwind
const additionalStyles = `
  .bg-navy { background-color: #1e293b; }
  .text-navy { color: #1e293b; }
  .border-navy { border-color: #1e293b; }
  .bg-navy-dark { background-color: #0f172a; }
  .hover\\:bg-navy:hover { background-color: #1e293b; }
  .hover\\:text-white:hover { color: white; }
  .hover\\:bg-navy-dark:hover { background-color: #0f172a; }
`;

// Injection des styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = additionalStyles;
  document.head.appendChild(styleElement);
}

export default DashboardUnifie;