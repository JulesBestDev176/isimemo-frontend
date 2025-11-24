import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calendar } from 'lucide-react';
import { DashboardCard } from './DashboardCard';

interface DashboardProfesseurBaseProps {
  delay?: number;
}

export const getDashboardProfesseurBaseCards = (delay: number = 0, navigate: (path: string) => void): React.ReactElement[] => {
  let currentDelay = delay;

  const cards: React.ReactElement[] = [];

  // Disponibilités Jury (pour tous les professeurs)
  cards.push(
    <DashboardCard 
      key="disponibilites"
      title="Disponibilités Jury" 
      value="Session Ouverte" 
      icon={<Calendar className="h-6 w-6" />} 
      iconColor="bg-purple-100 text-purple-600"
      delay={currentDelay}
      onClick={() => navigate('/professeur/disponibilites')}
    />
  );
  currentDelay += 0.1;

  // Sujets proposés (pour tous les professeurs)
  cards.push(
    <DashboardCard 
      key="sujets"
      title="Sujets proposés" 
      value="8" 
      icon={<BookOpen className="h-6 w-6" />} 
      iconColor="bg-amber-100 text-amber-600"
      delay={currentDelay}
      onClick={() => navigate('/sujets-professeurs')}
    />
  );
  currentDelay += 0.1;

  return cards;
};

export const DashboardProfesseurBase: React.FC<DashboardProfesseurBaseProps> = ({ delay = 0 }) => {
  const navigate = useNavigate();
  const cards = getDashboardProfesseurBaseCards(delay, navigate);
  return <>{cards}</>;
};

