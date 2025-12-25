// ============================================================================
// DASHBOARD SERVICES
// ============================================================================

import { mockDossiers } from '../dossier/DossierMemoire';
import { mockDocuments } from '../dossier/Document';
import { mockEncadrant } from '../acteurs/Professeur';
import { mockEvenements } from '../calendrier/EvenementCalendrier';
import { StatutDocument, TypeDocument } from '../dossier/Document';
import { TypeEvenement } from '../calendrier/EvenementCalendrier';
import { mockTickets } from '../dossier/Ticket';
import { dossiersData } from '../../data/dossiers.data';

// Calculs dérivés pour le dashboard
export const getDashboardStats = (userId: string | null) => {
  if (!userId) {
    return {
      dossiersCount: 0,
      documentsCount: 0,
      documentsValides: 0,
      progression: 0,
      echeancesCount: 0,
      ticketsCount: 0,
      chapitresCompletes: 0,
      chapitresTotal: 5
    };
  }

  // Filtrer les dossiers de l'utilisateur dans dossiersData
  const userDossiers = dossiersData.filter(d => 
    d.candidatIds.includes(userId)
  );

  const dossiersCount = userDossiers.length;
  
  // Filtrer les documents liés (en utilisant les IDs de dossiersData)
  const userDossierIds = userDossiers.map(d => d.id);
  // Comme les documents sont encore dans mockDocuments avec idDossierMemoire, 
  // on fait le lien si possible, sinon on retourne 0.
  const userDocuments = mockDocuments.filter(doc => 
    doc.dossierMemoire && userDossierIds.includes(doc.dossierMemoire.idDossierMemoire)
  );

  // Filtrer les tickets liés
  const ticketsCount = mockTickets.filter(t => 
    t.dossierMemoire && userDossierIds.includes(t.dossierMemoire.idDossierMemoire)
  ).length;
  
  const documentsCount = userDocuments.length;
  const documentsValides = userDocuments.filter(doc => doc.statut === StatutDocument.VALIDE).length;
  
  // Les documents administratifs devraient aussi être filtrés, mais ils ne sont pas liés dans le mock.
  // Pour l'instant, on retourne 0 pour les nouveaux utilisateurs sans documents spécifiques.
  const documentsAdminCount = 0; 
  
  // Calcul de la progression (basé sur le premier dossier actif)
  const activeDossier = userDossiers.find(d => d.statut === 'EN_COURS');
  const chapitresTotal = 5;
  const chapitresCompletes = userDocuments.filter(
    doc => doc.typeDocument === TypeDocument.CHAPITRE && doc.statut === StatutDocument.VALIDE
  ).length;
  const progression = activeDossier ? activeDossier.progression || 0 : 0;
  
  // Calcul des échéances à venir (celles liées aux dossiers de l'utilisateur)
  const aujourdhui = new Date();
  const dans30Jours = new Date();
  dans30Jours.setDate(aujourdhui.getDate() + 30);
  
  // Note: EvenementCalendrier n'est pas lié aux dossiers dans le mock actuel. 
  // On retourne 0 pour rester cohérent avec la demande.
  const echeancesCount = 0;

  // Calcul des tickets (déjà calculé plus haut)
  
  return {
    dossiersCount,
    documentsCount: documentsAdminCount + documentsCount,
    documentsValides,
    progression,
    echeancesCount,
    ticketsCount,
    chapitresCompletes,
    chapitresTotal
  };
};

// Données pour un dossier (le plus récent par défaut)
export const getDossierStatus = (dossierId?: number) => {
  // Si un ID est fourni, chercher ce dossier, sinon prendre le plus récent
  const dossier = dossierId 
    ? mockDossiers.find(d => d.idDossierMemoire === dossierId)
    : mockDossiers.sort((a, b) => b.dateModification.getTime() - a.dateModification.getTime())[0];
  
  if (!dossier) {
    return null;
  }
  
  const stats = getDashboardStats(null);
  
  // Prochaine échéance (si applicable pour ce dossier)
  const prochaineEcheance = mockEvenements
    .filter(event => event.type === TypeEvenement.ECHANCE && event.dateDebut >= new Date())
    .sort((a, b) => a.dateDebut.getTime() - b.dateDebut.getTime())[0];
  
  // Calcul du nombre de jours restants
  const joursRestants = prochaineEcheance 
    ? Math.ceil((prochaineEcheance.dateDebut.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;
  
  return {
    dossier,
    encadrant: mockEncadrant,
    progression: stats.progression,
    chapitresCompletes: stats.chapitresCompletes,
    chapitresTotal: stats.chapitresTotal,
    documentsCount: stats.documentsCount,
    prochaineEcheance,
    joursRestants
  };
};
