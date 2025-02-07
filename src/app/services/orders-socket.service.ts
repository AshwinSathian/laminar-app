import { Injectable } from '@angular/core';
import { environment } from '@laminar-app/environment';
import { io, Socket } from 'socket.io-client';

@Injectable()
export class OrdersSocketService {
  private socket: Socket = io(environment.apiUrl);

  constructor() {}

  listenForOrderUpdates(callback: (data: any) => void) {
    this.socket.on('orderUpdated', callback);
  }
}
