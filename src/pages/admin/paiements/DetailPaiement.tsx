import React from 'react';
import { FiDownload, FiArrowLeft, FiClock, FiCheck, FiX } from 'react-icons/fi';
import { Link, useParams } from 'react-router-dom';

interface DetailPaiement {
  id: string;
  date: string;
  heure: string;
  montant: string;
  methode: string;
  statut: 'Complété' | 'En cours' | 'Échoué';
  reference: string;
  description: string;
  periodePaiement: string;
  idTransaction: string;
}

const DetailPaiement: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Données factices pour un paiement spécifique
  const detailPaiement: DetailPaiement = {
    id: 'PAY-2025-001',
    date: '15/05/2025',
    heure: '09:47',
    montant: '25.000 FCFA',
    methode: 'Orange Money',
    statut: 'Complété',
    reference: 'OM-243675849',
    description: 'Renouvellement abonnement Premium',
    periodePaiement: '16/05/2025 - 15/06/2025',
    idTransaction: 'TXN-89752364'
  };

  const obtenirBadgeStatut = (statut: string) => {
    switch (statut) {
      case 'Complété':
        return (
          <span className="px-3 py-1 inline-flex items-center bg-green-100 text-green-800 rounded-full text-sm font-medium">
            <FiCheck className="mr-1" />
            {statut}
          </span>
        );
      case 'En cours':
        return (
          <span className="px-3 py-1 inline-flex items-center bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
            <FiClock className="mr-1" />
            {statut}
          </span>
        );
      case 'Échoué':
        return (
          <span className="px-3 py-1 inline-flex items-center bg-red-100 text-red-800 rounded-full text-sm font-medium">
            <FiX className="mr-1" />
            {statut}
          </span>
        );
      default:
        return <span>{statut}</span>;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link to="/paiement/historique" className="flex items-center text-gray-600 hover:text-gray-800">
          <FiArrowLeft className="mr-2" />
          <span>Retour à l'historique</span>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Détails du paiement</h1>
            {obtenirBadgeStatut(detailPaiement.statut)}
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Reçu #{detailPaiement.id}</h2>
              <button className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors">
                <FiDownload />
                <span>Télécharger</span>
              </button>
            </div>

            <div className="border-t border-b py-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm text-gray-500 uppercase mb-3">Informations de paiement</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Date de paiement</p>
                      <p className="font-medium">{detailPaiement.date} à {detailPaiement.heure}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Montant</p>
                      <p className="font-medium text-lg">{detailPaiement.montant}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Méthode de paiement</p>
                      <p className="font-medium">{detailPaiement.methode}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Référence externe</p>
                      <p className="font-medium">{detailPaiement.reference}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm text-gray-500 uppercase mb-3">Détails de la transaction</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Description</p>
                      <p className="font-medium">{detailPaiement.description}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Période d'abonnement</p>
                      <p className="font-medium">{detailPaiement.periodePaiement}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">ID de transaction</p>
                      <p className="font-medium font-mono">{detailPaiement.idTransaction}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-medium mb-3">Informations de facturation</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Facturé à</p>
                <p className="font-medium">ISI Memo Admin</p>
                <p>Institut Supérieur d'Informatique</p>
                <p>Dakar, Sénégal</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Émis par</p>
                <p className="font-medium">ISI Memo Services</p>
                <p>Boulevard des Technologies</p>
                <p>Dakar, Sénégal</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Link 
              to="/paiement/nouveau"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              Effectuer un nouveau paiement
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPaiement;