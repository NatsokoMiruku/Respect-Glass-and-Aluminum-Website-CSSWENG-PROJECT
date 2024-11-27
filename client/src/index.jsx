import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import App from './App';

import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="861793183828-srf1sa16u4uqquld93ca8lu55cvcekem.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);