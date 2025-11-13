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
      title: "Discussion sur les soutenances",
      messages: [
        {
          id: 1,
          type: 'bot',
          content: "Bonjour ! Je suis votre assistant virtuel du département. Comment puis-je vous aider aujourd'hui ?",
          timestamp: new Date('2024-07-10 10:00'),
        },
        {
          id: 2,
          type: 'user',
          content: "J'aimerais des informations sur les soutenances",
          timestamp: new Date('2024-07-10 10:05'),
        },
        {
          id: 3,
          type: 'bot',
          content: "Je peux vous aider avec les informations sur les soutenances. Voici les étapes principales :\n\n1. Dépôt du mémoire\n2. Validation par le directeur\n3. Planification de la soutenance\n4. Présentation devant le jury\n\nAvez-vous des questions spécifiques sur l'une de ces étapes ?",
          timestamp: new Date('2024-07-10 10:06'),
        }
      ],
      lastMessage: "Je peux vous aider avec les informations sur les soutenances...",
      timestamp: new Date('2024-07-10 10:06'),
      isRead: true,
    },
    {
      id: 2,
      title: "Gestion des étudiants",
      messages: [
        {
          id: 1,
          type: 'bot',
          content: "Bonjour ! Comment puis-je vous aider ?",
          timestamp: new Date('2024-07-09 14:30'),
        }
      ],
      lastMessage: "Bonjour ! Comment puis-je vous aider ?",
      timestamp: new Date('2024-07-09 14:30'),
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
      const botResponses = [
        "Je peux vous aider à gérer vos cours et classes.",
        "Vous pouvez me demander des informations sur les étudiants et professeurs.",
        "Je peux vous rappeler les événements à venir dans le calendrier.",
        "Pour les soutenances et mémoires, je peux vous fournir les étapes à suivre.",
        "N'hésitez pas à me demander les dernières statistiques du département.",
      ];
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot' as const,
        content: botResponses[Math.floor(Math.random() * botResponses.length)],
        timestamp: new Date(),
      };
      
      const finalConversation: Conversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, botMessage],
        lastMessage: botMessage.content,
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
          content: "Bonjour ! Je suis votre assistant virtuel du département. Comment puis-je vous aider aujourd'hui ?",
          timestamp: new Date(),
        }
      ],
      lastMessage: "Bonjour ! Je suis votre assistant virtuel du département...",
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
              className={`group relative p-3 mb-1 cursor-pointer rounded-lg transition-all duration-200 ${
                currentConversation?.id === conversation.id 
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
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentConversation?.id === conversation.id ? 'bg-white/20' : 'bg-primary/10'
                }`}>
                  <MessageSquare className={`h-4 w-4 ${
                    currentConversation?.id === conversation.id ? 'text-white' : 'text-primary'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`text-sm font-semibold truncate ${
                      currentConversation?.id === conversation.id ? 'text-white' : 'text-gray-900'
                    }`}>
                      {conversation.title}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        deleteConversation(conversation.id);
                      }}
                      className={`opacity-0 group-hover:opacity-100 p-1.5 rounded-md transition-all ${
                        currentConversation?.id === conversation.id 
                          ? 'text-white/70 hover:text-white hover:bg-white/20' 
                          : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                      }`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                  <p className={`text-xs leading-relaxed line-clamp-2 ${
                    currentConversation?.id === conversation.id ? 'text-white/70' : 'text-gray-500'
                  }`}>
                    {conversation.lastMessage}
                  </p>
                  <p className={`text-xs mt-2 ${
                    currentConversation?.id === conversation.id ? 'text-white/60' : 'text-gray-400'
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
                      Assistant
                    </span>
                  </h1>
                  <p className="text-sm text-gray-500">ISIMemo Assistant virtuel</p>
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
                  className={`w-full ${
                    message.type === 'user' ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.type === 'user' 
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
                          {message.type === 'user' ? 'Vous' : 'Assistant'}
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
                          Assistant
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
                    placeholder="Tapez votre message..."
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