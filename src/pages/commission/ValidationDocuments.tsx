import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  FileCheck, 
  Search, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Download,
  User,
  Calendar,
  AlertCircle,
  FileText
} from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { 
  mockDocuments, 
  StatutDocument, 
  TypeDocument,
  type Document 
} from '../../models/dossier/Document';
import { getDossierById } from '../../models/dossier/DossierMemoire';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { activerRessource } from '../../models/ressource/RessourceMediatheque';
import { mockRessourcesMediatheque } from '../../models/ressource/RessourceMediatheque';

const ValidationDocuments: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
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

  // Récupérer les documents en attente de validation (corrections après soutenance)
  const documentsEnAttente = useMemo(() => {
    return mockDocuments.filter(d => 
      d.statut === StatutDocument.EN_ATTENTE_VALIDATION && 
      d.typeDocument === TypeDocument.CHAPITRE // Seulement les mémoires
    );
  }, []);

  // Filtrer les documents par recherche
  const documentsFiltres = useMemo(() => {
    if (!searchQuery.trim()) return documentsEnAttente;
    const query = searchQuery.toLowerCase();
    return documentsEnAttente.filter(d => {
      const dossier = d.dossierMemoire;
      const titreMatch = d.titre.toLowerCase().includes(query);
      const dossierTitreMatch = dossier?.titre?.toLowerCase().includes(query) || false;
      const candidatsMatch = dossier?.candidats?.some(c => 
        `${c.prenom} ${c.nom}`.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query)
      ) || false;
      return titreMatch || dossierTitreMatch || candidatsMatch;
    });
  }, [documentsEnAttente, searchQuery]);

  const handleValider = (document: Document) => {
    setSelectedDocument(document);
    setValidationAction('valider');
    setCommentaire('');
    setShowValidationModal(true);
  };

  const handleRejeter = (document: Document) => {
    setSelectedDocument(document);
    setValidationAction('rejeter');
    setCommentaire('');
    setShowValidationModal(true);
  };

  const handleConfirmValidation = () => {
    if (!selectedDocument) return;

    // TODO: Appel API pour valider/rejeter le document
    const docIndex = mockDocuments.findIndex(d => d.idDocument === selectedDocument.idDocument);
    if (docIndex === -1) return;

    if (validationAction === 'valider') {
      // Valider le document
      mockDocuments[docIndex].statut = StatutDocument.VALIDE;
      
      // Activer la ressource dans la bibliothèque numérique
      const ressource = mockRessourcesMediatheque.find(r => 
        r.cheminFichier === selectedDocument.cheminFichier
      );
      if (ressource) {
        activerRessource(ressource.idRessource);
      }
    } else if (validationAction === 'rejeter') {
      // Rejeter le document
      mockDocuments[docIndex].statut = StatutDocument.REJETE;
      if (commentaire.trim()) {
        mockDocuments[docIndex].commentaire = commentaire;
      }
    }

    setShowValidationModal(false);
    setSelectedDocument(null);
    setValidationAction(null);
    setCommentaire('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Validation des documents corrigés</h1>
          <p className="text-gray-600 mt-1">Validez ou rejetez les mémoires corrigés après soutenance</p>
        </div>
      </div>

      {/* Recherche */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Rechercher par titre, dossier ou candidat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Liste des documents */}
      {documentsFiltres.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun document en attente</h3>
            <p className="text-gray-600">Tous les documents ont été traités ou aucun document n'est en attente de validation.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {documentsFiltres.map((document) => {
            const dossier = document.dossierMemoire;
            const candidats = dossier?.candidats || [];
            
            return (
              <motion.div
                key={document.idDocument}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{document.titre}</CardTitle>
                        <CardDescription className="mt-2">
                          {dossier && (
                            <div className="flex flex-wrap gap-2 items-center">
                              <Badge variant="outline">Dossier: {dossier.titre}</Badge>
                              {candidats.map((candidat, idx) => (
                                <Badge key={idx} variant="outline">
                                  {candidat.prenom} {candidat.nom}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardDescription>
                      </div>
                      <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        En attente
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="font-medium">Date de dépôt:</span>
                          <span className="ml-2">
                            {format(document.dateCreation, 'dd/MM/yyyy', { locale: fr })}
                          </span>
                        </div>
                        {document.dateModification && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="font-medium">Dernière modification:</span>
                            <span className="ml-2">
                              {format(document.dateModification, 'dd/MM/yyyy', { locale: fr })}
                            </span>
                          </div>
                        )}
                      </div>
                      {document.commentaire && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Commentaire précédent</p>
                          <p className="text-gray-700 bg-gray-50 p-3 rounded border">
                            {document.commentaire}
                          </p>
                        </div>
                      )}
                      <div className="flex gap-2 pt-4 border-t">
                        <Button
                          variant="outline"
                          onClick={() => window.open(document.cheminFichier, '_blank')}
                          className="flex items-center gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          Visualiser
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = document.cheminFichier;
                            link.download = document.titre;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          className="flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Télécharger
                        </Button>
                        <Button
                          variant="default"
                          onClick={() => handleValider(document)}
                          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Valider
                        </Button>
                        <Button
                          variant="default"
                          onClick={() => handleRejeter(document)}
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
            );
          })}
        </div>
      )}

      {/* Modal de validation/rejet */}
      {showValidationModal && selectedDocument && (
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
              {validationAction === 'valider' ? 'Valider le document' : 'Rejeter le document'}
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Document</p>
                <p className="text-gray-700">{selectedDocument.titre}</p>
              </div>
              {selectedDocument.dossierMemoire && (
                <div>
                  <p className="text-sm font-medium mb-1">Dossier</p>
                  <p className="text-gray-700">{selectedDocument.dossierMemoire.titre}</p>
                </div>
              )}
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
                {validationAction === 'valider' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Si validé, le document sera activé dans la bibliothèque numérique.
                  </p>
                )}
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

export default ValidationDocuments;

