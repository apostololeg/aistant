import { withStore } from 'justorm/react';
import { VH, Theme } from 'uilib';

import 'tools/i18n';
// import 'stores';

import S from './App.styl';
import Dialogue from 'components/Dialogue/Dialogue';

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
