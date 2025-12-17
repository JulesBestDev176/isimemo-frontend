import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import {
  BookOpen,
  FileCheck,
  AlertCircle,
  Search,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  User,
  Calendar,
  Users,
  Globe,
  MessageSquare,
  Send
} from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { mockSujets, type Sujet } from '../../models/pipeline/SujetMemoire';
import { mockDossiers, type DossierMemoire, EtapeDossier, StatutDossierMemoire } from '../../models/dossier/DossierMemoire';
import {
  mockDocuments,
  StatutDocument,
  TypeDocument,
  type Document
} from '../../models/dossier/Document';
import { mockProfesseurs } from '../../models/acteurs/Professeur';
import { mockCandidats } from '../../models/acteurs/Candidat';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { activerRessource } from '../../models/ressource/RessourceMediatheque';
import { mockRessourcesMediatheque } from '../../models/ressource/RessourceMediatheque';
import { getEncadrementsByDossier, StatutEncadrement } from '../../models/dossier/Encadrement';
import {
  mettreDepotEnPhasePublique,
  getDepotsEnPhasePublique
} from '../../models/dossier/DossierMemoire';
import {
  mettreDocumentEnPhasePublique,
  getDocumentsEnPhasePublique
} from '../../models/dossier/Document';
import {
  mockAvisPublics,
  getAvisPublicsByElement,
  ajouterAvisPublic,
  type AvisPublic
} from '../../models/commission/AvisPublic';
import {
  getTypePeriodeActive,
  TypePeriodeValidation,
  estPeriodeValidationSujets,
  estPeriodeValidationCorrections,
  changerPeriodeActive
} from '../../models/commission/PeriodeValidation';

const EspaceCommission: React.FC = () => {
  const { user } = useAuth();

  // State pour forcer le re-render lors du changement de période
  const [refreshKey, setRefreshKey] = useState(0);

  // Recalculer la période active à chaque changement (dépend de refreshKey)
  const periodeActive = useMemo(() => getTypePeriodeActive(), [refreshKey]);

  // Déterminer l'onglet initial selon la période active
  const initialTab = useMemo(() => {
    return periodeActive === TypePeriodeValidation.VALIDATION_SUJETS
      ? 'sujets'
      : periodeActive === TypePeriodeValidation.VALIDATION_CORRECTIONS
        ? 'documents'
        : periodeActive === TypePeriodeValidation.AUCUNE
          ? 'sujets' // Par défaut, mais ne sera pas affiché
          : 'phase_publique';
  }, [periodeActive]);

  // Sous-onglets pour les sujets
  const [sousOngletSujets, setSousOngletSujets] = useState<'en_attente' | 'valides' | 'rejetes'>('en_attente');

  // Sous-onglets pour les documents
  const [sousOngletDocuments, setSousOngletDocuments] = useState<'en_attente' | 'valides' | 'rejetes'>('en_attente');

  const [activeTab, setActiveTab] = useState<'sujets' | 'documents' | 'phase_publique'>(initialTab);

  // Mettre à jour l'onglet actif si la période change
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // États pour la validation des dépôts de sujets
  const [searchQuerySujets, setSearchQuerySujets] = useState('');
  const [selectedDepot, setSelectedDepot] = useState<DossierMemoire | null>(null);
  const [showConsultationModalSujet, setShowConsultationModalSujet] = useState(false);
  const [showValidationModalSujet, setShowValidationModalSujet] = useState(false);
  const [validationActionSujet, setValidationActionSujet] = useState<'valider' | 'rejeter' | null>(null);
  const [commentaireSujet, setCommentaireSujet] = useState('');

  // États pour la validation des documents
  const [searchQueryDocuments, setSearchQueryDocuments] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showConsultationModalDocument, setShowConsultationModalDocument] = useState(false);
  const [showValidationModalDocument, setShowValidationModalDocument] = useState(false);
  const [validationActionDocument, setValidationActionDocument] = useState<'valider' | 'rejeter' | null>(null);
  const [commentaireDocument, setCommentaireDocument] = useState('');

  // États pour la phase publique
  const [searchQueryPhasePublique, setSearchQueryPhasePublique] = useState('');
  const [selectedElementPhasePublique, setSelectedElementPhasePublique] = useState<{
    type: 'depot_sujet' | 'document_corrige';
    depot?: DossierMemoire;
    document?: Document;
  } | null>(null);
  const [showPhasePubliqueModal, setShowPhasePubliqueModal] = useState(false);
  const [nouvelAvis, setNouvelAvis] = useState('');

  // États pour la pagination
  const [currentPageSujets, setCurrentPageSujets] = useState(1);
  const [currentPageDocuments, setCurrentPageDocuments] = useState(1);
  const [currentPagePhasePublique, setCurrentPagePhasePublique] = useState(1);

  const [currentPageAvisModalSujet, setCurrentPageAvisModalSujet] = useState(1);
  const [currentPageAvisModalDocument, setCurrentPageAvisModalDocument] = useState(1);
  const ITEMS_PER_PAGE = 5;
  const AVIS_PER_PAGE = 5;


  // Vérifier que l'utilisateur est membre de la commission
  if (!user || user.type !== 'professeur' || !user.estCommission) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès restreint</h2>
          <p className="text-gray-600">Cette page est réservée aux membres de la commission de validation.</p>
        </div>
      </div>
    );
  }

  // ============================================================================
  // LOGIQUE POUR LA VALIDATION DES DÉPÔTS DE SUJETS
  // ============================================================================

  // Récupérer les dépôts de sujets selon le sous-onglet
  const depotsEnAttente = useMemo(() => {
    return mockDossiers.filter(d =>
      d.etape === EtapeDossier.VALIDATION_SUJET &&
      d.encadrant &&
      (d.statut === StatutDossierMemoire.EN_ATTENTE_VALIDATION || d.statut === StatutDossierMemoire.EN_CREATION)
    );
  }, [refreshKey]);

  const depotsValides = useMemo(() => {
    return mockDossiers.filter(d =>
      d.etape === EtapeDossier.EN_COURS_REDACTION &&
      d.statut === StatutDossierMemoire.EN_COURS &&
      d.encadrant // Avoir un encadrant signifie qu'il a été validé
    );
  }, [refreshKey]);

  const depotsRejetes = useMemo(() => {
    return mockDossiers.filter(d =>
      d.etape === EtapeDossier.CHOIX_SUJET &&
      d.statut === StatutDossierMemoire.EN_CREATION &&
      d.encadrant === undefined // Pas d'encadrant après rejet (ou encadrant retiré)
    );
  }, [refreshKey]);

  // Filtrer selon le sous-onglet actif
  const depotsFiltresParSousOnglet = useMemo(() => {
    if (sousOngletSujets === 'en_attente') return depotsEnAttente;
    if (sousOngletSujets === 'valides') return depotsValides;
    if (sousOngletSujets === 'rejetes') return depotsRejetes;
    return [];
  }, [sousOngletSujets, depotsEnAttente, depotsValides, depotsRejetes]);

  // Filtrer les dépôts par recherche
  const depotsFiltres = useMemo(() => {
    if (!searchQuerySujets.trim()) return depotsFiltresParSousOnglet;
    const query = searchQuerySujets.toLowerCase();
    return depotsFiltresParSousOnglet.filter(d => {
      const titreMatch = d.titre.toLowerCase().includes(query);
      const descriptionMatch = d.description.toLowerCase().includes(query);
      const candidatMatch = d.candidats?.some(c =>
        `${c.prenom} ${c.nom}`.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query)
      ) || false;
      const encadrantMatch = d.encadrant ?
        `${d.encadrant.prenom} ${d.encadrant.nom}`.toLowerCase().includes(query) ||
        d.encadrant.email.toLowerCase().includes(query) : false;
      return titreMatch || descriptionMatch || candidatMatch || encadrantMatch;
    });
  }, [depotsFiltresParSousOnglet, searchQuerySujets]);

  const handleConsulterDepot = (depot: DossierMemoire) => {
    setSelectedDepot(depot);
    setShowConsultationModalSujet(true);
  };

  const handleValiderDepot = () => {
    if (!selectedDepot) return;
    setValidationActionSujet('valider');
    setCommentaireSujet('');
    setShowValidationModalSujet(true);
  };

  const handleRejeterDepot = () => {
    if (!selectedDepot) return;
    setValidationActionSujet('rejeter');
    setCommentaireSujet('');
    setShowValidationModalSujet(true);
  };

  const handleConfirmValidationDepot = () => {
    if (!selectedDepot) return;

    const depotIndex = mockDossiers.findIndex(d => d.idDossierMemoire === selectedDepot.idDossierMemoire);
    if (depotIndex === -1) return;

    if (validationActionSujet === 'valider') {
      // Valider le dépôt : passer à l'étape suivante
      mockDossiers[depotIndex].etape = EtapeDossier.EN_COURS_REDACTION;
      mockDossiers[depotIndex].statut = StatutDossierMemoire.EN_COURS;
    } else if (validationActionSujet === 'rejeter') {
      // Rejeter le dépôt : retourner à CHOIX_SUJET
      mockDossiers[depotIndex].etape = EtapeDossier.CHOIX_SUJET;
      mockDossiers[depotIndex].statut = StatutDossierMemoire.EN_CREATION;
      // Optionnel : supprimer l'encadrant choisi
      // mockDossiers[depotIndex].encadrant = undefined;
    }

    setShowValidationModalSujet(false);
    setSelectedDepot(null);
    setValidationActionSujet(null);
    setCommentaireSujet('');
  };

  // ============================================================================
  // LOGIQUE POUR LA VALIDATION DES DOCUMENTS
  // ============================================================================

  // Récupérer les documents selon le sous-onglet
  const documentsEnAttente = useMemo(() => {
    return mockDocuments.filter(d =>
      d.statut === StatutDocument.EN_ATTENTE_VALIDATION &&
      d.typeDocument === TypeDocument.CHAPITRE
    );
  }, [refreshKey]);

  const documentsValides = useMemo(() => {
    return mockDocuments.filter(d =>
      d.statut === StatutDocument.VALIDE &&
      d.typeDocument === TypeDocument.CHAPITRE
    );
  }, [refreshKey]);

  const documentsRejetes = useMemo(() => {
    return mockDocuments.filter(d =>
      d.statut === StatutDocument.REJETE &&
      d.typeDocument === TypeDocument.CHAPITRE
    );
  }, [refreshKey]);

  // Filtrer selon le sous-onglet actif
  const documentsFiltresParSousOnglet = useMemo(() => {
    if (sousOngletDocuments === 'en_attente') return documentsEnAttente;
    if (sousOngletDocuments === 'valides') return documentsValides;
    if (sousOngletDocuments === 'rejetes') return documentsRejetes;
    return [];
  }, [sousOngletDocuments, documentsEnAttente, documentsValides, documentsRejetes]);

  // Filtrer les documents par recherche
  const documentsFiltres = useMemo(() => {
    if (!searchQueryDocuments.trim()) return documentsFiltresParSousOnglet;
    const query = searchQueryDocuments.toLowerCase();
    return documentsFiltresParSousOnglet.filter(d => {
      const dossier = d.dossierMemoire;
      const titreMatch = d.titre.toLowerCase().includes(query);
      const dossierTitreMatch = dossier?.titre?.toLowerCase().includes(query) || false;
      const candidatsMatch = dossier?.candidats?.some(c =>
        `${c.prenom} ${c.nom}`.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query)
      ) || false;
      return titreMatch || dossierTitreMatch || candidatsMatch;
    });
  }, [documentsFiltresParSousOnglet, searchQueryDocuments]);

  const handleConsulterDocument = (document: Document) => {
    setSelectedDocument(document);
    setShowConsultationModalDocument(true);
  };

  const handleValiderDocument = () => {
    if (!selectedDocument) return;
    setValidationActionDocument('valider');
    setCommentaireDocument('');
    setShowValidationModalDocument(true);
  };

  const handleRejeterDocument = () => {
    if (!selectedDocument) return;
    setValidationActionDocument('rejeter');
    setCommentaireDocument('');
    setShowValidationModalDocument(true);
  };

  const handleConfirmValidationDocument = () => {
    if (!selectedDocument) return;

    const docIndex = mockDocuments.findIndex(d => d.idDocument === selectedDocument.idDocument);
    if (docIndex === -1) return;

    if (validationActionDocument === 'valider') {
      mockDocuments[docIndex].statut = StatutDocument.VALIDE;

      // Activer la ressource dans la bibliothèque numérique
      const ressource = mockRessourcesMediatheque.find(r =>
        r.cheminFichier === selectedDocument.cheminFichier
      );
      if (ressource) {
        activerRessource(ressource.idRessource);
      }
    } else if (validationActionDocument === 'rejeter') {
      mockDocuments[docIndex].statut = StatutDocument.REJETE;
      if (commentaireDocument.trim()) {
        mockDocuments[docIndex].commentaire = commentaireDocument;
      }
    }

    setShowValidationModalDocument(false);
    setSelectedDocument(null);
    setValidationActionDocument(null);
    setCommentaireDocument('');
  };

  // ============================================================================
  // LOGIQUE POUR LA PHASE PUBLIQUE
  // ============================================================================

  // Récupérer les dépôts en phase publique (seulement si période de validation des sujets)
  const depotsPhasePublique = useMemo(() => {
    if (!estPeriodeValidationSujets()) return [];
    return getDepotsEnPhasePublique();
  }, [refreshKey]);

  // Récupérer les documents en phase publique (seulement si période de validation des corrections)
  const documentsPhasePublique = useMemo(() => {
    if (!estPeriodeValidationCorrections()) return [];
    return getDocumentsEnPhasePublique();
  }, [refreshKey]);

  // Filtrer les éléments en phase publique par recherche
  const elementsPhasePubliqueFiltres = useMemo(() => {
    const elements: Array<{ type: 'depot_sujet' | 'document_corrige'; depot?: DossierMemoire; document?: Document }> = [];

    depotsPhasePublique.forEach(depot => {
      elements.push({ type: 'depot_sujet', depot });
    });

    documentsPhasePublique.forEach(document => {
      elements.push({ type: 'document_corrige', document });
    });

    if (!searchQueryPhasePublique.trim()) return elements;

    const query = searchQueryPhasePublique.toLowerCase();
    return elements.filter(el => {
      if (el.type === 'depot_sujet' && el.depot) {
        const titreMatch = el.depot.titre.toLowerCase().includes(query);
        const descriptionMatch = el.depot.description.toLowerCase().includes(query);
        const candidatMatch = el.depot.candidats?.some(c =>
          `${c.prenom} ${c.nom}`.toLowerCase().includes(query)
        ) || false;
        return titreMatch || descriptionMatch || candidatMatch;
      } else if (el.type === 'document_corrige' && el.document) {
        const titreMatch = el.document.titre.toLowerCase().includes(query);
        const dossierTitreMatch = el.document.dossierMemoire?.titre?.toLowerCase().includes(query) || false;
        return titreMatch || dossierTitreMatch;
      }
      return false;
    });
  }, [depotsPhasePublique, documentsPhasePublique, searchQueryPhasePublique]);

  const handleMettreEnPhasePubliqueDepot = () => {
    if (!selectedDepot) return;
    mettreDepotEnPhasePublique(selectedDepot.idDossierMemoire);
    setShowConsultationModalSujet(false);
    setSelectedDepot(null);
  };

  const handleMettreEnPhasePubliqueDocument = () => {
    if (!selectedDocument) return;
    mettreDocumentEnPhasePublique(selectedDocument.idDocument);
    setShowConsultationModalDocument(false);
    setSelectedDocument(null);
  };

  const handleConsulterPhasePublique = (element: { type: 'depot_sujet' | 'document_corrige'; depot?: DossierMemoire; document?: Document }) => {
    setSelectedElementPhasePublique(element);
    setShowPhasePubliqueModal(true);
    setNouvelAvis('');
  };

  const handleAjouterAvis = () => {
    if (!selectedElementPhasePublique || !nouvelAvis.trim() || !user) return;

    const idElement = selectedElementPhasePublique.type === 'depot_sujet'
      ? selectedElementPhasePublique.depot?.idDossierMemoire
      : selectedElementPhasePublique.document?.idDocument;

    if (!idElement) return;

    // Trouver l'auteur dans les mocks basé sur l'utilisateur connecté
    let auteur: any = null;

    if (user.type === 'professeur') {
      // Chercher le professeur correspondant dans les mocks
      const professeur = mockProfesseurs.find(p => p.email === user.email);
      if (professeur) {
        auteur = professeur;
      } else {
        // Créer un professeur temporaire si non trouvé
        const [prenom, ...nomParts] = (user.name || '').split(' ');
        auteur = {
          idProfesseur: parseInt(user.id) || 0,
          nom: nomParts.join(' ') || 'Professeur',
          prenom: prenom || '',
          email: user.email || '',
          estDisponible: true
        };
      }
    } else {
      // Chercher le candidat correspondant dans les mocks
      const candidat = mockCandidats.find(c => c.email === user.email);
      if (candidat) {
        auteur = candidat;
      } else {
        // Créer un candidat temporaire si non trouvé
        const [prenom, ...nomParts] = (user.name || '').split(' ');
        auteur = {
          idCandidat: parseInt(user.id) || 0,
          nom: nomParts.join(' ') || 'Candidat',
          prenom: prenom || '',
          email: user.email || '',
          numeroMatricule: `ETU${user.id}`
        };
      }
    }

    if (auteur) {
      ajouterAvisPublic(
        selectedElementPhasePublique.type,
        idElement,
        auteur,
        nouvelAvis.trim()
      );
      setNouvelAvis('');
    }
  };

  // ============================================================================
  // FONCTIONS ET COMPOSANT DE PAGINATION
  // ============================================================================

  const paginateItems = <T,>(items: T[], currentPage: number, itemsPerPage: number = ITEMS_PER_PAGE): T[] => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  };

  const Pagination: React.FC<{
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
  }> = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pages: number[] = [];
      const maxPagesToShow = 5;

      if (totalPages <= maxPagesToShow) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          pages.push(1, 2, 3, 4, -1, totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1, -1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
          pages.push(1, -1, currentPage - 1, currentPage, currentPage + 1, -2, totalPages);
        }
      }

      return pages;
    };

    return (
      <div className="flex items-center justify-center gap-2 mt-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Précédent
        </Button>

        {getPageNumbers().map((pageNum, index) => {
          if (pageNum === -1 || pageNum === -2) {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                ...
              </span>
            );
          }

          return (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNum)}
              className={currentPage === pageNum ? "bg-primary text-white" : ""}
            >
              {pageNum}
            </Button>
          );
        })}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Suivant
        </Button>
      </div>
    );
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Espace Commission</h1>
          <p className="text-gray-600 mt-1">Validez les sujets et les documents corrigés après soutenance</p>
        </div>
        {/* Bouton de simulation pour changer de période - À RETIRER */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Période: {periodeActive === TypePeriodeValidation.VALIDATION_SUJETS
              ? 'Validation Sujets'
              : periodeActive === TypePeriodeValidation.VALIDATION_CORRECTIONS
                ? 'Validation Corrections'
                : 'Aucune'}
          </Badge>
          <div className="flex gap-1 border rounded-lg p-1 bg-gray-50">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                changerPeriodeActive(TypePeriodeValidation.VALIDATION_SUJETS);
                setActiveTab('sujets');
                setRefreshKey(prev => prev + 1); // Force le re-render
              }}
              className={`text-xs ${periodeActive === TypePeriodeValidation.VALIDATION_SUJETS ? 'bg-primary text-white' : ''}`}
            >
              Sujets
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                changerPeriodeActive(TypePeriodeValidation.VALIDATION_CORRECTIONS);
                setActiveTab('documents');
                setRefreshKey(prev => prev + 1); // Force le re-render
              }}
              className={`text-xs ${periodeActive === TypePeriodeValidation.VALIDATION_CORRECTIONS ? 'bg-primary text-white' : ''}`}
            >
              Corrections
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                changerPeriodeActive(TypePeriodeValidation.AUCUNE);
                setActiveTab('sujets'); // Par défaut, mais ne sera pas affiché
                setRefreshKey(prev => prev + 1); // Force le re-render
              }}
              className={`text-xs ${periodeActive === TypePeriodeValidation.AUCUNE ? 'bg-primary text-white' : ''}`}
            >
              Aucune
            </Button>
          </div>
        </div>
      </div>

      {/* Onglets - Affichage conditionnel selon la période active */}
      <div className="flex gap-2 border-b">
        {/* Onglet Validation des sujets - Seulement si période de validation des sujets */}
        {periodeActive === TypePeriodeValidation.VALIDATION_SUJETS && (
          <button
            onClick={() => setActiveTab('sujets')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'sujets'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Validation des sujets
              {depotsEnAttente.length > 0 && (
                <Badge variant="outline" className="ml-2">
                  {depotsEnAttente.length}
                </Badge>
              )}
            </div>
          </button>
        )}

        {/* Onglet Validation des documents - Seulement si période de validation des corrections */}
        {periodeActive === TypePeriodeValidation.VALIDATION_CORRECTIONS && (
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'documents'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
          >
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              Validation des documents corrigés
              {documentsEnAttente.length > 0 && (
                <Badge variant="outline" className="ml-2">
                  {documentsEnAttente.length}
                </Badge>
              )}
            </div>
          </button>
        )}

        {/* Onglet Phase publique - Seulement si une période est active */}
        {periodeActive !== TypePeriodeValidation.AUCUNE && (
          <button
            onClick={() => setActiveTab('phase_publique')}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'phase_publique'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
          >
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Phase publique
              {(depotsPhasePublique.length + documentsPhasePublique.length) > 0 && (
                <Badge variant="outline" className="ml-2">
                  {depotsPhasePublique.length + documentsPhasePublique.length}
                </Badge>
              )}
            </div>
          </button>
        )}
      </div>

      {/* Message si aucune période n'est active */}
      {periodeActive === TypePeriodeValidation.AUCUNE && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-900">Aucune période de validation active</p>
                <p className="text-sm text-yellow-700 mt-1">
                  Aucune période de validation des sujets ou des corrections n'est actuellement active.
                  Veuillez contacter le chef de département pour activer une période de validation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contenu des onglets */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Onglet Validation des sujets - Seulement si période active */}
        {activeTab === 'sujets' && periodeActive === TypePeriodeValidation.VALIDATION_SUJETS && (
          <div className="space-y-6">
            {/* Sous-onglets pour les sujets */}
            <div className="flex gap-2 border-b">
              <button
                onClick={() => setSousOngletSujets('en_attente')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${sousOngletSujets === 'en_attente'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
              >
                En attente
                {depotsEnAttente.length > 0 && (
                  <Badge variant="outline" className="ml-2">
                    {depotsEnAttente.length}
                  </Badge>
                )}
              </button>
              <button
                onClick={() => setSousOngletSujets('valides')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${sousOngletSujets === 'valides'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
              >
                Validés
                {depotsValides.length > 0 && (
                  <Badge variant="outline" className="ml-2">
                    {depotsValides.length}
                  </Badge>
                )}
              </button>
              <button
                onClick={() => setSousOngletSujets('rejetes')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${sousOngletSujets === 'rejetes'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
              >
                Rejetés
                {depotsRejetes.length > 0 && (
                  <Badge variant="outline" className="ml-2">
                    {depotsRejetes.length}
                  </Badge>
                )}
              </button>
            </div>

            {/* Recherche */}
            <Card>
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Rechercher par candidat, sujet, encadrant..."
                    value={searchQuerySujets}
                    onChange={(e) => setSearchQuerySujets(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Liste des dépôts de sujets */}
            {depotsFiltres.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun dépôt en attente</h3>
                  <p className="text-gray-600">Tous les dépôts de sujets ont été traités ou aucun dépôt n'est en attente de validation.</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="space-y-4">
                  {paginateItems(depotsFiltres, currentPageSujets).map((depot) => {
                    // Récupérer les candidats : soit depuis le binôme, soit directement depuis le dossier
                    const candidats = depot.binome?.candidats || depot.candidats || [];
                    const estBinome = depot.binome && depot.binome.candidats && depot.binome.candidats.length > 1;
                    return (
                      <motion.div
                        key={depot.idDossierMemoire}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-xl mb-2">{depot.titre}</CardTitle>
                                <CardDescription className="mt-2">
                                  <div className="flex flex-wrap gap-2 items-center">
                                    {estBinome && (
                                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                        Binôme
                                      </Badge>
                                    )}
                                    {candidats.map((candidat, idx) => (
                                      <Badge key={idx} variant="outline">
                                        {candidat.prenom} {candidat.nom}
                                      </Badge>
                                    ))}
                                    {depot.encadrant && (
                                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                        Encadrant: {depot.encadrant.prenom} {depot.encadrant.nom}
                                      </Badge>
                                    )}
                                  </div>
                                </CardDescription>
                              </div>
                              {sousOngletSujets === 'en_attente' && (
                                <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                                  En attente
                                </Badge>
                              )}
                              {sousOngletSujets === 'valides' && (
                                <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                                  Validé
                                </Badge>
                              )}
                              {sousOngletSujets === 'rejetes' && (
                                <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                                  Rejeté
                                </Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Description</p>
                                <p className="text-gray-700">{depot.description}</p>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {candidats.length > 0 && (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <User className="h-4 w-4 mr-2 text-gray-400" />
                                    <span className="font-medium">{estBinome ? 'Binôme:' : 'Candidat(s):'}</span>
                                    <span className="ml-2">
                                      {candidats.map(c => `${c.prenom} ${c.nom}`).join(', ')}
                                    </span>
                                  </div>
                                )}
                                {depot.encadrant && (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <User className="h-4 w-4 mr-2 text-gray-400" />
                                    <span className="font-medium">Encadrant choisi:</span>
                                    <span className="ml-2">
                                      {depot.encadrant.prenom} {depot.encadrant.nom}
                                      {depot.encadrant.email && ` (${depot.encadrant.email})`}
                                    </span>
                                  </div>
                                )}
                                <div className="flex items-center text-sm text-gray-600">
                                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                  <span className="font-medium">Date de dépôt:</span>
                                  <span className="ml-2">
                                    {format(depot.dateCreation, 'dd/MM/yyyy', { locale: fr })}
                                  </span>
                                </div>
                              </div>
                              <div className="flex gap-2 pt-4 border-t">
                                <Button
                                  variant="outline"
                                  onClick={() => handleConsulterDepot(depot)}
                                  className="flex items-center gap-2"
                                >
                                  <Eye className="h-4 w-4" />
                                  Consulter
                                </Button>
                                {sousOngletSujets === 'en_attente' && (
                                  <>
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        mettreDepotEnPhasePublique(depot.idDossierMemoire);
                                      }}
                                      className="flex items-center gap-2 border-blue-500 text-blue-600 hover:bg-blue-50"
                                    >
                                      <Globe className="h-4 w-4" />
                                      Mettre en phase publique
                                    </Button>
                                    <Button
                                      variant="default"
                                      onClick={() => {
                                        handleConsulterDepot(depot);
                                        setTimeout(() => {
                                          setShowConsultationModalSujet(false);
                                          handleValiderDepot();
                                        }, 100);
                                      }}
                                      className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                      Valider
                                    </Button>
                                    <Button
                                      variant="default"
                                      onClick={() => {
                                        handleConsulterDepot(depot);
                                        setTimeout(() => {
                                          setShowConsultationModalSujet(false);
                                          handleRejeterDepot();
                                        }, 100);
                                      }}
                                      className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                                    >
                                      <XCircle className="h-4 w-4" />
                                      Rejeter
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
                <Pagination
                  currentPage={currentPageSujets}
                  totalItems={depotsFiltres.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={(page) => setCurrentPageSujets(page)}
                />
              </>
            )}
          </div>
        )}

        {/* Onglet Validation des documents - Seulement si période active */}
        {activeTab === 'documents' && periodeActive === TypePeriodeValidation.VALIDATION_CORRECTIONS && (
          <div className="space-y-6">
            {/* Sous-onglets pour les documents */}
            <div className="flex gap-2 border-b">
              <button
                onClick={() => setSousOngletDocuments('en_attente')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${sousOngletDocuments === 'en_attente'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
              >
                En attente
                {documentsEnAttente.length > 0 && (
                  <Badge variant="outline" className="ml-2">
                    {documentsEnAttente.length}
                  </Badge>
                )}
              </button>
              <button
                onClick={() => setSousOngletDocuments('valides')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${sousOngletDocuments === 'valides'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
              >
                Validés
                {documentsValides.length > 0 && (
                  <Badge variant="outline" className="ml-2">
                    {documentsValides.length}
                  </Badge>
                )}
              </button>
              <button
                onClick={() => setSousOngletDocuments('rejetes')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${sousOngletDocuments === 'rejetes'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
              >
                Rejetés
                {documentsRejetes.length > 0 && (
                  <Badge variant="outline" className="ml-2">
                    {documentsRejetes.length}
                  </Badge>
                )}
              </button>
            </div>

            {/* Recherche */}
            <Card>
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Rechercher par titre, dossier ou candidat..."
                    value={searchQueryDocuments}
                    onChange={(e) => setSearchQueryDocuments(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Liste des documents */}
            {documentsFiltres.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {sousOngletDocuments === 'en_attente' && 'Aucun document en attente'}
                    {sousOngletDocuments === 'valides' && 'Aucun document validé'}
                    {sousOngletDocuments === 'rejetes' && 'Aucun document rejeté'}
                  </h3>
                  <p className="text-gray-600">
                    {sousOngletDocuments === 'en_attente' && 'Tous les documents ont été traités ou aucun document n\'est en attente de validation.'}
                    {sousOngletDocuments === 'valides' && 'Aucun document corrigé n\'a été validé pour le moment.'}
                    {sousOngletDocuments === 'rejetes' && 'Aucun document corrigé n\'a été rejeté pour le moment.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="space-y-4">
                  {paginateItems(documentsFiltres, currentPageDocuments).map((document) => {
                    const dossier = document.dossierMemoire;
                    const candidats = dossier?.candidats || [];

                    return (
                      <motion.div
                        key={document.idDocument}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-xl mb-2">{document.titre}</CardTitle>
                                <CardDescription className="mt-2">
                                  {dossier && (
                                    <div className="flex flex-wrap gap-2 items-center">
                                      <Badge variant="outline">Dossier: {dossier.titre}</Badge>
                                      {candidats.map((candidat, idx) => (
                                        <Badge key={idx} variant="outline">
                                          {candidat.prenom} {candidat.nom}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </CardDescription>
                              </div>
                              {sousOngletDocuments === 'en_attente' && (
                                <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                                  En attente
                                </Badge>
                              )}
                              {sousOngletDocuments === 'valides' && (
                                <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                                  Validé
                                </Badge>
                              )}
                              {sousOngletDocuments === 'rejetes' && (
                                <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                                  Rejeté
                                </Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center text-sm text-gray-600">
                                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                  <span className="font-medium">Date de dépôt:</span>
                                  <span className="ml-2">
                                    {format(document.dateCreation, 'dd/MM/yyyy', { locale: fr })}
                                  </span>
                                </div>
                                {document.dateModification && (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                    <span className="font-medium">Dernière modification:</span>
                                    <span className="ml-2">
                                      {format(document.dateModification, 'dd/MM/yyyy', { locale: fr })}
                                    </span>
                                  </div>
                                )}
                              </div>
                              {document.commentaire && (
                                <div>
                                  <p className="text-sm text-gray-600 mb-1">Commentaire précédent</p>
                                  <p className="text-gray-700 bg-gray-50 p-3 rounded border">
                                    {document.commentaire}
                                  </p>
                                </div>
                              )}
                              <div className="flex gap-2 pt-4 border-t">
                                <Button
                                  variant="outline"
                                  onClick={() => handleConsulterDocument(document)}
                                  className="flex items-center gap-2"
                                >
                                  <Eye className="h-4 w-4" />
                                  Consulter
                                </Button>
                                {sousOngletDocuments === 'en_attente' && (
                                  <>
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        mettreDocumentEnPhasePublique(document.idDocument);
                                      }}
                                      className="flex items-center gap-2 border-blue-500 text-blue-600 hover:bg-blue-50"
                                    >
                                      <Globe className="h-4 w-4" />
                                      Mettre en phase publique
                                    </Button>
                                    <Button
                                      variant="default"
                                      onClick={() => {
                                        handleConsulterDocument(document);
                                        setTimeout(() => {
                                          setShowConsultationModalDocument(false);
                                          handleValiderDocument();
                                        }, 100);
                                      }}
                                      className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                      Valider
                                    </Button>
                                    <Button
                                      variant="default"
                                      onClick={() => {
                                        handleConsulterDocument(document);
                                        setTimeout(() => {
                                          setShowConsultationModalDocument(false);
                                          handleRejeterDocument();
                                        }, 100);
                                      }}
                                      className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                                    >
                                      <XCircle className="h-4 w-4" />
                                      Rejeter
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
                <Pagination
                  currentPage={currentPageDocuments}
                  totalItems={documentsFiltres.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={(page) => setCurrentPageDocuments(page)}
                />
              </>
            )}
          </div>
        )}

        {/* Onglet Phase publique */}
        {activeTab === 'phase_publique' && (
          <div className="space-y-6">
            {/* Recherche */}
            <Card>
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Rechercher dans les éléments en phase publique..."
                    value={searchQueryPhasePublique}
                    onChange={(e) => setSearchQueryPhasePublique(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Liste des éléments en phase publique */}
            {elementsPhasePubliqueFiltres.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun élément en phase publique</h3>
                  <p className="text-gray-600">Aucun dépôt de sujet ou document n'est actuellement en phase publique.</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="space-y-4">
                  {paginateItems(elementsPhasePubliqueFiltres, currentPagePhasePublique).map((element, index) => {
                    if (element.type === 'depot_sujet' && element.depot) {
                      const depot = element.depot;
                      const candidats = depot.binome?.candidats || depot.candidats || [];
                      const estBinome = depot.binome && depot.binome.candidats && depot.binome.candidats.length > 1;
                      const avis = getAvisPublicsByElement('depot_sujet', depot.idDossierMemoire);

                      return (
                        <motion.div
                          key={`depot-${depot.idDossierMemoire}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <Card className="hover:shadow-lg transition-shadow border-blue-200">
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <CardTitle className="text-xl mb-2 flex items-center gap-2">
                                    {depot.titre}
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                      <Globe className="h-3 w-3 mr-1" />
                                      Phase publique
                                    </Badge>
                                  </CardTitle>
                                  <CardDescription className="mt-2">
                                    <div className="flex flex-wrap gap-2 items-center">
                                      {estBinome && (
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                          Binôme
                                        </Badge>
                                      )}
                                      {candidats.map((candidat, idx) => (
                                        <Badge key={idx} variant="outline">
                                          {candidat.prenom} {candidat.nom}
                                        </Badge>
                                      ))}
                                      {depot.encadrant && (
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                          Encadrant: {depot.encadrant.prenom} {depot.encadrant.nom}
                                        </Badge>
                                      )}
                                    </div>
                                  </CardDescription>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div>
                                  <p className="text-sm text-gray-600 mb-1">Description</p>
                                  <p className="text-gray-700">{depot.description}</p>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t">
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MessageSquare className="h-4 w-4" />
                                    <span>{avis.length} avis</span>
                                  </div>
                                  <Button
                                    variant="outline"
                                    onClick={() => handleConsulterPhasePublique(element)}
                                    className="flex items-center gap-2"
                                  >
                                    <Eye className="h-4 w-4" />
                                    Consulter et donner un avis
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    } else if (element.type === 'document_corrige' && element.document) {
                      const document = element.document;
                      const dossier = document.dossierMemoire;
                      const candidats = dossier?.candidats || [];
                      const avis = getAvisPublicsByElement('document_corrige', document.idDocument);

                      return (
                        <motion.div
                          key={`document-${document.idDocument}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <Card className="hover:shadow-lg transition-shadow border-blue-200">
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <CardTitle className="text-xl mb-2 flex items-center gap-2">
                                    {document.titre}
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                      <Globe className="h-3 w-3 mr-1" />
                                      Phase publique
                                    </Badge>
                                  </CardTitle>
                                  <CardDescription className="mt-2">
                                    {dossier && (
                                      <div className="flex flex-wrap gap-2 items-center">
                                        <Badge variant="outline">Dossier: {dossier.titre}</Badge>
                                        {candidats.map((candidat, idx) => (
                                          <Badge key={idx} variant="outline">
                                            {candidat.prenom} {candidat.nom}
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </CardDescription>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="flex items-center justify-between pt-4 border-t">
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MessageSquare className="h-4 w-4" />
                                    <span>{avis.length} avis</span>
                                  </div>
                                  <Button
                                    variant="outline"
                                    onClick={() => handleConsulterPhasePublique(element)}
                                    className="flex items-center gap-2"
                                  >
                                    <Eye className="h-4 w-4" />
                                    Consulter et donner un avis
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    }
                    return null;
                  })}
                </div>
                <Pagination
                  currentPage={currentPagePhasePublique}
                  totalItems={elementsPhasePubliqueFiltres.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={(page) => setCurrentPagePhasePublique(page)}
                />
              </>
            )}
          </div>
        )}
      </motion.div>

      {/* Modal de consultation pour les dépôts de sujets */}
      {showConsultationModalSujet && selectedDepot && (() => {
        const avis = getAvisPublicsByElement('depot_sujet', selectedDepot.idDossierMemoire);
        const paginatedAvis = paginateItems(avis, currentPageAvisModalSujet, AVIS_PER_PAGE);

        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowConsultationModalSujet(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white max-w-4xl w-full p-6 rounded-lg max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-xl font-bold mb-4">Détails du dépôt de sujet</h3>
              <div className="space-y-4">
                {/* UNIQUEMENT  Avis publics avec pagination */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-blue-900">
                    <MessageSquare className="h-4 w-4" />
                    Avis publics ({avis.length})
                  </h4>
                  {avis.length > 0 ? (
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                      {avis.map((avisItem) => (
                        <div key={avisItem.idAvis} className="bg-white p-3 rounded border">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <User className="h-3 w-3 text-gray-400" />
                              <span className="font-medium text-xs">
                                {'nom' in avisItem.auteur
                                  ? `${avisItem.auteur.prenom} ${avisItem.auteur.nom}`
                                  : 'Utilisateur'}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {format(avisItem.dateCreation, 'dd/MM/yyyy', { locale: fr })}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm">{avisItem.contenu}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-sm text-center py-4">
                      Aucun avis public pour le moment
                    </p>
                  )}
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <Button variant="outline" onClick={() => {
                    setShowConsultationModalSujet(false);
                  }}>
                    Fermer
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        );
      })()}


      {/* Modal de validation/rejet pour les dépôts de sujets */}
      {showValidationModalSujet && selectedDepot && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowValidationModalSujet(false)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-2xl w-full p-6 rounded-lg max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-xl font-bold mb-4">
              {validationActionSujet === 'valider' ? 'Valider le dépôt de sujet' : 'Rejeter le dépôt de sujet'}
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Sujet</p>
                <p className="text-gray-700">{selectedDepot.titre}</p>
              </div>
              {(() => {
                const candidats = selectedDepot.binome?.candidats || selectedDepot.candidats || [];
                const estBinome = selectedDepot.binome && selectedDepot.binome.candidats && selectedDepot.binome.candidats.length > 1;
                return candidats.length > 0 ? (
                  <div>
                    <p className="text-sm font-medium mb-1">{estBinome ? 'Binôme' : 'Candidat(s)'}</p>
                    <p className="text-gray-700">
                      {candidats.map(c => `${c.prenom} ${c.nom}`).join(', ')}
                    </p>
                  </div>
                ) : null;
              })()}
              {selectedDepot.encadrant && (
                <div>
                  <p className="text-sm font-medium mb-1">Encadrant choisi</p>
                  <p className="text-gray-700">
                    {selectedDepot.encadrant.prenom} {selectedDepot.encadrant.nom}
                  </p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Commentaire {validationActionSujet === 'rejeter' && '(obligatoire)'}
                </label>
                <Textarea
                  value={commentaireSujet}
                  onChange={(e) => setCommentaireSujet(e.target.value)}
                  placeholder={validationActionSujet === 'valider'
                    ? 'Commentaire optionnel...'
                    : 'Veuillez indiquer la raison du rejet...'}
                  rows={4}
                  required={validationActionSujet === 'rejeter'}
                />
                {validationActionSujet === 'valider' && (
                  <p className="text-xs text-gray-500 mt-1">
                    Si validé, le candidat pourra commencer la rédaction de son mémoire.
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowValidationModalSujet(false)}>
                  Annuler
                </Button>
                <Button
                  onClick={handleConfirmValidationDepot}
                  disabled={validationActionSujet === 'rejeter' && !commentaireSujet.trim()}
                  className={validationActionSujet === 'valider'
                    ? 'bg-primary hover:bg-primary/90'
                    : 'bg-primary hover:bg-primary/90'}
                >
                  {validationActionSujet === 'valider' ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirmer la validation
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Confirmer le rejet
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )
      }

      {/* Modal de consultation pour les documents */}
      {
        showConsultationModalDocument && selectedDocument && (() => {
          const avis = getAvisPublicsByElement('document_corrige', selectedDocument.idDocument);
          const paginatedAvis = paginateItems(avis, currentPageAvisModalDocument, AVIS_PER_PAGE);

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => {
                setShowConsultationModalDocument(false);
                setCurrentPageAvisModalDocument(1);
              }}
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white max-w-4xl w-full p-6 rounded-lg max-h-[90vh] overflow-y-auto"
              >
                <h3 className="text-xl font-bold mb-4">Détails du document</h3>
                <div className="space-y-4">
                  {/* UNIQUEMENT Avis publics avec pagination */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2 text-blue-900">
                      <MessageSquare className="h-4 w-4" />
                      Avis publics ({avis.length})
                    </h4>
                    {avis.length > 0 ? (
                      <>
                        <div className="space-y-3">
                          {paginatedAvis.map((avisItem) => (
                            <div key={avisItem.idAvis} className="bg-white p-3 rounded border">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <User className="h-3 w-3 text-gray-400" />
                                  <span className="font-medium text-xs">
                                    {'nom' in avisItem.auteur
                                      ? `${avisItem.auteur.prenom} ${avisItem.auteur.nom}`
                                      : 'Utilisateur'}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {format(avisItem.dateCreation, 'dd/MM/yyyy', { locale: fr })}
                                </span>
                              </div>
                              <p className="text-gray-700 text-sm">{avisItem.contenu}</p>
                            </div>
                          ))}
                        </div>
                        <Pagination
                          currentPage={currentPageAvisModalDocument}
                          totalItems={avis.length}
                          itemsPerPage={AVIS_PER_PAGE}
                          onPageChange={(page) => setCurrentPageAvisModalDocument(page)}
                        />
                      </>
                    ) : (
                      <p className="text-gray-600 text-sm text-center py-4">
                        Aucun avis public pour le moment
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end pt-4 border-t">
                    <Button variant="outline" onClick={() => {
                      setShowConsultationModalDocument(false);
                      setCurrentPageAvisModalDocument(1);
                    }}>
                      Fermer
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })()
      }

      {/* Modal de validation/rejet pour les documents */}
      {
        showValidationModalDocument && selectedDocument && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowValidationModalDocument(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white max-w-2xl w-full p-6 rounded-lg max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-xl font-bold mb-4">
                {validationActionDocument === 'valider' ? 'Valider le document' : 'Rejeter le document'}
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1">Document</p>
                  <p className="text-gray-700">{selectedDocument.titre}</p>
                </div>
                {selectedDocument.dossierMemoire && (
                  <div>
                    <p className="text-sm font-medium mb-1">Dossier</p>
                    <p className="text-gray-700">{selectedDocument.dossierMemoire.titre}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Commentaire {validationActionDocument === 'rejeter' && '(obligatoire)'}
                  </label>
                  <Textarea
                    value={commentaireDocument}
                    onChange={(e) => setCommentaireDocument(e.target.value)}
                    placeholder={validationActionDocument === 'valider'
                      ? 'Commentaire optionnel...'
                      : 'Veuillez indiquer la raison du rejet...'}
                    rows={4}
                    required={validationActionDocument === 'rejeter'}
                  />
                  {validationActionDocument === 'valider' && (
                    <p className="text-xs text-gray-500 mt-1">
                      Si validé, le document sera activé dans la bibliothèque numérique.
                    </p>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowValidationModalDocument(false)}>
                    Annuler
                  </Button>
                  <Button
                    onClick={handleConfirmValidationDocument}
                    disabled={validationActionDocument === 'rejeter' && !commentaireDocument.trim()}
                    className={validationActionDocument === 'valider'
                      ? 'bg-primary hover:bg-primary/90'
                      : 'bg-primary hover:bg-primary/90'}
                  >
                    {validationActionDocument === 'valider' ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirmer la validation
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 mr-2" />
                        Confirmer le rejet
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )
      }

      {/* Modal de consultation pour la phase publique */}
      {
        showPhasePubliqueModal && selectedElementPhasePublique && (() => {
          const avis = selectedElementPhasePublique.type === 'depot_sujet'
            ? getAvisPublicsByElement('depot_sujet', selectedElementPhasePublique.depot?.idDossierMemoire || 0)
            : getAvisPublicsByElement('document_corrige', selectedElementPhasePublique.document?.idDocument || 0);

          if (selectedElementPhasePublique.type === 'depot_sujet' && selectedElementPhasePublique.depot) {
            const depot = selectedElementPhasePublique.depot;
            const candidats = depot.binome?.candidats || depot.candidats || [];
            const estBinome = depot.binome && depot.binome.candidats && depot.binome.candidats.length > 1;

            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={() => setShowPhasePubliqueModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white max-w-4xl w-full p-6 rounded-lg max-h-[90vh] overflow-y-auto"
                >
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    Dépôt de sujet en phase publique
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-1 text-gray-600">Sujet</p>
                      <p className="text-gray-900 text-lg">{depot.titre}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1 text-gray-600">Description</p>
                      <p className="text-gray-700">{depot.description}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {candidats.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-1 text-gray-600">{estBinome ? 'Binôme' : 'Candidat(s)'}</p>
                          <div className="flex flex-wrap gap-2">
                            {candidats.map((candidat, idx) => (
                              <Badge key={idx} variant="outline">
                                {candidat.prenom} {candidat.nom}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {depot.encadrant && (
                        <div>
                          <p className="text-sm font-medium mb-1 text-gray-600">Encadrant</p>
                          <p className="text-gray-700">
                            {depot.encadrant.prenom} {depot.encadrant.nom}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Section des avis */}
                    <div className="pt-4 border-t">
                      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Avis publics ({avis.length})
                      </h4>
                      <div className="space-y-4 mb-4 max-h-60 overflow-y-auto">
                        {avis.length === 0 ? (
                          <p className="text-gray-500 text-sm italic">Aucun avis pour le moment.</p>
                        ) : (
                          avis.map((avisItem) => (
                            <div key={avisItem.idAvis} className="bg-gray-50 p-3 rounded border">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-gray-400" />
                                  <span className="font-medium text-sm">
                                    {'nom' in avisItem.auteur
                                      ? `${avisItem.auteur.prenom} ${avisItem.auteur.nom}`
                                      : 'Utilisateur'}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {format(avisItem.dateCreation, 'dd/MM/yyyy à HH:mm', { locale: fr })}
                                </span>
                              </div>
                              <p className="text-gray-700 text-sm">{avisItem.contenu}</p>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Formulaire pour ajouter un avis */}
                      <div className="pt-4 border-t">
                        <label className="block text-sm font-medium mb-2">Ajouter votre avis</label>
                        <Textarea
                          value={nouvelAvis}
                          onChange={(e) => setNouvelAvis(e.target.value)}
                          placeholder="Partagez votre point de vue sur ce dépôt de sujet..."
                          rows={3}
                          className="mb-2"
                        />
                        <Button
                          onClick={handleAjouterAvis}
                          disabled={!nouvelAvis.trim()}
                          className="w-full"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Publier mon avis
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t">
                      <Button variant="outline" onClick={() => setShowPhasePubliqueModal(false)}>
                        Fermer
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          } else if (selectedElementPhasePublique.type === 'document_corrige' && selectedElementPhasePublique.document) {
            const document = selectedElementPhasePublique.document;
            const dossier = document.dossierMemoire;
            const candidats = dossier?.candidats || [];
            const encadrements = dossier ? getEncadrementsByDossier(dossier.idDossierMemoire) : [];
            const encadrementActif = encadrements.find(e => e.statut === StatutEncadrement.ACTIF);
            const encadrant = encadrementActif?.professeur || dossier?.encadrant;

            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={() => setShowPhasePubliqueModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white max-w-4xl w-full p-6 rounded-lg max-h-[90vh] overflow-y-auto"
                >
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    Document corrigé en phase publique
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-1 text-gray-600">Titre du document</p>
                      <p className="text-gray-900 text-lg">{document.titre}</p>
                    </div>
                    {dossier && (
                      <>
                        <div>
                          <p className="text-sm font-medium mb-1 text-gray-600">Dossier</p>
                          <p className="text-gray-700">{dossier.titre}</p>
                        </div>
                        {candidats.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-1 text-gray-600">Candidat(s)</p>
                            <div className="flex flex-wrap gap-2">
                              {candidats.map((candidat, idx) => (
                                <Badge key={idx} variant="outline">
                                  {candidat.prenom} {candidat.nom}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {encadrant && (
                          <div>
                            <p className="text-sm font-medium mb-1 text-gray-600">Encadrant</p>
                            <p className="text-gray-700">
                              {encadrant.prenom} {encadrant.nom}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => window.open(document.cheminFichier, '_blank')}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Visualiser
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          const link = window.document.createElement('a');
                          link.href = document.cheminFichier;
                          link.download = document.titre;
                          window.document.body.appendChild(link);
                          link.click();
                          window.document.body.removeChild(link);
                        }}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Télécharger
                      </Button>
                    </div>

                    {/* Section des avis */}
                    <div className="pt-4 border-t">
                      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Avis publics ({avis.length})
                      </h4>
                      <div className="space-y-4 mb-4 max-h-60 overflow-y-auto">
                        {avis.length === 0 ? (
                          <p className="text-gray-500 text-sm italic">Aucun avis pour le moment.</p>
                        ) : (
                          avis.map((avisItem) => (
                            <div key={avisItem.idAvis} className="bg-gray-50 p-3 rounded border">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-gray-400" />
                                  <span className="font-medium text-sm">
                                    {'nom' in avisItem.auteur
                                      ? `${avisItem.auteur.prenom} ${avisItem.auteur.nom}`
                                      : 'Utilisateur'}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {format(avisItem.dateCreation, 'dd/MM/yyyy à HH:mm', { locale: fr })}
                                </span>
                              </div>
                              <p className="text-gray-700 text-sm">{avisItem.contenu}</p>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Formulaire pour ajouter un avis */}
                      <div className="pt-4 border-t">
                        <label className="block text-sm font-medium mb-2">Ajouter votre avis</label>
                        <Textarea
                          value={nouvelAvis}
                          onChange={(e) => setNouvelAvis(e.target.value)}
                          placeholder="Partagez votre point de vue sur ce document..."
                          rows={3}
                          className="mb-2"
                        />
                        <Button
                          onClick={handleAjouterAvis}
                          disabled={!nouvelAvis.trim()}
                          className="w-full"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Publier mon avis
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t">
                      <Button variant="outline" onClick={() => setShowPhasePubliqueModal(false)}>
                        Fermer
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          }
          return null;
        })()
      }
    </div >
  );
};

export default EspaceCommission;
