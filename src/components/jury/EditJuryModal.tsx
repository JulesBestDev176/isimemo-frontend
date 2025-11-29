import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Users, UserPlus, UserMinus, Shuffle } from 'lucide-react';
import { Jury, StatutJury, swapDates, mockJurys } from '../../models/soutenance/Jury';
import { Professeur, mockProfesseurs } from '../../models/acteurs/Professeur';
import { DossierMemoire, mockDossiers } from '../../models/dossier/DossierMemoire';
import { Salle, mockSalles } from '../../models/infrastructure/Salle';
import { RoleJury } from '../../models/soutenance/MembreJury';

interface EditJuryModalProps {
  isOpen: boolean;
  onClose: () => void;
  jury: Jury | null;
  onSave: (updatedJury: Jury) => void;
  allJurys: Jury[];
}

export const EditJuryModal: React.FC<EditJuryModalProps> = ({
  isOpen,
  onClose,
  jury,
  onSave,
  allJurys
}) => {
  const [editedJury, setEditedJury] = useState<Jury | null>(null);
  const [showSwapModal, setShowSwapModal] = useState(false);

  useEffect(() => {
    if (jury) {
      setEditedJury({ ...jury });
    }
  }, [jury]);

  if (!isOpen || !editedJury) return null;

  const handleSave = () => {
    onSave(editedJury);
    onClose();
  };

  const handleAddMembre = (professeur: Professeur, role: RoleJury) => {
    const newMembres = [...editedJury.membres, { professeur, role }];
    setEditedJury({ ...editedJury, membres: newMembres });
  };

  const handleRemoveMembre = (index: number) => {
    const newMembres = editedJury.membres.filter((_, i) => i !== index);
    setEditedJury({ ...editedJury, membres: newMembres });
  };

  const handleAddDossier = (dossier: DossierMemoire) => {
    const newDossiers = [...editedJury.dossiers, dossier];
    setEditedJury({ ...editedJury, dossiers: newDossiers });
  };

  const handleRemoveDossier = (index: number) => {
    const newDossiers = editedJury.dossiers.filter((_, i) => i !== index);
    setEditedJury({ ...editedJury, dossiers: newDossiers });
  };

  const handleSwapDate = (targetJuryId: number) => {
    const success = swapDates(editedJury.idJury, targetJuryId);
    if (success) {
      const updatedJury = mockJurys.find(j => j.idJury === editedJury.idJury);
      if (updatedJury) {
        setEditedJury({ ...updatedJury });
      }
      setShowSwapModal(false);
    }
  };

  const availableProfesseurs = mockProfesseurs.filter(
    p => !editedJury.membres.some(m => m.professeur.idProfesseur === p.idProfesseur)
  );

  const availableDossiers = mockDossiers.filter(
    d => !editedJury.dossiers.some(dossier => dossier.idDossierMemoire === d.idDossierMemoire)
  );

  const otherJurys = allJurys.filter(j => j.idJury !== editedJury.idJury);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white border border-gray-200 p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Modifier le Jury</h2>
            <p className="text-sm text-gray-500">{editedJury.nom}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Date et Horaires */}
          <div className="border border-gray-200 p-4 rounded">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-navy" />
              Date et Horaires
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={editedJury.dateSoutenance?.toISOString().split('T')[0] || ''}
                  onChange={(e) => setEditedJury({
                    ...editedJury,
                    dateSoutenance: new Date(e.target.value)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-navy"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heure début</label>
                <input
                  type="time"
                  value={editedJury.heureDebut || ''}
                  onChange={(e) => setEditedJury({ ...editedJury, heureDebut: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-navy"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heure fin</label>
                <input
                  type="time"
                  value={editedJury.heureFin || ''}
                  onChange={(e) => setEditedJury({ ...editedJury, heureFin: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-navy"
                />
              </div>
            </div>
            <button
              onClick={() => setShowSwapModal(true)}
              className="mt-3 text-sm text-navy hover:underline flex items-center"
            >
              <Shuffle className="h-4 w-4 mr-1" />
              Échanger la date avec un autre jury
            </button>
          </div>

          {/* Salle */}
          <div className="border border-gray-200 p-4 rounded">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-navy" />
              Salle
            </h3>
            <select
              value={editedJury.salle?.idSalle || ''}
              onChange={(e) => {
                const salle = mockSalles.find(s => s.idSalle === Number(e.target.value));
                setEditedJury({ ...editedJury, salle });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-navy"
            >
              <option value="">Sélectionner une salle</option>
              {mockSalles.map(salle => (
                <option key={salle.idSalle} value={salle.idSalle}>
                  {salle.nom} - {salle.batiment} (Capacité: {salle.capacite})
                </option>
              ))}
            </select>
          </div>

          {/* Membres du Jury */}
          <div className="border border-gray-200 p-4 rounded">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Users className="h-5 w-5 mr-2 text-navy" />
              Membres du Jury ({editedJury.membres.length})
            </h3>
            <div className="space-y-2 mb-3">
              {editedJury.membres.map((membre, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">{membre.professeur.prenom} {membre.professeur.nom}</span>
                    <span className="ml-2 text-sm text-gray-600">({membre.role})</span>
                  </div>
                  <button
                    onClick={() => handleRemoveMembre(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <UserMinus className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            {availableProfesseurs.length > 0 && (
              <details className="mt-3">
                <summary className="cursor-pointer text-sm text-navy hover:underline flex items-center">
                  <UserPlus className="h-4 w-4 mr-1" />
                  Ajouter un membre
                </summary>
                <div className="mt-2 max-h-40 overflow-y-auto">
                  {availableProfesseurs.map(prof => (
                    <div key={prof.idProfesseur} className="flex items-center justify-between p-2 hover:bg-gray-50">
                      <span className="text-sm">{prof.prenom} {prof.nom}</span>
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleAddMembre(prof, e.target.value as RoleJury);
                            e.target.value = '';
                          }
                        }}
                        className="text-sm px-2 py-1 border border-gray-300 rounded"
                      >
                        <option value="">Rôle...</option>
                        <option value={RoleJury.PRESIDENT}>Président</option>
                        <option value={RoleJury.RAPPORTEUR}>Rapporteur</option>
                        <option value={RoleJury.EXAMINATEUR}>Examinateur</option>
                      </select>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>

          {/* Étudiants */}
          <div className="border border-gray-200 p-4 rounded">
            <h3 className="font-semibold text-gray-900 mb-3">
              Étudiants ({editedJury.dossiers.length})
            </h3>
            <div className="space-y-2 mb-3 max-h-60 overflow-y-auto">
              {editedJury.dossiers.map((dossier, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{dossier.titre}</div>
                    <div className="text-xs text-gray-600">
                      {dossier.candidats?.map(c => `${c.prenom} ${c.nom}`).join(', ')}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveDossier(index)}
                    className="text-red-600 hover:text-red-800 ml-2"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-navy border border-navy hover:bg-navy-dark"
          >
            Enregistrer
          </button>
        </div>
      </div>

      {/* Modal d'échange de date */}
      {showSwapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white border border-gray-200 p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Échanger la date</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {otherJurys.map(j => (
                <button
                  key={j.idJury}
                  onClick={() => handleSwapDate(j.idJury)}
                  className="w-full text-left p-3 border border-gray-200 rounded hover:bg-gray-50"
                >
                  <div className="font-medium">{j.nom}</div>
                  <div className="text-sm text-gray-600">
                    {j.dateSoutenance?.toLocaleDateString('fr-FR')} - {j.heureDebut}
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowSwapModal(false)}
              className="mt-4 w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
