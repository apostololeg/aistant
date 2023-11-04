import { createStore } from 'justorm/react';
// import { LS, array } from '@homecode/ui';

import ws from 'stores/ws';
import { EVENT_TYPES } from 'types';
import { Run } from 'types/run';

const STORE = createStore('runs', {
  byId: {},

  runNode(nodeId, options) {
    ws.getSocket().emit('run_node', { nodeId, options });
  },

  onInit(runs: Run[]) {
    runs.forEach(run => this.updateRunData(run));
  },

  updateRunData(run) {
    console.log('updateRunData()', run);
    this.byId[run.id] = run;
  },
});

ws.connected().then(socket => {
  socket.on(EVENT_TYPES.RUN_UPDATED, run => STORE.updateRunData(run));
});

export default STORE;
