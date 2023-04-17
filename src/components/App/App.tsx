import { withStore } from 'justorm/react';
import { VH, Theme, dom } from 'uilib';

if (!isDEV) {
  import('pwa');
}

import 'tools/i18n';
// import 'stores';

import S from './App.styl';
import Dialogue from 'components/Dialogue/Dialogue';

dom.watchControllerFlag();

export default withStore({ settings: 'isDarkTheme' })(function App({
  store: {
    settings: { currThemeConfig },
  },
}) {
  return (
    <div>
      <VH />
      <Theme config={currThemeConfig} />

      <Dialogue />
    </div>
  );
});
