# Fonctionnalité : Consultation du statut de pré-lecture et d'autorisation de soutenance

## Titre
Affichage du statut de pré-lecture et d'autorisation de soutenance pour les étudiants/candidats

## But
Permettre aux étudiants/candidats de :
1. Consulter le statut de pré-lecture de leur dossier
2. Vérifier si toutes les tâches sont terminées (prérequis pour pré-lecture)
3. Consulter le statut d'autorisation de soutenance
4. Comprendre les étapes nécessaires avant la soutenance

## Prérequis
- L'utilisateur doit être authentifié avec le rôle `etudiant` ou `candidat`
- Le modèle `DossierMemoire` doit être disponible avec les champs `autorisePrelecture` et `prelectureEffectuee`
- Le modèle `Ticket` doit être disponible pour vérifier l'état des tâches

## Préconditions
- L'étudiant est connecté à l'application
- L'étudiant accède à la page de détail de son dossier via "Mes Dossiers"
- Le dossier doit être associé à un encadrement actif

## Postconditions
### Succès
- L'étudiant visualise clairement le statut de pré-lecture avec un badge coloré
- L'étudiant voit le nombre de tâches terminées sur le total
- L'étudiant visualise le statut d'autorisation de soutenance (si pré-lecture validée)
- Les messages explicatifs guident l'étudiant sur les prochaines étapes

### Échec
- Message d'erreur si les données ne chargent pas
- Affichage d'un statut "Non éligible" si les prérequis ne sont pas remplis

## Scénario nominal

### 1. Consultation du statut de pré-lecture
1. L'étudiant accède à la page de détail de son dossier
2. Le système récupère tous les tickets associés au dossier
3. Le système vérifie si toutes les tâches sont terminées (phase `TERMINE`)
4. Le système affiche le statut de pré-lecture selon les règles :
   - **Non éligible** : Toutes les tâches ne sont pas terminées
   - **En attente** : Toutes les tâches terminées mais pas encore autorisé par l'encadrant
   - **Autorisée** : Pré-lecture autorisée par l'encadrant mais pas encore effectuée
   - **Validée** : Pré-lecture effectuée et validée

### 2. Consultation du statut d'autorisation de soutenance
1. Si la pré-lecture est validée, le système affiche le statut d'autorisation de soutenance
2. Le système vérifie si `autoriseSoutenance` est `true`
3. Le système affiche le statut selon les règles :
   - **Non éligible** : Pré-lecture non validée
   - **En attente** : Pré-lecture validée mais pas encore autorisé par l'encadrant
   - **Autorisé** : Autorisation accordée par l'encadrant

## Scénarios alternatifs / Erreurs

### A1 : Aucun ticket associé
- **Condition** : Le dossier n'a aucun ticket associé
- **Résultat** : Statut "Non éligible" avec message "Toutes les tâches doivent être terminées"

### A2 : Tâches non terminées
- **Condition** : Certaines tâches ne sont pas en phase `TERMINE`
- **Résultat** : Statut "Non éligible" avec affichage du nombre de tâches terminées sur le total

### A3 : Pré-lecture non autorisée
- **Condition** : Toutes les tâches terminées mais `autorisePrelecture` est `false` ou `undefined`
- **Résultat** : Statut "En attente" avec message "En attente d'autorisation de pré-lecture par l'encadrant"

### A4 : Pré-lecture autorisée mais non effectuée
- **Condition** : `autorisePrelecture` est `true` mais `prelectureEffectuee` est `false`
- **Résultat** : Statut "Autorisée" avec message "Pré-lecture autorisée - En attente de validation"

### A5 : Pré-lecture validée mais soutenance non autorisée
- **Condition** : `prelectureEffectuee` est `true` mais `autoriseSoutenance` est `false` ou `undefined`
- **Résultat** : Statut "En attente" avec message "En attente d'autorisation de soutenance par l'encadrant"

## Exigences fonctionnelles

### EF1 : Vérification des prérequis
- Le système doit vérifier que toutes les tâches sont terminées avant d'autoriser la pré-lecture
- Le système doit vérifier que la pré-lecture est validée avant d'autoriser la soutenance

### EF2 : Affichage visuel
- Utiliser des couleurs distinctes pour chaque statut :
  - Vert : Validé/Autorisé
  - Bleu : Autorisé (en attente de validation)
  - Ambre : En attente
  - Gris : Non éligible
