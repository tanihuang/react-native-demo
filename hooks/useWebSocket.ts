import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import Default from '@/constants/Default';

const useWebSocket = () => {
  const ws = useRef<Socket | null>(null);

  useEffect(() => {
    ws.current = io(Default.chatRoom, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 3,
      timeout: 10000,
      autoConnect: true,
    });

    ws.current.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    ws.current.on('getChat', (data) => {
      console.log('getChat:', data);
    });

    return () => {
      if (ws.current) {
        ws.current.disconnect();
        console.log('Disconnected from WebSocket server');
      }
    };
  }, []);

  const createChat = (params: any) => {
    if (ws.current) {
      ws.current.emit('createChat', params);
    }
  };

  const getChat = (params: any) => {
    if (ws.current) {
      ws.current.emit('getChat', params);
    }
  };

  return {
    ws: ws.current,
    createChat,
    getChat,
  };
};

export default useWebSocket;
