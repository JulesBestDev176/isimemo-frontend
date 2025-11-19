import React, { useState, memo, useMemo, useCallback, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Grid, 
  MessageSquare, 
  BookOpen, 
  ChevronDown, 
  ChevronRight,
  Home,
  PlusCircle,
  List,
  Edit,
  AlertCircle,
  UserCheck,
  Settings,
  User as UserIcon,
  Image,
  FileText,
  Clock,
  Calendar,
  Video,
  MapPin,
  Presentation,
  Gavel,
  BookMarked,
  Folder,
  Star,
  Library,
  Info,
  TrendingUp,
  Bell,
  LogOut,
  Save,
  Archive,
  Search,
  Pin,
  Download,
  Upload,
  History,
  CheckCircle,
  XCircle,
  FileCheck,
  Target
} from 'lucide-react';
import Logo from './Logo';
import { User } from '../../contexts/AuthContext';

interface ElementMenu {
  nom: string;
  chemin?: string;
  icone: React.ReactNode;
  sousmenu?: ElementMenu[];
}

interface PropsSidebar {
  estVisible: boolean;
  user: User | null;
}

const Sidebar: React.FC<PropsSidebar> = memo(({ estVisible, user }) => {
  const emplacement = useLocation();
  
  // Initialiser les menus ouverts en fonction de l'URL active
  const getInitialMenusOuverts = useCallback(() => {
    const path = emplacement.pathname;
    const menus: { [cle: string]: boolean } = {
      'Ressources': path.startsWith('/etudiant/ressources'),
      'Assistant IA': path.startsWith('/etudiant/chatbot'),
      'Chatbot': path.startsWith('/etudiant/chatbot'),
      'Encadrement': path.startsWith('/candidat/encadrement'),
      'Gestion des classes': false,
      'Gestion des cours': false,
      'Gestion des étudiants': false,
      'Gestion des professeurs': false,
      'Gestion du calendrier': false,
      'Gestion des mémoires': false,
      'Gestion des jurys': false,
      'Gestion des soutenances': false,
      'Notifications': false,
      'Espace Jury': path.startsWith('/jurie'),
      'Espace Commission': path.startsWith('/commission'),
    };
    return menus;
  }, [emplacement.pathname]);
  
  const [menusOuverts, setMenusOuverts] = useState<{ [cle: string]: boolean }>(getInitialMenusOuverts);
  
  // Mettre à jour les menus ouverts quand l'URL change
  useEffect(() => {
    setMenusOuverts(getInitialMenusOuverts());
  }, [emplacement.pathname, getInitialMenusOuverts]);

  const elementsMenu: ElementMenu[] = [
    // Menu principal - toujours visible
    { nom: 'Tableau de bord', chemin: '/dashboard', icone: <Home className="mr-2 h-5 w-5" /> },
    
    // ========== MENUS POUR ÉTUDIANT ==========
    // 1. Activité principale (travail sur les mémoires)
    { 
      nom: 'Mes Dossiers', 
      icone: <FileText className="mr-2 h-5 w-5" />, 
      chemin: '/etudiant/dossiers'
    },
    
    // ========== MENUS POUR CANDIDAT ==========
    // Encadrement pour les candidats
    {
      nom: 'Encadrement',
      icone: <Target className="mr-2 h-5 w-5" />,
      chemin: '/candidat/encadrement'
    },
    
    // 2. Planification (lié aux dossiers et soutenances)
    { 
      nom: 'Calendrier', 
      icone: <Calendar className="mr-2 h-5 w-5" />, 
      chemin: '/etudiant/calendrier'
    },
    
    // 3. Ressources de travail
    { 
      nom: 'Ressources', 
      icone: <Folder className="mr-2 h-5 w-5" />, 
      sousmenu: [
        { nom: 'Personnelles', icone: <Folder className="mr-2 h-4 w-4" />, chemin: '/etudiant/ressources/personnelles' },
        { nom: 'Sauvegardées', icone: <Star className="mr-2 h-4 w-4" />, chemin: '/etudiant/ressources/sauvegardees' },
        { nom: 'Médiathèque', icone: <Library className="mr-2 h-4 w-4" />, chemin: '/etudiant/ressources/mediatheque' },
      ]
    },
    
          // 4. Assistant et aide
          { 
            nom: 'Assistant IA', 
            icone: <MessageSquare className="mr-2 h-5 w-5" />, 
            chemin: '/etudiant/chatbot'
          },
    
    // 5. Informations et communications
    { nom: 'Notifications', icone: <Bell className="mr-2 h-5 w-5" />, chemin: '/etudiant/notifications' },
    
    // 6. Paramètres personnels (en bas)
    { nom: 'Mon Profil', icone: <UserIcon className="mr-2 h-5 w-5" />, chemin: '/etudiant/profil' },
    
    // Menus pour Professeur
    { nom: 'Sujets', icone: <BookOpen className="mr-2 h-5 w-5" />, chemin: '/sujets-professeurs' },
    { nom: 'Espace Encadrant', icone: <UserIcon className="mr-2 h-5 w-5" />, chemin: '/espace-encadrant' },
    { nom: 'Espace Jury', icone: <Gavel className="mr-2 h-5 w-5" />, sousmenu: [
      { nom: 'Soutenances à évaluer', icone: <Video className="mr-2 h-4 w-4" />, chemin: '/jurie/soutenances' },
    ] },
    { nom: 'Espace Commission', icone: <Settings className="mr-2 h-5 w-5" />, sousmenu: [
      { nom: 'Gestion des commissions', icone: <List className="mr-2 h-4 w-4" />, chemin: '/commission/gestion' },
    ] },
    
    // Menus pour Chef de Département / Assistant
    { nom: 'Classes', icone: <Grid className="mr-2 h-5 w-5" />, chemin: '/classes' },
    { nom: 'Étudiants', icone: <Users className="mr-2 h-5 w-5" />, chemin: '/students' },
    { nom: 'Professeurs', icone: <UserCheck className="mr-2 h-5 w-5" />, chemin: '/professors' },
    { nom: 'Cours', icone: <BookOpen className="mr-2 h-5 w-5" />, chemin: '/courses' },
    { nom: 'Jury', icone: <Gavel className="mr-2 h-5 w-5" />, chemin: '/departement/jury' },
    { nom: 'Soutenances', icone: <Video className="mr-2 h-5 w-5" />, chemin: '/departement/soutenance' },
    { nom: 'Médiathèque', icone: <BookMarked className="mr-2 h-5 w-5" />, chemin: '/etudiant/ressources/mediatheque' },
    { nom: 'Chatbot', icone: <MessageSquare className="mr-2 h-5 w-5" />, chemin: '/etudiant/chatbot' },
  ];

  const basculerMenu = useCallback((nomMenu: string) => {
    setMenusOuverts((prev) => ({
      ...prev,
      [nomMenu]: !prev[nomMenu],
    }));
  }, []);

  // Vérifier si un chemin est actif (exact match ou startsWith pour les routes imbriquées)
  const estActif = useCallback((chemin?: string) => {
    if (!chemin) return false;
    const pathname = emplacement.pathname;
    // Match exact
    if (pathname === chemin) return true;
    // Match pour les routes imbriquées (ex: /etudiant/ressources/personnelles correspond à /etudiant/ressources)
    if (chemin !== '/dashboard' && pathname.startsWith(chemin + '/')) return true;
    return false;
  }, [emplacement.pathname]);

  // Vérifier si un sous-menu contient un élément actif
  const sousmenuEstActif = useCallback((sousmenu?: ElementMenu[]) => {
    if (!sousmenu) return false;
    return sousmenu.some(item => estActif(item.chemin));
  }, [estActif]);

  // Vérifier si un menu parent est actif (uniquement son chemin direct, pas ses sous-menus)
  const menuParentEstActif = useCallback((item: ElementMenu) => {
    // Si le parent a un sous-menu actif, ne pas le marquer comme actif
    if (sousmenuEstActif(item.sousmenu)) return false;
    // Sinon, vérifier si le chemin direct du parent est actif
    return estActif(item.chemin);
  }, [estActif, sousmenuEstActif]);

  // Définir les menus par type d'acteur et rôles - Mémorisé pour éviter les recalculs
  const getMenusForUser = useMemo(() => {
    return (user: User | null): string[] => {
    if (!user) return [];
    let menus: string[] = [];
    
    // Menus selon le type d'acteur principal
    if (user.type === 'etudiant') {
      if (user.estCandidat) {
        // Menus spécifiques pour les candidats
        menus = [
          'Tableau de bord',
          'Mes Dossiers',        // 1. Activité principale
          'Encadrement',         // Encadrement candidat
          'Calendrier',          // 2. Planification
          'Ressources',          // 3. Ressources de travail
          'Assistant IA',        // 4. Assistant et aide
          'Notifications',       // 5. Informations
          'Mon Profil'          // 6. Paramètres personnels
        ];
      } else {
        // Ordre logique : activité principale → planification → ressources → aide → infos → paramètres
        menus = [
          'Tableau de bord',
          'Mes Dossiers',        // 1. Activité principale
          'Calendrier',          // 2. Planification
          'Ressources',      // 3. Ressources de travail
          'Assistant IA',        // 4. Assistant et aide
          'Notifications',       // 5. Informations
          'Mon Profil'          // 6. Paramètres personnels
        ];
      }
    } else if (user.type === 'professeur') {
      // Menus de base pour tous les professeurs
      menus = [
        'Tableau de bord',
        'Calendrier',
        'Ressources',
        'Sujets',
        'Notifications',
        'Chatbot'
      ];
      
      // Ajouter menus selon les rôles
      if (user.estChef) {
        menus = menus.concat([
          'Classes', 'Cours', 'Étudiants', 'Professeurs', 'Jury', 'Soutenances'
        ]);
      }
      if (user.estEncadrant) {
        menus.push('Espace Encadrant');
      }
      if (user.estJurie) {
        menus.push('Espace Jury');
      }
      if (user.estCommission) {
        menus.push('Espace Commission');
      }
    } else if (user.type === 'assistant') {
      menus = [
        'Tableau de bord',
        'Classes',
        'Cours',
        'Étudiants',
        'Professeurs',
        'Médiathèque',
        'Jury',
        'Soutenances',
        'Notifications',
        'Chatbot'
      ];
    }
    
      // Supprimer les doublons
      return Array.from(new Set(menus));
    };
  }, []);

  const menusForUser = useMemo(() => getMenusForUser(user), [user, getMenusForUser]);

  if (!estVisible) return null;

  return (
    <div className="w-64 h-full bg-white shadow-lg flex flex-col">
      <div className="p-2 border-b border-gray-200">
        <div className="flex items-center justify-center">
          <Logo />
        </div>
        <div className="mt-[9px] text-xs text-center text-gray-600">
          {user?.type === 'etudiant' 
            ? (user?.estCandidat ? 'Étudiant Candidat' : 'Étudiant')
            : user?.type === 'professeur'
            ? (user?.estChef ? 'Chef de département' :
               user?.estEncadrant ? 'Encadrant' :
               user?.estJurie ? 'Membre du Jury' :
               user?.estCommission ? 'Membre de la Commission' :
               'Professeur')
            : user?.type === 'assistant'
            ? 'Assistant'
            : 'Utilisateur'}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {elementsMenu.filter(item => menusForUser.includes(item.nom)).map((item, index) => (
            <li key={index}>
              {item.sousmenu ? (
                <div className="mb-2">
                  <div className="flex items-center rounded-md transition-colors duration-200">
                    {item.chemin ? (
                      <Link
                        to={item.chemin}
                        className={`flex items-center flex-1 p-2 text-base text-left rounded-md transition-colors duration-200 ${
                          menuParentEstActif(item)
                            ? 'text-primary font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {item.icone}
                        <span className="flex-1">{item.nom}</span>
                      </Link>
                    ) : (
                      <span className={`flex items-center flex-1 p-2 text-base text-left rounded-md ${
                        menuParentEstActif(item)
                          ? 'text-primary font-medium'
                          : 'text-gray-700'
                      }`}>
                        {item.icone}
                        <span className="flex-1">{item.nom}</span>
                      </span>
                    )}
                    <button
                      onClick={() => basculerMenu(item.nom)}
                      className="p-2 rounded-md transition-colors duration-200 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    >
                      {menusOuverts[item.nom] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <AnimatePresence>
                    {menusOuverts[item.nom] && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="pl-6 mt-1 space-y-1"
                      >
                        {item.sousmenu
                          .filter(sousItem => {
                            // Filtrer les sous-menus selon le type d'utilisateur
                            if (item.nom === 'Ressources') {
                              // Pour les professeurs, afficher seulement Médiathèque
                              if (user?.type === 'professeur') {
                                return sousItem.nom === 'Médiathèque';
                              }
                              // Pour les étudiants, afficher tous les sous-menus
                              return true;
                            }
                            return true;
                          })
                          .map((sousItem, sousIndex) => {
                            const sousItemActif = estActif(sousItem.chemin);
                            return (
                              <li key={sousIndex}>
                                <Link
                                  to={sousItem.chemin || '#'}
                                  className={`flex items-center p-2 text-sm rounded-md transition-colors duration-200 ${
                                    sousItemActif
                                      ? 'bg-primary text-white font-medium shadow-sm'
                                      : 'text-gray-700 hover:bg-gray-100'
                                  }`}
                                >
                                  {sousItem.icone}
                                  <span>{sousItem.nom}</span>
                                  {sousItemActif && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>
                                  )}
                                </Link>
                              </li>
                            );
                          })}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  to={item.chemin || '#'}
                  className={`flex items-center p-2 text-base rounded-md transition-colors duration-200 ${
                    estActif(item.chemin)
                      ? 'bg-primary text-white font-medium shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.icone}
                  <span>{item.nom}</span>
                  {estActif(item.chemin) && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>
                  )}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="text-sm text-gray-600 text-center">
          ISIMemo v1.0
        </div>
      </div>
    </div>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;

