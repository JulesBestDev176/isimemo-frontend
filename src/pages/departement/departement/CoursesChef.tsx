import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  BookOpen, 
  User, 
  Clock, 
  Calendar, 
  Edit, 
  Trash2, 
  Plus, 
  Filter, 
  Check, 
  X,
  Eye,
  BarChart3,
  FileText,
  School,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Liste des départements disponibles
const DEPARTMENTS = [
  "Informatique",
  "Réseaux", 
  "Management",
  "Génie Civil",
  "Électronique",
  "Mathématiques",
  "Physique",
  "Chimie"
];

// Interface pour les toasts
interface Toast {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

interface CourseItem {
  id: number;
  name: string;
  department: string;
  professor: string;
  students: number;
  hours: number;
  startDate: string;
  active: boolean;
  description?: string;
  lastUpdated: string;
}

// Composant Toast
const ToastComponent: React.FC<{
  toast: Toast;
  onRemove: (id: number) => void;
}> = ({ toast, onRemove }) => {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  };

  const styles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-orange-50 border-orange-200 text-orange-800",
    info: "bg-blue-50 border-blue-200 text-blue-800"
  };

  const IconComponent = icons[toast.type];

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`flex items-start p-4 mb-2 border rounded-md shadow-md ${styles[toast.type]}`}
    >
      <div className="flex-shrink-0">
        <IconComponent className="w-5 h-5" />
      </div>
      <div className="ml-3 w-full">
        <div className="flex justify-between">
          <p className="text-sm font-medium">{toast.title}</p>
          <button
            onClick={() => onRemove(toast.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="mt-1 text-sm">{toast.message}</p>
      </div>
    </motion.div>
  );
};

// Conteneur de Toasts
const ToastContainer: React.FC<{
  toasts: Toast[];
  onRemove: (id: number) => void;
}> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map(toast => (
          <ToastComponent
            key={toast.id}
            toast={toast}
            onRemove={onRemove}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Hook personnalisé pour les toasts
const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (type: Toast['type'], title: string, message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, title, message }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess: (title: string, message: string) => addToast('success', title, message),
    showError: (title: string, message: string) => addToast('error', title, message),
    showWarning: (title: string, message: string) => addToast('warning', title, message),
    showInfo: (title: string, message: string) => addToast('info', title, message),
  };
};

const COURSES_DATA: CourseItem[] = [
  { 
    id: 1, 
    name: "Programmation Orientée Objet", 
    department: "Informatique", 
    professor: "Dr. Moussa Diop", 
    students: 35, 
    hours: 45, 
    startDate: "15/09/2025", 
    active: true,
    description: "Cours fondamental sur la programmation orientée objet avec Java",
    lastUpdated: "2025-01-15"
  },
  { 
    id: 2, 
    name: "Algorithmes Avancés", 
    department: "Informatique", 
    professor: "Dr. Fatou Ndiaye", 
    students: 28, 
    hours: 40, 
    startDate: "18/09/2025", 
    active: true,
    description: "Étude des algorithmes complexes et optimisation",
    lastUpdated: "2025-01-10"
  },
  { 
    id: 3, 
    name: "Base de Données", 
    department: "Informatique", 
    professor: "Dr. Omar Sall", 
    students: 32, 
    hours: 50, 
    startDate: "20/09/2025", 
    active: true,
    description: "Conception et gestion des bases de données relationnelles",
    lastUpdated: "2025-01-12"
  },
  { 
    id: 4, 
    name: "Réseaux Informatiques", 
    department: "Réseaux", 
    professor: "Dr. Aminata Diallo", 
    students: 30, 
    hours: 48, 
    startDate: "22/09/2025", 
    active: true,
    description: "Architecture et protocoles des réseaux informatiques",
    lastUpdated: "2025-01-08"
  },
  { 
    id: 5, 
    name: "Sécurité Informatique", 
    department: "Réseaux", 
    professor: "Dr. Ibrahim Sow", 
    students: 25, 
    hours: 35, 
    startDate: "25/09/2025", 
    active: false,
    description: "Principes de sécurité et protection des systèmes",
    lastUpdated: "2025-01-05"
  },
  { 
    id: 6, 
    name: "Intelligence Artificielle", 
    department: "Informatique", 
    professor: "Dr. Cheikh Diop", 
    students: 22, 
    hours: 45, 
    startDate: "01/10/2025", 
    active: true,
    description: "Introduction aux techniques d'intelligence artificielle",
    lastUpdated: "2025-01-14"
  },
  { 
    id: 7, 
    name: "Gestion de Projet", 
    department: "Management", 
    professor: "Dr. Aïda Fall", 
    students: 38, 
    hours: 30, 
    startDate: "05/10/2025", 
    active: true,
    description: "Méthodologies de gestion de projet informatique",
    lastUpdated: "2025-01-11"
  },
  { 
    id: 8, 
    name: "Développement Web", 
    department: "Informatique", 
    professor: "Dr. Moussa Diop", 
    students: 40, 
    hours: 60, 
    startDate: "10/10/2025", 
    active: true,
    description: "Technologies web modernes et frameworks",
    lastUpdated: "2025-01-13"
  },
];

// Composants UI réutilisables
const SimpleButton: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  icon?: React.ReactNode;
}> = ({ children, variant = 'primary', onClick, disabled = false, type = 'button', icon }) => {
  const styles = {
    primary: `bg-navy text-white border border-navy hover:bg-navy-dark ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    secondary: `bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    ghost: `bg-transparent text-gray-600 border border-transparent hover:bg-gray-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center ${styles[variant]}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

const TabButton: React.FC<{
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}> = ({ children, isActive, onClick, icon }) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200
        ${isActive 
          ? 'border-navy text-navy' 
          : 'border-transparent text-gray-500 hover:text-gray-700'
        }
      `}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

// Badge avec couleurs subtiles
const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'active' | 'inactive' | 'info' | 'warning' | 'primary';
  className?: string;
}> = ({ children, variant = 'info', className }) => {
  const styles = {
    active: "bg-green-50 text-green-700 border border-green-200",
    inactive: "bg-red-50 text-red-600 border border-red-200", 
    info: "bg-gray-50 text-gray-700 border border-gray-200",
    warning: "bg-orange-50 text-orange-700 border border-orange-200",
    primary: "bg-navy bg-opacity-10 text-navy border border-navy border-opacity-20"
  };
  
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium ${styles[variant]} ${className || ''}`}>
      {children}
    </span>
  );
};

// Toggle switch pour activer/désactiver un cours
const SimpleToggle: React.FC<{
  active: boolean;
  onChange: () => void;
  disabled?: boolean;
}> = ({ active, onChange, disabled = false }) => {
  return (
    <button
      onClick={disabled ? undefined : onChange}
      disabled={disabled}
      className={`
        w-12 h-6 rounded-full border-2 transition-colors duration-200 flex items-center
        ${active ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'}
      `}
    >
      <div className={`
        w-4 h-4 bg-white rounded-full transition-transform duration-200 flex items-center justify-center
        ${active ? 'translate-x-6' : 'translate-x-0'}
      `}>
        {active ? 
          <Check className="h-2 w-2 text-green-500" /> : 
          <X className="h-2 w-2 text-red-400" />
        }
      </div>
    </button>
  );
};

// Modal pour afficher les détails d'un cours
const CourseDetailsModal: React.FC<{
  courseItem: CourseItem | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ courseItem, isOpen, onClose }) => {
  if (!isOpen || !courseItem) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border border-gray-200 p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{courseItem.name}</h2>
            <div className="flex items-center gap-2">
              <Badge variant={courseItem.active ? 'active' : 'inactive'}>
                {courseItem.active ? 'Actif' : 'Inactif'}
              </Badge>
              <Badge variant="primary">{courseItem.department}</Badge>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informations générales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Informations générales</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">Département</label>
                <p className="text-gray-900">{courseItem.department}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Professeur</label>
                <p className="text-gray-900">{courseItem.professor}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Date de début</label>
                <p className="text-gray-900">{courseItem.startDate}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Dernière mise à jour</label>
                <p className="text-gray-900">{courseItem.lastUpdated}</p>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Statistiques</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <User className="h-6 w-6 text-green-600 mr-2" />
                  <span className="text-3xl font-bold text-gray-900">{courseItem.students}</span>
                </div>
                <p className="text-sm text-green-700 font-medium">Étudiants inscrits</p>
              </div>
              <div className="bg-navy-50 border border-navy-200 p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="h-6 w-6 text-navy-600 mr-2" />
                  <span className="text-3xl font-bold text-gray-900">{courseItem.hours}</span>
                </div>
                <p className="text-sm text-navy-700 font-medium">Heures de cours</p>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {courseItem.description && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-700">{courseItem.description}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
          <SimpleButton
            variant="secondary"
            onClick={onClose}
          >
            Fermer
          </SimpleButton>
        </div>
      </motion.div>
    </div>
  );
};

// Onglet Liste des cours
const CourseListTab: React.FC<{
  courses: CourseItem[];
  onToggleActive: (id: number) => void;
  onViewDetails: (course: CourseItem) => void;
  onEditCourse: (course: CourseItem) => void;
}> = ({ courses, onToggleActive, onViewDetails, onEditCourse }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filtrer les données
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.professor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = 
      activeFilter === 'all' || 
      (activeFilter === 'active' && course.active) || 
      (activeFilter === 'inactive' && !course.active);
    const matchesDepartment = 
      departmentFilter === 'all' || 
      course.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  return (
    <div>
      {/* Filtres et recherche */}
      <div className="bg-white border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filtres et recherche</h3>
          <SimpleButton
            variant="ghost"
            onClick={() => setShowFilters(!showFilters)}
            icon={<Filter className="h-5 w-5" />}
          >
            {showFilters ? 'Masquer' : 'Filtres'}
          </SimpleButton>
        </div>

        {/* Barre de recherche */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Rechercher un cours ou professeur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-3 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
          />
        </div>

        {/* Filtres avancés */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">État</label>
                <select
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value as 'all' | 'active' | 'inactive')}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy rounded-sm"
                >
                  <option value="all">Tous</option>
                  <option value="active">Actifs</option>
                  <option value="inactive">Inactifs</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Département</label>
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy rounded-sm"
                >
                  <option value="all">Tous les départements</option>
                  {DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Résultats */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          {filteredCourses.length} cours{filteredCourses.length !== 1 ? '' : ''} trouvé{filteredCourses.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Liste des cours */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white border border-gray-200 p-12 text-center rounded-sm">
          <BookOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Aucun cours trouvé</h2>
          <p className="text-gray-500">Modifiez vos critères de recherche</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cours
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Département
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Professeur
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de début
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Étudiants
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Heures
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    État
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCourses.map((course, index) => (
                  <motion.tr
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
                          {course.name}
                        </div>
                        <div className="text-sm text-gray-500 whitespace-nowrap">
                          MAJ: {course.lastUpdated}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="primary" className="whitespace-nowrap">{course.department}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="warning" className="whitespace-nowrap">
                        <User className="inline h-3 w-3 mr-1" />
                        {course.professor}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="info" className="whitespace-nowrap">
                        <Calendar className="inline h-3 w-3 mr-1" />
                        {course.startDate}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <User className="h-4 w-4 text-green-600 mr-1" />
                        <span className="text-sm font-medium text-gray-900">
                          {course.students}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <Clock className="h-4 w-4 text-blue-600 mr-1" />
                        <span className="text-sm font-medium text-gray-900">
                          {course.hours}h
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center">
                        <SimpleToggle 
                          active={course.active}
                          onChange={() => onToggleActive(course.id)}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center space-x-2">
                        <button 
                          onClick={() => onViewDetails(course)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 border border-gray-300 hover:border-blue-300 transition-colors duration-200 rounded-sm"
                          title="Voir les détails"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => onEditCourse(course)}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 border border-gray-300 hover:border-green-300 transition-colors duration-200 rounded-sm"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Onglet Statistiques
const StatisticsTab: React.FC<{
  courses: CourseItem[];
}> = ({ courses }) => {
  const activeCourses = courses.filter(c => c.active);
  const totalStudents = courses.reduce((sum, c) => sum + c.students, 0);
  const totalHours = courses.reduce((sum, c) => sum + c.hours, 0);
  
  // Statistiques par département
  const departmentStats = DEPARTMENTS.map(dept => {
    const deptCourses = courses.filter(c => c.department === dept);
    return {
      name: dept,
      count: deptCourses.length,
      students: deptCourses.reduce((sum, c) => sum + c.students, 0),
      hours: deptCourses.reduce((sum, c) => sum + c.hours, 0)
    };
  }).filter(stat => stat.count > 0);

  return (
    <div className="space-y-6">
      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: "Total Cours", value: courses.length, icon: BookOpen, color: "bg-navy-100 text-navy-600" },
          { title: "Total Étudiants", value: totalStudents, icon: User, color: "bg-green-100 text-green-600" },
          { title: "Total Heures", value: totalHours, icon: Clock, color: "bg-orange-100 text-orange-600" },
          { title: "Cours Actifs", value: activeCourses.length, icon: Check, color: "bg-purple-100 text-purple-600" }
        ].map((stat, index) => (
          <div key={stat.title} className="bg-white border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 mr-4`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par département</h3>
          <div className="space-y-3">
            {departmentStats.map(dept => {
              const percentage = Math.round((dept.count / courses.length) * 100);
              return (
                <div key={dept.name} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{dept.name}</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 h-2 mr-3">
                      <div 
                        className="bg-navy-500 h-2" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{dept.count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Heures par département</h3>
          <div className="space-y-3">
            {departmentStats.map(dept => {
              const percentage = Math.round((dept.hours / totalHours) * 100);
              return (
                <div key={dept.name} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{dept.name}</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 h-2 mr-3">
                      <div 
                        className="bg-green-500 h-2" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{dept.hours}h</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Formulaire d'ajout/modification
const AddCourseTab: React.FC<{
  courseToEdit?: CourseItem | null;
  onEditComplete?: () => void;
}> = ({ courseToEdit, onEditComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    professor: '',
    hours: '',
    startDate: '',
    description: '',
    active: true
  });

  const isEditing = Boolean(courseToEdit);
  
  // Pré-remplir le formulaire quand on édite
  React.useEffect(() => {
    if (courseToEdit) {
      setFormData({
        name: courseToEdit.name,
        department: courseToEdit.department,
        professor: courseToEdit.professor,
        hours: courseToEdit.hours.toString(),
        startDate: courseToEdit.startDate,
        description: courseToEdit.description || '',
        active: courseToEdit.active
      });
    } else {
      setFormData({
        name: '',
        department: '',
        professor: '',
        hours: '',
        startDate: '',
        description: '',
        active: true
      });
    }
  }, [courseToEdit]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };
  
  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    alert(`Cours ${isEditing ? 'modifié' : 'créé'} avec succès !`);
    
    if (isEditing && onEditComplete) {
      onEditComplete();
    }
    
    setFormData({
      name: '',
      department: '',
      professor: '',
      hours: '',
      startDate: '',
      description: '',
      active: true
    });
  };

  return (
    <div className="bg-white border border-gray-200 p-6">
      {isEditing && (
        <div className="mb-6 p-4 bg-navy-50 border border-navy-200">
          <div className="flex items-center">
            <Edit className="h-5 w-5 text-navy-600 mr-2" />
            <p className="text-navy-800 font-medium">Mode édition : {courseToEdit?.name}</p>
          </div>
        </div>
      )}
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du cours *
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Programmation Orientée Objet"
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Département *
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
              required
            >
              <option value="">Sélectionner un département</option>
              {DEPARTMENTS.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Professeur *
            </label>
            <input
              name="professor"
              value={formData.professor}
              onChange={handleChange}
              placeholder="Ex: Dr. Moussa Diop"
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Heures de cours *
            </label>
            <input
              name="hours"
              type="number"
              min="1"
              value={formData.hours}
              onChange={handleChange}
              placeholder="Ex: 45"
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de début *
            </label>
            <input
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
              required
            />
          </div>
          
          <div className="flex items-center">
            <input
              name="active"
              type="checkbox"
              checked={formData.active}
              onChange={handleChange}
              className="h-4 w-4 text-navy focus:ring-navy border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              Cours actif
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description du cours..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
          />
        </div>
        
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          {isEditing && (
            <SimpleButton
              type="button"
              variant="secondary"
              onClick={onEditComplete}
            >
              Annuler
            </SimpleButton>
          )}
          <SimpleButton
            type="button"
            variant="primary"
            onClick={handleSubmit}
          >
            {isEditing ? 'Modifier le cours' : 'Créer le cours'}
          </SimpleButton>
        </div>
      </div>
    </div>
  );
};

const CoursesChef: React.FC = () => {
  const { user } = useAuth();
  const isChef = user?.estChef;
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'stats'>('list');
  
  // États pour la modal et l'édition
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<CourseItem | null>(null);
  
  const [coursesState, setCoursesState] = useState(COURSES_DATA);

  // Hook pour les toasts
  const { toasts, removeToast, showSuccess, showError, showWarning, showInfo } = useToast();

  // Fonctions pour gérer les cours
  const toggleCourseActive = (id: number) => {
    const course = coursesState.find(c => c.id === id);
    if (!course) return;
    
    const newActiveState = !course.active;
    setCoursesState(prev => prev.map(course => 
      course.id === id ? { ...course, active: newActiveState } : course
    ));
    
    if (newActiveState) {
      showSuccess(
        'Cours activé',
        `Le cours "${course.name}" a été activé avec succès.`
      );
    } else {
      showWarning(
        'Cours désactivé',
        `Le cours "${course.name}" a été désactivé.`
      );
    }
  };

  // Fonctions pour gérer la modal des détails
  const openCourseDetails = (courseItem: CourseItem) => {
    setSelectedCourse(courseItem);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCourse(null);
    setIsModalOpen(false);
  };

  // Fonctions pour gérer l'édition
  const startEditCourse = (courseItem: CourseItem) => {
    setCourseToEdit(courseItem);
    setActiveTab('add');
  };

  const stopEditCourse = () => {
    setCourseToEdit(null);
    setActiveTab('list');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Conteneur de toasts */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <div className="flex items-center">
            <div className="bg-navy-light rounded-full p-3 mr-4">
              <BookOpen className="h-7 w-7 text-navy" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Cours</h1>
              <p className="text-sm text-gray-500 mt-1">
                Gérez les cours, professeurs et emplois du temps
              </p>
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div className="bg-white border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <TabButton
                isActive={activeTab === 'list'}
                onClick={() => {
                  setCourseToEdit(null); // Reset l'édition quand on clique sur l'onglet
                  setActiveTab('list');
                }}
                icon={<FileText className="h-4 w-4" />}
              >
                Liste des cours
              </TabButton>
              <TabButton
                isActive={activeTab === 'add'}
                onClick={() => {
                  setCourseToEdit(null); // Reset l'édition quand on clique sur l'onglet
                  setActiveTab('add');
                }}
                icon={<Plus className="h-4 w-4" />}
              >
                {courseToEdit ? 'Modifier un cours' : 'Ajouter un cours'}
              </TabButton>
              <TabButton
                isActive={activeTab === 'stats'}
                onClick={() => setActiveTab('stats')}
                icon={<BarChart3 className="h-4 w-4" />}
              >
                Statistiques
              </TabButton>
            </nav>
          </div>

          {/* Contenu des onglets */}
          <div className="p-6">
            {activeTab === 'list' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <CourseListTab 
                  courses={coursesState}
                  onToggleActive={toggleCourseActive}
                  onViewDetails={openCourseDetails}
                  onEditCourse={startEditCourse}
                />
              </motion.div>
            )}

            {activeTab === 'add' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <AddCourseTab 
                  courseToEdit={courseToEdit}
                  onEditComplete={stopEditCourse}
                />
              </motion.div>
            )}

            {activeTab === 'stats' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <StatisticsTab courses={coursesState} />
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Modal des détails */}
        <CourseDetailsModal 
          courseItem={selectedCourse}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      </div>
    </div>
  );
};

export default CoursesChef;