import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ticket as TicketIcon,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  FileText,
  Eye
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  mockTickets,
  PhaseTicket,
  StatutTicket,
  Priorite,
  getTicketsByEncadrement,
  getTicketById
} from '../../models';
import { getEncadrementActifByCandidat } from '../../models';

type TicketTab = 'a-faire' | 'en-cours' | 'en-revision' | 'termines';

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  count: number;
  icon?: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick, count, icon }) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2
        ${isActive
          ? 'border-primary text-primary bg-white'
          : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300 bg-gray-50'
        }
      `}
    >
      {icon && icon}
      <span>{label}</span>
      {count !== undefined && count > 0 && (
        <Badge className={`text-xs ${
          isActive
            ? 'bg-primary-50 text-primary-700 border-primary-200'
            : 'bg-gray-200 text-gray-700 border-gray-300'
        }`}>
          {count}
        </Badge>
      )}
    </button>
  );
};

const Tickets: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TicketTab>('a-faire');
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);

  // Récupérer l'encadrement actif du candidat
  const encadrement = useMemo(() => {
    if (!user?.estCandidat || !user.id) return null;
    // Pour un candidat, on doit trouver l'encadrement qui le contient
    // On suppose que user.id correspond à idCandidat dans les données mock
    return getEncadrementActifByCandidat(parseInt(user.id));
  }, [user]);

  // Récupérer les tickets associés à l'encadrement
  const allTickets = useMemo(() => {
    if (!encadrement) return [];
    return getTicketsByEncadrement(encadrement.idEncadrement);
  }, [encadrement]);

  // Filtrer les tickets par phase selon l'onglet actif
  const filteredTickets = useMemo(() => {
    switch (activeTab) {
      case 'a-faire':
        return allTickets.filter(t => t.phase === PhaseTicket.A_FAIRE);
      case 'en-cours':
        return allTickets.filter(t => t.phase === PhaseTicket.EN_COURS);
      case 'en-revision':
        return allTickets.filter(t => t.phase === PhaseTicket.EN_REVISION);
      case 'termines':
        return allTickets.filter(t => t.phase === PhaseTicket.TERMINE);
      default:
        return [];
    }
  }, [allTickets, activeTab]);

  // Compter les tickets par phase
  const counts = useMemo(() => {
    return {
      'a-faire': allTickets.filter(t => t.phase === PhaseTicket.A_FAIRE).length,
      'en-cours': allTickets.filter(t => t.phase === PhaseTicket.EN_COURS).length,
      'en-revision': allTickets.filter(t => t.phase === PhaseTicket.EN_REVISION).length,
      'termines': allTickets.filter(t => t.phase === PhaseTicket.TERMINE).length
    };
  }, [allTickets]);

  // Helper pour obtenir la couleur du badge selon la phase
  const getPhaseBadgeColor = (phase: PhaseTicket): string => {
    switch (phase) {
      case PhaseTicket.A_FAIRE:
        return 'bg-gray-50 text-gray-700 border-gray-200';
      case PhaseTicket.EN_COURS:
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case PhaseTicket.EN_REVISION:
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case PhaseTicket.TERMINE:
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Helper pour obtenir le label de la phase
  const getPhaseLabel = (phase: PhaseTicket): string => {
    switch (phase) {
      case PhaseTicket.A_FAIRE:
        return 'À faire';
      case PhaseTicket.EN_COURS:
        return 'En cours';
      case PhaseTicket.EN_REVISION:
        return 'En révision';
      case PhaseTicket.TERMINE:
        return 'Terminé';
      default:
        return phase;
    }
  };

  // Helper pour obtenir la couleur de la priorité
  const getPrioriteColor = (priorite: Priorite): string => {
    switch (priorite) {
      case Priorite.URGENTE:
        return 'bg-red-50 text-red-700 border-red-200';
      case Priorite.HAUTE:
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case Priorite.MOYENNE:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case Priorite.BASSE:
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // Récupérer le ticket sélectionné pour consultation
  const ticketDetail = selectedTicket ? getTicketById(selectedTicket) : null;

  // Vérifier que l'utilisateur est un candidat
  if (!user?.estCandidat) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès non autorisé</h2>
          <p className="text-gray-600">Vous devez être un candidat pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Onglets */}
        <Card className="mb-6">
          <CardHeader className="pb-0">
            <CardTitle>Mes Tickets</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Consultez et suivez l'avancement de vos tickets de suivi
            </p>
          </CardHeader>
          
          {/* Navigation par onglets */}
          <div className="border-b border-gray-200 px-6">
            <div className="flex space-x-1 -mb-px">
              <TabButton
                label="À faire"
                isActive={activeTab === 'a-faire'}
                onClick={() => setActiveTab('a-faire')}
                count={counts['a-faire']}
                icon={<AlertCircle className="h-4 w-4" />}
              />
              <TabButton
                label="En cours"
                isActive={activeTab === 'en-cours'}
                onClick={() => setActiveTab('en-cours')}
                count={counts['en-cours']}
                icon={<RefreshCw className="h-4 w-4" />}
              />
              <TabButton
                label="En révision"
                isActive={activeTab === 'en-revision'}
                onClick={() => setActiveTab('en-revision')}
                count={counts['en-revision']}
                icon={<FileText className="h-4 w-4" />}
              />
              <TabButton
                label="Terminés"
                isActive={activeTab === 'termines'}
                onClick={() => setActiveTab('termines')}
                count={counts['termines']}
                icon={<CheckCircle className="h-4 w-4" />}
              />
            </div>
          </div>

          <CardContent>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {filteredTickets.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <TicketIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>Aucun ticket dans cette catégorie.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredTickets.map((ticket) => (
                      <div
                        key={ticket.idTicket}
                        className={`bg-white border p-4 hover:shadow-md transition-shadow cursor-pointer ${
                          ticket.phase === PhaseTicket.EN_COURS
                            ? 'border-blue-300 shadow-md'
                            : ticket.phase === PhaseTicket.EN_REVISION
                            ? 'border-orange-300'
                            : 'border-gray-200'
                        }`}
                        onClick={() => setSelectedTicket(ticket.idTicket)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <TicketIcon className="h-5 w-5 text-gray-400" />
                              <h4 className="font-medium text-gray-900">{ticket.titre}</h4>
                              <Badge className={`text-xs ${getPhaseBadgeColor(ticket.phase)}`}>
                                {getPhaseLabel(ticket.phase)}
                              </Badge>
                              <Badge className={`text-xs ${getPrioriteColor(ticket.priorite)}`}>
                                {ticket.priorite}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {ticket.description}
                            </p>
                            
                            {/* Barre de progression */}
                            <div className="mb-3">
                              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                <span>Progression</span>
                                <span>{ticket.progression}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all ${
                                    ticket.phase === PhaseTicket.EN_REVISION
                                      ? 'bg-orange-500'
                                      : ticket.phase === PhaseTicket.TERMINE
                                      ? 'bg-green-500'
                                      : 'bg-primary'
                                  }`}
                                  style={{ width: `${ticket.progression}%` }}
                                />
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {ticket.dateCreation.toLocaleDateString('fr-FR')}
                              </span>
                              {ticket.dateEcheance && (
                                <span className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  Échéance: {ticket.dateEcheance.toLocaleDateString('fr-FR')}
                                </span>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTicket(ticket.idTicket);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Voir le détail
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Modal de consultation du ticket */}
        {ticketDetail && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedTicket(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {ticketDetail.titre}
                    </h2>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={getPhaseBadgeColor(ticketDetail.phase)}>
                        {getPhaseLabel(ticketDetail.phase)}
                      </Badge>
                      <Badge className={getPrioriteColor(ticketDetail.priorite)}>
                        {ticketDetail.priorite}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTicket(null)}
                  >
                    ×
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
                    <p className="text-sm text-gray-600">{ticketDetail.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-1">Date de création</h3>
                      <p className="text-sm text-gray-600">
                        {ticketDetail.dateCreation.toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    {ticketDetail.dateEcheance && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-1">Échéance</h3>
                        <p className="text-sm text-gray-600">
                          {ticketDetail.dateEcheance.toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Progression</h3>
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Avancement</span>
                      <span>{ticketDetail.progression}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          ticketDetail.phase === PhaseTicket.EN_REVISION
                            ? 'bg-orange-500'
                            : ticketDetail.phase === PhaseTicket.TERMINE
                            ? 'bg-green-500'
                            : 'bg-primary'
                        }`}
                        style={{ width: `${ticketDetail.progression}%` }}
                      />
                    </div>
                  </div>

                  {ticketDetail.livrables && ticketDetail.livrables.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Livrables</h3>
                      <div className="space-y-2">
                        {ticketDetail.livrables.map((livrable, index) => (
                          <div
                            key={index}
                            className="p-3 bg-gray-50 border border-gray-200 rounded"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {livrable.nomFichier}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Version {livrable.version} - {livrable.dateSubmission.toLocaleDateString('fr-FR')}
                                </p>
                              </div>
                              <Badge className={
                                livrable.statut === 'VALIDE'
                                  ? 'bg-green-50 text-green-700 border-green-200'
                                  : livrable.statut === 'REJETE'
                                  ? 'bg-red-50 text-red-700 border-red-200'
                                  : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                              }>
                                {livrable.statut}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <Button onClick={() => setSelectedTicket(null)}>
                    Fermer
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tickets;

