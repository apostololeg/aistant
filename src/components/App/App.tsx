import { useEffect } from 'react';
import { withStore } from 'justorm/react';
import { VH, Theme, dom } from '@homecode/ui';

import 'tools/i18n';
import 'stores';
import ws from 'stores/ws';
import NodesEditor from 'components/NodesEditor/NodesEditor';

import S from './App.styl';

dom.watchControllerFlag();

export default withStore({ settings: 'isDarkTheme', nodes: [] })(function App({
  store: {
    settings: { currThemeConfig },
    nodes,
  },
}) {
  useEffect(() => {});

  useEffect(() => {
    ws.connect(() => {
      nodes.loadNodes();
    });
    return () => ws.disconnect();
  }, []);

  return (
    <div>
      <VH />
      <Theme config={currThemeConfig} />

      <NodesEditor />
    </div>
  );
});
