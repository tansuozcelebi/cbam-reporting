import React, { useState, useEffect } from 'react';
import { Calculator, Save, Info, AlertCircle, X } from 'lucide-react';

const ProductionPage = ({ translations, onDataChange, data = {} }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  
  // Store production data by year
  const [productionDataByYear, setProductionDataByYear] = useState({});
  
  // Get empty month data
  const getEmptyMonthData = () => ({
    jan: '', feb: '', mar: '', apr: '', may: '', jun: '',
    jul: '', aug: '', sep: '', oct: '', nov: '', dec: ''
  });

  // Initialize production data for current year
  useEffect(() => {
    // Load from localStorage if available
    const savedData = localStorage.getItem('productionDataByYear');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setProductionDataByYear(parsedData);
      } catch (error) {
        console.error('Error loading production data:', error);
      }
    }
    
    // Load from props data if available
    if (data?.monthlyProduction && data?.year) {
      setProductionDataByYear(prev => ({
        ...prev,
        [data.year]: {
          monthlyProduction: data.monthlyProduction,
          year: data.year
        }
      }));
    }
  }, [data]);

  // Get current year data
  const getCurrentYearData = () => {
    return productionDataByYear[selectedYear] || {
      monthlyProduction: getEmptyMonthData(),
      year: selectedYear
    };
  };

  // Save data to localStorage
  const saveToLocalStorage = (updatedData) => {
    try {
      localStorage.setItem('productionDataByYear', JSON.stringify(updatedData));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // Handle year change
  const handleYearChange = (newYear) => {
    // Save current data before switching
    const currentData = getCurrentYearData();
    const updatedDataByYear = {
      ...productionDataByYear,
      [selectedYear]: currentData
    };
    
    setProductionDataByYear(updatedDataByYear);
    saveToLocalStorage(updatedDataByYear);
    
    // Switch to new year
    setSelectedYear(newYear);
  };

  const months = [
    { key: 'jan', label: 'Jan' },
    { key: 'feb', label: 'Feb' },
    { key: 'mar', label: 'Mar' },
    { key: 'apr', label: 'Apr' },
    { key: 'may', label: 'May' },
    { key: 'jun', label: 'Jun' },
    { key: 'jul', label: 'Jul' },
    { key: 'aug', label: 'Aug' },
    { key: 'sep', label: 'Sep' },
    { key: 'oct', label: 'Oct' },
    { key: 'nov', label: 'Nov' },
    { key: 'dec', label: 'Dec' }
  ];

  // Error popup auto-hide effect
  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        setShowError(false);
        setError('');
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [showError]);

  const showErrorMessage = (message) => {
    setError(message);
    setShowError(true);
  };

  // Calculate production totals
  const calculateTotals = () => {
    const currentData = getCurrentYearData();
    const monthlyValues = Object.values(currentData.monthlyProduction).map(v => {
      const num = parseFloat(v);
      return isNaN(num) ? 0 : num;
    });
    const annualTotal = monthlyValues.reduce((sum, val) => sum + val, 0);
    
    const accumulated = [];
    let runningTotal = 0;
    monthlyValues.forEach(val => {
      runningTotal += val;
      accumulated.push(runningTotal);
    });
    
    const averageMonthly = annualTotal / 12;
    
    return {
      monthly: monthlyValues,
      accumulated,
      annual: annualTotal,
      averageMonthly
    };
  };

  const handleProductionChange = (month, value) => {
    if (value && !/^\d*\.?\d*$/.test(value)) {
      showErrorMessage(translations.invalidNumber || 'Please enter a valid number');
      return;
    }

    // Update current year data
    const currentData = getCurrentYearData();
    const updatedMonthlyData = {
      ...currentData.monthlyProduction,
      [month]: value
    };

    const updatedDataByYear = {
      ...productionDataByYear,
      [selectedYear]: {
        ...currentData,
        monthlyProduction: updatedMonthlyData,
        year: selectedYear
      }
    };

    setProductionDataByYear(updatedDataByYear);
    saveToLocalStorage(updatedDataByYear);
    
    // Notify parent component
    if (onDataChange) {
      onDataChange({
        monthlyProduction: updatedMonthlyData,
        year: selectedYear
      });
    }
  };

  const handleSave = () => {
    try {
      const currentData = getCurrentYearData();
      const hasValidData = Object.values(currentData.monthlyProduction).some(value => 
        value && !isNaN(parseFloat(value))
      );

      if (!hasValidData) {
        showErrorMessage(translations.noDataToSave || 'No valid data to save');
        return;
      }

      // Save current year data
      const updatedDataByYear = {
        ...productionDataByYear,
        [selectedYear]: {
          ...currentData,
          year: selectedYear
        }
      };

      setProductionDataByYear(updatedDataByYear);
      saveToLocalStorage(updatedDataByYear);

      if (onDataChange) {
        onDataChange({
          monthlyProduction: currentData.monthlyProduction,
          year: selectedYear
        });
      }
      
      // Success feedback
      showErrorMessage(translations.dataSaved || `Data saved successfully for ${selectedYear}!`);
      
    } catch (error) {
      console.error('Error saving production data:', error);
      showErrorMessage(translations.saveError || 'Error saving data');
    }
  };

  const totals = calculateTotals();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="space-y-6">
        {/* Error Message */}
        {showError && (
          <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in-right">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          </div>
        )}

        {/* Production Data Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Calculator className="h-6 w-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-800">
                {translations.monthlyProduction || 'Monthly Production'} - {selectedYear}
              </h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  {translations.year || 'Year'}:
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => handleYearChange(parseInt(e.target.value))}
                  className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  {[2023, 2024, 2025, 2026, 2027].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                {translations.save || 'Save'}
              </button>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800 font-medium">
                  {translations.productionUnit || 'Production Unit: Tonnes'}
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  {translations.productionNote || 'Enter your monthly production data to track your manufacturing output throughout the year.'}
                </p>
              </div>
            </div>
          </div>

          {/* Monthly Input Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            {months.map((month) => (
              <div key={month.key} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {month.label}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={getCurrentYearData().monthlyProduction[month.key]}
                  onChange={(e) => handleProductionChange(month.key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="0.00"
                />
                <div className="text-xs text-gray-500">tonnes</div>
              </div>
            ))}
          </div>

          {/* Production Summary */}
          <div className="bg-blue-100 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-blue-800 mb-3">
              {translations.productionSummary || 'Production Summary'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {totals.annual.toFixed(2)}
                </div>
                <div className="text-sm text-blue-700">
                  {translations.annualProduction || 'Annual Production (tonnes)'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {totals.averageMonthly.toFixed(2)}
                </div>
                <div className="text-sm text-blue-700">
                  {translations.monthlyAverage || 'Monthly Average (tonnes)'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {totals.monthly.filter(val => val > 0).length}
                </div>
                <div className="text-sm text-blue-700">
                  {translations.activeMonths || 'Active Months'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Production Chart Preview */}
        {totals.annual > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              {translations.productionTrend || 'Production Trend'}
            </h4>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Calculator className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">
                  {translations.chartPlaceholder || 'Production chart visualization would appear here'}
                </p>
                <p className="text-xs mt-1">
                  {translations.totalData || 'Total data points'}: {totals.monthly.filter(val => val > 0).length}/12
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductionPage;