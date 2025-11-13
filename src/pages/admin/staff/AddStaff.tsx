import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiSave, 
  FiArrowLeft, 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiUpload,
  FiAlertCircle,
  FiCheck
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const AddStaff: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    departement: '',
    role: 'chief', // 'chief' ou 'secretary'
    password: '',
    confirmPassword: '',
    title: '',
    specialization: '',
    photo: null as File | null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  // Les départements
  const departments = [
    { id: '1', name: 'Informatique' },
    { id: '2', name: 'Génie Civil' },
    { id: '3', name: 'Management' },
    { id: '4', name: 'Électronique' },
    { id: '5', name: 'Mécanique' },
  ];

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Validation du prénom et nom
    if (!formData.firstname.trim()) {
      newErrors.firstname = "Le prénom est obligatoire";
    }
    
    if (!formData.lastname.trim()) {
      newErrors.lastname = "Le nom est obligatoire";
    }
    
    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "L'email est obligatoire";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Veuillez entrer un email valide";
    }
    
    // Validation téléphone
    const phoneRegex = /^[0-9]{2}[\s][0-9]{3}[\s][0-9]{2}[\s][0-9]{2}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Le téléphone est obligatoire";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Le format doit être: 77 123 45 67";
    }
    
    // Validation département
    if (!formData.departement) {
      newErrors.departement = "Veuillez sélectionner un département";
    }
    
    // Validation du mot de passe
    if (!formData.password) {
      newErrors.password = "Le mot de passe est obligatoire";
    } else if (formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
    }
    
    // Validation de la confirmation du mot de passe
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur pour ce champ si elle existe
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        photo: file
      }));
      
      // Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Logique pour soumettre le formulaire
      console.log('Formulaire soumis:', formData);
      setFormSubmitted(true);
      
      // Simuler un délai avant la redirection
      setTimeout(() => {
        navigate(formData.role === 'chief' ? '/staff/chiefs' : '/staff/secretaries');
      }, 2000);
    }
  };
  
  const formatPhoneNumber = (value: string) => {
    // Supprimer tous les caractères non numériques
    const numbers = value.replace(/\D/g, '');
    
    // Format: XX XXX XX XX
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 5) return `${numbers.slice(0, 2)} ${numbers.slice(2)}`;
    if (numbers.length <= 7) return `${numbers.slice(0, 2)} ${numbers.slice(2, 5)} ${numbers.slice(5)}`;
    return `${numbers.slice(0, 2)} ${numbers.slice(2, 5)} ${numbers.slice(5, 7)} ${numbers.slice(7, 9)}`;
  };
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    setFormData(prev => ({
      ...prev,
      phone: formattedValue
    }));
    
    // Effacer l'erreur pour ce champ si elle existe
    if (errors.phone) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.phone;
        return newErrors;
      });
    }
  };

  const getReturnLink = () => {
    return formData.role === 'chief' ? '/staff/chiefs' : '/staff/secretaries';
  };
  
  const getReturnText = () => {
    return formData.role === 'chief' ? 'Retour aux chefs' : 'Retour aux secrétaires';
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">
          Ajouter {formData.role === 'chief' ? 'un chef de département' : 'une secrétaire'}
        </h1>
        <Link to={getReturnLink()} className="btn-outline">
          <FiArrowLeft className="mr-2" /> {getReturnText()}
        </Link>
      </div>

      {formSubmitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-8 text-center"
        >
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
            <FiCheck className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {formData.role === 'chief' ? 'Chef de département' : 'Secrétaire'} ajouté(e) avec succès!
          </h2>
          <p className="text-gray-600 mb-6">
            Un email a été envoyé à {formData.email} avec les instructions de connexion.
          </p>
          <div className="flex space-x-4 justify-center">
            <Link to={getReturnLink()} className="btn-outline">
              <FiArrowLeft className="mr-2" /> {getReturnText()}
            </Link>
            <Link to="/staff/add" className="btn-primary" onClick={() => {
              setFormData({
                firstname: '',
                lastname: '',
                email: '',
                phone: '',
                departement: '',
                role: 'chief',
                password: '',
                confirmPassword: '',
                title: '',
                specialization: '',
                photo: null
              });
              setPhotoPreview(null);
              setFormSubmitted(false);
              setErrors({});
            }}>
              <FiUser className="mr-2" /> Ajouter un autre
            </Link>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card p-6"
        >
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              {/* Photo de profil */}
              <div className="w-full md:w-1/3 flex flex-col items-center">
                <div className="mb-4 text-center">
                  <div 
                    className="h-32 w-32 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-primary transition-colors duration-200"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {photoPreview ? (
                      <img 
                        src={photoPreview} 
                        alt="Aperçu" 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FiUser className="h-16 w-16 text-gray-400" />
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                  <button
                    type="button"
                    className="mt-2 text-primary hover:text-primary-700 flex items-center mx-auto text-sm font-medium"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FiUpload className="mr-1" /> {photoPreview ? 'Changer' : 'Ajouter'} la photo
                  </button>
                  <p className="text-xs text-gray-500 mt-1">
                    Formats acceptés: JPG, PNG. Max 2MB
                  </p>
                </div>
                
                <div className="w-full">
                  <div className="mb-4">
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                      Type de compte*
                    </label>
                    <div className="flex border border-gray-300 rounded-md overflow-hidden">
                      <button
                        type="button"
                        className={`flex-1 py-2 px-4 text-center ${
                          formData.role === 'chief' 
                            ? 'bg-primary text-white' 
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, role: 'chief' }))}
                      >
                        Chef
                      </button>
                      <button
                        type="button"
                        className={`flex-1 py-2 px-4 text-center ${
                          formData.role === 'secretary' 
                            ? 'bg-primary text-white' 
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, role: 'secretary' }))}
                      >
                        Secrétaire
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="departement" className="block text-sm font-medium text-gray-700 mb-1">
                      Département*
                    </label>
                    <div className={errors.departement ? "relative" : ""}>
                      <select
                        id="departement"
                        name="departement"
                        required
                        value={formData.departement}
                        onChange={handleChange}
                        className={`w-full rounded-md border ${
                          errors.departement 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-300'
                        } px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                      >
                        <option value="">Sélectionner un département</option>
                        {departments.map(dept => (
                          <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                      </select>
                      {errors.departement && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <FiAlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                      )}
                    </div>
                    {errors.departement && (
                      <p className="mt-1 text-xs text-red-600">{errors.departement}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Informations personnelles */}
              <div className="w-full md:w-2/3">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Informations personnelles</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom*
                    </label>
                    <div className={errors.firstname ? "relative" : ""}>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="firstname"
                        name="firstname"
                        required
                        value={formData.firstname}
                        onChange={handleChange}
                        className={`w-full rounded-md border ${
                          errors.firstname 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-300'
                        } pl-10 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                        placeholder="John"
                      />
                      {errors.firstname && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <FiAlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                      )}
                    </div>
                    {errors.firstname && (
                      <p className="mt-1 text-xs text-red-600">{errors.firstname}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-1">
                      Nom*
                    </label>
                    <div className={errors.lastname ? "relative" : ""}>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="lastname"
                        name="lastname"
                        required
                        value={formData.lastname}
                        onChange={handleChange}
                        className={`w-full rounded-md border ${
                          errors.lastname 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-300'
                        } pl-10 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                        placeholder="Doe"
                      />
                      {errors.lastname && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <FiAlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                      )}
                    </div>
                    {errors.lastname && (
                      <p className="mt-1 text-xs text-red-600">{errors.lastname}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email*
                    </label>
                    <div className={errors.email ? "relative" : ""}>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full rounded-md border ${
                          errors.email 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-300'
                        } pl-10 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                        placeholder="john.doe@isi.edu"
                      />
                      {errors.email && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <FiAlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                      )}
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone*
                    </label>
                    <div className={errors.phone ? "relative" : ""}>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiPhone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        className={`w-full rounded-md border ${
                          errors.phone 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-300'
                        } pl-10 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                        placeholder="77 123 45 67"
                      />
                      {errors.phone && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <FiAlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                      )}
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                    )}
                    {!errors.phone && (
                      <p className="mt-1 text-xs text-gray-500">Format: 77 123 45 67</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Titre
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      placeholder={formData.role === 'chief' ? "Docteur en Informatique" : "Licence en Secrétariat"}
                    />
                    <p className="mt-1 text-xs text-gray-500">Par exemple: Docteur, Professeur, Licence, etc.</p>
                  </div>
                  
                  <div>
                    <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                      Spécialisation
                    </label>
                    <input
                      type="text"
                      id="specialization"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      placeholder={formData.role === 'chief' ? "Intelligence Artificielle" : "Gestion administrative"}
                    />
                  </div>
                </div>
                
                <h2 className="text-lg font-medium text-gray-900 mb-4 mt-6">Informations de connexion</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Mot de passe*
                    </label>
                    <div className={`relative ${errors.password ? "mb-1" : ""}`}>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full rounded-md border ${
                          errors.password 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-300'
                        } pl-10 pr-10 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <FiEyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <FiEye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-xs text-red-600">{errors.password}</p>
                    )}
                    {!errors.password && (
                      <p className="mt-1 text-xs text-gray-500">Minimum 6 caractères</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmer le mot de passe*
                    </label>
                    <div className={`relative ${errors.confirmPassword ? "mb-1" : ""}`}>
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full rounded-md border ${
                          errors.confirmPassword 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-300'
                        } pl-10 pr-10 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <FiEyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <FiEye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-xs text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
                
                <div className="mt-2 text-sm text-gray-500">
                  <p>Un email sera automatiquement envoyé à l'adresse fournie avec les instructions de connexion.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
              <div className="flex space-x-3">
                <Link 
                  to={getReturnLink()} 
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-150 flex items-center"
                >
                  Annuler
                </Link>
                <button type="submit" className="btn-primary">
                  <FiSave className="mr-2" /> Enregistrer
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default AddStaff;