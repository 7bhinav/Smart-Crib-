import React, { createContext, useContext, useState } from 'react';

const VitalsContext = createContext(null);

export const VitalsProvider = ({ children }) => {
  const [vitals, setVitals] = useState({});
  const [urgentEvent, setUrgentEvent] = useState(null);

  const publishVitals = (next) => setVitals(next);
  const publishUrgent = (evt) => setUrgentEvent(evt);

  return (
    <VitalsContext.Provider value={{ vitals, publishVitals, urgentEvent, publishUrgent }}>
      {children}
    </VitalsContext.Provider>
  );
};

export const useVitals = () => {
  const ctx = useContext(VitalsContext);
  if (!ctx) throw new Error('useVitals must be used within VitalsProvider');
  return ctx;
};

export default VitalsContext;
