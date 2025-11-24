import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gavel, FileCheck, Calendar } from 'lucide-react';
import { DashboardCard } from './DashboardCard';
import { getSoutenancesByProfesseur } from '../../models/soutenance/Soutenance';
import { getProcessVerbalBySoutenance, hasProfesseurApprouve } from '../../models/soutenance/ProcessVerbal';
import { getProfesseurIdByEmail } from '../../models/acteurs/Professeur';

interface DashboardJuryProps {
  userEmail?: string;
  delay?: number;
}

export const getDashboardJuryCards = (userEmail: string | undefined, delay: number = 0, navigate: (path: string) => void): React.ReactElement[] => {
  let currentDelay = delay;

  const idProfesseur = userEmail ? (getProfesseurIdByEmail(userEmail) || 0) : 0;

  const soutenances = idProfesseur > 0 ? getSoutenancesByProfesseur(idProfesseur) : [];

  // Compter les PV en attente d'approbation
  let pvEnAttente = 0;
  soutenances.forEach(soutenance => {
    const pv = getProcessVerbalBySoutenance(soutenance.idSoutenance);
    if (pv && !hasProfesseurApprouve(pv, idProfesseur)) {
      pvEnAttente++;
    }
  });

  // Trouver la prochaine soutenance
  const maintenant = new Date();
  const futures = soutenances
    .filter(s => new Date(s.dateSoutenance) > maintenant)
    .sort((a, b) => new Date(a.dateSoutenance).getTime() - new Date(b.dateSoutenance).getTime());
  const prochaineSoutenance = futures[0];

  const cards: React.ReactElement[] = [];

  // Soutenances assignées
  if (soutenances.length > 0) {
    cards.push(
      <DashboardCard 
        key="soutenances-assignees"
        title="Soutenances assignées" 
        value={soutenances.length.toString()} 
        icon={<Gavel className="h-6 w-6" />} 
        iconColor="bg-red-100 text-red-600"
        delay={currentDelay}
        onClick={() => navigate('/jurie/soutenances')}
      />
    );
    currentDelay += 0.1;
  }

  // PV en attente d'approbation
  if (pvEnAttente > 0) {
    cards.push(
      <DashboardCard 
        key="pv-en-attente"
        title="PV à confirmer" 
        value={pvEnAttente.toString()} 
        icon={<FileCheck className="h-6 w-6" />} 
        iconColor="bg-yellow-100 text-yellow-600"
        trend={{ value: "En attente", up: false }}
        delay={currentDelay}
        onClick={() => navigate('/jurie/soutenances')}
      />
    );
    currentDelay += 0.1;
  }

  // Prochaine soutenance
  if (prochaineSoutenance) {
    const dateSoutenance = new Date(prochaineSoutenance.dateSoutenance);
    const joursRestants = Math.ceil((dateSoutenance.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    cards.push(
      <DashboardCard 
        key="prochaine-soutenance"
        title="Prochaine soutenance" 
        value={joursRestants > 0 ? `Dans ${joursRestants} jour(s)` : "Aujourd'hui"} 
        icon={<Calendar className="h-6 w-6" />} 
        iconColor="bg-indigo-100 text-indigo-600"
        delay={currentDelay}
        onClick={() => navigate('/jurie/soutenances')}
      />
    );
    currentDelay += 0.1;
  }

  return cards;
};

export const DashboardJury: React.FC<DashboardJuryProps> = ({ userEmail, delay = 0 }) => {
  const navigate = useNavigate();
  const cards = getDashboardJuryCards(userEmail, delay, navigate);
  return <>{cards}</>;
};

