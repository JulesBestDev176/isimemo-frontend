import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, Download, CheckCircle, XCircle, FileText, User, Calendar, ShieldAlert, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import type { DemandePrelecture } from '../../models/dossier/DemandePrelecture';
import { StatutDemandePrelecture } from '../../models/dossier/DemandePrelecture';
import { detectSimilarDocuments, getSimilarityRiskLevel, getSimilarityRiskColor, type SimilarDocument } from '../../models/dossier/SimilarDocument';

interface PrelectureDetailProps {
  demande: DemandePrelecture;
  onClose: () => void;
  onValider: (idDemande: number, commentaire?: string) => void;
  onRejeter: (idDemande: number, commentaire: string, corrections: string[]) => void;
}

export const PrelectureDetail: React.FC<PrelectureDetailProps> = ({
  demande,
  onClose,
  onValider,
  onRejeter
}) => {
  const [commentaire, setCommentaire] = useState('');
  const [rejetCommentaire, setRejetCommentaire] = useState('');
  const [corrections, setCorrections] = useState<string[]>(['']);
  const [showRejetModal, setShowRejetModal] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);

  // États pour la vérification de plagiat
  const [plagiarismVerified, setPlagiarismVerified] = useState(false);
  const [isCheckingPlagiarism, setIsCheckingPlagiarism] = useState(false);
  const [similarDocuments, setSimilarDocuments] = useState<SimilarDocument[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<SimilarDocument | null>(null);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAddCorrection = () => {
    setCorrections([...corrections, '']);
  };

  const handleRemoveCorrection = (index: number) => {
    setCorrections(corrections.filter((_, i) => i !== index));
  };

  const handleCorrectionChange = (index: number, value: string) => {
    const newCorrections = [...corrections];
    newCorrections[index] = value;
    setCorrections(newCorrections);
  };

  const handleConfirmValidation = () => {
    onValider(demande.idDemandePrelecture, commentaire.trim() || undefined);
    setShowValidationModal(false);
    setCommentaire('');
    onClose();
  };

  const handleConfirmRejet = () => {
    if (!rejetCommentaire.trim()) {
      alert('Veuillez fournir un commentaire de rejet.');
      return;
    }
    const correctionsFiltrees = corrections.filter(c => c.trim() !== '');
    onRejeter(demande.idDemandePrelecture, rejetCommentaire, correctionsFiltrees);
    setShowRejetModal(false);
    setRejetCommentaire('');
    setCorrections(['']);
    onClose();
  };

  // Handler pour vérifier le plagiat
  const handleCheckPlagiarism = () => {
    setIsCheckingPlagiarism(true);

    // Simulation de la vérification (2 secondes)
    setTimeout(() => {
      const similar = detectSimilarDocuments(demande.dossierMemoire.idDossierMemoire);
      setSimilarDocuments(similar);
      setPlagiarismVerified(true);
      setIsCheckingPlagiarism(false);
    }, 2000);
  };

  const canValider = demande.statut === StatutDemandePrelecture.EN_ATTENTE ||
    demande.statut === StatutDemandePrelecture.EN_COURS;
  const canRejeter = demande.statut === StatutDemandePrelecture.EN_ATTENTE ||
    demande.statut === StatutDemandePrelecture.EN_COURS;

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-4xl w-full my-8"
          >
            {/* En-tête */}
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Détail de la pré-lecture</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Contenu */}
            <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Informations du candidat */}
              <div className="bg-gray-50 p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Informations du candidat
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nom complet</p>
                    <p className="text-sm font-medium text-gray-900">
                      {demande.candidat?.prenom} {demande.candidat?.nom}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-sm font-medium text-gray-900">{demande.candidat?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Matricule</p>
                    <p className="text-sm font-medium text-gray-900">{demande.candidat?.numeroMatricule}</p>
                  </div>
                </div>
              </div>

              {/* Informations du mémoire */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Informations du mémoire
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Titre</p>
                    <p className="text-sm font-medium text-gray-900">{demande.dossierMemoire.titre}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="text-sm text-gray-900">{demande.dossierMemoire.description}</p>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Encadrant principal</p>
                      <p className="text-sm font-medium text-gray-900">
                        {demande.encadrantPrincipal?.prenom} {demande.encadrantPrincipal?.nom}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date d'assignation</p>
                      <p className="text-sm font-medium text-gray-900">
                        {demande.dateAssignation ? formatDate(demande.dateAssignation) : '-'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document du mémoire */}
              {demande.documentMemoire && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Document du mémoire</h3>
                  <div className="bg-gray-50 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{demande.documentMemoire.nomFichier}</p>
                        <p className="text-xs text-gray-500">{demande.documentMemoire.taille}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(demande.documentMemoire!.cheminFichier, '_blank')}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Visualiser
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // TODO: Implémenter le téléchargement
                          console.log('Télécharger:', demande.documentMemoire!.cheminFichier);
                        }}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Télécharger
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Statut */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Statut</h3>
                {demande.statut === StatutDemandePrelecture.EN_ATTENTE && (
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200">En attente</Badge>
                )}
                {demande.statut === StatutDemandePrelecture.EN_COURS && (
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200">En cours</Badge>
                )}
                {demande.statut === StatutDemandePrelecture.VALIDE && (
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200">Validé</Badge>
                )}
                {demande.statut === StatutDemandePrelecture.REJETE && (
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200">Rejeté</Badge>
                )}
              </div>

              {/* Commentaire si validé */}
              {demande.statut === StatutDemandePrelecture.VALIDE && demande.commentaire && (
                <div className="bg-blue-50 border border-blue-200 p-4">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">Commentaire de validation</h3>
                  <p className="text-sm text-blue-800">{demande.commentaire}</p>
                </div>
              )}

              {/* Feedback de rejet si rejeté */}
              {demande.statut === StatutDemandePrelecture.REJETE && demande.feedbackRejet && (
                <div className="bg-blue-50 border border-blue-200 p-4">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">Feedback de rejet</h3>
                  <p className="text-sm text-blue-800 mb-3">{demande.feedbackRejet.commentaire}</p>
                  {demande.feedbackRejet.corrections.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-blue-900 mb-2">Corrections à apporter :</p>
                      <ul className="list-disc list-inside space-y-1">
                        {demande.feedbackRejet.corrections.map((correction, index) => (
                          <li key={index} className="text-sm text-blue-800">{correction}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Vérification de plagiat */}
              {canValider && !plagiarismVerified && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="bg-blue-50 border border-blue-200 p-4 mb-4">
                    <p className="text-sm text-blue-800 mb-2">
                      Avant de valider ou rejeter cette pré-lecture, veuillez vérifier le plagiat pour détecter d'éventuelles similitudes avec d'autres mémoires.
                    </p>
                  </div>
                  <Button
                    onClick={handleCheckPlagiarism}
                    disabled={isCheckingPlagiarism}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-700 w-full justify-center"
                  >
                    {isCheckingPlagiarism ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Analyse en cours...
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="h-4 w-4" />
                        Vérifier le Plagiat
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Résultats de la vérification de plagiat */}
              {plagiarismVerified && similarDocuments.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-700">
                      Documents Similaires Détectés ({similarDocuments.length})
                    </h3>
                    <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Vérification effectuée
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-4">
                    {similarDocuments.map((doc) => {
                      const riskLevel = getSimilarityRiskLevel(doc.similarityScore);
                      const riskColor = getSimilarityRiskColor(doc.similarityScore);

                      return (
                        <div key={doc.idDossier} className="bg-gray-50 border border-gray-200 p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 mb-1">{doc.titreMemoire}</p>
                              <p className="text-xs text-gray-600">
                                {doc.auteur.prenom} {doc.auteur.nom} • {doc.anneeAcademique}
                              </p>
                            </div>
                            <Badge className={riskColor}>
                              {doc.similarityScore}% similarité
                            </Badge>
                          </div>

                          <div className="mb-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-gray-600">Score de similarité :</span>
                            </div>
                            <div className="w-full bg-gray-200 h-2">
                              <div
                                className="h-2 bg-blue-500"
                                style={{ width: `${doc.similarityScore}%` }}
                              />
                            </div>
                          </div>

                          {doc.encadrant && (
                            <p className="text-xs text-gray-600 mb-2">
                              Encadrant : {doc.encadrant.prenom} {doc.encadrant.nom}
                            </p>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedDocument(doc)}
                            className="flex items-center gap-2"
                          >
                            <FileText className="h-4 w-4" />
                            Consulter le document
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Actions - Affichées uniquement après vérification de plagiat */}
              {plagiarismVerified && (canValider || canRejeter) ? (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  {canValider && (
                    <Button
                      onClick={() => setShowValidationModal(true)}
                      className="flex items-center gap-2 bg-primary hover:bg-primary-700"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Valider
                    </Button>
                  )}
                  {canRejeter && (
                    <Button
                      onClick={() => setShowRejetModal(true)}
                      variant="outline"
                      className="flex items-center gap-2 border-gray-600 text-gray-700 hover:bg-gray-50"
                    >
                      <XCircle className="h-4 w-4" />
                      Rejeter
                    </Button>
                  )}
                </div>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Modal de validation */}
      {showValidationModal && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4"
            onClick={() => setShowValidationModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white max-w-md w-full p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Valider la pré-lecture</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commentaire (optionnel)
                </label>
                <textarea
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Commentaires optionnels sur la pré-lecture..."
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowValidationModal(false)}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleConfirmValidation}
                  className="bg-primary hover:bg-primary-700"
                >
                  Valider
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Modal de rejet */}
      {showRejetModal && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4 overflow-y-auto"
            onClick={() => setShowRejetModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white max-w-2xl w-full my-8 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rejeter la pré-lecture</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Commentaire de rejet (obligatoire) *
                  </label>
                  <textarea
                    value={rejetCommentaire}
                    onChange={(e) => setRejetCommentaire(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    rows={4}
                    placeholder="Indiquez les raisons du rejet..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Corrections à apporter (optionnel)
                  </label>
                  <div className="space-y-2">
                    {corrections.map((correction, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={correction}
                          onChange={(e) => handleCorrectionChange(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder={`Correction ${index + 1}...`}
                        />
                        {corrections.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveCorrection(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddCorrection}
                      className="w-full"
                    >
                      + Ajouter une correction
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Ces corrections seront transmises à l'encadrant principal qui pourra créer des tâches spécifiques pour l'étudiant.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowRejetModal(false)}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleConfirmRejet}
                  disabled={!rejetCommentaire.trim()}
                  className="bg-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Rejeter
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Modal de visualisation du document similaire */}
      {selectedDocument && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4"
            onClick={() => setSelectedDocument(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white max-w-4xl w-full h-[90vh] flex flex-col"
            >
              {/* En-tête */}
              <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {selectedDocument.titreMemoire}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>
                      {selectedDocument.auteur.prenom} {selectedDocument.auteur.nom}
                    </span>
                    <span>•</span>
                    <span>{selectedDocument.anneeAcademique}</span>
                    <span>•</span>
                    <span>{selectedDocument.departement}</span>
                  </div>
                  {selectedDocument.encadrant && (
                    <p className="text-sm text-gray-600 mt-1">
                      Encadrant : {selectedDocument.encadrant.prenom} {selectedDocument.encadrant.nom}
                    </p>
                  )}
                  <div className="mt-2">
                    <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                      {selectedDocument.similarityScore}% de similarité détectée
                    </Badge>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors ml-4"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Contenu du document */}
              <div className="flex-1 overflow-hidden bg-gray-100 p-6">
                <div className="bg-white h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300">
                  <FileText className="h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-gray-900 font-medium mb-2">Prévisualisation du document</p>
                  <p className="text-sm text-gray-600 mb-4 text-center max-w-md">
                    Le document <span className="font-medium">{selectedDocument.nomFichier}</span> ({selectedDocument.taille})
                    est disponible pour consultation.
                  </p>
                  <p className="text-xs text-gray-500 mb-6">
                    Dans un environnement de production, le visualiseur PDF serait intégré ici.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        // Simulation du téléchargement
                        alert(`Téléchargement de ${selectedDocument.nomFichier}...\n\nDans un environnement de production, le fichier serait téléchargé depuis:\n${selectedDocument.cheminFichier}`);
                      }}
                      className="flex items-center gap-2 bg-primary hover:bg-primary-700"
                    >
                      <Download className="h-4 w-4" />
                      Télécharger le document
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedDocument(null)}
                    >
                      Fermer
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
};

