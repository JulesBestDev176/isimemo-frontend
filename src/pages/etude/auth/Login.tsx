import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../../components/Logo';
import { useAuth } from '../../contexts/AuthContext';
import { User, Lock, AlertCircle, GraduationCap } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const [niveau, setNiveau] = useState<'licence' | 'master' | 'autres'>('licence');
  const niveauOptions = [
    { value: 'licence', label: 'Licence', color: 'bg-blue-500' },
    { value: 'master', label: 'Master', color: 'bg-purple-500' },
    { value: 'autres', label: 'Autres', color: 'bg-gray-500' },
  ];

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
      
      if (success) {
        window.location.href = '/dashboard';
      } else {
        setError('Erreur de connexion');
      }
    } catch (err) {
      setError('Une erreur s\'est produite lors de la connexion.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100"
      >
        <motion.div 
          variants={itemVariants} 
          className="mb-6 flex flex-col items-center"
        >
          <Logo size="large" />
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Espace Étudiant
          </h2>
          <p className="mt-2 text-sm text-gray-600 text-center">
            Connectez-vous pour accéder à vos ressources académiques
          </p>
        </motion.div>

        {error && (
          <motion.div
            variants={itemVariants}
            className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-center"
          >
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        <motion.form variants={itemVariants} onSubmit={handleSubmit}>
          {/* Sélection du niveau d'études */}
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email étudiant
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="prenom.nom@etudiant.isimemo.edu.sn"
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
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
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
            className="w-full py-3 px-4 bg-primary hover:bg-primary-700 text-white font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                />
                Connexion en cours...
              </span>
            ) : (
              'Se connecter'
            )}
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
          className="mt-8 text-center text-xs text-gray-600 bg-gray-50 p-4 rounded-lg"
        >
          <p className="font-medium mb-3">🧪 Comptes de test par niveau:</p>
          <div className="space-y-2">
            <div className="bg-blue-50 p-2 rounded border-l-4 border-blue-500">
              <p><span className="font-medium text-blue-700">Licence:</span></p>
              <p className="text-xs">licence@test.com / licence123</p>
            </div>
            <div className="bg-purple-50 p-2 rounded border-l-4 border-purple-500">
              <p><span className="font-medium text-purple-700">Master:</span></p>
              <p className="text-xs">master@test.com / master123</p>
            </div>
            <div className="bg-gray-50 p-2 rounded border-l-4 border-gray-500">
              <p><span className="font-medium text-gray-700">Autres:</span></p>
              <p className="text-xs">autres@test.com / autres123</p>
            </div>
          </div>
          <p className="text-green-600 mt-3 text-xs">
            ✨ Le niveau est détecté automatiquement selon l'email
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-4 text-center text-xs text-gray-500"
        >
          <p>Besoin d'aide? Contactez le secrétariat</p>
          <p className="mt-1">
            📧 secretariat@isimemo.edu.sn | 📞 +221 33 XXX XX XX
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;