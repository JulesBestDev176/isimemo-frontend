import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Search, 
  CheckCircle, 
  XCircle, 
  Eye, 
  FileText,
  User,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { mockSujets, type Sujet } from '../../models/pipeline/SujetMemoire';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ValidationSujets: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSujet, setSelectedSujet] = useState<Sujet | null>(null);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationAction, setValidationAction] = useState<'valider' | 'rejeter' | null>(null);
  const [commentaire, setCommentaire] = useState('');

  // Vérifier que l'utilisateur est membre de la commission
  if (!user || user.type !== 'professeur' || !user.estCommission) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès restreint</h2>
          <p className="text-gray-600">Cette page est réservée aux membres de la commission de validation.</p>
        </div>
      </div>
    );
  }

  // Récupérer les sujets en attente de validation (statut 'soumis' sans dateApprobation)
  const sujetsEnAttente = useMemo(() => {
    return mockSujets.filter(s => s.statut === 'soumis' && !s.dateApprobation);
  }, []);

  // Filtrer les sujets par recherche
  const sujetsFiltres = useMemo(() => {
    if (!searchQuery.trim()) return sujetsEnAttente;
    const query = searchQuery.toLowerCase();
    return sujetsEnAttente.filter(s => 
      s.titre.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query) ||
      s.professeurNom.toLowerCase().includes(query) ||
      s.filieres.some(f => f.toLowerCase().includes(query))
    );
  }, [sujetsEnAttente, searchQuery]);

  const handleValider = (sujet: Sujet) => {
    setSelectedSujet(sujet);
    setValidationAction('valider');
    setCommentaire('');
    setShowValidationModal(true);
  };

  const handleRejeter = (sujet: Sujet) => {
    setSelectedSujet(sujet);
    setValidationAction('rejeter');
    setCommentaire('');
    setShowValidationModal(true);
  };

  const handleConfirmValidation = () => {
    if (!selectedSujet) return;

    // TODO: Appel API pour valider/rejeter le sujet
    if (validationAction === 'valider') {
      // Valider le sujet
      const sujetIndex = mockSujets.findIndex(s => s.id === selectedSujet.id);
      if (sujetIndex !== -1) {
        mockSujets[sujetIndex].dateApprobation = new Date().toISOString();
        // Le statut reste 'soumis' mais avec dateApprobation, il est considéré comme validé
      }
    } else if (validationAction === 'rejeter') {
      // Rejeter le sujet
      const sujetIndex = mockSujets.findIndex(s => s.id === selectedSujet.id);
      if (sujetIndex !== -1) {
        mockSujets[sujetIndex].statut = 'rejete';
        mockSujets[sujetIndex].dateApprobation = new Date().toISOString();
      }
    }

    setShowValidationModal(false);
    setSelectedSujet(null);
    setValidationAction(null);
    setCommentaire('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Validation des sujets</h1>
          <p className="text-gray-600 mt-1">Validez ou rejetez les sujets de mémoire soumis par les étudiants</p>
        </div>
      </div>

      {/* Recherche */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Rechercher par titre, description, professeur ou filière..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Liste des sujets */}
      {sujetsFiltres.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun sujet en attente</h3>
            <p className="text-gray-600">Tous les sujets ont été traités ou aucun sujet n'est en attente de validation.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sujetsFiltres.map((sujet) => (
            <motion.div
              key={sujet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{sujet.titre}</CardTitle>
                      <CardDescription className="mt-2">
                        <div className="flex flex-wrap gap-2 items-center">
                          <Badge variant="outline">{sujet.niveau}</Badge>
                          <Badge variant="outline">{sujet.departement}</Badge>
                          {sujet.filieres.map((filiere, idx) => (
                            <Badge key={idx} variant="outline">{filiere}</Badge>
                          ))}
                        </div>
                      </CardDescription>
                    </div>
                    <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      En attente
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Description</p>
                      <p className="text-gray-700">{sujet.description}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="font-medium">Professeur:</span>
                        <span className="ml-2">{sujet.professeurNom}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="font-medium">Date de soumission:</span>
                        <span className="ml-2">
                          {sujet.dateSoumission ? format(new Date(sujet.dateSoumission), 'dd/MM/yyyy', { locale: fr }) : 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="font-medium">Étudiants:</span>
                        <span className="ml-2">
                          {sujet.nombreEtudiantsActuels}/{sujet.nombreMaxEtudiants}
                        </span>
                      </div>
                    </div>
                    {sujet.motsCles && sujet.motsCles.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Mots-clés</p>
                        <div className="flex flex-wrap gap-2">
                          {sujet.motsCles.map((mot, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {mot}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2 pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedSujet(sujet)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Consulter
                      </Button>
                      <Button
                        variant="default"
                        onClick={() => handleValider(sujet)}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Valider
                      </Button>
                      <Button
                        variant="default"
                        onClick={() => handleRejeter(sujet)}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                      >
                        <XCircle className="h-4 w-4" />
                        Rejeter
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal de validation/rejet */}
      {showValidationModal && selectedSujet && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowValidationModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-2xl w-full p-6 rounded-lg max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-xl font-bold mb-4">
              {validationAction === 'valider' ? 'Valider le sujet' : 'Rejeter le sujet'}
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Sujet</p>
                <p className="text-gray-700">{selectedSujet.titre}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Commentaire {validationAction === 'rejeter' && '(obligatoire)'}
                </label>
                <Textarea
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                  placeholder={validationAction === 'valider' 
                    ? 'Commentaire optionnel...' 
                    : 'Veuillez indiquer la raison du rejet...'}
                  rows={4}
                  required={validationAction === 'rejeter'}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowValidationModal(false)}>
                  Annuler
                </Button>
                <Button
                  onClick={handleConfirmValidation}
                  disabled={validationAction === 'rejeter' && !commentaire.trim()}
                  className={validationAction === 'valider' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'}
                >
                  {validationAction === 'valider' ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirmer la validation
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Confirmer le rejet
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ValidationSujets;

