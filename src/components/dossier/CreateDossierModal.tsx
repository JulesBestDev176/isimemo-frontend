import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { dossierService, DossierMemoire } from '../../services/dossier.service';

interface CreateDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSuccess: (dossier: DossierMemoire) => void;
}

const CreateDossierModal: React.FC<CreateDossierModalProps> = ({ isOpen, onClose, userId, onSuccess }) => {
  const [newDossierTitle, setNewDossierTitle] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreateDossier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !newDossierTitle.trim()) return;

    try {
      setCreating(true);
      const newDossier = await dossierService.createDossier({
        titre: newDossierTitle,
        candidatId: userId,
        anneeAcademique: '2025-2026'
      });
      onSuccess(newDossier);
      onClose();
      setNewDossierTitle('');
    } catch (error) {
      console.error("Erreur création dossier:", error);
    } finally {
      setCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Nouveau dossier</h3>
          <button onClick={() => !creating && onClose()} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleCreateDossier} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre provisoire du mémoire
            </label>
            <input
              type="text"
              required
              value={newDossierTitle}
              onChange={(e) => setNewDossierTitle(e.target.value)}
              placeholder="Ex: Système de gestion de..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-2">
              Le titre pourra être modifié ultérieurement après validation avec votre encadrant.
            </p>
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={creating}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={creating || !newDossierTitle.trim()}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center space-x-2"
            >
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Création...</span>
                </>
              ) : (
                <span>Confirmer</span>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateDossierModal;
