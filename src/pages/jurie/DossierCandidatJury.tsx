import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  User,
  FileText,
  Calendar,
  Mail,
  GraduationCap,
  BookOpen,
  Download,
  Eye,
  FileCheck,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import {
  getDossierById,
  StatutDossierMemoire,
  EtapeDossier
} from '../../models';
import {
  getDocumentsByDossier,
  TypeDocument,
  StatutDocument,
  mockDocuments
} from '../../models/dossier/Document';
import {
  getCandidatById
} from '../../models';
import {
  createTicketForDossier,
  Priorite
} from '../../models/dossier/Ticket';
import {
  getEncadrementsByDossier,
  StatutEncadrement
} from '../../models/dossier/Encadrement';
import {
  ajouterRessourceMediatheque
} from '../../models/ressource/RessourceMediatheque';
import {
  getSoutenancesByProfesseur,
  getSoutenanceById,
  getRoleJuryByProfesseur
} from '../../models/soutenance';
import {
  getProcessVerbalBySoutenance,
  hasProfesseurApprouve,
  isProcessVerbalCompletementApprouve,
  approuverProcessVerbal,
  createProcessVerbal,
  calculerMention,
  type ProcessVerbal,
  Mention
} from '../../models/soutenance/ProcessVerbal';
import { RoleJury } from '../../models/soutenance/MembreJury';
import { getMembresBySoutenance } from '../../models/soutenance/MembreJury';
import { getProfesseurIdByEmail } from '../../models/acteurs/Professeur';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const DossierCandidatJury: React.FC = () => {
  const { soutenanceId, dossierId, candidatId } = useParams<{ 
    soutenanceId: string; 
    dossierId: string; 
    candidatId: string;
  }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'informations' | 'documents' | 'pv'>('informations');
  
  // États pour la création du PV
  const [showCreatePVModal, setShowCreatePVModal] = useState(false);
  const [showApprovePVModal, setShowApprovePVModal] = useState(false);
  const [noteFinale, setNoteFinale] = useState('');
  const [observations, setObservations] = useState('');
  const [appreciations, setAppreciations] = useState('');
  const [demandesModifications, setDemandesModifications] = useState('');
  
  // Calculer la mention automatiquement selon la note
  const mentionCalculee = useMemo(() => {
    if (!noteFinale) return Mention.BIEN;
    const note = parseFloat(noteFinale);
    if (isNaN(note)) return Mention.BIEN;
    return calculerMention(note);
  }, [noteFinale]);

  // Récupérer l'ID professeur
  const idProfesseur = useMemo(() => {
    if (!user?.email) return 0;
    return getProfesseurIdByEmail(user.email) || 0;
  }, [user?.email]);

  // Récupérer la soutenance
  const soutenance = useMemo(() => {
    if (!soutenanceId) return null;
    return getSoutenanceById(parseInt(soutenanceId));
  }, [soutenanceId]);

  // Vérifier que le professeur est membre du jury de cette soutenance
  const role = useMemo(() => {
    if (!soutenance || idProfesseur === 0) return undefined;
    return getRoleJuryByProfesseur(soutenance, idProfesseur);
  }, [soutenance, idProfesseur]);

  if (!soutenance || !role) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Accès restreint</h2>
          <p className="text-gray-600 mb-4">Vous n'êtes pas membre du jury de cette soutenance.</p>
          <Button onClick={() => navigate('/jurie/soutenances')}>
            Retour aux soutenances
          </Button>
        </div>
      </div>
    );
  }

  // Récupérer le dossier
  const dossier = dossierId ? getDossierById(parseInt(dossierId)) : null;
  
  if (!dossier) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Dossier introuvable</h2>
          <p className="text-gray-600 mb-4">Le dossier demandé n'existe pas.</p>
          <Button onClick={() => navigate('/jurie/soutenances')}>
            Retour aux soutenances
          </Button>
        </div>
      </div>
    );
  }

  // Récupérer le candidat
  const candidat = candidatId ? getCandidatById(parseInt(candidatId)) : null;
  
  if (!candidat) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Candidat introuvable</h2>
          <p className="text-gray-600 mb-4">Le candidat demandé n'existe pas.</p>
          <Button onClick={() => navigate('/jurie/soutenances')}>
            Retour aux soutenances
          </Button>
        </div>
      </div>
    );
  }

  // Récupérer les documents du dossier (sauf administratifs)
  const documents = useMemo(() => {
    const allDocs = getDocumentsByDossier(dossier.idDossierMemoire);
    return allDocs.filter(doc => doc.typeDocument !== TypeDocument.DOCUMENT_ADMINISTRATIF);
  }, [dossier.idDossierMemoire]);

  // Récupérer le procès-verbal
  const pv = useMemo(() => {
    return getProcessVerbalBySoutenance(soutenance.idSoutenance);
  }, [soutenance.idSoutenance]);

  // Récupérer les membres du jury
  const membresJury = useMemo(() => {
    return getMembresBySoutenance(soutenance.idSoutenance);
  }, [soutenance.idSoutenance]);

  // Obtenir le membre du jury correspondant au professeur
  const membreJury = useMemo(() => {
    return membresJury.find(m => m.professeur?.idProfesseur === idProfesseur);
  }, [membresJury, idProfesseur]);

  const isPresident = role === RoleJury.PRESIDENT;
  const hasApprouve = pv ? hasProfesseurApprouve(pv, idProfesseur) : false;
  const isCompletementApprouve = pv ? isProcessVerbalCompletementApprouve(pv) : false;

  const handleCreatePV = () => {
    if (!noteFinale || !observations || !appreciations) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const note = parseFloat(noteFinale);
    if (isNaN(note) || note < 0 || note > 20) {
      alert('La note doit être entre 0 et 20.');
      return;
    }

    const newPV = createProcessVerbal(
      soutenance.idSoutenance,
      note,
      observations,
      appreciations,
      demandesModifications || undefined
    );

    if (newPV && membreJury) {
      // Le président approuve automatiquement son propre PV
      approuverProcessVerbal(
        newPV.idPV,
        idProfesseur,
        membreJury.idMembre,
        role!
      );
      
      // Si le PV est complètement approuvé, gérer le document
      if (isProcessVerbalCompletementApprouve(newPV)) {
        handlePVCompletementApprouve(newPV);
      }
    }

    setShowCreatePVModal(false);
    setNoteFinale('');
    setObservations('');
    setAppreciations('');
    setDemandesModifications('');
  };
  
  // Gérer le workflow après approbation complète du PV
  const handlePVCompletementApprouve = (pv: ProcessVerbal) => {
    // Récupérer le document du mémoire
    const documentMemoire = documents.find(doc => doc.typeDocument === TypeDocument.CHAPITRE);
    if (!documentMemoire) return;
    
    // Si des demandes de modifications existent, créer une tâche pour l'étudiant
    if (pv.demandesModifications && pv.demandesModifications.trim()) {
      // Récupérer l'encadrement actif pour ce dossier
      const encadrements = getEncadrementsByDossier(dossier.idDossierMemoire);
      const encadrementActif = encadrements.find(e => e.statut === StatutEncadrement.ACTIF);
      
      if (encadrementActif) {
        // Créer une tâche pour les corrections
        createTicketForDossier(
          encadrementActif,
          dossier,
          'Corrections demandées par le jury',
          pv.demandesModifications,
          Priorite.HAUTE,
          'Le jury a demandé des modifications suite à la soutenance. Veuillez effectuer les corrections et soumettre le document à la commission de validation.',
          []
        );
        
        // Mettre le document en attente de validation commission
        const docIndex = mockDocuments.findIndex((d: any) => d.idDocument === documentMemoire.idDocument);
        if (docIndex !== -1) {
          mockDocuments[docIndex].statut = StatutDocument.EN_ATTENTE_VALIDATION;
        }
      }
    } else {
      // Pas de demandes de modifications : ajouter directement à la bibliothèque numérique (inactif)
      if (candidat) {
        ajouterRessourceMediatheque(documentMemoire, dossier, candidat, false);
      }
    }
  };

  const handleApprovePV = () => {
    if (!pv || !membreJury || !role) return;

    const pvApprouve = approuverProcessVerbal(
      pv.idPV,
      idProfesseur,
      membreJury.idMembre,
      role
    );

    // Si le PV est maintenant complètement approuvé, gérer le document
    if (pvApprouve && isProcessVerbalCompletementApprouve(pvApprouve)) {
      handlePVCompletementApprouve(pvApprouve);
    }

    setShowApprovePVModal(false);
  };

  const getRoleLabel = (role?: RoleJury): string => {
    switch (role) {
      case RoleJury.PRESIDENT:
        return 'Président';
      case RoleJury.RAPPORTEUR:
        return 'Rapporteur';
      case RoleJury.EXAMINATEUR:
        return 'Examinateur';
      case RoleJury.ENCADRANT:
        return 'Encadrant';
      default:
        return 'Membre';
    }
  };

  const getMentionLabel = (m: Mention): string => {
    switch (m) {
      case Mention.EXCELLENT:
        return 'Excellent';
      case Mention.TRES_BIEN:
        return 'Très Bien';
      case Mention.BIEN:
        return 'Bien';
      case Mention.ASSEZ_BIEN:
        return 'Assez Bien';
      case Mention.PASSABLE:
        return 'Passable';
      default:
        return m;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/jurie/soutenances')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dossier du candidat</h1>
            <p className="text-gray-600 mt-1">
              {candidat.prenom} {candidat.nom} - {dossier.titre}
            </p>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('informations')}
          className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'informations'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Informations
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'documents'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Documents ({documents.length})
        </button>
        <button
          onClick={() => setActiveTab('pv')}
          className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'pv'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Procès-verbal
        </button>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'informations' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations du candidat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Nom complet</p>
                    <p className="font-medium">{candidat.prenom} {candidat.nom}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{candidat.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <GraduationCap className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Niveau</p>
                    <p className="font-medium">{candidat.niveau}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Filière</p>
                    <p className="font-medium">{candidat.filiere}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informations du mémoire</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Titre</p>
                <p className="font-medium text-lg">{dossier.titre}</p>
              </div>
              {dossier.description && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Description</p>
                  <p className="text-gray-700">{dossier.description}</p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Statut</p>
                  <Badge>{dossier.statut}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Étape</p>
                  <Badge variant="outline">{dossier.etape}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="space-y-6">
          {documents.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Documents du mémoire</CardTitle>
                <CardDescription>
                  Documents disponibles pour consultation (documents administratifs exclus)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.idDocument} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{doc.titre}</p>
                          <p className="text-sm text-gray-500">
                            {format(doc.dateCreation, 'dd/MM/yyyy', { locale: fr })}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(doc.cheminFichier, '_blank')}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Visualiser
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = doc.cheminFichier;
                            link.download = doc.titre;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun document disponible</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'pv' && (
        <div className="space-y-6">
          {pv ? (
            <Card>
              <CardHeader>
                <CardTitle>Procès-verbal</CardTitle>
                <CardDescription>
                  {isCompletementApprouve
                    ? 'Procès-verbal signé et validé'
                    : `En attente d'approbation (${pv.nombreSignatures}/3 signatures)`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Note finale</p>
                    <p className="text-2xl font-bold">{pv.noteFinale}/20</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Mention</p>
                    <p className="text-lg font-medium">{getMentionLabel(pv.mention)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Observations</p>
                  <p className="text-gray-700">{pv.observations}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Appréciations</p>
                  <p className="text-gray-700">{pv.appreciations}</p>
                </div>
                {pv.demandesModifications && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Demandes de modifications</p>
                    <p className="text-gray-700 whitespace-pre-line">{pv.demandesModifications}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600 mb-2">Approbations</p>
                  <div className="space-y-2">
                    {pv.approbations?.map((approbation, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <span className="font-medium">{getRoleLabel(approbation.roleJury)}</span>
                          <span className="text-sm text-gray-600 ml-2">
                            - {format(approbation.dateApprobation, 'dd/MM/yyyy', { locale: fr })}
                          </span>
                        </div>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                    ))}
                  </div>
                </div>
                {!hasApprouve && !isPresident && (
                  <Button
                    onClick={() => setShowApprovePVModal(true)}
                    className="w-full"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approuver le procès-verbal
                  </Button>
                )}
                {hasApprouve && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded">
                    <p className="text-sm text-green-700">
                      ✓ Vous avez approuvé ce procès-verbal
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <FileCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  {isPresident
                    ? 'Aucun procès-verbal créé. En tant que président, vous pouvez en créer un.'
                    : 'Aucun procès-verbal disponible. Attendez que le président en crée un.'}
                </p>
                {isPresident && (
                  <Button onClick={() => setShowCreatePVModal(true)}>
                    <FileCheck className="h-4 w-4 mr-2" />
                    Créer un procès-verbal
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Modal de création de PV */}
      {showCreatePVModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowCreatePVModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-2xl w-full p-6 rounded-lg max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-xl font-bold mb-4">Créer un procès-verbal</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Note finale (0-20) *</label>
                <Input
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  value={noteFinale}
                  onChange={(e) => setNoteFinale(e.target.value)}
                  placeholder="Ex: 16.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mention (calculée automatiquement)</label>
                <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                  <p className="text-gray-700 font-medium">
                    {getMentionLabel(mentionCalculee)}
                    {noteFinale && (
                      <span className="text-sm text-gray-500 ml-2">
                        (Note: {noteFinale}/20)
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Excellent (≥18) • Très Bien (≥15) • Bien (≥13) • Assez Bien (≥10) • Passable (&lt;10)
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Observations *</label>
                <Textarea
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  placeholder="Observations sur le mémoire..."
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Appréciations *</label>
                <Textarea
                  value={appreciations}
                  onChange={(e) => setAppreciations(e.target.value)}
                  placeholder="Appréciations générales..."
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Demandes de modifications (optionnel)
                </label>
                <Textarea
                  value={demandesModifications}
                  onChange={(e) => setDemandesModifications(e.target.value)}
                  placeholder="Si des modifications sont nécessaires..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreatePVModal(false)}>
                  Annuler
                </Button>
                <Button onClick={handleCreatePV}>
                  Créer le procès-verbal
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Modal d'approbation de PV */}
      {showApprovePVModal && pv && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowApprovePVModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white max-w-3xl w-full max-h-[90vh] flex flex-col rounded-lg overflow-hidden"
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold">Consulter le procès-verbal</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowApprovePVModal(false)}>
                <XCircle className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Détails du procès-verbal</CardTitle>
                    <CardDescription>
                      {isCompletementApprouve
                        ? 'Procès-verbal signé et validé'
                        : `En attente d'approbation (${pv.nombreSignatures}/3 signatures)`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Note finale</p>
                        <p className="text-2xl font-bold">{pv.noteFinale}/20</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Mention</p>
                        <p className="text-lg font-medium">{getMentionLabel(pv.mention)}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Observations</p>
                      <p className="text-gray-700 whitespace-pre-line">{pv.observations}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Appréciations</p>
                      <p className="text-gray-700 whitespace-pre-line">{pv.appreciations}</p>
                    </div>
                    {pv.demandesModifications && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Demandes de modifications</p>
                        <p className="text-gray-700 whitespace-pre-line bg-yellow-50 p-3 rounded border border-yellow-200">
                          {pv.demandesModifications}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Approbations</p>
                      <div className="space-y-2">
                        {pv.approbations && pv.approbations.length > 0 ? (
                          pv.approbations.map((approbation, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded">
                              <div>
                                <span className="font-medium">{getRoleLabel(approbation.roleJury)}</span>
                                <span className="text-sm text-gray-600 ml-2">
                                  - {format(approbation.dateApprobation, 'dd/MM/yyyy', { locale: fr })}
                                </span>
                              </div>
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">Aucune approbation pour le moment</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-600">
                  Êtes-vous sûr de vouloir approuver ce procès-verbal ? Cette action est définitive.
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowApprovePVModal(false)}>
                  Annuler
                </Button>
                <Button onClick={handleApprovePV}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approuver le procès-verbal
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default DossierCandidatJury;

