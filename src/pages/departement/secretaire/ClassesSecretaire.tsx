import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, User, FileText, Search, Filter, Plus, 
  Edit, Trash2, Eye, Calendar, ChevronDown, 
  BarChart3, Users, School, Save, X, Check
} from 'lucide-react';

// Fonctions utilitaires pour les années scolaires
const getCurrentAcademicYear = () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  
  if (currentMonth < 10) {
    return `${currentYear-1}-${currentYear}`;
  } else {
    return `${currentYear}-${currentYear+1}`;
  }
};

const generateAcademicYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  
  for (let i = 5; i > 0; i--) {
    const year = currentYear - i;
    years.push(`${year}-${year+1}`);
  }
  
  years.push(`${currentYear-1}-${currentYear}`);
  if (new Date().getMonth() + 1 >= 10) {
    years.push(`${currentYear}-${currentYear+1}`);
  }
  
  for (let i = 1; i <= 3; i++) {
    const startYear = currentYear + i - 1;
    if (!(startYear === currentYear && new Date().getMonth() + 1 < 10)) {
      years.push(`${startYear}-${startYear+1}`);
    }
  }
  
  return years;
};

const isAcademicYearPast = (academicYear: string): boolean => {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();
  const endYear = parseInt(academicYear.split('-')[1]);
  
  return (currentMonth > 7 && currentYear >= endYear) || (currentYear > endYear);
};

const formatAcademicYear = (academicYear: string): string => {
  const [startYear, endYear] = academicYear.split('-');
  return `Oct ${startYear} - Juil ${endYear}`;
};

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

interface ClassItem {
  id: number;
  name: string;
  level: string;
  department: string;
  academicYear: string;
  students: number;
  courses: number;
  active: boolean;
  lastUpdated: string;
}

const CLASSES_DATA: ClassItem[] = [
  { id: 1, name: "Génie Logiciel - L1", department: "Informatique", level: "Licence 1", academicYear: "2024-2025", students: 45, courses: 8, active: true, lastUpdated: "2025-05-12" },
  { id: 2, name: "Génie Logiciel - L2", department: "Informatique", level: "Licence 2", academicYear: "2024-2025", students: 38, courses: 10, active: true, lastUpdated: "2025-05-10" },
  { id: 3, name: "Génie Logiciel - L3", department: "Informatique", level: "Licence 3", academicYear: "2024-2025", students: 32, courses: 12, active: true, lastUpdated: "2025-05-08" },
  { id: 4, name: "Intelligence Artificielle - M1", department: "Informatique", level: "Master 1", academicYear: "2024-2025", students: 25, courses: 8, active: true, lastUpdated: "2025-05-05" },
  { id: 5, name: "Intelligence Artificielle - M2", department: "Informatique", level: "Master 2", academicYear: "2024-2025", students: 20, courses: 6, active: true, lastUpdated: "2025-04-30" },
  { id: 6, name: "Réseaux et Sécurité - L1", department: "Réseaux", level: "Licence 1", academicYear: "2024-2025", students: 40, courses: 8, active: true, lastUpdated: "2025-04-28" },
  { id: 7, name: "Réseaux et Sécurité - L2", department: "Réseaux", level: "Licence 2", academicYear: "2023-2024", students: 35, courses: 10, active: false, lastUpdated: "2025-04-25" },
  { id: 8, name: "Gestion d'Entreprise - L1", department: "Management", level: "Licence 1", academicYear: "2024-2025", students: 50, courses: 8, active: true, lastUpdated: "2025-04-20" },
];

// Composant Toggle avec border radius
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

// Modal pour afficher les détails d'une classe
const ClassDetailsModal: React.FC<{
  classItem: ClassItem | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ classItem, isOpen, onClose }) => {
  if (!isOpen || !classItem) return null;

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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{classItem.name}</h2>
            <div className="flex items-center gap-2">
              <Badge variant={classItem.active ? 'active' : 'inactive'}>
                {classItem.active ? 'Active' : 'Inactive'}
              </Badge>
              <Badge variant="primary">{classItem.level}</Badge>
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
                <p className="text-gray-900">{classItem.department}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Niveau</label>
                <p className="text-gray-900">{classItem.level}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Année scolaire</label>
                <p className="text-gray-900">{formatAcademicYear(classItem.academicYear)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Dernière mise à jour</label>
                <p className="text-gray-900">{classItem.lastUpdated}</p>
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
                  <span className="text-3xl font-bold text-gray-900">{classItem.students}</span>
                </div>
                <p className="text-sm text-green-700 font-medium">Étudiants inscrits</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <FileText className="h-6 w-6 text-blue-600 mr-2" />
                  <span className="text-3xl font-bold text-gray-900">{classItem.courses}</span>
                </div>
                <p className="text-sm text-blue-700 font-medium">Cours programmés</p>
              </div>
            </div>
          </div>
        </div>

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

// Badge avec couleurs subtiles
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

// Bouton simplifié
const SimpleButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: React.ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit';
}> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  icon,
  disabled = false,
  type = 'button'
}) => {
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

// Onglet simplifié
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

// Statistiques
const StatisticsTab: React.FC<{ classes: ClassItem[] }> = ({ classes }) => {
  const activeClasses = classes.filter(c => c.active);
  const totalStudents = classes.reduce((sum, c) => sum + c.students, 0);
  const totalCourses = classes.reduce((sum, c) => sum + c.courses, 0);
  const departments = Array.from(new Set(classes.map(c => c.department)));
  const levels = Array.from(new Set(classes.map(c => c.level)));
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Stats principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: "Total Classes", value: classes.length, icon: BookOpen, color: "bg-blue-100 text-blue-600" },
          { title: "Total Étudiants", value: totalStudents, icon: User, color: "bg-green-100 text-green-600" },
          { title: "Total Cours", value: totalCourses, icon: FileText, color: "bg-orange-100 text-orange-600" },
          { title: "Classes Actives", value: activeClasses.length, icon: School, color: "bg-purple-100 text-purple-600" }
        ].map((stat, index) => (
          <div key={stat.title} className="bg-white border border-gray-200 p-6">
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
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par département</h3>
          <div className="space-y-3">
            {departments.map(dept => {
              const deptClasses = classes.filter(c => c.department === dept);
              const percentage = Math.round((deptClasses.length / classes.length) * 100);
              return (
                <div key={dept} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{dept}</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 h-2 mr-3 rounded-full">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{deptClasses.length}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par niveau</h3>
          <div className="space-y-3">
            {levels.map(level => {
              const levelClasses = classes.filter(c => c.level === level);
              const percentage = Math.round((levelClasses.length / classes.length) * 100);
              return (
                <div key={level} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{level}</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 h-2 mr-3 rounded-full">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{levelClasses.length}</span>
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

// Formulaire d'ajout/modification
const AddClassTab: React.FC<{
  classToEdit?: ClassItem | null;
  onEditComplete?: () => void;
}> = ({ classToEdit, onEditComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    level: '',
    department: '',
    academicYear: getCurrentAcademicYear(),
    description: '',
    active: true
  });
  
  const academicYears = generateAcademicYears();
  const isEditing = Boolean(classToEdit);
  
  // Pré-remplir le formulaire quand on édite
  React.useEffect(() => {
    if (classToEdit) {
      setFormData({
        name: classToEdit.name,
        level: classToEdit.level,
        department: classToEdit.department,
        academicYear: classToEdit.academicYear,
        description: '',
        active: classToEdit.active
      });
    } else {
      setFormData({
        name: '',
        level: '',
        department: '',
        academicYear: getCurrentAcademicYear(),
        description: '',
        active: true
      });
    }
  }, [classToEdit]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    alert(`Classe ${isEditing ? 'modifiée' : 'créée'} avec succès !`);
    
    if (isEditing && onEditComplete) {
      onEditComplete();
    }
    
    setFormData({
      name: '',
      level: '',
      department: '',
      academicYear: getCurrentAcademicYear(),
      description: '',
      active: true
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl"
    >
      <div className="bg-white border border-gray-200 p-6">
        {isEditing && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-sm">
            <div className="flex items-center">
              <Edit className="h-5 w-5 text-blue-600 mr-2" />
              <p className="text-blue-800 font-medium">Mode édition : {classToEdit?.name}</p>
            </div>
          </div>
        )}
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la classe *
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: Génie Logiciel - L1"
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Niveau *
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm"
                  required
                >
                  <option value="">Sélectionner un niveau</option>
                  <option value="Licence 1">Licence 1</option>
                  <option value="Licence 2">Licence 2</option>
                  <option value="Licence 3">Licence 3</option>
                  <option value="Master 1">Master 1</option>
                  <option value="Master 2">Master 2</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Département *
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm"
                  required
                >
                  <option value="">Sélectionner un département</option>
                  {DEPARTMENTS.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Année scolaire *
                </label>
                <select
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm"
                  required
                >
                  {academicYears.map(year => (
                    <option key={year} value={year}>
                      {formatAcademicYear(year)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description optionnelle..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm"
                />
              </div>
            </div>
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
              variant="secondary"
              onClick={() => {
                setFormData({
                  name: '',
                  level: '',
                  department: '',
                  academicYear: getCurrentAcademicYear(),
                  description: '',
                  active: true
                });
              }}
            >
              Réinitialiser
            </SimpleButton>
            <SimpleButton
              type="button"
              variant="primary"
              icon={<Save className="h-4 w-4" />}
              onClick={handleSubmit}
            >
              {isEditing ? 'Modifier la classe' : 'Créer la classe'}
            </SimpleButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ClassesChef: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'stats'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // États pour la modal et l'édition
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classToEdit, setClassToEdit] = useState<ClassItem | null>(null);
  
  const [classesState, setClassesState] = useState(CLASSES_DATA.map(classItem => {
    const isPastAcademicYear = isAcademicYearPast(classItem.academicYear);
    return isPastAcademicYear ? { ...classItem, active: false } : classItem;
  }));

  const filteredClasses = classesState.filter(classItem => {
    const matchesSearch = classItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         classItem.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         classItem.level.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      activeFilter === 'all' || 
      (activeFilter === 'active' && classItem.active) || 
      (activeFilter === 'inactive' && !classItem.active);
    
    const matchesLevel = 
      levelFilter === 'all' || 
      classItem.level.includes(levelFilter);
    
    return matchesSearch && matchesStatus && matchesLevel;
  });

  const toggleClassActive = (id: number) => {
    const classToToggle = classesState.find(c => c.id === id);
    if (!classToToggle) return;
    
    const isPastAcademicYear = isAcademicYearPast(classToToggle.academicYear);
    if (isPastAcademicYear && !classToToggle.active) {
      return;
    }
    
    setClassesState(prevState => 
      prevState.map(classItem => 
        classItem.id === id 
          ? { ...classItem, active: !classItem.active } 
          : classItem
      )
    );
  };

  // Fonctions pour gérer la modal des détails
  const openClassDetails = (classItem: ClassItem) => {
    setSelectedClass(classItem);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedClass(null);
    setIsModalOpen(false);
  };

  // Fonctions pour gérer l'édition
  const startEditClass = (classItem: ClassItem) => {
    setClassToEdit(classItem);
    setActiveTab('add');
  };

  const stopEditClass = () => {
    setClassToEdit(null);
    setActiveTab('list');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white border border-gray-200 p-6 mb-6 rounded-sm">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full p-3 mr-4">
              <BookOpen className="h-7 w-7 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Classes</h1>
              <p className="text-sm text-gray-500 mt-1">
                Gérez les classes, étudiants et cours
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
                icon={<BookOpen className="h-4 w-4" />}
              >
                Liste des classes
              </TabButton>
              <TabButton
                isActive={activeTab === 'add'}
                onClick={() => {
                  setClassToEdit(null); // Reset l'édition quand on clique sur l'onglet
                  setActiveTab('add');
                }}
                icon={<Plus className="h-4 w-4" />}
              >
                {classToEdit ? 'Modifier une classe' : 'Ajouter une classe'}
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
                  {/* Filtres */}
                  <div className="bg-white border border-gray-200 p-6 mb-6 rounded-sm">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
                      <div className="relative w-full md:w-1/2">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          placeholder="Rechercher une classe..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="block w-full pl-10 pr-4 py-3 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm"
                        />
                      </div>
                      
                      <SimpleButton
                        variant="ghost"
                        onClick={() => setShowFilters(!showFilters)}
                        icon={<Filter className="h-5 w-5" />}
                      >
                        {showFilters ? 'Masquer' : 'Filtres'}
                      </SimpleButton>
                    </div>
                    
                    <AnimatePresence>
                      {showFilters && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200"
                        >
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">État</label>
                            <select
                              value={activeFilter}
                              onChange={(e) => setActiveFilter(e.target.value as 'all' | 'active' | 'inactive')}
                              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm"
                            >
                              <option value="all">Tous</option>
                              <option value="active">Actives</option>
                              <option value="inactive">Inactives</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Niveau</label>
                            <select
                              value={levelFilter}
                              onChange={(e) => setLevelFilter(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm"
                            >
                              <option value="all">Tous les niveaux</option>
                              <option value="Licence 1">Licence 1</option>
                              <option value="Licence 2">Licence 2</option>
                              <option value="Licence 3">Licence 3</option>
                              <option value="Master 1">Master 1</option>
                              <option value="Master 2">Master 2</option>
                            </select>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* Résultats */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      {filteredClasses.length} classe{filteredClasses.length !== 1 ? 's' : ''} trouvée{filteredClasses.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  
                  {/* Tableau */}
                  {filteredClasses.length === 0 ? (
                    <div className="bg-white border border-gray-200 p-12 text-center rounded-sm">
                      <BookOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                      <h2 className="text-xl font-semibold text-gray-700 mb-2">Aucune classe trouvée</h2>
                      <p className="text-gray-500">Modifiez vos critères de recherche</p>
                    </div>
                  ) : (
                    <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Classe
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Département
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Niveau
                              </th>
                              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Année scolaire
                              </th>
                              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Étudiants
                              </th>
                              <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Cours
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
                            {filteredClasses.map((classItem, index) => (
                              <motion.tr
                                key={classItem.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="hover:bg-gray-50 transition-colors duration-150"
                              >
                                <td className="px-6 py-4">
                                  <div>
                                    <div className="text-sm font-medium text-gray-900 whitespace-nowrap">
                                      {classItem.name}
                                    </div>
                                    <div className="text-sm text-gray-500 whitespace-nowrap">
                                      MAJ: {classItem.lastUpdated}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <Badge variant="info">{classItem.department}</Badge>
                                </td>
                                <td className="px-6 py-4">
                                  <Badge variant="primary" className="whitespace-nowrap">{classItem.level}</Badge>
                                </td>
                                <td className="px-6 py-4">
                                  <Badge variant="warning" className="whitespace-nowrap">
                                    <Calendar className="inline h-3 w-3 mr-1" />
                                    {formatAcademicYear(classItem.academicYear)}
                                  </Badge>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <div className="flex items-center justify-center">
                                    <User className="h-4 w-4 text-green-600 mr-1" />
                                    <span className="text-sm font-medium text-gray-900">
                                      {classItem.students}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <div className="flex items-center justify-center">
                                    <FileText className="h-4 w-4 text-blue-600 mr-1" />
                                    <span className="text-sm font-medium text-gray-900">
                                      {classItem.courses}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <div className="flex items-center justify-center">
                                    <SimpleToggle 
                                      active={classItem.active}
                                      onChange={() => toggleClassActive(classItem.id)}
                                      disabled={isAcademicYearPast(classItem.academicYear)}
                                    />
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex justify-center space-x-2">
                                    <button 
                                      onClick={() => openClassDetails(classItem)}
                                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 border border-gray-300 hover:border-blue-300 transition-colors duration-200 rounded-sm"
                                      title="Voir les détails"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </button>
                                    <button 
                                      onClick={() => startEditClass(classItem)}
                                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 border border-gray-300 hover:border-green-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
                                      disabled={isAcademicYearPast(classItem.academicYear)}
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
                </motion.div>
              )}
              
              {activeTab === 'add' && (
                <motion.div
                  key="add"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <AddClassTab 
                    classToEdit={classToEdit}
                    onEditComplete={stopEditClass}
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
                  <StatisticsTab classes={classesState} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Modal des détails */}
        <ClassDetailsModal 
          classItem={selectedClass}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      </div>
    </div>
  );
};

export default ClassesChef;