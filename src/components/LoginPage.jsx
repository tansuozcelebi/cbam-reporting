import React, { useState } from 'react';

const LoginPage = ({ onLogin, language, setLanguage, t }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    setError('');
    
    if (!email || !password) {
      setError(t.requiredField);
      return;
    }
    
    if (!email.includes('@')) {
      setError(t.emailValidation);
      return;
    }
    
    onLogin(email, password);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
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
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="en">EN</option>
            <option value="de">DE</option>
            <option value="tr">TR</option>
          </select>
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
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              <strong>ℹ️ {t.noteLabel}</strong> {t.dataSessionNote}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              <strong>{t.demoAccounts}</strong> test@acme.com, user@company.com, admin@cbam.eu
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;