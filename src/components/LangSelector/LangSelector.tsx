import { withStore } from 'justorm/react';
import { Select } from 'uilib';

const options = [
  { id: 'en', label: 'English' },
  { id: 'ua', label: 'Українська' },
  { id: 'ru', label: 'Русский' },
];

export default withStore({
  i18n: 'lang',
})(function LangSelector({ store: { i18n } }) {
  return (
    <Select
      label="Language"
      // size="s"
      options={options}
      value={i18n.lang}
      onChange={i18n.changeLang}
      required
      hideRequiredStar
    />
  );
});
