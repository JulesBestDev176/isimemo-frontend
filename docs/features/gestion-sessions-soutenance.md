# Fonctionnalité : Gestion des Sessions de Soutenance

## Titre
Création, ouverture et fermeture des sessions de soutenance par le chef de département

## But
Permettre au chef de département de gérer le cycle de vie des sessions de soutenance : création avec dates spécifiques, ouverture pour collecte des disponibilités professeurs, et fermeture pour planification.

## Prérequis
- L'utilisateur doit être connecté avec le rôle `Chef de Département`
- Une année académique doit être active
- Les professeurs doivent être disponibles pour renseigner leurs disponibilités

## Préconditions
- Le chef accède à la page "Gestion des Périodes"
- L'année académique active est affichée

## Postconditions

### Succès - Création
- Une nouvelle session est créée avec le statut `PLANIFIEE`
- La session contient les jours spécifiques sélectionnés
- La session est visible dans la liste

### Succès - Ouverture
- La session passe au statut `OUVERTE`
- Les professeurs reçoivent une notification (TODO)
- Les professeurs peuvent renseigner leurs disponibilités
- La date d'ouverture est enregistrée

### Succès - Fermeture
- La session passe au statut `FERMEE`
- Les professeurs ne peuvent plus modifier leurs disponibilités
- La date de fermeture est enregistrée
- Le système peut générer le planning des soutenances

## Scénario nominal

### Création d'une session

1. Le chef accède à "Gestion des Périodes"
2. Il voit la section "Sessions de Soutenance" pour l'année active
3. Il clique sur "Nouvelle Session"
4. Une modal s'affiche avec un formulaire :
   - Nom de la session (ex: "Session Juin 2025")
   - Sélection des jours spécifiques (calendrier multi-dates)
   - Année académique (pré-remplie)
5. Il remplit le formulaire et valide
6. Le système crée la session avec le statut `PLANIFIEE`
7. La session apparaît dans la liste

### Ouverture d'une session

1. Le chef voit une session au statut `PLANIFIEE`
2. Il clique sur "Ouvrir" pour cette session
3. Une modal de confirmation s'affiche :
   - "Les professeurs seront notifiés pour renseigner leurs disponibilités"
4. Il confirme l'action
5. Le système :
   - Change le statut à `OUVERTE`
   - Enregistre la date d'ouverture
   - Envoie des notifications aux professeurs (TODO)
6. La session affiche le statut "Ouverte" avec badge vert

### Fermeture d'une session

1. Le chef voit une session au statut `OUVERTE`
2. Il clique sur "Fermer" pour cette session
3. Une modal de confirmation s'affiche :
   - "Les professeurs ne pourront plus modifier leurs disponibilités"
4. Il confirme l'action
5. Le système :
   - Change le statut à `FERMEE`
   - Enregistre la date de fermeture
   - Verrouille les disponibilités professeurs
6. La session affiche le statut "Fermée" avec badge rouge

## Scénarios alternatifs / Erreurs

### A1 : Aucune année académique active
- **Condition** : Aucune année n'est active
- **Résultat** : Message d'information "Veuillez activer une année académique"

### A2 : Session sans jours sélectionnés
- **Condition** : L'utilisateur ne sélectionne aucun jour
- **Résultat** : Validation échoue, message "Veuillez sélectionner au moins un jour"

### A3 : Tentative d'ouverture d'une session déjà ouverte
- **Condition** : Une autre session est déjà ouverte pour la même année
- **Résultat** : Message d'avertissement "Une session est déjà ouverte"

### A4 : Annulation de confirmation
- **Condition** : L'utilisateur clique sur "Annuler"
- **Résultat** : Aucune action, retour à la liste

## Exigences fonctionnelles

### RF1 : Une seule session ouverte par année
- Une seule session peut être au statut `OUVERTE` pour une année académique donnée
- L'ouverture d'une nouvelle session ferme automatiquement la précédente (optionnel)

### RF2 : Workflow de statuts
- `PLANIFIEE` → `OUVERTE` → `FERMEE`
- Pas de retour en arrière possible

### RF3 : Notification professeurs
- Lors de l'ouverture, tous les professeurs avec rôle `estJurie` reçoivent une notification
- La notification contient les dates de la session

