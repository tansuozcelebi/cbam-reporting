import React, { useState, useContext } from 'react';
import { Zap, Flame, Fuel, Car, Plane, Bus, Wind, Home, Save, X, Edit2, Trash2 } from 'lucide-react';
import { AppContext } from '../App';

const InputForm = ({ category, setCurrentInputForm, setCurrentPage }) => {
  const { t, addEntry, entries, updateEntry, deleteEntry } = useContext(AppContext);
  const [formData, setFormData] = useState({
    source: 'purchased',
    supplierFactor: '',
    usage: '',
    unitOfMeasure: '',
    amount: '',
    link: '',
    comments: ''
  });
  const [editingId, setEditingId] = useState(null);

  const categoryIcons = {
    electricity: Zap,
    naturalGas: Flame,
    fuel: Fuel,
    cars: Car,
    flights: Plane,
    publicTransport: Bus,
    refrigerants: Wind,
    homeWorkers: Home
  };

  const Icon = categoryIcons[category];
  const categoryLabel = t[category];

  const handleSave = () => {
    if (category === 'electricity' && !formData.usage) return;
    if (category !== 'electricity' && (!formData.unitOfMeasure || !formData.amount)) return;

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
      unitOfMeasure: '',
      amount: '',
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
      unitOfMeasure: '',
      amount: '',
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.source}</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFormData({...formData, source: 'purchased'})}
                      className={`px-4 py-2 rounded-lg ${formData.source === 'purchased' ? 'bg-teal-600 text-white' : 'bg-white border border-gray-300'}`}
                    >
                      {t.purchasedElectricity}
                    </button>
                    <button
                      onClick={() => setFormData({...formData, source: 'renewable'})}
                      className={`px-4 py-2 rounded-lg ${formData.source === 'renewable' ? 'bg-teal-600 text-white' : 'bg-white border border-gray-300'}`}
                    >
                      {t.renewableElectricity}
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.supplierFactor}</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.supplierFactor}
                    onChange={(e) => setFormData({...formData, supplierFactor: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    placeholder="3"
                  />
                  <p className="text-xs text-gray-500 mt-1">{t.supplierFactorHelp}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t.usage}</label>
                  <input
                    type="number"
                    value={formData.usage}
                    onChange={(e) => setFormData({...formData, usage: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    placeholder="30000"
                  />
                </div>
              </>
            )}

            {category !== 'electricity' && (
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
                    <p className="text-sm">
                      <span className="font-medium">{entry.source === 'purchased' ? t.purchasedElectricity : t.renewableElectricity}</span>
                      {' - '}
                      {entry.usage} kWh
                      {entry.supplierFactor && ` (Factor: ${entry.supplierFactor})`}
                    </p>
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