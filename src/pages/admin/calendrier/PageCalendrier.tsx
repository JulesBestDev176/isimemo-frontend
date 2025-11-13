//reference
import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiPlus, FiCalendar, FiVideo, FiMapPin, FiUsers, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Types pour les événements
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

const PageCalendrier: React.FC = () => {
  // Données factices pour les événements
  const [evenements, setEvenements] = useState<Evenement[]>([
    {
      id: 'evt-001',
      titre: 'Réunion des chefs de département',
      description: 'Réunion mensuelle pour discuter des objectifs',
      dateDebut: new Date(2025, 4, 15, 10, 0), // 15 mai 2025, 10:00
      dateFin: new Date(2025, 4, 15, 12, 0),   // 15 mai 2025, 12:00
      type: 'enligne',
      lienVisio: 'https://meet.isimemo.edu.sn/reunion-mensuelle',
      participants: ['Directeur', 'Chef Informatique', 'Chef Administration'],
      couleur: 'bg-blue-500'
    },
    {
      id: 'evt-002',
      titre: 'Séminaire de formation',
      description: 'Formation sur les nouvelles technologies',
      dateDebut: new Date(2025, 4, 17, 9, 0),  // 17 mai 2025, 9:00
      dateFin: new Date(2025, 4, 17, 17, 0),   // 17 mai 2025, 17:00
      type: 'presentiel',
      lieu: 'Amphithéâtre A, Bâtiment Principal',
      participants: ['Tous les enseignants', 'Personnel administratif'],
      couleur: 'bg-green-500'
    },
    {
      id: 'evt-003',
      titre: 'Entretien de recrutement',
      description: 'Entretien pour le poste de responsable informatique',
      dateDebut: new Date(2025, 4, 20, 14, 30), // 20 mai 2025, 14:30
      dateFin: new Date(2025, 4, 20, 16, 0),    // 20 mai 2025, 16:00
      type: 'presentiel',
      lieu: 'Salle de conférence, 2ème étage',
      participants: ['DRH', 'Directeur', 'Chef Informatique'],
      couleur: 'bg-purple-500'
    }
  ]);

  // État pour la date actuelle du calendrier
  const [dateCourante, setDateCourante] = useState(new Date(2025, 4, 1)); // Mai 2025

  // Fonctions de navigation dans le calendrier
  const moisPrecedent = () => {
    const nouvelleDateCourante = new Date(dateCourante);
    nouvelleDateCourante.setMonth(dateCourante.getMonth() - 1);
    setDateCourante(nouvelleDateCourante);
  };

  const moisSuivant = () => {
    const nouvelleDateCourante = new Date(dateCourante);
    nouvelleDateCourante.setMonth(dateCourante.getMonth() + 1);
    setDateCourante(nouvelleDateCourante);
  };

  // Génération des jours du mois actuel
  const genererJoursMois = () => {
    const annee = dateCourante.getFullYear();
    const mois = dateCourante.getMonth();
    
    // Obtenir le premier jour du mois
    const premierJourMois = new Date(annee, mois, 1);
    const dernierJourMois = new Date(annee, mois + 1, 0);
    
    const joursSemaine = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const jours = [];
    
    // Remplir les jours du mois précédent
    const premierJourIndice = premierJourMois.getDay(); // 0 = dimanche, 1 = lundi, etc.
    const dernierJourMoisPrecedent = new Date(annee, mois, 0).getDate();
    
    for (let i = premierJourIndice - 1; i >= 0; i--) {
      jours.push({
        jour: dernierJourMoisPrecedent - i,
        mois: mois - 1,
        annee: annee,
        estMoisCourant: false
      });
    }
    
    // Remplir les jours du mois actuel
    for (let i = 1; i <= dernierJourMois.getDate(); i++) {
      jours.push({
        jour: i,
        mois: mois,
        annee: annee,
        estMoisCourant: true
      });
    }
    
    // Remplir les jours du mois suivant
    const jourManquants = 42 - jours.length; // 6 semaines * 7 jours = 42
    for (let i = 1; i <= jourManquants; i++) {
      jours.push({
        jour: i,
        mois: mois + 1,
        annee: annee,
        estMoisCourant: false
      });
    }
    
    return { joursSemaine, jours };
  };

  const { joursSemaine, jours } = genererJoursMois();

  // Vérifier si un jour a des événements
  const obtenirEvenementsDuJour = (jour: number, mois: number, annee: number) => {
    return evenements.filter(evt => {
      const dateEvt = new Date(evt.dateDebut);
      return dateEvt.getDate() === jour && 
             dateEvt.getMonth() === mois && 
             dateEvt.getFullYear() === annee;
    });
  };

  // Formater le nom du mois
  const obtenirNomMois = (date: Date) => {
    const noms = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return noms[date.getMonth()];
  };

  // Formatage de la date pour l'affichage
  const formaterDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Calendrier des événements</h1>
        <Link 
          to="/calendrier/ajouter" 
          className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          <FiPlus className="mr-2" /> Nouvel événement
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <button 
            onClick={moisPrecedent}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FiChevronLeft />
          </button>
          
          <h2 className="text-xl font-semibold">
            {obtenirNomMois(dateCourante)} {dateCourante.getFullYear()}
          </h2>
          
          <button 
            onClick={moisSuivant}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FiChevronRight />
          </button>
        </div>

        <div className="grid grid-cols-7 bg-gray-50">
          {joursSemaine.map(jour => (
            <div key={jour} className="py-2 text-center text-gray-500 text-sm font-medium">
              {jour}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {jours.map((jour, idx) => {
            const evenementsJour = obtenirEvenementsDuJour(jour.jour, jour.mois, jour.annee);
            const aujourdhui = new Date();
            const estAujourdhui = jour.jour === aujourdhui.getDate() && 
                                 jour.mois === aujourdhui.getMonth() && 
                                 jour.annee === aujourdhui.getFullYear();
            
            return (
              <div 
                key={idx} 
                className={`bg-white min-h-24 p-1 ${!jour.estMoisCourant ? 'text-gray-400' : ''}`}
              >
                <div className={`text-sm p-1 rounded-full w-7 h-7 flex items-center justify-center ${estAujourdhui ? 'bg-primary text-white' : ''}`}>
                  {jour.jour}
                </div>
                
                <div className="mt-1 space-y-1">
                  {evenementsJour.map(evt => (
                    <Link 
                      key={evt.id} 
                      to={`/calendrier/evenement/${evt.id}`}
                      className={`block text-xs p-1 rounded truncate text-white ${evt.couleur}`}
                    >
                      {evt.titre}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Événements à venir</h2>
        
        <div className="space-y-4">
          {evenements
            .filter(evt => evt.dateDebut >= new Date()) // Événements à venir ou aujourd'hui
            .sort((a, b) => a.dateDebut.getTime() - b.dateDebut.getTime()) // Tri par date
            .slice(0, 5) // Limiter aux 5 prochains
            .map(evt => (
              <motion.div 
                key={evt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-sm p-4 border-l-4 hover:shadow-md transition-shadow"
                style={{ borderLeftColor: evt.couleur.replace('bg-', 'rgb(59, 130, 246)') }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{evt.titre}</h3>
                    <p className="text-gray-600 text-sm mt-1">{evt.description}</p>
                    
                    <div className="mt-3 flex flex-wrap gap-3">
                      <div className="flex items-center text-sm text-gray-500">
                        <FiCalendar className="mr-1" />
                        <span>{formaterDate(evt.dateDebut)} - {formaterDate(evt.dateFin)}</span>
                      </div>
                      
                      {evt.type === 'enligne' ? (
                        <div className="flex items-center text-sm text-blue-500">
                          <FiVideo className="mr-1" />
                          <span>Réunion en ligne</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-sm text-green-600">
                          <FiMapPin className="mr-1" />
                          <span>{evt.lieu}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <FiUsers className="mr-1" />
                      <span>{evt.participants.length} participants</span>
                    </div>
                  </div>
                  
                  <Link
                    to={`/calendrier/evenement/${evt.id}`}
                    className="text-primary hover:underline text-sm"
                  >
                    Détails
                  </Link>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PageCalendrier;