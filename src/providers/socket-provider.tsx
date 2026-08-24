'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  onlineVisitors: number;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  onlineVisitors: 0,
});

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineVisitors, setOnlineVisitors] = useState(0);

  useEffect(() => {
    // Generate a simple session ID for the current browser session
    let sessionId = sessionStorage.getItem('skylogic_session');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('skylogic_session', sessionId);
    }

    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || '', {
      path: '/socket.io',
      query: { sessionId },
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected');
    });

    socketInstance.on('visitor_count', (count: number) => {
      setOnlineVisitors(count);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, onlineVisitors }}>
      {children}
    </SocketContext.Provider>
  );
}
