import React, { useContext } from 'react';
import { AppContext } from '../App';

const ResultsPage = () => {
  const { t, entries } = useContext(AppContext);

  const calculateEmissions = (category, entry) => {
    if (category === 'electricity') {
      const factor = parseFloat(entry.supplierFactor) || 0.4;
      const usage = parseFloat(entry.usage) || 0;
      return (usage * factor / 1000).toFixed(2);
    }
    const amount = parseFloat(entry.amount) || 0;
    return (amount * 0.5).toFixed(2);
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
                    {entry.category === 'electricity' ? entry.usage + ' kWh' : entry.amount + ' ' + entry.unitOfMeasure}
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
      </div>
    </div>
  );
};

export default ResultsPage;