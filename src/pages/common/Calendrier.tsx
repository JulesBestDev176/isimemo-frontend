import React, { useState, useMemo } from 'react';
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  Presentation,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Video,
  Building
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { mockEvenements, mockSoutenances, EvenementCalendrier, Soutenance, TypeEvenement, ModeSoutenance } from '../../models';

// Utilitaires de date
const formatDate = (date: Date, format: string = 'short'): string => {
  if (format === 'short') {
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  }
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
};

const formatDateKey = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// Badge Component
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

// Calendrier simple
const SimpleCalendar: React.FC<{
  selectedDate: Date | undefined;
  onDateSelect: (date: Date) => void;
  eventsOnDays: string[];
}> = ({ selectedDate, onDateSelect, eventsOnDays }) => {
  const today = new Date();
  const [displayedMonth, setDisplayedMonth] = React.useState(selectedDate ? selectedDate.getMonth() : today.getMonth());
  const [displayedYear, setDisplayedYear] = React.useState(selectedDate ? selectedDate.getFullYear() : today.getFullYear());

  React.useEffect(() => {
    if (selectedDate) {
      setDisplayedMonth(selectedDate.getMonth());
      setDisplayedYear(selectedDate.getFullYear());
    }
  }, [selectedDate]);

  const currentMonth = new Date(displayedYear, displayedMonth, 1);
  const year = displayedYear;
  const month = displayedMonth;

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - ((firstDay.getDay() + 6) % 7));

  const days = [];
  const currentDate = new Date(startDate);
  for (let i = 0; i < 42; i++) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const handlePrevMonth = () => {
    if (month === 0) {
      setDisplayedMonth(11);
      setDisplayedYear(year - 1);
    } else {
      setDisplayedMonth(month - 1);
    }
  };
  
  const handleNextMonth = () => {
    if (month === 11) {
      setDisplayedMonth(0);
      setDisplayedYear(year + 1);
    } else {
      setDisplayedMonth(month + 1);
    }
  };

  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={handlePrevMonth} 
          className="p-2 hover:bg-navy-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="text-lg font-medium text-gray-900">
          {months[month]} {year}
        </div>
        <button 
          onClick={handleNextMonth} 
          className="p-2 hover:bg-navy-100 rounded-lg transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'].map((day, i) => (
          <div key={i} className="text-xs font-medium text-slate-500 py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isToday = isSameDay(day, today);
          const isCurrentMonth = day.getMonth() === month;
          const hasEvent = eventsOnDays.includes(formatDateKey(day));
          
          return (
            <button
              key={index}
              onClick={() => onDateSelect(day)}
              className={`
                h-10 w-10 text-sm transition-colors duration-200 relative border rounded
                ${isSelected 
                  ? 'bg-navy text-white border-navy' 
                  : isToday 
                    ? 'bg-navy-100 text-navy-dark font-medium border-slate-300'
                    : isCurrentMonth
                      ? 'text-slate-700 hover:bg-navy-50 border-transparent'
                      : 'text-slate-400 border-transparent'
                }
              `}
            >
              {day.getDate()}
              {hasEvent && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-navy rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Composant principal
const Calendrier: React.FC = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Combiner les événements et les soutenances
  const allEvents = useMemo(() => {
    const events: Array<EvenementCalendrier | { type: 'soutenance', data: Soutenance }> = [];
    
    // Ajouter les événements du calendrier
    mockEvenements.forEach(event => {
      events.push(event);
    });
    
    // Ajouter les soutenances si elles existent
    if (mockSoutenances && mockSoutenances.length > 0) {
      mockSoutenances.forEach(soutenance => {
        events.push({
          type: 'soutenance',
          data: soutenance
        } as any);
      });
    }
    
    return events;
  }, []);

  // Jours avec événements
  const joursAvecEvenements = useMemo(() => {
    const jours: string[] = [];
    allEvents.forEach(event => {
      if ('dateDebut' in event) {
        jours.push(formatDateKey(event.dateDebut));
      } else if ((event as any).type === 'soutenance' && (event as any).data.dateSoutenance) {
        jours.push(formatDateKey((event as any).data.dateSoutenance));
      }
    });
    return Array.from(new Set(jours));
  }, [allEvents]);

  // Événements du jour sélectionné
  const evenementsDuJour = useMemo(() => {
    if (!selectedDate) return [];
    
    return allEvents.filter(event => {
      if ('dateDebut' in event) {
        return isSameDay(event.dateDebut, selectedDate);
      } else if ((event as any).type === 'soutenance' && (event as any).data.dateSoutenance) {
        return isSameDay((event as any).data.dateSoutenance, selectedDate);
      }
      return false;
    });
  }, [selectedDate, allEvents]);

  // Obtenir le type d'événement pour l'affichage
  const getEventTypeLabel = (event: EvenementCalendrier | any): string => {
    if (event.type === 'soutenance') {
      return 'Soutenance';
    }
    if ('type' in event) {
      const types: Record<TypeEvenement, string> = {
        [TypeEvenement.SOUTENANCE]: 'Soutenance',
        [TypeEvenement.ECHANCE]: 'Échéance',
        [TypeEvenement.RENDEZ_VOUS]: 'Rendez-vous',
        [TypeEvenement.AUTRE]: 'Autre'
      };
      return types[event.type] || 'Événement';
    }
    return 'Événement';
  };

  // Obtenir la couleur selon le type
  const getEventColor = (event: EvenementCalendrier | any): string => {
    if (event.type === 'soutenance') {
      return 'bg-primary-100 border-primary-300 text-primary-900';
    }
    if ('type' in event) {
      switch (event.type) {
        case TypeEvenement.SOUTENANCE:
          return 'bg-primary-100 border-primary-300 text-primary-900';
        case TypeEvenement.ECHANCE:
          return 'bg-orange-100 border-orange-300 text-orange-900';
        case TypeEvenement.RENDEZ_VOUS:
          return 'bg-blue-100 border-blue-300 text-blue-900';
        default:
          return 'bg-gray-100 border-gray-300 text-gray-900';
      }
    }
    return 'bg-gray-100 border-gray-300 text-gray-900';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Calendrier</h1>
              <p className="text-sm text-gray-600">
                Consultez vos événements, échéances et soutenances
              </p>
            </div>
            <button
              onClick={() => setSelectedDate(new Date())}
              className="btn-primary flex items-center"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Aujourd'hui
            </button>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendrier */}
          <div className="bg-white border border-gray-200">
            <SimpleCalendar 
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              eventsOnDays={joursAvecEvenements}
            />
          </div>

          {/* Événements du jour sélectionné */}
          <div className="lg:col-span-2 bg-white border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedDate ? formatDate(selectedDate, 'long') : 'Sélectionnez une date'}
              </h2>
              <Badge variant="info">{evenementsDuJour.length} événement{evenementsDuJour.length > 1 ? 's' : ''}</Badge>
            </div>

            {evenementsDuJour.length > 0 ? (
              <div className="space-y-4">
                <AnimatePresence>
                  {evenementsDuJour.map((event, index) => {
                    const isSoutenance = 'type' in event && event.type === 'soutenance';
                    const eventData = isSoutenance ? (event as any).data : event as EvenementCalendrier;
                    
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className={`border rounded-lg p-4 ${getEventColor(event)}`}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mr-4">
                            {isSoutenance ? (
                              <Presentation className="h-5 w-5" />
                            ) : (event as EvenementCalendrier).type === TypeEvenement.ECHANCE ? (
                              <AlertCircle className="h-5 w-5" />
                            ) : (
                              <Calendar className="h-5 w-5" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-gray-900">
                                {isSoutenance ? 'Soutenance de mémoire' : (event as EvenementCalendrier).titre}
                              </h3>
                              <Badge variant="info">
                                {getEventTypeLabel(event)}
                              </Badge>
                            </div>
                            
                            {isSoutenance ? (
                              <>
                                <p className="text-sm text-gray-600 mb-2">
                                  {(event as any).data.mode === ModeSoutenance.PRESENTIEL 
                                    ? 'Soutenance en présentiel' 
                                    : 'Soutenance en ligne'}
                                </p>
                                <div className="space-y-1 text-sm text-gray-600">
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-2" />
                                    <span>
                                      {(event as any).data.heureDebut} - {(event as any).data.heureFin}
                                      {' '}({(event as any).data.duree} min)
                                    </span>
                                  </div>
                                  {(event as any).data.mode === ModeSoutenance.PRESENTIEL && (
                                    <div className="flex items-center">
                                      <MapPin className="h-4 w-4 mr-2" />
                                      <span>Lieu à confirmer</span>
                                    </div>
                                  )}
                                  {(event as any).data.mode === ModeSoutenance.LIGNE && (
                                    <div className="flex items-center">
                                      <Video className="h-4 w-4 mr-2" />
                                      <span>Lien de connexion à venir</span>
                                    </div>
                                  )}
                                </div>
                              </>
                            ) : (
                              <>
                                {(event as EvenementCalendrier).description && (
                                  <p className="text-sm text-gray-600 mb-2">
                                    {(event as EvenementCalendrier).description}
                                  </p>
                                )}
                                <div className="space-y-1 text-sm text-gray-600">
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-2" />
                                    <span>
                                      {formatTime((event as EvenementCalendrier).dateDebut)}
                                      {(event as EvenementCalendrier).dateFin && 
                                        ` - ${formatTime((event as EvenementCalendrier).dateFin)}`
                                      }
                                    </span>
                                  </div>
                                  {(event as EvenementCalendrier).lieu && (
                                    <div className="flex items-center">
                                      <MapPin className="h-4 w-4 mr-2" />
                                      <span>{(event as EvenementCalendrier).lieu}</span>
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun événement prévu pour cette date</p>
              </div>
            )}
          </div>
        </div>

        {/* Liste des prochains événements */}
        {allEvents.length > 0 && (
          <div className="mt-6 bg-white border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Prochains événements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allEvents
                .filter(event => {
                  const eventDate = 'dateDebut' in event 
                    ? event.dateDebut 
                    : (event as any).type === 'soutenance' && (event as any).data.dateSoutenance
                      ? (event as any).data.dateSoutenance
                      : null;
                  return eventDate && eventDate >= new Date();
                })
                .sort((a, b) => {
                  const dateA = 'dateDebut' in a 
                    ? a.dateDebut.getTime()
                    : (a as any).type === 'soutenance' && (a as any).data.dateSoutenance
                      ? (a as any).data.dateSoutenance.getTime()
                      : 0;
                  const dateB = 'dateDebut' in b 
                    ? b.dateDebut.getTime()
                    : (b as any).type === 'soutenance' && (b as any).data.dateSoutenance
                      ? (b as any).data.dateSoutenance.getTime()
                      : 0;
                  return dateA - dateB;
                })
                .slice(0, 6)
                .map((event, index) => {
                  const isSoutenance = 'type' in event && event.type === 'soutenance';
                  const eventDate = isSoutenance 
                    ? (event as any).data.dateSoutenance
                    : (event as EvenementCalendrier).dateDebut;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className={`border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow ${getEventColor(event)}`}
                      onClick={() => setSelectedDate(eventDate)}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          {isSoutenance ? (
                            <Presentation className="h-5 w-5" />
                          ) : (
                            <Calendar className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm mb-1">
                            {isSoutenance ? 'Soutenance' : (event as EvenementCalendrier).titre}
                          </h3>
                          <p className="text-xs text-gray-600">
                            {formatDate(eventDate)} • {formatTime(eventDate)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendrier;

