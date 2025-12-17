import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Plus, Trash2, MessageSquare, Menu, X, Search } from 'lucide-react';

interface Message {
  id: number;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: number;
  title: string;
  messages: Message[];
  lastMessage: string;
  timestamp: Date;
  isRead?: boolean;
}

const Chatbot: React.FC = () => {
  const [input, setInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 1,
      title: "Bienvenue - Assistant ISIMemo",
      messages: [
        {
          id: 1,
          type: 'bot',
          content: `👋 Bonjour ! Je suis l'assistant ISIMemo, spécialisé dans l'accompagnement des étudiants pour la rédaction de leur rapport de stage en licence informatique.

📚 **Sujets sur lesquels je peux vous aider :**

**Concepts de modélisation :**
• UML (Unified Modeling Language)
• Diagramme de classe
• Diagramme de cas d'utilisation (Use Case)
• Diagramme de séquence

**Gestion de projet :**
• Méthodologie Agile / Scrum

**Rédaction du rapport :**
• Contexte du projet
• Problématique
• Besoins fonctionnels
• Besoins non fonctionnels
• Canevas / Structure du rapport de stage

💡 Posez-moi une question sur l'un de ces sujets !`,
          timestamp: new Date(),
        }
      ],
      lastMessage: "Bienvenue ! Je suis l'assistant ISIMemo...",
      timestamp: new Date(),
      isRead: true,
    }
  ]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(conversations[0]);
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages]);

  // Base de connaissances du chatbot
  const generateBotResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    // Concepts clés avec leurs réponses détaillées
    const knowledgeBase: { keywords: string[]; response: string }[] = [
      {
        keywords: ['uml', 'unified modeling language', 'langage de modélisation'],
        response: `📐 **UML (Unified Modeling Language)**

L'UML est un langage de modélisation graphique standardisé utilisé pour visualiser, spécifier, construire et documenter les artefacts d'un système logiciel.

**Caractéristiques principales :**
• Langage universel compris par tous les acteurs d'un projet
• Permet de représenter visuellement l'architecture et le comportement d'un système
• Facilite la communication entre les développeurs, analystes et clients
• Standard maintenu par l'OMG (Object Management Group)

**Les principaux types de diagrammes UML :**
1. **Diagrammes structurels** : Classe, Objets, Composants, Déploiement
2. **Diagrammes comportementaux** : Cas d'utilisation, Séquence, États, Activités

**Pourquoi utiliser UML dans votre mémoire ?**
• Documente clairement votre conception
• Facilite la compréhension de votre solution
• Démontre votre maîtrise des bonnes pratiques de modélisation`
      },
      {
        keywords: ['diagramme de classe', 'class diagram', 'diagramme classe'],
        response: `📊 **Diagramme de Classe**

Le diagramme de classe est le diagramme UML le plus utilisé. Il représente la structure statique d'un système en montrant les classes, leurs attributs, méthodes et les relations entre elles.

**Composants d'une classe :**
┌─────────────────────┐
│     NomClasse       │  ← Nom de la classe
├─────────────────────┤
│ - attribut1: Type   │  ← Attributs (propriétés)
│ - attribut2: Type   │
├─────────────────────┤
│ + méthode1(): void  │  ← Méthodes (comportements)
│ + méthode2(): Type  │
└─────────────────────┘

**Visibilité des membres :**
• + Public : accessible partout
• - Private : accessible uniquement dans la classe
• # Protected : accessible dans la classe et ses sous-classes

**Types de relations :**
• **Association** (──) : Relation simple entre classes
• **Agrégation** (◇──) : "Contient" (faible couplage)
• **Composition** (◆──) : "Est composé de" (fort couplage)
• **Héritage** (──▷) : Relation parent-enfant
• **Dépendance** (- - ->) : Utilisation temporaire

**Dans votre rapport :** Présentez le diagramme de classe dans la section "Travail 2 : Conception"`
      },
      {
        keywords: ['use case', 'cas d\'utilisation', 'cas utilisation', 'diagramme use case'],
        response: `🎯 **Diagramme de Cas d'Utilisation (Use Case)**

Le diagramme de cas d'utilisation représente les fonctionnalités d'un système du point de vue de l'utilisateur. Il montre QUI fait QUOI avec le système.

**Éléments principaux :**

• **Acteur** (🧑) : Entité externe qui interagit avec le système
  - Acteur principal : Utilise directement le système
  - Acteur secondaire : Fournit un service au système

• **Cas d'utilisation** (⬭) : Action ou fonction du système
  - Représenté par une ellipse
  - Décrit un scénario d'interaction

• **Système** (📦) : Rectangle délimitant le périmètre du système

**Types de relations :**
• **Association** (——) : Lien acteur ↔ cas d'utilisation
• **Include** (--include-->) : Cas d'utilisation obligatoire inclus
• **Extend** (--extend-->) : Cas d'utilisation optionnel
• **Généralisation** (——▷) : Héritage entre acteurs ou cas

**Exemple structure :**
┌──────────────────────────────────┐
│         Système de Gestion       │
│   ⬭ Gérer articles              │
│   ⬭ Gérer commandes             │
│   ⬭ Gérer clients               │
└──────────────────────────────────┘
   🧑 Administrateur    🧑 Client

**Conseil :** Commencez par identifier tous les acteurs, puis listez leurs interactions avec le système.`
      },
      {
        keywords: ['diagramme de sequence', 'sequence diagram', 'diagramme sequence', 'séquence'],
        response: `⏱️ **Diagramme de Séquence**

Le diagramme de séquence montre comment les objets interagissent dans un ordre chronologique. Il représente le déroulement d'un scénario particulier.

**Éléments principaux :**

• **Participant/Objet** : Représenté par un rectangle en haut
• **Ligne de vie** (│) : Ligne verticale pointillée sous chaque participant
• **Message** (──>) : Flèche horizontale représentant une communication
• **Barre d'activation** (█) : Rectangle sur la ligne de vie (objet actif)

**Types de messages :**
• ──────> Message synchrone (appel avec attente de réponse)
• - - - -> Message asynchrone (appel sans attente)
• <─ ─ ─ ─ Message de retour

**Structure typique :**
┌────────┐     ┌────────┐     ┌────────┐
│ Client │     │Système │     │  BDD   │
└───┬────┘     └───┬────┘     └───┬────┘
    │  1. connexion()  │              │
    │─────────────────>│              │
    │              │ 2. vérifier()    │
    │              │─────────────────>│
    │              │  3. résultat     │
    │              │<─ ─ ─ ─ ─ ─ ─ ─ ─│
    │ 4. réponse   │                  │
    │<─ ─ ─ ─ ─ ─ ─│                  │

**Utilisation :** Illustrez les scénarios principaux de votre application (connexion, création de commande, etc.)`
      },
      {
        keywords: ['agile', 'scrum', 'gestion de projet agile', 'méthodologie agile', 'sprint'],
        response: `🔄 **Gestion de Projet Agile**

L'Agile est une approche de gestion de projet itérative et incrémentale, favorisant la flexibilité et la collaboration.

**Principes fondamentaux (Manifeste Agile) :**
1. Les individus et interactions > processus et outils
2. Logiciel fonctionnel > documentation exhaustive
3. Collaboration avec le client > négociation contractuelle
4. Adaptation au changement > suivi d'un plan

**Méthodologie SCRUM (la plus populaire) :**

• **Sprint** : Itération de 2-4 semaines
• **Product Backlog** : Liste priorisée des fonctionnalités
• **Sprint Backlog** : Tâches à réaliser pendant le sprint
• **Daily Standup** : Réunion quotidienne de 15 min

**Rôles SCRUM :**
• **Product Owner** : Définit les priorités et besoins
• **Scrum Master** : Facilite le processus et élimine les obstacles
• **Équipe de développement** : Réalise le travail

**Avantages :**
✅ Livraisons fréquentes et régulières
✅ Adaptation rapide aux changements
✅ Meilleure visibilité sur l'avancement
✅ Implication continue du client

**Dans votre stage :** Mentionnez si vous avez travaillé en méthodologie Agile et décrivez votre rôle dans l'équipe.`
      },
      {
        keywords: ['contexte', 'context'],
        response: `📋 **Contexte du Projet**

Le contexte est la section qui présente l'environnement et les circonstances dans lesquelles s'inscrit votre stage.

**Éléments à inclure :**

1. **L'entreprise/organisation :**
   • Secteur d'activité
   • Taille et structure
   • Positionnement sur le marché

2. **Le projet existant ou à venir :**
   • Description du projet global
   • État actuel du projet à votre arrivée
   • Phases déjà réalisées ou à venir

3. **L'équipe de travail :**
   • Composition de l'équipe (développeurs, chefs de projet, etc.)
   • Votre position dans l'équipe
   • Organisation du travail (méthodologie utilisée)

4. **Le besoin identifié :**
   • Pourquoi ce projet existe
   • Quel problème il résout
   • Quels sont les enjeux pour l'entreprise

**Exemple de formulation :**
"Dans le cadre de sa digitalisation, l'entreprise X souhaite développer une application de gestion des commandes pour optimiser son processus de vente..."

**Conseil :** Le contexte doit permettre au lecteur de comprendre pourquoi votre stage a été proposé et dans quel environnement vous avez travaillé.`
      },
      {
        keywords: ['problematique', 'problématique', 'problem'],
        response: `❓ **Problématique**

La problématique est la question centrale à laquelle votre travail de stage cherche à répondre.

**Caractéristiques d'une bonne problématique :**
• Formulée sous forme de question
• Claire et spécifique
• Orientée vers une solution
• Mesurable et réaliste

**Structure de formulation :**
"Comment [action] pour [objectif] dans le contexte de [situation] ?"

**Exemples de problématiques :**
• "Comment automatiser la gestion des stocks pour réduire les ruptures de 50% ?"
• "Comment améliorer l'expérience utilisateur du portail client pour augmenter le taux de fidélisation ?"
• "Comment optimiser les performances de l'application mobile pour supporter 10 000 utilisateurs simultanés ?"

**Liens avec le rapport :**
• La problématique découle du **contexte**
• Elle justifie les **objectifs** de votre stage
• Les **travaux réalisés** y répondent
• Le **bilan** évalue si elle a été résolue

**Conseil :** Votre problématique doit être validée avec votre encadrant et doit rester cohérente tout au long du rapport.`
      },
      {
        keywords: ['besoin fonctionnel', 'besoins fonctionnels', 'fonctionnel', 'requirement fonctionnel'],
        response: `✅ **Besoins Fonctionnels**

Les besoins fonctionnels décrivent CE QUE le système doit faire. Ce sont les fonctionnalités attendues par les utilisateurs.

**Caractéristiques :**
• Décrivent des actions concrètes
• Sont mesurables et vérifiables
• Répondent à la question "Quoi ?"

**Catégories courantes :**

📦 **Gestion des données :**
• Créer, lire, modifier, supprimer (CRUD)
• Rechercher et filtrer
• Importer/exporter

👤 **Gestion des utilisateurs :**
• S'inscrire et se connecter
• Gérer les profils
• Définir les rôles et permissions

📊 **Fonctionnalités métier :**
• Gérer les articles/produits
• Gérer les commandes
• Gérer les clients
• Gérer les livraisons
• Générer des rapports

**Format de rédaction recommandé :**
"Le système doit permettre à [acteur] de [action] afin de [objectif]."

**Exemple :**
• BF01 : Le système doit permettre à l'administrateur de créer un nouvel article avec nom, description, prix et quantité.
• BF02 : Le système doit permettre au client de passer une commande depuis son panier.

**Dans votre rapport :** Listez vos besoins fonctionnels dans la section "Travail 1 : Spécification des besoins" (section 1.1)`
      },
      {
        keywords: ['besoin non fonctionnel', 'besoins non fonctionnels', 'non fonctionnel', 'non-fonctionnel', 'nfr'],
        response: `⚙️ **Besoins Non Fonctionnels**

Les besoins non fonctionnels décrivent COMMENT le système doit fonctionner. Ce sont les critères de qualité et les contraintes techniques.

**Catégories principales :**

🚀 **Performance :**
• Temps de réponse < 3 secondes
• Support de X utilisateurs simultanés
• Chargement des pages < 2 secondes

🔒 **Sécurité :**
• Authentification obligatoire
• Chiffrement des données sensibles
• Protection contre les injections SQL
• Gestion des sessions

📱 **Portabilité :**
• Compatible avec les navigateurs modernes
• Responsive design (mobile, tablette, PC)
• Multi-plateforme

🔧 **Maintenabilité :**
• Code documenté
• Architecture modulaire
• Tests unitaires

💪 **Fiabilité :**
• Disponibilité 99%
• Sauvegarde automatique
• Gestion des erreurs

🎨 **Ergonomie :**
• Interface intuitive
• Accessibilité (WCAG)
• Cohérence visuelle

**Format de rédaction :**
"Le système doit [contrainte] pour [justification]."

**Exemple :**
• BNF01 : Le système doit charger les pages en moins de 3 secondes pour garantir une bonne expérience utilisateur.
• BNF02 : Le système doit chiffrer les mots de passe avec l'algorithme BCrypt pour assurer la sécurité des données.

**Dans votre rapport :** Section "Travail 1 : Spécification des besoins" (section 1.2)`
      },
      {
        keywords: ['canevas', 'caneva', 'plan du rapport', 'structure rapport', 'template rapport', 'rapport de stage'],
        response: `📄 **Canevas de Rédaction du Rapport de Stage (Licence Informatique)**

**Département Génie Informatique - ISI**

📏 **Format :** 15-30 pages maximum (hors annexes)
⏱️ **Soutenance :** 10 minutes devant un jury

═══════════════════════════════════════════

**📖 CHAPITRE 1 : INTRODUCTION GÉNÉRALE (6 pages max)**

1.1 **Présentation de l'entreprise/organisation**
   • Nom, secteur, taille, localisation

1.2 **Contexte**
   • Description du projet
   • Équipe de travail
   • Environnement technique

1.3 **Sujet du stage**
   • Formulation claire et concise
   • Ce que vous allez réaliser

1.4 **Objectifs du stage**
   • Liste des travaux assignés

═══════════════════════════════════════════

**📖 CHAPITRE 2 : TRAVAUX RÉALISÉS (22 pages max)**

**Travail 1 : Étude/Analyse des besoins**
   1.1 Besoins fonctionnels
   1.2 Besoins non fonctionnels

**Travail 2 : Conception/Modélisation**
   2.1 Choix du langage UML
   2.2 Diagramme de cas d'utilisation
   2.3 Diagramme de classe

**Travail 3 : Maquettisation**
   • Design et ergonomie des IHM

**Travail 4 : Implémentation**
   1. Environnement technique
      1.1 Outils (matériels et logiciels)
      1.2 Technologies utilisées
   2. Réalisation applicative
      • Création base de données
      • Création des interfaces
      • CRUDs (articles, commandes, clients, livraisons)

**Travail 5 : Déploiement**

═══════════════════════════════════════════

**📖 CHAPITRE 3 : BILAN (2 pages)**

• Objectifs atteints / non atteints
• Intérêts personnels (compétences acquises)
• Intérêts pour l'entreprise (apports du stage)`
      }
    ];

    // Liste des sujets supportés pour message d'aide
    const supportedTopics = `📚 **Sujets sur lesquels je peux vous aider :**

**Concepts de modélisation :**
• UML (Unified Modeling Language)
• Diagramme de classe
• Diagramme de cas d'utilisation (Use Case)
• Diagramme de séquence

**Gestion de projet :**
• Méthodologie Agile / Scrum

**Rédaction du rapport :**
• Contexte du projet
• Problématique
• Besoins fonctionnels
• Besoins non fonctionnels
• Canevas / Structure du rapport de stage

💡 **Exemples de questions :**
• "Qu'est-ce que l'UML ?"
• "Explique-moi le diagramme de classe"
• "Comment rédiger une problématique ?"
• "Montre-moi le canevas du rapport"
• "C'est quoi un besoin non fonctionnel ?"`;

    // Recherche de correspondance dans la base de connaissances
    for (const knowledge of knowledgeBase) {
      for (const keyword of knowledge.keywords) {
        if (lowerQuery.includes(keyword)) {
          return knowledge.response;
        }
      }
    }

    // Mots-clés de salutation
    if (lowerQuery.match(/bonjour|salut|hello|hey|coucou|bonsoir/)) {
      return `👋 Bonjour ! Je suis l'assistant ISIMemo, spécialisé dans l'accompagnement des étudiants pour la rédaction de leur rapport de stage.

${supportedTopics}

Comment puis-je vous aider aujourd'hui ?`;
    }

    // Mots-clés d'aide
    if (lowerQuery.match(/aide|help|comment|quoi|que peux|qu'est-ce que tu/)) {
      return supportedTopics;
    }

    // Réponse par défaut pour les questions non reconnues
    return `🤔 Je ne suis pas sûr de comprendre votre question.

Je suis spécialisé dans l'accompagnement pour la rédaction du rapport de stage en licence informatique.

${supportedTopics}

Pourriez-vous reformuler votre question en rapport avec l'un de ces sujets ?`;
  };

  const handleSendMessage = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!input.trim() || !currentConversation) return;

    const userMessage = {
      id: Date.now(),
      type: 'user' as const,
      content: input,
      timestamp: new Date(),
    };

    const updatedConversation: Conversation = {
      ...currentConversation,
      messages: [...currentConversation.messages, userMessage],
      lastMessage: input,
      timestamp: new Date(),
      isRead: true,
    };

    setCurrentConversation(updatedConversation);
    setConversations(prev => prev.map(conv =>
      conv.id === currentConversation.id ? updatedConversation : conv
    ));
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = generateBotResponse(input);

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot' as const,
        content: botResponse,
        timestamp: new Date(),
      };

      const finalConversation: Conversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, botMessage],
        lastMessage: botMessage.content.substring(0, 100) + '...',
        timestamp: new Date(),
        isRead: true,
      };

      setCurrentConversation(finalConversation);
      setConversations(prev => prev.map(conv =>
        conv.id === currentConversation.id ? finalConversation : conv
      ));
      setIsTyping(false);
    }, 1500);
  };

  const startNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now(),
      title: "Nouvelle discussion",
      messages: [
        {
          id: 1,
          type: 'bot',
          content: `👋 Bonjour ! Je suis l'assistant ISIMemo, spécialisé dans l'accompagnement des étudiants pour la rédaction de leur rapport de stage.

📚 **Sujets sur lesquels je peux vous aider :**

• UML et diagrammes (classe, use case, séquence)
• Méthodologie Agile / Scrum
• Contexte et problématique
• Besoins fonctionnels et non fonctionnels
• Canevas du rapport de stage

💡 Posez-moi une question !`,
          timestamp: new Date(),
        }
      ],
      lastMessage: "Bonjour ! Je suis l'assistant ISIMemo...",
      timestamp: new Date(),
      isRead: true,
    };

    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversation(newConversation);
  };

  const deleteConversation = (conversationId: number) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    if (currentConversation?.id === conversationId) {
      const remainingConversations = conversations.filter(conv => conv.id !== conversationId);
      setCurrentConversation(remainingConversations[0] || null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Aujourd\'hui';
    if (diffDays === 2) return 'Hier';
    if (diffDays <= 7) return `Il y a ${diffDays - 1} jours`;
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  };

  const filteredConversations = conversations.filter(conversation =>
    conversation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${showSidebar ? 'w-80' : 'w-0'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden`}>
        {/* Header compact */}
        <div className="px-4 py-2 border-b border-gray-100">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              startNewConversation();
            }}
            className="w-full flex items-center justify-center gap-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all text-sm font-medium shadow-sm mb-2"
          >
            <Plus className="h-4 w-4" />
            Nouvelle discussion
          </button>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher des discussions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-2">
          {filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`group relative p-3 mb-1 cursor-pointer rounded-lg transition-all duration-200 ${currentConversation?.id === conversation.id
                  ? 'bg-primary text-white'
                  : 'hover:bg-gray-50'
                }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentConversation(conversation);
              }}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentConversation?.id === conversation.id ? 'bg-white/20' : 'bg-primary/10'
                  }`}>
                  <MessageSquare className={`h-4 w-4 ${currentConversation?.id === conversation.id ? 'text-white' : 'text-primary'
                    }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`text-sm font-semibold truncate ${currentConversation?.id === conversation.id ? 'text-white' : 'text-gray-900'
                      }`}>
                      {conversation.title}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        deleteConversation(conversation.id);
                      }}
                      className={`opacity-0 group-hover:opacity-100 p-1.5 rounded-md transition-all ${currentConversation?.id === conversation.id
                          ? 'text-white/70 hover:text-white hover:bg-white/20'
                          : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                        }`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                  <p className={`text-xs leading-relaxed line-clamp-2 ${currentConversation?.id === conversation.id ? 'text-white/70' : 'text-gray-500'
                    }`}>
                    {conversation.lastMessage}
                  </p>
                  <p className={`text-xs mt-2 ${currentConversation?.id === conversation.id ? 'text-white/60' : 'text-gray-400'
                    }`}>
                    {formatDate(conversation.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowSidebar(!showSidebar);
              }}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {showSidebar ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div>
              {currentConversation ? (
                <>
                  <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    {currentConversation.title}
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      Assistant Rapport de Stage
                    </span>
                  </h1>
                  <p className="text-sm text-gray-500">ISIMemo - Département Génie Informatique</p>
                </>
              ) : (
                <>
                  <h1 className="text-xl font-semibold text-gray-900">ISIMemo Assistant</h1>
                  <p className="text-sm text-gray-500">Sélectionnez une conversation</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {currentConversation ? (
            <div>
              {currentConversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={`w-full ${message.type === 'user' ? 'bg-white' : 'bg-gray-50'
                    }`}
                >
                  <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.type === 'user'
                            ? 'bg-gray-600 text-white'
                            : 'bg-primary text-white'
                          }`}>
                          {message.type === 'user' ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {message.type === 'user' ? 'Vous' : 'Assistant ISIMemo'}
                        </div>
                        <div className="text-gray-700 whitespace-pre-wrap">
                          {message.content}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="w-full bg-gray-50">
                  <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-white">
                          <Bot className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          Assistant ISIMemo
                        </div>
                        <div className="typing-animation">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune conversation sélectionnée
                </h3>
                <p className="text-gray-500">
                  Créez une nouvelle discussion pour commencer
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        {currentConversation && (
          <div className="bg-white border-t border-gray-200 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-4">
                <div className="flex-1">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Posez une question sur UML, diagrammes, Agile, besoins fonctionnels..."
                    rows={1}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none shadow-sm hover:border-gray-400"
                    style={{ minHeight: '52px', maxHeight: '120px' }}
                  />
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSendMessage(e);
                  }}
                  disabled={!input.trim()}
                  className="bg-primary hover:bg-primary/90 text-white px-5 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .typing-animation {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .typing-animation span {
          height: 6px;
          width: 6px;
          background: #6366f1;
          border-radius: 50%;
          display: block;
          animation: typing 1.4s infinite ease-in-out;
        }
        
        .typing-animation span:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .typing-animation span:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes typing {
          0%, 80%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          40% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;