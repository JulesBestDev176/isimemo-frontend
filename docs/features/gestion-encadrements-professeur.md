# Fonctionnalité : Gestion des Demandes d'Encadrement Professeur

## Titre
Gestion des demandes d'encadrement pour les professeurs

## But
Permettre aux professeurs de consulter et gérer les demandes d'encadrement des étudiants pour l'année académique en cours.

## Prérequis
- L'utilisateur doit être authentifié avec le rôle `professeur`
- L'utilisateur doit avoir un ID professeur valide
- Le modèle `DemandeEncadrement` doit être disponible

## Préconditions
- Le professeur est connecté à l'application
- Le professeur accède à la page via le menu "Encadrements"
- Les données des demandes sont disponibles (via mocks ou API)

## Postconditions
### Succès
- Le professeur peut voir toutes ses demandes d'encadrement de l'année en cours
- Le professeur peut accepter ou refuser une demande en attente

### Échec
- Message d'erreur si les données ne peuvent pas être chargées
- Redirection vers la page de connexion si non authentifié

## Scénario nominal

### 1. Consultation des demandes d'encadrement
1. Le professeur clique sur "Encadrements" dans le menu
2. Le système affiche uniquement les demandes de l'année académique actuelle
3. Un badge indique l'année académique filtrée
4. Le professeur voit le nombre de demandes en attente dans l'en-tête
5. Les demandes sont affichées avec :
   - Numéro de demande
   - Statut (En attente, Acceptée, Refusée, Annulée)
   - Date de demande
   - Informations du candidat
   - Titre du mémoire
   - Motif de refus (si applicable)

### 2. Acceptation d'une demande
1. Le professeur identifie une demande "En attente"
2. Le professeur clique sur le bouton "Accepter" (Bleu/Primary)
3. Le système enregistre l'acceptation
4. Le statut de la demande passe à "Acceptée"

### 3. Refus d'une demande
1. Le professeur identifie une demande "En attente"
2. Le professeur clique sur le bouton "Refuser" (Gris/Neutre)
3. Une modale s'ouvre demandant le motif du refus
4. Le professeur saisit le motif (obligatoire)
5. Le professeur clique sur "Confirmer le refus"
6. Le système enregistre le refus avec le motif
7. Le statut de la demande passe à "Refusée"
8. Le motif est affiché dans la carte de la demande

## Scénarios alternatifs / Erreurs

### A1 : Aucune demande pour l'année en cours
- **Condition** : Aucune demande d'encadrement pour l'année académique actuelle
- **Résultat** : Message "Aucune demande d'encadrement" avec texte explicatif

### A2 : Refus sans motif
- **Condition** : Le professeur tente de refuser sans saisir de motif
- **Résultat** : Le bouton "Confirmer le refus" reste désactivé

### A3 : Filtres sans résultat
- **Condition** : Les filtres appliqués ne retournent aucun résultat
- **Résultat** : Message "Aucune demande ne correspond à vos critères"

## Exigences fonctionnelles


### NFR1 : Performance
- La page doit se charger en moins de 2 secondes
- Les filtres doivent être réactifs (< 100ms)

### NFR2 : Accessibilité
- Contraste des couleurs conforme WCAG 2.1 niveau AA
- Navigation au clavier possible
- Labels ARIA pour les éléments interactifs

### NFR3 : Design
- Palette de couleurs limitée à 3-4 couleurs (bleu bic + neutres)
- Design sobre et professionnel
- Responsive (mobile, tablette, desktop)

### NFR4 : UX
- Animations fluides pour les transitions
- Feedback visuel immédiat sur les actions
- Messages d'erreur clairs et explicites

## Flow (Steps)

```
1. Connexion professeur
2. Navigation vers "Encadrements"
3. Affichage des demandes de l'année en cours
   3.1. Filtrage automatique année académique actuelle
   3.2. Affichage des demandes
   3.3. Actions : Accepter / Refuser
```

## Use Case

**Actor** : Professeur

**Trigger** : Le professeur souhaite gérer ses demandes d'encadrement

**Preconditions** :
- Le professeur est authentifié
- Le professeur a accès au menu "Encadrements"

**Main Flow** :
1. Le professeur accède à la page "Encadrements"
2. Le système affiche les demandes de l'année en cours
3. Le professeur consulte les demandes
4. Le professeur accepte ou refuse une demande

**Postconditions** :
- Les demandes sont traitées (acceptées/refusées)

## Données (Modèles utilisés)

### DemandeEncadrement
```typescript
interface DemandeEncadrement {
  idDemande: number;
  dateDemande: Date;
  dateReponse?: Date;
  statut: StatutDemandeEncadrement; // EN_ATTENTE, ACCEPTEE, REFUSEE, ANNULEE
  motifRefus?: string;
  anneeAcademique: string;
  candidat?: Candidat;
  professeur?: Professeur;
  dossierMemoire?: DossierMemoire;
}
```

### Encadrement
```typescript
interface Encadrement {
  idEncadrement: number;
  dateDebut: Date;
  dateFin?: Date;
  statut: StatutEncadrement; // ACTIF, TERMINE, ANNULE
  anneeAcademique: string;
  professeur?: Professeur;
  dossierMemoire?: DossierMemoire;
  messages?: Message[];
  tickets?: Ticket[];
}
```

## Impact API (Endpoints)

### Endpoints requis

#### Demandes d'encadrement
- `GET /api/professeurs/{id}/demandes-encadrement?annee={anneeAcademique}` - Liste des demandes filtrées
- `PUT /api/demandes-encadrement/{id}/accepter` - Accepter une demande
- `PUT /api/demandes-encadrement/{id}/refuser` - Refuser une demande avec motif
  - Body: `{ motifRefus: string }`

#### Encadrements
- `GET /api/professeurs/{id}/encadrements` - Liste de tous les encadrements
- `GET /api/encadrements/{id}` - Détails d'un encadrement spécifique

### Format des réponses

**Liste des demandes** :
```json
[
  {
    "idDemande": 1,
    "dateDemande": "2025-09-15T00:00:00Z",
    "statut": "EN_ATTENTE",
    "anneeAcademique": "2025-2026",
    "candidat": {
      "id": 1,
      "nom": "Dupont",
      "prenom": "Jean",
      "email": "jean.dupont@isi.sn"
    },
    "dossierMemoire": {
      "id": 1,
      "titre": "Intelligence Artificielle et Big Data"
    }
  }
]
```

## Tests recommandés

### Tests unitaires
- [ ] Fonction `getCurrentAnneeAcademique()` retourne l'année correcte
- [ ] Filtrage des demandes par année académique
- [ ] Groupement des encadrements par année
- [ ] Badges de statut affichent les bonnes variantes

### Tests d'intégration
- [ ] Navigation entre les onglets
- [ ] Acceptation d'une demande
- [ ] Refus d'une demande avec motif
- [ ] Navigation vers la page de détail
- [ ] Retour depuis la page de détail

### Tests E2E
- [ ] Scénario complet : connexion → consultation → acceptation → détails
- [ ] Scénario de refus avec motif
- [ ] Filtres et recherche fonctionnent correctement
- [ ] Responsive sur mobile/tablette/desktop

## Notes / TO-DOs

### Implémentation actuelle (Mocks)
- ✅ Modèles TypeScript créés
- ✅ Mocks de données disponibles
- ✅ Interfaces UI complètes
- ✅ Navigation fonctionnelle
- ✅ Palette de couleurs simplifiée (3 couleurs)

### À faire (Intégration API)
- [ ] Remplacer les mocks par des appels API réels
- [ ] Implémenter les mutations (accepter, refuser)
- [ ] Ajouter la gestion d'erreurs réseau
- [ ] Ajouter des toasts de confirmation
- [ ] Implémenter le rafraîchissement automatique après action
- [ ] Ajouter la pagination si nécessaire
- [ ] Optimiser les requêtes avec cache/invalidation

### Améliorations futures
- [ ] Notifications en temps réel pour nouvelles demandes
- [ ] Export PDF de la liste des encadrements
- [ ] Statistiques d'encadrement par année
- [ ] Historique des actions (acceptations/refus)
- [ ] Messagerie intégrée avec les candidats

---

**Fichiers concernés** :
- `frontend/src/pages/professeur/Encadrements.tsx` - Page principale
- `frontend/src/pages/professeur/EncadrementDetail.tsx` - Page de détail
- `frontend/src/models/dossier/DemandeEncadrement.ts` - Modèle demandes
- `frontend/src/models/dossier/Encadrement.ts` - Modèle encadrements
- `frontend/src/App.tsx` - Routes
- `frontend/src/components/admin/Sidebar.tsx` - Menu navigation

**Date de création** : 2025-11-22
**Version** : 1.0
