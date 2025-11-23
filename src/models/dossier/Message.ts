// ============================================================================
// TYPES & INTERFACES
// ============================================================================

import type { Encadrement } from './Encadrement';

export enum TypeMessage {
  TEXTE = 'TEXTE',
  FICHIER = 'FICHIER',
  SYSTEME = 'SYSTEME'
}

export interface Message {
  idMessage: string;
  contenu: string;
  dateEnvoi: Date;
  typeMessage: TypeMessage;
  // Relations
  encadrement?: Encadrement;
  emetteur?: string; // Utilisateur ID
}

// ============================================================================
// MOCKS
// ============================================================================

export const mockMessages: Message[] = [
  {
    idMessage: 'msg-1',
    contenu: 'Bonjour, j\'ai relu votre chapitre 2. Il est très bien structuré. Vous pouvez passer au chapitre 3.',
    dateEnvoi: new Date('2025-01-28T10:30:00'),
    typeMessage: TypeMessage.TEXTE
  },
  {
    idMessage: 'msg-2',
    contenu: 'N\'oubliez pas de déposer le chapitre 3 avant le 5 février.',
    dateEnvoi: new Date('2025-01-29T14:15:00'),
    typeMessage: TypeMessage.TEXTE
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getMessageById = (id: string): Message | undefined => {
  return mockMessages.find(m => m.idMessage === id);
};
