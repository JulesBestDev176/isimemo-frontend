import { useState, useCallback } from 'react';
import { Professeur, mockProfesseurs } from '../models/acteurs/Professeur';
import { DossierMemoire, mockDossiers, StatutDossierMemoire, EtapeDossier } from '../models/dossier/DossierMemoire';
import { TypeRole, mockAttributions } from '../models/services/AttributionRole';
import { RoleJury } from '../models/soutenance/MembreJury';
import { Salle, mockSalles } from '../models/infrastructure/Salle';

// Interface pour un jury généré (proposition)
export interface PropositionJury {
  membres: {
    professeur: Professeur;
    role: RoleJury;
  }[];
  dossiers: DossierMemoire[];
  dateSoutenance?: Date;
  heureDebut?: string;
  heureFin?: string;
  salle?: Salle;
  valide: boolean;
  messageErreur?: string;
  dateProposition?: Date;
}

export const useGenerationJurys = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Génère des propositions de jurys avec dimensionnement intelligent
   * ET assignation automatique de dates/salles
   */
  const genererPropositions = useCallback(async (
    annee: string,
    session: string,
    niveau: 'licence' | 'master',
    departement: string,
    sessionDateDebut?: Date,
    sessionDateFin?: Date
  ): Promise<PropositionJury[]> => {
    setIsGenerating(true);
    setError(null);

    try {
      // 1. Récupération des données
      const dossiers = mockDossiers.filter(d => 
        d.statut === StatutDossierMemoire.VALIDE && 
        d.etape === EtapeDossier.SOUTENANCE &&
        d.anneeAcademique === annee
      );

      const professeurs = mockProfesseurs.filter(p => 
        p.estDisponible && 
        (p.departement === departement || p.departement?.includes(departement))
      );

      const presidentsEligibles = mockAttributions
        .filter(a => 
          a.typeRole === TypeRole.PRESIDENT_JURY_POSSIBLE && 
          a.anneeAcademique === annee &&
          a.estActif
        )
        .map(a => a.professeur);

      if (dossiers.length === 0) {
        throw new Error("Aucun dossier validé trouvé pour cette période.");
      }

      if (professeurs.length < 3) {
        throw new Error("Pas assez de professeurs disponibles pour former un jury.");
      }

      if (presidentsEligibles.length === 0) {
        throw new Error("Aucun président de jury éligible trouvé.");
      }

      // 2. Calcul intelligent du nombre de jurys
      const TOTAL_ETUDIANTS = dossiers.length;
      const MAX_PAR_JURY = 10;
      const SEUIL_RESTE = 5;

      let nombreJurys = Math.floor(TOTAL_ETUDIANTS / MAX_PAR_JURY);
      const reste = TOTAL_ETUDIANTS % MAX_PAR_JURY;

      if (reste > SEUIL_RESTE) {
        nombreJurys += 1;
      } else if (nombreJurys === 0) {
        nombreJurys = 1;
      }

      // 3. Génération des propositions avec dates et salles
      const propositions: PropositionJury[] = [];
      let dossiersRestants = [...dossiers];
      dossiersRestants.sort(() => Math.random() - 0.5);

      // Dates par défaut (si non fournies)
      const dateDebut = sessionDateDebut || new Date('2025-09-15');
      const dateFin = sessionDateFin || new Date('2025-09-19');

      // Générer des dates espacées
      const datesDisponibles = generateDates(dateDebut, dateFin, nombreJurys);
      const sallesDisponibles = [...mockSalles];

      for (let i = 0; i < nombreJurys; i++) {
        const dossiersPourCeJury = Math.ceil(dossiersRestants.length / (nombreJurys - i));
        const lotDossiers = dossiersRestants.slice(0, dossiersPourCeJury);
        dossiersRestants = dossiersRestants.slice(dossiersPourCeJury);

        const membresJury = trouverJuryValide(lotDossiers, professeurs, presidentsEligibles);

        // Calculer durée estimée (30min par étudiant)
        const dureeMinutes = lotDossiers.length * 30;
        const heureDebut = '09:00';
        const heureFin = addMinutes(heureDebut, dureeMinutes);

        if (membresJury) {
          propositions.push({
            membres: membresJury,
            dossiers: lotDossiers,
            dateSoutenance: datesDisponibles[i],
            heureDebut,
            heureFin,
            salle: sallesDisponibles[i % sallesDisponibles.length],
            valide: true,
            dateProposition: new Date()
          });
        } else {
          propositions.push({
            membres: [],
            dossiers: lotDossiers,
            valide: false,
            messageErreur: "Impossible de trouver une composition valide (conflits d'encadrement ou manque de présidents).",
            dateProposition: new Date()
          });
        }
      }

      return propositions;

    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la génération");
      return [];
    } finally {
      setIsGenerating(false);
    }
  }, []);

  function trouverJuryValide(
    dossiers: DossierMemoire[], 
    tousProfesseurs: Professeur[],
    presidentsEligibles: Professeur[]
  ): { professeur: Professeur; role: RoleJury }[] | null {
    
    const encadrantsIds = new Set(dossiers.map(d => d.encadrant?.idProfesseur).filter(id => id !== undefined));

    const candidatsPresident = presidentsEligibles.filter(p => 
      !encadrantsIds.has(p.idProfesseur) && 
      tousProfesseurs.some(tp => tp.idProfesseur === p.idProfesseur)
    );

    if (candidatsPresident.length === 0) return null;
    
    const president = candidatsPresident[Math.floor(Math.random() * candidatsPresident.length)];

    const autresProfesseurs = tousProfesseurs.filter(p => 
      p.idProfesseur !== president.idProfesseur && 
      !encadrantsIds.has(p.idProfesseur)
    );

    if (autresProfesseurs.length < 2) return null;

    const melange = [...autresProfesseurs].sort(() => Math.random() - 0.5);
    const rapporteur = melange[0];
    const examinateur = melange[1];

    return [
      { professeur: president, role: RoleJury.PRESIDENT },
      { professeur: rapporteur, role: RoleJury.RAPPORTEUR },
      { professeur: examinateur, role: RoleJury.EXAMINATEUR }
    ];
  }

  return {
    genererPropositions,
    isGenerating,
    error
  };
};

// Utilitaires
function generateDates(debut: Date, fin: Date, count: number): Date[] {
  const dates: Date[] = [];
  const totalDays = Math.floor((fin.getTime() - debut.getTime()) / (1000 * 60 * 60 * 24));
  const interval = Math.max(1, Math.floor(totalDays / count));

  for (let i = 0; i < count; i++) {
    const date = new Date(debut);
    date.setDate(debut.getDate() + (i * interval));
    dates.push(date);
  }

  return dates;
}

function addMinutes(time: string, minutes: number): string {
  const [hours, mins] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMins = totalMinutes % 60;
  return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
}

