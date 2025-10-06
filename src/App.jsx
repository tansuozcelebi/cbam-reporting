import React, { useState, createContext, useContext } from 'react';
import { translations } from './translations';
import LoginPage from './components/LoginPage';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import InputForm from './components/InputForm';
import ResultsPage from './components/ResultsPage';
import AnalysisPage from './components/AnalysisPage';

// Context for app state
export const AppContext = createContext();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('en');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [currentInputForm, setCurrentInputForm] = useState(null);
  
  // Store data for multiple users
  const [allUserData, setAllUserData] = useState({});
  
  const [entries, setEntries] = useState({
    electricity: [],
    naturalGas: [],
    fuel: [],
    cars: [],
    flights: [],
    publicTransport: [],
    refrigerants: [],
    homeWorkers: []
  });

  const t = translations[language];

  const handleLogin = (email, password) => {
    const userName = email.split('@')[0];
    setUser({ name: userName, email });
    
    // Load user's data if exists
    if (allUserData[email]) {
      setEntries(allUserData[email]);
    } else {
      // Initialize empty data for new user
      const emptyData = {
        electricity: [],
        naturalGas: [],
        fuel: [],
        cars: [],
        flights: [],
        publicTransport: [],
        refrigerants: [],
        homeWorkers: []
      };
      setEntries(emptyData);
      setAllUserData(prev => ({
        ...prev,
        [email]: emptyData
      }));
    }
    
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Save current user's data before logout
    if (user?.email) {
      setAllUserData(prev => ({
        ...prev,
        [user.email]: entries
      }));
    }
    
    setIsLoggedIn(false);
    setUser(null);
    setCurrentPage('dashboard');
  };

  const addEntry = (category, entry) => {
    const newEntries = {
      ...entries,
      [category]: [...entries[category], { ...entry, id: Date.now() }]
    };
    setEntries(newEntries);
    
    // Save to user's data
    if (user?.email) {
      setAllUserData(prev => ({
        ...prev,
        [user.email]: newEntries
      }));
    }
  };

  const updateEntry = (category, id, updatedEntry) => {
    const newEntries = {
      ...entries,
      [category]: entries[category].map(e => e.id === id ? { ...updatedEntry, id } : e)
    };
    setEntries(newEntries);
    
    // Save to user's data
    if (user?.email) {
      setAllUserData(prev => ({
        ...prev,
        [user.email]: newEntries
      }));
    }
  };

  const deleteEntry = (category, id) => {
    const newEntries = {
      ...entries,
      [category]: entries[category].filter(e => e.id !== id)
    };
    setEntries(newEntries);
    
    // Save to user's data
    if (user?.email) {
      setAllUserData(prev => ({
        ...prev,
        [user.email]: newEntries
      }));
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} language={language} setLanguage={setLanguage} t={t} />;
  }

  return (
    <AppContext.Provider value={{ entries, addEntry, updateEntry, deleteEntry, user, language, setLanguage, t }}>
      <div className="flex h-screen bg-gray-50">
        <Sidebar 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage}
          currentInputForm={currentInputForm}
          setCurrentInputForm={setCurrentInputForm}
          onLogout={handleLogout}
          entries={entries}
        />
        <div className="flex-1 overflow-auto">
          <Header user={user} language={language} setLanguage={setLanguage} />
          <main className="p-6">
            {currentPage === 'dashboard' && <Dashboard setCurrentInputForm={setCurrentInputForm} setCurrentPage={setCurrentPage} />}
            {currentPage === 'input' && currentInputForm && (
              <InputForm 
                category={currentInputForm} 
                setCurrentInputForm={setCurrentInputForm}
                setCurrentPage={setCurrentPage}
              />
            )}
            {currentPage === 'results' && <ResultsPage />}
            {currentPage === 'analysis' && <AnalysisPage />}
          </main>
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default App;