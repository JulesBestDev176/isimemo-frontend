import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserIcon,
  FileText,
  Upload,
  Download,
  Eye,
  Edit,
  X,
  FileCheck,
  FileX,
  FileClock,
  AlertCircle,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { mockDocumentsAdministratifs } from '../../data/mock/dashboard';
import { Document, StatutDocument, TypeDocument } from '../../types/dossier';

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

// Formatage des dates
const formatDateTime = (date: Date) => {
  return date.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getDocumentStatutBadge = (statut: StatutDocument): 'success' | 'warning' | 'info' | 'error' => {
  switch (statut) {
    case StatutDocument.VALIDE:
      return 'success';
    case StatutDocument.EN_ATTENTE_VALIDATION:
      return 'warning';
    case StatutDocument.REJETE:
      return 'error';
    case StatutDocument.DEPOSE:
      return 'info';
    default:
      return 'info';
  }
};

const getDocumentStatutLabel = (statut: StatutDocument) => {
  const statuts: Record<StatutDocument, string> = {
    [StatutDocument.BROUILLON]: 'Brouillon',
    [StatutDocument.DEPOSE]: 'Déposé',
    [StatutDocument.EN_ATTENTE_VALIDATION]: 'En attente',
    [StatutDocument.VALIDE]: 'Validé',
    [StatutDocument.REJETE]: 'Rejeté',
    [StatutDocument.ARCHIVE]: 'Archivé'
  };
  return statuts[statut] || statut;
};

// Composant principal
const Profil: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('informations');

  // Données du profil (à remplacer par des appels API)
  const [profileData, setProfileData] = useState({
    nom: user?.name.split(' ')[1] || 'Dupont',
    prenom: user?.name.split(' ')[0] || 'Jean',
    email: user?.email || 'jean.dupont@example.com',
    telephone: '+221 77 123 45 67',
    adresse: 'Dakar, Sénégal',
    dateNaissance: '1998-05-15',
    numeroMatricule: 'ETU2024001',
    niveau: 'Master 2',
    filiere: 'Informatique'
  });

  // Documents administratifs
  const documentsAdministratifs = useMemo(() => {
    return mockDocumentsAdministratifs;
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // TODO: Appel API pour sauvegarder
    setIsEditing(false);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="bg-white border border-gray-200 p-6 mb-6 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-start">
              <div className="bg-primary-100 rounded-full p-4 mr-4">
                <UserIcon className="h-8 w-8 text-primary-700" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {profileData.prenom} {profileData.nom}
                </h1>
                <p className="text-sm text-gray-600 mb-3">{profileData.email}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="info">{profileData.niveau}</Badge>
                  <Badge variant="primary">{profileData.filiere}</Badge>
                  <span className="text-xs text-gray-500">Matricule: {profileData.numeroMatricule}</span>
                </div>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier le profil
              </button>
            )}
          </div>
        </div>

        {/* Onglets */}
        <div className="bg-white border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              <TabButton
                isActive={activeTab === 'informations'}
                onClick={() => setActiveTab('informations')}
                icon={<UserIcon className="h-4 w-4" />}
              >
                Informations personnelles
              </TabButton>
              <TabButton
                isActive={activeTab === 'documents'}
                onClick={() => setActiveTab('documents')}
                icon={<FileText className="h-4 w-4" />}
                count={documentsAdministratifs.length}
              >
                Documents administratifs
              </TabButton>
            </div>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {/* Onglet Informations */}
              {activeTab === 'informations' && (
                <motion.div
                  key="informations"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Prénom
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="prenom"
                              value={profileData.prenom}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                          ) : (
                            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{profileData.prenom}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="nom"
                              value={profileData.nom}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                          ) : (
                            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{profileData.nom}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Mail className="h-4 w-4 inline mr-1" />
                            Email
                          </label>
                          {isEditing ? (
                            <input
                              type="email"
                              name="email"
                              value={profileData.email}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                          ) : (
                            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{profileData.email}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Phone className="h-4 w-4 inline mr-1" />
                            Téléphone
                          </label>
                          {isEditing ? (
                            <input
                              type="tel"
                              name="telephone"
                              value={profileData.telephone}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                          ) : (
                            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{profileData.telephone}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="h-4 w-4 inline mr-1" />
                            Date de naissance
                          </label>
                          {isEditing ? (
                            <input
                              type="date"
                              name="dateNaissance"
                              value={profileData.dateNaissance}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                          ) : (
                            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                              {new Date(profileData.dateNaissance).toLocaleDateString('fr-FR')}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <MapPin className="h-4 w-4 inline mr-1" />
                            Adresse
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="adresse"
                              value={profileData.adresse}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                          ) : (
                            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{profileData.adresse}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Niveau
                          </label>
                          {isEditing ? (
                            <select
                              name="niveau"
                              value={profileData.niveau}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                              <option value="Licence 1">Licence 1</option>
                              <option value="Licence 2">Licence 2</option>
                              <option value="Licence 3">Licence 3</option>
                              <option value="Master 1">Master 1</option>
                              <option value="Master 2">Master 2</option>
                            </select>
                          ) : (
                            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{profileData.niveau}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Filière
                          </label>
                          {isEditing ? (
                            <select
                              name="filiere"
                              value={profileData.filiere}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                              <option value="Informatique">Informatique</option>
                              <option value="Mathématiques">Mathématiques</option>
                              <option value="Physique">Physique</option>
                              <option value="Chimie">Chimie</option>
                            </select>
                          ) : (
                            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">{profileData.filiere}</p>
                          )}
                        </div>
                      </div>
                      {isEditing && (
                        <div className="flex justify-end gap-3 mt-6">
                          <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                          >
                            Annuler
                          </button>
                          <button
                            onClick={handleSave}
                            className="btn-primary flex items-center"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Enregistrer
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Onglet Documents administratifs */}
              {activeTab === 'documents' && (
                <motion.div
                  key="documents"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">Documents administratifs</h3>
                        <button className="btn-primary flex items-center text-sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Déposer un document
                        </button>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <div className="flex items-start">
                          <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-blue-800">
                            Les documents administratifs sont généraux à tous vos dossiers et peuvent être déposés ou modifiés à tout moment.
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {documentsAdministratifs.length > 0 ? (
                          documentsAdministratifs.map((doc) => (
                            <div
                              key={doc.idDocument}
                              className="bg-gray-50 border border-gray-200 p-4 rounded-lg hover:border-primary transition-colors"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start flex-1">
                                  <div className="bg-primary-100 p-2 rounded-lg mr-4">
                                    {doc.statut === StatutDocument.VALIDE ? (
                                      <FileCheck className="h-5 w-5 text-green-600" />
                                    ) : doc.statut === StatutDocument.REJETE ? (
                                      <FileX className="h-5 w-5 text-red-600" />
                                    ) : (
                                      <FileClock className="h-5 w-5 text-orange-600" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <p className="font-medium text-gray-900">{doc.titre}</p>
                                      <Badge variant={getDocumentStatutBadge(doc.statut)}>
                                        {getDocumentStatutLabel(doc.statut)}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-2">
                                      Déposé le {formatDateTime(doc.dateCreation)}
                                    </p>
                                    {doc.commentaire && (
                                      <p className="text-sm text-gray-600 italic">"{doc.commentaire}"</p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                                    <Download className="h-4 w-4" />
                                  </button>
                                  <button className="p-2 text-primary hover:text-primary-700 rounded-lg hover:bg-primary-50">
                                    <Edit className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg text-center">
                            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600 mb-4">Aucun document administratif déposé</p>
                            <button className="btn-primary inline-flex items-center">
                              <Upload className="h-4 w-4 mr-2" />
                              Déposer votre premier document
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;


