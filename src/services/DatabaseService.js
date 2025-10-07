// IndexedDB database service using Dexie.js
import Dexie from 'dexie';

class CBAMDatabase extends Dexie {
  constructor() {
    super('CBAMDatabase');
    
    this.version(1).stores({
      users: '++id, email, name, created_at, updated_at',
      emission_entries: '++id, user_id, category, entry_data, created_at, updated_at',
      production_data: '++id, user_id, monthly_production, annual_total, created_at, updated_at',
      user_settings: '++id, user_id, language, preferences, created_at, updated_at'
    });
  }
}

class DatabaseService {
  constructor() {
    this.db = new CBAMDatabase();
  }

  // User operations
  async createUser(email, name) {
    try {
      // Check if user already exists
      const existingUser = await this.db.users.where('email').equals(email).first();
      
      if (existingUser) {
        return existingUser;
      }
      
      // Create new user
      const now = new Date().toISOString();
      const userId = await this.db.users.add({
        email,
        name,
        created_at: now,
        updated_at: now
      });
      
      return { id: userId, email, name, created_at: now, updated_at: now };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getUserByEmail(email) {
    return await this.db.users.where('email').equals(email).first();
  }

  // Emission entries operations
  async saveEmissionEntry(userId, category, entryData) {
    const now = new Date().toISOString();
    
    return await this.db.emission_entries.add({
      user_id: userId,
      category,
      entry_data: JSON.stringify(entryData),
      created_at: now,
      updated_at: now
    });
  }

  async getEmissionEntries(userId) {
    const entries = await this.db.emission_entries
      .where('user_id')
      .equals(userId)
      .toArray();
    
    // Group by category
    const grouped = {
      electricity: [],
      naturalGas: [],
      fuel: [],
      cars: [],
      flights: [],
      publicTransport: [],
      refrigerants: [],
      remoteWorking: []
    };
    
    entries.forEach(entry => {
      if (!grouped[entry.category]) {
        grouped[entry.category] = [];
      }
      
      try {
        const parsedData = JSON.parse(entry.entry_data);
        grouped[entry.category].push({
          id: entry.id,
          ...parsedData,
          created_at: entry.created_at,
          updated_at: entry.updated_at
        });
      } catch (error) {
        console.error('Error parsing entry data:', error);
      }
    });

    return grouped;
  }

  async deleteEmissionEntry(userId, entryId) {
    // First verify the entry belongs to the user
    const entry = await this.db.emission_entries.get(entryId);
    
    if (entry && entry.user_id === userId) {
      return await this.db.emission_entries.delete(entryId);
    }
    
    throw new Error('Entry not found or access denied');
  }

  async updateEmissionEntry(userId, entryId, entryData) {
    // First verify the entry belongs to the user
    const entry = await this.db.emission_entries.get(entryId);
    
    if (entry && entry.user_id === userId) {
      const now = new Date().toISOString();
      return await this.db.emission_entries.update(entryId, {
        entry_data: JSON.stringify(entryData),
        updated_at: now
      });
    }
    
    throw new Error('Entry not found or access denied');
  }

  // Production data operations
  async saveProductionData(userId, monthlyProduction) {
    const annualTotal = Object.values(monthlyProduction)
      .reduce((sum, val) => sum + (parseFloat(val) || 0), 0);

    // Delete existing production data for user
    await this.db.production_data.where('user_id').equals(userId).delete();

    // Insert new production data
    const now = new Date().toISOString();
    return await this.db.production_data.add({
      user_id: userId,
      monthly_production: JSON.stringify(monthlyProduction),
      annual_total: annualTotal,
      created_at: now,
      updated_at: now
    });
  }

  async getProductionData(userId) {
    const result = await this.db.production_data
      .where('user_id')
      .equals(userId)
      .last();
    
    if (result) {
      try {
        return {
          monthlyProduction: JSON.parse(result.monthly_production),
          annualTotal: result.annual_total,
          updated_at: result.updated_at
        };
      } catch (error) {
        console.error('Error parsing production data:', error);
        return null;
      }
    }
    
    return null;
  }

  // User settings operations
  async saveUserSettings(userId, language, preferences = {}) {
    // Delete existing settings for user
    await this.db.user_settings.where('user_id').equals(userId).delete();
    
    const now = new Date().toISOString();
    return await this.db.user_settings.add({
      user_id: userId,
      language,
      preferences: JSON.stringify(preferences),
      created_at: now,
      updated_at: now
    });
  }

  async getUserSettings(userId) {
    const result = await this.db.user_settings
      .where('user_id')
      .equals(userId)
      .last();
    
    if (result) {
      try {
        return {
          language: result.language,
          preferences: JSON.parse(result.preferences || '{}')
        };
      } catch (error) {
        console.error('Error parsing user settings:', error);
      }
    }
    
    return { language: 'en', preferences: {} };
  }

  // Utility methods
  async getAllUsers() {
    return await this.db.users.orderBy('created_at').reverse().toArray();
  }

  async getUserStats(userId) {
    // Get entry counts by category
    const entries = await this.db.emission_entries
      .where('user_id')
      .equals(userId)
      .toArray();

    const entryCounts = entries.reduce((acc, entry) => {
      acc[entry.category] = (acc[entry.category] || 0) + 1;
      return acc;
    }, {});

    // Get production total
    const production = await this.db.production_data
      .where('user_id')
      .equals(userId)
      .last();

    return {
      entries: entryCounts,
      totalProduction: production?.annual_total || 0
    };
  }

  // Database maintenance
  async clearAllData() {
    await this.db.transaction('rw', this.db.users, this.db.emission_entries, this.db.production_data, this.db.user_settings, () => {
      this.db.users.clear();
      this.db.emission_entries.clear();
      this.db.production_data.clear();
      this.db.user_settings.clear();
    });
  }

  async exportData() {
    const users = await this.db.users.toArray();
    const entries = await this.db.emission_entries.toArray();
    const production = await this.db.production_data.toArray();
    const settings = await this.db.user_settings.toArray();

    return {
      users,
      entries,
      production,
      settings,
      exportDate: new Date().toISOString()
    };
  }

  async importData(data) {
    await this.clearAllData();
    
    if (data.users) await this.db.users.bulkAdd(data.users);
    if (data.entries) await this.db.emission_entries.bulkAdd(data.entries);
    if (data.production) await this.db.production_data.bulkAdd(data.production);
    if (data.settings) await this.db.user_settings.bulkAdd(data.settings);
  }
}

// Export singleton instance
const dbService = new DatabaseService();
export default dbService;