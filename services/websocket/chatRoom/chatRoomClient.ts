import { io, Socket } from 'socket.io-client';
import Default from '@/services/api';

class ChatRoomClient {
  private socket: Socket | null = null;

  connect() {
    if (this.socket) {
      console.warn('ChatRoom WebSocket already connected');
      return;
    }

    this.socket = io(Default.chatRoom, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      timeout: 10000,
    });

    this.socket.on('connect', () => {
      console.log('ChatRoom WebSocket connected');
    });

    this.socket.on('disconnect', (reason) => {
      console.warn('ChatRoom WebSocket disconnected:', reason);
      this.socket = null;
      this.reconnect();
    });

    this.socket.on('connect_error', (error) => {
      console.error('ChatRoom WebSocket connection error:', error);
      this.reconnect();
    });

    window.addEventListener('online', this.reconnect.bind(this));
  }

  connected(): boolean {
    return !!this.socket?.connected;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('ChatRoom WebSocket disconnected');
    }
  }

  reconnect() {
    setTimeout(() => {
      if (!this.socket || !this.socket.connected) {
        this.connect();
      }
    }, 5000);
  }

  emit(event: string, data: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Cannot emit, ChatRoom WebSocket is not connected');
    }
  }

  on(event: string, handler: (data: any) => void) {
    this.socket?.on(event, handler);
  }

  off(event: string, handler: (data: any) => void) {
    this.socket?.off(event, handler);
  }
}

export default new ChatRoomClient();
