# Fonctionnalité : Activation et Clôture des Années Académiques

## Titre
Gestion du cycle de vie des années académiques par le chef de département

## But
Permettre au chef de département d'activer une nouvelle année académique et de clôturer l'année en cours, déclenchant ainsi la réinitialisation des rôles professeurs et la transition vers un nouveau cycle académique.

## Prérequis
- L'utilisateur doit être connecté avec le rôle `Chef de Département` (`user.estChef === true`)
- Au moins une année académique doit exister dans le système

## Préconditions
- Le chef de département accède à la page "Gestion des Périodes"
- Une seule année académique peut être active à la fois

## Postconditions

### Succès - Activation
- L'année académique sélectionnée passe au statut `estActive: true`
- Toutes les autres années académiques passent au statut `estActive: false`
- Les professeurs perdent leurs rôles temporaires (commission, jurie) de l'année précédente
- Le chef de département doit réattribuer les rôles pour la nouvelle année

### Succès - Clôture
- L'année académique active passe au statut `estActive: false`
- Aucune année n'est active (état transitoire)
- Les étudiants ne peuvent plus soumettre de dossiers
- Les professeurs ne peuvent plus modifier leurs disponibilités

### Échec
- Message d'erreur si l'année ne peut pas être activée/clôturée
- Confirmation requise avant toute action

## Scénario nominal

### Activation d'une année académique

1. Le chef accède à "Gestion des Périodes"
2. Il voit la liste des années académiques avec leurs statuts
3. Il identifie l'année à activer (future ou planifiée)
4. Il clique sur "Activer" pour cette année
5. Une modal de confirmation s'affiche :
   - "Êtes-vous sûr de vouloir activer cette année académique ?"
   - "Cela désactivera l'année actuelle"
6. Il confirme l'action
7. Le système :
   - Désactive toutes les années académiques
   - Active l'année sélectionnée
   - Supprime/désactive les attributions de rôles de l'année précédente
8. La page se recharge et affiche la nouvelle année active

### Clôture d'une année académique

1. Le chef accède à "Gestion des Périodes"
2. Il voit l'année académique active
3. Il clique sur "Clôturer" pour l'année active
4. Une modal de confirmation s'affiche :
   - "Êtes-vous sûr de vouloir clôturer cette année académique ?"
   - "Cette action est irréversible"
5. Il confirme l'action
6. Le système :
   - Désactive l'année académique
   - Ferme toutes les sessions de soutenance ouvertes
   - Archive les données de l'année
7. La page se recharge et affiche qu'aucune année n'est active

## Scénarios alternatifs / Erreurs

### A1 : Tentative d'activation d'une année déjà terminée
- **Condition** : La date de fin de l'année est dépassée
- **Résultat** : Le bouton "Activer" est désactivé avec un message explicatif

### A2 : Annulation de la confirmation
- **Condition** : L'utilisateur clique sur "Annuler" dans la modal
- **Résultat** : Aucune action n'est effectuée, retour à la liste

### A3 : Erreur API
- **Condition** : Le backend retourne une erreur
- **Résultat** : Message d'erreur affiché, aucun changement effectué

## Exigences fonctionnelles

### RF1 : Unicité de l'année active
- Une seule année académique peut être active à la fois
- L'activation d'une année désactive automatiquement les autres

### RF2 : Réinitialisation des rôles
- Lors de l'activation d'une nouvelle année, tous les rôles professeurs (commission, jurie) sont désactivés
- Le chef doit réattribuer les rôles pour la nouvelle année

### RF3 : Confirmation obligatoire
- Toute action d'activation ou clôture nécessite une confirmation explicite
- Le message de confirmation doit indiquer les conséquences de l'action

### RF4 : Affichage visuel
- L'année active doit être clairement identifiable (bordure bleue, badge "Active")
- Les années passées, actuelle et futures doivent être distinguées visuellement

## Exigences non-fonctionnelles

### NFR1 : Sécurité
- Seul le chef de département peut activer/clôturer une année académique
- Validation côté backend de l'autorisation

### NFR2 : Traçabilité
- Toutes les actions d'activation/clôture doivent être loggées
- Historique des changements d'année académique

### NFR3 : Performance
- L'activation/clôture doit se faire en moins de 2 secondes
- Rechargement de la page après action

## Flow (Steps)

```
1. Accès "Gestion des Périodes"
2. Affichage liste années académiques
3. Sélection action (Activer/Clôturer)
4. Confirmation utilisateur
5. Appel API
   5.1. Désactivation années existantes
   5.2. Activation/Clôture année cible
   5.3. Réinitialisation rôles (si activation)
6. Rechargement page
7. Affichage résultat
```

## Données (Modèles utilisés)

### AnneeAcademique
```typescript
interface AnneeAcademique {
  idAnnee: number;
  code: string; // "2024-2025"
  libelle: string;
  dateDebut: Date;
  dateFin: Date;
  estActive: boolean;
}
```

## Impact API (Endpoints)

### Endpoints requis

1. **GET /api/departement/annees-academiques**
   - Retourne la liste de toutes les années académiques
   - Response: `AnneeAcademique[]`

2. **POST /api/departement/annees-academiques/:id/activer**
   - Active une année académique
   - Désactive automatiquement les autres
   - Réinitialise les rôles professeurs
   - Response: `{ success: boolean, message: string }`

3. **POST /api/departement/annees-academiques/:id/cloturer**
   - Clôture une année académique
   - Ferme les sessions de soutenance
   - Response: `{ success: boolean, message: string }`

4. **POST /api/departement/annees-academiques**
   - Crée une nouvelle année académique
   - Body: `Omit<AnneeAcademique, 'idAnnee'>`
   - Response: `AnneeAcademique`

## Tests recommandés

### Tests unitaires
- [ ] Vérifier qu'une seule année peut être active
- [ ] Vérifier la désactivation des rôles lors de l'activation
- [ ] Vérifier les validations de dates

### Tests d'intégration
- [ ] Activer une année et vérifier la désactivation des autres
- [ ] Clôturer une année et vérifier la fermeture des sessions
- [ ] Vérifier les confirmations utilisateur

### Tests E2E
- [ ] Parcours complet d'activation d'une nouvelle année
- [ ] Parcours complet de clôture d'une année
- [ ] Vérifier les messages d'erreur

## Notes et TODOs

- [ ] Implémenter les notifications pour les professeurs lors du changement d'année
- [ ] Ajouter un historique des activations/clôtures
- [ ] Implémenter l'archivage automatique des données de l'année clôturée
- [ ] Ajouter des statistiques sur l'année académique (nombre de soutenances, dossiers, etc.)

## Fichiers créés/modifiés

- `frontend/src/models/services/AnneeAcademique.ts` - Modèle TypeScript
- `frontend/src/mocks/models/AnneeAcademique.mock.ts` - Données mock
- `frontend/src/hooks/useAnneesAcademiques.ts` - Hooks personnalisés
- `frontend/src/pages/departement/departement/PeriodesChef.tsx` - Page UI
- `frontend/docs/features/activation-annee-academique.md` - Cette documentation

**Date de création** : 2025-11-27
