import React, { useState, useEffect } from 'react';
import { 
  Calendar,
  Clock,
  Save,
  AlertCircle,
  CheckCircle,
  Info,
  Plus,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { 
  SessionSoutenance, 
  DisponibiliteJury, 
  JourDisponibilite, 
  Creneau,
  getSessionsOuvertes,
  getDisponibiliteForSession,
  StatutSession
} from '../../models';

// Composant Badge
const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'info' | 'error' | 'primary';
}> = ({ children, variant = 'info' }) => {
  const variants = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-orange-100 text-orange-800',
    info: 'bg-blue-100 text-blue-800',
    error: 'bg-red-100 text-red-800',
    primary: 'bg-primary-100 text-primary-800'
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

// Formatage des dates
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('fr-FR', { 
    weekday: 'long',
    day: 'numeric', 
    month: 'long'
  });
};

const Disponibilites: React.FC = () => {
  const { user } = useAuth();
  const [sessionsOuvertes, setSessionsOuvertes] = useState<SessionSoutenance[]>([]);
  const [selectedSession, setSelectedSession] = useState<SessionSoutenance | null>(null);
  const [disponibilite, setDisponibilite] = useState<DisponibiliteJury | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempJoursDisponibles, setTempJoursDisponibles] = useState<JourDisponibilite[]>([]);

  // Charger les sessions ouvertes au montage
  useEffect(() => {
    const sessions = getSessionsOuvertes();
    setSessionsOuvertes(sessions);
    if (sessions.length > 0) {
      setSelectedSession(sessions[0]);
    }
  }, []);

  // Charger la disponibilité pour la session sélectionnée
  useEffect(() => {
    if (selectedSession && user?.id) {
      const existingDispo = getDisponibiliteForSession(parseInt(user.id), selectedSession.id);
      setDisponibilite(existingDispo || null);
      
      // Initialiser le formulaire avec les jours de la session
      if (existingDispo) {
        setTempJoursDisponibles(JSON.parse(JSON.stringify(existingDispo.joursDisponibles)));
      } else {
        // Générer tous les jours entre dateDebut et dateFin
        const jours: Date[] = [];
        const debut = new Date(selectedSession.dateDebut);
        const fin = new Date(selectedSession.dateFin);
        const currentDate = new Date(debut);
        
        while (currentDate <= fin) {
          jours.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        // Si pas de dispo existante, on initialise avec des tableaux vides pour chaque jour de la session
        setTempJoursDisponibles(
          jours.map(date => ({
            date: date,
            creneaux: []
          }))
        );
      }
    }
  }, [selectedSession, user]);

  const handleAddCreneau = (dateIndex: number) => {
    const newJours = [...tempJoursDisponibles];
    // Si le jour n'existe pas encore dans tempJours (cas nouvelle dispo), on le crée
    if (!newJours[dateIndex]) {
      newJours[dateIndex] = {
        date: selectedSession!.joursSession[dateIndex],
        creneaux: []
      };
    }
    
    newJours[dateIndex].creneaux.push({
      heureDebut: '09:00',
      heureFin: '12:00'
    });
    setTempJoursDisponibles(newJours);
  };

  const handleRemoveCreneau = (dateIndex: number, creneauIndex: number) => {
    const newJours = [...tempJoursDisponibles];
    newJours[dateIndex].creneaux.splice(creneauIndex, 1);
    setTempJoursDisponibles(newJours);
  };

  const handleUpdateCreneau = (dateIndex: number, creneauIndex: number, field: keyof Creneau, value: string) => {
    const newJours = [...tempJoursDisponibles];
    newJours[dateIndex].creneaux[creneauIndex][field] = value;
    setTempJoursDisponibles(newJours);
  };

  const handleSave = () => {
    // TODO: Appel API pour sauvegarder
    console.log('Sauvegarde des disponibilités:', {
      sessionId: selectedSession?.id,
      jours: tempJoursDisponibles
    });
    
    // Simulation de mise à jour locale
    if (user?.id && selectedSession) {
      const newDispo: DisponibiliteJury = {
        id: disponibilite?.id || Date.now(),
        professeurId: parseInt(user.id),
        sessionId: selectedSession.id,
        session: selectedSession,
        joursDisponibles: tempJoursDisponibles,
        dateMiseAJour: new Date()
      };
      setDisponibilite(newDispo);
    }
    setIsEditing(false);
  };

  if (sessionsOuvertes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto bg-white border border-gray-200 p-8 text-center">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Aucune session ouverte</h2>
          <p className="text-gray-600">
            Il n'y a actuellement aucune session de soutenance ouverte pour la saisie des disponibilités.
            Vous serez notifié par le département lors de l'ouverture d'une session.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* En-tête */}
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Disponibilités Jury</h1>
              <p className="text-gray-600 mt-1">
                Renseignez vos créneaux horaires pour les sessions de soutenance actives.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success">Session Ouverte</Badge>
            </div>
          </div>

          {/* Sélecteur de session (supprimé car une seule session active à la fois) */}
        </div>

        {selectedSession && (
          <div className="space-y-6">
            {/* Info Session */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900">{selectedSession.nom}</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Veuillez indiquer vos disponibilités pour les jours suivants :
                </p>
              </div>
            </div>

            {/* Grille des jours */}
            <div className="bg-white border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Planning de la session</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Clock className="h-4 w-4" />
                    Modifier mes disponibilités
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Save className="h-4 w-4" />
                      Enregistrer
                    </button>
                  </div>
                )}
              </div>

              <div className="divide-y divide-gray-200">
                {selectedSession.joursSession.map((date, index) => {
                  // Trouver les dispos pour ce jour
                  // Si mode édition, on utilise tempJoursDisponibles, sinon disponibilite.joursDisponibles
                  const jourData = isEditing 
                    ? tempJoursDisponibles[index] 
                    : disponibilite?.joursDisponibles.find(j => new Date(j.date).toDateString() === new Date(date).toDateString());

                  const creneaux = jourData?.creneaux || [];

                  return (
                    <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        {/* Date */}
                        <div className="w-48 flex-shrink-0">
                          <div className="flex items-center gap-2 text-gray-900 font-medium">
                            <Calendar className="h-5 w-5 text-gray-500" />
                            <span className="capitalize">{formatDate(new Date(date))}</span>
                          </div>
                        </div>

                        {/* Créneaux */}
                        <div className="flex-1">
                          {isEditing ? (
                            <div className="space-y-3">
                              {creneaux.map((creneau, cIndex) => (
                                <div key={cIndex} className="flex items-center gap-2">
                                  <input
                                    type="time"
                                    value={creneau.heureDebut}
                                    onChange={(e) => handleUpdateCreneau(index, cIndex, 'heureDebut', e.target.value)}
                                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                                  />
                                  <span className="text-gray-400">à</span>
                                  <input
                                    type="time"
                                    value={creneau.heureFin}
                                    onChange={(e) => handleUpdateCreneau(index, cIndex, 'heureFin', e.target.value)}
                                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                                  />
                                  <button
                                    onClick={() => handleRemoveCreneau(index, cIndex)}
                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                              <button
                                onClick={() => handleAddCreneau(index)}
                                className="text-sm text-primary hover:text-primary-700 font-medium flex items-center gap-1"
                              >
                                <Plus className="h-4 w-4" />
                                Ajouter un créneau
                              </button>
                            </div>
                          ) : (
                            <div>
                              {creneaux.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                  {creneaux.map((creneau, cIndex) => (
                                    <span key={cIndex} className="inline-flex items-center px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-sm border border-blue-100">
                                      <Clock className="h-3 w-3 mr-1.5" />
                                      {creneau.heureDebut} - {creneau.heureFin}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-gray-400 text-sm italic">Aucune disponibilité renseignée</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Disponibilites;
