import React, { useState, memo, useMemo, useCallback, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAnneeAcademiqueCourante, isAnneeAcademiqueTerminee } from '../../utils/anneeAcademique';
import { getProfesseurIdByEmail } from '../../models/acteurs/Professeur';
import { hasSoutenancesAssignees } from '../../models/soutenance/Soutenance';
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
  Image,
  FileText,
  Clock,
  Calendar,
  Video,
  MapPin,
  Presentation,
  Gavel,
  Building2,
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
  Target,
  Inbox,
  CalendarCheck
} from 'lucide-react';
import Logo from './Logo';
import { User } from '../../models/auth';

interface ElementMenu {
  nom: string;
  chemin?: string;
  icone: React.ReactNode;
  sousmenu?: (ElementMenu & { cheminProfesseur?: string })[];
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
      'Ressources': path.startsWith('/etudiant/ressources') || path.startsWith('/professeur/ressources'),
      'Assistant IA': path.startsWith('/etudiant/chatbot'),
      'Encadrement': path.startsWith('/candidat/encadrement'),
      'Gestion des classes': false,
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
    
    // 3. Ressources de travail (commun pour étudiants et professeurs)
    { 
      nom: 'Ressources', 
      icone: <Folder className="mr-2 h-5 w-5" />, 
      sousmenu: [
        // Les sous-menus seront filtrés dynamiquement selon le type d'utilisateur
        { nom: 'Personnelles', icone: <Folder className="mr-2 h-4 w-4" />, chemin: '/etudiant/ressources/personnelles', cheminProfesseur: '/professeur/ressources/personnelles' },
        { nom: 'Sauvegardées', icone: <Star className="mr-2 h-4 w-4" />, chemin: '/etudiant/ressources/sauvegardees', cheminProfesseur: '/professeur/ressources/sauvegardees' },
        { nom: 'Bibliothèque numérique', icone: <Library className="mr-2 h-4 w-4" />, chemin: '/etudiant/ressources/mediatheque', cheminProfesseur: '/professeur/ressources/mediatheque' },
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
    
    // Menus pour Professeur
    { nom: 'Sujets', icone: <BookOpen className="mr-2 h-5 w-5" />, chemin: '/sujets-professeurs' },
    { nom: 'Encadrements', icone: <Users className="mr-2 h-5 w-5" />, chemin: '/professeur/encadrements' },
    { nom: 'Disponibilités', icone: <CalendarCheck className="mr-2 h-5 w-5" />, chemin: '/professeur/disponibilites' },
    { nom: 'Espace Jury', icone: <Gavel className="mr-2 h-5 w-5" />, chemin: '/jurie/soutenances' },
    { nom: 'Espace Commission', icone: <FileCheck className="mr-2 h-5 w-5" />, chemin: '/commission' },
    
    // Menus pour Chef de Département / Assistant
    { nom: 'Classes', icone: <Grid className="mr-2 h-5 w-5" />, chemin: '/classes' },
    { nom: 'Étudiants', icone: <Users className="mr-2 h-5 w-5" />, chemin: '/students' },
    { nom: 'Professeurs', icone: <UserCheck className="mr-2 h-5 w-5" />, chemin: '/professors' },
    { nom: 'Salles', icone: <Building2 className="mr-2 h-5 w-5" />, chemin: '/departement/salles' },
    { nom: 'Jury', icone: <Gavel className="mr-2 h-5 w-5" />, chemin: '/departement/jury' },
    { nom: 'Soutenances', icone: <Video className="mr-2 h-5 w-5" />, chemin: '/departement/soutenance' },
    { nom: 'Bibliothèque numérique', icone: <Library className="mr-2 h-5 w-5" />, chemin: '/etudiant/ressources/mediatheque' },
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
  const menusForUser = useMemo(() => {
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
          'Notifications'       // 5. Informations
        ];
      } else {
        // Ordre logique : activité principale → planification → ressources → aide → infos
        menus = [
          'Tableau de bord',
          'Mes Dossiers',        // 1. Activité principale
          'Calendrier',          // 2. Planification
          'Ressources',      // 3. Ressources de travail
          'Assistant IA',        // 4. Assistant et aide
          'Notifications'       // 5. Informations
        ];
      }
    } else if (user.type === 'professeur') {
      // Menus de base pour tous les professeurs
      menus = [
        'Tableau de bord',
        'Ressources',
        'Sujets',
        'Notifications',
        'Assistant IA'
      ];
      
      // Vérifier si l'année académique en cours est terminée
      const anneeCourante = getAnneeAcademiqueCourante();
      const anneeTerminee = isAnneeAcademiqueTerminee(anneeCourante);
      
      // Le chef de département garde toujours ses rôles
      const estChef = user.estChef;
      
      // Vérifier si le professeur a des soutenances assignées pour l'année en cours
      // Un professeur n'est membre du jury actif que s'il a des soutenances assignées
      const idProfesseur = user.email ? getProfesseurIdByEmail(user.email) : undefined;
      const aSoutenancesAssignees = idProfesseur ? hasSoutenancesAssignees(idProfesseur) : false;
      
      // Debug: pour diagnostiquer le problème d'Omar Gueye
      if (user.email === 'jurie@isimemo.edu.sn') {
        console.log('=== SIDEBAR DEBUG OMAR GUEYE ===');
        console.log('user.email:', user.email);
        console.log('idProfesseur:', idProfesseur);
        console.log('anneeCourante:', anneeCourante);
        console.log('anneeTerminee:', anneeTerminee);
        console.log('estChef:', estChef);
        console.log('user.estJurie:', user.estJurie);
        console.log('user.estEncadrant:', user.estEncadrant);
        console.log('aSoutenancesAssignees:', aSoutenancesAssignees);
        
        // Vérifier les conditions
        const conditionJury = user.estJurie && aSoutenancesAssignees && (!anneeTerminee || estChef);
        const conditionEncadrant = user.estEncadrant && (!anneeTerminee || estChef);
        
        console.log('Condition Jury (estJurie && aSoutenancesAssignees && (!anneeTerminee || estChef)):', conditionJury);
        console.log('  - estJurie:', user.estJurie);
        console.log('  - aSoutenancesAssignees:', aSoutenancesAssignees);
        console.log('  - (!anneeTerminee || estChef):', (!anneeTerminee || estChef));
        console.log('Condition Encadrant (estEncadrant && (!anneeTerminee || estChef)):', conditionEncadrant);
        console.log('  - estEncadrant:', user.estEncadrant);
        console.log('  - (!anneeTerminee || estChef):', (!anneeTerminee || estChef));
        console.log('================================');
      }
      
      // Si jury ET a des soutenances assignées ET année académique en cours (pas terminée) : voir Calendrier et Espace Jury
      // Si année terminée, le professeur perd son rôle de jury (sauf chef)
      // Si pas de soutenances assignées, le professeur n'est pas membre du jury actif
      if (user.estJurie && aSoutenancesAssignees && (!anneeTerminee || estChef)) {
        menus.push('Calendrier');
        menus.push('Espace Jury');
      } else {
        // Si pas jury, pas de soutenances assignées ou année terminée : voir Disponibilités et Calendrier normal
        menus.push('Calendrier');
        menus.push('Disponibilités');
      }
      
      // Si encadrant ET année académique en cours (pas terminée) : voir Encadrements
      // Si année terminée, le professeur perd son rôle d'encadrant (sauf chef)
      if (user.estEncadrant && (!anneeTerminee || estChef)) {
        menus.push('Encadrements');
      }
      
      // Debug final pour Omar Gueye
      if (user.email === 'jurie@isimemo.edu.sn') {
        console.log('Menus finaux pour Omar Gueye:', menus);
      }
      
      // Ajouter menus selon les rôles (chef garde toujours ses rôles)
      if (user.estChef) {
        menus = menus.concat([
          'Classes', 'Étudiants', 'Professeurs', 'Salles', 'Jury', 'Soutenances'
        ]);
      }
      // Commission : seulement si année académique en cours (pas terminée) ou chef
      if (user.estCommission && (!anneeTerminee || estChef)) {
        menus.push('Espace Commission');
      }
    } else if (user.type === 'assistant') {
      menus = [
        'Tableau de bord',
        'Classes',
        'Cours',
        'Étudiants',
        'Professeurs',
        'Salles',
        'Bibliothèque numérique',
        'Jury',
        'Soutenances',
        'Notifications',
        'Assistant IA'
      ];
    }
    
    // Supprimer les doublons
    return Array.from(new Set(menus));
  }, [user]);

  if (!estVisible) return null;

  return (
    <div className="w-64 h-full bg-white shadow-lg flex flex-col">
      <div className="p-2 border-b border-gray-200">
        <div className="flex items-center justify-center">
          <Logo />
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
                              // Pour les professeurs, afficher tous les sous-menus (Personnelles, Sauvegardées, Médiathèque)
                              // Pour les étudiants, afficher tous les sous-menus
                              return true;
                            }
                            return true;
                          })
                          .map((sousItem, sousIndex) => {
                            // Utiliser le chemin approprié selon le type d'utilisateur
                            const cheminFinal = (user?.type === 'professeur' && sousItem.cheminProfesseur) 
                              ? sousItem.cheminProfesseur 
                              : sousItem.chemin;
                            const sousItemActif = estActif(cheminFinal);
                            return (
                              <li key={sousIndex}>
                                <Link
                                  to={cheminFinal || '#'}
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

