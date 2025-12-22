# Gestion des Documents de Mémoire - MediaLibrary Service

## 📋 Vue d'ensemble

Le MediaLibrary Service gère le cycle de vie complet des documents de mémoire, de la soumission initiale jusqu'à la validation finale après prélecture et analyse anti-plagiat.

## 🎯 But

Permettre aux candidats de soumettre leurs livrables (documents de mémoire) avec gestion de versions, visibilité contrôlée, analyse anti-plagiat automatique et workflow de validation par l'encadrant.

## 🔑 Prérequis

- Candidat authentifié avec un dossier de mémoire actif
- Encadrant assigné au dossier
- Système anti-plagiat configuré (intégration future)
- MinIO pour le stockage des fichiers
- PostgreSQL pour les métadonnées
- Kafka pour les événements

## ⚙️ Conditions & Préconditions

### Préconditions
- Le candidat doit avoir un `dossierId` valide
- Le candidat doit avoir au moins une tâche (ticket) active
- Le fichier doit être au format PDF (recommandé pour les mémoires)
- Taille maximale : 50MB

### Postconditions
- Document stocké dans MinIO
- Métadonnées enregistrées dans PostgreSQL
- Événement Kafka publié (`media.upload`)
- Document invisible par défaut (`visible = false`)
- Version incrémentée si remplacement

## 📊 Scénario Nominal

### 1. Soumission d'un Livrable (Candidat)

**Étapes** :
1. Le candidat termine une tâche dans son espace de travail
2. Il upload son document via `POST /api/media/upload`
3. Le système :
   - Stocke le fichier dans **MinIO**
   - Crée/met à jour l'enregistrement en **PostgreSQL**
   - **Indexe les métadonnées dans Elasticsearch** (pour chatbot/recommandations futures)
   - Si c'est un remplacement : archive l'ancienne version (`statut = ARCHIVE`)
   - Incrémente le numéro de version
   - Définit `visible = false`
   - Définit `statut = DEPOSE`
4. **PAS d'événement Kafka à cette étape** (Kafka uniquement pour anti-plagiat)
5. Le candidat reçoit la confirmation

**Endpoint** : `POST /api/media/upload`

**Paramètres** :
```
file: memoire.pdf (multipart)
titre: "Mémoire - Chapitre 1"
candidatId: "cand123"
dossierId: "doss456"
ticketId: "ticket789"
typeDocument: "MEMOIRE"
anneeAcademique: "2024-2025"
niveau: "Licence"
filiere: "Informatique"
description: "Premier chapitre du mémoire"
versionPrecedenteId: "doc-old-123" (optionnel, si remplacement)
```

**Réponse** :
```json
{
  "id": "doc-new-456",
  "titre": "Mémoire - Chapitre 1",
  "version": 2,
  "visible": false,
  "statut": "DEPOSE",
  "dateDepot": "2024-12-19T10:30:00",
  "candidatId": "cand123",
  "dossierId": "doss456"
}
```

**Stockage** :
- ✅ MinIO : Fichier binaire
- ✅ PostgreSQL : Métadonnées complètes
- ✅ Elasticsearch : Index pour recherche sémantique
- ❌ Kafka : Pas encore (uniquement lors de la soumission anti-plagiat)

### 2. Validation par l'Encadrant

**Étapes** :
1. L'encadrant consulte le document
2. Il valide via `PUT /api/media/{id}/validate`
3. Le système met à jour `statut = VALIDE`
4. `dateValidation` est enregistrée

### 3. Soumission Anti-Plagiat (Encadrant)

