# Génération Automatique des Jurys

## But
Permettre au Chef de Département de générer automatiquement des propositions de jurys de soutenance en respectant les contraintes académiques et logistiques.

## Prérequis
- Être connecté en tant que Chef de Département.
- Avoir des dossiers de mémoire validés et prêts pour la soutenance.
- Avoir des professeurs disponibles dans le département.
- Avoir défini les rôles "Président de Jury Possible" (via la gestion des rôles).

## Règles de Gestion (Contraintes)
1.  **Composition** : Un jury est composé de 3 membres (1 Président, 1 Rapporteur, 1 Examinateur).
2.  **Présidence** : Le président doit avoir le rôle `PRESIDENT_JURY_POSSIBLE` (attribué par le chef de département).
3.  **Conflit d'intérêt** : Un membre du jury ne peut pas être l'encadrant d'un étudiant évalué par ce jury.
4.  **Regroupement** : Les étudiants sont regroupés par lots (cible : 10 étudiants par jury, ajustable).
5.  **Périmètre** : La génération se fait par Département, Niveau (Licence/Master) et Session.

## Scénario Nominal
1.  Le Chef de Département accède à la page **Gestion des Jurys**.
2.  Il clique sur le bouton **"Générer des jurys automatiquement"**.
3.  Une modale s'ouvre et détecte automatiquement :
    - **Année Académique** : Année en cours (ex: 2024-2025).
    - **Session** : La session de soutenance actuellement ouverte (ex: Septembre).
    - **Niveau** : Fixé à **Licence 3** (par défaut).
    - **Dimensionnement** : Calculé automatiquement (max 10 étudiants/jury, sauf si reste ≤ 5).
4.  Si aucune session n'est ouverte, un message d'erreur s'affiche.
5.  Il clique sur **"Prévisualiser les propositions"**.
6.  Le système calcule les propositions et les affiche avec le nombre optimal de jurys.
7.  Le Chef vérifie les propositions valides.
8.  Il clique sur **"Valider la génération"**.
8.  Les jurys sont créés et ajoutés à la liste principale avec le statut "Actif".

## Scénarios Alternatifs / Erreurs
- **Pas assez de professeurs** : Si le nombre de professeurs disponibles (hors encadrants du lot) est inférieur à 3, le jury ne peut pas être formé.
- **Pas de président éligible** : Si aucun des professeurs disponibles n'a le rôle de président, le jury est invalide.
- **Conflit généralisé** : Si tous les présidents possibles sont encadrants dans le lot d'étudiants, le jury est invalide.

## Impact API / Modèles
- Utilise `Professeur` (disponibilité, département).
- Utilise `DossierMemoire` (statut, encadrant).
- Utilise `AttributionRole` (pour identifier les présidents).
- Crée des objets `Jury` (ou `Soutenance` avec jury).

## Tests Recommandés
1.  **Test de volume** : Générer avec 25 étudiants (devrait créer 2 ou 3 jurys selon la taille cible).
2.  **Test de conflit** : Créer un cas où le seul président disponible est l'encadrant d'un étudiant du lot -> Le système doit signaler l'erreur ou ne pas sélectionner ce président (si un autre est dispo).
3.  **Test de rôle** : Vérifier que le membre désigné comme Président a bien le grade/rôle requis.
