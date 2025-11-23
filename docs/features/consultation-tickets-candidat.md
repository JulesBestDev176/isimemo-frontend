# Fonctionnalité : Consultation des Tickets par le Candidat

## Titre
Consultation et suivi des tickets par le candidat avec organisation par onglets

## But
Permettre au candidat de consulter et suivre l'avancement de ses tickets de suivi, organisés par phase (À faire, En cours, En révision, Terminés), avec possibilité de consulter le détail de chaque ticket.

## Prérequis
- L'utilisateur doit être authentifié.
- L'utilisateur doit être un candidat (`user?.estCandidat === true`).
- Le candidat doit avoir un encadrement actif.
- Des tickets doivent être associés à l'encadrement du candidat.

## Conditions / Préconditions
- Un encadrement actif existe pour le candidat connecté.
- Le candidat est associé à cet encadrement via `Encadrement.dossierMemoire.candidats`.
- Les tickets sont associés à l'encadrement.

## Postconditions
- Le candidat visualise ses tickets organisés par phase dans des onglets.
- Le candidat peut consulter le détail de chaque ticket.
- Les tickets sont filtrés et affichés selon leur phase actuelle.

## Scénario nominal (pas à pas)

1. Le candidat accède à la page "Mes Tickets" (`/candidat/tickets`).
2. Le système vérifie que l'utilisateur est un candidat.
3. Le système récupère l'encadrement actif du candidat.
4. Le système récupère tous les tickets associés à cet encadrement.
5. La page affiche 4 onglets :
   - **À faire** : Tickets avec phase `OUVERT`
   - **En cours** : Tickets avec phase `EN_COURS`
   - **En révision** : Tickets avec phase `EN_REVISION`
   - **Terminés** : Tickets avec phase `RESOLU` ou `FERME`
6. Chaque onglet affiche le nombre de tickets correspondants.
7. Le candidat clique sur un onglet pour voir les tickets de cette phase.
8. Chaque ticket affiche :
   - Titre et description (tronquée)
   - Phase actuelle (badge coloré)
   - Priorité (badge coloré)
   - Barre de progression
   - Dates (création, échéance)
   - Bouton "Voir le détail"
9. Le candidat clique sur "Voir le détail" ou sur le ticket lui-même.
10. Une modal s'ouvre avec les détails complets du ticket :
    - Titre et description complète
    - Phase et priorité
    - Dates (création, échéance)
    - Progression détaillée
    - Liste des livrables associés (si présents)
11. Le candidat ferme la modal en cliquant sur "Fermer" ou en cliquant en dehors.

## Scénarios alternatifs / Erreurs

### Scénario alternatif 1 : Utilisateur non candidat
- Si l'utilisateur n'est pas un candidat, un message "Accès non autorisé" s'affiche.

### Scénario alternatif 2 : Aucun encadrement actif
- Si le candidat n'a pas d'encadrement actif, aucun ticket n'est affiché.
- Un message "Aucun ticket disponible" s'affiche dans chaque onglet.

### Scénario alternatif 3 : Aucun ticket dans une catégorie
- Si un onglet ne contient aucun ticket, un message "Aucun ticket dans cette catégorie" s'affiche.

### Scénario alternatif 4 : Ticket sans échéance
- Si un ticket n'a pas de date d'échéance, seule la date de création est affichée.

### Scénario alternatif 5 : Ticket sans livrables
- Si un ticket n'a pas de livrables associés, la section "Livrables" n'est pas affichée dans la modal.

## Exigences fonctionnelles

### EF1 : Organisation par onglets
- Les tickets sont organisés en 4 onglets selon leur phase :
  - **À faire** : Phase `A_FAIRE`
  - **En cours** : Phase `EN_COURS`
  - **En révision** : Phase `EN_REVISION`
  - **Terminés** : Phase `TERMINE`

### EF2 : Compteurs par onglet
- Chaque onglet affiche le nombre de tickets correspondants dans un badge.

### EF3 : Affichage des tickets
- Chaque ticket affiche :
  - Titre et description (tronquée à 2 lignes)
  - Phase avec badge coloré
  - Priorité avec badge coloré
  - Barre de progression avec pourcentage
  - Dates de création et échéance (si présente)
  - Bouton "Voir le détail"

### EF4 : Consultation détaillée
- Le candidat peut consulter le détail d'un ticket via :
  - Clic sur le bouton "Voir le détail"
  - Clic sur le ticket lui-même
- La modal affiche :
  - Titre et description complète
  - Phase et priorité
  - Dates (création, échéance)
  - Progression détaillée avec barre
  - Liste des livrables avec statut (si présents)

### EF5 : Couleurs selon la phase
- Les badges de phase utilisent des couleurs spécifiques :
  - A_FAIRE : Gris
  - EN_COURS : Bleu
  - EN_REVISION : Orange
  - TERMINE : Vert

### EF6 : Barre de progression colorée
- La barre de progression change de couleur selon la phase :
  - EN_REVISION : Orange
  - TERMINE : Vert
  - Autres : Bleu (couleur primaire)

### EF7 : Bordure des tickets
- Les tickets EN_COURS ont une bordure bleue et une ombre.
- Les tickets EN_REVISION ont une bordure orange.
- Les autres tickets ont une bordure grise.

## Exigences non-fonctionnelles

### ENF1 : Performance
- Le chargement des tickets doit être rapide (< 200ms).
- Les transitions entre onglets doivent être fluides.

### ENF2 : Accessibilité
- Les badges doivent avoir un contraste suffisant.
- Les boutons doivent être accessibles au clavier.
- La modal doit être fermable avec la touche Échap.

### ENF3 : UX
- L'interface doit être claire et intuitive.
- Les couleurs doivent être cohérentes avec le reste de l'application.
- Les animations doivent être subtiles et non intrusives.

## Flow (Steps)

```
1. Accès à la page /candidat/tickets
2. Vérification que l'utilisateur est un candidat
3. Récupération de l'encadrement actif via getEncadrementActifByCandidat()
4. Récupération des tickets via getTicketsByEncadrement()
5. Filtrage des tickets par phase selon l'onglet actif
6. Affichage des tickets dans l'onglet sélectionné
7. Clic sur un ticket ou "Voir le détail"
8. Ouverture de la modal avec les détails
9. Consultation des informations
10. Fermeture de la modal
```

## Use Case

**Acteur** : Candidat

**Trigger** : Le candidat accède à la page "Mes Tickets" depuis le menu ou le dashboard.

**Objectif** : Consulter et suivre l'avancement de ses tickets de suivi.

**Résultat** : Affichage des tickets organisés par phase, avec possibilité de consulter le détail de chaque ticket.

## Données (Modèles utilisés)

### Ticket
```typescript
interface Ticket {
  idTicket: number;
  titre: string;
  description: string;
  priorite: Priorite;
  dateCreation: Date;
  dateEcheance?: Date;
  statut: StatutTicket;
  phase: PhaseTicket;
  progression: number;
  encadrement?: Encadrement;
  livrables?: Livrable[];
}
```

### PhaseTicket (enum)
```typescript
enum PhaseTicket {
  A_FAIRE = 'A_FAIRE',
  EN_COURS = 'EN_COURS',
  EN_REVISION = 'EN_REVISION',
  TERMINE = 'TERMINE'
}
```

### Priorite (enum)
```typescript
enum Priorite {
  BASSE = 'BASSE',
  MOYENNE = 'MOYENNE',
  HAUTE = 'HAUTE',
  URGENTE = 'URGENTE'
}
```

### Livrable
```typescript
interface Livrable {
  idLivrable: string;
  nomFichier: string;
  cheminFichier: string;
  typeDocument: TypeDocument;
  dateSubmission: Date;
  statut: StatutLivrable;
  version: number;
  feedback?: string;
  ticket?: Ticket;
}
```

## Impact API (Endpoints)

### GET /api/candidat/tickets
- Récupère tous les tickets associés à l'encadrement actif du candidat.
- Retourne les tickets triés par phase.

### GET /api/tickets/{idTicket}
- Récupère les détails d'un ticket spécifique.
- Inclut les livrables associés.

### GET /api/candidat/encadrement/actif
- Récupère l'encadrement actif du candidat connecté.

## Tests recommandés

### Tests unitaires
1. Test de `getEncadrementActifByCandidat()` : Vérifie qu'un encadrement actif est trouvé pour un candidat.
2. Test de `getTicketsByEncadrement()` : Vérifie le tri et le filtrage des tickets.
3. Test des helpers de couleur et label pour les phases.
4. Test du filtrage par phase selon l'onglet actif.

### Tests d'intégration
1. Test de l'affichage des tickets dans chaque onglet.
2. Test de l'ouverture et fermeture de la modal.
3. Test de la navigation entre les onglets.
4. Test de l'affichage des compteurs par onglet.

### Tests E2E
1. Scénario complet : Accès à la page, navigation entre onglets, consultation d'un ticket.
2. Scénario avec plusieurs tickets dans différentes phases.
3. Scénario avec un ticket sans échéance ni livrables.

## Notes / TO-DOs

- [ ] Ajouter la possibilité de filtrer les tickets par priorité.
- [ ] Ajouter la possibilité de rechercher dans les tickets.
- [ ] Ajouter la possibilité de trier les tickets (par date, priorité, progression).
- [ ] Implémenter les actions sur les tickets (déposer un livrable, répondre).
- [ ] Ajouter des notifications pour les nouveaux tickets ou changements de phase.

## Modifications apportées

### Fichiers créés
- `frontend/src/pages/candidat/Tickets.tsx` : Page de consultation des tickets avec onglets

### Fichiers modifiés
- `frontend/src/models/dossier/Encadrement.ts` : Ajout de `getEncadrementActifByCandidat()`
- `frontend/src/models/dossier/Ticket.ts` : Mise à jour des mock data basées sur les chapitres du mémoire
- `frontend/src/App.tsx` : Ajout de la route `/candidat/tickets`
- `frontend/src/components/admin/Sidebar.tsx` : Ajout du menu "Mes Tickets" pour les candidats

### Nouvelles fonctions
- `getEncadrementActifByCandidat(idCandidat)` : Récupère l'encadrement actif pour un candidat

### Mock Data
Les mock data des tickets sont organisées selon la structure du mémoire de référence (`Memoire_Final_Corrigé.pdf`) :
- **Chapitre I - Introduction Générale** : Tickets pour la rédaction de l'introduction, problématique, objectifs, etc.
- **Chapitre II - Etude et Réalisation** : Tickets pour la modélisation, les outils et technologies, la réalisation, les diagrammes UML
- **Chapitre III - Bilan** : Tickets pour les objectifs atteints, intérêts personnels, etc.

Chaque ticket correspond à une section ou sous-section du mémoire, permettant un suivi structuré de l'avancement de la rédaction.

