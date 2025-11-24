import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, FileCheck } from 'lucide-react';
import { DashboardCard } from './DashboardCard';
import { mockSujets } from '../../models/pipeline/SujetMemoire';
import { mockDocuments, StatutDocument, TypeDocument } from '../../models/dossier/Document';

interface DashboardCommissionProps {
  delay?: number;
}

export const getDashboardCommissionCards = (delay: number = 0, navigate: (path: string) => void): React.ReactElement[] => {
  let currentDelay = delay;

  // Compter les sujets en attente
  const sujetsEnAttente = mockSujets.filter(s => s.statut === 'soumis' && !s.dateApprobation).length;

  // Compter les documents en attente de validation
  const documentsEnAttente = mockDocuments.filter(d => 
    d.statut === StatutDocument.EN_ATTENTE_VALIDATION && 
    d.typeDocument === TypeDocument.CHAPITRE
  ).length;

  const cards: React.ReactElement[] = [];

  // Sujets en attente de validation
  if (sujetsEnAttente > 0) {
    cards.push(
      <DashboardCard 
        key="sujets-en-attente"
        title="Sujets à valider" 
        value={sujetsEnAttente.toString()} 
        icon={<BookOpen className="h-6 w-6" />} 
        iconColor="bg-amber-100 text-amber-600"
        trend={{ value: "En attente", up: false }}
        delay={currentDelay}
        onClick={() => navigate('/commission/sujets')}
      />
    );
    currentDelay += 0.1;
  }

  // Documents corrigés en attente
  if (documentsEnAttente > 0) {
    cards.push(
      <DashboardCard 
        key="documents-en-attente"
        title="Documents à valider" 
        value={documentsEnAttente.toString()} 
        icon={<FileCheck className="h-6 w-6" />} 
        iconColor="bg-indigo-100 text-indigo-600"
        trend={{ value: "Corrections", up: false }}
        delay={currentDelay}
        onClick={() => navigate('/commission/documents')}
      />
    );
    currentDelay += 0.1;
  }

  return cards;
};

export const DashboardCommission: React.FC<DashboardCommissionProps> = ({ delay = 0 }) => {
  const navigate = useNavigate();
  const cards = getDashboardCommissionCards(delay, navigate);
  return <>{cards}</>;
};

