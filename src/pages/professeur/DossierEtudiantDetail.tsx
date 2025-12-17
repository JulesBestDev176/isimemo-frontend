import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  User,
  FileText,
  Calendar,
  Mail,
  GraduationCap,
  BookOpen,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Info,
  Folder,
  MessageSquare,
  Ticket as TicketIcon,
  AlertCircle,
  RefreshCw,
  X,
  Plus,
  Trash2,
  Check,
  XCircle,
  FileText as FileTextIcon,
  ExternalLink,
  Circle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import {
  getEncadrementById,
  getEncadrementsByProfesseur
} from '../../models';
import {
  getDossierById,
  StatutDossierMemoire,
  EtapeDossier,
  DossierMemoire
} from '../../models';
import {
  getDocumentsByDossier,
  StatutDocument,
  TypeDocument
} from '../../models';
import {
  getCandidatById
} from '../../models';
import {
  mockTickets,
  StatutTicket,
  PhaseTicket,
  Priorite,
  Ticket,
  SousTache,
  FeedbackRejet,
  getTicketsByEncadrement,
  hasTicketEnCours
} from '../../models';
import { StatutLivrable } from '../../models';
import {
  NoteSuivi,
  getNotesSuiviByDossier,
  addNoteSuivi
} from '../../models';
import { getAnneeAcademiqueCourante, isAnneeAcademiqueTerminee } from '../../utils/anneeAcademique';

interface TabButtonProps {
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  count?: number;
}

const TabButton: React.FC<TabButtonProps> = ({ children, isActive, onClick, icon, count }) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200
        ${isActive
          ? 'border-primary text-primary bg-white'
          : 'border-transparent text-gray-500 hover:text-primary bg-gray-50'
        }
      `}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
      {count !== undefined && (
        <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${isActive
          ? 'bg-primary-50 text-primary-700'
          : 'bg-gray-200 text-gray-600'
          }`}>
          {count}
        </span>
      )}
    </button>
  );
};

const getStatutLabel = (statut: StatutDossierMemoire) => {
  const statuts: Record<StatutDossierMemoire, string> = {
    [StatutDossierMemoire.EN_CREATION]: 'En création',
    [StatutDossierMemoire.EN_COURS]: 'En cours',
    [StatutDossierMemoire.EN_ATTENTE_VALIDATION]: 'En attente de validation',
    [StatutDossierMemoire.VALIDE]: 'Validé',
    [StatutDossierMemoire.DEPOSE]: 'Déposé',
    [StatutDossierMemoire.SOUTENU]: 'Soutenu'
  };
  return statuts[statut] || statut;
};

