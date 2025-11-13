import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  User, 
  BookOpen, 
  UserPlus, 
  Phone, 
  Mail, 
  Filter, 
  Edit, 
  Check, 
  X, 
  BarChart3, 
  FileText, 
  Award, 
  Layers, 
  PlusCircle,
  Trash2,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  Eye,
  Calendar
} from 'lucide-react';

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

// Interface pour les cours
interface CourseItem {
  id: number;
  name: string;
  department: string;
  hours: number;
  students: number;
  active: boolean;
  description?: string;
}

// Données des cours disponibles
const AVAILABLE_COURSES: CourseItem[] = [
  { id: 1, name: "Programmation Orientée Objet", department: "Informatique", hours: 45, students: 35, active: true, description: "Cours fondamental sur la programmation orientée objet avec Java" },
  { id: 2, name: "Algorithmes Avancés", department: "Informatique", hours: 40, students: 28, active: true, description: "Étude des algorithmes complexes et optimisation" },
  { id: 3, name: "Base de Données", department: "Informatique", hours: 50, students: 32, active: true, description: "Conception et gestion des bases de données relationnelles" },
  { id: 4, name: "Réseaux Informatiques", department: "Réseaux", hours: 48, students: 30, active: true, description: "Architecture et protocoles des réseaux informatiques" },
  { id: 5, name: "Sécurité Informatique", department: "Réseaux", hours: 35, students: 25, active: true, description: "Principes de sécurité et protection des systèmes" },
  { id: 6, name: "Intelligence Artificielle", department: "Informatique", hours: 45, students: 22, active: true, description: "Introduction aux techniques d'intelligence artificielle" },
  { id: 7, name: "Gestion de Projet", department: "Management", hours: 30, students: 38, active: true, description: "Méthodologies de gestion de projet informatique" },
  { id: 8, name: "Développement Web", department: "Informatique", hours: 60, students: 40, active: true, description: "Technologies web modernes et frameworks" },
];

interface ProfessorItem {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departments: string[];
  assignedCourses: number[];
  hireDate: string;
  active: boolean;
}

const PROFESSORS_DATA: ProfessorItem[] = [
  { id: 1, firstName: "Moussa", lastName: "Diop", email: "moussa.diop@faculty.edu.sn", phone: "77 123 45 67", departments: ["Informatique"], assignedCourses: [1, 8], hireDate: "01/09/2020", active: true },
  { id: 2, firstName: "Fatou", lastName: "Ndiaye", email: "fatou.ndiaye@faculty.edu.sn", phone: "76 234 56 78", departments: ["Informatique", "Réseaux"], assignedCourses: [2, 5], hireDate: "15/10/2019", active: true },
  { id: 3, firstName: "Omar", lastName: "Sall", email: "omar.sall@faculty.edu.sn", phone: "78 345 67 89", departments: ["Informatique"], assignedCourses: [3], hireDate: "01/09/2021", active: true },
  { id: 4, firstName: "Aminata", lastName: "Diallo", email: "aminata.diallo@faculty.edu.sn", phone: "70 456 78 90", departments: ["Réseaux"], assignedCourses: [4], hireDate: "01/09/2022", active: true },
  { id: 5, firstName: "Ibrahim", lastName: "Sow", email: "ibrahim.sow@faculty.edu.sn", phone: "77 567 89 01", departments: ["Réseaux"], assignedCourses: [], hireDate: "15/01/2023", active: false },
  { id: 6, firstName: "Cheikh", lastName: "Diop", email: "cheikh.diop@faculty.edu.sn", phone: "76 678 90 12", departments: ["Informatique"], assignedCourses: [6], hireDate: "01/09/2021", active: true },
  { id: 7, firstName: "Aïda", lastName: "Fall", email: "aida.fall@faculty.edu.sn", phone: "70 789 01 23", departments: ["Management"], assignedCourses: [7], hireDate: "01/09/2020", active: true },
  { id: 8, firstName: "Khadija", lastName: "Ba", email: "khadija.ba@faculty.edu.sn", phone: "76 890 12 34", departments: [], assignedCourses: [], hireDate: "01/03/2024", active: true },
];

