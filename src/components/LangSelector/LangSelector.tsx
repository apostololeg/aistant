import { useMemo } from 'react';
import { withStore } from 'justorm/react';
import { Select } from 'uilib';

import S from './LangSelector.styl';

export default withStore({
  i18n: 'lang',
})(function LangSelector({ store: { i18n } }) {
  const options = useMemo(() => [
    { id: 'en', label: 'EN' },
    { id: 'ua', label: 'УК' },
    { id: 'ru', label: 'РУ' },
  ]);

  return (
    <Select
      className={S.root}
      size="s"
      options={options}
      value={i18n.lang}
      onChange={i18n.changeLang}
    />
  );
});
