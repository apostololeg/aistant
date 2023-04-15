import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './components/App/App';

const elem = document.getElementById('app-root') as HTMLElement;
const root = createRoot(elem);

root.render(<App />);
