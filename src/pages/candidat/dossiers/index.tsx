import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DossiersList from './DossiersList';
import dossierService, { DossierMemoire } from '../../../services/dossier.service';
import { useAuth } from '../../../contexts/AuthContext';

const DossiersPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dossiers, setDossiers] = useState<DossierMemoire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDossiers = async () => {
      console.log('📋 DossiersPage - user:', user);
      console.log('📋 DossiersPage - user.id:', user?.id, 'type:', typeof user?.id);
      
      if (!user?.id) {
        console.log('📋 DossiersPage - No user ID, returning');
        setLoading(false);
        return;
      }
      
      const candidatId = user.id;
      console.log('📋 DossiersPage - Fetching dossiers for candidatId:', candidatId);
      
      try {
        setLoading(true);
        // Récupérer uniquement les dossiers du candidat connecté
        const data = await dossierService.getDossiersByCandidat(candidatId);
        console.log('📋 DossiersPage - Dossiers received:', data);
        setDossiers(data);
      } catch (err) {
        console.error('Error fetching dossiers:', err);
        setError('Erreur lors du chargement des dossiers');
      } finally {
        setLoading(false);
      }
    };

    fetchDossiers();
  }, [user?.id]);

  const handleDossierClick = (dossierId: number) => {
    navigate(`/candidat/dossiers/${dossierId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <DossiersList 
      dossiers={dossiers as any} 
      onDossierClick={handleDossierClick}
    />
  );
};

export default DossiersPage;
