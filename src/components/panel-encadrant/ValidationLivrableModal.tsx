import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LivrableEtudiant } from './LivrableItem';

interface ValidationLivrableModalProps {
  isOpen: boolean;
  livrable: LivrableEtudiant | null;
  action: 'valider' | 'rejeter';
  onClose: () => void;
  onConfirm: (feedback: string) => void;
}

export const ValidationLivrableModal: React.FC<ValidationLivrableModalProps> = ({
  isOpen,
  livrable,
  action,
  onClose,
  onConfirm
}) => {
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setFeedback('');
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (action === 'rejeter' && !feedback.trim()) {
      alert('Veuillez fournir un feedback pour le rejet.');
      return;
    }
    onConfirm(feedback);
    setFeedback('');
  };

  if (!isOpen || !livrable) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white max-w-md w-full p-6"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {action === 'valider' ? 'Valider le livrable' : 'Rejeter le livrable'}
          </h3>
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">Livrable:</span> {livrable.titre}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Étudiant:</span> {livrable.etudiant.prenom} {livrable.etudiant.nom}
            </p>
          </div>
          {action === 'rejeter' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Feedback (obligatoire) *
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows={4}
                placeholder="Indiquez les raisons du rejet et les corrections à apporter..."
              />
            </div>
          )}
          {action === 'valider' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Feedback (optionnel)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows={4}
                placeholder="Commentaires optionnels..."
              />
            </div>
          )}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleConfirm}
              disabled={action === 'rejeter' && !feedback.trim()}
              className={`px-4 py-2 text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                action === 'valider' ? 'bg-green-600' : 'bg-red-600'
              }`}
            >
              {action === 'valider' ? 'Valider' : 'Rejeter'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

