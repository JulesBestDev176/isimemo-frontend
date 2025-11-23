# Fonctionnalité : Gestion des Disponibilités Jury

## Titre
Gestion des disponibilités pour les sessions de soutenance

## But
Permettre aux professeurs de renseigner leurs créneaux horaires de disponibilité pour les sessions de soutenance (Jury) activées par le département.

## Prérequis
- L'utilisateur doit être authentifié avec le rôle `professeur`.
- Une **Session de Soutenance** doit être ouverte par le chef de département.

## Préconditions
- Le professeur est connecté à l'application.
- Le professeur accède à la page via le menu "Disponibilités".

## Postconditions
### Succès
- Le professeur visualise les jours spécifiques de la session active.
- Le professeur peut ajouter/modifier ses plages horaires pour chaque jour.
- Les disponibilités sont enregistrées pour la planification des jurys.

### Échec
- Message d'information si aucune session n'est ouverte.

## Scénario nominal

### 1. Consultation des sessions actives
1. Le professeur accède à la page "Disponibilités".
2. Le système vérifie s'il y a des sessions de soutenance au statut `OUVERTE`.
3. Si une session est ouverte, elle s'affiche avec son nom (ex: "Session Septembre 2025").

### 2. Saisie des disponibilités
1. Le professeur voit la liste des jours spécifiques de la session (ex: Lundi 15, Mardi 16).
2. Il clique sur "Modifier mes disponibilités".
3. Pour chaque jour, il peut :
   - Ajouter un créneau (Heure début - Heure fin).
   - Supprimer un créneau existant.
   - Modifier les heures.
4. Il clique sur "Enregistrer".

## Scénarios alternatifs / Erreurs

### A1 : Aucune session ouverte
- **Condition** : Aucune session n'a le statut `OUVERTE`.
- **Résultat** : Affichage d'un message "Aucune session ouverte" informant que la saisie n'est pas possible actuellement.

### A2 : Session multiple (Impossible)
- **Condition** : Le système garantit qu'une seule session peut être au statut `OUVERTE` à la fois.
- **Résultat** : L'interface affiche toujours la session unique en cours.

## Exigences fonctionnelles

### RF1 : Sessions de Soutenance
- Les disponibilités sont strictement liées à une `SessionSoutenance`.
- Une session définit une liste précise de jours (`joursSession`).

### RF2 : Créneaux Horaires
- Le professeur définit des plages horaires précises (ex: 08:00-12:00) pour chaque jour.
- Pas de chevauchement de créneaux pour un même jour (à valider idéalement).

## Exigences non-fonctionnelles

### NFR1 : Ergonomie
- Affichage clair du calendrier de la session.
- Saisie rapide des heures.

## Flow (Steps)

```
1. Accès "Disponibilités"
2. Check Sessions Ouvertes
   2.1. SI Aucune -> Message d'attente
   2.2. SI Ouverte -> Affichage Planning
3. Mode Édition
   3.1. Ajout/Modif créneaux par jour
   3.2. Enregistrement
```

## Données (Modèles utilisés)

### SessionSoutenance
```typescript
interface SessionSoutenance {
  id: number;
  nom: string;
  joursSession: Date[]; // Liste des jours spécifiques
  statut: 'OUVERTE' | 'FERMEE' | 'PLANIFIEE';
}
```

### DisponibiliteJury
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
- `GET /api/sessions/ouvertes` - Liste des sessions actives
- `GET /api/professeurs/{id}/disponibilites/session/{sessionId}` - Dispos du prof pour une session
- `POST /api/professeurs/{id}/disponibilites` - Sauvegarder les dispos

## Tests recommandés

### Tests E2E
- [ ] Vérification de l'affichage "Aucune session".
- [ ] Saisie de créneaux sur plusieurs jours et sauvegarde.
- [ ] Vérification de la persistance des données après rechargement.

---

**Fichiers concernés** :
- `frontend/src/pages/professeur/Disponibilites.tsx`
- `frontend/src/models/acteurs/DisponibiliteProfesseur.ts`

**Date de mise à jour** : 2025-11-22
