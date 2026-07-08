(function() {
  try {
    var desc = Object.getOwnPropertyDescriptor(window, 'fetch');
    if (!desc) {
      desc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(window), 'fetch');
    }
    if (window.fetch && (!desc || !desc.set)) {
      var originalFetch = window.fetch;
      var currentFetch = originalFetch;
      Object.defineProperty(window, 'fetch', {
        get: function() { return currentFetch; },
        set: function(val) { return currentFetch = val; },
        configurable: true,
        enumerable: true
      });
    }
  } catch (e) {
    console.warn('Failed to define fetch setter in main.tsx:', e);
  }
})();

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
