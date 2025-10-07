import { useState, useEffect, useCallback } from 'react';
import dbService from '../services/DatabaseService';

export const useDatabase = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // User operations
  const loginUser = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('useDatabase loginUser called with:', email);
      const userName = email.split('@')[0];
      const user = await dbService.createUser(email, userName);
      console.log('User created/found:', user);
      
      // Load user settings
      const settings = await dbService.getUserSettings(user.id);
      console.log('User settings loaded:', settings);
      
      setIsLoading(false);
      return { id: user.id, email: user.email, name: user.name, settings };
    } catch (err) {
      console.error('loginUser error:', err);
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  // Emission entries operations
  const saveEntry = useCallback(async (userId, category, entryData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = dbService.saveEmissionEntry(userId, category, entryData);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  const loadEntries = useCallback(async (userId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const entries = dbService.getEmissionEntries(userId);
      setIsLoading(false);
      return entries;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  const deleteEntry = useCallback(async (userId, entryId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = dbService.deleteEmissionEntry(userId, entryId);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  // Production data operations
  const saveProductionData = useCallback(async (userId, monthlyProduction) => {
    console.log('🎯 useDatabase saveProductionData called with:', userId, monthlyProduction);
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('📤 Calling dbService.saveProductionData...');
      const result = await dbService.saveProductionData(userId, monthlyProduction);
      console.log('✅ dbService.saveProductionData result:', result);
      setIsLoading(false);
      return result;
    } catch (err) {
      console.error('❌ saveProductionData error:', err);
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  const loadProductionData = useCallback(async (userId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = dbService.getProductionData(userId);
      setIsLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  // Settings operations
  const saveSettings = useCallback(async (userId, language, preferences = {}) => {
    try {
      return dbService.saveUserSettings(userId, language, preferences);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Stats operations
  const getUserStats = useCallback(async (userId) => {
    try {
      return dbService.getUserStats(userId);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateEntry = useCallback(async (userId, entryId, entryData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = dbService.updateEmissionEntry(userId, entryId, entryData);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  // Utility operations
  const getAllUsers = useCallback(async () => {
    try {
      return dbService.getAllUsers();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const backupDatabase = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await dbService.exportData();
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  const importDatabase = useCallback(async (data) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await dbService.importData(data);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  }, []);

  return {
    isLoading,
    error,
    loginUser,
    saveEntry,
    loadEntries,
    deleteEntry,
    updateEntry,
    saveProductionData,
    loadProductionData,
    saveSettings,
    getUserStats,
    getAllUsers,
    backupDatabase,
    importDatabase
  };
};