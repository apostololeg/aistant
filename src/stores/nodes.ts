import { createStore } from 'justorm/react';
import { LS } from '@homecode/ui';
import ws from 'stores/ws';

export default createStore('nodes', {
  // @ts-ignore
  nodes: new Set(LS.get('nodes')),

  async loadNodes() {
    console.log('### loadNodes');

    ws.socket.emit('nodes', {});
    ws.socket.on('nodes', nodes => {
      this.nodes = new Set(JSON.parse(nodes));
      LS.set('nodes', [...this.nodes.originalObject]);
    });
  },

  addNode(node) {
    this.nodes.add(node);
  },

  removeNode(node) {
    this.nodes.remove(node);
  },
});
