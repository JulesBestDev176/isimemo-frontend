import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiHome, FiLayout, FiUsers, FiInfo } from 'react-icons/fi';
import { motion } from 'framer-motion';

const AddClassroom: React.FC = () => {
  const [donneeFormulaire, setDonneeFormulaire] = useState({
    nom: '',
    capacite: '',
    batiment: '',
    etage: '',
    description: '',
  });

  const gererChangement = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDonneeFormulaire(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const soumettreFormulaire = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique pour soumettre le formulaire
    console.log('Formulaire soumis:', donneeFormulaire);
    alert('Salle de classe ajoutée avec succès!');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Ajouter une salle de classe</h1>
        <Link to="/classrooms" className="btn-outline">
          <FiArrowLeft className="mr-2" /> Retour à la liste
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card p-6"
      >
        

        <form onSubmit={soumettreFormulaire}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiInfo className="mr-1 text-primary" /> Nom de la salle*
              </label>
              <input
                type="text"
                id="nom"
                name="nom"
                required
                value={donneeFormulaire.nom}
                onChange={gererChangement}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="Ex: Salle 101"
              />
            </div>
            
            <div>
              <label htmlFor="capacite" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiUsers className="mr-1 text-primary" /> Capacité*
              </label>
              <input
                type="number"
                id="capacite"
                name="capacite"
                required
                min="1"
                value={donneeFormulaire.capacite}
                onChange={gererChangement}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="Ex: 30"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="batiment" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiHome className="mr-1 text-primary" /> Bâtiment*
              </label>
              <input
                type="text"
                id="batiment"
                name="batiment"
                required
                value={donneeFormulaire.batiment}
                onChange={gererChangement}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="Ex: Bâtiment A"
              />
            </div>
            
            <div>
              <label htmlFor="etage" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiLayout className="mr-1 text-primary" /> Étage*
              </label>
              <input
                type="text"
                id="etage"
                name="etage"
                required
                value={donneeFormulaire.etage}
                onChange={gererChangement}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="Ex: 1er étage"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <FiInfo className="mr-1 text-primary" /> Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={donneeFormulaire.description}
              onChange={gererChangement}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              placeholder="Description de la salle (équipements, particularités, etc.)"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="btn-primary">
              <FiSave className="mr-2" /> Enregistrer
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddClassroom;