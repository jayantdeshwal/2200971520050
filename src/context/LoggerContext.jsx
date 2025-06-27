import React, { createContext, useContext } from 'react';

const LoggerContext = createContext();

export const LoggerProvider = ({ children }) => {
  const log = (type, message, meta = {}) => {
    const logEntry = {
      type,
      message,
      meta,
      timestamp: new Date().toISOString(),
    };

    // Save to localStorage or sessionStorage
    const logs = JSON.parse(localStorage.getItem('logs')) || [];
    logs.push(logEntry);
    localStorage.setItem('logs', JSON.stringify(logs));
  };

  return (
    <LoggerContext.Provider value={{ log }}>
      {children}
    </LoggerContext.Provider>
  );
};

export const useLogger = () => useContext(LoggerContext);