const getStatutBadgeColor = (statut: StatutDossierMemoire) => {
  switch (statut) {
    case StatutDossierMemoire.EN_COURS:
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case StatutDossierMemoire.EN_ATTENTE_VALIDATION:
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case StatutDossierMemoire.VALIDE:
      return 'bg-green-50 text-green-700 border-green-200';
    case StatutDossierMemoire.DEPOSE:
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case StatutDossierMemoire.SOUTENU:
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

const getEtapeLabel = (etape: EtapeDossier) => {
  const etapes: Record<EtapeDossier, string> = {
    [EtapeDossier.CHOIX_SUJET]: 'Choix du sujet',
    [EtapeDossier.VALIDATION_SUJET]: 'Validation du sujet',
    [EtapeDossier.EN_COURS_REDACTION]: 'Rédaction en cours',
    [EtapeDossier.DEPOT_INTERMEDIAIRE]: 'Dépôt intermédiaire',
    [EtapeDossier.DEPOT_FINAL]: 'Dépôt final',
    [EtapeDossier.SOUTENANCE]: 'Soutenance',
    [EtapeDossier.TERMINE]: 'Terminé'
  };
  return etapes[etape] || etape;
};

const getDocumentTypeLabel = (type: TypeDocument) => {
  const types: Record<TypeDocument, string> = {
    [TypeDocument.CHAPITRE]: 'Chapitre',
    [TypeDocument.ANNEXE]: 'Annexe',
    [TypeDocument.FICHE_SUIVI]: 'Fiche de suivi',
    [TypeDocument.DOCUMENT_ADMINISTRATIF]: 'Document administratif',
    [TypeDocument.PRESENTATION]: 'Présentation',
    [TypeDocument.AUTRE]: 'Autre'
  };
  return types[type] || type;
};

const getDocumentStatutLabel = (statut: StatutDocument) => {
  const statuts: Record<StatutDocument, string> = {
    [StatutDocument.BROUILLON]: 'Brouillon',
    [StatutDocument.DEPOSE]: 'Déposé',
    [StatutDocument.EN_ATTENTE_VALIDATION]: 'En attente de validation',
    [StatutDocument.VALIDE]: 'Validé',
    [StatutDocument.REJETE]: 'Rejeté',
    [StatutDocument.ARCHIVE]: 'Archivé'
  };
  return statuts[statut] || statut;
};

type TicketFilterTab = 'a-faire' | 'en-cours' | 'en-revision' | 'termines';

const DossierEtudiantDetail: React.FC = () => {
  const { id, dossierId } = useParams<{ id: string; dossierId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'informations' | 'documents' | 'tickets' | 'fiche-suivi'>('informations');
  const [ticketFilterTab, setTicketFilterTab] = useState<TicketFilterTab>('a-faire');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showRejetModal, setShowRejetModal] = useState(false);
  const [rejetCommentaire, setRejetCommentaire] = useState('');
  const [rejetCorrections, setRejetCorrections] = useState<string[]>(['']);
  const [nouvelleNote, setNouvelleNote] = useState('');
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showConfirmPrelectureModal, setShowConfirmPrelectureModal] = useState(false);
  const [showConfirmSoutenanceModal, setShowConfirmSoutenanceModal] = useState(false);


  // Récupérer l'encadrement
  const encadrement = id ? getEncadrementById(parseInt(id)) : null;

  // Vérifier que l'utilisateur est un encadrant ET que l'année académique en cours n'est pas terminée
  // Exception : le chef de département garde toujours son rôle
  const anneeCourante = getAnneeAcademiqueCourante();
  const anneeTerminee = isAnneeAcademiqueTerminee(anneeCourante);
  const estChef = user?.estChef;
  const hasRoleEncadrantActif = user?.estEncadrant && (!anneeTerminee || estChef);

  if (!hasRoleEncadrantActif) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès non autorisé</h2>
          <p className="text-gray-600">
            {anneeTerminee
              ? 'L\'année académique est terminée. Vous n\'avez plus accès aux dossiers étudiants pour cette session.'
              : 'Vous devez être un encadrant pour accéder à cette page.'}
          </p>
        </div>
      </div>
    );
  }

  // Vérifier que l'encadrement existe et appartient à l'utilisateur
  if (!encadrement) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Encadrement introuvable</h2>
          <p className="text-gray-600 mb-4">L'encadrement demandé n'existe pas.</p>
          <Button onClick={() => navigate('/professeur/encadrements')}>
            Retour aux encadrements
          </Button>
        </div>
      </div>
    );
  }

  // Récupérer le dossier
  // Les dossiers étudiants ont maintenant les IDs 101, 102, 103 directement dans mockDossiers
  const dossier = dossierId ? getDossierById(parseInt(dossierId)) : null;

  if (!dossier) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Dossier introuvable</h2>
          <p className="text-gray-600 mb-4">Le dossier demandé n'existe pas.</p>
          <p className="text-sm text-gray-500 mb-4">ID recherché: {dossierId}</p>
          {encadrement.dossierMemoire && (
            <div className="text-xs text-gray-400 mb-4 space-y-1">
              <p>ID Dossier Mémoire: {encadrement.dossierMemoire.idDossierMemoire}</p>
              <p>Candidats disponibles: {encadrement.dossierMemoire.candidats?.map(c => `${c.prenom} ${c.nom} (ID: ${c.idCandidat})`).join(', ') || 'Aucun'}</p>
              {dossierId && (
                <p>ID calculé attendu: {(encadrement.dossierMemoire.idDossierMemoire * 10) + (encadrement.dossierMemoire.candidats?.[0]?.idCandidat || 0)}</p>
              )}
            </div>
          )}
          <Button onClick={() => navigate(`/professeur/encadrements/${id}/panel`)}>
            Retour au panel
          </Button>
        </div>
      </div>
    );
  }

  // Récupérer le candidat (premier candidat du dossier)
  const candidat = dossier.candidats && dossier.candidats.length > 0
    ? dossier.candidats[0]
    : null;

  // Récupérer les documents du dossier
  const documents = getDocumentsByDossier(dossier.idDossierMemoire);

  // Récupérer les notes de suivi pour ce dossier
  const notesSuivi = useMemo(() => {
    return getNotesSuiviByDossier(dossier.idDossierMemoire);
  }, [dossier.idDossierMemoire]);

  // Récupérer les tickets associés à l'encadrement et filtrés par dossier
  const allTickets = useMemo(() => {
    // Utiliser la fonction helper qui trie par phase, puis filtrer par dossier
    const ticketsEncadrement = getTicketsByEncadrement(encadrement.idEncadrement);
    // Filtrer les tickets pour ne garder que ceux associés au dossier actuel
    return ticketsEncadrement.filter(t =>
      t.dossierMemoire?.idDossierMemoire === dossier.idDossierMemoire
    );
  }, [encadrement.idEncadrement, dossier.idDossierMemoire]);

  // Filtrer les tickets par statut selon l'onglet actif
  const tickets = useMemo(() => {
    switch (ticketFilterTab) {
      case 'a-faire':
        return allTickets.filter(t => t.phase === PhaseTicket.A_FAIRE);
      case 'en-cours':
        return allTickets.filter(t => t.phase === PhaseTicket.EN_COURS);
      case 'en-revision':
        return allTickets.filter(t => t.phase === PhaseTicket.EN_REVISION);
      case 'termines':
        return allTickets.filter(t => t.phase === PhaseTicket.TERMINE);
      default:
        return allTickets.filter(t => t.phase === PhaseTicket.A_FAIRE);
    }
  }, [allTickets, ticketFilterTab]);

  // Compter les tickets par phase
  const ticketCounts = useMemo(() => {
    return {
      'a-faire': allTickets.filter(t => t.phase === PhaseTicket.A_FAIRE).length,
      'en-cours': allTickets.filter(t => t.phase === PhaseTicket.EN_COURS).length,
      'en-revision': allTickets.filter(t => t.phase === PhaseTicket.EN_REVISION).length,
      'termines': allTickets.filter(t => t.phase === PhaseTicket.TERMINE).length
    };
  }, [allTickets]);

  // Vérifier si toutes les tâches sont terminées
  const toutesTachesTerminees = useMemo(() => {
    return allTickets.length > 0 && allTickets.every(t => t.phase === PhaseTicket.TERMINE);
  }, [allTickets]);

  // Vérifier si la pré-lecture a été effectuée
  const prelectureEffectuee = dossier.prelectureEffectuee === true;

  // Vérifier s'il y a un ticket EN_COURS
  const ticketEnCours = useMemo(() => {
    return allTickets.find(t => t.phase === PhaseTicket.EN_COURS);
  }, [allTickets]);

  // Fonction pour ajouter une note de suivi
  const handleAjouterNote = () => {
    if (!nouvelleNote.trim()) {
      alert('Veuillez saisir une note de suivi.');
      return;
    }

    if (!user?.id) {
      alert('Erreur : Utilisateur non identifié.');
      return;
    }

    addNoteSuivi({
      contenu: nouvelleNote,
      dossierMemoire: dossier,
      encadrement: encadrement,
      idEncadrant: parseInt(user.id)
    });

    setNouvelleNote('');
    setShowAddNoteModal(false);
    // TODO: Appel API pour sauvegarder la note
  };

  // Fonction pour ouvrir la modal de confirmation de pré-lecture
  const handleOuvrirModalPrelecture = () => {
    if (!toutesTachesTerminees) {
      alert('Toutes les tâches doivent être terminées avant d\'autoriser la pré-lecture.');
      return;
    }
    setShowConfirmPrelectureModal(true);
  };

  // Fonction pour confirmer l'autorisation de pré-lecture
  const handleConfirmAutoriserPrelecture = () => {
    dossier.autorisePrelecture = true;
    dossier.dateModification = new Date();
    setShowConfirmPrelectureModal(false);
    // TODO: Appel API pour mettre à jour le dossier
  };

  // Fonction pour ouvrir la modal de confirmation de soutenance
  const handleOuvrirModalSoutenance = () => {
    if (!prelectureEffectuee) {
      alert('La pré-lecture doit être effectuée avant d\'autoriser la soutenance.');
      return;
    }
    setShowConfirmSoutenanceModal(true);
  };

  // Fonction pour confirmer l'autorisation de soutenance
  const handleConfirmAutoriserSoutenance = () => {
    dossier.autoriseSoutenance = true;
    dossier.dateModification = new Date();
    setShowConfirmSoutenanceModal(false);
    // TODO: Appel API pour mettre à jour le dossier
  };

  // Fonction pour valider un ticket en révision
  const handleValiderTicket = (ticket: Ticket) => {
    // Vérifier que toutes les sous-tâches sont terminées
    if (ticket.sousTaches && ticket.sousTaches.length > 0) {
      const toutesTerminees = ticket.sousTaches.every(st => st.terminee);
      if (!toutesTerminees) {
        alert('Toutes les sous-tâches doivent être terminées avant de valider le ticket.');
        return;
      }
    }

    // Mettre à jour le ticket : passe à TERMINE
    const ticketIndex = mockTickets.findIndex(t => t.idTicket === ticket.idTicket);
    if (ticketIndex !== -1) {
      mockTickets[ticketIndex] = {
        ...mockTickets[ticketIndex],
        statut: StatutTicket.TERMINE,
        phase: PhaseTicket.TERMINE,
        progression: 100
      };

      // Mettre à jour le livrable si présent
      if (mockTickets[ticketIndex].livrables && mockTickets[ticketIndex].livrables!.length > 0) {
        mockTickets[ticketIndex].livrables![0].statut = StatutLivrable.VALIDE;
      }

      // Mettre à jour le ticket sélectionné
      setSelectedTicket(mockTickets[ticketIndex]);
    }
  };

  // Fonction pour rejeter un ticket en révision
  const handleRejeterTicket = () => {
    if (!selectedTicket) return;

    // Vérifier que le commentaire est rempli
    if (!rejetCommentaire.trim()) {
      alert('Veuillez saisir un commentaire de rejet.');
      return;
    }

    // Filtrer les corrections vides
    const correctionsValides = rejetCorrections.filter(c => c.trim() !== '');

    // Mettre à jour le ticket : retourne à EN_COURS avec feedback
    const ticketIndex = mockTickets.findIndex(t => t.idTicket === selectedTicket.idTicket);
    if (ticketIndex !== -1) {
      // Ajouter les corrections comme nouvelles sous-tâches
      const nouvellesSousTaches = [...(selectedTicket.sousTaches || [])];
      const maxId = nouvellesSousTaches.length > 0
        ? Math.max(...nouvellesSousTaches.map(st => st.id))
        : 0;

      correctionsValides.forEach((correction, index) => {
        nouvellesSousTaches.push({
          id: maxId + index + 1,
          titre: correction,
          terminee: false
        });
      });

      // Recalculer la progression
      const etapesTerminees = nouvellesSousTaches.filter(st => st.terminee).length;
      const nouvelleProgression = nouvellesSousTaches.length > 0
        ? Math.round((etapesTerminees / nouvellesSousTaches.length) * 100)
        : 0;

      mockTickets[ticketIndex] = {
        ...mockTickets[ticketIndex],
        statut: StatutTicket.EN_COURS,
        phase: PhaseTicket.EN_COURS,
        estRetourne: true,
        feedbackRejet: {
          dateRetour: new Date(),
          commentaire: rejetCommentaire,
          corrections: correctionsValides
        },
        sousTaches: nouvellesSousTaches,
        progression: nouvelleProgression
      };

      // Mettre à jour le livrable si présent
      if (mockTickets[ticketIndex].livrables && mockTickets[ticketIndex].livrables!.length > 0) {
        mockTickets[ticketIndex].livrables![0].statut = StatutLivrable.REJETE;
      }

      // Fermer les modals et réinitialiser
      setShowRejetModal(false);
      setSelectedTicket(mockTickets[ticketIndex]);
      setRejetCommentaire('');
      setRejetCorrections(['']);
    }
  };

  // Fonction pour ajouter une correction
  const handleAjouterCorrection = () => {
    setRejetCorrections([...rejetCorrections, '']);
  };

  // Fonction pour supprimer une correction
  const handleSupprimerCorrection = (index: number) => {
    setRejetCorrections(rejetCorrections.filter((_, i) => i !== index));
  };

  // Fonction pour mettre à jour une correction
  const handleUpdateCorrection = (index: number, value: string) => {
    const nouvellesCorrections = [...rejetCorrections];
    nouvellesCorrections[index] = value;
    setRejetCorrections(nouvellesCorrections);
  };

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

  // Calculer la progression du dossier basée sur les tickets
  const progression = useMemo(() => {
    if (allTickets.length === 0) return 0;

    // Calculer la progression moyenne des tickets
    // Les tickets terminés comptent pour 100%, les autres utilisent leur progression
    const progressionTotale = allTickets.reduce((sum, ticket) => {
      if (ticket.phase === PhaseTicket.TERMINE) {
        return sum + 100;
      } else {
        return sum + ticket.progression;
      }
    }, 0);

    return Math.round(progressionTotale / allTickets.length);
  }, [allTickets]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bouton retour */}
        <Button
          variant="ghost"
          onClick={() => navigate(`/professeur/encadrements`)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au panel
        </Button>



        {/* Onglets */}
        <Card>
          <div className="border-b border-gray-200">
            <div className="flex">
              <TabButton
                isActive={activeTab === 'informations'}
                onClick={() => setActiveTab('informations')}
                icon={<Info className="h-4 w-4" />}
              >
                Informations
              </TabButton>
              <TabButton
                isActive={activeTab === 'documents'}
                onClick={() => setActiveTab('documents')}
                icon={<Folder className="h-4 w-4" />}
                count={documents.length}
              >
                Documents
              </TabButton>
              <TabButton
                isActive={activeTab === 'tickets'}
                onClick={() => setActiveTab('tickets')}
                icon={<TicketIcon className="h-4 w-4" />}
                count={tickets.length}
              >
                Tickets
              </TabButton>
              <TabButton
                isActive={activeTab === 'fiche-suivi'}
                onClick={() => setActiveTab('fiche-suivi')}
                icon={<FileTextIcon className="h-4 w-4" />}
                count={notesSuivi.length}
              >
                Fiche de suivi
              </TabButton>
            </div>
          </div>

          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'informations' && (
                <motion.div
                  key="informations"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="space-y-6">
                    {/* Informations du candidat */}
                    {candidat && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations de l'étudiant</h3>
                        <div className="bg-white border border-gray-200 p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Nom complet</p>
                              <p className="text-sm font-medium text-gray-900">
                                {candidat.prenom} {candidat.nom}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Email</p>
                              <p className="text-sm font-medium text-gray-900">{candidat.email}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Numéro matricule</p>
                              <p className="text-sm font-medium text-gray-900">{candidat.numeroMatricule}</p>
                            </div>
                            {candidat.niveau && (
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Niveau</p>
                                <p className="text-sm font-medium text-gray-900">{candidat.niveau}</p>
                              </div>
                            )}
                            {candidat.filiere && (
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Filière</p>
                                <p className="text-sm font-medium text-gray-900">{candidat.filiere}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Informations du dossier */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations du dossier</h3>
                      <div className="bg-white border border-gray-200 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Titre</p>
                            <p className="text-sm font-medium text-gray-900">{dossier.titre}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Description</p>
                            <p className="text-sm font-medium text-gray-900">{dossier.description}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Statut</p>
                            <Badge className={getStatutBadgeColor(dossier.statut)}>
                              {getStatutLabel(dossier.statut)}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Étape</p>
                            <Badge variant="outline">{getEtapeLabel(dossier.etape)}</Badge>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Date de création</p>
                            <p className="text-sm font-medium text-gray-900">
                              {dossier.dateCreation.toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Dernière modification</p>
                            <p className="text-sm font-medium text-gray-900">
                              {dossier.dateModification.toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                          {dossier.anneeAcademique && (
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Année académique</p>
                              <p className="text-sm font-medium text-gray-900">{dossier.anneeAcademique}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Autorisation de soutenance</p>
                            <p className="text-sm font-medium text-gray-900">
                              {dossier.autoriseSoutenance ? (
                                <span className="text-green-600">Autorisée</span>
                              ) : (
                                <span className="text-red-600">Non autorisée</span>
                              )}
                            </p>
                          </div>
                          {dossier.autorisePrelecture !== undefined && (
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Autorisation de pré-lecture</p>
                              <p className="text-sm font-medium text-gray-900">
                                {dossier.autorisePrelecture ? (
                                  <span className="text-green-600">Autorisée</span>
                                ) : (
                                  <span className="text-red-600">Non autorisée</span>
                                )}
                              </p>
                            </div>
                          )}
                          {dossier.prelectureEffectuee !== undefined && (
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Pré-lecture effectuée</p>
                              <p className="text-sm font-medium text-gray-900">
                                {dossier.prelectureEffectuee ? (
                                  <span className="text-green-600">Oui</span>
                                ) : (
                                  <span className="text-gray-600">Non</span>
                                )}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions d'autorisation */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions d'autorisation</h3>
                      <div className="bg-white border border-gray-200 p-6 space-y-4">
                        {toutesTachesTerminees && !dossier.autorisePrelecture && (
                          <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded">
                            <div>
                              <p className="font-medium text-gray-900 mb-1">Autoriser la pré-lecture</p>
                              <p className="text-sm text-gray-600">
                                Toutes les tâches sont terminées. Vous pouvez autoriser la pré-lecture.
                              </p>
                            </div>
                            <Button
                              onClick={handleOuvrirModalPrelecture}
                              className="bg-primary hover:bg-primary-dark text-white"
                            >
                              Autoriser pré-lecture
                            </Button>
                          </div>
                        )}
                        {prelectureEffectuee && !dossier.autoriseSoutenance && (
                          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded">
                            <div>
                              <p className="font-medium text-gray-900 mb-1">Autoriser la soutenance</p>
                              <p className="text-sm text-gray-600">
                                La pré-lecture a été effectuée. Vous pouvez autoriser la soutenance.
                              </p>
                            </div>
                            <Button
                              onClick={handleOuvrirModalSoutenance}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Autoriser soutenance
                            </Button>
                          </div>
                        )}
                        {!toutesTachesTerminees && !prelectureEffectuee && (
                          <div className="p-4 bg-gray-50 border border-gray-200 rounded">
                            <p className="text-sm text-gray-600">
                              Les actions d'autorisation seront disponibles lorsque toutes les conditions seront remplies.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'documents' && (
                <motion.div
                  key="documents"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="space-y-4">
                    {documents.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <Folder className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p>Aucun document disponible pour ce dossier.</p>
                      </div>
                    ) : (
                      documents.map((document) => (
                        <div
                          key={document.idDocument}
                          className="bg-white border border-gray-200 p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <FileText className="h-5 w-5 text-gray-400" />
                                <h4 className="font-medium text-gray-900">{document.titre}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {getDocumentTypeLabel(document.typeDocument)}
                                </Badge>
                                <Badge className={`text-xs ${document.statut === StatutDocument.VALIDE
                                  ? 'bg-green-50 text-green-700 border-green-200'
                                  : document.statut === StatutDocument.EN_ATTENTE_VALIDATION
                                    ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                    : document.statut === StatutDocument.REJETE
                                      ? 'bg-red-50 text-red-700 border-red-200'
                                      : 'bg-gray-50 text-gray-700 border-gray-200'
                                  }`}>
                                  {getDocumentStatutLabel(document.statut)}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {document.dateCreation.toLocaleDateString('fr-FR')}
                                </span>
                                {document.commentaire && (
                                  <span className="text-gray-500 italic">{document.commentaire}</span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // TODO: Implémenter la visualisation du document
                                  console.log('Voir document:', document.cheminFichier);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Voir
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // TODO: Implémenter le téléchargement
                                  console.log('Télécharger document:', document.cheminFichier);
                                }}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Télécharger
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'tickets' && (
                <motion.div
                  key="tickets"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Onglets de filtrage par statut */}
                  <div className="mb-6 border-b border-gray-200">
                    <div className="flex space-x-1 -mb-px">
                      <TabButton
                        isActive={ticketFilterTab === 'a-faire'}
                        onClick={() => setTicketFilterTab('a-faire')}
                        count={ticketCounts['a-faire']}
                        icon={<AlertCircle className="h-4 w-4" />}
                      >
                        À faire
                      </TabButton>
                      <TabButton
                        isActive={ticketFilterTab === 'en-cours'}
                        onClick={() => setTicketFilterTab('en-cours')}
                        count={ticketCounts['en-cours']}
                        icon={<RefreshCw className="h-4 w-4" />}
                      >
                        En cours
                      </TabButton>
                      <TabButton
                        isActive={ticketFilterTab === 'en-revision'}
                        onClick={() => setTicketFilterTab('en-revision')}
                        count={ticketCounts['en-revision']}
                        icon={<FileText className="h-4 w-4" />}
                      >
                        En révision
                      </TabButton>
                      <TabButton
                        isActive={ticketFilterTab === 'termines'}
                        onClick={() => setTicketFilterTab('termines')}
                        count={ticketCounts['termines']}
                        icon={<CheckCircle className="h-4 w-4" />}
                      >
                        Terminés
                      </TabButton>
                    </div>
                  </div>



                  <div className="space-y-4">
                    {tickets.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <TicketIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p>Aucun ticket disponible pour ce dossier.</p>
                      </div>
                    ) : (
                      tickets.map((ticket) => (
                        <div
                          key={ticket.idTicket}
                          className={`bg-white border p-4 hover:shadow-md transition-shadow cursor-pointer ${ticket.phase === PhaseTicket.EN_COURS
                            ? 'border-blue-300 shadow-md'
                            : ticket.phase === PhaseTicket.EN_REVISION
                              ? 'border-orange-300'
                              : 'border-gray-200'
                            }`}
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <TicketIcon className="h-5 w-5 text-gray-400" />
                                <h4 className="font-medium text-gray-900">{ticket.titre}</h4>
                                <Badge className={`text-xs ${getPhaseBadgeColor(ticket.phase)}`}>
                                  {getPhaseLabel(ticket.phase)}
                                </Badge>
                                <Badge className={`text-xs ${ticket.priorite === 'URGENTE'
                                  ? 'bg-red-50 text-red-700 border-red-200'
                                  : ticket.priorite === 'HAUTE'
                                    ? 'bg-orange-50 text-orange-700 border-orange-200'
                                    : ticket.priorite === 'MOYENNE'
                                      ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                      : 'bg-blue-50 text-blue-700 border-blue-200'
                                  }`}>
                                  {ticket.priorite}
                                </Badge>
                                {ticket.phase === PhaseTicket.EN_COURS && (
                                  <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-xs">
                                    Ticket actif
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{ticket.description}</p>

                              {/* Barre de progression */}
                              <div className="mb-3">
                                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                  <span>Progression</span>
                                  <span>{ticket.progression}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full transition-all ${ticket.phase === PhaseTicket.EN_REVISION
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
                                setSelectedTicket(ticket);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Consulter
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'fiche-suivi' && (
                <motion.div
                  key="fiche-suivi"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="space-y-6">
                    {/* En-tête avec bouton d'ajout */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Fiche de suivi</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Historique des notes de suivi pour ce dossier
                        </p>
                      </div>
                      <Button
                        onClick={() => setShowAddNoteModal(true)}
                        className="bg-primary hover:bg-primary-dark text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter une note
                      </Button>
                    </div>

                    {/* Liste des notes de suivi */}
                    {notesSuivi.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 border border-gray-200 rounded">
                        <FileTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">Aucune note de suivi pour le moment</p>
                        <p className="text-sm text-gray-500">
                          Cliquez sur "Ajouter une note" pour commencer le suivi
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {notesSuivi.map((note) => (
                          <div
                            key={note.idNoteSuivi}
                            className="bg-white border border-gray-200 p-6 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary-50 rounded-lg">
                                  <FileTextIcon className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    Note de suivi #{note.idNoteSuivi}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {note.dateCreation.toLocaleDateString('fr-FR', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                    {note.dateModification && (
                                      <span className="ml-2">
                                        (modifiée le {note.dateModification.toLocaleDateString('fr-FR', {
                                          day: 'numeric',
                                          month: 'long',
                                          year: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })})
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4">
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                {note.contenu}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Modal de consultation du ticket */}
        {selectedTicket && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedTicket(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
                <h2 className="text-2xl font-bold text-gray-900">Détails du ticket</h2>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Titre et badges */}
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">{selectedTicket.titre}</h3>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={getPhaseBadgeColor(selectedTicket.phase)}>
                        {getPhaseLabel(selectedTicket.phase)}
                      </Badge>
                      <Badge className={`${selectedTicket.priorite === Priorite.URGENTE
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : selectedTicket.priorite === Priorite.HAUTE
                          ? 'bg-orange-50 text-orange-700 border-orange-200'
                          : selectedTicket.priorite === Priorite.MOYENNE
                            ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                        {selectedTicket.priorite}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700">{selectedTicket.description}</p>
                </div>

                {/* Consigne */}
                {selectedTicket.consigne && (
                  <div className="bg-blue-50 border border-blue-200 p-4">
                    <div className="flex items-start space-x-2">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">Consigne</h4>
                        <p className="text-blue-800 text-sm">{selectedTicket.consigne}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sous-tâches */}
                {selectedTicket.sousTaches && selectedTicket.sousTaches.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Sous-tâches ({selectedTicket.sousTaches.filter(st => st.terminee).length} / {selectedTicket.sousTaches.length} terminées)
                    </h4>
                    <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                      {selectedTicket.sousTaches.map((sousTache) => (
                        <div
                          key={sousTache.id}
                          className={`flex items-center space-x-3 p-3 bg-gray-50 transition-colors ${sousTache.terminee ? 'opacity-75' : ''
                            }`}
                        >
                          {sousTache.terminee ? (
                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          )}
                          <span className={`flex-1 ${sousTache.terminee ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                            {sousTache.titre}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Progression */}
                <div className="bg-gray-50 border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progression</span>
                    <span className="text-sm font-bold text-gray-900">{selectedTicket.progression}%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-3">
                    <div
                      className={`h-3 transition-all duration-300 ${selectedTicket.phase === PhaseTicket.EN_REVISION
                        ? 'bg-orange-500'
                        : selectedTicket.phase === PhaseTicket.TERMINE
                          ? 'bg-green-500'
                          : 'bg-primary'
                        }`}
                      style={{ width: `${selectedTicket.progression}%` }}
                    ></div>
                  </div>
                </div>

                {/* Informations */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Informations</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Date de création</p>
                        <p className="font-medium text-gray-900">
                          {selectedTicket.dateCreation.toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    {selectedTicket.dateEcheance && (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Date d'échéance</p>
                          <p className="font-medium text-gray-900">
                            {selectedTicket.dateEcheance.toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Livrable - Un seul livrable par ticket (écrase le précédent) */}
                {selectedTicket.livrables && selectedTicket.livrables.length > 0 && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      {selectedTicket.phase === PhaseTicket.EN_REVISION
                        ? 'Document envoyé en révision'
                        : 'Livrable'}
                    </h4>
                    {/* Afficher uniquement le dernier livrable (le plus récent) */}
                    {(() => {
                      const livrable = selectedTicket.livrables![selectedTicket.livrables!.length - 1];
                      return (
                        <div
                          className={`p-4 bg-gray-50 border ${selectedTicket.phase === PhaseTicket.EN_REVISION
                            ? 'border-orange-200 bg-orange-50'
                            : 'border-gray-200'
                            }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 flex-1">
                              <div className="w-12 h-12 bg-primary flex items-center justify-center">
                                <FileTextIcon className="h-6 w-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {livrable.nomFichier}
                                </p>
                                <div className="flex items-center space-x-4 mt-1 text-xs text-gray-600">
                                  <span>Déposé le {livrable.dateSubmission.toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={
                                livrable.statut === StatutLivrable.VALIDE
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : livrable.statut === StatutLivrable.REJETE
                                    ? 'bg-gray-50 text-gray-700 border-gray-200'
                                    : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                              }>
                                {livrable.statut === StatutLivrable.VALIDE ? 'Validé' :
                                  livrable.statut === StatutLivrable.REJETE ? 'Rejeté' :
                                    livrable.statut === StatutLivrable.EN_ATTENTE_VALIDATION ? 'En attente' :
                                      'Déposé'}
                              </Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // Ouvrir le livrable dans un nouvel onglet pour visualisation
                                  window.open(livrable.cheminFichier, '_blank');
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Visualiser
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // Simuler le téléchargement
                                  const link = document.createElement('a');
                                  link.href = livrable.cheminFichier;
                                  link.download = livrable.nomFichier;
                                  link.click();
                                }}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Télécharger
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                    {selectedTicket.phase === PhaseTicket.EN_REVISION && (
                      <p className="text-xs text-gray-500 mt-2">
                        Ce document est en cours de révision. Vous pouvez le consulter, le valider ou le rejeter.
                      </p>
                    )}
                  </div>
                )}

                {/* Feedback de rejet si le ticket a été retourné */}
                {selectedTicket.estRetourne && selectedTicket.feedbackRejet && (
                  <div className="bg-blue-50 border-2 border-blue-300 p-4">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-blue-900">Ticket retourné pour révision</h4>
                          <span className="text-xs text-blue-700">
                            {selectedTicket.feedbackRejet.dateRetour.toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-blue-800 text-sm mb-2">{selectedTicket.feedbackRejet.commentaire}</p>
                        {selectedTicket.feedbackRejet.corrections.length > 0 && (
                          <div>
                            <p className="text-xs text-blue-700 font-semibold mb-1">Corrections à apporter :</p>
                            <ul className="list-disc list-inside text-xs text-blue-700 space-y-1">
                              {selectedTicket.feedbackRejet.corrections.map((correction, index) => (
                                <li key={index}>{correction}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-between items-center">
                <div>
                  {selectedTicket.phase === PhaseTicket.EN_REVISION && (
                    <p className="text-xs text-gray-500">
                      Vérifiez que toutes les sous-tâches sont terminées avant de valider.
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  {selectedTicket.phase === PhaseTicket.EN_REVISION && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => {
                          // Vérifier que toutes les sous-tâches sont terminées
                          if (selectedTicket.sousTaches && selectedTicket.sousTaches.length > 0) {
                            const toutesTerminees = selectedTicket.sousTaches.every(st => st.terminee);
                            if (!toutesTerminees) {
                              alert('Toutes les sous-tâches doivent être terminées avant de valider le ticket.');
                              return;
                            }
                          }
                          handleValiderTicket(selectedTicket);
                        }}
                        className="bg-primary hover:bg-primary-dark text-white"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Valider
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowRejetModal(true)}
                        className="bg-gray-600 hover:bg-gray-700 text-white"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rejeter
                      </Button>
                    </>
                  )}
                  <Button onClick={() => setSelectedTicket(null)}>
                    Fermer
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Modal de rejet */}
        {showRejetModal && selectedTicket && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowRejetModal(false);
              setRejetCommentaire('');
              setRejetCorrections(['']);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Rejeter le ticket</h2>
                <button
                  onClick={() => {
                    setShowRejetModal(false);
                    setRejetCommentaire('');
                    setRejetCorrections(['']);
                  }}
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedTicket.titre}</h3>
                  <p className="text-sm text-gray-600">{selectedTicket.description}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Commentaire de rejet <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={rejetCommentaire}
                    onChange={(e) => setRejetCommentaire(e.target.value)}
                    placeholder="Expliquez pourquoi le ticket est rejeté et ce qui doit être corrigé..."
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-900">
                      Corrections à apporter (seront ajoutées comme nouvelles sous-tâches)
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAjouterCorrection}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {rejetCorrections.map((correction, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={correction}
                          onChange={(e) => handleUpdateCorrection(index, e.target.value)}
                          placeholder={`Correction ${index + 1}...`}
                          className="flex-1"
                        />
                        {rejetCorrections.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleSupprimerCorrection(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRejetModal(false);
                    setRejetCommentaire('');
                    setRejetCorrections(['']);
                  }}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleRejeterTicket}
                  className="bg-gray-600 hover:bg-gray-700 text-white"
                  disabled={!rejetCommentaire.trim()}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Rejeter le ticket
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Modal pour ajouter une note de suivi */}
        {showAddNoteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-gray-200 p-6 max-w-2xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Ajouter une note de suivi</h3>
                <button
                  onClick={() => {
                    setShowAddNoteModal(false);
                    setNouvelleNote('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note de suivi
                </label>
                <Textarea
                  value={nouvelleNote}
                  onChange={(e) => setNouvelleNote(e.target.value)}
                  placeholder="Saisissez votre note de suivi concernant l'avancement du dossier..."
                  className="min-h-[150px]"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Cette note sera ajoutée à la fiche de suivi du dossier et sera visible dans l'historique.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddNoteModal(false);
                    setNouvelleNote('');
                  }}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleAjouterNote}
                  className="bg-primary hover:bg-primary-dark text-white"
                  disabled={!nouvelleNote.trim()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter la note
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Modal pour ajouter une note de suivi */}
        {showAddNoteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-gray-200 p-6 max-w-2xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Ajouter une note de suivi</h3>
                <button
                  onClick={() => {
                    setShowAddNoteModal(false);
                    setNouvelleNote('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note de suivi
                </label>
                <Textarea
                  value={nouvelleNote}
                  onChange={(e) => setNouvelleNote(e.target.value)}
                  placeholder="Saisissez votre note de suivi concernant l'avancement du dossier..."
                  className="min-h-[150px]"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Cette note sera ajoutée à la fiche de suivi du dossier et sera visible dans l'historique.
                </p>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddNoteModal(false);
                    setNouvelleNote('');
                  }}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleAjouterNote}
                  className="bg-primary hover:bg-primary-dark text-white"
                  disabled={!nouvelleNote.trim()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter la note
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Modal de confirmation pour autoriser la pré-lecture */}
        {showConfirmPrelectureModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-gray-200 p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Confirmer l'autorisation</h3>
                <button
                  onClick={() => setShowConfirmPrelectureModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-700 mb-4">
                  Êtes-vous sûr de vouloir autoriser la pré-lecture pour ce dossier ?
                </p>
                {candidat && (
                  <div className="bg-gray-50 border border-gray-200 p-3 rounded">
                    <p className="text-xs text-gray-500 mb-1">Étudiant</p>
                    <p className="text-sm font-medium text-gray-900">
                      {candidat.prenom} {candidat.nom}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Dossier : {dossier.titre}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmPrelectureModal(false)}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleConfirmAutoriserPrelecture}
                  className="bg-primary hover:bg-primary-dark text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirmer
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Modal de confirmation pour autoriser la soutenance */}
        {showConfirmSoutenanceModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-gray-200 p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Confirmer l'autorisation</h3>
                <button
                  onClick={() => setShowConfirmSoutenanceModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-700 mb-4">
                  Êtes-vous sûr de vouloir autoriser la soutenance pour ce dossier ?
                </p>
                {candidat && (
                  <div className="bg-gray-50 border border-gray-200 p-3 rounded">
                    <p className="text-xs text-gray-500 mb-1">Étudiant</p>
                    <p className="text-sm font-medium text-gray-900">
                      {candidat.prenom} {candidat.nom}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Dossier : {dossier.titre}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmSoutenanceModal(false)}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleConfirmAutoriserSoutenance}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirmer
                </Button>
              </div>
            </motion.div>
          </div>
        )}


      </div>
    </div>
  );
};

export default DossierEtudiantDetail;

