// ============================================================================
// DASHBOARD SERVICES
// ============================================================================

import { mockDossiers } from '../dossier/DossierMemoire';
import { mockDocuments } from '../dossier/Document';
import { mockEncadrant } from '../acteurs/Professeur';
import { mockEvenements } from '../calendrier/EvenementCalendrier';
import { StatutDocument, TypeDocument } from '../dossier/Document';
import { StatutDossierMemoire } from '../dossier/DossierMemoire';
import { TypeEvenement } from '../calendrier/EvenementCalendrier';

// Calculs dérivés pour le dashboard
export const getDashboardStats = () => {
  const dossiersCount = mockDossiers.length;
  const documentsCount = mockDocuments.length;
  const documentsValides = mockDocuments.filter(doc => doc.statut === StatutDocument.VALIDE).length;
  
  // Calcul de la progression (basé sur les chapitres complétés)
  const chapitresTotal = 5; // Nombre total de chapitres attendus
  const chapitresCompletes = mockDocuments.filter(
    doc => doc.typeDocument === TypeDocument.CHAPITRE && doc.statut === StatutDocument.VALIDE
  ).length;
  const progression = Math.round((chapitresCompletes / chapitresTotal) * 100);
  
  // Calcul des échéances à venir (dans les 30 prochains jours)
  const aujourdhui = new Date();
  const dans30Jours = new Date();
  dans30Jours.setDate(aujourdhui.getDate() + 30);
  
  const echeancesCount = mockEvenements.filter(
    event => event.type === TypeEvenement.ECHANCE && 
    event.dateDebut >= aujourdhui && 
    event.dateDebut <= dans30Jours
  ).length;
  
  return {
    dossiersCount,
    documentsCount,
    documentsValides,
    progression,
    echeancesCount,
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
  
  const stats = getDashboardStats();
  
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
