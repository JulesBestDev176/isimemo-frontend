import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Plus, Trash2, MessageSquare, Menu, X, Search, Users, GraduationCap, UserCheck, Eye } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Message {
  id: number;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isRead?: boolean;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  type: 'encadrant' | 'etudiant_licence' | 'etudiant_master' | 'etudiant_doctorat' | 'visiteur';
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
  isOnline?: boolean;
}

interface VisitorMessage {
  id: string;
  fullName: string;
  email: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

const Messagerie: React.FC = () => {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'conversations' | 'visiteurs'>('conversations');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedVisitorMessage, setSelectedVisitorMessage] = useState<VisitorMessage | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  
  // Données de démonstration
  const [contacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Dr. Amadou Fall',
      email: 'amadou.fall@isi.sn',
      type: 'encadrant',
      lastMessage: 'Nous devons discuter de votre projet',
      lastMessageTime: new Date('2024-07-10 14:30'),
      unreadCount: 2,
      isOnline: true
    },
    {
      id: '2',
      name: 'Fatou Diop',
      email: 'fatou.diop@etudiant.isi.sn',
      type: 'etudiant_master',
      lastMessage: 'Merci pour les corrections',
      lastMessageTime: new Date('2024-07-10 12:15'),
      unreadCount: 0,
      isOnline: false
    },
    {
      id: '3',
      name: 'Moussa Sy',
      email: 'moussa.sy@etudiant.isi.sn',
      type: 'etudiant_licence',
      lastMessage: 'Pouvez-vous m\'aider avec l\'exercice 3?',
      lastMessageTime: new Date('2024-07-09 16:45'),
      unreadCount: 1,
      isOnline: true
    },
    {
      id: '4',
      name: 'Dr. Aissatou Ndiaye',
      email: 'aissatou.ndiaye@isi.sn',
      type: 'encadrant',
      lastMessage: 'La soutenance est prévue pour jeudi',
      lastMessageTime: new Date('2024-07-09 10:20'),
      unreadCount: 0,
      isOnline: true
    }
  ]);

  const [visitorMessages] = useState<VisitorMessage[]>([
    {
      id: 'v1',
      fullName: 'Mamadou Ba',
      email: 'mamadou.ba@gmail.com',
      message: 'Bonjour, je souhaiterais avoir des informations sur les conditions d\'admission en Master. Quels sont les prérequis et les dates limites d\'inscription?',
      timestamp: new Date('2024-07-10 15:30'),
      isRead: false
    },
    {
      id: 'v2',
      fullName: 'Aminata Sow',
      email: 'aminata.sow@yahoo.fr',
      message: 'Salut! Je suis une ancienne étudiante et j\'aimerais savoir s\'il y a des opportunités de stage ou d\'emploi disponibles dans votre département.',
      timestamp: new Date('2024-07-09 11:20'),
      isRead: true
    },
    {
      id: 'v3',
      fullName: 'Ousmane Diallo',
      email: 'ousmane.diallo@hotmail.com',
      message: 'Bonjour, je représente une entreprise tech et nous cherchons à établir un partenariat avec votre institution. Pourriez-vous me dire qui contacter?',
      timestamp: new Date('2024-07-08 14:45'),
      isRead: false
    }
  ]);

  const [conversations, setConversations] = useState<{[key: string]: Message[]}>({
    '1': [
      {
        id: 1,
        senderId: '1',
        senderName: 'Dr. Amadou Fall',
        content: 'Bonjour, j\'ai examiné votre projet. Il y a quelques points à améliorer.',
        timestamp: new Date('2024-07-10 14:25')
      },
      {
        id: 2,
        senderId: 'me',
        senderName: 'Vous',
        content: 'Merci professeur, quels sont les points à améliorer?',
        timestamp: new Date('2024-07-10 14:27')
      },
      {
        id: 3,
        senderId: '1',
        senderName: 'Dr. Amadou Fall',
        content: 'Nous devons discuter de votre projet en détail. Pouvez-vous passer à mon bureau demain?',
        timestamp: new Date('2024-07-10 14:30')
      }
    ]
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations, selectedContact]);

  const getUserTypeIcon = (type: Contact['type']) => {
    switch (type) {
      case 'encadrant':
        return <UserCheck className="h-4 w-4" />;
      case 'etudiant_licence':
      case 'etudiant_master':
      case 'etudiant_doctorat':
        return <GraduationCap className="h-4 w-4" />;
      case 'visiteur':
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getUserTypeColor = (type: Contact['type']) => {
    switch (type) {
      case 'encadrant':
        return 'text-blue-600 bg-blue-100';
      case 'etudiant_licence':
        return 'text-green-600 bg-green-100';
      case 'etudiant_master':
        return 'text-purple-600 bg-purple-100';
      case 'etudiant_doctorat':
        return 'text-red-600 bg-red-100';
      case 'visiteur':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getUserTypeLabel = (type: Contact['type']) => {
    switch (type) {
      case 'encadrant':
        return 'Encadrant';
      case 'etudiant_licence':
        return 'Licence';
      case 'etudiant_master':
        return 'Master';
      case 'etudiant_doctorat':
        return 'Doctorat';
      case 'visiteur':
        return 'Visiteur';
      default:
        return 'Utilisateur';
    }
  };

  const handleSendMessage = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!input.trim() || !selectedContact) return;
    
    const newMessage: Message = {
      id: Date.now(),
      senderId: 'me',
      senderName: 'Vous',
      content: input,
      timestamp: new Date()
    };

    setConversations(prev => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMessage]
    }));
    
    setInput('');
    setIsTyping(true);

    // Simuler une réponse
    setTimeout(() => {
      const responses = [
        'Merci pour votre message.',
        'Je vais examiner cela et vous revenir.',
        'C\'est une bonne question, laissez-moi réfléchir.',
        'Je vous recontacte bientôt avec plus de détails.',
        'Parfait, nous pouvons organiser une réunion.'
      ];

      const response: Message = {
        id: Date.now() + 1,
        senderId: selectedContact.id,
        senderName: selectedContact.name,
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };

      setConversations(prev => ({
        ...prev,
        [selectedContact.id]: [...(prev[selectedContact.id] || []), response]
      }));
      
      setIsTyping(false);
    }, 2000);
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

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVisitorMessages = visitorMessages.filter(message =>
    message.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${showSidebar ? 'w-80' : 'w-0'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('conversations')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'conversations'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              Conversations
            </button>
            <button
              onClick={() => setActiveTab('visiteurs')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'visiteurs'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Users className="h-4 w-4" />
              Visiteurs
              {visitorMessages.filter(m => !m.isRead).length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center">
                  {visitorMessages.filter(m => !m.isRead).length}
                </span>
              )}
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={activeTab === 'conversations' ? 'Rechercher des contacts...' : 'Rechercher des messages...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'conversations' ? (
            /* Contacts List */
            <div className="p-2">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`group relative p-3 mb-1 cursor-pointer rounded-lg transition-all duration-200 ${
                    selectedContact?.id === contact.id 
                      ? 'bg-primary text-white' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setSelectedContact(contact);
                    setSelectedVisitorMessage(null);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        selectedContact?.id === contact.id ? 'bg-white/20' : getUserTypeColor(contact.type)
                      }`}>
                        {getUserTypeIcon(contact.type)}
                      </div>
                      {contact.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`text-sm font-semibold truncate ${
                          selectedContact?.id === contact.id ? 'text-white' : 'text-gray-900'
                        }`}>
                          {contact.name}
                        </h3>
                        <div className="flex items-center gap-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            selectedContact?.id === contact.id 
                              ? 'bg-white/20 text-white' 
                              : getUserTypeColor(contact.type)
                          }`}>
                            {getUserTypeLabel(contact.type)}
                          </span>
                          {contact.unreadCount && contact.unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center">
                              {contact.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className={`text-xs truncate ${
                        selectedContact?.id === contact.id ? 'text-white/80' : 'text-gray-500'
                      }`}>
                        {contact.lastMessage}
                      </p>
                      <p className={`text-xs mt-1 ${
                        selectedContact?.id === contact.id ? 'text-white/60' : 'text-gray-400'
                      }`}>
                        {contact.lastMessageTime && formatDate(contact.lastMessageTime)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Visitor Messages */
            <div className="p-2">
              {filteredVisitorMessages.map((message) => (
                <div
                  key={message.id}
                  className={`group relative p-3 mb-2 cursor-pointer rounded-lg border transition-all duration-200 ${
                    selectedVisitorMessage?.id === message.id 
                      ? 'bg-primary text-white border-primary' 
                      : message.isRead 
                        ? 'bg-white border-gray-200 hover:bg-gray-50'
                        : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                  }`}
                  onClick={() => {
                    setSelectedVisitorMessage(message);
                    setSelectedContact(null);
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      selectedVisitorMessage?.id === message.id ? 'bg-white/20' : 'bg-gray-200'
                    }`}>
                      <User className={`h-4 w-4 ${
                        selectedVisitorMessage?.id === message.id ? 'text-white' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`text-sm font-semibold truncate ${
                          selectedVisitorMessage?.id === message.id ? 'text-white' : 'text-gray-900'
                        }`}>
                          {message.fullName}
                        </h3>
                        <div className="flex items-center gap-2">
                          {!message.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                          <Eye className={`h-3 w-3 ${
                            selectedVisitorMessage?.id === message.id ? 'text-white/60' : 'text-gray-400'
                          }`} />
                        </div>
                      </div>
                      <p className={`text-xs mb-1 ${
                        selectedVisitorMessage?.id === message.id ? 'text-white/80' : 'text-gray-600'
                      }`}>
                        {message.email}
                      </p>
                      <p className={`text-xs leading-relaxed line-clamp-2 ${
                        selectedVisitorMessage?.id === message.id ? 'text-white/70' : 'text-gray-500'
                      }`}>
                        {message.message}
                      </p>
                      <p className={`text-xs mt-2 ${
                        selectedVisitorMessage?.id === message.id ? 'text-white/60' : 'text-gray-400'
                      }`}>
                        {formatDate(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {showSidebar ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div>
              {selectedContact ? (
                <>
                  <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    {selectedContact.name}
                    <span className={`text-xs px-2 py-1 rounded-full ${getUserTypeColor(selectedContact.type)}`}>
                      {getUserTypeLabel(selectedContact.type)}
                    </span>
                    {selectedContact.isOnline && (
                      <span className="flex items-center gap-1 text-sm text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        En ligne
                      </span>
                    )}
                  </h1>
                  <p className="text-sm text-gray-500">{selectedContact.email}</p>
                </>
              ) : selectedVisitorMessage ? (
                <>
                  <h1 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    {selectedVisitorMessage.fullName}
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                      Visiteur
                    </span>
                  </h1>
                  <p className="text-sm text-gray-500">{selectedVisitorMessage.email}</p>
                </>
              ) : (
                <>
                  <h1 className="text-xl font-semibold text-gray-900">Messagerie</h1>
                  <p className="text-sm text-gray-500">Sélectionnez une conversation</p>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {selectedContact ? (
            <div>
              {(conversations[selectedContact.id] || []).map((message) => (
                <div
                  key={message.id}
                  className={`w-full ${
                    message.senderId === 'me' ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.senderId === 'me' 
                            ? 'bg-gray-600 text-white' 
                            : 'bg-primary text-white'
                        }`}>
                          {message.senderId === 'me' ? (
                            <User className="h-4 w-4" />
                          ) : (
                            getUserTypeIcon(selectedContact.type)
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {message.senderName}
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
                          {getUserTypeIcon(selectedContact.type)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {selectedContact.name}
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
          ) : selectedVisitorMessage ? (
            <div className="max-w-4xl mx-auto p-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {selectedVisitorMessage.fullName}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {formatDate(selectedVisitorMessage.timestamp)} à {formatTime(selectedVisitorMessage.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      {selectedVisitorMessage.email}
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {selectedVisitorMessage.message}
                      </p>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <Eye className="inline h-4 w-4 mr-1" />
                        Message de visiteur - Lecture seule. Vous ne pouvez pas répondre directement.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune conversation sélectionnée
                </h3>
                <p className="text-gray-500">
                  Choisissez un contact ou un message de visiteur pour commencer
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Input Area - Only for regular contacts, not visitors */}
        {selectedContact && (
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
                  onClick={handleSendMessage}
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

export default Messagerie;