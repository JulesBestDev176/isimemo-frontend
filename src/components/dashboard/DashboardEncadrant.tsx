import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, UserPlus } from 'lucide-react';
import { DashboardCard } from './DashboardCard';
import { getEncadrementsActifs } from '../../models/dossier/Encadrement';
import { getDemandesEncadrementEnAttente } from '../../models/dossier/DemandeEncadrement';

interface DashboardEncadrantProps {
  idProfesseur: number;
  delay?: number;
}

export const getDashboardEncadrantCards = (idProfesseur: number, delay: number = 0, navigate: (path: string) => void): React.ReactElement[] => {
  let currentDelay = delay;

  const encadrementsActifs = getEncadrementsActifs(idProfesseur);
  const demandesEnAttente = getDemandesEncadrementEnAttente(idProfesseur);

  const cards: React.ReactElement[] = [];

  // Afficher les cartes d'encadrement uniquement si le professeur a des encadrements actifs ou des demandes en attente
  if (encadrementsActifs.length > 0 || demandesEnAttente.length > 0) {
    // Étudiants encadrés (Actifs)
    if (encadrementsActifs.length > 0) {
      cards.push(
        <DashboardCard 
          key="etudiants-encadres"
          title="Étudiants encadrés" 
          value={encadrementsActifs.length.toString()} 
          icon={<UserCheck className="h-6 w-6" />} 
          iconColor="bg-emerald-100 text-emerald-600"
          delay={currentDelay}
          onClick={() => navigate('/professeur/encadrements')}
        />
      );
      currentDelay += 0.1;
    }

    // Demandes d'encadrement (En attente)
    if (demandesEnAttente.length > 0) {
      cards.push(
        <DashboardCard 
          key="demandes-encadrement"
          title="Demandes en attente" 
          value={demandesEnAttente.length.toString()} 
          icon={<UserPlus className="h-6 w-6" />} 
          iconColor="bg-blue-100 text-blue-600"
          trend={{ value: "Nouveau", up: true }}
          delay={currentDelay}
          onClick={() => navigate('/professeur/encadrements')}
        />
      );
      currentDelay += 0.1;
    }
  }

  return cards;
};

export const DashboardEncadrant: React.FC<DashboardEncadrantProps> = ({ idProfesseur, delay = 0 }) => {
  const navigate = useNavigate();
  const cards = getDashboardEncadrantCards(idProfesseur, delay, navigate);
  return <>{cards}</>;
};

