import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  List,
  Filter,
  Plus,
  Calendar,
  X,
  CheckCircle,
  Circle,
  AlertCircle,
  Clock,
  ArrowRight,
  Upload,
  FileText,
  Trash2,
  Download,
  Info
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SousEtape {
  id: number;
  titre: string;
  terminee: boolean;
}

interface Tache {
  id: number;
  titre: string;
  description: string;
  statutColonne: 'todo' | 'inprogress' | 'review' | 'done';
  priorite: 'Basse' | 'Moyenne' | 'Haute' | 'Critique';
  assignee?: string;
  dateCreation: string;
  dateEcheance?: string;
  tags: string[];
  commentaires: Commentaire[];
  progression: number;
  fichiers: Fichier[];
  sousEtapes?: SousEtape[];
  consigne?: string;
  urgent?: boolean;
  note?: string;
  livrable?: {
    nom: string;
    taille: string;
    dateUpload: string;
    fichier?: File;
  };
  estRetournee?: boolean;
  feedbackRetour?: {
    dateRetour: string;
    commentaire: string;
    corrections: string[];
  };
}

interface Commentaire {
  id: number;
  auteur: string;
  contenu: string;
  date: string;
}

interface Fichier {
  id: number;
  nom: string;
  taille: string;
  type: string;
  dateUpload: string;
}

interface Colonne {
  id: string;
  titre: string;
  couleur: string;
  taches: Tache[];
  limite?: number;
}

