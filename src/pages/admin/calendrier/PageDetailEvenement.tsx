import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiClock, FiMapPin, FiVideo, FiUsers, FiEdit, FiTrash2, FiLink, FiMessageSquare } from 'react-icons/fi';
import { motion } from 'framer-motion';

// Types
interface Evenement {
  id: string;
  titre: string;
  description: string;
  dateDebut: Date;
  dateFin: Date;
  type: 'enligne' | 'presentiel';
  lieu?: string;
  lienVisio?: string;
  participants: string[];
  couleur: string;
}

const PageDetailEvenement: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [evenement, setEvenement] = useState<Evenement | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalSuppression, setModalSuppression] = useState<boolean>(false);

  // Simuler le chargement des données de l'événement
  useEffect(() => {
    // Dans une application réelle, vous feriez une requête API ici
    const simulerChargement = () => {
      setTimeout(() => {
        // Événement fictif pour la démonstration
        if (id === 'evt-001') {
          setEvenement({
            id: 'evt-001',
            titre: 'Réunion des chefs de département',
            description: 'Réunion mensuelle pour discuter des objectifs et suivre l\'avancement des projets en cours. Chaque chef de département présentera un rapport sur les activités de son département.',
            dateDebut: new Date(2025, 4, 15, 10, 0), // 15 mai 2025, 10:00
            dateFin: new Date(2025, 4, 15, 12, 0),   // 15 mai 2025, 12:00
            type: 'enligne',
            lienVisio: 'https://meet.isimemo.edu.sn/reunion-mensuelle',
            participants: ['Directeur', 'Chef Informatique', 'Chef Administration'],
            couleur: '#3b82f6' // Bleu
          });
        } else if (id === 'evt-002') {
          setEvenement({
            id: 'evt-002',
            titre: 'Séminaire de formation',
            description: 'Formation sur les nouvelles technologies de l\'information et de la communication appliquées à l\'enseignement. Prévoir un ordinateur portable pour les exercices pratiques.',
            dateDebut: new Date(2025, 4, 17, 9, 0),  // 17 mai 2025, 9:00
            dateFin: new Date(2025, 4, 17, 17, 0),   // 17 mai 2025, 17:00
            type: 'presentiel',
            lieu: 'Amphithéâtre A, Bâtiment Principal',
            participants: ['Tous les enseignants', 'Personnel administratif'],
            couleur: '#10b981' // Vert
          });
        } else if (id === 'evt-003') {
          setEvenement({
            id: 'evt-003',
            titre: 'Entretien de recrutement',
            description: 'Entretien pour le poste de responsable informatique. Le candidat fera une présentation de 20 minutes sur sa vision pour le département informatique, suivie d\'une séance de questions-réponses.',
            dateDebut: new Date(2025, 4, 20, 14, 30), // 20 mai 2025, 14:30
            dateFin: new Date(2025, 4, 20, 16, 0),    // 20 mai 2025, 16:00
            type: 'presentiel',
            lieu: 'Salle de conférence, 2ème étage',
            participants: ['DRH', 'Directeur', 'Chef Informatique'],
            couleur: '#8b5cf6' // Violet
          });
        } else {
          // Événement non trouvé
          navigate('/calendrier');
        }
        setLoading(false);
      }, 800); // Simuler un délai de chargement
    };

    simulerChargement();
  }, [id, navigate]);

  // Formater la date pour l'affichage
  const formaterDateHeure = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Formater la date (sans l'heure)
  const formaterDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Formater l'heure
  const formaterHeure = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Supprimer l'événement
  const supprimerEvenement = () => {
    // Dans une application réelle, vous feriez une requête API ici
    console.log('Suppression de l\'événement', id);
    
    // Simuler la suppression
    alert('Événement supprimé avec succès!');
    
    // Rediriger vers le calendrier
    navigate('/calendrier');
  };

  // Calculer la durée de l'événement
  const calculerDuree = (debut: Date, fin: Date) => {
    const diffMs = fin.getTime() - debut.getTime();
    const diffHeures = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHeures > 0) {
      return `${diffHeures}h${diffMinutes > 0 ? ` ${diffMinutes}min` : ''}`;
    } else {
      return `${diffMinutes}min`;
    }
  };

  // Afficher un état de chargement
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-2"></div>
          <p>Chargement des détails de l'événement...</p>
        </div>
      </div>
    );
  }

  // Si l'événement n'est pas trouvé
  if (!evenement) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-red-50 p-4 rounded-md text-red-700">
          Événement non trouvé. <Link to="/calendrier" className="underline">Retourner au calendrier</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <Link to="/calendrier" className="flex items-center text-gray-600 hover:text-gray-800">
          <FiArrowLeft className="mr-2" /> Retour au calendrier
        </Link>
        
        <div className="flex space-x-2">
          <Link 
            to={`/calendrier/modifier/${id}`} 
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center"
          >
            <FiEdit className="mr-1" /> Modifier
          </Link>
          
          <button 
            onClick={() => setModalSuppression(true)}
            className="px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors flex items-center"
          >
            <FiTrash2 className="mr-1" /> Supprimer
          </button>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* En-tête de l'événement */}
        <div 
          className="rounded-t-lg p-6 text-white" 
          style={{ backgroundColor: evenement.couleur }}
        >
          <h1 className="text-2xl font-bold mb-2">{evenement.titre}</h1>
          
          <div className="flex items-center text-white text-opacity-90">
            <FiCalendar className="mr-2" />
            <span>
              {formaterDate(evenement.dateDebut)}
              {evenement.dateDebut.toDateString() !== evenement.dateFin.toDateString() && 
                ` - ${formaterDate(evenement.dateFin)}`}
            </span>
          </div>
        </div>
        
        {/* Détails de l'événement */}
        <div className="bg-white rounded-b-lg shadow-sm p-6">
          {/* Horaires */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="font-medium text-gray-600 mb-1 flex items-center">
                <FiClock className="mr-2 text-primary" /> Horaire
              </div>
              <div className="text-lg">
                {formaterHeure(evenement.dateDebut)} - {formaterHeure(evenement.dateFin)}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Durée: {calculerDuree(evenement.dateDebut, evenement.dateFin)}
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="font-medium text-gray-600 mb-1 flex items-center">
                {evenement.type === 'presentiel' ? (
                  <>
                    <FiMapPin className="mr-2 text-green-600" /> Lieu
                  </>
                ) : (
                  <>
                    <FiVideo className="mr-2 text-blue-500" /> Type
                  </>
                )}
              </div>
              <div className="text-lg">
                {evenement.type === 'presentiel' ? (
                  evenement.lieu
                ) : (
                  'Réunion en ligne'
                )}
              </div>
              {evenement.type === 'enligne' && (
                <a 
                  href={evenement.lienVisio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline flex items-center mt-1"
                >
                  <FiLink className="mr-1" /> Rejoindre la réunion
                </a>
              )}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="font-medium text-gray-600 mb-1 flex items-center">
                <FiUsers className="mr-2 text-primary" /> Participants
              </div>
              <div>
                {evenement.participants.map((participant, index) => (
                  <span key={index} className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm mr-2 mb-2">
                    {participant}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Description */}
          {evenement.description && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3 flex items-center">
                <FiMessageSquare className="mr-2 text-primary" /> Description
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="whitespace-pre-line">{evenement.description}</p>
              </div>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex justify-center mt-8">
            {evenement.type === 'enligne' ? (
              <a 
                href={evenement.lienVisio}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center"
              >
                <FiVideo className="mr-2" /> Rejoindre la réunion
              </a>
            ) : (
              <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center">
                <FiCalendar className="mr-2" /> Ajouter à mon agenda
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Modal de confirmation de suppression */}
      {modalSuppression && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Confirmer la suppression</h2>
            <p className="mb-6">
              Êtes-vous sûr de vouloir supprimer l'événement <span className="font-semibold">"{evenement.titre}"</span> ? Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setModalSuppression(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={supprimerEvenement}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageDetailEvenement;