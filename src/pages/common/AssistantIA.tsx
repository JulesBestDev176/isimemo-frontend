import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Plus, Loader2, Search, Trash2, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  lastMessageDate: Date;
}

// Composant principal
const AssistantIA: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Récupérer la conversation actuelle
  const currentConversation = conversations.find((c) => c.id === currentConversationId);

  // Scroll automatique vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentConversation?.messages]);

  // Focus sur l'input quand on change de conversation
  useEffect(() => {
    if (currentConversationId) {
      inputRef.current?.focus();
    }
  }, [currentConversationId]);

  // Créer une nouvelle conversation
  const handleNewConversation = () => {
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      title: "Nouvelle discussion",
      messages: [
        {
          id: "welcome",
          role: "assistant",
          content:
            "Bonjour ! Je suis votre assistant IA. Je peux vous aider avec vos questions sur la méthodologie de recherche, la structuration de votre mémoire, les sources et références, ou tout autre sujet lié à votre travail académique. Comment puis-je vous aider aujourd'hui ?",
          timestamp: new Date(),
        },
      ],
      lastMessageDate: new Date(),
    };
    setConversations((prev) => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
  };

  // Fonction pour envoyer un message
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !currentConversationId) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    // Mettre à jour la conversation avec le nouveau message
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === currentConversationId) {
          const updatedMessages = [...conv.messages, userMessage];
          // Générer un titre basé sur le premier message si c'est encore "Nouvelle discussion"
          const newTitle =
            conv.title === "Nouvelle discussion" && conv.messages.length === 1
              ? userMessage.content.substring(0, 20) +
              (userMessage.content.length > 20 ? "..." : "")
              : conv.title;
          return {
            ...conv,
            messages: updatedMessages,
            title: newTitle,
            lastMessageDate: new Date(),
          };
        }
        return conv;
      })
    );

    setInputMessage("");
    setIsLoading(true);

    // Générer la réponse intelligente basée sur la base de connaissances
    setTimeout(() => {
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: generateBotResponse(inputMessage.trim()),
        timestamp: new Date(),
      };

      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === currentConversationId) {
            return {
              ...conv,
              messages: [...conv.messages, assistantMessage],
              lastMessageDate: new Date(),
            };
          }
          return conv;
        })
      );
      setIsLoading(false);
    }, 1500);
  };

  // Base de connaissances du chatbot ISIMemo
  const generateBotResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    // Concepts clés avec leurs réponses détaillées
    const knowledgeBase: { keywords: string[]; response: string }[] = [
      {
        keywords: ['uml', 'unified modeling language', 'langage de modélisation'],
        response: `📐 UML (Unified Modeling Language)

L'UML est un langage de modélisation graphique standardisé utilisé pour visualiser, spécifier, construire et documenter les artefacts d'un système logiciel.

Caractéristiques principales :
• Langage universel compris par tous les acteurs d'un projet
• Permet de représenter visuellement l'architecture et le comportement d'un système
• Facilite la communication entre les développeurs, analystes et clients
• Standard maintenu par l'OMG (Object Management Group)

Les principaux types de diagrammes UML :
1. Diagrammes structurels : Classe, Objets, Composants, Déploiement
2. Diagrammes comportementaux : Cas d'utilisation, Séquence, États, Activités

Pourquoi utiliser UML dans votre mémoire ?
• Documente clairement votre conception
• Facilite la compréhension de votre solution
• Démontre votre maîtrise des bonnes pratiques de modélisation`
      },
      {
        keywords: ['diagramme de classe', 'class diagram', 'diagramme classe'],
        response: `📊 Diagramme de Classe

Le diagramme de classe est le diagramme UML le plus utilisé. Il représente la structure statique d'un système en montrant les classes, leurs attributs, méthodes et les relations entre elles.

Composants d'une classe :
┌─────────────────────┐
│     NomClasse       │  ← Nom de la classe
├─────────────────────┤
│ - attribut1: Type   │  ← Attributs (propriétés)
│ - attribut2: Type   │
├─────────────────────┤
│ + méthode1(): void  │  ← Méthodes (comportements)
│ + méthode2(): Type  │
└─────────────────────┘

Visibilité des membres :
• + Public : accessible partout
• - Private : accessible uniquement dans la classe
• # Protected : accessible dans la classe et ses sous-classes

Types de relations :
• Association (──) : Relation simple entre classes
• Agrégation (◇──) : "Contient" (faible couplage)
• Composition (◆──) : "Est composé de" (fort couplage)
• Héritage (──▷) : Relation parent-enfant
• Dépendance (- - ->) : Utilisation temporaire

Dans votre rapport : Présentez le diagramme de classe dans la section "Travail 2 : Conception"`
      },
      {
        keywords: ['use case', 'cas d\'utilisation', 'cas utilisation', 'diagramme use case'],
        response: `🎯 Diagramme de Cas d'Utilisation (Use Case)

Le diagramme de cas d'utilisation représente les fonctionnalités d'un système du point de vue de l'utilisateur. Il montre QUI fait QUOI avec le système.

Éléments principaux :

• Acteur (🧑) : Entité externe qui interagit avec le système
  - Acteur principal : Utilise directement le système
  - Acteur secondaire : Fournit un service au système

• Cas d'utilisation (⬭) : Action ou fonction du système
  - Représenté par une ellipse
  - Décrit un scénario d'interaction

• Système (📦) : Rectangle délimitant le périmètre du système

Types de relations :
• Association (——) : Lien acteur ↔ cas d'utilisation
• Include (--include-->) : Cas d'utilisation obligatoire inclus
• Extend (--extend-->) : Cas d'utilisation optionnel
• Généralisation (——▷) : Héritage entre acteurs ou cas

Conseil : Commencez par identifier tous les acteurs, puis listez leurs interactions avec le système.`
      },
      {
        keywords: ['diagramme de sequence', 'sequence diagram', 'diagramme sequence', 'séquence'],
        response: `⏱️ Diagramme de Séquence

Le diagramme de séquence montre comment les objets interagissent dans un ordre chronologique. Il représente le déroulement d'un scénario particulier.

Éléments principaux :

• Participant/Objet : Représenté par un rectangle en haut
• Ligne de vie (│) : Ligne verticale pointillée sous chaque participant
• Message (──>) : Flèche horizontale représentant une communication
• Barre d'activation (█) : Rectangle sur la ligne de vie (objet actif)

Types de messages :
• ──────> Message synchrone (appel avec attente de réponse)
• - - - -> Message asynchrone (appel sans attente)
• <─ ─ ─ ─ Message de retour

Utilisation : Illustrez les scénarios principaux de votre application (connexion, création de commande, etc.)`
      },
      {
        keywords: ['agile', 'scrum', 'gestion de projet agile', 'méthodologie agile', 'sprint'],
        response: `🔄 Gestion de Projet Agile

L'Agile est une approche de gestion de projet itérative et incrémentale, favorisant la flexibilité et la collaboration.

Principes fondamentaux (Manifeste Agile) :
1. Les individus et interactions > processus et outils
2. Logiciel fonctionnel > documentation exhaustive
3. Collaboration avec le client > négociation contractuelle
4. Adaptation au changement > suivi d'un plan

Méthodologie SCRUM (la plus populaire) :

• Sprint : Itération de 2-4 semaines
• Product Backlog : Liste priorisée des fonctionnalités
• Sprint Backlog : Tâches à réaliser pendant le sprint
• Daily Standup : Réunion quotidienne de 15 min

Rôles SCRUM :
• Product Owner : Définit les priorités et besoins
• Scrum Master : Facilite le processus et élimine les obstacles
• Équipe de développement : Réalise le travail

Dans votre stage : Mentionnez si vous avez travaillé en méthodologie Agile et décrivez votre rôle dans l'équipe.`
      },
      {
        keywords: ['contexte', 'context'],
        response: `📋 Contexte du Projet

Le contexte est la section qui présente l'environnement et les circonstances dans lesquelles s'inscrit votre stage.

Éléments à inclure :

1. L'entreprise/organisation :
   • Secteur d'activité
   • Taille et structure
   • Positionnement sur le marché

2. Le projet existant ou à venir :
   • Description du projet global
   • État actuel du projet à votre arrivée
   • Phases déjà réalisées ou à venir

3. L'équipe de travail :
   • Composition de l'équipe (développeurs, chefs de projet, etc.)
   • Votre position dans l'équipe
   • Organisation du travail (méthodologie utilisée)

4. Le besoin identifié :
   • Pourquoi ce projet existe
   • Quel problème il résout
   • Quels sont les enjeux pour l'entreprise

Conseil : Le contexte doit permettre au lecteur de comprendre pourquoi votre stage a été proposé et dans quel environnement vous avez travaillé.`
      },
      {
        keywords: ['problematique', 'problématique', 'problem'],
        response: `❓ Problématique

La problématique est la question centrale à laquelle votre travail de stage cherche à répondre.

Caractéristiques d'une bonne problématique :
• Formulée sous forme de question
• Claire et spécifique
• Orientée vers une solution
• Mesurable et réaliste

Structure de formulation :
"Comment [action] pour [objectif] dans le contexte de [situation] ?"

Exemples de problématiques :
• "Comment automatiser la gestion des stocks pour réduire les ruptures de 50% ?"
• "Comment améliorer l'expérience utilisateur du portail client pour augmenter le taux de fidélisation ?"

Liens avec le rapport :
• La problématique découle du contexte
• Elle justifie les objectifs de votre stage
• Les travaux réalisés y répondent
• Le bilan évalue si elle a été résolue`
      },
      {
        keywords: ['besoin fonctionnel', 'besoins fonctionnels', 'fonctionnel', 'requirement fonctionnel'],
        response: `✅ Besoins Fonctionnels

Les besoins fonctionnels décrivent CE QUE le système doit faire. Ce sont les fonctionnalités attendues par les utilisateurs.

Caractéristiques :
• Décrivent des actions concrètes
• Sont mesurables et vérifiables
• Répondent à la question "Quoi ?"

Catégories courantes :

📦 Gestion des données :
• Créer, lire, modifier, supprimer (CRUD)
• Rechercher et filtrer
• Importer/exporter

👤 Gestion des utilisateurs :
• S'inscrire et se connecter
• Gérer les profils
• Définir les rôles et permissions

📊 Fonctionnalités métier :
• Gérer les articles/produits
• Gérer les commandes
• Gérer les clients
• Gérer les livraisons

Format de rédaction recommandé :
"Le système doit permettre à [acteur] de [action] afin de [objectif]."

Dans votre rapport : Listez vos besoins fonctionnels dans la section "Travail 1 : Spécification des besoins" (section 1.1)`
      },
      {
        keywords: ['besoin non fonctionnel', 'besoins non fonctionnels', 'non fonctionnel', 'non-fonctionnel', 'nfr'],
        response: `⚙️ Besoins Non Fonctionnels

Les besoins non fonctionnels décrivent COMMENT le système doit fonctionner. Ce sont les critères de qualité et les contraintes techniques.

Catégories principales :

🚀 Performance :
• Temps de réponse < 3 secondes
• Support de X utilisateurs simultanés

🔒 Sécurité :
• Authentification obligatoire
• Chiffrement des données sensibles
• Protection contre les injections SQL

📱 Portabilité :
• Compatible avec les navigateurs modernes
• Responsive design (mobile, tablette, PC)

🔧 Maintenabilité :
• Code documenté
• Architecture modulaire

💪 Fiabilité :
• Disponibilité 99%
• Sauvegarde automatique

🎨 Ergonomie :
• Interface intuitive
• Accessibilité (WCAG)

Dans votre rapport : Section "Travail 1 : Spécification des besoins" (section 1.2)`
      },
      {
        keywords: ['canevas', 'caneva', 'plan du rapport', 'structure rapport', 'template rapport', 'rapport de stage'],
        response: `📄 Canevas de Rédaction du Rapport de Stage (Licence Informatique)

Département Génie Informatique - ISI

📏 Format : 15-30 pages maximum (hors annexes)
⏱️ Soutenance : 10 minutes devant un jury

═══════════════════════════════════════════

📖 CHAPITRE 1 : INTRODUCTION GÉNÉRALE (6 pages max)

1.1 Présentation de l'entreprise/organisation
1.2 Contexte (projet, équipe, environnement)
1.3 Sujet du stage (clair et concis)
1.4 Objectifs du stage (liste des travaux assignés)

═══════════════════════════════════════════

📖 CHAPITRE 2 : TRAVAUX RÉALISÉS (22 pages max)

Travail 1 : Étude/Analyse des besoins
   1.1 Besoins fonctionnels
   1.2 Besoins non fonctionnels

Travail 2 : Conception/Modélisation
   2.1 Choix du langage UML
   2.2 Diagramme de cas d'utilisation
   2.3 Diagramme de classe

Travail 3 : Maquettisation (Design et ergonomie des IHM)

Travail 4 : Implémentation
   1. Environnement technique (outils, technologies)
   2. Réalisation (BDD, interfaces, CRUDs)

Travail 5 : Déploiement

═══════════════════════════════════════════

📖 CHAPITRE 3 : BILAN (2 pages)

• Objectifs atteints / non atteints
• Intérêts personnels (compétences acquises)
• Intérêts pour l'entreprise`
      }
    ];

    // Liste des sujets supportés pour message d'aide
    const supportedTopics = `📚 Sujets sur lesquels je peux vous aider :

Concepts de modélisation :
• UML (Unified Modeling Language)
• Diagramme de classe
• Diagramme de cas d'utilisation (Use Case)
• Diagramme de séquence

Gestion de projet :
• Méthodologie Agile / Scrum

Rédaction du rapport :
• Contexte du projet
• Problématique
• Besoins fonctionnels
• Besoins non fonctionnels
• Canevas / Structure du rapport de stage

💡 Exemples de questions :
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

  // Gérer la touche Entrée (avec Shift pour nouvelle ligne)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Supprimer une conversation
  const handleDeleteConversation = (conversationId: string) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== conversationId));
    if (currentConversationId === conversationId) {
      setCurrentConversationId(null);
    }
  };

  // Filtrer les conversations par recherche
  const filteredConversations = conversations.filter(
    (conv) =>
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.messages.some((msg) => msg.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Formater la date
  const formatDate = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    } else if (days === 1) {
      return "Hier";
    } else if (days < 7) {
      return `Il y a ${days} jours`;
    } else {
      return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
    }
  };

  return (
    <div className="bg-gray-50 flex" style={{ height: "80vh" }}>
      {/* Sidebar - Historique des discussions */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* En-tête du sidebar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary-100 p-2 rounded-lg">
                <Bot className="h-5 w-5 text-primary-700" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Assistant IA</h2>
            </div>
          </div>
          <button
            onClick={handleNewConversation}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nouvelle discussion
          </button>
        </div>

        {/* Recherche */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Liste des conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredConversations.map((conversation) => {
                const isActive = conversation.id === currentConversationId;
                const lastMessage = conversation.messages[conversation.messages.length - 1];
                return (
                  <div
                    key={conversation.id}
                    onClick={() => setCurrentConversationId(conversation.id)}
                    className={`p-4 cursor-pointer transition-colors ${isActive ? "bg-primary-50 border-l-4 border-primary" : "hover:bg-gray-50"
                      }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`font-medium text-sm mb-1 truncate ${isActive ? "text-primary" : "text-gray-900"
                            }`}
                        >
                          {conversation.title.length > 20
                            ? conversation.title.substring(0, 20) + "..."
                            : conversation.title}
                        </h3>
                        {lastMessage && (
                          <p className="text-xs text-gray-500 truncate mb-1">
                            {lastMessage.content.substring(0, 60)}
                            {lastMessage.content.length > 60 ? "..." : ""}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(conversation.lastMessageDate)}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteConversation(conversation.id);
                        }}
                        className="p-1 text-gray-400 hover:text-primary-600 rounded hover:bg-primary-50 ml-2"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Bot className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 mb-2">Aucune discussion</p>
              <p className="text-xs text-gray-500">
                {searchQuery
                  ? "Aucune discussion trouvée"
                  : "Créez une nouvelle discussion pour commencer"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Zone de chat principale */}
      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <>
            {/* En-tête de la conversation */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-center">
              <div className="w-full max-w-4xl">
                <h1 className="text-xl font-bold text-gray-900 truncate">
                  {currentConversation.title.length > 20
                    ? currentConversation.title.substring(0, 20) + "..."
                    : currentConversation.title}
                </h1>
              </div>
            </div>

            {/* Zone de messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6 bg-white flex justify-center">
              <div className="w-full max-w-4xl space-y-6">
                {currentConversation.messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex-shrink-0">
                        <div className="bg-primary-100 p-2 rounded-lg">
                          <Bot className="h-5 w-5 text-primary-700" />
                        </div>
                      </div>
                    )}
                    <div
                      className={`max-w-full sm:max-w-xl lg:max-w-3xl ${message.role === "user" ? "order-2" : ""}`}
                    >
                      <div
                        className={`rounded-lg px-4 py-3 ${message.role === "user"
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-900"
                          }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 px-1">
                        {message.timestamp.toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {message.role === "user" && (
                      <div className="flex-shrink-0 order-3">
                        <div className="bg-gray-200 p-2 rounded-lg">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Indicateur de chargement */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 justify-start"
                  >
                    <div className="flex-shrink-0">
                      <div className="bg-primary-100 p-2 rounded-lg">
                        <Bot className="h-5 w-5 text-primary-700" />
                      </div>
                    </div>
                    <div className="bg-gray-100 rounded-lg px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 text-gray-500 animate-spin" />
                        <span className="text-sm text-gray-600">L'assistant réfléchit...</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Zone de saisie */}
            <div className="bg-white border-t border-gray-200 px-6 py-4">
              <div className="relative max-w-4xl mx-auto">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tapez votre message... (Entrée pour envoyer)"
                  className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none overflow-y-auto"
                  rows={1}
                  style={{
                    minHeight: "40px",
                    maxHeight: "120px",
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                  }}
                  disabled={isLoading}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "auto";
                    const newHeight = Math.min(target.scrollHeight, 120);
                    target.style.height = `${newHeight}px`;
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className={`absolute right-2 bottom-2 flex items-center justify-center rounded-lg transition-colors ${inputMessage.trim() && !isLoading
                    ? "bg-primary text-white hover:bg-primary-700"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  style={{
                    width: "36px",
                    height: "36px",
                  }}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                L'assistant IA peut vous aider avec la méthodologie, la structuration de votre
                mémoire, les sources et références.
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="text-center">
              <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Bienvenue sur l'Assistant IA</h2>
              <p className="text-gray-600 mb-6">
                Créez une nouvelle discussion pour commencer à poser vos questions
              </p>
              <button
                onClick={handleNewConversation}
                className="btn-primary flex items-center gap-2 mx-auto"
              >
                <Plus className="h-4 w-4" />
                Nouvelle discussion
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssistantIA;
