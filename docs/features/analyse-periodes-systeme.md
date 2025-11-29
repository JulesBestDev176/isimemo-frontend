# Analyse des Périodes du Système

## Vue d'ensemble

Cette analyse identifie toutes les périodes, cycles et sessions temporelles qui doivent être gérées dans le système de gestion des mémoires.

## Périodes Identifiées

### 1. Années Académiques ⭐ (Gérée)
**Fichier de documentation** : `activation-annee-academique.md`

**Description** : Cycle principal du système, définit la période d'activité académique.

**Caractéristiques** :
- Une seule année peut être active à la fois
- Définit la période de base pour toutes les autres activités
- Réinitialise les rôles professeurs lors du changement
- Format : "2024-2025" (septembre à août)

**Statuts** :
- `estActive: true` - Année en cours
- `estActive: false` - Année inactive (passée ou future)

**Actions** :
- Activer une année (désactive automatiquement les autres)
- Clôturer l'année active
- Créer une nouvelle année

---

### 2. Sessions de Soutenance ⭐ (Gérée)
**Fichier de documentation** : `gestion-sessions-soutenance.md`

**Description** : Périodes spécifiques pour organiser les soutenances de mémoire.

**Caractéristiques** :
- Liées à une année académique active
- Contiennent une liste de jours spécifiques (pas de plage continue)
- Permettent la collecte des disponibilités des professeurs
- Une seule session peut être ouverte à la fois par année

**Statuts** :
- `PLANIFIEE` - Session créée mais pas encore ouverte
- `OUVERTE` - Session active, professeurs peuvent renseigner leurs disponibilités
- `FERMEE` - Session fermée, disponibilités verrouillées

**Workflow** :
```
PLANIFIEE → OUVERTE → FERMEE
```

**Actions** :
- Créer une session avec jours spécifiques
- Ouvrir une session (notifie les professeurs)
- Fermer une session (verrouille les disponibilités)

---

### 3. Périodes de Validation ⭐ (À gérer)
**Fichier de documentation** : `validation-commission.md`
**Modèle** : `PeriodeValidation.ts`

**Description** : Périodes pendant lesquelles la commission de validation peut valider les sujets ou les documents corrigés.

**Caractéristiques** :
- **Mutuellement exclusives** : Une seule période peut être active à la fois
- Deux types : Validation des sujets OU Validation des corrections
- Définissent quand les membres de commission peuvent travailler
- Contrôlent l'affichage des onglets dans l'espace commission

**Types** :
- `VALIDATION_SUJETS` - Période pour valider les dépôts de sujets
- `VALIDATION_CORRECTIONS` - Période pour valider les documents corrigés après soutenance
- `AUCUNE` - Aucune période active

**Règles métier** :
- Les deux types ne peuvent pas être actifs simultanément
- Les périodes se déroulent à des moments différents de l'année
- L'onglet "Phase publique" n'est visible que si une période est active

