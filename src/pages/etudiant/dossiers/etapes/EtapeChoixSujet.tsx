import React, { useState, useMemo, useEffect } from 'react';
import { Search, BookOpen, CheckCircle, ArrowRight, Plus, Eye, Target, Bell, Users, Clock, XCircle } from 'lucide-react';
import { DossierMemoire } from '../../../../types/dossier';
import { SujetMemoire, PropositionBinome } from '../../../../types/pipeline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Badge } from '../../../../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../components/ui/tabs';
import { useAuth } from '../../../../contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../../components/ui/dialog';
import { Textarea } from '../../../../components/ui/textarea';
import { Label } from '../../../../components/ui/label';

interface EtapeChoixSujetProps {
  dossier: DossierMemoire;
  onComplete: () => void;
}

// Données mock pour les sujets disponibles
const SUJETS_DISPONIBLES: SujetMemoire[] = [
  {
    id: 1,
    titre: 'Système de gestion intelligente de mémoires académiques',
    description: 'Développement d\'une plateforme web avec IA pour la gestion, l\'analyse et la détection de plagiat des mémoires de fin d\'études. Cette plateforme permettra aux étudiants de déposer leurs mémoires, aux encadrants de les évaluer, et au système de détecter automatiquement les similitudes avec d\'autres documents.',
    domaine: 'Informatique',
    attentes: '• Maîtrise des technologies web (React, Node.js, TypeScript)\n• Connaissance en intelligence artificielle et traitement du langage naturel\n• Expérience avec les bases de données (PostgreSQL, MongoDB)\n• Compréhension des algorithmes de détection de similarité\n• Capacité à travailler avec des APIs REST\n• Bonne connaissance des frameworks de machine learning (TensorFlow, PyTorch)',
    encadrantPropose: {
      id: 1,
      nom: 'Diop',
      prenom: 'Amadou',
      email: 'amadou.diop@isi.edu.sn'
    },
    estDisponible: true
  },
  {
    id: 2,
    titre: 'Application mobile de gestion de bibliothèque universitaire',
    description: 'Développement d\'une application mobile cross-platform pour la gestion des emprunts, réservations et catalogage de livres. L\'application permettra aux étudiants de rechercher des livres, réserver des exemplaires, consulter leur historique d\'emprunts, et recevoir des notifications de rappel.',
    domaine: 'Informatique',
    attentes: '• Maîtrise du développement mobile (React Native, Flutter, ou natif)\n• Connaissance des systèmes de gestion de bases de données\n• Expérience avec les APIs REST et GraphQL\n• Compréhension des notifications push\n• Capacité à concevoir des interfaces utilisateur intuitives\n• Connaissance des systèmes de paiement en ligne (optionnel)',
    encadrantPropose: {
      id: 2,
      nom: 'Sow',
      prenom: 'Fatou',
      email: 'fatou.sow@isi.edu.sn'
    },
    estDisponible: true
  },
  {
    id: 3,
    titre: 'Plateforme e-learning avec recommandation personnalisée',
    description: 'Création d\'une plateforme d\'apprentissage en ligne utilisant l\'IA pour recommander des contenus adaptés aux apprenants. La plateforme analysera les préférences et les performances des étudiants pour proposer des cours, exercices et ressources personnalisés.',
    domaine: 'Informatique',
    attentes: '• Maîtrise des technologies web modernes\n• Connaissance en machine learning et systèmes de recommandation\n• Expérience avec les algorithmes de filtrage collaboratif\n• Compréhension de l\'analyse de données et statistiques\n• Capacité à intégrer des systèmes d\'IA\n• Connaissance des frameworks de e-learning (Moodle, Canvas)',
    estDisponible: true
  },
  {
    id: 4,
    titre: 'Système de gestion de ressources humaines',
    description: 'Développement d\'un système web pour la gestion du personnel, des congés, et de la paie. Le système permettra de gérer les informations des employés, suivre les absences, calculer les salaires, et générer des rapports administratifs.',
    domaine: 'Informatique',
    attentes: '• Maîtrise du développement web full-stack\n• Connaissance des systèmes de gestion de bases de données relationnelles\n• Compréhension des processus RH et de la paie\n• Expérience avec les systèmes de reporting\n• Capacité à gérer la sécurité et la confidentialité des données\n• Connaissance des réglementations en matière de protection des données',
    estDisponible: false
  }
];

