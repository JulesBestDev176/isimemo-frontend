// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type NotificationStatus = 'unread' | 'read';
export type NotificationPriority = 'normal' | 'urgent';
export type NotificationCategory = 'général' | 'mémoire' | 'soutenance' | 'ressource' | 'agenda';

export interface Notification {
  id: number;
  title: string;
  message: string;
  date: string;
  status: NotificationStatus;
  priority: NotificationPriority;
  category: NotificationCategory;
  source: string;
}

// ============================================================================
// MOCKS
// ============================================================================

export const mockNotifications: Notification[] = [
  {
    id: 1,
    title: "Validation du dossier de mémoire",
    message: "Votre dossier de mémoire a été validé par votre encadrant. Vous pouvez désormais déposer votre version finale.",
    date: "2025-03-15T09:30:00Z",
    status: "unread",
    priority: "normal",
    category: "mémoire",
    source: "Encadrant pédagogique"
  },
  {
    id: 2,
    title: "Soutenance planifiée",
    message: "Votre soutenance est programmée le 28 mars 2025 à 10h00. Merci de confirmer votre disponibilité et de préparer votre présentation.",
    date: "2025-03-14T16:10:00Z",
    status: "unread",
    priority: "urgent",
    category: "soutenance",
    source: "Jury de soutenance"
  },
  {
    id: 3,
    title: "Nouvelle ressource disponible",
    message: "Un nouveau canevas de mémoire est disponible dans la médiathèque. Consultez-le pour structurer votre rapport.",
    date: "2025-03-12T11:45:00Z",
    status: "read",
    priority: "normal",
    category: "ressource",
    source: "Médiathèque ISIMemo"
  },
  {
    id: 4,
    title: "Rappel de réunion avec l'encadrant",
    message: "Votre réunion hebdomadaire avec l'encadrant est prévue demain à 14h00. N'oubliez pas de partager l'avancement de votre travail.",
    date: "2025-03-10T08:20:00Z",
    status: "read",
    priority: "normal",
    category: "agenda",
    source: "Encadrant pédagogique"
  },
  {
    id: 5,
    title: "Notification importante",
    message: "L'équipe académique vous rappelle que la date limite de dépôt des mémoires est fixée au 20 mars 2025.",
    date: "2025-03-08T17:05:00Z",
    status: "unread",
    priority: "urgent",
    category: "général",
    source: "Administration ISIMemo"
  },
  {
    id: 6,
    title: "Retour sur votre dernier dépôt",
    message: "Votre encadrant a laissé un commentaire sur votre dernière version du mémoire. Consultez-le pour apporter les corrections nécessaires.",
    date: "2025-03-06T19:15:00Z",
    status: "read",
    priority: "normal",
    category: "mémoire",
    source: "Encadrant pédagogique"
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getNotificationById = (id: number): Notification | undefined => {
  return mockNotifications.find(n => n.id === id);
};

export const getNotificationsNonLues = (): Notification[] => {
  return mockNotifications.filter(n => n.status === 'unread');
};

export const getNotificationsUrgentes = (): Notification[] => {
  return mockNotifications.filter(n => n.priority === 'urgent' && n.status === 'unread');
};

export const getNotificationsParCategorie = (category: NotificationCategory): Notification[] => {
  return mockNotifications.filter(n => n.category === category);
};
