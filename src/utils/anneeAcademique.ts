// ============================================================================
// UTILITAIRES POUR LA GESTION DES ANNÉES ACADÉMIQUES
// ============================================================================

/**
 * Détermine l'année académique en cours
 * Format: "YYYY-YYYY" (ex: "2024-2025")
 * L'année académique commence en septembre et se termine en août
 */
export const getAnneeAcademiqueCourante = (): string => {
  const maintenant = new Date();
  const mois = maintenant.getMonth() + 1; // 1-12
  const annee = maintenant.getFullYear();
  
  // Si on est entre septembre (9) et décembre (12), l'année académique est année-année+1
  // Si on est entre janvier (1) et août (8), l'année académique est année-1-année
  if (mois >= 9) {
    return `${annee}-${annee + 1}`;
  } else {
    return `${annee - 1}-${annee}`;
  }
};

/**
 * Vérifie si une année académique est terminée
 * Une année académique est terminée si on est après le 31 août de l'année de fin
 * Exemple: "2024-2025" se termine le 31 août 2025 à 23:59:59
 * Donc si on est le 1er septembre 2025 ou après, l'année "2024-2025" est terminée
 */
export const isAnneeAcademiqueTerminee = (anneeAcademique: string): boolean => {
  const [anneeDebut, anneeFin] = anneeAcademique.split('-').map(Number);
  const maintenant = new Date();
  // L'année académique se termine le 31 août de l'année de fin à 23:59:59
  // On utilise le 1er septembre à 00:00:00 pour la comparaison (plus simple)
  // Si maintenant >= 1er septembre de l'année de fin, l'année académique est terminée
  const anneeFinDate = new Date(anneeFin, 8, 1); // 1er septembre de l'année de fin (mois 8 = septembre, index 0)
  
  return maintenant >= anneeFinDate;
};

/**
 * Extrait l'année académique d'une date de soutenance
 * Les soutenances ont généralement lieu entre mars et juillet
 */
export const getAnneeAcademiqueFromDate = (date: Date): string => {
  const mois = date.getMonth() + 1; // 1-12
  const annee = date.getFullYear();
  
  // Si la soutenance est entre janvier et août, elle appartient à l'année académique année-1-année
  // Si la soutenance est entre septembre et décembre, elle appartient à l'année académique année-année+1
  if (mois >= 9) {
    return `${annee}-${annee + 1}`;
  } else {
    return `${annee - 1}-${annee}`;
  }
};

/**
 * Vérifie si un professeur a un rôle actif pour l'année académique en cours
 * Les rôles (encadrant, jurie, commission) sont valides uniquement pour l'année académique en cours
 * Exception: le chef de département garde toujours son rôle
 */
export const hasRoleActifPourAnneeCourante = (
  user: { estChef?: boolean; estEncadrant?: boolean; estJurie?: boolean; estCommission?: boolean } | null,
  anneeAcademique?: string
): boolean => {
  if (!user) return false;
  
  // Le chef de département garde toujours son rôle
  if (user.estChef) return true;
  
  // Si pas d'année académique spécifiée, vérifier pour l'année en cours
  const anneeCourante = getAnneeAcademiqueCourante();
  const anneeAVerifier = anneeAcademique || anneeCourante;
  
  // Si l'année académique est terminée, le professeur perd ses rôles (sauf chef)
  if (isAnneeAcademiqueTerminee(anneeAVerifier)) {
    return false;
  }
  
  // Sinon, vérifier si le rôle existe et si l'année correspond à l'année en cours
  return (
    (user.estEncadrant || user.estJurie || user.estCommission) &&
    anneeAVerifier === anneeCourante
  );
};

