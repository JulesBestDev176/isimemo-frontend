import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="flex justify-center mb-4">
          <FiAlertCircle className="h-20 w-20 text-primary" />
        </div>
        
        <h1 className="text-5xl font-bold mb-4 dark:text-white">404</h1>
        <h2 className="text-2xl font-semibold mb-4 dark:text-gray-200">Page non trouvée</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Link to="/" className="btn-primary">
            <FiHome className="mr-2" /> Retour à l'accueil
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="btn-outline"
          >
            Retour à la page précédente
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
