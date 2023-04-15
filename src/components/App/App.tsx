import { useState } from 'react';
import { VH, Theme, ThemeDefaults } from 'uilib';

// import 'stores';
import S from './App.styl';
import Dialogue from 'components/Dialogue/Dialogue';

const colors = { active: '#0f80b0' };
const theme = ThemeDefaults.getConfig({ colors });

export default function App() {
  return (
    <div>
      <VH />
      <Theme config={theme} />

      <Dialogue />
    </div>
  );
}
