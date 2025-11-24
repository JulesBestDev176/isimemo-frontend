import React, { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  FileCheck, 
  AlertCircle,
  Search,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  User,
  Calendar,
  Users
} from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { mockSujets, type Sujet } from '../../models/pipeline/SujetMemoire';
import { mockDossiers, type DossierMemoire, EtapeDossier, StatutDossierMemoire } from '../../models/dossier/DossierMemoire';
import { 
  mockDocuments, 
  StatutDocument, 
  TypeDocument,
  type Document 
} from '../../models/dossier/Document';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { activerRessource } from '../../models/ressource/RessourceMediatheque';
import { mockRessourcesMediatheque } from '../../models/ressource/RessourceMediatheque';
import { getEncadrementsByDossier } from '../../models/dossier/Encadrement';

const EspaceCommission: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'sujets' | 'documents'>('sujets');
  
  // États pour la validation des dépôts de sujets
  const [searchQuerySujets, setSearchQuerySujets] = useState('');
  const [selectedDepot, setSelectedDepot] = useState<DossierMemoire | null>(null);
  const [showConsultationModalSujet, setShowConsultationModalSujet] = useState(false);
  const [showValidationModalSujet, setShowValidationModalSujet] = useState(false);
  const [validationActionSujet, setValidationActionSujet] = useState<'valider' | 'rejeter' | null>(null);
  const [commentaireSujet, setCommentaireSujet] = useState('');

  // États pour la validation des documents
  const [searchQueryDocuments, setSearchQueryDocuments] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showConsultationModalDocument, setShowConsultationModalDocument] = useState(false);
  const [showValidationModalDocument, setShowValidationModalDocument] = useState(false);
  const [validationActionDocument, setValidationActionDocument] = useState<'valider' | 'rejeter' | null>(null);
  const [commentaireDocument, setCommentaireDocument] = useState('');

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

  // ============================================================================
  // LOGIQUE POUR LA VALIDATION DES DÉPÔTS DE SUJETS
  // ============================================================================

  // Récupérer les dépôts de sujets en attente de validation
  // Un dépôt est un dossier à l'étape VALIDATION_SUJET avec un encadrant choisi
  const depotsEnAttente = useMemo(() => {
    return mockDossiers.filter(d => 
      d.etape === EtapeDossier.VALIDATION_SUJET && 
      d.encadrant && 
      (d.statut === StatutDossierMemoire.EN_ATTENTE_VALIDATION || d.statut === StatutDossierMemoire.EN_CREATION)
    );
  }, []);

  // Filtrer les dépôts par recherche
  const depotsFiltres = useMemo(() => {
    if (!searchQuerySujets.trim()) return depotsEnAttente;
    const query = searchQuerySujets.toLowerCase();
    return depotsEnAttente.filter(d => {
      const titreMatch = d.titre.toLowerCase().includes(query);
      const descriptionMatch = d.description.toLowerCase().includes(query);
      const candidatMatch = d.candidats?.some(c => 
        `${c.prenom} ${c.nom}`.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query)
      ) || false;
      const encadrantMatch = d.encadrant ? 
        `${d.encadrant.prenom} ${d.encadrant.nom}`.toLowerCase().includes(query) ||
        d.encadrant.email.toLowerCase().includes(query) : false;
      return titreMatch || descriptionMatch || candidatMatch || encadrantMatch;
    });
  }, [depotsEnAttente, searchQuerySujets]);

  const handleConsulterDepot = (depot: DossierMemoire) => {
    setSelectedDepot(depot);
    setShowConsultationModalSujet(true);
  };

  const handleValiderDepot = () => {
    if (!selectedDepot) return;
    setValidationActionSujet('valider');
    setCommentaireSujet('');
    setShowValidationModalSujet(true);
  };

  const handleRejeterDepot = () => {
    if (!selectedDepot) return;
    setValidationActionSujet('rejeter');
    setCommentaireSujet('');
    setShowValidationModalSujet(true);
  };

  const handleConfirmValidationDepot = () => {
    if (!selectedDepot) return;

    const depotIndex = mockDossiers.findIndex(d => d.idDossierMemoire === selectedDepot.idDossierMemoire);
    if (depotIndex === -1) return;

    if (validationActionSujet === 'valider') {
      // Valider le dépôt : passer à l'étape suivante
      mockDossiers[depotIndex].etape = EtapeDossier.EN_COURS_REDACTION;
      mockDossiers[depotIndex].statut = StatutDossierMemoire.EN_COURS;
    } else if (validationActionSujet === 'rejeter') {
      // Rejeter le dépôt : retourner à CHOIX_SUJET
      mockDossiers[depotIndex].etape = EtapeDossier.CHOIX_SUJET;
      mockDossiers[depotIndex].statut = StatutDossierMemoire.EN_CREATION;
      // Optionnel : supprimer l'encadrant choisi
      // mockDossiers[depotIndex].encadrant = undefined;
    }

    setShowValidationModalSujet(false);
    setSelectedDepot(null);
    setValidationActionSujet(null);
    setCommentaireSujet('');
  };

  // ============================================================================
  // LOGIQUE POUR LA VALIDATION DES DOCUMENTS
  // ============================================================================

  // Récupérer les documents en attente de validation (corrections après soutenance)
  const documentsEnAttente = useMemo(() => {
    return mockDocuments.filter(d => 
      d.statut === StatutDocument.EN_ATTENTE_VALIDATION && 
      d.typeDocument === TypeDocument.CHAPITRE
    );
  }, []);

  // Filtrer les documents par recherche
  const documentsFiltres = useMemo(() => {
    if (!searchQueryDocuments.trim()) return documentsEnAttente;
    const query = searchQueryDocuments.toLowerCase();
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
  }, [documentsEnAttente, searchQueryDocuments]);

  const handleConsulterDocument = (document: Document) => {
    setSelectedDocument(document);
    setShowConsultationModalDocument(true);
  };

  const handleValiderDocument = () => {
    if (!selectedDocument) return;
    setValidationActionDocument('valider');
    setCommentaireDocument('');
    setShowValidationModalDocument(true);
  };

  const handleRejeterDocument = () => {
    if (!selectedDocument) return;
    setValidationActionDocument('rejeter');
    setCommentaireDocument('');
    setShowValidationModalDocument(true);
  };

  const handleConfirmValidationDocument = () => {
    if (!selectedDocument) return;

    const docIndex = mockDocuments.findIndex(d => d.idDocument === selectedDocument.idDocument);
    if (docIndex === -1) return;

    if (validationActionDocument === 'valider') {
      mockDocuments[docIndex].statut = StatutDocument.VALIDE;
      
      // Activer la ressource dans la bibliothèque numérique
      const ressource = mockRessourcesMediatheque.find(r => 
        r.cheminFichier === selectedDocument.cheminFichier
      );
      if (ressource) {
        activerRessource(ressource.idRessource);
      }
    } else if (validationActionDocument === 'rejeter') {
      mockDocuments[docIndex].statut = StatutDocument.REJETE;
      if (commentaireDocument.trim()) {
        mockDocuments[docIndex].commentaire = commentaireDocument;
      }
    }

    setShowValidationModalDocument(false);
    setSelectedDocument(null);
    setValidationActionDocument(null);
    setCommentaireDocument('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Espace Commission</h1>
          <p className="text-gray-600 mt-1">Validez les sujets et les documents corrigés après soutenance</p>
        </div>
      </div>

      {/* Onglets */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('sujets')}
          className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'sujets'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Validation des sujets
            {depotsEnAttente.length > 0 && (
              <Badge variant="outline" className="ml-2">
                {depotsEnAttente.length}
              </Badge>
            )}
          </div>
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'documents'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            Validation des documents corrigés
            {documentsEnAttente.length > 0 && (
              <Badge variant="outline" className="ml-2">
                {documentsEnAttente.length}
              </Badge>
            )}
          </div>
        </button>
      </div>

      {/* Contenu des onglets */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Onglet Validation des sujets */}
        {activeTab === 'sujets' && (
          <div className="space-y-6">
            {/* Recherche */}
            <Card>
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Rechercher par candidat, sujet, encadrant..."
                    value={searchQuerySujets}
                    onChange={(e) => setSearchQuerySujets(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Liste des dépôts de sujets */}
            {depotsFiltres.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun dépôt en attente</h3>
                  <p className="text-gray-600">Tous les dépôts de sujets ont été traités ou aucun dépôt n'est en attente de validation.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {depotsFiltres.map((depot) => {
                  // Récupérer les candidats : soit depuis le binôme, soit directement depuis le dossier
                  const candidats = depot.binome?.candidats || depot.candidats || [];
                  const estBinome = depot.binome && depot.binome.candidats && depot.binome.candidats.length > 1;
                  return (
                    <motion.div
                      key={depot.idDossierMemoire}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-xl mb-2">{depot.titre}</CardTitle>
                              <CardDescription className="mt-2">
                                <div className="flex flex-wrap gap-2 items-center">
                                  {estBinome && (
                                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                      Binôme
                                    </Badge>
                                  )}
                                  {candidats.map((candidat, idx) => (
                                    <Badge key={idx} variant="outline">
                                      {candidat.prenom} {candidat.nom}
                                    </Badge>
                                  ))}
                                  {depot.encadrant && (
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                      Encadrant: {depot.encadrant.prenom} {depot.encadrant.nom}
                                    </Badge>
                                  )}
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
                              <p className="text-gray-700">{depot.description}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {candidats.length > 0 && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <User className="h-4 w-4 mr-2 text-gray-400" />
                                  <span className="font-medium">{estBinome ? 'Binôme:' : 'Candidat(s):'}</span>
                                  <span className="ml-2">
                                    {candidats.map(c => `${c.prenom} ${c.nom}`).join(', ')}
                                  </span>
                                </div>
                              )}
                              {depot.encadrant && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <User className="h-4 w-4 mr-2 text-gray-400" />
                                  <span className="font-medium">Encadrant choisi:</span>
                                  <span className="ml-2">
                                    {depot.encadrant.prenom} {depot.encadrant.nom}
                                    {depot.encadrant.email && ` (${depot.encadrant.email})`}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                <span className="font-medium">Date de dépôt:</span>
                                <span className="ml-2">
                                  {format(depot.dateCreation, 'dd/MM/yyyy', { locale: fr })}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2 pt-4 border-t">
                              <Button
                                variant="outline"
                                onClick={() => handleConsulterDepot(depot)}
                                className="flex items-center gap-2"
                              >
                                <Eye className="h-4 w-4" />
                                Consulter
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
          </div>
        )}

        {/* Onglet Validation des documents */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            {/* Recherche */}
            <Card>
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Rechercher par titre, dossier ou candidat..."
                    value={searchQueryDocuments}
                    onChange={(e) => setSearchQueryDocuments(e.target.value)}
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
                                onClick={() => handleConsulterDocument(document)}
                                className="flex items-center gap-2"
                              >
                                <Eye className="h-4 w-4" />
                                Consulter
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
          </div>
        )}
      </motion.div>

      {/* Modal de consultation pour les dépôts de sujets */}
      {showConsultationModalSujet && selectedDepot && (() => {
        const candidats = selectedDepot.binome?.candidats || selectedDepot.candidats || [];
        const estBinome = selectedDepot.binome && selectedDepot.binome.candidats && selectedDepot.binome.candidats.length > 1;
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowConsultationModalSujet(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white max-w-4xl w-full p-6 rounded-lg max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-xl font-bold mb-4">Détails du dépôt de sujet</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1 text-gray-600">Sujet choisi</p>
                  <p className="text-gray-900 text-lg">{selectedDepot.titre}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1 text-gray-600">Description</p>
                  <p className="text-gray-700">{selectedDepot.description}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {candidats.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-1 text-gray-600">{estBinome ? 'Binôme' : 'Candidat(s)'}</p>
                      {estBinome && (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 mb-2">
                          Binôme
                        </Badge>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {candidats.map((candidat, idx) => (
                          <Badge key={idx} variant="outline">
                            {candidat.prenom} {candidat.nom}
                            {candidat.email && ` (${candidat.email})`}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedDepot.encadrant && (
                    <div>
                      <p className="text-sm font-medium mb-1 text-gray-600">Encadrant choisi</p>
                      <p className="text-gray-700">
                        {selectedDepot.encadrant.prenom} {selectedDepot.encadrant.nom}
                        {selectedDepot.encadrant.email && ` (${selectedDepot.encadrant.email})`}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium mb-1 text-gray-600">Date de dépôt</p>
                    <p className="text-gray-700">
                      {format(selectedDepot.dateCreation, 'dd/MM/yyyy', { locale: fr })}
                    </p>
                  </div>
                  {selectedDepot.anneeAcademique && (
                    <div>
                      <p className="text-sm font-medium mb-1 text-gray-600">Année académique</p>
                      <p className="text-gray-700">{selectedDepot.anneeAcademique}</p>
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setShowConsultationModalSujet(false)}>
                    Fermer
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => {
                      setShowConsultationModalSujet(false);
                      handleValiderDepot();
                    }}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Valider
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => {
                      setShowConsultationModalSujet(false);
                      handleRejeterDepot();
                    }}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Rejeter
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        );
      })()}

      {/* Modal de validation/rejet pour les dépôts de sujets */}
      {showValidationModalSujet && selectedDepot && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowValidationModalSujet(false)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-2xl w-full p-6 rounded-lg max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-xl font-bold mb-4">
              {validationActionSujet === 'valider' ? 'Valider le dépôt de sujet' : 'Rejeter le dépôt de sujet'}
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Sujet</p>
                <p className="text-gray-700">{selectedDepot.titre}</p>
              </div>
              {(() => {
                const candidats = selectedDepot.binome?.candidats || selectedDepot.candidats || [];
                const estBinome = selectedDepot.binome && selectedDepot.binome.candidats && selectedDepot.binome.candidats.length > 1;
                return candidats.length > 0 ? (
                  <div>
                    <p className="text-sm font-medium mb-1">{estBinome ? 'Binôme' : 'Candidat(s)'}</p>
                    <p className="text-gray-700">
                      {candidats.map(c => `${c.prenom} ${c.nom}`).join(', ')}
                    </p>
                  </div>
                ) : null;
              })()}
              {selectedDepot.encadrant && (
                <div>
                  <p className="text-sm font-medium mb-1">Encadrant choisi</p>
                  <p className="text-gray-700">
                    {selectedDepot.encadrant.prenom} {selectedDepot.encadrant.nom}
                  </p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Commentaire {validationActionSujet === 'rejeter' && '(obligatoire)'}
                </label>
                <Textarea
                  value={commentaireSujet}
                  onChange={(e) => setCommentaireSujet(e.target.value)}
                  placeholder={validationActionSujet === 'valider' 
                    ? 'Commentaire optionnel...' 
                    : 'Veuillez indiquer la raison du rejet...'}
                  rows={4}
                  required={validationActionSujet === 'rejeter'}
                />
                {validationActionSujet === 'valider' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Si validé, le candidat pourra commencer la rédaction de son mémoire.
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowValidationModalSujet(false)}>
                  Annuler
                </Button>
                <Button
                  onClick={handleConfirmValidationDepot}
                  disabled={validationActionSujet === 'rejeter' && !commentaireSujet.trim()}
                  className={validationActionSujet === 'valider' 
                    ? 'bg-primary hover:bg-primary/90' 
                    : 'bg-destructive hover:bg-destructive/90'}
                >
                  {validationActionSujet === 'valider' ? (
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

      {/* Modal de consultation pour les documents */}
      {showConsultationModalDocument && selectedDocument && (() => {
        const dossier = selectedDocument.dossierMemoire;
        const encadrements = dossier ? getEncadrementsByDossier(dossier.idDossierMemoire) : [];
        const encadrementActif = encadrements.find(e => e.statut === StatutEncadrement.ACTIF);
        const encadrant = encadrementActif?.professeur || dossier?.encadrant;
        const candidats = dossier?.candidats || [];
        
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowConsultationModalDocument(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white max-w-4xl w-full p-6 rounded-lg max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-xl font-bold mb-4">Détails du document</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1 text-gray-600">Titre du document</p>
                  <p className="text-gray-900 text-lg">{selectedDocument.titre}</p>
                </div>
                {dossier && (
                  <>
                    <div>
                      <p className="text-sm font-medium mb-1 text-gray-600">Dossier</p>
                      <p className="text-gray-700">{dossier.titre}</p>
                    </div>
                    {candidats.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-1 text-gray-600">Candidat(s)</p>
                        <div className="flex flex-wrap gap-2">
                          {candidats.map((candidat, idx) => (
                            <Badge key={idx} variant="outline">
                              {candidat.prenom} {candidat.nom}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {encadrant && (
                      <div>
                        <p className="text-sm font-medium mb-1 text-gray-600">Encadrant</p>
                        <p className="text-gray-700">
                          {encadrant.prenom} {encadrant.nom}
                          {encadrant.email && ` (${encadrant.email})`}
                        </p>
                      </div>
                    )}
                  </>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1 text-gray-600">Date de dépôt</p>
                    <p className="text-gray-700">
                      {format(selectedDocument.dateCreation, 'dd/MM/yyyy', { locale: fr })}
                    </p>
                  </div>
                  {selectedDocument.dateModification && (
                    <div>
                      <p className="text-sm font-medium mb-1 text-gray-600">Dernière modification</p>
                      <p className="text-gray-700">
                        {format(selectedDocument.dateModification, 'dd/MM/yyyy', { locale: fr })}
                      </p>
                    </div>
                  )}
                </div>
                {selectedDocument.commentaire && (
                  <div>
                    <p className="text-sm font-medium mb-1 text-gray-600">Commentaire précédent</p>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded border">
                      {selectedDocument.commentaire}
                    </p>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => window.open(selectedDocument.cheminFichier, '_blank')}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Visualiser
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const link = window.document.createElement('a');
                      link.href = selectedDocument.cheminFichier;
                      link.download = selectedDocument.titre;
                      window.document.body.appendChild(link);
                      link.click();
                      window.document.body.removeChild(link);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Télécharger
                  </Button>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setShowConsultationModalDocument(false)}>
                    Fermer
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => {
                      setShowConsultationModalDocument(false);
                      handleValiderDocument();
                    }}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Valider
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => {
                      setShowConsultationModalDocument(false);
                      handleRejeterDocument();
                    }}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Rejeter
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        );
      })()}

      {/* Modal de validation/rejet pour les documents */}
      {showValidationModalDocument && selectedDocument && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowValidationModalDocument(false)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-2xl w-full p-6 rounded-lg max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-xl font-bold mb-4">
              {validationActionDocument === 'valider' ? 'Valider le document' : 'Rejeter le document'}
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
                  Commentaire {validationActionDocument === 'rejeter' && '(obligatoire)'}
                </label>
                <Textarea
                  value={commentaireDocument}
                  onChange={(e) => setCommentaireDocument(e.target.value)}
                  placeholder={validationActionDocument === 'valider' 
                    ? 'Commentaire optionnel...' 
                    : 'Veuillez indiquer la raison du rejet...'}
                  rows={4}
                  required={validationActionDocument === 'rejeter'}
                />
                {validationActionDocument === 'valider' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Si validé, le document sera activé dans la bibliothèque numérique.
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowValidationModalDocument(false)}>
                  Annuler
                </Button>
                <Button
                  onClick={handleConfirmValidationDocument}
                  disabled={validationActionDocument === 'rejeter' && !commentaireDocument.trim()}
                  className={validationActionDocument === 'valider' 
                    ? 'bg-primary hover:bg-primary/90' 
                    : 'bg-destructive hover:bg-destructive/90'}
                >
                  {validationActionDocument === 'valider' ? (
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

export default EspaceCommission;
