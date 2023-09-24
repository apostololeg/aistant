import { createStore } from 'justorm/react';
import { LS } from '@homecode/ui';
import ws from 'stores/ws';

const localNodes = LS.get('nodes') || [];

export default createStore('nodes', {
  nodes: new Set(localNodes),
  async loadNodes() {
    console.log('### loadNodes');

    ws.socket.emit('nodes');
    ws.socket.on('nodes', nodes => {
      this.nodes = new Set(nodes);
      LS.set('nodes', Array.from(this.nodes));
    });
  },
  addNode(node) {
    this.nodes.add(node);
  },
  removeNode(node) {
    this.nodes.remove(node);
  },
});
