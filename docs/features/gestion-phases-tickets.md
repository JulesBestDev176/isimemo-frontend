# Fonctionnalité : Gestion des Phases de Tickets

## Titre
Gestion des phases de tickets avec règles métier strictes

## But
Permettre aux encadrants de suivre l'avancement des tickets de manière structurée, en respectant les règles métier : un seul ticket en cours à la fois, et impossibilité d'avancer si un ticket est en révision.

## Prérequis
- L'utilisateur doit être authentifié.
- L'utilisateur doit être un encadrant (`user?.estEncadrant === true`).
- L'encadrant doit avoir un encadrement actif.
- L'encadrant doit avoir accès au dossier étudiant concerné.

## Conditions / Préconditions
- Un encadrement actif existe pour l'encadrant connecté.
- Le dossier étudiant existe et est associé à l'encadrement.
- Les tickets sont associés à un encadrement spécifique.

## Postconditions
- Les tickets sont affichés avec leur phase actuelle.
- Les règles métier sont respectées (un seul ticket EN_COURS, pas d'avancement si EN_REVISION).
- L'interface affiche clairement les restrictions et les possibilités d'action.

## Scénario nominal (pas à pas)

1. L'encadrant accède à la page de détail d'un dossier étudiant.
2. L'encadrant clique sur l'onglet "Tickets".
3. Le système affiche tous les tickets associés à l'encadrement, triés par phase (EN_COURS en premier).
4. Si un ticket est EN_COURS, un message d'avertissement bleu s'affiche en haut de la liste.
5. Si un ticket est EN_REVISION, un message d'avertissement orange s'affiche en haut de la liste.
6. Chaque ticket affiche :
   - Son titre et description
   - Sa phase actuelle (avec badge coloré)
   - Sa priorité
   - Sa progression (barre de progression)
   - Ses dates (création, échéance)
   - Un message contextuel selon sa phase
7. Les tickets EN_COURS ont une bordure bleue et un badge "Ticket actif".
8. Les tickets EN_REVISION ont une bordure orange et un message d'avertissement.

## Scénarios alternatifs / Erreurs

### Scénario alternatif 1 : Aucun ticket
- Si aucun ticket n'existe pour l'encadrement, un message "Aucun ticket disponible" est affiché.

### Scénario alternatif 2 : Tentative de démarrer un nouveau ticket alors qu'un ticket est EN_COURS
- Le système empêche la création d'un nouveau ticket si un ticket est déjà EN_COURS.
- Un message d'avertissement informe l'encadrant qu'il doit d'abord résoudre le ticket en cours.

### Scénario alternatif 3 : Tentative d'avancer alors qu'un ticket est EN_REVISION
- Le système empêche l'avancement si un ticket est EN_REVISION.
- Un message d'avertissement informe que les tickets en révision doivent être résolus avant de pouvoir avancer.

## Exigences fonctionnelles

### EF1 : Phases de tickets
- Un ticket peut avoir les phases suivantes :
  - **A_FAIRE** : Ticket créé, en attente de prise en charge
  - **EN_COURS** : Ticket en cours de traitement
  - **EN_REVISION** : Livrable rejeté, retourné pour révision
  - **TERMINE** : Ticket terminé et validé

### EF2 : Règle métier - Un seul ticket EN_COURS
- Il ne peut y avoir qu'un seul ticket avec la phase EN_COURS à la fois pour un encadrement donné.
- La fonction `hasTicketEnCours(idEncadrement)` vérifie cette règle.

### EF3 : Règle métier - Un seul ticket EN_REVISION
- Il ne peut y avoir qu'un seul ticket avec la phase EN_REVISION à la fois pour un encadrement donné.
- La fonction `hasTicketEnRevision(idEncadrement)` vérifie cette règle.

### EF4 : Règle métier - Exclusion mutuelle EN_COURS et EN_REVISION
- Si un ticket est EN_REVISION, aucun ticket ne peut être EN_COURS.
- Si un ticket est EN_COURS, aucun ticket ne peut être EN_REVISION.
- La fonction `canDemarrerTicketEnCours(idEncadrement)` vérifie cette règle.

### EF5 : Affichage des phases
- Chaque ticket affiche sa phase avec un badge coloré :
  - A_FAIRE : Gris
  - EN_COURS : Bleu
  - EN_REVISION : Orange
  - TERMINE : Vert

### EF6 : Tri des tickets
- Les tickets sont triés par ordre de priorité des phases :
  1. EN_COURS
  2. EN_REVISION
  3. A_FAIRE
  4. TERMINE

### EF7 : Messages contextuels
- Un message d'avertissement bleu s'affiche si un ticket est EN_COURS.
- Un message d'avertissement orange s'affiche si un ticket est EN_REVISION.

## Exigences non-fonctionnelles

### ENF1 : Performance
- Le chargement des tickets doit être rapide (< 200ms).

### ENF2 : Accessibilité
- Les badges de phase doivent avoir un contraste suffisant.
- Les messages d'avertissement doivent être clairement visibles.

### ENF3 : UX
- L'interface doit clairement indiquer les restrictions et possibilités d'action.
- Les couleurs doivent être cohérentes avec le reste de l'application.

## Flow (Steps)

```
1. Accès à la page DossierEtudiantDetail
2. Clic sur l'onglet "Tickets"
3. Récupération des tickets via getTicketsByEncadrement()
4. Vérification de hasTicketEnCours()
5. Vérification des tickets EN_REVISION
6. Affichage des tickets triés par phase
7. Affichage des messages d'avertissement si nécessaire
8. Affichage des messages contextuels pour chaque ticket
```

## Use Case

**Acteur** : Encadrant

**Trigger** : L'encadrant accède à la page de détail d'un dossier étudiant et clique sur l'onglet "Tickets".

**Objectif** : Consulter l'état des tickets et comprendre les restrictions d'action.

**Résultat** : Affichage des tickets avec leurs phases, et messages d'avertissement si des restrictions s'appliquent.

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
  phase: PhaseTicket; // Phase actuelle du ticket dans le workflow
  progression: number;
  encadrement?: Encadrement;
  livrables?: Livrable[];
}
```

### StatutTicket (enum)
```typescript
enum StatutTicket {
  A_FAIRE = 'A_FAIRE', // Ticket créé, en attente de prise en charge
  EN_COURS = 'EN_COURS', // Ticket en cours de traitement
  EN_REVISION = 'EN_REVISION', // Ticket renvoyé en révision (livrable rejeté)
  TERMINE = 'TERMINE' // Ticket terminé et validé
}
```

### PhaseTicket (enum)
```typescript
enum PhaseTicket {
  A_FAIRE = 'A_FAIRE', // Ticket créé, en attente de prise en charge
  EN_COURS = 'EN_COURS', // Ticket en cours de traitement
  EN_REVISION = 'EN_REVISION', // Livrable rejeté, retourné pour révision
  TERMINE = 'TERMINE' // Ticket terminé et validé
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

## Impact API (Endpoints)

### GET /api/encadrements/{idEncadrement}/tickets
- Récupère tous les tickets associés à un encadrement.
- Retourne les tickets triés par phase.

### GET /api/tickets/{idTicket}
- Récupère les détails d'un ticket spécifique.

### POST /api/tickets
- Crée un nouveau ticket.
- **Validation** : Vérifie qu'aucun ticket n'est EN_COURS pour l'encadrement.

### PUT /api/tickets/{idTicket}/phase
- Met à jour la phase d'un ticket.
- **Validation** : Vérifie que le ticket peut être avancé (pas EN_REVISION, doit être RESOLU).

### GET /api/encadrements/{idEncadrement}/tickets/en-cours
- Vérifie s'il existe un ticket EN_COURS pour un encadrement.
- Retourne le ticket EN_COURS ou null.

## Tests recommandés

### Tests unitaires
1. Test de `hasTicketEnCours()` : Vérifie qu'un seul ticket EN_COURS peut exister.
2. Test de `canAvancerTicket()` : Vérifie qu'on ne peut avancer que si RESOLU.
3. Test de `getTicketsByEncadrement()` : Vérifie le tri par phase.
4. Test des helpers de couleur et label pour les phases.

### Tests d'intégration
1. Test de l'affichage des tickets avec différentes phases.
2. Test des messages d'avertissement selon l'état des tickets.
3. Test de la logique de restriction (un seul EN_COURS, pas d'avancement si EN_REVISION).

### Tests E2E
1. Scénario complet : Création d'un ticket, passage EN_COURS, tentative de créer un autre ticket (bloqué).
2. Scénario complet : Ticket EN_REVISION, tentative d'avancer (bloqué), résolution, puis avancement.

## Notes / TO-DOs

- [ ] Implémenter les actions de changement de phase (boutons dans l'UI).
- [ ] Ajouter un historique des changements de phase.
- [ ] Implémenter les notifications lors des changements de phase.
- [ ] Ajouter la possibilité de filtrer les tickets par phase.
- [ ] Ajouter la possibilité de rechercher dans les tickets.

## Modifications apportées

### Fichiers modifiés
- `frontend/src/models/dossier/Ticket.ts` : Ajout de `PhaseTicket`, `EN_REVISION`, logique métier, et mise à jour des mock data basées sur les chapitres du mémoire
- `frontend/src/pages/professeur/DossierEtudiantDetail.tsx` : Affichage des phases, messages d'avertissement

### Nouvelles fonctions
- `hasTicketEnCours(idEncadrement)` : Vérifie s'il existe un ticket EN_COURS
- `getTicketEnCours(idEncadrement)` : Récupère le ticket EN_COURS
- `hasTicketEnRevision(idEncadrement)` : Vérifie s'il existe un ticket EN_REVISION
- `getTicketEnRevision(idEncadrement)` : Récupère le ticket EN_REVISION
- `canDemarrerTicketEnCours(idEncadrement)` : Vérifie si on peut démarrer un nouveau ticket EN_COURS (vérifie aussi qu'aucun ticket n'est EN_REVISION)
- `canDemarrerTicketEnRevision(idEncadrement)` : Vérifie si on peut démarrer un nouveau ticket EN_REVISION
- `getTicketsByEncadrement(idEncadrement)` : Récupère et trie les tickets par phase

### Mock Data
Les mock data des tickets sont organisées selon la structure du mémoire de référence (`Memoire_Final_Corrigé.pdf`) :
- **Chapitre I - Introduction Générale** : Tickets pour la rédaction de l'introduction, problématique, objectifs, etc.
- **Chapitre II - Etude et Réalisation** : Tickets pour la modélisation, les outils et technologies, la réalisation, les diagrammes UML
- **Chapitre III - Bilan** : Tickets pour les objectifs atteints, intérêts personnels, etc.

Chaque ticket correspond à une section ou sous-section du mémoire, permettant un suivi structuré de l'avancement de la rédaction.

