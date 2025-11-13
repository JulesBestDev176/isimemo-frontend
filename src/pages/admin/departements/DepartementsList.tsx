import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiEdit, 
  FiEye, 
  FiPlusCircle, 
  FiCheck, 
  FiX, 
  FiUsers, 
  FiToggleLeft, 
  FiToggleRight,
  FiSearch,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// Interface pour les départements
interface Department {
  id: number;
  name: string;
  chief: string;
  active: boolean;
  staff: number;
  description?: string;
  createdAt?: string;
  location?: string;
}

const DepartementsList: React.FC = () => {
  // État pour gérer les départements
  const [departements, setDepartements] = useState<Department[]>([
    { 
      id: 1, 
      name: 'Informatique', 
      chief: 'Dr. Ahmed Diop', 
      active: true, 
      staff: 12, 
      description: 'Département responsable de l\'enseignement des technologies de l\'information et de la communication.',
      createdAt: '10/01/2020',
      location: 'Bâtiment A, 2ème étage'
    },
    { 
      id: 2, 
      name: 'Génie Civil', 
      chief: 'Dr. Fatou Sow', 
      active: true, 
      staff: 8,
      description: 'Département axé sur les principes d\'ingénierie pour la conception et la construction d\'infrastructures.',
      createdAt: '15/03/2020',
      location: 'Bâtiment B, 1er étage'
    },
    { 
      id: 3, 
      name: 'Management', 
      chief: 'Dr. Ousmane Fall', 
      active: false, 
      staff: 10,
      description: 'Département qui forme les étudiants à la gestion des entreprises et au leadership.',
      createdAt: '05/09/2020',
      location: 'Bâtiment C, Rez-de-chaussée'
    },
    { 
      id: 4, 
      name: 'Électronique', 
      chief: 'Dr. Marie Faye', 
      active: true, 
      staff: 6,
      description: 'Département focalisé sur l\'étude et la conception des systèmes électroniques.',
      createdAt: '20/02/2021',
      location: 'Bâtiment A, 3ème étage'
    },
    { 
      id: 5, 
      name: 'Mécanique', 
      chief: 'Dr. Ibrahima Ndiaye', 
      active: true, 
      staff: 9,
      description: 'Département axé sur l\'étude des forces et des mouvements dans les systèmes mécaniques.',
      createdAt: '12/11/2021',
      location: 'Bâtiment B, 2ème étage'
    },
  ]);

  // État pour la recherche
  const [searchQuery, setSearchQuery] = useState('');
  // État pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  // État pour le modal de consultation
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  // État pour le modal de confirmation
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [departmentToToggle, setDepartmentToToggle] = useState<Department | null>(null);

  // Filtrer les départements en fonction de la recherche
  const filteredDepartments = departements.filter(dept => 
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    dept.chief.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDepartments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);

  // Fonctions de pagination
  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Fonction pour ouvrir le modal de consultation
  const handleView = (dept: Department) => {
    setSelectedDepartment(dept);
    setViewModalOpen(true);
  };

  // Fonction pour ouvrir le modal de confirmation d'activation/désactivation
  const handleToggleConfirm = (dept: Department) => {
    setDepartmentToToggle(dept);
    setConfirmModalOpen(true);
  };

  // Fonction pour basculer l'état actif/inactif
  const toggleActive = () => {
    if (departmentToToggle) {
      setDepartements(prevDepts => 
        prevDepts.map(dept => 
          dept.id === departmentToToggle.id 
            ? { ...dept, active: !dept.active } 
            : dept
        )
      );
      setConfirmModalOpen(false);
      setDepartmentToToggle(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Départements</h1>
        
        <div className="flex space-x-4 items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un département..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary w-64"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <Link to="/departements/add" className="btn-primary">
            <FiPlusCircle className="mr-2" /> Ajouter
          </Link>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chef de département
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Personnel
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    Aucun département trouvé
                  </td>
                </tr>
              ) : (
                currentItems.map((dept) => (
                  <tr key={dept.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{dept.name}</div>
                      {dept.location && (
                        <div className="text-xs text-gray-500 mt-1">{dept.location}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">{dept.chief}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-700">
                        <FiUsers className="mr-1 text-gray-400" />
                        <span>{dept.staff} membres</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {dept.active ? (
                        <span className="px-2 py-1 inline-flex items-center text-xs font-medium rounded-full bg-green-100 text-green-800">
                          <FiCheck className="mr-1" /> Actif
                        </span>
                      ) : (
                        <span className="px-2 py-1 inline-flex items-center text-xs font-medium rounded-full bg-red-100 text-red-800">
                          <FiX className="mr-1" /> Inactif
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center space-x-3">
                        <button 
                          onClick={() => handleView(dept)}
                          className="text-white bg-primary p-1.5 rounded-full transition-colors duration-200 hover:bg-primary-700"
                          title="Consulter"
                        >
                          <FiEye className="h-5 w-5" />
                        </button>
                        <Link 
                          to={`/departements/edit/${dept.id}`} 
                          className="text-blue-600 hover:text-blue-800 bg-blue-100 p-1.5 rounded-full transition-colors duration-200"
                          title="Modifier"
                        >
                          <FiEdit className="h-5 w-5" />
                        </Link>
                        <button 
                          onClick={() => handleToggleConfirm(dept)}
                          className={`p-1.5 rounded-full transition-colors duration-200 ${
                            dept.active 
                              ? 'text-red-600 hover:text-red-800 bg-red-100' 
                              : 'text-green-600 hover:text-green-800 bg-green-100'
                          }`}
                          title={dept.active ? 'Désactiver' : 'Activer'}
                        >
                          {dept.active ? (
                            <FiToggleRight className="h-5 w-5" />
                          ) : (
                            <FiToggleLeft className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredDepartments.length)} sur {filteredDepartments.length} départements
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${
                  currentPage === 1 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FiChevronLeft className="h-5 w-5" />
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToPage(index + 1)}
                  className={`w-8 h-8 rounded-md ${
                    currentPage === index + 1 
                      ? 'bg-primary text-white' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md ${
                  currentPage === totalPages 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FiChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Modal de consultation */}
      <AnimatePresence>
        {viewModalOpen && selectedDepartment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4"
            >
              <div className="border-b p-4 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-navy">Détails du département</h3>
                <button 
                  onClick={() => setViewModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-4">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary bg-opacity-10 text-primary">
                      <span className="text-2xl font-bold">{selectedDepartment.name.charAt(0)}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-xl font-bold text-gray-900">{selectedDepartment.name}</h2>
                    <div className="mt-1 flex items-center">
                      <div className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-full ${
                        selectedDepartment.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedDepartment.active ? 'Actif' : 'Inactif'}
                      </div>
                      {selectedDepartment.location && (
                        <span className="ml-2 text-sm text-gray-500">{selectedDepartment.location}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-gray-500">Chef de département</div>
                    <div className="text-base font-semibold">{selectedDepartment.chief}</div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-gray-500">Personnel</div>
                    <div className="text-base font-semibold">{selectedDepartment.staff} membres</div>
                  </div>
                  
                  {selectedDepartment.createdAt && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm font-medium text-gray-500">Date de création</div>
                      <div className="text-base">{selectedDepartment.createdAt}</div>
                    </div>
                  )}
                </div>
                
                {selectedDepartment.description && (
                  <div className="bg-gray-50 p-3 rounded-lg mt-4">
                    <div className="text-sm font-medium text-gray-500">Description</div>
                    <div className="text-base">{selectedDepartment.description}</div>
                  </div>
                )}
              </div>
              
              <div className="border-t p-4 flex justify-end space-x-3">
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Fermer
                </button>
                <Link
                  to={`/departements/edit/${selectedDepartment.id}`}
                  className="btn-primary"
                  onClick={() => setViewModalOpen(false)}
                >
                  <FiEdit className="mr-2" /> Modifier
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de confirmation pour activation/désactivation */}
      <AnimatePresence>
        {confirmModalOpen && departmentToToggle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-lg w-full max-w-md"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Confirmation
                </h3>
                <p className="text-gray-700 mb-6">
                  {departmentToToggle.active 
                    ? `Êtes-vous sûr de vouloir désactiver le département "${departmentToToggle.name}" ?` 
                    : `Êtes-vous sûr de vouloir activer le département "${departmentToToggle.name}" ?`
                  }
                </p>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setConfirmModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={toggleActive}
                    className={`px-4 py-2 rounded-md text-white ${
                      departmentToToggle.active 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {departmentToToggle.active ? 'Désactiver' : 'Activer'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DepartementsList;