const EspaceTravail: React.FC = () => {
  const { user } = useAuth();
  const [showTacheModal, setShowTacheModal] = useState(false);
  const [tacheSelectionnee, setTacheSelectionnee] = useState<Tache | null>(null);
  const [modeVue, setModeVue] = useState<'kanban' | 'liste'>('kanban');
  const [filtres, setFiltres] = useState({
    priorite: '',
    assignee: '',
    tags: '',
  });
  const [draggedTask, setDraggedTask] = useState<number | null>(null);
  const [colonnes, setColonnes] = useState<Colonne[]>([]);
  const [fichierLivrable, setFichierLivrable] = useState<File | null>(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Initialiser les colonnes pour l'espace de travail
  useEffect(() => {
    const colonnesInitiales: Colonne[] = [
      {
        id: 'todo',
        titre: 'À faire',
        couleur: 'bg-blue-50 border-blue-200',
        limite: 5,
        taches: [
          {
            id: 1,
            titre: 'Recherche bibliographique',
            description: 'Effectuer une recherche approfondie sur les systèmes de gestion de mémoire',
            statutColonne: 'todo',
            priorite: 'Moyenne',
            assignee: user?.name || '',
            dateCreation: '2024-07-01',
            dateEcheance: '2024-07-15',
            tags: ['recherche', 'bibliographie'],
            commentaires: [],
            progression: 0,
            fichiers: [],
            sousEtapes: [
              { id: 1, titre: 'Identifier les bases de données académiques pertinentes', terminee: false },
              { id: 2, titre: 'Rechercher les articles scientifiques sur le sujet', terminee: false },
              { id: 3, titre: 'Analyser et synthétiser les résultats trouvés', terminee: false },
              { id: 4, titre: 'Rédiger la section bibliographique', terminee: false }
            ],
            consigne: 'Privilégier les articles récents (moins de 5 ans) et les sources académiques reconnues.',
            urgent: false,
            note: 'Cette étape est fondamentale pour la suite du mémoire.'
          },
          {
            id: 2,
            titre: 'Rédaction introduction',
            description: 'Rédiger l\'introduction du mémoire avec problématique et objectifs clairement définis',
            statutColonne: 'todo',
            priorite: 'Haute',
            assignee: user?.name || '',
            dateCreation: '2024-07-02',
            dateEcheance: '2024-07-10',
            tags: ['rédaction', 'introduction'],
            commentaires: [],
            progression: 0,
            fichiers: [],
            sousEtapes: [
              { id: 1, titre: 'Définir le contexte général', terminee: false },
              { id: 2, titre: 'Formuler la problématique', terminee: false },
              { id: 3, titre: 'Présenter les objectifs de recherche', terminee: false },
              { id: 4, titre: 'Annoncer le plan du mémoire', terminee: false }
            ],
            consigne: 'L\'introduction doit être claire, concise et accrocheuse. Maximum 3 pages.',
            urgent: true,
            note: 'Deadline importante - à remettre avant la réunion avec l\'encadrant.'
          }
        ]
      },
      {
        id: 'inprogress',
        titre: 'En cours',
        couleur: 'bg-blue-50 border-blue-200',
        limite: 3,
        taches: [
          {
            id: 3,
            titre: 'Développement prototype',
            description: 'Implémenter la première version du système',
            statutColonne: 'inprogress',
            priorite: 'Critique',
            assignee: user?.name || '',
            dateCreation: '2024-06-28',
            dateEcheance: '2024-07-20',
            tags: ['développement', 'prototype'],
            commentaires: [],
            progression: 60,
            fichiers: [],
            sousEtapes: [
              { id: 1, titre: 'Créer la structure de base du projet', terminee: true },
              { id: 2, titre: 'Implémenter les fonctionnalités principales', terminee: true },
              { id: 3, titre: 'Ajouter les tests unitaires', terminee: false },
              { id: 4, titre: 'Documenter le code', terminee: false }
            ],
            consigne: 'Assurez-vous que le code soit bien documenté et testé avant de passer en révision.',
            urgent: false,
            note: 'Priorité critique - deadline approche.',
            estRetournee: true,
            feedbackRetour: {
              dateRetour: '2024-07-10T14:30:00Z',
              commentaire: 'Le prototype nécessite des améliorations avant validation. Veuillez corriger les points suivants.',
              corrections: [
                'Ajouter plus de tests unitaires pour couvrir au moins 80% du code',
                'Améliorer la documentation des fonctions principales',
                'Corriger les erreurs de gestion d\'exceptions identifiées',
                'Optimiser les performances des requêtes à la base de données'
              ]
            }
          }
        ]
      },
      {
        id: 'review',
        titre: 'En révision',
        couleur: 'bg-blue-50 border-blue-200',
        taches: [
          {
            id: 4,
            titre: 'Chapitre État de l\'art',
            description: 'Révision du chapitre 2 selon les commentaires de l\'encadrant',
            statutColonne: 'review',
            priorite: 'Haute',
            assignee: user?.name || '',
            dateCreation: '2024-06-25',
            dateEcheance: '2024-07-08',
            tags: ['rédaction', 'révision'],
            commentaires: [],
            progression: 90,
            fichiers: [],
            sousEtapes: [
              { id: 1, titre: 'Corriger les erreurs identifiées', terminee: true },
              { id: 2, titre: 'Améliorer la structure du chapitre', terminee: true },
              { id: 3, titre: 'Ajouter les références manquantes', terminee: true },
              { id: 4, titre: 'Revoir la conclusion', terminee: true }
            ],
            consigne: 'Prenez en compte tous les commentaires de l\'encadrant pour cette révision.',
            urgent: false,
            note: 'Cette révision est importante pour la suite du mémoire.',
            livrable: {
              nom: 'Chapitre2_Etat_art_v2.pdf',
              taille: '3.2 MB',
              dateUpload: '2024-07-05T10:30:00Z'
            }
          }
        ]
      },
      {
        id: 'done',
        titre: 'Terminé',
        couleur: 'bg-blue-50 border-blue-200',
        taches: [
          {
            id: 5,
            titre: 'Plan détaillé du mémoire',
            description: 'Élaboration et validation du plan détaillé avec l\'encadrant',
            statutColonne: 'done',
            priorite: 'Moyenne',
            assignee: user?.name || '',
            dateCreation: '2024-06-20',
            dateEcheance: '2024-06-30',
            tags: ['planification', 'structure'],
            commentaires: [],
            progression: 100,
            fichiers: [],
            sousEtapes: [
              { id: 1, titre: 'Définir la structure générale', terminee: true },
              { id: 2, titre: 'Détailler chaque chapitre', terminee: true },
              { id: 3, titre: 'Valider avec l\'encadrant', terminee: true }
            ],
            consigne: 'Le plan doit être clair et structuré pour faciliter la rédaction.',
            note: 'Plan validé par l\'encadrant.',
            livrable: {
              nom: 'Plan_detaille_memoire.pdf',
              taille: '1.5 MB',
              dateUpload: '2024-06-30T16:00:00Z'
            }
          }
        ]
      }
    ];

    setColonnes(colonnesInitiales);
  }, [user]);

  const getPrioriteColor = (priorite: string) => {
    switch (priorite) {
      case 'Critique': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Haute': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Moyenne': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Basse': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const deplacerTache = (tacheId: number, nouvelleColonne: string) => {
    setColonnes(prev => {
      // Vérifier les restrictions pour "En cours"
      if (nouvelleColonne === 'inprogress') {
        // Vérifier s'il y a déjà une tâche en cours (sauf celle qu'on déplace)
        const tachesEnCours = prev.find(col => col.id === 'inprogress')?.taches.filter(t => t.id !== tacheId) || [];
        if (tachesEnCours.length > 0) {
          setAlertMessage('Vous ne pouvez avoir qu\'une seule tâche "En cours" à la fois. Veuillez terminer ou envoyer en révision la tâche actuelle.');
          setShowAlertModal(true);
          return prev;
        }

        // Vérifier s'il y a une tâche en révision non terminée
        const tachesEnRevision = prev.find(col => col.id === 'review')?.taches.length || 0;
        if (tachesEnRevision > 0) {
          setAlertMessage('Vous ne pouvez pas commencer une nouvelle tâche tant qu\'une tâche est en révision. Veuillez attendre la validation de la tâche en révision.');
          setShowAlertModal(true);
          return prev;
        }
      }

      const nouvellesColonnes = prev.map(col => ({
        ...col,
        taches: col.taches.filter(t => t.id !== tacheId)
      }));

      const tache = prev.flatMap(col => col.taches).find(t => t.id === tacheId);
      if (tache) {
        const colonneCible = nouvellesColonnes.find(col => col.id === nouvelleColonne);
        if (colonneCible) {
          colonneCible.taches.push({ ...tache, statutColonne: nouvelleColonne as any });
        }
      }

      return nouvellesColonnes;
    });
  };

  const filtrerTaches = (taches: Tache[]) => {
    return taches.filter(tache => {
      if (filtres.priorite && tache.priorite !== filtres.priorite) return false;
      if (filtres.assignee && !tache.assignee?.includes(filtres.assignee)) return false;
      if (filtres.tags && !tache.tags.some(tag => tag.includes(filtres.tags))) return false;
      return true;
    });
  };

  const handleDragStart = (e: React.DragEvent, tacheId: number) => {
    setDraggedTask(tacheId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, colonneId: string) => {
    e.preventDefault();
    if (draggedTask) {
      // Empêcher le déplacement des tâches "En révision" vers "Terminé" par l'étudiant
      const tache = colonnes.flatMap(col => col.taches).find(t => t.id === draggedTask);
      if (tache && tache.statutColonne === 'review' && colonneId === 'done') {
        setAlertMessage('Vous ne pouvez pas déplacer une tâche en révision vers "Terminé". Seul votre encadrant peut valider la révision.');
        setShowAlertModal(true);
        setDraggedTask(null);
        return;
      }
      deplacerTache(draggedTask, colonneId);
    }
    setDraggedTask(null);
  };

  const migrerVersEnCours = (tacheId: number) => {
    // Vérifier s'il y a déjà une tâche en cours
    const tacheEnCours = colonnes.find(col => col.id === 'inprogress')?.taches.length || 0;
    if (tacheEnCours > 0) {
      setAlertMessage('Vous ne pouvez avoir qu\'une seule tâche "En cours" à la fois. Veuillez terminer ou envoyer en révision la tâche actuelle.');
      setShowAlertModal(true);
      return;
    }

    // Vérifier s'il y a une tâche en révision non terminée
    const tachesEnRevision = colonnes.find(col => col.id === 'review')?.taches.length || 0;
    if (tachesEnRevision > 0) {
      setAlertMessage('Vous ne pouvez pas commencer une nouvelle tâche tant qu\'une tâche est en révision. Veuillez attendre la validation de la tâche en révision.');
      setShowAlertModal(true);
      return;
    }

    deplacerTache(tacheId, 'inprogress');
    setTacheSelectionnee(null);
  };

  const envoyerEnRevision = (tacheId: number) => {
    if (!fichierLivrable && !tacheSelectionnee?.livrable) {
      setAlertMessage('Veuillez d\'abord uploader un document PDF avant d\'envoyer en révision.');
      setShowAlertModal(true);
      return;
    }

    // Vérifier que toutes les sous-étapes sont validées
    if (tacheSelectionnee?.sousEtapes && tacheSelectionnee.sousEtapes.length > 0) {
      const toutesEtapesValidees = tacheSelectionnee.sousEtapes.every(etape => etape.terminee);
      if (!toutesEtapesValidees) {
        const etapesNonValidees = tacheSelectionnee.sousEtapes.filter(etape => !etape.terminee).length;
        setAlertMessage(`Vous devez valider toutes les sous-étapes avant d'envoyer en révision. ${etapesNonValidees} sous-étape(s) restante(s).`);
        setShowAlertModal(true);
        return;
      }
    }

    setColonnes(prev => {
      const nouvellesColonnes = prev.map(colonne => ({
        ...colonne,
        taches: colonne.taches.filter(t => t.id !== tacheId)
      }));

      const tache = prev.flatMap(col => col.taches).find(t => t.id === tacheId);
      if (tache) {
        const colonneReview = nouvellesColonnes.find(col => col.id === 'review');
        if (colonneReview) {
          const livrable = fichierLivrable ? {
            nom: fichierLivrable.name,
            taille: `${(fichierLivrable.size / 1024 / 1024).toFixed(2)} MB`,
            dateUpload: new Date().toISOString(),
            fichier: fichierLivrable
          } : tache.livrable;

          colonneReview.taches.push({
            ...tache,
            statutColonne: 'review' as const,
            livrable: livrable
          });
        }
      }

      return nouvellesColonnes;
    });

    setFichierLivrable(null);
    setTacheSelectionnee(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setAlertMessage('Veuillez sélectionner un fichier PDF.');
        setShowAlertModal(true);
        e.target.value = '';
        return;
      }
      setFichierLivrable(file);
    }
  };

  const supprimerLivrable = () => {
    setFichierLivrable(null);
    if (tacheSelectionnee) {
      setColonnes(prev => {
        return prev.map(colonne => ({
          ...colonne,
          taches: colonne.taches.map(tache => {
            if (tache.id === tacheSelectionnee.id) {
              return { ...tache, livrable: undefined };
            }
            return tache;
          })
        }));
      });
      setTacheSelectionnee({ ...tacheSelectionnee, livrable: undefined });
    }
  };

  const toggleSousEtape = (tacheId: number, sousEtapeId: number) => {
    setColonnes(prev => {
      const nouvellesColonnes = prev.map(colonne => ({
        ...colonne,
        taches: colonne.taches.map(tache => {
          if (tache.id === tacheId && tache.sousEtapes) {
            const nouvellesSousEtapes = tache.sousEtapes.map(etape =>
              etape.id === sousEtapeId ? { ...etape, terminee: !etape.terminee } : etape
            );
            const etapesTerminees = nouvellesSousEtapes.filter(e => e.terminee).length;
            const nouvelleProgression = Math.round((etapesTerminees / nouvellesSousEtapes.length) * 100);

            const tacheMiseAJour = {
              ...tache,
              sousEtapes: nouvellesSousEtapes,
              progression: nouvelleProgression
            };

            // Mettre à jour la tâche sélectionnée si c'est celle-ci
            if (tacheSelectionnee && tacheSelectionnee.id === tacheId) {
              setTimeout(() => {
                setTacheSelectionnee(tacheMiseAJour);
              }, 0);
            }

            return tacheMiseAJour;
          }
          return tache;
        })
      }));
      return nouvellesColonnes;
    });
  };

  return (
    <motion.div
      key="espace-travail"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Barre d'outils */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-6">
          {/* Modes de vue */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setModeVue('kanban')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center space-x-2 ${modeVue === 'kanban'
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <List className="h-4 w-4" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setModeVue('liste')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center space-x-2 ${modeVue === 'liste'
                ? 'bg-white shadow-sm text-gray-900'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <List className="h-4 w-4" />
              <span>Liste</span>
            </button>
          </div>

          {/* Filtres */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                value={filtres.priorite}
                onChange={(e) => setFiltres(prev => ({ ...prev, priorite: e.target.value }))}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Toutes priorités</option>
                <option value="Critique">Critique</option>
                <option value="Haute">Haute</option>
                <option value="Moyenne">Moyenne</option>
                <option value="Basse">Basse</option>
              </select>
            </div>
          </div>
        </div>

      </div>

      {/* Vue Kanban */}
      {modeVue === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-8">
          {colonnes.map(colonne => (
            <div
              key={colonne.id}
              className={`flex-1 min-w-[280px] max-w-xs bg-white border border-gray-200 shadow-sm flex flex-col h-[70vh] ${colonne.couleur}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, colonne.id)}
            >
              <div className={`p-4 rounded-t-xl border-b ${colonne.couleur}`}>
                <div>
                  <h3 className="font-semibold text-gray-900">{colonne.titre}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {filtrerTaches(colonne.taches).length} tâche{filtrerTaches(colonne.taches).length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-4">
                <AnimatePresence>
                  {filtrerTaches(colonne.taches).map(tache => (
                    <motion.div
                      key={tache.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, tache.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => {
                        setTacheSelectionnee(tache);
                        setFichierLivrable(null);
                      }}
                      className={`p-4 bg-white border border-gray-200 cursor-pointer hover:shadow-md hover:border-gray-300 transition-all ${draggedTask === tache.id ? 'opacity-50' : ''
                        }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium text-gray-900 text-sm leading-relaxed flex-1 pr-2">
                          {tache.titre}
                        </h4>
                        <div className="flex flex-col items-end space-y-1">
                          <span className={`px-2 py-1 text-xs font-medium rounded-md border ${getPrioriteColor(tache.priorite)}`}>
                            {tache.priorite}
                          </span>
                          {tache.estRetournee && (
                            <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-md border border-blue-200">
                              Retournée
                            </span>
                          )}
                        </div>
                      </div>

                      {tache.description && (
                        <p className="text-gray-600 text-xs mb-3 leading-relaxed line-clamp-2">
                          {tache.description}
                        </p>
                      )}

                      {tache.progression > 0 && (
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-gray-600 mb-2">
                            <span className="font-medium">Progression</span>
                            <span className="font-semibold">{tache.progression}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${tache.progression}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {tache.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {tache.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex justify-between items-center text-xs text-gray-500">
                        {tache.dateEcheance && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span className="font-medium">{new Date(tache.dateEcheance).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vue Liste */}
      {modeVue === 'liste' && (
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Tâche</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Statut</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Priorité</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Progression</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Échéance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {colonnes.flatMap(col => filtrerTaches(col.taches)).map(tache => (
                  <tr key={tache.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{tache.titre}</div>
                        <div className="text-sm text-gray-600 mt-1">{tache.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                        {colonnes.find(col => col.id === tache.statutColonne)?.titre}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-md border ${getPrioriteColor(tache.priorite)}`}>
                        {tache.priorite}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${tache.progression}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-10">{tache.progression}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {tache.dateEcheance ? (
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(tache.dateEcheance).toLocaleDateString()}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de détails de la tâche */}
      <AnimatePresence>
        {tacheSelectionnee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Détails de la tâche</h2>
                <button
                  onClick={() => setTacheSelectionnee(null)}
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Titre et priorité */}
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">{tacheSelectionnee.titre}</h3>
                      {tacheSelectionnee.estRetournee && (
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-md border border-blue-200">
                            Tâche retournée
                          </span>
                        </div>
                      )}
                    </div>
                    <span className={`px-3 py-1 text-sm font-medium border ${getPrioriteColor(tacheSelectionnee.priorite)}`}>
                      {tacheSelectionnee.priorite}
                    </span>
                  </div>
                  {tacheSelectionnee.urgent && (
                    <div className="flex items-center space-x-2 mt-2 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Urgent</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                  <p className="text-gray-700">{tacheSelectionnee.description}</p>
                </div>

                {/* Consigne */}
                {tacheSelectionnee.consigne && (
                  <div className="bg-blue-50 border border-blue-200 p-4">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">Consigne</h4>
                        <p className="text-blue-800 text-sm">{tacheSelectionnee.consigne}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Note */}
                {tacheSelectionnee.note && (
                  <div className="bg-blue-50 border border-blue-200 p-4">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">Note</h4>
                        <p className="text-blue-800 text-sm">{tacheSelectionnee.note}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Feedback de retour pour les tâches retournées */}
                {tacheSelectionnee.estRetournee && tacheSelectionnee.feedbackRetour && (
                  <div className="bg-blue-50 border-2 border-blue-300 p-4">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-blue-900">Tâche retournée par l'encadrant</h4>
                          <span className="text-xs text-blue-700">
                            {new Date(tacheSelectionnee.feedbackRetour.dateRetour).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-blue-800 text-sm">{tacheSelectionnee.feedbackRetour.commentaire}</p>
                        <p className="text-xs text-blue-700 mt-2">
                          Les corrections ont été ajoutées dans la liste des sous-étapes ci-dessous.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sous-étapes */}
                {(() => {
                  // Combiner les sous-étapes existantes avec les corrections du feedback si la tâche est retournée
                  let toutesSousEtapes: SousEtape[] = [];

                  if (tacheSelectionnee.sousEtapes && tacheSelectionnee.sousEtapes.length > 0) {
                    toutesSousEtapes = [...tacheSelectionnee.sousEtapes];
                  }

                  // Ajouter les corrections comme nouvelles sous-étapes si la tâche est retournée
                  if (tacheSelectionnee.estRetournee && tacheSelectionnee.feedbackRetour?.corrections) {
                    const maxId = toutesSousEtapes.length > 0
                      ? Math.max(...toutesSousEtapes.map(e => e.id))
                      : 0;

                    const correctionsEtapes: SousEtape[] = tacheSelectionnee.feedbackRetour.corrections.map((correction, index) => ({
                      id: maxId + index + 1,
                      titre: correction,
                      terminee: false
                    }));

                    toutesSousEtapes = [...toutesSousEtapes, ...correctionsEtapes];
                  }

                  if (toutesSousEtapes.length === 0) return null;

                  // Séparer les sous-étapes originales des corrections
                  const sousEtapesOriginales = tacheSelectionnee.sousEtapes || [];

                  // Filtrer les corrections pour ne garder que celles qui ne sont pas encore dans les sous-étapes
                  const correctionsNonAjoutees = tacheSelectionnee.estRetournee && tacheSelectionnee.feedbackRetour?.corrections
                    ? tacheSelectionnee.feedbackRetour.corrections.filter(correction => {
                      // Vérifier si cette correction existe déjà dans les sous-étapes
                      return !sousEtapesOriginales.some(se => se.titre === correction);
                    })
                    : [];

                  // Créer les sous-étapes pour les corrections non ajoutées
                  const sousEtapesCorrections = correctionsNonAjoutees.length > 0
                    ? (() => {
                      const maxId = sousEtapesOriginales.length > 0
                        ? Math.max(...sousEtapesOriginales.map(e => e.id))
                        : 0;
                      return correctionsNonAjoutees.map((correction, index) => ({
                        id: maxId + index + 1,
                        titre: correction,
                        terminee: false
                      }));
                    })()
                    : [];

                  return (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">
                        {tacheSelectionnee.statutColonne === 'review' || tacheSelectionnee.statutColonne === 'done'
                          ? 'Sous-étapes réalisées'
                          : 'Sous-étapes à réaliser'}
                      </h4>

                      {/* Sous-étapes originales */}
                      {sousEtapesOriginales.length > 0 && (
                        <div className="space-y-2 mb-4">
                          {sousEtapesOriginales.map((sousEtape) => (
                            <div
                              key={sousEtape.id}
                              className={`flex items-center space-x-3 p-3 bg-gray-50 transition-colors ${tacheSelectionnee.statutColonne === 'inprogress' ? 'hover:bg-gray-100 cursor-pointer' : ''
                                }`}
                              onClick={() => {
                                if (tacheSelectionnee.statutColonne === 'inprogress') {
                                  toggleSousEtape(tacheSelectionnee.id, sousEtape.id);
                                }
                              }}
                            >
                              {sousEtape.terminee ? (
                                <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                              ) : (
                                <Circle className="h-5 w-5 text-gray-400 flex-shrink-0" />
                              )}
                              <span className={`flex-1 ${sousEtape.terminee ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                {sousEtape.titre}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Corrections du feedback (nouvelles sous-étapes) */}
                      {sousEtapesCorrections.length > 0 && (
                        <div className="space-y-2">
                          <div className="mb-2">
                            <h5 className="text-sm font-semibold text-gray-900 mb-1">Corrections à apporter :</h5>
                            <p className="text-xs text-gray-600">Nouvelles sous-étapes ajoutées suite au retour de l'encadrant</p>
                          </div>
                          {sousEtapesCorrections.map((sousEtape) => (
                            <div
                              key={sousEtape.id}
                              className={`flex items-center space-x-3 p-3 bg-gray-50 border border-gray-200 transition-colors ${tacheSelectionnee.statutColonne === 'inprogress' ? 'hover:bg-gray-100 cursor-pointer' : ''
                                }`}
                              onClick={() => {
                                if (tacheSelectionnee.statutColonne === 'inprogress') {
                                  // Ajouter la correction comme sous-étape terminée
                                  setColonnes(prev => {
                                    return prev.map(colonne => ({
                                      ...colonne,
                                      taches: colonne.taches.map(tache => {
                                        if (tache.id === tacheSelectionnee.id) {
                                          // Vérifier si la correction existe déjà (par titre pour éviter les doublons)
                                          const existeDeja = tache.sousEtapes?.some(se => se.titre === sousEtape.titre);

                                          if (!existeDeja) {
                                            const nouvellesSousEtapes = [
                                              ...(tache.sousEtapes || []),
                                              { id: sousEtape.id, titre: sousEtape.titre, terminee: true }
                                            ];
                                            const etapesTerminees = nouvellesSousEtapes.filter(e => e.terminee).length;
                                            const nouvelleProgression = Math.round((etapesTerminees / nouvellesSousEtapes.length) * 100);

                                            const tacheMiseAJour = {
                                              ...tache,
                                              sousEtapes: nouvellesSousEtapes,
                                              progression: nouvelleProgression
                                            };

                                            // Mettre à jour la tâche sélectionnée immédiatement
                                            setTimeout(() => {
                                              setTacheSelectionnee(tacheMiseAJour);
                                            }, 0);

                                            return tacheMiseAJour;
                                          }
                                        }
                                        return tache;
                                      })
                                    }));
                                  });
                                }
                              }}
                            >
                              <Circle className="h-5 w-5 text-gray-400 flex-shrink-0" />
                              <span className="flex-1 text-gray-900">
                                {sousEtape.titre}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {tacheSelectionnee.statutColonne === 'inprogress' && (
                        <p className="text-xs text-gray-500 mt-2">Cliquez sur une sous-étape pour la valider</p>
                      )}
                      {tacheSelectionnee.statutColonne === 'review' && (
                        <p className="text-xs text-gray-500 mt-2">Toutes les sous-étapes ont été validées avant l'envoi en révision.</p>
                      )}
                      {tacheSelectionnee.statutColonne === 'done' && (
                        <p className="text-xs text-gray-500 mt-2">Toutes les sous-étapes ont été réalisées et la tâche a été validée par l'encadrant.</p>
                      )}
                    </div>
                  );
                })()}

                {/* Informations de deadline */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Informations</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {tacheSelectionnee.dateEcheance && (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Date d'échéance</p>
                          <p className="font-medium text-gray-900">
                            {new Date(tacheSelectionnee.dateEcheance).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Date de création</p>
                        <p className="font-medium text-gray-900">
                          {new Date(tacheSelectionnee.dateCreation).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {tacheSelectionnee.tags.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {tacheSelectionnee.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Progression */}
                {(tacheSelectionnee.statutColonne === 'todo' || tacheSelectionnee.statutColonne === 'inprogress' || tacheSelectionnee.statutColonne === 'review' || tacheSelectionnee.statutColonne === 'done') && (
                  <div className="bg-gray-50 border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Progression</span>
                      <span className="text-sm font-bold text-gray-900">{tacheSelectionnee.progression}%</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2">
                      <div
                        className={`h-2 transition-all duration-300 ${tacheSelectionnee.statutColonne === 'todo'
                          ? 'bg-gray-300'
                          : tacheSelectionnee.statutColonne === 'review'
                            ? 'bg-blue-600'
                            : tacheSelectionnee.statutColonne === 'done'
                              ? 'bg-blue-600'
                              : 'bg-primary'
                          }`}
                        style={{ width: `${tacheSelectionnee.progression}%` }}
                      ></div>
                    </div>
                    {tacheSelectionnee.statutColonne === 'todo' ? (
                      <p className="text-xs text-gray-500 mt-2">Cette tâche n'a pas encore été commencée.</p>
                    ) : tacheSelectionnee.statutColonne === 'review' ? (
                      <p className="text-xs text-gray-500 mt-2">Tâche en cours de révision par l'encadrant.</p>
                    ) : tacheSelectionnee.statutColonne === 'done' ? (
                      <p className="text-xs text-gray-500 mt-2">Tâche terminée et validée par l'encadrant.</p>
                    ) : (
                      <p className="text-xs text-gray-500 mt-2">
                        {tacheSelectionnee.sousEtapes && tacheSelectionnee.sousEtapes.length > 0
                          ? `${tacheSelectionnee.sousEtapes.filter(e => e.terminee).length} sur ${tacheSelectionnee.sousEtapes.length} sous-étapes terminées`
                          : 'Tâche en cours de réalisation'}
                      </p>
                    )}
                  </div>
                )}

                {/* Livrable pour les tâches en révision */}
                {tacheSelectionnee.statutColonne === 'review' && tacheSelectionnee.livrable && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Document envoyé en révision</h4>
                    <div className="bg-gray-50 border border-gray-200 p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-red-600 flex items-center justify-center">
                          <FileText className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{tacheSelectionnee.livrable.nom}</h5>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-600">
                            <span>{tacheSelectionnee.livrable.taille}</span>
                            <span>•</span>
                            <span>Uploadé le {new Date(tacheSelectionnee.livrable.dateUpload).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            // Simuler le téléchargement
                            if (tacheSelectionnee.livrable?.fichier) {
                              const url = URL.createObjectURL(tacheSelectionnee.livrable.fichier);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = tacheSelectionnee.livrable.nom;
                              a.click();
                              URL.revokeObjectURL(url);
                            }
                          }}
                          className="px-4 py-2 bg-navy text-white hover:bg-navy-dark transition-colors flex items-center space-x-2 text-sm"
                          title="Télécharger le document"
                        >
                          <Download className="h-4 w-4" />
                          <span>Télécharger</span>
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Ce document est en cours de révision par votre encadrant. Vous ne pouvez pas le modifier tant que la révision n'est pas terminée.
                    </p>
                  </div>
                )}

                {/* Livrable validé pour les tâches terminées */}
                {tacheSelectionnee.statutColonne === 'done' && tacheSelectionnee.livrable && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Document validé</h4>
                    <div className="bg-gray-50 border border-gray-200 p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-600 flex items-center justify-center">
                          <FileText className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{tacheSelectionnee.livrable.nom}</h5>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-600">
                            <span>{tacheSelectionnee.livrable.taille}</span>
                            <span>•</span>
                            <span>Validé le {new Date(tacheSelectionnee.livrable.dateUpload).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            // Simuler le téléchargement
                            if (tacheSelectionnee.livrable?.fichier) {
                              const url = URL.createObjectURL(tacheSelectionnee.livrable.fichier);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = tacheSelectionnee.livrable.nom;
                              a.click();
                              URL.revokeObjectURL(url);
                            }
                          }}
                          className="px-4 py-2 bg-navy text-white hover:bg-navy-dark transition-colors flex items-center space-x-2 text-sm"
                          title="Télécharger le document"
                        >
                          <Download className="h-4 w-4" />
                          <span>Télécharger</span>
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Ce document a été validé par votre encadrant. La tâche est terminée.
                    </p>
                  </div>
                )}

                {/* Livrable pour les tâches en cours */}
                {tacheSelectionnee.statutColonne === 'inprogress' && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Livrable (Document PDF)</h4>

                    {/* Afficher le livrable existant ou le nouveau fichier sélectionné */}
                    {(tacheSelectionnee.livrable || fichierLivrable) && (
                      <div className="bg-gray-50 border border-gray-200 p-4 mb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-red-600 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900 text-sm">
                                {fichierLivrable ? fichierLivrable.name : tacheSelectionnee.livrable?.nom}
                              </h5>
                              <p className="text-xs text-gray-600">
                                {fichierLivrable
                                  ? `${(fichierLivrable.size / 1024 / 1024).toFixed(2)} MB`
                                  : tacheSelectionnee.livrable?.taille}
                                {tacheSelectionnee.livrable && !fichierLivrable && (
                                  <span className="ml-2">• Uploadé le {new Date(tacheSelectionnee.livrable.dateUpload).toLocaleDateString('fr-FR')}</span>
                                )}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={supprimerLivrable}
                            className="p-2 hover:bg-gray-200 transition-colors"
                            title="Supprimer le livrable"
                          >
                            <Trash2 className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Zone d'upload */}
                    <div className="border-2 border-dashed border-gray-300 p-6 text-center hover:border-gray-400 transition-colors">
                      <input
                        type="file"
                        id={`file-upload-${tacheSelectionnee.id}`}
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label
                        htmlFor={`file-upload-${tacheSelectionnee.id}`}
                        className="cursor-pointer flex flex-col items-center space-y-2"
                      >
                        <Upload className="h-8 w-8 text-gray-400" />
                        <div>
                          <span className="text-sm font-medium text-gray-700">
                            {fichierLivrable || tacheSelectionnee.livrable
                              ? 'Remplacer le document'
                              : 'Cliquez pour uploader un document PDF'}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {fichierLivrable || tacheSelectionnee.livrable
                              ? 'Le nouveau fichier remplacera l\'ancien'
                              : 'Format accepté: PDF uniquement'}
                          </p>
                        </div>
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Le document uploadé sera le livrable envoyé pour révision. Chaque nouvel upload remplacera le précédent.
                    </p>
                  </div>
                )}

                {/* Boutons d'action */}
                <div className="flex justify-end pt-4 border-t border-gray-200">
                  {tacheSelectionnee.statutColonne === 'todo' && (
                    <button
                      onClick={() => migrerVersEnCours(tacheSelectionnee.id)}
                      className="px-6 py-3 bg-primary text-white hover:bg-primary-dark transition-colors flex items-center space-x-2 font-medium"
                    >
                      <ArrowRight className="h-5 w-5" />
                      <span>Commencer la tâche</span>
                    </button>
                  )}
                  {tacheSelectionnee.statutColonne === 'inprogress' && (
                    <button
                      onClick={() => envoyerEnRevision(tacheSelectionnee.id)}
                      disabled={
                        (!fichierLivrable && !tacheSelectionnee.livrable) ||
                        (tacheSelectionnee.sousEtapes && tacheSelectionnee.sousEtapes.length > 0 &&
                          !tacheSelectionnee.sousEtapes.every(etape => etape.terminee))
                      }
                      className={`px-6 py-3 flex items-center space-x-2 font-medium transition-colors ${(fichierLivrable || tacheSelectionnee.livrable) &&
                        (!tacheSelectionnee.sousEtapes || tacheSelectionnee.sousEtapes.length === 0 ||
                          tacheSelectionnee.sousEtapes.every(etape => etape.terminee))
                        ? 'bg-primary text-white hover:bg-primary-dark'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                      <ArrowRight className="h-5 w-5" />
                      <span>Envoyer en révision</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal d'alerte */}
      <AnimatePresence>
        {showAlertModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white shadow-2xl max-w-md w-full"
            >
              <div className="p-6">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Info className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Information</h3>
                    <p className="text-gray-700 text-sm">{alertMessage}</p>
                  </div>
                  <button
                    onClick={() => setShowAlertModal(false)}
                    className="p-1 hover:bg-gray-100 transition-colors flex-shrink-0"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setShowAlertModal(false)}
                    className="px-6 py-2 bg-navy text-white hover:bg-navy-dark transition-colors font-medium"
                  >
                    Compris
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EspaceTravail;

