import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEdit, FiPlusCircle, FiCheck, FiX, FiEye, FiToggleLeft, FiToggleRight, FiX as FiClose } from 'react-icons/fi';

// Type pour une salle de classe
interface Classroom {
  id: number;
  name: string;
  capacity: number;
  building: string;
  floor: string;
  active: boolean;
  description?: string;
  equipments?: {
    projector: boolean;
    computer: boolean;
    whiteboard: boolean;
    airConditioner: boolean;
  };
}

const ClassroomsList: React.FC = () => {
  const navigate = useNavigate();
  
  // État pour les salles de classe
  const [classrooms, setClassrooms] = useState<Classroom[]>([
    { 
      id: 1, 
      name: 'Salle 101', 
      capacity: 30, 
      building: 'Bâtiment A', 
      floor: '1er étage', 
      active: true,
      description: 'Salle de cours standard avec vue sur le jardin.',
      equipments: {
        projector: true,
        computer: true,
        whiteboard: true,
        airConditioner: false
      }
    },
    { 
      id: 2, 
      name: 'Salle 102', 
      capacity: 25, 
      building: 'Bâtiment A', 
      floor: '1er étage', 
      active: true,
      description: 'Petite salle de cours idéale pour les travaux pratiques.',
      equipments: {
        projector: true,
        computer: false,
        whiteboard: true,
        airConditioner: false
      }
    },
    { 
      id: 3, 
      name: 'Salle 201', 
      capacity: 40, 
      building: 'Bâtiment B', 
      floor: '2ème étage', 
      active: false,
      description: 'Grande salle actuellement en rénovation.',
      equipments: {
        projector: false,
        computer: false,
        whiteboard: true,
        airConditioner: true
      }
    },
    { 
      id: 4, 
      name: 'Amphithéâtre', 
      capacity: 120, 
      building: 'Bâtiment C', 
      floor: 'Rez-de-chaussée', 
      active: true,
      description: 'Grand amphithéâtre pour les conférences et cours magistraux.',
      equipments: {
        projector: true,
        computer: true,
        whiteboard: true,
        airConditioner: true
      }
    },
    { 
      id: 5, 
      name: 'Laboratoire Info', 
      capacity: 20, 
      building: 'Bâtiment A', 
      floor: '3ème étage', 
      active: true,
      description: 'Laboratoire informatique avec 20 postes de travail.',
      equipments: {
        projector: true,
        computer: true,
        whiteboard: true,
        airConditioner: true
      }
    },
  ]);
  
  // État pour le modal de consultation
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
  
  // Fonction pour basculer l'état actif d'une salle
  const toggleActive = (id: number) => {
    setClassrooms(prevClassrooms => 
      prevClassrooms.map(classroom => 
        classroom.id === id 
          ? { ...classroom, active: !classroom.active } 
          : classroom
      )
    );
  };
  
  // Fonction pour ouvrir le modal de consultation
  const openViewModal = (classroom: Classroom) => {
    setSelectedClassroom(classroom);
    setIsViewModalOpen(true);
  };
  
  // Fonction pour fermer le modal
  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedClassroom(null);
  };
  
  // Fonction pour gérer la modification d'une salle
  const editClassroom = (classroom: Classroom) => {
    // Rediriger vers le formulaire d'ajout avec les données de la salle
    navigate(`/classrooms/add`, { state: { classroom } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Salles de classe</h1>
        <Link to="/classrooms/add" className="btn-primary">
          <FiPlusCircle className="mr-2 text-white" /> Ajouter une salle
        </Link>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-secondary">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salle
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacité
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localisation
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {classrooms.map((classroom) => (
                <tr key={classroom.id} className="hover:bg-secondary transition-colors duration-150">
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{classroom.name}</div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="inline-flex items-center justify-center h-6 w-8 rounded-md bg-primary bg-opacity-10 text-white text-sm font-medium mr-2">
                        {classroom.capacity}
                      </span>
                      <span className="text-sm text-gray-600">places</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm text-gray-700 font-medium">{classroom.building}</div>
                    <div className="text-sm text-gray-500">{classroom.floor}</div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    {classroom.active ? (
                      <span className="px-3 py-1 inline-flex items-center text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        <FiCheck className="mr-1" /> Active
                      </span>
                    ) : (
                      <span className="px-3 py-1 inline-flex items-center text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        <FiX className="mr-1" /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right">
                    <div className="flex justify-end space-x-3">
                      <button 
                        onClick={() => openViewModal(classroom)}
                        className="text-gray-600 hover:text-gray-900 bg-secondary hover:bg-accent p-2 rounded-lg transition-colors duration-200"
                        title="Consulter"
                      >
                        <FiEye className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => editClassroom(classroom)}
                        className="text-white hover:text-white bg-primary hover:bg-primary-700 p-2 rounded-lg transition-colors duration-200"
                        title="Modifier"
                      >
                        <FiEdit className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => toggleActive(classroom.id)}
                        className={`p-2 rounded-lg transition-colors duration-200 ${
                          classroom.active 
                            ? 'text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200' 
                            : 'text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200'
                        }`}
                        title={classroom.active ? "Désactiver" : "Activer"}
                      >
                        {classroom.active ? (
                          <FiToggleRight className="h-5 w-5" />
                        ) : (
                          <FiToggleLeft className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {classrooms.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Aucune salle de classe disponible</p>
            <Link to="/classrooms/add" className="text-primary hover:text-primary-700 font-medium mt-2 inline-block">
              Ajouter une nouvelle salle
            </Link>
          </div>
        )}
      </div>

      {/* Modal de consultation */}
      {isViewModalOpen && selectedClassroom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold text-primary">{selectedClassroom.name}</h2>
              <button 
                onClick={closeViewModal}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <FiClose className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-5">
              <div className="flex flex-wrap -mx-2">
                <div className="w-full md:w-1/2 px-2 mb-4">
                  <div className="bg-secondary bg-opacity-30 p-4 rounded-lg h-full">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Informations générales</h3>
                    <div className="space-y-3 mt-3">
                      <div>
                        <span className="text-xs text-gray-500">Capacité</span>
                        <div className="flex items-center mt-1">
                          <span className="inline-flex items-center justify-center h-6 w-10 rounded-md bg-primary text-white text-sm font-medium mr-2">
                            {selectedClassroom.capacity}
                          </span>
                          <span className="text-sm text-gray-600">places</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Statut</span>
                        <div className="mt-1">
                          {selectedClassroom.active ? (
                            <span className="px-3 py-1 inline-flex items-center text-sm font-semibold rounded-full bg-green-100 text-green-800">
                              <FiCheck className="mr-1" /> Active
                            </span>
                          ) : (
                            <span className="px-3 py-1 inline-flex items-center text-sm font-semibold rounded-full bg-red-100 text-red-800">
                              <FiX className="mr-1" /> Inactive
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="w-full md:w-1/2 px-2 mb-4">
                  <div className="bg-secondary bg-opacity-30 p-4 rounded-lg h-full">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Localisation</h3>
                    <div className="space-y-3 mt-3">
                      <div>
                        <span className="text-xs text-gray-500">Bâtiment</span>
                        <p className="text-base font-medium mt-1">{selectedClassroom.building}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Étage</span>
                        <p className="text-base font-medium mt-1">{selectedClassroom.floor}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedClassroom.description && (
                  <div className="w-full px-2 mb-4">
                    <div className="bg-secondary bg-opacity-30 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                      <p className="text-gray-700 mt-2">{selectedClassroom.description}</p>
                    </div>
                  </div>
                )}
                
                {selectedClassroom.equipments && (
                  <div className="w-full px-2">
                    <div className="bg-secondary bg-opacity-30 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-gray-500 mb-3">Équipements</h3>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        <div className={`flex items-center p-3 rounded-md ${selectedClassroom.equipments.projector ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-400'}`}>
                          <span className="mr-2">{selectedClassroom.equipments.projector ? '✓' : '✗'}</span>
                          <span>Projecteur</span>
                        </div>
                        <div className={`flex items-center p-3 rounded-md ${selectedClassroom.equipments.computer ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-400'}`}>
                          <span className="mr-2">{selectedClassroom.equipments.computer ? '✓' : '✗'}</span>
                          <span>Ordinateur</span>
                        </div>
                        <div className={`flex items-center p-3 rounded-md ${selectedClassroom.equipments.whiteboard ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-400'}`}>
                          <span className="mr-2">{selectedClassroom.equipments.whiteboard ? '✓' : '✗'}</span>
                          <span>Tableau blanc</span>
                        </div>
                        <div className={`flex items-center p-3 rounded-md ${selectedClassroom.equipments.airConditioner ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-400'}`}>
                          <span className="mr-2">{selectedClassroom.equipments.airConditioner ? '✓' : '✗'}</span>
                          <span>Climatiseur</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end p-4 border-t bg-secondary bg-opacity-20">
              <button 
                onClick={() => {
                  closeViewModal();
                  editClassroom(selectedClassroom);
                }}
                className="btn-primary mr-3"
              >
                <FiEdit className="mr-2 text-white" /> Modifier
              </button>
              <button 
                onClick={closeViewModal}
                className="btn-outline"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassroomsList;