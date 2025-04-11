import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const BlockchainContext = createContext();

export function BlockchainProvider({ children }) {
  const [notification, setNotification] = useState(null);

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE,
  });

  const createGroup = async (groupData) => {
    try {
      const response = await api.post('/groups', groupData);
      showNotification('Group created successfully!', 'success');
      return response.data;
    } catch (error) {
      showNotification(error.response?.data?.error || 'Creation failed', 'error');
      throw error;
    }
  };

  const showNotification = (message, severity = 'info') => {
    setNotification({ message, severity });
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <BlockchainContext.Provider value={{ createGroup, notification }}>
      {children}
    </BlockchainContext.Provider>
  );
}

export const useBlockchain = () => useContext(BlockchainContext);