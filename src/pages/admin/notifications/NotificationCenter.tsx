import React, { useState } from 'react';
import { FiSend, FiUsers, FiUserCheck, FiBell } from 'react-icons/fi';
import { motion } from 'framer-motion';

const NotificationCenter: React.FC = () => {
  const [notification, setNotification] = useState<{
    title: string;
    message: string;
    recipientType: string;
    departments: string[];
  }>({
    title: '',
    message: '',
    recipientType: 'all', // 'all', 'chiefs', 'secretaries'
    departments: [],
  });

  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      title: 'Fermeture pendant les vacances', 
      message: 'Les bureaux seront fermés du 1er au 15 août pour les vacances annuelles.', 
      sentTo: 'Tous les départements', 
      sentAt: '12/05/2025 09:30', 
      read: 15,
      total: 20
    },
    { 
      id: 2, 
      title: 'Réunion mensuelle', 
      message: 'La réunion mensuelle des chefs de département aura lieu le 20 mai à 14h dans la salle de conférence.', 
      sentTo: 'Chefs de département', 
      sentAt: '10/05/2025 11:45', 
      read: 7,
      total: 8
    },
    { 
      id: 3, 
      title: 'Mise à jour du système', 
      message: 'Une mise à jour du système de gestion des notes sera déployée ce weekend. Veuillez sauvegarder vos données.', 
      sentTo: 'Secrétaires', 
      sentAt: '08/05/2025 16:20', 
      read: 12,
      total: 15
    },
  ]);

  const departments = [
    { id: 1, name: 'Informatique' },
    { id: 2, name: 'Génie Civil' },
    { id: 3, name: 'Management' },
    { id: 4, name: 'Électronique' },
    { id: 5, name: 'Mécanique' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNotification(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setNotification(prev => ({
      ...prev,
      departments: checked 
        ? [...prev.departments, value] 
        : prev.departments.filter(dept => dept !== value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique pour envoyer la notification
    console.log('Notification envoyée:', notification);
    
    // Ajouter la notification à la liste (simulation)
    const recipientMap = {
      all: 'Tous les départements',
      chiefs: 'Chefs de département',
      secretaries: 'Secrétaires',
    };
    
    const newNotification = {
      id: notifications.length + 1,
      title: notification.title,
      message: notification.message,
      sentTo: recipientMap[notification.recipientType as keyof typeof recipientMap],
      sentAt: new Date().toLocaleString('fr-FR'),
      read: 0,
      total: notification.recipientType === 'all' ? 35 : notification.recipientType === 'chiefs' ? 8 : 15,
    };
    
    setNotifications([newNotification, ...notifications]);
    
    // Réinitialiser le formulaire
    setNotification({
      title: '',
      message: '',
      recipientType: 'all',
      departments: [],
    });
    
    alert('Notification envoyée avec succès!');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Centre de notifications</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card p-6"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FiSend className="mr-2" /> Envoyer une notification
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Titre*
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={notification.title}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="Titre de la notification"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message*
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                value={notification.message}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="Contenu de la notification"
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label htmlFor="recipientType" className="block text-sm font-medium text-gray-700 mb-1">
                Destinataires*
              </label>
              <select
                id="recipientType"
                name="recipientType"
                required
                value={notification.recipientType}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                <option value="all">Tous les utilisateurs</option>
                <option value="chiefs">Chefs de département uniquement</option>
                <option value="secretaries">Secrétaires uniquement</option>
              </select>
            </div>
            
            {notification.recipientType !== 'all' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sélectionner les départements
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {departments.map(dept => (
                    <div key={dept.id} className="flex items-center">
                      <input
                        id={`dept-${dept.id}`}
                        name={`dept-${dept.id}`}
                        type="checkbox"
                        value={dept.id.toString()}
                        checked={notification.departments.includes(dept.id.toString())}
                        onChange={handleDepartmentChange}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor={`dept-${dept.id}`} className="ml-2 block text-sm text-gray-700">
                        {dept.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-end">
              <button type="submit" className="btn-primary">
                <FiSend className="mr-2" /> Envoyer la notification
              </button>
            </div>
          </form>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card p-6"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FiBell className="mr-2" /> Notifications récentes
          </h2>
          
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {notifications.map(notif => (
              <div key={notif.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-navy">{notif.title}</h3>
                  <span className="text-xs text-gray-500">{notif.sentAt}</span>
                </div>
                <p className="text-sm text-gray-700 mt-1 mb-2">{notif.message}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Envoyé à: {notif.sentTo}</span>
                  <span>Lu: {notif.read}/{notif.total}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotificationCenter;