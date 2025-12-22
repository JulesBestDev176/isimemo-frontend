import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { AlertCircle, CheckCircle } from 'lucide-react';
import { authService } from '../../services/auth.service';

const Register = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setTempPassword('');
    
    if (!email) {
      setError('Veuillez entrer votre email universitaire.');
      return;
    }

    if (!email.includes('@groupeisi.com')) {
      setError('S\'il vous plaît, utilisez votre email institutionnel (@groupeisi.com).');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await authService.register(email);
      console.log('📝 Réponse inscription:', response);
      
      if (response.success && response.temporaryPassword && response.email) {
        setSuccess('Inscription réussie ! Connexion en cours...');
        
        // Auto-login avec le mot de passe temporaire
        authService.login(response.email, response.temporaryPassword)
          .then(loginResponse => {
            if (loginResponse.success && loginResponse.user) {
              // Stocker les tokens
              if (loginResponse.accessToken) sessionStorage.setItem('access_token', loginResponse.accessToken);
              if (loginResponse.refreshToken) sessionStorage.setItem('refresh_token', loginResponse.refreshToken);
              
              // Stocker l'utilisateur
              const user = {
                id: loginResponse.user.id || '',
                email: loginResponse.user.email,
                name: `${loginResponse.user.prenom || ''} ${loginResponse.user.nom || ''}`.trim(),
                type: 'etudiant' as const,
                estCandidat: true
              };
              sessionStorage.setItem('user', JSON.stringify(user));
              
              // Redirection vers page de changement de mot de passe
              setTimeout(() => {
                navigate('/change-password', { state: { fromRegistration: true, email: response.email } });
              }, 1000);
            } else {
              setError('Inscription réussie mais connexion échouée. Veuillez vous connecter manuellement.');
              setTimeout(() => navigate('/login'), 2000);
            }
          })
          .catch(() => {
            setError('Inscription réussie mais connexion échouée. Veuillez vous connecter manuellement.');
            setTimeout(() => navigate('/login'), 2000);
          });
      } else {
        setError(response.message || 'Échec de l\'inscription.');
      }
    } catch (err) {
      setError('Une erreur s\'est produite lors de l\'inscription.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-navy-900">
      {/* Formulaire au centre */}
      <div className="w-full flex items-center justify-center p-8">
        <motion.div 
          className="w-full max-w-md"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <div className="flex items-center justify-center gap-2 text-white text-3xl font-bold">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined text-2xl">school</span>
                </div>
                <span>ISI<span className="text-primary-300">Memo</span></span>
              </div>
            </Link>
          </div>

          <Card className="border-0 bg-white/10 backdrop-blur-lg shadow-xl">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-bold text-white text-center">Inscription</CardTitle>
              <CardDescription className="text-gray-300 text-center">
                Vérifiez votre éligibilité et créez votre compte.
                Accessible uniquement aux étudiants L3 GL éligibles.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-200 rounded-md flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
              
              {success && (
                <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 text-green-200 rounded-md">
                  <div className="flex items-center mb-2">
                     <CheckCircle className="h-5 w-5 mr-2" />
                     <span className="font-bold">{success}</span>
                  </div>

                </div>
              )}

              {!success && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-200 flex items-center">
                      <span className="material-icons text-primary-400 text-base mr-2">mail</span>
                      Email Institutionnel
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="prenom.nom@groupeisi.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-white/20 border-gray-500 placeholder:text-gray-400 text-white"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-primary-700 text-white transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
                  >
                    {isLoading ? 'Vérification...' : 'S\'inscrire'}
                  </Button>
                  
                  <div className="text-center text-sm text-gray-400 mt-4">
                    Déjà un compte ?{' '}
                    <Link to="/login" className="text-primary-300 hover:text-white underline">
                      Se connecter
                    </Link>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
