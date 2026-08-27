'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/api';

interface SocketContextType {
  socket: null;
  onlineVisitors: number;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  onlineVisitors: 0,
});

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [onlineVisitors, setOnlineVisitors] = useState(0);

  useEffect(() => {
    const fetchOnline = async () => {
      try {
        const { data } = await api.get('/visitors/stats');
        setOnlineVisitors(data.data?.online || 0);
      } catch {
        // silent
      }
    };

    fetchOnline();
    const interval = setInterval(fetchOnline, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SocketContext.Provider value={{ socket: null, onlineVisitors }}>
      {children}
    </SocketContext.Provider>
  );
}