// Données mock pour les propositions de binôme reçues (même que dans EtapeChoixBinome)
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

const EtapeChoixSujet: React.FC<EtapeChoixSujetProps> = ({ dossier, onComplete }) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [sujetSelectionne, setSujetSelectionne] = useState<SujetMemoire | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [titrePropose, setTitrePropose] = useState('');
  const [descriptionProposee, setDescriptionProposee] = useState('');
  const [sujetConsulte, setSujetConsulte] = useState<SujetMemoire | null>(null);
  const [isConsultDialogOpen, setIsConsultDialogOpen] = useState(false);
  const [propositionAConfirmer, setPropositionAConfirmer] = useState<PropositionBinome | null>(null);
  const [showConfirmAccept, setShowConfirmAccept] = useState(false);
  const [activeTab, setActiveTab] = useState<'sujets' | 'demandes'>('sujets');
  
  // Initialiser les propositions reçues
  const [propositionsRecues, setPropositionsRecues] = useState<PropositionBinome[]>(() => {
    // Filtrer les propositions selon les critères de compatibilité
    return PROPOSITIONS_RECUES.filter(proposition =>
      proposition.etudiant.niveau === 'Master 2' &&
      proposition.etudiant.filiere === 'Informatique' &&
      proposition.etudiant.departement === 'Département Informatique'
    );
  });

  // Filtrer les propositions en attente
  const propositionsEnAttente = useMemo(() => {
    return propositionsRecues.filter(p => p.statut === 'en_attente');
  }, [propositionsRecues]);

  // Vérifier si une proposition a été acceptée
  const propositionAcceptee = useMemo(() => {
    return propositionsRecues.find(p => p.statut === 'acceptee');
  }, [propositionsRecues]);

  // Créer une liste combinée des sujets disponibles et du sujet proposé (s'il existe)
  const tousLesSujets = sujetSelectionne && !sujetSelectionne.estDisponible
    ? [...SUJETS_DISPONIBLES, sujetSelectionne]
    : SUJETS_DISPONIBLES;

  const sujetsFiltres = tousLesSujets.filter(sujet => {
    const matchesSearch = 
      sujet.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sujet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sujet.domaine.toLowerCase().includes(searchQuery.toLowerCase());
    // Inclure les sujets disponibles OU le sujet sélectionné (même s'il n'est pas disponible)
    return matchesSearch && (sujet.estDisponible || sujet.id === sujetSelectionne?.id);
  });

  const handleValider = () => {
    if (sujetSelectionne) {
      // TODO: Appel API pour enregistrer le sujet choisi
      console.log('Sujet choisi:', sujetSelectionne);
      // Stocker le sujet choisi dans localStorage pour l'utiliser dans les étapes suivantes
      localStorage.setItem(`sujetChoisi_${dossier.idDossierMemoire}`, JSON.stringify({
        titre: sujetSelectionne.titre,
        description: sujetSelectionne.description
      }));
      onComplete();
    }
    // Si on a accepté une demande reçue, on ne continue pas le pipeline
    // C'est celui qui a envoyé la demande qui doit continuer
  };

  const handleProposerSujet = () => {
    if (titrePropose.trim() && descriptionProposee.trim()) {
      // Créer un nouveau sujet proposé
      const nouveauSujet: SujetMemoire = {
        id: Date.now(), // ID temporaire
        titre: titrePropose.trim(),
        description: descriptionProposee.trim(),
        domaine: 'Informatique', // Par défaut
        estDisponible: false, // En attente de validation
      };

      // TODO: Appel API pour soumettre le sujet proposé
      console.log('Sujet proposé:', nouveauSujet);

      // Sélectionner le sujet proposé
      setSujetSelectionne(nouveauSujet);
      
      // Fermer le dialog et réinitialiser les champs
      setIsDialogOpen(false);
      setTitrePropose('');
      setDescriptionProposee('');
    }
  };

  const handleConsulterSujet = (sujet: SujetMemoire, e: React.MouseEvent) => {
    e.stopPropagation(); // Empêcher la sélection du sujet
    setSujetConsulte(sujet);
    setIsConsultDialogOpen(true);
  };

  const handleAccepterProposition = (proposition: PropositionBinome) => {
    // Afficher le modal de confirmation
    setPropositionAConfirmer(proposition);
    setShowConfirmAccept(true);
  };

  const handleConfirmAccept = () => {
    if (!propositionAConfirmer) return;
    
    // TODO: Appel API pour accepter la proposition
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
    // Fermer le modal
    setShowConfirmAccept(false);
    setPropositionAConfirmer(null);
    // Si on accepte une demande reçue, on ne continue pas le pipeline
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Étape 1 : Choix du sujet
          </CardTitle>
          <CardDescription>
            Consultez la banque de sujets disponibles, sélectionnez celui qui vous intéresse ou consultez les demandes de binôme reçues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Onglets pour Sujets et Demandes reçues */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'sujets' | 'demandes')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sujets" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Sujets
              </TabsTrigger>
              <TabsTrigger value="demandes" className="gap-2">
                <Bell className="h-4 w-4" />
                Demandes reçues
                {propositionsEnAttente.length > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-primary text-white">
                    {propositionsEnAttente.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sujets" className="space-y-6 mt-6">
              {/* Message si une demande a été acceptée */}
              {propositionAcceptee && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 rounded-full p-2">
                      <Bell className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900 mb-1">
                        Demande de binôme acceptée
                      </p>
                      <p className="text-xs text-blue-700">
                        Vous avez accepté une demande de binôme de {propositionAcceptee.etudiant.prenom} {propositionAcceptee.etudiant.nom}. 
                        C'est votre binôme qui a choisi le sujet et qui doit continuer le pipeline. Vous ne pouvez plus choisir un sujet.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {/* Barre de recherche et bouton proposer */}
              {!propositionAcceptee && (
                <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher un sujet par titre, description ou domaine..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 whitespace-nowrap">
                  <Plus className="h-4 w-4" />
                  Proposer un sujet
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Proposer un nouveau sujet</DialogTitle>
                  <DialogDescription>
                    Remplissez les informations ci-dessous pour proposer votre propre sujet de mémoire.
                    Votre proposition sera soumise pour validation.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="titre">Titre du sujet *</Label>
                    <Input
                      id="titre"
                      placeholder="Ex: Système de gestion de bibliothèque numérique"
                      value={titrePropose}
                      onChange={(e) => setTitrePropose(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Décrivez votre sujet de mémoire en détail. Incluez les objectifs, la méthodologie prévue, et les technologies envisagées..."
                      value={descriptionProposee}
                      onChange={(e) => setDescriptionProposee(e.target.value)}
                      className="min-h-[120px]"
                      rows={5}
                    />
                    <p className="text-xs text-gray-500">
                      Minimum 50 caractères. Décrivez clairement votre sujet et son intérêt.
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setTitrePropose('');
                      setDescriptionProposee('');
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={handleProposerSujet}
                    disabled={!titrePropose.trim() || !descriptionProposee.trim() || descriptionProposee.trim().length < 50}
                  >
                    Proposer le sujet
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
              )}

              {/* Liste des sujets */}
              {!propositionAcceptee && (
              <div className="space-y-4">
            {sujetsFiltres.length > 0 ? (
              sujetsFiltres.map((sujet) => (
                <Card
                  key={sujet.id}
                  className={`cursor-pointer transition-all ${
                    sujetSelectionne?.id === sujet.id
                      ? 'border-primary border-2 bg-primary-50'
                      : 'hover:border-primary hover:shadow-md'
                  }`}
                  onClick={() => setSujetSelectionne(sujet)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-2">
                          <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            sujetSelectionne?.id === sujet.id
                              ? 'border-primary bg-primary'
                              : 'border-gray-300'
                          }`}>
                            {sujetSelectionne?.id === sujet.id && (
                              <CheckCircle className="h-4 w-4 text-white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-1">
                              <h3 className="font-semibold text-gray-900 flex-1">{sujet.titre}</h3>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="ml-2 h-8 w-8 p-0"
                                onClick={(e) => handleConsulterSujet(sujet, e)}
                                title="Consulter les détails"
                              >
                                <Eye className="h-4 w-4 text-primary" />
                              </Button>
                            </div>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{sujet.description}</p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline">{sujet.domaine}</Badge>
                              {!sujet.estDisponible && (
                                <Badge variant="secondary" className="bg-primary-100 text-primary-800 border-primary-300">
                                  En attente de validation
                                </Badge>
                              )}
                              {sujet.encadrantPropose && (
                                <Badge variant="outline">
                                  Professeur: {sujet.encadrantPropose.prenom} {sujet.encadrantPropose.nom}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-600">
                    {searchQuery ? 'Aucun sujet trouvé pour votre recherche' : 'Aucun sujet disponible'}
                  </p>
                </CardContent>
              </Card>
            )}
              </div>
              )}

              {/* Bouton de validation */}
              {sujetSelectionne && !propositionAcceptee && (
                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={handleValider} className="gap-2">
                    Valider et continuer
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {/* Message si une demande a été acceptée */}
              {propositionAcceptee && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mt-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 rounded-full p-2">
                      <Bell className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900 mb-1">
                        Demande de binôme acceptée
                      </p>
                      <p className="text-xs text-blue-700">
                        Vous avez accepté une demande de binôme de {propositionAcceptee.etudiant.prenom} {propositionAcceptee.etudiant.nom}. 
                        C'est votre binôme qui a choisi le sujet et qui doit continuer le pipeline. Vous serez informé(e) des prochaines étapes.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="demandes" className="space-y-4 mt-6">
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
                              disabled={!!propositionAcceptee}
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
                  <CardContent className="py-12 text-center">
                    <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Aucune demande reçue</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialog de consultation des détails du sujet */}
      <Dialog open={isConsultDialogOpen} onOpenChange={setIsConsultDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          {sujetConsulte && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{sujetConsulte.titre}</DialogTitle>
                <DialogDescription>
                  Détails complets du sujet de mémoire
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {/* Domaine et statut */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-base px-3 py-1">
                    {sujetConsulte.domaine}
                  </Badge>
                  {!sujetConsulte.estDisponible && (
                    <Badge variant="secondary" className="bg-primary-100 text-primary-800 border-primary-300">
                      En attente de validation
                    </Badge>
                  )}
                  {sujetConsulte.estDisponible && (
                    <Badge variant="default" className="bg-primary text-white">
                      Disponible
                    </Badge>
                  )}
                </div>

                {/* Description complète */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold text-gray-900">Description</h3>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {sujetConsulte.description}
                    </p>
                  </div>
                </div>

                {/* Attentes */}
                {sujetConsulte.attentes && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold text-gray-900">Attentes et prérequis</h3>
                    </div>
                    <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                        {sujetConsulte.attentes}
                      </p>
                    </div>
                  </div>
                )}

                {/* Professeur */}
                {sujetConsulte.encadrantPropose && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">Professeur</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700">
                        <span className="font-medium">
                          {sujetConsulte.encadrantPropose.prenom} {sujetConsulte.encadrantPropose.nom}
                        </span>
                        <br />
                        <span className="text-sm text-gray-600">{sujetConsulte.encadrantPropose.email}</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsConsultDialogOpen(false)}
                >
                  Fermer
                </Button>
                <Button
                  onClick={() => {
                    setSujetSelectionne(sujetConsulte);
                    setIsConsultDialogOpen(false);
                  }}
                  className="gap-2"
                >
                  Sélectionner ce sujet
                  <CheckCircle className="h-4 w-4" />
                </Button>
              </DialogFooter>
            </>
          )}
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
                  <strong>Important :</strong> En acceptant cette demande, vous ne pourrez plus choisir un sujet vous-même. 
                  C'est votre binôme qui a choisi le sujet et qui continuera le pipeline (choix de l'encadrant, etc.).
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

export default EtapeChoixSujet;

