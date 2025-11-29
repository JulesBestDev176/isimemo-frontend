# Analyse du Pipeline des Périodes

## Pipeline Complet

```
1. Début Année Académique
2. Dépôt Sujet et Choix d'Encadrant (même période - quand on dépose un sujet, on choisit aussi l'encadrant)
3. Validation Sujet
4. Pré-lecture 1 && Renseignement Disponibilité 1 (en parallèle, même période)
5. Dépôt Final 1 (Renseignement Disponibilité peut continuer après)
6. Soutenance Septembre
7. Validation Correction 1
8. Pré-lecture 2 && Renseignement Disponibilité 2 (en parallèle, même période)
9. Dépôt Final 2 (Renseignement Disponibilité peut continuer après)
10. Soutenance Décembre
11. Validation Correction 2
12. Fin Année Académique
```

**Note importante** : 
- Le pipeline affiche les périodes d'**une seule année académique**
- Il n'y a qu'**une seule session Septembre** et **une seule session Décembre** par année
- Les sessions spéciales n'existent pas
- Décembre est une session principale, pas une session spéciale

## Périodes Identifiées

### ✅ Périodes Gérées

1. **Début Année Académique** - `AnneeAcademique` (début du pipeline)
2. **Dépôt Sujet et Choix d'Encadrant** - `PeriodeDepotSujet` (même période, une seule étape)
3. **Validation Sujet** - `PeriodeValidation` (type: VALIDATION_SUJETS)
4. **Pré-lecture** - `PeriodePrelecture` (répétitive, liée à chaque session)
5. **Renseignement Disponibilité** - `PeriodeDisponibilite` (répétitive, liée à chaque session, en parallèle avec Pré-lecture, peut continuer après dépôt final)
6. **Dépôt Final** - `PeriodeDepotFinal` (répétitive, liée à chaque session)
7. **Sessions de Soutenance** - `SessionSoutenance` (seulement Septembre et Décembre, une de chaque par année, affichées comme "Soutenance Septembre" / "Soutenance Décembre")
8. **Validation Corrections** - `PeriodeValidation` (type: VALIDATION_CORRECTIONS, répétitive, liée à chaque session)
9. **Fin Année Académique** - `AnneeAcademique` (fin du pipeline)

## Structure des Périodes Parallèles

### Périodes en Parallèle

1. **Dépôt Sujet et Choix d'Encadrant**
   - Une seule étape (même période)
   - Quand les étudiants déposent leur sujet, ils choisissent aussi leur encadrant
   - Pas deux étapes séparées, mais une seule action combinée

2. **Pré-lecture && Renseignement Disponibilité**
   - Même période temporelle (même ordre)
   - Les encadrants font la pré-lecture ET les professeurs renseignent leurs disponibilités en parallèle

3. **Renseignement Disponibilité peut continuer après Dépôt Final**
   - Le renseignement des disponibilités peut se poursuivre même après la fin de la période de dépôt final
   - Cela permet aux professeurs de continuer à renseigner leurs disponibilités jusqu'à la fermeture de la session

## Modifications Nécessaires

### 1. Créer `PeriodeDisponibilite`

```typescript
export interface PeriodeDisponibilite {
  idPeriode: number;
  anneeAcademique: string;
  dateDebut: Date;
  dateFin: Date;
  estActive: boolean;
  sessionSoutenanceId: number; // Liée à une session spécifique
  dateCreation: Date;
  creePar: number; // idChefDepartement
}
```

### 2. Mettre à jour `TypeEtapePipeline`

Remplacer :
- `DEPOT_SUJET` et `DEMANDE_ENCADREMENT` par `DEPOT_SUJET_ET_ENCADREMENT` (une seule étape)

Ajouter :
- `RENSEIGNEMENT_DISPONIBILITE = 'RENSEIGNEMENT_DISPONIBILITE'`

### 3. Mettre à jour `construirePipeline`

- Fusionner dépôt sujet et demande d'encadrement en une seule étape
- Mettre pré-lecture et renseignement disponibilité en parallèle (même ordre)
- Permettre au renseignement disponibilité de continuer après dépôt final
- Filtrer les sessions pour ne garder que Septembre et Décembre (une de chaque)
- Supprimer les sessions spéciales

## Ordre du Pipeline

1. **Début Année Académique** (ordre: 1)
2. **Dépôt Sujet et Choix d'Encadrant** (ordre: 2) - Une seule étape
3. **Validation Sujet** (ordre: 3)
4. **Cycle Septembre** :
   - Pré-lecture 1 (ordre: 4) && Renseignement Disponibilité 1 (ordre: 4) - PARALLÈLE
   - Dépôt Final 1 (ordre: 5) - Renseignement Disponibilité peut continuer après
   - Soutenance Septembre (ordre: 6)
   - Validation Correction 1 (ordre: 7)
5. **Cycle Décembre** :
   - Pré-lecture 2 (ordre: 8) && Renseignement Disponibilité 2 (ordre: 8) - PARALLÈLE
   - Dépôt Final 2 (ordre: 9) - Renseignement Disponibilité peut continuer après
   - Soutenance Décembre (ordre: 10)
   - Validation Correction 2 (ordre: 11)
6. **Fin Année Académique** (ordre: 999) - Toujours à la fin

## Notes Importantes

- Les périodes en parallèle ont le même `ordre` dans le pipeline
- **Début Année** : Première étape du pipeline, marque le début de l'année académique
- **Fin Année** : Dernière étape du pipeline (ordre: 999), marque la fin de l'année académique
- **Dépôt Sujet et Choix d'Encadrant** : Une seule étape car c'est la même action (quand on dépose un sujet, on choisit aussi l'encadrant)
- **Pré-lecture et Renseignement Disponibilité** : En parallèle (même ordre), peuvent se faire en même temps
- **Renseignement Disponibilité** : Peut continuer après la fin du dépôt final (dateFin peut être après celle du dépôt final)
- **Sessions** : Seulement Septembre et Décembre, une de chaque par année académique
- **Nommage des sessions** : Affichées comme "Soutenance Septembre 2025" / "Soutenance Décembre 2025" (pas "Session Session...")
- **Pas de sessions spéciales** : Les sessions spéciales n'existent pas dans le système
- Le pipeline affiche les périodes d'**une seule année académique** à la fois, encadrées par "Début Année" et "Fin Année"

