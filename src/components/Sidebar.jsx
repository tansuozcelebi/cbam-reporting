import React, { useContext } from 'react';
import { Home, Zap, Flame, Fuel, Car, Plane, Bus, Wind, Home as HomeIcon, BarChart3, FileText, LogOut } from 'lucide-react';
import { AppContext } from '../App';

const Sidebar = ({ currentPage, setCurrentPage, currentInputForm, setCurrentInputForm, onLogout, entries }) => {
  const { t } = useContext(AppContext);

  const categories = [
    { id: 'electricity', icon: Zap, label: t.electricity, count: entries.electricity.length },
    { id: 'naturalGas', icon: Flame, label: t.naturalGas, count: entries.naturalGas.length },
    { id: 'fuel', icon: Fuel, label: t.fuel, count: entries.fuel.length },
    { id: 'cars', icon: Car, label: t.cars, count: entries.cars.length },
    { id: 'flights', icon: Plane, label: t.flights, count: entries.flights.length },
    { id: 'publicTransport', icon: Bus, label: t.publicTransport, count: entries.publicTransport.length },
    { id: 'refrigerants', icon: Wind, label: t.refrigerants, count: entries.refrigerants.length },
    { id: 'homeWorkers', icon: HomeIcon, label: t.homeWorkers, count: entries.homeWorkers.length }
  ];

  return (
    <div className="w-64 bg-white border-r flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-2">
          <svg width="32" height="32" viewBox="0 0 100 100">
            <path d="M20 20 L20 80 Q20 85 25 85 L30 85 Q35 85 35 80 L35 40 Q35 35 40 35 L45 35" stroke="#dc2626" strokeWidth="6" fill="none" strokeLinecap="round"/>
            <path d="M30 20 L30 80 Q30 85 35 85 L40 85 Q45 85 45 80 L45 40 Q45 35 50 35 L55 35" stroke="#dc2626" strokeWidth="6" fill="none" strokeLinecap="round"/>
            <path d="M40 20 L40 80 Q40 85 45 85 L50 85 Q55 85 55 80 L55 40 Q55 35 60 35 L65 35" stroke="#dc2626" strokeWidth="6" fill="none" strokeLinecap="round"/>
          </svg>
          <span className="text-xl font-bold text-red-600 tracking-wider">KREA</span>
        </div>
        <p className="text-xs text-gray-500">CBAM Reporter</p>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4">
        <button
          onClick={() => { setCurrentPage('dashboard'); setCurrentInputForm(null); }}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-2 ${currentPage === 'dashboard' ? 'bg-teal-50 text-teal-700' : 'text-gray-700 hover:bg-gray-50'}`}
        >
          <Home size={18} />
          <span className="text-sm font-medium">{t.dashboard}</span>
        </button>

        <div className="mt-4">
          <button
            onClick={() => setCurrentPage('input')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg mb-2 ${currentPage === 'input' ? 'bg-teal-50 text-teal-700' : 'text-gray-700 hover:bg-gray-50'}`}
          >
            <span className="text-sm font-medium">{t.input}</span>
          </button>
          
          <div className="ml-4 space-y-1">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setCurrentPage('input'); setCurrentInputForm(cat.id); }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm ${currentPage === 'input' && currentInputForm === cat.id ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <div className="flex items-center gap-2">
                  <cat.icon size={16} />
                  <span>{cat.label}</span>
                </div>
                <span className="text-xs text-gray-400">({cat.count})</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => { setCurrentPage('analysis'); setCurrentInputForm(null); }}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg mt-4 ${currentPage === 'analysis' ? 'bg-teal-50 text-teal-700' : 'text-gray-700 hover:bg-gray-50'}`}
        >
          <BarChart3 size={18} />
          <span className="text-sm font-medium">{t.analysis}</span>
        </button>

        <button
          onClick={() => { setCurrentPage('results'); setCurrentInputForm(null); }}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${currentPage === 'results' ? 'bg-teal-50 text-teal-700' : 'text-gray-700 hover:bg-gray-50'}`}
        >
          <FileText size={18} />
          <span className="text-sm font-medium">{t.results}</span>
        </button>
      </nav>

      <button
        onClick={onLogout}
        className="m-4 flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50"
      >
        <LogOut size={18} />
        <span className="text-sm font-medium">{t.logout}</span>
      </button>
    </div>
  );
};

export default Sidebar;