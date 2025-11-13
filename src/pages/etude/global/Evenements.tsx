import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import EvenementsCalendrier from '../communes/EvenementsCalendrier';
import EvenementsSoutenances from '../communes/EvenementsSoutenances';

const Evenements: React.FC = () => {
  const { user } = useAuth();

  // Déterminer le niveau de l'étudiant
  const niveauEtudiant = user?.niveau || 'autres';

  // Afficher le composant approprié selon le niveau
  if (niveauEtudiant === 'licence' || niveauEtudiant === 'master') {
    return <EvenementsCalendrier />;
  } else {
    return <EvenementsSoutenances />;
  }
};

export default Evenements; 