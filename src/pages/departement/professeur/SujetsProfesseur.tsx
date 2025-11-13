import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, User, Search, Filter, Plus, 
  Edit, Trash2, Eye, Calendar, Clock,
  BarChart3, Users, School, Save, X, Check,
  AlertCircle, BookOpen, Target, Award,
  TrendingUp, PieChart, Activity
} from 'lucide-react';

// Types et interfaces
interface Subject {
  id: number;
  title: string;
  description: string;
  type: 'memoire' | 'projet' | 'stage';
  level: string;
  department: string;
  maxStudents: number;
  currentStudents: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submittedDate: string;
  approvedDate?: string;
  academicYear: string;
  keywords: string[];
  requirements: string;
  objectives: string;
  createdDate: string;
  lastModified: string;
}

// Données d'exemple
const SUBJECTS_DATA: Subject[] = [
  {
    id: 1,
    title: "Intelligence Artificielle pour la Détection de Fraudes",
    description: "Développement d'un système de détection de fraudes utilisant des algorithmes d'apprentissage automatique et de deep learning.",
    type: "memoire",
    level: "Master 2",
    department: "Informatique",
    maxStudents: 2,
    currentStudents: 1,
    status: "approved",
    submittedDate: "2024-09-15",
    approvedDate: "2024-09-20",
    academicYear: "2024-2025",
    keywords: ["IA", "Machine Learning", "Sécurité", "Détection"],
    requirements: "Bonnes connaissances en Python, statistiques et algorithmes",
    objectives: "Maîtriser les techniques de ML pour la sécurité informatique",
    createdDate: "2024-09-10",
    lastModified: "2024-09-15"
  },
  {
    id: 2,
    title: "Application Mobile de Gestion de Bibliothèque",
    description: "Conception et développement d'une application mobile cross-platform pour la gestion automatisée d'une bibliothèque universitaire.",
    type: "projet",
    level: "Licence 3",
    department: "Informatique",
    maxStudents: 3,
    currentStudents: 3,
    status: "approved",
    submittedDate: "2024-10-01",
    approvedDate: "2024-10-05",
    academicYear: "2024-2025",
    keywords: ["Mobile", "React Native", "Base de données", "UX/UI"],
    requirements: "Connaissances en développement mobile et bases de données",
    objectives: "Développer une solution mobile complète",
    createdDate: "2024-09-25",
    lastModified: "2024-10-01"
  },
  {
    id: 3,
    title: "Optimisation des Réseaux de Neurones pour IoT",
    description: "Recherche sur l'optimisation des architectures de réseaux de neurones pour les dispositifs IoT avec contraintes de ressources.",
    type: "memoire",
    level: "Master 1",
    department: "Informatique",
    maxStudents: 1,
    currentStudents: 0,
    status: "submitted",
    submittedDate: "2024-11-10",
    academicYear: "2024-2025",
    keywords: ["IoT", "Réseaux de neurones", "Optimisation", "Edge Computing"],
    requirements: "Solides bases en IA et programmation embarquée",
    objectives: "Optimiser les performances des IA sur dispositifs contraints",
    createdDate: "2024-11-05",
    lastModified: "2024-11-10"
  },
  {
    id: 4,
    title: "Stage en Cybersécurité - Audit de Sécurité",
    description: "Stage de 6 mois dans une entreprise spécialisée en cybersécurité pour réaliser des audits de sécurité et tests de pénétration.",
    type: "stage",
    level: "Master 2",
    department: "Informatique",
    maxStudents: 1,
    currentStudents: 1,
    status: "approved",
    submittedDate: "2024-08-20",
    approvedDate: "2024-08-25",
    academicYear: "2024-2025",
    keywords: ["Cybersécurité", "Audit", "Pentesting", "Entreprise"],
    requirements: "Certification en sécurité informatique souhaitée",
    objectives: "Acquérir une expérience professionnelle en cybersécurité",
    createdDate: "2024-08-15",
    lastModified: "2024-08-20"
  },
  {
    id: 5,
    title: "Blockchain pour la Traçabilité Alimentaire",
    description: "Conception d'une solution blockchain pour assurer la traçabilité des produits alimentaires de la production à la consommation.",
    type: "memoire",
    level: "Master 2",
    department: "Informatique",
    maxStudents: 2,
    currentStudents: 0,
    status: "draft",
    submittedDate: "",
    academicYear: "2024-2025",
    keywords: ["Blockchain", "Traçabilité", "Smart Contracts", "Supply Chain"],
    requirements: "Connaissances en blockchain et cryptographie",
    objectives: "Maîtriser la technologie blockchain appliquée à l'industrie",
    createdDate: "2024-11-15",
    lastModified: "2024-11-18"
  },
  {
    id: 6,
    title: "Système de Recommandation E-commerce",
    description: "Développement d'un système de recommandation personnalisé pour une plateforme e-commerce utilisant le filtrage collaboratif.",
    type: "projet",
    level: "Master 1",
    department: "Informatique",
    maxStudents: 2,
    currentStudents: 1,
    status: "rejected",
    submittedDate: "2024-10-15",
    academicYear: "2024-2025",
    keywords: ["Recommandation", "E-commerce", "Filtrage collaboratif", "Big Data"],
    requirements: "Bonnes connaissances en algorithmes et bases de données",
    objectives: "Comprendre les systèmes de recommandation modernes",
    createdDate: "2024-10-10",
    lastModified: "2024-10-15"
  }
];

