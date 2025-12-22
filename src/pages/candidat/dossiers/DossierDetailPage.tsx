import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DossierDetail from './DossierDetail';
import dossierService, { DossierMemoire } from '../../../services/dossier.service';

const DossierDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dossier, setDossier] = useState<DossierMemoire | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDossier = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await dossierService.getDossierById(parseInt(id));
        setDossier(data);
      } catch (err) {
        console.error('Error fetching dossier:', err);
        setError('Erreur lors du chargement du dossier');
      } finally {
        setLoading(false);
      }
    };

    fetchDossier();
  }, [id]);

  const handleBack = () => {
    navigate('/candidat/dossiers');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !dossier) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-red-600 mb-4">{error || 'Dossier non trouvé'}</p>
        <button onClick={handleBack} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Retour
        </button>
      </div>
    );
  }

  return (
    <DossierDetail 
      dossier={dossier as any}
      documents={[]}
      onBack={handleBack}
    />
  );
};

export default DossierDetailPage;
