// ============================================================================
// SERVICE POUR L'ESPACE PROFESSEUR
// ============================================================================

import type { Professeur } from '../acteurs/Professeur';
import type { DossierMemoire } from '../dossier/DossierMemoire';
import type { Document } from '../dossier/Document';
import type { Soutenance } from '../soutenance/Soutenance';
import type { MembreJury } from '../soutenance/MembreJury';
import { getEncadrementsByProfesseur, StatutEncadrement } from '../dossier/Encadrement';
import { getSoutenancesByProfesseur } from '../soutenance/Soutenance';
import { getMembresJuryByProfesseur } from '../soutenance/MembreJury';
import { mockDossiers, StatutDossierMemoire } from '../dossier/DossierMemoire';
import { mockDocuments, StatutDocument, TypeDocument } from '../dossier/Document';
import { TOUS_LES_SUJETS } from '../../pages/professeur/Sujets';

// Interface pour un sujet proposé
export interface SujetPropose {
  id: number;
  titre: string;
  description: string;
  dateSoumission?: string;
  dateApprobation?: string;
  anneeAcademique: string;
  nombreEtudiantsActuels: number;
  nombreMaxEtudiants: number;
  estDesactive?: boolean; // Si le professeur a désactivé le sujet
}

// Interface pour un sujet validé
export interface SujetValide {
  id: number;
  titre: string;
  description: string;
  dateValidation: string;
  anneeAcademique: string;
  dossierMemoireId?: number;
  dossierMemoireTitre?: string;
}

// Interface pour un jury avec informations complètes
export interface JuryInfo {
  idSoutenance: number;
  dateSoutenance: Date;
  heureDebut: string;
  heureFin: string;
  role: string;
  dossiers: Array<{
    idDossierMemoire: number;
    titre: string;
    candidats: Array<{ nom: string; prenom: string; email: string }>;
  }>;
  anneeAcademique: string;
  statut: string;
}

// Interface pour une correction validée
export interface CorrectionValidee {
  idDocument: number;
  titre: string;
  dateValidation: Date;
  dossierMemoireId: number;
  dossierMemoireTitre: string;
  anneeAcademique: string;
  candidats: Array<{ nom: string; prenom: string }>;
  commentaire?: string;
}

// Interface pour les statistiques d'encadrement
export interface StatistiquesEncadrement {
  totalEncadrements: number;
  encadrementsActifs: number;
  encadrementsTermines: number;
  totalEtudiants: number;
  dossiersSoutenus: number;
  dossiersValides: number;
  tauxReussite: number;
  moyenneNotes?: number;
}

/**
 * Récupère tous les sujets proposés par un professeur (non désactivés)
 * Ne retourne pas le statut car il ne doit pas être affiché
 */
export const getSujetsProposesByProfesseur = (idProfesseur: number): SujetPropose[] => {
  return TOUS_LES_SUJETS
    .filter(s => 
      s.professeurId === idProfesseur && 
      !(s as any).estDesactive // Exclure les sujets désactivés par le professeur
    )
    .map(s => ({
      id: s.id,
      titre: s.titre,
      description: s.description,
      dateSoumission: s.dateSoumission,
      dateApprobation: s.dateApprobation,
      anneeAcademique: s.anneeAcademique,
      nombreEtudiantsActuels: s.nombreEtudiantsActuels,
      nombreMaxEtudiants: s.nombreMaxEtudiants,
      estDesactive: false
    }));
};

/**
 * Récupère les sujets validés par un professeur, organisés par année académique
 */
export const getSujetsValidesByProfesseur = (idProfesseur: number): Map<string, SujetValide[]> => {
  const sujetsValides = TOUS_LES_SUJETS
    .filter(s => s.professeurId === idProfesseur && s.dateApprobation)
    .map(s => {
      // Trouver le dossier associé si possible
      const dossier = mockDossiers.find(d => 
        d.encadrant?.idProfesseur === idProfesseur && 
        d.titre.toLowerCase().includes(s.titre.toLowerCase().substring(0, 20))
      );
      
      return {
        id: s.id,
        titre: s.titre,
        description: s.description,
        dateValidation: s.dateApprobation!,
        anneeAcademique: s.anneeAcademique,
        dossierMemoireId: dossier?.idDossierMemoire,
        dossierMemoireTitre: dossier?.titre
      };
    });
  
  // Grouper par année académique
  const sujetsParAnnee = new Map<string, SujetValide[]>();
  sujetsValides.forEach(sujet => {
    if (!sujetsParAnnee.has(sujet.anneeAcademique)) {
      sujetsParAnnee.set(sujet.anneeAcademique, []);
    }
    sujetsParAnnee.get(sujet.anneeAcademique)!.push(sujet);
  });
  
  return sujetsParAnnee;
};

/**
 * Récupère les étudiants encadrés par un professeur, groupés par encadrement (année académique)
 * Un professeur ne peut avoir qu'un seul encadrement actif
 */
export const getEtudiantsEncadresByProfesseur = (idProfesseur: number): Array<{
  anneeAcademique: string;
  encadrement: { dateDebut: Date; dateFin?: Date; statut: StatutEncadrement; idEncadrement: number };
  etudiants: Array<{
    candidat: { idCandidat: number; nom: string; prenom: string; email: string };
    dossier: DossierMemoire;
  }>;
}> => {
  const encadrements = getEncadrementsByProfesseur(idProfesseur);
  
  // Grouper par année académique
  const encadrementsParAnnee = new Map<string, {
    anneeAcademique: string;
    encadrement: { dateDebut: Date; dateFin?: Date; statut: StatutEncadrement; idEncadrement: number };
    etudiants: Array<{
      candidat: { idCandidat: number; nom: string; prenom: string; email: string };
      dossier: DossierMemoire;
    }>;
  }>();
  
  encadrements
    .filter(e => e.dossierMemoire && e.dossierMemoire.candidats)
    .forEach(e => {
      const annee = e.anneeAcademique;
      if (!encadrementsParAnnee.has(annee)) {
        encadrementsParAnnee.set(annee, {
          anneeAcademique: annee,
          encadrement: {
            dateDebut: e.dateDebut,
            dateFin: e.dateFin,
            statut: e.statut,
            idEncadrement: e.idEncadrement
          },
          etudiants: []
        });
      }
      
      const groupe = encadrementsParAnnee.get(annee)!;
      e.dossierMemoire!.candidats!.forEach(candidat => {
        groupe.etudiants.push({
          candidat,
          dossier: e.dossierMemoire!
        });
      });
    });
  
  return Array.from(encadrementsParAnnee.values());
};

/**
 * Récupère les jurys auxquels un professeur a appartenu
 */
export const getJurysByProfesseur = (idProfesseur: number): JuryInfo[] => {
  const soutenances = getSoutenancesByProfesseur(idProfesseur);
  const membresJury = getMembresJuryByProfesseur(idProfesseur);
  
  return soutenances.map(soutenance => {
    const membre = membresJury.find(m => 
      m.soutenance?.idSoutenance === soutenance.idSoutenance
    );
    
    const dossiers = soutenance.dossiersMemoire || 
      (soutenance.dossierMemoire ? [soutenance.dossierMemoire] : []);
    
    return {
      idSoutenance: soutenance.idSoutenance,
      dateSoutenance: soutenance.dateSoutenance,
      heureDebut: soutenance.heureDebut,
      heureFin: soutenance.heureFin,
      role: membre?.roleJury || 'EXAMINATEUR',
      dossiers: dossiers.map(d => ({
        idDossierMemoire: d.idDossierMemoire,
        titre: d.titre,
        candidats: (d.candidats || []).map(c => ({
          nom: c.nom,
          prenom: c.prenom,
          email: c.email
        }))
      })),
      anneeAcademique: soutenance.anneeAcademique,
      statut: soutenance.statut
    };
  });
};

