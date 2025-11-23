import React, { useState, useRef } from 'react';
import { FiEdit, FiSave, FiUser, FiMail, FiPhone, FiLock, FiCalendar, FiCamera, FiX } from 'react-icons/fi';

const Profile: React.FC = () => {
  const [editing, setEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileData, setProfileData] = useState({
    firstName: 'Étudiant',
    lastName: 'ISIMemo',
    email: 'etudiant@isimemo.edu.sn',
    phone: '(+221) 77 123 45 67',
    role: 'Étudiant',
    department: 'Licence Informatique',
    lastLogin: '12/05/2025 08:45',
    photo: null as string | null,
  });

  // État temporaire pour la photo pendant l'édition
  const [tempPhoto, setTempPhoto] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPassword(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileData(prev => ({
      ...prev,
      photo: tempPhoto
    }));
    setEditing(false);
    alert('Profil mis à jour avec succès!');
  };

  const changePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.new !== newPassword.confirm) {
      alert('Les nouveaux mots de passe ne correspondent pas!');
      return;
    }
    setNewPassword({
      current: '',
      new: '',
      confirm: '',
    });
    alert('Mot de passe changé avec succès!');
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setTempPhoto(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setTempPhoto(profileData.photo);
  };

  const startEditing = () => {
    setTempPhoto(profileData.photo);
    setEditing(true);
  };

  const removePhoto = () => {
    setTempPhoto(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mon Profil</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="p-6 text-center bg-white border border-gray-200">
            <div className="relative mx-auto mb-4">
              <div className="h-24 w-24 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center mx-auto overflow-hidden">
                {(editing ? tempPhoto : profileData.photo) ? (
                  <img 
                    src={editing ? tempPhoto! : profileData.photo!} 
                    alt="Profile" 
                    className="h-full w-full object-cover" 
                  />
                ) : (
                  <FiUser className="h-12 w-12" />
                )}
              </div>
              {editing && (
                <div className="mt-3">
                  <div className="flex justify-center space-x-2">
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center transition-colors"
                    >
                      <FiCamera className="mr-1" /> Changer
                    </button>
                    {tempPhoto && (
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="text-sm px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-md flex items-center transition-colors"
                      >
                        <FiX className="mr-1" /> Supprimer
                      </button>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Les changements seront appliqués après validation
                  </p>
                </div>
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              {profileData.firstName} {profileData.lastName}
            </h2>
            <p className="text-gray-600 mt-1">{profileData.role}</p>
            <p className="text-sm text-gray-500 mt-1">{profileData.department}</p>
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-center space-x-2">
                <FiMail className="text-gray-500" />
                <span className="text-sm text-gray-600">{profileData.email}</span>
              </div>
              <div className="flex items-center justify-center space-x-2 mt-2">
                <FiPhone className="text-gray-500" />
                <span className="text-sm text-gray-600">{profileData.phone}</span>
              </div>
              <div className="flex items-center justify-center space-x-2 mt-2">
                <FiCalendar className="text-gray-500" />
                <span className="text-sm text-gray-600">Dernière connexion: {profileData.lastLogin}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="p-6 bg-white border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Informations personnelles</h2>
              {!editing ? (
                <button
                  onClick={startEditing}
                  className="text-blue-600 hover:text-blue-800 focus:outline-none flex items-center text-sm"
                >
                  <FiEdit className="mr-1" /> Modifier
                </button>
              ) : null}
            </div>
            <form onSubmit={saveProfile}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleProfileChange}
                    disabled={!editing}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleProfileChange}
                    disabled={!editing}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    disabled={!editing}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    disabled={!editing}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                  />
                </div>
              </div>
              {editing && (
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                  >
                    <FiSave className="mr-2" /> Enregistrer les modifications
                  </button>
                </div>
              )}
            </form>
          </div>
          <div className="p-6 bg-white border border-gray-200 mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FiLock className="mr-2" /> Changer le mot de passe
            </h2>
            <form onSubmit={changePassword}>
              <div className="mb-4">
                <label htmlFor="current" className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe actuel*
                </label>
                <input
                  type="password"
                  id="current"
                  name="current"
                  required
                  value={newPassword.current}
                  onChange={handlePasswordChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="new" className="block text-sm font-medium text-gray-700 mb-1">
                    Nouveau mot de passe*
                  </label>
                  <input
                    type="password"
                    id="new"
                    name="new"
                    required
                    value={newPassword.new}
                    onChange={handlePasswordChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmer le mot de passe*
                  </label>
                  <input
                    type="password"
                    id="confirm"
                    name="confirm"
                    required
                    value={newPassword.confirm}
                    onChange={handlePasswordChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <FiLock className="mr-2" /> Changer le mot de passe
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
