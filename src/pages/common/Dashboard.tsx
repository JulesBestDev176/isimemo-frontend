import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Grid,
  BookOpen,
  Bell,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  FileText,
  Gavel,
  UserCheck,
  Star,
  GraduationCap,
  Edit,
  Send,
  Download,
  ChevronRight,
  BarChart3,
  CalendarDays,
  Settings,
  Archive,
  CheckSquare,
  Video,
  MessageCircle,
  UserPlus,
  BookMarked,
  Building,
  Clock,
  TrendingUp,
  Folder,
  Library,
  HelpCircle,
  User as UserIcon,
  Target,
  Award,
  FileCheck,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { StatutDocument, TypeEvenement, getDashboardStats, getDossierStatus, mockMessages, mockTickets, mockEvenements, mockDocuments } from '../../models';
import { getEncadrementsActifs, getEncadrementsByProfesseur } from '../../models/dossier/Encadrement';
import { getDemandesEncadrementEnAttente } from '../../models/dossier/DemandeEncadrement';
import { PhaseTicket, getTicketsByEncadrement } from '../../models/dossier/Ticket';
import { StatutDossierMemoire } from '../../models';
import { getDashboardProfesseurBaseCards } from '../../components/dashboard/DashboardProfesseurBase';
import { getDashboardEncadrantCards } from '../../components/dashboard/DashboardEncadrant';
import { getDashboardJuryCards } from '../../components/dashboard/DashboardJury';
import { getDashboardCommissionCards } from '../../components/dashboard/DashboardCommission';
import { getAnneeAcademiqueCourante, isAnneeAcademiqueTerminee } from '../../utils/anneeAcademique';

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

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
    return 'Tableau de bord';
  };

  // Génération des cartes statistiques
  const renderStatsCards = () => {
    const cards = [];
    let delay = 0.1;

    // Cartes pour Étudiant - Basées sur le diagramme de classes
    if (user?.type === 'etudiant') {
      const stats = getDashboardStats();

      // Cartes spécifiques pour Candidat
      if (user?.estCandidat) {
        // 1. Tickets en cours
        cards.push(
          <DashboardCard
            key="tickets"
            title="Tickets actifs"
            value="3"
            icon={<AlertCircle className="h-6 w-6" />}
            iconColor="bg-primary-100 text-primary-700"
            delay={delay}
            onClick={() => navigate('/etudiant/dossiers')}
          />
        );
        delay += 0.1;

        // 2. Dossiers en cours
        cards.push(
          <DashboardCard
            key="dossiers-candidat"
            title="Dossiers en cours"
            value={stats.dossiersCount.toString()}
            icon={<Folder className="h-6 w-6" />}
            iconColor="bg-primary-100 text-primary-700"
            delay={delay}
            onClick={() => navigate('/etudiant/dossiers')}
          />
        );
        delay += 0.1;

        // 3. Documents administratifs
        cards.push(
          <DashboardCard
            key="documents-admin"
            title="Documents administratifs"
            value={stats.documentsCount.toString()}
            icon={<FileCheck className="h-6 w-6" />}
            iconColor="bg-primary-100 text-primary-700"
            delay={delay}
          />
        );
        delay += 0.1;
      } else {
        // Cartes pour étudiant normal
        // 1. Dossiers/Mémoires actifs
        cards.push(
          <DashboardCard
            key="dossiers"
            title="Mes Dossiers"
            value={stats.dossiersCount.toString()}
            icon={<FileText className="h-6 w-6" />}
            iconColor="bg-primary-100 text-primary-700"
            delay={delay}
            onClick={() => navigate('/etudiant/dossiers')}
          />
        );
        delay += 0.1;

        // 2. Documents déposés
        const nouveauxDocuments = 2; // À remplacer par calcul réel depuis l'historique
        cards.push(
          <DashboardCard
            key="documents"
            title="Documents déposés"
            value={stats.documentsCount.toString()}
            icon={<FileCheck className="h-6 w-6" />}
            iconColor="bg-primary-100 text-primary-700"
            trend={{ value: `+${nouveauxDocuments}`, up: true }}
            delay={delay}
          />
        );
        delay += 0.1;

        // 3. Échéances à venir
        cards.push(
          <DashboardCard
            key="echeances"
            title="Échéances"
            value={stats.echeancesCount.toString()}
            icon={<Clock className="h-6 w-6" />}
            iconColor="bg-primary-100 text-primary-700"
            delay={delay}
          />
        );
        delay += 0.1;
      }
    }

    // Cartes pour Chef de département (professeur avec rôle chef)
    if (user?.type === 'professeur' && user?.estChef) {


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

    // Cartes pour Professeur - Composants modulaires selon les rôles
    if (user?.type === 'professeur') {
      const idProfesseur = user?.id ? parseInt(user.id) : 0;
      const anneeCourante = getAnneeAcademiqueCourante();
      const anneeTerminee = isAnneeAcademiqueTerminee(anneeCourante);
      const estChef = user?.estChef;

      // 1. Composants de base pour tous les professeurs
      const baseCards = getDashboardProfesseurBaseCards(delay, navigate);
      cards.push(...baseCards);
      delay += baseCards.length * 0.1;

      // 2. Composants spécifiques pour encadrant (si année académique en cours ou chef)
      if (user?.estEncadrant && (!anneeTerminee || estChef)) {
        const encadrantCards = getDashboardEncadrantCards(idProfesseur, delay, navigate);
        cards.push(...encadrantCards);
        delay += encadrantCards.length * 0.1;
      }

      // 3. Composants spécifiques pour membre du jury (si année académique en cours ou chef)
      if (user?.estJurie && (!anneeTerminee || estChef)) {
        const juryCards = getDashboardJuryCards(user.email, delay, navigate);
        cards.push(...juryCards);
        delay += juryCards.length * 0.1;
      }

      // 4. Composants spécifiques pour commission (si année académique en cours ou chef)
      if (user?.estCommission && (!anneeTerminee || estChef)) {
        const commissionCards = getDashboardCommissionCards(delay, navigate);
        cards.push(...commissionCards);
        delay += commissionCards.length * 0.1;
      }
    }

    // Cartes pour Assistant
    if (user?.type === 'assistant') {
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

    // Actions pour Étudiant - Basées sur la structure du menu
    if (user?.type === 'etudiant') {
      if (user?.estCandidat) {
        // Actions spécifiques pour Candidat basées sur les cas d'utilisation
        actions.push(
          <QuickActionCard
            key="lister-sujets"
            title="Lister les sujets"
            description="Consulter la banque de sujets disponibles"
            icon={<BookOpen className="h-5 w-5" />}
            iconColor="bg-primary-100 text-primary-700"
            onClick={() => navigate('/etudiant/dossiers')}
          />,
          <QuickActionCard
            key="choisir-sujet"
            title="Choisir un sujet"
            description="Sélectionner un sujet pour votre mémoire"
            icon={<Target className="h-5 w-5" />}
            iconColor="bg-primary-100 text-primary-700"
            onClick={() => navigate('/etudiant/dossiers')}
          />,
          <QuickActionCard
            key="choisir-binome"
            title="Choisir un binôme"
            description="Trouver un partenaire pour votre mémoire"
            icon={<Users className="h-5 w-5" />}
            iconColor="bg-primary-100 text-primary-700"
            onClick={() => navigate('/etudiant/dossiers')}
          />,
          <QuickActionCard
            key="choisir-encadrant"
            title="Choisir un encadrant"
            description="Sélectionner votre encadrant pédagogique"
            icon={<UserCheck className="h-5 w-5" />}
            iconColor="bg-primary-100 text-primary-700"
            onClick={() => navigate('/etudiant/dossiers')}
          />,
          <QuickActionCard
            key="consulter-panel"
            title="Consulter le panel"
            description="Voir votre panel d'encadrement"
            icon={<BarChart3 className="h-5 w-5" />}
            iconColor="bg-primary-100 text-primary-700"
            onClick={() => navigate('/etudiant/dossiers')}
          />,
          <QuickActionCard
            key="lister-tickets"
            title="Mes tickets"
            description="Gérer vos tickets de suivi"
            icon={<AlertCircle className="h-5 w-5" />}
            iconColor="bg-primary-100 text-primary-700"
            badge="3"
            onClick={() => navigate('/etudiant/dossiers')}
          />,
          <QuickActionCard
            key="documents-admin"
            title="Documents administratifs"
            description="Soumettre vos documents administratifs"
            icon={<FileCheck className="h-5 w-5" />}
            iconColor="bg-primary-100 text-primary-700"
            onClick={() => navigate('/etudiant/profil')}
          />,
          <QuickActionCard
            key="consulter-feedback"
            title="Consulter les feedbacks"
            description="Voir les retours de votre encadrant"
            icon={<MessageSquare className="h-5 w-5" />}
            iconColor="bg-primary-100 text-primary-700"
            onClick={() => navigate('/etudiant/dossiers')}
          />,
          <QuickActionCard
            key="consulter-dossiers"
            title="Consulter mes dossiers"
            description="Accéder à tous vos dossiers"
            icon={<Folder className="h-5 w-5" />}
            iconColor="bg-primary-100 text-primary-700"
            onClick={() => navigate('/etudiant/dossiers')}
          />
        );
      } else {
        // Actions pour étudiant normal
        actions.push(
          <QuickActionCard
            key="mes-dossiers"
            title="Mes Dossiers"
            description="Gérer vos dossiers de mémoire"
            icon={<FileText className="h-5 w-5" />}
            iconColor="bg-primary-100 text-primary-700"
            onClick={() => navigate('/etudiant/dossiers')}
          />,
          <QuickActionCard
            key="calendrier"
            title="Calendrier"
            description="Voir les événements et soutenances"
            icon={<Calendar className="h-5 w-5" />}
            iconColor="bg-primary-100 text-primary-700"
            onClick={() => navigate('/etudiant/calendrier')}
          />,
          <QuickActionCard
            key="ressources"
            title="Mes Ressources"
            description="Accéder à vos ressources personnelles"
            icon={<Folder className="h-5 w-5" />}
            iconColor="bg-primary-100 text-primary-700"
            onClick={() => navigate('/etudiant/ressources/personnelles')}
          />,
          <QuickActionCard
            key="mediatheque"
            title="Bibliothèque numérique"
            description="Consulter les mémoires et documents"
            icon={<Library className="h-5 w-5" />}
            iconColor="bg-primary-100 text-primary-700"
            onClick={() => navigate('/etudiant/ressources/mediatheque')}
          />,
          <QuickActionCard
            key="assistant-ia"
            title="Assistant IA"
            description="Obtenir de l'aide pour votre mémoire"
            icon={<MessageSquare className="h-5 w-5" />}
            iconColor="bg-primary-100 text-primary-700"
            onClick={() => navigate('/etudiant/chatbot/nouvelle')}
          />,
          <QuickActionCard
            key="notifications"
            title="Notifications"
            description="Voir vos notifications récentes"
            icon={<Bell className="h-5 w-5" />}
            iconColor="bg-primary-100 text-primary-700"
            badge="3"
            onClick={() => navigate('/etudiant/notifications')}
          />
        );
      }
    }

    // Actions pour Chef (professeur avec rôle chef)
    if (user?.type === 'professeur' && user?.estChef) {
      actions.push(

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

    // Actions pour tous les Professeurs
    if (user?.type === 'professeur') {
      actions.push(
        <QuickActionCard
          key="gerer-encadrements"
          title="Gérer les encadrements"
          description="Voir les demandes et étudiants suivis"
          icon={<Users className="h-5 w-5" />}
          iconColor="bg-blue-100 text-blue-600"
          badge="3 demandes"
          onClick={() => navigate('/professeur/encadrements')}
        />,
        <QuickActionCard
          key="calendrier"
          title="Calendrier"
          description="Voir mes soutenances à venir"
          icon={<CalendarDays className="h-5 w-5" />}
          iconColor="bg-green-100 text-green-600"
          onClick={() => navigate('/professeur/calendrier')}
        />,
        <QuickActionCard
          key="mediatheque"
          title="Bibliothèque numérique"
          description="Consulter les mémoires et ressources"
          icon={<Library className="h-5 w-5" />}
          iconColor="bg-green-100 text-green-600"
          onClick={() => navigate('/professeur/mediatheque')}
        />
      );
    }

    // Actions pour Encadrant (professeur avec rôle encadrant)
    if (user?.type === 'professeur' && user?.estEncadrant) {
      actions.push(
        <QuickActionCard
          key="demandes-encadrement"
          title="Demandes d'encadrement"
          description="Gérer les demandes des étudiants"
          icon={<UserPlus className="h-5 w-5" />}
          iconColor="bg-emerald-100 text-emerald-600"
          badge="3"
          onClick={() => navigate('/professeur/demandes')}
        />,
        <QuickActionCard
          key="panels-actifs"
          title="Panels actifs"
          description="Gérer tickets et livrables"
          icon={<Target className="h-5 w-5" />}
          iconColor="bg-cyan-100 text-cyan-600"
          onClick={() => navigate('/professeur/panels')}
        />,
        <QuickActionCard
          key="fiches-suivi"
          title="Fiches de suivi"
          description="Remplir les fiches de suivi"
          icon={<FileText className="h-5 w-5" />}
          iconColor="bg-teal-100 text-teal-600"
          onClick={() => navigate('/professeur/fiches-suivi')}
        />
      );
    }

    // Actions pour Jury (professeur avec rôle jurie)
    if (user?.type === 'professeur' && user?.estJurie) {
      actions.push(
        <QuickActionCard
          key="soutenances-jury"
          title="Soutenances"
          description="Voir mes soutenances assignées"
          icon={<Gavel className="h-5 w-5" />}
          iconColor="bg-red-100 text-red-600"
          onClick={() => navigate('/professeur/soutenances')}
        />,
        <QuickActionCard
          key="pv-confirmer"
          title="PV à confirmer"
          description="Confirmer les procès-verbaux"
          icon={<FileCheck className="h-5 w-5" />}
          iconColor="bg-yellow-100 text-yellow-600"
          badge="2"
          onClick={() => navigate('/professeur/proces-verbaux')}
        />
      );
    }



    // Actions pour Assistant
    if (user?.type === 'assistant') {
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

    if (user?.type === 'etudiant') {
      // Fonction pour formater le temps relatif
      const formatTimeAgo = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 0) {
          return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
        } else if (diffHours > 0) {
          return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
        } else {
          const diffMinutes = Math.floor(diffMs / (1000 * 60));
          return `Il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
        }
      };

      // Formatage pour les dates futures
      const formatTimeUntil = (date: Date) => {
        const now = new Date();
        const diffMs = date.getTime() - now.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'Passé';
        if (diffDays === 0) return 'Aujourd\'hui';
        if (diffDays === 1) return 'Demain';
        return `Dans ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
      };

      // Documents validés récemment
      const documentsValidesRecents = mockDocuments
        .filter(doc => doc.statut === StatutDocument.VALIDE)
        .sort((a, b) => b.dateCreation.getTime() - a.dateCreation.getTime())
        .slice(0, 1);

      // Messages récents
      const messagesRecents = mockMessages
        .sort((a, b) => b.dateEnvoi.getTime() - a.dateEnvoi.getTime())
        .slice(0, 1);

      // Échéances proches
      const echeancesProches = mockEvenements
        .filter(event => event.type === TypeEvenement.ECHANCE && event.dateDebut >= new Date())
        .sort((a, b) => a.dateDebut.getTime() - b.dateDebut.getTime())
        .slice(0, 1);

      // Soutenances
      const soutenances = mockEvenements
        .filter(event => event.type === TypeEvenement.SOUTENANCE)
        .sort((a, b) => a.dateDebut.getTime() - b.dateDebut.getTime())
        .slice(0, 1);

      // Activités spécifiques pour Candidat
      if (user?.estCandidat) {
        // Activités basées sur les cas d'utilisation du candidat
        activities.push(
          <ActivityItem
            key="ticket-en-cours"
            icon={<AlertCircle className="h-5 w-5" />}
            iconColor="bg-primary-100 text-primary-700"
            title="Ticket en cours"
            description="Votre ticket 'En Cours' nécessite une mise à jour"
            time="Il y a 2 heures"
            badge="Action requise"
          />,
          <ActivityItem
            key="feedback-encadrant"
            icon={<MessageSquare className="h-5 w-5" />}
            iconColor="bg-primary-100 text-primary-700"
            title="Nouveau feedback"
            description="Votre encadrant a laissé un commentaire sur votre mémoire"
            time="Il y a 5 heures"
            badge="Nouveau"
          />,
          <ActivityItem
            key="document-admin-soumis"
            icon={<FileCheck className="h-5 w-5" />}
            iconColor="bg-primary-100 text-primary-700"
            title="Document administratif soumis"
            description="Votre document administratif est en attente de validation"
            time="Il y a 1 jour"
          />,
          <ActivityItem
            key="ticket-en-revision"
            icon={<Edit className="h-5 w-5" />}
            iconColor="bg-primary-100 text-primary-700"
            title="Ticket en révision"
            description="Votre mémoire est en cours de révision par l'encadrant"
            time="Il y a 2 jours"
          />
        );

        // Documents validés récents
        documentsValidesRecents.forEach((doc) => {
          activities.push(
            <ActivityItem
              key={`document-valide-${doc.idDocument}`}
              icon={<CheckCircle className="h-5 w-5" />}
              iconColor="bg-primary-100 text-primary-700"
              title="Document validé"
              description={`${doc.titre} a été validé par votre encadrant`}
              time={formatTimeAgo(doc.dateCreation)}
            />
          );
        });
      } else {
        // Activités pour étudiant normal
        // Activités basées sur le diagramme de classes (DossierMemoire, Document, Encadrement, etc.)
        documentsValidesRecents.forEach((doc) => {
          activities.push(
            <ActivityItem
              key={`document-valide-${doc.idDocument}`}
              icon={<CheckCircle className="h-5 w-5" />}
              iconColor="bg-primary-100 text-primary-700"
              title="Document validé"
              description={`${doc.titre} a été validé par votre encadrant`}
              time={formatTimeAgo(doc.dateCreation)}
            />
          );
        });

        messagesRecents.forEach((message) => {
          activities.push(
            <ActivityItem
              key={`message-encadrant-${message.idMessage}`}
              icon={<MessageSquare className="h-5 w-5" />}
              iconColor="bg-primary-100 text-primary-700"
              title="Message de votre encadrant"
              description="Nouveau message dans le panel d'encadrement"
              time={formatTimeAgo(message.dateEnvoi)}
              badge="Nouveau"
            />
          );
        });

        echeancesProches.forEach((event) => {
          const joursRestants = Math.ceil((event.dateDebut.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          activities.push(
            <ActivityItem
              key={`echeance-proche-${event.idEvenement}`}
              icon={<AlertTriangle className="h-5 w-5" />}
              iconColor="bg-primary-100 text-primary-700"
              title="Échéance proche"
              description={`${event.titre} : ${event.dateDebut.toLocaleDateString('fr-FR')}`}
              time={formatTimeUntil(event.dateDebut)}
              badge={joursRestants <= 3 ? "Urgent" : undefined}
            />
          );
        });

        soutenances.forEach((event) => {
          activities.push(
            <ActivityItem
              key={`soutenance-programmee-${event.idEvenement}`}
              icon={<Calendar className="h-5 w-5" />}
              iconColor="bg-primary-100 text-primary-700"
              title="Soutenance programmée"
              description={`Votre soutenance est prévue pour le ${event.dateDebut.toLocaleDateString('fr-FR')}`}
              time={formatTimeAgo(event.dateDebut)}
            />
          );
        });
      }
    }

    if (user?.type === 'professeur' && user?.estChef) {
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

    if (user?.type === 'professeur') {
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

    if (user?.type === 'professeur' && user?.estEncadrant) {
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

    if (user?.type === 'professeur' && user?.estJurie) {
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

    if (user?.type === 'professeur' && user?.estCommission) {
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

    if (user?.type === 'assistant') {
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
                {user?.type === 'etudiant' && (
                  <>
                    <Badge variant="success">Étudiant</Badge>
                    {user?.estCandidat && <Badge variant="info">Candidat</Badge>}
                  </>
                )}
                {user?.type === 'professeur' && (
                  <>
                    <Badge variant="success">Professeur</Badge>
                    {user?.estChef && <Badge variant="primary">Chef de département</Badge>}
                    {user?.estEncadrant && <Badge variant="info">Encadrant</Badge>}
                    {user?.estJurie && <Badge variant="error">Membre de jury</Badge>}
                    {user?.estCommission && <Badge variant="warning">Commission de validation</Badge>}
                  </>
                )}
                {user?.type === 'assistant' && <Badge variant="info">Assistant</Badge>}
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
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              {statsCards}
            </div>
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

        {/* Section spécifique pour les encadrants */}
        {user?.type === 'professeur' && user?.estEncadrant && (() => {
          const idProfesseur = user?.id ? parseInt(user.id) : 0;
          const encadrementsActifs = idProfesseur > 0 ? getEncadrementsActifs(idProfesseur) : [];
          const encadrementActif = encadrementsActifs.length > 0 ? encadrementsActifs[0] : null;

          if (!encadrementActif) return null;

          const tickets = getTicketsByEncadrement(encadrementActif.idEncadrement);
          const ticketsEnCours = tickets.filter(t => t.phase === PhaseTicket.EN_COURS).length;
          const ticketsEnRevision = tickets.filter(t => t.phase === PhaseTicket.EN_REVISION).length;
          const ticketsAfaire = tickets.filter(t => t.phase === PhaseTicket.A_FAIRE).length;

          const dossiers = encadrementActif.dossierMemoire?.candidats || [];
          const dossiersAttention = dossiers.slice(0, 2);

          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white border border-gray-200 p-6 mb-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Mon encadrement</h2>
                <SimpleButton
                  variant="primary"
                  onClick={() => navigate(`/professeur/encadrements/${encadrementActif.idEncadrement}/panel`)}
                >
                  Voir le panel <ChevronRight className="h-4 w-4 ml-1" />
                </SimpleButton>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 p-4 rounded">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 mb-1">Tickets en cours</p>
                      <p className="text-2xl font-semibold text-blue-900">{ticketsEnCours}</p>
                    </div>
                    <AlertCircle className="h-6 w-6 text-blue-600" />
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 p-4 rounded">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-orange-600 mb-1">Tickets en révision</p>
                      <p className="text-2xl font-semibold text-orange-900">{ticketsEnRevision}</p>
                    </div>
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 p-4 rounded">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Tickets à faire</p>
                      <p className="text-2xl font-semibold text-gray-900">{ticketsAfaire}</p>
                    </div>
                    <FileText className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
              </div>

              {dossiersAttention.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Dossiers nécessitant attention</h3>
                  <div className="space-y-3">
                    {dossiersAttention.map((candidat) => (
                      <div
                        key={candidat.idCandidat}
                        className="p-3 border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer rounded"
                        onClick={() => navigate(`/professeur/encadrements/${encadrementActif.idEncadrement}/dossier/${(encadrementActif.dossierMemoire?.idDossierMemoire || 0) * 10 + candidat.idCandidat}`)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {candidat.prenom} {candidat.nom}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {candidat.email}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="warning">En attente</Badge>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {ticketsEnRevision > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tickets nécessitant validation</h3>
                  <div className="bg-orange-50 border border-orange-200 p-4 rounded">
                    <p className="text-sm text-orange-900">
                      <AlertTriangle className="h-4 w-4 inline mr-2" />
                      {ticketsEnRevision} ticket{ticketsEnRevision > 1 ? 's' : ''} en révision nécessitent votre validation.
                    </p>
                    <SimpleButton
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(`/professeur/encadrements/${encadrementActif.idEncadrement}/panel`)}
                      className="mt-3"
                    >
                      Voir les tickets <ChevronRight className="h-4 w-4 ml-1" />
                    </SimpleButton>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })()}

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

          {/* Messages récents pour autres rôles (pas pour étudiant) */}
          {user?.type !== 'etudiant' && (
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
          )}
        </div>

        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-white border border-gray-200 p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Calendrier - {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</h2>

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
                  const isToday = day === new Date().getDate();
                  const hasEvent = [15, 21, 25, 27, 30].includes(day);

                  return (
                    <div key={day} className="p-1">
                      <div
                        className={`h-8 w-8 flex items-center justify-center text-sm transition-colors duration-200 rounded ${isToday
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
                {/* Événements pour Étudiant - Basés sur le diagramme (Soutenance, EvenementCalendrier) */}
                {user?.type === 'etudiant' && (
                  <>
                    {mockEvenements
                      .filter(event => {
                        const now = new Date();
                        const eventDate = event.dateDebut;
                        // Afficher les événements des 30 prochains jours
                        return eventDate >= now && eventDate <= new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
                      })
                      .sort((a, b) => a.dateDebut.getTime() - b.dateDebut.getTime())
                      .slice(0, 3)
                      .map((event) => {
                        const getEventColor = (type: TypeEvenement) => {
                          switch (type) {
                            case TypeEvenement.SOUTENANCE:
                              return 'bg-purple-50 border-purple-200 text-purple-900';
                            case TypeEvenement.ECHANCE:
                              return 'bg-orange-50 border-orange-200 text-orange-900';
                            case TypeEvenement.RENDEZ_VOUS:
                              return 'bg-blue-50 border-blue-200 text-blue-900';
                            default:
                              return 'bg-gray-50 border-gray-200 text-gray-900';
                          }
                        };

                        const getEventDotColor = (type: TypeEvenement) => {
                          switch (type) {
                            case TypeEvenement.SOUTENANCE:
                              return 'bg-purple-500';
                            case TypeEvenement.ECHANCE:
                              return 'bg-orange-500';
                            case TypeEvenement.RENDEZ_VOUS:
                              return 'bg-blue-500';
                            default:
                              return 'bg-gray-500';
                          }
                        };

                        const formatEventDate = (date: Date) => {
                          return date.toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: date.getMonth() === new Date().getMonth() ? 'short' : 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          });
                        };

                        return (
                          <div key={event.idEvenement} className={`flex items-center p-3 ${getEventColor(event.type)} border rounded`}>
                            <div className={`w-2 h-2 ${getEventDotColor(event.type)} rounded-full mr-3`}></div>
                            <div>
                              <p className="text-sm font-medium">{event.titre}</p>
                              <p className="text-xs">
                                {formatEventDate(event.dateDebut)}
                                {event.lieu && ` - ${event.lieu}`}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                  </>
                )}

                {user?.type === 'professeur' && user?.estChef && (
                  <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-blue-900">Réunion des chefs de département</p>
                      <p className="text-xs text-blue-700">25 janvier, 10:00 - 11:30</p>
                    </div>
                  </div>
                )}


                {user?.type === 'professeur' && user?.estEncadrant && (
                  <div className="flex items-center p-3 bg-emerald-50 border border-emerald-200 rounded">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-emerald-900">Pré-lecture - Amadou Diallo</p>
                      <p className="text-xs text-emerald-700">27 janvier, 14:00 - Salle 102</p>
                    </div>
                  </div>
                )}

                {user?.type === 'professeur' && user?.estJurie && (
                  <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-red-900">Soutenance - Moussa Kane</p>
                      <p className="text-xs text-red-700">30 janvier, 14:00 - Amphithéâtre A</p>
                    </div>
                  </div>
                )}

                {user?.type === 'professeur' && user?.estCommission && (
                  <div className="flex items-center p-3 bg-amber-50 border border-amber-200 rounded">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-amber-900">Réunion commission validation</p>
                      <p className="text-xs text-amber-700">28 janvier, 15:00 - Salle de conférence</p>
                    </div>
                  </div>
                )}

                {user?.type === 'assistant' && (
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

export default Dashboard;