**Étapes** :
1. Le candidat termine toutes ses tâches
2. Il demande la prélecture
3. L'encadrant soumet le document au système anti-plagiat via `POST /api/media/{id}/anti-plagiat`
4. Le système :
   - Met à jour `soumisAntiPlagiat = true`
   - Définit `statut = EN_ATTENTE_ANTI_PLAGIAT`
   - **Publie événement Kafka `anti-plagiat.submission`** (C'EST ICI UNIQUEMENT)
   - L'événement sera consommé par le **Plagiarism Service**
5. Le Plagiarism Service :
   - Récupère le fichier depuis MinIO
   - Analyse le document
   - Calcule le `tauxSimilarite`
   - Met à jour le document via callback
6. Résultat enregistré :
   - `tauxSimilarite` enregistré
   - `statutAntiPlagiat` défini (ACCEPTABLE, MODERE, ELEVE, TRES_ELEVE)
   - Si acceptable (< 20%) : `autorisePrelecture = true`
   - `statut = ANTI_PLAGIAT_OK` ou `ANTI_PLAGIAT_SUSPECT`

**Endpoint** : `POST /api/media/{id}/anti-plagiat`

**Body** :
```json
{
  "documentId": "doc-456",
  "encadrantId": "enc123",
  "dossierId": "doss456"
}
```

**Réponse** :
```json
{
  "documentId": "doc-456",
  "statutAntiPlagiat": "EN_COURS",
  "tauxSimilarite": null,
  "rapportUrl": null,
  "autorisePrelecture": false,
  "message": "Document soumis au système anti-plagiat. Analyse en cours..."
}
```

**Événement Kafka publié** :
```json
{
  "documentId": "doc-456",
  "dossierId": "doss456",
  "candidatId": "cand123",
  "encadrantId": "enc123",
  "titre": "Mémoire - Version finale",
  "fileName": "memoire_final.pdf",
  "minioObjectName": "uuid_memoire_final.pdf",
  "bucketName": "academic-media",
  "dateSoumission": "2024-12-19T14:30:00",
  "anneeAcademique": "2024-2025",
  "niveau": "Licence",
  "filiere": "Informatique"
}
```

### 4. Autorisation de Prélecture

**Étapes** :
1. Si anti-plagiat OK, l'encadrant autorise la prélecture via `PUT /api/media/{id}/autoriser-prelecture`
2. Le système :
   - Met à jour `autorisePrelecture = true`
   - Enregistre `dateAutorisationPrelecture`
   - Change `statut = EN_PRELECTURE`

### 5. Prélecture

**Étapes** :
1. Un prélecteur est assigné
2. Il consulte le document
3. Il soumet son feedback via `PUT /api/media/{id}/prelecture`
4. Le système :
   - Enregistre `feedbackPrelecture`
   - Met à jour `prelectureEffectuee = true`
   - Change `statut = PRELECTURE_VALIDEE` ou `PRELECTURE_REJETEE`

## 🔀 Scénarios Alternatifs

### A1 : Remplacement de Version

**Déclencheur** : Le candidat upload un nouveau document pour le même ticket

**Étapes** :
1. Le système détecte `versionPrecedenteId`
2. L'ancien document est archivé (`statut = ARCHIVE`)
3. Le nouveau document est créé avec `version = version_precedente + 1`
4. Lien maintenu via `versionPrecedenteId`

### A2 : Anti-Plagiat Suspect

**Déclencheur** : `tauxSimilarite > 20%`

**Étapes** :
1. `statutAntiPlagiat = MODERE/ELEVE/TRES_ELEVE`
2. `autorisePrelecture = false`
3. `statut = ANTI_PLAGIAT_SUSPECT`
4. L'encadrant est notifié
5. Le candidat doit corriger et resoumettre

### A3 : Prélecture Rejetée

**Déclencheur** : Le prélecteur rejette le document

**Étapes** :
1. `statut = PRELECTURE_REJETEE`
2. `feedbackPrelecture` contient les corrections demandées
3. Le candidat doit corriger et resoumettre
4. Retour à l'étape 1 (nouveau cycle)

## 📝 Exigences Fonctionnelles

### RF1 : Gestion de Visibilité
- Par défaut, tous les documents sont invisibles (`visible = false`)
- Seul l'encadrant peut rendre un document visible
- Les documents visibles apparaissent dans la médiathèque publique

### RF2 : Versioning Automatique
- Chaque nouveau livrable pour le même ticket remplace le précédent
- L'ancienne version est archivée (pas supprimée)
- Traçabilité complète via `versionPrecedenteId`

### RF3 : Workflow Anti-Plagiat
- Obligatoire avant autorisation de prélecture
- Seuils configurables (actuellement : < 20% = acceptable)
- Rapport PDF généré et stocké dans MinIO

### RF4 : Événements Kafka
- `media.upload` : Nouveau document déposé
- `media.delete` : Document supprimé
- `media.anti-plagiat.completed` : Analyse terminée (futur)
- `media.prelecture.completed` : Prélecture terminée (futur)

## 🔧 Exigences Non-Fonctionnelles

### NFR1 : Performance
- Upload de fichiers jusqu'à 50MB
- Temps de réponse < 3s pour upload
- Streaming pour download (pas de chargement en mémoire)

### NFR2 : Sécurité
- Validation du type MIME
- Scan antivirus (intégration future)
- Contrôle d'accès basé sur les rôles

### NFR3 : Disponibilité
- Circuit breaker sur API Gateway
- Retry automatique (3 tentatives)
- Fallback en cas d'indisponibilité

## 🔄 Flow Complet

```
[Candidat] Upload Livrable
    ↓
[Système] Stockage MinIO + PostgreSQL + Elasticsearch
    ↓
[Système] visible = false, statut = DEPOSE
    ↓ (PAS de Kafka ici)
[Encadrant] Validation
    ↓
[Système] statut = VALIDE
    ↓
[Candidat] Termine toutes les tâches
    ↓
[Candidat] Demande prélecture
    ↓
[Encadrant] Soumet anti-plagiat
    ↓
[Système] Publie événement Kafka "anti-plagiat.submission" ← ICI UNIQUEMENT
    ↓
[Plagiarism Service] Consomme événement Kafka
    ↓
[Plagiarism Service] Récupère fichier MinIO + Analyse
    ↓
[Plagiarism Service] Callback avec résultats
    ↓
[Système] tauxSimilarite calculé + Mise à jour Elasticsearch
    ↓
SI taux < 20% :
    [Système] autorisePrelecture = true
    ↓
    [Encadrant] Autorise prélecture
    ↓
    [Prélecteur] Évalue le mémoire
    ↓
    [Système] statut = PRELECTURE_VALIDEE
SINON :
    [Système] autorisePrelecture = false
    ↓
    [Candidat] Corrections requises
    ↓
    Retour au début
```

## 📡 Endpoints API

### Upload
- **POST** `/api/media/upload`
- Multipart form-data avec tous les paramètres
- Stocke dans MinIO + PostgreSQL + **Elasticsearch**
- **PAS de Kafka**
- Retourne `MediaResponse`

### Download
- **GET** `/api/media/{id}/download`
- Retourne le fichier en streaming

### Validation Encadrant
- **PUT** `/api/media/{id}/validate`
- Body : `"Feedback de l'encadrant"` (text/plain)
- Met à jour statut → VALIDE

### Soumission Anti-Plagiat ⭐
- **POST** `/api/media/{id}/anti-plagiat`
- Body : `{ "documentId": "...", "encadrantId": "...", "dossierId": "..." }`
- **Publie événement Kafka** (UNIQUEMENT ICI)
- Retourne `AntiPlagiatResponse`

### Liste par Dossier
- **GET** `/api/media/dossier/{dossierId}`
- Retourne `List<MediaResponse>`

### Détails
- **GET** `/api/media/{id}`
- Retourne `MediaResponse`

### Suppression
- **DELETE** `/api/media/{id}`
- Supprime de MinIO + PostgreSQL + Elasticsearch

## 📨 Événements Kafka

### Topic : `anti-plagiat.submission`

**Publié** : Lors de la soumission au système anti-plagiat (UNIQUEMENT)

**Producteur** : MediaLibrary Service

**Consommateur** : Plagiarism Service (futur)

**Structure** :
```json
{
  "documentId": "uuid",
  "dossierId": "doss123",
  "candidatId": "cand456",
  "encadrantId": "enc789",
  "titre": "Mémoire - Version finale",
  "fileName": "memoire_final.pdf",
  "minioObjectName": "uuid_memoire_final.pdf",
  "bucketName": "academic-media",
  "dateSoumission": "2024-12-19T14:30:00",
  "anneeAcademique": "2024-2025",
  "niveau": "Licence",
  "filiere": "Informatique"
}
```

**Utilisation** :
- Le Plagiarism Service consomme cet événement
- Récupère le fichier depuis MinIO via `minioObjectName` et `bucketName`
- Effectue l'analyse anti-plagiat
- Callback vers MediaLibrary Service avec les résultats

## 💾 Modèle de Données

### Entité `Media` (Document)

```java
@Entity
@Table(name = "document")
public class Media {
    String id;
    String titre;
    String candidatId;
    String dossierId;
    String ticketId;
    String encadrantId;
    
    // Fichier
    String fileName;
    String originalFileName;
    String contentType;
    Long fileSize;
    String minioObjectName;
    String bucketName;
    
    // Type et statut
    TypeDocument typeDocument;
    StatutDocument statut;
    
    // Visibilité et versioning
    Boolean visible;
    Integer version;
    String versionPrecedenteId;
    
    // Anti-plagiat
    Boolean soumisAntiPlagiat;
    StatutAntiPlagiat statutAntiPlagiat;
    Double tauxSimilarite;
    String rapportAntiPlagiatUrl;
    
    // Prélecture
    Boolean autorisePrelecture;
    Boolean prelectureEffectuee;
    
    // Feedback
    String feedbackEncadrant;
    String feedbackPrelecture;
    
    // Phase publique
    Boolean estPhasePublique;
}
```

## 🧪 Tests Recommandés

### Tests Unitaires
- ✅ Upload avec métadonnées complètes
- ✅ Remplacement de version (archivage)
- ✅ Calcul du statut anti-plagiat selon taux
- ✅ Autorisation prélecture selon anti-plagiat
- ✅ Gestion de la visibilité

### Tests d'Intégration
- ✅ Workflow complet candidat → encadrant → anti-plagiat → prélecture
- ✅ Événements Kafka publiés correctement
- ✅ Stockage MinIO et métadonnées PostgreSQL synchronisés
- ✅ Circuit breaker et retry sur échec

### Tests E2E
- ✅ Candidat upload → Encadrant valide → Anti-plagiat → Prélecture
- ✅ Remplacement de version multiple
- ✅ Rejet et correction

## 📌 Impact API

### Nouveaux Endpoints
- `POST /api/media/{id}/anti-plagiat`
- `PUT /api/media/{id}/validate`
- `PUT /api/media/{id}/autoriser-prelecture`
- `PUT /api/media/{id}/prelecture`
- `GET /api/media/dossier/{dossierId}`

### Endpoints Modifiés
- `POST /api/media/upload` - Paramètres étendus
- `GET /api/media/{id}` - Réponse enrichie

## 📝 Notes & TO-DOs

### Implémentés
- ✅ Modèle de données complet (Media + DocumentElastic)
- ✅ DTOs pour upload, anti-plagiat
- ✅ Gestion de visibilité
- ✅ Versioning automatique
- ✅ Indexation Elasticsearch (métadonnées pour chatbot/recommandations)
- ✅ Événement Kafka pour anti-plagiat uniquement
- ✅ Endpoints : upload, download, validate, anti-plagiat, list by dossier
- ✅ Stockage triple : MinIO + PostgreSQL + Elasticsearch

### À Implémenter
- ⏳ Plagiarism Service (consommateur Kafka)
- ⏳ Callback anti-plagiat vers MediaLibrary
- ⏳ Endpoints prélecture (autoriser, soumettre feedback)
- ⏳ Scan antivirus
- ⏳ Notifications temps réel (WebSocket)
- ⏳ Dashboard encadrant pour suivi anti-plagiat
- ⏳ Historique des versions (UI)
- ⏳ Chatbot basé sur Elasticsearch
- ⏳ Système de recommandation
- ⏳ Génération automatique de rapports

### Questions Ouvertes
- Quel service anti-plagiat utiliser ? (Compilatio, Turnitin, solution custom ?)
- Seuils de similarité à ajuster selon le niveau (Licence vs Master) ?
- Archivage des anciennes versions : durée de rétention ?
- Notification automatique au candidat si anti-plagiat suspect ?

## 🔗 Dépendances

### Services
- **MinIO** : Stockage des fichiers
- **PostgreSQL** : Métadonnées
- **Kafka** : Événements asynchrones
- **Eureka** : Découverte de services
- **API Gateway** : Routage et circuit breakers

### Microservices Liés (Futurs)
- **Plagiarism Service** : Analyse anti-plagiat
- **Notification Service** : Alertes candidat/encadrant
- **Topic Service** : Association sujet ↔ document
- **Jury Service** : Accès aux documents pour le jury

## 📚 Références

- Guide backend : `guide_backend/readme.md`
- Modèle frontend : `frontend/src/models/dossier/Document.ts`
- Diagrammes : `modelisation/` (à créer/mettre à jour)
