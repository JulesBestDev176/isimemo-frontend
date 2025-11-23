import React, { useState, useMemo, useEffect } from 'react';
import { Users, Search, UserPlus, ArrowRight, X, CheckCircle, XCircle, Bell, Clock, Send, UserCheck, UserX, AlertCircle, BookOpen } from 'lucide-react';
import { DossierMemoire } from '../../../../models/dossier';
import { BinomeOption, PropositionBinome, DemandeBinome } from '../../../../models/pipeline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Badge } from '../../../../components/ui/badge';
import { Separator } from '../../../../components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../components/ui/tabs';
import { useAuth } from '../../../../contexts/AuthContext';
import { Textarea } from '../../../../components/ui/textarea';
import { Label } from '../../../../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui/dialog';

interface EtapeChoixBinomeProps {
  dossier: DossierMemoire;
  onComplete: () => void;
}

// Données mock pour les étudiants disponibles pour binôme
const ETUDIANTS_DISPONIBLES: BinomeOption[] = [
  {
    id: 1,
    nom: 'Diallo',
    prenom: 'Amadou',
    email: 'amadou.diallo@isi.edu.sn',
    numeroMatricule: 'ETU2024002',
    niveau: 'Master 2',
    filiere: 'Informatique',
    departement: 'Département Informatique'
  },
  {
    id: 2,
    nom: 'Ba',
    prenom: 'Mariama',
    email: 'mariama.ba@isi.edu.sn',
    numeroMatricule: 'ETU2024003',
    niveau: 'Master 2',
    filiere: 'Informatique',
    departement: 'Département Informatique'
  },
  {
    id: 3,
    nom: 'Kane',
    prenom: 'Moussa',
    email: 'moussa.kane@isi.edu.sn',
    numeroMatricule: 'ETU2024004',
    niveau: 'Master 2',
    filiere: 'Réseaux',
    departement: 'Département Réseaux'
  },
  {
    id: 4,
    nom: 'Sarr',
    prenom: 'Fatou',
    email: 'fatou.sarr@isi.edu.sn',
    numeroMatricule: 'ETU2024005',
    niveau: 'Master 2',
    filiere: 'Informatique',
    departement: 'Département Informatique'
  },
  {
    id: 5,
    nom: 'Ndiaye',
    prenom: 'Ibrahima',
    email: 'ibrahima.ndiaye@isi.edu.sn',
    numeroMatricule: 'ETU2024006',
    niveau: 'Master 2',
    filiere: 'Informatique',
    departement: 'Département Informatique'
  },
  {
    id: 6,
    nom: 'Sow',
    prenom: 'Aissatou',
    email: 'aissatou.sow@isi.edu.sn',
    numeroMatricule: 'ETU2024007',
    niveau: 'Master 1', // Différent niveau
    filiere: 'Informatique',
    departement: 'Département Informatique'
  },
  {
    id: 7,
    nom: 'Thiam',
    prenom: 'Ousmane',
    email: 'ousmane.thiam@isi.edu.sn',
    numeroMatricule: 'ETU2024008',
    niveau: 'Master 2',
    filiere: 'Réseaux', // Différente filière
    departement: 'Département Réseaux'
  },
  {
    id: 8,
    nom: 'Fall',
    prenom: 'Aminata',
    email: 'aminata.fall@isi.edu.sn',
    numeroMatricule: 'ETU2024009',
    niveau: 'Master 2',
    filiere: 'Informatique',
    departement: 'Département Informatique'
  },
  {
    id: 9,
    nom: 'Cissé',
    prenom: 'Mamadou',
    email: 'mamadou.cisse@isi.edu.sn',
    numeroMatricule: 'ETU2024010',
    niveau: 'Master 2',
    filiere: 'Informatique',
    departement: 'Département Informatique'
  },
  {
    id: 10,
    nom: 'Diouf',
    prenom: 'Khady',
    email: 'khady.diouf@isi.edu.sn',
    numeroMatricule: 'ETU2024011',
    niveau: 'Master 2',
    filiere: 'Informatique',
    departement: 'Département Informatique'
  },
  {
    id: 11,
    nom: 'Sy',
    prenom: 'Modou',
    email: 'modou.sy@isi.edu.sn',
    numeroMatricule: 'ETU2024012',
    niveau: 'Master 2',
    filiere: 'Informatique',
    departement: 'Département Informatique'
  },
  {
    id: 12,
    nom: 'Gueye',
    prenom: 'Awa',
    email: 'awa.gueye@isi.edu.sn',
    numeroMatricule: 'ETU2024013',
    niveau: 'Master 2',
    filiere: 'Informatique',
    departement: 'Département Informatique'
  }
];

