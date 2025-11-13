import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiCheck, FiAlertCircle, FiUserPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';

const AddDepartement: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    chief: '',
    active: true
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Le nom du département est obligatoire";
    } else if (formData.name.length < 3) {
      newErrors.name = "Le nom doit contenir au moins 3 caractères";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    if (validateForm()) {
      // Logique pour soumettre le formulaire
      console.log('Formulaire soumis:', formData);
      
      // Afficher une animation de succès et rediriger après un délai
      setTimeout(() => {
        navigate('/departements');
      }, 2000);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Ajouter un département</h1>
        <Link to="/departements" className="btn-outline">
          <FiArrowLeft className="mr-2" /> Retour à la liste
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card p-6"
      >
        {formSubmitted && Object.keys(errors).length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-8"
          >
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
              <FiCheck className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Département ajouté avec succès!</h2>
            <p className="text-gray-600 text-center mb-6">
              Le département a été créé et est maintenant disponible.
            </p>
            <div className="flex space-x-4">
              <Link to="/departements" className="btn-outline">
                Retour à la liste
              </Link>
              <Link to="/departements/add" className="btn-primary" onClick={() => {
                setFormData({
                  name: '',
                  description: '',
                  chief: '',
                  active: true
                });
                setFormSubmitted(false);
              }}>
                Ajouter un autre
              </Link>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <div className="flex items-center mb-1">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nom du département*
                </label>
                {errors.name && (
                  <span className="ml-2 text-xs text-red-600 flex items-center">
                    <FiAlertCircle className="mr-1" /> {errors.name}
                  </span>
                )}
              </div>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className={`w-full rounded-md border ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'} px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                placeholder="Ex: Informatique"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="chief" className="block text-sm font-medium text-gray-700">
                  Chef de département
                </label>
                <Link to="/staff/add" className="text-primary text-sm flex items-center hover:underline">
                  <FiUserPlus className="mr-1 h-4 w-4" /> Ajouter un nouveau chef
                </Link>
              </div>
              <select
                id="chief"
                name="chief"
                value={formData.chief}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="">Sélectionner un chef de département</option>
                <option value="1">Dr. Ahmed Diop</option>
                <option value="2">Dr. Fatou Sow</option>
                <option value="3">Dr. Ousmane Fall</option>
                <option value="4">Dr. Marie Faye</option>
                <option value="5">Dr. Ibrahima Ndiaye</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Vous pourrez modifier cette affectation ultérieurement.
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-center mb-1">
                <label htmlFor="active" className="block text-sm font-medium text-gray-700">
                  Statut du département
                </label>
              </div>
              <div className="mt-2">
                <div className="flex items-center">
                  <input
                    id="active"
                    name="active"
                    type="checkbox"
                    checked={formData.active}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                    Activer immédiatement ce département
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Un département actif sera visible et utilisable dans tout le système.
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="Description du département, son champ d'activité et ses missions principales..."
              ></textarea>
              <p className="mt-1 text-xs text-gray-500">
                Fournissez une description détaillée pour aider les utilisateurs à comprendre le rôle de ce département.
              </p>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <div className="flex space-x-3">
                <Link 
                  to="/departements" 
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

export default AddDepartement;