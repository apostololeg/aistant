import { io } from 'socket.io-client';
import { createStore } from 'justorm/react';

// const WS_URL = 'https://ai.apostol.space';

let socket = null;

export default createStore('ws', {
  getSocket() {
    return socket;
  },

  once(event, callback) {
    socket.once(event, callback);
  },

  connect(cb) {
    socket = io(BAKCEND_DOMAIN, {
      transports: ['websocket', 'polling'],
      rejectUnauthorized: false,
      // secure: true,
    });

    // @ts-ignore
    window.socket = socket;

    socket.on('connect', () => {
      console.log('WS connect', socket.id);
      cb?.(socket);
      socket.emit('message', 'Hello from client');
    });

    socket.on('message', msg => {
      console.log('WS message', msg);
    });
  },

  disconnect() {
    socket.close();
    socket = null;
  },
});
