import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiCalendar, FiSave, FiArrowLeft, FiClock, FiUsers, FiMapPin, FiVideo, FiInfo, FiLink, FiAlertCircle, FiUserPlus, FiCheck } from 'react-icons/fi';
import { motion } from 'framer-motion';

type TypeEvenement = 'enligne' | 'presentiel';

interface Participant {
  id: string;
  nom: string;
}

const PageAjouterEvenement: React.FC = () => {
  const navigate = useNavigate();
  
  
  
  // État du formulaire
  const [formulaire, setFormulaire] = useState({
    titre: '',
    description: '',
    dateDebut: '',
    heureDebut: '',
    dateFin: '',
    heureFin: '',
    typeEvenement: 'presentiel' as TypeEvenement,
    lieu: '',
    lienVisio: '',
    couleur: '#3b82f6', // Bleu par défaut
    participantsSelectionnes: [] as string[]
  });
  
  // État de soumission et erreurs
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  // Liste de couleurs disponibles pour les événements
  const couleurs = [
    { valeur: '#3b82f6', nom: 'Bleu' },
    { valeur: '#10b981', nom: 'Vert' },
    { valeur: '#ef4444', nom: 'Rouge' },
    { valeur: '#f59e0b', nom: 'Orange' },
    { valeur: '#8b5cf6', nom: 'Violet' },
    { valeur: '#ec4899', nom: 'Rose' },
    { valeur: '#6b7280', nom: 'Gris' },
  ];

  // Validation du formulaire
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formulaire.titre.trim()) {
      newErrors.titre = "Le titre de l'événement est obligatoire";
    } else if (formulaire.titre.length < 3) {
      newErrors.titre = "Le titre doit contenir au moins 3 caractères";
    }
    
    if (!formulaire.dateDebut) {
      newErrors.dateDebut = "La date de début est obligatoire";
    }
    
    if (!formulaire.heureDebut) {
      newErrors.heureDebut = "L'heure de début est obligatoire";
    }
    
    if (!formulaire.dateFin) {
      newErrors.dateFin = "La date de fin est obligatoire";
    }
    
    if (!formulaire.heureFin) {
      newErrors.heureFin = "L'heure de fin est obligatoire";
    }
    
    if (formulaire.typeEvenement === 'presentiel' && !formulaire.lieu.trim()) {
      newErrors.lieu = "Le lieu est obligatoire pour un événement présentiel";
    }
    
    if (formulaire.typeEvenement === 'enligne' && !formulaire.lienVisio.trim()) {
      newErrors.lienVisio = "Le lien de visioconférence est obligatoire pour un événement en ligne";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gérer les changements dans le formulaire
  const handleChangement = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormulaire(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur pour ce champ si elle existe
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Gérer les changements de type d'événement
  const handleChangementType = (type: TypeEvenement) => {
    setFormulaire(prev => ({
      ...prev,
      typeEvenement: type,
      // Réinitialiser les champs spécifiques au type d'événement
      ...(type === 'enligne' ? { lieu: '' } : { lienVisio: '' })
    }));
    
    // Effacer les erreurs associées
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.lieu;
      delete newErrors.lienVisio;
      return newErrors;
    });
  };
  
  // Gérer les changements de participants
  const toggleParticipant = (id: string) => {
    setFormulaire(prev => {
      const estDejaSelectionne = prev.participantsSelectionnes.includes(id);
      
      if (estDejaSelectionne) {
        return {
          ...prev,
          participantsSelectionnes: prev.participantsSelectionnes.filter(p => p !== id)
        };
      } else {
        return {
          ...prev,
          participantsSelectionnes: [...prev.participantsSelectionnes, id]
        };
      }
    });
  };

  // Soumettre le formulaire
  const soumettreFormulaire = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Logique pour soumettre le formulaire
      console.log('Événement créé:', formulaire);
      setFormSubmitted(true);
      
      // Simuler un délai puis rediriger
      setTimeout(() => {
        navigate('/calendrier');
      }, 2000);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Ajouter un événement</h1>
        <Link to="/calendrier" className="btn-outline">
          <FiArrowLeft className="mr-2" /> Retour au calendrier
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card p-6"
      >
        {formSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-8"
          >
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
              <FiCheck className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Événement ajouté avec succès!</h2>
            <p className="text-gray-600 text-center mb-6">
              L'événement a été créé et est maintenant disponible dans le calendrier.
            </p>
            <div className="flex space-x-4">
              <Link to="/calendrier" className="btn-outline">
                Retour au calendrier
              </Link>
              <Link to="/calendrier/ajouter" className="btn-primary" onClick={() => {
                setFormulaire({
                  titre: '',
                  description: '',
                  dateDebut: '',
                  heureDebut: '',
                  dateFin: '',
                  heureFin: '',
                  typeEvenement: 'presentiel',
                  lieu: '',
                  lienVisio: '',
                  couleur: '#3b82f6',
                  participantsSelectionnes: []
                });
                setFormSubmitted(false);
              }}>
                Ajouter un autre événement
              </Link>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={soumettreFormulaire}>
            {/* Informations générales */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Informations générales</h3>
              
              <div className="mb-4">
                <div className="flex items-center mb-1">
                  <label htmlFor="titre" className="block text-sm font-medium text-gray-700">
                    Titre de l'événement*
                  </label>
                  {errors.titre && (
                    <span className="ml-2 text-xs text-red-600 flex items-center">
                      <FiAlertCircle className="mr-1" /> {errors.titre}
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  id="titre"
                  name="titre"
                  required
                  value={formulaire.titre}
                  onChange={handleChangement}
                  className={`w-full rounded-md border ${errors.titre ? 'border-red-300 bg-red-50' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                  placeholder="Ex: Réunion hebdomadaire"
                />
                {errors.titre && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.titre}
                  </p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formulaire.description}
                  onChange={handleChangement}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="Description de l'événement..."
                ></textarea>
                <p className="mt-1 text-xs text-gray-500">
                  Fournissez une description détaillée pour aider les participants à comprendre l'objectif de cet événement.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center mb-1">
                    <label htmlFor="dateDebut" className="block text-sm font-medium text-gray-700">
                      Date de début*
                    </label>
                    {errors.dateDebut && (
                      <span className="ml-2 text-xs text-red-600 flex items-center">
                        <FiAlertCircle className="mr-1" /> {errors.dateDebut}
                      </span>
                    )}
                  </div>
                  <input
                    type="date"
                    id="dateDebut"
                    name="dateDebut"
                    required
                    value={formulaire.dateDebut}
                    onChange={handleChangement}
                    className={`w-full rounded-md border ${errors.dateDebut ? 'border-red-300 bg-red-50' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                  />
                </div>
                
                <div>
                  <div className="flex items-center mb-1">
                    <label htmlFor="heureDebut" className="block text-sm font-medium text-gray-700">
                      Heure de début*
                    </label>
                    {errors.heureDebut && (
                      <span className="ml-2 text-xs text-red-600 flex items-center">
                        <FiAlertCircle className="mr-1" /> {errors.heureDebut}
                      </span>
                    )}
                  </div>
                  <input
                    type="time"
                    id="heureDebut"
                    name="heureDebut"
                    required
                    value={formulaire.heureDebut}
                    onChange={handleChangement}
                    className={`w-full rounded-md border ${errors.heureDebut ? 'border-red-300 bg-red-50' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <div className="flex items-center mb-1">
                    <label htmlFor="dateFin" className="block text-sm font-medium text-gray-700">
                      Date de fin*
                    </label>
                    {errors.dateFin && (
                      <span className="ml-2 text-xs text-red-600 flex items-center">
                        <FiAlertCircle className="mr-1" /> {errors.dateFin}
                      </span>
                    )}
                  </div>
                  <input
                    type="date"
                    id="dateFin"
                    name="dateFin"
                    required
                    value={formulaire.dateFin}
                    onChange={handleChangement}
                    className={`w-full rounded-md border ${errors.dateFin ? 'border-red-300 bg-red-50' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                  />
                </div>
                
                <div>
                  <div className="flex items-center mb-1">
                    <label htmlFor="heureFin" className="block text-sm font-medium text-gray-700">
                      Heure de fin*
                    </label>
                    {errors.heureFin && (
                      <span className="ml-2 text-xs text-red-600 flex items-center">
                        <FiAlertCircle className="mr-1" /> {errors.heureFin}
                      </span>
                    )}
                  </div>
                  <input
                    type="time"
                    id="heureFin"
                    name="heureFin"
                    required
                    value={formulaire.heureFin}
                    onChange={handleChangement}
                    className={`w-full rounded-md border ${errors.heureFin ? 'border-red-300 bg-red-50' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                  />
                </div>
              </div>
            </div>
            
            {/* Type d'événement */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Type d'événement</h3>
              
              <div className="flex space-x-4 mb-4">
                <button
                  type="button"
                  onClick={() => handleChangementType('presentiel')}
                  className={`flex-1 py-3 px-4 rounded-md border flex items-center justify-center transition-colors ${
                    formulaire.typeEvenement === 'presentiel'
                      ? 'bg-primary text-white border-primary'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <FiMapPin className="mr-2" /> Présentiel
                </button>
                
                <button
                  type="button"
                  onClick={() => handleChangementType('enligne')}
                  className={`flex-1 py-3 px-4 rounded-md border flex items-center justify-center transition-colors ${
                    formulaire.typeEvenement === 'enligne'
                      ? 'bg-primary text-white border-primary'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <FiVideo className="mr-2" /> En ligne
                </button>
              </div>
              
              {formulaire.typeEvenement === 'presentiel' && (
                <div>
                  <div className="flex items-center mb-1">
                    <label htmlFor="lieu" className="block text-sm font-medium text-gray-700">
                      Lieu*
                    </label>
                    {errors.lieu && (
                      <span className="ml-2 text-xs text-red-600 flex items-center">
                        <FiAlertCircle className="mr-1" /> {errors.lieu}
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    id="lieu"
                    name="lieu"
                    required
                    value={formulaire.lieu}
                    onChange={handleChangement}
                    className={`w-full rounded-md border ${errors.lieu ? 'border-red-300 bg-red-50' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                    placeholder="Ex: Salle de conférence, Bâtiment A"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Spécifiez un lieu précis pour faciliter l'orientation des participants.
                  </p>
                </div>
              )}
              
              {formulaire.typeEvenement === 'enligne' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="lienVisio" className="block text-sm font-medium text-gray-700">
                      Lien de visioconférence*
                    </label>
                    <a href="https://meet.isimemo.edu.sn" target="_blank" rel="noopener noreferrer" className="text-primary text-sm flex items-center hover:underline">
                      <FiVideo className="mr-1 h-4 w-4" /> Créer une nouvelle visioconférence
                    </a>
                  </div>
                  <input
                    type="url"
                    id="lienVisio"
                    name="lienVisio"
                    required
                    value={formulaire.lienVisio}
                    onChange={handleChangement}
                    className={`w-full rounded-md border ${errors.lienVisio ? 'border-red-300 bg-red-50' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                    placeholder="Ex: https://meet.isimemo.edu.sn/reunion"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Assurez-vous que les participants ont les droits d'accès nécessaires.
                  </p>
                </div>
              )}
            </div>
            
            {/* Participants */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold flex items-center">
                  <FiUsers className="mr-2" /> Participants
                </h3>
                <Link to="/staff/add" className="text-primary text-sm flex items-center hover:underline">
                  <FiUserPlus className="mr-1 h-4 w-4" /> Ajouter un nouveau participant
                </Link>
              </div>
              
              
              <p className="mt-2 text-xs text-gray-500">
                Sélectionnez tous les participants qui doivent être invités à cet événement.
              </p>
            </div>
            
            {/* Couleur de l'événement */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Couleur de l'événement</h3>
              
              <div className="flex flex-wrap gap-3">
                {couleurs.map(couleur => (
                  <button
                    key={couleur.valeur}
                    type="button"
                    onClick={() => setFormulaire(prev => ({ ...prev, couleur: couleur.valeur }))}
                    className={`w-10 h-10 rounded-full border-2 ${
                      formulaire.couleur === couleur.valeur ? 'border-gray-800 ring-2 ring-offset-2 ring-gray-300' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: couleur.valeur }}
                    title={couleur.nom}
                  ></button>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Choisissez une couleur pour identifier facilement cet événement dans le calendrier.
              </p>
            </div>
            
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <div className="flex space-x-3">
                <Link 
                  to="/calendrier" 
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-150 flex items-center"
                >
                  Annuler
                </Link>
                <button type="submit" className="btn-primary">
                  <FiSave className="mr-2" /> Enregistrer
                </button>
              </div>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default PageAjouterEvenement;