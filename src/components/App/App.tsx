import { withStore } from 'justorm/react';
import { VH, Theme, dom } from '@homecode/ui';

import 'tools/i18n';
import 'stores';
import ws from 'stores/ws';

import S from './App.styl';
import Dialogue from 'components/Dialogue/Dialogue';
import { useEffect } from 'react';

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

      <Dialogue />
    </div>
  );
});
