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
      const userName = email.split('@')[0];
      const user = dbService.createUser(email, userName);
      
      // Load user settings
      const settings = dbService.getUserSettings(user.id);
      
      setIsLoading(false);
      return { user, settings };
    } catch (err) {
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
    setIsLoading(true);
    setError(null);
    
    try {
      const result = dbService.saveProductionData(userId, monthlyProduction);
      setIsLoading(false);
      return result;
    } catch (err) {
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