// Données mock pour les propositions de binôme reçues
const PROPOSITIONS_RECUES: PropositionBinome[] = [
  {
    id: 1,
    etudiant: {
      id: 4,
      nom: 'Sarr',
      prenom: 'Fatou',
      email: 'fatou.sarr@isi.edu.sn',
      numeroMatricule: 'ETU2024005',
      niveau: 'Master 2',
      filiere: 'Informatique',
      departement: 'Département Informatique'
    },
    dateProposition: new Date('2025-01-10'),
    message: 'Bonjour, je serais intéressé(e) par travailler avec vous sur ce sujet. J\'ai de l\'expérience en développement web et IA.',
    sujetChoisi: {
      id: 1,
      titre: 'Système de gestion de bibliothèque numérique',
      description: 'Développement d\'une plateforme web pour la gestion des emprunts et des ressources numériques'
    },
    statut: 'en_attente'
  },
  {
    id: 2,
    etudiant: {
      id: 5,
      nom: 'Ndiaye',
      prenom: 'Ibrahima',
      email: 'ibrahima.ndiaye@isi.edu.sn',
      numeroMatricule: 'ETU2024006',
      niveau: 'Master 2',
      filiere: 'Informatique',
      departement: 'Département Informatique'
    },
    dateProposition: new Date('2025-01-08'),
    message: 'Salut ! Je cherche un binôme pour mon mémoire. Votre sujet m\'intéresse beaucoup.',
    sujetChoisi: {
      id: 2,
      titre: 'Application mobile de gestion de bibliothèque',
      description: 'Développement d\'une application mobile pour la gestion des emprunts de livres'
    },
    statut: 'en_attente'
  },
  {
    id: 3,
    etudiant: {
      id: 8,
      nom: 'Fall',
      prenom: 'Aminata',
      email: 'aminata.fall@isi.edu.sn',
      numeroMatricule: 'ETU2024009',
      niveau: 'Master 2',
      filiere: 'Informatique',
      departement: 'Département Informatique'
    },
    dateProposition: new Date('2025-01-11'),
    message: 'Bonjour, j\'aimerais collaborer avec vous sur votre mémoire. J\'ai des compétences complémentaires en base de données et backend.',
    sujetChoisi: {
      id: 3,
      titre: 'Système de recommandation intelligent',
      description: 'Développement d\'un système de recommandation basé sur l\'intelligence artificielle'
    },
    statut: 'en_attente'
  },
  {
    id: 4,
    etudiant: {
      id: 9,
      nom: 'Cissé',
      prenom: 'Mamadou',
      email: 'mamadou.cisse@isi.edu.sn',
      numeroMatricule: 'ETU2024010',
      niveau: 'Master 2',
      filiere: 'Informatique',
      departement: 'Département Informatique'
    },
    dateProposition: new Date('2025-01-09'),
    message: 'Je suis intéressé(e) par votre sujet de mémoire. Serait-il possible de travailler ensemble ?',
    sujetChoisi: {
      id: 4,
      titre: 'Plateforme e-learning avec IA',
      description: 'Création d\'une plateforme d\'apprentissage en ligne avec des fonctionnalités d\'IA pour l\'adaptation du contenu'
    },
    statut: 'en_attente'
  }
];

// Données mock pour les demandes envoyées
// Seule une demande peut être en attente, les autres sont annulées ou acceptées
const DEMANDES_ENVOYEES_MOCK: DemandeBinome[] = [
  {
    id: 1,
    etudiantDestinataire: {
      id: 1,
      nom: 'Diallo',
      prenom: 'Amadou',
      email: 'amadou.diallo@isi.edu.sn',
      numeroMatricule: 'ETU2024002',
      niveau: 'Master 2',
      filiere: 'Informatique',
      departement: 'Département Informatique'
    },
    dateEnvoi: new Date('2025-01-12'),
    message: 'Bonjour, je serais intéressé(e) par travailler avec vous sur ce sujet de mémoire. J\'ai de l\'expérience en développement web.',
    sujetChoisi: {
      id: 1,
      titre: 'Système de gestion de bibliothèque numérique',
      description: 'Développement d\'une plateforme web pour la gestion des emprunts et des ressources numériques'
    },
    statut: 'en_attente' // Seule cette demande est en attente
  },
  {
    id: 2,
    etudiantDestinataire: {
      id: 2,
      nom: 'Ba',
      prenom: 'Mariama',
      email: 'mariama.ba@isi.edu.sn',
      numeroMatricule: 'ETU2024003',
      niveau: 'Master 2',
      filiere: 'Informatique',
      departement: 'Département Informatique'
    },
    dateEnvoi: new Date('2025-01-11'),
    message: 'Salut ! Votre profil m\'intéresse pour un travail en binôme sur le mémoire.',
    sujetChoisi: {
      id: 2,
      titre: 'Application mobile de gestion de bibliothèque',
      description: 'Développement d\'une application mobile pour la gestion des emprunts de livres'
    },
    statut: 'refusee' // Cette demande a été refusée
  },
  {
    id: 3,
    etudiantDestinataire: {
      id: 10,
      nom: 'Diouf',
      prenom: 'Khady',
      email: 'khady.diouf@isi.edu.sn',
      numeroMatricule: 'ETU2024011',
      niveau: 'Master 2',
      filiere: 'Informatique',
      departement: 'Département Informatique'
    },
    dateEnvoi: new Date('2025-01-10'),
    message: 'Bonjour, je cherche un binôme pour mon mémoire. Seriez-vous intéressé(e) ?',
    sujetChoisi: {
      id: 3,
      titre: 'Système de recommandation intelligent',
      description: 'Développement d\'un système de recommandation basé sur l\'intelligence artificielle'
    },
    statut: 'refusee' // Cette demande a été refusée
  }
];

