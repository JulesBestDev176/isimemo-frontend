import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Send, Paperclip, Smile } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'encadrant';
  timestamp: Date;
  isRead: boolean;
}

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Bonjour, j\'ai une question concernant mon projet de fin d\'études.',
      sender: 'user',
      timestamp: new Date('2024-01-15T10:30:00'),
      isRead: true
    },
    {
      id: '2',
      content: 'Bonjour ! Je suis là pour vous aider. Pouvez-vous me donner plus de détails sur votre question ?',
      sender: 'encadrant',
      timestamp: new Date('2024-01-15T10:35:00'),
      isRead: true
    },
    {
      id: '3',
      content: 'Je travaille sur l\'analyse des données et j\'aimerais discuter de la méthodologie.',
      sender: 'user',
      timestamp: new Date('2024-01-15T10:40:00'),
      isRead: false
    }
  ]);

  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        content: newMessage,
        sender: 'user',
        timestamp: new Date(),
        isRead: false
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-2">Communiquez avec votre encadrant</p>
      </div>

      <Card className="h-[600px] flex flex-col">
        <CardHeader className="border-b bg-gray-50">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src="/api/placeholder/40/40" />
              <AvatarFallback>DR</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">Dr. Martin Dubois</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">Encadrant</Badge>
                <span className="text-xs text-green-600">● En ligne</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-[450px] p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-primary-foreground/70' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <Textarea
                  placeholder="Tapez votre message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="min-h-[60px] resize-none"
                  rows={2}
                />
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Smile className="h-4 w-4" />
                </Button>
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Messages; 