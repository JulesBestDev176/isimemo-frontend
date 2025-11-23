import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  ArrowRight,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { formatDate, formatDateTime } from './utils';
import { StatutDossierMemoire, EtapeDossier, PhaseTicket, getTicketsByEncadrement } from '../../models';
import type { Encadrement } from '../../models';
import type { Message } from './MessageList';
import type { TacheCommune } from './TacheCommuneList';
import type { DossierEtudiant } from './DossierEtudiantList';

interface DashboardEncadrantProps {
  encadrement: Encadrement;
  encadrementId: string;
  messages: Message[];
  tachesCommunes: TacheCommune[];
  dossiersEtudiants: DossierEtudiant[];
  onTabChange: (tab: 'messages' | 'taches' | 'dossiers') => void;
}

export const DashboardEncadrant: React.FC<DashboardEncadrantProps> = ({
  encadrement,
  encadrementId,
  messages,
  tachesCommunes,
  dossiersEtudiants,
  onTabChange
}) => {
  const navigate = useNavigate();

  // Calculer les statistiques
  const stats = useMemo(() => {
    const tickets = getTicketsByEncadrement(encadrement.idEncadrement);
    const ticketsEnCours = tickets.filter(t => t.phase === PhaseTicket.EN_COURS).length;
    const ticketsEnRevision = tickets.filter(t => t.phase === PhaseTicket.EN_REVISION).length;
    const ticketsAfaire = tickets.filter(t => t.phase === PhaseTicket.A_FAIRE).length;
    
    const progressionMoyenne = dossiersEtudiants.length > 0
      ? Math.round(dossiersEtudiants.reduce((sum, d) => sum + d.dossierMemoire.progression, 0) / dossiersEtudiants.length)
      : 0;

    const tachesActives = tachesCommunes.filter(t => t.active).length;
    const tachesUrgentes = tachesCommunes.filter(t => 
      t.active && 
      t.priorite === 'Haute' && 
      t.dateEcheance && 
      new Date(t.dateEcheance) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 jours
    ).length;

    const messagesRecents = messages.slice(0, 3);

    return {
      nbEtudiants: dossiersEtudiants.length,
      progressionMoyenne,
      tachesActives,
      tachesUrgentes,
      ticketsEnCours,
      ticketsEnRevision,
      ticketsAfaire,
      messagesRecents
    };
  }, [encadrement.idEncadrement, dossiersEtudiants, tachesCommunes, messages]);

  // Tâches urgentes
  const tachesUrgentes = useMemo(() => {
    return tachesCommunes
      .filter(t => 
        t.active && 
        t.priorite === 'Haute' && 
        t.dateEcheance && 
        new Date(t.dateEcheance) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      )
      .slice(0, 3);
  }, [tachesCommunes]);

  // Dossiers nécessitant attention (progression faible ou statut en attente)
  const dossiersAttention = useMemo(() => {
    return dossiersEtudiants
      .filter(d => 
        d.dossierMemoire.progression < 50 || 
        d.dossierMemoire.statut === StatutDossierMemoire.EN_ATTENTE_VALIDATION
      )
      .slice(0, 3);
  }, [dossiersEtudiants]);

  // Tickets nécessitant attention
  const ticketsAttention = useMemo(() => {
    const tickets = getTicketsByEncadrement(encadrement.idEncadrement);
    return tickets
      .filter(t => t.phase === PhaseTicket.EN_REVISION || t.phase === PhaseTicket.EN_COURS)
      .slice(0, 3);
  }, [encadrement.idEncadrement]);

  return (
    <div className="space-y-6">
      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Étudiants encadrés</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.nbEtudiants}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Progression moyenne</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.progressionMoyenne}%</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tâches actives</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.tachesActives}</p>
              {stats.tachesUrgentes > 0 && (
                <p className="text-xs text-orange-600 mt-1">{stats.tachesUrgentes} urgentes</p>
              )}
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <FileText className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tickets en cours</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.ticketsEnCours + stats.ticketsEnRevision}</p>
              {stats.ticketsEnRevision > 0 && (
                <p className="text-xs text-orange-600 mt-1">{stats.ticketsEnRevision} en révision</p>
              )}
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <AlertCircle className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dossiers nécessitant attention */}
        <div className="bg-white border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Dossiers nécessitant attention</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTabChange('dossiers')}
              className="text-primary"
            >
              Voir tout <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          {dossiersAttention.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              Aucun dossier ne nécessite d'attention particulière.
            </p>
          ) : (
            <div className="space-y-3">
              {dossiersAttention.map((dossier) => (
                <div
                  key={dossier.id}
                  className="p-3 border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/professeur/encadrements/${encadrementId}/dossier/${dossier.dossierMemoire.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">
                        {dossier.etudiant.prenom} {dossier.etudiant.nom}
                      </p>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                        {dossier.dossierMemoire.titre}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          className={
                            dossier.dossierMemoire.statut === StatutDossierMemoire.EN_ATTENTE_VALIDATION
                              ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                              : 'bg-blue-50 text-blue-700 border-blue-200'
                          }
                        >
                          {dossier.dossierMemoire.statut}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {dossier.dossierMemoire.progression}% complété
                        </span>
                      </div>
                    </div>
                    {dossier.dossierMemoire.progression < 50 && (
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tâches urgentes */}
        <div className="bg-white border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tâches urgentes</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTabChange('taches')}
              className="text-primary"
            >
              Voir tout <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          {tachesUrgentes.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              Aucune tâche urgente.
            </p>
          ) : (
            <div className="space-y-3">
              {tachesUrgentes.map((tache) => (
                <div
                  key={tache.id}
                  className="p-3 border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{tache.titre}</p>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {tache.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-red-50 text-red-700 border-red-200">
                          {tache.priorite}
                        </Badge>
                        {tache.dateEcheance && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Échéance: {formatDate(tache.dateEcheance)}
                          </span>
                        )}
                      </div>
                    </div>
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages récents */}
        <div className="bg-white border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Messages récents</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTabChange('messages')}
              className="text-primary"
            >
              Voir tout <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          {stats.messagesRecents.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              Aucun message récent.
            </p>
          ) : (
            <div className="space-y-3">
              {stats.messagesRecents.map((message) => (
                <div
                  key={message.id}
                  className="p-3 border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{message.titre}</p>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {message.contenu}
                      </p>
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDateTime(message.date)}
                      </p>
                    </div>
                    {message.type !== 'texte' && (
                      <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                        {message.type === 'reunion-meet' ? 'Réunion' : 
                         message.type === 'presentiel' ? 'Présentiel' : 
                         message.type === 'document' ? 'Document' : ''}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tickets nécessitant attention */}
        <div className="bg-white border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tickets nécessitant attention</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTabChange('dossiers')}
              className="text-primary"
            >
              Voir tout <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          {ticketsAttention.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              Aucun ticket ne nécessite d'attention.
            </p>
          ) : (
            <div className="space-y-3">
              {ticketsAttention.map((ticket) => {
                const dossier = dossiersEtudiants.find(
                  d => d.dossierMemoire.id === ticket.dossierMemoire?.idDossierMemoire
                );
                return (
                  <div
                    key={ticket.idTicket}
                    className="p-3 border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => {
                      if (dossier) {
                        navigate(`/professeur/encadrements/${encadrementId}/dossier/${dossier.dossierMemoire.id}`);
                      }
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{ticket.titre}</p>
                        {dossier && (
                          <p className="text-xs text-gray-600 mt-1">
                            {dossier.etudiant.prenom} {dossier.etudiant.nom}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            className={
                              ticket.phase === PhaseTicket.EN_REVISION
                                ? 'bg-orange-50 text-orange-700 border-orange-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                            }
                          >
                            {ticket.phase === PhaseTicket.EN_REVISION ? 'En révision' : 'En cours'}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {ticket.progression}% complété
                          </span>
                        </div>
                      </div>
                      {ticket.phase === PhaseTicket.EN_REVISION && (
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="justify-start h-auto p-4"
            onClick={() => onTabChange('messages')}
          >
            <MessageSquare className="h-5 w-5 mr-3 text-primary" />
            <div className="text-left">
              <p className="font-medium">Envoyer un message</p>
              <p className="text-xs text-gray-500">Communiquer avec les étudiants</p>
            </div>
          </Button>
          <Button
            variant="outline"
            className="justify-start h-auto p-4"
            onClick={() => onTabChange('taches')}
          >
            <FileText className="h-5 w-5 mr-3 text-primary" />
            <div className="text-left">
              <p className="font-medium">Ajouter une tâche</p>
              <p className="text-xs text-gray-500">Créer une tâche commune</p>
            </div>
          </Button>
          <Button
            variant="outline"
            className="justify-start h-auto p-4"
            onClick={() => onTabChange('dossiers')}
          >
            <Users className="h-5 w-5 mr-3 text-primary" />
            <div className="text-left">
              <p className="font-medium">Consulter les dossiers</p>
              <p className="text-xs text-gray-500">Voir tous les dossiers étudiants</p>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