// Composants UI réutilisables - même style que StudentsChef
const SimpleButton: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  icon?: React.ReactNode;
}> = ({ children, variant = 'primary', onClick, disabled = false, type = 'button', icon }) => {
  const styles = {
    primary: `bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    secondary: `bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    ghost: `bg-transparent text-gray-600 border border-transparent hover:bg-gray-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`
  };
  
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      type={type}
      className={`px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center rounded-sm ${styles[variant]}`}
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
          ? 'border-blue-600 text-blue-600' 
          : 'border-transparent text-gray-500 hover:text-gray-700'
        }
      `}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'active' | 'inactive' | 'info' | 'warning' | 'primary';
  className?: string;
}> = ({ children, variant = 'info', className = '' }) => {
  const styles = {
    active: "bg-green-50 text-green-700 border border-green-200",
    inactive: "bg-red-50 text-red-600 border border-red-200", 
    info: "bg-gray-50 text-gray-700 border border-gray-200",
    warning: "bg-orange-50 text-orange-700 border border-orange-200",
    primary: "bg-blue-50 text-blue-700 border border-blue-200"
  };
  
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-sm ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

const SimpleToggle: React.FC<{
  isActive: boolean;
  onToggle: () => void;
  activeLabel?: string;
  inactiveLabel?: string;
  disabled?: boolean;
}> = ({ isActive, onToggle, activeLabel = 'Actif', inactiveLabel = 'Inactif', disabled = false }) => {
  return (
    <button
      onClick={disabled ? undefined : onToggle}
      disabled={disabled}
      className={`
        w-12 h-6 rounded-full border-2 transition-colors duration-200 flex items-center
        ${isActive ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'}
      `}
    >
      <div className={`
        w-4 h-4 bg-white rounded-full transition-transform duration-200 flex items-center justify-center
        ${isActive ? 'translate-x-6' : 'translate-x-0'}
      `}>
        {isActive ? 
          <Check className="h-2 w-2 text-green-500" /> : 
          <X className="h-2 w-2 text-red-400" />
        }
      </div>
    </button>
  );
};

// Hook pour gérer les toasts
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

// Container des toasts
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

// Modal de confirmation
const ConfirmationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  type?: 'danger' | 'warning' | 'info';
}> = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirmer", type = "info" }) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: "bg-red-600 hover:bg-red-700 text-white",
    warning: "bg-orange-600 hover:bg-orange-700 text-white",
    info: "bg-blue-600 text-white hover:bg-blue-700"
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border border-gray-200 p-6 max-w-md w-full mx-4 rounded-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <SimpleButton
            onClick={onClose}
            variant="secondary"
          >
            Annuler
          </SimpleButton>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 text-sm font-medium rounded-sm transition-colors duration-200 ${typeStyles[type]}`}
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Modal d'attribution de cours
const AssignCoursesModal: React.FC<{ 
  professor: ProfessorItem | null; 
  isOpen: boolean; 
  onClose: () => void;
  onAssignCourses: (professorId: number, courseIds: number[]) => void;
  currentDepartment: string;
}> = ({ professor, isOpen, onClose, onAssignCourses, currentDepartment }) => {
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    if (professor) {
      setSelectedCourses(professor.assignedCourses);
    }
  }, [professor]);

  if (!isOpen || !professor) return null;

  const availableCourses = AVAILABLE_COURSES.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase());
    const isFromCurrentDepartment = course.department === currentDepartment;
    return matchesSearch && isFromCurrentDepartment;
  });

  const assignedCourses = AVAILABLE_COURSES.filter(course => 
    professor.assignedCourses.includes(course.id) && course.department === currentDepartment
  );

  const handleCourseToggle = (courseId: number) => {
    setSelectedCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSave = () => {
    onAssignCourses(professor.id, selectedCourses);
    onClose();
  };

  const totalHours = selectedCourses.reduce((total, courseId) => {
    const course = AVAILABLE_COURSES.find(c => c.id === courseId);
    return total + (course?.hours || 0);
  }, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.95 }} 
        className="bg-white border border-gray-200 p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto rounded-sm"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Attribuer des cours à {professor.firstName} {professor.lastName}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Département: {currentDepartment} • Professeur dans: {professor.departments.join(', ')}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cours actuellement assignés */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
              Cours actuellement assignés ({assignedCourses.length})
            </h3>
            {assignedCourses.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 p-4 text-center rounded-sm">
                <p className="text-gray-500">Aucun cours assigné</p>
              </div>
            ) : (
              <div className="space-y-3">
                {assignedCourses.map(course => (
                  <div key={course.id} className="bg-blue-50 border border-blue-200 p-4 rounded-sm">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-blue-900">{course.name}</h4>
                        <p className="text-sm text-blue-700">{course.department}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="flex items-center text-xs text-blue-700">
                            <Clock className="h-3 w-3 mr-1" />
                            {course.hours}h
                          </span>
                          <span className="flex items-center text-xs text-blue-700">
                            <Users className="h-3 w-3 mr-1" />
                            {course.students} étudiants
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCourseToggle(course.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded-sm"
                        title="Retirer le cours"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cours disponibles */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <PlusCircle className="h-5 w-5 mr-2 text-blue-600" />
              Cours disponibles
            </h3>
            
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Rechercher un cours..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm rounded-sm"
                />
              </div>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {availableCourses.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 p-4 text-center rounded-sm">
                  <p className="text-gray-500">Aucun cours disponible</p>
                </div>
              ) : (
                availableCourses.map(course => (
                  <div 
                    key={course.id} 
                    className={`border p-4 cursor-pointer transition-colors rounded-sm ${
                      selectedCourses.includes(course.id)
                        ? 'bg-blue-50 border-blue-300'
                        : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleCourseToggle(course.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{course.name}</h4>
                        <p className="text-sm text-gray-500">{course.department}</p>
                        {course.description && (
                          <p className="text-xs text-gray-600 mt-1">{course.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2">
                          <span className="flex items-center text-xs text-gray-600">
                            <Clock className="h-3 w-3 mr-1" />
                            {course.hours}h
                          </span>
                          <span className="flex items-center text-xs text-gray-600">
                            <Users className="h-3 w-3 mr-1" />
                            {course.students} étudiants
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {selectedCourses.includes(course.id) ? (
                          <Check className="h-5 w-5 text-blue-600" />
                        ) : (
                          <PlusCircle className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{selectedCourses.length}</span> cours sélectionnés • 
              <span className="font-medium ml-1">{totalHours}h</span> total
            </div>
            <div className="flex space-x-3">
              <SimpleButton variant="secondary" onClick={onClose}>
                Annuler
              </SimpleButton>
              <SimpleButton variant="primary" onClick={handleSave}>
                Enregistrer les attributions
              </SimpleButton>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Onglet Liste des professeurs
const ProfessorListTab: React.FC<{
  professors: ProfessorItem[];
  onToggleActive: (id: number) => void;
  onEditProfessor: (professor: ProfessorItem) => void;
  onAssignCourses: (professor: ProfessorItem) => void;
  currentUserDepartment: string;
}> = ({ professors, onToggleActive, onEditProfessor, onAssignCourses, currentUserDepartment }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProfessors = professors.filter(professor => {
    const matchesSearch = professor.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          professor.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          professor.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = 
      activeFilter === 'all' || 
      (activeFilter === 'active' && professor.active) || 
      (activeFilter === 'inactive' && !professor.active);
    const matchesDepartment = 
      departmentFilter === 'all' || 
      professor.departments.some(dept => dept === departmentFilter);
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  return (
    <div>
      {/* Filtres et recherche */}
      <div className="bg-white border border-gray-200 p-6 mb-6 rounded-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Filtres et recherche</h3>
          <SimpleButton
            onClick={() => setShowFilters(!showFilters)}
            variant="ghost"
            icon={<Filter className="h-4 w-4" />}
          >
            {showFilters ? 'Masquer' : 'Filtres'}
          </SimpleButton>
        </div>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Rechercher un professeur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-3 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm"
          />
        </div>
        
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">État</label>
                  <select
                    value={activeFilter}
                    onChange={(e) => setActiveFilter(e.target.value as 'all' | 'active' | 'inactive')}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm"
                  >
                    <option value="all">Tous les états</option>
                    <option value="active">Actifs</option>
                    <option value="inactive">Bloqués</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Département</label>
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm"
                  >
                    <option value="all">Tous les départements</option>
                    {DEPARTMENTS.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Résultats */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          {filteredProfessors.length} professeur{filteredProfessors.length !== 1 ? 's' : ''} trouvé{filteredProfessors.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      {/* Tableau */}
      {filteredProfessors.length === 0 ? (
        <div className="bg-white border border-gray-200 p-12 text-center rounded-sm">
          <User className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Aucun professeur trouvé</h2>
          <p className="text-gray-500">Modifiez vos critères de recherche</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Professeur
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Départements
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cours
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date d'embauche
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
                {filteredProfessors.map((professor, index) => (
                  <motion.tr 
                    key={professor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          <span className="text-gray-600 font-medium">
                            {professor.firstName.charAt(0)}{professor.lastName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{professor.lastName} {professor.firstName}</div>
                          <div className="text-sm text-gray-500">{professor.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-32">
                        {professor.departments.length > 0 ? (
                          <>
                            {professor.departments.slice(0, 2).map((dept, index) => (
                              <Badge key={index} variant="primary">{dept}</Badge>
                            ))}
                            {professor.departments.length > 2 && (
                              <Badge variant="info">+{professor.departments.length - 2}</Badge>
                            )}
                          </>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 text-blue-600 mr-1" />
                        <span className="text-sm font-medium text-gray-900">{professor.assignedCourses.length}</span>
                        {professor.assignedCourses.length > 0 && (
                          <span className="ml-2 text-xs text-gray-500 truncate max-w-32">
                            {AVAILABLE_COURSES
                              .filter(course => professor.assignedCourses.includes(course.id))
                              .slice(0, 1)
                              .map(course => course.name)}
                            {professor.assignedCourses.length > 1 && '...'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Phone className="h-4 w-4 text-blue-600 mr-1" />
                        {professor.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-blue-600 mr-1" />
                        <span className="text-sm text-gray-900">{professor.hireDate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <SimpleToggle 
                        isActive={professor.active} 
                        onToggle={() => onToggleActive(professor.id)}
                        activeLabel="Actif"
                        inactiveLabel="Bloqué"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center space-x-2">
                        <button 
                          onClick={() => onAssignCourses(professor)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 border border-gray-300 hover:border-blue-300 transition-colors duration-200 rounded-sm"
                          title="Attribuer des cours"
                        >
                          <Layers className="h-4 w-4" />
                        </button>
                        {/* <button 
                          onClick={() => onEditProfessor(professor)}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 border border-gray-300 hover:border-green-300 transition-colors duration-200 rounded-sm"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </button> */}
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
const StatisticsTab: React.FC<{ professors: ProfessorItem[] }> = ({ professors }) => {
  const activeProfessors = professors.filter(p => p.active);
  const totalAssignedCourses = professors.reduce((total, prof) => total + prof.assignedCourses.length, 0);
  const averageCoursesPerProfessor = professors.length > 0 ? (totalAssignedCourses / professors.length).toFixed(1) : '0';
  
  const departmentStats = DEPARTMENTS.map(dept => {
    const deptProfs = professors.filter(p => p.departments.includes(dept));
    return {
      name: dept,
      count: deptProfs.length,
      active: deptProfs.filter(p => p.active).length
    };
  }).filter(stat => stat.count > 0);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Stats principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: "Total Professeurs", value: professors.length, icon: User, color: "bg-blue-100 text-blue-600" },
          { title: "Professeurs Actifs", value: activeProfessors.length, icon: Check, color: "bg-green-100 text-green-600" },
          { title: "Cours Assignés", value: totalAssignedCourses, icon: BookOpen, color: "bg-purple-100 text-purple-600" },
          { title: "Moyenne/Cours", value: averageCoursesPerProfessor, icon: BarChart3, color: "bg-orange-100 text-orange-600" }
        ].map((stat, index) => (
          <div key={stat.title} className="bg-white border border-gray-200 p-6 rounded-sm">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 mr-4 rounded-sm`}>
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
      
      {/* Répartitions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 p-6 rounded-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par département</h3>
          <div className="space-y-3">
            {departmentStats.map(dept => {
              const percentage = Math.round((dept.count / professors.length) * 100);
              return (
                <div key={dept.name} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{dept.name}</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 h-2 mr-3 rounded-full">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
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

        <div className="bg-white border border-gray-200 p-6 rounded-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cours assignés par département</h3>
          <div className="space-y-4">
            {departmentStats.slice(0, 3).map(dept => {
              const deptCourses = AVAILABLE_COURSES.filter(course => course.department === dept.name);
              const assignedCourses = professors
                .filter(prof => prof.departments.includes(dept.name))
                .flatMap(prof => prof.assignedCourses);
              const uniqueAssignedCourses = assignedCourses.filter((course, index, self) => self.indexOf(course) === index);
              
              return (
                <div key={dept.name} className="border border-gray-200 p-4 rounded-sm">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-900">{dept.name}</h4>
                    <Badge variant="primary">
                      {uniqueAssignedCourses.length} / {deptCourses.length} cours assignés
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${deptCourses.length > 0 ? (uniqueAssignedCourses.length / deptCourses.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Onglet pour ajouter des professeurs existants au département
const AddToDepartmentTab: React.FC<{
  currentUserDepartment: string;
  availableProfessors: ProfessorItem[];
  onProfessorToggle: (professorId: number) => void;
  selectedProfessors: number[];
  onSave: () => void;
}> = ({ 
  currentUserDepartment, 
  availableProfessors, 
  onProfessorToggle, 
  selectedProfessors, 
  onSave 
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProfessors = availableProfessors.filter(professor => {
    const matchesSearch = professor.firstName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          professor.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          professor.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl"
    >
      <div className="bg-white border border-gray-200 p-6 rounded-sm">
        <div className="text-center mb-8">
          <div className="bg-blue-100 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full">
            <UserPlus className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Ajouter des professeurs à votre département</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Vous êtes connecté en tant que chef du département <strong>{currentUserDepartment}</strong>.
            Sélectionnez les professeurs que vous souhaitez ajouter à votre équipe. Les professeurs peuvent appartenir à plusieurs départements.
          </p>
        </div>

        {currentUserDepartment && (
          <div>
            <div className="bg-gray-50 border border-gray-200 p-4 mb-6 rounded-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Rechercher un professeur..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-sm rounded-sm"
                  />
                </div>
                <div className="text-sm text-gray-600 bg-gray-100 px-3 py-2 border rounded-sm">
                  Département actuel : <strong>{currentUserDepartment}</strong>
                </div>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredProfessors.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 p-8 text-center rounded-sm">
                  <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucun professeur disponible</h3>
                  <p className="text-gray-500">Tous les professeurs sont déjà dans votre département ou ne correspondent pas aux critères de recherche.</p>
                </div>
              ) : (
                filteredProfessors.map(professor => (
                  <div 
                    key={professor.id} 
                    className={`border p-4 cursor-pointer transition-colors rounded-sm ${
                      selectedProfessors.includes(professor.id)
                        ? 'bg-blue-50 border-blue-300'
                        : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                    onClick={() => onProfessorToggle(professor.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                            <span className="text-gray-600 font-medium text-sm">
                              {professor.firstName.charAt(0)}{professor.lastName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{professor.lastName} {professor.firstName}</h4>
                            <p className="text-sm text-gray-500">{professor.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={professor.active ? 'active' : 'inactive'}>
                            {professor.active ? 'Actif' : 'Bloqué'}
                          </Badge>
                          {professor.departments.map((dept, index) => (
                            <Badge key={index} variant="primary">{dept}</Badge>
                          ))}
                          <Badge variant="info">
                            <BookOpen className="inline h-3 w-3 mr-1" />
                            {professor.assignedCourses.length} cours
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {selectedProfessors.includes(professor.id) ? (
                          <Check className="h-5 w-5 text-blue-600" />
                        ) : (
                          <PlusCircle className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {selectedProfessors.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{selectedProfessors.length}</span> professeur(s) sélectionné(s)
                  </div>
                  <SimpleButton 
                    variant="primary" 
                    onClick={onSave}
                  >
                    Ajouter au département {currentUserDepartment}
                  </SimpleButton>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ProfessorsChef: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'stats'>('list');
  const [professorsState, setProfessorsState] = useState(PROFESSORS_DATA);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState<ProfessorItem | null>(null);
  const [selectedProfessors, setSelectedProfessors] = useState<number[]>([]);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type?: 'danger' | 'warning' | 'info';
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {}, type: 'info' });
  
  // Hook pour les toasts
  const { toasts, removeToast, showSuccess, showError, showWarning, showInfo } = useToast();
  
  // Mock user data
  const currentUserDepartment = 'Informatique';
  
  const toggleProfessorActive = (id: number) => {
    showWarning(
      'Action non autorisée',
      'En tant que chef de département, vous ne pouvez pas bloquer ou débloquer les professeurs.'
    );
  };
  
  const startEditProfessor = (prof: ProfessorItem) => {
    showWarning(
      'Action non autorisée',
      'En tant que chef de département, vous ne pouvez pas modifier les informations des professeurs.'
    );
  };
  
  const openAssignModal = (prof: ProfessorItem) => {
    if (!currentUserDepartment) {
      showError(
        'Erreur de configuration',
        'Département non identifié pour l\'utilisateur connecté.'
      );
      return;
    }
    
    if (!prof.departments.includes(currentUserDepartment)) {
      setConfirmModal({
        isOpen: true,
        title: 'Ajouter au département',
        message: `Le professeur ${prof.firstName} ${prof.lastName} n'est pas encore dans votre département (${currentUserDepartment}). Voulez-vous l'ajouter automatiquement à votre département pour pouvoir lui attribuer des cours ?`,
        onConfirm: () => {
          setProfessorsState(prev => prev.map(p => 
            p.id === prof.id 
              ? { ...p, departments: [...p.departments, currentUserDepartment] }
              : p
          ));
          showSuccess(
            'Professeur ajouté',
            `${prof.firstName} ${prof.lastName} a été ajouté au département ${currentUserDepartment}`
          );
          setSelectedProfessor(prof);
          setAssignModalOpen(true);
        },
        type: 'info'
      });
      return;
    }
    
    setSelectedProfessor(prof);
    setAssignModalOpen(true);
  };
  
  const closeAssignModal = () => {
    setSelectedProfessor(null);
    setAssignModalOpen(false);
  };

  const handleProfessorToggle = (professorId: number) => {
    setSelectedProfessors(prev => 
      prev.includes(professorId) 
        ? prev.filter(id => id !== professorId)
        : [...prev, professorId]
    );
  };

  const handleSaveToDepartment = () => {
    if (selectedProfessors.length === 0) return;
    
    setProfessorsState(prev => prev.map(prof => 
      selectedProfessors.includes(prof.id)
        ? { ...prof, departments: [...prof.departments, currentUserDepartment] }
        : prof
    ));
    
    showSuccess(
      'Professeurs ajoutés',
      `${selectedProfessors.length} professeur(s) ont été ajoutés avec succès au département ${currentUserDepartment}`
    );
    
    setSelectedProfessors([]);
  };

  const handleAssignCourses = (professorId: number, courseIds: number[]) => {
    setProfessorsState(prev => prev.map(prof => 
      prof.id === professorId 
        ? { ...prof, assignedCourses: courseIds }
        : prof
    ));
    
    const professor = professorsState.find(p => p.id === professorId);
    showSuccess(
      'Cours attribués',
      `Les cours ont été attribués avec succès à ${professor?.firstName} ${professor?.lastName}`
    );
  };

  const availableProfessors = currentUserDepartment 
    ? PROFESSORS_DATA.filter(prof => !prof.departments.includes(currentUserDepartment))
    : [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white border border-gray-200 p-6 mb-6 rounded-sm">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full p-3 mr-4">
              <User className="h-7 w-7 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Professeurs</h1>
              <p className="text-sm text-gray-500 mt-1">
                Consultez les professeurs de votre département et attribuez-leur des cours
              </p>
            </div>
          </div>
        </div>
        
        {/* Onglets */}
        <div className="bg-white border border-gray-200 mb-6 rounded-sm">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              <TabButton 
                isActive={activeTab === 'list'} 
                onClick={() => setActiveTab('list')} 
                icon={<FileText className="h-4 w-4" />}
              >
                Liste des professeurs
              </TabButton>
              <TabButton 
                isActive={activeTab === 'add'} 
                onClick={() => setActiveTab('add')} 
                icon={<UserPlus className="h-4 w-4" />}
              >
                Ajouter à mon département
              </TabButton>
              <TabButton 
                isActive={activeTab === 'stats'} 
                onClick={() => setActiveTab('stats')} 
                icon={<BarChart3 className="h-4 w-4" />}
              >
                Statistiques
              </TabButton>
            </div>
          </div>
          
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'list' && (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ProfessorListTab 
                    professors={professorsState}
                    onToggleActive={toggleProfessorActive}
                    onEditProfessor={startEditProfessor}
                    onAssignCourses={openAssignModal}
                    currentUserDepartment={currentUserDepartment}
                  />
                </motion.div>
              )}
              
              {activeTab === 'add' && (
                <motion.div
                  key="add"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <AddToDepartmentTab 
                    currentUserDepartment={currentUserDepartment}
                    availableProfessors={availableProfessors}
                    onProfessorToggle={handleProfessorToggle}
                    selectedProfessors={selectedProfessors}
                    onSave={handleSaveToDepartment}
                  />
                </motion.div>
              )}
              
              {activeTab === 'stats' && (
                <motion.div
                  key="stats"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <StatisticsTab professors={professorsState} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Modal d'attribution de cours */}
        <AssignCoursesModal 
          professor={selectedProfessor} 
          isOpen={assignModalOpen} 
          onClose={closeAssignModal}
          onAssignCourses={handleAssignCourses}
          currentDepartment={currentUserDepartment}
        />

        {/* Modal de confirmation */}
        <ConfirmationModal 
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
          onConfirm={confirmModal.onConfirm}
          title={confirmModal.title}
          message={confirmModal.message}
          type={confirmModal.type}
        />

        {/* Container des toasts */}
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </div>
  );
};

export default ProfessorsChef;