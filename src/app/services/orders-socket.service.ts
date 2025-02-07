import { Injectable } from '@angular/core';
import { environment } from '@laminar-app/environment';
import { io, Socket } from 'socket.io-client';

@Injectable()
export class OrdersSocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(environment.apiUrl, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
    });

    this.socket.on('connect', () => console.log('Connected to WebSocket'));
    this.socket.on('disconnect', () => console.warn('WebSocket disconnected'));
    this.socket.on('connect_error', (err) =>
      console.error('WebSocket error:', err)
    );
  }

  listenForOrderUpdates(callback: (data: any) => void) {
    this.socket.on('orderUpdated', callback);
  }
}
