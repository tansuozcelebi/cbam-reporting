import React, { useContext } from 'react';
import { Download, Globe, BarChart3, FileText } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { AppContext } from '../App';

const AnalysisPage = () => {
  const { t, entries } = useContext(AppContext);

  const calculateEmissions = (category, entry) => {
    if (category === 'electricity') {
      const factor = parseFloat(entry.supplierFactor) || 0.4;
      const usage = parseFloat(entry.usage) || 0;
      return usage * factor / 1000;
    }
    const amount = parseFloat(entry.amount) || 0;
    return amount * 0.5;
  };

  const allEntries = Object.entries(entries).flatMap(([category, items]) =>
    items.map(item => ({
      category,
      emissions: calculateEmissions(category, item)
    }))
  );

  const scope1Emissions = allEntries
    .filter(e => ['fuel', 'cars', 'naturalGas', 'refrigerants'].includes(e.category))
    .reduce((sum, e) => sum + e.emissions, 0);

  const scope2Emissions = allEntries
    .filter(e => e.category === 'electricity')
    .reduce((sum, e) => sum + e.emissions, 0);

  const scope3Emissions = allEntries
    .filter(e => ['flights', 'publicTransport', 'homeWorkers'].includes(e.category))
    .reduce((sum, e) => sum + e.emissions, 0);

  const totalEmissions = scope1Emissions + scope2Emissions + scope3Emissions;
  const scope1Percentage = totalEmissions > 0 ? ((scope1Emissions / totalEmissions) * 100).toFixed(1) : 0;
  const scope2Percentage = totalEmissions > 0 ? ((scope2Emissions / totalEmissions) * 100).toFixed(1) : 0;
  const scope3Percentage = totalEmissions > 0 ? ((scope3Emissions / totalEmissions) * 100).toFixed(1) : 0;

  // Category breakdown
  const categoryEmissions = Object.entries(entries).map(([category, items]) => {
    const categoryTotal = items.reduce((sum, item) => sum + calculateEmissions(category, item), 0);
    return {
      name: t[category],
      value: categoryTotal,
      fullValue: categoryTotal.toFixed(2)
    };
  }).filter(item => item.value > 0).sort((a, b) => b.value - a.value);

  // Monthly trend data (simulated)
  const monthlyData = [
    { month: 'Jan', emissions: (totalEmissions * 0.08).toFixed(2) },
    { month: 'Feb', emissions: (totalEmissions * 0.07).toFixed(2) },
    { month: 'Mar', emissions: (totalEmissions * 0.09).toFixed(2) },
    { month: 'Apr', emissions: (totalEmissions * 0.08).toFixed(2) },
    { month: 'May', emissions: (totalEmissions * 0.085).toFixed(2) },
    { month: 'Jun', emissions: (totalEmissions * 0.09).toFixed(2) },
    { month: 'Jul', emissions: (totalEmissions * 0.075).toFixed(2) },
    { month: 'Aug', emissions: (totalEmissions * 0.08).toFixed(2) },
    { month: 'Sep', emissions: (totalEmissions * 0.09).toFixed(2) },
    { month: 'Oct', emissions: (totalEmissions * 0.085).toFixed(2) },
    { month: 'Nov', emissions: (totalEmissions * 0.08).toFixed(2) },
    { month: 'Dec', emissions: (totalEmissions * 0.09).toFixed(2) }
  ];

  // Scope data for pie chart
  const scopeData = [
    { name: 'Scope 1', value: parseFloat(scope1Percentage), fill: '#059669' },
    { name: 'Scope 2', value: parseFloat(scope2Percentage), fill: '#14b8a6' },
    { name: 'Scope 3', value: parseFloat(scope3Percentage), fill: '#2dd4bf' }
  ].filter(item => item.value > 0);

  // Main category
  const mainCategory = categoryEmissions[0] || { name: t.electricity, value: 0 };
  const mainCategoryPercentage = totalEmissions > 0 ? ((mainCategory.value / totalEmissions) * 100).toFixed(1) : 0;

  return (
    <div className="max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{t.analysis}</h2>
          <p className="text-sm text-gray-500">January 2025 - December 2025</p>
        </div>
        <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2">
          <Download size={18} />
          {t.downloadPDF}
        </button>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">{t.totalEmissions} (tCO2e)</h3>
            <Globe className="text-gray-400" size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalEmissions.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
          <p className="text-xs text-gray-500 mt-1">tCO₂e</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Main Emission Category</h3>
            <BarChart3 className="text-gray-400" size={20} />
          </div>
          <p className="text-xl font-bold text-teal-700">{mainCategory.name}</p>
          <p className="text-xs text-gray-500 mt-1">({mainCategoryPercentage}% of total)</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Entries</h3>
            <FileText className="text-gray-400" size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-900">{allEntries.length}</p>
          <p className="text-xs text-gray-500 mt-1">Data points recorded</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Scope Analysis Pie Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Scope Analysis</h3>
          <p className="text-xs text-gray-500 mb-6">January 2025 - December 2025</p>
          
          <div className="flex justify-center items-center mb-6">
            <div className="relative w-64 h-64">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                {scopeData.length > 0 ? (
                  <>
                    {scopeData.map((item, index) => {
                      const prevPercentage = scopeData.slice(0, index).reduce((sum, d) => sum + d.value, 0);
                      const strokeDasharray = `${item.value * 2.51} ${(100 - item.value) * 2.51}`;
                      const strokeDashoffset = `-${prevPercentage * 2.51}`;
                      
                      return (
                        <circle
                          key={item.name}
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke={item.fill}
                          strokeWidth="20"
                          strokeDasharray={strokeDasharray}
                          strokeDashoffset={strokeDashoffset}
                        />
                      );
                    })}
                  </>
                ) : (
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="20" />
                )}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <p className="text-2xl font-bold text-gray-800">{totalEmissions.toFixed(2)}</p>
                <p className="text-sm text-gray-600">tCO₂e</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded"></div>
                <span className="text-sm">Scope 1</span>
              </div>
              <span className="text-sm font-medium">{scope1Percentage}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-teal-500 rounded"></div>
                <span className="text-sm">Scope 2</span>
              </div>
              <span className="text-sm font-medium">{scope2Percentage}%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-teal-300 rounded"></div>
                <span className="text-sm">Scope 3</span>
              </div>
              <span className="text-sm font-medium">{scope3Percentage}%</span>
            </div>
          </div>
        </div>

        {/* Categories Bar Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Categories with Highest Emissions</h3>
          <p className="text-xs text-gray-500 mb-6">January 2025 - December 2025</p>
          
          <div className="space-y-3">
            {categoryEmissions.slice(0, 5).map((cat, idx) => {
              const percentage = totalEmissions > 0 ? (cat.value / totalEmissions) * 100 : 0;
              return (
                <div key={idx}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-700">{cat.name}</span>
                    <span className="text-sm font-medium text-gray-900">{cat.fullValue} tCO₂e</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Monthly Trend Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Monthly Trend Analysis</h3>
        <p className="text-xs text-gray-500 mb-6">January 2025 - December 2025</p>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="month" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                label={{ value: 'tCO₂e', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="emissions" 
                stroke="#14b8a6" 
                strokeWidth={2}
                fill="url(#colorEmissions)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-teal-50 rounded-lg p-6 border border-teal-200">
          <h3 className="text-lg font-semibold mb-2 text-teal-900">Offset Your Emissions</h3>
          <p className="text-sm text-teal-700 mb-4">{t.totalToOffset} = {totalEmissions.toFixed(2)} tCO₂e</p>
          <button className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium">
            {t.offsetNow}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">{t.resultsBreakdown}</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Scope 1 {t.emissions}</span>
              <span className="text-sm font-bold text-green-700">{scope1Emissions.toFixed(2)} tCO₂e</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Scope 2 {t.emissions}</span>
              <span className="text-sm font-bold text-teal-700">{scope2Emissions.toFixed(2)} tCO₂e</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Scope 3 {t.emissions}</span>
              <span className="text-sm font-bold text-teal-500">{scope3Emissions.toFixed(2)} tCO₂e</span>
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">{t.totalEmissions}</span>
                <span className="text-lg font-bold text-gray-900">{totalEmissions.toFixed(2)} tCO₂e</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with KREA branding */}
      <div className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-center gap-2 opacity-75">
        <span className="text-xs text-gray-500">Powered by</span>
        <svg width="20" height="20" viewBox="0 0 100 100">
          <path d="M20 20 L20 80 Q20 85 25 85 L30 85 Q35 85 35 80 L35 40 Q35 35 40 35 L45 35" stroke="#dc2626" strokeWidth="6" fill="none" strokeLinecap="round"/>
          <path d="M30 20 L30 80 Q30 85 35 85 L40 85 Q45 85 45 80 L45 40 Q45 35 50 35 L55 35" stroke="#dc2626" strokeWidth="6" fill="none" strokeLinecap="round"/>
          <path d="M40 20 L40 80 Q40 85 45 85 L50 85 Q55 85 55 80 L55 40 Q55 35 60 35 L65 35" stroke="#dc2626" strokeWidth="6" fill="none" strokeLinecap="round"/>
        </svg>
        <span className="text-sm font-bold text-red-600 tracking-wider">KREA</span>
      </div>
    </div>
  );
};

export default AnalysisPage;