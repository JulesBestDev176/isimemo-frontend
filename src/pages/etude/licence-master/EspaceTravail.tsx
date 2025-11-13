import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, 
  FiEdit3, 
  FiTrash2, 
  FiUser, 
  FiCalendar, 
  FiClock, 
  FiTag, 
  FiMessageSquare, 
  FiPaperclip, 
  FiX, 
  FiCheck,
  FiArrowRight,
  FiArrowLeft,
  FiList,
  FiFilter,
  FiUserPlus,
  FiUsers,
  FiSend,
  FiDownload,
  FiUpload,
  FiMoreVertical
} from 'react-icons/fi';
import { 
  BsKanban, 
  BsCalendar3, 
  BsListTask 
} from 'react-icons/bs';
import { 
  AiOutlineFire, 
  AiOutlineFlag 
} from 'react-icons/ai';
import { useAuth } from '../../contexts/AuthContext';

interface Tache {
  id: number;
  titre: string;
  description: string;
  statutColonne: 'backlog' | 'todo' | 'inprogress' | 'review' | 'done';
  priorite: 'Basse' | 'Moyenne' | 'Haute' | 'Critique';
  assignee?: string;
  dateCreation: string;
  dateEcheance?: string;
  tags: string[];
  commentaires: Commentaire[];
  progression: number;
  fichiers: Fichier[];
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

interface MembreGroupe {
  id: number;
  nom: string;
  email: string;
  statut: 'actif' | 'inactif';
}

const EspaceTravail: React.FC = () => {
  const { user } = useAuth();
  if (!user) {
    return <div className="flex items-center justify-center min-h-screen text-gray-500">Chargement...</div>;
  }
  const [colonnes, setColonnes] = useState<Colonne[]>([]);
  const [tacheSelectionnee, setTacheSelectionnee] = useState<Tache | null>(null);
  const [showModalTache, setShowModalTache] = useState(false);
  const [showModalGroupe, setShowModalGroupe] = useState(false);
  const [modeVue, setModeVue] = useState<'kanban' | 'liste' | 'calendrier'>('kanban');
  const [filtres, setFiltres] = useState({
    priorite: '',
    assignee: '',
    tags: '',
  });
  const [draggedTask, setDraggedTask] = useState<number | null>(null);

  const [membreGroupe, setMembreGroupe] = useState<MembreGroupe | null>(
    user?.niveau === 'master' ? {
      id: 2,
      nom: 'Fatou Sow',
      email: 'fatou.sow@etudiant.sn',
      statut: 'actif'
    } : null
  );

  const [membresDisponibles] = useState<MembreGroupe[]>([
    { id: 3, nom: 'Omar Ba', email: 'omar.ba@etudiant.sn', statut: 'actif' },
    { id: 4, nom: 'Aminata Kane', email: 'aminata.kane@etudiant.sn', statut: 'actif' },
    { id: 5, nom: 'Ibrahima Sarr', email: 'ibrahima.sarr@etudiant.sn', statut: 'actif' },
  ]);

  useEffect(() => {
    const colonnesInitiales: Colonne[] = [
      {
        id: 'backlog',
        titre: 'Backlog',
        couleur: 'bg-slate-50 border-slate-200',
        taches: [
          {
            id: 1,
            titre: 'Recherche bibliographique',
            description: 'Effectuer une recherche approfondie sur les systèmes de recommandation basés sur l\'IA',
            statutColonne: 'backlog',
            priorite: 'Moyenne',
            assignee: user?.name || '',
            dateCreation: '2024-07-01',
            dateEcheance: '2024-07-15',
            tags: ['recherche', 'bibliographie'],
            commentaires: [],
            progression: 0,
            fichiers: []
          },
          {
            id: 6,
            titre: 'Définition des objectifs',
            description: 'Clarifier les objectifs spécifiques du mémoire',
            statutColonne: 'backlog',
            priorite: 'Haute',
            assignee: user?.name || '',
            dateCreation: '2024-07-01',
            dateEcheance: '2024-07-08',
            tags: ['planification'],
            commentaires: [],
            progression: 0,
            fichiers: []
          }
        ]
      },
      {
        id: 'todo',
        titre: 'À faire',
        couleur: 'bg-amber-50 border-amber-200',
        limite: 5,
        taches: [
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
            commentaires: [{
              id: 1,
              auteur: 'Prof. Ndiaye',
              contenu: 'N\'oubliez pas de bien définir la problématique et de justifier l\'importance du sujet',
              date: '2024-07-03 10:30'
            }],
            progression: 25,
            fichiers: []
          }
        ]
      },
      {
        id: 'inprogress',
        titre: 'En cours',
        couleur: 'bg-primary/10 border-primary/20',
        limite: 3,
        taches: [
          {
            id: 3,
            titre: 'Développement prototype',
            description: 'Implémenter la première version du système de recommandation en Python',
            statutColonne: 'inprogress',
            priorite: 'Critique',
            assignee: user?.niveau === 'master' ? membreGroupe?.nom || user?.name || '' : user?.name || '',
            dateCreation: '2024-06-28',
            dateEcheance: '2024-07-20',
            tags: ['développement', 'prototype', 'IA'],
            commentaires: [{
              id: 3,
              auteur: user?.name || '',
              contenu: 'Avancement bon, reste à implémenter l\'algorithme de filtrage collaboratif',
              date: '2024-07-05 14:20'
            }],
            progression: 60,
            fichiers: [{
              id: 1,
              nom: 'prototype_v1.py',
              taille: '2.3 MB',
              type: 'python',
              dateUpload: '2024-07-04'
            }]
          }
        ]
      },
      {
        id: 'review',
        titre: 'En révision',
        couleur: 'bg-purple-50 border-purple-200',
        taches: [
          {
            id: 4,
            titre: 'Chapitre État de l\'art',
            description: 'Révision du chapitre 2 selon les commentaires de l\'encadrant - focus sur les références récentes',
            statutColonne: 'review',
            priorite: 'Haute',
            assignee: user?.name || '',
            dateCreation: '2024-06-25',
            dateEcheance: '2024-07-08',
            tags: ['rédaction', 'révision'],
            commentaires: [{
              id: 2,
              auteur: 'Prof. Ndiaye',
              contenu: 'Ajouter plus de références récentes (2022-2024) et améliorer la structure du chapitre',
              date: '2024-07-02 14:15'
            }],
            progression: 90,
            fichiers: []
          }
        ]
      },
      {
        id: 'done',
        titre: 'Terminé',
        couleur: 'bg-emerald-50 border-emerald-200',
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
            commentaires: [{
              id: 4,
              auteur: 'Prof. Ndiaye',
              contenu: 'Plan validé, vous pouvez commencer la rédaction',
              date: '2024-06-30 16:45'
            }],
            progression: 100,
            fichiers: []
          }
        ]
      }
    ];

