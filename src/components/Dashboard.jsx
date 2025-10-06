import React, { useContext } from 'react';
import { Zap, Flame, Fuel, Car, Plane, Bus, Wind, Home } from 'lucide-react';
import { AppContext } from '../App';

const Dashboard = ({ setCurrentInputForm, setCurrentPage }) => {
  const { t, entries } = useContext(AppContext);

  const categories = [
    { id: 'electricity', icon: Zap, label: t.electricity, color: 'bg-yellow-100 text-yellow-700' },
    { id: 'naturalGas', icon: Flame, label: t.naturalGas, color: 'bg-orange-100 text-orange-700' },
    { id: 'fuel', icon: Fuel, label: t.fuel, color: 'bg-red-100 text-red-700' },
    { id: 'cars', icon: Car, label: t.cars, color: 'bg-blue-100 text-blue-700' },
    { id: 'flights', icon: Plane, label: t.flights, color: 'bg-indigo-100 text-indigo-700' },
    { id: 'publicTransport', icon: Bus, label: t.publicTransport, color: 'bg-purple-100 text-purple-700' },
    { id: 'refrigerants', icon: Wind, label: t.refrigerants, color: 'bg-teal-100 text-teal-700' },
    { id: 'remoteWorking', icon: Home, label: t.remoteWorking, color: 'bg-green-100 text-green-700' }
  ];

  return (
    <div className="max-w-6xl">
      <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.welcome}</h2>
            <p className="text-gray-600 mb-4">{t.description}</p>
            <p className="text-sm text-gray-500">{t.beginMessage}</p>
          </div>
          <div className="flex flex-col items-center">
            <svg width="60" height="60" viewBox="0 0 100 100">
              <path d="M20 20 L20 80 Q20 85 25 85 L30 85 Q35 85 35 80 L35 40 Q35 35 40 35 L45 35" stroke="#dc2626" strokeWidth="6" fill="none" strokeLinecap="round"/>
              <path d="M30 20 L30 80 Q30 85 35 85 L40 85 Q45 85 45 80 L45 40 Q45 35 50 35 L55 35" stroke="#dc2626" strokeWidth="6" fill="none" strokeLinecap="round"/>
              <path d="M40 20 L40 80 Q40 85 45 85 L50 85 Q55 85 55 80 L55 40 Q55 35 60 35 L65 35" stroke="#dc2626" strokeWidth="6" fill="none" strokeLinecap="round"/>
            </svg>
            <span className="text-xl font-bold text-red-600 tracking-wider mt-1">KREA</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">{t.input} {t.dashboard}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setCurrentInputForm(cat.id); setCurrentPage('input'); }}
              className={`${cat.color} p-4 rounded-lg hover:opacity-80 transition flex flex-col items-center justify-center gap-2`}
            >
              <cat.icon size={24} />
              <span className="text-sm font-medium text-center">{cat.label}</span>
              <span className="text-xs">({entries[cat.id].length} {t.entries})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;