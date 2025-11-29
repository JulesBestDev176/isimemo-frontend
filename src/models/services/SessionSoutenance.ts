// ============================================================================
// TYPES & INTERFACES - SESSION DE SOUTENANCE
// ============================================================================

export enum StatutSession {
  PLANIFIEE = 'PLANIFIEE',
  OUVERTE = 'OUVERTE',
  FERMEE = 'FERMEE'
}

export enum TypeSessionSoutenance {
  JUIN = 'JUIN',
  SEPTEMBRE = 'SEPTEMBRE',
  DECEMBRE = 'DECEMBRE',
  SPECIALE = 'SPECIALE'
}

export interface SessionSoutenance {
  idSession: number;
  nom: string;
  typeSession?: TypeSessionSoutenance; // Type de session (Juin, Septembre, Décembre, Spéciale)
  anneeAcademique: string;
  dateDebut: Date; // Date de début de la période de soutenance
  dateFin: Date; // Date de fin de la période de soutenance
  statut: StatutSession;
  dateCreation: Date;
  dateOuverture?: Date; // Date d'ouverture pour renseignement des disponibilités
  dateFermeture?: Date; // Date de fermeture (fin du renseignement des disponibilités)
  creePar: number; // idChefDepartement
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Vérifie si une session est ouverte
 */
export const isSessionOuverte = (session: SessionSoutenance): boolean => {
  return session.statut === StatutSession.OUVERTE;
};

/**
 * Vérifie si une session peut être ouverte
 */
export const peutOuvrirSession = (session: SessionSoutenance): boolean => {
  return session.statut === StatutSession.PLANIFIEE;
};

/**
 * Vérifie si une session peut être fermée
 */
export const peutFermerSession = (session: SessionSoutenance): boolean => {
  return session.statut === StatutSession.OUVERTE;
};

/**
 * Récupère la session ouverte pour une année académique
 */
export const getSessionOuverte = (
  sessions: SessionSoutenance[],
  anneeAcademique: string
): SessionSoutenance | undefined => {
  return sessions.find(
    s => s.anneeAcademique === anneeAcademique && s.statut === StatutSession.OUVERTE
  );
};

/**
 * Récupère toutes les sessions pour une année académique
 */
export const getSessionsByAnnee = (
  sessions: SessionSoutenance[],
  anneeAcademique: string
): SessionSoutenance[] => {
  return sessions.filter(s => s.anneeAcademique === anneeAcademique);
};
