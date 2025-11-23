import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export interface NewTache {
  titre: string;
  description: string;
  dateEcheance: string;
  priorite: 'Basse' | 'Moyenne' | 'Haute';
  tags?: string[];
  consigne?: string;
}

interface AddTacheModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (tache: NewTache) => void;
}

export const AddTacheModal: React.FC<AddTacheModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [newTache, setNewTache] = useState<NewTache>({
    titre: '',
    description: '',
    dateEcheance: '',
    priorite: 'Moyenne',
    tags: [],
    consigne: ''
  });
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = () => {
    if (tagInput.trim() && !newTache.tags?.includes(tagInput.trim())) {
      setNewTache({
        ...newTache,
        tags: [...(newTache.tags || []), tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setNewTache({
      ...newTache,
      tags: newTache.tags?.filter(t => t !== tag) || []
    });
  };

  const handleSubmit = () => {
    if (!newTache.titre.trim() || !newTache.description.trim()) return;
    onAdd(newTache);
    setNewTache({
      titre: '',
      description: '',
      dateEcheance: '',
      priorite: 'Moyenne',
      tags: [],
      consigne: ''
    });
    setTagInput('');
    onClose();
  };

  if (!isOpen) return null;

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
          <h3 className="text-xl font-bold text-gray-900 mb-4">Ajouter une tâche commune</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
              <input
                type="text"
                value={newTache.titre}
                onChange={(e) => setNewTache({ ...newTache, titre: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Titre de la tâche"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                value={newTache.description}
                onChange={(e) => setNewTache({ ...newTache, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows={4}
                placeholder="Description de la tâche"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date d'échéance</label>
              <input
                type="date"
                value={newTache.dateEcheance}
                onChange={(e) => setNewTache({ ...newTache, dateEcheance: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
              <select
                value={newTache.priorite}
                onChange={(e) => setNewTache({ ...newTache, priorite: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="Basse">Basse</option>
                <option value="Moyenne">Moyenne</option>
                <option value="Haute">Haute</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Consigne (optionnel)</label>
              <textarea
                value={newTache.consigne || ''}
                onChange={(e) => setNewTache({ ...newTache, consigne: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows={3}
                placeholder="Instructions spécifiques pour cette tâche..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (optionnel)</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ajouter un tag (Entrée pour valider)"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Ajouter
                </button>
              </div>
              {newTache.tags && newTache.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {newTache.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={!newTache.titre.trim() || !newTache.description.trim()}
              className="px-4 py-2 bg-primary text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Ajouter
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

