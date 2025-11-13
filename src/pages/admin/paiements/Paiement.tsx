import React, { useState } from 'react';
import { FiCreditCard, FiClock, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Paiement: React.FC = () => {
  const [ongletActif, setOngletActif] = useState('abonnement');

  // Données factices pour l'abonnement
  const abonnement = {
    plan: 'Premium',
    statut: 'Actif',
    dateProchainPaiement: '15/06/2025',
    prix: '25.000 FCFA',
    fonctionnalites: [
      'Accès à tous les modules',
      'Support prioritaire',
      'Sauvegarde automatique',
      'Rapports avancés'
    ]
  };

  // Données factices pour l'historique des paiements
  const historiquePaiements = [
    { id: 'PAY-2025-001', date: '15/05/2025', montant: '25.000 FCFA', methode: 'Orange Money', statut: 'Complété' },
    { id: 'PAY-2025-000', date: '15/04/2025', montant: '25.000 FCFA', methode: 'Wave', statut: 'Complété' },
    { id: 'PAY-2024-012', date: '15/03/2025', montant: '25.000 FCFA', methode: 'Carte Bancaire', statut: 'Complété' },
    { id: 'PAY-2024-011', date: '15/02/2025', montant: '25.000 FCFA', methode: 'Orange Money', statut: 'Complété' },
    { id: 'PAY-2024-010', date: '15/01/2025', montant: '25.000 FCFA', methode: 'Wave', statut: 'Complété' },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Gestion des paiements</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b">
          <button
            className={`px-4 py-3 flex items-center ${ongletActif === 'abonnement' ? 'bg-primary text-white' : 'bg-gray-100'}`}
            onClick={() => setOngletActif('abonnement')}
          >
            <FiCreditCard className="mr-2" />
            <span>Mon abonnement</span>
          </button>
          <button
            className={`px-4 py-3 flex items-center ${ongletActif === 'historique' ? 'bg-primary text-white' : 'bg-gray-100'}`}
            onClick={() => setOngletActif('historique')}
          >
            <FiClock className="mr-2" />
            <span>Historique des paiements</span>
          </button>
        </div>

        <div className="p-6">
          {ongletActif === 'abonnement' && (
            <div>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Détails de l'abonnement</h2>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {abonnement.statut}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="border rounded-lg p-4">
                    <p className="text-gray-600 mb-1">Plan</p>
                    <p className="font-semibold">{abonnement.plan}</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <p className="text-gray-600 mb-1">Prix mensuel</p>
                    <p className="font-semibold">{abonnement.prix}</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <p className="text-gray-600 mb-1">Prochain paiement</p>
                    <p className="font-semibold">{abonnement.dateProchainPaiement}</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <p className="text-gray-600 mb-1">Méthode de paiement</p>
                    <p className="font-semibold">Orange Money (Par défaut)</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold mb-3">Fonctionnalités incluses</h3>
                  <ul className="space-y-2">
                    {abonnement.fonctionnalites.map((fonctionnalite, index) => (
                      <li key={index} className="flex items-center">
                        <FiCheck className="text-green-500 mr-2" />
                        <span>{fonctionnalite}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/paiement/nouveau"
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                  >
                    Renouveler l'abonnement
                  </Link>
                  <Link
                    to="/paiement/changement"
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    Changer de plan
                  </Link>
                </div>
              </div>
            </div>
          )}

          {ongletActif === 'historique' && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Historique des paiements</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Référence
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Méthode
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {historiquePaiements.map((paiement) => (
                      <tr key={paiement.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {paiement.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {paiement.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {paiement.montant}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {paiement.methode}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {paiement.statut}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-primary hover:underline">
                            Reçu
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 flex justify-center">
                <button className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50">
                  <span>Télécharger tous les reçus</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Paiement;