import React, { useMemo, useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  Presentation,
  FileText,
  AlertCircle,
  Globe,
  MapPin,
  Filter,
  X,
  Bell,
  Plus,
  BarChart3,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Video,
  Building
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

// Interface pour les événements
interface Evenement {
  id: number;
  titre: string;
  date: Date;
  dateFin: Date;
  type: "reunion" | "seminaire" | "deadline" | "autre";
  modalite?: "presentiel" | "ligne";
  lieu?: string;
  lien?: string;
  participants?: string[];
  description?: string;
  important?: boolean;
}

// Utilitaires de date
const formatDate = (date: Date, format: string = 'short'): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: format === 'long' ? 'long' : undefined,
    year: 'numeric',
    month: format === 'long' ? 'long' : 'short',
    day: 'numeric'
  };
  return date.toLocaleDateString('fr-FR', options);
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
};

const isAfter = (date1: Date, date2: Date): boolean => {
  return date1.getTime() > date2.getTime();
};

const formatDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const addMonths = (date: Date, months: number): Date => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
};

// Hook pour les toasts (simplifié)
const useToast = () => ({
  addToast: (type: string, title: string, message: string) => {
    console.log(`${type}: ${title} - ${message}`);
    alert(`${title}: ${message}`);
  }
});

// Badge Component
const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'info' | 'error' | 'primary';
}> = ({ children, variant = 'info' }) => {
  const styles = {
    success: "bg-green-50 text-green-800 border border-green-200",
    warning: "bg-orange-50 text-orange-800 border border-orange-200",
    info: "bg-slate-50 text-slate-700 border border-slate-200",
    error: "bg-red-50 text-red-800 border border-red-200",
    primary: "bg-navy-50 text-navy-800 border border-navy-200"
  };
  
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
};