/**
 * Récupère les corrections validées par un professeur (si membre de commission)
 * Organisées par année académique
 * Note: Dans un vrai système, il faudrait tracker qui a validé quoi
 */
export const getCorrectionsValideesByProfesseur = (
  idProfesseur: number, 
  estCommission: boolean
): Map<string, CorrectionValidee[]> => {
  const correctionsParAnnee = new Map<string, CorrectionValidee[]>();
  
  if (!estCommission) return correctionsParAnnee;
  
  // Pour l'instant, on retourne les documents validés récents
  // Dans un vrai système, il faudrait tracker qui a validé chaque document
  const corrections = mockDocuments
    .filter(d => 
      d.statut === StatutDocument.VALIDE && 
      d.typeDocument === TypeDocument.CHAPITRE
    )
    .map(d => {
      const anneeAcademique = d.dossierMemoire?.anneeAcademique || '2024-2025';
      return {
        idDocument: d.idDocument,
        titre: d.titre,
        dateValidation: d.dateModification || d.dateCreation,
        dossierMemoireId: d.dossierMemoire?.idDossierMemoire || 0,
        dossierMemoireTitre: d.dossierMemoire?.titre || 'Titre inconnu',
        anneeAcademique,
        candidats: (d.dossierMemoire?.candidats || []).map(c => ({
          nom: c.nom,
          prenom: c.prenom
        })),
        commentaire: undefined
      };
    });
  
  // Grouper par année académique
  corrections.forEach(correction => {
    if (!correctionsParAnnee.has(correction.anneeAcademique)) {
      correctionsParAnnee.set(correction.anneeAcademique, []);
    }
    correctionsParAnnee.get(correction.anneeAcademique)!.push(correction);
  });
  
  return correctionsParAnnee;
};

/**
 * Récupère les statistiques d'encadrement d'un professeur
 * Un professeur ne peut avoir qu'un seul encadrement actif
 */
export const getStatistiquesEncadrement = (idProfesseur: number): StatistiquesEncadrement => {
  const encadrements = getEncadrementsByProfesseur(idProfesseur);
  // Un professeur ne peut avoir qu'un seul encadrement actif
  const encadrementsActifs = encadrements.filter(e => e.statut === StatutEncadrement.ACTIF);
  const encadrementsTermines = encadrements.filter(e => e.statut === StatutEncadrement.TERMINE);
  
  const dossiers = encadrements
    .map(e => e.dossierMemoire)
    .filter(Boolean) as DossierMemoire[];
  
  const dossiersSoutenus = dossiers.filter(d => d.statut === StatutDossierMemoire.SOUTENU).length;
  const dossiersValides = dossiers.filter(d => d.statut === StatutDossierMemoire.VALIDE).length;
  
  const totalEtudiants = new Set(
    dossiers.flatMap(d => d.candidats?.map(c => c.idCandidat) || [])
  ).size;
  
  const tauxReussite = encadrementsTermines.length > 0
    ? (dossiersSoutenus / encadrementsTermines.length) * 100
    : 0;
  
  return {
    totalEncadrements: encadrements.length,
    encadrementsActifs: Math.min(encadrementsActifs.length, 1), // Maximum 1 encadrement actif
    encadrementsTermines: encadrementsTermines.length,
    totalEtudiants,
    dossiersSoutenus,
    dossiersValides,
    tauxReussite: Math.round(tauxReussite * 100) / 100
  };
};

/**
 * Récupère l'historique des dossiers encadrés par un professeur
 */
export const getHistoriqueDossiersByProfesseur = (idProfesseur: number): DossierMemoire[] => {
  const encadrements = getEncadrementsByProfesseur(idProfesseur);
  
  return encadrements
    .map(e => e.dossierMemoire)
    .filter(Boolean)
    .filter(d => 
      d!.statut === StatutDossierMemoire.SOUTENU || 
      d!.statut === StatutDossierMemoire.VALIDE ||
      d!.statut === StatutDossierMemoire.DEPOSE
    ) as DossierMemoire[];
};

