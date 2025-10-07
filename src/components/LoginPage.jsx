import React, { useState, useRef, useEffect } from 'react';
import { Info, HelpCircle, X, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

const LoginPage = ({ onLogin, language, setLanguage, t }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showInfoAccordion, setShowInfoAccordion] = useState(false);
  const [currentVideo, setCurrentVideo] = useState('');
  const dropdownRef = useRef(null);

  // Software version
  const APP_VERSION = "1.2.0";
  const BUILD_DATE = "October 2025";

  // Background videos
  const backgroundVideos = [
    '/videos/factory-1.mp4',
    '/videos/renewable-energy.mp4',
    '/videos/carbon-emissions.mp4'
  ];

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

  // Select random background video on component mount
  useEffect(() => {
    const randomVideo = backgroundVideos[Math.floor(Math.random() * backgroundVideos.length)];
    setCurrentVideo(randomVideo);
  }, []);

  // Handle video loading errors - fallback to gradient background
  const handleVideoError = () => {
    console.log('Video loading failed, using gradient background');
    setCurrentVideo('');
  };

  // European languages with flags (abbreviated for login)
  const languages = [
    { code: 'en', name: 'EN', flag: '/flags/gb.svg' },
    { code: 'de', name: 'DE', flag: '/flags/de.svg' },
    { code: 'tr', name: 'TR', flag: '/flags/tr.svg' },
    { code: 'fr', name: 'FR', flag: '/flags/fr.svg' },
    { code: 'es', name: 'ES', flag: '/flags/es.svg' },
    { code: 'it', name: 'IT', flag: '/flags/it.svg' },
    { code: 'nl', name: 'NL', flag: '/flags/nl.svg' },
    { code: 'pt', name: 'PT', flag: '/flags/pt.svg' },
    { code: 'pl', name: 'PL', flag: '/flags/pl.svg' },
    { code: 'sv', name: 'SV', flag: '/flags/se.svg' },
    { code: 'da', name: 'DA', flag: '/flags/dk.svg' },
    { code: 'no', name: 'NO', flag: '/flags/no.svg' },
    { code: 'fi', name: 'FI', flag: '/flags/fi.svg' },
    { code: 'cs', name: 'CS', flag: '/flags/cz.svg' },
    { code: 'sk', name: 'SK', flag: '/flags/sk.svg' },
    { code: 'hu', name: 'HU', flag: '/flags/hu.svg' },
    { code: 'ro', name: 'RO', flag: '/flags/ro.svg' },
    { code: 'bg', name: 'BG', flag: '/flags/bg.svg' },
    { code: 'hr', name: 'HR', flag: '/flags/hr.svg' },
    { code: 'sl', name: 'SI', flag: '/flags/si.svg' },
    { code: 'lt', name: 'LT', flag: '/flags/lt.svg' },
    { code: 'lv', name: 'LV', flag: '/flags/lv.svg' },
    { code: 'et', name: 'ET', flag: '/flags/ee.svg' },
    { code: 'mt', name: 'MT', flag: '/flags/mt.svg' },
    { code: 'ga', name: 'GA', flag: '/flags/ie.svg' },
    { code: 'cy', name: 'CY', flag: '/flags/cy.svg' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode);
    setIsLanguageDropdownOpen(false);
  };

  const handleLogin = async () => {
    console.log('LoginPage handleLogin clicked!');
    setError('');
    
    if (!email || !password) {
      console.log('Email or password missing:', email, password);
      setError(t.requiredField);
      return;
    }
    
    if (!email.includes('@')) {
      console.log('Invalid email format:', email);
      setError(t.emailValidation);
      return;
    }
    
    console.log('About to call onLogin with:', email, password);
    try {
      await onLogin(email, password);
      console.log('onLogin completed successfully');
    } catch (error) {
      console.error('Login error in LoginPage:', error);
      setError('Login failed. Please try again.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className={`min-h-screen relative flex items-center justify-center p-4 ${!currentVideo ? 'bg-gradient-to-br from-teal-500 to-blue-600' : ''}`}>
      {/* Background Video */}
      {currentVideo && (
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          loop
          muted
          playsInline
          onError={handleVideoError}
        >
          <source src={currentVideo} type="video/mp4" />
        </video>
      )}
      
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
      
      {/* Login Form */}
      <div className="relative z-20 bg-white rounded-lg shadow-2xl p-8 w-full max-w-md backdrop-blur-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <svg width="40" height="40" viewBox="0 0 100 100" className="mb-1">
                <path d="M20 20 L20 80 Q20 85 25 85 L30 85 Q35 85 35 80 L35 40 Q35 35 40 35 L45 35" stroke="#dc2626" strokeWidth="6" fill="none" strokeLinecap="round"/>
                <path d="M30 20 L30 80 Q30 85 35 85 L40 85 Q45 85 45 80 L45 40 Q45 35 50 35 L55 35" stroke="#dc2626" strokeWidth="6" fill="none" strokeLinecap="round"/>
                <path d="M40 20 L40 80 Q40 85 45 85 L50 85 Q55 85 55 80 L55 40 Q55 35 60 35 L65 35" stroke="#dc2626" strokeWidth="6" fill="none" strokeLinecap="round"/>
              </svg>
              <span className="text-2xl font-bold text-red-600 tracking-wider">KREA</span>
            </div>
          </div>
          
          {/* Custom Language Dropdown for Login */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              className="flex items-center gap-2 border rounded px-2 py-1 text-sm bg-white hover:bg-gray-50 transition-colors min-w-[80px] shadow-sm"
            >
              <img 
                src={currentLanguage.flag} 
                alt={currentLanguage.name}
                className="w-5 h-3 object-cover rounded-sm border border-gray-300 shadow-sm"
              />
              <span>{currentLanguage.name}</span>
              <svg className={`w-4 h-4 transition-transform ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isLanguageDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto z-50 min-w-[120px]">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      lang.code === language ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    <img 
                      src={lang.flag} 
                      alt={lang.name}
                      className="w-6 h-4 object-cover rounded-sm border border-gray-300 shadow-sm flex-shrink-0"
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
        </div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">{t.appName}</h1>
        <p className="text-gray-600 mb-8 text-sm">{t.description}</p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.email}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="user@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.password}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
          <button
            onClick={handleLogin}
            className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition font-medium"
          >
            {t.signIn}
          </button>
          <div className="mt-4 border border-blue-200 rounded-lg overflow-hidden">
            {/* Accordion Header */}
            <button
              onClick={() => setShowInfoAccordion(!showInfoAccordion)}
              className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Info size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  {t.sessionInfo || 'Session Information'}
                </span>
              </div>
              {showInfoAccordion ? (
                <ChevronUp size={16} className="text-blue-600" />
              ) : (
                <ChevronDown size={16} className="text-blue-600" />
              )}
            </button>
            
            {/* Accordion Content */}
            {showInfoAccordion && (
              <div className="p-3 bg-white border-t border-blue-200">
                <p className="text-xs text-blue-800 mb-2">
                  <strong>ℹ️ {t.noteLabel}</strong> {t.dataSessionNote}
                </p>
                <p className="text-xs text-blue-600">
                  <strong>{t.demoAccounts}</strong> test@acme.com, user@company.com, admin@cbam.eu
                </p>
              </div>
            )}
          </div>

          {/* Version and Help Section */}
          <div className="mt-4 flex flex-col items-center space-y-2">
            <p className="text-xs text-gray-500">
              {t.version} {APP_VERSION} - {BUILD_DATE}
            </p>
            
            <div className="flex space-x-4">
              <button
                onClick={() => setShowAbout(true)}
                className="flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Info className="w-3 h-3 mr-1" />
                {t.about}
              </button>
              
              <button
                onClick={() => setShowHelp(true)}
                className="flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors"
              >
                <HelpCircle className="w-3 h-3 mr-1" />
                {t.help}
              </button>
            </div>
          </div>
        </div>

        {/* About Modal */}
        {showAbout && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">{t.about}</h2>
                <button
                  onClick={() => setShowAbout(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-800">{t.softwareInfo}</h3>
                  <p className="text-sm text-gray-600">{t.cbamReportingApp}</p>
                  <p className="text-xs text-gray-500 mt-1">{t.version} {APP_VERSION} - {BUILD_DATE}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800">{t.features}</h3>
                  <ul className="text-sm text-gray-600 list-disc list-inside">
                    <li>{t.feature1}</li>
                    <li>{t.feature2}</li>
                    <li>{t.feature3}</li>
                    <li>{t.feature4}</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800">{t.supportedCountries}</h3>
                  <p className="text-sm text-gray-600">{t.euCountries}</p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowAbout(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  {t.close}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Help Modal */}
        {showHelp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">{t.help}</h2>
                <button
                  onClick={() => setShowHelp(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800">{t.cbamResources}</h3>
                  <p className="text-sm text-gray-600 mb-3">{t.resourcesDescription}</p>
                </div>
                
                <div className="space-y-2">
                  <a
                    href="https://en.wikipedia.org/wiki/Carbon_border_adjustment"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800 text-sm transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {t.wikipediaLink}
                  </a>
                  
                  <a
                    href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32023R0956"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800 text-sm transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {t.eurLexLink}
                  </a>
                  
                  <a
                    href="https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism_en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800 text-sm transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {t.euCommissionLink}
                  </a>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded">
                  <p className="text-xs text-blue-800">{t.helpNote}</p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowHelp(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  {t.close}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;