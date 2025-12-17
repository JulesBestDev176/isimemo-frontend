import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import {
  getEncadrementById,
  StatutEncadrement,
  getEncadrementsByProfesseur
} from '../../models';
import {
  StatutDossierMemoire,
  EtapeDossier
} from '../../models';
import { PanelHeader } from '../../components/panel-encadrant/PanelHeader';
import { PanelTabs } from '../../components/panel-encadrant/PanelTabs';
import { MessageList, Message } from '../../components/panel-encadrant/MessageList';
import { TacheCommuneList, TacheCommune } from '../../components/panel-encadrant/TacheCommuneList';
import { DossierEtudiantList, DossierEtudiant } from '../../components/panel-encadrant/DossierEtudiantList';
import { AddTacheModal, NewTache } from '../../components/panel-encadrant/AddTacheModal';
import { PrelectureList } from '../../components/panel-encadrant/PrelectureList';
import { PrelectureDetail } from '../../components/panel-encadrant/PrelectureDetail';
import {
  getDemandesPrelectureByPrelecteur,
  getDemandesPrelectureRejetees,
  validerPrelecture,
  rejeterPrelecture,
  StatutDemandePrelecture
} from '../../models/dossier/DemandePrelecture';
import { createTicketForDossier, Priorite } from '../../models/dossier/Ticket';
import { getDossierById } from '../../models/dossier/DossierMemoire';
import { getAnneeAcademiqueCourante, isAnneeAcademiqueTerminee } from '../../utils/anneeAcademique';

const PanelEncadrant: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'messages' | 'taches' | 'dossiers' | 'prelecture'>('messages');
  const [showTacheModal, setShowTacheModal] = useState(false);
  const [selectedPrelecture, setSelectedPrelecture] = useState<number | null>(null);

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
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès restreint</h2>
          <p className="text-gray-600 mb-4">
            {anneeTerminee
              ? 'L\'année académique est terminée. Vous n\'avez plus accès au panel encadrant pour cette session.'
              : 'Cette page est réservée aux encadrants.'}
          </p>
          <button
            onClick={() => navigate('/professeur/encadrements')}
            className="px-4 py-2 bg-primary text-white hover:bg-primary-700 transition-colors"
          >
            Retour aux encadrements
          </button>
        </div>
      </div>
    );
  }

  if (!encadrement) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Encadrement introuvable</h2>
          <button
            onClick={() => navigate('/professeur/encadrements')}
            className="px-4 py-2 bg-primary text-white hover:bg-primary-700 transition-colors"
          >
            Retour aux encadrements
          </button>
        </div>
      </div>
    );
  }

  // Vérifier que l'encadrant est bien le propriétaire de cet encadrement
  // On vérifie via getEncadrementsByProfesseur pour s'assurer que l'encadrement appartient bien à l'utilisateur
  const encadrementsUtilisateur = getEncadrementsByProfesseur(parseInt(user.id));
  const isOwner = encadrementsUtilisateur.some(e => e.idEncadrement === encadrement.idEncadrement);
  if (!isOwner) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès non autorisé</h2>
          <p className="text-gray-600 mb-4">Vous n'êtes pas autorisé à accéder à cet encadrement.</p>
          <button
            onClick={() => navigate('/professeur/encadrements')}
            className="px-4 py-2 bg-primary text-white hover:bg-primary-700 transition-colors"
          >
            Retour aux encadrements
          </button>
        </div>
      </div>
    );
  }

  // Mock data - Messages (seulement ceux envoyés par l'encadrant, l'étudiant ne peut pas envoyer)
  const messages: Message[] = useMemo(() => [
    {
      id: 1,
      expediteur: 'encadrant',
      type: 'texte',
      contenu: 'Bonjour, j\'ai relu votre chapitre 2. Globalement c\'est bien mais il faut revoir la partie sur les algorithmes.',
      date: '2025-01-20 14:15',
      lu: true,
      titre: 'Feedback sur le chapitre 2'
    },
    {
      id: 2,
      expediteur: 'encadrant',
      type: 'reunion-meet',
      contenu: 'Réunion de suivi programmée pour discuter de l\'avancement de votre mémoire.',
      date: '2025-01-20 10:15',
      lu: true,
      titre: 'Réunion de suivi',
      lienMeet: 'https://meet.google.com/abc-defg-hij',
      dateRendezVous: '2025-01-25',
      heureRendezVous: '14:00'
    },
    {
      id: 3,
      expediteur: 'encadrant',
      type: 'presentiel',
      contenu: 'Pré-lecture programmée. Préparez votre présentation PowerPoint.',
      date: '2025-01-19 10:45',
      lu: false,
      titre: 'Pré-lecture',
      lieu: 'Salle de conférence A, Bâtiment principal',
      dateRendezVous: '2025-02-20',
      heureRendezVous: '10:00'
    },
    {
      id: 4,
      expediteur: 'encadrant',
      type: 'document',
      contenu: 'Document annoté avec mes commentaires sur votre introduction.',
      date: '2025-01-18 16:30',
      lu: false,
      titre: 'Document annoté - Introduction',
      nomDocument: 'Introduction_annotee.pdf',
      cheminDocument: '/documents/introduction_annotee.pdf',
      tailleDocument: '2.4 MB'
    },
    {
      id: 5,
      expediteur: 'encadrant',
      type: 'texte',
      contenu: 'N\'oubliez pas de finaliser l\'état de l\'art avant la prochaine réunion.',
      date: '2025-01-17 14:20',
      lu: true,
      titre: 'Rappel - État de l\'art'
    }
  ], []);

  // Mock data - Tâches communes
  const tachesCommunes: TacheCommune[] = useMemo(() => [
    {
      id: 1,
      titre: 'Finaliser l\'état de l\'art',
      description: 'Compléter la revue de littérature avec au moins 15 références récentes',
      dateCreation: '2025-01-15',
      dateEcheance: '2025-02-01',
      priorite: 'Haute',
      active: true,
      tags: ['recherche', 'bibliographie'],
      consigne: 'Privilégier les articles récents (moins de 5 ans) et les sources académiques reconnues.'
    },
    {
      id: 2,
      titre: 'Rédiger le chapitre méthodologie',
      description: 'Décrire en détail la méthodologie de recherche utilisée',
      dateCreation: '2025-01-10',
      dateEcheance: '2025-02-15',
      priorite: 'Moyenne',
      active: true,
      tags: ['rédaction', 'méthodologie'],
      consigne: 'La méthodologie doit être claire et reproductible.'
    }
  ], []);

  // Mock data - Dossiers étudiants
  const dossiersEtudiants: DossierEtudiant[] = useMemo(() => {
    // Si l'encadrement a des candidats dans son dossier, les utiliser avec des données variées
    if (encadrement.dossierMemoire?.candidats && encadrement.dossierMemoire.candidats.length > 0) {
      const titresMemoires = [
        'Système de recommandation basé sur l\'intelligence artificielle',
        'Application mobile de gestion de bibliothèque universitaire',
        'Analyse de données massives avec Apache Spark',
        'Plateforme de e-learning avec réalité virtuelle',
        'Système de détection de fraudes bancaires par machine learning'
      ];
      const statuts = [
        StatutDossierMemoire.EN_COURS,
        StatutDossierMemoire.EN_COURS,
        StatutDossierMemoire.EN_ATTENTE_VALIDATION,
        StatutDossierMemoire.EN_COURS, // Dossier 104 - Toutes les tâches terminées
        StatutDossierMemoire.EN_ATTENTE_VALIDATION // Dossier 105 - Pré-lecture effectuée
      ];
      const etapes = [
        EtapeDossier.EN_COURS_REDACTION,
        EtapeDossier.DEPOT_INTERMEDIAIRE,
        EtapeDossier.DEPOT_FINAL,
        EtapeDossier.DEPOT_FINAL, // Dossier 104 - Prêt pour pré-lecture
        EtapeDossier.DEPOT_FINAL // Dossier 105 - Pré-lecture effectuée
      ];
      const progressions = [45, 60, 75, 100, 100]; // Dossiers 104 et 105 à 100%

      return encadrement.dossierMemoire.candidats.map((candidat, index) => ({
        id: candidat.idCandidat,
        etudiant: {
          nom: candidat.nom,
          prenom: candidat.prenom,
          email: candidat.email || ''
        },
        dossierMemoire: {
          id: (encadrement.dossierMemoire?.idDossierMemoire || 0) * 10 + candidat.idCandidat,
          titre: titresMemoires[index % titresMemoires.length],
          statut: statuts[index % statuts.length],
          etape: etapes[index % etapes.length],
          progression: progressions[index % progressions.length]
        }
      }));
    }

    // Sinon, utiliser des données mock pour démonstration
    return [
      {
        id: 1,
        etudiant: {
          nom: 'Diallo',
          prenom: 'Amadou',
          email: 'amadou.diallo@isi.edu.sn'
        },
        dossierMemoire: {
          id: 10,
          titre: 'Système de recommandation basé sur l\'intelligence artificielle',
          statut: StatutDossierMemoire.EN_COURS,
          etape: EtapeDossier.EN_COURS_REDACTION,
          progression: 75
        }
      },
      {
        id: 2,
        etudiant: {
          nom: 'Ndiaye',
          prenom: 'Fatou',
          email: 'fatou.ndiaye@isi.edu.sn'
        },
        dossierMemoire: {
          id: 11,
          titre: 'Application mobile de gestion de bibliothèque universitaire',
          statut: StatutDossierMemoire.EN_COURS,
          etape: EtapeDossier.DEPOT_INTERMEDIAIRE,
          progression: 60
        }
      },
      {
        id: 3,
        etudiant: {
          nom: 'Ba',
          prenom: 'Ibrahima',
          email: 'ibrahima.ba@isi.edu.sn'
        },
        dossierMemoire: {
          id: 12,
          titre: 'Analyse de données massives avec Apache Spark',
          statut: StatutDossierMemoire.EN_ATTENTE_VALIDATION,
          etape: EtapeDossier.DEPOT_FINAL,
          progression: 90
        }
      }
    ];
  }, [encadrement]);


  // Handlers
  const handleSendMessage = (messageData: Omit<Message, 'id' | 'date' | 'lu' | 'expediteur'>) => {
    if (!messageData.contenu.trim()) return;
    console.log('Envoi message:', messageData);
    // TODO: Appel API
  };

  const handleAddTache = (tache: NewTache) => {
    console.log('Ajout tâche commune:', tache);
    setShowTacheModal(false);
    // TODO: Appel API
  };

  const handleSupprimerTache = (tacheId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche commune ?')) {
      console.log('Supprimer tâche:', tacheId);
      // TODO: Appel API
    }
  };

  const handleDesactiverTache = (tacheId: number) => {
    console.log('Désactiver/Réactiver tâche:', tacheId);
    // TODO: Appel API
  };

  // Récupérer les demandes de pré-lecture pour l'encadrant connecté (en tant que pré-lecteur)
  const demandesPrelecture = useMemo(() => {
    if (!user?.id) return [];
    const idProfesseur = parseInt(user.id);
    return getDemandesPrelectureByPrelecteur(idProfesseur);
  }, [user?.id]);

  // Récupérer les demandes de pré-lecture rejetées pour l'encadrant principal
  const demandesPrelectureRejetees = useMemo(() => {
    if (!user?.id || !isOwner) return [];
    const idProfesseur = parseInt(user.id);
    return getDemandesPrelectureRejetees(idProfesseur);
  }, [user?.id, isOwner]);

  // Calculer le nombre de demandes en attente
  const prelectureCount = useMemo(() => {
    return demandesPrelecture.filter(d => d.statut === StatutDemandePrelecture.EN_ATTENTE).length;
  }, [demandesPrelecture]);

  // Calculs pour les badges
  const unreadMessagesCount = 0; // L'étudiant ne peut pas envoyer de messages, donc pas de messages non lus

  // Handlers pour la pré-lecture
  const handleConsultPrelecture = (demande: typeof demandesPrelecture[0]) => {
    setSelectedPrelecture(demande.idDemandePrelecture);
  };

  const handleValiderPrelecture = (idDemande: number, commentaire?: string) => {
    validerPrelecture(idDemande, commentaire);
    setSelectedPrelecture(null);
    // TODO: Appel API
  };

  const handleRejeterPrelecture = (idDemande: number, commentaire: string, corrections: string[]) => {
    const demande = demandesPrelecture.find(d => d.idDemandePrelecture === idDemande);
    if (!demande) return;

    rejeterPrelecture(idDemande, commentaire, corrections);

    // Si l'encadrant connecté est l'encadrant principal, créer des tickets spécifiques pour les corrections
    if (isOwner && demande.encadrantPrincipal?.idProfesseur === parseInt(user.id)) {
      const dossier = getDossierById(demande.dossierMemoire.idDossierMemoire);
      if (dossier && encadrement) {
        corrections.forEach((correction, index) => {
          createTicketForDossier(
            encadrement,
            dossier,
            `Correction pré-lecture ${index + 1}: ${correction.substring(0, 50)}...`,
            correction,
            Priorite.HAUTE,
            `Correction demandée suite au rejet de la pré-lecture. ${commentaire}`,
            []
          );
        });
      }
    }

    setSelectedPrelecture(null);
    // TODO: Appel API
  };

  // Extraire la liste des étudiants pour le modal de tâches
  const etudiantsPourModal = useMemo(() => {
    return dossiersEtudiants.map(d => ({
      id: d.id,
      nom: d.etudiant.nom,
      prenom: d.etudiant.prenom
    }));
  }, [dossiersEtudiants]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PanelHeader encadrement={encadrement} encadrementId={id || ''} />

        {/* Onglets */}
        <div className="bg-white border border-gray-200 mb-6">
          <PanelTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            unreadMessagesCount={unreadMessagesCount}
            tachesCount={tachesCommunes.length}
            dossiersCount={dossiersEtudiants.length}
            prelectureCount={prelectureCount}
          />

          {/* Contenu des onglets */}
          <div className="p-6">
            {activeTab === 'messages' && (
              <MessageList messages={messages} onSendMessage={handleSendMessage} />
            )}

            {activeTab === 'taches' && (
              <TacheCommuneList
                taches={tachesCommunes}
                onAddTache={() => setShowTacheModal(true)}
                onSupprimer={handleSupprimerTache}
                onDesactiver={handleDesactiverTache}
                canEdit={isOwner}
              />
            )}

            {activeTab === 'dossiers' && (
              <DossierEtudiantList
                dossiers={dossiersEtudiants}
                encadrementId={id || ''}
              />
            )}

            {activeTab === 'prelecture' && (
              <PrelectureList
                demandes={demandesPrelecture}
                onConsult={handleConsultPrelecture}
              />
            )}
          </div>
        </div>

        {/* Modal de détail de pré-lecture */}
        {selectedPrelecture && demandesPrelecture.find(d => d.idDemandePrelecture === selectedPrelecture) && (
          <PrelectureDetail
            demande={demandesPrelecture.find(d => d.idDemandePrelecture === selectedPrelecture)!}
            onClose={() => setSelectedPrelecture(null)}
            onValider={handleValiderPrelecture}
            onRejeter={handleRejeterPrelecture}
          />
        )}

        {/* Modals */}
        <AddTacheModal
          isOpen={showTacheModal}
          onClose={() => setShowTacheModal(false)}
          onAdd={handleAddTache}
          etudiants={etudiantsPourModal}
        />
      </div>
    </div>
  );
};

export default PanelEncadrant;
