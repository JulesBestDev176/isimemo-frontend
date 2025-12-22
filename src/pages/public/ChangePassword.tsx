import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { AlertCircle, Eye, EyeOff, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const ChangePassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { fromRegistration, email } = location.state || {};

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password: string): boolean => {
    // Au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newPassword || !confirmPassword) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (!validatePassword(newPassword)) {
      setError('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.');
      return;
    }

    setIsLoading(true);

    try {
      // Appeler l'API de changement de mot de passe
      const response = await fetch('http://localhost:8084/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          email,
          newPassword
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Se reconnecter avec le nouveau mot de passe
        console.log('🔄 Reconnexion avec le nouveau mot de passe...');
        const loginSuccess = await login(email, newPassword);
        
        if (loginSuccess) {
          // Redirection vers le dashboard
          navigate('/dashboard');
        } else {
          setError('Mot de passe changé mais échec de reconnexion. Veuillez vous connecter manuellement.');
          setTimeout(() => navigate('/login'), 2000);
        }
      } else {
        setError(data.message || 'Erreur lors du changement de mot de passe.');
      }
    } catch (err) {
      setError('Une erreur s\'est produite. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-900 p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-0 bg-white/10 backdrop-blur-lg shadow-xl">
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <Lock className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white text-center">
              Changement de mot de passe
            </CardTitle>
            <CardDescription className="text-gray-300 text-center">
              {fromRegistration 
                ? 'Pour des raisons de sécurité, veuillez changer votre mot de passe temporaire.'
                : 'Créez un nouveau mot de passe sécurisé.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-200 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">


              {/* Nouveau mot de passe */}
              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm font-medium text-gray-200">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="bg-white/20 border-gray-500 text-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-400">
                  Min. 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial
                </p>
              </div>

              {/* Confirmation */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-200">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="bg-white/20 border-gray-500 text-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary-700 text-white transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {isLoading ? 'Changement en cours...' : 'Changer le mot de passe'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ChangePassword;
