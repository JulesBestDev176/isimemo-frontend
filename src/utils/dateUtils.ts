/**
 * Utilitaires pour le formatage des dates
 * Gère à la fois les objets Date et les chaînes ISO reçues de l'API
 */

export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return 'N/A';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return 'Date invalide';
  return dateObj.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
};

export const formatDateTime = (date: Date | string | null | undefined): string => {
  if (!date) return 'N/A';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return 'Date invalide';
  return dateObj.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatShortDate = (date: Date | string | null | undefined): string => {
  if (!date) return 'N/A';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return 'Date invalide';
  return dateObj.toLocaleDateString('fr-FR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
};

export const formatTime = (date: Date | string | null | undefined): string => {
  if (!date) return 'N/A';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return 'Heure invalide';
  return dateObj.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export const formatRelativeDate = (date: Date | string | null | undefined): string => {
  if (!date) return 'N/A';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return 'Date invalide';
  
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaine(s)`;
  if (diffDays < 365) return `Il y a ${Math.floor(diffDays / 30)} mois`;
  return `Il y a ${Math.floor(diffDays / 365)} an(s)`;
};
