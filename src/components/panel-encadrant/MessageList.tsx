import React, { useState, useRef } from 'react';
import { Send, Video, MapPin, FileText, MessageSquare, X, Upload } from 'lucide-react';
import { MessageItem, Message, MessageType } from './MessageItem';
export type { Message, MessageType };

interface MessageListProps {
  messages: Message[];
  onSendMessage: (message: Omit<Message, 'id' | 'date' | 'lu' | 'expediteur'>) => void;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const [messageType, setMessageType] = useState<'texte' | 'reunion-meet' | 'presentiel' | 'document'>('texte');
  const [showTypeForm, setShowTypeForm] = useState(false);
  const [titre, setTitre] = useState('');
  const [lienMeet, setLienMeet] = useState('');
  const [dateRendezVous, setDateRendezVous] = useState('');
  const [heureRendezVous, setHeureRendezVous] = useState('');
  const [lieu, setLieu] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [copiedLinkId, setCopiedLinkId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const messageData: Omit<Message, 'id' | 'date' | 'lu' | 'expediteur'> = {
      contenu: newMessage,
      type: messageType,
      titre: titre.trim() || undefined,
      lienMeet: lienMeet.trim() || undefined,
      dateRendezVous: dateRendezVous || undefined,
      heureRendezVous: heureRendezVous || undefined,
      lieu: lieu.trim() || undefined,
      nomDocument: selectedFile?.name || undefined,
      cheminDocument: selectedFile ? URL.createObjectURL(selectedFile) : undefined,
      tailleDocument: selectedFile ? formatFileSize(selectedFile.size) : undefined,
    };

    onSendMessage(messageData);
    
    // Reset form
    setNewMessage('');
    setTitre('');
    setLienMeet('');
    setDateRendezVous('');
    setHeureRendezVous('');
    setLieu('');
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setMessageType('texte');
    setShowTypeForm(false);
  };

  const handleCopyLink = async (link: string, messageId: number) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedLinkId(messageId);
      setTimeout(() => {
        setCopiedLinkId(null);
      }, 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  const resetTypeForm = () => {
    setLienMeet('');
    setDateRendezVous('');
    setHeureRendezVous('');
    setLieu('');
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTypeChange = (type: 'texte' | 'reunion-meet' | 'presentiel' | 'document') => {
    setMessageType(type);
    resetTypeForm();
    setShowTypeForm(type !== 'texte');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Messages envoyés aux étudiants</h2>
      </div>

      {/* Liste des messages */}
      <div className="space-y-4 max-h-[500px] overflow-y-auto">
        {messages.map((message) => (
          <MessageItem 
            key={message.id} 
            message={message}
            onCopyLink={handleCopyLink}
            copiedLinkId={copiedLinkId}
          />
        ))}
      </div>

      {/* Formulaire d'envoi de message */}
      <div className="border-t border-gray-200 pt-4">
        <div className="space-y-3">
          {/* Sélection du type de message */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Type de message:</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleTypeChange('texte')}
                className={`px-3 py-1.5 text-xs rounded border transition-colors flex items-center gap-1 ${
                  messageType === 'texte'
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <MessageSquare className="h-3 w-3" />
                Texte
              </button>
              <button
                onClick={() => handleTypeChange('reunion-meet')}
                className={`px-3 py-1.5 text-xs rounded border transition-colors flex items-center gap-1 ${
                  messageType === 'reunion-meet'
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Video className="h-3 w-3" />
                Réunion Meet
              </button>
              <button
                onClick={() => handleTypeChange('presentiel')}
                className={`px-3 py-1.5 text-xs rounded border transition-colors flex items-center gap-1 ${
                  messageType === 'presentiel'
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <MapPin className="h-3 w-3" />
                Présentiel
              </button>
              <button
                onClick={() => handleTypeChange('document')}
                className={`px-3 py-1.5 text-xs rounded border transition-colors flex items-center gap-1 ${
                  messageType === 'document'
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <FileText className="h-3 w-3" />
                Document
              </button>
            </div>
          </div>

          {/* Formulaire selon le type */}
          {showTypeForm && (
            <div className="bg-gray-50 border border-gray-200 p-4 rounded space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium text-gray-900">
                  {messageType === 'reunion-meet' && 'Détails de la réunion'}
                  {messageType === 'presentiel' && 'Détails du rendez-vous'}
                  {messageType === 'document' && 'Informations du document'}
                </h4>
                <button
                  onClick={() => {
                    setShowTypeForm(false);
                    resetTypeForm();
                    setMessageType('texte');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Titre (optionnel)</label>
                <input
                  type="text"
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                  placeholder="Titre du message"
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {messageType === 'reunion-meet' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Lien Meet *</label>
                    <input
                      type="url"
                      value={lienMeet}
                      onChange={(e) => setLienMeet(e.target.value)}
                      placeholder="https://meet.google.com/..."
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        value={dateRendezVous}
                        onChange={(e) => setDateRendezVous(e.target.value)}
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Heure</label>
                      <input
                        type="time"
                        value={heureRendezVous}
                        onChange={(e) => setHeureRendezVous(e.target.value)}
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                </>
              )}

              {messageType === 'presentiel' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Lieu *</label>
                    <input
                      type="text"
                      value={lieu}
                      onChange={(e) => setLieu(e.target.value)}
                      placeholder="Salle, Bâtiment..."
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        value={dateRendezVous}
                        onChange={(e) => setDateRendezVous(e.target.value)}
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Heure</label>
                      <input
                        type="time"
                        value={heureRendezVous}
                        onChange={(e) => setHeureRendezVous(e.target.value)}
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                </>
              )}

              {messageType === 'document' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Document *</label>
                  <div className="mt-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      id="document-upload"
                      accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
                    />
                    <label
                      htmlFor="document-upload"
                      className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <Upload className="h-6 w-6 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {selectedFile ? selectedFile.name : 'Cliquez pour téléverser un document'}
                        </span>
                        {selectedFile && (
                          <span className="text-xs text-gray-500">
                            {formatFileSize(selectedFile.size)}
                          </span>
                        )}
                      </div>
                    </label>
                    {selectedFile && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        className="mt-2 text-xs text-red-600 hover:text-red-700"
                      >
                        Supprimer le fichier
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Zone de texte et bouton */}
          <div className="flex gap-2">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Tapez votre message..."
              className="flex-1 px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows={3}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleSend();
                }
              }}
            />
            <button
              onClick={handleSend}
              disabled={!newMessage.trim() || (messageType === 'reunion-meet' && !lienMeet.trim()) || (messageType === 'presentiel' && !lieu.trim()) || (messageType === 'document' && !selectedFile)}
              className="px-3 py-2 bg-primary text-white hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 text-sm"
            >
              <Send className="h-4 w-4" />
              Envoyer
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">Appuyez sur Ctrl+Entrée pour envoyer</p>
      </div>
    </div>
  );
};
