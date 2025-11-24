import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, Download, CheckCircle, XCircle, FileText, User, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import type { DemandePrelecture } from '../../models/dossier/DemandePrelecture';
import { StatutDemandePrelecture } from '../../models/dossier/DemandePrelecture';

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
                  <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">En attente</Badge>
                )}
                {demande.statut === StatutDemandePrelecture.EN_COURS && (
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200">En cours</Badge>
                )}
                {demande.statut === StatutDemandePrelecture.VALIDE && (
                  <Badge className="bg-green-50 text-green-700 border-green-200">Validé</Badge>
                )}
                {demande.statut === StatutDemandePrelecture.REJETE && (
                  <Badge className="bg-red-50 text-red-700 border-red-200">Rejeté</Badge>
                )}
              </div>

              {/* Commentaire si validé */}
              {demande.statut === StatutDemandePrelecture.VALIDE && demande.commentaire && (
                <div className="bg-green-50 border border-green-200 p-4">
                  <h3 className="text-sm font-semibold text-green-900 mb-2">Commentaire de validation</h3>
                  <p className="text-sm text-green-800">{demande.commentaire}</p>
                </div>
              )}

              {/* Feedback de rejet si rejeté */}
              {demande.statut === StatutDemandePrelecture.REJETE && demande.feedbackRejet && (
                <div className="bg-red-50 border border-red-200 p-4">
                  <h3 className="text-sm font-semibold text-red-900 mb-2">Feedback de rejet</h3>
                  <p className="text-sm text-red-800 mb-3">{demande.feedbackRejet.commentaire}</p>
                  {demande.feedbackRejet.corrections.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-red-900 mb-2">Corrections à apporter :</p>
                      <ul className="list-disc list-inside space-y-1">
                        {demande.feedbackRejet.corrections.map((correction, index) => (
                          <li key={index} className="text-sm text-red-800">{correction}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              {canValider || canRejeter ? (
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
    </>
  );
};

