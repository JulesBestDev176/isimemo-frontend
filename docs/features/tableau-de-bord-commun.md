# Fonctionnalité : Tableau de Bord (Dashboard) Commun

## Titre
Tableau de bord centralisé et adaptatif (Dashboard)

## But
Fournir un point d'entrée unique et personnalisé pour tous les utilisateurs (Étudiants, Professeurs, Admin), affichant les indicateurs clés (KPIs) et les actions rapides pertinentes selon leur rôle.

## Prérequis
- L'utilisateur doit être authentifié.
- Le contexte utilisateur (`AuthContext`) doit contenir le rôle et les permissions (ex: `estEncadrant`, `estJurie`).

## Vues par Rôle

### 1. Vue Étudiant
#### Indicateurs (KPIs)
- **Mes Dossiers** : Nombre de dossiers de mémoire actifs.
- **Documents déposés** : Nombre de livrables soumis.
- **Échéances** : Prochaines dates limites (soutenances, dépôts).
- **Tickets actifs** : (Si candidat) Nombre de tickets de suivi ouverts.

#### Actions Rapides
- **Candidat** : Lister les sujets, Consulter mon panel, Mes tickets, Documents administratifs.
- **Non-Candidat** : Mes Dossiers, Calendrier, Bibliothèque numérique, Assistant IA.

### 2. Vue Professeur
Le tableau de bord s'adapte dynamiquement aux multiples casquettes du professeur.

#### Indicateurs (KPIs)
- **Encadrement** (affichage conditionnel) :
  - Étudiants encadrés (Actifs) : **Affiche uniquement si le professeur a des encadrements actifs**.
  - Demandes d'encadrement (En attente) : **Affiche uniquement s'il y a des demandes en attente**.
  - *Note* : Si un professeur n'a pas encore d'encadrements actifs, ces cartes ne sont pas affichées.
- **Jury** :
  - Disponibilités (Statut session ouverte/fermée).
  - Soutenances assignées.
- **Commission** (si membre) :
  - Sujets à valider.
  - Mémoires à valider.
- **Cours** : **Supprimé** - Les informations relatives aux cours ne sont plus affichées.

#### Actions Rapides
- **Gérer les encadrements** : Accès direct à la liste des demandes et étudiants suivis.
- **Mes disponibilités** : Saisie des créneaux pour les sessions de soutenance.
- **Proposer un sujet** : Création de nouveaux sujets de mémoire.
- **Calendrier** : Vue des soutenances à venir.
- **Bibliothèque numérique** : Consultation des mémoires archivés.

### 3. Vue Chef de Département
- **KPIs** : Professeurs, Étudiants du département.
- **Actions** : Gestion des professeurs, Notifications.

## Scénario nominal

### 1. Connexion et Redirection
1. L'utilisateur se connecte.
2. Il est redirigé vers `/dashboard` (ou `/etudiant/dashboard`, `/professeur/dashboard` selon le routing).
3. Le système charge les statistiques (`getDashboardStats`).

### 2. Affichage Dynamique
1. Le composant `Dashboard` vérifie le type d'utilisateur.
2. Il génère les cartes de statistiques (KPIs) correspondantes.
3. Il génère les cartes d'actions rapides.
4. Les éléments s'affichent avec une animation (fade-in).

## Règles de Gestion
- **Unicité** : Un professeur peut avoir plusieurs rôles (Encadrant ET Jury). Le dashboard doit afficher les sections pour TOUS ses rôles actifs.
- **Priorité** : Les alertes (ex: Demandes en attente, Session ouverte) doivent être mises en évidence (badges, couleurs).
- **Affichage conditionnel des encadrements** : 
  - Les cartes "Étudiants encadrés" et "Demandes en attente" ne s'affichent que si le professeur a respectivement des encadrements actifs ou des demandes en attente.
  - Utilise `getEncadrementsActifs()` et `getDemandesEncadrementEnAttente()` pour déterminer l'affichage.
- **Suppression des cours** : 
  - Les informations relatives aux cours (cartes, activités récentes, événements calendrier) ne sont plus affichées.
  - Les actions rapides liées aux cours ont été supprimées ou modifiées.

## Données (Modèles utilisés)

### DashboardStats
```typescript
interface DashboardStats {
  dossiersCount: number;
  documentsCount: number;
  echeancesCount: number;
  // ... autres compteurs spécifiques
}
```

### User (Contexte)
```typescript
interface User {
  id: string;
  type: 'etudiant' | 'professeur' | 'admin';
  estEncadrant?: boolean;
  estJurie?: boolean;
  estCommission?: boolean;
  estChef?: boolean;
  // ...
}
```

### Encadrement (pour affichage conditionnel)
```typescript
import { getEncadrementsActifs } from '../../models/dossier/Encadrement';
import { getDemandesEncadrementEnAttente } from '../../models/dossier/DemandeEncadrement';

// Utilisation dans le dashboard :
const idProfesseur = user?.id ? parseInt(user.id) : 0;
const encadrementsActifs = idProfesseur > 0 ? getEncadrementsActifs(idProfesseur) : [];
const demandesEnAttente = idProfesseur > 0 ? getDemandesEncadrementEnAttente(idProfesseur) : [];
```

## Impact API (Endpoints)

### Endpoints requis
- `GET /api/dashboard/stats` - Récupère les compteurs globaux pour l'utilisateur connecté.
- `GET /api/notifications/recent` - Récupère les dernières notifications.

## Tests recommandés

### Tests d'intégration
- [ ] Vérifier que les cartes "Encadrement" s'affichent pour un prof encadrant **avec des encadrements actifs**.
- [ ] Vérifier que les cartes "Encadrement" **ne s'affichent pas** pour un prof encadrant **sans encadrements actifs**.
- [ ] Vérifier que les cartes "Jury" s'affichent pour un prof jury.
- [ ] Vérifier que les informations de cours ne sont plus affichées.
- [ ] Vérifier la navigation des actions rapides (clic -> redirection correcte).

### Tests E2E
- [ ] Connexion Étudiant -> Vérification Dashboard Étudiant.
- [ ] Connexion Professeur -> Vérification Dashboard Professeur complet.

---

**Fichiers concernés** :
- `frontend/src/pages/common/Dashboard.tsx`
- `frontend/src/pages/departement/commun/DashboardUnifie.tsx`
- `frontend/src/models/dashboard/index.ts` (ou équivalent)
- `frontend/src/models/dossier/Encadrement.ts` (pour `getEncadrementsActifs`)
- `frontend/src/models/dossier/DemandeEncadrement.ts` (pour `getDemandesEncadrementEnAttente`)

**Modifications récentes** :
- **2025-01-XX** : Affichage conditionnel des cartes d'encadrement (uniquement si encadrements actifs ou demandes en attente).
- **2025-01-XX** : Suppression des informations relatives aux cours (cartes, activités, événements calendrier).

**Date de mise à jour** : 2025-01-XX
