import React, { useState } from 'react';

const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [newsletter, setNewsletter] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
              <div>
      <h1 className="text-2xl font-bold mb-6">Paramètres</h1>
      <div className="max-w-2xl mx-auto bg-white border border-gray-200 p-6 space-y-8">
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Préférences générales</h2>
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-700">Notifications</span>
            <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                checked={notifications}
                onChange={() => setNotifications(v => !v)}
                className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-600">Activer</span>
                  </label>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-700">Recevoir la newsletter</span>
            <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                checked={newsletter}
                onChange={() => setNewsletter(v => !v)}
                className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-600">Oui</span>
                </label>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Thème</span>
              <select
              value={theme}
              onChange={e => setTheme(e.target.value as 'light' | 'dark')}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
            >
              <option value="light">Clair</option>
              <option value="dark">Sombre</option>
              </select>
            </div>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Sécurité</h2>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Nouveau mot de passe
              </label>
                <input
              type="password"
              id="password"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nouveau mot de passe"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password-confirm" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmer le mot de passe
                </label>
                  <input
              type="password"
              id="password-confirm"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Confirmer le mot de passe"
            />
          </div>
          <div className="flex justify-end">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Enregistrer
              </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;