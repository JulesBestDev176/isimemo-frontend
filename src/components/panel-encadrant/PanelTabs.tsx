import React from 'react';
import { MessageSquare, FileText, Users } from 'lucide-react';

interface PanelTabsProps {
  activeTab: 'messages' | 'taches' | 'dossiers';
  onTabChange: (tab: 'messages' | 'taches' | 'dossiers') => void;
  unreadMessagesCount: number;
  tachesCount: number;
  dossiersCount: number;
}

export const PanelTabs: React.FC<PanelTabsProps> = ({
  activeTab,
  onTabChange,
  unreadMessagesCount,
  tachesCount,
  dossiersCount
}) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex">
        <button
          onClick={() => onTabChange('messages')}
          className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'messages'
              ? 'border-primary text-primary bg-white'
              : 'border-transparent text-slate-500 hover:text-primary-700 bg-slate-50'
          }`}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Messages
          {unreadMessagesCount > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-primary-50 text-primary-700">
              {unreadMessagesCount}
            </span>
          )}
        </button>
        <button
          onClick={() => onTabChange('taches')}
          className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'taches'
              ? 'border-primary text-primary bg-white'
              : 'border-transparent text-slate-500 hover:text-primary-700 bg-slate-50'
          }`}
        >
          <FileText className="h-4 w-4 mr-2" />
          Tâches communes
          <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-slate-200 text-slate-600">
            {tachesCount}
          </span>
        </button>
        <button
          onClick={() => onTabChange('dossiers')}
          className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'dossiers'
              ? 'border-primary text-primary bg-white'
              : 'border-transparent text-slate-500 hover:text-primary-700 bg-slate-50'
          }`}
        >
          <Users className="h-4 w-4 mr-2" />
          Dossiers étudiants
          <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-slate-200 text-slate-600">
            {dossiersCount}
          </span>
        </button>
      </nav>
    </div>
  );
};

