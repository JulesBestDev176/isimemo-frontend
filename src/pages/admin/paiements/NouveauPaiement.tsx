import React, { useState } from 'react';
import { FiCreditCard, FiCheckCircle, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';

// Logos des méthodes de paiement
const logoWave = 'https://www.wave.com/static/media/logo-wave.svg';
const logoOrangeMoney = 'https://www.orangemoney.com/assets/logo-orange-money.png';

interface MethodePaiement {
  id: string;
  nom: string;
  logo: string;
}

const NouveauPaiement: React.FC = () => {
  const [methodeSelectionnee, setMethodeSelectionnee] = useState<string>('orange-money');
  const [numeroTelephone, setNumeroTelephone] = useState<string>('');
  const [numeroCarte, setNumeroCarte] = useState<string>('');
  const [dateExpiration, setDateExpiration] = useState<string>('');
  const [codeCvv, setCodeCvv] = useState<string>('');
  const [nomCarte, setNomCarte] = useState<string>('');
  const [estEnTraitement, setEstEnTraitement] = useState<boolean>(false);
  const [statutPaiement, setStatutPaiement] = useState<'attente' | 'succes' | 'erreur'>('attente');

  const methodesPaiement: MethodePaiement[] = [
    {
      id: 'orange-money',
      nom: 'Orange Money',
      logo: '/api/placeholder/80/30',
    },
    {
      id: 'wave',
      nom: 'Wave',
      logo: '/api/placeholder/80/30',
    },
    {
      id: 'carte',
      nom: 'Carte bancaire',
      logo: '/api/placeholder/80/30',
    },
  ];

  const soumettreFormulaire = (e: React.FormEvent) => {
    e.preventDefault();
    setEstEnTraitement(true);
    
    // Simulation d'un traitement de paiement
    setTimeout(() => {
      setEstEnTraitement(false);
      setStatutPaiement('succes');
    }, 2000);
  };

  const formaterNumeroCarte = (valeur: string) => {
    const v = valeur.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const correspondances = v.match(/\d{4,16}/g);
    const correspondance = (correspondances && correspondances[0]) || '';
    const parties = [];

    for (let i = 0; i < correspondance.length; i += 4) {
      parties.push(correspondance.substring(i, i + 4));
    }

    if (parties.length) {
      return parties.join(' ');
    } else {
      return valeur;
    }
  };

  const formaterDateExpiration = (valeur: string) => {
    const v = valeur.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return valeur;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link to="/paiement/abonnement" className="flex items-center text-gray-600 hover:text-gray-800">
          <FiArrowLeft className="mr-2" />
          <span>Retour aux paiements</span>
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Effectuer un paiement</h1>

      {statutPaiement === 'attente' && (
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Détails du paiement</h2>
              <p className="text-gray-600">Renouvellement de l'abonnement Premium</p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Montant à payer:</span>
                  <span className="font-bold">25.000 FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Période:</span>
                  <span>16/05/2025 - 15/06/2025</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-3">Choisissez votre méthode de paiement</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {methodesPaiement.map((methode) => (
                  <button
                    key={methode.id}
                    className={`border rounded-lg p-4 flex flex-col items-center justify-center transition-colors ${
                      methodeSelectionnee === methode.id
                        ? 'border-primary bg-primary bg-opacity-5'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => setMethodeSelectionnee(methode.id)}
                  >
                    <div className="w-20 h-10 mb-2 flex items-center justify-center">
                      {methode.id === 'carte' ? (
                        <FiCreditCard size={30} className="text-gray-600" />
                      ) : (
                        <img src={methode.logo} alt={methode.nom} className="h-10 object-contain" />
                      )}
                    </div>
                    <span className={methodeSelectionnee === methode.id ? 'text-primary font-medium' : ''}>
                      {methode.nom}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={soumettreFormulaire}>
              {methodeSelectionnee === 'orange-money' && (
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2" htmlFor="telephone">
                    Numéro de téléphone Orange
                  </label>
                  <input
                    type="tel"
                    id="telephone"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Exemple: 77 123 45 67"
                    value={numeroTelephone}
                    onChange={(e) => setNumeroTelephone(e.target.value)}
                    required
                  />
                  <p className="mt-2 text-sm text-gray-600">
                    Vous recevrez une notification sur votre téléphone pour confirmer le paiement.
                  </p>
                </div>
              )}

              {methodeSelectionnee === 'wave' && (
                <div className="mb-6">
                  <label className="block text-gray-700 mb-2" htmlFor="telephone-wave">
                    Numéro de téléphone Wave
                  </label>
                  <input
                    type="tel"
                    id="telephone-wave"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Exemple: 77 123 45 67"
                    value={numeroTelephone}
                    onChange={(e) => setNumeroTelephone(e.target.value)}
                    required
                  />
                  <p className="mt-2 text-sm text-gray-600">
                    Vous recevrez une notification sur votre application Wave pour confirmer le paiement.
                  </p>
                </div>
              )}

              {methodeSelectionnee === 'carte' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="numero-carte">
                      Numéro de carte
                    </label>
                    <input
                      type="text"
                      id="numero-carte"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="1234 5678 9012 3456"
                      value={numeroCarte}
                      onChange={(e) => setNumeroCarte(formaterNumeroCarte(e.target.value))}
                      maxLength={19}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2" htmlFor="date-expiration">
                        Date d'expiration (MM/YY)
                      </label>
                      <input
                        type="text"
                        id="date-expiration"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="MM/YY"
                        value={dateExpiration}
                        onChange={(e) => setDateExpiration(formaterDateExpiration(e.target.value))}
                        maxLength={5}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2" htmlFor="cvv">
                        CVV
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="123"
                        value={codeCvv}
                        onChange={(e) => setCodeCvv(e.target.value.replace(/\D/g, ''))}
                        maxLength={3}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2" htmlFor="nom-carte">
                      Nom sur la carte
                    </label>
                    <input
                      type="text"
                      id="nom-carte"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="PRENOM NOM"
                      value={nomCarte}
                      onChange={(e) => setNomCarte(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="mt-8">
                <button
                  type="submit"
                  className="w-full py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary flex items-center justify-center"
                  disabled={estEnTraitement}
                >
                  {estEnTraitement ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Traitement en cours...
                    </>
                  ) : (
                    'Payer 25.000 FCFA'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {statutPaiement === 'succes' && (
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-500 mb-4">
              <FiCheckCircle size={32} />
            </div>
            <h2 className="text-xl font-semibold mb-2">Paiement effectué avec succès!</h2>
            <p className="text-gray-600 mb-6">
              Votre abonnement Premium a été renouvelé jusqu'au 15/06/2025.
            </p>
            
            <div className="p-4 bg-gray-50 rounded-lg text-left mb-6">
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-gray-600">Référence du paiement:</span>
                <span className="font-medium">PAY-2025-002</span>
              </div>
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-gray-600">Montant:</span>
                <span className="font-medium">25.000 FCFA</span>
              </div>
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">13/05/2025</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Méthode:</span>
                <span className="font-medium">
                  {methodeSelectionnee === 'orange-money' ? 'Orange Money' : 
                   methodeSelectionnee === 'wave' ? 'Wave' : 'Carte bancaire'}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                Télécharger le reçu
              </button>
              <Link 
                to="/paiement/abonnement"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                Retour à mon abonnement
              </Link>
            </div>
          </div>
        </div>
      )}

      {statutPaiement === 'erreur' && (
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-500 mb-4">
              <FiAlertCircle size={32} />
            </div>
            <h2 className="text-xl font-semibold mb-2">Échec du paiement</h2>
            <p className="text-gray-600 mb-6">
              Une erreur s'est produite lors du traitement de votre paiement. Veuillez réessayer.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button 
                onClick={() => setStatutPaiement('attente')}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                Réessayer
              </button>
              <Link 
                to="/paiement/abonnement"
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Annuler
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NouveauPaiement;