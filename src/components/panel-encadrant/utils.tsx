import React from 'react';
import { StatutLivrable } from '../../models';
import { Badge } from '../ui/badge';

// Formatage des dates
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Badges pour les statuts
export const getStatutLivrableBadge = (statut: StatutLivrable) => {
  switch (statut) {
    case StatutLivrable.VALIDE:
      return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Validé</Badge>;
    case StatutLivrable.REJETE:
      return <Badge className="bg-gray-50 text-gray-700 border-gray-200">Rejeté</Badge>;
    case StatutLivrable.EN_ATTENTE_VALIDATION:
      return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">En attente</Badge>;
    case StatutLivrable.DEPOSE:
      return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Déposé</Badge>;
    default:
      return <Badge variant="outline">{statut}</Badge>;
  }
};

export const getStatutTacheBadge = (statut: string) => {
  switch (statut) {
    case 'Terminé':
      return <Badge className="bg-green-50 text-green-700 border-green-200">Terminé</Badge>;
    case 'En retard':
      return <Badge className="bg-red-50 text-red-700 border-red-200">En retard</Badge>;
    case 'En cours':
      return <Badge className="bg-blue-50 text-blue-700 border-blue-200">En cours</Badge>;
    default:
      return <Badge variant="outline">{statut}</Badge>;
  }
};

export const getPrioriteBadge = (priorite: string) => {
  switch (priorite) {
    case 'Haute':
      return <Badge className="bg-red-50 text-red-700 border-red-200">Haute</Badge>;
    case 'Moyenne':
      return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">Moyenne</Badge>;
    case 'Basse':
      return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Basse</Badge>;
    default:
      return <Badge variant="outline">{priorite}</Badge>;
  }
};

