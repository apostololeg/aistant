import { createRoot } from 'react-dom/client';

if (!isDEV) {
  import('pwa');
}

import App from './components/App/App';

const elem = document.getElementById('app-root') as HTMLElement;
const root = createRoot(elem);

root.render(<App />);
