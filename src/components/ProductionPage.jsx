import React, { useState, useEffect } from 'react';
import { Calculator, Save, Info } from 'lucide-react';

const ProductionPage = ({ translations, onDataChange, data = {} }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [productionData, setProductionData] = useState({
    monthlyProduction: {
      jan: data.monthlyProduction?.jan || '',
      feb: data.monthlyProduction?.feb || '',
      mar: data.monthlyProduction?.mar || '',
      apr: data.monthlyProduction?.apr || '',
      may: data.monthlyProduction?.may || '',
      jun: data.monthlyProduction?.jun || '',
      jul: data.monthlyProduction?.jul || '',
      aug: data.monthlyProduction?.aug || '',
      sep: data.monthlyProduction?.sep || '',
      oct: data.monthlyProduction?.oct || '',
      nov: data.monthlyProduction?.nov || '',
      dec: data.monthlyProduction?.dec || ''
    },
    year: data.year || new Date().getFullYear()
  });

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

  // Calculate totals
  const calculateTotals = () => {
    const monthlyValues = Object.values(productionData.monthlyProduction).map(v => {
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

    return {
      monthly: monthlyValues,
      accumulated: accumulated,
      annual: annualTotal
    };
  };

  const totals = calculateTotals();

  const handleMonthChange = (month, value) => {
    const newData = {
      ...productionData,
      monthlyProduction: {
        ...productionData.monthlyProduction,
        [month]: value
      },
      year: selectedYear
    };
    setProductionData(newData);
    onDataChange('production', newData);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    const newData = {
      ...productionData,
      year: year
    };
    setProductionData(newData);
    onDataChange('production', newData);
  };

  const handleSave = () => {
    console.log('💾 Production Save button clicked!');
    console.log('📊 Current production data:', productionData);
    console.log('📅 Selected year:', selectedYear);
    
    // Trigger final save to ensure data is persistent
    const finalData = {
      ...productionData,
      year: selectedYear
    };
    
    console.log('📤 Calling onDataChange with:', finalData);
    onDataChange('production', finalData);
    
    // Show success message
    const message = translations.saveProductionSuccess || `Production data for ${selectedYear} saved successfully!`;
    alert(message);
  };

  // Update selectedYear when data prop changes
  useEffect(() => {
    if (data.year) {
      setSelectedYear(data.year);
    }
  }, [data.year]);

  useEffect(() => {
    if (Object.keys(data).length > 0) {
      setProductionData({
        monthlyProduction: {
          jan: data.monthlyProduction?.jan || '',
          feb: data.monthlyProduction?.feb || '',
          mar: data.monthlyProduction?.mar || '',
          apr: data.monthlyProduction?.apr || '',
          may: data.monthlyProduction?.may || '',
          jun: data.monthlyProduction?.jun || '',
          jul: data.monthlyProduction?.jul || '',
          aug: data.monthlyProduction?.aug || '',
          sep: data.monthlyProduction?.sep || '',
          oct: data.monthlyProduction?.oct || '',
          nov: data.monthlyProduction?.nov || '',
          dec: data.monthlyProduction?.dec || ''
        },
        year: data.year || new Date().getFullYear()
      });
    }
  }, [data]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 font-sans">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-600">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Calculator className="h-8 w-8 text-red-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {translations.production || 'Production'}
              </h2>
              <p className="text-gray-600">
                {translations.productionHelp || 'Enter monthly production amounts in tons. This data will be used to calculate emissions per kg of production.'}
              </p>
            </div>
          </div>
          
          {/* Year Selection */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">
              {translations.year || 'Year'}:
            </label>
            <select
              value={selectedYear}
              onChange={(e) => handleYearChange(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
            >
              {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Monthly Production Input */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Info className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-800">
              {translations.monthlyProduction || 'Monthly Production'} - {selectedYear}
            </h3>
          </div>
          
          <div className="text-sm text-gray-600">
            {translations.productionUnit || 'All values in tons (t)'}
          </div>
        </div>

        {/* Production Input Grid */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                  {translations.totalProduction || 'Total Production (monthly)'}
                </th>
                <th className="border border-gray-300 px-3 py-3 text-center font-medium text-gray-600">t</th>
                {months.map(month => (
                  <th key={month.key} className="border border-gray-300 px-3 py-3 text-center font-medium text-gray-600 min-w-[80px]">
                    {month.label.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Monthly Input Row */}
              <tr className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-3 font-medium text-gray-700">
                  {translations.productionInTons || 'Production in tons'}
                </td>
                <td className="border border-gray-300 px-3 py-3 text-center text-gray-600">t</td>
                {months.map(month => (
                  <td key={month.key} className="border border-gray-300 px-2 py-2">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={productionData.monthlyProduction[month.key]}
                      onChange={(e) => handleMonthChange(month.key, e.target.value)}
                      className="w-full px-2 py-1 text-center border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="0"
                    />
                  </td>
                ))}
              </tr>

              {/* Accumulated Production Row */}
              <tr className="bg-blue-50">
                <td className="border border-gray-300 px-4 py-3 font-semibold text-blue-700">
                  {translations.accumulatedProduction || 'Accumulated Production'}
                </td>
                <td className="border border-gray-300 px-3 py-3 text-center text-blue-600">t</td>
                {totals.accumulated.map((acc, index) => (
                  <td key={index} className="border border-gray-300 px-3 py-3 text-center font-medium text-blue-700">
                    {acc.toFixed(2)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Annual Total */}
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-green-800">
              {translations.annualProduction || 'Annual Production'}:
            </span>
            <span className="text-2xl font-bold text-green-600">
              {totals.annual.toFixed(2)} t
            </span>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg"
        >
          <Save className="h-5 w-5" />
          {translations.saveProduction || 'Save Production Data'}
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-orange-600 mt-0.5" />
          <div className="text-sm text-orange-800">
            <p className="font-medium mb-1">{translations.carbonPerKg || 'Carbon per kg'}:</p>
            <p>
              {translations.emissionsPerKg || 'Emissions per kg of production'} = 
              ({translations.totalEmissionsFormula || 'Total Emissions ÷ Annual Production × 1000'})
            </p>
            <p className="mt-2 text-orange-700">
              {translations.productionAnalysisNote || 'This data will be used to calculate carbon emissions per kg on the Analysis page.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionPage;