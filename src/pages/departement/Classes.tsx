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

// Composant Toggle simplifié
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
        w-12 h-6 border-2 transition-colors duration-200 flex items-center
        ${active ? 'bg-gray-900 border-gray-900' : 'bg-white border-gray-300'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'}
        `}
      >
        <div className={`
        w-4 h-4 bg-white transition-transform duration-200
          ${active ? 'translate-x-6' : 'translate-x-0'}
        `}>
        <div className="w-full h-full flex items-center justify-center">
          {active ? 
            <Check className="h-2 w-2 text-gray-900" /> : 
            <X className="h-2 w-2 text-gray-400" />
          }
        </div>
      </div>
    </button>
  );
};

// Badge simplifié
const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'active' | 'inactive' | 'info';
  className?: string;
}> = ({ children, variant = 'info', className = '' }) => {
  const styles = {
    active: "bg-gray-100 text-gray-900 border border-gray-200",
    inactive: "bg-gray-50 text-gray-600 border border-gray-200", 
    info: "bg-gray-50 text-gray-700 border border-gray-200"
  };
  
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium ${styles[variant]} ${className}`}>
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
    primary: `bg-gray-900 text-white border border-gray-900 hover:bg-gray-800 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    secondary: `bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    ghost: `bg-transparent text-gray-600 border border-transparent hover:bg-gray-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`
  };
  
  return (
    <button 
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      type={type}
      className={`px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center ${styles[variant]}`}
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
          ? 'border-gray-900 text-gray-900' 
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
          { title: "Total Classes", value: classes.length, icon: BookOpen },
          { title: "Total Étudiants", value: totalStudents, icon: User },
          { title: "Total Cours", value: totalCourses, icon: FileText },
          { title: "Classes Actives", value: activeClasses.length, icon: School }
        ].map((stat, index) => (
          <div key={stat.title} className="bg-white border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-gray-100 p-3 mr-4">
                <stat.icon className="h-6 w-6 text-gray-700" />
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
                    <div className="w-24 bg-gray-200 h-2 mr-3">
                      <div 
                        className="bg-gray-800 h-2" 
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
                    <div className="w-24 bg-gray-200 h-2 mr-3">
                      <div 
                        className="bg-gray-800 h-2" 
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

// Formulaire d'ajout
const AddClassTab: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    level: '',
    department: '',
    academicYear: getCurrentAcademicYear(),
    description: '',
    active: true
  });
  
  const academicYears = generateAcademicYears();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    alert('Classe créée avec succès !');
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
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
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
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
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
                <input
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Ex: Informatique"
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
                  required
                />
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
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
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
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
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
              Créer la classe
            </SimpleButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Classes: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'stats'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <div className="flex items-center">
            <div className="bg-gray-100 p-3 mr-4">
              <BookOpen className="h-6 w-6 text-gray-700" />
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
        <div className="bg-white border border-gray-200 mb-6">
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
                onClick={() => setActiveTab('add')}
                icon={<Plus className="h-4 w-4" />}
                >
                  Ajouter une classe
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
                  <div className="bg-white border border-gray-200 p-6 mb-6">
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
                          className="block w-full pl-10 pr-4 py-3 border border-gray-300 focus:outline-none focus:border-gray-500"
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
                              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
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
                              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500"
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
        
                  {/* Liste */}
        {filteredClasses.length === 0 ? (
                    <div className="bg-white border border-gray-200 p-12 text-center">
                      <BookOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Aucune classe trouvée</h2>
                      <p className="text-gray-500">Modifiez vos critères de recherche</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredClasses.map(classItem => (
                <motion.div
                  key={classItem.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white border border-gray-200"
                >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{classItem.name}</h3>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="info" className="whitespace-nowrap">{classItem.level}</Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="info" className="whitespace-nowrap">
                                    <Calendar className="inline h-3 w-3 mr-1" />
                                    {formatAcademicYear(classItem.academicYear)}
                                  </Badge>
                                  <Badge variant="info" className="whitespace-nowrap">{classItem.department}</Badge>
                          </div>
                        </div>
                              <SimpleToggle 
                          active={classItem.active}
                          onChange={() => toggleClassActive(classItem.id)}
                                disabled={isAcademicYearPast(classItem.academicYear)}
                        />
                      </div>
                      
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="bg-gray-50 border border-gray-200 p-4 text-center">
                                <div className="flex items-center justify-center mb-1">
                                  <User className="h-4 w-4 text-gray-600 mr-1" />
                                  <span className="text-xl font-bold text-gray-900">{classItem.students}</span>
                      </div>
                                <p className="text-xs text-gray-500">Étudiants</p>
                          </div>
                              <div className="bg-gray-50 border border-gray-200 p-4 text-center">
                                <div className="flex items-center justify-center mb-1">
                                  <FileText className="h-4 w-4 text-gray-600 mr-1" />
                                  <span className="text-xl font-bold text-gray-900">{classItem.courses}</span>
                        </div>
                                <p className="text-xs text-gray-500">Cours</p>
                        </div>
                      </div>
                    </div>
                    
                          <div className="bg-gray-50 border-t border-gray-200 p-4 flex justify-between items-center">
                      <div className="flex space-x-2">
                              <button className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 hover:bg-white">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button 
                                className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 hover:bg-white"
                            disabled={isAcademicYearPast(classItem.academicYear)}
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                      </div>
                            <span className="text-xs text-gray-500">
                              MAJ: {classItem.lastUpdated}
                        </span>
                      </div>
                        </motion.div>
                      ))}
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
                  <AddClassTab />
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
      </div>
    </div>
  );
};

export default Classes;