- Afficher des badges avec le statut textuel
- Afficher des icônes appropriées (CheckCircle, FileCheck, Clock, AlertCircle, XCircle)

### EF3 : Messages informatifs
- Chaque statut doit avoir un message explicatif
- Afficher le nombre de tâches terminées si applicable

## Exigences non-fonctionnelles

### ENF1 : Performance
- Les tickets doivent être récupérés de manière optimale (useMemo)
- Les calculs de statut doivent être mis en cache

### ENF2 : Accessibilité
- Les couleurs doivent respecter les contrastes WCAG
- Les messages doivent être clairs et compréhensibles

## Flow (Steps)

1. **Récupération des données**
   - Récupérer les tickets du dossier via `getTicketsByDossier(idDossierMemoire)`
   - Vérifier si toutes les tâches sont terminées

2. **Calcul du statut de pré-lecture**
   - Si toutes les tâches ne sont pas terminées → "Non éligible"
   - Si `autorisePrelecture` est `false` ou `undefined` → "En attente"
   - Si `autorisePrelecture` est `true` et `prelectureEffectuee` est `false` → "Autorisée"
   - Si `prelectureEffectuee` est `true` → "Validée"

3. **Calcul du statut de soutenance**
   - Si pré-lecture non validée → "Non éligible"
   - Si `autoriseSoutenance` est `false` ou `undefined` → "En attente"
   - Si `autoriseSoutenance` est `true` → "Autorisé"

4. **Affichage**
   - Afficher la section "Pré-lecture" avec le statut calculé
   - Afficher la section "Autorisation de soutenance" uniquement si pré-lecture validée

## Use Case

**Actor** : Étudiant/Candidat

**Trigger** : Consultation du détail de son dossier

**Preconditions** :
- L'étudiant est connecté
- Le dossier existe et est associé à un encadrement

**Main Flow** :
1. L'étudiant accède à la page de détail de son dossier
2. Le système récupère les tickets associés
3. Le système calcule le statut de pré-lecture
4. Le système affiche le statut avec un badge et un message
5. Si pré-lecture validée, le système calcule et affiche le statut de soutenance

**Postconditions** :
- L'étudiant connaît son statut de pré-lecture
- L'étudiant connaît son statut d'autorisation de soutenance
- L'étudiant comprend les prochaines étapes

## Données (Modèle utilisé)

- **DossierMemoire** :
  - `idDossierMemoire` : Identifiant du dossier
  - `autorisePrelecture` : Boolean optionnel - Autorisation de pré-lecture
  - `prelectureEffectuee` : Boolean optionnel - Pré-lecture effectuée
  - `autoriseSoutenance` : Boolean - Autorisation de soutenance

- **Ticket** :
  - `idTicket` : Identifiant du ticket
  - `phase` : PhaseTicket - Phase actuelle (A_FAIRE, EN_COURS, EN_REVISION, TERMINE)
  - `dossierMemoire` : DossierMemoire - Dossier associé

## Impact API (Endpoints)

### GET /api/dossiers/{idDossierMemoire}
- Retourner les champs `autorisePrelecture`, `prelectureEffectuee`, `autoriseSoutenance`

### GET /api/tickets?dossierMemoireId={idDossierMemoire}
- Retourner tous les tickets associés au dossier
- Filtrer par `dossierMemoire.idDossierMemoire`

## Tests recommandés

### Tests unitaires
- Vérifier le calcul du statut de pré-lecture selon différents scénarios
- Vérifier le calcul du statut de soutenance selon différents scénarios
- Vérifier la logique de vérification des tâches terminées

### Tests d'intégration
- Vérifier l'affichage correct des statuts selon les données du dossier
- Vérifier que les messages sont corrects pour chaque statut
- Vérifier que les couleurs et badges sont appropriés

### Tests E2E
- Scénario : Étudiant consulte son dossier avec toutes les tâches terminées
- Scénario : Étudiant consulte son dossier avec pré-lecture validée
- Scénario : Étudiant consulte son dossier avec autorisation de soutenance

## Notes / TO-DOs

- [ ] Implémenter les endpoints API pour récupérer les statuts
- [ ] Ajouter des notifications lorsque le statut change
- [ ] Considérer l'ajout d'un historique des changements de statut
- [ ] Ajouter des tooltips explicatifs pour chaque statut

