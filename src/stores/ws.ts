import { io } from 'socket.io-client';
import { createStore } from 'justorm/react';

export default createStore('ws', {
  socket: null,
  connect(cb) {
    this.socket = io('https://ai.apostol.space', {
      rejectUnauthorized: false,
      secure: true,
    });

    this.socket.on('connect', () => {
      console.log('WS connect', this.socket.id);
      cb?.(this.socket);
      // this.socket.emit('message', 'Hello from client');
    });

    this.socket.on('message', msg => {
      console.log('WS message', msg);
    });
  },

  disconnect() {
    this.socket.close();
    this.socket = null;
  },
});
