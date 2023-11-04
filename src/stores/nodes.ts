import { createStore } from 'justorm/react';
import { LS, array } from '@homecode/ui';

import type { Node } from 'types/node';
import ws from 'stores/ws';

const STORE = createStore('nodes', {
  items: [],
  byId: {},

  async loadNodes() {
    console.log('### loadNodes');

    const socket = ws.getSocket();

    socket.emit('nodes', {});
    socket.once('nodes', this.onNodes.bind(this));
  },

  // Reveived fresh list of nodes from server
  onNodes(nodes) {
    console.log('nodes', nodes);

    nodes.forEach(node => {
      if (!this.byId[node.id]) this.addNode(node);
    });

    LS.set('nodes', [...this.items.originalObject]);
  },

  // Create new node
  createNode(nodeTemplate: Partial<Node>) {
    const socket = ws.getSocket();

    socket.emit('create_node', { ...nodeTemplate });
    socket.once('create_node', node => {
      // node created, add it to the list
      this.addNode(node);
    });
  },

  addNode(node) {
    array.addUniq(this.items, node, 'id');
    // @ts-ignore
    if (node.id) this.byId[node.id] = node;
  },

  removeNode(node) {
    array.spliceWhere(this.items, node, 'id');
    delete this.byId[node.id];
  },
});

export default STORE;
