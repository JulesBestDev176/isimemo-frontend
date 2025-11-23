# Fonctionnalité : Bibliothèque Numérique

## Titre
Bibliothèque Numérique (anciennement Médiathèque)

## But
Permettre aux étudiants et professeurs de consulter des ressources pédagogiques numériques, spécifiquement des mémoires archivés et des canevas de rédaction.

## Prérequis
- L'utilisateur doit être authentifié (Étudiant ou Professeur).

## Règles de Gestion
- **Contenu** : La bibliothèque contient uniquement des documents PDF.
- **Types de ressources** :
  - **Mémoires** : Archives des mémoires des années précédentes.
  - **Canevas** : Modèles et guides pour la rédaction.
    - **Unicité par département** : Il ne peut y avoir qu'un seul canevas actif par département dans la bibliothèque numérique.
    - **Écrasement** : Si un nouveau canevas est soumis pour un département, l'ancien canevas est automatiquement écrasé/remplacé.
    - **Historique** : L'ancien canevas n'est pas conservé dans l'historique lors du remplacement.
- **Exclusions** : Pas de cours, pas de vidéos.
- **Sauvegarde** : Les utilisateurs peuvent marquer des ressources comme "sauvegardées" pour un accès rapide.

## Scénario nominal
1. L'utilisateur accède à la "Bibliothèque numérique" via le menu ou le tableau de bord.
2. Il voit la liste des ressources disponibles.
3. Il peut filtrer par catégorie (Mémoires, Canevas) ou rechercher par mots-clés.
4. Il clique sur une ressource pour voir les détails et un aperçu (PDF viewer intégré).
5. Il peut ouvrir le PDF dans un nouvel onglet ou le télécharger.

## Scénario alternatif : Soumission d'un nouveau canevas
1. Un administrateur ou un chef de département soumet un nouveau canevas pour son département.
2. Le système vérifie s'il existe déjà un canevas pour ce département.
3. Si un canevas existe déjà :
   - L'ancien canevas est automatiquement supprimé/écrasé.
   - Le nouveau canevas devient le canevas actif du département.
   - Aucune notification n'est envoyée aux utilisateurs (remplacement silencieux).
4. Si aucun canevas n'existe, le nouveau canevas est ajouté normalement.

## Données (Modèle)
```typescript
interface RessourceMediatheque {
  idRessource: number;
  titre: string;
  description: string;
  typeRessource: 'document' | 'lien'; // 'video' et 'image' supprimés du scope fonctionnel
  categorie: 'memoires' | 'canevas'; // 'cours' supprimé
  cheminFichier?: string;
  url?: string;
  auteur: string;
  datePublication: Date;
  tags: string[];
  estImportant: boolean;
  vues: number;
}
```

## Impact API (Endpoints)
- `GET /api/ressources` - Liste des ressources (avec filtres).
- `GET /api/ressources/:id` - Détails d'une ressource.
- `POST /api/ressources/:id/save` - Sauvegarder une ressource.
- `DELETE /api/ressources/:id/save` - Retirer des sauvegardes.
- `POST /api/ressources/canevas` - Soumettre un nouveau canevas (écrase l'ancien si existant).
  - **Comportement** : Si un canevas existe déjà pour le département, il est automatiquement supprimé avant l'ajout du nouveau.
  - **Paramètres** : `departementId`, `fichier`, `titre`, `description`, etc.

## Tests recommandés
- [ ] Vérifier que seuls les onglets "Tous", "Mémoires" et "Canevas" sont visibles.
- [ ] Vérifier que le filtre "Vidéo" n'est pas présent.
- [ ] Vérifier qu'il ne peut y avoir qu'un seul canevas par département dans la bibliothèque.
- [ ] Vérifier que la soumission d'un nouveau canevas écrase l'ancien canevas du département.
- [ ] Vérifier que l'ancien canevas est bien supprimé (pas d'historique conservé).
- [ ] Vérifier que les utilisateurs voient toujours le canevas actuel après remplacement.
- [ ] Vérifier l'ouverture du visualiseur PDF.
- [ ] Vérifier la recherche textuelle.
