import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiEdit, 
  FiEye, 
  FiPlusCircle, 
  FiCheck, 
  FiX, 
  FiMessageSquare, 
  FiSearch, 
  FiChevronLeft, 
  FiChevronRight,
  FiToggleLeft,
  FiToggleRight,
  FiFilter,
  FiMail,
  FiPhone
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface StaffMember {
  id: number;
  name: string;
  departement: string;
  email: string;
  phone: string;
  active: boolean;
  photo?: string;
  role: string;
  title?: string;
  joinDate?: string;
  specialization?: string;
}

interface StaffListProps {
  role: 'chief' | 'secretary';
}

const StaffList: React.FC<StaffListProps> = ({ role }) => {
  // Données fictives pour l'affichage avec photos
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    { 
      id: 1, 
      name: 'Dr. Ahmed Diop', 
      departement: 'Informatique', 
      email: 'ahmed.diop@isi.edu', 
      phone: '77 123 45 67', 
      active: true,
      photo: 'https://randomuser.me/api/portraits/men/1.jpg',
      role: 'chief',
      title: 'Docteur en Informatique',
      joinDate: '10/03/2020',
      specialization: 'Intelligence Artificielle'
    },
    { 
      id: 2, 
      name: 'Dr. Fatou Sow', 
      departement: 'Génie Civil', 
      email: 'fatou.sow@isi.edu', 
      phone: '77 234 56 78', 
      active: true,
      photo: 'https://randomuser.me/api/portraits/women/1.jpg',
      role: 'chief',
      title: 'Docteur en Génie Civil',
      joinDate: '15/05/2020',
      specialization: 'Matériaux de construction'
    },
    { 
      id: 3, 
      name: 'Dr. Ousmane Fall', 
      departement: 'Management', 
      email: 'ousmane.fall@isi.edu', 
      phone: '77 345 67 89', 
      active: false,
      photo: 'https://randomuser.me/api/portraits/men/2.jpg',
      role: 'chief',
      title: 'Docteur en Management',
      joinDate: '20/09/2020',
      specialization: 'Gestion des ressources humaines'
    },
    { 
      id: 4, 
      name: 'Dr. Marie Faye', 
      departement: 'Électronique', 
      email: 'marie.faye@isi.edu', 
      phone: '77 456 78 90', 
      active: true,
      photo: 'https://randomuser.me/api/portraits/women/2.jpg',
      role: 'chief',
      title: 'Docteur en Électronique',
      joinDate: '05/02/2021',
      specialization: 'Systèmes embarqués'
    },
    { 
      id: 5, 
      name: 'Dr. Ibrahima Ndiaye', 
      departement: 'Mécanique', 
      email: 'ibrahima.ndiaye@isi.edu', 
      phone: '77 567 89 01', 
      active: true,
      photo: 'https://randomuser.me/api/portraits/men/3.jpg',
      role: 'chief',
      title: 'Docteur en Mécanique',
      joinDate: '15/11/2021',
      specialization: 'Mécanique des fluides'
    },
    { 
      id: 6, 
      name: 'Aminata Diallo', 
      departement: 'Informatique', 
      email: 'aminata.diallo@isi.edu', 
      phone: '77 678 90 12', 
      active: true,
      photo: 'https://randomuser.me/api/portraits/women/3.jpg',
      role: 'secretary',
      title: 'Licence en Secrétariat',
      joinDate: '10/01/2020',
      specialization: 'Gestion administrative'
    },
    { 
      id: 7, 
      name: 'Mamadou Sarr', 
      departement: 'Génie Civil', 
      email: 'mamadou.sarr@isi.edu', 
      phone: '77 789 01 23', 
      active: true,
      photo: 'https://randomuser.me/api/portraits/men/4.jpg',
      role: 'secretary',
      title: 'BTS en Assistanat de Direction',
      joinDate: '20/02/2020',
      specialization: 'Coordination des projets'
    },
    { 
      id: 8, 
      name: 'Aïssatou Ba', 
      departement: 'Management', 
      email: 'aissatou.ba@isi.edu', 
      phone: '77 890 12 34', 
      active: false,
      photo: 'https://randomuser.me/api/portraits/women/4.jpg',
      role: 'secretary',
      title: 'Licence en Administration',
      joinDate: '15/03/2020',
      specialization: 'Communication interne'
    },
  ]);

  const title = role === 'chief' ? 'Chefs de département' : 'Secrétaires';
  
  // Filtrage par rôle
  const filteredStaff = staffMembers.filter(staff => staff.role === role);
  
  // États pour le modal de détails, la pagination et la recherche
  const [viewModal, setViewModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [staffToToggle, setStaffToToggle] = useState<StaffMember | null>(null);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [message, setMessage] = useState('');
  
  // Pagination
  const itemsPerPage = 4;
  
  // Filtrages multiples
  const filterStaff = () => {
    return filteredStaff.filter(staff => {
      // Filtre par recherche
      const matchesSearch = 
        staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.departement.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filtre par département
      const matchesDepartment = departmentFilter === 'all' || staff.departement === departmentFilter;
      
      // Filtre par statut
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && staff.active) || 
        (statusFilter === 'inactive' && !staff.active);
      
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  };
  
  const filteredResults = filterStaff();
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredResults.slice(indexOfFirstItem, indexOfLastItem);
  
  // Obtenir la liste unique des départements pour le filtre
  const departments = Array.from(new Set(filteredStaff.map(staff => staff.departement)));
  
  // Fonctions
  const handleView = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setViewModal(true);
  };
  
  const handleMessageOpen = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setMessageModalOpen(true);
  };
  
  const handleToggleConfirm = (staff: StaffMember) => {
    setStaffToToggle(staff);
    setConfirmModalOpen(true);
  };
  
  const toggleActive = () => {
    if (staffToToggle) {
      setStaffMembers(prevStaff => 
        prevStaff.map(staff => 
          staff.id === staffToToggle.id 
            ? { ...staff, active: !staff.active } 
            : staff
        )
      );
      setConfirmModalOpen(false);
      setStaffToToggle(null);
    }
  };
  
  const sendMessage = () => {
    if (message.trim() && selectedStaff) {
      // Simuler l'envoi du message
      console.log(`Message envoyé à ${selectedStaff.name}: ${message}`);
      
      // Réinitialiser et fermer
      setMessage('');
      setMessageModalOpen(false);
      setSelectedStaff(null);
      
      // Afficher une notification de succès (ici simulée par une alerte)
      alert(`Message envoyé à ${selectedStaff.name} avec succès !`);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        
        <Link to="/staff/add" className="btn-primary">
          <FiPlusCircle className="mr-2" /> Ajouter {role === 'chief' ? 'un chef' : 'une secrétaire'}
        </Link>
      </div>
      
      {/* Filtres et recherche */}
      <div className="bg-white border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <div>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full pl-4 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            >
              <option value="all">Tous les départements</option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-4 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="inactive">Bloqués</option>
            </select>
          </div>
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
                  Département
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
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
                    Aucun membre du personnel trouvé.
                  </td>
                </tr>
              ) : (
                currentItems.map((staff) => (
                  <tr key={staff.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img 
                            className="h-10 w-10 rounded-full object-cover"
                            src={staff.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(staff.name)}&background=random`}
                            alt={staff.name}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(staff.name)}&background=random`;
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{staff.name}</div>
                          <div className="text-xs text-gray-500">{staff.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{staff.departement}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-700 mb-1">
                        <FiMail className="mr-1 text-gray-400" />
                        <span>{staff.email}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FiPhone className="mr-1 text-gray-400" />
                        <span>{staff.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {staff.active ? (
                        <span className="px-2 py-1 inline-flex items-center text-xs font-medium rounded-full bg-green-100 text-green-800">
                          <FiCheck className="mr-1" /> Actif
                        </span>
                      ) : (
                        <span className="px-2 py-1 inline-flex items-center text-xs font-medium rounded-full bg-red-100 text-red-800">
                          <FiX className="mr-1" /> Bloqué
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center space-x-2">
                        <button 
                          onClick={() => handleMessageOpen(staff)}
                          className="text-blue-600 hover:text-blue-800 bg-blue-100 p-1.5 rounded-full transition-colors duration-200"
                          title="Envoyer un message"
                        >
                          <FiMessageSquare className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleView(staff)}
                          className="text-white bg-primary p-1.5 rounded-full transition-colors duration-200 hover:bg-primary-700"
                          title="Consulter"
                        >
                          <FiEye className="h-5 w-5" />
                        </button>
                        <Link 
                          to={`/staff/edit/${staff.id}`}
                          className="text-indigo-600 hover:text-indigo-800 bg-indigo-100 p-1.5 rounded-full transition-colors duration-200"
                          title="Modifier"
                        >
                          <FiEdit className="h-5 w-5" />
                        </Link>
                        <button 
                          onClick={() => handleToggleConfirm(staff)}
                          className={`p-1.5 rounded-full transition-colors duration-200 ${
                            staff.active 
                              ? 'text-red-600 hover:text-red-800 bg-red-100' 
                              : 'text-green-600 hover:text-green-800 bg-green-100'
                          }`}
                          title={staff.active ? 'Bloquer' : 'Débloquer'}
                        >
                          {staff.active ? (
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
              Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredResults.length)} sur {filteredResults.length} {role === 'chief' ? 'chefs' : 'secrétaires'}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                  onClick={() => setCurrentPage(index + 1)}
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
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
        {viewModal && selectedStaff && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4"
            >
              <div className="border-b p-4 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-navy">Détails du personnel</h3>
                <button 
                  onClick={() => setViewModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-4">
                <div className="flex flex-col md:flex-row md:items-start md:space-x-6 mb-6">
                  <div className="flex-shrink-0 w-full md:w-1/3 flex justify-center mb-4 md:mb-0">
                    <img 
                      src={selectedStaff.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedStaff.name)}&size=200&background=random`}
                      alt={selectedStaff.name}
                      className="h-40 w-40 rounded-full object-cover shadow-md"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedStaff.name)}&size=200&background=random`;
                      }}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900">{selectedStaff.name}</h2>
                    <p className="text-gray-500 mt-1">{selectedStaff.title}</p>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase">Département</h4>
                        <p className="text-gray-800">{selectedStaff.departement}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase">Statut</h4>
                        <div className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-full ${
                          selectedStaff.active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {selectedStaff.active ? 'Actif' : 'Bloqué'}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase">Email</h4>
                        <p className="text-gray-800">{selectedStaff.email}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase">Téléphone</h4>
                        <p className="text-gray-800">{selectedStaff.phone}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase">Date d'entrée</h4>
                        <p className="text-gray-800">{selectedStaff.joinDate}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase">Spécialisation</h4>
                        <p className="text-gray-800">{selectedStaff.specialization}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t p-4 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setViewModal(false);
                    handleMessageOpen(selectedStaff);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <FiMessageSquare className="mr-2" /> Envoyer un message
                </button>
                <button
                  onClick={() => setViewModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Modal de confirmation pour blocage/déblocage */}
      <AnimatePresence>
        {confirmModalOpen && staffToToggle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Confirmation
                </h3>
                
                <div className="flex items-center mb-6">
                  <img 
                    src={staffToToggle.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(staffToToggle.name)}&background=random`}
                    alt={staffToToggle.name}
                    className="h-12 w-12 rounded-full object-cover mr-4"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(staffToToggle.name)}&background=random`;
                    }}
                  />
                  <div>
                    <p className="font-medium">{staffToToggle.name}</p>
                    <p className="text-sm text-gray-500">{staffToToggle.departement}</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6">
                  {staffToToggle.active 
                    ? `Êtes-vous sûr de vouloir bloquer ce membre du personnel ? Il ne pourra plus accéder au système.` 
                    : `Êtes-vous sûr de vouloir débloquer ce membre du personnel ? Cela lui redonnera accès au système.`
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
                    className={`px-4 py-2 rounded-md text-white flex items-center ${
                      staffToToggle.active 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {staffToToggle.active 
                      ? <><FiX className="mr-2" /> Bloquer</> 
                      : <><FiCheck className="mr-2" /> Débloquer</>
                    }
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Modal d'envoi de message */}
      <AnimatePresence>
        {messageModalOpen && selectedStaff && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4"
            >
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-navy">Envoyer un message</h3>
                <button 
                  onClick={() => setMessageModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-4">
                <div className="flex items-center mb-4">
                  <img 
                    src={selectedStaff.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedStaff.name)}&background=random`}
                    alt={selectedStaff.name}
                    className="h-10 w-10 rounded-full object-cover mr-3"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedStaff.name)}&background=random`;
                    }}
                  />
                  <div>
                    <p className="font-medium">{selectedStaff.name}</p>
                    <p className="text-xs text-gray-500">{selectedStaff.email}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Écrivez votre message ici..."
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  ></textarea>
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-100 flex justify-end space-x-3">
                <button
                  onClick={() => setMessageModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className={`px-4 py-2 rounded-md text-white flex items-center ${
                    message.trim() 
                      ? 'bg-primary hover:bg-primary-700' 
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  <FiMessageSquare className="mr-2" /> Envoyer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StaffList;