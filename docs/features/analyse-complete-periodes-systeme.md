# Analyse Complète des Périodes du Système

## Vue d'ensemble

Ce document présente une analyse approfondie de **toutes les périodes** qui doivent être gérées dans le système de gestion des mémoires, incluant leurs dates, deadlines, règles métier et interdépendances.

---

## 1. Année Académique ⭐ (Période Principale)

**Fichier** : `activation-annee-academique.md`  
**Modèle** : `AnneeAcademique.ts`

### Description
Cycle principal qui définit la période d'activité académique. Toutes les autres périodes sont liées à une année académique active.

### Caractéristiques
- **Format** : "2024-2025" (septembre à août)
- **Durée** : 1 an (1er septembre au 31 août)
- **Unicité** : Une seule année peut être active à la fois
- **Impact** : Réinitialise les rôles professeurs lors du changement

### Dates
- `dateDebut` : 1er septembre de l'année de début
- `dateFin` : 31 août de l'année de fin

### Actions
- ✅ Activer une année (désactive automatiquement les autres)
- ✅ Clôturer l'année active
- ✅ Créer une nouvelle année

### Règles métier
- Activation désactive automatiquement toutes les autres années
- Clôture irréversible
- Les autres périodes nécessitent une année active

---

## 2. Période de Dépôt de Sujet par l'Étudiant ⭐ (NOUVELLE)

**Fichier** : `gestion-dossiers-etudiant.md`, `validation-commission.md`  
**Modèle** : `DossierMemoire.ts`, `EtapePipeline.ts`

