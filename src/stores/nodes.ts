import { createStore } from 'justorm/react';
import { LS } from '@homecode/ui';
import ws from 'stores/ws';

const STORE = createStore('nodes', {
  // @ts-ignore
  nodes: new Set(LS.get('nodes')),

  async loadNodes() {
    console.log('### loadNodes');

    ws.socket.once('nodes', nodes => {
      console.log('nodes', nodes);
      this.nodes = new Set(JSON.parse(nodes));
      LS.set('nodes', [...this.nodes.originalObject]);
    });

    ws.socket.emit('nodes', {});
  },

  createNode() {
    ws.socket.once('create_node', node => {
      this.addNode(node);
    });

    ws.socket.emit('create_node', {});
  },

  addNode(node = {}) {
    this.nodes.add(node);
  },

  removeNode(node) {
    this.nodes.remove(node);
  },
});

export default STORE;