const EtapeChoixBinome: React.FC<EtapeChoixBinomeProps> = ({ dossier, onComplete }) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [binomeSelectionne, setBinomeSelectionne] = useState<BinomeOption | null>(null);
  const [optionChoisie, setOptionChoisie] = useState<'avec' | 'sans'>('avec');
  const [activeTab, setActiveTab] = useState<'demandes' | 'recues'>('demandes');
  const [activeSousTab, setActiveSousTab] = useState<'envoyer' | 'etat'>('envoyer');
  const [propositionAConfirmer, setPropositionAConfirmer] = useState<PropositionBinome | null>(null);
  const [showConfirmAccept, setShowConfirmAccept] = useState(false);
  
  // Récupérer le sujet choisi depuis localStorage
  const sujetChoisi = useMemo(() => {
    try {
      const sujetStored = localStorage.getItem(`sujetChoisi_${dossier.idDossierMemoire}`);
      if (sujetStored) {
        return JSON.parse(sujetStored);
      }
    } catch (e) {
      console.error('Erreur lors de la récupération du sujet choisi:', e);
    }
    // Fallback : utiliser le titre du dossier s'il n'est pas "Nouveau dossier de mémoire"
    if (dossier.titre && dossier.titre !== 'Nouveau dossier de mémoire') {
      return {
        titre: dossier.titre,
        description: dossier.description
      };
    }
    return null;
  }, [dossier.idDossierMemoire, dossier.titre, dossier.description]);
  // Initialiser les demandes envoyées avec les données mock
  // S'assurer qu'une seule demande est en attente
  const [demandesEnvoyees, setDemandesEnvoyees] = useState<DemandeBinome[]>(() => {
    // Filtrer et s'assurer qu'une seule demande est en attente
    const demandes = DEMANDES_ENVOYEES_MOCK.map(d => ({ ...d })); // Créer une copie profonde
    const demandesEnAttente = demandes.filter(d => d.statut === 'en_attente');
    // Si plusieurs demandes sont en attente, ne garder que la première et refuser les autres
    if (demandesEnAttente.length > 1) {
      const premiereEnAttente = demandesEnAttente[0];
      return demandes.map(d => 
        d.statut === 'en_attente' && d.id !== premiereEnAttente.id
          ? { ...d, statut: 'refusee' as const }
          : d
      );
    }
    // S'assurer qu'au maximum une demande est en attente
    let countEnAttente = 0;
    return demandes.map(d => {
      if (d.statut === 'en_attente') {
        countEnAttente++;
        if (countEnAttente > 1) {
          return { ...d, statut: 'refusee' as const };
        }
      }
      return d;
    });
  });
  const [etudiantSelectionnePourDemande, setEtudiantSelectionnePourDemande] = useState<BinomeOption | null>(null);
  const [messageDemande, setMessageDemande] = useState('');
  const [showDialogDemande, setShowDialogDemande] = useState(false);

  // Informations de l'étudiant connecté (à remplacer par des données réelles du profil)
  // Pour l'instant, on utilise des valeurs hardcodées pour correspondre aux données mock
  // TODO: Récupérer depuis le profil de l'utilisateur (niveau, filiere, departement)
  const etudiantConnecte = useMemo(() => {
    // Pour un candidat, on utilise toujours les valeurs par défaut qui correspondent aux données mock
    // Cela permet de tester la fonctionnalité même si l'utilisateur a un département différent
    return {
      niveau: 'Master 2',
      filiere: 'Informatique',
      departement: 'Département Informatique'
    };
  }, []);

  // Filtrer les étudiants selon niveau, filière et département
  const etudiantsCompatibles = useMemo(() => {
    return ETUDIANTS_DISPONIBLES.filter(etudiant => 
      etudiant.niveau === etudiantConnecte.niveau &&
      etudiant.filiere === etudiantConnecte.filiere &&
      etudiant.departement === etudiantConnecte.departement
    );
  }, [etudiantConnecte]);

  // Filtrer les propositions reçues selon niveau, filière et département
  const propositionsCompatibles = useMemo(() => {
    return PROPOSITIONS_RECUES.filter(proposition =>
      proposition.etudiant.niveau === etudiantConnecte.niveau &&
      proposition.etudiant.filiere === etudiantConnecte.filiere &&
      proposition.etudiant.departement === etudiantConnecte.departement
    );
  }, [etudiantConnecte]);

  const etudiantsFiltres = useMemo(() => {
    return etudiantsCompatibles.filter(etudiant => {
      const matchesSearch = 
        `${etudiant.prenom} ${etudiant.nom}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        etudiant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        etudiant.numeroMatricule.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [etudiantsCompatibles, searchQuery]);

  // Initialiser les propositions reçues avec les propositions compatibles
  // Utiliser une fonction d'initialisation lazy pour calculer les propositions compatibles au premier rendu
  const [propositionsRecues, setPropositionsRecues] = useState<PropositionBinome[]>(() => {
    // Filtrer les propositions selon les critères de compatibilité
    return PROPOSITIONS_RECUES.filter(proposition =>
      proposition.etudiant.niveau === 'Master 2' &&
      proposition.etudiant.filiere === 'Informatique' &&
      proposition.etudiant.departement === 'Département Informatique'
    );
  });
  
  // Mettre à jour les propositions quand les propositions compatibles changent
  useEffect(() => {
    setPropositionsRecues(propositionsCompatibles);
  }, [propositionsCompatibles]);

  // Trouver la demande en cours (la plus récente en attente ou acceptée)
  const demandeEnCours = useMemo(() => {
    const demandesActives = demandesEnvoyees.filter(d => d.statut === 'en_attente' || d.statut === 'acceptee');
    if (demandesActives.length === 0) return null;
    // Retourner la plus récente
    return demandesActives.sort((a, b) => b.dateEnvoi.getTime() - a.dateEnvoi.getTime())[0];
  }, [demandesEnvoyees]);

  // Si une demande existe et est en attente ou acceptée, afficher le sous-onglet état
  useEffect(() => {
    if (activeTab === 'demandes') {
      if (demandeEnCours && (demandeEnCours.statut === 'en_attente' || demandeEnCours.statut === 'acceptee')) {
        setActiveSousTab('etat');
      } else if (demandeEnCours && demandeEnCours.statut === 'refusee') {
        // Si refusé, retourner à l'onglet envoyer
        setActiveSousTab('envoyer');
      }
    }
  }, [demandeEnCours, activeTab]);

  // Vérifier si l'étudiant a déjà un binôme accepté
  const binomeAccepte = useMemo(() => {
    const propositionAcceptee = propositionsRecues.find(p => p.statut === 'acceptee');
    const demandeAcceptee = demandesEnvoyees.find(d => d.statut === 'acceptee');
    return propositionAcceptee?.etudiant || demandeAcceptee?.etudiantDestinataire || binomeSelectionne;
  }, [propositionsRecues, demandesEnvoyees, binomeSelectionne]);

  // Vérifier si l'étudiant est le "leader" du binôme (celui qui a choisi le sujet et continue le pipeline)
  // Si on accepte une demande reçue, on n'est pas le leader, c'est celui qui a envoyé la demande
  const estLeaderBinome = useMemo(() => {
    const propositionAcceptee = propositionsRecues.find(p => p.statut === 'acceptee');
    const demandeAcceptee = demandesEnvoyees.find(d => d.statut === 'acceptee');
    // Si on a accepté une proposition reçue, on n'est pas le leader
    if (propositionAcceptee) {
      return false;
    }
    // Si notre demande envoyée a été acceptée, on est le leader
    if (demandeAcceptee) {
      return true;
    }
    // Si on a sélectionné un binôme manuellement, on est le leader
    if (binomeSelectionne) {
      return true;
    }
    return false;
  }, [propositionsRecues, demandesEnvoyees, binomeSelectionne]);

  const handleValider = () => {
    if (optionChoisie === 'sans') {
      // Si l'étudiant choisit de travailler seul, il peut continuer
      // TODO: Appel API pour enregistrer le choix
      console.log('Choix binôme: sans binôme');
      onComplete();
    } else if (optionChoisie === 'avec' && binomeAccepte) {
      // Si l'étudiant choisit de travailler en binôme, il doit avoir un binôme accepté
      // Mais seulement s'il est le leader (celui qui a choisi le sujet)
      // Si on a accepté une demande reçue, on ne continue pas, c'est l'autre qui continue
      if (estLeaderBinome) {
        // TODO: Appel API pour enregistrer le choix
        console.log('Choix binôme:', binomeAccepte);
        onComplete();
      } else {
        // Si on n'est pas le leader, on ne peut pas continuer le pipeline
        // L'autre personne (qui a envoyé la demande) doit continuer
        console.log('Binôme accepté, mais vous n\'êtes pas le leader. C\'est votre binôme qui doit continuer le pipeline.');
        // TODO: Afficher un message à l'utilisateur
      }
    }
    // Sinon, on ne fait rien (le bouton est désactivé)
  };

  const handleAccepterProposition = (proposition: PropositionBinome) => {
    // Afficher le modal de confirmation
    setPropositionAConfirmer(proposition);
    setShowConfirmAccept(true);
  };

  const handleConfirmAccept = () => {
    if (!propositionAConfirmer) return;
    
    // TODO: Appel API pour accepter la proposition
    // Un étudiant ne peut avoir qu'un seul binôme accepté
    // Si on accepte une demande reçue, on devient le "suiveur" et on ne continue pas le pipeline
    // C'est celui qui a envoyé la demande (choisi le sujet) qui continue
    setPropositionsRecues(prev => 
      prev.map(p => 
        p.id === propositionAConfirmer.id 
          ? { ...p, statut: 'acceptee' as const }
          : p.statut === 'acceptee' 
          ? { ...p, statut: 'refusee' as const }
          : p
      )
    );
    // Refuser toutes les autres demandes envoyées en attente
    setDemandesEnvoyees(prev => 
      prev.map(d => 
        d.statut === 'en_attente' 
          ? { ...d, statut: 'refusee' as const }
          : d
      )
    );
    setBinomeSelectionne(propositionAConfirmer.etudiant);
    setOptionChoisie('avec');
    // Fermer le modal
    setShowConfirmAccept(false);
    setPropositionAConfirmer(null);
    // Note: On ne continue pas le pipeline ici car on n'est pas le leader
    // C'est celui qui a envoyé la demande qui doit continuer
  };

  const handleRefuserProposition = (proposition: PropositionBinome) => {
    // TODO: Appel API pour refuser la proposition
    setPropositionsRecues(prev => 
      prev.map(p => 
        p.id === proposition.id 
          ? { ...p, statut: 'refusee' as const }
          : p
      )
    );
  };

  const handleEnvoyerDemande = () => {
    if (etudiantSelectionnePourDemande) {
      // Empêcher l'envoi si aucun sujet n'est choisi
      if (!sujetChoisi) {
        // TODO: Afficher un message d'erreur à l'utilisateur
        alert('Vous devez d\'abord choisir un sujet avant d\'envoyer une demande de binôme.');
        return;
      }
      
      // TODO: Appel API pour envoyer la demande
      const nouvelleDemande: DemandeBinome = {
        id: Date.now(),
        etudiantDestinataire: etudiantSelectionnePourDemande,
        dateEnvoi: new Date(),
        message: messageDemande.trim() || undefined,
        sujetChoisi: {
          id: dossier.idDossierMemoire,
          titre: sujetChoisi.titre,
          description: sujetChoisi.description
        },
        statut: 'en_attente'
      };
      // Annuler toutes les autres demandes en attente (on ne peut avoir qu'une seule demande en attente)
      setDemandesEnvoyees(prev => {
        // Annuler toutes les demandes en attente existantes
        const demandesAnnulees = prev.map(d => 
          d.statut === 'en_attente'
            ? { ...d, statut: 'refusee' as const }
            : d
        );
        // Ajouter la nouvelle demande
        return [...demandesAnnulees, nouvelleDemande];
      });
      setShowDialogDemande(false);
      setEtudiantSelectionnePourDemande(null);
      setMessageDemande('');
      // Passer au sous-onglet "État de la demande"
      setActiveSousTab('etat');
    }
  };

  const handleAnnulerDemandeEnCours = () => {
    if (demandeEnCours && demandeEnCours.statut === 'en_attente') {
      // TODO: Appel API pour annuler la demande
      setDemandesEnvoyees(prev => prev.filter(d => d.id !== demandeEnCours.id));
      // Retourner au sous-onglet envoyer
      setActiveSousTab('envoyer');
    }
  };

  const handleAnnulerDemande = (demande: DemandeBinome) => {
    // TODO: Appel API pour annuler la demande
    if (demande.statut === 'en_attente') {
      setDemandesEnvoyees(prev => prev.filter(d => d.id !== demande.id));
    }
  };

  const propositionsEnAttente = useMemo(() => {
    return propositionsRecues.filter(p => p.statut === 'en_attente');
  }, [propositionsRecues]);
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // Filtrer les étudiants qui ont déjà reçu une demande
  const etudiantsDisponiblesPourDemande = useMemo(() => {
    // Exclure seulement ceux à qui on a déjà envoyé une demande
    const idsAvecDemande = demandesEnvoyees.map(d => d.etudiantDestinataire.id);
    return etudiantsFiltres.filter(e => !idsAvecDemande.includes(e.id));
  }, [etudiantsFiltres, demandesEnvoyees]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Étape 2 : Choix du binôme
          </CardTitle>
          <CardDescription>
            Choisissez si vous souhaitez travailler seul ou en binôme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={optionChoisie} onValueChange={(value) => {
            // Empêcher de passer à "Travailler seul" si un binôme est accepté
            if (value === 'sans' && binomeAccepte) {
              return;
            }
            setOptionChoisie(value as 'avec' | 'sans');
          }}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="avec" className="gap-2">
                <UserPlus className="h-4 w-4" />
                Travailler en binôme
              </TabsTrigger>
              <TabsTrigger value="sans" className="gap-2" disabled={!!binomeAccepte}>
                <UserX className="h-4 w-4" />
                Travailler seul
              </TabsTrigger>
            </TabsList>

            <TabsContent value="avec" className="space-y-6 mt-6">
              {/* Binôme accepté */}
              {binomeAccepte && (
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 rounded-full p-2">
                        <UserCheck className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          Binôme accepté : {binomeAccepte.prenom} {binomeAccepte.nom}
                        </h4>
                        <p className="text-sm text-gray-600">{binomeAccepte.email}</p>
                      </div>
                      <Badge variant="default" className="bg-green-600 text-white">
                        Accepté
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Onglets principaux : Mes demandes et Demandes reçues */}
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'demandes' | 'recues')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="demandes" className="gap-2">
                    <Send className="h-4 w-4" />
                    Mes demandes
                    {demandeEnCours && demandeEnCours.statut === 'en_attente' && (
                      <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800">
                        1
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="recues" className="gap-2">
                    <Bell className="h-4 w-4" />
                    Demandes reçues
                    {propositionsEnAttente.length > 0 && (
                      <Badge variant="secondary" className="ml-2 bg-primary text-white">
                        {propositionsEnAttente.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>

                {/* Onglet Mes demandes avec sous-onglets */}
                <TabsContent value="demandes" className="space-y-6 mt-6">
                  <Tabs value={activeSousTab} onValueChange={(value) => setActiveSousTab(value as 'envoyer' | 'etat')}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="envoyer" className="gap-2" disabled={!!demandeEnCours && (demandeEnCours.statut === 'en_attente' || demandeEnCours.statut === 'acceptee')}>
                        <Send className="h-4 w-4" />
                        Envoyer une demande
                      </TabsTrigger>
                      <TabsTrigger value="etat" className="gap-2" disabled={!demandeEnCours}>
                        <Clock className="h-4 w-4" />
                        État de la demande
                        {demandeEnCours && demandeEnCours.statut === 'en_attente' && (
                          <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800">
                            1
                          </Badge>
                        )}
                      </TabsTrigger>
                    </TabsList>

                    {/* Sous-onglet : Envoyer une demande */}
                    <TabsContent value="envoyer" className="space-y-4 mt-4">
                  {!binomeAccepte ? (
                    <>
                      {/* Afficher le sujet choisi */}
                      {sujetChoisi ? (
                        <Card className="border-primary-200 bg-primary-50">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="bg-primary-100 rounded-full p-2">
                                <BookOpen className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-1">Sujet choisi</h4>
                                <p className="text-sm text-gray-700">{sujetChoisi.titre}</p>
                                {sujetChoisi.description && (
                                  <p className="text-xs text-gray-600 mt-1">{sujetChoisi.description}</p>
                                )}
                                <p className="text-xs text-primary-600 mt-2">
                                  Ce sujet sera inclus dans votre demande de binôme
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <Card className="border-yellow-200 bg-yellow-50">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                              <div className="flex-1">
                                <h4 className="font-semibold text-yellow-900 mb-1">Aucun sujet choisi</h4>
                                <p className="text-sm text-yellow-700">
                                  Vous devez d'abord choisir un sujet dans l'étape précédente avant d'envoyer une demande de binôme.
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Rechercher un étudiant par nom, email ou matricule..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>

                      <div className="space-y-3">
                        {etudiantsDisponiblesPourDemande.length > 0 ? (
                          etudiantsDisponiblesPourDemande.map((etudiant) => (
                            <Card
                              key={etudiant.id}
                              className="cursor-pointer transition-all hover:border-primary hover:shadow-md"
                              onClick={() => {
                                setEtudiantSelectionnePourDemande(etudiant);
                                setShowDialogDemande(true);
                              }}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    <div className="bg-primary-100 rounded-full p-3">
                                      <Users className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                      <h3 className="font-semibold text-gray-900">
                                        {etudiant.prenom} {etudiant.nom}
                                      </h3>
                                      <p className="text-sm text-gray-600">{etudiant.email}</p>
                                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        <Badge variant="outline">{etudiant.numeroMatricule}</Badge>
                                        <Badge variant="outline">{etudiant.niveau}</Badge>
                                        <Badge variant="outline">{etudiant.filiere}</Badge>
                                        <Badge variant="outline">{etudiant.departement}</Badge>
                                      </div>
                                    </div>
                                  </div>
                                  <Button size="sm" variant="outline" className="gap-2">
                                    <Send className="h-4 w-4" />
                                    Envoyer demande
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        ) : (
                          <Card>
                            <CardContent className="py-8 text-center">
                              <p className="text-gray-600">
                                {searchQuery ? 'Aucun étudiant trouvé' : 'Aucun étudiant disponible'}
                              </p>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </>
                  ) : (
                    <Card>
                      <CardContent className="py-8 text-center">
                        <UserCheck className="h-12 w-12 mx-auto mb-4 text-green-600" />
                        <p className="text-gray-600">
                          Vous avez déjà un binôme accepté. Vous ne pouvez pas envoyer d'autres demandes.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                    {/* Sous-onglet : État de la demande */}
                    <TabsContent value="etat" className="space-y-6 mt-6">
                      {demandeEnCours ? (
                        <>
                          {/* Statut de la demande */}
                          <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="bg-primary-100 rounded-full p-2">
                                <Send className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-1">
                                  Demande envoyée à {demandeEnCours.etudiantDestinataire.prenom} {demandeEnCours.etudiantDestinataire.nom}
                                </h3>
                                <p className="text-sm text-gray-600">{demandeEnCours.etudiantDestinataire.email}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Envoyée le {formatDate(demandeEnCours.dateEnvoi)}
                                </p>
                              </div>
                              {demandeEnCours.statut === 'en_attente' && (
                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                  <Clock className="h-3 w-3 mr-1" />
                                  En attente
                                </Badge>
                              )}
                              {demandeEnCours.statut === 'acceptee' && (
                                <Badge variant="default" className="bg-green-600 text-white">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Acceptée
                                </Badge>
                              )}
                              {demandeEnCours.statut === 'refusee' && (
                                <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-300">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Refusée
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Informations du dossier */}
                          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-2">Sujet choisi</h4>
                            <p className="text-sm text-gray-700">{demandeEnCours.sujetChoisi.titre}</p>
                            {demandeEnCours.sujetChoisi.description && (
                              <p className="text-xs text-gray-600 mt-1">{demandeEnCours.sujetChoisi.description}</p>
                            )}
                          </div>

                          {/* Message selon le statut */}
                          {demandeEnCours.statut === 'en_attente' && (
                            <>
                              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-start gap-2">
                                  <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                                  <div className="flex-1">
                                    <p className="text-sm text-blue-900">
                                      Votre demande est en cours d'examen par l'étudiant. 
                                      Vous recevrez une notification dès qu'une réponse sera disponible.
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-end pt-4 border-t">
                                <Button onClick={handleAnnulerDemandeEnCours} variant="outline" className="gap-2">
                                  <XCircle className="h-4 w-4" />
                                  Annuler la demande
                                </Button>
                              </div>
                            </>
                          )}

                          {demandeEnCours.statut === 'acceptee' && (
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-start gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-green-900 mb-1">
                                    Demande acceptée !
                                  </p>
                                  <p className="text-sm text-green-700">
                                    Votre demande de binôme a été acceptée. Vous pouvez maintenant passer à l'étape suivante.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {demandeEnCours.statut === 'refusee' && (
                            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                              <div className="flex items-start gap-2">
                                <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-orange-900 mb-1">
                                    Demande refusée
                                  </p>
                                  <p className="text-sm text-orange-700">
                                    Vous pouvez envoyer une nouvelle demande à un autre étudiant en retournant à l'onglet "Envoyer une demande".
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <Card>
                          <CardContent className="py-12 text-center">
                            <Send className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <p className="text-gray-600">Aucune demande en cours</p>
                            <p className="text-sm text-gray-500 mt-2">
                              Veuillez d'abord envoyer une demande dans l'onglet "Envoyer une demande"
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>
                  </Tabs>
                </TabsContent>

                {/* Onglet Demandes reçues */}
                <TabsContent value="recues" className="space-y-4 mt-6">
                  {propositionsEnAttente.length > 0 ? (
                    <div className="space-y-3">
                      {propositionsEnAttente.map((proposition) => (
                        <Card key={proposition.id} className="border-primary-200 bg-primary-50">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="secondary" className="bg-primary-100 text-primary-800 border-primary-300">
                                    Demande reçue
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="bg-primary-100 rounded-full p-2">
                                    <Users className="h-5 w-5 text-primary" />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900">
                                      {proposition.etudiant.prenom} {proposition.etudiant.nom}
                                    </h4>
                                    <p className="text-sm text-gray-600">{proposition.etudiant.email}</p>
                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                      <Badge variant="outline">{proposition.etudiant.numeroMatricule}</Badge>
                                      <Badge variant="outline">{proposition.etudiant.niveau}</Badge>
                                      <Badge variant="outline">{proposition.etudiant.filiere}</Badge>
                                      <Badge variant="outline">{proposition.etudiant.departement}</Badge>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-3 p-3 bg-white rounded-lg border border-primary-200">
                                  <div className="flex items-start gap-2">
                                    <div className="flex-1">
                                      <p className="text-xs font-medium text-gray-500 mb-1">Sujet proposé :</p>
                                      <p className="text-sm font-semibold text-gray-900">{proposition.sujetChoisi.titre}</p>
                                      {proposition.sujetChoisi.description && (
                                        <p className="text-xs text-gray-600 mt-1">{proposition.sujetChoisi.description}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {proposition.message && (
                                  <div className="mt-3 p-3 bg-white rounded-lg border border-primary-200">
                                    <p className="text-sm text-gray-700">{proposition.message}</p>
                                  </div>
                                )}
                                <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                                  <Clock className="h-4 w-4" />
                                  <span>Proposé le {formatDate(proposition.dateProposition)}</span>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2 ml-4">
                                <Button
                                  size="sm"
                                  onClick={() => handleAccepterProposition(proposition)}
                                  className="gap-2"
                                  disabled={!!binomeAccepte || !!demandeEnCours}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  Accepter
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRefuserProposition(proposition)}
                                  className="gap-2"
                                >
                                  <XCircle className="h-4 w-4" />
                                  Refuser
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="py-8 text-center">
                        <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-600">Aucune demande reçue</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="sans" className="mt-6">
              <Card className="border-primary-200 bg-primary-50">
                <CardContent className="p-8 text-center">
                  <UserX className="h-16 w-16 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Travailler seul</h3>
                  <p className="text-gray-600 mb-6">
                    Vous avez choisi de travailler seul sur votre mémoire. Vous pouvez continuer sans binôme.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Bouton de validation */}
          <div className="space-y-3 pt-6 border-t mt-6">
            {/* Message informatif si on a accepté une demande reçue (on n'est pas le leader) */}
            {binomeAccepte && !estLeaderBinome && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 rounded-full p-2">
                    <Bell className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900 mb-1">
                      Binôme accepté
                    </p>
                    <p className="text-xs text-blue-700">
                      Vous avez accepté une demande de binôme. C'est votre binôme ({binomeAccepte.prenom} {binomeAccepte.nom}) qui a choisi le sujet et qui doit continuer le pipeline. Vous serez informé(e) des prochaines étapes.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end">
              <Button 
                onClick={handleValider} 
                disabled={optionChoisie === 'avec' && (!binomeAccepte || !estLeaderBinome)}
                className="gap-2"
              >
                Valider et continuer
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dialog pour envoyer une demande */}
      <Dialog open={showDialogDemande} onOpenChange={setShowDialogDemande}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Envoyer une demande de binôme</DialogTitle>
            <DialogDescription>
              Envoyez une demande à {etudiantSelectionnePourDemande?.prenom} {etudiantSelectionnePourDemande?.nom}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Afficher le sujet choisi ou un message d'avertissement */}
            {sujetChoisi ? (
              <div className="space-y-2">
                <Label>Sujet choisi</Label>
                <div className="p-3 bg-primary-50 border border-primary-200 rounded-lg">
                  <p className="font-medium text-gray-900">{sujetChoisi.titre}</p>
                  {sujetChoisi.description && (
                    <p className="text-sm text-gray-600 mt-1">{sujetChoisi.description}</p>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Ce sujet sera inclus dans votre demande de binôme
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-medium text-yellow-900">
                    ⚠️ Aucun sujet choisi
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Vous devez d'abord choisir un sujet dans l'étape précédente avant d'envoyer une demande de binôme.
                  </p>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="message">Message (optionnel)</Label>
              <Textarea
                id="message"
                placeholder="Ajoutez un message pour accompagner votre demande..."
                value={messageDemande}
                onChange={(e) => setMessageDemande(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDialogDemande(false);
                setMessageDemande('');
                setEtudiantSelectionnePourDemande(null);
              }}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleEnvoyerDemande} 
              className="gap-2"
              disabled={!sujetChoisi}
            >
              <Send className="h-4 w-4" />
              Envoyer la demande
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmation pour accepter une proposition */}
      <Dialog open={showConfirmAccept} onOpenChange={setShowConfirmAccept}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Confirmer l'acceptation de la demande</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir accepter cette demande de binôme ?
            </DialogDescription>
          </DialogHeader>
          {propositionAConfirmer && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">
                  {propositionAConfirmer.etudiant.prenom} {propositionAConfirmer.etudiant.nom}
                </h4>
                <p className="text-sm text-gray-600 mb-3">{propositionAConfirmer.etudiant.email}</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Sujet proposé :</p>
                    <p className="text-sm font-semibold text-gray-900">{propositionAConfirmer.sujetChoisi.titre}</p>
                  </div>
                  {propositionAConfirmer.message && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Message :</p>
                      <p className="text-sm text-gray-700">{propositionAConfirmer.message}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Important :</strong> En acceptant cette demande, vous ne pourrez plus choisir "Travailler seul" 
                  et c'est votre binôme qui continuera le pipeline (choix de l'encadrant, etc.).
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirmAccept(false);
                setPropositionAConfirmer(null);
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={handleConfirmAccept}
              className="gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Confirmer l'acceptation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EtapeChoixBinome;