### Description
Période pendant laquelle les étudiants peuvent déposer leur sujet de mémoire (choix du sujet, choix du binôme, choix de l'encadrant).

### Caractéristiques
- **Étapes** :
  1. Choix du sujet
  2. Choix du binôme (optionnel)
  3. Choix de l'encadrant
  4. Dépôt pour validation commission
- **Statut dossier** : `EN_CREATION` → `EN_ATTENTE_VALIDATION`
- **Étape dossier** : `CHOIX_SUJET` → `VALIDATION_SUJET`

### Dates à définir
- `dateDebutDepotSujet` : Date d'ouverture des dépôts
- `dateFinDepotSujet` : Date limite de dépôt des sujets

### Règles métier
- Un candidat ne peut avoir qu'un seul dossier en cours
- Le dépôt doit inclure : sujet, encadrant choisi, binôme (si applicable)
- Après dépôt, le dossier passe en validation commission

### Actions nécessaires
- ⭐ Créer une période de dépôt de sujet
- ⭐ Définir les dates d'ouverture/fermeture
- ⭐ Bloquer les dépôts en dehors de la période

---

## 3. Période de Validation des Sujets ⭐ (Déjà identifiée)

**Fichier** : `validation-commission.md`  
**Modèle** : `PeriodeValidation.ts`

### Description
Période pendant laquelle la commission de validation peut valider ou rejeter les dépôts de sujets.

### Caractéristiques
- **Type** : `VALIDATION_SUJETS`
- **Mutuellement exclusive** : Ne peut pas être active en même temps que la validation des corrections
- **Durée** : Variable (ex: 15/01 - 15/02)

### Dates
- `dateDebut` : Début de la période de validation
- `dateFin` : Fin de la période de validation (optionnel)

### Règles métier
- Les membres de commission voient uniquement les sujets assignés (répartition aléatoire)
- Validation → Dossier passe à `EN_COURS_REDACTION`, statut `EN_COURS`
- Rejet → Dossier retourne à `CHOIX_SUJET`, statut `EN_CREATION`

### Actions
- ✅ Créer une période
- ✅ Activer/Désactiver
- ⚠️ Vérifier l'exclusivité mutuelle avec validation corrections

---

## 4. Période de Pré-lecture ⭐ (NOUVELLE - Période globale)

**Fichier** : `gestion-prelecture-encadrant.md`  
**Modèle** : `DemandePrelecture.ts`

### Description
Période pendant laquelle les encadrants peuvent effectuer la pré-lecture des mémoires. Bien que chaque pré-lecture soit individuelle, il peut y avoir une période globale pour encadrer le processus.

### Caractéristiques
- **Déclenchement** : Lorsque toutes les tâches sont terminées
- **Statuts** : `EN_ATTENTE`, `EN_COURS`, `VALIDE`, `REJETE`
- **Durée** : Variable selon les besoins

### Dates à définir
- `dateDebutPrelecture` : Date d'ouverture de la période de pré-lecture
- `dateFinPrelecture` : Date limite pour effectuer les pré-lectures

### Règles métier
- Prérequis : Toutes les tâches du dossier doivent être terminées
- L'encadrant principal autorise la pré-lecture
- Un pré-lecteur est assigné pour chaque mémoire
- Validation → `prelectureEffectuee = true`, dossier peut passer à soutenance
- Rejet → Retour avec corrections, création de tickets

### Actions nécessaires
- ⭐ Créer une période de pré-lecture
- ⭐ Définir les dates
- ⭐ Gérer les deadlines individuelles

---

## 5. Période de Renseignement des Disponibilités Professeurs ⭐ (Liée aux sessions)

**Fichier** : `gestion-disponibilites-professeur.md`  
**Modèle** : `DisponibiliteProfesseur.ts`, `SessionSoutenance.ts`

### Description
Période pendant laquelle les professeurs peuvent renseigner leurs disponibilités pour les sessions de soutenance.

### Caractéristiques
- **Liée à** : Session de soutenance ouverte
- **Statut session** : `OUVERTE`
- **Durée** : Entre `dateOuverture` et `dateFermeture` de la session

### Dates
- `dateOuverture` : Date d'ouverture de la session (début période disponibilités)
- `dateFermeture` : Date de fermeture de la session (fin période disponibilités)

### Règles métier
- Les professeurs ne peuvent renseigner leurs disponibilités que si une session est ouverte
- Les disponibilités sont verrouillées lorsque la session est fermée
- Une seule session peut être ouverte à la fois par année

### Actions
- ✅ Gérée via les sessions de soutenance
- ⚠️ Afficher la période active dans la vue d'ensemble

---

## 6. Période de Dépôt de Dossier Complet Final ⭐ (NOUVELLE)

**Fichier** : `gestion-dossiers-etudiant.md`, `ProcessusPipeline.tsx`  
**Modèle** : `DossierMemoire.ts`, `EtapePipeline.ts`

### Description
Période pendant laquelle les étudiants peuvent déposer leur mémoire final complet (après pré-lecture validée).

### Caractéristiques
- **Étape** : `DEPOT_FINAL`
- **Prérequis** : Pré-lecture validée (`prelectureEffectuee = true`)
- **Statut** : `EN_ATTENTE_VALIDATION` ou `DEPOSE`

### Dates à définir
- `dateDebutDepotFinal` : Date d'ouverture des dépôts finaux
- `dateFinDepotFinal` : Date limite de dépôt final

### Règles métier
- Prérequis : Pré-lecture validée
- Le mémoire doit être complet (tous les chapitres, annexes)
- Après dépôt, le dossier peut passer à l'étape `SOUTENANCE`

### Actions nécessaires
- ⭐ Créer une période de dépôt final
- ⭐ Définir les dates
- ⭐ Vérifier les prérequis (pré-lecture)

---

## 7. Sessions de Soutenance ⭐ (Déjà gérée, mais à enrichir)

**Fichier** : `gestion-sessions-soutenance.md`  
**Modèle** : `SessionSoutenance.ts`

### Description
Périodes spécifiques pour organiser les soutenances de mémoire. Il existe différents types de sessions.

### Types de Sessions identifiés
1. **Session Juin** : Session principale de fin d'année
2. **Session Septembre** : Session de rattrapage
3. **Session Décembre** : Session spéciale
4. **Session Spéciale** : Sessions exceptionnelles

### Caractéristiques
- **Liées à** : Année académique active
- **Contenu** : Liste de jours spécifiques (pas de plage continue)
- **Statuts** : `PLANIFIEE` → `OUVERTE` → `FERMEE`

### Dates
- `joursSession` : Array de dates spécifiques
- `dateOuverture` : Date d'ouverture pour disponibilités
- `dateFermeture` : Date de fermeture (verrouillage disponibilités)

### Règles métier
- Une seule session peut être ouverte à la fois par année
- Workflow : PLANIFIEE → OUVERTE → FERMEE (pas de retour)
- Les professeurs renseignent leurs disponibilités pendant la période ouverte

### Actions
- ✅ Créer une session
- ✅ Ouvrir/Fermer une session
- ⚠️ Gérer les différents types (Juin, Septembre, Décembre, Spéciale)

---

## 8. Période de Validation des Corrections ⭐ (Déjà identifiée)

**Fichier** : `validation-commission.md`  
**Modèle** : `PeriodeValidation.ts`

### Description
Période pendant laquelle la commission de validation peut valider ou rejeter les documents corrigés après soutenance.

### Caractéristiques
- **Type** : `VALIDATION_CORRECTIONS`
- **Mutuellement exclusive** : Ne peut pas être active en même temps que la validation des sujets
- **Durée** : Variable (ex: 01/06 - 01/07)

### Dates
- `dateDebut` : Début de la période
- `dateFin` : Fin de la période (optionnel)

### Règles métier
- Les membres de commission voient uniquement les documents assignés
- Validation → Statut `VALIDE`, ressource bibliothèque activée
- Rejet → Statut `REJETE`, commentaire enregistré

### Actions
- ✅ Créer une période
- ✅ Activer/Désactiver
- ⚠️ Vérifier l'exclusivité mutuelle avec validation sujets

---

## 9. Période de Correction (Post-Soutenance) ⭐ (NOUVELLE)

**Fichier** : `espace-jury.md`, `ProcessusPipeline.tsx`  
**Modèle** : `DossierMemoire.ts`, `EtapePipeline.ts`

### Description
Période pendant laquelle les étudiants peuvent corriger leur mémoire après soutenance (si des modifications sont demandées).

### Caractéristiques
- **Étape** : `CORRECTION`
- **Déclenchement** : Si le PV contient des demandes de modifications
- **Statut** : `EN_COURS` (correction en cours)

### Dates à définir
- `dateDebutCorrection` : Date de début de la période de correction
- `dateFinCorrection` : Date limite pour soumettre les corrections

### Règles métier
- Déclenché par le président du jury si modifications demandées
- L'étudiant doit soumettre les corrections
- Les corrections sont ensuite validées par la commission

### Actions nécessaires
- ⭐ Créer une période de correction
- ⭐ Définir les dates
- ⭐ Gérer le workflow : Soutenance → Correction → Validation

---

## 10. Période de Dépôt Intermédiaire (Info, pas de gestion directe)

**Fichier** : `gestion-dossiers-etudiant.md`  
**Modèle** : `DossierMemoire.ts`

### Description
Étape dans le cycle de vie où l'étudiant peut déposer des documents intermédiaires.

### Caractéristiques
- **Étape** : `DEPOT_INTERMEDIAIRE`
- **Statut** : `EN_COURS`
- **Nature** : Étape individuelle, pas une période globale

### Note
Ce n'est pas une période à gérer dans la page "Périodes" car c'est une étape individuelle dans le cycle de vie du dossier.

---

## Chronologie des Périodes dans une Année Académique

```
Année Académique 2024-2025
│
├─ Septembre 2024
│  └─ [Ouverture année académique]
│
├─ Octobre-Novembre 2024
│  └─ [Période Dépôt Sujet] ⭐ NOUVELLE
│     └─ Étudiants déposent leurs sujets
│
├─ Janvier-Février 2025
│  └─ [Période Validation Sujets] ⭐
│     └─ Commission valide les sujets
│
├─ Février-Mai 2025
│  └─ [Rédaction en cours]
│     └─ Étudiants rédigent leurs mémoires
│
├─ Avril-Mai 2025
│  └─ [Période Pré-lecture] ⭐ NOUVELLE
│     └─ Encadrants effectuent la pré-lecture
│
├─ Mai-Juin 2025
│  └─ [Période Dépôt Final] ⭐ NOUVELLE
│     └─ Étudiants déposent leurs mémoires finaux
│
├─ Mai 2025
│  └─ [Session Juin - Ouverture] ⭐
│     └─ Professeurs renseignent disponibilités
│
├─ Juin 2025
│  └─ [Session Juin - Soutenances]
│     └─ Soutenances des mémoires
│
├─ Juin-Juillet 2025
│  └─ [Période Correction] ⭐ NOUVELLE
│     └─ Corrections post-soutenance (si nécessaire)
│
├─ Juillet-Août 2025
│  └─ [Période Validation Corrections] ⭐
│     └─ Commission valide les corrections
│
└─ Septembre 2025
   └─ [Session Septembre - Soutenances] ⭐
      └─ Soutenances de rattrapage
```

---

## Périodes à Gérer dans la Page "Périodes"

### Périodes principales (gestion active) :

1. ✅ **Années Académiques** - Cycle principal
2. ⭐ **Période Dépôt Sujet** - Quand les étudiants peuvent déposer (NOUVELLE)
3. ⭐ **Période Validation Sujets** - Validation par commission
4. ⭐ **Période Pré-lecture** - Période globale pour pré-lecture (NOUVELLE)
5. ⭐ **Période Dépôt Final** - Dépôt des mémoires finaux (NOUVELLE)
6. ✅ **Sessions de Soutenance** - Juin, Septembre, Décembre, Spéciale
7. ⭐ **Période Correction** - Corrections post-soutenance (NOUVELLE)
8. ⭐ **Période Validation Corrections** - Validation des corrections

### Informations contextuelles (affichage uniquement) :

9. **Disponibilités Professeurs** - Liées aux sessions (info dans vue d'ensemble)

---

## Modèle de Données Proposé

### PeriodeDepotSujet
```typescript
interface PeriodeDepotSujet {
  idPeriode: number;
  anneeAcademique: string;
  dateDebut: Date;
  dateFin: Date;
  estActive: boolean;
}
```

### PeriodePrelecture
```typescript
interface PeriodePrelecture {
  idPeriode: number;
  anneeAcademique: string;
  dateDebut: Date;
  dateFin: Date;
  estActive: boolean;
  delaiMaxPrelecture?: number; // Délai maximum en jours pour une pré-lecture
}
```

### PeriodeDepotFinal
```typescript
interface PeriodeDepotFinal {
  idPeriode: number;
  anneeAcademique: string;
  dateDebut: Date;
  dateFin: Date;
  estActive: boolean;
  sessionSoutenanceId?: number; // Liée à une session spécifique
}
```

### PeriodeCorrection
```typescript
interface PeriodeCorrection {
  idPeriode: number;
  anneeAcademique: string;
  dateDebut: Date;
  dateFin: Date;
  estActive: boolean;
  delaiMaxCorrection?: number; // Délai maximum en jours pour corriger
}
```

### SessionSoutenance (enrichie)
```typescript
interface SessionSoutenance {
  idSession: number;
  nom: string;
  typeSession: 'JUIN' | 'SEPTEMBRE' | 'DECEMBRE' | 'SPECIALE';
  anneeAcademique: string;
  joursSession: Date[];
  statut: StatutSession;
  dateCreation: Date;
  dateOuverture?: Date;
  dateFermeture?: Date;
  creePar: number;
}
```

---

## Règles Métier Globales

### 1. Ordre chronologique
Les périodes doivent respecter un ordre logique :
1. Année académique active
2. Dépôt sujet
3. Validation sujets
4. Rédaction (pas de période, processus continu)
5. Pré-lecture
6. Dépôt final
7. Session soutenance (ouverture → fermeture → soutenances)
8. Correction (si nécessaire)
9. Validation corrections

### 2. Exclusivité mutuelle
- Validation sujets et Validation corrections ne peuvent pas être actives simultanément
- Une seule session peut être ouverte à la fois

### 3. Prérequis
- Toutes les périodes nécessitent une année académique active
- Dépôt final nécessite pré-lecture validée
- Correction nécessite soutenance effectuée avec demandes de modifications
- Validation corrections nécessite corrections soumises

### 4. Blocage automatique
- Les étudiants ne peuvent pas déposer en dehors des périodes actives
- Les commissions ne peuvent pas valider en dehors des périodes actives
- Les encadrants ne peuvent pas effectuer pré-lecture en dehors de la période

---

## Actions à Implémenter

### Pour chaque période :
1. ✅ Créer une période
2. ✅ Activer/Désactiver une période
3. ✅ Modifier les dates (si période non active)
4. ⚠️ Vérifier les prérequis avant activation
5. ⚠️ Bloquer les actions en dehors des périodes actives
6. ⚠️ Afficher les deadlines dans l'interface utilisateur

### Pour les sessions :
1. ✅ Créer une session
2. ✅ Ouvrir/Fermer une session
3. ⚠️ Gérer les types (Juin, Septembre, Décembre, Spéciale)
4. ⚠️ Afficher la période de disponibilités (dateOuverture → dateFermeture)

---

## Interface Utilisateur Proposée

### Structure de la page "Périodes" :

```
┌─────────────────────────────────────────────────────────┐
│  Gestion des Périodes                                   │
│  [Vue d'ensemble] [Années] [Dépôts] [Validations]       │
│                         [Sessions] [Pré-lecture]          │
└─────────────────────────────────────────────────────────┘

Onglet "Dépôts" :
├─ Période Dépôt Sujet
│  └─ [Créer] [Activer] [Dates]
├─ Période Dépôt Final
│  └─ [Créer] [Activer] [Dates] [Lier session]
└─ Période Correction
   └─ [Créer] [Activer] [Dates]

Onglet "Pré-lecture" :
└─ Période Pré-lecture
   └─ [Créer] [Activer] [Dates] [Délai max]
```

---

## Notes d'Implémentation

### Priorités
1. **Haute** : Années académiques, Sessions, Validation sujets/corrections (déjà fait)
2. **Moyenne** : Dépôt sujet, Dépôt final, Pré-lecture
3. **Basse** : Correction (peut être géré individuellement)

### À faire
- [ ] Créer les modèles pour les nouvelles périodes
- [ ] Implémenter la logique de blocage selon les périodes actives
- [ ] Ajouter les vérifications de prérequis
- [ ] Enrichir les sessions avec les types (Juin, Septembre, Décembre, Spéciale)
- [ ] Afficher les deadlines dans les interfaces étudiant/encadrant
- [ ] Implémenter les notifications de deadlines approchantes

---

**Date de création** : 2025-01-XX  
**Version** : 2.0 (Analyse approfondie)

