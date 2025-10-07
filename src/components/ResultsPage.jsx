import React, { useContext } from 'react';
import { AppContext } from '../App';

const ResultsPage = () => {
  const { t, entries } = useContext(AppContext);

  const calculateEmissions = (category, entry) => {
    if (category === 'electricity') {
      const factor = parseFloat(entry.supplierFactor) || parseFloat(entry.co2EmissionFactor) || 0.4;
      
      // Check if monthly data exists and sum it up
      if (entry.monthlyData) {
        const monthlyValues = Object.values(entry.monthlyData).map(v => parseFloat(v) || 0);
        const totalMonthlyUsage = monthlyValues.reduce((sum, val) => sum + val, 0);
        if (totalMonthlyUsage > 0) {
          return (totalMonthlyUsage * factor / 1000).toFixed(2);
        }
      }
      
      // Fall back to single usage value if no monthly data
      const usage = parseFloat(entry.usage) || 0;
      return (usage * factor / 1000).toFixed(2);
    }
    
    // For other categories, check monthly data first
    if (entry.monthlyData) {
      const monthlyValues = Object.values(entry.monthlyData).map(v => parseFloat(v) || 0);
      const totalMonthlyAmount = monthlyValues.reduce((sum, val) => sum + val, 0);
      if (totalMonthlyAmount > 0) {
        return (totalMonthlyAmount * 0.5).toFixed(2); // Using default factor - should be category-specific
      }
    }
    
    // Fall back to single amount value
    const amount = parseFloat(entry.amount) || 0;
    return (amount * 0.5).toFixed(2);
  };

  const getTotalConsumption = (category, entry) => {
    if (category === 'electricity') {
      // Check if monthly data exists and sum it up
      if (entry.monthlyData) {
        const monthlyValues = Object.values(entry.monthlyData).map(v => parseFloat(v) || 0);
        const totalMonthlyUsage = monthlyValues.reduce((sum, val) => sum + val, 0);
        if (totalMonthlyUsage > 0) {
          return totalMonthlyUsage;
        }
      }
      // Fall back to single usage value
      return parseFloat(entry.usage) || 0;
    }
    
    // For other categories
    if (entry.monthlyData) {
      const monthlyValues = Object.values(entry.monthlyData).map(v => parseFloat(v) || 0);
      const totalMonthlyAmount = monthlyValues.reduce((sum, val) => sum + val, 0);
      if (totalMonthlyAmount > 0) {
        return totalMonthlyAmount;
      }
    }
    // Fall back to single amount value
    return parseFloat(entry.amount) || 0;
  };

  const allEntries = Object.entries(entries).flatMap(([category, items]) =>
    items.map(item => ({
      ...item,
      category,
      categoryLabel: t[category],
      emissions: calculateEmissions(category, item),
      wttEmissions: (parseFloat(calculateEmissions(category, item)) * 0.15).toFixed(2)
    }))
  );

  const totalEmissions = allEntries.reduce((sum, entry) => sum + parseFloat(entry.emissions), 0).toFixed(2);
  const totalWTT = allEntries.reduce((sum, entry) => sum + parseFloat(entry.wttEmissions), 0).toFixed(2);
  const overallTotal = (parseFloat(totalEmissions) + parseFloat(totalWTT)).toFixed(2);

  // Calculate monthly breakdown
  const calculateMonthlyBreakdown = () => {
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const monthLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    return months.map((monthKey, index) => {
      let monthlyEmissions = 0;
      let monthlyWTT = 0;
      
      // Calculate emissions for each category for this month
      Object.entries(entries).forEach(([category, items]) => {
        items.forEach(item => {
          if (item.monthlyData && item.monthlyData[monthKey]) {
            const monthlyValue = parseFloat(item.monthlyData[monthKey]) || 0;
            if (monthlyValue > 0) {
              let emissions = 0;
              if (category === 'electricity') {
                const factor = parseFloat(item.supplierFactor) || parseFloat(item.co2EmissionFactor) || 0.4;
                emissions = monthlyValue * factor / 1000;
              } else {
                emissions = monthlyValue * 0.5; // Default factor for other categories
              }
              monthlyEmissions += emissions;
              monthlyWTT += emissions * 0.15; // WTT is 15% of direct emissions
            }
          }
        });
      });
      
      return {
        month: monthLabels[index],
        emissions: monthlyEmissions.toFixed(2),
        wtt: monthlyWTT.toFixed(2),
        total: (monthlyEmissions + monthlyWTT).toFixed(2)
      };
    });
  };

  const monthlyBreakdown = calculateMonthlyBreakdown();

  return (
    <div className="max-w-6xl">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.results}</h2>
        
        <div className="mb-6 flex gap-4">
          <div className="bg-teal-50 p-4 rounded-lg flex-1">
            <p className="text-sm text-gray-600">{t.totalEmissions}</p>
            <p className="text-2xl font-bold text-teal-700">{totalEmissions} tCO₂e</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg flex-1">
            <p className="text-sm text-gray-600">{t.wttEmissions}</p>
            <p className="text-2xl font-bold text-orange-700">{totalWTT} tCO₂e</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg flex-1">
            <p className="text-sm text-gray-600">{t.overallTotal}</p>
            <p className="text-2xl font-bold text-purple-700">{overallTotal} tCO₂e</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.details}</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t.amount}</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t.emissions}</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t.wttEmissions}</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">{t.overallTotal}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {allEntries.map((entry, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{entry.categoryLabel}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {entry.category === 'electricity' ? (
                      `${entry.source === 'purchased' ? t.purchasedElectricity : t.renewableElectricity}`
                    ) : (
                      entry.unitOfMeasure
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">
                    {entry.category === 'electricity' ? 
                      getTotalConsumption(entry.category, entry) + ' kWh' : 
                      getTotalConsumption(entry.category, entry) + ' ' + entry.unitOfMeasure}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-teal-700">{entry.emissions}</td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-orange-700">{entry.wttEmissions}</td>
                  <td className="px-4 py-3 text-sm text-right font-bold text-purple-700">
                    {(parseFloat(entry.emissions) + parseFloat(entry.wttEmissions)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Monthly Breakdown Section */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Monthly Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Direct Emissions (tCO₂e)</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">WTT Emissions (tCO₂e)</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total (tCO₂e)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {monthlyBreakdown.map((month, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{month.month}</td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-teal-700">{month.emissions}</td>
                    <td className="px-4 py-3 text-sm text-right font-medium text-orange-700">{month.wtt}</td>
                    <td className="px-4 py-3 text-sm text-right font-bold text-purple-700">{month.total}</td>
                  </tr>
                ))}
                {/* Yearly Total Row */}
                <tr className="bg-gray-100 font-bold">
                  <td className="px-4 py-3 text-sm font-bold text-gray-900">YEARLY TOTAL</td>
                  <td className="px-4 py-3 text-sm text-right font-bold text-teal-700">{totalEmissions}</td>
                  <td className="px-4 py-3 text-sm text-right font-bold text-orange-700">{totalWTT}</td>
                  <td className="px-4 py-3 text-sm text-right font-bold text-purple-700">{overallTotal}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;