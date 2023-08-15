import { withStore } from 'justorm/react';
import { Select } from '@homecode/ui';

import { i18n } from 'tools/i18n';

const options = [
  { id: 'en', label: 'English' },
  { id: 'ua', label: 'Українська' },
  { id: 'ru', label: 'Русский' },
];

export default withStore({
  i18n: 'lang',
})(function LangSelector({
  store: {
    i18n: { lang, changeLang },
  },
}) {
  return (
    <Select
      label={i18n('Interface language')}
      // size="s"
      options={options}
      value={lang}
      onChange={changeLang}
      required
      hideRequiredStar
    />
  );
});
