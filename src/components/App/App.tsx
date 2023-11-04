import { useEffect } from 'react';
import { withStore } from 'justorm/react';
import { VH, Theme, dom } from '@homecode/ui';
import cn from 'classnames';

import 'tools/i18n';
import 'stores';
import NodesEditor from 'components/NodesEditor/NodesEditor';
import RunsDisplay from 'components/RunsDisplay/RunsDisplay';

import S from './App.styl';
import { EVENT_TYPES } from 'types';

dom.watchControllerFlag();

export default withStore({
  app: [],
  settings: 'isDarkTheme',
  nodes: [],
  runs: [],
  ws: 'isConnected',
})(function App({
  store: {
    app,
    ws,
    settings: { currThemeConfig },
    nodes,
    runs,
  },
}) {
  useEffect(() => {
    ws.connect();
    ws.connected().then(socket => {
      socket.on(EVENT_TYPES.INIT, state => {
        console.log('init state', state);
        nodes.onInit(state.nodes);
        runs.onInit(state.runs);
        app.setModelsList(state.models);
      });
      socket.on(EVENT_TYPES.CREATE_NODE, nodes.onCreated.bind(nodes));
      socket.on(EVENT_TYPES.UPDATE_NODE, nodes.onUpdated.bind(nodes));
    });

    return () => ws.disconnect();
  }, []);

  return (
    <div className={cn(S.root, ws.isConnected && S.connected)}>
      <VH />
      <Theme config={currThemeConfig} />

      <NodesEditor />
      <RunsDisplay />
    </div>
  );
});
