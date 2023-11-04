import { createStore } from 'justorm/react';
import { LS, array } from '@homecode/ui';

import { EVENT_TYPES } from 'types';
import type { Node } from 'types/node';
import ws from 'stores/ws';

const UPDATE_RESOLVERS = {};

const STORE = createStore('nodes', {
  ids: [] as string[],
  byId: {},
  selectedId: null,
  run: null,

  setSelected(nodeId = null) {
    if (this.selectedId === nodeId) return;

    this.selectedId = nodeId;
  },

  /**
   * Create new node
   */
  createNode(nodeTemplate: Partial<Node> = {}) {
    ws.getSocket().emit(EVENT_TYPES.CREATE_NODE, { ...nodeTemplate });
  },

  /**
   * Update node on server
   */
  updateNode(id, dto) {
    const socket = ws.getSocket();

    return new Promise(resolve => {
      socket.emit(EVENT_TYPES.UPDATE_NODE, { id, ...dto });
      UPDATE_RESOLVERS[id] = resolve;
    });
  },

  addNode(node) {
    array.addUniq(this.ids, node.id);
    this.byId[node.id] = node;

    this.saveToLS();
  },

  removeNode(node) {
    array.spliceWhere(this.ids, node.id);
    delete this.byId[node.id];

    this.saveToLS();
  },

  // Save nodes data and ids list to local storage
  saveToLS() {
    LS.set('byId', { ...this.byId.originalObject });
    LS.set('ids', this.ids);
  },

  /**
   * Reveived state from server
   */
  onInit(nodes) {
    nodes
      .sort((a, b) => a.id - b.id)
      .forEach(node => {
        if (!this.byId[node.id]) this.addNode(node);
      });

    this.saveToLS();
  },

  onCreated(node) {
    this.addNode(node);
    this.saveToLS();
  },

  onUpdated(node) {
    const { id } = node;

    this.addNode(node);

    UPDATE_RESOLVERS[id]?.(node);
    delete UPDATE_RESOLVERS[id];

    this.saveToLS();
  },
});

export default STORE;
