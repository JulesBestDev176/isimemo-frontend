import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, CheckCircle, ArrowRight, Plus, Eye, Target, Bell, Users, Clock, XCircle, Loader2 } from 'lucide-react';
import { DossierMemoire } from '../../../../models/dossier';
import { SujetMemoire, PropositionBinome } from '../../../../models/pipeline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Badge } from '../../../../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../components/ui/tabs';
import { useAuth } from '../../../../contexts/AuthContext';
import sujetService, { Sujet } from '../../../../services/sujet.service';
import dossierService from '../../../../services/dossier.service';
import demandeBinomeService, { DemandeBinome } from '../../../../services/demandeBinome.service';
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

// Fonction pour convertir un Sujet API en SujetMemoire frontend
const mapApiSujetToSujetMemoire = (apiSujet: Sujet): SujetMemoire => ({
  id: apiSujet.id,
  titre: apiSujet.titre,
  description: apiSujet.description || '',
  domaine: apiSujet.departement || 'Informatique',
  attentes: apiSujet.prerequis ? `Prérequis:\n${apiSujet.prerequis}\n\nObjectifs:\n${apiSujet.objectifs || ''}` : undefined,
  encadrantPropose: apiSujet.nomCreateur ? {
    id: 0,
    nom: apiSujet.nomCreateur.split(' ').slice(-1)[0] || '',
    prenom: apiSujet.nomCreateur.split(' ').slice(0, -1).join(' ') || '',
    email: apiSujet.emailCreateur
  } : undefined,
  estDisponible: apiSujet.statut === 'VALIDE' && !apiSujet.dossierMemoireId // Disponible si VALIDE et pas encore attribué
});


