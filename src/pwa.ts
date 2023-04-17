import runtime from '@lcdp/offline-plugin/runtime';

import { SettingsStore } from 'components/Settings/Settings';

runtime.install({
  onUpdating() {
    console.log('SW Event:', 'onUpdating');
  },
  onUpdateReady() {
    console.log('SW Event:', 'onUpdateReady');
    SettingsStore.setUpdater(() => runtime.applyUpdate());
  },
  onUpdated() {
    console.log('SW Event:', 'onUpdated');
    // Reload the webpage to load into the new version
    location.reload();
  },
  onUpdateFailed() {
    console.log('SW Event:', 'onUpdateFailed');
  },
});
