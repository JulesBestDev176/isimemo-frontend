import React, { useState, useMemo, useEffect } from 'react';
import { UserCheck, Search, ArrowRight, Mail, GraduationCap, Users, AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { DossierMemoire } from '../../../../models/dossier';
import { EncadrantOption, DemandeEncadrant } from '../../../../models/pipeline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Badge } from '../../../../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../components/ui/tabs';

interface EtapeChoixEncadrantProps {
  dossier: DossierMemoire;
  onComplete: () => void;
}

// Données mock pour les encadrants disponibles
const ENCADRANTS_DISPONIBLES: EncadrantOption[] = [
  {
    id: 1,
    nom: 'Diop',
    prenom: 'Amadou',
    email: 'amadou.diop@isi.edu.sn',
    grade: 'Professeur',
    specialite: 'Intelligence Artificielle',
    departement: 'Informatique',
    estDisponible: true,
    nombreEtudiantsEncadres: 3,
    nombreMaxEtudiants: 5 // Peut encadrer jusqu'à 5 étudiants
  },
  {
    id: 2,
    nom: 'Sow',
    prenom: 'Fatou',
    email: 'fatou.sow@isi.edu.sn',
    grade: 'Maître de Conférences',
    specialite: 'Développement Web',
    departement: 'Informatique',
    estDisponible: true,
    nombreEtudiantsEncadres: 5,
    nombreMaxEtudiants: null // Infini
  },
  {
    id: 3,
    nom: 'Ndiaye',
    prenom: 'Ibrahima',
    email: 'ibrahima.ndiaye@isi.edu.sn',
    grade: 'Professeur',
    specialite: 'Réseaux et Sécurité',
    departement: 'Réseaux',
    estDisponible: false,
    nombreEtudiantsEncadres: 8,
    nombreMaxEtudiants: 10
  },
  {
    id: 4,
    nom: 'Ba',
    prenom: 'Aissatou',
    email: 'aissatou.ba@isi.edu.sn',
    grade: 'Maître de Conférences',
    specialite: 'Base de données',
    departement: 'Informatique',
    estDisponible: true,
    nombreEtudiantsEncadres: 2,
    nombreMaxEtudiants: 4
  }
];

// Données mock pour les demandes d'encadrant envoyées
const DEMANDES_ENCADRANT_MOCK: DemandeEncadrant[] = [
  // Demande refusée
  {
    id: 1,
    encadrant: ENCADRANTS_DISPONIBLES[3], // Maître de Conférences Aissatou Ba
    dossierMemoire: {
      id: 0,
      titre: 'Nouveau dossier de mémoire',
      description: 'Dossier en cours de création'
    },
    dateDemande: new Date('2025-01-10'),
    statut: 'refusee',
    motifRefus: 'Je suis actuellement surchargé et ne peux pas prendre en charge un nouveau dossier pour le moment.',
    dateReponse: new Date('2025-01-12')
  },
  // Demande en attente
  {
    id: 2,
    encadrant: ENCADRANTS_DISPONIBLES[1], // Maître de Conférences Fatou Sow
    dossierMemoire: {
      id: 0,
      titre: 'Nouveau dossier de mémoire',
      description: 'Dossier en cours de création'
    },
    dateDemande: new Date('2025-01-15'),
    statut: 'en_attente'
  },
  // Demande acceptée
  {
    id: 3,
    encadrant: ENCADRANTS_DISPONIBLES[0], // Professeur Amadou Diop
    dossierMemoire: {
      id: 0,
      titre: 'Nouveau dossier de mémoire',
      description: 'Dossier en cours de création'
    },
    dateDemande: new Date('2025-01-08'),
    statut: 'acceptee',
    dateReponse: new Date('2025-01-10')
  }
];

const EtapeChoixEncadrant: React.FC<EtapeChoixEncadrantProps> = ({ dossier, onComplete }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [encadrantSelectionne, setEncadrantSelectionne] = useState<EncadrantOption | null>(null);
  const [demandesEnvoyees, setDemandesEnvoyees] = useState<DemandeEncadrant[]>(DEMANDES_ENCADRANT_MOCK);
  const [activeTab, setActiveTab] = useState<'choix' | 'attente'>('choix');
  
  // Trouver la demande en cours pour ce dossier
  const demandeEnCours = useMemo(() => {
    return demandesEnvoyees.find(d => d.dossierMemoire.id === dossier.id);
  }, [demandesEnvoyees, dossier.id]);

  // Si une demande existe et est en attente ou acceptée, afficher l'onglet attente
  useEffect(() => {
    if (demandeEnCours && (demandeEnCours.statut === 'en_attente' || demandeEnCours.statut === 'acceptee')) {
      setActiveTab('attente');
    } else if (demandeEnCours && demandeEnCours.statut === 'refusee') {
      // Si refusé, retourner à l'onglet choix
      setActiveTab('choix');
    }
  }, [demandeEnCours]);

  // Calculer les places disponibles pour chaque encadrant
  const getPlacesDisponibles = (encadrant: EncadrantOption): number | null => {
    if (encadrant.nombreMaxEtudiants === null) {
      return null; // Infini
    }
    const placesDisponibles = encadrant.nombreMaxEtudiants - encadrant.nombreEtudiantsEncadres;
    return Math.max(0, placesDisponibles);
  };

  // Vérifier si un encadrant a des places disponibles
  const aPlacesDisponibles = (encadrant: EncadrantOption): boolean => {
    const places = getPlacesDisponibles(encadrant);
    return places === null || places > 0;
  };

  // Vérifier si une demande a déjà été envoyée à un encadrant
  const demandeExistante = (encadrantId: number): DemandeEncadrant | undefined => {
    return demandesEnvoyees.find(d => d.encadrant.id === encadrantId && d.dossierMemoire.id === dossier.id);
  };

  const encadrantsFiltres = ENCADRANTS_DISPONIBLES.filter(encadrant => {
    const matchesSearch = 
      `${encadrant.prenom} ${encadrant.nom}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      encadrant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      encadrant.specialite?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      encadrant.departement.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtrer par disponibilité et places disponibles
    const estDisponible = encadrant.estDisponible && aPlacesDisponibles(encadrant);
    
    // Ne pas exclure les encadrants qui ont déjà reçu une demande (pour afficher le statut)
    return matchesSearch && estDisponible;
  });

  const handleValider = () => {
    if (encadrantSelectionne) {
      // Vérifier s'il y a déjà une demande en cours pour ce dossier
      if (demandeEnCours && demandeEnCours.statut === 'en_attente') {
        // On ne peut envoyer qu'une demande à la fois
        alert('Vous avez déjà une demande en attente. Veuillez attendre la réponse.');
        return;
      }

      // Vérifier si une demande existe déjà pour cet encadrant
      const demandeExist = demandeExistante(encadrantSelectionne.id);
      
      if (demandeExist && demandeExist.statut === 'refusee') {
        // Si la demande a été refusée, on peut renvoyer une nouvelle demande
        // Supprimer l'ancienne demande refusée
        setDemandesEnvoyees(prev => prev.filter(d => d.id !== demandeExist.id));
      }

      // Créer une nouvelle demande
      // TODO: Appel API pour envoyer la demande à l'encadrant
      console.log('Demande envoyée à:', encadrantSelectionne);
      const nouvelleDemande: DemandeEncadrant = {
        id: Date.now(),
        encadrant: encadrantSelectionne,
        dossierMemoire: {
          id: dossier.id,
          titre: dossier.titre,
          description: dossier.description
        },
        dateDemande: new Date(),
        statut: 'en_attente'
      };
      setDemandesEnvoyees(prev => [...prev, nouvelleDemande]);
      // Passer à l'onglet d'attente
      setActiveTab('attente');
    }
  };

  const handleRetourChoix = () => {
    setActiveTab('choix');
    setEncadrantSelectionne(null);
  };

  const handleContinuer = () => {
    if (demandeEnCours && demandeEnCours.statut === 'acceptee') {
      // Passer à l'étape supérieure (validation commission)
      onComplete();
    }
  };

  const handleAnnulerDemande = () => {
    if (demandeEnCours && demandeEnCours.statut === 'en_attente') {
      // TODO: Appel API pour annuler la demande
      console.log('Demande annulée:', demandeEnCours);
      // Supprimer la demande de la liste
      setDemandesEnvoyees(prev => prev.filter(d => d.id !== demandeEnCours.id));
      // Retourner à l'onglet choix
      setActiveTab('choix');
      setEncadrantSelectionne(null);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            Étape 3 : Choix de l'encadrant
          </CardTitle>
          <CardDescription>
            Sélectionnez votre encadrant pédagogique parmi les professeurs disponibles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Onglets pour Choix et Attente */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'choix' | 'attente')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="choix" className="gap-2">
                <UserCheck className="h-4 w-4" />
                Choix de l'encadrant
              </TabsTrigger>
              <TabsTrigger value="attente" className="gap-2" disabled={!demandeEnCours}>
                <Clock className="h-4 w-4" />
                Attente de réponse
                {demandeEnCours && demandeEnCours.statut === 'en_attente' && (
                  <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800">
                    1
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="choix" className="space-y-6 mt-6">
          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher un encadrant par nom, spécialité ou département..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Liste des encadrants */}
          <div className="space-y-4">
            {encadrantsFiltres.length > 0 ? (
              encadrantsFiltres.map((encadrant) => (
                <Card
                  key={encadrant.id}
                  className={`cursor-pointer transition-all ${
                    encadrantSelectionne?.id === encadrant.id
                      ? 'border-primary border-2 bg-primary-50'
                      : 'hover:border-primary hover:shadow-md'
                  }`}
                  onClick={() => setEncadrantSelectionne(encadrant)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="bg-primary-100 rounded-full p-3">
                          <UserCheck className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">
                              {encadrant.grade} {encadrant.prenom} {encadrant.nom}
                            </h3>
                            {encadrantSelectionne?.id === encadrant.id && (
                              <Badge variant="default">Sélectionné</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <Mail className="h-4 w-4" />
                            <span>{encadrant.email}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            {encadrant.specialite && (
                              <Badge variant="outline">{encadrant.specialite}</Badge>
                            )}
                            <Badge variant="outline">{encadrant.departement}</Badge>
                            <Badge variant="outline">
                              {encadrant.nombreEtudiantsEncadres} étudiant(s) encadré(s)
                            </Badge>
                            {/* Afficher les places disponibles */}
                            {(() => {
                              const places = getPlacesDisponibles(encadrant);
                              if (places === null) {
                                return (
                                  <Badge variant="outline" className="bg-primary-50 text-primary-700 border-primary-300">
                                    <Users className="h-3 w-3 mr-1" />
                                    Places illimitées
                                  </Badge>
                                );
                              } else if (places === 0) {
                                return (
                                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
                                    <Users className="h-3 w-3 mr-1" />
                                    Plein
                                  </Badge>
                                );
                              } else {
                                return (
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                                    <Users className="h-3 w-3 mr-1" />
                                    {places} place{places > 1 ? 's' : ''} disponible{places > 1 ? 's' : ''}
                                  </Badge>
                                );
                              }
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-gray-600">
                    {searchQuery ? 'Aucun encadrant trouvé' : 'Aucun encadrant disponible'}
                  </p>
                </CardContent>
              </Card>
            )}
              </div>

              {/* Bouton de validation */}
              {encadrantSelectionne && (
                <div className="flex justify-end pt-4 border-t">
                  <Button onClick={handleValider} className="gap-2" disabled={!!demandeEnCours && demandeEnCours.statut === 'en_attente'}>
                    Envoyer la demande
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="attente" className="space-y-6 mt-6">
              {demandeEnCours ? (
                <>
                  {/* Statut de la demande */}
                  <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary-100 rounded-full p-2">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Demande envoyée à {demandeEnCours.encadrant.prenom} {demandeEnCours.encadrant.nom}
                        </h3>
                        <p className="text-sm text-gray-600">{demandeEnCours.encadrant.email}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Envoyée le {formatDate(demandeEnCours.dateDemande)}
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
                    <h4 className="font-semibold text-gray-900 mb-2">Dossier concerné</h4>
                    <p className="text-sm text-gray-700">{demandeEnCours.dossierMemoire.titre}</p>
                    {demandeEnCours.dossierMemoire.description && (
                      <p className="text-xs text-gray-600 mt-1">{demandeEnCours.dossierMemoire.description}</p>
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
                              Votre demande est en cours d'examen par l'encadrant. 
                              Vous recevrez une notification dès qu'une réponse sera disponible.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end pt-4 border-t">
                        <Button onClick={handleAnnulerDemande} variant="outline" className="gap-2">
                          <XCircle className="h-4 w-4" />
                          Annuler la demande
                        </Button>
                      </div>
                    </>
                  )}

                  {demandeEnCours.statut === 'acceptee' && (
                    <>
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-green-900 mb-1">
                              Demande acceptée !
                            </p>
                            <p className="text-sm text-green-700">
                              Votre encadrant a accepté votre demande. Vous pouvez maintenant passer à l'étape suivante.
                            </p>
                            {demandeEnCours.dateReponse && (
                              <p className="text-xs text-green-600 mt-2">
                                Réponse reçue le {formatDate(demandeEnCours.dateReponse)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end pt-4 border-t">
                        <Button onClick={handleContinuer} className="gap-2">
                          Continuer vers l'étape suivante
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}

                  {/* Motif de refus si refusé */}
                  {demandeEnCours.statut === 'refusee' && (
                    <>
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-semibold text-red-900 mb-1">Motif de refus</h4>
                            <p className="text-sm text-red-700">{demandeEnCours.motifRefus}</p>
                            {demandeEnCours.dateReponse && (
                              <p className="text-xs text-red-600 mt-2">
                                Réponse reçue le {formatDate(demandeEnCours.dateReponse)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-orange-900 mb-1">
                              Demande refusée
                            </p>
                            <p className="text-sm text-orange-700">
                              Vous pouvez choisir un autre encadrant en retournant à l'onglet de choix.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end pt-4 border-t">
                        <Button onClick={handleRetourChoix} variant="outline" className="gap-2">
                          Choisir un autre encadrant
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">Aucune demande en cours</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Veuillez d'abord choisir un encadrant dans l'onglet "Choix de l'encadrant"
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default EtapeChoixEncadrant;

