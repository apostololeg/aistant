import { i18n as libI18N } from 'uilib';

import en from './en.json';

const api = libI18N.init({
  en,
  ua: () => import('./ua.json'),
  ru: () => import('./ru.json'),
});

export const i18n = api.i18n;
export const I18N = api.I18N;
