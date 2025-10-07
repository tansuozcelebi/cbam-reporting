import React, { useContext, useState, useRef, useEffect } from 'react';
import { User, ChevronDown } from 'lucide-react';
import { AppContext } from '../App';

const Header = ({ user, language, setLanguage }) => {
  const { t } = useContext(AppContext);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? t.goodMorning : hour < 18 ? t.goodAfternoon : t.goodEvening;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsLanguageDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // European languages with flags
  const languages = [
    { code: 'en', name: 'English', flag: '/flags/gb.svg' },
    { code: 'de', name: 'Deutsch', flag: '/flags/de.svg' },
    { code: 'tr', name: 'Türkçe', flag: '/flags/tr.svg' },
    { code: 'fr', name: 'Français', flag: '/flags/fr.svg' },
    { code: 'es', name: 'Español', flag: '/flags/es.svg' },
    { code: 'it', name: 'Italiano', flag: '/flags/it.svg' },
    { code: 'nl', name: 'Nederlands', flag: '/flags/nl.svg' },
    { code: 'pt', name: 'Português', flag: '/flags/pt.svg' },
    { code: 'pl', name: 'Polski', flag: '/flags/pl.svg' },
    { code: 'sv', name: 'Svenska', flag: '/flags/se.svg' },
    { code: 'da', name: 'Dansk', flag: '/flags/dk.svg' },
    { code: 'no', name: 'Norsk', flag: '/flags/no.svg' },
    { code: 'fi', name: 'Suomi', flag: '/flags/fi.svg' },
    { code: 'cs', name: 'Čeština', flag: '/flags/cz.svg' },
    { code: 'sk', name: 'Slovenčina', flag: '/flags/sk.svg' },
    { code: 'hu', name: 'Magyar', flag: '/flags/hu.svg' },
    { code: 'ro', name: 'Română', flag: '/flags/ro.svg' },
    { code: 'bg', name: 'Български', flag: '/flags/bg.svg' },
    { code: 'hr', name: 'Hrvatski', flag: '/flags/hr.svg' },
    { code: 'sl', name: 'Slovenščina', flag: '/flags/si.svg' },
    { code: 'lt', name: 'Lietuvių', flag: '/flags/lt.svg' },
    { code: 'lv', name: 'Latviešu', flag: '/flags/lv.svg' },
    { code: 'et', name: 'Eesti', flag: '/flags/ee.svg' },
    { code: 'mt', name: 'Malti', flag: '/flags/mt.svg' },
    { code: 'ga', name: 'Gaeilge', flag: '/flags/ie.svg' },
    { code: 'cy', name: 'Cymraeg', flag: '/flags/cy.svg' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode);
    setIsLanguageDropdownOpen(false);
  };

  return (
    <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">{new Date().toLocaleDateString(language === 'de' ? 'de-DE' : language === 'tr' ? 'tr-TR' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <h2 className="text-xl font-semibold text-gray-800">{greeting}, {user?.name || 'User'}</h2>
        <p className="text-xs text-gray-500">{user?.email}</p>
      </div>
      <div className="flex items-center gap-4">
        {/* Custom Language Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
            className="flex items-center gap-2 border rounded px-3 py-1.5 text-sm bg-white min-w-[140px] hover:bg-gray-50 transition-colors"
          >
            <img 
              src={currentLanguage.flag} 
              alt={currentLanguage.name}
              className="w-6 h-4 object-cover rounded-sm border border-gray-300 shadow-sm"
            />
            <span className="flex-1 text-left">{currentLanguage.name}</span>
            <ChevronDown size={16} className={`transition-transform ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isLanguageDropdownOpen && (
            <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-50 min-w-[180px]">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                    lang.code === language ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <img 
                    src={lang.flag} 
                    alt={lang.name}
                    className="w-7 h-5 object-cover rounded-sm border border-gray-300 shadow-sm flex-shrink-0"
                  />
                  <span className="flex-1 text-left">{lang.name}</span>
                  {lang.code === language && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
        
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