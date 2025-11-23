import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Calendar,
  Users,
  FileText,
  Clock,
  CheckCircle,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getEncadrementById,
  StatutEncadrement
} from '../../models';

// Badge Component
const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'success' | 'info' | 'neutral';
}> = ({ children, variant = 'info' }) => {
  const variants = {
    success: 'bg-green-50 text-green-700 border border-green-200',
    info: 'bg-blue-50 text-blue-700 border border-blue-200',
    neutral: 'bg-gray-50 text-gray-700 border border-gray-200'
  };
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

// Formatage des dates
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric'
  });
};

const EncadrementDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Récupérer l'encadrement
  const encadrement = id ? getEncadrementById(parseInt(id)) : null;

  if (!encadrement) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Encadrement introuvable</h2>
          <p className="text-gray-600 mb-4">L'encadrement demandé n'existe pas.</p>
          <button
            onClick={() => navigate('/professeur/encadrements')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Retour aux encadrements
          </button>
        </div>
      </div>
    );
  }

  const getStatutBadge = (statut: StatutEncadrement) => {
    switch (statut) {
      case StatutEncadrement.ACTIF:
        return <Badge variant="success">Actif</Badge>;
      case StatutEncadrement.TERMINE:
        return <Badge variant="info">Terminé</Badge>;
      case StatutEncadrement.ANNULE:
        return <Badge variant="neutral">Annulé</Badge>;
      default:
        return <Badge variant="neutral">{statut}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bouton retour */}
        <button
          onClick={() => navigate('/professeur/encadrements')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour aux encadrements
        </button>

        {/* En-tête */}
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {encadrement.dossierMemoire?.titre || `Encadrement #${encadrement.idEncadrement}`}
              </h1>
              <div className="flex items-center gap-3">
                {getStatutBadge(encadrement.statut)}
                <Badge variant="neutral">{encadrement.anneeAcademique}</Badge>
              </div>
            </div>
          </div>

          {/* Informations principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="flex items-center text-gray-700">
              <Calendar className="h-5 w-5 mr-3 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Date de début</div>
                <div className="font-medium">{formatDate(encadrement.dateDebut)}</div>
              </div>
            </div>
            {encadrement.dateFin && (
              <div className="flex items-center text-gray-700">
                <CheckCircle className="h-5 w-5 mr-3 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Date de fin</div>
                  <div className="font-medium">{formatDate(encadrement.dateFin)}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Candidats */}
        {encadrement.dossierMemoire?.candidats && encadrement.dossierMemoire.candidats.length > 0 && (
          <div className="bg-white border border-gray-200 p-6 mb-6">
            <div className="flex items-center mb-4">
              <Users className="h-5 w-5 mr-2 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">
                Candidat{encadrement.dossierMemoire.candidats.length > 1 ? 's' : ''}
              </h2>
            </div>
            <div className="space-y-3">
              {encadrement.dossierMemoire.candidats.map((candidat, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold mr-3">
                    {candidat.prenom.charAt(0)}{candidat.nom.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {candidat.prenom} {candidat.nom}
                    </div>
                    {candidat.email && (
                      <div className="text-sm text-gray-500">{candidat.email}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description du mémoire */}
        {encadrement.dossierMemoire?.description && (
          <div className="bg-white border border-gray-200 p-6 mb-6">
            <div className="flex items-center mb-4">
              <FileText className="h-5 w-5 mr-2 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">Description du mémoire</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {encadrement.dossierMemoire.description}
            </p>
          </div>
        )}

        {/* Messages récents */}
        {encadrement.messages && encadrement.messages.length > 0 && (
          <div className="bg-white border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">Messages récents</h2>
              </div>
              <Badge variant="neutral">{encadrement.messages.length}</Badge>
            </div>
            <div className="space-y-3">
              {encadrement.messages.slice(0, 5).map((message, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{message.expediteur || 'Utilisateur'}</span>
                    <span className="text-sm text-gray-500">
                      {message.dateEnvoi ? formatDate(message.dateEnvoi) : 'Date inconnue'}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm">{message.contenu || 'Contenu du message'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tickets */}
        {encadrement.tickets && encadrement.tickets.length > 0 && (
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">Tickets</h2>
              </div>
              <Badge variant="neutral">{encadrement.tickets.length}</Badge>
            </div>
            <div className="space-y-3">
              {encadrement.tickets.map((ticket, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">Ticket #{ticket.idTicket || index + 1}</span>
                    <Badge variant={ticket.statut === 'RESOLU' ? 'success' : 'neutral'}>
                      {ticket.statut || 'EN_COURS'}
                    </Badge>
                  </div>
                  <p className="text-gray-700 text-sm">{ticket.description || 'Description du ticket'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bouton accès au Panel */}
        {encadrement.statut === StatutEncadrement.ACTIF && user?.estEncadrant && (
          <div className="bg-white border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Panel d'encadrement</h2>
                <p className="text-sm text-gray-600">
                  Accédez au panel pour gérer les messages, tâches, dossiers et livrables
                </p>
              </div>
              <button
                onClick={() => navigate(`/professeur/encadrements/${encadrement.idEncadrement}/panel`)}
                className="px-6 py-3 bg-primary text-white hover:bg-primary-700 transition-colors flex items-center gap-2"
              >
                <MessageSquare className="h-5 w-5" />
                Ouvrir le panel
              </button>
            </div>
          </div>
        )}

        {/* Message si pas de messages ni tickets */}
        {(!encadrement.messages || encadrement.messages.length === 0) && 
         (!encadrement.tickets || encadrement.tickets.length === 0) && (
          <div className="bg-white border border-gray-200 p-12 text-center">
            <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucune activité récente pour cet encadrement</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EncadrementDetail;
