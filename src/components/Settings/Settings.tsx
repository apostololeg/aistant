import { useEffect, useMemo } from 'react';
import { createStore, withStore } from 'justorm/react';
import {
  Input,
  Link,
  Select,
  Button,
  Checkbox,
  Icon,
  AssistiveText,
  Scroll,
  LS,
} from '@homecode/ui';

import { getThemeConfig } from 'tools/theme';
import { I18N, i18n, storeName as i18nStoreName } from 'tools/i18n';
import LangSelector from 'components/LangSelector/LangSelector';

import speechRecognitionLanguages from './speechRecognitionLangs.json';

import S from './Settings.styl';

const MODELS = [
  'gpt-4',
  'gpt-4-0314',
  'gpt-4-32k',
  'gpt-4-32k-0314',
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-0301',
];

const DEFAULT_MODEL = 'gpt-3.5-turbo';

const MODEL_OPTIONS = MODELS.map(name => ({ id: name, label: name }));

const SPEECH_RECOGNITION_LANGS_OPTIONS = (
  speechRecognitionLanguages as any[]
).reduce((acc, [name, ...types]) => {
  const item = { id: types[0], label: name } as any;

  acc.push(item);

  if (types.length > 1) {
    item.isGroup = true;
    acc.push(
      ...types.map(([id, label]) => {
        return { id, label };
      })
    );
  }

  return acc;
}, []);

const voicesByLang = LS.get('voicesByLang') || {};
const setVoicesByLang = (lang, voiceName) => {
  voicesByLang[lang] = voiceName;
  LS.set('voicesByLang', voicesByLang);
};

const isDarkTheme = LS.get('isDarkTheme') ?? true;

export const SettingsStore = createStore('settings', {
  _set(key, val) {
    this[key] = val;
    LS.set(key, val);
  },

  updater: null as any,
  setUpdater(updater) {
    this.updater = () => {
      updater();
      this.updater = null;
    };
  },

  apiKey: LS.get('apiKey') || '',
  setAPIKey(apiKey) {
    this._set('apiKey', apiKey);
  },

  isDarkTheme,
  currThemeConfig: getThemeConfig(isDarkTheme),
  toggleTheme() {
    this._set('isDarkTheme', !this.isDarkTheme);
    this.currThemeConfig = getThemeConfig(this.isDarkTheme);
  },

  model: LS.get('model') || DEFAULT_MODEL,
  changeModel(model) {
    this._set('model', model);
  },

  voiceLang: LS.get('voiceLang') || 'en-US',
  changeVoiceLang(lang) {
    this._set('voiceLang', lang);
    this.updateVoicesByLang();
  },

  voices: speechSynthesis.getVoices(),
  voiceName: LS.get('voiceName'),
  changeVoiceName(voiceName) {
    this._set('voiceName', voiceName);

    setVoicesByLang(this.voiceLang, voiceName);
  },

  updateVoicesList() {
    this.voices = speechSynthesis.getVoices();
    this.updateVoicesByLang();
  },

  updateVoicesByLang() {
    const lang = this.voiceLang;
    const langShort = lang.split('-')[0];
    const voiceName =
      voicesByLang[lang] ||
      this.voices.find(voice => voice.lang === lang)?.name ||
      this.voices.find(voice => voice.lang.startsWith(langShort))?.name;

    this.changeVoiceName(voiceName);
  },

  autoPronounce: true,
  changeAutoPronounce(autoPronounce) {
    this._set('autoPronounce', autoPronounce);
  },
});

speechSynthesis.addEventListener('voiceschanged', () => {
  SettingsStore.updateVoicesList();
});

const Hint = ({ children, ...rest }) => (
  <AssistiveText className={S.hint} {...rest}>
    {children}
  </AssistiveText>
);

const Item = ({ hint = null, children }) => (
  <div className={S.item}>
    {children}
    {hint && <Hint>{hint}</Hint>}
  </div>
);

export default withStore([
  'settings',
  {
    i18n: 'lang',
    dialogue: ['messages'],
  },
])(function Settings({
  onClearHistory,
  store: {
    dialogue: { messages },
    settings: {
      updater,
      apiKey,
      setAPIKey,
      isDarkTheme,
      toggleTheme,
      model,
      changeModel,
      voiceLang,
      changeVoiceLang,
      voices,
      voiceName,
      changeVoiceName,
      updateVoicesByLang,
      autoPronounce,
      changeAutoPronounce,
    },
  },
}) {
  const voicesOptions = useMemo(() => {
    if (!voiceLang) return [];

    const langShort = voiceLang.split('-')[0];

    return voices.reduce((acc, { lang, name }) => {
      if (lang.startsWith(langShort)) {
        acc.push({ id: name, label: name });
      }
      return acc;
    }, []);
  }, [voices, voiceLang]);

  useEffect(() => {
    // init default voice / first time
    if (!voiceName) updateVoicesByLang();
  }, []);

  return (
    <Scroll
      y
      size="s"
      className={S.root}
      innerClassName={S.inner}
      offset={{ y: { before: 70, after: 90 } }}
    >
      {updater && (
        <Item hint={i18n('New update available')}>
          <Button variant="primary" onClick={updater}>
            <I18N id="Update application" />
          </Button>
        </Item>
      )}
      <Item
        hint={
          <>
            <I18N id="Get your API key from" />
            <Link
              href="https://beta.openai.com/docs/api-reference/authentication"
              target="_blank"
            >
              <I18N id="OpenAI website" />
            </Link>
          </>
        }
      >
        <Input
          label={i18n('OpenAI API key')}
          className={S.input}
          type="password"
          value={apiKey}
          onChange={(e, val) => setAPIKey(val)}
        />
      </Item>
      <Item>
        <Checkbox
          label={i18n('Dark theme')}
          checked={isDarkTheme}
          onChange={toggleTheme}
        />
      </Item>
      <Item>
        <Select
          label={i18n('Model')}
          options={MODEL_OPTIONS}
          value={model}
          onChange={changeModel}
        />
      </Item>
      <Item>
        <LangSelector />
      </Item>
      <Item hint={i18n('Speech recognition and answer pronouncation language')}>
        <Select
          isSearchable
          inputProps={{ className: S.input }}
          label={i18n('Voice language')}
          options={SPEECH_RECOGNITION_LANGS_OPTIONS}
          value={voiceLang}
          onChange={changeVoiceLang}
          required
          hideRequiredStar
        />
      </Item>
      <Item
        hint={
          voicesOptions.length
            ? i18n('You can choose specific voice for selected voice language')
            : null
        }
      >
        <>
          <Select
            isSearchable
            inputProps={{ className: S.input }}
            label={i18n('Voice')}
            options={voicesOptions}
            value={voiceName}
            onChange={changeVoiceName}
            required
            hideRequiredStar
          />
          {!voicesOptions.length && (
            <Hint variant="danger">
              <I18N id="No voices for selected language" />
            </Hint>
          )}
        </>
      </Item>
      <Item
        hint={i18n('You always can run pronounciation by clicking on message')}
      >
        <Checkbox
          label={i18n('Auto pronounce answers')}
          checked={autoPronounce}
          onChange={changeAutoPronounce}
        />
      </Item>
      <Item>
        <Button
          onClick={onClearHistory}
          className={S.clearButton}
          disabled={messages.length === 0}
        >
          <Icon type="delete" size="l" />
          <I18N id="Clear chat history" />
        </Button>
      </Item>
    </Scroll>
  );
});
