import React from 'react';
import { Video, MapPin, FileText, MessageSquare, Download, Check } from 'lucide-react';
import { formatDateTime } from './utils';

export interface Message {
  id: number;
  expediteur: 'encadrant' | 'etudiant';
  contenu: string;
  date: string;
  lu: boolean;
  type?: 'texte' | 'reunion-meet' | 'presentiel' | 'document';
  titre?: string;
  lienMeet?: string;
  lieu?: string;
  dateRendezVous?: string;
  heureRendezVous?: string;
  nomDocument?: string;
  cheminDocument?: string;
  tailleDocument?: string;
}

export type { Message as MessageType };

interface MessageItemProps {
  message: Message;
  onCopyLink?: (link: string, messageId: number) => void;
  copiedLinkId?: number | null;
}

const getTypeMessageColor = (type: string) => {
  switch (type) {
    case 'texte': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'reunion-meet': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'presentiel': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'document': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getTypeMessageIcon = (type: string) => {
  switch (type) {
    case 'texte': return <MessageSquare className="h-4 w-4" />;
    case 'reunion-meet': return <Video className="h-4 w-4" />;
    case 'presentiel': return <MapPin className="h-4 w-4" />;
    case 'document': return <FileText className="h-4 w-4" />;
    default: return <MessageSquare className="h-4 w-4" />;
  }
};

export const MessageItem: React.FC<MessageItemProps> = ({ message, onCopyLink, copiedLinkId }) => {
  const isEncadrant = message.expediteur === 'encadrant';

  return (
    <div
      className={`flex ${isEncadrant ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[70%] p-4 border border-gray-200 ${
          isEncadrant
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            {isEncadrant ? 'Vous' : 'Étudiant'}
          </span>
          <span className={`text-xs ${isEncadrant ? 'text-white/80' : 'text-gray-500'}`}>
            {formatDateTime(message.date)}
          </span>
        </div>

        {message.type && (
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 text-xs rounded-full border flex items-center gap-1 ${
              isEncadrant 
                ? 'bg-white/20 text-white border-white/30' 
                : getTypeMessageColor(message.type)
            }`}>
              {getTypeMessageIcon(message.type)}
              {message.type === 'reunion-meet' ? 'Réunion Meet' : 
               message.type === 'presentiel' ? 'Présentiel' :
               message.type === 'document' ? 'Document PDF' : 'Texte'}
            </span>
          </div>
        )}

        {message.titre && (
          <h4 className={`font-semibold mb-2 ${isEncadrant ? 'text-white' : 'text-gray-900'}`}>
            {message.titre}
          </h4>
        )}

        <p className="text-sm mb-3">{message.contenu}</p>

        {message.lienMeet && (
          <div className={`${isEncadrant ? 'bg-white/10' : 'bg-white'} border border-gray-200 p-3 mt-3 rounded`}>
            <div className="flex items-center space-x-2 mb-2">
              <Video className={`h-4 w-4 ${isEncadrant ? 'text-white' : 'text-primary'}`} />
              <h5 className={`font-medium text-sm ${isEncadrant ? 'text-white' : 'text-gray-900'}`}>
                Détails de la réunion
              </h5>
            </div>
            <div className="space-y-2 text-xs">
              {message.dateRendezVous && (
                <p className={isEncadrant ? 'text-white/90' : 'text-gray-700'}>
                  <span className="font-medium">Date:</span> {message.dateRendezVous}
                  {message.heureRendezVous && ` à ${message.heureRendezVous}`}
                </p>
              )}
              <div className="pt-2 border-t border-gray-200">
                <p className={`font-medium mb-2 ${isEncadrant ? 'text-white' : 'text-gray-900'}`}>
                  Lien de la réunion:
                </p>
                <div className="flex items-center space-x-2 flex-wrap">
                  <a 
                    href={message.lienMeet} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`${isEncadrant ? 'text-white underline' : 'text-primary hover:text-primary-700 underline'} break-all flex-1 min-w-0`}
                  >
                    {message.lienMeet}
                  </a>
                  {onCopyLink && (
                    <button 
                      onClick={() => onCopyLink(message.lienMeet || '', message.id)}
                      className={`px-2 py-1 text-xs rounded flex-shrink-0 transition-colors flex items-center space-x-1 ${
                        copiedLinkId === message.id
                          ? 'bg-green-600 text-white'
                          : isEncadrant
                          ? 'bg-white/20 text-white hover:bg-white/30'
                          : 'bg-primary text-white hover:bg-primary-700'
                      }`}
                      title="Copier le lien"
                    >
                      {copiedLinkId === message.id ? (
                        <>
                          <Check className="h-3 w-3" />
                          <span>Copié!</span>
                        </>
                      ) : (
                        <span>Copier</span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {message.lieu && !message.lienMeet && (
          <div className={`${isEncadrant ? 'bg-white/10' : 'bg-white'} border border-gray-200 p-3 mt-3 rounded`}>
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className={`h-4 w-4 ${isEncadrant ? 'text-white' : 'text-primary'}`} />
              <h5 className={`font-medium text-sm ${isEncadrant ? 'text-white' : 'text-gray-900'}`}>
                Détails du rendez-vous
              </h5>
            </div>
            <div className="space-y-1 text-xs">
              {message.dateRendezVous && (
                <p className={isEncadrant ? 'text-white/90' : 'text-gray-700'}>
                  <span className="font-medium">Date:</span> {message.dateRendezVous}
                  {message.heureRendezVous && ` à ${message.heureRendezVous}`}
                </p>
              )}
              <p className={isEncadrant ? 'text-white/90' : 'text-gray-700'}>
                <span className="font-medium">Lieu:</span> {message.lieu}
              </p>
            </div>
          </div>
        )}

        {message.nomDocument && (
          <div className={`${isEncadrant ? 'bg-white/10' : 'bg-white'} border border-gray-200 p-3 mt-3 rounded`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${isEncadrant ? 'bg-white/20' : 'bg-primary'} rounded-lg flex items-center justify-center`}>
                  <FileText className={`h-5 w-5 ${isEncadrant ? 'text-white' : 'text-white'}`} />
                </div>
                <div>
                  <h5 className={`font-medium text-sm ${isEncadrant ? 'text-white' : 'text-gray-900'}`}>
                    {message.nomDocument}
                  </h5>
                  {message.tailleDocument && (
                    <p className={`text-xs ${isEncadrant ? 'text-white/80' : 'text-gray-600'}`}>
                      {message.tailleDocument}
                    </p>
                  )}
                </div>
              </div>
              {message.cheminDocument && (
                <button 
                  onClick={() => window.open(message.cheminDocument, '_blank')}
                  className={`px-2 py-1.5 ${isEncadrant ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-primary text-white hover:bg-primary-700'} rounded transition-colors flex items-center space-x-2 text-xs`}
                >
                  <Download className="h-3 w-3" />
                  <span>Télécharger</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

