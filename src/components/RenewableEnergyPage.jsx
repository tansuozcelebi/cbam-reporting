import React, { useState, useEffect } from 'react';
import { Zap, Plus, Trash2, Save, Info } from 'lucide-react';

const RenewableEnergyPage = ({ t }) => {
  const [renewableData, setRenewableData] = useState([]);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const savedData = localStorage.getItem('renewableEnergyData');
    if (savedData) {
      setRenewableData(JSON.parse(savedData));
    }
  }, []);

  const energyTypes = [
    { value: 'Solar', label: 'Solar Energy' },
    { value: 'Wind', label: 'Wind Energy' },
    { value: 'Hydro', label: 'Hydroelectric' },
    { value: 'Fusion', label: 'Nuclear Fusion' }
  ];

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const showError = (message) => {
    setErrorMessage(message);
    setShowErrorMessage(true);
    setTimeout(() => setShowErrorMessage(false), 4000);
  };

  const addNewEntry = () => {
    const newEntry = {
      id: Date.now(),
      type: 'Solar',
      data: new Array(12).fill('')
    };
    setRenewableData([...renewableData, newEntry]);
  };

  const removeEntry = (id) => {
    setRenewableData(renewableData.filter(entry => entry.id !== id));
    saveToLocalStorage(renewableData.filter(entry => entry.id !== id));
  };

  const updateEntry = (id, field, value) => {
    const updatedData = renewableData.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    );
    setRenewableData(updatedData);
  };

  const updateMonthData = (id, monthIndex, value) => {
    const updatedData = renewableData.map(entry => {
      if (entry.id === id) {
        const newData = [...entry.data];
        newData[monthIndex] = value;
        return { ...entry, data: newData };
      }
      return entry;
    });
    setRenewableData(updatedData);
  };

  const saveToLocalStorage = (data) => {
    try {
      localStorage.setItem('renewableEnergyData', JSON.stringify(data));
    } catch (error) {
      showError('Failed to save data to local storage');
    }
  };

  const handleSaveAll = () => {
    try {
      saveToLocalStorage(renewableData);
      showError('Data saved successfully!');
    } catch (error) {
      showError('Failed to save data');
    }
  };

  const calculateTotals = (entry) => {
    const total = entry.data.reduce((sum, value) => {
      const num = parseFloat(value) || 0;
      return sum + num;
    }, 0);
    
    const monthlyAvg = total / 12;
    const co2Reduction = total * 1; // 1 tCO2/MWh reduction factor
    
    return {
      annual: total.toFixed(2),
      monthlyAvg: monthlyAvg.toFixed(2),
      co2Reduction: co2Reduction.toFixed(2)
    };
  };

  const getTotalReduction = () => {
    return renewableData.reduce((total, entry) => {
      const entryTotal = entry.data.reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
      return total + (entryTotal * 1); // 1 tCO2/MWh
    }, 0).toFixed(2);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-800">{t.renewableElectricity || 'Renewable Electricity Generation'}</h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={addNewEntry}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                {t.addEntry || 'Add Entry'}
              </button>
              <button
                onClick={handleSaveAll}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                {t.saveAll || 'Save All'}
              </button>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm text-green-800 font-medium">
                  {t.co2ReductionFactor || 'CO₂ Emission Reduction Factor: 1 tCO₂/MWh'}
                </p>
                <p className="text-xs text-green-700 mt-1">
                  {t.renewableDescription || 'Renewable electricity generation reduces overall emissions. Each MWh generated offsets 1 tCO₂ from the total emissions.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {showErrorMessage && (
          <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in-right">
            {errorMessage}
          </div>
        )}

        {/* Total Summary */}
        {renewableData.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{t.totalSummary || 'Total Summary'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {renewableData.reduce((total, entry) => {
                    const entryTotal = entry.data.reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
                    return total + entryTotal;
                  }, 0).toFixed(2)}
                </div>
                <div className="text-sm text-green-700">{t.totalGeneration || 'Total Generation (MWh)'}</div>
              </div>
              <div className="text-center bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">-{getTotalReduction()}</div>
                <div className="text-sm text-green-700">{t.totalCO2Reduced || 'Total CO₂ Reduced (tCO₂)'}</div>
              </div>
              <div className="text-center bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{renewableData.length}</div>
                <div className="text-sm text-green-700">{t.activeProjects || 'Active Projects'}</div>
              </div>
            </div>
          </div>
        )}

        {/* Renewable Energy Entries */}
        {renewableData.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <Zap className="h-16 w-16 text-green-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              {t.noRenewableData || 'No renewable energy data yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {t.startAddingData || 'Start by adding your first renewable energy generation project'}
            </p>
            <button
              onClick={addNewEntry}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              {t.addFirstEntry || 'Add First Entry'}
            </button>
          </div>
        ) : (
          renewableData.map((entry) => {
            const totals = calculateTotals(entry);
            return (
              <div key={entry.id} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Zap className="h-6 w-6 text-green-600" />
                    <h3 className="text-xl font-semibold text-gray-800">
                      {t.renewableElectricity || 'Renewable electricity'} ({entry.type}) - 2025
                    </h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">{t.type || 'Type'}:</label>
                      <select
                        value={entry.type}
                        onChange={(e) => updateEntry(entry.id, 'type', e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      >
                        {energyTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => removeEntry(entry.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title={t.deleteEntry || 'Delete entry'}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Monthly Data Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                  {months.map((month, index) => (
                    <div key={month} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">{month}</label>
                      <input
                        type="number"
                        step="0.01"
                        value={entry.data[index]}
                        onChange={(e) => updateMonthData(entry.id, index, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        placeholder="0.00"
                      />
                      <div className="text-xs text-gray-500">MWh</div>
                    </div>
                  ))}
                </div>

                {/* Summary for this entry */}
                <div className="bg-green-100 rounded-lg p-4">
                  <h4 className="text-lg font-semibold text-green-800 mb-3">
                    {entry.type} {t.generationSummary || 'Generation Summary'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{totals.annual}</div>
                      <div className="text-sm text-green-700">{t.annualGeneration || 'Annual Generation (MWh)'}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">-{totals.co2Reduction}</div>
                      <div className="text-sm text-green-700">{t.co2EmissionsReduced || 'CO₂ Emissions Reduced (tCO₂)'}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{totals.monthlyAvg}</div>
                      <div className="text-sm text-green-700">{t.monthlyAverage || 'Monthly Average (MWh)'}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RenewableEnergyPage;