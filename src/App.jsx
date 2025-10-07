import React, { useState, createContext, useContext, useEffect } from 'react';
import { translations } from './translations';
import { useDatabase } from './hooks/useDatabase';
import LoginPage from './components/LoginPage';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import InputForm from './components/InputForm';
import ResultsPage from './components/ResultsPage';
import AnalysisPage from './components/AnalysisPage';
import ProductionPage from './components/ProductionPage';

// Context for app state
export const AppContext = createContext();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('en');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [currentInputForm, setCurrentInputForm] = useState(null);
  
  const [entries, setEntries] = useState({
    electricity: [],
    naturalGas: [],
    fuel: [],
    cars: [],
    flights: [],
    publicTransport: [],
    refrigerants: [],
    remoteWorking: []
  });

  const [productionData, setProductionData] = useState({});

  // Database hooks
  const { 
    loginUser, 
    saveEntry: saveEntryToDB, 
    loadEntries: loadEntriesFromDB, 
    deleteEntry: deleteEntryFromDB,
    updateEntry: updateEntryInDB, 
    saveProductionData: saveProductionToDB, 
    loadProductionData: loadProductionFromDB,
    saveSettings,
    isLoading 
  } = useDatabase();

  // Translation with fallback to English
  const t = new Proxy(translations[language] || translations.en, {
    get: (target, prop) => {
      return target[prop] || translations.en[prop] || prop;
    }
  });

  const handleLogin = async (email, password) => {
    console.log('Login attempt:', email, password);
    try {
      const userName = email.split('@')[0];
      console.log('Processing login for:', userName);
      
      // Try to login user and get user data from database
      const userData = await loginUser(email, password);
      console.log('User data from DB:', userData);
      
      if (userData) {
        // User exists in database, load their data
        setUser({ id: userData.id, name: userName, email });
        console.log('Existing user logged in');
        
        // Load entries from database
        const userEntries = await loadEntriesFromDB(userData.id);
        setEntries(userEntries || {
          electricity: [],
          naturalGas: [],
          fuel: [],
          cars: [],
          flights: [],
          publicTransport: [],
          refrigerants: [],
          remoteWorking: []
        });
        
        // Load production data from database
        const userProductionData = await loadProductionFromDB(userData.id);
        setProductionData(userProductionData || {
          monthlyProduction: {
            jan: '', feb: '', mar: '', apr: '', may: '', jun: '',
            jul: '', aug: '', sep: '', oct: '', nov: '', dec: ''
          },
          year: new Date().getFullYear()
        });
      } else {
        // New user - create account and initialize empty data
        const newUserId = Date.now(); // Simple ID generation
        setUser({ id: newUserId, name: userName, email });
        console.log('New user created with ID:', newUserId);
        
        // Initialize empty data structures
        const emptyEntries = {
          electricity: [],
          naturalGas: [],
          fuel: [],
          cars: [],
          flights: [],
          publicTransport: [],
          refrigerants: [],
          remoteWorking: []
        };
        
        const emptyProductionData = {
          monthlyProduction: {
            jan: '', feb: '', mar: '', apr: '', may: '', jun: '',
            jul: '', aug: '', sep: '', oct: '', nov: '', dec: ''
          },
          year: new Date().getFullYear()
        };
        
        setEntries(emptyEntries);
        setProductionData(emptyProductionData);
      }
      
      console.log('Setting logged in to true');
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleLogout = async () => {
    // Save current settings before logout
    if (user?.id) {
      await saveSettings(user.id, language);
    }
    
    setIsLoggedIn(false);
    setUser(null);
    setCurrentPage('dashboard');
  };

  const handleProductionDataChange = async (type, data) => {
    console.log('🏭 handleProductionDataChange called with:', type, data);
    
    if (type === 'production' && user?.id) {
      console.log('💾 About to save production data for user:', user.id);
      setProductionData(data);
      
      // Save to database
      try {
        console.log('📤 Calling saveProductionToDB with:', user.id, data.monthlyProduction);
        await saveProductionToDB(user.id, data.monthlyProduction || {});
        console.log('✅ Production data saved successfully to database');
      } catch (error) {
        console.error('❌ Failed to save production data:', error);
      }
    } else {
      console.log('⚠️ Production data not saved - missing user ID or wrong type:', { type, userId: user?.id });
    }
  };

  const addEntry = async (category, entry) => {
    const newEntry = { ...entry, id: Date.now() };
    const newEntries = {
      ...entries,
      [category]: [...(entries[category] || []), newEntry]
    };
    setEntries(newEntries);
    
    // Save to database
    if (user?.id) {
      try {
        await saveEntryToDB(user.id, category, newEntry);
      } catch (error) {
        console.error('Failed to save entry:', error);
      }
    }
  };

  const updateEntry = async (category, id, updatedEntry) => {
    const newEntries = {
      ...entries,
      [category]: entries[category]?.map(e => e.id === id ? { ...updatedEntry, id } : e) || []
    };
    setEntries(newEntries);
    
    // Update in database
    if (user?.id) {
      try {
        await updateEntryInDB(user.id, id, updatedEntry);
      } catch (error) {
        console.error('Failed to update entry:', error);
      }
    }
  };

  const deleteEntry = async (category, id) => {
    const newEntries = {
      ...entries,
      [category]: entries[category]?.filter(e => e.id !== id) || []
    };
    setEntries(newEntries);
    
    // Delete from database
    if (user?.id) {
      try {
        await deleteEntryFromDB(user.id, id);
      } catch (error) {
        console.error('Failed to delete entry:', error);
      }
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
            {currentPage === 'production' && (
              <ProductionPage 
                translations={t}
                onDataChange={handleProductionDataChange}
                data={productionData}
              />
            )}
            {currentPage === 'results' && <ResultsPage />}
            {currentPage === 'analysis' && <AnalysisPage productionData={productionData} />}
          </main>
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default App;