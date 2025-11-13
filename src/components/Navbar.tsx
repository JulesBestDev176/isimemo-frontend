import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from 'lucide-react';
import NavMotionLink from "./NavMotionLink";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 w-full z-50 bg-white shadow-sm ${isSticky ? 'shadow-md' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo avec design moderne */}
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-navy z-20">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-600 text-white rounded-md flex items-center justify-center shadow-md">
              <span className="material-icons">school</span>
            </div>
            <span>ISI<span className="text-primary">Memo</span></span>
          </Link>

          {/* Icône du menu pour mobile */}
          <motion.button 
            onClick={toggleMenu} 
            className="lg:hidden z-20 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary focus:outline-none hover:bg-primary/20 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </motion.button>

          {/* Navigation desktop - sans icônes */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavMotionLink 
              to="/" 
              className={`relative py-2 px-1 group ${location.pathname === '/' ? 'text-primary font-medium' : 'text-navy hover:text-primary transition-colors'}`}
            >
              <span>Accueil</span>
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full ${location.pathname === '/' ? 'w-full' : ''}`}></span>
            </NavMotionLink>
            
            <NavMotionLink 
              to="/memoires" 
              className={`relative py-2 px-1 group ${location.pathname === '/memoires' ? 'text-primary font-medium' : 'text-navy hover:text-primary transition-colors'}`}
            >
              <span>Mémoires</span>
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full ${location.pathname === '/memoires' ? 'w-full' : ''}`}></span>
            </NavMotionLink>
            
            <NavMotionLink 
              to="/about" 
              className={`relative py-2 px-1 group ${location.pathname === '/about' ? 'text-primary font-medium' : 'text-navy hover:text-primary transition-colors'}`}
            >
              <span>À Propos</span>
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full ${location.pathname === '/about' ? 'w-full' : ''}`}></span>
            </NavMotionLink>
            
            <NavMotionLink 
              to="/contact" 
              className={`relative py-2 px-1 group ${location.pathname === '/contact' ? 'text-primary font-medium' : 'text-navy hover:text-primary transition-colors'}`}
            >
              <span>Contact</span>
              <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full ${location.pathname === '/contact' ? 'w-full' : ''}`}></span>
            </NavMotionLink>
            
            <NavMotionLink 
              to="/login" 
              className="btn-primary px-6 py-2 rounded-full bg-primary text-white hover:bg-primary-600 transition-all shadow-sm hover:shadow-md"
            >
              <span>Se connecter</span>
            </NavMotionLink>
          </div>

          {/* Menu de navigation mobile - CORRIGÉ */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                className="fixed inset-0 bg-blue-100 z-10 lg:hidden flex flex-col"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex flex-col h-full pt-20">
                  {/* Liens de navigation verticaux alignés à gauche */}
                  <div className="flex flex-col w-full px-6 space-y-2">
                    <NavMotionLink 
                      to="/" 
                      className={`flex items-center px-4 py-3 rounded-lg ${location.pathname === '/' ? 'bg-white text-primary font-medium' : 'text-navy'}`} 
                      onClick={closeMenu}
                    >
                      <span className="material-icons mr-4">home</span>
                      <span>Accueil</span>
                    </NavMotionLink>
                    
                    <NavMotionLink 
                      to="/memoires" 
                      className={`flex items-center px-4 py-3 rounded-lg ${location.pathname === '/memoires' ? 'bg-white text-primary font-medium' : 'text-navy'}`} 
                      onClick={closeMenu}
                    >
                      <span className="material-icons mr-4">description</span>
                      <span>Mémoires</span>
                    </NavMotionLink>
                    
                    <NavMotionLink 
                      to="/about" 
                      className={`flex items-center px-4 py-3 rounded-lg ${location.pathname === '/about' ? 'bg-white text-primary font-medium' : 'text-navy'}`} 
                      onClick={closeMenu}
                    >
                      <span className="material-icons mr-4">info</span>
                      <span>À Propos</span>
                    </NavMotionLink>
                    
                    <NavMotionLink 
                      to="/contact" 
                      className={`flex items-center px-4 py-3 rounded-lg ${location.pathname === '/contact' ? 'bg-white text-primary font-medium' : 'text-navy'}`} 
                      onClick={closeMenu}
                    >
                      <span className="material-icons mr-4">mail</span>
                      <span>Contact</span>
                    </NavMotionLink>
                  </div>
                  
                  {/* Bouton fixé en bas */}
                  <div className="mt-auto p-6">
                    <NavMotionLink 
                      to="/login" 
                      className="w-full bg-primary text-white flex items-center justify-center gap-2 py-3 rounded-md shadow-md"
                      onClick={closeMenu}
                    >
                      <span className="material-icons">login</span>
                      <span>Se connecter</span>
                    </NavMotionLink>
                  </div>
                  
                  {/* Image de graduation en arrière-plan */}
                  <div className="absolute bottom-0 right-0 opacity-20 pointer-events-none">
                    <img 
                      src="/path/to/graduation-image.png" 
                      alt="" 
                      className="w-48 h-48 object-contain"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;