### RF4 : Jours spécifiques
- La session contient une liste de jours précis (pas de plage continue)
- Les professeurs renseignent leurs disponibilités pour ces jours uniquement

## Exigences non-fonctionnelles

### NFR1 : Sécurité
- Seul le chef de département peut créer/ouvrir/fermer une session
- Validation côté backend

### NFR2 : Traçabilité
- Toutes les actions sont loggées avec date et auteur
- Historique des changements de statut

### NFR3 : Performance
- Création/ouverture/fermeture en moins de 2 secondes
- Notifications envoyées de manière asynchrone

## Flow (Steps)

```
1. Accès "Gestion des Périodes"
2. Sélection action (Créer/Ouvrir/Fermer)
3. Remplissage formulaire (si création)
4. Confirmation utilisateur
5. Appel API
   5.1. Validation données
   5.2. Changement statut
   5.3. Envoi notifications (si ouverture)
6. Rechargement page
7. Affichage résultat
```

## Données (Modèles utilisés)

### SessionSoutenance
```typescript
interface SessionSoutenance {
  idSession: number;
  nom: string;
  anneeAcademique: string;
  joursSession: Date[];
  statut: StatutSession; // PLANIFIEE | OUVERTE | FERMEE
  dateCreation: Date;
  dateOuverture?: Date;
  dateFermeture?: Date;
  creePar: number; // idChefDepartement
}
```

### DisponibiliteJury (référence)
```typescript
interface DisponibiliteJury {
  professeurId: number;
  sessionId: number;
  joursDisponibles: {
    date: Date;
    creneaux: { heureDebut: string, heureFin: string }[];
  }[];
}
```

## Impact API (Endpoints)

### Endpoints requis

1. **GET /api/departement/sessions-soutenance**
   - Retourne toutes les sessions
   - Query params: `?anneeAcademique=2024-2025`
   - Response: `SessionSoutenance[]`

2. **POST /api/departement/sessions-soutenance**
   - Crée une nouvelle session
   - Body: `Omit<SessionSoutenance, 'idSession' | 'dateCreation'>`
   - Response: `SessionSoutenance`

3. **POST /api/departement/sessions-soutenance/:id/ouvrir**
   - Ouvre une session
   - Envoie notifications aux professeurs
   - Response: `{ success: boolean, message: string }`

4. **POST /api/departement/sessions-soutenance/:id/fermer**
   - Ferme une session
   - Verrouille les disponibilités
   - Response: `{ success: boolean, message: string }`

5. **PUT /api/departement/sessions-soutenance/:id**
   - Modifie une session (nom, jours)
   - Possible uniquement si statut = PLANIFIEE
   - Body: `Partial<SessionSoutenance>`
   - Response: `SessionSoutenance`

## Tests recommandés

### Tests unitaires
- [ ] Vérifier le workflow de statuts
- [ ] Vérifier qu'une seule session peut être ouverte
- [ ] Vérifier la validation des jours

### Tests d'intégration
- [ ] Créer une session et vérifier son apparition
- [ ] Ouvrir une session et vérifier le changement de statut
- [ ] Fermer une session et vérifier le verrouillage

### Tests E2E
- [ ] Parcours complet de création → ouverture → fermeture
- [ ] Vérifier les notifications professeurs
- [ ] Vérifier les messages de confirmation

## Notes et TODOs

- [ ] Implémenter les notifications par email aux professeurs
- [ ] Ajouter la possibilité de modifier les jours d'une session planifiée
- [ ] Implémenter la suppression d'une session planifiée
- [ ] Ajouter des statistiques (nombre de professeurs ayant renseigné leurs disponibilités)
- [ ] Implémenter l'export du calendrier (iCal, PDF)

## Fichiers créés/modifiés

- `frontend/src/models/services/SessionSoutenance.ts` - Modèle TypeScript
- `frontend/src/mocks/models/SessionSoutenance.mock.ts` - Données mock
- `frontend/src/hooks/useSessionsSoutenance.ts` - Hooks personnalisés
- `frontend/src/pages/departement/departement/PeriodesChef.tsx` - Page UI
- `frontend/docs/features/gestion-sessions-soutenance.md` - Cette documentation

**Date de création** : 2025-11-27
