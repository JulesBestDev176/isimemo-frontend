# Besoins Fonctionnels - Gestion des Mémoires (ISI MEMO)

Ce document recense les besoins fonctionnels de l'application de gestion des mémoires, adaptés au contexte spécifique de la nouvelle année académique.

## 1. Acteurs du Système

*   **Personnel Administratif** : Super-utilisateur responsable de la gestion globale (année, calendrier, sujets, utilisateurs, soutenances).
*   **Candidat (Étudiant)** : Étudiant en Licence 3 actif, éligible pour soutenir un mémoire.
*   **Encadrant (Professeur)** : Enseignant accompagnant les candidats et évaluant les livrables.
*   **Commission de Validation** : Entité (interne ou externe) validant la pertinence scientifique des sujets.
*   **Membre de Jury** : Examinateur lors de la soutenance.

## 2. Modules Fonctionnels Regroupés

### 2.1. Administration Système et Année Académique
Ce module centralise toutes les actions d'initialisation et de gestion globale.

*   **Gestion du cycle de l'année** :
    *   Activation de la nouvelle année académique.
    *   Définition du calendrier académique (périodes de dépôt de sujets, prélecture, dépôts finaux, sessions de soutenance).
    *   Le système notifie automatiquement les acteurs concernés (Candidats L3 actifs, Encadrants) lors de l'ouverture.
*   **Gestion des acteurs** :
    *   Maintenance de la liste des encadrants éligibles et de leur disponibilité.
    *   Maintenance de la liste des membres de jury (avec leurs attributs : président potentiel, disponibilité).
    *   Désactivation automatique des encadrants sans candidat en fin de période de dépôt.

### 2.2. Gestion Unifiée des Sujets et Affectations
Ce module regroupe tout le cycle de vie du sujet, de sa proposition à l'affectation de l'encadrant, minimisant les dépendances externes.

*   **Banque de Sujets** : Saisie et import des sujets proposés par l'administration ou des partenaires externes.
*   **Processus de Choix Candidat** :
    *   Le candidat sélectionne un sujet dans la banque ou propose un sujet personnel.
    *   Formation optionnelle de binôme (invitation et acceptation d'un second candidat).
*   **Validation des Sujets** :
    *   Export des propositions pour la Commission de Validation.
    *   Saisie en masse des résultats de la commission (Validé/Rejeté + Feedback) par le personnel administratif.
*   **Affectation de l'Encadrant** :
    *   Le candidat (ou binôme) sollicite un encadrant disponible.
    *   L'encadrant accepte ou refuse la demande.
    *   Le personnel administratif peut forcer le remplacement d'un encadrant sur demande justifiée.

### 2.3. Suivi Pédagogique et Encadrement
Ce module concerne l'espace de travail collaboratif entre l'encadrant et ses étudiants.

*   **Espace de Travail Groupe** :
    *   Panel unique pour le suivi de l'avancement (Tickets, Chat, Partage de documents).
    *   Gestion de tickets avec workflow strict : *En cours* -> *Terminé* (Livrable soumis) -> *En révision* -> *Validé* ou *Rejeté*.
    *   Gestion des dépendances séquentielles entre les tâches (Tickets).
*   **Validation Intermédiaire (Prélecture)** :
    *   Soumission obligatoire au contrôle anti-plagiat avant prélecture.
    *   Validation de fin de rédaction par l'encadrant.
    *   Attribution du document à un pair (autre encadrant) pour prélecture.
    *   Gestion des retours de prélecture et des corrections associées (nouveaux tickets).

### 2.4. Soutenance et Finalisation
Ce module gère l'organisation matérielle et administrative de la fin du cycle.

*   **Organisation des Soutenances** :
    *   Dépôt des documents administratifs finaux par le candidat.
    *   Planification des sessions : Affectation des salles et génération des compositions de jurys (avec vérification automatique des conflits d'intérêts encadrant/jury).
    *   Notification automatique aux membres de jury et visibilité du planning pour le candidat.
*   **Clôture et Archivage** :
    *   Saisie du Procès Verbal (PV) post-soutenance par l'administration.
    *   Gestion des corrections mineures post-soutenance (assignation de tâches correctives).
    *   Validation finale et versement automatique/manuel du mémoire corrigé dans la bibliothèque numérique ("Bibliothèque Numérique").

## 3. Contexte Technique
*   **Sécurité** : Authentification Keycloak.
*   **Données** : Base de données centralisée distinguant les étudiants actifs.
*   **Traçabilité** : Historisation des éversions de documents (concept d'écrasement avec historique).
