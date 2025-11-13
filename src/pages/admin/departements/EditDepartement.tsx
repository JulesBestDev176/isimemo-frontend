import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';

const EditDepartement: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    chief: '',
    active: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulation d'une requête API pour récupérer les données du département
    setTimeout(() => {
      // Données fictives pour l'exemple
      setFormData({
        name: 'Informatique',
        description: 'Département spécialisé dans les technologies de l\'information et de la communication.',
        location: 'Bâtiment A, 2ème étage',
        chief: '1',
        active: true,
      });
      setLoading(false);
    }, 500);
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
    // Logique pour soumettre le formulaire
    console.log('Formulaire soumis:', formData);
    alert('Département modifié avec succès!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Modifier le département</h1>
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
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nom du département*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Localisation
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="chief" className="block text-sm font-medium text-gray-700 mb-1">
                Chef de département
              </label>
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
              </select>
            </div>

            <div className="flex items-center mt-8">
              <input
                id="active"
                name="active"
                type="checkbox"
                checked={formData.active}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                Département actif
              </label>
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
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="btn-primary">
              <FiSave className="mr-2" /> Enregistrer les modifications
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditDepartement;