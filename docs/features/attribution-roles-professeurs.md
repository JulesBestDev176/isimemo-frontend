# Fonctionnalité : Attribution des Rôles aux Professeurs

## Titre
Gestion des rôles professeurs (Commission, Jury, Président) par le chef de département

## But
Permettre au chef de département d'attribuer et de retirer des rôles spécifiques aux professeurs pour l'année académique en cours : membre de commission, membre de jury, et possible président de jury.

## Prérequis
- L'utilisateur doit être connecté avec le rôle `Chef de Département`
- Une année académique doit être active
- Des professeurs doivent exister dans le système

## Préconditions
- Le chef accède à la page "Gestion des Rôles"
- L'année académique active est affichée
- La liste des professeurs est chargée

## Postconditions

### Succès - Attribution
- Le professeur reçoit le rôle pour l'année académique active
- Une entrée `AttributionRole` est créée avec `estActif: true`
- La date d'attribution est enregistrée
- Le professeur peut exercer les fonctions liées au rôle

### Succès - Retrait
- L'attribution du rôle est désactivée (`estActif: false`)
- La date de retrait est enregistrée
- Le professeur perd les fonctions liées au rôle

## Scénario nominal

### Attribution d'un rôle

1. Le chef accède à "Gestion des Rôles"
2. Il voit la liste des professeurs avec leurs rôles actuels
3. Il peut rechercher un professeur par nom, email ou spécialité
4. Il peut filtrer par type de rôle
5. Pour un professeur sans le rôle souhaité :
   - Il clique sur l'icône du rôle (Shield/Gavel/Award)
   - Une confirmation s'affiche
6. Il confirme l'attribution
7. Le système :
   - Crée une `AttributionRole` pour ce professeur
   - Enregistre la date d'attribution et l'auteur (chef)
8. Le rôle apparaît dans la colonne "Rôles Actuels" du professeur
9. L'icône du rôle change de couleur (gris → couleur active)

### Retrait d'un rôle

1. Le chef voit un professeur avec un rôle actif
2. Il clique sur l'icône colorée du rôle
3. Une confirmation s'affiche
4. Il confirme le retrait
5. Le système :
   - Désactive l'`AttributionRole` correspondante
   - Enregistre la date de retrait
6. Le rôle disparaît de la colonne "Rôles Actuels"
7. L'icône redevient grise

## Scénarios alternatifs / Erreurs

### A1 : Aucune année académique active
- **Condition** : Aucune année n'est active
- **Résultat** : Message "Veuillez activer une année académique"

### A2 : Professeur déjà avec le rôle
- **Condition** : Le professeur a déjà le rôle pour l'année en cours
- **Résultat** : L'icône est colorée, clic = retrait du rôle

### A3 : Annulation de confirmation
- **Condition** : L'utilisateur clique sur "Annuler"
- **Résultat** : Aucune action, retour à la liste

### A4 : Erreur API
- **Condition** : Le backend retourne une erreur
- **Résultat** : Message d'erreur, aucun changement

## Exigences fonctionnelles

### RF1 : Types de rôles
- **Commission** : Peut valider les sujets et documents corrigés
- **Jury** : Peut être membre d'un jury de soutenance
- **Président Possible** : Peut être désigné président d'un jury

### RF2 : Rôles par année académique
- Les rôles sont liés à une année académique spécifique
- Un professeur peut avoir plusieurs rôles simultanément
- Les rôles sont réinitialisés lors du changement d'année

### RF3 : Historique
- Toutes les attributions/retraits sont conservés
- L'historique permet de voir qui a attribué quel rôle et quand

### RF4 : Statistiques
- Affichage du nombre de professeurs par type de rôle
- Mise à jour en temps réel lors des attributions/retraits

## Exigences non-fonctionnelles

### NFR1 : Sécurité
- Seul le chef de département peut attribuer/retirer des rôles
- Validation côté backend de l'autorisation

### NFR2 : Traçabilité
- Toutes les actions sont loggées avec date, auteur et professeur concerné
- Audit trail complet des changements de rôles

