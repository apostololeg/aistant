import { io } from 'socket.io-client';
import { createStore } from 'justorm/react';

// const WS_URL = 'https://ai.apostol.space';

let socket = null;
const CONNECTION_RESOLVERS = new Set<(socket: any) => void>();

const STORE = createStore('ws', {
  isConnected: false,

  getSocket() {
    return socket;
  },

  connect() {
    socket = io(BAKCEND_DOMAIN, {
      transports: ['websocket', 'polling'],
      rejectUnauthorized: false,
      // secure: true,
    });

    socket.on('connect', () => {
      this.isConnected = true;
      CONNECTION_RESOLVERS.forEach(resolve => resolve(socket));
      CONNECTION_RESOLVERS.clear();
    });
  },

  connected() {
    if (socket) return Promise.resolve(socket);

    return new Promise(resolve => {
      CONNECTION_RESOLVERS.add(resolve);
    });
  },

  disconnect() {
    socket.close();
    socket = null;
  },
});

export default STORE;