const SUBJECT_TYPES = [
  { value: 'memoire', label: 'Mémoire', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { value: 'projet', label: 'Projet', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'stage', label: 'Stage', color: 'bg-green-100 text-green-700 border-green-200' }
];

const LEVELS = ["Licence 3", "Master 1", "Master 2"];
const DEPARTMENTS = ["Informatique", "Réseaux", "Management", "Génie Civil"];

// Composants utilitaires
const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'approved' | 'submitted' | 'draft' | 'rejected' | 'info' | 'warning' | 'primary';
  className?: string;
}> = ({ children, variant = 'info', className = '' }) => {
  const styles = {
    approved: "bg-green-50 text-green-700 border border-green-200",
    submitted: "bg-blue-50 text-blue-700 border border-blue-200",
    draft: "bg-gray-50 text-gray-700 border border-gray-200",
    rejected: "bg-red-50 text-red-600 border border-red-200",
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

const SimpleButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
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
    ghost: `bg-transparent text-gray-600 border border-transparent hover:bg-gray-50 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    danger: `bg-red-600 text-white border border-red-600 hover:bg-red-700 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`
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

// Modal pour voir les détails d'un sujet
const SubjectDetailsModal: React.FC<{
  subject: Subject | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ subject, isOpen, onClose }) => {
  if (!isOpen || !subject) return null;

  const getTypeConfig = (type: string) => {
    return SUBJECT_TYPES.find(t => t.value === type) || SUBJECT_TYPES[0];
  };

  const typeConfig = getTypeConfig(subject.type);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border border-gray-200 p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{subject.title}</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={subject.status}>
                {subject.status === 'approved' ? 'Approuvé' : 
                 subject.status === 'submitted' ? 'Soumis' : 
                 subject.status === 'draft' ? 'Brouillon' : 'Rejeté'}
              </Badge>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-sm border ${typeConfig.color}`}>
                {typeConfig.label}
              </span>
              <Badge variant="primary">{subject.level}</Badge>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informations principales */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{subject.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Objectifs</h3>
              <p className="text-gray-700 leading-relaxed">{subject.objectives}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Prérequis</h3>
              <p className="text-gray-700 leading-relaxed">{subject.requirements}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Mots-clés</h3>
              <div className="flex flex-wrap gap-2">
                {subject.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="inline-flex px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Informations latérales */}
          <div className="space-y-6">
            <div className="bg-gray-50 border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Département</label>
                  <p className="text-gray-900">{subject.department}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Année académique</label>
                  <p className="text-gray-900">{subject.academicYear}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Date de création</label>
                  <p className="text-gray-900">{subject.createdDate}</p>
                </div>
                {subject.submittedDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Date de soumission</label>
                    <p className="text-gray-900">{subject.submittedDate}</p>
                  </div>
                )}
                {subject.approvedDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Date d'approbation</label>
                    <p className="text-gray-900">{subject.approvedDate}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Étudiants</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {subject.currentStudents}/{subject.maxStudents}
                </div>
                <p className="text-sm text-blue-700">Places occupées</p>
                <div className="mt-3">
                  <div className="w-full bg-blue-200 h-2 rounded-full">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${(subject.currentStudents / subject.maxStudents) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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

// Formulaire d'ajout/modification de sujet
const AddSubjectTab: React.FC<{
  subjectToEdit?: Subject | null;
  onEditComplete?: () => void;
}> = ({ subjectToEdit, onEditComplete }) => {
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    type: 'memoire' | 'projet' | 'stage';
    level: string;
    department: string;
    maxStudents: number;
    keywords: string;
    requirements: string;
    objectives: string;
    academicYear: string;
  }>({
    title: '',
    description: '',
    type: 'memoire',
    level: '',
    department: '',
    maxStudents: 1,
    keywords: '',
    requirements: '',
    objectives: '',
    academicYear: '2024-2025'
  });

  const isEditing = Boolean(subjectToEdit);

  React.useEffect(() => {
    if (subjectToEdit) {
      setFormData({
        title: subjectToEdit.title,
        description: subjectToEdit.description,
        type: subjectToEdit.type as 'memoire' | 'projet' | 'stage',
        level: subjectToEdit.level,
        department: subjectToEdit.department,
        maxStudents: subjectToEdit.maxStudents,
        keywords: subjectToEdit.keywords.join(', '),
        requirements: subjectToEdit.requirements,
        objectives: subjectToEdit.objectives,
        academicYear: subjectToEdit.academicYear
      });
    } else {
      setFormData({
        title: '',
        description: '',
        type: 'memoire',
        level: '',
        department: '',
        maxStudents: 1,
        keywords: '',
        requirements: '',
        objectives: '',
        academicYear: '2024-2025'
      });
    }
  }, [subjectToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxStudents' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    alert(`Sujet ${isEditing ? 'modifié' : 'créé'} avec succès !`);
    
    if (isEditing && onEditComplete) {
      onEditComplete();
    }
    
    setFormData({
      title: '',
      description: '',
      type: 'memoire',
      level: '',
      department: '',
      maxStudents: 1,
      keywords: '',
      requirements: '',
      objectives: '',
      academicYear: '2024-2025'
    });
  };

  const saveDraft = () => {
    console.log('Draft saved:', formData);
    alert('Brouillon sauvegardé !');
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
              <p className="text-blue-800 font-medium">Mode édition : {subjectToEdit?.title}</p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Colonne gauche */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre du sujet *
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ex: Intelligence Artificielle pour la Détection de Fraudes"
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de sujet *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm"
                  required
                >
                  {SUBJECT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                    <option value="">Sélectionner</option>
                    {LEVELS.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre max d'étudiants
                  </label>
                  <input
                    name="maxStudents"
                    type="number"
                    min="1"
                    max="5"
                    value={formData.maxStudents}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm"
                  />
                </div>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mots-clés (séparés par des virgules)
                </label>
                <input
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleChange}
                  placeholder="Ex: IA, Machine Learning, Sécurité"
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm"
                />
              </div>
            </div>

            {/* Colonne droite */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description détaillée du sujet..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objectifs *
                </label>
                <textarea
                  name="objectives"
                  value={formData.objectives}
                  onChange={handleChange}
                  placeholder="Objectifs pédagogiques et compétences à acquérir..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prérequis *
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  placeholder="Connaissances et compétences requises..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm"
                  required
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
              onClick={saveDraft}
              icon={<Save className="h-4 w-4" />}
            >
              Sauvegarder brouillon
            </SimpleButton>
            <SimpleButton
              type="button"
              variant="primary"
              onClick={handleSubmit}
              icon={<Target className="h-4 w-4" />}
            >
              {isEditing ? 'Modifier le sujet' : 'Soumettre le sujet'}
            </SimpleButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Onglet Statistiques
const StatisticsTab: React.FC<{ subjects: Subject[] }> = ({ subjects }) => {
  const totalSubjects = subjects.length;
  const approvedSubjects = subjects.filter(s => s.status === 'approved').length;
  const submittedSubjects = subjects.filter(s => s.status === 'submitted').length;
  const draftSubjects = subjects.filter(s => s.status === 'draft').length;
  const rejectedSubjects = subjects.filter(s => s.status === 'rejected').length;
  
  const totalStudents = subjects.reduce((sum, s) => sum + s.currentStudents, 0);
  const totalCapacity = subjects.reduce((sum, s) => sum + s.maxStudents, 0);
  const occupancyRate = totalCapacity > 0 ? Math.round((totalStudents / totalCapacity) * 100) : 0;

  const subjectsByType = SUBJECT_TYPES.map(type => ({
    ...type,
    count: subjects.filter(s => s.type === type.value).length
  }));

  const subjectsByLevel = LEVELS.map(level => ({
    level,
    count: subjects.filter(s => s.level === level).length
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Stats principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: "Total Sujets", value: totalSubjects, icon: FileText, color: "bg-blue-100 text-blue-600" },
          { title: "Sujets Approuvés", value: approvedSubjects, icon: Check, color: "bg-green-100 text-green-600" },
          { title: "Étudiants Assignés", value: totalStudents, icon: Users, color: "bg-purple-100 text-purple-600" },
          { title: "Taux d'Occupation", value: `${occupancyRate}%`, icon: TrendingUp, color: "bg-orange-100 text-orange-600" }
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

      {/* Statut des sujets */}
      <div className="bg-white border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Statut des sujets</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 border border-green-200 rounded-sm">
            <div className="text-2xl font-bold text-green-600">{approvedSubjects}</div>
            <div className="text-sm text-green-700">Approuvés</div>
          </div>
          <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-sm">
            <div className="text-2xl font-bold text-blue-600">{submittedSubjects}</div>
            <div className="text-sm text-blue-700">Soumis</div>
          </div>
          <div className="text-center p-4 bg-gray-50 border border-gray-200 rounded-sm">
            <div className="text-2xl font-bold text-gray-600">{draftSubjects}</div>
            <div className="text-sm text-gray-700">Brouillons</div>
          </div>
          <div className="text-center p-4 bg-red-50 border border-red-200 rounded-sm">
            <div className="text-2xl font-bold text-red-600">{rejectedSubjects}</div>
            <div className="text-sm text-red-700">Rejetés</div>
          </div>
        </div>
      </div>

      {/* Répartitions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par type</h3>
          <div className="space-y-3">
            {subjectsByType.map(type => {
              const percentage = totalSubjects > 0 ? Math.round((type.count / totalSubjects) * 100) : 0;
              return (
                <div key={type.value} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-sm border mr-3 ${type.color}`}>
                      {type.label}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 h-2 mr-3 rounded-full">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{type.count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par niveau</h3>
          <div className="space-y-3">
            {subjectsByLevel.map(level => {
              const percentage = totalSubjects > 0 ? Math.round((level.count / totalSubjects) * 100) : 0;
              return (
                <div key={level.level} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{level.level}</span>
                  <div className="flex items-center">
                    <div className="w-24 bg-gray-200 h-2 mr-3 rounded-full">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{level.count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Occupation des places */}
      <div className="bg-white border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Occupation des places</h3>
        <div className="space-y-4">
          {subjects.filter(s => s.status === 'approved').map(subject => {
            const occupancyRate = Math.round((subject.currentStudents / subject.maxStudents) * 100);
            return (
              <div key={subject.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-sm">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{subject.title}</h4>
                  <p className="text-xs text-gray-500">{subject.type} - {subject.level}</p>
                </div>
                <div className="flex items-center ml-4">
                  <div className="w-32 bg-gray-200 h-2 mr-3 rounded-full">
                    <div 
                      className={`h-2 rounded-full ${
                        occupancyRate === 100 ? 'bg-green-500' : 
                        occupancyRate >= 80 ? 'bg-yellow-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${occupancyRate}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-16">
                    {subject.currentStudents}/{subject.maxStudents}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

// Composant principal
const SujetsProfesseur: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'stats'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'submitted' | 'draft' | 'rejected'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // États pour la modal et l'édition
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState<Subject | null>(null);
  
  const [subjectsState, setSubjectsState] = useState(SUBJECTS_DATA);

  const filteredSubjects = subjectsState.filter(subject => {
    const matchesSearch = subject.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         subject.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         subject.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || subject.status === statusFilter;
    const matchesType = typeFilter === 'all' || subject.type === typeFilter;
    const matchesLevel = levelFilter === 'all' || subject.level === levelFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesLevel;
  });

  // Fonctions pour gérer la modal des détails
  const openSubjectDetails = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedSubject(null);
    setIsModalOpen(false);
  };

  // Fonctions pour gérer l'édition
  const startEditSubject = (subject: Subject) => {
    setSubjectToEdit(subject);
    setActiveTab('add');
  };

  const stopEditSubject = () => {
    setSubjectToEdit(null);
    setActiveTab('list');
  };

  // Fonction pour supprimer un sujet
  const deleteSubject = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce sujet ?')) {
      setSubjectsState(prev => prev.filter(s => s.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white border border-gray-200 p-6 mb-6 rounded-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-purple-100 rounded-full p-3 mr-4">
                <FileText className="h-7 w-7 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mes Sujets</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Gérez vos sujets de mémoires, projets et stages
                </p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="primary">Professeur</Badge>
              <p className="text-xs text-gray-500 mt-1">Prof. Martin Dubois</p>
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
                Mes sujets ({subjectsState.length})
              </TabButton>
              <TabButton
                isActive={activeTab === 'add'}
                onClick={() => {
                  setSubjectToEdit(null);
                  setActiveTab('add');
                }}
                icon={<Plus className="h-4 w-4" />}
              >
                {subjectToEdit ? 'Modifier un sujet' : 'Proposer un sujet'}
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
                          placeholder="Rechercher un sujet..."
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
                          className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200"
                        >
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                            <select
                              value={statusFilter}
                              onChange={(e) => setStatusFilter(e.target.value as any)}
                              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm"
                            >
                              <option value="all">Tous</option>
                              <option value="approved">Approuvés</option>
                              <option value="submitted">Soumis</option>
                              <option value="draft">Brouillons</option>
                              <option value="rejected">Rejetés</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                            <select
                              value={typeFilter}
                              onChange={(e) => setTypeFilter(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-sm"
                            >
                              <option value="all">Tous les types</option>
                              {SUBJECT_TYPES.map(type => (
                                <option key={type.value} value={type.value}>{type.label}</option>
                              ))}
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
                              {LEVELS.map(level => (
                                <option key={level} value={level}>{level}</option>
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
                      {filteredSubjects.length} sujet{filteredSubjects.length !== 1 ? 's' : ''} trouvé{filteredSubjects.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  
                  {/* Liste des sujets */}
                  {filteredSubjects.length === 0 ? (
                    <div className="bg-white border border-gray-200 p-12 text-center rounded-sm">
                      <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                      <h2 className="text-xl font-semibold text-gray-700 mb-2">Aucun sujet trouvé</h2>
                      <p className="text-gray-500">Modifiez vos critères de recherche ou créez votre premier sujet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6">
                      {filteredSubjects.map((subject, index) => {
                        const typeConfig = SUBJECT_TYPES.find(t => t.value === subject.type);
                        const occupancyRate = Math.round((subject.currentStudents / subject.maxStudents) * 100);
                        
                        return (
                          <motion.div
                            key={subject.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white border border-gray-200 p-6 rounded-sm hover:shadow-md transition-shadow duration-200"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="text-lg font-semibold text-gray-900">{subject.title}</h3>
                                  <Badge variant={subject.status}>
                                    {subject.status === 'approved' ? 'Approuvé' : 
                                     subject.status === 'submitted' ? 'Soumis' : 
                                     subject.status === 'draft' ? 'Brouillon' : 'Rejeté'}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-sm border ${typeConfig?.color}`}>
                                    {typeConfig?.label}
                                  </span>
                                  <Badge variant="primary">{subject.level}</Badge>
                                  <Badge variant="info">{subject.department}</Badge>
                                </div>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{subject.description}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <div className="flex items-center">
                                    <Users className="h-4 w-4 mr-1" />
                                    <span>{subject.currentStudents}/{subject.maxStudents} étudiants</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    <span>Créé le {subject.createdDate}</span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Jauge d'occupation */}
                              <div className="ml-6 text-center">
                                <div className="w-16 h-16 relative">
                                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                                    <path
                                      className="text-gray-200"
                                      stroke="currentColor"
                                      strokeWidth="3"
                                      fill="none"
                                      d="M18 2.0845
                                        a 15.9155 15.9155 0 0 1 0 31.831
                                        a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                    <path
                                      className={
                                        occupancyRate === 100 ? 'text-green-500' : 
                                        occupancyRate >= 80 ? 'text-yellow-500' : 'text-blue-500'
                                      }
                                      stroke="currentColor"
                                      strokeWidth="3"
                                      strokeLinecap="round"
                                      fill="none"
                                      strokeDasharray={`${occupancyRate}, 100`}
                                      d="M18 2.0845
                                        a 15.9155 15.9155 0 0 1 0 31.831
                                        a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                  </svg>
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xs font-medium">{occupancyRate}%</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Keywords */}
                            <div className="mb-4">
                              <div className="flex flex-wrap gap-1">
                                {subject.keywords.slice(0, 4).map((keyword, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                                  >
                                    {keyword}
                                  </span>
                                ))}
                                {subject.keywords.length > 4 && (
                                  <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                    +{subject.keywords.length - 4}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
                              <SimpleButton
                                variant="ghost"
                                onClick={() => openSubjectDetails(subject)}
                                icon={<Eye className="h-4 w-4" />}
                              >
                                Détails
                              </SimpleButton>
                              <SimpleButton
                                variant="ghost"
                                onClick={() => startEditSubject(subject)}
                                icon={<Edit className="h-4 w-4" />}
                              >
                                Modifier
                              </SimpleButton>
                              <SimpleButton
                                variant="ghost"
                                onClick={() => deleteSubject(subject.id)}
                                icon={<Trash2 className="h-4 w-4" />}
                              >
                                Supprimer
                              </SimpleButton>
                            </div>
                          </motion.div>
                        );
                      })}
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
                  <AddSubjectTab 
                    subjectToEdit={subjectToEdit}
                    onEditComplete={stopEditSubject}
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
                  <StatisticsTab subjects={subjectsState} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Modal des détails */}
        <SubjectDetailsModal 
          subject={selectedSubject}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      </div>
    </div>
  );
};

export default SujetsProfesseur;