### NFR3 : Performance
- Attribution/retrait en moins de 1 seconde
- Recherche et filtrage instantanés (côté client)

### NFR4 : Ergonomie
- Interface claire avec icônes distinctes par rôle
- Feedback visuel immédiat (changement de couleur)
- Confirmation obligatoire avant toute action

## Flow (Steps)

```
1. Accès "Gestion des Rôles"
2. Chargement professeurs et attributions
3. Affichage liste avec rôles actuels
4. Recherche/Filtrage (optionnel)
5. Clic sur icône rôle
6. Confirmation utilisateur
7. Appel API
   7.1. Validation autorisation
   7.2. Création/Désactivation AttributionRole
   7.3. Enregistrement historique
8. Rechargement page
9. Mise à jour statistiques
```

## Données (Modèles utilisés)

### AttributionRole
```typescript
interface AttributionRole {
  idAttribution: number;
  professeur: Professeur;
  typeRole: TypeRole; // COMMISSION | JURIE | PRESIDENT_JURY_POSSIBLE
  anneeAcademique: string;
  dateAttribution: Date;
  dateRetrait?: Date;
  attribuePar: number; // idChefDepartement
  estActif: boolean;
}
```

### TypeRole
```typescript
enum TypeRole {
  COMMISSION = 'COMMISSION',
  JURIE = 'JURIE',
  PRESIDENT_JURY_POSSIBLE = 'PRESIDENT_JURY_POSSIBLE'
}
```

## Impact API (Endpoints)

### Endpoints requis

1. **GET /api/departement/attributions-roles**
   - Retourne toutes les attributions
   - Query params: `?anneeAcademique=2024-2025`
   - Response: `AttributionRole[]`

2. **GET /api/departement/attributions-roles/annee/:annee**
   - Retourne les attributions pour une année spécifique
   - Response: `AttributionRole[]`

3. **POST /api/departement/attributions-roles**
   - Attribue un rôle à un professeur
   - Body: `{ idProfesseur: number, typeRole: TypeRole, anneeAcademique: string, attribuePar: number }`
   - Response: `AttributionRole`

4. **DELETE /api/departement/attributions-roles/:id**
   - Retire un rôle (désactive l'attribution)
   - Response: `{ success: boolean, message: string }`

5. **GET /api/departement/professeurs/:id/roles**
   - Retourne les rôles actifs d'un professeur
   - Query params: `?anneeAcademique=2024-2025`
   - Response: `AttributionRole[]`

## Tests recommandés

### Tests unitaires
- [ ] Vérifier qu'un professeur peut avoir plusieurs rôles
- [ ] Vérifier la désactivation lors du retrait
- [ ] Vérifier le filtrage par année académique

### Tests d'intégration
- [ ] Attribuer un rôle et vérifier sa présence
- [ ] Retirer un rôle et vérifier sa désactivation
- [ ] Vérifier les statistiques après attribution/retrait

### Tests E2E
- [ ] Parcours complet d'attribution de tous les rôles
- [ ] Parcours complet de retrait de rôles
- [ ] Vérifier les confirmations et messages d'erreur

## Notes et TODOs

- [ ] Implémenter les notifications aux professeurs lors de l'attribution
- [ ] Ajouter un historique détaillé des changements de rôles
- [ ] Implémenter l'export de la liste des rôles (PDF, Excel)
- [ ] Ajouter la possibilité d'attribuer des rôles en masse
- [ ] Implémenter la copie des rôles d'une année à l'autre

## Fichiers créés/modifiés

- `frontend/src/models/services/AttributionRole.ts` - Modèle TypeScript
- `frontend/src/mocks/models/AttributionRole.mock.ts` - Données mock
- `frontend/src/hooks/useAttributionsRoles.ts` - Hooks personnalisés
- `frontend/src/pages/departement/departement/RolesChef.tsx` - Page UI
- `frontend/docs/features/attribution-roles-professeurs.md` - Cette documentation

**Date de création** : 2025-11-27
