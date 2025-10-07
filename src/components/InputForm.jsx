import React, { useState, useContext } from 'react';
import { Zap, Flame, Fuel, Car, Plane, Bus, Wind, Home, Save, X, Edit2, Trash2 } from 'lucide-react';
import { AppContext } from '../App';

const InputForm = ({ category, setCurrentInputForm, setCurrentPage }) => {
  const { t, addEntry, entries, updateEntry, deleteEntry } = useContext(AppContext);
  const [formData, setFormData] = useState({
    source: 'purchased',
    supplierFactor: '',
    usage: '',
    unitOfMeasure: 'm3',
    amount: '',
    year: new Date().getFullYear(),
    monthlyData: {
      jan: '', feb: '', mar: '', apr: '', may: '', jun: '',
      jul: '', aug: '', sep: '', oct: '', nov: '', dec: ''
    },
    // Electricity specific parameters
    co2EmissionFactor: '0.43', // tCO₂/MWh - varies by country
    country: 'Turkey', // Default country
    // Natural Gas specific parameters
    netCalorificValue: '184625.6', // Kcal/m³
    co2Emission: '56.100', // kg/TJ
    ch4Emission: '1', // kg/TJ
    n2oEmission: '0.1', // kg/TJ
    ch4GlobalWarmingPower: '21', // tCO₂e/ton
    n2oGlobalWarmingPower: '310', // tCO₂e/ton
    conversionFactor: '4.186', // J/cal
    // Diesel specific parameters
    volumeBiodiesel: '0%', // Volume of biodiesel in national diesel
    dieselSpecificGravity: '0.83', // kg/L
    dieselNetCalorificValue: '10.272', // Kcal/kg
    dieselCo2Emission: '74.100', // kg/TJ
    dieselCh4Emission: '4.15', // kg/TJ
    dieselN2oEmission: '28.60', // kg/TJ
    dieselCh4GlobalWarmingPower: '21', // tCO₂e/tCH₄
    dieselN2oGlobalWarmingPower: '310', // tCO₂e/tN₂O
    dieselConversionFactor: '4.186', // J/cal
    link: '',
    comments: ''
  });
  const [editingId, setEditingId] = useState(null);

  const months = [
    { key: 'jan', label: 'JAN' },
    { key: 'feb', label: 'FEB' },
    { key: 'mar', label: 'MAR' },
    { key: 'apr', label: 'APR' },
    { key: 'may', label: 'MAY' },
    { key: 'jun', label: 'JUN' },
    { key: 'jul', label: 'JUL' },
    { key: 'aug', label: 'AUG' },
    { key: 'sep', label: 'SEP' },
    { key: 'oct', label: 'OCT' },
    { key: 'nov', label: 'NOV' },
    { key: 'dec', label: 'DEC' }
  ];

  const categoryIcons = {
    electricity: Zap,
    naturalGas: Flame,
    fuel: Fuel,
    cars: Car,
    flights: Plane,
    publicTransport: Bus,
    refrigerants: Wind,
    remoteWorking: Home
  };

  const Icon = categoryIcons[category];
  const categoryLabel = t[category];

  const handleSave = () => {
    if (category === 'electricity') {
      // Electricity için aylık verilerden en az biri dolu olmalı
      const hasMonthlyData = Object.values(formData.monthlyData).some(value => value && value.trim() !== '');
      if (!hasMonthlyData) return;
    }
    if (category === 'naturalGas') {
      // Natural Gas için aylık verilerden en az biri dolu olmalı
      const hasMonthlyData = Object.values(formData.monthlyData).some(value => value && value.trim() !== '');
      if (!hasMonthlyData) return;
    }
    if (category === 'fuel') {
      // Diesel için aylık verilerden en az biri dolu olmalı
      const hasMonthlyData = Object.values(formData.monthlyData).some(value => value && value.trim() !== '');
      if (!hasMonthlyData) return;
    }
    if (category !== 'electricity' && category !== 'naturalGas' && category !== 'fuel' && (!formData.unitOfMeasure || !formData.amount)) return;

    if (editingId) {
      updateEntry(category, editingId, formData);
      setEditingId(null);
    } else {
      addEntry(category, formData);
    }
    setFormData({
      source: 'purchased',
      supplierFactor: '',
      usage: '',
      unitOfMeasure: category === 'naturalGas' ? 'm3' : '',
      amount: '',
      year: new Date().getFullYear(),
      monthlyData: {
        jan: '', feb: '', mar: '', apr: '', may: '', jun: '',
        jul: '', aug: '', sep: '', oct: '', nov: '', dec: ''
      },
      // Natural Gas specific parameters
      netCalorificValue: category === 'naturalGas' ? '184625.6' : '',
      co2Emission: category === 'naturalGas' ? '56.100' : '',
      ch4Emission: category === 'naturalGas' ? '1' : '',
      n2oEmission: category === 'naturalGas' ? '0.1' : '',
      ch4GlobalWarmingPower: category === 'naturalGas' ? '21' : '',
      n2oGlobalWarmingPower: category === 'naturalGas' ? '310' : '',
      conversionFactor: category === 'naturalGas' ? '4.186' : '',
      link: '',
      comments: ''
    });
  };

  const handleEdit = (entry) => {
    setFormData(entry);
    setEditingId(entry.id);
  };

  const handleCancel = () => {
    setFormData({
      source: 'purchased',
      supplierFactor: '',
      usage: '',
      unitOfMeasure: category === 'naturalGas' ? 'm3' : category === 'fuel' ? 'liters' : '',
      amount: '',
      year: new Date().getFullYear(),
      monthlyData: {
        jan: '', feb: '', mar: '', apr: '', may: '', jun: '',
        jul: '', aug: '', sep: '', oct: '', nov: '', dec: ''
      },
      // Electricity specific parameters
      co2EmissionFactor: category === 'electricity' ? '0.43' : '',
      country: category === 'electricity' ? 'Turkey' : '',
      // Natural Gas specific parameters
      netCalorificValue: category === 'naturalGas' ? '184625.6' : '',
      co2Emission: category === 'naturalGas' ? '56.100' : '',
      ch4Emission: category === 'naturalGas' ? '1' : '',
      n2oEmission: category === 'naturalGas' ? '0.1' : '',
      ch4GlobalWarmingPower: category === 'naturalGas' ? '21' : '',
      n2oGlobalWarmingPower: category === 'naturalGas' ? '310' : '',
      conversionFactor: category === 'naturalGas' ? '4.186' : '',
      // Diesel specific parameters
      volumeBiodiesel: category === 'fuel' ? '0%' : '',
      dieselSpecificGravity: category === 'fuel' ? '0.83' : '',
      dieselNetCalorificValue: category === 'fuel' ? '10.272' : '',
      dieselCo2Emission: category === 'fuel' ? '74.100' : '',
      dieselCh4Emission: category === 'fuel' ? '4.15' : '',
      dieselN2oEmission: category === 'fuel' ? '28.60' : '',
      dieselCh4GlobalWarmingPower: category === 'fuel' ? '21' : '',
      dieselN2oGlobalWarmingPower: category === 'fuel' ? '310' : '',
      dieselConversionFactor: category === 'fuel' ? '4.186' : '',
      link: '',
      comments: ''
    });
    setEditingId(null);
  };

  return (
    <div className="max-w-4xl">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-teal-100 rounded-full">
            <Icon size={24} className="text-teal-700" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{categoryLabel}</h2>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-4">{t.instructions}</h3>
            
            {category === 'electricity' && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    {[2024, 2025, 2026, 2027, 2028].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <select
                      value={formData.country}
                      onChange={(e) => setFormData({...formData, country: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="Turkey">Turkey</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="Italy">Italy</option>
                      <option value="Spain">Spain</option>
                      <option value="Poland">Poland</option>
                      <option value="Netherlands">Netherlands</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CO₂ Emission Factor</label>
                    <div className="flex">
                      <input
                        type="number"
                        step="0.01"
                        value={formData.co2EmissionFactor}
                        onChange={(e) => setFormData({...formData, co2EmissionFactor: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-teal-500"
                        placeholder="0.43"
                      />
                      <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-sm text-gray-600">tCO₂/MWh</span>
                    </div>
                    <p className="text-xs text-red-500 mt-1">SELECT the CO2 emission factor from below table (NB: different emission factors for each country!)</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Monthly Electricity Consumption (MWh)</label>
                  <div className="grid grid-cols-4 gap-3">
                    {months.map(month => (
                      <div key={month.key}>
                        <label className="block text-xs font-medium text-gray-600 mb-1">{month.label}</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.monthlyData[month.key]}
                          onChange={(e) => setFormData({
                            ...formData, 
                            monthlyData: {
                              ...formData.monthlyData,
                              [month.key]: e.target.value
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm"
                          placeholder="0"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Enter monthly electricity consumption values in MWh</p>
                  
                  {/* GHG Emissions Display */}
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="text-sm font-semibold text-green-800 mb-2">GHG Emissions (tCO₂e)</h4>
                    <div className="grid grid-cols-6 gap-2 text-xs">
                      {months.slice(0, 6).map(month => {
                        const consumption = parseFloat(formData.monthlyData[month.key]) || 0;
                        const factor = parseFloat(formData.co2EmissionFactor) || 0;
                        const emission = (consumption * factor).toFixed(1);
                        return (
                          <div key={month.key} className="text-center">
                            <div className="font-medium text-green-700">{month.label}</div>
                            <div className="text-green-600">{emission}</div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="grid grid-cols-6 gap-2 text-xs mt-2">
                      {months.slice(6).map(month => {
                        const consumption = parseFloat(formData.monthlyData[month.key]) || 0;
                        const factor = parseFloat(formData.co2EmissionFactor) || 0;
                        const emission = (consumption * factor).toFixed(1);
                        return (
                          <div key={month.key} className="text-center">
                            <div className="font-medium text-green-700">{month.label}</div>
                            <div className="text-green-600">{emission}</div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-3 pt-2 border-t border-green-300 text-center">
                      <span className="text-sm font-bold text-green-800">
                        Annual Total: {Object.values(formData.monthlyData).reduce((sum, val) => {
                          const consumption = parseFloat(val) || 0;
                          const factor = parseFloat(formData.co2EmissionFactor) || 0;
                          return sum + (consumption * factor);
                        }, 0).toFixed(2)} tCO₂e
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {category === 'naturalGas' && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    {[2024, 2025, 2026, 2027, 2028].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.unitOfMeasure}</label>
                  <select
                    value={formData.unitOfMeasure}
                    onChange={(e) => setFormData({...formData, unitOfMeasure: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="m3">m³</option>
                    <option value="kcal">Kcal</option>
                    <option value="kgCO2e/m3">kgCO₂e/m³</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Monthly Values ({formData.unitOfMeasure})</label>
                  <div className="grid grid-cols-4 gap-3">
                    {months.map(month => (
                      <div key={month.key}>
                        <label className="block text-xs font-medium text-gray-600 mb-1">{month.label}</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.monthlyData[month.key]}
                          onChange={(e) => setFormData({
                            ...formData, 
                            monthlyData: {
                              ...formData.monthlyData,
                              [month.key]: e.target.value
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm"
                          placeholder="0"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Enter monthly consumption values for natural gas</p>
                </div>

                {/* Emission Parameters Section */}
                <div className="mt-6 border-t pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">Emission Parameters</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Net Calorific Value</label>
                      <div className="flex">
                        <input
                          type="number"
                          step="0.1"
                          value={formData.netCalorificValue}
                          onChange={(e) => setFormData({...formData, netCalorificValue: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-teal-500 text-sm"
                          placeholder="184625.6"
                        />
                        <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-xs text-gray-600">Kcal/m³</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Conversion Factor</label>
                      <div className="flex">
                        <input
                          type="number"
                          step="0.001"
                          value={formData.conversionFactor}
                          onChange={(e) => setFormData({...formData, conversionFactor: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-teal-500 text-sm"
                          placeholder="4.186"
                        />
                        <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-xs text-gray-600">J/cal</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">CO₂ Emission</label>
                      <div className="flex">
                        <input
                          type="number"
                          step="0.001"
                          value={formData.co2Emission}
                          onChange={(e) => setFormData({...formData, co2Emission: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-teal-500 text-sm"
                          placeholder="56.100"
                        />
                        <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-xs text-gray-600">kg/TJ</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">CH₄ Emission</label>
                      <div className="flex">
                        <input
                          type="number"
                          step="0.01"
                          value={formData.ch4Emission}
                          onChange={(e) => setFormData({...formData, ch4Emission: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-teal-500 text-sm"
                          placeholder="1"
                        />
                        <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-xs text-gray-600">kg/TJ</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">N₂O Emission</label>
                      <div className="flex">
                        <input
                          type="number"
                          step="0.01"
                          value={formData.n2oEmission}
                          onChange={(e) => setFormData({...formData, n2oEmission: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-teal-500 text-sm"
                          placeholder="0.1"
                        />
                        <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-xs text-gray-600">kg/TJ</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">CH₄ Global Warming Power</label>
                      <div className="flex">
                        <input
                          type="number"
                          step="1"
                          value={formData.ch4GlobalWarmingPower}
                          onChange={(e) => setFormData({...formData, ch4GlobalWarmingPower: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-teal-500 text-sm"
                          placeholder="21"
                        />
                        <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-xs text-gray-600">tCO₂e/ton</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">N₂O Global Warming Power</label>
                      <div className="flex">
                        <input
                          type="number"
                          step="1"
                          value={formData.n2oGlobalWarmingPower}
                          onChange={(e) => setFormData({...formData, n2oGlobalWarmingPower: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-teal-500 text-sm"
                          placeholder="310"
                        />
                        <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-xs text-gray-600">tCO₂e/ton</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-3">
                    <strong>Source:</strong> IPCC Guidelines, 2006 | Table TS.2, Technical Summary, Climate Change 2007 - The Physical Science Basis, IPCC
                  </p>
                </div>
              </>
            )}

            {category === 'fuel' && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    {[2024, 2025, 2026, 2027, 2028].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Volume of Biodiesel</label>
                  <div className="flex">
                    <input
                      type="text"
                      value={formData.volumeBiodiesel}
                      onChange={(e) => setFormData({...formData, volumeBiodiesel: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-teal-500"
                      placeholder="0%"
                    />
                    <span className="px-3 py-2 bg-yellow-100 border border-l-0 border-gray-300 rounded-r-lg text-sm text-gray-600">%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Volume of biodiesel in national diesel</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Monthly Diesel Consumption (Liters)</label>
                  <div className="grid grid-cols-4 gap-3">
                    {months.map(month => (
                      <div key={month.key}>
                        <label className="block text-xs font-medium text-gray-600 mb-1">{month.label}</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.monthlyData[month.key]}
                          onChange={(e) => setFormData({
                            ...formData, 
                            monthlyData: {
                              ...formData.monthlyData,
                              [month.key]: e.target.value
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 text-sm"
                          placeholder="0"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Enter monthly diesel consumption in liters</p>
                </div>

                {/* Diesel Parameters Section */}
                <div className="mt-6 border-t pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">Diesel Parameters</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Diesel Specific Gravity</label>
                      <div className="flex">
                        <input
                          type="number"
                          step="0.01"
                          value={formData.dieselSpecificGravity}
                          onChange={(e) => setFormData({...formData, dieselSpecificGravity: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-teal-500 text-sm"
                          placeholder="0.83"
                        />
                        <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-xs text-gray-600">kg/L</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Net Calorific Value</label>
                      <div className="flex">
                        <input
                          type="number"
                          step="0.001"
                          value={formData.dieselNetCalorificValue}
                          onChange={(e) => setFormData({...formData, dieselNetCalorificValue: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-teal-500 text-sm"
                          placeholder="10.272"
                        />
                        <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-xs text-gray-600">Kcal/kg</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">CO₂ Emission</label>
                      <div className="flex">
                        <input
                          type="number"
                          step="0.001"
                          value={formData.dieselCo2Emission}
                          onChange={(e) => setFormData({...formData, dieselCo2Emission: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-teal-500 text-sm"
                          placeholder="74.100"
                        />
                        <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-xs text-gray-600">kg/TJ</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">CH₄ Emission</label>
                      <div className="flex">
                        <input
                          type="number"
                          step="0.01"
                          value={formData.dieselCh4Emission}
                          onChange={(e) => setFormData({...formData, dieselCh4Emission: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-teal-500 text-sm"
                          placeholder="4.15"
                        />
                        <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-xs text-gray-600">kg/TJ</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">N₂O Emission</label>
                      <div className="flex">
                        <input
                          type="number"
                          step="0.01"
                          value={formData.dieselN2oEmission}
                          onChange={(e) => setFormData({...formData, dieselN2oEmission: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-teal-500 text-sm"
                          placeholder="28.60"
                        />
                        <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-xs text-gray-600">kg/TJ</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Conversion Factor</label>
                      <div className="flex">
                        <input
                          type="number"
                          step="0.001"
                          value={formData.dieselConversionFactor}
                          onChange={(e) => setFormData({...formData, dieselConversionFactor: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-teal-500 text-sm"
                          placeholder="4.186"
                        />
                        <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-xs text-gray-600">J/cal</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">CH₄ Global Warming Power</label>
                      <div className="flex">
                        <input
                          type="number"
                          step="1"
                          value={formData.dieselCh4GlobalWarmingPower}
                          onChange={(e) => setFormData({...formData, dieselCh4GlobalWarmingPower: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-teal-500 text-sm"
                          placeholder="21"
                        />
                        <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-xs text-gray-600">tCO₂e/tCH₄</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">N₂O Global Warming Power</label>
                      <div className="flex">
                        <input
                          type="number"
                          step="1"
                          value={formData.dieselN2oGlobalWarmingPower}
                          onChange={(e) => setFormData({...formData, dieselN2oGlobalWarmingPower: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-teal-500 text-sm"
                          placeholder="310"
                        />
                        <span className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-xs text-gray-600">tCO₂e/tN₂O</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-3">
                    <strong>Source:</strong> IPCC Guidelines, 2006 | Table 3.3.1, Cap. 3, Vol 2 | Table TS.2, Technical Summary, Climate Change 2007
                  </p>
                </div>

                {/* GHG Equivalent Emission Display */}
                <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="text-sm font-semibold text-orange-800 mb-2">GHG Equivalent Emissions (tCO₂e)</h4>
                  <div className="grid grid-cols-6 gap-2 text-xs">
                    {months.slice(0, 6).map(month => {
                      const consumption = parseFloat(formData.monthlyData[month.key]) || 0;
                      const gravity = parseFloat(formData.dieselSpecificGravity) || 0.83;
                      const calorific = parseFloat(formData.dieselNetCalorificValue) || 10.272;
                      const co2Factor = parseFloat(formData.dieselCo2Emission) || 74.100;
                      
                      // Simplified calculation: consumption(L) * gravity(kg/L) * calorific(Kcal/kg) * co2Factor * conversion
                      const emission = (consumption * gravity * calorific * co2Factor * 0.000001).toFixed(1);
                      return (
                        <div key={month.key} className="text-center">
                          <div className="font-medium text-orange-700">{month.label}</div>
                          <div className="text-orange-600">{emission}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="grid grid-cols-6 gap-2 text-xs mt-2">
                    {months.slice(6).map(month => {
                      const consumption = parseFloat(formData.monthlyData[month.key]) || 0;
                      const gravity = parseFloat(formData.dieselSpecificGravity) || 0.83;
                      const calorific = parseFloat(formData.dieselNetCalorificValue) || 10.272;
                      const co2Factor = parseFloat(formData.dieselCo2Emission) || 74.100;
                      
                      const emission = (consumption * gravity * calorific * co2Factor * 0.000001).toFixed(1);
                      return (
                        <div key={month.key} className="text-center">
                          <div className="font-medium text-orange-700">{month.label}</div>
                          <div className="text-orange-600">{emission}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-3 pt-2 border-t border-orange-300 text-center">
                    <span className="text-sm font-bold text-orange-800">
                      Annual Total: {Object.values(formData.monthlyData).reduce((sum, val) => {
                        const consumption = parseFloat(val) || 0;
                        const gravity = parseFloat(formData.dieselSpecificGravity) || 0.83;
                        const calorific = parseFloat(formData.dieselNetCalorificValue) || 10.272;
                        const co2Factor = parseFloat(formData.dieselCo2Emission) || 74.100;
                        return sum + (consumption * gravity * calorific * co2Factor * 0.000001);
                      }, 0).toFixed(2)} tCO₂e
                    </span>
                  </div>
                </div>
              </>
            )}

            {category !== 'electricity' && category !== 'naturalGas' && category !== 'fuel' && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.unitOfMeasure}</label>
                  <select
                    value={formData.unitOfMeasure}
                    onChange={(e) => setFormData({...formData, unitOfMeasure: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">{t.selectOption}</option>
                    <option value="liters">Liters</option>
                    <option value="m3">m³</option>
                    <option value="kg">kg</option>
                    <option value="tonnes">Tonnes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.amount}</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    placeholder="1000"
                  />
                  <p className="text-xs text-gray-500 mt-1">{t.amountHelp}</p>
                </div>
              </>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-4">{t.additionalData}</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.link}</label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({...formData, link: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.comments}</label>
              <textarea
                value={formData.comments}
                onChange={(e) => setFormData({...formData, comments: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                rows="3"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2"
            >
              <Save size={18} />
              {editingId ? t.save : t.add}
            </button>
            {editingId && (
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
              >
                <X size={18} />
                {t.cancel}
              </button>
            )}
            <button
              onClick={() => { setCurrentInputForm(null); setCurrentPage('dashboard'); }}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              {t.previous}
            </button>
          </div>
        </div>
      </div>

      {entries[category].length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">{t.entries} ({entries[category].length})</h3>
          <div className="space-y-2">
            {entries[category].map(entry => (
              <div key={entry.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  {category === 'electricity' ? (
                    <div className="text-sm">
                      <p className="font-medium">{entry.year} - {entry.country}</p>
                      <p className="text-xs text-gray-600 mb-2">CO₂ Factor: {entry.co2EmissionFactor} tCO₂/MWh</p>
                      <div className="grid grid-cols-6 gap-2 mt-2 text-xs">
                        {months.slice(0, 6).map(month => {
                          const consumption = parseFloat(entry.monthlyData[month.key]) || 0;
                          const factor = parseFloat(entry.co2EmissionFactor) || 0;
                          const emission = (consumption * factor).toFixed(1);
                          return (
                            <div key={month.key} className="text-center">
                              <div className={consumption > 0 ? 'text-blue-600 font-medium' : 'text-gray-400'}>{month.label}</div>
                              <div className="text-xs">{consumption > 0 ? `${consumption} MWh` : '0 MWh'}</div>
                              <div className="text-xs text-green-600">{emission} tCO₂e</div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="grid grid-cols-6 gap-2 mt-1 text-xs">
                        {months.slice(6).map(month => {
                          const consumption = parseFloat(entry.monthlyData[month.key]) || 0;
                          const factor = parseFloat(entry.co2EmissionFactor) || 0;
                          const emission = (consumption * factor).toFixed(1);
                          return (
                            <div key={month.key} className="text-center">
                              <div className={consumption > 0 ? 'text-blue-600 font-medium' : 'text-gray-400'}>{month.label}</div>
                              <div className="text-xs">{consumption > 0 ? `${consumption} MWh` : '0 MWh'}</div>
                              <div className="text-xs text-green-600">{emission} tCO₂e</div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-3 pt-2 border-t border-gray-200 text-xs">
                        <div className="grid grid-cols-2 gap-4">
                          <span className="text-gray-700">
                            <strong>Total Consumption:</strong> {Object.values(entry.monthlyData || {}).reduce((sum, val) => sum + (parseFloat(val) || 0), 0).toFixed(2)} MWh
                          </span>
                          <span className="text-green-700">
                            <strong>Annual Emissions:</strong> {Object.values(entry.monthlyData || {}).reduce((sum, val) => {
                              const consumption = parseFloat(val) || 0;
                              const factor = parseFloat(entry.co2EmissionFactor) || 0;
                              return sum + (consumption * factor);
                            }, 0).toFixed(2)} tCO₂e
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : category === 'fuel' ? (
                    <div className="text-sm">
                      <p className="font-medium">{entry.year} - Diesel Consumption</p>
                      <p className="text-xs text-gray-600 mb-2">Biodiesel: {entry.volumeBiodiesel} | Specific Gravity: {entry.dieselSpecificGravity} kg/L</p>
                      <div className="grid grid-cols-6 gap-2 mt-2 text-xs">
                        {months.slice(0, 6).map(month => {
                          const consumption = parseFloat(entry.monthlyData[month.key]) || 0;
                          const gravity = parseFloat(entry.dieselSpecificGravity) || 0.83;
                          const calorific = parseFloat(entry.dieselNetCalorificValue) || 10.272;
                          const co2Factor = parseFloat(entry.dieselCo2Emission) || 74.100;
                          const emission = (consumption * gravity * calorific * co2Factor * 0.000001).toFixed(1);
                          return (
                            <div key={month.key} className="text-center">
                              <div className={consumption > 0 ? 'text-orange-600 font-medium' : 'text-gray-400'}>{month.label}</div>
                              <div className="text-xs">{consumption > 0 ? `${consumption} L` : '0 L'}</div>
                              <div className="text-xs text-red-600">{emission} tCO₂e</div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="grid grid-cols-6 gap-2 mt-1 text-xs">
                        {months.slice(6).map(month => {
                          const consumption = parseFloat(entry.monthlyData[month.key]) || 0;
                          const gravity = parseFloat(entry.dieselSpecificGravity) || 0.83;
                          const calorific = parseFloat(entry.dieselNetCalorificValue) || 10.272;
                          const co2Factor = parseFloat(entry.dieselCo2Emission) || 74.100;
                          const emission = (consumption * gravity * calorific * co2Factor * 0.000001).toFixed(1);
                          return (
                            <div key={month.key} className="text-center">
                              <div className={consumption > 0 ? 'text-orange-600 font-medium' : 'text-gray-400'}>{month.label}</div>
                              <div className="text-xs">{consumption > 0 ? `${consumption} L` : '0 L'}</div>
                              <div className="text-xs text-red-600">{emission} tCO₂e</div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-3 pt-2 border-t border-gray-200 text-xs">
                        <div className="grid grid-cols-2 gap-4">
                          <span className="text-gray-700">
                            <strong>Total Consumption:</strong> {Object.values(entry.monthlyData || {}).reduce((sum, val) => sum + (parseFloat(val) || 0), 0).toFixed(2)} L
                          </span>
                          <span className="text-red-700">
                            <strong>Annual Emissions:</strong> {Object.values(entry.monthlyData || {}).reduce((sum, val) => {
                              const consumption = parseFloat(val) || 0;
                              const gravity = parseFloat(entry.dieselSpecificGravity) || 0.83;
                              const calorific = parseFloat(entry.dieselNetCalorificValue) || 10.272;
                              const co2Factor = parseFloat(entry.dieselCo2Emission) || 74.100;
                              return sum + (consumption * gravity * calorific * co2Factor * 0.000001);
                            }, 0).toFixed(2)} tCO₂e
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : category === 'naturalGas' ? (
                    <div className="text-sm">
                      <p className="font-medium">{entry.year} - {entry.unitOfMeasure}</p>
                      <div className="grid grid-cols-6 gap-2 mt-2 text-xs">
                        {months.slice(0, 6).map(month => (
                          <span key={month.key} className={entry.monthlyData[month.key] ? 'text-green-600 font-medium' : 'text-gray-400'}>
                            {month.label}: {entry.monthlyData[month.key] || '0'}
                          </span>
                        ))}
                      </div>
                      <div className="grid grid-cols-6 gap-2 mt-1 text-xs">
                        {months.slice(6).map(month => (
                          <span key={month.key} className={entry.monthlyData[month.key] ? 'text-green-600 font-medium' : 'text-gray-400'}>
                            {month.label}: {entry.monthlyData[month.key] || '0'}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Total: {Object.values(entry.monthlyData || {}).reduce((sum, val) => sum + (parseFloat(val) || 0), 0).toFixed(2)} {entry.unitOfMeasure}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm">
                      <span className="font-medium">{entry.amount} {entry.unitOfMeasure}</span>
                    </p>
                  )}
                  {entry.comments && <p className="text-xs text-gray-500 mt-1">{entry.comments}</p>}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(entry)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => deleteEntry(category, entry.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InputForm;