// Type adapté pour les demandes depuis l'API
interface PropositionFromAPI {
  id: number;
  demandeurId: number;
  demandeurEmail: string;
  demandeurNom: string;
  demandeurMatricule: string;
  demandeurFiliere: string;
  sujetTitre: string;
  sujetDescription: string;
  message: string;
  statut: 'EN_ATTENTE' | 'ACCEPTEE' | 'REFUSEE';
  dateDemande: string;
}


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
  
  // États pour l'API des sujets
  const [sujetsDisponibles, setSujetsDisponibles] = useState<SujetMemoire[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProposing, setIsProposing] = useState(false);

  // Charger les sujets depuis l'API
  useEffect(() => {
    const fetchSujets = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Récupérer les sujets disponibles (filtrés par filière si disponible)
        const sujets = await sujetService.getSujetsDisponibles();
        const sujetsMapped = sujets.map(mapApiSujetToSujetMemoire);
        setSujetsDisponibles(sujetsMapped);
        
        // Si le candidat a une proposition personnelle, la récupérer aussi
        if (user?.id) {
          try {
            const propositions = await sujetService.getPropositionsByCandidat(user.id);
            if (propositions.length > 0) {
              const propositionsMapped = propositions.map(mapApiSujetToSujetMemoire);
              setSujetsDisponibles(prev => [...prev, ...propositionsMapped]);
            }
          } catch (e) {
            console.log('Pas de propositions personnelles');
          }
        }
      } catch (err) {
        console.error('Erreur lors du chargement des sujets:', err);
        setError('Impossible de charger les sujets. Vérifiez votre connexion.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSujets();
  }, [user?.id]);
  
  // États pour les demandes de binôme depuis l'API
  const [demandesRecues, setDemandesRecues] = useState<DemandeBinome[]>([]);
  const [isLoadingDemandes, setIsLoadingDemandes] = useState(true);

  // Charger les demandes de binôme depuis l'API
  useEffect(() => {
    const fetchDemandes = async () => {
      if (!user?.id) return;
      try {
        setIsLoadingDemandes(true);
        const demandes = await demandeBinomeService.getDemandesRecues(Number(user.id));
        setDemandesRecues(demandes);
      } catch (err) {
        console.error('Erreur lors du chargement des demandes:', err);
      } finally {
        setIsLoadingDemandes(false);
      }
    };

    fetchDemandes();
  }, [user?.id]);

  // Filtrer les demandes en attente
  const demandesEnAttente = useMemo(() => {
    return demandesRecues.filter(d => d.statut === 'EN_ATTENTE');
  }, [demandesRecues]);

  // Vérifier si une demande a été acceptée
  const demandeAcceptee = useMemo(() => {
    return demandesRecues.find(d => d.statut === 'ACCEPTEE');
  }, [demandesRecues]);

  // Créer une liste combinée des sujets disponibles et du sujet proposé (s'il existe)
  const tousLesSujets = sujetSelectionne && !sujetSelectionne.estDisponible && !sujetsDisponibles.some(s => s.id === sujetSelectionne.id)
    ? [...sujetsDisponibles, sujetSelectionne]
    : sujetsDisponibles;

  const sujetsFiltres = tousLesSujets.filter(sujet => {
    const matchesSearch = 
      sujet.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sujet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sujet.domaine.toLowerCase().includes(searchQuery.toLowerCase());
    // Inclure les sujets disponibles OU le sujet sélectionné (même s'il n'est pas disponible)
    return matchesSearch && (sujet.estDisponible || sujet.id === sujetSelectionne?.id);
  });

  const handleValider = async () => {
    if (sujetSelectionne) {
      try {
        setIsLoading(true);
        // 1. Lier le sujet au dossier dans le service Sujet
        await sujetService.attribuerSujet(Number(sujetSelectionne.id), dossier.id);
        
        // 2. Mettre à jour le dossier (titre, description et étape suivante)
        await dossierService.selectionnerSujet(dossier.id, {
          titre: sujetSelectionne.titre,
          description: sujetSelectionne.description
        });
        
        console.log('Sujet persisté pour le dossier:', dossier.id);
        onComplete();
      } catch (err) {
        console.error('Erreur lors de la validation du sujet:', err);
        setError('Impossible d\'enregistrer votre choix. Veuillez réessayer.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleProposerSujet = async () => {
    if (titrePropose.trim() && descriptionProposee.trim() && user) {
      try {
        setIsProposing(true);
        
        // Appel API pour soumettre le sujet proposé
        const sujetCree = await sujetService.proposerSujet({
          titre: titrePropose.trim(),
          description: descriptionProposee.trim(),
          emailCreateur: user.email || '',
          nomCreateur: user.name || '',
          candidatId: user.id,
          dossierMemoireId: dossier.id,
          anneeAcademique: '2025-2026'
        });
        
        console.log('Sujet proposé:', sujetCree);
        
        // Nouveau sujet créé avec succès
        const nouveauSujet = mapApiSujetToSujetMemoire(sujetCree);
        setSujetsDisponibles(prev => [...prev, nouveauSujet]);
        setSujetSelectionne(nouveauSujet);
        
        // Fermer le dialog et réinitialiser les champs immédiatement
        setIsDialogOpen(false);
        setTitrePropose('');
        setDescriptionProposee('');

        // Mettre à jour le dossier pour refléter cette proposition comme sujet actuel
        await dossierService.selectionnerSujet(dossier.id, {
          titre: nouveauSujet.titre,
          description: nouveauSujet.description
        });
        
        onComplete();
      } catch (err) {
        console.error('Erreur lors de la proposition du sujet:', err);
        setError('Impossible de proposer le sujet. Veuillez réessayer.');
      } finally {
        setIsProposing(false);
      }
    }
  };

  const handleConsulterSujet = (sujet: SujetMemoire, e: React.MouseEvent) => {
    e.stopPropagation(); // Empêcher la sélection du sujet
    setSujetConsulte(sujet);
    setIsConsultDialogOpen(true);
  };

  // État pour la demande à confirmer
  const [demandeAConfirmer, setDemandeAConfirmer] = useState<DemandeBinome | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRefusing, setIsRefusing] = useState<number | null>(null);

  const handleAccepterDemande = (demande: DemandeBinome) => {
    // Afficher le modal de confirmation
    setDemandeAConfirmer(demande);
    setShowConfirmAccept(true);
  };

  const handleConfirmAccept = async () => {
    if (!demandeAConfirmer) return;
    
    try {
      setIsAccepting(true);
      // Appel API pour accepter la demande
      const demandeAcceptee = await demandeBinomeService.accepterDemande(demandeAConfirmer.idDemande);
      
      // Mettre à jour l'état local
      setDemandesRecues(prev => 
        prev.map(d => 
          d.idDemande === demandeAConfirmer.idDemande 
            ? { ...d, statut: 'ACCEPTEE' as const, groupeId: demandeAcceptee.groupeId }
            : d.statut === 'EN_ATTENTE' 
              ? { ...d, statut: 'REFUSEE' as const }
              : d
        )
      );
      
      // Fermer le modal
      setShowConfirmAccept(false);
      setDemandeAConfirmer(null);
    } catch (err) {
      console.error('Erreur lors de l\'acceptation de la demande:', err);
      setError('Impossible d\'accepter la demande. Veuillez réessayer.');
    } finally {
      setIsAccepting(false);
    }
  };

  const handleRefuserDemande = async (demande: DemandeBinome) => {
    try {
      setIsRefusing(demande.idDemande);
      // Appel API pour refuser la demande
      await demandeBinomeService.refuserDemande(demande.idDemande);
      
      // Mettre à jour l'état local
      setDemandesRecues(prev => 
        prev.map(d => 
          d.idDemande === demande.idDemande 
            ? { ...d, statut: 'REFUSEE' as const }
            : d
        )
      );
    } catch (err) {
      console.error('Erreur lors du refus de la demande:', err);
      setError('Impossible de refuser la demande. Veuillez réessayer.');
    } finally {
      setIsRefusing(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
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
                {demandesEnAttente.length > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-primary text-white">
                    {demandesEnAttente.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sujets" className="space-y-6 mt-6">
              {/* Message si une demande a été acceptée */}
              {demandeAcceptee && (
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
                        Vous avez accepté une demande de binôme de {demandeAcceptee.demandeurNom}. 
                        C'est votre binôme qui a choisi le sujet et qui doit continuer le pipeline. Vous ne pouvez plus choisir un sujet.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {/* Barre de recherche et bouton proposer */}
              {!demandeAcceptee && (
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
                    disabled={!titrePropose.trim() || !descriptionProposee.trim() || descriptionProposee.trim().length < 50 || isProposing}
                  >
                    {isProposing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      'Proposer le sujet'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
              )}

              {/* Liste des sujets */}
              {!demandeAcceptee && (
              <div className="space-y-4">
            {/* État de chargement */}
            {isLoading ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-primary" />
                  <p className="text-gray-600">Chargement des sujets...</p>
                </CardContent>
              </Card>
            ) : error ? (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="py-8 text-center">
                  <p className="text-red-600">{error}</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => window.location.reload()}
                  >
                    Réessayer
                  </Button>
                </CardContent>
              </Card>
            ) : sujetsFiltres.length > 0 ? (
              sujetsFiltres.map((sujet, index) => (
                <Card
                  key={`${sujet.id}-${index}`}
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
              {sujetSelectionne && !demandeAcceptee && (
                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={handleValider} className="gap-2">
                    Valider et continuer
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {/* Message si une demande a été acceptée */}
              {demandeAcceptee && (
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
                        Vous avez accepté une demande de binôme de {demandeAcceptee.demandeurNom}. 
                        C'est votre binôme qui a choisi le sujet et qui doit continuer le pipeline. Vous serez informé(e) des prochaines étapes.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="demandes" className="space-y-4 mt-6">
              {demandesEnAttente.length > 0 ? (
                <div className="space-y-3">
                  {demandesEnAttente.map((proposition, index) => (
                    <Card key={`${proposition.idDemande}-${index}`} className="border-primary-200 bg-primary-50">
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
                                  {proposition.demandeurNom}
                                </h4>
                                <p className="text-sm text-gray-600">{proposition.demandeurEmail}</p>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                  <Badge variant="outline">{proposition.demandeurMatricule}</Badge>
                                  <Badge variant="outline">{proposition.demandeurFiliere}</Badge>
                                </div>
                              </div>
                            </div>
                            <div className="mt-3 p-3 bg-white rounded-lg border border-primary-200">
                              <div className="flex items-start gap-2">
                                <div className="flex-1">
                                  <p className="text-xs font-medium text-gray-500 mb-1">Sujet proposé :</p>
                                  <p className="text-sm font-semibold text-gray-900">{proposition.sujetTitre}</p>
                                  {proposition.sujetDescription && (
                                    <p className="text-xs text-gray-600 mt-1">{proposition.sujetDescription}</p>
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
                              <span>Proposé le {formatDate(proposition.dateDemande)}</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 ml-4">
                            <Button
                              size="sm"
                              onClick={() => handleAccepterDemande(proposition)}
                              className="gap-2"
                              disabled={!!demandeAcceptee}
                            >
                              <CheckCircle className="h-4 w-4" />
                              Accepter
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRefuserDemande(proposition)}
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
          {demandeAConfirmer && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">
                  {demandeAConfirmer.demandeurNom}
                </h4>
                <p className="text-sm text-gray-600 mb-3">{demandeAConfirmer.demandeurEmail}</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Sujet proposé :</p>
                    <p className="text-sm font-semibold text-gray-900">{demandeAConfirmer.sujetTitre}</p>
                  </div>
                  {demandeAConfirmer.message && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Message :</p>
                      <p className="text-sm text-gray-700">{demandeAConfirmer.message}</p>
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

