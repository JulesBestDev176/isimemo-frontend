import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Menu, 
  Bell, 
  User, 
  Search, 
  Settings, 
  LogOut, 
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  
  // Fermer les menus lorsque l'utilisateur clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Données fictives pour les notifications
  const notifications = [
    {
      id: 1,
      title: 'Nouvelle demande',
      message: 'Un étudiant a soumis un nouveau mémoire pour validation.',
      time: 'Il y a 5 minutes',
      read: false
    },
    {
      id: 2,
      title: 'Réunion planifiée',
      message: 'Réunion de département demain à 10h00.',
      time: 'Il y a 2 heures',
      read: false
    },
    {
      id: 3,
      title: 'Rappel',
      message: 'N\'oubliez pas de valider les notes du semestre.',
      time: 'Hier',
      read: true
    },
  ];

  const dropdownVariants = {
    hidden: { opacity: 0, y: -5, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -5, 
      scale: 0.95,
      transition: {
        duration: 0.15,
        ease: "easeIn"
      }
    }
  };

  return (
    <header className="bg-white shadow-sm z-30 sticky top-0">
      <div className="px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="md:hidden ml-2">
            <Logo />
          </div>
          
          <div className="relative ml-4 hidden md:flex items-center">
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-64 pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
            <Search className="absolute left-3 text-gray-400 h-5 w-5" />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button 
              className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none relative"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-haspopup="true"
              aria-expanded={showNotifications}
            >
              <Bell className="h-6 w-6" />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
              )}
            </button>
            
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="dropdown-menu"
                >
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <h3 className="text-sm font-medium text-navy">Notifications</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {notifications.filter(n => !n.read).length} non lues
                    </p>
                  </div>
                  
                  <div className="py-1 max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-gray-500 text-center">
                        Aucune notification
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`dropdown-item ${!notification.read ? 'bg-blue-50' : ''}`}
                        >
                          <div className={`flex-shrink-0 mr-3 mt-1 ${!notification.read ? 'text-primary' : 'text-gray-400'}`}>
                            <Bell className="h-5 w-5" />
                          </div>
                          <div>
                            <p className={`font-medium ${!notification.read ? 'text-navy' : 'text-gray-700'}`}>
                              {notification.title}
                            </p>
                            <p className="text-gray-600 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="py-1 border-t border-gray-100">
                    <Link 
                      to="/etudiant/notifications" 
                      className="block px-4 py-2 text-sm text-center text-primary hover:bg-gray-50"
                      onClick={() => setShowNotifications(false)}
                    >
                      Voir toutes les notifications
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Profile Menu */}
          <div className="relative" ref={profileMenuRef}>
            <button
              className="flex items-center text-sm font-medium text-gray-700 hover:text-navy focus:outline-none"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              aria-haspopup="true"
              aria-expanded={showProfileMenu}
            >
              <span className="sr-only">Ouvrir le menu utilisateur</span>
              <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
              <span className="ml-2 hidden md:block">{user?.name}</span>
              <ChevronDown className="ml-1 h-4 w-4 hidden md:block" />
            </button>
            
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-50"
                >
                  <div className="py-1">
                    <div className="px-4 py-3">
                      <p className="text-sm font-medium text-navy">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="py-1">
                    <Link to="/etudiant/profil" className="dropdown-item" onClick={() => setShowProfileMenu(false)}>
                      <User className="mr-3 h-5 w-5 text-gray-400" />
                      <span>Mon Profil</span>
                    </Link>
                    <Link to="/etudiant/aide" className="dropdown-item" onClick={() => setShowProfileMenu(false)}>
                      <HelpCircle className="mr-3 h-5 w-5 text-gray-400" />
                      <span>Aide & Support</span>
                    </Link>
                  </div>
                  
                  <div className="py-1">
                    <button className="dropdown-item w-full text-left flex items-center" onClick={() => { setShowProfileMenu(false); handleLogout(); }}>
                      <LogOut className="mr-3 h-5 w-5 text-gray-400" />
                      <span>Se déconnecter</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

