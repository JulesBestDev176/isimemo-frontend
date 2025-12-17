import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calendar } from 'lucide-react';
import { DashboardCard } from './DashboardCard';

interface DashboardProfesseurBaseProps {
  delay?: number;
}

export const getDashboardProfesseurBaseCards = (delay: number = 0, navigate: (path: string) => void): React.ReactElement[] => {
  // No dashboard cards for base professor - removed sujets and disponibilites
  return [];
};


export const DashboardProfesseurBase: React.FC<DashboardProfesseurBaseProps> = ({ delay = 0 }) => {
  const navigate = useNavigate();
  const cards = getDashboardProfesseurBaseCards(delay, navigate);
  return <>{cards}</>;
};