**Actions** :
- Créer une période de validation
- Activer une période (désactive automatiquement l'autre type)
- Désactiver la période active

---

### 4. Disponibilités Professeurs (Info, pas de gestion directe)
**Fichier de documentation** : `gestion-disponibilites-professeur.md`

**Description** : Créneaux horaires renseignés par les professeurs pour les sessions de soutenance.

**Caractéristiques** :
- Liées à une session de soutenance ouverte
- Renseignées par les professeurs (pas par le chef de département)
- Utilisées pour la planification des soutenances
- Verrouillées lorsque la session est fermée

**Note** : Cette période n'est pas gérée directement dans la page "Périodes" car elle est renseignée par les professeurs. Cependant, elle est liée aux sessions de soutenance.

---

### 5. Pré-lecture (Processus individuel, pas une période globale)
**Fichier de documentation** : `gestion-prelecture-encadrant.md`

**Description** : Processus de pré-lecture des mémoires par les encadrants.

**Caractéristiques** :
- Processus individuel par mémoire (pas une période globale)
- Déclenché lorsque toutes les tâches sont terminées
- Géré au niveau des dossiers individuels
- Statuts : EN_ATTENTE, EN_COURS, VALIDE, REJETE

**Note** : Ce n'est pas une période à gérer dans la page "Périodes" car c'est un processus déclenché individuellement pour chaque mémoire.

---

### 6. Encadrements (Liés à l'année, pas une période)
**Fichier de documentation** : `gestion-encadrements-professeur.md`

**Description** : Relations d'encadrement entre professeurs et étudiants.

**Caractéristiques** :
- Liés à une année académique
- Créés à partir des demandes d'encadrement
- Statuts : ACTIF, TERMINE, ANNULE

**Note** : Ce n'est pas une période à gérer, mais plutôt une relation liée à l'année académique.

---

### 7. Dossiers Étudiants - Étapes (Cycle de vie, pas une période)
**Fichier de documentation** : `gestion-dossiers-etudiant.md`

**Description** : Cycle de vie des dossiers de mémoire avec différentes étapes.

**Étapes** :
- `CHOIX_SUJET` - Choix du sujet
- `VALIDATION_SUJET` - Validation par la commission
- `EN_COURS_REDACTION` - Rédaction en cours
- `DEPOT_INTERMEDIAIRE` - Dépôt intermédiaire
- `DEPOT_FINAL` - Dépôt final
- `SOUTENANCE` - Soutenance
- `TERMINE` - Terminé

**Note** : Ce sont des étapes dans le cycle de vie d'un dossier, pas des périodes globales à gérer.

---

## Périodes à Gérer dans la Page "Périodes"

### Périodes principales (à gérer activement) :

1. ✅ **Années Académiques** - Cycle principal
2. ✅ **Sessions de Soutenance** - Périodes pour les soutenances
3. ⭐ **Périodes de Validation** - Validation sujets/corrections (NOUVEAU)

### Informations contextuelles (affichage uniquement) :

4. **Disponibilités Professeurs** - Liées aux sessions (info dans la vue d'ensemble)

---

## Design de la Page "Périodes"

### Structure proposée :

```
┌─────────────────────────────────────────────────────────┐
│  Gestion des Périodes                                   │
│  Gérez les cycles académiques, sessions et périodes     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  [Vue d'ensemble] [Années] [Sessions] [Validations]    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Vue d'ensemble                                         │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                  │
│  │Année │ │Sess. │ │Valid.│ │Total │                  │
│  │Active│ │Ouvert│ │Active│ │Années│                  │
│  └──────┘ └──────┘ └──────┘ └──────┘                  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Années Académiques                                     │
│  [Créer]                                                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│  │2024-2025 │ │2025-2026 │ │2026-2027 │              │
│  │[Active]  │ │[Activer] │ │[Activer] │              │
│  └──────────┘ └──────────┘ └──────────┘              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Sessions de Soutenance                                 │
│  [Créer]                                                │
│  ┌──────────────────────────────────────┐              │
│  │ Session Juin 2025 [Ouverte]          │              │
│  │ 10 jours programmés                   │              │
│  │ [Fermer]                             │              │
│  └──────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  Périodes de Validation                                 │
│  [Créer]                                                │
│  ┌──────────────────┐ ┌──────────────────┐            │
│  │ Validation Sujets│ │ Validation Corr. │            │
│  │ 15/01 - 15/02    │ │ 01/06 - 01/07    │            │
│  │ [Active]         │ │ [Activer]        │            │
│  └──────────────────┘ └──────────────────┘            │
│                                                        │
│  ⚠️ Les deux périodes ne peuvent pas être actives      │
│     simultanément                                      │
└─────────────────────────────────────────────────────────┘
```

---

## Règles Métier Importantes

### 1. Années Académiques
- ✅ Une seule année active à la fois
- ✅ Activation désactive automatiquement les autres
- ✅ Clôture irréversible

### 2. Sessions de Soutenance
- ✅ Une seule session ouverte par année à la fois
- ✅ Workflow : PLANIFIEE → OUVERTE → FERMEE (pas de retour)
- ✅ Liées à une année académique active

### 3. Périodes de Validation
- ⭐ **Mutuellement exclusives** : Une seule période active à la fois
- ⭐ Les deux types (sujets/corrections) ne peuvent pas être actifs simultanément
- ⭐ Activation d'un type désactive automatiquement l'autre
- ⭐ Contrôlent l'affichage des onglets dans l'espace commission

---

## Implémentation

### Composants nécessaires :
- ✅ Tabs pour navigation entre les sections
- ✅ Cards pour afficher les périodes
- ✅ Badges pour les statuts
- ✅ Modals pour créer/modifier
- ✅ Statistiques dans la vue d'ensemble

### Fonctions à implémenter :
- ✅ Gestion des années académiques (déjà fait)
- ✅ Gestion des sessions (déjà fait)
- ⭐ Gestion des périodes de validation (NOUVEAU)
  - Créer une période
  - Activer/Désactiver une période
  - Vérifier l'exclusivité mutuelle

---

## Notes Finales

La page "Périodes" doit permettre de gérer :
1. **Années Académiques** - Cycle principal ✅
2. **Sessions de Soutenance** - Pour les soutenances ✅
3. **Périodes de Validation** - Pour la commission ⭐ (NOUVEAU)

Les autres éléments (pré-lecture, encadrements, étapes de dossiers) sont des processus ou relations liés à ces périodes, mais ne nécessitent pas de gestion directe dans cette page.

