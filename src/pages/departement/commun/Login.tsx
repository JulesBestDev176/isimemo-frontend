
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../../components/Logo';
import { useAuth } from '../../contexts/AuthContext';
import { Lock, AlertCircle } from 'lucide-react';
import { User as UserIcon } from 'lucide-react';
import { mockUsers } from '../../contexts/AuthContext';
import type { User } from '../../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();

  // Pour afficher les rôles d'un utilisateur
  const getRoles = (user: any) => {
    const roles = [];
    if (user.estChef) roles.push('Chef');
    if (user.estEncadrant) roles.push('Encadrant');
    if (user.estJurie) roles.push('Jury');
    if (user.estCommission) roles.push('Commission');
    if (user.estSecretaire) roles.push('Secrétaire');
    if (user.estProfesseur && roles.length === 0) roles.push('Professeur');
    return roles.join(', ');
  };

  // Remplir le formulaire avec un utilisateur mock
  const fillUser = (user: any) => {
    setEmail(user.email);
    setPassword(user.password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      
      if (!success) {
        setError('Email ou mot de passe incorrect.');
      }
    } catch (err) {
      setError('Une erreur s\'est produite lors de la connexion.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <motion.div 
          variants={itemVariants} 
          className="mb-6 flex flex-col items-center"
        >
          <Logo size="large" />
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Connexion au Dashboard
          </h2>
          <p className="mt-2 text-sm text-gray-600 text-center">
            Veuillez vous connecter pour accéder à l'administration
          </p>
        </motion.div>

        {error && (
          <motion.div
            variants={itemVariants}
            className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md flex items-center"
          >
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </motion.div>
        )}

        <motion.form variants={itemVariants} onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="email@isimemo.edu.sn"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
          </div>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-primary hover:bg-primary-700 text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Connexion en cours...' : 'Se connecter'}
          </motion.button>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Se souvenir de moi
              </label>
            </div>
            
            <div className="text-sm">
              <a href="#" className="text-primary hover:underline">
                Mot de passe oublié?
              </a>
            </div>
          </div>
        </motion.form>

        <motion.div
          variants={itemVariants}
          className="mt-8 text-center text-sm text-gray-600"
        >
          <p className="mb-2">Utiliser un compte test :</p>
          <div className="space-y-2">
            {mockUsers.map((user: any, idx: number) => (
              <div key={user.email} className="flex items-center justify-between bg-gray-100 rounded p-2">
                <div>
                  <span className="font-semibold">{getRoles(user)}</span>
                  <span className="ml-2 text-xs text-gray-500">{user.email} / {user.password}</span>
                </div>
                <button
                  type="button"
                  className="ml-2 px-2 py-1 text-xs bg-primary text-white rounded hover:bg-primary-700"
                  onClick={() => fillUser(user)}
                >
                  Remplir
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