    setColonnes(colonnesInitiales);
  }, [user, membreGroupe]);

  const getPrioriteColor = (priorite: string) => {
    switch (priorite) {
      case 'Critique': return 'bg-red-100 text-red-700 border-red-200';
      case 'Haute': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Moyenne': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Basse': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPrioriteIcon = (priorite: string) => {
    switch (priorite) {
      case 'Critique': return <AiOutlineFire className="h-3 w-3" />;
      case 'Haute': return <AiOutlineFlag className="h-3 w-3" />;
      default: return null;
    }
  };

  const getInitials = (nom: string) => {
    return nom.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const ajouterTache = (colonneId: string) => {
    const nouvelleTache: Tache = {
      id: Date.now(),
      titre: 'Nouvelle tâche',
      description: '',
      statutColonne: colonneId as any,
      priorite: 'Moyenne',
      assignee: user?.name || '',
      dateCreation: new Date().toISOString().split('T')[0],
      tags: [],
      commentaires: [],
      progression: 0,
      fichiers: []
    };

    setColonnes(prev => prev.map(col => 
      col.id === colonneId 
        ? { ...col, taches: [...col.taches, nouvelleTache] }
        : col
    ));
  };

  const deplacerTache = (tacheId: number, nouvelleColonne: string) => {
    setColonnes(prev => {
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

  const supprimerTache = (tacheId: number) => {
    setColonnes(prev => prev.map(col => ({
      ...col,
      taches: col.taches.filter(t => t.id !== tacheId)
    })));
  };

  const ajouterCommentaire = (tacheId: number, contenu: string) => {
    const nouveauCommentaire: Commentaire = {
      id: Date.now(),
      auteur: user?.name || '',
      contenu,
      date: new Date().toLocaleString()
    };

    setColonnes(prev => prev.map(col => ({
      ...col,
      taches: col.taches.map(t => 
        t.id === tacheId 
          ? { ...t, commentaires: [...t.commentaires, nouveauCommentaire] }
          : t
      )
    })));

    if (tacheSelectionnee?.id === tacheId) {
      setTacheSelectionnee(prev => prev ? {
        ...prev,
        commentaires: [...prev.commentaires, nouveauCommentaire]
      } : null);
    }
  };

  const inviterMembre = (membreId: number) => {
    const membre = membresDisponibles.find(m => m.id === membreId);
    if (membre && user?.niveau === 'master') {
      setMembreGroupe(membre);
      setShowModalGroupe(false);
    }
  };

  const retirerMembre = () => {
    setMembreGroupe(null);
  };

  const filtrerTaches = (taches: Tache[]) => {
    return taches.filter(tache => {
      if (filtres.priorite && tache.priorite !== filtres.priorite) return false;
      if (filtres.assignee && !tache.assignee?.includes(filtres.assignee)) return false;
      if (filtres.tags && !tache.tags.some(tag => tag.includes(filtres.tags))) return false;
      return true;
    });
  };

  // Fonctions pour le drag and drop
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
      deplacerTache(draggedTask, colonneId);
    }
    setDraggedTask(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* En-tête */}
      <div className="bg-white shadow-sm border-b border-slate-200 p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Espace de Travail</h1>
            <p className="text-slate-600 mt-1">Gestion des tâches pour votre mémoire</p>
          </div>
          {/* Gestion du groupe (Master uniquement) */}
          {user?.niveau === 'master' ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                  {getInitials(user.name)}
                </div>
                <div>
                  <div className="font-medium text-slate-900">{user.name}</div>
                  <div className="text-sm text-slate-500">Master</div>
                </div>
              </div>
              {membreGroupe && (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-semibold">
                    {getInitials(membreGroupe.nom)}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{membreGroupe.nom}</div>
                    <div className="text-sm text-slate-500">Binôme</div>
                  </div>
                  <button 
                    onClick={retirerMembre}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                </div>
              )}
              {/* Max 2 membres */}
              {!membreGroupe && (
                <button 
                  onClick={() => setShowModalGroupe(true)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors flex items-center space-x-2"
                >
                  <FiUserPlus className="h-4 w-4" />
                  <span>Inviter binôme</span>
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                {getInitials(user.name)}
              </div>
              <div>
                <div className="font-medium text-slate-900">{user.name}</div>
                <div className="text-sm text-slate-500">Licence</div>
              </div>
            </div>
          )}
        </div>

        {/* Barre d'outils */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-6">
            {/* Modes de vue */}
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button 
                onClick={() => setModeVue('kanban')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center space-x-2 ${
                  modeVue === 'kanban' 
                    ? 'bg-white shadow-sm text-slate-900' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BsKanban className="h-4 w-4" />
                <span>Kanban</span>
              </button>
              <button 
                onClick={() => setModeVue('liste')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center space-x-2 ${
                  modeVue === 'liste' 
                    ? 'bg-white shadow-sm text-slate-900' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BsListTask className="h-4 w-4" />
                <span>Liste</span>
              </button>
              <button 
                onClick={() => setModeVue('calendrier')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center space-x-2 ${
                  modeVue === 'calendrier' 
                    ? 'bg-white shadow-sm text-slate-900' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BsCalendar3 className="h-4 w-4" />
                <span>Calendrier</span>
              </button>
            </div>

            {/* Filtres */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <select 
                  value={filtres.priorite}
                  onChange={(e) => setFiltres(prev => ({ ...prev, priorite: e.target.value }))}
                  className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Toutes priorités</option>
                  <option value="Critique">Critique</option>
                  <option value="Haute">Haute</option>
                  <option value="Moyenne">Moyenne</option>
                  <option value="Basse">Basse</option>
                </select>
              </div>

              {user?.niveau === 'master' && membreGroupe && (
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <select 
                    value={filtres.assignee}
                    onChange={(e) => setFiltres(prev => ({ ...prev, assignee: e.target.value }))}
                    className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Tous les assignés</option>
                    <option value={user.name}>{user.name}</option>
                    <option value={membreGroupe.nom}>{membreGroupe.nom}</option>
                  </select>
                </div>
              )}

              <div className="relative">
                <FiTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input 
                  type="text"
                  placeholder="Filtrer par tags..."
                  value={filtres.tags}
                  onChange={(e) => setFiltres(prev => ({ ...prev, tags: e.target.value }))}
                  className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm w-48 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <button 
            onClick={() => setShowModalTache(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-medium"
          >
            <FiPlus className="h-4 w-4" />
            <span>Nouvelle tâche</span>
          </button>
        </div>
      </div>

      {/* Vue Kanban */}
      {modeVue === 'kanban' && (
        <div className="flex-1 flex gap-4 overflow-x-auto px-4 pb-8 mt-8" style={{ minHeight: 'calc(100dvh - 120px)' }}>
          {colonnes.map(colonne => (
            <div
              key={colonne.id}
              className={`flex-1 min-w-[280px] max-w-xs bg-white border rounded-lg shadow-sm flex flex-col h-[80vh] md:h-[calc(100dvh-180px)]`}
            >
              <div className={`p-4 rounded-t-xl border-b ${colonne.couleur}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-slate-900">{colonne.titre}</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {filtrerTaches(colonne.taches).length} tâche{filtrerTaches(colonne.taches).length !== 1 ? 's' : ''}
                      {colonne.limite && ` / ${colonne.limite} max`}
                    </p>
                  </div>
                  <button 
                    onClick={() => ajouterTache(colonne.id)}
                    className="w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <FiPlus className="h-4 w-4" />
                  </button>
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
                      onDragStart={(e) => handleDragStart(e as any, tache.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => setTacheSelectionnee(tache)}
                      className={`p-4 bg-white border border-slate-200 rounded-lg cursor-pointer hover:shadow-md hover:border-slate-300 transition-all group ${
                        draggedTask === tache.id ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium text-slate-900 text-sm leading-relaxed flex-1 pr-2">
                          {tache.titre}
                        </h4>
                        <div className="flex items-center space-x-1">
                          {getPrioriteIcon(tache.priorite)}
                          <span className={`px-2 py-1 text-xs font-medium rounded-md border ${getPrioriteColor(tache.priorite)}`}>
                            {tache.priorite}
                          </span>
                        </div>
                      </div>

                      {tache.description && (
                        <p className="text-slate-600 text-xs mb-3 leading-relaxed line-clamp-2">
                          {tache.description}
                        </p>
                      )}

                      {/* Progression */}
                      {tache.progression > 0 && (
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-slate-600 mb-2">
                            <span className="font-medium">Progression</span>
                            <span className="font-semibold">{tache.progression}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${tache.progression}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* Tags */}
                      {tache.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {tache.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex justify-between items-center text-xs text-slate-500">
                        <div className="flex items-center space-x-3">
                          {tache.assignee && (
                            <div className="flex items-center space-x-1">
                              <div className="w-5 h-5 bg-slate-400 text-white rounded-full flex items-center justify-center text-xs font-medium">
                                {getInitials(tache.assignee)}
                              </div>
                            </div>
                          )}
                          {tache.commentaires.length > 0 && (
                            <div className="flex items-center space-x-1">
                              <FiMessageSquare className="h-3 w-3" />
                              <span className="font-medium">{tache.commentaires.length}</span>
                            </div>
                          )}
                          {tache.fichiers.length > 0 && (
                            <div className="flex items-center space-x-1">
                              <FiPaperclip className="h-3 w-3" />
                              <span className="font-medium">{tache.fichiers.length}</span>
                            </div>
                          )}
                        </div>
                        {tache.dateEcheance && (
                          <div className="flex items-center space-x-1">
                            <FiCalendar className="h-3 w-3" />
                            <span className="font-medium">{new Date(tache.dateEcheance).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      {/* Actions rapides - visible au hover */}
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex space-x-2">
                          {colonne.id !== 'backlog' && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                const colonnesOrder = ['backlog', 'todo', 'inprogress', 'review', 'done'];
                                const currentIndex = colonnesOrder.indexOf(colonne.id);
                                if (currentIndex > 0) {
                                  deplacerTache(tache.id, colonnesOrder[currentIndex - 1]);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                              title="Précédent"
                            >
                              <FiArrowLeft className="h-3 w-3" />
                            </button>
                          )}
                          {colonne.id !== 'done' && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                const colonnesOrder = ['backlog', 'todo', 'inprogress', 'review', 'done'];
                                const currentIndex = colonnesOrder.indexOf(colonne.id);
                                if (currentIndex < colonnesOrder.length - 1) {
                                  deplacerTache(tache.id, colonnesOrder[currentIndex + 1]);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"
                              title="Suivant"
                            >
                              <FiArrowRight className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Supprimer cette tâche ?')) {
                              supprimerTache(tache.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                          title="Supprimer"
                        >
                          <FiTrash2 className="h-3 w-3" />
                        </button>
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
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Tâche</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Priorité</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Assigné</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Progression</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Échéance</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {colonnes.flatMap(col => filtrerTaches(col.taches)).map(tache => (
                    <tr key={tache.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-slate-900">{tache.titre}</div>
                          <div className="text-sm text-slate-600 mt-1">{tache.description}</div>
                          {tache.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {tache.tags.map(tag => (
                                <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 text-xs font-medium bg-slate-100 text-slate-800 rounded-full">
                          {colonnes.find(col => col.id === tache.statutColonne)?.titre}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1">
                          {getPrioriteIcon(tache.priorite)}
                          <span className={`px-2 py-1 text-xs font-medium rounded-md border ${getPrioriteColor(tache.priorite)}`}>
                            {tache.priorite}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {tache.assignee && (
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-slate-400 text-white rounded-full flex items-center justify-center text-xs font-medium">
                              {getInitials(tache.assignee)}
                            </div>
                            <span className="text-sm font-medium text-slate-900">{tache.assignee}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-20 bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${tache.progression}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-slate-900 w-10">{tache.progression}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {tache.dateEcheance ? (
                          <div className="flex items-center space-x-1">
                            <FiCalendar className="h-4 w-4" />
                            <span>{new Date(tache.dateEcheance).toLocaleDateString()}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => setTacheSelectionnee(tache)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Voir détails"
                          >
                            <FiEdit3 className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => {
                              if (confirm('Supprimer cette tâche ?')) {
                                supprimerTache(tache.id);
                              }
                            }}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Vue Calendrier */}
      {modeVue === 'calendrier' && (
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
              <FiCalendar className="h-5 w-5 mr-2" />
              Planning des tâches
            </h3>
            <div className="space-y-4">
              {colonnes.flatMap(col => filtrerTaches(col.taches))
                .filter(tache => tache.dateEcheance)
                .sort((a, b) => new Date(a.dateEcheance!).getTime() - new Date(b.dateEcheance!).getTime())
                .map(tache => (
                  <div key={tache.id} className="p-4 bg-white border border-slate-200 rounded-lg cursor-pointer hover:shadow-md hover:border-slate-300 transition-all"
                    onClick={() => setTacheSelectionnee(tache)}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900 mb-2">{tache.titre}</h4>
                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">{tache.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-slate-500">
                          <div className="flex items-center space-x-1">
                            <FiCalendar className="h-4 w-4" />
                            <span className="font-medium">{new Date(tache.dateEcheance!).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {getPrioriteIcon(tache.priorite)}
                            <span className={`px-2 py-1 rounded-md border text-xs font-medium ${getPrioriteColor(tache.priorite)}`}>
                              {tache.priorite}
                            </span>
                          </div>
                          {tache.assignee && (
                            <div className="flex items-center space-x-1">
                              <FiUser className="h-4 w-4" />
                              <span className="font-medium">{tache.assignee}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-600 mb-2 font-medium">{tache.progression}%</div>
                        <div className="w-24 bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${tache.progression}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal détail tâche */}
      {tacheSelectionnee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <input 
                    type="text"
                    value={tacheSelectionnee.titre}
                    onChange={(e) => {
                      const nouvelleTache = { ...tacheSelectionnee, titre: e.target.value };
                      setTacheSelectionnee(nouvelleTache);
                      setColonnes(prev => prev.map(col => ({
                        ...col,
                        taches: col.taches.map(t => t.id === nouvelleTache.id ? nouvelleTache : t)
                      })));
                    }}
                    className="text-2xl font-bold text-slate-900 w-full border-none outline-none bg-transparent focus:bg-slate-50 rounded-lg px-2 py-1 -ml-2"
                  />
                  <div className="flex items-center space-x-3 mt-2">
                    <div className="flex items-center space-x-1">
                      {getPrioriteIcon(tacheSelectionnee.priorite)}
                      <span className={`px-2 py-1 text-xs font-medium rounded-md border ${getPrioriteColor(tacheSelectionnee.priorite)}`}>
                        {tacheSelectionnee.priorite}
                      </span>
                    </div>
                    <span className="text-sm text-slate-600">
                      dans <span className="font-medium">{colonnes.find(col => col.id === tacheSelectionnee.statutColonne)?.titre}</span>
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setTacheSelectionnee(null)}
                  className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-lg transition-colors"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Colonne principale */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Description */}
                  <div>
                    <label className="flex items-center text-sm font-semibold text-slate-900 mb-3">
                      <FiEdit3 className="h-4 w-4 mr-2" />
                      Description
                    </label>
                    <textarea 
                      value={tacheSelectionnee.description}
                      onChange={(e) => {
                        const nouvelleTache = { ...tacheSelectionnee, description: e.target.value };
                        setTacheSelectionnee(nouvelleTache);
                        setColonnes(prev => prev.map(col => ({
                          ...col,
                          taches: col.taches.map(t => t.id === nouvelleTache.id ? nouvelleTache : t)
                        })));
                      }}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={4}
                      placeholder="Ajouter une description détaillée..."
                    />
                  </div>

                  {/* Progression */}
                  <div>
                    <label className="flex items-center text-sm font-semibold text-slate-900 mb-3">
                      <FiCheck className="h-4 w-4 mr-2" />
                      Progression
                    </label>
                    <div className="flex items-center space-x-4">
                      <input 
                        type="range"
                        min="0"
                        max="100"
                        value={tacheSelectionnee.progression}
                        onChange={(e) => {
                          const nouvelleTache = { ...tacheSelectionnee, progression: parseInt(e.target.value) };
                          setTacheSelectionnee(nouvelleTache);
                          setColonnes(prev => prev.map(col => ({
                            ...col,
                            taches: col.taches.map(t => t.id === nouvelleTache.id ? nouvelleTache : t)
                          })));
                        }}
                        className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-sm font-semibold text-slate-900 w-12">{tacheSelectionnee.progression}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3 mt-3">
                      <div 
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${tacheSelectionnee.progression}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="flex items-center text-sm font-semibold text-slate-900 mb-3">
                      <FiTag className="h-4 w-4 mr-2" />
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {tacheSelectionnee.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-lg font-medium flex items-center">
                          {tag}
                          <button 
                            onClick={() => {
                              const nouveauxTags = tacheSelectionnee.tags.filter(t => t !== tag);
                              const nouvelleTache = { ...tacheSelectionnee, tags: nouveauxTags };
                              setTacheSelectionnee(nouvelleTache);
                              setColonnes(prev => prev.map(col => ({
                                ...col,
                                taches: col.taches.map(t => t.id === nouvelleTache.id ? nouvelleTache : t)
                              })));
                            }}
                            className="ml-2 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            <FiX className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                      <button 
                        onClick={() => {
                          const nouveauTag = prompt('Ajouter un tag:');
                          if (nouveauTag?.trim()) {
                            const nouvelleTache = { ...tacheSelectionnee, tags: [...tacheSelectionnee.tags, nouveauTag.trim()] };
                            setTacheSelectionnee(nouvelleTache);
                            setColonnes(prev => prev.map(col => ({
                              ...col,
                              taches: col.taches.map(t => t.id === nouvelleTache.id ? nouvelleTache : t)
                            })));
                          }
                        }}
                        className="px-3 py-1 border border-slate-300 text-slate-600 text-sm rounded-lg hover:bg-slate-50 transition-colors flex items-center font-medium"
                      >
                        <FiPlus className="h-3 w-3 mr-1" />
                        Ajouter
                      </button>
                    </div>
                  </div>

                  {/* Commentaires */}
                  <div>
                    <label className="flex items-center text-sm font-semibold text-slate-900 mb-3">
                      <FiMessageSquare className="h-4 w-4 mr-2" />
                      Commentaires ({tacheSelectionnee.commentaires.length})
                    </label>
                    <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                      {tacheSelectionnee.commentaires.map(commentaire => (
                        <div key={commentaire.id} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-slate-400 text-white rounded-full flex items-center justify-center text-xs font-medium">
                                {getInitials(commentaire.auteur)}
                              </div>
                              <span className="font-medium text-sm text-slate-900">{commentaire.auteur}</span>
                            </div>
                            <div className="flex items-center text-xs text-slate-500">
                              <FiClock className="h-3 w-3 mr-1" />
                              {commentaire.date}
                            </div>
                          </div>
                          <p className="text-slate-700 text-sm leading-relaxed">{commentaire.contenu}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex space-x-3">
                      <input 
                        type="text"
                        placeholder="Ajouter un commentaire..."
                        className="flex-1 border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                            ajouterCommentaire(tacheSelectionnee.id, e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <button 
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          if (input?.value.trim()) {
                            ajouterCommentaire(tacheSelectionnee.id, input.value);
                            input.value = '';
                          }
                        }}
                        className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <FiSend className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Fichiers */}
                  <div>
                    <label className="flex items-center text-sm font-semibold text-slate-900 mb-3">
                      <FiPaperclip className="h-4 w-4 mr-2" />
                      Fichiers ({tacheSelectionnee.fichiers.length})
                    </label>
                    <div className="space-y-3 mb-4">
                      {tacheSelectionnee.fichiers.map(fichier => (
                        <div key={fichier.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FiPaperclip className="h-5 w-5 text-slate-400" />
                            <div>
                              <div className="font-medium text-sm text-slate-900">{fichier.nom}</div>
                              <div className="text-xs text-slate-500 flex items-center space-x-2">
                                <span>{fichier.taille}</span>
                                <span>•</span>
                                <FiCalendar className="h-3 w-3" />
                                <span>{fichier.dateUpload}</span>
                              </div>
                            </div>
                          </div>
                          <button className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-colors">
                            <FiDownload className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button className="w-full px-4 py-3 border-2 border-dashed border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-colors flex items-center justify-center font-medium">
                      <FiUpload className="h-4 w-4 mr-2" />
                      Ajouter un fichier
                    </button>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Statut */}
                  <div>
                    <label className="flex items-center text-sm font-semibold text-slate-900 mb-3">
                      <FiList className="h-4 w-4 mr-2" />
                      Statut
                    </label>
                    <select 
                      value={tacheSelectionnee.statutColonne}
                      onChange={(e) => {
                        deplacerTache(tacheSelectionnee.id, e.target.value);
                        setTacheSelectionnee(prev => prev ? { ...prev, statutColonne: e.target.value as any } : null);
                      }}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {colonnes.map(col => (
                        <option key={col.id} value={col.id}>{col.titre}</option>
                      ))}
                    </select>
                  </div>

                  {/* Priorité */}
                  <div>
                    <label className="flex items-center text-sm font-semibold text-slate-900 mb-3">
                      <AiOutlineFlag className="h-4 w-4 mr-2" />
                      Priorité
                    </label>
                    <select 
                      value={tacheSelectionnee.priorite}
                      onChange={(e) => {
                        const nouvelleTache = { ...tacheSelectionnee, priorite: e.target.value as any };
                        setTacheSelectionnee(nouvelleTache);
                        setColonnes(prev => prev.map(col => ({
                          ...col,
                          taches: col.taches.map(t => t.id === nouvelleTache.id ? nouvelleTache : t)
                        })));
                      }}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Basse">Basse</option>
                      <option value="Moyenne">Moyenne</option>
                      <option value="Haute">Haute</option>
                      <option value="Critique">Critique</option>
                    </select>
                  </div>

                  {/* Assigné à */}
                  <div>
                    <label className="flex items-center text-sm font-semibold text-slate-900 mb-3">
                      <FiUser className="h-4 w-4 mr-2" />
                      Assigné à
                    </label>
                    <select 
                      value={tacheSelectionnee.assignee || ''}
                      onChange={(e) => {
                        const nouvelleTache = { ...tacheSelectionnee, assignee: e.target.value };
                        setTacheSelectionnee(nouvelleTache);
                        setColonnes(prev => prev.map(col => ({
                          ...col,
                          taches: col.taches.map(t => t.id === nouvelleTache.id ? nouvelleTache : t)
                        })));
                      }}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Non assigné</option>
                      <option value={user?.name || ''}>{user?.name}</option>
                      {user?.niveau === 'master' && membreGroupe && (
                        <option value={membreGroupe.nom}>{membreGroupe.nom}</option>
                      )}
                    </select>
                  </div>

                  {/* Date d'échéance */}
                  <div>
                    <label className="flex items-center text-sm font-semibold text-slate-900 mb-3">
                      <FiCalendar className="h-4 w-4 mr-2" />
                      Date d'échéance
                    </label>
                    <input 
                      type="date"
                      value={tacheSelectionnee.dateEcheance || ''}
                      onChange={(e) => {
                        const nouvelleTache = { ...tacheSelectionnee, dateEcheance: e.target.value };
                        setTacheSelectionnee(nouvelleTache);
                        setColonnes(prev => prev.map(col => ({
                          ...col,
                          taches: col.taches.map(t => t.id === nouvelleTache.id ? nouvelleTache : t)
                        })));
                      }}
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Actions */}
                  <div className="pt-6 border-t border-slate-200">
                    <button 
                      onClick={() => {
                        if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
                          supprimerTache(tacheSelectionnee.id);
                          setTacheSelectionnee(null);
                        }
                      }}
                      className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center font-medium"
                    >
                      <FiTrash2 className="h-4 w-4 mr-2" />
                      Supprimer la tâche
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal nouvelle tâche */}
      {showModalTache && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center">
                  <FiPlus className="h-5 w-5 mr-2" />
                  Nouvelle tâche
                </h3>
                <button 
                  onClick={() => setShowModalTache(false)}
                  className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-lg transition-colors"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              
              <form className="space-y-6" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const nouvelleTache: Tache = {
                  id: Date.now(),
                  titre: formData.get('titre') as string,
                  description: formData.get('description') as string,
                  statutColonne: formData.get('statut') as any,
                  priorite: formData.get('priorite') as any,
                  assignee: formData.get('assignee') as string,
                  dateCreation: new Date().toISOString().split('T')[0],
                  dateEcheance: formData.get('dateEcheance') as string || undefined,
                  tags: [],
                  commentaires: [],
                  progression: 0,
                  fichiers: []
                };

                setColonnes(prev => prev.map(col => 
                  col.id === nouvelleTache.statutColonne 
                    ? { ...col, taches: [...col.taches, nouvelleTache] }
                    : col
                ));
                setShowModalTache(false);
              }}>
                <div>
                  <label className="flex items-center text-sm font-semibold text-slate-900 mb-2">
                    <FiEdit3 className="h-4 w-4 mr-2" />
                    Titre
                  </label>
                  <input 
                    name="titre"
                    type="text" 
                    required
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Titre de la tâche"
                  />
                </div>
                
                <div>
                  <label className="flex items-center text-sm font-semibold text-slate-900 mb-2">
                    <FiMessageSquare className="h-4 w-4 mr-2" />
                    Description
                  </label>
                  <textarea 
                    name="description"
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                    placeholder="Description de la tâche"
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center text-sm font-semibold text-slate-900 mb-2">
                      <FiList className="h-4 w-4 mr-2" />
                      Statut
                    </label>
                    <select 
                      name="statut"
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {colonnes.map(col => (
                        <option key={col.id} value={col.id}>{col.titre}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center text-sm font-semibold text-slate-900 mb-2">
                      <AiOutlineFlag className="h-4 w-4 mr-2" />
                      Priorité
                    </label>
                    <select 
                      name="priorite"
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Basse">Basse</option>
                      <option value="Moyenne">Moyenne</option>
                      <option value="Haute">Haute</option>
                      <option value="Critique">Critique</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center text-sm font-semibold text-slate-900 mb-2">
                      <FiUser className="h-4 w-4 mr-2" />
                      Assigné à
                    </label>
                    <select 
                      name="assignee"
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={user?.name || ''}>{user?.name}</option>
                      {user?.niveau === 'master' && membreGroupe && (
                        <option value={membreGroupe.nom}>{membreGroupe.nom}</option>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center text-sm font-semibold text-slate-900 mb-2">
                      <FiCalendar className="h-4 w-4 mr-2" />
                      Date d'échéance
                    </label>
                    <input 
                      name="dateEcheance"
                      type="date"
                      className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                  <button 
                    type="button"
                    onClick={() => setShowModalTache(false)}
                    className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center font-medium"
                  >
                    <FiX className="h-4 w-4 mr-2" />
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center font-medium"
                  >
                    <FiCheck className="h-4 w-4 mr-2" />
                    Créer la tâche
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal gestion du groupe (Master uniquement) */}
      {showModalGroupe && user?.niveau === 'master' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 flex items-center">
                  <FiUsers className="h-5 w-5 mr-2" />
                  Gestion du binôme
                </h3>
                <button 
                  onClick={() => setShowModalGroupe(false)}
                  className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-lg transition-colors"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-slate-600">
                  Choisissez un étudiant pour former un binôme. Vous partagerez le même espace de travail.
                </p>
                
                <div className="space-y-3">
                  {membresDisponibles.map(membre => (
                    <div key={membre.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-500 text-white rounded-full flex items-center justify-center font-semibold">
                          {getInitials(membre.nom)}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{membre.nom}</div>
                          <div className="text-sm text-slate-600 flex items-center">
                            <FiUser className="h-3 w-3 mr-1" />
                            {membre.email}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => inviterMembre(membre.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center"
                      >
                        <FiUserPlus className="h-4 w-4 mr-1" />
                        Inviter
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t border-slate-200 text-center">
                  <button 
                    onClick={() => setShowModalGroupe(false)}
                    className="px-6 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center mx-auto font-medium"
                  >
                    <FiX className="h-4 w-4 mr-2" />
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Statistiques en bas */}
      <div className="bg-white border-t border-slate-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-slate-700 font-medium">
                Critique: <span className="font-bold">{colonnes.flatMap(col => col.taches).filter(t => t.priorite === 'Critique').length}</span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-slate-700 font-medium">
                Haute: <span className="font-bold">{colonnes.flatMap(col => col.taches).filter(t => t.priorite === 'Haute').length}</span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-slate-700 font-medium">
                Terminées: <span className="font-bold">{colonnes.find(col => col.id === 'done')?.taches.length || 0}</span>
              </span>
            </div>
          </div>
          
          <div className="text-sm text-slate-700 font-medium">
            Total: <span className="font-bold">{colonnes.flatMap(col => col.taches).length}</span> tâches
          </div>
        </div>
        
        {/* Barre de progression globale */}
        <div>
          <div className="flex justify-between text-sm text-slate-700 mb-2">
            <span className="font-medium">Progression globale du projet</span>
            <span className="font-bold">
              {Math.round(
                (colonnes.flatMap(col => col.taches).reduce((acc, t) => acc + t.progression, 0) / 
                 (colonnes.flatMap(col => col.taches).length * 100)) * 100
              )}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-600 to-blue-500 h-3 rounded-full transition-all duration-500 shadow-sm"
              style={{ 
                width: `${Math.round(
                  (colonnes.flatMap(col => col.taches).reduce((acc, t) => acc + t.progression, 0) / 
                   (colonnes.flatMap(col => col.taches).length * 100)) * 100
                )}%` 
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EspaceTravail;