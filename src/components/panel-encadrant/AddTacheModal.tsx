import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';

export interface NewTache {
  titre: string;
  description: string;
  dateEcheance: string;
  priorite: 'Basse' | 'Moyenne' | 'Haute';
  tags?: string[];
  consigne?: string;
  etudiantsAssignes?: number[];
}

interface AddTacheModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (tache: NewTache) => void;
  etudiants?: Array<{ id: number; nom: string; prenom: string }>;
}

export const AddTacheModal: React.FC<AddTacheModalProps> = ({ isOpen, onClose, onAdd, etudiants = [] }) => {
  const [newTache, setNewTache] = useState<NewTache>({
    titre: '',
    description: '',
    dateEcheance: '',
    priorite: 'Moyenne',
    tags: [],
    consigne: '',
    etudiantsAssignes: []
  });
  const [tagInput, setTagInput] = useState('');
  const [searchEtudiant, setSearchEtudiant] = useState('');

  // Initialiser avec tous les étudiants sélectionnés par défaut
  useEffect(() => {
    if (isOpen && etudiants.length > 0) {
      setNewTache(prev => ({
        ...prev,
        etudiantsAssignes: etudiants.map(e => e.id)
      }));
    }
  }, [isOpen, etudiants]);

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
      consigne: '',
      etudiantsAssignes: []
    });
    setTagInput('');
    onClose();
  };

  const toggleEtudiant = (id: number) => {
    const currentAssignes = newTache.etudiantsAssignes || [];
    const isAssigned = currentAssignes.includes(id);

    if (isAssigned) {
      setNewTache({
        ...newTache,
        etudiantsAssignes: currentAssignes.filter(eid => eid !== id)
      });
    } else {
      setNewTache({
        ...newTache,
        etudiantsAssignes: [...currentAssignes, id]
      });
    }
  };

  const toggleAllEtudiants = () => {
    const currentAssignes = newTache.etudiantsAssignes || [];
    const allSelected = currentAssignes.length === etudiants.length;

    if (allSelected) {
      setNewTache({
        ...newTache,
        etudiantsAssignes: []
      });
    } else {
      setNewTache({
        ...newTache,
        etudiantsAssignes: etudiants.map(e => e.id)
      });
    }
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
          className="bg-white max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Ajouter une tâche commune</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
              <input
                type="text"
                value={newTache.titre}
                onChange={(e) => setNewTache({ ...newTache, titre: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Titre de la tâche"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                value={newTache.description}
                onChange={(e) => setNewTache({ ...newTache, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows={3}
                placeholder="Description de la tâche"
              />
            </div>

            {etudiants.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assigné à</label>

                <div className="border border-gray-200 rounded-md p-3">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newTache.etudiantsAssignes?.length === etudiants.length}
                        onChange={toggleAllEtudiants}
                        className="rounded border-gray-300 text-primary focus:ring-primary mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Tous les étudiants</span>
                    </label>
                    <span className="text-xs text-gray-500">
                      {newTache.etudiantsAssignes?.length || 0}/{etudiants.length}
                    </span>
                  </div>

                  <input
                    type="text"
                    placeholder="Rechercher un étudiant..."
                    value={searchEtudiant}
                    onChange={(e) => setSearchEtudiant(e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded mb-2 focus:outline-none focus:border-primary"
                  />

                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {etudiants
                      .filter(et =>
                        `${et.prenom} ${et.nom}`.toLowerCase().includes(searchEtudiant.toLowerCase())
                      )
                      .map(etudiant => (
                        <label key={etudiant.id} className="flex items-center px-1 py-1 hover:bg-gray-50 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newTache.etudiantsAssignes?.includes(etudiant.id)}
                            onChange={() => toggleEtudiant(etudiant.id)}
                            className="rounded border-gray-300 text-primary focus:ring-primary mr-2"
                          />
                          <span className="text-sm text-gray-700">{etudiant.prenom} {etudiant.nom}</span>
                        </label>
                      ))}
                    {etudiants.filter(et => `${et.prenom} ${et.nom}`.toLowerCase().includes(searchEtudiant.toLowerCase())).length === 0 && (
                      <p className="text-xs text-gray-500 text-center py-2">Aucun étudiant trouvé</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date d'échéance</label>
                <input
                  type="date"
                  value={newTache.dateEcheance}
                  onChange={(e) => setNewTache({ ...newTache, dateEcheance: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
                <select
                  value={newTache.priorite}
                  onChange={(e) => setNewTache({ ...newTache, priorite: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="Basse">Basse</option>
                  <option value="Moyenne">Moyenne</option>
                  <option value="Haute">Haute</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Consigne (optionnel)</label>
              <textarea
                value={newTache.consigne || ''}
                onChange={(e) => setNewTache({ ...newTache, consigne: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows={2}
                placeholder="Instructions spécifiques..."
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
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ajouter un tag"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
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
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              disabled={!newTache.titre.trim() || !newTache.description.trim()}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Ajouter la tâche
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

