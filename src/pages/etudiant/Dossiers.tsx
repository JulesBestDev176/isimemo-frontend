import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { DossierMemoire, Document, mockDossiers, mockDocuments, getDossiersByCandidat } from '../../models';
import { getCandidatIdByEmail } from '../../models/acteurs/Candidat';
import DossiersList from './dossiers/DossiersList';
import DossierDetail from './dossiers/DossierDetail';

const Dossiers: React.FC = () => {
  const { user } = useAuth();
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  // Récupérer l'ID du candidat connecté
  const idCandidat = useMemo(() => {
    if (user?.estCandidat && user?.email) {
      return getCandidatIdByEmail(user.email);
    }
    return undefined;
  }, [user]);

  // Récupérer les dossiers du candidat connecté
  // Règle métier : Un candidat ne peut avoir qu'un seul dossier en cours
  const tousLesDossiers = useMemo(() => {
    if (idCandidat) {
      // Filtrer les dossiers du candidat connecté
      const dossiersCandidat = getDossiersByCandidat(idCandidat);
      // Trier par date de modification (plus récent en premier)
      return dossiersCandidat.sort((a, b) => 
        b.dateModification.getTime() - a.dateModification.getTime()
      );
    }
    // Si ce n'est pas un candidat, retourner tous les dossiers (pour les étudiants normaux)
    return [...mockDossiers].sort((a, b) => 
      b.dateModification.getTime() - a.dateModification.getTime()
    );
  }, [idCandidat]);

  // Récupérer le dossier sélectionné
  // Vérifier que le dossier appartient bien au candidat connecté
  const dossier = useMemo(() => {
    if (id) {
      const dossierTrouve = tousLesDossiers.find(d => d.idDossierMemoire.toString() === id);
      // Si c'est un candidat, vérifier que le dossier lui appartient
      if (dossierTrouve && idCandidat) {
        const appartientAuCandidat = dossierTrouve.candidats?.some(c => c.idCandidat === idCandidat);
        return appartientAuCandidat ? dossierTrouve : null;
      }
      return dossierTrouve;
    }
    return null;
  }, [id, tousLesDossiers, idCandidat]);

  // Documents du dossier sélectionné
  const documentsDossier = useMemo(() => {
    if (!dossier) return [];
    // Si le dossier a déjà des documents liés, les utiliser
    if (dossier.documents && dossier.documents.length > 0) {
      return dossier.documents;
    }
    // Sinon, filtrer les documents liés à ce dossier
    const documentsLies = mockDocuments.filter(doc => 
      doc.dossierMemoire?.idDossierMemoire === dossier.idDossierMemoire
    );
    // Si aucun document lié, retourner un document par défaut pour le dossier en cours
    if (documentsLies.length === 0 && dossier.idDossierMemoire === 0) {
      return [mockDocuments.find(doc => doc.idDocument === 0)].filter(Boolean) as Document[];
    }
    return documentsLies;
  }, [dossier]);

  const handleDossierClick = (dossierId: number) => {
    navigate(`/etudiant/dossiers/${dossierId}`);
  };

  const handleBack = () => {
    navigate('/etudiant/dossiers');
  };

  // Si un dossier est sélectionné, afficher le détail
  if (dossier) {
    return <DossierDetail dossier={dossier} documents={documentsDossier} onBack={handleBack} />;
  }

  // Sinon, afficher la liste
  return <DossiersList dossiers={tousLesDossiers} onDossierClick={handleDossierClick} />;
};

export default Dossiers;