// Simple Button Component
const SimpleButton: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  onClick?: () => void;
  size?: 'sm' | 'md';
  disabled?: boolean;
}> = ({ children, variant = 'secondary', onClick, size = 'md', disabled = false }) => {
  const styles = {
    primary: 'bg-navy text-white border border-navy hover:bg-navy-dark',
    secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50',
    ghost: 'bg-transparent text-slate-600 border border-transparent hover:bg-slate-50',
    danger: 'bg-red-600 text-white border border-red-600 hover:bg-red-700'
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm'
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`font-medium transition-colors duration-200 flex items-center ${styles[variant]} ${sizeStyles[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};

// Tab Button Component
const TabButton: React.FC<{
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  count?: number;
}> = ({ children, isActive, onClick, icon, count }) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200
        ${isActive 
          ? 'border-navy text-navy bg-white' 
          : 'border-transparent text-slate-500 hover:text-navy-700 bg-slate-50'
        }
      `}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
      {count !== undefined && (
        <span className={`ml-2 px-2 py-0.5 text-xs font-medium border ${
          isActive 
            ? 'bg-navy-50 text-navy-700 border-navy-200' 
            : 'bg-navy-200 text-navy-600 border-navy-300'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
};

// Modal Component
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border border-gray-200 p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
};

// Dropdown pour les filtres
const FilterDropdown: React.FC<{
  filtres: any;
  toggleFiltre: (type: string) => void;
}> = ({ filtres, toggleFiltre }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <SimpleButton
        variant="secondary"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Filter className="mr-2 h-4 w-4" />
        Filtres
        {!filtres.toutes && (
          <span className="ml-2 text-xs bg-navy-dark text-white px-2 py-0.5">
            {Object.values(filtres).slice(1).filter(Boolean).length}/4
          </span>
        )}
        <ChevronDown className="ml-2 h-4 w-4" />
      </SimpleButton>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 shadow-lg z-10">
          <div className="p-3">
            <p className="text-sm font-medium text-slate-700 mb-3">Types d'événements</p>
            
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filtres.toutes}
                  onChange={() => toggleFiltre("toutes")}
                  className="mr-2"
                />
                <Calendar className="mr-2 h-4 w-4" />
                Tous les événements
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filtres.reunion}
                  onChange={() => toggleFiltre("reunion")}
                  className="mr-2"
                />
                <Users className="mr-2 h-4 w-4 text-slate-600" />
                Réunions
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filtres.seminaire}
                  onChange={() => toggleFiltre("seminaire")}
                  className="mr-2"
                />
                <Presentation className="mr-2 h-4 w-4 text-slate-600" />
                Séminaires
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filtres.deadline}
                  onChange={() => toggleFiltre("deadline")}
                  className="mr-2"
                />
                <Clock className="mr-2 h-4 w-4 text-slate-600" />
                Dates limites
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filtres.autre}
                  onChange={() => toggleFiltre("autre")}
                  className="mr-2"
                />
                <FileText className="mr-2 h-4 w-4 text-slate-600" />
                Autres
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
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
        <button onClick={handlePrevMonth} className="p-2 hover:bg-navy-100 transition-colors">
          &lt;
        </button>
        <div className="text-lg font-medium">
          {months[month]} {year}
        </div>
        <button onClick={handleNextMonth} className="p-2 hover:bg-navy-100 transition-colors">
          &gt;
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
                h-10 w-10 text-sm transition-colors duration-200 relative border
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

// Formulaire d'ajout d'événement
const FormulaireEvenement: React.FC = () => {
  const [formData, setFormData] = useState({
    titre: '',
    date: '',
    heure: '',
    type: 'reunion',
    modalite: 'presentiel',
    lieu: '',
    lien: '',
    description: '',
    participants: ''
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Titre *</label>
          <input
            type="text"
            value={formData.titre}
            onChange={(e) => setFormData({...formData, titre: e.target.value})}
            placeholder="Titre de l'événement"
            className="w-full px-3 py-2 border border-slate-300 focus:outline-none focus:border-navy-dark"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Type *</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            className="w-full px-3 py-2 border border-slate-300 focus:outline-none focus:border-navy-dark"
          >
            <option value="reunion">Réunion</option>
            <option value="seminaire">Séminaire</option>
            <option value="deadline">Date limite</option>
            <option value="autre">Autre</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Date *</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            className="w-full px-3 py-2 border border-slate-300 focus:outline-none focus:border-navy-dark"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Heure</label>
          <input
            type="time"
            value={formData.heure}
            onChange={(e) => setFormData({...formData, heure: e.target.value})}
            className="w-full px-3 py-2 border border-slate-300 focus:outline-none focus:border-navy-dark"
          />
        </div>
      </div>

      {(formData.type === 'reunion' || formData.type === 'seminaire') && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Modalité</label>
            <select
              value={formData.modalite}
              onChange={(e) => setFormData({...formData, modalite: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 focus:outline-none focus:border-navy-dark"
            >
              <option value="presentiel">Présentiel</option>
              <option value="ligne">En ligne</option>
            </select>
          </div>

          {formData.modalite === 'presentiel' ? (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Lieu
              </label>
              <input
                type="text"
                value={formData.lieu}
                onChange={(e) => setFormData({...formData, lieu: e.target.value})}
                placeholder="Salle de réunion, adresse..."
                className="w-full px-3 py-2 border border-slate-300 focus:outline-none focus:border-navy-dark"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Video className="w-4 h-4 inline mr-1" />
                Lien de la réunion
              </label>
              <input
                type="url"
                value={formData.lien}
                onChange={(e) => setFormData({...formData, lien: e.target.value})}
                placeholder="https://meet.google.com/... ou https://zoom.us/..."
                className="w-full px-3 py-2 border border-slate-300 focus:outline-none focus:border-navy-dark"
              />
            </div>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
        <textarea
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Description de l'événement..."
          className="w-full px-3 py-2 border border-slate-300 focus:outline-none focus:border-navy-dark"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Participants</label>
        <input
          type="text"
          value={formData.participants}
          onChange={(e) => setFormData({...formData, participants: e.target.value})}
          placeholder="Noms des participants, séparés par des virgules"
          className="w-full px-3 py-2 border border-slate-300 focus:outline-none focus:border-navy"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <SimpleButton variant="secondary">
          Annuler
        </SimpleButton>
        <SimpleButton variant="primary">
          <Plus className="h-4 w-4 mr-2" />
          Créer l'événement
        </SimpleButton>
      </div>
    </div>
  );
};

// Statistiques améliorées
const StatistiquesAvancees: React.FC<{ evenements: Evenement[] }> = ({ evenements }) => {
  const today = new Date();
  const nextMonth = addMonths(today, 1);
  
  const stats = {
    total: evenements.length,
    aVenir: evenements.filter(e => isAfter(e.date, today) || isSameDay(e.date, today)).length,
    reunions: evenements.filter(e => e.type === 'reunion').length,
    seminaires: evenements.filter(e => e.type === 'seminaire').length,
    deadlines: evenements.filter(e => e.type === 'deadline').length,
    moisActuel: evenements.filter(e => 
      e.date.getMonth() === today.getMonth() && 
      e.date.getFullYear() === today.getFullYear()
    ).length,
    moisProchain: evenements.filter(e => 
      e.date.getMonth() === nextMonth.getMonth() && 
      e.date.getFullYear() === nextMonth.getFullYear()
    ).length,
    enLigne: evenements.filter(e => e.modalite === 'ligne').length,
    presentiel: evenements.filter(e => e.modalite === 'presentiel').length
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="bg-navy-100 p-3 mr-4">
              <Calendar className="h-6 w-6 text-slate-700" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
              <div className="text-sm text-slate-600">Total événements</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="bg-navy-100 p-3 mr-4">
              <Clock className="h-6 w-6 text-slate-700" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{stats.aVenir}</div>
              <div className="text-sm text-slate-600">À venir</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="bg-navy-100 p-3 mr-4">
              <Users className="h-6 w-6 text-slate-700" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{stats.reunions}</div>
              <div className="text-sm text-slate-600">Réunions</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="bg-navy-100 p-3 mr-4">
              <Presentation className="h-6 w-6 text-slate-700" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{stats.seminaires}</div>
              <div className="text-sm text-slate-600">Séminaires</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Répartition par période</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Ce mois-ci</span>
              <span className="font-medium">{stats.moisActuel}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Mois prochain</span>
              <span className="font-medium">{stats.moisProchain}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="text-slate-600">Dates limites</span>
              <span className="font-medium text-navy-600">{stats.deadlines}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Modalités</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Building className="h-4 w-4 text-slate-500 mr-2" />
                <span className="text-slate-600">Présentiel</span>
              </div>
              <span className="font-medium">{stats.presentiel}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Video className="h-4 w-4 text-slate-500 mr-2" />
                <span className="text-slate-600">En ligne</span>
              </div>
              <span className="font-medium">{stats.enLigne}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-200">
              <span className="text-slate-600">Taux en ligne</span>
              <span className="font-medium">
                {stats.total > 0 ? Math.round((stats.enLigne / (stats.enLigne + stats.presentiel)) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PageCalendrier: React.FC = () => {
  const { addToast } = useToast();
  const { user } = useAuth();
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [filtres, setFiltres] = useState({
    toutes: true,
    reunion: true,
    seminaire: true,
    deadline: true,
    autre: true,
  });
  const [selectedEvent, setSelectedEvent] = useState<Evenement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageNotification, setMessageNotification] = useState("");
  const [activeTab, setActiveTab] = useState<'calendrier' | 'ajouter' | 'stats'>('calendrier');

  // Données des événements avec plus d'exemples
  const evenements: Evenement[] = [
    // Juillet 2025
    {
      id: 1,
      titre: "Réunion équipe pédagogique",
      date: new Date(2025, 6, 16, 9, 0),
      dateFin: new Date(2025, 6, 16, 11, 0),
      type: "reunion",
      modalite: "presentiel",
      lieu: "Salle des professeurs",
      participants: ["Prof. Diop", "Prof. Seck", "Dr. Ndiaye", "Mme Fall"],
      description: "Préparation de la rentrée scolaire 2025-2026",
    },
    {
      id: 2,
      titre: "Webinaire innovation pédagogique",
      date: new Date(2025, 6, 18, 14, 0),
      dateFin: new Date(2025, 6, 18, 16, 0),
      type: "seminaire",
      modalite: "ligne",
      lien: "https://meet.google.com/abc-defg-hij",
      participants: ["Enseignants", "Directeurs pédagogiques"],
      description: "Nouvelles approches d'enseignement numérique",
    },
    {
      id: 3,
      titre: "Date limite inscription examens",
      date: new Date(2025, 6, 20, 17, 0),
      dateFin: new Date(2025, 6, 20, 17, 0),
      type: "deadline",
      important: true,
      description: "Dernier jour pour s'inscrire aux examens de fin d'année",
    },
    {
      id: 4,
      titre: "Conférence parents d'élèves",
      date: new Date(2025, 6, 22, 18, 0),
      dateFin: new Date(2025, 6, 22, 20, 0),
      type: "reunion",
      modalite: "presentiel",
      lieu: "Amphithéâtre principal",
      participants: ["Parents", "Direction", "Professeurs principaux"],
      description: "Bilan de l'année scolaire et perspectives",
    },
    {
      id: 5,
      titre: "Formation Moodle",
      date: new Date(2025, 6, 25, 10, 0),
      dateFin: new Date(2025, 6, 25, 12, 0),
      type: "seminaire",
      modalite: "ligne",
      lien: "https://zoom.us/j/987654321",
      participants: ["Professeurs", "Assistants pédagogiques"],
      description: "Maîtrise de la plateforme d'apprentissage en ligne",
    },
    
    // Août 2025
    {
      id: 6,
      titre: "Conseil d'administration",
      date: new Date(2025, 7, 5, 14, 0),
      dateFin: new Date(2025, 7, 5, 17, 0),
      type: "reunion",
      modalite: "presentiel",
      lieu: "Salle du conseil",
      participants: ["Membres du CA", "Direction", "Représentants élèves"],
      description: "Validation du budget et des projets pour la nouvelle année",
    },
    {
      id: 7,
      titre: "Séminaire d'intégration nouveaux enseignants",
      date: new Date(2025, 7, 12, 9, 0),
      dateFin: new Date(2025, 7, 12, 17, 0),
      type: "seminaire",
      modalite: "presentiel",
      lieu: "Centre de formation",
      participants: ["Nouveaux enseignants", "Équipe RH", "Mentors"],
      description: "Accueil et formation des nouveaux membres de l'équipe",
    },
    {
      id: 8,
      titre: "Réunion préparation rentrée",
      date: new Date(2025, 7, 18, 8, 30),
      dateFin: new Date(2025, 7, 18, 12, 0),
      type: "reunion",
      modalite: "ligne",
      lien: "https://teams.microsoft.com/l/meetup-join/123",
      participants: ["Directeurs", "Chefs de département", "Secrétaires"],
      description: "Coordination générale pour la rentrée scolaire",
    },
    {
      id: 9,
      titre: "Date limite commande manuels",
      date: new Date(2025, 7, 25, 23, 59),
      dateFin: new Date(2025, 7, 25, 23, 59),
      type: "deadline",
      important: true,
      description: "Dernière date pour commander les manuels scolaires",
    },
    {
      id: 10,
      titre: "Journée portes ouvertes",
      date: new Date(2025, 7, 30, 9, 0),
      dateFin: new Date(2025, 7, 30, 16, 0),
      type: "autre",
      modalite: "presentiel",
      lieu: "Campus principal",
      participants: ["Futurs élèves", "Familles", "Personnel"],
      description: "Présentation de l'établissement aux futurs élèves et familles",
    }
  ];

  const envoyerNotification = (evenement: Evenement) => {
    addToast('success', 'Notification envoyée', `Les participants ont été notifiés pour l'événement "${evenement.titre}"`);
    
    if (evenement.participants) {
      console.log(`Notification envoyée à: ${evenement.participants.join(', ')}`);
      console.log(`Message: ${messageNotification || `Rappel: ${evenement.titre} - ${formatDate(evenement.date, 'long')} à ${formatTime(evenement.date)}`}`);
    }
  };

  const toggleFiltre = (type: string) => {
    if (type === "toutes") {
      const newState = !filtres.toutes;
      setFiltres({
        toutes: newState,
        reunion: newState,
        seminaire: newState,
        deadline: newState,
        autre: newState,
      });
    } else {
      setFiltres((prev) => {
        const newFiltres = {
          ...prev,
          [type]: !prev[type as keyof typeof filtres],
          toutes: false,
        };

        if (
          newFiltres.reunion &&
          newFiltres.seminaire &&
          newFiltres.deadline &&
          newFiltres.autre
        ) {
          newFiltres.toutes = true;
        }

        return newFiltres;
      });
    }
  };

  const openEventDetails = (event: Evenement) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const evenementsFiltres = useMemo(() => {
    if (filtres.toutes) return evenements;
    return evenements.filter((evenement) => filtres[evenement.type]);
  }, [evenements, filtres]);

  const evenementsPourDateSelectionnee = useMemo(() => {
    if (!date) return [];
    return evenementsFiltres.filter((evenement) =>
      isSameDay(evenement.date, date)
    );
  }, [date, evenementsFiltres]);

  const evenementsAVenir = useMemo(() => {
    const aujourdhui = new Date();
    return evenementsFiltres
      .filter(
        (evenement) =>
          isAfter(evenement.date, aujourdhui) ||
          isSameDay(evenement.date, aujourdhui)
      )
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 6);
  }, [evenementsFiltres]);

  const joursAvecEvenements = useMemo(() => {
    return evenementsFiltres.map((ev) => formatDateKey(ev.date));
  }, [evenementsFiltres]);

  const obtenirIconeEvenement = (type: string) => {
    switch (type) {
      case "reunion":
        return <Users className="h-5 w-5 text-slate-700" />;
      case "seminaire":
        return <Presentation className="h-5 w-5 text-slate-700" />;
      case "deadline":
        return <Clock className="h-5 w-5 text-slate-700" />;
      default:
        return <FileText className="h-5 w-5 text-slate-700" />;
    }
  };

  const obtenirLibelleType = (type: string) => {
    switch (type) {
      case "reunion":
        return "Réunion";
      case "seminaire":
        return "Séminaire";
      case "deadline":
        return "Date limite";
      default:
        return "Autre";
    }
  };

  // Un professeur seul = estProfesseur && !estChef && !estSecretaire
  const isProfSeul = user?.estProfesseur && !user?.estChef && !user?.estSecretaire;
  // Encadrant = estEncadrant (quel que soit le cumul)
  const isEncadrant = !!user?.estEncadrant;
  // Les deux profils n'ont accès qu'à la vue calendrier
  const isProfSeulOuEncadrant = isProfSeul || isEncadrant;
  const tabs = [
    {
      id: 'calendrier' as const,
      label: 'Calendrier',
      icon: <Calendar className="h-4 w-4" />,
      count: evenements.length
    },
    // Onglet ajout/stats seulement si pas prof seul ni encadrant
    ...(!isProfSeulOuEncadrant ? [{
      id: 'ajouter' as const,
      label: 'Ajouter un événement',
      icon: <Plus className="h-4 w-4" />
    }] : []),
    ...(!isProfSeulOuEncadrant ? [{
      id: 'stats' as const,
      label: 'Statistiques',
      icon: <BarChart3 className="h-4 w-4" />
    }] : [])
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white border border-slate-200 p-6 mb-6">
          <div className="flex items-center">
            <div className="bg-slate-100 p-3 mr-4">
              <Calendar className="h-6 w-6 text-slate-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Calendrier des événements</h1>
              <p className="text-sm text-slate-500 mt-1">
                Gérez vos réunions, séminaires et échéances
              </p>
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div className="bg-white border border-slate-200 mb-6">
          <div className="border-b border-slate-200">
            <div className="flex">
              {tabs.map((tab) => (
                <TabButton
                  key={tab.id}
                  isActive={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  icon={tab.icon}
                  count={tab.count}
                >
                  {tab.label}
                </TabButton>
              ))}
            </div>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'calendrier' && (
                <motion.div
                  key="calendrier"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Actions et filtres */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <FilterDropdown filtres={filtres} toggleFiltre={toggleFiltre} />
                      {!filtres.toutes && (
                        <div className="text-sm text-slate-500">
                          Filtres actifs: {Object.entries(filtres)
                            .filter(([type, active]) => active && type !== "toutes")
                            .map(([type]) => obtenirLibelleType(type))
                            .join(", ")}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contenu principal */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Calendrier */}
                    <div className="bg-white border border-slate-200 p-6">
                      <h2 className="text-xl font-bold text-slate-900 mb-4">Calendrier</h2>
                      <SimpleCalendar 
                        selectedDate={date}
                        onDateSelect={setDate}
                        eventsOnDays={joursAvecEvenements}
                      />
                      <div className="mt-4">
                        <SimpleButton 
                          variant="secondary"
                          onClick={() => setDate(new Date())}
                        >
                          Aujourd'hui
                        </SimpleButton>
                      </div>
                    </div>

                    {/* Événements du jour sélectionné */}
                    <div className="lg:col-span-2 bg-white border border-slate-200 p-6">
                      <h2 className="text-xl font-bold text-slate-900 mb-4">
                        Événements du {date ? formatDate(date, 'long') : ''}
                      </h2>
                      <p className="text-sm text-slate-500 mb-6">
                        {evenementsPourDateSelectionnee.length} événement(s) prévu(s)
                      </p>

                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {evenementsPourDateSelectionnee.length > 0 ? (
                          evenementsPourDateSelectionnee.map((evenement) => (
                            <div
                              key={evenement.id}
                              className={`border border-slate-200 p-4 ${
                                evenement.important ? "border-red-300 bg-red-50" : "bg-white"
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3">
                                  <div className="bg-slate-100 p-2">
                                    {obtenirIconeEvenement(evenement.type)}
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-lg text-slate-900">
                                      {evenement.titre}
                                    </h3>
                                    <div className="flex mt-2 space-x-2">
                                      <Badge variant="info">
                                        {obtenirLibelleType(evenement.type)}
                                      </Badge>
                                      {evenement.modalite && (
                                        <Badge variant="info">
                                          {evenement.modalite === "ligne" ? "En ligne" : "Présentiel"}
                                        </Badge>
                                      )}
                                      {evenement.important && (
                                        <Badge variant="error">Important</Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="text-sm text-slate-500 flex items-center">
                                  <Clock className="mr-1 h-4 w-4" />
                                  {formatTime(evenement.date)}
                                  {evenement.type !== "deadline" && evenement.type !== "autre" && (
                                    <>
                                      {" "} - {" "}
                                      {formatTime(evenement.dateFin)}
                                    </>
                                  )}
                                </div>
                              </div>

                              {evenement.description && (
                                <div className="mt-3 text-sm text-slate-700">
                                  {evenement.description}
                                </div>
                              )}

                              {(evenement.type === "reunion" || evenement.type === "seminaire") && (
                                <div className="mt-3">
                                  {evenement.modalite === "presentiel" && evenement.lieu ? (
                                    <div className="flex items-center text-sm text-slate-600">
                                      <MapPin className="h-4 w-4 text-slate-400 mr-1" />
                                      Lieu: {evenement.lieu}
                                    </div>
                                  ) : evenement.modalite === "ligne" && evenement.lien ? (
                                    <div className="flex flex-col text-sm text-slate-600">
                                      <div className="flex items-center">
                                        <Globe className="h-4 w-4 text-slate-400 mr-1" />
                                        Plateforme: {evenement.lien?.split("//")[1]?.split("/")[0] || "Plateforme virtuelle"}
                                      </div>
                                      <a
                                        href={evenement.lien}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-navy hover:underline mt-1"
                                      >
                                        Rejoindre la réunion
                                      </a>
                                    </div>
                                  ) : null}
                                </div>
                              )}

                              {evenement.participants && evenement.participants.length > 0 && (
                                <div className="mt-3 text-sm text-slate-600">
                                  <div className="flex items-center">
                                    <Users className="h-4 w-4 text-slate-400 mr-1" />
                                    Participants: {evenement.participants.join(", ")}
                                  </div>
                                </div>
                              )}

                              <div className="mt-4 flex gap-2">
                                <SimpleButton
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => openEventDetails(evenement)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Détails
                                </SimpleButton>
                                {!isProfSeulOuEncadrant && (
                                  <SimpleButton variant="secondary" size="sm">
                                    <Edit className="h-4 w-4 mr-1" />
                                    Modifier
                                  </SimpleButton>
                                )}
                                {!isProfSeulOuEncadrant && (
                                  <SimpleButton 
                                    variant="danger" 
                                    size="sm"
                                    onClick={() => {
                                      addToast('success', 'Événement annulé', `L'événement "${evenement.titre}" a été annulé.`);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Annuler
                                  </SimpleButton>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center h-64 text-center">
                            <Calendar className="h-12 w-12 text-slate-300 mb-4" />
                            <p className="text-slate-500 mb-4">Aucun événement prévu pour cette date</p>
                            {!isProfSeulOuEncadrant && (
                              <SimpleButton variant="primary">
                                <Plus className="h-4 w-4 mr-2" />
                                Ajouter un événement
                              </SimpleButton>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Événements à venir */}
                  <div className="bg-white border border-slate-200 p-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Événements à venir</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {evenementsAVenir.map((evenement) => (
                        <div
                          key={evenement.id}
                          className={`border border-slate-200 overflow-hidden ${
                            evenement.important ? "border-red-300" : ""
                          }`}
                        >
                          <div className={`h-1 ${
                            evenement.type === "reunion" ? "bg-navy" :
                            evenement.type === "seminaire" ? "bg-navy" :
                            evenement.type === "deadline" ? "bg-red-500" : "bg-slate-500"
                          }`}></div>
                          
                          <div className="p-4">
                            <div className="flex items-start gap-2 mb-3">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                  {evenement.titre}
                                  {evenement.important && (
                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                  )}
                                </h3>
                                <p className="text-sm text-slate-500">
                                  {formatDate(evenement.date, 'long')}
                                </p>
                              </div>
                              <Badge variant="info">
                                {obtenirLibelleType(evenement.type)}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center mb-2">
                              <Clock className="h-4 w-4 text-slate-400 mr-1" />
                              <span className="text-sm text-slate-500">
                                {formatTime(evenement.date)}
                                {evenement.type !== "deadline" && evenement.type !== "autre" && (
                                  <>
                                    {" "} - {" "}
                                    {formatTime(evenement.dateFin)}
                                  </>
                                )}
                              </span>
                            </div>

                            {(evenement.type === "reunion" || evenement.type === "seminaire") && evenement.modalite && (
                              <div className="flex items-center mb-2">
                                {evenement.modalite === "presentiel" ? (
                                  <div className="flex items-center text-sm text-slate-600">
                                    <MapPin className="h-4 w-4 text-slate-400 mr-1" />
                                    {evenement.lieu}
                                  </div>
                                ) : (
                                  <div className="flex items-center text-sm text-slate-600">
                                    <Globe className="h-4 w-4 text-slate-400 mr-1" />
                                    {evenement.lien?.split("//")[1]?.split("/")[0] || "Plateforme virtuelle"}
                                  </div>
                                )}
                              </div>
                            )}

                            {evenement.description && (
                              <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                                {evenement.description}
                              </p>
                            )}
                            
                            <div className="mt-4">
                              <SimpleButton
                                variant="ghost"
                                size="sm"
                                onClick={() => openEventDetails(evenement)}
                              >
                                Voir détails
                              </SimpleButton>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'ajouter' && (
                <motion.div
                  key="ajouter"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="max-w-2xl">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Ajouter un événement</h2>
                    <p className="text-sm text-slate-500 mb-6">Remplissez le formulaire pour ajouter un événement au calendrier.</p>
                    <FormulaireEvenement />
                  </div>
                </motion.div>
              )}

              {activeTab === 'stats' && !isProfSeulOuEncadrant && (
                <motion.div
                  key="stats"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-6">Statistiques</h2>
                    <StatistiquesAvancees evenements={evenements} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Modal de détails */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Détails de l'événement"
        >
          {selectedEvent && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                {obtenirIconeEvenement(selectedEvent.type)}
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedEvent.titre}</h3>
                  <p className="text-sm text-slate-500">
                    {formatDate(selectedEvent.date, 'long')}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="info">
                  {obtenirLibelleType(selectedEvent.type)}
                </Badge>
                {selectedEvent.modalite && (
                  <Badge variant="info">
                    {selectedEvent.modalite === "ligne" ? "En ligne" : "Présentiel"}
                  </Badge>
                )}
                {selectedEvent.important && (
                  <Badge variant="error">Important</Badge>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-slate-500" />
                  <span>
                    {formatTime(selectedEvent.date)}
                    {selectedEvent.type !== "deadline" && selectedEvent.type !== "autre" && (
                      <>
                        {" "} - {" "}
                        {formatTime(selectedEvent.dateFin)}
                      </>
                    )}
                  </span>
                </div>

                {selectedEvent.modalite === "presentiel" && selectedEvent.lieu && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-slate-500" />
                    <span>Lieu: {selectedEvent.lieu}</span>
                  </div>
                )}

                {selectedEvent.modalite === "ligne" && selectedEvent.lien && (
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-slate-500" />
                    <span>
                      Lien: {" "}
                      <a
                        href={selectedEvent.lien}
                        target="_blank"
                        rel="noreferrer"
                        className="text-navy hover:underline"
                      >
                        {selectedEvent.lien}
                      </a>
                    </span>
                  </div>
                )}
              </div>

              {selectedEvent.description && (
                <div>
                  <h4 className="font-medium text-slate-900 mb-2">Description</h4>
                  <p className="text-slate-700">{selectedEvent.description}</p>
                </div>
              )}

              {selectedEvent.participants && selectedEvent.participants.length > 0 && (
                <div>
                  <h4 className="font-medium text-slate-900 mb-3">Participants</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.participants.map((participant, index) => (
                      <Badge key={index} variant="info">
                        {participant}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {!isProfSeulOuEncadrant && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Message de notification
                      </label>
                      <input
                        type="text"
                        value={messageNotification}
                        onChange={(e) => setMessageNotification(e.target.value)}
                        placeholder="Message personnalisé (optionnel)"
                        className="w-full px-3 py-2 border border-slate-300 focus:outline-none focus:border-navy"
                      />
                    </div>
                    <SimpleButton
                      variant="secondary"
                      onClick={() => envoyerNotification(selectedEvent)}
                    >
                      <Bell className="mr-2 h-4 w-4" />
                      Envoyer notification aux participants
                    </SimpleButton>
                  </>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
                {!isProfSeulOuEncadrant && (
                  <SimpleButton variant="secondary">
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </SimpleButton>
                )}
                {!isProfSeulOuEncadrant && (
                  <SimpleButton
                    variant="danger"
                    onClick={() => {
                      addToast('success', 'Événement annulé', `L'événement "${selectedEvent.titre}" a été annulé.`);
                      setIsModalOpen(false);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Annuler l'événement
                  </SimpleButton>
                )}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default PageCalendrier;