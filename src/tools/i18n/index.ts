import { i18n as libI18N } from '@homecode/ui';

import en from './en.json';

const api = libI18N.init({
  en,
  ua: () => import('./ua.json'),
  ru: () => import('./ru.json'),
});

export const i18n = api.i18n;
export const I18N = api.I18N;
export const withI18N = api.withI18N;
export const storeName = api.storeName;
