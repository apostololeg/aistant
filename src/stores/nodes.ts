import { createStore } from 'justorm/react';
import { LS, array } from '@homecode/ui';

import type { Node } from 'types/node';
import ws from 'stores/ws';

const STORE = createStore('nodes', {
  items: [],
  byId: {},
  selectedId: null,

  setSelected(nodeId = null) {
    if (this.selectedId === nodeId) return;

    this.selectedId = nodeId;
  },

  async loadNodes() {
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

    this.saveToLS();
  },

  saveToLS() {
    LS.set('nodes', [...this.items.originalObject]);
  },

  // Create new node
  createNode(nodeTemplate: Partial<Node> = {}) {
    const socket = ws.getSocket();

    socket.emit('create_node', { ...nodeTemplate });
    socket.once('create_node', node => {
      // node created, add it to the list
      this.addNode(node);
      this.saveToLS();
    });
  },

  updateNode(id, dto) {
    const socket = ws.getSocket();

    return new Promise(resolve => {
      socket.emit('update_node', { id, ...dto });
      socket.once('update_node', node => {
        // node updated, update it in the list
        Object.assign(this.byId[node.id], node);
        resolve(this.byId[node.id]);
        this.saveToLS();
      });
    });
  },

  addNode(node) {
    array.addUniq(this.items, node, 'id');
    this.byId[node.id] = node;
  },

  removeNode(node) {
    array.spliceWhere(this.items, node, 'id');
    delete this.byId[node.id];

    this.saveToLS();
  },

  runNode(id) {
    const socket = ws.getSocket();

    socket.emit('run_node', { id });
    socket.once('run_node', node => {
      // node updated, update it in the list
      Object.assign(this.byId[node.id], node);
      this.saveToLS();
    });
  },
});

export default STORE;
