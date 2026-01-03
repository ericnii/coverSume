import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-ssrdzou2sojskjtx.us.auth0.com"
      clientId="AWKGR7HPnoScQZmO3uzXqLfGEEUaXgks"
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
      useHistory={true}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);

