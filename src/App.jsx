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

  const t = translations[language];

  const handleLogin = (email, password) => {
    const userName = email.split('@')[0];
    setUser({ name: userName, email });
    
    // Load user's data if exists
    if (allUserData[email]) {
      setEntries(allUserData[email].entries || {
        electricity: [],
        naturalGas: [],
        fuel: [],
        cars: [],
        flights: [],
        publicTransport: [],
        refrigerants: [],
        remoteWorking: []
      });
      setProductionData(allUserData[email].productionData || {
        monthlyProduction: {
          jan: '', feb: '', mar: '', apr: '', may: '', jun: '',
          jul: '', aug: '', sep: '', oct: '', nov: '', dec: ''
        },
        year: new Date().getFullYear()
      });
    } else {
      // Initialize empty data for new user
      const emptyData = {
        entries: {
          electricity: [],
          naturalGas: [],
          fuel: [],
          cars: [],
          flights: [],
          publicTransport: [],
          refrigerants: [],
          remoteWorking: []
        },
        productionData: {
          monthlyProduction: {
            jan: '', feb: '', mar: '', apr: '', may: '', jun: '',
            jul: '', aug: '', sep: '', oct: '', nov: '', dec: ''
          },
          year: new Date().getFullYear()
        }
      };
      setEntries(emptyData.entries);
      setProductionData(emptyData.productionData);
      setAllUserData(prev => ({
        ...prev,
        [email]: emptyData
      }));
    }
    
    setIsLoggedIn(true);
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
    if (type === 'production' && user?.id) {
      setProductionData(data);
      
      // Save to database
      try {
        await saveProductionToDB(user.id, data.monthlyProduction || {});
      } catch (error) {
        console.error('Failed to save production data:', error);
      }
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