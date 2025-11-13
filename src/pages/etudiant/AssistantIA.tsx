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

    // TODO: Remplacer par un appel API réel vers le backend
    // Simulation d'une réponse de l'assistant
    setTimeout(() => {
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content:
          "Merci pour votre question. Je traite actuellement votre demande. Dans une version complète, cette réponse viendrait d'un modèle d'IA entraîné pour vous aider avec vos mémoires et recherches académiques.",
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
                    className={`p-4 cursor-pointer transition-colors ${
                      isActive ? "bg-primary-50 border-l-4 border-primary" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`font-medium text-sm mb-1 truncate ${
                            isActive ? "text-primary" : "text-gray-900"
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
                        className={`rounded-lg px-4 py-3 ${
                          message.role === "user"
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
                  className={`absolute right-2 bottom-2 flex items-center justify-center rounded-lg transition-colors ${
                    inputMessage.trim() && !isLoading
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
