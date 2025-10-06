import React, { useContext } from 'react';
import { User } from 'lucide-react';
import { AppContext } from '../App';

const Header = ({ user, language, setLanguage }) => {
  const { t } = useContext(AppContext);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? t.goodMorning : hour < 18 ? t.goodAfternoon : t.goodEvening;

  return (
    <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">{new Date().toLocaleDateString(language === 'de' ? 'de-DE' : language === 'tr' ? 'tr-TR' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <h2 className="text-xl font-semibold text-gray-800">{greeting}, {user?.name || 'User'}</h2>
        <p className="text-xs text-gray-500">{user?.email}</p>
      </div>
      <div className="flex items-center gap-4">
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
          className="border rounded px-3 py-1.5 text-sm bg-white"
        >
          <option value="en">English</option>
          <option value="de">Deutsch</option>
          <option value="tr">Türkçe</option>
        </select>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <button className="p-2 rounded-full bg-teal-600 text-white">
            <User size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;