import { io, Socket } from 'socket.io-client';
import Default from '@/constants/Default';

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
      reconnectionAttempts: 3,
      timeout: 10000,
    });

    this.socket.on('connect', () => {
      console.log('ChatRoom WebSocket connected');
    });

    this.socket.on('disconnect', (reason) => {
      console.warn('ChatRoom WebSocket disconnected:', reason);
      this.socket = null;
    });

    this.socket.on('connect_error', (error) => {
      console.error('ChatRoom WebSocket connection error:', error);
    });
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

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('ChatRoom WebSocket disconnected');
    }
  }

  isConnected(): boolean {
    return !!this.socket?.connected;
  }
}

export default new ChatRoomClient();
